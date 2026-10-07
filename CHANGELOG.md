# Changelog

The release workflow uses the section named after the version being released
as the release description, so every version needs one. `npm version <x.y.z>`
renames the `Unreleased` heading below to that version.

## 0.4.0

- **Copy table as rich text**: copies the table under the cursor, or the one in
  your selection, as a real HTML table plus tab-separated text, so it pastes as
  a table in Google Docs, Word or an email. Bold, italic, code and links are
  kept, the header row is header cells, and column alignment carries over.
- **Row and column commands**: insert row above/below, delete, move up/down;
  insert column left/right, delete, move left/right; set column alignment.
  One undo each, the cursor stays in a sensible cell, and the header can't be
  deleted or moved. They are also in the editor's right-click menu and in a
  **Table tools** list for the phone.
- **Default column alignment** setting for converted tables.
- **Convert JSON array to table** for a selected array of objects.
- Needs Obsidian 0.16.2 or later (was 0.15.3) for menu icons.

## 0.3.0

- **Sort a table by a column**: *Sort table by this column, ascending* and
  *descending* sort the rows by the column under the cursor. Numbers sort as
  numbers, whatever their format, text sorts naturally, empty cells go last,
  and rows that tie keep their order.
- **Transpose a table**: swaps its rows and columns.
- Both keep the table inside its callout, quote or list item, keep each
  column's alignment where it still applies, and undo in one step.

## 0.2.0

- **Insert CSV file as table**: pick a `.csv` or `.tsv` file in the vault and
  it is inserted as a table at the cursor. Comma, semicolon and tab
  separated files are recognised, and a byte order mark is ignored.
- **Copy table as CSV** and **Save table as CSV file**: the table under the
  cursor as comma-separated text (RFC 4180 quoting), on the clipboard or in
  a `.csv` next to the note.

## 0.1.2

- A table pasted inside a callout or a quote stays inside it. Every line now
  starts with the `>` markers; before, the table landed below the callout
  and cut it in two.
- A table pasted in a list item is indented to the item, so the list goes on
  after it instead of restarting.
- "Copy table for a spreadsheet" also finds a table inside a callout.

## 0.1.1

- **Paste as table** works on phones and tablets. Where the app is not
  allowed to read the clipboard, as can happen on Android and iOS, it now
  opens a box to paste into instead of giving up with "Could not read the
  clipboard". The paste is made into a table as soon as it lands.
- **Copy table for a spreadsheet** no longer stops at "Could not write to
  the clipboard": it shows the table selected, ready for the system's own
  Copy.
- Every command has an icon, so it shows what it does instead of a question
  mark when added to the mobile toolbar.

## 0.1.0

First release.

- **Paste cells from a spreadsheet** — Excel, Google Sheets, Numbers,
  LibreOffice Calc — with an ordinary paste, and get a Markdown table whose
  header is the first copied row.
- Pipes inside cells are escaped and line breaks inside cells become `<br>`,
  so the table never breaks apart.
- Columns of numbers are right-aligned, and columns are padded so they line
  up in the editor. Both can be switched off.
- One undo takes the table out again. **Ctrl/Cmd+Shift+V** still pastes the
  plain text, and nothing is converted inside code blocks, the frontmatter or
  an existing table.
- **Paste as table** reads the clipboard as tab-, comma- or
  semicolon-separated text, or one cell per line.
- **Convert selection to table** does the same with selected text, such as a
  block of CSV.
- **Copy table for a spreadsheet** copies the table under the cursor as
  tab-separated text that pastes back into separate cells.
