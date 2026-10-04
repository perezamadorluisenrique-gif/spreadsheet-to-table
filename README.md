# Spreadsheet to Table

Copy cells in Excel, Google Sheets, Numbers or LibreOffice Calc, paste them
into a note, and get a Markdown table, **with the first row as its header**.

Copied from the spreadsheet (a tab between cells):

```text
Name    Qty   Price
Apple   3     1.20
Pear    10    0.5
```

Pasted into the note:

```markdown
| Name  | Qty | Price |
| ----- | --: | ----: |
| Apple |   3 |  1.20 |
| Pear  |  10 |   0.5 |
```

## Why not just paste?

Obsidian already turns a pasted spreadsheet selection into a table, but the
table it makes has an **empty header row**, with your real header pushed down
into the body. Text that only has tabs between the cells, from a terminal, a
CSV file or a chat window, is not converted at all. Spreadsheet to Table
handles both, and:

- escapes a `|` inside a cell, which would otherwise split it in two;
- keeps a line break inside a cell as `<br>`, instead of breaking the row;
- right-aligns columns of numbers — `1,234.50`, `12%`, `$40`, `(7)` — and lines
  the columns up in the editor;
- keeps the table inside the callout, quote or list item you paste it into,
  repeating the `>` on every line or indenting it to the item.

## Commands

| Command | What it does |
|---|---|
| Paste as table | Reads the clipboard as a table whatever separates the cells: tabs, commas or semicolons, or one cell per line. |
| Convert selection to table | The same, for text already in the note, such as a pasted block of CSV. |
| Copy table for a spreadsheet | Copies the table under the cursor as tab-separated text. Paste it into any spreadsheet and each cell lands in its own cell. |
| Insert CSV file as table | Picks a `.csv` or `.tsv` file in your vault and inserts it as a table at the cursor. Files separated by semicolons, as European spreadsheets save them, work too. |
| Copy table as CSV | Copies the table under the cursor as comma-separated text, quoted where a cell needs it. |
| Save table as CSV file | Writes the table under the cursor to a `.csv` file next to the note, named after it. Nothing already there is overwritten. |
| Sort table by this column, ascending / descending | Sorts the rows of the table under the cursor by the column the cursor is in. Numbers sort as numbers (`1,234.50`, `12%`, `$40`, `(7)`), text sorts naturally (`item 9` before `item 10`, case aside), and empty cells go last. The header stays on top. |
| Transpose table (swap rows and columns) | The first column becomes the header row, and each row a column. |

None has a hotkey by default; assign one in **Settings → Hotkeys**.

## When it leaves a paste alone

An ordinary paste is only converted when it clearly came from a spreadsheet:
at least two rows and two columns, a tab between cells, the same number of
cells on every row. Everything else pastes exactly as before. It also never
converts:

- with **Ctrl/Cmd+Shift+V**, which pastes the plain text as usual;
- inside a code block, inside the frontmatter, or inside an existing table;
- text indented with tabs, such as code, where the first column is empty.

A converted paste is one edit, so a single **undo** takes the table out again.

## Settings

| Setting | Default | |
|---|---|---|
| Convert on paste | On | Off leaves ordinary pastes to Obsidian; use **Paste as table** instead. |
| First row is the header | On | Off leaves the header row empty, as Obsidian does. |
| Right-align numbers | On | A column is right-aligned when every cell below the header is a number. |
| Line up columns | On | Off writes compact tables with no padding. |

## Coming from Excel to Markdown Table

This plugin does the same job and adds CSV and semicolon input, converting a
selection, and copying a table back out to a spreadsheet. Pastes that carry no
HTML, such as tab-separated text from a terminal, are converted too. Disable
the old plugin before enabling this one, or both will try to handle the same
paste.

## Installing

Once the plugin is in the community directory: **Settings → Community plugins →
Browse**, search for "Spreadsheet to Table", then install and enable it.

