#!/usr/bin/env node
// Per-page HTML budget of the Folio design (id, th and the 27 European locales; ~/tseng-country-design-20261013/intl/
// DIRECTION.md §10 and §13, enforced since review round 2). A candidate static snapshot is compared with the snapshot of
// the commit it builds on, page by page:
//   - a Folio home must be smaller than before (the plate replaces the courthouse film markup);
//   - any other page, Folio or not, may grow by at most 40 bytes;
//   - no page may disappear, and the only new pages allowed are the Folio locales' own 404.html.
// The Codex Sites package headroom does not waive this: the budget is per page.
//
// Bytes are counted after removing what differs between two builds of the same source, so the gate does not flap:
// hashed chunk names and build ids, how the RSC payload is cut into <script> pushes, React's streaming scaffolding
// (Suspense markers, the hidden div + $RS swap, its helper script) and the image preload hint React emits or not
// depending on render timing. Raw byte deltas are reported next to the normalised ones.
//
//   node scripts/static-site/html-budget.mjs --base=<baseline out dir> --cand=<candidate out dir> [--json=<report>]
//   node scripts/static-site/build.mjs ... --budget-base=<baseline out dir>   (runs this after the build)
// Exit 1 when any page is over budget.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { FOLIO_NOT_FOUND_LOCALES } from './shared.mjs';

export const HTML_BUDGET_BYTES = 40;
export const FOLIO_LOCALES = FOLIO_NOT_FOUND_LOCALES;

/**
 * Unwraps React's streamed segments: `<div hidden id="S:n">…</div>` → `…` (the matching close found by counting divs,
 * skipping script bodies). Their swap calls ($RS/$RC) can come much later in the document; those scripts are removed
 * separately.
 */
function unwrapStreamedSegments(html) {
  let out = '';
  let index = 0;
  const open = /<div hidden id="S:[0-9a-f]+">/g;
  let match;
  while ((match = open.exec(html))) {
    out += html.slice(index, match.index);
    let depth = 1;
    const cursor = open.lastIndex;
    const tag = /<script\b[^>]*>[\s\S]*?<\/script>|<div\b|<\/div>/g;
    tag.lastIndex = cursor;
    let close = -1;
    let found;
    while ((found = tag.exec(html))) {
      if (found[0] === '</div>') depth -= 1;
      else if (found[0] === '<div') depth += 1;
      if (depth === 0) {
        close = found.index;
        break;
      }
    }
    if (close < 0) return html;
    // The segment's own content may hold further segments: unwrap it recursively.
    out += unwrapStreamedSegments(html.slice(cursor, close));
    index = close + '</div>'.length;
    open.lastIndex = index;
  }
  return out + html.slice(index);
}

