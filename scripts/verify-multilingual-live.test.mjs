import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import {
  GUIDANCE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
  PUBLIC_LOCALES_8,
  formatHumanReport,
  guidancePublicPath,
  hreflangTagForPublicLocale,
  listTranslatedColumnSlugs,
  loadConsultationNeedles,
  parseHreflangAlternates,
  parseHtmlLang,
  parseSitemapLocs,
  requiredHreflangTags,
  runMultilingualLiveCheck,
  slugFromColumnFilename,
} from './verify-multilingual-live.mjs';

const BASE = 'http://live-check.test';

function htmlResponse(html, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Map([['content-type', 'text/html; charset=utf-8']]),
    async text() {
      return html;
    },
  };
}

function xmlResponse(xml, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Map([['content-type', 'application/xml']]),
    async text() {
      return xml;
    },
  };
}

function hreflangLinks(pageKey) {
  return requiredHreflangTags(pageKey)
    .map((tag) => {
      if (tag === 'x-default') {
        return `<link rel="alternate" hreflang="x-default" href="${BASE}/en${pageKey === 'home' ? '' : `/${pageKey}`}">`;
      }
      const locale = tag === 'zh-Hant' ? 'zh-hant' : tag;
      return `<link rel="alternate" hreflang="${tag}" href="${BASE}${guidancePublicPath(locale, pageKey)}">`;
    })
    .join('');
}

function pageHtml({ locale, pageKey, hreflang = true, memo = false, notice = '', statusLang }) {
  const lang = statusLang ?? (locale === 'zh-hant' ? 'zh-Hant' : locale);
  const links = hreflang ? hreflangLinks(pageKey) : '<link rel="alternate" hreflang="en" href="http://live-check.test/en">';
  const memoText = memo ? '이 항목은 운영자 확인이 필요합니다 / operator confirmation' : 'privacy body without operator notes';
  return `<!doctype html><html lang="${lang}"><head>${links}</head><body>${notice}${memoText}</body></html>`;
}

function allCoreLocs() {
  const locs = [];
  for (const locale of PUBLIC_LOCALES_8) {
    for (const pageKey of GUIDANCE_PAGE_KEYS) {
      locs.push(`${BASE}${guidancePublicPath(locale, pageKey)}`);
    }
  }
  return locs;
}

function sitemapXml(locs) {
  return `<?xml version="1.0" encoding="UTF-8"?><urlset>${locs
    .map((loc) => `<url><loc>${loc}</loc></url>`)
    .join('')}</urlset>`;
}

function makeFetch({
  notices,
  missingHreflangPath = null,
  notFoundPath = null,
  memoPrivacyLocales = [],
  extraLocs = [],
  translatedSlug = '',
} = {}) {
  const locs = [...allCoreLocs(), ...extraLocs];
  return async (url, init = {}) => {
    const parsed = new URL(url);
    const method = (init.method || 'GET').toUpperCase();
    const path = parsed.pathname.replace(/\/+$/, '') || '/';

    if (path === '/sitemap.xml') {
      if (method === 'HEAD') return xmlResponse('', 200);
      return xmlResponse(sitemapXml(locs));
    }

    if (notFoundPath && path === notFoundPath) {
      return htmlResponse('not found', 404);
    }

    const segments = path.split('/').filter(Boolean);
    const locale = segments[0];
    const pageKey = segments[1] || 'home';
    const isGuidanceHomeOrContact =
      GUIDANCE_LOCALES_4.includes(locale) && (pageKey === 'home' || pageKey === 'contact');
    const isTranslatedColumn =
      Boolean(translatedSlug) && pageKey === 'columns' && segments[2] === translatedSlug;
    const html = pageHtml({
      locale,
      pageKey: isTranslatedColumn ? 'columns' : pageKey,
      hreflang: missingHreflangPath ? path !== missingHreflangPath : true,
      memo: pageKey === 'privacy' && memoPrivacyLocales.includes(locale),
      notice: isGuidanceHomeOrContact ? notices[locale] : '',
      extraHreflang: isTranslatedColumn
        ? `<link rel="alternate" hreflang="${hreflangTagForPublicLocale(locale)}" href="${BASE}${path}">`
        : '',
    });

    if (method === 'HEAD') return htmlResponse('', 200);
    return htmlResponse(html);
  };
}

test('parse helpers read sitemap locs, html lang, and hreflang tags', () => {
  const locs = parseSitemapLocs(
    '<urlset><url><loc>http://x.test/ko</loc></url><url><loc>http://x.test/en/privacy</loc></url></urlset>',
  );
  assert.deepEqual(locs, ['http://x.test/ko', 'http://x.test/en/privacy']);
  assert.equal(parseHtmlLang('<html lang="zh-Hant" class="x">'), 'zh-Hant');
  const alts = parseHreflangAlternates(
    '<link rel="alternate" href="http://x.test/ko" hreflang="ko"><link rel="alternate" hreflang="x-default" href="http://x.test/en">',
  );
  assert.equal(alts.get('ko'), 'http://x.test/ko');
  assert.equal(alts.get('x-default'), 'http://x.test/en');
  assert.ok(requiredHreflangTags('about').includes('zh-Hant'));
  assert.ok(!requiredHreflangTags('faq').includes('en'));
  assert.equal(hreflangTagForPublicLocale('zh-hant'), 'zh-Hant');
});

