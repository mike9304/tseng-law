import { describe, expect, it } from 'vitest';
import type { Locale } from '@/lib/locales';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import {
  SiteInvariantError,
  assertSiteDocumentInvariants,
  validateSiteDocumentInvariants,
} from '@/lib/builder/site/site-invariants';

const NOW = '2026-07-13T00:00:00.000Z';

function page(
  pageId: string,
  locale: Locale,
  slug: string,
  options: { home?: boolean; slugByLocale?: Partial<Record<Locale, string>> } = {},
): BuilderPageMeta {
  return {
    pageId,
    locale,
    slug,
    slugByLocale: options.slugByLocale,
    title: { ko: pageId, 'zh-hant': pageId, en: pageId },
    createdAt: NOW,
    updatedAt: NOW,
    isHomePage: options.home ?? false,
  };
}

function codes(pages: BuilderPageMeta[]) {
  return validateSiteDocumentInvariants({ pages }).map((issue) => issue.code);
}

describe('site document metadata invariants', () => {
  it('accepts representative canonical pages and safe Unicode route segments', () => {
    const pages = [
      page('page-ko-home', 'ko', '', { home: true }),
      page('page-ko-lawyers', 'ko', 'lawyers'),
      page('page-ko-unicode', 'ko', '대만-법률/상담'),
      page('page-zh-home', 'zh-hant', '', { home: true }),
      page('page-zh-lawyers', 'zh-hant', 'lawyers'),
    ];

    expect(validateSiteDocumentInvariants({ pages })).toEqual([]);
    expect(() => assertSiteDocumentInvariants({ pages })).not.toThrow();
  });

  it('rejects duplicate base routes within one locale', () => {
    const issues = validateSiteDocumentInvariants({
      pages: [
        page('home-ko', 'ko', '', { home: true }),
        page('about-one', 'ko', 'about'),
        page('about-two', 'ko', 'about'),
      ],
    });

    expect(issues).toContainEqual(expect.objectContaining({
      code: 'ROUTE_DUPLICATE',
      pageId: 'about-two',
      conflictingPageId: 'about-one',
      locale: 'ko',
      slug: 'about',
    }));
  });

  it('treats a same-locale override as replacing the base route', () => {
    const pages = [
      page('home-ko', 'ko', '', { home: true }),
      page('localized', 'ko', 'old-route', { slugByLocale: { ko: 'new-route' } }),
      page('old-route-owner', 'ko', 'old-route'),
    ];

    expect(validateSiteDocumentInvariants({ pages }).filter((issue) => (
      issue.code === 'ROUTE_DUPLICATE' && issue.locale === 'ko'
    ))).toEqual([]);
    pages.push(page('new-route-owner', 'ko', 'new-route'));
    expect(validateSiteDocumentInvariants({ pages })).toContainEqual(expect.objectContaining({
      code: 'ROUTE_DUPLICATE',
      locale: 'ko',
      slug: 'new-route',
    }));
  });

  it('matches runtime projection and treats an empty override as base-slug fallback', () => {
    const issues = validateSiteDocumentInvariants({
      pages: [
        page('home-ko', 'ko', '', { home: true }),
        page('ko-first', 'ko', 'projected-route', { slugByLocale: { en: '' } }),
        page('ko-second', 'ko', 'different-ko-route', { slugByLocale: { en: 'projected-route' } }),
        page('home-en', 'en', '', { home: true }),
      ],
    });

    expect(issues).toContainEqual(expect.objectContaining({
      code: 'ROUTE_DUPLICATE',
      pageId: 'ko-second',
      conflictingPageId: 'ko-first',
      locale: 'en',
      slug: 'projected-route',
    }));
  });

  it('detects duplicate default-locale projections independently in en and zh-hant', () => {
    const duplicateLocales = validateSiteDocumentInvariants({
      pages: [
        page('home-ko', 'ko', '', { home: true }),
        page('ko-first', 'ko', 'first', { slugByLocale: { en: 'shared', 'zh-hant': '共用' } }),
        page('ko-second', 'ko', 'second', { slugByLocale: { en: 'shared', 'zh-hant': '共用' } }),
        page('home-en', 'en', '', { home: true }),
        page('home-zh', 'zh-hant', '', { home: true }),
      ],
    }).filter((issue) => issue.code === 'ROUTE_DUPLICATE').map((issue) => issue.locale);

    expect(duplicateLocales).toEqual(expect.arrayContaining(['en', 'zh-hant']));
  });

  it('does not register a zh-hant to en override when runtime cannot project that page', () => {
    const issues = validateSiteDocumentInvariants({
      pages: [
        page('home-ko', 'ko', '', { home: true }),
        page('home-en', 'en', '', { home: true }),
        page('contact-en', 'en', 'contact'),
        page('home-zh', 'zh-hant', '', { home: true }),
        page('contact-zh', 'zh-hant', 'contact-zh', { slugByLocale: { en: 'contact' } }),
      ],
    });

    expect(issues.filter((issue) => issue.code === 'ROUTE_DUPLICATE')).toEqual([]);
  });

  it('detects a projected home alias collision while allowing the projected alias itself', () => {
    const issues = validateSiteDocumentInvariants({
      pages: [
        page('home-ko', 'ko', '', { home: true, slugByLocale: { en: 'landing' } }),
        page('landing-ko', 'ko', 'landing-ko', { slugByLocale: { en: 'landing' } }),
      ],
    });

    expect(issues).toContainEqual(expect.objectContaining({
      code: 'ROUTE_DUPLICATE',
      pageId: 'landing-ko',
      conflictingPageId: 'home-ko',
      locale: 'en',
      slug: 'landing',
    }));
    expect(issues).not.toContainEqual(expect.objectContaining({
      code: 'HOME_ROUTE_NONEMPTY',
      locale: 'en',
    }));
  });

  it('suppresses a default-locale projection when an equivalent authored page exists', () => {
    expect(validateSiteDocumentInvariants({
      pages: [
        page('home-ko', 'ko', '', { home: true }),
        page('about-ko', 'ko', 'about'),
        page('home-en', 'en', '', { home: true }),
        page('about-en', 'en', 'about'),
      ],
    })).toEqual([]);
  });

  it('does not flag an override when an equivalent authored page suppresses projection', () => {
    const pages = [
      page('home-ko', 'ko', '', { home: true }),
      page('ko-contact', 'ko', 'contact-ko', { slugByLocale: { en: 'contact' } }),
      page('home-en', 'en', '', { home: true }),
      page('en-contact', 'en', 'contact'),
    ];

    expect(validateSiteDocumentInvariants({ pages }).filter((issue) => (
      issue.code === 'ROUTE_DUPLICATE' && issue.locale === 'en'
    ))).toEqual([]);
  });

  it('allows equivalent route slugs in different locales', () => {
    expect(validateSiteDocumentInvariants({
      pages: [
        page('home-ko', 'ko', '', { home: true }),
        page('about-ko', 'ko', 'about'),
        page('home-en', 'en', '', { home: true }),
        page('about-en', 'en', 'about'),
      ],
    })).toEqual([]);
  });

  it('requires exactly one home for every authored locale', () => {
    expect(codes([page('about-ko', 'ko', 'about')])).toContain('AUTHORED_HOME_MISSING');
    expect(codes([
      page('home-one', 'ko', '', { home: true }),
      page('home-two', 'ko', '', { home: true }),
    ])).toContain('AUTHORED_HOME_MULTIPLE');
  });

  it('requires an empty authored home route and a nonempty non-home route', () => {
    const issues = codes([
      page('home-ko', 'ko', 'welcome', { home: true }),
      page('empty-page', 'ko', ''),
    ]);

    expect(issues).toContain('HOME_ROUTE_NONEMPTY');
    expect(issues).toContain('NON_HOME_ROUTE_EMPTY');
  });

  it('rejects unsafe, unnormalized, empty, and duplicate page ids', () => {
    const issues = codes([
      page('home-ko', 'ko', '', { home: true }),
      page('../escape', 'ko', 'escape'),
      page(' duplicate ', 'ko', 'one'),
      page('duplicate-id', 'ko', 'two'),
      page('duplicate-id', 'ko', 'three'),
      page('   ', 'ko', 'four'),
    ]);

    expect(issues).toEqual(expect.arrayContaining([
      'PAGE_ID_UNSAFE',
      'PAGE_ID_NOT_NORMALIZED',
      'PAGE_ID_DUPLICATE',
      'PAGE_ID_EMPTY',
    ]));
  });

  it('rejects unsupported authored, slug override, and linked-page locale keys', () => {
    const invalid = {
      ...page('invalid-locale', 'ko', 'invalid'),
      locale: 'fr',
      slugByLocale: { fr: 'bonjour' },
      linkedPageIds: { de: 'seite-de' },
    } as unknown as BuilderPageMeta;
    const issues = validateSiteDocumentInvariants({
      pages: [page('home-ko', 'ko', '', { home: true }), invalid],
    });

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'PAGE_LOCALE_UNSUPPORTED', localeKey: 'fr' }),
      expect.objectContaining({ code: 'SLUG_LOCALE_UNSUPPORTED', localeKey: 'fr' }),
      expect.objectContaining({ code: 'LINKED_PAGE_LOCALE_UNSUPPORTED', localeKey: 'de' }),
    ]));
  });

  it('reports raw JSON field type errors without throwing or filtering them out', () => {
    const invalidRawPage = {
      ...page('placeholder', 'ko', 'placeholder'),
      pageId: null,
      locale: null,
      slug: 42,
    } as unknown as BuilderPageMeta;

    expect(() => validateSiteDocumentInvariants({ pages: [invalidRawPage] })).not.toThrow();
    expect(validateSiteDocumentInvariants({ pages: [invalidRawPage] })).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'PAGE_ID_INVALID' }),
      expect.objectContaining({ code: 'PAGE_LOCALE_INVALID' }),
      expect.objectContaining({ code: 'PAGE_SLUG_INVALID' }),
    ]));
  });

  it.each([
    ['db probe', 'db-probe-r04', 'Database probe'],
    ['visual template', 'visual-template-r04', 'Visual template'],
    ['QA fixture', 'g-editor-qa-r04', 'G Editor UI QA fixture'],
  ])('optionally forbids an internal %s page', (_label, slug, title) => {
    const internal = page(`page-${slug}`, 'ko', slug);
    internal.title = { ko: title, 'zh-hant': title, en: title };
    const pages = [page('home-ko', 'ko', '', { home: true }), internal];

    expect(validateSiteDocumentInvariants({ pages })).not.toContainEqual(expect.objectContaining({
      code: 'INTERNAL_SANDBOX_PAGE_FORBIDDEN',
    }));
    expect(validateSiteDocumentInvariants(
      { pages },
      { forbidInternalSandboxPages: true },
    )).toContainEqual(expect.objectContaining({
      code: 'INTERNAL_SANDBOX_PAGE_FORBIDDEN',
      pageId: `page-${slug}`,
      slug,
    }));
  });

  it('forbids an internal localized alias even when the base slug is legitimate', () => {
    const localizedProbe = page('localized-probe', 'ko', 'legitimate-page', {
      slugByLocale: { en: 'db-probe-r04' },
    });
    const pages = [page('home-ko', 'ko', '', { home: true }), localizedProbe];

    const issues = validateSiteDocumentInvariants(
      { pages },
      { forbidInternalSandboxPages: true },
    );
    expect(issues).toContainEqual(expect.objectContaining({
      code: 'INTERNAL_SANDBOX_PAGE_FORBIDDEN',
      pageId: 'localized-probe',
      locale: 'en',
      slug: 'db-probe-r04',
    }));
    expect(issues).not.toContainEqual(expect.objectContaining({
      code: 'INTERNAL_SANDBOX_PAGE_FORBIDDEN',
      locale: 'ko',
      slug: 'legitimate-page',
    }));
  });

  it('does not forbid a localized alias that runtime cannot project publicly', () => {
    const hiddenAlias = page('hidden-zh-alias', 'zh-hant', 'legitimate-zh', {
      slugByLocale: { en: 'db-probe-r04' },
    });
    const pages = [
      page('home-ko', 'ko', '', { home: true }),
      page('home-zh', 'zh-hant', '', { home: true }),
      hiddenAlias,
    ];

    expect(validateSiteDocumentInvariants(
      { pages },
      { forbidInternalSandboxPages: true },
    )).not.toContainEqual(expect.objectContaining({
      code: 'INTERNAL_SANDBOX_PAGE_FORBIDDEN',
      pageId: 'hidden-zh-alias',
      locale: 'en',
    }));
  });

  it('makes the reusable migration and restore assertion reject localized internal aliases', () => {
    const pages = [
      page('home-ko', 'ko', '', { home: true }),
      page('restore-probe', 'ko', 'legitimate-restore', {
        slugByLocale: { 'zh-hant': 'visual-template-r04' },
      }),
    ];

    expect(() => assertSiteDocumentInvariants(
      { pages },
      { forbidInternalSandboxPages: true },
    )).toThrowError(expect.objectContaining({
      name: 'SiteInvariantError',
      issues: expect.arrayContaining([expect.objectContaining({
        code: 'INTERNAL_SANDBOX_PAGE_FORBIDDEN',
        locale: 'zh-hant',
        slug: 'visual-template-r04',
      })]),
    }));
  });

  it('rejects route values that are not normalized or contain unsafe segments', () => {
    const issues = codes([
      page('home-ko', 'ko', '', { home: true }),
      page('leading', 'ko', '/about'),
      page('query', 'ko', 'about?draft=1'),
      page('empty-segment', 'ko', 'about//team'),
    ]);

    expect(issues).toContain('ROUTE_NOT_NORMALIZED');
    expect(issues.filter((code) => code === 'ROUTE_UNSAFE')).toHaveLength(3);
  });

  it('throws a typed error with machine-readable issues', () => {
    try {
      assertSiteDocumentInvariants({ pages: [page('about-ko', 'ko', 'about')] });
      throw new Error('expected invariant assertion to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(SiteInvariantError);
      expect((error as SiteInvariantError).issues).toContainEqual(expect.objectContaining({
        code: 'AUTHORED_HOME_MISSING',
        locale: 'ko',
      }));
    }
  });
});
