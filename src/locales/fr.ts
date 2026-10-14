import type { Messages } from '../i18n.ts';

const fr: Messages = {
  // Commands
  'command.pasteAsTable': 'Coller en tableau',
  'command.convertSelection': 'Convertir la sélection en tableau',
  'command.copyForSpreadsheet': 'Copier le tableau pour un tableur',
  'command.insertCsvFile': 'Insérer un fichier CSV en tableau',
  'command.copyAsCsv': 'Copier le tableau en CSV',
  'command.saveAsCsv': 'Enregistrer le tableau en fichier CSV',
  'command.sortAscending': 'Trier le tableau selon cette colonne, par ordre croissant',
  'command.sortDescending': 'Trier le tableau selon cette colonne, par ordre décroissant',
  'command.transpose': 'Transposer le tableau (échanger lignes et colonnes)',
  'command.copyAsRichText': 'Copier le tableau en texte enrichi',
  'command.convertJson': 'Convertir un tableau JSON en tableau',
  'command.tableTools': 'Outils de tableau',

  // Table actions
  'action.insertRowAbove': 'Insérer une ligne au-dessus',
  'action.insertRowBelow': 'Insérer une ligne en dessous',
  'action.deleteRow': 'Supprimer la ligne',
  'action.moveRowUp': 'Déplacer la ligne vers le haut',
  'action.moveRowDown': 'Déplacer la ligne vers le bas',
  'action.insertColumnLeft': 'Insérer une colonne à gauche',
  'action.insertColumnRight': 'Insérer une colonne à droite',
  'action.deleteColumn': 'Supprimer la colonne',
  'action.moveColumnLeft': 'Déplacer la colonne vers la gauche',
  'action.moveColumnRight': 'Déplacer la colonne vers la droite',
  'action.alignLeft': 'Aligner la colonne à gauche',
  'action.alignCenter': 'Centrer la colonne',
  'action.alignRight': 'Aligner la colonne à droite',
  'action.alignNone': 'Supprimer l’alignement de la colonne',
  'menu.insertRowBelow': 'Tableau : insérer une ligne en dessous',
  'menu.deleteRow': 'Tableau : supprimer la ligne',
  'menu.insertColumnRight': 'Tableau : insérer une colonne à droite',
  'menu.deleteColumn': 'Tableau : supprimer la colonne',
  'menu.moreTools': 'Tableau : plus d’outils…',

  // Counts
  'count.rows.one': '1 ligne',
  'count.rows.other': '{count} lignes',
  'count.columns.one': '1 colonne',
  'count.columns.other': '{count} colonnes',

  // Notices
  'notice.noDelimitedFiles': 'Il n’y a aucun fichier .csv ou .tsv dans ce coffre.',
  'notice.cannotPlaceTable': 'Un tableau ne peut pas aller ici : le curseur est dans du code, dans les propriétés ou dans un autre tableau.',
  'notice.clipboardEmpty': 'Le presse-papiers ne contient aucun texte dont on puisse faire un tableau.',
  'notice.pastedEmpty': 'Le texte collé ne contient aucun texte dont on puisse faire un tableau.',
  'notice.selectionEmpty': 'La sélection ne contient aucun texte dont on puisse faire un tableau.',
  'notice.fileEmpty': '{file} ne contient aucune ligne dont on puisse faire un tableau.',
  'notice.inserted': '{file} inséré : {rows}.',
  'notice.saved': 'Enregistré dans {path} : {rows}.',
  'notice.copied': 'Copié : {rows} sur {columns}. {hint}',
  'notice.copiedRich': 'Copié en tableau : {rows}. Collez-le dans Docs, Word ou un e-mail.',
  'notice.sorted': 'Trié : {rows}.',
  'notice.transposed': 'Transposé : {rows}.',
  'notice.alreadyInOrder': 'Le tableau est déjà dans cet ordre.',
  'hint.spreadsheet': 'Collez-le dans n’importe quel tableur.',
  'hint.csv': 'Collez-le là où le CSV est accepté.',
  'hint.richFallback': 'Le texte enrichi n’est pas disponible ici ; il a donc été copié en texte brut.',

  // Why a table action cannot run
  'error.rowAboveHeader': 'Une ligne ne peut pas aller au-dessus de l’en-tête.',
  'error.deleteHeader': 'La ligne d’en-tête ne peut pas être supprimée.',
  'error.deleteLastRow': 'La dernière ligne d’un tableau ne peut pas être supprimée.',
  'error.moveHeader': 'La ligne d’en-tête ne peut pas être déplacée.',
  'error.rowAlreadyFirst': 'La ligne est déjà la première sous l’en-tête.',
  'error.rowAlreadyLast': 'La ligne est déjà la dernière.',
  'error.deleteLastColumn': 'La dernière colonne d’un tableau ne peut pas être supprimée.',
  'error.columnAlreadyFirst': 'La colonne est déjà la première.',
  'error.columnAlreadyLast': 'La colonne est déjà la dernière.',
  'error.noAlignment': 'La colonne n’a déjà aucun alignement.',
  'error.alreadyAligned.left': 'La colonne est déjà alignée à gauche.',
  'error.alreadyAligned.center': 'La colonne est déjà centrée.',
  'error.alreadyAligned.right': 'La colonne est déjà alignée à droite.',

  // Modals and pickers
  'modal.paste.intro': 'Collez vos cellules dans la zone ci-dessous. Sur un téléphone ou une tablette, appuyez longuement dans la zone, puis choisissez Coller.',
  'modal.paste.submit': 'Créer le tableau',
  'modal.copy.intro': 'Impossible d’écrire dans le presse-papiers. Le tableau est sélectionné ci-dessous : copiez-le, puis collez-le dans n’importe quel tableur.',
  'modal.pickFile': 'Choisir un fichier CSV ou TSV à insérer en tableau',
  'modal.pickAction': 'Choisir une action sur le tableau',

  // Settings
  'setting.convertOnPaste.name': 'Convertir au collage',
  'setting.convertOnPaste.desc':
    'Transforme en tableau les cellules copiées depuis un tableur quand vous les collez normalement. Si cette option est désactivée, utilisez la commande « Coller en tableau ».',
  'setting.firstRowIsHeader.name': 'La première ligne est l’en-tête',
  'setting.firstRowIsHeader.desc': 'Utilise la première ligne copiée comme en-tête du tableau. Si cette option est désactivée, la ligne d’en-tête reste vide.',
  'setting.alignNumbers.name': 'Aligner les nombres à droite',
  'setting.alignNumbers.desc': 'Aligne une colonne à droite lorsque chacune de ses cellules sous l’en-tête est un nombre.',
  'setting.padColumns.name': 'Aligner les colonnes',
  'setting.padColumns.desc': 'Complète les cellules avec des espaces pour que les colonnes soient alignées dans l’éditeur. Si cette option est désactivée, les tableaux sont compacts.',
  'setting.defaultAlign.name': 'Alignement par défaut des colonnes',
  'setting.defaultAlign.desc':
    'Alignement des colonnes qui ne sont pas des nombres lorsque du texte est converti en tableau. Les colonnes de nombres restent alignées à droite lorsque ce réglage est activé.',
  'option.alignNone': 'Aucun',
  'option.alignLeft': 'Gauche',
  'option.alignCenter': 'Centre',
  'option.alignRight': 'Droite',
};

export default fr;
