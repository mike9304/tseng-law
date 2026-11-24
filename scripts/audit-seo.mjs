#!/usr/bin/env node
// Audits the crawlable HTML of the public site: head placement, canonical, hreflang, sitemap,
// headings, JSON-LD, snippet controls, and title/description length and uniqueness.
//
//   node scripts/audit-seo.mjs --out=<static out dir> [--json=report.json] [--gate] [--samples=5]
//   node scripts/audit-seo.mjs --base=https://tseng-law.com [--json=report.json] [--gate]
//
// --gate exits 1 when any check marked `gate` has failures. Other checks are reported only.
import fs from 'node:fs';
import path from 'node:path';
import { pageFileFor } from './static-site/shared.mjs';

const SITE_ORIGIN = 'https://tseng-law.com';
const FOCUS_LOCALES = ['ko', 'zh-hant', 'ja', 'en', 'vi', 'ms'];
const LENGTH_RULES = {
  ko: { title: [30, 35], description: [110, 140] },
  ja: { title: [30, 35], description: [110, 140] },
  'zh-hant': { title: [30, 35], description: [110, 140] },
  en: { title: [55, 60], description: [145, 155] },
  vi: { title: [55, 60], description: [145, 155] },
  ms: { title: [55, 60], description: [145, 155] },
};
// Pages whose title and description were written to the length rules. Failures here block the gate.
const PRIORITY_PATHS = new Set([
  '/ko', '/ko/taiwan-lawyer', '/ko/taiwan-company-setup-lawyer', '/ko/taiwan-litigation-lawyer',
  '/ko/korean-lawyer-in-taiwan', '/ko/lawyers', '/ko/guides/taiwan-company-setup', '/ko/columns',
  '/ja', '/ja/taiwan-lawyer', '/ja/taiwan-company-setup-lawyer', '/ja/lawyers',
  '/en', '/en/taiwan-lawyer', '/en/taiwan-company-setup-lawyer', '/en/lawyers',
  '/vi', '/vi/company-setup', '/vi/lawyers',
  '/ms', '/ms/services', '/ms/lawyers', '/ms/company-setup', '/ms/debt-collection',
  '/zh-hant', '/zh-hant/taiwan-lawyer', '/zh-hant/taiwan-company-setup-lawyer',
]);
const NOSNIPPET_ELEMENTS = new Set(['div', 'span', 'section']);

const CHECKS = {
  'head-title': { gate: true, label: 'title in <head>' },
  'head-description': { gate: true, label: 'meta description in <head>' },
  'head-canonical': { gate: true, label: 'exactly one canonical in <head>' },
  'head-hreflang': { gate: true, label: 'sitemap hreflang present in <head>' },
  'canonical-self': { gate: true, label: 'canonical is the page itself' },
  'hreflang-self': { gate: true, label: 'hreflang includes the page itself' },
  'hreflang-reciprocal': { gate: true, label: 'hreflang links return' },
  'hreflang-target': { gate: true, label: 'hreflang targets are in the sitemap' },
  'hreflang-x-default': { gate: true, label: 'x-default present' },
  'hreflang-label': { gate: true, label: 'hreflang label matches the destination locale' },
  'hreflang-sitemap-match': { gate: true, label: 'head hreflang map equals sitemap map' },
  'priority-present': { gate: true, label: 'priority page is in the sitemap' },
  'sitemap-resolves': { gate: true, label: 'sitemap URL returns a page' },
  'sitemap-noindex': { gate: true, label: 'sitemap URL is indexable' },
  'h1-exactly-one': { gate: true, label: 'exactly one h1' },
  'jsonld-parse': { gate: true, label: 'JSON-LD parses' },
  'article-dates': { gate: true, label: 'Article has both dates' },
  'article-no-author': { gate: true, label: 'Article has no author (editorial rule)' },
  'article-breadcrumb': { gate: true, label: 'Article page has BreadcrumbList' },
  'person-name': { gate: true, label: 'Person.name has no job title' },
  'faq-matches-body': { gate: true, label: 'FAQPage questions appear in the page' },
  'nosnippet-element': { gate: true, label: 'data-nosnippet only on div/span/section' },
  'nosnippet-chrome': { gate: true, label: 'page has data-nosnippet site chrome' },
  'duplicate-title': { gate: true, label: 'title unique' },
  'duplicate-description': { gate: true, label: 'description unique' },
  'priority-title-length': { gate: true, label: 'priority page title length' },
  'priority-description-length': { gate: true, label: 'priority page description length' },
  'title-length': { gate: false, label: 'focus-locale title length' },
  'description-length': { gate: false, label: 'focus-locale description length' },
  'heading-skip': { gate: false, label: 'no skipped heading level' },
};

