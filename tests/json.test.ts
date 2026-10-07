import assert from 'node:assert/strict';
import test from 'node:test';

import { jsonToRows } from '../src/json.ts';

test('array of objects: keys are the header, first-seen order', () => {
  assert.deepEqual(jsonToRows('[{"a":1,"b":"x"},{"b":"y","c":true}]'), [['a', 'b', 'c'], ['1', 'x', ''], ['', 'y', 'true']]);
});

test('null, nested values and a key called __proto__', () => {
  assert.deepEqual(jsonToRows('[{"n":null,"o":{"k":1},"l":[1,2]}]'), [['n', 'o', 'l'], ['', '{"k":1}', '[1,2]']]);
  assert.deepEqual(jsonToRows('[{"__proto__":"p"}]'), [['__proto__'], ['p']]);
});

test('array of arrays', () => {
  assert.deepEqual(jsonToRows('[["a","b"],[1,2]]'), [['a', 'b'], ['1', '2']]);
});

test('anything else is not a table', () => {
  for (const text of ['', 'not json', '{"a":1}', '[]', '[1,2]', '[{}]', '[{"a":1}, 2]', '"x"']) {
    assert.equal(jsonToRows(text), null, text);
  }
});