test('success: all core checks pass when fetch returns 200 pages', async () => {
  const notices = await loadConsultationNeedles();
  const result = await runMultilingualLiveCheck({
    baseUrl: BASE,
    fetchImpl: makeFetch({ notices }),
    consultationNeedles: notices,
  });

  assert.equal(result.ok, true);
  assert.equal(result.checks.b_core_pages.fail, 0);
  assert.equal(result.checks.c_hreflang.fail, 0);
  assert.equal(result.checks.d_consultation_notice.fail, 0);
  assert.equal(result.checks.e_privacy_memo.fail, 0);
  assert.match(formatHumanReport(result), /overall PASS/);
});

test('404: a core page status other than 200 fails the run', async () => {
  const notices = await loadConsultationNeedles();
  const result = await runMultilingualLiveCheck({
    baseUrl: BASE,
    fetchImpl: makeFetch({ notices, notFoundPath: '/ko/services' }),
    consultationNeedles: notices,
  });

  assert.equal(result.ok, false);
  assert.ok(result.checks.b_core_pages.fail >= 1);
  assert.ok(
    result.checks.b_core_pages.failures.some((item) => item.url.endsWith('/ko/services')),
  );
  assert.ok(
    result.checks.a_sitemap.failures.some((item) => item.url.endsWith('/ko/services')),
  );
});

test('hreflang: missing alternate tags fail item c', async () => {
  const notices = await loadConsultationNeedles();
  const result = await runMultilingualLiveCheck({
    baseUrl: BASE,
    fetchImpl: makeFetch({ notices, missingHreflangPath: '/en/about' }),
    consultationNeedles: notices,
  });

  assert.equal(result.ok, false);
  assert.equal(result.checks.b_core_pages.ok, true);
  assert.equal(result.checks.c_hreflang.ok, false);
  assert.ok(
    result.checks.c_hreflang.failures.some((item) =>
      String(item.message).includes('missing hreflang'),
    ),
  );
});

test('privacy memo phrases are detected as FAIL', async () => {
  const notices = await loadConsultationNeedles();
  const result = await runMultilingualLiveCheck({
    baseUrl: BASE,
    fetchImpl: makeFetch({ notices, memoPrivacyLocales: ['ko', 'en'] }),
    consultationNeedles: notices,
  });

  assert.equal(result.ok, false);
  assert.equal(result.checks.e_privacy_memo.fail, 2);
  assert.ok(
    result.checks.e_privacy_memo.failures.some((item) =>
      String(item.message).includes('operator confirmation'),
    ),
  );
});

test('item f: new-four /columns 200 and sitemap translation slugs are 200 with hreflang', async () => {
  const notices = await loadConsultationNeedles();
  const translatedSlug = 'taiwan-gym-injury-lawsuit';
  const extraLocs = GUIDANCE_LOCALES_4.map(
    (locale) => `${BASE}/${locale}/columns/${translatedSlug}`,
  );

  const result = await runMultilingualLiveCheck({
    baseUrl: BASE,
    fetchImpl: makeFetch({ notices, extraLocs, translatedSlug }),
    consultationNeedles: notices,
  });

  assert.equal(result.ok, true);
  assert.equal(result.checks.f_translated_columns.fail, 0);
  assert.ok(result.checks.f_translated_columns.pass >= GUIDANCE_LOCALES_4.length);
  assert.match(formatHumanReport(result), /f_translated_columns|translated columns/);
});

test('slugFromColumnFilename strips numeric prefixes the same way as columns.ts', () => {
  assert.equal(slugFromColumnFilename('008-taiwan-labor-severance-law.md'), 'taiwan-labor-severance-law');
  assert.equal(slugFromColumnFilename('taiwan-gym-injury-lawsuit.md'), 'taiwan-gym-injury-lawsuit');
});

test('item f: on-disk translation slugs must be 200 with hreflang even if sitemap omits them', async () => {
  const notices = await loadConsultationNeedles();
  const tmp = mkdtempSync(join(tmpdir(), 'g23-columns-'));
  try {
    const viDir = join(tmp, 'src/content/columns-vi');
    mkdirSync(viDir, { recursive: true });
    writeFileSync(join(viDir, '008-taiwan-labor-severance-law.md'), '# vi\n', 'utf8');
    assert.deepEqual(listTranslatedColumnSlugs('vi', tmp), ['taiwan-labor-severance-law']);
    assert.deepEqual(listTranslatedColumnSlugs('th', tmp), []);

    const missingPath = '/vi/columns/taiwan-labor-severance-law';
    const failResult = await runMultilingualLiveCheck({
      baseUrl: BASE,
      fetchImpl: makeFetch({ notices, notFoundPath: missingPath }),
      consultationNeedles: notices,
      repoRoot: tmp,
    });
    assert.equal(failResult.ok, false);
    assert.equal(failResult.checks.f_translated_columns.ok, false);
    assert.ok(
      failResult.checks.f_translated_columns.failures.some((item) =>
        String(item.url).endsWith(missingPath),
      ),
    );

    const passResult = await runMultilingualLiveCheck({
      baseUrl: BASE,
      fetchImpl: makeFetch({ notices, translatedSlug: 'taiwan-labor-severance-law' }),
      consultationNeedles: notices,
      repoRoot: tmp,
    });
    assert.equal(passResult.ok, true);
    assert.equal(passResult.checks.f_translated_columns.fail, 0);
    assert.equal(passResult.checks.f_translated_columns.extras.translatedByLocale.vi, 1);
    assert.ok(passResult.checks.f_translated_columns.pass >= GUIDANCE_LOCALES_4.length + 1);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
