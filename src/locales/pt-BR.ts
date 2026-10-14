import type { Messages } from '../i18n.ts';

const ptBR: Messages = {
  // Commands
  'command.pasteAsTable': 'Colar como tabela',
  'command.convertSelection': 'Converter a seleção em tabela',
  'command.copyForSpreadsheet': 'Copiar a tabela para uma planilha',
  'command.insertCsvFile': 'Inserir arquivo CSV como tabela',
  'command.copyAsCsv': 'Copiar a tabela como CSV',
  'command.saveAsCsv': 'Salvar a tabela como arquivo CSV',
  'command.sortAscending': 'Ordenar a tabela por esta coluna, em ordem crescente',
  'command.sortDescending': 'Ordenar a tabela por esta coluna, em ordem decrescente',
  'command.transpose': 'Transpor a tabela (trocar linhas e colunas)',
  'command.copyAsRichText': 'Copiar a tabela como texto formatado',
  'command.convertJson': 'Converter array JSON em tabela',
  'command.tableTools': 'Ferramentas de tabela',

  // Table actions
  'action.insertRowAbove': 'Inserir linha acima',
  'action.insertRowBelow': 'Inserir linha abaixo',
  'action.deleteRow': 'Excluir linha',
  'action.moveRowUp': 'Mover linha para cima',
  'action.moveRowDown': 'Mover linha para baixo',
  'action.insertColumnLeft': 'Inserir coluna à esquerda',
  'action.insertColumnRight': 'Inserir coluna à direita',
  'action.deleteColumn': 'Excluir coluna',
  'action.moveColumnLeft': 'Mover coluna para a esquerda',
  'action.moveColumnRight': 'Mover coluna para a direita',
  'action.alignLeft': 'Alinhar coluna à esquerda',
  'action.alignCenter': 'Centralizar coluna',
  'action.alignRight': 'Alinhar coluna à direita',
  'action.alignNone': 'Limpar o alinhamento da coluna',
  'menu.insertRowBelow': 'Tabela: inserir linha abaixo',
  'menu.deleteRow': 'Tabela: excluir linha',
  'menu.insertColumnRight': 'Tabela: inserir coluna à direita',
  'menu.deleteColumn': 'Tabela: excluir coluna',
  'menu.moreTools': 'Tabela: mais ferramentas…',

  // Counts
  'count.rows.one': '1 linha',
  'count.rows.other': '{count} linhas',
  'count.columns.one': '1 coluna',
  'count.columns.other': '{count} colunas',

  // Notices
  'notice.noDelimitedFiles': 'Não há arquivos .csv nem .tsv neste cofre.',
  'notice.cannotPlaceTable': 'Não é possível colocar uma tabela aqui: o cursor está em código, nas propriedades ou em outra tabela.',
  'notice.clipboardEmpty': 'A área de transferência não tem texto para fazer uma tabela.',
  'notice.pastedEmpty': 'O texto colado não tem texto para fazer uma tabela.',
  'notice.selectionEmpty': 'A seleção não tem texto para fazer uma tabela.',
  'notice.fileEmpty': '{file} não tem linhas para fazer uma tabela.',
  'notice.inserted': '{file} inserido: {rows}.',
  'notice.saved': 'Salvo em {path}: {rows}.',
  'notice.copied': 'Copiado: {rows} de {columns}. {hint}',
  'notice.copiedRich': 'Copiado como tabela: {rows}. Cole no Docs, no Word ou em um e-mail.',
  'notice.sorted': 'Ordenado: {rows}.',
  'notice.transposed': 'Transposto: {rows}.',
  'notice.alreadyInOrder': 'A tabela já está nessa ordem.',
  'hint.spreadsheet': 'Cole em qualquer planilha.',
  'hint.csv': 'Cole onde o CSV for aceito.',
  'hint.richFallback': 'O texto formatado não está disponível aqui, então foi copiado como texto simples.',

  // Why a table action cannot run
  'error.rowAboveHeader': 'Uma linha não pode ficar acima do cabeçalho.',
  'error.deleteHeader': 'A linha do cabeçalho não pode ser excluída.',
  'error.deleteLastRow': 'A última linha de uma tabela não pode ser excluída.',
  'error.moveHeader': 'A linha do cabeçalho não pode ser movida.',
  'error.rowAlreadyFirst': 'A linha já é a primeira abaixo do cabeçalho.',
  'error.rowAlreadyLast': 'A linha já é a última.',
  'error.deleteLastColumn': 'A última coluna de uma tabela não pode ser excluída.',
  'error.columnAlreadyFirst': 'A coluna já é a primeira.',
  'error.columnAlreadyLast': 'A coluna já é a última.',
  'error.noAlignment': 'A coluna já está sem alinhamento.',
  'error.alreadyAligned.left': 'A coluna já está alinhada à esquerda.',
  'error.alreadyAligned.center': 'A coluna já está centralizada.',
  'error.alreadyAligned.right': 'A coluna já está alinhada à direita.',

  // Modals and pickers
  'modal.paste.intro': 'Cole suas células na caixa abaixo. Em um celular ou tablet, mantenha pressionada a caixa e escolha Colar.',
  'modal.paste.submit': 'Criar tabela',
  'modal.copy.intro': 'Não foi possível escrever na área de transferência. A tabela está selecionada abaixo: copie-a e cole em qualquer planilha.',
  'modal.pickFile': 'Escolha um arquivo CSV ou TSV para inserir como tabela',
  'modal.pickAction': 'Escolha uma ação de tabela',

  // Settings
  'setting.convertOnPaste.name': 'Converter ao colar',
  'setting.convertOnPaste.desc':
    'Transforma em tabela as células copiadas de uma planilha quando você as cola normalmente. Com isto desativado, use o comando "Colar como tabela".',
  'setting.firstRowIsHeader.name': 'A primeira linha é o cabeçalho',
  'setting.firstRowIsHeader.desc': 'Usa a primeira linha copiada como cabeçalho da tabela. Com isto desativado, a linha do cabeçalho fica vazia.',
  'setting.alignNumbers.name': 'Alinhar números à direita',
  'setting.alignNumbers.desc': 'Alinha uma coluna à direita quando todas as células dela abaixo do cabeçalho são números.',
  'setting.padColumns.name': 'Alinhar colunas',
  'setting.padColumns.desc': 'Preenche as células com espaços para que as colunas fiquem alinhadas no editor. Com isto desativado, as tabelas ficam compactas.',
  'setting.defaultAlign.name': 'Alinhamento padrão das colunas',
  'setting.defaultAlign.desc':
    'Alinhamento das colunas que não são numéricas quando o texto é convertido em tabela. As colunas de números continuam alinhadas à direita quando essa configuração está ativada.',
  'option.alignNone': 'Nenhum',
  'option.alignLeft': 'Esquerda',
  'option.alignCenter': 'Centro',
  'option.alignRight': 'Direita',
};

export default ptBR;
