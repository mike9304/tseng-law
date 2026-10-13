// Assembles the static host directory: crawled pages + public/ + Next static chunks,
// plus _redirects, _headers and the root language chooser.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { pageFileFor, REPO_ROOT, rewriteHtmlDocument, SITE_ORIGIN, STATIC_DIST_DIR, walkFiles } from './shared.mjs';

/** Next redirect pattern → Cloudflare-style _redirects pattern (`:path*` → `*`/`:splat`). */
export function toHostPattern(pattern) {
  return pattern.replace(/\/:[A-Za-z]+\*$/, '/*');
}

export function toHostDestination(destination) {
  return destination.replace(/\/:[A-Za-z]+\*$/, '/:splat');
}

async function loadNextConfig() {
  // Production headers (HSTS) are chosen at import time from NODE_ENV.
  process.env.NODE_ENV = 'production';
  const mod = await import(pathToFileURL(path.join(REPO_ROOT, 'next.config.mjs')).href);
  return mod.default;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

const OUT_MARKER = '.static-site-out';
const TEXT_EXTENSIONS = new Set(['.html', '.js', '.css', '.json', '.xml', '.txt', '.webmanifest']);

/**
 * Videos (2.4 GB) and images (0.2 GB) exceed the host's 256 MiB deploy archive, so they live on a
 * separate media origin (Cloudflare R2). Brand assets (favicons, logos) stay on the site.
 * Rewrites quoted/`url(` `/videos/…` and `/images/…` paths and absolute site URLs to them; page
 * routes such as `/ko/videos` are untouched because they are not preceded by a quote or bracket.
 */
export const MEDIA_DIRS = ['videos', 'images'];
const KEEP_LOCAL = 'images/brand/';

export function rewriteMediaRefs(text, mediaOrigin) {
  return text
    // srcset lists put later URLs after ", " instead of a quote.
    .replace(/(["'`(]|,\s*)\/(videos|images)\/(?!brand\/)/g, `$1${mediaOrigin}/$2/`)
    .replace(new RegExp(`${SITE_ORIGIN.replace(/[.]/g, '\\.')}/(videos|images)/(?!brand/)`, 'g'), `${mediaOrigin}/$1/`);
}

function moveMediaToOrigin(outDir, mediaOrigin) {
  // Some media URLs are assembled in client code ("/videos/columns/".concat(id, ".mp4")), so the
  // media origin receives every file under public/videos and public/images, not only literal references.
  const referenced = new Set();
  const pattern = new RegExp(`${mediaOrigin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/((?:videos|images)/[^"'\`)\\\\\\s?#]+\\.[a-z0-9]{2,5})`, 'gi');
  const inMediaDir = (file) => MEDIA_DIRS.some((dir) => file.startsWith(path.join(outDir, dir) + path.sep));
  for (const file of walkFiles(outDir)) {
    if (!TEXT_EXTENSIONS.has(path.extname(file)) || inMediaDir(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (!text.includes('/videos/') && !text.includes('/images/')) continue;
    const rewritten = path.extname(file) === '.html'
      ? rewriteHtmlDocument(text, (part) => rewriteMediaRefs(part, mediaOrigin))
      : rewriteMediaRefs(text, mediaOrigin);
    if (rewritten !== text) fs.writeFileSync(file, rewritten);
    for (const m of rewritten.matchAll(pattern)) referenced.add(decodeURIComponent(m[1]));
  }
  const files = [];
  for (const dir of MEDIA_DIRS) {
    const root = path.join(REPO_ROOT, 'public', dir);
    if (!fs.existsSync(root)) continue;
    for (const source of walkFiles(root).sort()) {
      const key = `${dir}/${path.relative(root, source).split(path.sep).join('/')}`;
      if (key.startsWith(KEEP_LOCAL) || path.basename(key).startsWith('.')) continue;
      files.push({ key, source, bytes: fs.statSync(source).size });
      fs.rmSync(path.join(outDir, key), { force: true });
    }
  }
  const available = new Set(files.map((f) => f.key));
  // References to files that do not exist (the live site 404s on them as well) are reported, not uploaded.
  const missing = [...referenced].filter((key) => !available.has(key)).sort();
  for (const dir of MEDIA_DIRS) removeEmptyDirs(path.join(outDir, dir));
  return { files, referenced: referenced.size, missing };
}

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return;
  for (const entry of fs.readdirSync(dir)) removeEmptyDirs(path.join(dir, entry));
  if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}

/** The output directory is wiped on every run, so it must be a dedicated subdirectory of the repo. */
export function assertSafeOutDir(outDir) {
  const relative = path.relative(REPO_ROOT, outDir);
  const top = relative.split(path.sep)[0];
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)
    || ['src', 'public', 'scripts', 'node_modules', 'docs', 'content', 'static-data', '.git'].includes(top)) {
    throw new Error(`Unsafe output directory: ${outDir}`);
  }
  if (fs.existsSync(outDir) && fs.readdirSync(outDir).length && !fs.existsSync(path.join(outDir, OUT_MARKER))) {
    throw new Error(`${outDir} is not empty and was not created by this script; refusing to delete it.`);
  }
}

function redirectStub(to) {
  const href = escapeHtml(to);
  const canonical = escapeHtml(to.startsWith('http') ? to : `${SITE_ORIGIN}${to}`);
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex">`
    + `<link rel="canonical" href="${canonical}"><meta http-equiv="refresh" content="0; url=${href}">`
    + `<script>location.replace(${JSON.stringify(to).replace(/</g, '\\u003c')}+location.hash)</script></head>`
    + `<body><a href="${href}">${href}</a></body></html>\n`;
}

/** Same rules as src/lib/root-locale-negotiation.ts, run in the browser on `/`. */
function rootChooser(locales) {
  const script = `(function(){var L=${JSON.stringify(locales)},A={no:'nb',nn:'nb',tl:'fil',iw:'he',in:'id'},`
    + `T=['tw','hk','mo'],S=['cn','sg','my'];function m(t){var p=String(t).toLowerCase().replace(/_/g,'-').split('-').filter(Boolean),`
    + `a=p[0];if(!a||a==='*')return null;if(a==='zh'){var s=p.slice(1);if(s.indexOf('hant')>=0)return 'zh-hant';`
    + `if(s.indexOf('hans')>=0)return L.indexOf('zh-hans')>=0?'zh-hans':'zh-hant';for(var i=0;i<s.length;i++){if(T.indexOf(s[i])>=0)return 'zh-hant';`
    + `if(S.indexOf(s[i])>=0&&L.indexOf('zh-hans')>=0)return 'zh-hans'}return 'zh-hant'}if(L.indexOf(a)>=0)return a;`
    + `var b=A[a];return b&&L.indexOf(b)>=0?b:null}var n=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||''];`
    // Crawlers keep the server's no-header behaviour: /ko.
    + `var r='ko';if(!/bot|crawl|spider|slurp/i.test(navigator.userAgent)){for(var j=0;j<n.length;j++){var x=m(n[j]);if(x){r=x;break}}}`
    + `location.replace('/'+r+location.search+location.hash)})();`;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`
    + `<title>법무법인 호정</title><link rel="canonical" href="${SITE_ORIGIN}/ko">`
    + `<noscript><meta http-equiv="refresh" content="0; url=/ko"></noscript><script>${script}</script></head>`
    + `<body><a href="/ko">법무법인 호정</a></body></html>\n`;
}

/**
 * @param {{ crawlDir: string, outDir: string, crawl: Awaited<ReturnType<typeof import('./crawl.mjs').crawlSite>>,
 *   mediaOrigin?: string | null }} options
 */
export async function assembleSite({ crawlDir, outDir, crawl, mediaOrigin = null }) {
  assertSafeOutDir(outDir);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, OUT_MARKER), '');
  fs.cpSync(path.join(REPO_ROOT, 'public'), outDir, { recursive: true });
  // Source maps stay private.
  fs.cpSync(path.join(REPO_ROOT, STATIC_DIST_DIR, 'static'), path.join(outDir, '_next', 'static'), {
    recursive: true,
    filter: (source) => !source.endsWith('.map'),
  });
  fs.cpSync(crawlDir, outDir, { recursive: true });

  const nextConfig = await loadNextConfig();

  // Redirects: next.config rules (host-specific www rule is a domain setting) + what the crawl saw.
  const lines = [];
  const stubs = new Map();
  const seen = new Set();
  const addRule = (from, to, status) => {
    if (from === '/' || seen.has(from)) return;
    if (!to.startsWith('/') && !/^https:\/\//.test(to)) return; // never forward to other schemes
    seen.add(from);
    lines.push(`${from} ${to} ${status}`);
    if (!from.includes('*') && !from.includes(':')) stubs.set(from, to);
  };
  for (const rule of await nextConfig.redirects()) {
    if (rule.has || rule.missing) continue;
    addRule(toHostPattern(rule.source), toHostDestination(rule.destination), rule.permanent ? 308 : 307);
  }
  // Builder SEO rules: exact paths, or `/old/*` prefixes whose `/new/*` target keeps the suffix.
  for (const r of crawl.builderRedirects ?? []) {
    const to = r.from.endsWith('/*') && r.to.endsWith('/*') ? `${r.to.slice(0, -1)}:splat` : r.to;
    addRule(r.from, to, r.status);
  }
  for (const r of crawl.redirects) addRule(r.from, r.to, r.status);
  // Cloudflare counts every rule after the first splat/placeholder rule as dynamic (limit 100), so
  // exact rules go first; a specific rule then also wins over a broader pattern, as in next.config.
  const isDynamic = (line) => /[*:]/.test(line.split(/\s+/)[0]);
  const ordered = [...lines.filter((line) => !isDynamic(line)), ...lines.filter(isDynamic)];
  fs.writeFileSync(path.join(outDir, '_redirects'), `${ordered.join('\n')}\n`);

  // Fallback for hosts that ignore _redirects: a noindex page that forwards (exact paths only).
  let stubCount = 0;
  for (const [from, to] of stubs) {
    const file = path.join(outDir, pageFileFor(from));
    if (fs.existsSync(file)) continue;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, redirectStub(to));
    stubCount += 1;
  }

  // Headers: the site-wide security headers and cache rules from next.config.
  const blocks = [];
  for (const entry of await nextConfig.headers()) {
    let source;
    if (entry.source === '/(.*)') source = '/*';
    else if (entry.source === '/fonts/:path*') source = '/fonts/*';
    else continue;
    blocks.push([source, ...entry.headers.map((h) => {
      let value = h.value;
      if (mediaOrigin && h.key === 'Content-Security-Policy') {
        value = value.replace("media-src 'self'", `media-src 'self' ${mediaOrigin}`)
          .replace("connect-src 'self'", `connect-src 'self' ${mediaOrigin}`);
      }
      return `  ${h.key}: ${value}`;
    })].join('\n'));
  }
  blocks.push('/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable');
  // Cloudflare Pages also serves every deploy on *.pages.dev; only the real domain may be indexed.
  blocks.push('https://:project.pages.dev/*\n  X-Robots-Tag: noindex');
  blocks.push('https://:version.:project.pages.dev/*\n  X-Robots-Tag: noindex');
  blocks.push('https://:worker.:account.workers.dev/*\n  X-Robots-Tag: noindex');
  for (const f of crawl.files) {
    if (!/\.[a-z0-9]+$/i.test(f.path) && f.contentType) blocks.push(`${f.path}\n  Content-Type: ${f.contentType}`);
  }
  fs.writeFileSync(path.join(outDir, '_headers'), `${blocks.join('\n')}\n`);

  // `/`: the server negotiated Accept-Language; the static page does the same with navigator.languages.
  const locales = [...new Set(crawl.pages.map((p) => p.split('/')[1]).filter(Boolean))]
    .filter((segment) => /^[a-z]{2,3}(?:-[a-z]{2,4})?$/.test(segment) && fs.existsSync(path.join(outDir, `${segment}.html`)));
  fs.writeFileSync(path.join(outDir, 'index.html'), rootChooser(locales.sort()));

  const media = mediaOrigin ? moveMediaToOrigin(outDir, mediaOrigin) : { files: [], referenced: 0, missing: [] };
  if (media.files.length) {
    fs.writeFileSync(path.join(REPO_ROOT, 'static-site-media.json'), `${JSON.stringify({ mediaOrigin, files: media.files, missingReferences: media.missing }, null, 2)}\n`);
  }

  return {
    redirectRules: lines.length,
    redirectStubs: stubCount,
    headerBlocks: blocks.length,
    rootLocales: locales,
    media: {
      origin: mediaOrigin,
      files: media.files.length,
      bytes: media.files.reduce((sum, f) => sum + f.bytes, 0),
      referenced: media.referenced,
      missingReferences: media.missing,
    },
  };
}