function parseArgs(argv) {
  const args = { out: null, base: null, json: null, gate: false, samples: 5, concurrency: 8 };
  for (const arg of argv) {
    if (arg.startsWith('--out=')) args.out = path.resolve(arg.slice(6));
    else if (arg.startsWith('--base=')) args.base = arg.slice(7).replace(/\/+$/, '');
    else if (arg.startsWith('--json=')) args.json = path.resolve(arg.slice(7));
    else if (arg === '--gate') args.gate = true;
    else if (arg.startsWith('--samples=')) args.samples = Number(arg.slice(10));
    else if (arg.startsWith('--concurrency=')) args.concurrency = Number(arg.slice(14));
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (Boolean(args.out) === Boolean(args.base)) throw new Error('Pass exactly one of --out or --base.');
  return args;
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
function decodeEntities(value) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code) => {
    if (code[0] !== '#') return ENTITIES[code.toLowerCase()] ?? whole;
    const point = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1));
    return Number.isFinite(point) && point <= 0x10ffff ? String.fromCodePoint(point) : whole;
  });
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'));
  return match ? decodeEntities(match[1] ?? match[2] ?? '') : null;
}

const stripNonContent = (html) => html
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<template\b[\s\S]*?<\/template>/gi, ' ')
  .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ');
const toText = (html) => decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
// \p{Cf} covers the word joiner the site inserts after CJK glosses, e.g. 퇴직금(資遣費)⁠을.
const compact = (text) => text.replace(/[\s\p{P}\p{S}\p{Cf}]+/gu, '').toLowerCase();
const charLength = (text) => [...text].length;

function walkJsonLd(node, visit) {
  if (Array.isArray(node)) {
    for (const item of node) walkJsonLd(item, visit);
  } else if (node && typeof node === 'object') {
    visit(node);
    for (const value of Object.values(node)) walkJsonLd(value, visit);
  }
}

const typesOf = (node) => (Array.isArray(node['@type']) ? node['@type'] : [node['@type']]).filter(Boolean);

function parsePage(url, html) {
  const headEnd = html.search(/<\/head>/i);
  const head = headEnd >= 0 ? html.slice(0, headEnd) : '';
  const bodyRaw = headEnd >= 0 ? html.slice(headEnd) : html;
  const body = stripNonContent(bodyRaw);
  const headTitle = head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const page = {
    url,
    pathname: new URL(url).pathname,
    title: headTitle ? decodeEntities(headTitle[1]).trim() : null,
    description: null,
    robots: null,
    canonicals: [],
    hreflang: {},
    h1: (body.match(/<h1\b/gi) ?? []).length,
    headingSkip: false,
    jsonLdErrors: 0,
    articles: [],
    hasBreadcrumb: false,
    personNames: [],
    faqMissing: [],
    badNosnippet: [],
    hasNosnippetChrome: false,
  };
  for (const tag of head.match(/<meta\b[^>]*>/gi) ?? []) {
    const name = attr(tag, 'name')?.toLowerCase();
    if (name === 'description' && page.description === null) page.description = attr(tag, 'content')?.trim() ?? '';
    if (name === 'robots' && page.robots === null) page.robots = attr(tag, 'content') ?? '';
  }
  for (const tag of head.match(/<link\b[^>]*>/gi) ?? []) {
    const rel = attr(tag, 'rel')?.toLowerCase();
    if (rel === 'canonical') page.canonicals.push(attr(tag, 'href'));
    if (rel === 'alternate') {
      const lang = attr(tag, 'hreflang');
      if (lang) page.hreflang[lang] = attr(tag, 'href');
    }
  }
  const main = body.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? body;
  let previous = 0;
  for (const match of main.matchAll(/<h([1-6])\b/gi)) {
    const level = Number(match[1]);
    if (previous && level > previous + 1) page.headingSkip = true;
    previous = level;
  }
  const bodyText = compact(toText(body));
  for (const match of html.matchAll(/<script\b[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    let data;
    try {
      data = JSON.parse(match[1]);
    } catch {
      page.jsonLdErrors += 1;
      continue;
    }
    walkJsonLd(data, (node) => {
      const types = typesOf(node);
      if (types.some((type) => type === 'Article' || type === 'BlogPosting')) {
        page.articles.push({
          datePublished: node.datePublished ?? null,
          dateModified: node.dateModified ?? null,
          hasAuthor: node.author !== undefined,
        });
      }
      if (types.includes('BreadcrumbList')) page.hasBreadcrumb = true;
      if (types.includes('Person') && typeof node.name === 'string') page.personNames.push(node.name);
      if (types.includes('Question') && typeof node.name === 'string' && !bodyText.includes(compact(decodeEntities(node.name)))) {
        page.faqMissing.push(node.name);
      }
    });
  }
  for (const match of body.matchAll(/<([a-z][a-z0-9-]*)\b[^>]*\sdata-nosnippet\b[^>]*>/gi)) {
    const element = match[1].toLowerCase();
    if (!NOSNIPPET_ELEMENTS.has(element)) page.badNosnippet.push(element);
    else page.hasNosnippetChrome = true;
  }
  return page;
}

function readSitemap(xml) {
  const urls = new Map();
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block[1].match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    if (!loc) continue;
    const alternates = {};
    for (const link of block[1].match(/<xhtml:link\b[^>]*>/g) ?? []) {
      const lang = attr(link, 'hreflang');
      if (lang) alternates[lang] = attr(link, 'href');
    }
    urls.set(decodeEntities(loc), alternates);
  }
  return urls;
}

async function loadHtml(args, url) {
  if (args.out) {
    const file = path.join(args.out, pageFileFor(new URL(url).pathname));
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  }
  const target = `${args.base}${new URL(url).pathname}`;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(target, { redirect: 'manual', signal: AbortSignal.timeout(30_000) });
      if (response.status !== 200) {
        await response.arrayBuffer().catch(() => undefined);
        return null;
      }
      return await response.text();
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
  return null;
}

function localeOf(pathname) {
  return pathname.split('/')[1] ?? '';
}

function outOfRange(value, [min, max]) {
  if (value === null) return true;
  const length = charLength(value);
  return length < min || length > max;
}

const sortedMap = (map) => JSON.stringify(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));

