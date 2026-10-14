// Crawls the locally running snapshot server and saves every public page as a static file.
import fs from 'node:fs';
import path from 'node:path';
import {
  extractLocalRefs,
  isServerOnlyPath,
  FOLIO_NOT_FOUND_LOCALES,
  MAIN_LOCALES,
  pageFileFor,
  REPO_ROOT,
  SITE_ORIGIN,
} from './shared.mjs';

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

function publicFileExists(pathname) {
  try {
    return fs.statSync(path.join(REPO_ROOT, 'public', decodeURIComponent(pathname))).isFile();
  } catch {
    return false;
  }
}

function sitemapPaths(xml) {
  const paths = [];
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    try {
      paths.push(new URL(m[1].trim()).pathname);
    } catch {
      // ignore malformed entries; verify.mjs reports sitemap coverage
    }
  }
  return paths;
}

/**
 * @param {{ base: string, outDir: string, concurrency?: number, limit?: number, log?: (line: string) => void }} options
 * @returns {Promise<{ pages: string[], files: Array<{ path: string, file: string, contentType: string }>,
 *   redirects: Array<{ from: string, to: string, status: number }>, missing: Array<{ path: string, status: number, from: string[] }>,
 *   serverOnlyLinks: Record<string, string[]>, notFoundPages: Record<string, string> }>}
 */
export async function crawlSite({ base, outDir, concurrency = 6, limit = Infinity, log = () => {} }) {
  fs.mkdirSync(outDir, { recursive: true });
  const seen = new Set();
  const queue = [];
  const referrers = new Map();
  const result = { pages: [], files: [], redirects: [], missing: [], serverOnlyLinks: {}, notFoundPages: {} };

  const enqueue = (pathname, from) => {
    const clean = pathname.replace(/\/+$/, '') || '/';
    if (!referrers.has(clean)) referrers.set(clean, new Set());
    if (from) referrers.get(clean).add(from);
    if (clean === '/' || seen.has(clean)) return;
    if (clean.startsWith('/_next/static/') || publicFileExists(clean)) return;
    if (isServerOnlyPath(clean)) {
      (result.serverOnlyLinks[clean] ??= []).push(from ?? '(seed)');
      return;
    }
    seen.add(clean);
    queue.push(clean);
  };

  const sitemap = await fetch(`${base}/sitemap.xml`);
  if (!sitemap.ok) throw new Error(`sitemap.xml returned ${sitemap.status}`);
  const sitemapXml = await sitemap.text();
  for (const p of ['/sitemap.xml', '/robots.txt', '/manifest.webmanifest', '/icon.png', '/apple-icon.png', '/favicon.ico']) enqueue(p);
  for (const locale of MAIN_LOCALES) enqueue(`/${locale}`);
  for (const p of sitemapPaths(sitemapXml)) enqueue(p);

  const root = path.resolve(outDir);
  const saveFile = (relative, body) => {
    const target = path.resolve(root, relative);
    if (!target.startsWith(`${root}${path.sep}`)) throw new Error(`Refusing to write outside ${root}: ${relative}`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, body);
  };
  const fileFor = (pathname) => {
    try {
      return pageFileFor(pathname);
    } catch {
      return null; // malformed percent-encoding
    }
  };

  let processed = 0;
  const worker = async () => {
    while (queue.length && processed < limit) {
      const pathname = queue.shift();
      processed += 1;
      let response;
      try {
        response = await fetch(`${base}${pathname}`, {
          redirect: 'manual',
          headers: { 'accept-language': 'ko' },
          signal: AbortSignal.timeout(120_000),
        });
      } catch (error) {
        result.missing.push({ path: pathname, status: 0, from: [...(referrers.get(pathname) ?? [])].slice(0, 5) });
        log(`ERR  ${pathname} ${error instanceof Error ? error.message : error}`);
        continue;
      }
      if (REDIRECT_STATUSES.has(response.status)) {
        await response.arrayBuffer().catch(() => undefined);
        const location = response.headers.get('location') ?? '';
        const target = new URL(location, `${base}${pathname}`);
        const to = target.origin === base || target.origin === SITE_ORIGIN
          ? `${target.pathname}${target.search}`
          : target.href;
        result.redirects.push({ from: pathname, to, status: response.status });
        if (!to.startsWith('http')) enqueue(target.pathname, pathname);
        continue;
      }
      if (!response.ok) {
        await response.arrayBuffer().catch(() => undefined);
        result.missing.push({ path: pathname, status: response.status, from: [...(referrers.get(pathname) ?? [])].slice(0, 5) });
        continue;
      }
      const htmlFile = fileFor(pathname);
      if (!htmlFile) {
        await response.arrayBuffer().catch(() => undefined);
        result.missing.push({ path: pathname, status: -1, from: [...(referrers.get(pathname) ?? [])].slice(0, 5) });
        continue;
      }
      const contentType = response.headers.get('content-type') ?? '';
      if (contentType.includes('text/html')) {
        const html = await response.text();
        saveFile(htmlFile, html);
        result.pages.push(pathname);
        for (const ref of extractLocalRefs(html, `${base}${pathname}`, base)) enqueue(ref, pathname);
      } else {
        const body = Buffer.from(await response.arrayBuffer());
        // Route handlers without an extension keep their path; assemble.mjs sets their Content-Type.
        const file = htmlFile.replace(/\.html$/, '');
        saveFile(file, body);
        result.files.push({ path: pathname, file, contentType });
        if (contentType.includes('text/css')) {
          for (const ref of extractLocalRefs(body.toString('utf8'), `${base}${pathname}`, base)) enqueue(ref, pathname);
        }
      }
      if (processed % 100 === 0) log(`... ${processed} fetched, ${queue.length} queued`);
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));

  // Builder SEO redirects (middleware rules from site.json); old URLs are rarely linked, so read the rules.
  result.builderRedirects = [];
  const seenRules = new Set();
  for (const locale of MAIN_LOCALES) {
    const response = await fetch(`${base}/api/builder/site/redirects/public?locale=${locale}`).catch(() => null);
    if (!response?.ok) continue;
    const payload = await response.json().catch(() => ({}));
    for (const rule of Array.isArray(payload.redirects) ? payload.redirects : []) {
      if (!rule?.isActive || typeof rule.from !== 'string' || typeof rule.to !== 'string') continue;
      const key = `${rule.from} ${rule.to} ${rule.type}`;
      if (seenRules.has(key)) continue;
      seenRules.add(key);
      result.builderRedirects.push({ from: rule.from, to: rule.to, status: Number(rule.type) || 301 });
    }
  }

  // Localized not-found pages, served by the host for unknown paths under each locale.
  for (const locale of [...MAIN_LOCALES, ...FOLIO_NOT_FOUND_LOCALES, '']) {
    const probe = `${locale ? `/${locale}` : ''}/__static-site-not-found__`;
    const response = await fetch(`${base}${probe}`, { redirect: 'manual' });
    if (response.status === 404 && (response.headers.get('content-type') ?? '').includes('text/html')) {
      const file = locale ? `${locale}/404.html` : '404.html';
      saveFile(file, await response.text());
      result.notFoundPages[locale || '/'] = file;
    }
  }

  return result;
}
