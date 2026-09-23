import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  escapeCell,
  findTable,
  inCodeOrFrontmatter,
  isNumber,
  placeBlock,
  splitRow,
  tableRows,
  toMarkdownTable,
} from '../src/markdown.ts';

const FRUIT = [
  ['Name', 'Qty', 'Price'],
  ['Apple', '3', '1.20'],
  ['Pear', '10', '0.5'],
];

test('writes a table with the first row as its header and numbers on the right', () => {
  assert.equal(
    toMarkdownTable(FRUIT),
    [
      '| Name  | Qty | Price |',
      '| ----- | --: | ----: |',
      '| Apple |   3 |  1.20 |',
      '| Pear  |  10 |   0.5 |',
    ].join('\n'),
  );
});

test('compact, left-aligned, with an empty header when asked', () => {
  assert.equal(
    toMarkdownTable(FRUIT, { firstRowIsHeader: false, alignNumbers: false, padColumns: false }),
    ['|  |  |  |', '| --- | --- | --- |', '| Name | Qty | Price |', '| Apple | 3 | 1.20 |', '| Pear | 10 | 0.5 |'].join(
      '\n',
    ),
  );
});

test('escapes pipes and turns line breaks into <br>', () => {
  assert.equal(escapeCell(' a|b '), 'a\\|b');
  assert.equal(escapeCell('two\nlines\r\nhere'), 'two<br>lines<br>here');
});

test('fills short rows so every row has every column', () => {
  assert.equal(
    toMarkdownTable([['a', 'b'], ['c']], { firstRowIsHeader: true, alignNumbers: true, padColumns: false }),
    '| a | b |\n| --- | --- |\n| c |  |',
  );
});

test('a column with any text in it stays on the left', () => {
  const table = toMarkdownTable([
    ['Code', 'Year'],
    ['A1', '2024'],
    ['7', 'n/a'],
  ]);
  assert.match(table.split('\n')[1], /^\| ---- \| ---- \|$/);
});

test('an empty column is not right-aligned', () => {
  assert.equal(toMarkdownTable([['a', 'b'], ['1', '']]).split('\n')[1], '| --: | --- |');
});

test('recognises numbers the way spreadsheets show them', () => {
  for (const n of ['3', '-5', '1.20', '1,234.56', '1.234,56', '12%', '$1,200', '12 €', '(1,234)', '3.5e10', '1 000']) {
    assert.ok(isNumber(n), n);
  }
  for (const s of ['', 'abc', '2024-01-01', '1.2.3', '12:30', 'A1', '1,2,3']) {
    assert.ok(!isNumber(s), s);
  }
});

test('lines up columns by characters, not bytes', () => {
  assert.equal(
    toMarkdownTable([
      ['Café', 'x'],
      ['Tea', 'y'],
    ]).split('\n')[2],
    '| Tea  | y   |',
  );
});

test('splits a table row into its cells', () => {
  assert.deepEqual(splitRow('| a | b |'), [' a ', ' b ']);
  assert.deepEqual(splitRow('a | b'), ['a ', ' b']);
  assert.deepEqual(splitRow('| a |  |'), [' a ', '  ']);
  assert.deepEqual(splitRow('| a \\| b | c |'), [' a \\| b ', ' c ']);
  assert.deepEqual(splitRow('| `x | y` | c |'), [' `x | y` ', ' c ']);
});

test('reads a table back into the rows it came from', () => {
  const rows = [
    ['Name', 'Note'],
    ['a|b', 'two\nlines'],
    ['c', ''],
  ];
  const table = toMarkdownTable(rows);
  assert.deepEqual(tableRows(table.split('\n')), rows);
});

test('finds the table a line belongs to', () => {
  const lines = ['Intro', '', '| a | b |', '| --- | --- |', '| 1 | 2 |', '| 3 | 4 |', '', 'After'];
  assert.deepEqual(findTable(lines, 4), { start: 2, end: 5 });
  assert.deepEqual(findTable(lines, 2), { start: 2, end: 5 });
  assert.equal(findTable(lines, 0), null);
  assert.equal(findTable(lines, 6), null);
  // A line that holds a pipe but has no delimiter row under it.
  assert.equal(findTable(['a | b', 'c | d'], 0), null);
});

test('knows when a paste lands in code or the frontmatter', () => {
  assert.equal(inCodeOrFrontmatter('Text\n```\ncode\n'), true);
  assert.equal(inCodeOrFrontmatter('Text\n```js\ncode\n```\nafter'), false);
  assert.equal(inCodeOrFrontmatter('~~~~\n```\nstill code\n'), true);
  assert.equal(inCodeOrFrontmatter('---\ntitle: x\n'), true);
  assert.equal(inCodeOrFrontmatter('---\ntitle: x\n---\nbody'), false);
  assert.equal(inCodeOrFrontmatter('Just text'), false);
  // An opening fence on the cursor's own line is text being typed after.
  assert.equal(inCodeOrFrontmatter('```'), false);
});

test('puts the table on lines of its own, with blank lines around it', () => {
  const t = '| a |\n| --- |';
  assert.equal(placeBlock(t, '', '', null, null), t);
  assert.equal(placeBlock(t, 'Some text', '', null, null), '\n\n' + t);
  assert.equal(placeBlock(t, '', 'rest', null, null), t + '\n\n');
  assert.equal(placeBlock(t, '', '', 'Paragraph above', 'Paragraph below'), '\n' + t + '\n');
  assert.equal(placeBlock(t, '', '', '', ''), t);
});
