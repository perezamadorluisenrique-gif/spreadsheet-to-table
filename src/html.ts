// A table as HTML, for pasting into Google Docs, Word or an email, where it
// arrives as a real table rather than as pipes. Cells are Markdown source
// (the pipes already unescaped by the caller), so inline Markdown is turned
// into tags, and everything else is escaped: nothing in a note can inject
// markup into the clipboard.

import type { SourceTable } from './transform.ts';

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const ESCAPABLE = /[\\`*_{}[\]()#+\-.!|~=<>$%^&"']/;

/** A link target that is safe to put in an `href`, or null. */
export function safeHref(url: string): string | null {
  const target = url.trim().replace(/^<(.*)>$/, '$1');
  if (/^(https?:|mailto:)/i.test(target)) return target;
  return null;
}

/** The index of the closing `marker` for an opener that ends at `from`, or -1. */
function findClose(text: string, marker: string, from: number): number {
  let i = from;
  while (i < text.length) {
    if (text[i] === '\\') {
      i += 2;
      continue;
    }
    if (text[i] === '`') {
      // A code span hides any marker inside it.
      let run = 1;
      while (text[i + run] === '`') run++;
      const end = text.indexOf('`'.repeat(run), i + run);
      i = end === -1 ? i + run : end + run;
      continue;
    }
    if (text.startsWith(marker, i)) {
      const single = marker.length === 1;
      // A lone `*` must not be half of a `**`.
      if (!single || (text[i + 1] !== marker && text[i - 1] !== marker)) {
        if (i > from && !/\s/.test(text[i - 1])) return i;
      }
    }
    i++;
  }
  return -1;
}

/** Inline Markdown as HTML, or as plain text when `html` is false. */
function inline(text: string, html: boolean): string {
  const tag = (name: string, inner: string) => (html ? `<${name}>${inner}</${name}>` : inner);
  const esc = (s: string) => (html ? escapeHtml(s) : s);
  let out = '';
  let i = 0;
  while (i < text.length) {
    const rest = text.slice(i);
    const ch = text[i];
    let m: RegExpExecArray | null;

    if (ch === '\\' && i + 1 < text.length && ESCAPABLE.test(text[i + 1])) {
      out += esc(text[i + 1]);
      i += 2;
      continue;
    }
    if (ch === '`') {
      let run = 1;
      while (text[i + run] === '`') run++;
      const end = text.indexOf('`'.repeat(run), i + run);
      if (end !== -1 && text[end + run] !== '`') {
        out += tag('code', esc(text.slice(i + run, end).trim()));
        i = end + run;
        continue;
      }
      out += esc('`'.repeat(run));
      i += run;
      continue;
    }
    if ((m = /^<br\s*\/?>/i.exec(rest))) {
      out += html ? '<br>' : '\n';
      i += m[0].length;
      continue;
    }
    // Embeds and wikilinks: show the alias, else the target.
    if ((m = /^!?\[\[([^\]|]*)(?:\|([^\]]*))?\]\]/.exec(rest))) {
      out += esc((m[2] ?? m[1]).trim());
      i += m[0].length;
      continue;
    }
    if ((ch === '[' || (ch === '!' && text[i + 1] === '[')) && (m = /^(!?)\[([^\]]*)\]\(((?:[^()\s]|\([^()\s]*\))*)(?:\s+"[^"]*")?\)/.exec(rest))) {
      const label = inline(m[2], html);
      const href = m[1] ? null : safeHref(m[3]);
      out += href && html ? `<a href="${escapeHtml(href)}">${label}</a>` : label;
      i += m[0].length;
      continue;
    }
    // Emphasis, strongest marker first.
    let done = false;
    for (const [marker, name] of [['**', 'strong'], ['__', 'strong'], ['~~', 'del'], ['==', 'mark'], ['*', 'em'], ['_', 'em']] as const) {
      if (!text.startsWith(marker, i)) continue;
      const after = text[i + marker.length];
      if (after === undefined || /\s/.test(after)) continue;
      if (marker === '_' || marker === '__') {
        // Underscores inside a word are part of it: snake_case.
        if (i > 0 && /[\p{L}\p{N}]/u.test(text[i - 1])) continue;
      }
      const close = findClose(text, marker, i + marker.length);
      if (close === -1) continue;
      if ((marker === '_' || marker === '__') && /[\p{L}\p{N}]/u.test(text[close + marker.length] ?? '')) continue;
      out += tag(name, inline(text.slice(i + marker.length, close), html));
      i = close + marker.length;
      done = true;
      break;
    }
    if (done) continue;
    out += esc(ch);
    i++;
  }
  return out;
}

/** One cell's Markdown as HTML. */
export function inlineToHtml(markdown: string): string {
  return inline(markdown, true);
}

/** One cell's Markdown as the text it shows: marks gone, links as their label. */
export function inlineToText(markdown: string): string {
  return inline(markdown, false);
}

const ALIGN_STYLE = { none: '', left: 'left', center: 'center', right: 'right' } as const;

/** The table as an HTML `<table>`, header cells as `<th>`. Cells are Markdown source. */
export function tableToHtml(table: SourceTable): string {
  const border = 'border:1px solid #999;padding:4px 8px;border-collapse:collapse;vertical-align:top;';
  const cell = (name: 'th' | 'td', text: string, c: number) => {
    const align = ALIGN_STYLE[table.align[c] ?? 'none'];
    const style = border + (align ? `text-align:${align};` : '');
    return `<${name} style="${style}">${inlineToHtml(text.replace(/\\\|/g, '|'))}</${name}>`;
  };
  const row = (name: 'th' | 'td', cells: string[]) =>
    `<tr>${cells.map((text, c) => cell(name, text, c)).join('')}</tr>`;
  return (
    '<table style="border-collapse:collapse;">' +
    `<thead>${row('th', table.header)}</thead>` +
    `<tbody>${table.body.map((cells) => row('td', cells)).join('')}</tbody>` +
    '</table>'
  );
}

/** The table's cells as rows of plain text: marks removed, pipes unescaped. */
export function tableToPlainRows(table: SourceTable): string[][] {
  return [table.header, ...table.body].map((cells) => cells.map((text) => inlineToText(text.replace(/\\\|/g, '|'))));
}
