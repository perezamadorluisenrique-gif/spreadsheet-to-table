/**
 * Round trips that hold for any cells: rows to a Markdown table and back,
 * to tab- and comma-separated text and back, and the table edits that undo
 * each other. Cells come from a seeded generator full of pipes, backslashes,
 * backticks, quotes, delimiters and line breaks; tables also come from the
 * hand-written notes in `markdown-samples.ts`.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { parseDelimited, spreadsheetRows, toCsv, toTsv } from '../src/delimited.ts';
import type { Rows } from '../src/delimited.ts';
import { DEFAULT_TABLE_OPTIONS, findTable, tableRows, toMarkdownTable, unquote } from '../src/markdown.ts';
import { cellStart, deleteColumn, insertColumn, isError, moveColumn, moveRow } from '../src/tabletools.ts';
import type { Outcome } from '../src/tabletools.ts';
import { columnAt, readTable, sortBody, transpose, writeTable } from '../src/transform.ts';
import { SAMPLES, pick, rng } from './markdown-samples.ts';

const CELLS = [
  'a', 'Name', '42', '1,234.50', '-3', '$5', '12%', '', ' ', 'a|b', '`a|b`', 'a`b', "it`s", '``x`y``', 'x\\', '\\',
  'back\\slash', 'a\\|b', '"q"', 'say "hi"', 'a,b', 'a;b', 'tab\there', 'line\nbreak', '中文', '😀', 'café', '**b**',
  '[[Note|alias]]', '[l](u)', '<b>x</b>', '#', '---', ':--', 'x  y', '=1+2',
];

function randomRows(seed: number): Rows {
  const random = rng(seed);
  const rows = 1 + Math.floor(random() * 5);
  const columns = 1 + Math.floor(random() * 4);
  return Array.from({ length: rows }, () => Array.from({ length: columns }, () => pick(random, CELLS)));
}

const ROWS = Array.from({ length: 3000 }, (_, i) => randomRows(i + 1));

const ok = (outcome: Outcome) => {
  if (isError(outcome)) throw new Error(outcome.error);
  return outcome;
};

test('rows written as a table read back as the same cells', () => {
  for (const [i, rows] of ROWS.entries()) {
    for (const padColumns of [true, false]) {
      const lines = toMarkdownTable(rows, { ...DEFAULT_TABLE_OPTIONS, padColumns }).split('\n');
      assert.deepEqual(tableRows(lines), rows.map((row) => row.map((cell) => cell.trim())), `seed ${i + 1}`);
      assert.deepEqual(findTable(lines, lines.length - 1), { start: 0, end: lines.length - 1 }, `seed ${i + 1}`);
    }
  }
});

test('the cursor lands in the cell it is put in', () => {
  for (const [i, rows] of ROWS.entries()) {
    const lines = toMarkdownTable(rows).split('\n');
    lines.forEach((line, row) => {
      if (row === 1) return;
      rows[0].forEach((_, column) => assert.equal(columnAt(line, cellStart(line, column) + 1), column, `seed ${i + 1}: ${line}`));
    });
  }
});

test('tab- and comma-separated text reads back as the same rows', () => {
  for (const [i, rows] of ROWS.entries()) {
    // One empty cell alone on the last line is a trailing line break.
    if (rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === '') continue;
    assert.deepEqual(parseDelimited(toTsv(rows), '\t'), rows, `seed ${i + 1}`);
    assert.deepEqual(parseDelimited(toCsv(rows), ','), rows, `seed ${i + 1}`);
    assert.deepEqual(parseDelimited(toCsv(rows, ';'), ';'), rows, `seed ${i + 1}`);
    if (rows.length >= 2 && rows[0].length >= 2 && rows.every((row) => row[0].trim() !== '')) {
      assert.deepEqual(spreadsheetRows(toTsv(rows)), rows, `seed ${i + 1}`);
    }
  }
});

/** Every table in the samples and in the generated rows, as its lines. */
function tables(): string[][] {
  const out: string[][] = ROWS.slice(0, 500).map((rows) => toMarkdownTable(rows).split('\n'));
  for (const note of Object.values(SAMPLES)) {
    const lines = note.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const found = findTable(lines, i);
      if (!found) continue;
      out.push(lines.slice(found.start, found.end + 1).map(unquote));
      i = found.end;
    }
  }
  return out;
}

test('rewriting a table is stable, and reading it back gives the same table', () => {
  for (const lines of tables()) {
    const table = readTable(lines);
    const written = writeTable(table);
    assert.deepEqual(readTable(written), table, lines.join('\n'));
    assert.deepEqual(writeTable(readTable(written)), written, lines.join('\n'));
  }
});

test('table edits undo each other', () => {
  for (const lines of tables()) {
    const table = readTable(lines);
    const twice = transpose(transpose(table));
    assert.deepEqual([twice.header, ...twice.body], [table.header, ...table.body], lines.join('\n'));
    if (table.body.length > 1) {
      const down = ok(moveRow(table, 2, 'down', 0));
      assert.deepEqual(ok(moveRow(down.table, down.row, 'up', 0)).table, table, lines.join('\n'));
    }
    if (table.header.length > 1) {
      const right = ok(moveColumn(table, 0, 'right', 0));
      assert.deepEqual(ok(moveColumn(right.table, right.column, 'left', 0)).table, table, lines.join('\n'));
    }
    const inserted = ok(insertColumn(table, 0, 'right'));
    assert.deepEqual(ok(deleteColumn(inserted.table, inserted.column, 0)).table, table, lines.join('\n'));
    table.header.forEach((_, column) => {
      const sorted = sortBody(table.body, column, false);
      assert.deepEqual(sortBody(sorted, column, false), sorted, lines.join('\n'));
      assert.equal(sorted.length, table.body.length);
    });
  }
});
