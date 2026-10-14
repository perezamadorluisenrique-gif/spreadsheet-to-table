import type { Messages } from '../i18n.ts';

const de: Messages = {
  // Commands
  'command.pasteAsTable': 'Als Tabelle einfügen',
  'command.convertSelection': 'Auswahl in Tabelle umwandeln',
  'command.copyForSpreadsheet': 'Tabelle für eine Tabellenkalkulation kopieren',
  'command.insertCsvFile': 'CSV-Datei als Tabelle einfügen',
  'command.copyAsCsv': 'Tabelle als CSV kopieren',
  'command.saveAsCsv': 'Tabelle als CSV-Datei speichern',
  'command.sortAscending': 'Tabelle nach dieser Spalte aufsteigend sortieren',
  'command.sortDescending': 'Tabelle nach dieser Spalte absteigend sortieren',
  'command.transpose': 'Tabelle transponieren (Zeilen und Spalten tauschen)',
  'command.copyAsRichText': 'Tabelle als formatierten Text kopieren',
  'command.convertJson': 'JSON-Array in Tabelle umwandeln',
  'command.tableTools': 'Tabellenwerkzeuge',

  // Table actions
  'action.insertRowAbove': 'Zeile oberhalb einfügen',
  'action.insertRowBelow': 'Zeile unterhalb einfügen',
  'action.deleteRow': 'Zeile löschen',
  'action.moveRowUp': 'Zeile nach oben verschieben',
  'action.moveRowDown': 'Zeile nach unten verschieben',
  'action.insertColumnLeft': 'Spalte links einfügen',
  'action.insertColumnRight': 'Spalte rechts einfügen',
  'action.deleteColumn': 'Spalte löschen',
  'action.moveColumnLeft': 'Spalte nach links verschieben',
  'action.moveColumnRight': 'Spalte nach rechts verschieben',
  'action.alignLeft': 'Spalte linksbündig ausrichten',
  'action.alignCenter': 'Spalte zentrieren',
  'action.alignRight': 'Spalte rechtsbündig ausrichten',
  'action.alignNone': 'Spaltenausrichtung entfernen',
  'menu.insertRowBelow': 'Tabelle: Zeile unterhalb einfügen',
  'menu.deleteRow': 'Tabelle: Zeile löschen',
  'menu.insertColumnRight': 'Tabelle: Spalte rechts einfügen',
  'menu.deleteColumn': 'Tabelle: Spalte löschen',
  'menu.moreTools': 'Tabelle: weitere Werkzeuge…',

  // Counts
  'count.rows.one': '1 Zeile',
  'count.rows.other': '{count} Zeilen',
  'count.columns.one': '1 Spalte',
  'count.columns.other': '{count} Spalten',

  // Notices
  'notice.noDelimitedFiles': 'In diesem Vault gibt es keine .csv- oder .tsv-Dateien.',
  'notice.cannotPlaceTable': 'Hier kann keine Tabelle stehen: Der Cursor befindet sich in Code, in den Eigenschaften oder in einer anderen Tabelle.',
  'notice.clipboardEmpty': 'Die Zwischenablage enthält keinen Text, aus dem sich eine Tabelle machen lässt.',
  'notice.pastedEmpty': 'Der eingefügte Text enthält keinen Text, aus dem sich eine Tabelle machen lässt.',
  'notice.selectionEmpty': 'Die Auswahl enthält keinen Text, aus dem sich eine Tabelle machen lässt.',
  'notice.fileEmpty': '{file} enthält keine Zeilen, aus denen sich eine Tabelle machen lässt.',
  'notice.inserted': '{file} eingefügt: {rows}.',
  'notice.saved': 'Gespeichert in {path}: {rows}.',
  'notice.copied': 'Kopiert: {rows} mit {columns}. {hint}',
  'notice.copiedRich': 'Als Tabelle kopiert: {rows}. In Docs, Word oder eine E-Mail einfügbar.',
  'notice.sorted': 'Sortiert: {rows}.',
  'notice.transposed': 'Transponiert: {rows}.',
  'notice.alreadyInOrder': 'Die Tabelle hat bereits diese Reihenfolge.',
  'hint.spreadsheet': 'In jede Tabellenkalkulation einfügbar.',
  'hint.csv': 'Überall einfügbar, wo CSV akzeptiert wird.',
  'hint.richFallback': 'Formatierter Text ist hier nicht verfügbar, daher wurde als einfacher Text kopiert.',

  // Why a table action cannot run
  'error.rowAboveHeader': 'Über der Kopfzeile kann keine Zeile stehen.',
  'error.deleteHeader': 'Die Kopfzeile kann nicht gelöscht werden.',
  'error.deleteLastRow': 'Die letzte Zeile einer Tabelle kann nicht gelöscht werden.',
  'error.moveHeader': 'Die Kopfzeile kann nicht verschoben werden.',
  'error.rowAlreadyFirst': 'Die Zeile ist bereits die erste unter der Kopfzeile.',
  'error.rowAlreadyLast': 'Die Zeile ist bereits die letzte.',
  'error.deleteLastColumn': 'Die letzte Spalte einer Tabelle kann nicht gelöscht werden.',
  'error.columnAlreadyFirst': 'Die Spalte ist bereits die erste.',
  'error.columnAlreadyLast': 'Die Spalte ist bereits die letzte.',
  'error.noAlignment': 'Die Spalte hat bereits keine Ausrichtung.',
  'error.alreadyAligned.left': 'Die Spalte ist bereits linksbündig.',
  'error.alreadyAligned.center': 'Die Spalte ist bereits zentriert.',
  'error.alreadyAligned.right': 'Die Spalte ist bereits rechtsbündig.',

  // Modals and pickers
  'modal.paste.intro': 'Füge deine Zellen in das Feld unten ein. Auf einem Smartphone oder Tablet halte das Feld gedrückt und wähle Einfügen.',
  'modal.paste.submit': 'Tabelle erstellen',
  'modal.copy.intro': 'In die Zwischenablage konnte nicht geschrieben werden. Die Tabelle ist unten ausgewählt: Kopiere sie und füge sie in eine beliebige Tabellenkalkulation ein.',
  'modal.pickFile': 'CSV- oder TSV-Datei zum Einfügen als Tabelle wählen',
  'modal.pickAction': 'Tabellenaktion wählen',

  // Settings
  'setting.convertOnPaste.name': 'Beim Einfügen umwandeln',
  'setting.convertOnPaste.desc':
    'Wandelt aus einer Tabellenkalkulation kopierte Zellen beim normalen Einfügen in eine Tabelle um. Ist dies aus, nutze stattdessen den Befehl „Als Tabelle einfügen“.',
  'setting.firstRowIsHeader.name': 'Erste Zeile ist die Kopfzeile',
  'setting.firstRowIsHeader.desc': 'Verwendet die erste kopierte Zeile als Kopfzeile der Tabelle. Ist dies aus, bleibt die Kopfzeile leer.',
  'setting.alignNumbers.name': 'Zahlen rechtsbündig ausrichten',
  'setting.alignNumbers.desc': 'Richtet eine Spalte rechtsbündig aus, wenn jede Zelle darin unterhalb der Kopfzeile eine Zahl ist.',
  'setting.padColumns.name': 'Spalten ausrichten',
  'setting.padColumns.desc': 'Füllt die Zellen mit Leerzeichen auf, damit die Spalten im Editor untereinanderstehen. Ist dies aus, sind Tabellen kompakt.',
  'setting.defaultAlign.name': 'Standardausrichtung der Spalten',
  'setting.defaultAlign.desc':
    'Ausrichtung der Spalten, die keine Zahlen sind, wenn Text in eine Tabelle umgewandelt wird. Zahlenspalten bleiben rechtsbündig, solange diese Einstellung aktiv ist.',
  'option.alignNone': 'Keine',
  'option.alignLeft': 'Links',
  'option.alignCenter': 'Zentriert',
  'option.alignRight': 'Rechts',
};

export default de;
