import type { Messages } from '../i18n.ts';

const ja: Messages = {
  // Commands
  'command.pasteAsTable': 'テーブルとして貼り付け',
  'command.convertSelection': '選択範囲をテーブルに変換',
  'command.copyForSpreadsheet': 'スプレッドシート用にテーブルをコピー',
  'command.insertCsvFile': 'CSV ファイルをテーブルとして挿入',
  'command.copyAsCsv': 'テーブルを CSV としてコピー',
  'command.saveAsCsv': 'テーブルを CSV ファイルとして保存',
  'command.sortAscending': 'この列でテーブルを昇順に並べ替え',
  'command.sortDescending': 'この列でテーブルを降順に並べ替え',
  'command.transpose': 'テーブルを転置（行と列を入れ替え）',
  'command.copyAsRichText': 'テーブルをリッチテキストとしてコピー',
  'command.convertJson': 'JSON 配列をテーブルに変換',
  'command.tableTools': 'テーブルツール',

  // Table actions
  'action.insertRowAbove': '行を上に挿入',
  'action.insertRowBelow': '行を下に挿入',
  'action.deleteRow': '行を削除',
  'action.moveRowUp': '行を上へ移動',
  'action.moveRowDown': '行を下へ移動',
  'action.insertColumnLeft': '列を左に挿入',
  'action.insertColumnRight': '列を右に挿入',
  'action.deleteColumn': '列を削除',
  'action.moveColumnLeft': '列を左へ移動',
  'action.moveColumnRight': '列を右へ移動',
  'action.alignLeft': '列を左揃え',
  'action.alignCenter': '列を中央揃え',
  'action.alignRight': '列を右揃え',
  'action.alignNone': '列の配置をクリア',
  'menu.insertRowBelow': 'テーブル: 行を下に挿入',
  'menu.deleteRow': 'テーブル: 行を削除',
  'menu.insertColumnRight': 'テーブル: 列を右に挿入',
  'menu.deleteColumn': 'テーブル: 列を削除',
  'menu.moreTools': 'テーブル: その他のツール…',

  // Counts
  'count.rows.one': '1 行',
  'count.rows.other': '{count} 行',
  'count.columns.one': '1 列',
  'count.columns.other': '{count} 列',

  // Notices
  'notice.noDelimitedFiles': 'この保管庫には .csv や .tsv ファイルがありません。',
  'notice.cannotPlaceTable': 'ここにはテーブルを置けません。カーソルがコード、プロパティ、または別のテーブルの中にあります。',
  'notice.clipboardEmpty': 'クリップボードに、テーブルにできるテキストがありません。',
  'notice.pastedEmpty': '貼り付けたテキストに、テーブルにできるテキストがありません。',
  'notice.selectionEmpty': '選択範囲に、テーブルにできるテキストがありません。',
  'notice.fileEmpty': '{file} には、テーブルにできる行がありません。',
  'notice.inserted': '{file} を挿入しました: {rows}。',
  'notice.saved': '{rows} を {path} に保存しました。',
  'notice.copied': '{rows}（{columns}）をコピーしました。{hint}',
  'notice.copiedRich': '{rows} をテーブルとしてコピーしました。Docs、Word、メールに貼り付けられます。',
  'notice.sorted': '{rows} を並べ替えました。',
  'notice.transposed': '{rows} を転置しました。',
  'notice.alreadyInOrder': 'テーブルはすでにその順序です。',
  'hint.spreadsheet': '任意のスプレッドシートに貼り付けられます。',
  'hint.csv': 'CSV を受け付ける場所に貼り付けられます。',
  'hint.richFallback': 'ここではリッチテキストを使えないため、プレーンテキストとしてコピーしました。',

  // Why a table action cannot run
  'error.rowAboveHeader': 'ヘッダーより上には行を置けません。',
  'error.deleteHeader': 'ヘッダー行は削除できません。',
  'error.deleteLastRow': 'テーブルの最後の行は削除できません。',
  'error.moveHeader': 'ヘッダー行は移動できません。',
  'error.rowAlreadyFirst': 'この行はすでにヘッダーの下の最初の行です。',
  'error.rowAlreadyLast': 'この行はすでに最後の行です。',
  'error.deleteLastColumn': 'テーブルの最後の列は削除できません。',
  'error.columnAlreadyFirst': 'この列はすでに最初の列です。',
  'error.columnAlreadyLast': 'この列はすでに最後の列です。',
  'error.noAlignment': 'この列にはもともと配置の指定がありません。',
  'error.alreadyAligned.left': 'この列はすでに左揃えです。',
  'error.alreadyAligned.center': 'この列はすでに中央揃えです。',
  'error.alreadyAligned.right': 'この列はすでに右揃えです。',

  // Modals and pickers
  'modal.paste.intro': '下のボックスにセルを貼り付けてください。スマートフォンやタブレットでは、ボックスを長押しして「ペースト」を選びます。',
  'modal.paste.submit': 'テーブルを作成',
  'modal.copy.intro': 'クリップボードに書き込めませんでした。テーブルは下で選択されています。コピーして、任意のスプレッドシートに貼り付けてください。',
  'modal.pickFile': 'テーブルとして挿入する CSV または TSV ファイルを選択',
  'modal.pickAction': 'テーブルの操作を選択',

  // Settings
  'setting.convertOnPaste.name': '貼り付け時に変換',
  'setting.convertOnPaste.desc':
    'スプレッドシートからコピーしたセルを通常の貼り付けでテーブルに変換します。オフの場合は、代わりに「テーブルとして貼り付け」コマンドを使います。',
  'setting.firstRowIsHeader.name': '最初の行をヘッダーにする',
  'setting.firstRowIsHeader.desc': 'コピーした最初の行をテーブルのヘッダーにします。オフの場合、ヘッダー行は空になります。',
  'setting.alignNumbers.name': '数値を右揃え',
  'setting.alignNumbers.desc': 'ヘッダーより下のすべてのセルが数値の列を右揃えにします。',
  'setting.padColumns.name': '列を揃える',
  'setting.padColumns.desc': 'エディタで列が揃うように、セルを空白で埋めます。オフの場合、テーブルはコンパクトになります。',
  'setting.defaultAlign.name': '列の既定の配置',
  'setting.defaultAlign.desc': 'テキストをテーブルに変換するときの、数値以外の列の配置です。上の設定がオンの間、数値の列は右揃えのままです。',
  'option.alignNone': 'なし',
  'option.alignLeft': '左',
  'option.alignCenter': '中央',
  'option.alignRight': '右',
};

export default ja;
