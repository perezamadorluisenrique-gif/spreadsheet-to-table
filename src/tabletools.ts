// Row and column edits on a table read with `readTable`. Each returns the
// changed table and where the cursor should land, or a reason it refused.
// `row` is the table line: 0 header, 1 the delimiter row, 2 and on the body.

import type { Align, SourceTable } from './transform.ts';

export interface Edit {
  table: SourceTable;
  /** Table line and column the cursor goes to. */
  row: number;
  column: number;
}
export type Outcome = Edit | { error: string };

export function isError(outcome: Outcome): outcome is { error: string } {
  return 'error' in outcome;
}

const blankRow = (columns: number) => new Array<string>(columns).fill('');
const columnsOf = (table: SourceTable) => table.header.length;

/** The body index of a table line, or -1 for the header and the delimiter row. */
const bodyIndex = (row: number) => row - 2;

export function insertRow(table: SourceTable, row: number, where: 'above' | 'below'): Outcome {
  const at = bodyIndex(row);
  if (at < 0 && where === 'above') return { error: 'A row cannot go above the header.' };
  const index = at < 0 ? 0 : where === 'above' ? at : at + 1;
  const body = [...table.body];
  body.splice(index, 0, blankRow(columnsOf(table)));
  return { table: { ...table, body }, row: index + 2, column: 0 };
}

export function deleteRow(table: SourceTable, row: number, column: number): Outcome {
  const at = bodyIndex(row);
  if (at < 0) return { error: 'The header row cannot be deleted.' };
  if (table.body.length <= 1) return { error: 'The last row of a table cannot be deleted.' };
  const body = table.body.filter((_, i) => i !== at);
  return { table: { ...table, body }, row: Math.min(at, body.length - 1) + 2, column };
}

export function moveRow(table: SourceTable, row: number, direction: 'up' | 'down', column: number): Outcome {
  const at = bodyIndex(row);
  if (at < 0) return { error: 'The header row cannot be moved.' };
  const to = direction === 'up' ? at - 1 : at + 1;
  if (to < 0) return { error: 'The row is already the first one below the header.' };
  if (to >= table.body.length) return { error: 'The row is already the last one.' };
  const body = [...table.body];
  [body[at], body[to]] = [body[to], body[at]];
  return { table: { ...table, body }, row: to + 2, column };
}

function mapColumns(table: SourceTable, change: <T>(cells: T[], blank: T) => T[]): SourceTable {
  return {
    header: change(table.header, ''),
    align: change<Align>(table.align, 'none'),
    body: table.body.map((cells) => change(cells, '')),
  };
}

export function insertColumn(table: SourceTable, column: number, where: 'left' | 'right', row = 0): Outcome {
  const index = where === 'left' ? column : column + 1;
  const changed = mapColumns(table, (cells, blank) => {
    const copy = [...cells];
    copy.splice(index, 0, blank);
    return copy;
  });
  return { table: changed, row, column: index };
}

export function deleteColumn(table: SourceTable, column: number, row: number): Outcome {
  if (columnsOf(table) <= 1) return { error: 'The last column of a table cannot be deleted.' };
  const changed = mapColumns(table, (cells) => cells.filter((_, i) => i !== column));
  return { table: changed, row: Math.max(row, 0), column: Math.min(column, columnsOf(changed) - 1) };
}

export function moveColumn(table: SourceTable, column: number, direction: 'left' | 'right', row: number): Outcome {
  const to = direction === 'left' ? column - 1 : column + 1;
  if (to < 0) return { error: 'The column is already the first one.' };
  if (to >= columnsOf(table)) return { error: 'The column is already the last one.' };
  const changed = mapColumns(table, (cells) => {
    const copy = [...cells];
    [copy[column], copy[to]] = [copy[to], copy[column]];
    return copy;
  });
  return { table: changed, row, column: to };
}

export function setAlignment(table: SourceTable, column: number, align: Align, row: number): Outcome {
  if (table.align[column] === align) {
    return { error: align === 'none' ? 'The column has no alignment already.' : `The column is already aligned ${align}.` };
  }
  const alignment = [...table.align];
  alignment[column] = align;
  return { table: { ...table, align: alignment }, row, column };
}

/**
 * Where in a written table line the cursor goes for a cell: just inside its
 * left pipe.
 */
export function cellStart(line: string, column: number): number {
  let pipes = 0;
  let code = 0;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '\\') {
      i++;
    } else if (ch === '`') {
      let run = 1;
      while (line[i + run] === '`') run++;
      code = code === 0 ? run : code === run ? 0 : code;
      i += run - 1;
    } else if (ch === '|' && code === 0) {
      if (pipes === column) return Math.min(line.length, line[i + 1] === ' ' ? i + 2 : i + 1);
      pipes++;
    }
  }
  return line.length;
}
