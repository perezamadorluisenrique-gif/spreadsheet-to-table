# Changelog

The release workflow uses the section named after the version being released
as the release description, so every version needs one. `npm version <x.y.z>`
renames the `Unreleased` heading below to that version.

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
