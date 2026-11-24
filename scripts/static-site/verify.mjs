// Checks the assembled static directory: sitemap coverage, broken local refs, server calls, sizes.
import fs from 'node:fs';
import path from 'node:path';
import { extractLocalRefs, findFlightLengthErrors, isServerOnlyPath, pageFileFor, walkFiles } from './shared.mjs';

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

function tagAttr(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match ? (match[1] ?? match[2] ?? match[3]) : null;
}

/** Which crawl-critical tags appear in this markup, whatever the attribute quoting or spacing. */
function headSeoFields(markup) {
  const links = markup.match(/<link\b[^>]*>/gi) ?? [];
  const metas = markup.match(/<meta\b[^>]*>/gi) ?? [];
  return {
    description: metas.some((tag) => tagAttr(tag, 'name')?.toLowerCase() === 'description'),
    canonical: links.some((tag) => tagAttr(tag, 'rel')?.toLowerCase() === 'canonical'),
    hreflang: links.some((tag) => tagAttr(tag, 'hreflang') !== null),
  };
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
    flightErrors: {},
    metaOutsideHead: [],
  };

  for (const file of files) {
    const size = fs.statSync(file).size;
    report.bytes += size;
    if (size > MAX_FILE_BYTES) report.oversize.push({ file: path.relative(outDir, file), size });
  }

  const sitemapPages = new Set();
  const sitemapPagesWithHreflang = new Set();
  const sitemapFile = path.join(outDir, 'sitemap.xml');
  if (fs.existsSync(sitemapFile)) {
    const sitemapXml = fs.readFileSync(sitemapFile, 'utf8');
    for (const block of sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = block[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
      if (loc && /hreflang=/i.test(block[1])) sitemapPagesWithHreflang.add(decodeURIComponent(new URL(loc.trim()).pathname));
    }
    for (const m of sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      report.sitemapUrls += 1;
      const pathname = new URL(m[1].trim()).pathname;
      sitemapPages.add(decodeURIComponent(pathname));
      if (!resolvesTo(outDir, pathname)) report.sitemapMissing.push(pathname);
    }
  } else {
    report.sitemapMissing.push('(sitemap.xml missing)');
  }

  for (const file of files.filter((f) => f.endsWith('.html'))) {
    report.htmlPages += 1;
    const rel = `/${path.relative(outDir, file).replace(/\.html$/, '')}`;
    const html = fs.readFileSync(file, 'utf8');
    // Google ignores canonical and hreflang outside <head>, so a page that streams them into <body> fails the build.
    const markup = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[\s\S]*?<\/script>/gi, '');
    const headEnd = Math.max(markup.search(/<\/head>/i), 0);
    const head = headSeoFields(markup.slice(0, headEnd));
    const body = headSeoFields(markup.slice(headEnd));
    const missingFromHead = sitemapPages.has(rel) && (
      !/<title[\s>]/i.test(markup.slice(0, headEnd))
      || !head.description
      || !head.canonical
      || (sitemapPagesWithHreflang.has(rel) && !head.hreflang)
    );
    if (body.description || body.canonical || body.hreflang || missingFromHead) report.metaOutsideHead.push(rel);
    // A broken RSC text-row length makes the page fall over during hydration.
    const flightErrors = findFlightLengthErrors(html);
    if (flightErrors.length) report.flightErrors[rel] = flightErrors.slice(0, 3);
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
