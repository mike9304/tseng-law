import { renderToStaticMarkup } from 'react-dom/server';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({ pathname: '/ko' }));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import { GlobalLanguagePickerView } from '@/components/GlobalLanguagePicker';
import LocaleFlagSwitcher, { LocaleFlagSwitcherView } from '@/components/LocaleFlagSwitcher';
import { PublicColumnLanguageLinksProvider } from '@/components/PublicColumnLanguageLinksContext';
import { columnAlternateLocales, publicColumnSwitcherData } from '@/lib/column-language-links';
import {
  ISSUE_BOARD_LOCALES,
  fileBackedColumnAlternateLocales,
  getAllColumnPosts,
  getAllIssuePosts,
  type ColumnPost,
} from '@/lib/columns';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import {
  PUBLIC_LOCALES_8,
  columnLanguageLinksFromIndex,
  isGuidanceLocale4,
  type PublicColumnLanguageIndex,
  type PublicColumnLanguageLinks,
  type PublicLocale8,
} from '@/lib/public-guidance';
import { buildAbsoluteUrl, getLanguageAlternates } from '@/lib/seo';

// Rendering the open picker on the server makes React warn about its
// useLayoutEffect on every render; the corpus sweep renders it ~1,000 times.
const consoleError = console.error;
beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    if (String(args[0]).includes('useLayoutEffect does nothing on the server')) return;
    consoleError(...args);
  });
});
afterAll(() => {
  vi.restoreAllMocks();
});

/** Column 051 is published in ko, zh-hant and en only. */
const COLUMN_051 = 'taiwan-left-turn-vs-straight-motorcycle';
/** Published in every public language. */
const ALL_LOCALE_COLUMN = 'taiwan-company-establishment-basics';

/**
 * The posts `columns/[slug]/page.tsx` renders for `locale` — file-backed for ja
 * and the guidance languages, file + builder/Blob for ko, zh-hant and en. A
 * slug outside this list is a 404.
 */
async function routableColumnPosts(locale: PublicLocale8): Promise<readonly ColumnPost[]> {
  return locale === 'ja' || isGuidanceLocale4(locale)
    ? getAllColumnPosts(locale)
    : getAllColumnPostsIncludingBlob(locale);
}

