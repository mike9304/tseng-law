import { describe, expect, it } from 'vitest';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';
import {
  buildTranslationDashboardFromSite,
} from '@/lib/builder/translations/dashboard-model';
import { buildTranslationDashboardSummary } from '@/lib/builder/translations/dashboard-summary';

function seededSite() {
  const site = createDefaultSiteDocument('ko', 'test-site');
  // The default site has one Korean homepage. Add a couple more.
  const now = '2026-05-20T00:00:00.000Z';
  site.pages.push(
    {
      pageId: 'page-about-ko',
      slug: 'about',
      title: { ko: '소개', 'zh-hant': '關於', en: 'About' },
      locale: 'ko',
      createdAt: now,
      updatedAt: '2026-05-20T03:00:00.000Z',
    },
    {
      pageId: 'page-about-en',
      slug: 'about',
      title: { ko: '소개', 'zh-hant': '關於', en: 'About' },
      locale: 'en',
      createdAt: now,
      // English page was updated BEFORE source — outdated.
      updatedAt: '2026-05-20T01:00:00.000Z',
    },
    {
      pageId: 'page-contact-ko',
      slug: 'contact',
      title: { ko: '연락처', 'zh-hant': '聯絡', en: 'Contact' },
      locale: 'ko',
      createdAt: now,
      updatedAt: '2026-05-20T03:00:00.000Z',
    },
    {
      pageId: 'page-contact-zh',
      slug: 'contact',
      title: { ko: '연락처', 'zh-hant': '聯絡', en: 'Contact' },
      locale: 'zh-hant',
      createdAt: now,
      updatedAt: '2026-05-20T05:00:00.000Z',
      publishedAt: '2026-05-20T05:30:00.000Z',
    },
  );
  return site;
}

describe('buildTranslationDashboardFromSite', () => {
  it('returns one row per source-locale page', () => {
    const site = seededSite();
    const rows = buildTranslationDashboardFromSite(site, 'ko');
    // Default home + about + contact = 3 ko pages.
    expect(rows).toHaveLength(3);
    expect(rows.map((row) => row.slug).sort()).toEqual(
      ['', 'about', 'contact'].sort(),
    );
  });

  it('marks pages with no locale projection as untranslated', () => {
    const site = seededSite();
    const rows = buildTranslationDashboardFromSite(site, 'ko');
    const aboutRow = rows.find((row) => row.slug === 'about');
    const zhEntry = aboutRow?.entries.find((entry) => entry.locale === 'zh-hant');
    expect(zhEntry?.status).toBe('untranslated');
    expect(zhEntry?.targetPageId).toBeUndefined();
  });

  it('flags target pages with stale updatedAt as outdated', () => {
    const site = seededSite();
    const rows = buildTranslationDashboardFromSite(site, 'ko');
    const aboutRow = rows.find((row) => row.slug === 'about');
    const enEntry = aboutRow?.entries.find((entry) => entry.locale === 'en');
    expect(enEntry?.status).toBe('outdated');
    expect(enEntry?.targetPageId).toBe('page-about-en');
  });

  it('flags target pages with publishedAt >= source updatedAt as published', () => {
    const site = seededSite();
    const rows = buildTranslationDashboardFromSite(site, 'ko');
    const contactRow = rows.find((row) => row.slug === 'contact');
    const zhEntry = contactRow?.entries.find((entry) => entry.locale === 'zh-hant');
    expect(zhEntry?.status).toBe('published');
    expect(zhEntry?.targetPageId).toBe('page-contact-zh');
  });

  it('honours explicit linkedPageIds over slug fallback', () => {
    const site = seededSite();
    const ko = site.pages.find((page) => page.pageId === 'page-about-ko');
    if (!ko) throw new Error('seed missing');
    ko.linkedPageIds = { en: 'page-about-en' };
    // Rename the linked target's slug — link should still resolve.
    const en = site.pages.find((page) => page.pageId === 'page-about-en');
    if (en) en.slug = 'about-renamed';
    const rows = buildTranslationDashboardFromSite(site, 'ko');
    const aboutRow = rows.find((row) => row.slug === 'about');
    const enEntry = aboutRow?.entries.find((entry) => entry.locale === 'en');
    expect(enEntry?.targetPageId).toBe('page-about-en');
  });

  it('summarizes dashboard health by status and locale', () => {
    const site = seededSite();
    const rows = buildTranslationDashboardFromSite(site, 'ko');
    const summary = buildTranslationDashboardSummary(rows, ['zh-hant', 'en']);

    expect(summary.totalPages).toBe(3);
    expect(summary.totalCells).toBe(6);
    expect(summary.published).toBe(1);
    expect(summary.outdated).toBe(1);
    expect(summary.untranslated).toBe(4);
    expect(summary.draft).toBe(0);
    expect(summary.needsAttention).toBe(5);
    expect(summary.locales).toHaveLength(2);

    const zh = summary.locales.find((entry) => entry.locale === 'zh-hant');
    expect(zh?.published).toBe(1);
    expect(zh?.untranslated).toBe(2);
    expect(zh?.draft).toBe(0);
    expect(zh?.needsAttention).toBe(2);
    expect(zh?.completionRate).toBe(33);

    const en = summary.locales.find((entry) => entry.locale === 'en');
    expect(en?.published).toBe(0);
    expect(en?.outdated).toBe(1);
    expect(en?.untranslated).toBe(2);
    expect(en?.draft).toBe(0);
    expect(en?.completionRate).toBe(0);
  });
});
