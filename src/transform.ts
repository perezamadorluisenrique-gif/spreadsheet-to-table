// Reshaping a table already in the note: sorting its rows by a column and
// swapping its rows and columns. Cells are kept as Markdown source, so
// escaped pipes, inline code and `<br>` come back exactly as they were.

import { splitRow } from './markdown.ts';

export type Align = 'none' | 'left' | 'center' | 'right';

export interface SourceTable {
  header: string[];
  align: Align[];
  body: string[][];
}

/** Reads the lines of a table (quote markers already removed) into its parts. */
export function readTable(lines: string[]): SourceTable {
  const cells = (line: string) => splitRow(line).map((cell) => cell.trim());
  const header = cells(lines[0]);
  const align = cells(lines[1]).map((cell): Align => {
    const left = cell.startsWith(':');
    const right = cell.endsWith(':');
    return left && right ? 'center' : right ? 'right' : left ? 'left' : 'none';
  });
  const body = lines.slice(2).map(cells);
  const columns = Math.max(header.length, ...body.map((row) => row.length));
  const fill = (row: string[]) => [...row, ...new Array<string>(Math.max(0, columns - row.length)).fill('')];
  return {
    header: fill(header),
    align: [...align, ...new Array<Align>(Math.max(0, columns - align.length)).fill('none')].slice(0, columns),
    body: body.map(fill),
  };
}

function width(text: string): number {
  return Array.from(text).length;
}

/** Writes a table back, keeping each column's alignment; `pad` lines the columns up. */
export function writeTable(table: SourceTable, pad = true): string[] {
  const rows = [table.header, ...table.body];
  const widths = table.header.map((_, c) => (pad ? Math.max(3, ...rows.map((row) => width(row[c] ?? ''))) : 3));
  const line = (row: string[]) =>
    '| ' +
    row
      .map((cell, c) => {
        if (!pad) return cell;
        const space = ' '.repeat(Math.max(0, widths[c] - width(cell)));
        return table.align[c] === 'right' ? space + cell : cell + space;
      })
      .join(' | ') +
    ' |';
  const delimiter =
    '| ' +
    widths
      .map((w, c) => {
        switch (table.align[c]) {
          case 'left':
            return ':' + '-'.repeat(w - 1);
          case 'right':
            return '-'.repeat(w - 1) + ':';
          case 'center':
            return ':' + '-'.repeat(Math.max(1, w - 2)) + ':';
          default:
            return '-'.repeat(w);
        }
      })
      .join(' | ') +
    ' |';
  return [line(table.header), delimiter, ...table.body.map(line)];
}

/**
 * A cell as a number, the way a spreadsheet shows one: `1,234.50`, `12%`,
 * `$40`, `(7)` for minus seven, `1.234,5` with a decimal comma. Null when
 * the cell is not a number.
 */
export function numberValue(cell: string): number | null {
  let text = cell.trim().replace(/[\s\u00a0\u202f'’$€£¥₹%]/g, '').replace(/\u2212/g, '-');
  let sign = 1;
  if (/^\(.*\)$/.test(text)) {
    sign = -1;
    text = text.slice(1, -1);
  }
  if (!/^[-+]?[\d.,]*\d(?:[eE][-+]?\d+)?$/.test(text)) return null;
  const lastDot = text.lastIndexOf('.');
  const lastComma = text.lastIndexOf(',');
  // Whichever separator comes last is the decimal one, unless it is
  // followed by exactly three digits and is the only one of its kind, which
  // is a thousands group: `1,234`.
  const decimal = lastComma > lastDot ? ',' : '.';
  const group = decimal === ',' ? '.' : ',';
  const at = Math.max(lastDot, lastComma);
  const tail = at >= 0 ? text.slice(at + 1).replace(/[eE].*$/, '') : '';
  const once = text.split(decimal).length === 2;
  const isGroup = at >= 0 && tail.length === 3 && once && !text.includes(group);
  text = isGroup ? text.split(decimal).join('') : text.split(group).join('').replace(decimal, '.');
  const n = Number(text);
  return Number.isFinite(n) ? sign * n : null;
}

/** Text as the eye sorts it: case aside, and `item 10` after `item 9`. */
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

/**
 * The body sorted by one column. When every filled cell in the column is a
 * number they sort as numbers, otherwise as text. Empty cells go last in
 * either direction, and rows that compare equal keep their order.
 */
export function sortBody(body: string[][], column: number, descending: boolean): string[][] {
  const filled = body.map((row) => row[column] ?? '').filter((cell) => cell.trim() !== '');
  const numeric = filled.length > 0 && filled.every((cell) => numberValue(cell) !== null);
  const direction = descending ? -1 : 1;
  return body
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const x = (a.row[column] ?? '').trim();
      const y = (b.row[column] ?? '').trim();
      if (x === '' || y === '') return x === y ? a.index - b.index : x === '' ? 1 : -1;
      const order = numeric
        ? (numberValue(x) as number) - (numberValue(y) as number)
        : collator.compare(x.replace(/[*_`~]/g, ''), y.replace(/[*_`~]/g, ''));
      return order !== 0 ? order * direction : a.index - b.index;
    })
    .map(({ row }) => row);
}

/**
 * Rows become columns: the first column becomes the header row. Alignment
 * does not survive the swap, since it belonged to the old columns.
 */
export function transpose(table: SourceTable): SourceTable {
  const rows = [table.header, ...table.body];
  const columns = rows[0].length;
  const swapped: string[][] = [];
  for (let c = 0; c < columns; c++) swapped.push(rows.map((row) => row[c] ?? ''));
  return {
    header: swapped[0],
    align: swapped[0].map((): Align => 'none'),
    body: swapped.slice(1),
  };
}

/**
 * Which column a cursor at `ch` on a table line is in: the number of
 * unescaped pipes before it, less a leading one.
 */
export function columnAt(line: string, ch: number): number {
  const before = line.slice(0, ch);
  const cells = splitRow(before + 'x');
  return Math.max(0, cells.length - 1);
}
