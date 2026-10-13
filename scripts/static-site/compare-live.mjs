#!/usr/bin/env node
// Compares every sitemap page of the static copy with the live site.
//
//   node scripts/static-site/compare-live.mjs [--out=out] [--live=https://tseng-law.com]
//                                             [--concurrency=4] [--report=static-site-compare.json]
//
// Per page: <title>, h1 texts, canonical, meta description, hreflang count, and the visible
// text (scripts/styles/tags stripped). Lines that exist only because the static build switches
// off server features (member login) are listed in IGNORED_TEXT and dropped before comparing.
import fs from 'node:fs';
import path from 'node:path';
import { pageFileFor, REPO_ROOT } from './shared.mjs';

// Member login links exist only on the live (server) site. \b does not work next to CJK text.
const IGNORED_TEXT = [/Client log in|Log in|Sign in|로그인|登入|ログイン/g];

function parseArgs(argv) {
  const args = { out: 'out', live: 'https://tseng-law.com', concurrency: 4, report: 'static-site-compare.json' };
  for (const arg of argv) {
    const [key, value] = arg.replace(/^--/, '').split('=');
    if (key === 'concurrency') args.concurrency = Number(value);
    else if (key in args) args[key] = value;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function decode(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'");
}

export function summarize(html) {
  const pick = (re) => decode((html.match(re)?.[1] ?? '').trim());
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => decode(m[1].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim());
  // <title> is compared on its own; Next may stream it into <head> or later in <body>.
  let text = html
    .replace(/<title\b[\s\S]*?<\/title>/gi, ' ')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  text = decode(text);
  for (const re of IGNORED_TEXT) text = text.replace(re, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  return {
    title: pick(/<title[^>]*>([\s\S]*?)<\/title>/i),
    canonical: pick(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i),
    description: pick(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i),
    hreflang: (html.match(/hrefLang="|hreflang="/g) ?? []).length,
    h1,
    textLength: text.length,
    text,
  };
}

function firstDifference(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  return { at: i, live: a.slice(Math.max(0, i - 40), i + 80), static: b.slice(Math.max(0, i - 40), i + 80) };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = path.resolve(REPO_ROOT, args.out);
  const sitemap = fs.readFileSync(path.join(outDir, 'sitemap.xml'), 'utf8');
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1].trim()).pathname);
  const results = [];
  let index = 0;
  const worker = async () => {
    while (index < paths.length) {
      const pathname = paths[index++];
      const file = path.join(outDir, pageFileFor(pathname));
      if (!fs.existsSync(file)) {
        results.push({ path: pathname, status: 'missing-static' });
        continue;
      }
      let live;
      try {
        const response = await fetch(`${args.live}${pathname}`, { headers: { 'accept-language': 'ko' } });
        if (!response.ok) {
          results.push({ path: pathname, status: `live-${response.status}` });
          continue;
        }
        live = summarize(await response.text());
      } catch (error) {
        results.push({ path: pathname, status: 'live-error', error: String(error) });
        continue;
      }
      const snap = summarize(fs.readFileSync(file, 'utf8'));
      const diffs = [];
      for (const key of ['title', 'canonical', 'description', 'hreflang']) {
        if (live[key] !== snap[key]) diffs.push({ field: key, live: live[key], static: snap[key] });
      }
      if (JSON.stringify(live.h1) !== JSON.stringify(snap.h1)) diffs.push({ field: 'h1', live: live.h1, static: snap.h1 });
      if (live.text !== snap.text) {
        diffs.push({ field: 'text', liveLength: live.textLength, staticLength: snap.textLength, ...firstDifference(live.text, snap.text) });
      }
      results.push({ path: pathname, status: diffs.length ? 'diff' : 'same', diffs });
    }
  };
  await Promise.all(Array.from({ length: args.concurrency }, worker));

  const counts = results.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {});
  const fieldCounts = {};
  for (const r of results) for (const d of r.diffs ?? []) fieldCounts[d.field] = (fieldCounts[d.field] ?? 0) + 1;
  fs.writeFileSync(path.join(REPO_ROOT, args.report), `${JSON.stringify({ generatedAt: new Date().toISOString(), counts, fieldCounts, results }, null, 2)}\n`);
  console.log(`[compare] ${paths.length} pages:`, counts, 'diff fields:', fieldCounts);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
