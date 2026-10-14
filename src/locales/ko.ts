import type { Messages } from '../i18n.ts';

const ko: Messages = {
  // Commands
  'command.pasteAsTable': '표로 붙여넣기',
  'command.convertSelection': '선택 영역을 표로 변환',
  'command.copyForSpreadsheet': '스프레드시트용으로 표 복사',
  'command.insertCsvFile': 'CSV 파일을 표로 삽입',
  'command.copyAsCsv': '표를 CSV로 복사',
  'command.saveAsCsv': '표를 CSV 파일로 저장',
  'command.sortAscending': '이 열을 기준으로 표 오름차순 정렬',
  'command.sortDescending': '이 열을 기준으로 표 내림차순 정렬',
  'command.transpose': '표 행/열 바꾸기(행과 열 교환)',
  'command.copyAsRichText': '표를 서식 있는 텍스트로 복사',
  'command.convertJson': 'JSON 배열을 표로 변환',
  'command.tableTools': '표 도구',

  // Table actions
  'action.insertRowAbove': '위에 행 삽입',
  'action.insertRowBelow': '아래에 행 삽입',
  'action.deleteRow': '행 삭제',
  'action.moveRowUp': '행 위로 이동',
  'action.moveRowDown': '행 아래로 이동',
  'action.insertColumnLeft': '왼쪽에 열 삽입',
  'action.insertColumnRight': '오른쪽에 열 삽입',
  'action.deleteColumn': '열 삭제',
  'action.moveColumnLeft': '열 왼쪽으로 이동',
  'action.moveColumnRight': '열 오른쪽으로 이동',
  'action.alignLeft': '열 왼쪽 정렬',
  'action.alignCenter': '열 가운데 정렬',
  'action.alignRight': '열 오른쪽 정렬',
  'action.alignNone': '열 정렬 해제',
  'menu.insertRowBelow': '표: 아래에 행 삽입',
  'menu.deleteRow': '표: 행 삭제',
  'menu.insertColumnRight': '표: 오른쪽에 열 삽입',
  'menu.deleteColumn': '표: 열 삭제',
  'menu.moreTools': '표: 더 많은 도구…',

  // Counts
  'count.rows.one': '1행',
  'count.rows.other': '{count}행',
  'count.columns.one': '1열',
  'count.columns.other': '{count}열',

  // Notices
  'notice.noDelimitedFiles': '이 보관함에는 .csv 또는 .tsv 파일이 없습니다.',
  'notice.cannotPlaceTable': '여기에는 표를 넣을 수 없습니다. 커서가 코드, 속성 또는 다른 표 안에 있습니다.',
  'notice.clipboardEmpty': '클립보드에 표로 만들 텍스트가 없습니다.',
  'notice.pastedEmpty': '붙여넣은 내용에 표로 만들 텍스트가 없습니다.',
  'notice.selectionEmpty': '선택 영역에 표로 만들 텍스트가 없습니다.',
  'notice.fileEmpty': '{file}에는 표로 만들 행이 없습니다.',
  'notice.inserted': '삽입했습니다: {file}, {rows}.',
  'notice.saved': '{path}에 저장했습니다: {rows}.',
  'notice.copied': '복사했습니다: {rows}, {columns}. {hint}',
  'notice.copiedRich': '표로 복사했습니다: {rows}. Docs, Word 또는 이메일에 붙여넣을 수 있습니다.',
  'notice.sorted': '정렬했습니다: {rows}.',
  'notice.transposed': '행과 열을 바꿨습니다: {rows}.',
  'notice.alreadyInOrder': '표가 이미 그 순서입니다.',
  'hint.spreadsheet': '아무 스프레드시트에나 붙여넣을 수 있습니다.',
  'hint.csv': 'CSV를 받는 곳이면 어디든 붙여넣을 수 있습니다.',
  'hint.richFallback': '여기서는 서식 있는 텍스트를 쓸 수 없어 일반 텍스트로 복사했습니다.',

  // Why a table action cannot run
  'error.rowAboveHeader': '머리글 위에는 행을 둘 수 없습니다.',
  'error.deleteHeader': '머리글 행은 삭제할 수 없습니다.',
  'error.deleteLastRow': '표의 마지막 행은 삭제할 수 없습니다.',
  'error.moveHeader': '머리글 행은 이동할 수 없습니다.',
  'error.rowAlreadyFirst': '이 행은 이미 머리글 아래 첫 번째 행입니다.',
  'error.rowAlreadyLast': '이 행은 이미 마지막 행입니다.',
  'error.deleteLastColumn': '표의 마지막 열은 삭제할 수 없습니다.',
  'error.columnAlreadyFirst': '이 열은 이미 첫 번째 열입니다.',
  'error.columnAlreadyLast': '이 열은 이미 마지막 열입니다.',
  'error.noAlignment': '이 열에는 이미 정렬이 지정되어 있지 않습니다.',
  'error.alreadyAligned.left': '이 열은 이미 왼쪽 정렬입니다.',
  'error.alreadyAligned.center': '이 열은 이미 가운데 정렬입니다.',
  'error.alreadyAligned.right': '이 열은 이미 오른쪽 정렬입니다.',

  // Modals and pickers
  'modal.paste.intro': '아래 상자에 셀을 붙여넣으세요. 휴대폰이나 태블릿에서는 상자를 길게 누른 다음 붙여넣기를 선택하세요.',
  'modal.paste.submit': '표 만들기',
  'modal.copy.intro': '클립보드에 쓸 수 없습니다. 표가 아래에 선택되어 있습니다. 복사한 다음 아무 스프레드시트에나 붙여넣으세요.',
  'modal.pickFile': '표로 삽입할 CSV 또는 TSV 파일을 고르세요',
  'modal.pickAction': '표 작업을 고르세요',

  // Settings
  'setting.convertOnPaste.name': '붙여넣을 때 변환',
  'setting.convertOnPaste.desc':
    '스프레드시트에서 복사한 셀을 일반 붙여넣기로 붙여넣을 때 표로 바꿉니다. 끄면 대신 "표로 붙여넣기" 명령을 사용하세요.',
  'setting.firstRowIsHeader.name': '첫 행을 머리글로 사용',
  'setting.firstRowIsHeader.desc': '복사한 첫 행을 표의 머리글로 사용합니다. 끄면 머리글 행은 비어 있게 됩니다.',
  'setting.alignNumbers.name': '숫자 오른쪽 정렬',
  'setting.alignNumbers.desc': '머리글 아래의 모든 셀이 숫자인 열을 오른쪽 정렬합니다.',
  'setting.padColumns.name': '열 맞추기',
  'setting.padColumns.desc': '편집기에서 열이 맞도록 셀을 공백으로 채웁니다. 끄면 표가 간결하게 만들어집니다.',
  'setting.defaultAlign.name': '기본 열 정렬',
  'setting.defaultAlign.desc': '텍스트를 표로 변환할 때 숫자가 아닌 열의 정렬입니다. 위 설정이 켜져 있으면 숫자 열은 계속 오른쪽 정렬됩니다.',
  'option.alignNone': '없음',
  'option.alignLeft': '왼쪽',
  'option.alignCenter': '가운데',
  'option.alignRight': '오른쪽',
};

export default ko;
