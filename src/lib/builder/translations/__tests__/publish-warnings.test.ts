import { describe, expect, it } from 'vitest';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';
import { buildTranslationPublishWarnings } from '@/lib/builder/translations/publish-warnings';

function seededSite() {
  const site = createDefaultSiteDocument('ko', 'test-site');
  const now = '2026-05-20T00:00:00.000Z';

  // about: ko source + outdated en translation, no zh-hant translation.
  site.pages.push(
    {
      pageId: 'page-about-ko',
      slug: 'about',
      title: { ko: '소개', 'zh-hant': '關於', en: 'About' },
      locale: 'ko',
      createdAt: now,
      updatedAt: '2026-05-20T05:00:00.000Z',
    },
    {
      pageId: 'page-about-en',
      slug: 'about',
      title: { ko: '소개', 'zh-hant': '關於', en: 'About' },
      locale: 'en',
      createdAt: now,
      updatedAt: '2026-05-20T01:00:00.000Z',
    },
    // contact: ko source linked to a non-existent zh-hant id (broken-link).
    {
      pageId: 'page-contact-ko',
      slug: 'contact',
      title: { ko: '연락처', 'zh-hant': '聯絡', en: 'Contact' },
      locale: 'ko',
      createdAt: now,
      updatedAt: '2026-05-20T05:00:00.000Z',
      linkedPageIds: { 'zh-hant': 'ghost-page-id' },
    },
    {
      pageId: 'page-contact-en',
      slug: 'contact',
      title: { ko: '연락처', 'zh-hant': '聯絡', en: 'Contact' },
      locale: 'en',
      createdAt: now,
      updatedAt: '2026-05-20T06:00:00.000Z',
    },
  );
  return site;
}

describe('buildTranslationPublishWarnings', () => {
  it('flags pages with no target-locale projection as untranslated', () => {
    const site = seededSite();
    const warnings = buildTranslationPublishWarnings(site, 'ko');
    const untranslated = warnings.filter((w) => w.kind === 'untranslated');
    // about → no zh-hant; default home → no en + no zh-hant; contact-ko has
    // explicit broken-link to zh-hant (counted as broken-link, NOT untranslated)
    // and no en projection (so contact en is present → no untranslated for that).
    // Specifically check 'about' for zh-hant.
    expect(
      untranslated.some((w) => w.pageId === 'page-about-ko' && w.locale === 'zh-hant'),
    ).toBe(true);
    // default home page (slug '') has neither en nor zh-hant — both should warn.
    const home = site.pages.find((page) => page.isHomePage && page.locale === 'ko');
    expect(home).toBeTruthy();
    expect(
      untranslated.filter((w) => w.pageId === home!.pageId).map((w) => w.locale).sort(),
    ).toEqual(['en', 'zh-hant']);
  });

  it('flags target pages with older updatedAt as outdated', () => {
    const site = seededSite();
    const warnings = buildTranslationPublishWarnings(site, 'ko');
    const outdated = warnings.find(
      (w) => w.kind === 'outdated' && w.pageId === 'page-about-ko' && w.locale === 'en',
    );
    expect(outdated).toBeTruthy();
    expect(outdated?.severity).toBe('warning');
  });

  it('flags linkedPageIds pointing at missing pages as broken-link', () => {
    const site = seededSite();
    const warnings = buildTranslationPublishWarnings(site, 'ko');
    const broken = warnings.find(
      (w) => w.kind === 'broken-link' && w.pageId === 'page-contact-ko' && w.locale === 'zh-hant',
    );
    expect(broken).toBeTruthy();
    expect(broken?.severity).toBe('error');
  });

  it('emits no warnings when every target page is up to date', () => {
    const site = createDefaultSiteDocument('ko', 'all-good');
    // Replace default pages with a single source that has a published, fresher
    // translation in both target locales.
    const now = '2026-05-20T00:00:00.000Z';
    site.pages = [
      {
        pageId: 'src',
        slug: '',
        title: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
        locale: 'ko',
        isHomePage: true,
        createdAt: now,
        updatedAt: '2026-05-20T01:00:00.000Z',
      },
      {
        pageId: 'tgt-en',
        slug: '',
        title: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
        locale: 'en',
        isHomePage: true,
        createdAt: now,
        updatedAt: '2026-05-20T02:00:00.000Z',
      },
      {
        pageId: 'tgt-zh',
        slug: '',
        title: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
        locale: 'zh-hant',
        isHomePage: true,
        createdAt: now,
        updatedAt: '2026-05-20T02:00:00.000Z',
      },
    ];
    const warnings = buildTranslationPublishWarnings(site, 'ko');
    expect(warnings).toEqual([]);
  });
});