Until then, download `main.js` and `manifest.json` from the latest
[release](https://github.com/perezamadorluisenrique-gif/spreadsheet-to-table/releases)
into `<vault>/.obsidian/plugins/spreadsheet-to-table/`, reload Obsidian and
enable the plugin.

## Privacy

Everything happens in the editor. The plugin makes no network requests and
reads the clipboard only when you paste or run **Paste as table**.

## More plugins by Siulved54

| Plugin | What it does | Source |
| --- | --- | --- |
| [Shared Blocks](https://obsidian.md/plugins?id=shared-blocks) | Write a block of text once and reuse it in any note. Edit the source and every reference re-renders live. | [shared-blocks](https://github.com/perezamadorluisenrique-gif/shared-blocks) |
| [Text Case and Cleanup](https://obsidian.md/plugins?id=text-format) | Change case, make camelCase or slugs, sort lines and remove duplicates, and repair text pasted out of a PDF, without touching code or URLs. | [text-format](https://github.com/perezamadorluisenrique-gif/text-format) |
| [Typography as You Type](https://obsidian.md/plugins?id=typography-as-you-type) | Curly quotes, dashes and ellipses as you type, kept out of code and maths, with Backspace to take one back. | [smart-typography-plugin](https://github.com/perezamadorluisenrique-gif/smart-typography-plugin) |
| [Section Numbering](https://obsidian.md/plugins?id=section-numbering) | Number headings as an outline (1, 1.1, 1.2) and keep every link to them working when they renumber. | [section-numbering](https://github.com/perezamadorluisenrique-gif/section-numbering) |
| [Hybrid Line Numbers](https://obsidian.md/plugins?id=hybrid-line-numbers) | Relative and hybrid line numbers for Vim-style jumps, where a folded section counts as one line. | [hybrid-line-numbers](https://github.com/perezamadorluisenrique-gif/hybrid-line-numbers) |
| [List Item Callouts](https://obsidian.md/plugins?id=list-item-callouts) | Colour a single list item as a callout by starting it with a character such as `&`, `!` or `?`. | [list-item-callouts](https://github.com/perezamadorluisenrique-gif/list-item-callouts) |
| [Folder Counts](https://obsidian.md/plugins?id=folder-counts) | See how many notes or files each folder holds, right in the file explorer, with a vault total and folder exclusions. | [folder-counts](https://github.com/perezamadorluisenrique-gif/folder-counts) |
| [Note Reading Time](https://obsidian.md/plugins?id=note-reading-time) | Reading time of the current note or your selection in the status bar, optionally saved to a property. | [note-reading-time](https://github.com/perezamadorluisenrique-gif/note-reading-time) |
| [Task Rollover](https://obsidian.md/plugins?id=task-rollover) | Roll unfinished tasks from your last daily note into today's when it is created, with a real undo. | [task-rollover](https://github.com/perezamadorluisenrique-gif/task-rollover) |
| [Zoom Into Section](https://obsidian.md/plugins?id=zoom-into-section) | Zoom into a heading or list item to see only it and its contents, with a breadcrumb bar to climb back out. | [zoom-into-section](https://github.com/perezamadorluisenrique-gif/zoom-into-section) |
| [Link Title on Paste](https://obsidian.md/plugins?id=link-title-on-paste) | Paste a web address and get a Markdown link with the page's title, fetched in the background and undone in one step. | [link-title-on-paste](https://github.com/perezamadorluisenrique-gif/link-title-on-paste) |
| [Update Radar](https://obsidian.md/plugins?id=update-radar) | Checks your installed community plugins for updates in the background, shows what changed, and flags the ones that look abandoned. | [community-update-checker](https://github.com/perezamadorluisenrique-gif/community-update-checker) |
| [Dataview to Bases](https://obsidian.md/plugins?id=dataview-to-bases) | Convert Dataview queries into Bases blocks, and see which queries in your vault can be converted. | [dataview-to-bases](https://github.com/perezamadorluisenrique-gif/dataview-to-bases) |

All of them are in the community directory: Settings -> Community plugins ->
Browse, then search for the name.

## License

[MIT](LICENSE)
