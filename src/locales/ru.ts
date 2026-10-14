import type { Messages } from '../i18n.ts';

const ru: Messages = {
  // Commands
  'command.pasteAsTable': 'Вставить как таблицу',
  'command.convertSelection': 'Преобразовать выделенное в таблицу',
  'command.copyForSpreadsheet': 'Скопировать таблицу для электронной таблицы',
  'command.insertCsvFile': 'Вставить CSV-файл как таблицу',
  'command.copyAsCsv': 'Скопировать таблицу как CSV',
  'command.saveAsCsv': 'Сохранить таблицу как CSV-файл',
  'command.sortAscending': 'Сортировать таблицу по этому столбцу по возрастанию',
  'command.sortDescending': 'Сортировать таблицу по этому столбцу по убыванию',
  'command.transpose': 'Транспонировать таблицу (поменять строки и столбцы)',
  'command.copyAsRichText': 'Скопировать таблицу как форматированный текст',
  'command.convertJson': 'Преобразовать массив JSON в таблицу',
  'command.tableTools': 'Инструменты таблицы',

  // Table actions
  'action.insertRowAbove': 'Вставить строку выше',
  'action.insertRowBelow': 'Вставить строку ниже',
  'action.deleteRow': 'Удалить строку',
  'action.moveRowUp': 'Переместить строку вверх',
  'action.moveRowDown': 'Переместить строку вниз',
  'action.insertColumnLeft': 'Вставить столбец слева',
  'action.insertColumnRight': 'Вставить столбец справа',
  'action.deleteColumn': 'Удалить столбец',
  'action.moveColumnLeft': 'Переместить столбец влево',
  'action.moveColumnRight': 'Переместить столбец вправо',
  'action.alignLeft': 'Выровнять столбец по левому краю',
  'action.alignCenter': 'Выровнять столбец по центру',
  'action.alignRight': 'Выровнять столбец по правому краю',
  'action.alignNone': 'Сбросить выравнивание столбца',
  'menu.insertRowBelow': 'Таблица: вставить строку ниже',
  'menu.deleteRow': 'Таблица: удалить строку',
  'menu.insertColumnRight': 'Таблица: вставить столбец справа',
  'menu.deleteColumn': 'Таблица: удалить столбец',
  'menu.moreTools': 'Таблица: другие инструменты…',

  // Counts
  'count.rows.one': 'строк: 1',
  'count.rows.other': 'строк: {count}',
  'count.columns.one': 'столбцов: 1',
  'count.columns.other': 'столбцов: {count}',

  // Notices
  'notice.noDelimitedFiles': 'В этом хранилище нет файлов .csv и .tsv.',
  'notice.cannotPlaceTable': 'Здесь нельзя разместить таблицу: курсор находится в коде, в свойствах или в другой таблице.',
  'notice.clipboardEmpty': 'В буфере обмена нет текста, из которого можно сделать таблицу.',
  'notice.pastedEmpty': 'В вставленном тексте нет текста, из которого можно сделать таблицу.',
  'notice.selectionEmpty': 'В выделенном нет текста, из которого можно сделать таблицу.',
  'notice.fileEmpty': 'В файле {file} нет строк, из которых можно сделать таблицу.',
  'notice.inserted': 'Вставлен файл {file}: {rows}.',
  'notice.saved': 'Сохранено в {path}: {rows}.',
  'notice.copied': 'Скопировано: {rows}, {columns}. {hint}',
  'notice.copiedRich': 'Скопировано как таблица: {rows}. Вставьте её в Docs, Word или письмо.',
  'notice.sorted': 'Отсортировано: {rows}.',
  'notice.transposed': 'Транспонировано: {rows}.',
  'notice.alreadyInOrder': 'Таблица уже в таком порядке.',
  'hint.spreadsheet': 'Вставьте в любую электронную таблицу.',
  'hint.csv': 'Вставьте туда, где принимается CSV.',
  'hint.richFallback': 'Форматированный текст здесь недоступен, поэтому скопирован обычный текст.',

  // Why a table action cannot run
  'error.rowAboveHeader': 'Строку нельзя поставить выше заголовка.',
  'error.deleteHeader': 'Строку заголовка нельзя удалить.',
  'error.deleteLastRow': 'Последнюю строку таблицы нельзя удалить.',
  'error.moveHeader': 'Строку заголовка нельзя переместить.',
  'error.rowAlreadyFirst': 'Эта строка уже первая под заголовком.',
  'error.rowAlreadyLast': 'Эта строка уже последняя.',
  'error.deleteLastColumn': 'Последний столбец таблицы нельзя удалить.',
  'error.columnAlreadyFirst': 'Этот столбец уже первый.',
  'error.columnAlreadyLast': 'Этот столбец уже последний.',
  'error.noAlignment': 'У столбца уже нет выравнивания.',
  'error.alreadyAligned.left': 'Столбец уже выровнен по левому краю.',
  'error.alreadyAligned.center': 'Столбец уже выровнен по центру.',
  'error.alreadyAligned.right': 'Столбец уже выровнен по правому краю.',

  // Modals and pickers
  'modal.paste.intro': 'Вставьте ячейки в поле ниже. На телефоне или планшете нажмите и удерживайте поле, затем выберите «Вставить».',
  'modal.paste.submit': 'Создать таблицу',
  'modal.copy.intro': 'Не удалось записать в буфер обмена. Таблица выделена ниже: скопируйте её и вставьте в любую электронную таблицу.',
  'modal.pickFile': 'Выберите CSV- или TSV-файл для вставки в виде таблицы',
  'modal.pickAction': 'Выберите действие с таблицей',

  // Settings
  'setting.convertOnPaste.name': 'Преобразовывать при вставке',
  'setting.convertOnPaste.desc':
    'Превращает ячейки, скопированные из электронной таблицы, в таблицу при обычной вставке. Если выключено, используйте команду «Вставить как таблицу».',
  'setting.firstRowIsHeader.name': 'Первая строка — заголовок',
  'setting.firstRowIsHeader.desc': 'Использует первую скопированную строку как заголовок таблицы. Если выключено, строка заголовка остаётся пустой.',
  'setting.alignNumbers.name': 'Выравнивать числа по правому краю',
  'setting.alignNumbers.desc': 'Выравнивает столбец по правому краю, если каждая его ячейка ниже заголовка — число.',
  'setting.padColumns.name': 'Выравнивать столбцы',
  'setting.padColumns.desc': 'Дополняет ячейки пробелами, чтобы столбцы выстраивались в редакторе. Если выключено, таблицы компактные.',
  'setting.defaultAlign.name': 'Выравнивание столбцов по умолчанию',
  'setting.defaultAlign.desc':
    'Выравнивание столбцов, не содержащих числа, при преобразовании текста в таблицу. Столбцы с числами остаются выровненными по правому краю, пока включена соответствующая настройка.',
  'option.alignNone': 'Нет',
  'option.alignLeft': 'По левому краю',
  'option.alignCenter': 'По центру',
  'option.alignRight': 'По правому краю',
};

export default ru;
