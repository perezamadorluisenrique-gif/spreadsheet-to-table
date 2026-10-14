import type { Messages } from '../i18n.ts';

const es: Messages = {
  // Commands
  'command.pasteAsTable': 'Pegar como tabla',
  'command.convertSelection': 'Convertir la selección en tabla',
  'command.copyForSpreadsheet': 'Copiar la tabla para una hoja de cálculo',
  'command.insertCsvFile': 'Insertar un archivo CSV como tabla',
  'command.copyAsCsv': 'Copiar la tabla como CSV',
  'command.saveAsCsv': 'Guardar la tabla como archivo CSV',
  'command.sortAscending': 'Ordenar la tabla por esta columna, de forma ascendente',
  'command.sortDescending': 'Ordenar la tabla por esta columna, de forma descendente',
  'command.transpose': 'Transponer la tabla (intercambiar filas y columnas)',
  'command.copyAsRichText': 'Copiar la tabla como texto enriquecido',
  'command.convertJson': 'Convertir una matriz JSON en tabla',
  'command.tableTools': 'Herramientas de tabla',

  // Table actions
  'action.insertRowAbove': 'Insertar fila arriba',
  'action.insertRowBelow': 'Insertar fila abajo',
  'action.deleteRow': 'Eliminar fila',
  'action.moveRowUp': 'Mover fila hacia arriba',
  'action.moveRowDown': 'Mover fila hacia abajo',
  'action.insertColumnLeft': 'Insertar columna a la izquierda',
  'action.insertColumnRight': 'Insertar columna a la derecha',
  'action.deleteColumn': 'Eliminar columna',
  'action.moveColumnLeft': 'Mover columna a la izquierda',
  'action.moveColumnRight': 'Mover columna a la derecha',
  'action.alignLeft': 'Alinear columna a la izquierda',
  'action.alignCenter': 'Centrar columna',
  'action.alignRight': 'Alinear columna a la derecha',
  'action.alignNone': 'Quitar la alineación de la columna',
  'menu.insertRowBelow': 'Tabla: insertar fila abajo',
  'menu.deleteRow': 'Tabla: eliminar fila',
  'menu.insertColumnRight': 'Tabla: insertar columna a la derecha',
  'menu.deleteColumn': 'Tabla: eliminar columna',
  'menu.moreTools': 'Tabla: más herramientas…',

  // Counts
  'count.rows.one': '1 fila',
  'count.rows.other': '{count} filas',
  'count.columns.one': '1 columna',
  'count.columns.other': '{count} columnas',

  // Notices
  'notice.noDelimitedFiles': 'No hay archivos .csv ni .tsv en esta bóveda.',
  'notice.cannotPlaceTable': 'Aquí no se puede poner una tabla: el cursor está en código, en las propiedades o en otra tabla.',
  'notice.clipboardEmpty': 'El portapapeles no tiene texto con el que hacer una tabla.',
  'notice.pastedEmpty': 'El texto pegado no tiene texto con el que hacer una tabla.',
  'notice.selectionEmpty': 'La selección no tiene texto con el que hacer una tabla.',
  'notice.fileEmpty': '{file} no tiene filas con las que hacer una tabla.',
  'notice.inserted': 'Insertado {file}: {rows}.',
  'notice.saved': 'Guardado en {path}: {rows}.',
  'notice.copied': 'Copiado: {rows} de {columns}. {hint}',
  'notice.copiedRich': 'Copiado como tabla: {rows}. Pégala en Docs, Word o un correo electrónico.',
  'notice.sorted': 'Ordenado: {rows}.',
  'notice.transposed': 'Transpuesto: {rows}.',
  'notice.alreadyInOrder': 'La tabla ya está en ese orden.',
  'hint.spreadsheet': 'Pégala en cualquier hoja de cálculo.',
  'hint.csv': 'Pégala donde se acepte CSV.',
  'hint.richFallback': 'El texto enriquecido no está disponible aquí, así que se copió como texto sin formato.',

  // Why a table action cannot run
  'error.rowAboveHeader': 'No se puede poner una fila por encima del encabezado.',
  'error.deleteHeader': 'No se puede eliminar la fila del encabezado.',
  'error.deleteLastRow': 'No se puede eliminar la última fila de una tabla.',
  'error.moveHeader': 'No se puede mover la fila del encabezado.',
  'error.rowAlreadyFirst': 'La fila ya es la primera debajo del encabezado.',
  'error.rowAlreadyLast': 'La fila ya es la última.',
  'error.deleteLastColumn': 'No se puede eliminar la última columna de una tabla.',
  'error.columnAlreadyFirst': 'La columna ya es la primera.',
  'error.columnAlreadyLast': 'La columna ya es la última.',
  'error.noAlignment': 'La columna ya no tiene alineación.',
  'error.alreadyAligned.left': 'La columna ya está alineada a la izquierda.',
  'error.alreadyAligned.center': 'La columna ya está centrada.',
  'error.alreadyAligned.right': 'La columna ya está alineada a la derecha.',

  // Modals and pickers
  'modal.paste.intro': 'Pega tus celdas en el cuadro de abajo. En un teléfono o una tableta, mantén pulsado el cuadro y elige Pegar.',
  'modal.paste.submit': 'Crear tabla',
  'modal.copy.intro': 'No se pudo escribir en el portapapeles. La tabla está seleccionada abajo: cópiala y pégala en cualquier hoja de cálculo.',
  'modal.pickFile': 'Elige un archivo CSV o TSV para insertarlo como tabla',
  'modal.pickAction': 'Elige una acción de tabla',

  // Settings
  'setting.convertOnPaste.name': 'Convertir al pegar',
  'setting.convertOnPaste.desc':
    'Convierte en tabla las celdas copiadas de una hoja de cálculo cuando las pegas de forma normal. Si está desactivado, usa el comando "Pegar como tabla".',
  'setting.firstRowIsHeader.name': 'La primera fila es el encabezado',
  'setting.firstRowIsHeader.desc': 'Usa la primera fila copiada como encabezado de la tabla. Si está desactivado, la fila del encabezado queda vacía.',
  'setting.alignNumbers.name': 'Alinear los números a la derecha',
  'setting.alignNumbers.desc': 'Alinea a la derecha una columna cuando todas sus celdas por debajo del encabezado son números.',
  'setting.padColumns.name': 'Alinear las columnas',
  'setting.padColumns.desc': 'Rellena las celdas con espacios para que las columnas queden alineadas en el editor. Si está desactivado, las tablas son compactas.',
  'setting.defaultAlign.name': 'Alineación de columna predeterminada',
  'setting.defaultAlign.desc':
    'Alineación de las columnas que no son numéricas cuando se convierte texto en una tabla. Las columnas de números siguen alineadas a la derecha si ese ajuste está activado.',
  'option.alignNone': 'Ninguna',
  'option.alignLeft': 'Izquierda',
  'option.alignCenter': 'Centro',
  'option.alignRight': 'Derecha',
};

export default es;
