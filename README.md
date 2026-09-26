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

## License

[MIT](LICENSE)
