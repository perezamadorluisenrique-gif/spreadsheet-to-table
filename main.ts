import { App, Editor, FuzzySuggestModal, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, normalizePath } from 'obsidian';
import type { SettingDefinitionItem } from 'obsidian';

import { readAnyDelimited, readDelimitedFile, spreadsheetRows, toCsv, toTsv } from './src/delimited.ts';
import type { Rows } from './src/delimited.ts';
import {
  DEFAULT_TABLE_OPTIONS,
  findTable,
  inCodeOrFrontmatter,
  placeBlock,
  tableRows,
  toMarkdownTable,
  unquote,
} from './src/markdown.ts';
import type { TableOptions } from './src/markdown.ts';
import { columnAt, readTable, sortBody, transpose, writeTable } from './src/transform.ts';
import type { SourceTable } from './src/transform.ts';

interface SpreadsheetToTableSettings extends TableOptions {
  /** Turn copied cells into a table on an ordinary paste. */
  convertOnPaste: boolean;
}

const DEFAULT_SETTINGS: SpreadsheetToTableSettings = { convertOnPaste: true, ...DEFAULT_TABLE_OPTIONS };

export default class SpreadsheetToTablePlugin extends Plugin {
  settings: SpreadsheetToTableSettings = { ...DEFAULT_SETTINGS };

  /**
   * Until when a paste counts as "paste as plain text". Ctrl/Cmd+Shift+V
   * fires the same paste event as Ctrl/Cmd+V, so the keydown just before it
   * is the only way to tell them apart.
   */
  private plainPasteUntil = 0;

  async onload() {
    await this.loadSettings();

    this.registerEvent(this.app.workspace.on('editor-paste', (evt, editor) => this.onPaste(evt, editor)));
    this.watchPlainPaste(window);
    this.registerEvent(this.app.workspace.on('window-open', (_popout, win) => this.watchPlainPaste(win)));

    this.addCommand({
      id: 'paste-as-table',
      name: 'Paste as table',
      icon: 'clipboard-paste',
      editorCallback: (editor) => {
        void this.pasteAsTable(editor);
      },
    });
    this.addCommand({
      id: 'convert-selection-to-table',
      name: 'Convert selection to table',
      icon: 'table',
      editorCheckCallback: (checking, editor) => {
        if (!editor.somethingSelected()) return false;
        if (!checking) this.convertSelection(editor);
        return true;
      },
    });
    this.addCommand({
      id: 'copy-table-for-spreadsheet',
      name: 'Copy table for a spreadsheet',
      icon: 'clipboard-copy',
      editorCheckCallback: (checking, editor) => {
        const rows = this.tableAtCursor(editor);
        if (!rows) return false;
        if (!checking) void this.copyForSpreadsheet(rows);
        return true;
      },
    });

    this.addCommand({
      id: 'insert-csv-file',
      name: 'Insert CSV file as table',
      icon: 'file-spreadsheet',
      editorCallback: (editor) => {
        const files = this.app.vault.getFiles().filter((file) => /^(csv|tsv)$/i.test(file.extension));
        if (files.length === 0) {
          new Notice('There are no .csv or .tsv files in this vault.');
          return;
        }
        if (!this.canPlaceTable(editor)) {
          new Notice('A table cannot go here: the cursor is in code, the properties or another table.');
          return;
        }
        new DelimitedFilePicker(this.app, files, (file) => void this.insertFile(editor, file)).open();
      },
    });
    this.addCommand({
      id: 'copy-table-as-csv',
      name: 'Copy table as CSV',
      icon: 'clipboard-list',
      editorCheckCallback: (checking, editor) => {
        const rows = this.tableAtCursor(editor);
        if (!rows) return false;
        if (!checking) void this.copyText(toCsv(rows), rows, 'Paste it wherever CSV is accepted.');
        return true;
      },
    });
    this.addCommand({
      id: 'save-table-as-csv',
      name: 'Save table as CSV file',
      icon: 'file-down',
      editorCheckCallback: (checking, editor, ctx) => {
        const rows = this.tableAtCursor(editor);
        if (!rows || !ctx.file) return false;
        if (!checking) void this.saveCsv(rows, ctx.file);
        return true;
      },
    });

    this.addCommand({
      id: 'sort-table-ascending',
      name: 'Sort table by this column, ascending',
      icon: 'arrow-down-az',
      editorCheckCallback: (checking, editor) =>
        this.reshape(checking, editor, (table, column) => ({ ...table, body: sortBody(table.body, column, false) }), 'Sorted'),
    });
    this.addCommand({
      id: 'sort-table-descending',
      name: 'Sort table by this column, descending',
      icon: 'arrow-up-za',
      editorCheckCallback: (checking, editor) =>
        this.reshape(checking, editor, (table, column) => ({ ...table, body: sortBody(table.body, column, true) }), 'Sorted'),
    });
    this.addCommand({
      id: 'transpose-table',
      name: 'Transpose table (swap rows and columns)',
      icon: 'arrow-down-up',
      editorCheckCallback: (checking, editor) => this.reshape(checking, editor, (table) => transpose(table), 'Transposed'),
    });

    this.addSettingTab(new SpreadsheetToTableSettingTab(this.app, this));
  }

