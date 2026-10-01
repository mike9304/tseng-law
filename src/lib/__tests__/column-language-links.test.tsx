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

  it('sends each language only its own columns, far less than the whole index', () => {
    const wholeIndex = JSON.stringify(
      Object.fromEntries(PUBLIC_LOCALES_8.map((locale) => [
        locale,
        versions.filter((version) => version.locale === locale).map((version) => version.slug),
      ])),
    ).length;
    for (const [locale, index] of indexes) {
      expect(Object.keys(index.columns).sort(), locale).toEqual(
        versions.filter((version) => version.locale === locale).map((version) => version.slug).sort(),
      );
      expect(JSON.stringify(index).length, locale).toBeLessThan(wholeIndex / 8);
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
    for (const locale of ISSUE_BOARD_LOCALES) {
      const { index } = publicColumnSwitcherData(locale);
      for (const post of getAllIssuePosts(locale)) {
        const pathname = `/${locale}/columns/issues/${post.slug}`;
        const others = ISSUE_BOARD_LOCALES.filter(
          (other) => other !== locale && getAllIssuePosts(other).some((candidate) => candidate.slug === post.slug),
        );
        expect(others, pathname).toEqual([]);

        expect(columnLanguageLinksFromIndex(pathname, index), pathname).toBeNull();
        expect(appFooterHrefs(locale, pathname, index), pathname).toEqual([pathname]);
        expect(pickerHrefs(locale, pathname, null), pathname).toEqual([pathname]);
        checked += 1;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
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
