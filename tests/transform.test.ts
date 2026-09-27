import assert from 'node:assert/strict';
import test from 'node:test';

import { columnAt, numberValue, readTable, sortBody, transpose, writeTable } from '../src/transform.ts';

const TABLE = [
  '| Name   | Qty | Price |',
  '| :----- | --: | :---: |',
  '| pear   |  10 |  0.5  |',
  '| Apple  |   3 | 1.20  |',
  '| item 10 | 2 | `a\\|b` |',
  '| item 9 |     | 7 |',
];

test('reads cells, alignment and ragged rows', () => {
  const t = readTable(['| a | b |', '|---|--:|', '| 1 |', '| 2 | 3 | 4 |']);
  assert.deepEqual(t.header, ['a', 'b', '']);
  assert.deepEqual(t.align, ['none', 'right', 'none']);
  assert.deepEqual(t.body, [['1', '', ''], ['2', '3', '4']]);
});

test('writes back with alignment kept and columns lined up', () => {
  assert.deepEqual(writeTable(readTable(['| a | bb |', '| :-: | --: |', '| xxxx | 1 |'])), [
    '| a    |  bb |',
    '| :--: | --: |',
    '| xxxx |   1 |',
  ]);
});

test('numbers as spreadsheets write them', () => {
  assert.equal(numberValue('1,234.50'), 1234.5);
  assert.equal(numberValue('1.234,5'), 1234.5);
  assert.equal(numberValue('1,234'), 1234);
  assert.equal(numberValue('0,5'), 0.5);
  assert.equal(numberValue('$40'), 40);
  assert.equal(numberValue('12%'), 12);
  assert.equal(numberValue('(7)'), -7);
  assert.equal(numberValue('−3'), -3);
  assert.equal(numberValue('1e3'), 1000);
  assert.equal(numberValue('v2'), null);
  assert.equal(numberValue('2024-01-05'), null);
});

test('sorts text naturally, ignoring case and emphasis', () => {
  const t = readTable(TABLE);
  assert.deepEqual(sortBody(t.body, 0, false).map((r) => r[0]), ['Apple', 'item 9', 'item 10', 'pear']);
  assert.deepEqual(sortBody(t.body, 0, true).map((r) => r[0]), ['pear', 'item 10', 'item 9', 'Apple']);
  assert.deepEqual(sortBody([['**b**'], ['a']], 0, false), [['a'], ['**b**']]);
});

test('sorts numbers as numbers, empty cells last either way', () => {
  const t = readTable(TABLE);
  assert.deepEqual(sortBody(t.body, 1, false).map((r) => r[1]), ['2', '3', '10', '']);
  assert.deepEqual(sortBody(t.body, 1, true).map((r) => r[1]), ['10', '3', '2', '']);
});

test('equal keys keep their order', () => {
  assert.deepEqual(sortBody([['a', '1'], ['A', '2'], ['a', '3']], 0, false).map((r) => r[1]), ['1', '2', '3']);
});

test('transpose turns the first column into the header', () => {
  const t = transpose(readTable(['| k | x | y |', '|---|---|---|', '| a | 1 | 2 |']));
  assert.deepEqual(t, { header: ['k', 'a'], align: ['none', 'none'], body: [['x', '1'], ['y', '2']] });
});

test('keeps escaped pipes and code as source', () => {
  const out = writeTable(readTable(TABLE));
  assert.ok(out[4].includes('`a\\|b`'), out[4]);
});

test('column under the cursor', () => {
  const line = '| Name | Qty | a\\|b |';
  assert.equal(columnAt(line, 0), 0);
  assert.equal(columnAt(line, 3), 0);
  assert.equal(columnAt(line, 9), 1);
  assert.equal(columnAt(line, 17), 2);
});