  /**
   * Rewrites the table under the cursor in one edit, so one undo puts it
   * back. Its quote or callout markers and its indentation are kept.
   */
  private reshape(
    checking: boolean,
    editor: Editor,
    change: (table: SourceTable, column: number) => SourceTable,
    verb: string,
  ): boolean {
    const cursor = editor.getCursor();
    const raw = editor.getValue().split('\n');
    const lines = raw.map(unquote);
    const found = findTable(lines, cursor.line);
    if (!found || inCodeOrFrontmatter(lines.slice(0, found.start + 1).join('\n'))) return false;
    if (checking) return true;

    const markers = raw[found.start].slice(0, raw[found.start].length - lines[found.start].length);
    const indent = /^[ \t]*/.exec(lines[found.start])?.[0] ?? '';
    const cursorLine = lines[cursor.line];
    const column = columnAt(cursorLine, cursor.ch - (raw[cursor.line].length - cursorLine.length));
    const table = readTable(lines.slice(found.start, found.end + 1));
    const text = writeTable(change(table, column), this.settings.padColumns)
      .map((line) => markers + indent + line)
      .join('\n');

    const from = { line: found.start, ch: 0 };
    const to = { line: found.end, ch: raw[found.end].length };
    if (editor.getRange(from, to) === text) {
      new Notice('The table is already in that order.');
      return true;
    }
    editor.transaction({ changes: [{ from, to, text }] });
    new Notice(`${verb} ${count(table.body.length, 'row')}.`);
    return true;
  }

  private async insertFile(editor: Editor, file: TFile): Promise<void> {
    const rows = readDelimitedFile(await this.app.vault.read(file), file.extension);
    if (!rows) {
      new Notice(`${file.name} has no rows to make a table from.`);
      return;
    }
    this.insertTable(editor, rows);
    new Notice(`Inserted ${file.name}: ${count(rows.length, 'row')}.`);
  }

  /**
   * Writes the table to a `.csv` next to the note, named after it, without
   * overwriting anything already there.
   */
  private async saveCsv(rows: Rows, note: TFile): Promise<void> {
    const folder = note.parent && !note.parent.isRoot() ? note.parent.path + '/' : '';
    let path = normalizePath(`${folder}${note.basename}.csv`);
    for (let n = 2; this.app.vault.getAbstractFileByPath(path); n++) {
      path = normalizePath(`${folder}${note.basename} ${n}.csv`);
    }
    await this.app.vault.create(path, toCsv(rows));
    new Notice(`Saved ${count(rows.length, 'row')} to ${path}.`);
  }

