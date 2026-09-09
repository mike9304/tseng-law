#!/usr/bin/env node
/**
 * Live smoke for the eight-language guidance / four-language consultation site.
 *
 * Usage:
 *   node scripts/verify-multilingual-live.mjs --base https://tseng-law.com
 *   BASE_URL=http://127.0.0.1:4345 node scripts/verify-multilingual-live.mjs --json out.json
 *
 * Node 24 built-in fetch only — no extra dependencies, no tsx.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '..');

/**
 * From src/lib/public-guidance.ts `PUBLIC_LOCALES_8` and src/middleware.ts
 * matcher `ko|zh-hant|en|ja` + `vi|id|th|fil`. Plain Node cannot import those
 * TypeScript modules without tsx, so the same values are inlined here.
 */
export const PUBLIC_LOCALES_8 = Object.freeze([
  'ko',
  'zh-hant',
  'en',
  'ja',
  'vi',
  'id',
  'th',
  'fil',
]);

/** New guidance four — src/lib/public-guidance.ts `GUIDANCE_LOCALES_4`. */
export const GUIDANCE_LOCALES_4 = Object.freeze(['vi', 'id', 'th', 'fil']);

/**
 * Core routes from src/lib/public-guidance.ts `GUIDANCE_PAGE_KEYS` /
 * `GUIDANCE_CORE_ROUTE_KEYS`. Home is the empty slug, never `home`.
 */
export const GUIDANCE_PAGE_KEYS = Object.freeze([
  'home',
  'services',
  'about',
  'lawyers',
  'pricing',
  'contact',
  'faq',
  'privacy',
  'disclaimer',
  'columns',
]);

/**
 * Mirrors src/lib/seo-visibility.ts `isEnglishNoindexPath` for core routes
 * (`/faq` only). `buildGuidanceCoreLanguageAlternates` then omits `en`.
 */
const ENGLISH_NOINDEX_PAGE_KEYS = new Set(['faq']);

/** Warning-only hint. Do not fail on count mismatch. */
const SITEMAP_COUNT_HINT = 207;
const SITEMAP_COUNT_WARN_DELTA = 30;

const DEFAULT_CONCURRENCY = 6;
const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Internal-memo phrases that must not appear on public privacy pages.
 * Spec WO-G18 item e.
 */
export const PRIVACY_MEMO_PHRASES = Object.freeze([
  '확인이 필요',
  '須由營運者確認',
  '運営者による確認',
  'operator confirmation',
]);

export function hreflangTagForPublicLocale(locale) {
  return locale === 'zh-hant' ? 'zh-Hant' : locale;
}

export function publicDocumentLanguage(locale) {
  return locale === 'zh-hant' ? 'zh-Hant' : locale;
}

export function guidancePublicPath(locale, pageKey) {
  return pageKey === 'home' ? `/${locale}` : `/${locale}/${pageKey}`;
}

export function requiredHreflangTags(pageKey) {
  const locales = ENGLISH_NOINDEX_PAGE_KEYS.has(pageKey)
    ? PUBLIC_LOCALES_8.filter((locale) => locale !== 'en')
    : PUBLIC_LOCALES_8;
  return [...locales.map(hreflangTagForPublicLocale), 'x-default'];
}

export function parseCliArgs(argv, env = process.env) {
  let baseUrl = env.BASE_URL || env.BASE || '';
  let jsonPath = '';
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--base' || arg === '--base-url') {
      baseUrl = argv[i + 1] ?? '';
      i += 1;
    } else if (arg.startsWith('--base=')) {
      baseUrl = arg.slice('--base='.length);
    } else if (arg === '--json') {
      jsonPath = argv[i + 1] ?? '';
      i += 1;
    } else if (arg.startsWith('--json=')) {
      jsonPath = arg.slice('--json='.length);
    }
  }
  return {
    baseUrl: normalizeBaseUrl(baseUrl),
    jsonPath: jsonPath.trim(),
  };
}

function normalizeBaseUrl(value) {
  return String(value || '').trim().replace(/\/+$/, '');
}

