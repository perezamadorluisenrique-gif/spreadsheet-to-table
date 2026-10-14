// The source of the message keys and the fallback language. Every other file in
// this folder must have exactly these keys and the same {placeholders}; the
// build fails on a missing or extra key and `tests/i18n.test.ts` checks the rest.
// What the plugin writes into notes (the Markdown tables, CSV and HTML) is not
// here and is never translated.
const en = {
  // Commands
  'command.pasteAsTable': 'Paste as table',
  'command.convertSelection': 'Convert selection to table',
  'command.copyForSpreadsheet': 'Copy table for a spreadsheet',
  'command.insertCsvFile': 'Insert CSV file as table',
  'command.copyAsCsv': 'Copy table as CSV',
  'command.saveAsCsv': 'Save table as CSV file',
  'command.sortAscending': 'Sort table by this column, ascending',
  'command.sortDescending': 'Sort table by this column, descending',
  'command.transpose': 'Transpose table (swap rows and columns)',
  'command.copyAsRichText': 'Copy table as rich text',
  'command.convertJson': 'Convert JSON array to table',
  'command.tableTools': 'Table tools',

  // Table actions: the command, and the shorter title in the context menu
  'action.insertRowAbove': 'Insert row above',
  'action.insertRowBelow': 'Insert row below',
  'action.deleteRow': 'Delete row',
  'action.moveRowUp': 'Move row up',
  'action.moveRowDown': 'Move row down',
  'action.insertColumnLeft': 'Insert column left',
  'action.insertColumnRight': 'Insert column right',
  'action.deleteColumn': 'Delete column',
  'action.moveColumnLeft': 'Move column left',
  'action.moveColumnRight': 'Move column right',
  'action.alignLeft': 'Align column left',
  'action.alignCenter': 'Align column center',
  'action.alignRight': 'Align column right',
  'action.alignNone': 'Clear column alignment',
  'menu.insertRowBelow': 'Table: insert row below',
  'menu.deleteRow': 'Table: delete row',
  'menu.insertColumnRight': 'Table: insert column right',
  'menu.deleteColumn': 'Table: delete column',
  'menu.moreTools': 'Table: more tools...',

  // Counts, used inside the notices below
  'count.rows.one': '1 row',
  'count.rows.other': '{count} rows',
  'count.columns.one': '1 column',
  'count.columns.other': '{count} columns',

  // Notices
  'notice.noDelimitedFiles': 'There are no .csv or .tsv files in this vault.',
  'notice.cannotPlaceTable': 'A table cannot go here: the caret is in code, the properties or another table.',
  'notice.clipboardEmpty': 'The clipboard has no text to make a table from.',
  'notice.pastedEmpty': 'The pasted text has no text to make a table from.',
  'notice.selectionEmpty': 'The selection has no text to make a table from.',
  'notice.fileEmpty': '{file} has no rows to make a table from.',
  'notice.inserted': 'Inserted {file}: {rows}.',
  'notice.saved': 'Saved {rows} to {path}.',
  'notice.copied': 'Copied {rows} of {columns}. {hint}',
  'notice.copiedRich': 'Copied {rows} as a table. Paste it into Docs, Word or an email.',
  'notice.sorted': 'Sorted {rows}.',
  'notice.transposed': 'Transposed {rows}.',
  'notice.alreadyInOrder': 'The table is already in that order.',
  'hint.spreadsheet': 'Paste into any spreadsheet.',
  'hint.csv': 'Paste it wherever CSV is accepted.',
  'hint.richFallback': 'Rich text is not available here, so it was copied as plain text.',

  // Why a table action cannot run
  'error.rowAboveHeader': 'A row cannot go above the header.',
  'error.deleteHeader': 'The header row cannot be deleted.',
  'error.deleteLastRow': 'The last row of a table cannot be deleted.',
  'error.moveHeader': 'The header row cannot be moved.',
  'error.rowAlreadyFirst': 'The row is already the first one below the header.',
  'error.rowAlreadyLast': 'The row is already the last one.',
  'error.deleteLastColumn': 'The last column of a table cannot be deleted.',
  'error.columnAlreadyFirst': 'The column is already the first one.',
  'error.columnAlreadyLast': 'The column is already the last one.',
  'error.noAlignment': 'The column has no alignment already.',
  'error.alreadyAligned.left': 'The column is already aligned left.',
  'error.alreadyAligned.center': 'The column is already aligned center.',
  'error.alreadyAligned.right': 'The column is already aligned right.',

  // Modals and pickers
  'modal.paste.intro': 'Paste your cells into the box below. On a phone or tablet, press and hold in the box, then choose Paste.',
  'modal.paste.submit': 'Make table',
  'modal.copy.intro':
    'The clipboard could not be written to. The table is selected below: copy it, then paste it into any spreadsheet.',
  'modal.pickFile': 'Choose a CSV or TSV file to insert as a table',
  'modal.pickAction': 'Choose a table action',

  // Settings
  'setting.convertOnPaste.name': 'Convert on paste',
  'setting.convertOnPaste.desc':
    'Turn cells copied from a spreadsheet into a table when you paste them normally. When this is off, use the "Paste as table" command instead.',
  'setting.firstRowIsHeader.name': 'First row is the header',
  'setting.firstRowIsHeader.desc': 'Use the first copied row as the table header. When this is off, the header row is left empty.',
  'setting.alignNumbers.name': 'Right-align numbers',
  'setting.alignNumbers.desc': 'Right-align a column when every cell in it below the header is a number.',
  'setting.padColumns.name': 'Line up columns',
  'setting.padColumns.desc': 'Pad the cells with spaces so the columns line up in the editor. When this is off, tables are compact.',
  'setting.defaultAlign.name': 'Default column alignment',
  'setting.defaultAlign.desc':
    'Alignment of columns that are not numbers when text is converted to a table. Number columns stay right-aligned when that setting is on.',
  'option.alignNone': 'None',
  'option.alignLeft': 'Left',
  'option.alignCenter': 'Center',
  'option.alignRight': 'Right',
} as const;

export default en;
