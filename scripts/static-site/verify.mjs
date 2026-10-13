// Checks the assembled static directory: sitemap coverage, broken local refs, server calls, sizes.
import fs from 'node:fs';
import path from 'node:path';
import { extractLocalRefs, isServerOnlyPath, pageFileFor, walkFiles } from './shared.mjs';

const MAX_FILE_BYTES = 25 * 1024 * 1024; // Cloudflare static asset limit per file

function redirectMatchers(outDir) {
  const file = path.join(outDir, '_redirects');
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((line) => {
    const [from] = line.split(/\s+/);
    const pattern = from
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\*$/, '.*')
      .replace(/:[A-Za-z]+/g, '[^/]+');
    return new RegExp(`^${pattern}$`);
  });
}

export function resolvesTo(outDir, pathname) {
  const decoded = decodeURIComponent(pathname);
  const direct = path.join(outDir, decoded);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return true;
  return fs.existsSync(path.join(outDir, pageFileFor(pathname)));
}

/** @param {{ outDir: string }} options */
export function verifySite({ outDir }) {
  const redirects = redirectMatchers(outDir);
  const isRedirected = (p) => redirects.some((re) => re.test(p));
  const files = walkFiles(outDir);
  const report = {
    files: files.length,
    bytes: 0,
    htmlPages: 0,
    oversize: [],
    sitemapUrls: 0,
    sitemapMissing: [],
    brokenRefs: {},
    serverOnlyRefs: {},
    apiStrings: {},
  };

  for (const file of files) {
    const size = fs.statSync(file).size;
    report.bytes += size;
    if (size > MAX_FILE_BYTES) report.oversize.push({ file: path.relative(outDir, file), size });
  }

  const sitemapFile = path.join(outDir, 'sitemap.xml');
  if (fs.existsSync(sitemapFile)) {
    for (const m of fs.readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
      report.sitemapUrls += 1;
      const pathname = new URL(m[1].trim()).pathname;
      if (!resolvesTo(outDir, pathname)) report.sitemapMissing.push(pathname);
    }
  } else {
    report.sitemapMissing.push('(sitemap.xml missing)');
  }

  for (const file of files.filter((f) => f.endsWith('.html'))) {
    report.htmlPages += 1;
    const rel = `/${path.relative(outDir, file).replace(/\.html$/, '')}`;
    const html = fs.readFileSync(file, 'utf8');
    for (const ref of extractLocalRefs(html, `https://tseng-law.com${rel}`, 'https://tseng-law.com')) {
      if (isServerOnlyPath(ref)) {
        (report.serverOnlyRefs[ref] ??= []).push(rel);
        continue;
      }
      if (resolvesTo(outDir, ref) || isRedirected(ref) || ref === '/') continue;
      (report.brokenRefs[ref] ??= []).push(rel);
    }
    // Client code that would call an API at runtime shows up as a literal path in the HTML/RSC payload.
    for (const m of html.matchAll(/["'(](\/api\/[a-z0-9/_-]+)/gi)) {
      (report.apiStrings[m[1]] ??= new Set()).add(rel);
    }
  }
  for (const key of Object.keys(report.apiStrings)) report.apiStrings[key] = [...report.apiStrings[key]].slice(0, 5);
  for (const key of Object.keys(report.brokenRefs)) report.brokenRefs[key] = report.brokenRefs[key].slice(0, 5);
  for (const key of Object.keys(report.serverOnlyRefs)) {
    const pages = report.serverOnlyRefs[key];
    report.serverOnlyRefs[key] = { count: pages.length, pages: pages.slice(0, 3) };
  }
  return report;
}