  async loadSettings() {
    // Whatever is on disk was written by some version of this plugin, or
    // edited by hand, so it is merged over the defaults rather than trusted.
    const stored = (await this.loadData()) as Partial<SpreadsheetToTableSettings> | null;
    this.settings = { ...DEFAULT_SETTINGS, ...stored };
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  /** Notes a Ctrl/Cmd+Shift+V in this window, before the paste it starts. */
  private watchPlainPaste(win: Window): void {
    this.registerDomEvent(
      win,
      'keydown',
      (evt) => {
        if ((evt.ctrlKey || evt.metaKey) && evt.shiftKey && evt.key.toLowerCase() === 'v') {
          this.plainPasteUntil = Date.now() + 1000;
        }
      },
      { capture: true },
    );
  }

  /**
   * An ordinary paste. Only cells copied from a spreadsheet are taken over;
   * anything else, and anything pasted into code or the frontmatter, is left
   * to Obsidian exactly as before.
   */
  private onPaste(evt: ClipboardEvent, editor: Editor): void {
    if (!this.settings.convertOnPaste || evt.defaultPrevented) return;
    if (Date.now() < this.plainPasteUntil) {
      this.plainPasteUntil = 0;
      return;
    }
    if (editor.listSelections().length !== 1) return;
    const rows = spreadsheetRows(evt.clipboardData?.getData('text/plain') ?? '');
    if (!rows || !this.canPlaceTable(editor)) return;

    evt.preventDefault();
    this.insertTable(editor, rows);
  }

  /**
   * Reads the clipboard and inserts it as a table whatever it holds: tabs,
   * commas or semicolons between cells, or one cell per line.
   */
  private async pasteAsTable(editor: Editor): Promise<void> {
    let text = '';
    try {
      text = await navigator.clipboard.readText();
    } catch {
      // Phones and tablets often refuse a plugin the clipboard, or only
      // allow it after a tap the command palette has already used up. A
      // paste the user makes themselves always works, so ask for one.
    }
    if (text === '') {
      new PasteBox(this.app, (pasted) => this.insertDelimited(editor, pasted, 'The pasted text')).open();
      return;
    }
    this.insertDelimited(editor, text, 'The clipboard');
  }

  private insertDelimited(editor: Editor, text: string, source: string): void {
    const read = readAnyDelimited(text);
    if (!read) {
      new Notice(`${source} has no text to make a table from.`);
      return;
    }
    this.insertTable(editor, read.rows);
  }

  private convertSelection(editor: Editor): void {
    const read = readAnyDelimited(editor.getSelection());
    if (!read) {
      new Notice('The selection has no text to make a table from.');
      return;
    }
    this.insertTable(editor, read.rows);
  }

  /** Whether the cursor is somewhere a table can go. */
  private canPlaceTable(editor: Editor): boolean {
    const from = editor.getCursor('from');
    if (inCodeOrFrontmatter(editor.getRange({ line: 0, ch: 0 }, from))) return false;
    // Pasting into a table that is already there: the cells belong in it, and
    // a second table inside the first would break both.
    return findTable(this.lines(editor), from.line) === null;
  }

  /**
   * Replaces the selection with the table, as one edit, so one undo takes it
   * out again.
   */
  private insertTable(editor: Editor, rows: Rows): void {
    const from = editor.getCursor('from');
    const to = editor.getCursor('to');
    const lastLine = editor.lastLine();
    const text = placeBlock(
      toMarkdownTable(rows, this.settings),
      editor.getLine(from.line).slice(0, from.ch),
      editor.getLine(to.line).slice(to.ch),
      from.line > 0 ? editor.getLine(from.line - 1) : null,
      to.line < lastLine ? editor.getLine(to.line + 1) : null,
    );
    editor.replaceSelection(text);
  }

  /** The note's lines, with quote and callout markers set aside, so a table in a callout is found too. */
  private lines(editor: Editor): string[] {
    return editor.getValue().split('\n').map(unquote);
  }

  private tableAtCursor(editor: Editor): Rows | null {
    const cursor = editor.getCursor();
    const lines = this.lines(editor);
    const table = findTable(lines, cursor.line);
    if (!table) return null;
    if (inCodeOrFrontmatter(lines.slice(0, table.start + 1).join('\n'))) return null;
    return tableRows(lines.slice(table.start, table.end + 1));
  }

  private async copyForSpreadsheet(rows: Rows): Promise<void> {
    await this.copyText(toTsv(rows), rows, 'Paste into any spreadsheet.');
  }

  private async copyText(text: string, rows: Rows, hint: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Where the clipboard is off limits, as on some phones, hand the text
      // over selected so the system's own Copy takes it.
      new CopyBox(this.app, text).open();
      return;
    }
    const columns = Math.max(...rows.map((row) => row.length));
    new Notice(`Copied ${count(rows.length, 'row')} of ${count(columns, 'column')}. ${hint}`);
  }
}

/**
 * A box to paste into, for when the clipboard cannot be read directly.
 * The paste lands here rather than in the note, and whatever came with it
 * is made into a table as soon as it arrives.
 */
class PasteBox extends Modal {
  constructor(app: App, private readonly onText: (text: string) => void) {
    super(app);
  }