function decodeXmlText(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function attr(tag, name) {
  const match = tag.match(
    new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'),
  );
  return match ? (match[1] ?? match[2] ?? match[3] ?? '') : '';
}

export function parseSitemapLocs(xml) {
  const locs = [];
  const re = /<loc\b[^>]*>([\s\S]*?)<\/loc>/gi;
  let match;
  while ((match = re.exec(xml))) {
    const loc = decodeXmlText(match[1].trim());
    if (loc) locs.push(loc);
  }
  return locs;
}

export function parseHtmlLang(html) {
  const match = html.match(/<html\b[^>]*\blang\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  return match ? (match[1] ?? match[2] ?? match[3] ?? '').trim() : '';
}

export function parseHreflangAlternates(html) {
  const out = new Map();
  const re = /<link\b[^>]*>/gi;
  let match;
  while ((match = re.exec(html))) {
    const tag = match[0];
    const rel = attr(tag, 'rel');
    if (!/\balternate\b/i.test(rel)) continue;
    const hreflang = attr(tag, 'hreflang');
    const href = attr(tag, 'href');
    if (hreflang && href) out.set(hreflang, href);
  }
  return out;
}

function extractSingleQuotedField(block, field) {
  const re = new RegExp(`${field}:\\s*(?:'((?:\\\\'|[^'])*)'|\\n\\s*'((?:\\\\'|[^'])*)')`);
  const match = re.exec(block);
  if (!match) return '';
  return (match[1] ?? match[2] ?? '').replace(/\\'/g, "'");
}

function localeObjectBlock(source, locale) {
  const quoted = locale.includes('-');
  const key = quoted ? `'${locale}'` : locale;
  const startRe = new RegExp(`(?:^|\\n)\\s+${key}:\\s*\\{`);
  const startMatch = startRe.exec(source);
  if (!startMatch) return '';
  const start = startMatch.index + startMatch[0].length;
  const rest = source.slice(start);
  const next = rest.search(/\n  (?:'[a-z-]+'|[a-z]+):\s*\{/);
  return next === -1 ? rest : rest.slice(0, next);
}

/**
 * TypeScript inquiry/guidance modules cannot be imported from plain Node
 * (path aliases + TS syntax). Extract the live expected strings with regex.
 */
export async function loadConsultationNeedles(repoRoot = REPO_ROOT) {
  const inquiryPath = join(repoRoot, 'src/data/international-inquiry-copy.ts');
  const source = await readFile(inquiryPath, 'utf8');
  /** @type {Record<string, string>} */
  const needles = {};
  for (const locale of GUIDANCE_LOCALES_4) {
    const block = localeObjectBlock(source, locale);
    const notice = extractSingleQuotedField(block, 'consultationNotice');
    if (!notice) {
      throw new Error(`consultationNotice not found for ${locale} in ${inquiryPath}`);
    }
    needles[locale] = notice;
  }
  return needles;
}

export function htmlContainsNeedle(html, needle) {
  return html.includes(needle);
}

export function findPrivacyMemoHits(html) {
  return PRIVACY_MEMO_PHRASES.filter((phrase) => html.includes(phrase));
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let index = 0;
  const n = Math.max(1, Math.min(concurrency, Math.max(items.length, 1)));
  async function run() {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length || 1) }, run));
  return results;
}

function isAbortError(error) {
  return error?.name === 'AbortError' || error?.code === 'ABORT_ERR';
}

async function fetchOnce(fetchImpl, url, init, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(url, {
      redirect: 'follow',
      ...init,
      signal: controller.signal,
      headers: {
        accept: '*/*',
        'user-agent': 'tseng-verify-multilingual-live/1',
        ...(init.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

function emptyCheck(id, name) {
  return {
    id,
    name,
    ok: true,
    pass: 0,
    fail: 0,
    warning: null,
    failures: [],
    extras: {},
  };
}

function addFailure(check, detail) {
  check.fail += 1;
  check.ok = false;
  check.failures.push(detail);
}

function addPass(check) {
  check.pass += 1;
}

export function formatHumanReport(result) {
  const rows = [
    ['item', 'name', 'result', 'pass', 'fail', 'notes'],
    ['----', '----', '------', '----', '----', '-----'],
  ];
  const checks = result.checks;
  const order = [
    ['a', checks.a_sitemap],
    ['b', checks.b_core_pages],
    ['c', checks.c_hreflang],
    ['d', checks.d_consultation_notice],
    ['e', checks.e_privacy_memo],
    ['f', checks.f_translated_columns],
  ];
  for (const [item, check] of order) {
    const notes = [];
    if (check.extras?.locCount != null) notes.push(`locs=${check.extras.locCount}`);
    if (check.warning) notes.push(check.warning);
    if (check.failures.length) {
      const preview = check.failures.slice(0, 3).map((item) => item.message || item.url || JSON.stringify(item));
      notes.push(preview.join('; '));
      if (check.failures.length > 3) notes.push(`+${check.failures.length - 3} more`);
    }
    rows.push([
      item,
      check.name,
      check.ok ? 'PASS' : 'FAIL',
      String(check.pass),
      String(check.fail),
      notes.join(' | ') || '—',
    ]);
  }

  const widths = rows[0].map((_, col) => Math.max(...rows.map((row) => String(row[col]).length)));
  const table = rows
    .map((row) => row.map((cell, col) => String(cell).padEnd(widths[col])).join('  '))
    .join('\n');

  const totals = order.reduce(
    (acc, [, check]) => {
      acc.pass += check.pass;
      acc.fail += check.fail;
      return acc;
    },
    { pass: 0, fail: 0 },
  );

  return [
    `multilingual live check  base=${result.baseUrl}`,
    `overall ${result.ok ? 'PASS' : 'FAIL'}  pass=${totals.pass}  fail=${totals.fail}`,
    '',
    table,
  ].join('\n');
}

export async function runMultilingualLiveCheck({
  baseUrl,
  fetchImpl = globalThis.fetch,
  concurrency = DEFAULT_CONCURRENCY,
  timeoutMs = REQUEST_TIMEOUT_MS,
  repoRoot = REPO_ROOT,
  consultationNeedles,
} = {}) {
  const origin = normalizeBaseUrl(baseUrl);
  if (!origin) {
    throw new Error('BASE_URL env or --base is required');
  }
  if (typeof fetchImpl !== 'function') {
    throw new Error('fetch is not available');
  }

  const needles = consultationNeedles ?? await loadConsultationNeedles(repoRoot);
  const cache = new Map();

  async function request(url, { method = 'GET', wantBody = false } = {}) {
    const methodKey = wantBody ? 'GET' : method;
    const cacheKey = `${methodKey}:${url}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const getKey = `GET:${url}`;
    if (!wantBody && method === 'HEAD' && cache.has(getKey)) {
      const cachedGet = cache.get(getKey);
      return cachedGet;
    }

    const record = {
      url,
      method: methodKey,
      status: 0,
      ok: false,
      body: '',
      error: '',
    };

    try {
      let response = await fetchOnce(fetchImpl, url, { method: methodKey }, timeoutMs);
      if (!wantBody && methodKey === 'HEAD' && response.status !== 200) {
        response = await fetchOnce(fetchImpl, url, { method: 'GET' }, timeoutMs);
        record.method = 'GET';
      }
      record.status = response.status;
      record.ok = response.status === 200;
      if (wantBody || record.method === 'GET') {
        try {
          record.body = await response.text();
        } catch {
          record.body = '';
        }
      }
    } catch (error) {
      const cause = error?.cause;
      const causeText = cause
        ? `${cause.code || cause.name || 'cause'}: ${cause.message || cause}`
        : '';
      record.error = isAbortError(error)
        ? `timeout after ${timeoutMs}ms`
        : [error?.message || String(error), causeText].filter(Boolean).join(' — ');
    }

    cache.set(`${record.method}:${url}`, record);
    if (record.method === 'GET') cache.set(`GET:${url}`, record);
    return record;
  }

  const checks = {
    a_sitemap: emptyCheck('a', 'sitemap loc HEAD/GET'),
    b_core_pages: emptyCheck('b', 'core pages 200 + html lang'),
    c_hreflang: emptyCheck('c', 'hreflang 8 locales + x-default'),
    d_consultation_notice: emptyCheck('d', 'consultation language notice'),
    e_privacy_memo: emptyCheck('e', 'privacy internal-memo phrases'),
    f_translated_columns: emptyCheck('f', 'translated columns 200 + hreflang'),
  };

  const sitemapUrl = `${origin}/sitemap.xml`;
  const sitemapResponse = await request(sitemapUrl, { method: 'GET', wantBody: true });
  const locs = sitemapResponse.ok ? parseSitemapLocs(sitemapResponse.body) : [];
  checks.a_sitemap.extras.locCount = locs.length;
  if (!sitemapResponse.ok) {
    addFailure(checks.a_sitemap, {
      url: sitemapUrl,
      message: `GET /sitemap.xml -> ${sitemapResponse.status || sitemapResponse.error || 'error'}`,
    });
  } else if (locs.length === 0) {
    addFailure(checks.a_sitemap, { url: sitemapUrl, message: 'sitemap.xml has no <loc> entries' });
  } else {
    addPass(checks.a_sitemap);
    if (Math.abs(locs.length - SITEMAP_COUNT_HINT) > SITEMAP_COUNT_WARN_DELTA) {
      checks.a_sitemap.warning = `loc count ${locs.length} is not near ${SITEMAP_COUNT_HINT}`;
    }
  }

  const locResults = await mapPool(locs, concurrency, async (loc) => {
    const result = await request(loc, { method: 'HEAD', wantBody: false });
    return { loc, result };
  });
  for (const { loc, result } of locResults) {
    if (result.ok) {
      addPass(checks.a_sitemap);
    } else {
      addFailure(checks.a_sitemap, {
        url: loc,
        message: `${result.method} ${result.status || result.error || 'error'}`,
      });
    }
  }

  const coreTargets = [];
  for (const locale of PUBLIC_LOCALES_8) {
    for (const pageKey of GUIDANCE_PAGE_KEYS) {
      coreTargets.push({
        locale,
        pageKey,
        path: guidancePublicPath(locale, pageKey),
        url: `${origin}${guidancePublicPath(locale, pageKey)}`,
      });
    }
  }

  const corePages = await mapPool(coreTargets, concurrency, async (target) => {
    const result = await request(target.url, { method: 'GET', wantBody: true });
    return { ...target, result };
  });

  const hreflangUrls = new Set();

  for (const page of corePages) {
    const { result, locale, pageKey, url } = page;
    if (!result.ok) {
      addFailure(checks.b_core_pages, {
        url,
        message: `${locale} ${pageKey} GET ${result.status || result.error || 'error'}`,
      });
      addFailure(checks.c_hreflang, {
        url,
        message: `${locale} ${pageKey} skipped hreflang (page not 200)`,
      });
      continue;
    }

    const expectedLang = publicDocumentLanguage(locale);
    const actualLang = parseHtmlLang(result.body);
    if (actualLang.toLowerCase() === expectedLang.toLowerCase()) {
      addPass(checks.b_core_pages);
    } else {
      addFailure(checks.b_core_pages, {
        url,
        message: `${locale} ${pageKey} html lang=${JSON.stringify(actualLang)} expected ${expectedLang}`,
      });
    }

    const alternates = parseHreflangAlternates(result.body);
    const required = requiredHreflangTags(pageKey);
    const missing = required.filter((tag) => !alternates.has(tag));
    if (missing.length) {
      addFailure(checks.c_hreflang, {
        url,
        message: `${locale} ${pageKey} missing hreflang: ${missing.join(', ')}`,
      });
    } else {
      addPass(checks.c_hreflang);
    }
    for (const href of alternates.values()) hreflangUrls.add(href);
  }

  const hreflangList = [...hreflangUrls];
  const hreflangResults = await mapPool(hreflangList, concurrency, async (href) => {
    const result = await request(href, { method: 'HEAD', wantBody: false });
    return { href, result };
  });
  for (const { href, result } of hreflangResults) {
    if (!result.ok) {
      addFailure(checks.c_hreflang, {
        url: href,
        message: `hreflang URL ${result.method} ${result.status || result.error || 'error'}`,
      });
    }
  }

  for (const locale of GUIDANCE_LOCALES_4) {
    const needle = needles[locale];
    for (const pageKey of ['home', 'contact']) {
      const page = corePages.find((item) => item.locale === locale && item.pageKey === pageKey);
      const body = page?.result?.ok ? page.result.body : '';
      if (!page?.result?.ok) {
        addFailure(checks.d_consultation_notice, {
          url: page?.url || `${origin}${guidancePublicPath(locale, pageKey)}`,
          message: `${locale} ${pageKey} not 200; cannot check consultation notice`,
        });
        continue;
      }
      if (htmlContainsNeedle(body, needle)) {
        addPass(checks.d_consultation_notice);
      } else {
        addFailure(checks.d_consultation_notice, {
          url: page.url,
          message: `${locale} ${pageKey} missing consultationNotice`,
        });
      }
    }
  }

  for (const locale of PUBLIC_LOCALES_8) {
    const page = corePages.find((item) => item.locale === locale && item.pageKey === 'privacy');
    const body = page?.result?.ok ? page.result.body : '';
    if (!page?.result?.ok) {
      addFailure(checks.e_privacy_memo, {
        url: page?.url || `${origin}${guidancePublicPath(locale, 'privacy')}`,
        message: `${locale} privacy not 200; cannot scan memo phrases`,
      });
      continue;
    }
    const hits = findPrivacyMemoHits(body);
    if (hits.length) {
      addFailure(checks.e_privacy_memo, {
        url: page.url,
        message: `${locale} privacy contains ${hits.map((hit) => JSON.stringify(hit)).join(', ')}`,
        phrases: hits,
      });
    } else {
      addPass(checks.e_privacy_memo);
    }
  }

  const originUrl = new URL(origin);
  for (const locale of GUIDANCE_LOCALES_4) {
    const columnsPath = guidancePublicPath(locale, 'columns');
    const columnsPage = corePages.find((item) => item.locale === locale && item.pageKey === 'columns');
    if (!columnsPage?.result?.ok) {
      addFailure(checks.f_translated_columns, {
        url: columnsPage?.url || `${origin}${columnsPath}`,
        message: `${locale} /columns not 200; cannot check translated slugs`,
      });
      continue;
    }
    addPass(checks.f_translated_columns);

    const localePrefix = `/${locale}/columns/`;
    const slugLocs = locs.filter((loc) => {
      try {
        const parsed = new URL(loc);
        if (parsed.origin !== originUrl.origin) return false;
        const pathname = parsed.pathname.replace(/\/+$/, '') || '/';
        return pathname.startsWith(localePrefix) && pathname !== columnsPath;
      } catch {
        return false;
      }
    });

    for (const loc of slugLocs) {
      const result = await request(loc, { method: 'GET', wantBody: true });
      if (!result.ok) {
        addFailure(checks.f_translated_columns, {
          url: loc,
          message: `${locale} translated slug GET ${result.status || result.error || 'error'}`,
        });
        continue;
      }
      const tag = hreflangTagForPublicLocale(locale);
      const alternates = parseHreflangAlternates(result.body);
      if (!alternates.has(tag)) {
        addFailure(checks.f_translated_columns, {
          url: loc,
          message: `${locale} translated slug missing hreflang ${tag}`,
        });
      } else {
        addPass(checks.f_translated_columns);
      }
    }
  }

  const ok = Object.values(checks).every((check) => check.ok);

  return {
    ok,
    baseUrl: origin,
    generatedAt: new Date().toISOString(),
    sitemapCountHint: SITEMAP_COUNT_HINT,
    checks,
  };
}

export async function main(argv = process.argv.slice(2), options = {}) {
  const args = parseCliArgs(argv, options.env ?? process.env);
  if (!args.baseUrl) {
    console.error('error: BASE_URL env or --base <url> is required');
    return 1;
  }

  const result = await runMultilingualLiveCheck({
    baseUrl: args.baseUrl,
    fetchImpl: options.fetchImpl ?? globalThis.fetch,
    repoRoot: options.repoRoot ?? REPO_ROOT,
  });

  const report = formatHumanReport(result);
  console.log(report);

  if (args.jsonPath) {
    const jsonPath = resolve(args.jsonPath);
    await mkdir(dirname(jsonPath), { recursive: true });
    await writeFile(jsonPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
    console.log(`json: ${jsonPath}`);
  }

  return result.ok ? 0 : 1;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
