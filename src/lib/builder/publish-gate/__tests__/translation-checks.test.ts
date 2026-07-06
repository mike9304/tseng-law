import { describe, expect, it } from 'vitest';
import { createDefaultSiteDocument, type BuilderPageMeta } from '@/lib/builder/site/types';
import { checkTranslationPublishWarnings } from '../translation-checks';

const now = '2026-05-20T00:00:00.000Z';

function makePage(
  pageId: string,
  locale: BuilderPageMeta['locale'],
  updatedAt: string,
  linkedPageIds?: BuilderPageMeta['linkedPageIds'],
): BuilderPageMeta {
  return {
    pageId,
    slug: 'about',
    title: { ko: '소개', 'zh-hant': '關於', en: 'About' },
    locale,
    createdAt: now,
    updatedAt,
    linkedPageIds,
  };
}

function seededSite() {
  const site = createDefaultSiteDocument('ko', 'publish-gate-translations');
  const source = makePage(
    'page-about-ko',
    'ko',
    '2026-05-20T05:00:00.000Z',
  );
  const english = makePage(
    'page-about-en',
    'en',
    '2026-05-20T01:00:00.000Z',
  );
  site.pages = [source, english];
  return { site, source, english };
}

describe('checkTranslationPublishWarnings', () => {
  it('surfaces current source-page missing and stale translations as publish warnings', () => {
    const { site, source } = seededSite();

    const results = checkTranslationPublishWarnings(source, site);

    expect(results).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'translation-outdated-page-about-ko-en',
        severity: 'warning',
        category: 'translations',
        message: expect.stringContaining('en translation'),
        action: expect.objectContaining({
          href: '/ko/admin-builder/translations?sourceLocale=ko&category=pages&search=page-about-ko&status=outdated&target=en',
        }),
      }),
      expect.objectContaining({
        id: 'translation-untranslated-page-about-ko-zh-hant',
        severity: 'warning',
        category: 'translations',
        message: expect.stringContaining('zh-hant translation'),
        action: expect.objectContaining({
          href: '/ko/admin-builder/translations?sourceLocale=ko&category=pages&search=page-about-ko&status=missing&target=zh-hant',
        }),
      }),
    ]));
  });

  it('turns broken locale page links into publish blockers', () => {
    const { site, source } = seededSite();
    source.linkedPageIds = { 'zh-hant': 'missing-zh-page' };

    const results = checkTranslationPublishWarnings(source, site);

    expect(results).toContainEqual(expect.objectContaining({
      id: 'translation-broken-link-page-about-ko-zh-hant',
      severity: 'blocker',
      category: 'translations',
      fixHint: expect.stringContaining('Translation Manager'),
      action: expect.objectContaining({
        href: '/ko/admin-builder/translations?sourceLocale=ko&category=pages&search=page-about-ko&target=zh-hant',
      }),
    }));
  });

  it('does not reinterpret target-locale pages as source pages', () => {
    const { site, english } = seededSite();

    expect(checkTranslationPublishWarnings(english, site)).toEqual([]);
  });
});