/** Same source, two builds: these parts differ in content or length without any change in the page. */
export function normalizeBuildNoise(html) {
  return unwrapStreamedSegments(html)
    .replace(/static\/(chunks|css|media)\/[^"'\s)\\,]+/g, 'static/$1/X')
    .replace(/\/_next\/static\/[A-Za-z0-9_-]{10,}\//g, '/_next/static/BUILD/')
    .replace(/"b":"[A-Za-z0-9_-]+"/g, '"b":"BUILD"')
    .replace(/\\"b\\":\\"[A-Za-z0-9_-]+\\"/g, '\\"b\\":\\"BUILD\\"')
    .replace(/[?&]dpl=[A-Za-z0-9_-]+/g, '')
    .replace(/"buildId":"[^"]+"/g, '"buildId":"BUILD"')
    // React's streaming scaffolding: placeholders, Suspense markers, swap helpers and calls.
    .replace(/<template id="[BPS]:[0-9a-f]+"><\/template>/g, '')
    .replace(/<!--\/?\$[?!~]?-->/g, '')
    .replace(/<script>\$R[A-Z](?:=|\()(?:(?!<\/script>)[\s\S])*<\/script>/g, '')
    .replace('<script>requestAnimationFrame(function(){$RT=performance.now()});</script>', '')
    // Next moves icons into <head> with this script when the metadata streams into <body>.
    .replace(/<script>document\.querySelectorAll\('body link\[rel="icon"\][^<]*<\/script>/g, '')
    .replace(/<link rel="preload" as="image"[^>]*\/>/g, '')
    // One RSC payload, however it was cut into pushes.
    .replace(/"\]\)<\/script><script>self\.__next_f\.push\(\[1,"/g, '');
}

function listPages(root) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== '_next') stack.push(full);
      } else if (entry.name.endsWith('.html')) {
        out.push(path.relative(root, full).split(path.sep).join('/'));
      }
    }
  }
  return out.sort();
}

/** `fr.html` → { locale: 'fr', home: true }; `fr/about.html` → { locale: 'fr', home: false }. */
export function classifyPage(rel, folioLocales = FOLIO_LOCALES) {
  const first = rel.split('/')[0].replace(/\.html$/, '');
  const folio = folioLocales.includes(first);
  return { locale: first, folio, home: folio && rel === `${first}.html` };
}

/**
 * Compares two snapshot directories. Returns { ok, limit, pages, counts, failures, rows }; each failure names the page,
 * the rule and the normalised delta.
 */
export function checkHtmlBudget({ baseDir, candDir, limit = HTML_BUDGET_BYTES, folioLocales = FOLIO_LOCALES }) {
  const base = new Set(listPages(baseDir));
  const cand = new Set(listPages(candDir));
  const rows = [];
  const failures = [];
  for (const rel of [...cand].sort()) {
    const kind = classifyPage(rel, folioLocales);
    if (!base.has(rel)) {
      const allowed = kind.folio && rel === `${kind.locale}/404.html`;
      rows.push({ rel, ...kind, added: true });
      if (!allowed) failures.push({ rel, rule: 'new page outside the Folio 404 pages' });
      continue;
    }
    const a = fs.readFileSync(path.join(baseDir, rel), 'utf8');
    const b = fs.readFileSync(path.join(candDir, rel), 'utf8');
    const na = normalizeBuildNoise(a);
    const nb = normalizeBuildNoise(b);
    const delta = Buffer.byteLength(nb) - Buffer.byteLength(na);
    const row = {
      rel,
      ...kind,
      delta,
      raw: Buffer.byteLength(b) - Buffer.byteLength(a),
      gzip: na === nb ? 0 : zlib.gzipSync(nb, { level: 9 }).length - zlib.gzipSync(na, { level: 9 }).length,
    };
    rows.push(row);
    if (kind.home && delta >= 0) failures.push({ rel, rule: 'Folio home must shrink', delta });
    else if (!kind.home && delta > limit) failures.push({ rel, rule: `grows more than ${limit} B`, delta });
  }
  for (const rel of base) {
    if (!cand.has(rel)) {
      rows.push({ rel, ...classifyPage(rel, folioLocales), removed: true });
      failures.push({ rel, rule: 'page disappeared' });
    }
  }
  const compared = rows.filter((row) => typeof row.delta === 'number');
  const stat = (list) => {
    if (!list.length) return null;
    const values = list.map((row) => row.delta).sort((x, y) => x - y);
    return { pages: values.length, min: values[0], median: values[Math.floor(values.length / 2)], max: values.at(-1) };
  };
  const counts = {
    folioHome: stat(compared.filter((row) => row.home)),
    folioOther: stat(compared.filter((row) => row.folio && !row.home)),
    other: stat(compared.filter((row) => !row.folio)),
    added: rows.filter((row) => row.added).length,
    removed: rows.filter((row) => row.removed).length,
  };
  return { ok: failures.length === 0, limit, pages: rows.length, counts, failures, rows };
}

function main(argv) {
  const args = Object.fromEntries(
    argv.filter((arg) => arg.startsWith('--')).map((arg) => {
      const at = arg.indexOf('=');
      return at < 0 ? [arg.slice(2), true] : [arg.slice(2, at), arg.slice(at + 1)];
    }),
  );
  if (!args.base || !args.cand) {
    console.error('Usage: node scripts/static-site/html-budget.mjs --base=<baseline out> --cand=<candidate out> [--json=<file>]');
    return 2;
  }
  const result = checkHtmlBudget({ baseDir: path.resolve(args.base), candDir: path.resolve(args.cand) });
  if (typeof args.json === 'string') fs.writeFileSync(path.resolve(args.json), `${JSON.stringify(result, null, 1)}\n`);
  console.log(`[html-budget] ${result.pages} pages; limit +${result.limit} B per page, Folio homes must shrink`);
  console.log(`[html-budget] Folio homes ${JSON.stringify(result.counts.folioHome)}`);
  console.log(`[html-budget] Folio pages ${JSON.stringify(result.counts.folioOther)}`);
  console.log(`[html-budget] other pages ${JSON.stringify(result.counts.other)}; added ${result.counts.added}, removed ${result.counts.removed}`);
  for (const failure of result.failures.slice(0, 40)) {
    console.log(`[html-budget] FAIL ${failure.rel}: ${failure.rule}${failure.delta === undefined ? '' : ` (${failure.delta > 0 ? '+' : ''}${failure.delta} B)`}`);
  }
  if (result.failures.length > 40) console.log(`[html-budget] … and ${result.failures.length - 40} more`);
  console.log(`[html-budget] ${result.ok ? 'PASS' : `FAIL (${result.failures.length} pages)`}`);
  return result.ok ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