function audit(pages, sitemap, missing) {
  const failures = Object.fromEntries(Object.keys(CHECKS).map((key) => [key, []]));
  const fail = (key, url, detail) => failures[key].push(detail === undefined ? url : `${url} :: ${detail}`);
  const byUrl = new Map(pages.map((page) => [page.url, page]));
  for (const url of missing) fail('sitemap-resolves', url);
  for (const pathname of PRIORITY_PATHS) {
    if (!sitemap.has(`${SITE_ORIGIN}${pathname}`)) fail('priority-present', pathname);
  }

  for (const page of pages) {
    const { url, pathname } = page;
    const expected = sitemap.get(url) ?? {};
    if (!page.title) fail('head-title', url);
    if (!page.description) fail('head-description', url);
    if (page.canonicals.length !== 1) fail('head-canonical', url, page.canonicals.length);
    else if (page.canonicals[0] !== url) fail('canonical-self', url, page.canonicals[0]);
    if (Object.keys(expected).length && !Object.keys(page.hreflang).length) fail('head-hreflang', url);
    if (Object.keys(page.hreflang).length) {
      if (!Object.values(page.hreflang).includes(url)) fail('hreflang-self', url);
      if (!page.hreflang['x-default']) fail('hreflang-x-default', url);
      const ownTags = Object.entries(page.hreflang)
        .filter(([lang, href]) => lang !== 'x-default' && href === url)
        .map(([lang]) => lang);
      for (const [lang, href] of Object.entries(page.hreflang)) {
        if (lang !== 'x-default' && localeOf(new URL(href).pathname) !== lang.toLowerCase()) {
          fail('hreflang-label', url, `${lang} ${href}`);
        }
        const target = byUrl.get(href);
        if (!target) fail('hreflang-target', url, `${lang} ${href}`);
        else if (lang !== 'x-default' && !ownTags.some((tag) => target.hreflang[tag] === url)) {
          fail('hreflang-reciprocal', url, `${lang} ${href}`);
        }
      }
    }
    if (Object.keys(expected).length && sortedMap(page.hreflang) !== sortedMap(expected)) {
      fail('hreflang-sitemap-match', url);
    }
    if (page.robots && /noindex/i.test(page.robots)) fail('sitemap-noindex', url, page.robots);
    if (page.h1 !== 1) fail('h1-exactly-one', url, page.h1);
    if (page.headingSkip) fail('heading-skip', url);
    if (page.jsonLdErrors) fail('jsonld-parse', url, page.jsonLdErrors);
    for (const article of page.articles) {
      if (!article.datePublished || !article.dateModified) fail('article-dates', url);
      if (article.hasAuthor) fail('article-no-author', url);
    }
    if (page.articles.length && !page.hasBreadcrumb) fail('article-breadcrumb', url);
    for (const name of page.personNames) {
      if (/(변호사|律師|弁護士|attorney|lawyer|luật sư|peguam)/i.test(name)) fail('person-name', url, name);
    }
    for (const question of page.faqMissing) fail('faq-matches-body', url, question);
    for (const element of new Set(page.badNosnippet)) fail('nosnippet-element', url, element);
    if (!page.hasNosnippetChrome) fail('nosnippet-chrome', url);

    const rules = LENGTH_RULES[localeOf(pathname)];
    if (rules) {
      const priority = PRIORITY_PATHS.has(pathname);
      if (outOfRange(page.title, rules.title)) {
        fail(priority ? 'priority-title-length' : 'title-length', url, charLength(page.title ?? ''));
      }
      if (outOfRange(page.description, rules.description)) {
        fail(priority ? 'priority-description-length' : 'description-length', url, charLength(page.description ?? ''));
      }
    }
  }

  for (const [field, key] of [['title', 'duplicate-title'], ['description', 'duplicate-description']]) {
    const groups = new Map();
    for (const page of pages) {
      if (!page[field]) continue;
      if (!groups.has(page[field])) groups.set(page[field], []);
      groups.get(page[field]).push(page.url);
    }
    for (const [value, urls] of groups) {
      if (urls.length > 1) fail(key, urls[0], `${urls.length} pages share "${value.slice(0, 60)}"`);
    }
  }
  return failures;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let sitemapXml;
  if (args.out) {
    sitemapXml = fs.readFileSync(path.join(args.out, 'sitemap.xml'), 'utf8');
  } else {
    const response = await fetch(`${args.base}/sitemap.xml`, { signal: AbortSignal.timeout(60_000) });
    if (!response.ok) throw new Error(`sitemap.xml returned ${response.status}`);
    sitemapXml = await response.text();
  }
  const sitemap = readSitemap(sitemapXml);
  if (sitemap.size === 0) throw new Error('sitemap.xml has no <url> entries');
  const urls = [...sitemap.keys()];
  const pages = [];
  const missing = [];
  let cursor = 0;
  const worker = async () => {
    while (cursor < urls.length) {
      const url = urls[cursor];
      cursor += 1;
      const html = await loadHtml(args, url);
      if (html === null) missing.push(url);
      else pages.push(parsePage(url, html));
    }
  };
  await Promise.all(Array.from({ length: args.concurrency }, worker));

  const failures = audit(pages, sitemap, missing);
  const summary = Object.entries(CHECKS).map(([key, check]) => ({
    key,
    label: check.label,
    gate: check.gate,
    failures: failures[key].length,
    samples: failures[key].slice(0, args.samples),
  }));
  const byLocale = {};
  for (const page of pages) {
    const locale = localeOf(page.pathname);
    byLocale[locale] = (byLocale[locale] ?? 0) + 1;
  }
  const gateFailures = summary.filter((row) => row.gate && row.failures > 0);

  console.log(`[audit-seo] ${args.out ?? args.base}: ${urls.length} sitemap URLs, ${pages.length} pages read`);
  console.log(`[audit-seo] focus locales: ${FOCUS_LOCALES.map((l) => `${l} ${byLocale[l] ?? 0}`).join(', ')}`);
  for (const row of summary) {
    const status = row.failures === 0 ? 'PASS' : row.gate ? 'FAIL' : 'WARN';
    console.log(`${status.padEnd(4)} ${String(row.failures).padStart(5)}  ${row.key}  (${row.label})`);
    if (row.failures) for (const sample of row.samples) console.log(`             ${sample}`);
  }
  console.log(`[audit-seo] gate: ${gateFailures.length ? `FAIL (${gateFailures.length} checks)` : 'PASS'}`);
  if (args.json) {
    fs.mkdirSync(path.dirname(args.json), { recursive: true });
    fs.writeFileSync(args.json, `${JSON.stringify({
      generatedAt: new Date().toISOString(),
      source: args.out ?? args.base,
      urls: urls.length,
      pages: pages.length,
      byLocale,
      summary,
      failures,
    }, null, 2)}\n`);
  }
  if (args.gate && gateFailures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
