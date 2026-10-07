// A JSON array of objects as rows: the keys are the header, each object a row.

import type { Rows } from './delimited.ts';

function cellText(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

/**
 * Rows from the text of a JSON array of objects (or of arrays), or null when
 * it is anything else. Keys are the header in order of first appearance;
 * a key missing from an object leaves an empty cell; nested values are
 * written as compact JSON.
 */
export function jsonToRows(text: string): Rows | null {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  if (!Array.isArray(data) || data.length === 0) return null;
  const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
  if (data.every(Array.isArray)) {
    return (data as unknown[][]).map((row) => row.map(cellText));
  }
  if (!data.every(isObject)) return null;
  const keys: string[] = [];
  const seen = new Set<string>();
  for (const item of data) {
    for (const key of Object.keys(item)) {
      if (!seen.has(key)) {
        seen.add(key);
        keys.push(key);
      }
    }
  }
  if (keys.length === 0) return null;
  return [keys, ...data.map((item) => keys.map((key) => (Object.prototype.hasOwnProperty.call(item, key) ? cellText(item[key]) : '')))];
}
