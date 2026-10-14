// Markdown tables: writing rows as one, reading one back into rows, and
// working out where one may go in a note.

import type { Rows } from './delimited.ts';
import type { Align } from './transform.ts';

export interface TableOptions {
  /** The first row is the header. Otherwise the header row is left empty. */
  firstRowIsHeader: boolean;
  /** Right-align a column whose every body cell is a number. */
  alignNumbers: boolean;
  /** Pad cells so the columns line up in the source. */
  padColumns: boolean;
  /** Alignment of a column that is not right-aligned for being numbers. */
  defaultAlign: Align;
}

export const DEFAULT_TABLE_OPTIONS: TableOptions = {
  firstRowIsHeader: true,
  alignNumbers: true,
  padColumns: true,
  defaultAlign: 'none',
};

/**
 * A number as spreadsheets show one: an optional sign or accounting
 * parentheses, an optional currency symbol on either side, thousands grouped
 * by commas, dots, spaces or apostrophes, decimals, an exponent, a percent.
 */
const NUMBER =
  /^[(]?[-+\u2212]?[$€£¥₹]?\s?(?:\d{1,3}(?:[,.\u00a0\u202f '’]\d{3})+|\d+)(?:[.,]\d+)?(?:[eE][-+]?\d+)?\s?(?:%|[$€£¥₹])?[)]?$/;

export function isNumber(cell: string): boolean {
  return NUMBER.test(cell.trim());
}

/**
 * One cell as Markdown table source. A pipe would end the cell, so it is
 * escaped; a line break would end the row, so it becomes `<br>`, which
 * Obsidian renders as a line break inside the cell.
 */
export function escapeCell(cell: string): string {
  return escapeLoneBackticks(
    cell
      .trim()
      .replace(/\|/g, '\\|')
      .replace(/\r\n|\r|\n/g, '<br>'),
  );
}

/**
 * A backtick in a cell that opens no code span of its own (`it`s`) is
 * written as `\``, which shows as a backtick. Left bare, it would pair with
 * a backtick in a later cell, and everything between, pipes included, would
 * read as one cell of code.
 */
function escapeLoneBackticks(cell: string): string {
  let out = '';
  let i = 0;
  while (i < cell.length) {
    if (cell[i] !== '`') {
      out += cell[i++];
      continue;
    }
    let run = 1;
    while (cell[i + run] === '`') run++;
    const close = closingRun(cell, i + run, run);
    if (close === -1) {
      out += '\\`'.repeat(run);
      i += run;
    } else {
      out += cell.slice(i, close + run);
      i = close + run;
    }
  }
  return out;
}

/** Where the next run of exactly `run` backticks starts, at `from` or later, or -1. */
function closingRun(text: string, from: number, run: number): number {
  const runs = /`+/g;
  runs.lastIndex = from;
  for (let m = runs.exec(text); m; m = runs.exec(text)) if (m[0].length === run) return m.index;
  return -1;
}

/** Width as the eye counts it in a monospaced editor, near enough: code points. */
function width(text: string): number {
  return Array.from(text).length;
}

/** Writes rows as a Markdown table, without a trailing line break. */
export function toMarkdownTable(input: Rows, options: TableOptions = DEFAULT_TABLE_OPTIONS): string {
  const columns = Math.max(1, ...input.map((row) => row.length));
  const rows = input.map((row) => {
    const cells = row.map(escapeCell);
    while (cells.length < columns) cells.push('');
    return cells;
  });

  const header = options.firstRowIsHeader && rows.length > 0 ? rows[0] : new Array<string>(columns).fill('');
  const body = options.firstRowIsHeader ? rows.slice(1) : rows;

  const align: Align[] = [];
  for (let c = 0; c < columns; c++) {
    const filled = body.map((row) => row[c]).filter((cell) => cell !== '');
    const numbers = options.alignNumbers && filled.length > 0 && filled.every(isNumber);
    align.push(numbers ? 'right' : (options.defaultAlign ?? 'none'));
  }
  const right = align.map((a) => a === 'right');

  // Three dashes is the least a delimiter cell can have and still read as one
  // in every Markdown flavour, so no column is narrower than that.
  const widths: number[] = [];
  for (let c = 0; c < columns; c++) {
    widths.push(options.padColumns ? Math.max(3, ...[header, ...body].map((row) => width(row[c]))) : 3);
  }

  const line = (cells: string[]) =>
    '| ' +
    cells
      .map((cell, c) => {
        if (!options.padColumns) return cell;
        const pad = ' '.repeat(Math.max(0, widths[c] - width(cell)));
        return right[c] ? pad + cell : cell + pad;
      })
      .join(' | ') +
    ' |';
  const dashes = (w: number, a: Align) =>
    a === 'right' ? '-'.repeat(w - 1) + ':' : a === 'left' ? ':' + '-'.repeat(w - 1) : a === 'center' ? ':' + '-'.repeat(w - 2) + ':' : '-'.repeat(w);
  const delimiter = '| ' + widths.map((w, c) => dashes(w, align[c])).join(' | ') + ' |';

  return [line(header), delimiter, ...body.map(line)].join('\n');
}

const DELIMITER_ROW = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;

/**
 * Whether a run of `run` backticks closes later in `text`, from `from` on:
 * a run of exactly that length. One that never closes is literal backticks,
 * not the start of inline code, so the pipes after it still split cells.
 */
export function codeSpanCloses(text: string, from: number, run: number): boolean {
  return closingRun(text, from, run) !== -1;
}

/**
 * Splits one table row into cells. A pipe ends a cell unless it is escaped
 * with a backslash or sits inside inline code.
 */
export function splitRow(line: string): string[] {
  let text = line.trim();
  if (text.startsWith('|')) text = text.slice(1);
  const cells: string[] = [];
  let cell = '';
  let code = 0; // length of the backtick run that opened the code span, or 0
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '\\' && (text[i + 1] === '|' || (text[i + 1] === '`' && code === 0))) {
      cell += ch + text[i + 1];
      i++;
    } else if (ch === '`') {
      let run = 1;
      while (text[i + run] === '`') run++;
      if (code === 0) code = codeSpanCloses(text, i + run, run) ? run : 0;
      else if (run === code) code = 0;
      cell += '`'.repeat(run);
      i += run - 1;
    } else if (ch === '|' && code === 0) {
      cells.push(cell);
      cell = '';
    } else {
      cell += ch;
    }
  }
  // A closing pipe leaves nothing after it; anything else is a last cell.
  if (cell.trim() !== '' || !/\|\s*$/.test(text)) cells.push(cell);
  return cells;
}

/** A table cell's source back to the text it shows: pipes unescaped, `<br>` as line breaks. */
export function unescapeCell(cell: string): string {
  return unescapeBackticks(
    cell
      .trim()
      .replace(/\\\|/g, '|')
      .replace(/<br\s*\/?>/gi, '\n'),
  );
}

/** `\`` back to a backtick, outside code spans, where a backslash is just a backslash. */
function unescapeBackticks(cell: string): string {
  let out = '';
  let i = 0;
  while (i < cell.length) {
    if (cell[i] === '\\' && cell[i + 1] === '`') {
      out += '`';
      i += 2;
    } else if (cell[i] === '`') {
      let run = 1;
      while (cell[i + run] === '`') run++;
      const close = closingRun(cell, i + run, run);
      const end = close === -1 ? i + run : close + run;
      out += cell.slice(i, end);
      i = end;
    } else {
      out += cell[i++];
    }
  }
  return out;
}

/**
 * The lines of the table that line `at` belongs to, or null when it is not
 * in one. A table is a run of non-blank lines holding pipes whose second
 * line is the `| --- |` delimiter row.
 */
export function findTable(lines: string[], at: number): { start: number; end: number } | null {
  const isRow = (i: number) => i >= 0 && i < lines.length && lines[i].trim() !== '' && lines[i].includes('|');
  if (!isRow(at)) return null;
  let start = at;
  while (isRow(start - 1)) start--;
  let end = at;
  while (isRow(end + 1)) end++;
  // The run may begin with a line that only happens to hold a pipe; the table
  // starts at the header just above the first delimiter row.
  for (let h = start; h < end; h++) {
    if (DELIMITER_ROW.test(lines[h + 1]) && splitRow(lines[h]).length > 0) {
      if (at < h) return null;
      return { start: h, end };
    }
  }
  return null;
}

/** A Markdown table's rows, the header first, without the delimiter row. */
export function tableRows(lines: string[]): string[][] {
  return lines.filter((_, i) => i !== 1).map((line) => splitRow(line).map(unescapeCell));
}

/**
 * Whether a position is inside a fenced code block (in a callout or a list
 * item too) or the frontmatter, where
 * a paste has to stay exactly as copied. `before` is the note's text up to
 * the position.
 */
export function inCodeOrFrontmatter(before: string): boolean {
  const lines = before.split('\n');
  // Frontmatter: the note opens with `---` and that block is not closed yet.
  if (lines.length > 1 && /^---\s*$/.test(lines[0])) {
    const closed = lines.slice(1, -1).some((line) => /^(---|\.\.\.)\s*$/.test(line));
    if (!closed) return true;
  }
  let fence: { char: string; length: number; depth: number } | null = null;
  const depth = (line: string) => (/^(?:[ \t]*>[ \t]?)*/.exec(line)?.[0] ?? '').split('>').length - 1;
  // The line holding the position is left out: an opening fence on it is
  // text being typed after, and a closing one means the position is past it.
  // A fence may sit in a quote or callout (`> ````) or under a list item; a
  // block opened in a quote ends with it, closed or not.
  for (const line of lines.slice(0, -1)) {
    if (fence && depth(line) < fence.depth) fence = null;
    const m = /^(?:[ \t]*>[ \t]?)*[ \t]*(?:(?:[-*+]|\d{1,9}[.)])[ \t]+)?(`{3,}|~{3,})/.exec(line);
    if (!m) continue;
    const char = m[1][0];
    if (!fence) {
      if (char === '`' && line.slice(m[0].length).includes('`')) continue;
      fence = { char, length: m[1].length, depth: depth(line) };
    } else if (
      char === fence.char &&
      m[1].length >= fence.length &&
      line.slice(m[0].length).trim() === '' &&
      depth(line) === fence.depth
    ) {
      fence = null;
    }
  }
  if (fence && depth(lines[lines.length - 1]) < fence.depth) return false;
  return fence !== null;
}

/**
 * Quote or callout markers, then indentation, then a list marker, at the
 * start of a line.
 */
const CONTAINER = /^((?:[ \t]*>[ \t]?)*)([ \t]*)((?:[-*+]|\d{1,9}[.)])(?:[ \t]+|$))?/;

/**
 * What a line's content sits inside: the quote or callout markers every
 * line of it must repeat, and the indentation that keeps a line in the
 * same list item. `lead` is how long the markers are on this very line, and
 * `listItem` says whether they end in a list marker.
 */
export function containerOf(line: string): { lead: number; prefix: string; listItem: boolean } {
  const m = CONTAINER.exec(line) as RegExpExecArray;
  const marker = m[3] ?? '';
  return { lead: m[0].length, prefix: m[1] + m[2] + ' '.repeat(marker.length), listItem: marker !== '' };
}

/** A line without its quote or callout markers, `> > `. */
export function unquote(line: string): string {
  return line.replace(/^(?:[ \t]*>[ \t]?)+/, '');
}

/** A line with no content of its own once its quote markers are set aside. */
function isBlank(line: string | null): boolean {
  if (line === null) return true;
  return line.replace(/^(?:[ \t]*>)*/, '').trim() === '';
}

/** A callout's title line, `> [!note] Title`, which a table may follow directly. */
function isCalloutTitle(line: string | null): boolean {
  return line !== null && /^(?:[ \t]*>)+[ \t]*\[![^\]]+\]/.test(line);
}

/**
 * The text to insert so a table lands as a block of its own: on its own
 * lines, with a blank line between it and any text around it, since a
 * Markdown table does not start in the middle of a paragraph.
 *
 * Inside a quote or a callout, every line repeats the `>` markers, so the
 * table stays inside it; in a list item, every line is indented to the
 * item's text, so the table stays in the item.
 *
 * `before` and `after` are the text on the cursor's line either side of it;
 * `lineAbove` and `lineBelow` are the neighbouring lines, or null at the
 * start or end of the note.
 */
export function placeBlock(
  table: string,
  before: string,
  after: string,
  lineAbove: string | null,
  lineBelow: string | null,
): string {
  // Only the text before the cursor decides: the table goes there.
  const { lead: markers, prefix, listItem } = containerOf(before);
  const blank = prefix.replace(/[ \t]+$/, '');
  const newLine = '\n' + prefix;
  const text = before.slice(markers);

  let lead = '';
  if (text.trim() !== '') lead = '\n' + blank + newLine;
  // Straight after an empty list marker, `- `, the table is the item's
  // first block and starts on the marker's line.
  else if (!listItem && !isBlank(lineAbove) && !isCalloutTitle(lineAbove)) lead = newLine;

  let tail = '';
  if (after.trim() !== '') tail = '\n' + blank + newLine;
  else if (!isBlank(lineBelow)) tail = '\n' + blank;

  return lead + table.split('\n').join(newLine) + tail;
}
