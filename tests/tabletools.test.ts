import assert from 'node:assert/strict';
import test from 'node:test';

import {
  cellStart, deleteColumn, deleteRow, insertColumn, insertRow, isError, moveColumn, moveRow, setAlignment,
} from '../src/tabletools.ts';
import type { Edit, Outcome } from '../src/tabletools.ts';
import { readTable, writeTable } from '../src/transform.ts';

const T = () => readTable(['| a | b |', '| :-- | --: |', '| 1 | 2 |', '| 3 | 4 |']);
const ok = (o: Outcome): Edit => {
  assert.ok(!isError(o), isError(o) ? o.error : '');
  return o as Edit;
};
const text = (o: Outcome) => writeTable(ok(o).table, false);

test('insert row above/below a body row', () => {
  assert.deepEqual(text(insertRow(T(), 2, 'above')), ['| a | b |', '| :-- | --: |', '|  |  |', '| 1 | 2 |', '| 3 | 4 |']);
  const below = ok(insertRow(T(), 2, 'below'));
  assert.equal(below.row, 3);
  assert.deepEqual(below.table.body, [['1', '2'], ['', ''], ['3', '4']]);
});

test('insert row from the header or the delimiter goes first; above the header is refused', () => {
  assert.deepEqual(ok(insertRow(T(), 0, 'below')).table.body[0], ['', '']);
  assert.deepEqual(ok(insertRow(T(), 1, 'below')).table.body[0], ['', '']);
  assert.ok(isError(insertRow(T(), 0, 'above')));
  assert.ok(isError(insertRow(T(), 1, 'above')));
});

test('delete row: refuses header, delimiter and the only body row', () => {
  assert.ok(isError(deleteRow(T(), 0, 0)));
  assert.ok(isError(deleteRow(T(), 1, 0)));
  const r = ok(deleteRow(T(), 2, 1));
  assert.deepEqual(r.table.body, [['3', '4']]);
  assert.equal(r.row, 2);
  assert.ok(isError(deleteRow(r.table, 2, 0)));
  assert.equal(ok(deleteRow(T(), 3, 0)).row, 2);
});

test('move row stays below the header and at the edges refuses', () => {
  assert.ok(isError(moveRow(T(), 0, 'down', 0)));
  assert.ok(isError(moveRow(T(), 2, 'up', 0)));
  assert.ok(isError(moveRow(T(), 3, 'down', 0)));
  const m = ok(moveRow(T(), 3, 'up', 1));
  assert.deepEqual(m.table.body, [['3', '4'], ['1', '2']]);
  assert.deepEqual([m.row, m.column], [2, 1]);
});

test('insert column keeps alignment in step', () => {
  const l = ok(insertColumn(T(), 1, 'left'));
  assert.deepEqual(l.table.header, ['a', '', 'b']);
  assert.deepEqual(l.table.align, ['left', 'none', 'right']);
  assert.deepEqual(l.table.body[0], ['1', '', '2']);
  assert.equal(l.column, 1);
  const r = ok(insertColumn(T(), 1, 'right'));
  assert.deepEqual(r.table.header, ['a', 'b', '']);
  assert.equal(r.column, 2);
});

test('delete column refuses the last one and moves the cursor into a neighbour', () => {
  const d = ok(deleteColumn(T(), 1, 2));
  assert.deepEqual(d.table.header, ['a']);
  assert.deepEqual(d.table.align, ['left']);
  assert.equal(d.column, 0);
  assert.ok(isError(deleteColumn(d.table, 0, 2)));
});

test('move column moves alignment with it; edges refuse', () => {
  const m = ok(moveColumn(T(), 0, 'right', 3));
  assert.deepEqual(m.table.header, ['b', 'a']);
  assert.deepEqual(m.table.align, ['right', 'left']);
  assert.deepEqual(m.table.body[1], ['4', '3']);
  assert.equal(m.column, 1);
  assert.ok(isError(moveColumn(T(), 0, 'left', 0)));
  assert.ok(isError(moveColumn(T(), 1, 'right', 0)));
});

test('set alignment', () => {
  assert.deepEqual(ok(setAlignment(T(), 0, 'center', 0)).table.align, ['center', 'right']);
  assert.deepEqual(ok(setAlignment(T(), 0, 'none', 0)).table.align, ['none', 'right']);
  assert.ok(isError(setAlignment(T(), 0, 'left', 0)));
});

test('cellStart finds the cell after its pipe, skipping escaped pipes and code', () => {
  const line = '| a \\| b | `x|y` | c |';
  assert.equal(cellStart(line, 0), 2);
  assert.equal(line.slice(cellStart(line, 1)), '`x|y` | c |');
  assert.equal(line.slice(cellStart(line, 2)), 'c |');
  assert.equal(cellStart('|  |  |', 1), 5);
});
