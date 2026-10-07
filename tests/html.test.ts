import assert from 'node:assert/strict';
import test from 'node:test';

import { escapeHtml, inlineToHtml, inlineToText, tableToHtml, tableToPlainRows } from '../src/html.ts';
import { readTable } from '../src/transform.ts';

test('escapes HTML everywhere', () => {
  assert.equal(inlineToHtml('<script>alert("x")</script> & \'y\''), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;');
  assert.equal(escapeHtml('<&>'), '&lt;&amp;&gt;');
  assert.equal(inlineToHtml('`<b>`'), '<code>&lt;b&gt;</code>');
});

test('bold, italic, strike, highlight and code', () => {
  assert.equal(inlineToHtml('**bold** and *it* and _it2_ and ~~gone~~ and ==hi=='),
    '<strong>bold</strong> and <em>it</em> and <em>it2</em> and <del>gone</del> and <mark>hi</mark>');
  assert.equal(inlineToHtml('**a *b* c**'), '<strong>a <em>b</em> c</strong>');
  assert.equal(inlineToHtml('use `a*b*c` here'), 'use <code>a*b*c</code> here');
  assert.equal(inlineToHtml('**bold with `*` code**'), '<strong>bold with <code>*</code> code</strong>');
});

test('leaves unmatched marks and snake_case alone', () => {
  assert.equal(inlineToHtml('2 * 3 * 4'), '2 * 3 * 4');
  assert.equal(inlineToHtml('a_b_c and *open'), 'a_b_c and *open');
  assert.equal(inlineToHtml('\\*literal\\*'), '*literal*');
});

test('links: http and mailto become anchors, unsafe targets only their label', () => {
  assert.equal(inlineToHtml('[a & b](https://x.com/?q=1&r="2")'), '<a href="https://x.com/?q=1&amp;r=&quot;2&quot;">a &amp; b</a>');
  assert.equal(inlineToHtml('[click](javascript:alert(1))'), 'click');
  assert.equal(inlineToHtml('[m](mailto:a@b.co)'), '<a href="mailto:a@b.co">m</a>');
  assert.equal(inlineToHtml('[[Note|alias]] and [[Plain]] and ![[img.png]]'), 'alias and Plain and img.png');
  assert.equal(inlineToHtml('[**b**](https://x.com)'), '<a href="https://x.com"><strong>b</strong></a>');
});

test('line breaks and plain text', () => {
  assert.equal(inlineToHtml('a<br>b'), 'a<br>b');
  assert.equal(inlineToText('**b** [l](https://x.com) `c` a<br>b'), 'b l c a\nb');
});

test('table: th header, alignment style, escaped pipes', () => {
  const t = readTable(['| Name | Qty |', '| :--- | --: |', '| **A** \\| B | 3 |']);
  const html = tableToHtml(t);
  assert.ok(html.startsWith('<table'));
  assert.ok(html.includes('<th style="') && html.includes('text-align:left;">Name</th>'));
  assert.ok(html.includes('text-align:right;">Qty</th>'));
  assert.ok(html.includes('<td style="border:1px solid #999;padding:4px 8px;border-collapse:collapse;vertical-align:top;text-align:left;"><strong>A</strong> | B</td>'));
  assert.equal(html.match(/<tr>/g)?.length, 2);
});

test('table without alignment has no text-align', () => {
  const html = tableToHtml(readTable(['| a |', '| --- |', '| b |']));
  assert.ok(!html.includes('text-align'));
});

test('plain rows strip the marks', () => {
  const t = readTable(['| **a** | b |', '| --- | --- |', '| `x` \\| y | [l](https://x.com) |']);
  assert.deepEqual(tableToPlainRows(t), [['a', 'b'], ['x | y', 'l']]);
});