  onOpen(): void {
    this.titleEl.setText('Paste as table');
    this.contentEl.createEl('p', {
      text: 'Paste your cells into the box below. On a phone or tablet, press and hold in the box, then choose Paste.',
    });
    const box = this.contentEl.createEl('textarea');
    box.rows = 6;
    box.addEventListener('paste', (evt) => {
      const text = evt.clipboardData?.getData('text/plain') ?? '';
      if (text === '') return;
      evt.preventDefault();
      this.finish(text);
    });
    new Setting(this.contentEl).addButton((button) =>
      button
        .setButtonText('Make table')
        .setCta()
        .onClick(() => this.finish(box.value)),
    );
    box.focus();
  }

  private finish(text: string): void {
    this.close();
    this.onText(text);
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

/** The vault's `.csv` and `.tsv` files, most recently changed first. */
class DelimitedFilePicker extends FuzzySuggestModal<TFile> {
  constructor(
    app: App,
    private readonly files: TFile[],
    private readonly onPick: (file: TFile) => void,
  ) {
    super(app);
    this.setPlaceholder('Choose a CSV or TSV file to insert as a table');
  }

  getItems(): TFile[] {
    return [...this.files].sort((a, b) => b.stat.mtime - a.stat.mtime);
  }

  getItemText(file: TFile): string {
    return file.path;
  }

  onChooseItem(file: TFile): void {
    this.onPick(file);
  }
}

/** The table as text, selected, for when it cannot be put on the clipboard. */
class CopyBox extends Modal {
  constructor(app: App, private readonly text: string) {
    super(app);
  }

  onOpen(): void {
    this.titleEl.setText('Copy table for a spreadsheet');
    this.contentEl.createEl('p', {
      text: 'The clipboard could not be written to. The table is selected below: copy it, then paste it into any spreadsheet.',
    });
    const box = this.contentEl.createEl('textarea');
    box.rows = 6;
    box.readOnly = true;
    box.value = this.text;
    box.focus();
    box.select();
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

function count(n: number, noun: string): string {
  return `${n} ${noun}${n === 1 ? '' : 's'}`;
}

type SettingKey = keyof SpreadsheetToTableSettings;

interface SettingRow {
  key: SettingKey;
  name: string;
  desc: string;
}

/**
 * Every setting, described once. Both renderings below are built from this
 * table, so the declarative one and the pre-1.13 fallback cannot drift.
 */
const SETTINGS: SettingRow[] = [
  {
    key: 'convertOnPaste',
    name: 'Convert on paste',
    desc:
      'Turn cells copied from a spreadsheet into a table when you paste them normally. ' +
      'When this is off, use the "Paste as table" command instead.',
  },
  {
    key: 'firstRowIsHeader',
    name: 'First row is the header',
    desc: 'Use the first copied row as the table header. When this is off, the header row is left empty.',
  },
  {
    key: 'alignNumbers',
    name: 'Right-align numbers',
    desc: 'Right-align a column when every cell in it below the header is a number.',
  },
  {
    key: 'padColumns',
    name: 'Line up columns',
    desc: 'Pad the cells with spaces so the columns line up in the editor. When this is off, tables are compact.',
  },
];

class SpreadsheetToTableSettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: SpreadsheetToTablePlugin) {
    super(app, plugin);
  }

  /**
   * The settings, described rather than drawn, so Obsidian 1.13 and later
   * renders them itself and finds them in the settings search. Older
   * versions do not know this method and call `display()` instead.
   */
  getSettingDefinitions(): SettingDefinitionItem[] {
    return SETTINGS.map((row) => ({
      name: row.name,
      desc: row.desc,
      control: { type: 'toggle' as const, key: row.key, defaultValue: DEFAULT_SETTINGS[row.key] },
    }));
  }

  getControlValue(key: string): unknown {
    return this.plugin.settings[key as SettingKey];
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    Object.assign(this.plugin.settings, { [key]: value === true });
    await this.plugin.saveSettings();
  }

  /** The pre-1.13 rendering; a current Obsidian never calls it. */
  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    for (const row of SETTINGS) {
      new Setting(containerEl)
        .setName(row.name)
        .setDesc(row.desc)
        .addToggle((toggle) => {
          toggle.setValue(this.plugin.settings[row.key]).onChange((value) => this.setControlValue(row.key, value));
        });
    }
  }
}
