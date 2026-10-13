#!/usr/bin/env node
// Static build (build.mjs → out/) → Codex Sites Worker build (dist/), see docs/static-site/README.md.
//
//   node scripts/static-site/sites-pack.mjs --out=out --dist=/path/to/site-repo/dist [--host=tseng-law.com]
//
// dist/server/index.js   Worker (sites-worker.js with this build's redirects, headers and locales inlined)
// dist/server/wrangler.json  assets binding ASSETS → ../client (the Vinext/Cloudflare layout Sites deploys)
// dist/client/__p/…html.gz   every page, gzip -9 (Sites refuses archives over 256 MiB expanded)
// dist/client/…              every other file, unchanged (APFS clones, no extra disk)
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { walkFiles } from './shared.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const SITES_EXPANDED_LIMIT = 256 * 1024 * 1024;
const PACK_MARKER = '.sites-pack';
const SKIP = new Set(['.static-site-out', '_redirects', '_headers', '.DS_Store']);

/** `_redirects` lines → exact map + ordered patterns (first match wins, as on Cloudflare). */
export function parseRedirects(text) {
  const exact = {};
  const patterns = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const [from, to, status = '301'] = line.split(/\s+/);
    const code = Number(status);
    if (!from?.startsWith('/') || !to || ![301, 302, 303, 307, 308].includes(code)) {
      throw new Error(`Unsupported _redirects line: ${line}`);
    }
    if (/[*:]/.test(from)) patterns.push([from, to, code]);
    else if (!(from in exact)) exact[from] = [to, code];
  }
  return { exact, patterns };
}

/** The `/*` block of `_headers` (site-wide security headers) as [name, value] pairs. */
export function parseSiteHeaders(text) {
  const headers = [];
  let inSiteBlock = false;
  for (const raw of text.split('\n')) {
    if (!raw.trim()) continue;
    if (!/^\s/.test(raw)) {
      inSiteBlock = raw.trim() === '/*';
      continue;
    }
    if (!inSiteBlock) continue;
    const at = raw.indexOf(':');
    if (at > 0) headers.push([raw.slice(0, at).trim(), raw.slice(at + 1).trim()]);
  }
  return headers;
}

/** Locales the root chooser (assemble.mjs rootChooser) sends visitors to. */
export function rootLocalesFromChooser(html) {
  const match = /var L=(\[[^\]]*\])/.exec(html);
  if (!match) throw new Error('index.html is not the root language chooser');
  return JSON.parse(match[1]);
}

export function workerSource(config) {
  const source = fs.readFileSync(path.join(HERE, 'sites-worker.js'), 'utf8');
  const placeholder = '/*__SITE_CONFIG__*/ null';
  if (!source.includes(placeholder)) throw new Error('sites-worker.js lost its config placeholder');
  // Named exports exist for tests only: workerd treats every named export of the main module as an
  // entrypoint and refuses the module when one is a plain value.
  return source.replace(placeholder, JSON.stringify(config)).replace(/^export (?!default\b)/gm, '');
}

function assertSafeDist(dist) {
  if (!fs.existsSync(dist)) return;
  const entries = fs.readdirSync(dist).filter((name) => name !== '.DS_Store');
  if (entries.length && !fs.existsSync(path.join(dist, PACK_MARKER))) {
    throw new Error(`${dist} is not empty and was not created by sites-pack.mjs; refusing to delete it.`);
  }
}

export function packSite({ outDir, distDir, host = 'tseng-law.com' }) {
  const out = path.resolve(outDir);
  const dist = path.resolve(distDir);
  if (!fs.existsSync(path.join(out, '.static-site-out')) || !fs.existsSync(path.join(out, 'index.html'))) {
    throw new Error(`${out} is not a static-site build (missing .static-site-out or index.html)`);
  }
  assertSafeDist(dist);
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(path.join(dist, 'server'), { recursive: true });
  fs.mkdirSync(path.join(dist, 'client'), { recursive: true });
  fs.writeFileSync(path.join(dist, PACK_MARKER), '');

  const stats = { pages: 0, pageBytes: 0, pageGzipBytes: 0, assets: 0, assetBytes: 0 };
  const notFoundLocales = [];
  for (const file of walkFiles(out)) {
    const rel = path.relative(out, file);
    const base = path.basename(rel);
    if (SKIP.has(base) || base.startsWith('._')) continue;
    if (rel.endsWith('.html')) {
      const html = fs.readFileSync(file);
      const gz = zlib.gzipSync(html, { level: 9 });
      const target = path.join(dist, 'client', '__p', `${rel}.gz`);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, gz);
      stats.pages += 1;
      stats.pageBytes += html.length;
      stats.pageGzipBytes += gz.length;
      const parts = rel.split(path.sep);
      if (parts.length === 2 && parts[1] === '404.html') notFoundLocales.push(parts[0]);
    } else {
      const target = path.join(dist, 'client', rel);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(file, target, fs.constants.COPYFILE_FICLONE);
      stats.assets += 1;
      stats.assetBytes += fs.statSync(file).size;
    }
  }

  // Static assets keep the `_headers` cache and security rules where the host applies them; pages get
  // the same security headers from the Worker. Redirects are only the Worker's (no `_redirects` copy).
  const headersText = fs.readFileSync(path.join(out, '_headers'), 'utf8');
  fs.writeFileSync(path.join(dist, 'client', '_headers'), headersText);
  const config = {
    canonicalHost: host,
    rootLocales: rootLocalesFromChooser(fs.readFileSync(path.join(out, 'index.html'), 'utf8')),
    rootFallback: 'ko',
    notFoundLocales: notFoundLocales.sort(),
    redirects: parseRedirects(fs.readFileSync(path.join(out, '_redirects'), 'utf8')),
    pageHeaders: parseSiteHeaders(headersText),
  };
  if (!config.rootLocales.includes(config.rootFallback)) throw new Error('root chooser does not list ko');
  fs.writeFileSync(path.join(dist, 'server', 'index.js'), workerSource(config));
  fs.writeFileSync(
    path.join(dist, 'server', 'wrangler.json'),
    `${JSON.stringify({
      name: 'site',
      main: 'index.js',
      compatibility_date: '2026-09-01',
      assets: { directory: '../client', binding: 'ASSETS', not_found_handling: 'none', run_worker_first: ['/__p/*'] },
    }, null, 2)}\n`,
  );

  const expandedBytes = walkFiles(dist).reduce((sum, file) => sum + fs.statSync(file).size, 0);
  const report = {
    ...stats,
    redirects: Object.keys(config.redirects.exact).length + config.redirects.patterns.length,
    rootLocales: config.rootLocales.length,
    notFoundLocales: config.notFoundLocales,
    expandedBytes,
    limitBytes: SITES_EXPANDED_LIMIT,
    headroomBytes: SITES_EXPANDED_LIMIT - expandedBytes,
  };
  if (expandedBytes >= SITES_EXPANDED_LIMIT) {
    throw new Error(`dist is ${expandedBytes} bytes, over the Sites limit of ${SITES_EXPANDED_LIMIT}`);
  }
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = Object.fromEntries(
    process.argv.slice(2).map((arg) => {
      const [key, ...value] = arg.replace(/^--/, '').split('=');
      return [key, value.join('=')];
    }),
  );
  if (!args.out || !args.dist) {
    console.error('usage: node scripts/static-site/sites-pack.mjs --out=<static build> --dist=<site repo>/dist [--host=tseng-law.com]');
    process.exit(64);
  }
  const report = packSite({ outDir: args.out, distDir: args.dist, host: args.host || undefined });
  console.log(JSON.stringify(report, null, 2));
}