function hrefs(html: string): string[] {
  return [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((match) => match[1]);
}

function footerHrefs(locale: PublicLocale8, pathname: string, links: PublicColumnLanguageLinks | null): string[] {
  return hrefs(renderToStaticMarkup(
    <LocaleFlagSwitcherView locale={locale} pathname={pathname} columnLinksByLocale={links} />,
  ));
}

function pickerHrefs(locale: PublicLocale8, pathname: string, links: PublicColumnLanguageLinks | null): string[] {
  return hrefs(renderToStaticMarkup(
    <GlobalLanguagePickerView
      locale={locale}
      pathname={pathname}
      columnLinksByLocale={links}
      open
      onOpen={() => undefined}
      onClose={() => undefined}
    />,
  ));
}

/** The footer switcher as the app renders it: inside the provider of the locale layout. */
function appFooterHrefs(locale: PublicLocale8, pathname: string, index: PublicColumnLanguageIndex): string[] {
  navigationState.pathname = pathname;
  return hrefs(renderToStaticMarkup(
    <PublicColumnLanguageLinksProvider index={index} columnLocales={[]}>
      <LocaleFlagSwitcher locale={locale} />
    </PublicColumnLanguageLinksProvider>,
  ));
}

/** Switcher hrefs expected on `pathname`: the page itself, then each published translation. */
function expectedSwitcherHrefs(locale: PublicLocale8, pathname: string, links: PublicColumnLanguageLinks): string[] {
  return PUBLIC_LOCALES_8.flatMap((target) => {
    if (target === locale) return [pathname];
    return links[target] ? [links[target]] : [];
  });
}

describe('column 051 (ko, zh-hant and en only)', () => {
  const expectedLinks = {
    ko: `/ko/columns/${COLUMN_051}`,
    'zh-hant': `/zh-hant/columns/${COLUMN_051}`,
    en: `/en/columns/${COLUMN_051}`,
  };

  it('links the three published versions from every one of them and never ja', () => {
    for (const locale of ['ko', 'zh-hant', 'en'] as const) {
      const pathname = `/${locale}/columns/${COLUMN_051}`;
      const { index } = publicColumnSwitcherData(locale);
      const links = columnLanguageLinksFromIndex(pathname, index);
      expect(links, locale).toEqual(expectedLinks);
      expect(footerHrefs(locale, pathname, links)).toEqual(Object.values(expectedLinks));
      expect(pickerHrefs(locale, pathname, links).sort()).toEqual(Object.values(expectedLinks).sort());
      expect(appFooterHrefs(locale, pathname, index)).toEqual(Object.values(expectedLinks));
    }
  });

  it('renders the server HTML of the footer switcher without any ja link', () => {
    const { index, columnLocales } = publicColumnSwitcherData('ko');
    navigationState.pathname = `/ko/columns/${COLUMN_051}`;
    const html = renderToStaticMarkup(
      <PublicColumnLanguageLinksProvider index={index} columnLocales={columnLocales}>
        <LocaleFlagSwitcher locale="ko" />
      </PublicColumnLanguageLinksProvider>,
    );
    expect(hrefs(html)).toEqual(Object.values(expectedLinks));
    expect(html).not.toContain('href="/ja');
  });

  it('emits no ja hreflang and keeps x-default inside the cluster', () => {
    const languages = getLanguageAlternates(`/columns/${COLUMN_051}`, columnAlternateLocales(COLUMN_051, 'ko'), {
      xDefaultWithinCluster: true,
    });
    expect(languages).toEqual({
      ko: buildAbsoluteUrl(expectedLinks.ko),
      'zh-Hant': buildAbsoluteUrl(expectedLinks['zh-hant']),
      en: buildAbsoluteUrl(expectedLinks.en),
      'x-default': buildAbsoluteUrl(expectedLinks.en),
    });
    expect(languages).not.toHaveProperty('ja');
  });

  it('builds the column page metadata alternates from the same cluster', async () => {
    const { generateMetadata } = await import('@/app/[locale]/columns/[slug]/page');
    for (const locale of ['ko', 'zh-hant', 'en'] as const) {
      const metadata = await generateMetadata({ params: Promise.resolve({ locale, slug: COLUMN_051 }) });
      expect(metadata.alternates?.languages, locale).toEqual({
        ko: buildAbsoluteUrl(expectedLinks.ko),
        'zh-Hant': buildAbsoluteUrl(expectedLinks['zh-hant']),
        en: buildAbsoluteUrl(expectedLinks.en),
        'x-default': buildAbsoluteUrl(expectedLinks.en),
      });
    }
  }, 60_000); // importing the whole page module is slow on a cold transform cache
});

describe('a column published in every language', () => {
  it('links every language with that language\'s own URL', () => {
    const expected = Object.fromEntries(
      PUBLIC_LOCALES_8.map((locale) => [locale, `/${locale}/columns/${ALL_LOCALE_COLUMN}`]),
    );
    for (const locale of ['ko', 'ja', 'vi', 'de'] as const) {
      const pathname = `/${locale}/columns/${ALL_LOCALE_COLUMN}`;
      const { index } = publicColumnSwitcherData(locale);
      const links = columnLanguageLinksFromIndex(pathname, index);
      expect(links, locale).toEqual(expected);
      expect(footerHrefs(locale, pathname, links)).toEqual(Object.values(expected));
      expect(pickerHrefs(locale, pathname, links)).toHaveLength(PUBLIC_LOCALES_8.length);
      expect(appFooterHrefs(locale, pathname, index)).toEqual(Object.values(expected));
    }
  });
});

describe('every column in every language', () => {
  const routable = new Map<PublicLocale8, Set<string>>();
  const indexes = new Map<PublicLocale8, PublicColumnLanguageIndex>();
  const versions: Array<{ locale: PublicLocale8; slug: string }> = [];
  const hreflangCluster = new Map<string, PublicLocale8[]>();
  const fileBackedCluster = new Map<string, PublicLocale8[]>();

  beforeAll(async () => {
    // Parse each language's markdown once, as production does. Under Vitest
    // the loader re-reads the whole corpus on every call, which would make a
    // sweep over ~1,000 articles take minutes.
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('VITEST', '');
    try {
      for (const locale of PUBLIC_LOCALES_8) {
        routable.set(locale, new Set((await routableColumnPosts(locale)).map((post) => post.slug)));
        indexes.set(locale, publicColumnSwitcherData(locale).index);
        for (const post of getAllColumnPosts(locale)) versions.push({ locale, slug: post.slug });
      }
      for (const { locale, slug } of versions) {
        hreflangCluster.set(`${locale}/${slug}`, columnAlternateLocales(slug, locale));
        if (!fileBackedCluster.has(slug)) fileBackedCluster.set(slug, fileBackedColumnAlternateLocales(slug));
      }
    } finally {
      vi.unstubAllEnvs();
    }
  }, 120_000);

  it('covers the whole corpus', () => {
    expect(versions.length).toBeGreaterThan(1000);
    expect(new Set(versions.map((version) => version.locale)).size).toBe(PUBLIC_LOCALES_8.length);
  });

  it('switches only to versions that render, and to every version that does', () => {
    for (const { locale, slug } of versions) {
      const key = `${locale}/${slug}`;
      const pathname = `/${locale}/columns/${slug}`;
      const links = columnLanguageLinksFromIndex(pathname, indexes.get(locale));
      const published = PUBLIC_LOCALES_8.filter((target) => routable.get(target)!.has(slug));

      expect(routable.get(locale)!.has(slug), `${key} renders`).toBe(true);
      expect(links, key).not.toBeNull();
      expect(Object.keys(links!), key).toEqual(published);
      for (const target of published) {
        expect(links![target], key).toBe(`/${target}/columns/${slug}`);
      }
      // Same cluster as the page's hreflang source.
      expect(Object.keys(links!), key).toEqual(fileBackedCluster.get(slug));

      const expected = expectedSwitcherHrefs(locale, pathname, links!);
      expect(footerHrefs(locale, pathname, links), key).toEqual(expected);
      expect(pickerHrefs(locale, pathname, links).sort(), key).toEqual([...expected].sort());
    }
  }, 120_000);

  it('emits hreflang alternates only for versions that render', () => {
    for (const { locale, slug } of versions) {
      const key = `${locale}/${slug}`;
      const languages = getLanguageAlternates(`/columns/${slug}`, hreflangCluster.get(key)!, {
        xDefaultWithinCluster: true,
      });
      const published = new Set(
        PUBLIC_LOCALES_8.filter((target) => routable.get(target)!.has(slug))
          .map((target) => buildAbsoluteUrl(`/${target}/columns/${slug}`)),
      );
      for (const [tag, url] of Object.entries(languages)) {
        expect(published.has(url), `${key} ${tag} ${url}`).toBe(true);
      }
      expect(Object.keys(languages)).toHaveLength(published.size + 1);
    }
  });

  it('sends each language only its own columns with compact translation clusters', () => {
    for (const [locale, index] of indexes) {
      const ownSlugs = versions.filter((version) => version.locale === locale).map((version) => version.slug);
      expect(Object.keys(index.columns).sort(), locale).toEqual(
        [...ownSlugs].sort(),
      );
      // Compare equivalent data for this language: native articles need not
      // be distributed evenly across the public languages.
      const expandedIndex = {
        locale,
        columns: Object.fromEntries(ownSlugs.map((slug) => [slug, fileBackedCluster.get(slug)!])),
      };
      expect(JSON.stringify(index).length, locale).toBeLessThan(
        JSON.stringify(expandedIndex).length,
      );
    }
  });
});

describe('a builder/Blob-only column (no markdown file in any language)', () => {
  it('lists only its own language and keeps x-default on it', () => {
    const slug = 'builder-only-fixture-column';
    const pathname = `/ko/columns/${slug}`;
    expect(columnLanguageLinksFromIndex(pathname, publicColumnSwitcherData('ko').index)).toBeNull();
    expect(footerHrefs('ko', pathname, null)).toEqual([pathname]);
    expect(columnAlternateLocales(slug, 'ko')).toEqual(['ko']);
    expect(getLanguageAlternates(`/columns/${slug}`, columnAlternateLocales(slug, 'ko'), {
      xDefaultWithinCluster: true,
    })).toEqual({
      ko: buildAbsoluteUrl(pathname),
      'x-default': buildAbsoluteUrl(pathname),
    });
  });
});

describe('issue-board columns', () => {
  it('list only their own language, since each is written for one language', () => {
    let checked = 0;
    // Parse each issue board once; re-reading every board per post outgrew the default timeout.
    const issuePostsByLocale = new Map(ISSUE_BOARD_LOCALES.map((locale) => [locale, getAllIssuePosts(locale)]));
    for (const locale of ISSUE_BOARD_LOCALES) {
      const { index } = publicColumnSwitcherData(locale);
      for (const post of issuePostsByLocale.get(locale) ?? []) {
        const pathname = `/${locale}/columns/issues/${post.slug}`;
        const others = ISSUE_BOARD_LOCALES.filter(
          (other) => other !== locale && (issuePostsByLocale.get(other) ?? []).some((candidate) => candidate.slug === post.slug),
        );
        expect(others, pathname).toEqual([]);

        expect(columnLanguageLinksFromIndex(pathname, index), pathname).toBeNull();
        expect(appFooterHrefs(locale, pathname, index), pathname).toEqual([pathname]);
        expect(pickerHrefs(locale, pathname, null), pathname).toEqual([pathname]);
        checked += 1;
      }
    }
    expect(checked).toBeGreaterThan(0);
  }, 30_000); // renders every issue article in seven languages; grows with the issue boards
});

describe('pages that are not column articles', () => {
  it('keep listing every language', () => {
    for (const pathname of ['/ko', '/ko/columns', '/ko/columns/issues', '/ko/videos', '/vi/columns']) {
      const locale = pathname.split('/')[1] as PublicLocale8;
      const { index } = publicColumnSwitcherData(locale);
      expect(columnLanguageLinksFromIndex(pathname, index), pathname).toBeNull();
      expect(appFooterHrefs(locale, pathname, index), pathname).toHaveLength(PUBLIC_LOCALES_8.length);
      expect(pickerHrefs(locale, pathname, null), pathname).toHaveLength(PUBLIC_LOCALES_8.length);
    }
  });
});

describe('client-side navigation', () => {
  it('follows the pathname, since the shared layout does not re-render', () => {
    const { index } = publicColumnSwitcherData('ko');
    expect(appFooterHrefs('ko', `/ko/columns/${COLUMN_051}`, index)).toHaveLength(3);
    expect(appFooterHrefs('ko', `/ko/columns/${ALL_LOCALE_COLUMN}`, index)).toHaveLength(PUBLIC_LOCALES_8.length);
    expect(appFooterHrefs('ko', '/ko/videos', index)).toHaveLength(PUBLIC_LOCALES_8.length);
  });

  it('never applies one language\'s index to another language\'s article', () => {
    const { index } = publicColumnSwitcherData('ko');
    const pathname = `/ja/columns/${ALL_LOCALE_COLUMN}`;
    expect(columnLanguageLinksFromIndex(pathname, index)).toBeNull();
    expect(appFooterHrefs('ja', pathname, index)).toEqual([pathname]);
  });

  it('does not read inherited object properties as column slugs', () => {
    const { index } = publicColumnSwitcherData('ko');
    for (const slug of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) {
      expect(columnLanguageLinksFromIndex(`/ko/columns/${slug}`, index), slug).toBeNull();
    }
  });
});

describe('static snapshot column language data', () => {
  beforeAll(() => {
    // Exercise the real file-backed corpus with its normal production parse cache.
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('VITEST', '');
  });
  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('sends only the current article while preserving its three real language links', () => {
    const pathname = `/ko/columns/${COLUMN_051}`;
    const { index, columnLocales } = publicColumnSwitcherData('ko', { staticPathname: pathname });
    expect(index.columns).toEqual({ [COLUMN_051]: 0 });
    expect(index.clusters).toEqual([['ko', 'zh-hant', 'en']]);
    expect(appFooterHrefs('ko', pathname, index)).toEqual([
      `/ko/columns/${COLUMN_051}`,
      `/zh-hant/columns/${COLUMN_051}`,
      `/en/columns/${COLUMN_051}`,
    ]);
    expect(columnLocales).toEqual(PUBLIC_LOCALES_8);
    expect(columnLocales).toHaveLength(49);
  });

  it('retains all 49 published links from every locale without carrying other article slugs', () => {
    const expected = PUBLIC_LOCALES_8.map((locale) => `/${locale}/columns/${ALL_LOCALE_COLUMN}`);
    for (const locale of PUBLIC_LOCALES_8) {
      const pathname = `/${locale}/columns/${ALL_LOCALE_COLUMN}`;
      const { index } = publicColumnSwitcherData(locale, { staticPathname: pathname });
      expect(Object.keys(index.columns), locale).toEqual([ALL_LOCALE_COLUMN]);
      expect(index.clusters, locale).toEqual([PUBLIC_LOCALES_8]);
      expect(appFooterHrefs(locale, pathname, index), locale).toEqual(expected);
      expect(pickerHrefs(locale, pathname, columnLanguageLinksFromIndex(pathname, index)).sort(), locale)
        .toEqual([...expected].sort());
    }
  });

  it.each(['/ko', '/ko/', '/ko/columns', '/ko/columns/', '/ko/columns/issues', '/ko/search', '/ko/services/civil'])
  ('omits article mappings on the non-article snapshot %s and keeps all language choices', (pathname) => {
    const { index, columnLocales } = publicColumnSwitcherData('ko', { staticPathname: pathname });
    expect(index).toEqual({ locale: 'ko', clusters: [], columns: {} });
    expect(columnLocales).toEqual(PUBLIC_LOCALES_8);
    expect(appFooterHrefs('ko', pathname, index)).toHaveLength(49);
  });

  it('keeps unknown, CMS-only, untranslated and issue articles restricted to their current language', () => {
    for (const [locale, pathname] of [
      ['ko', '/ko/columns/missing-column-for-static-scope'],
      ['ko', '/ko/columns/builder-only-fixture-column'],
      ['ko', '/ko/columns/constructor'],
      ['ja', `/ja/columns/${COLUMN_051}`],
      ['ko', '/ko/columns/issues/issue-only-fixture'],
    ] as const) {
      const { index, columnLocales } = publicColumnSwitcherData(locale, { staticPathname: pathname });
      expect(index, pathname).toEqual({ locale, clusters: [], columns: {} });
      expect(columnLocales, pathname).toEqual(PUBLIC_LOCALES_8);
      expect(appFooterHrefs(locale, pathname, index), pathname).toEqual([pathname]);
    }
  });

  it('accepts one trailing slash without changing the current article cluster', () => {
    const { index } = publicColumnSwitcherData('ko', { staticPathname: `/ko/columns/${COLUMN_051}/` });
    expect(index.columns).toEqual({ [COLUMN_051]: 0 });
    expect(index.clusters).toEqual([['ko', 'zh-hant', 'en']]);
  });

  it.each([
    undefined, null, '', '/', 'ko/columns/taiwan-company-establishment-basics',
    '/en/columns/taiwan-company-establishment-basics',
    '/KO/columns/taiwan-company-establishment-basics',
    '/ko//columns/taiwan-company-establishment-basics',
    '/ko/columns/taiwan-company-establishment-basics/extra',
    '/ko/columns/taiwan-company-establishment-basics?topic=company',
    '/ko/columns/taiwan-company-establishment-basics#section',
    '/ko/columns/../taiwan-company-establishment-basics',
    '/ko/columns/taiwan_company_establishment_basics',
    '/ko/columns/%74aiwan-company-establishment-basics',
    '/ko/columns/taiwan%2Fcompany', '/ko/columns/%E0%A4%A',
    '/ko/columns/taiwan%252Fcompany', '/ko/columns/taiwan\\company',
    '/ko/columns/taiwan\ncompany', 'https://tseng-law.com/ko/columns/test',
  ])('falls back to the full navigation index for absent or ambiguous pathname %s', (staticPathname) => {
    const { index } = publicColumnSwitcherData('ko', { staticPathname });
    expect(Object.keys(index.columns)).toContain(COLUMN_051);
    expect(Object.keys(index.columns)).toContain(ALL_LOCALE_COLUMN);
    expect(Object.keys(index.columns).length).toBeGreaterThan(2);
    expect(appFooterHrefs('ko', `/ko/columns/${COLUMN_051}`, index)).toHaveLength(3);
    expect(appFooterHrefs('ko', `/ko/columns/${ALL_LOCALE_COLUMN}`, index)).toHaveLength(49);
  });

  it('keeps the ordinary SPA index complete when no static snapshot option is supplied', () => {
    const { index } = publicColumnSwitcherData('ko');
    expect(Object.keys(index.columns)).toContain(COLUMN_051);
    expect(Object.keys(index.columns)).toContain(ALL_LOCALE_COLUMN);
    expect(appFooterHrefs('ko', `/ko/columns/${COLUMN_051}`, index)).toHaveLength(3);
    expect(appFooterHrefs('ko', `/ko/columns/${ALL_LOCALE_COLUMN}`, index)).toHaveLength(49);
  });
});
