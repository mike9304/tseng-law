// Shared settings for the static-site snapshot (docs/static-site/README.md).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SITE_ORIGIN = 'https://tseng-law.com';
export const STATIC_DIST_DIR = '.next-static';
export const MAIN_LOCALES = ['ko', 'zh-hant', 'en', 'ja'];
/**
 * The 29 Folio locales (src/lib/intl-design-locales.ts; a test keeps the lists equal). They have their own designed
 * not-found page, so the snapshot keeps a localized 404.html for each instead of the English root one.
 */
export const FOLIO_NOT_FOUND_LOCALES = [
  'id', 'th', 'de', 'es', 'fr', 'it', 'pt', 'nl', 'pl', 'ru', 'uk', 'el', 'sv', 'da', 'nb',
  'fi', 'cs', 'hu', 'ro', 'sk', 'bg', 'hr', 'sr', 'sl', 'lt', 'lv', 'et', 'ca', 'is',
];

/**
 * Paths that only work with a server (APIs, admin, member/booking/store flows, builder
 * fixtures). They are never crawled; links to them are reported, not followed.
 */
const SERVER_ONLY_PATH = new RegExp(
  [
    '^/api(?:/|$)',
    '^/_next/(?!static/)',
    '^/review(?:/|$)',
    '^/(?:[a-z]{2,3}(?:-[a-z]{2,4})?/)?(?:admin-builder|admin-consultation|builder|account|login|bookings|store|builder-fixtures|design-preview|members?)(?:/|$)',
  ].join('|'),
);

export function isServerOnlyPath(pathname) {
  return SERVER_ONLY_PATH.test(pathname);
}

/** `/` → index.html, `/ko/about` → ko/about.html (served at the extensionless URL). */
export function pageFileFor(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/') return 'index.html';
  return `${decodeURIComponent(clean.slice(1))}.html`;
}

export function hasFileExtension(pathname) {
  return /\.[a-z0-9]{1,8}$/i.test(pathname.split('/').pop() ?? '');
}

export function walkFiles(root) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile()) out.push(full);
    }
  }
  return out;
}

const ENTITY = { '&amp;': '&', '&quot;': '"', '&#x27;': "'", '&#39;': "'", '&lt;': '<', '&gt;': '>' };

/** Same-site URL references in an HTML or CSS document, as pathnames (query/hash dropped). */
export function extractLocalRefs(text, pageUrl, base) {
  const refs = new Set();
  const add = (raw) => {
    const value = raw.trim().replace(/&(?:amp|quot|#x27|#39|lt|gt);/g, (m) => ENTITY[m]);
    // Next emits root-relative or absolute URLs; anything else (meta text, data:, mailto:) is not a ref.
    if (!/^(?:\/|https?:)/i.test(value)) return;
    let url;
    try {
      url = new URL(value, pageUrl);
    } catch {
      return;
    }
    const origin = url.origin;
    if (origin !== base && origin !== SITE_ORIGIN && origin !== 'https://www.tseng-law.com') return;
    refs.add(url.pathname);
  };
  for (const m of text.matchAll(/\s(?:href|src|poster|action|data-src|content)\s*=\s*"([^"]*)"/gi)) add(m[1]);
  for (const m of text.matchAll(/\s(?:srcset|srcSet|imagesrcset)\s*=\s*"([^"]*)"/g)) {
    for (const part of m[1].split(',')) add(part.trim().split(/\s+/)[0] ?? '');
  }
  for (const m of text.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) add(m[2]);
  return refs;
}

// ---- React Server Components payload inside the HTML (`self.__next_f.push([1,"…"])`) ----
// Text rows carry a UTF-8 byte length (`<id>:T<hex>,<text>`), so any edit inside them must
// recompute it; a wrong length makes the client fail to hydrate ("Connection closed").
const FLIGHT_PUSH = /<script>self\.__next_f\.push\((\[1,"(?:[^"\\]|\\.)*"\])\)<\/script>/g;
const T_ROW = /^([0-9a-fA-F]+):T([0-9a-fA-F]+),/;

function utf8Width(codePoint) {
  return codePoint <= 0x7f ? 1 : codePoint <= 0x7ff ? 2 : codePoint <= 0xffff ? 3 : 4;
}

/** Splits a flight stream into rows: { text: true, id, value } for T rows, { line } otherwise. */
export function parseFlightRows(stream) {
  const rows = [];
  let i = 0;
  while (i < stream.length) {
    const header = T_ROW.exec(stream.slice(i, i + 48));
    if (header) {
      const start = i + header[0].length;
      const byteLength = parseInt(header[2], 16);
      let end = start;
      let bytes = 0;
      while (bytes < byteLength && end < stream.length) {
        const codePoint = stream.codePointAt(end);
        bytes += utf8Width(codePoint);
        end += codePoint > 0xffff ? 2 : 1;
      }
      rows.push({ text: true, id: header[1], value: stream.slice(start, end), declared: byteLength, actual: bytes });
      i = end;
      continue;
    }
    const newline = stream.indexOf('\n', i);
    const end = newline === -1 ? stream.length : newline + 1;
    rows.push({ text: false, line: stream.slice(i, end) });
    i = end;
  }
  return rows;
}

export function readFlightStream(html) {
  return [...html.matchAll(FLIGHT_PUSH)].map((m) => JSON.parse(m[1])[1]).join('');
}

/** A row boundary must follow every T row; otherwise its declared length is wrong. */
export function findFlightLengthErrors(html) {
  const stream = readFlightStream(html);
  const errors = [];
  let offset = 0;
  for (const row of parseFlightRows(stream)) {
    if (row.text) {
      offset += row.id.length + 2 + row.declared.toString(16).length + 1 + row.value.length;
      const next = stream.slice(offset, offset + 12);
      if (row.actual !== row.declared || (next && !/^([0-9a-fA-F]+:|:|\n)/.test(next))) errors.push({ id: row.id, next });
    } else {
      offset += row.line.length;
    }
  }
  return errors;
}

function escapeFlightJs(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

/**
 * Applies `rewrite` to an HTML document: to the markup, and row by row to the flight payload with
 * T-row lengths recomputed. The payload is re-emitted as one push where the first one was.
 */
export function rewriteHtmlDocument(html, rewrite) {
  const stream = readFlightStream(html);
  if (!stream) return rewrite(html);
  const rebuilt = parseFlightRows(stream).map((row) => {
    if (!row.text) return rewrite(row.line);
    const value = rewrite(row.value);
    return `${row.id}:T${Buffer.byteLength(value, 'utf8').toString(16)},${value}`;
  }).join('');
  let first = true;
  const pieces = [];
  let last = 0;
  for (const m of html.matchAll(FLIGHT_PUSH)) {
    pieces.push(rewrite(html.slice(last, m.index)));
    if (first) pieces.push(`<script>self.__next_f.push([1,${escapeFlightJs(rebuilt)}])</script>`);
    first = false;
    last = m.index + m[0].length;
  }
  pieces.push(rewrite(html.slice(last)));
  return pieces.join('');
}
