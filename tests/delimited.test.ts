import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parseDelimited, readAnyDelimited, spreadsheetRows, toTsv } from '../src/delimited.ts';

test('reads tab-separated cells with any line ending', () => {
  const want = [
    ['Name', 'Qty'],
    ['Apple', '3'],
  ];
  assert.deepEqual(parseDelimited('Name\tQty\nApple\t3', '\t'), want);
  assert.deepEqual(parseDelimited('Name\tQty\r\nApple\t3\r\n', '\t'), want);
  assert.deepEqual(parseDelimited('Name\tQty\rApple\t3\r', '\t'), want);
});

test('keeps empty cells, including trailing ones', () => {
  assert.deepEqual(parseDelimited('a\t\tc\n\t\t\n', '\t'), [
    ['a', '', 'c'],
    ['', '', ''],
  ]);
});

test('reads a quoted cell that spans lines, as Excel and Google Sheets copy one', () => {
  const copied = 'Item\tNote\r\nTea\t"two\nlines"\r\nCake\t"says ""hi"""\r\n';
  assert.deepEqual(parseDelimited(copied, '\t'), [
    ['Item', 'Note'],
    ['Tea', 'two\nlines'],
    ['Cake', 'says "hi"'],
  ]);
});

test('keeps quotes that are part of the text, not around it', () => {
  assert.deepEqual(parseDelimited('"Hi" she said\tx', '\t'), [['"Hi" she said', 'x']]);
  assert.deepEqual(parseDelimited('5" pipe\tx', '\t'), [['5" pipe', 'x']]);
});

test('an unclosed quote is read as a plain character', () => {
  assert.deepEqual(parseDelimited('"open\tx\ny\tz', '\t'), [
    ['"open', 'x'],
    ['y', 'z'],
  ]);
});

test('recognises cells copied from a spreadsheet', () => {
  assert.deepEqual(spreadsheetRows('Name\tQty\nApple\t3\n'), [
    ['Name', 'Qty'],
    ['Apple', '3'],
  ]);
});

test('drops the empty rows a copied selection ends with', () => {
  assert.deepEqual(spreadsheetRows('a\tb\nc\td\n\t\n'), [
    ['a', 'b'],
    ['c', 'd'],
  ]);
});

test('leaves ordinary pastes alone', () => {
  // No tabs at all.
  assert.equal(spreadsheetRows('Just a sentence.\nAnd another.'), null);
  // One row is not a table: two words with a tab between them.
  assert.equal(spreadsheetRows('a\tb'), null);
  // Rows of different widths: prose with a stray tab.
  assert.equal(spreadsheetRows('Intro\tline\nmore prose here\n'), null);
  // Code indented with tabs: the first column is empty on every line.
  assert.equal(spreadsheetRows('\tif (x) {\n\treturn 1;\n'), null);
  assert.equal(spreadsheetRows(''), null);
});

test('a quoted cell with a tab in it is still one cell', () => {
  assert.deepEqual(spreadsheetRows('a\t"b\tc"\nd\te\n'), [
    ['a', 'b\tc'],
    ['d', 'e'],
  ]);
});

test('reads CSV and semicolon-separated text when asked to', () => {
  assert.deepEqual(readAnyDelimited('name,qty\n"Smith, J",2\n'), {
    rows: [
      ['name', 'qty'],
      ['Smith, J', '2'],
    ],
    delimiter: ',',
  });
  assert.deepEqual(readAnyDelimited('name;price\nTea;1,50\n')?.delimiter, ';');
});

test('prefers tabs over commas inside the cells', () => {
  assert.deepEqual(readAnyDelimited('a, b\tc\nd\te, f')?.rows, [
    ['a, b', 'c'],
    ['d', 'e, f'],
  ]);
});

test('text with no delimiter becomes one column', () => {
  assert.deepEqual(readAnyDelimited('one\ntwo\nthree\n'), {
    rows: [['one'], ['two'], ['three']],
    delimiter: null,
  });
  assert.equal(readAnyDelimited('  \n'), null);
});

test('writes tab-separated text a spreadsheet splits back into cells', () => {
  assert.equal(
    toTsv([
      ['a', 'b'],
      ['two\nlines', 'says "hi"'],
    ]),
    'a\tb\n"two\nlines"\t"says ""hi"""',
  );
});

test('what it writes, it reads back unchanged', () => {
  const rows = [
    ['Item', 'Note'],
    ['Tea', 'two\nlines\twith a tab'],
    ['"Quoted"', ''],
  ];
  assert.deepEqual(parseDelimited(toTsv(rows), '\t'), rows);
});
