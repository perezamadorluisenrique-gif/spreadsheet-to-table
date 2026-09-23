// Reading copied cells and delimited text into rows, and writing rows back
// out as tab-separated text a spreadsheet will split into cells.
//
// Spreadsheets put two things on the clipboard when cells are copied: an HTML
// table and a plain-text version with a tab between cells and a line break
// between rows. The plain text is what this reads. Excel, Google Sheets,
// Numbers and LibreOffice Calc all quote a cell that holds a tab, a line break
// or a double quote, the way CSV does, so a cell can span lines.

export type Rows = string[][];

export type Delimiter = '\t' | ',' | ';';

/** Tried in this order when the delimiter is not known. */
const DELIMITERS: Delimiter[] = ['\t', ',', ';'];

/**
 * Splits text into rows of cells.
 *
 * With `quotes`, a cell that starts with `"` runs to the matching `"`, and
 * `""` inside it is one quote: the convention every spreadsheet uses when it
 * copies. Without it, quotes are ordinary characters.
 *
 * Line endings may be `\n`, `\r\n` or `\r`. One trailing line break is the
 * end of the last row, not an empty row after it.
 */
export function parseDelimited(text: string, delimiter: Delimiter, quotes = true): Rows {
  const rows: Rows = [];
  let row: string[] = [];
  let cell = '';
  let i = 0;
  const n = text.length;

  const endCell = () => {
    row.push(cell);
    cell = '';
  };
  const endRow = () => {
    endCell();
    rows.push(row);
    row = [];
  };

  while (i < n) {
    const ch = text[i];
    if (quotes && ch === '"' && cell === '') {
      // A quoted cell. It ends at a quote that is not doubled.
      const start = i;
      i++;
      let closed = false;
      while (i < n) {
        if (text[i] === '"') {
          if (text[i + 1] === '"') {
            cell += '"';
            i += 2;
            continue;
          }
          i++;
          closed = true;
          break;
        }
        cell += text[i++];
      }
      if (!closed) {
        // Never closed: this was not a quoted cell after all. Read the rest
        // with quotes as plain characters, which is the caller's cue.
        return parseDelimited(text, delimiter, false);
      }
      const next = text[i];
      if (i < n && next !== delimiter && next !== '\r' && next !== '\n') {
        // Text straight after the closing quote, as in `"Hi" she said`: the
        // quotes were part of the cell, not around it. Keep it as written.
        cell = text.slice(start, i);
      }
      continue;
    }
    if (ch === delimiter) {
      endCell();
      i++;
    } else if (ch === '\r' || ch === '\n') {
      endRow();
      i += ch === '\r' && text[i + 1] === '\n' ? 2 : 1;
    } else {
      cell += ch;
      i++;
    }
  }
  // Text that does not end in a line break still has a last row to close.
  if (cell !== '' || row.length > 0) endRow();
  return rows;
}

/** Every row has the same number of cells, and there are at least `min`. */
function rectangular(rows: Rows, min: number): boolean {
  if (rows.length === 0) return false;
  const width = rows[0].length;
  return width >= min && rows.every((row) => row.length === width);
}

/** Drops rows that are entirely empty at the end, as a copied selection often has. */
function trimTrailingEmptyRows(rows: Rows): Rows {
  let end = rows.length;
  while (end > 0 && rows[end - 1].every((cell) => cell.trim() === '')) end--;
  return rows.slice(0, end);
}

/**
 * Reads text as tab-separated cells, trying the spreadsheet quoting first and
 * plain splitting second, and keeps whichever gives every row the same
 * number of cells.
 */
function readRectangular(text: string, delimiter: Delimiter, minColumns: number): Rows | null {
  for (const quotes of [true, false]) {
    const rows = trimTrailingEmptyRows(parseDelimited(text, delimiter, quotes));
    if (rectangular(rows, minColumns)) return rows;
  }
  return null;
}

/**
 * Whether pasted plain text looks like cells copied from a spreadsheet, and
 * if so, its rows.
 *
 * This runs on every paste, so it is strict. It wants at least two rows and
 * two columns, a tab between cells, the same number of cells on every row,
 * and something in the first column. The last rule is what keeps a block of
 * code indented with tabs, where the first "column" is empty on every line,
 * from turning into a table.
 */
export function spreadsheetRows(text: string): Rows | null {
  if (!text.includes('\t')) return null;
  const rows = readRectangular(text, '\t', 2);
  if (!rows || rows.length < 2) return null;
  if (rows.every((row) => row[0].trim() === '')) return null;
  return rows;
}

/**
 * Reads text whose delimiter is unknown: tabs, then commas, then semicolons.
 * The first that splits every line into the same number of cells wins.
 * Used on demand, so a single column or a single row is accepted.
 */
export function readAnyDelimited(text: string): { rows: Rows; delimiter: Delimiter | null } | null {
  if (text.trim() === '') return null;
  for (const delimiter of DELIMITERS) {
    if (!text.includes(delimiter)) continue;
    const rows = readRectangular(text, delimiter, 2);
    if (rows) return { rows, delimiter };
  }
  // No delimiter splits it evenly: each line is a row of one cell.
  const rows = trimTrailingEmptyRows(parseDelimited(text, '\t', false).map((row) => [row.join('\t')]));
  return rows.length ? { rows, delimiter: null } : null;
}

/**
 * Tab-separated text that a spreadsheet pastes back into separate cells.
 * A cell holding a tab, a line break or a double quote is quoted, with its
 * quotes doubled, which is how the spreadsheets themselves copy one.
 */
export function toTsv(rows: Rows): string {
  return rows
    .map((row) => row.map((cell) => (/[\t\r\n"]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell)).join('\t'))
    .join('\n');
}
