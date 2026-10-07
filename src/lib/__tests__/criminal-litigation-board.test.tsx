import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import CriminalLitigationPage, { generateMetadata } from '@/app/[locale]/criminal-litigation/page';
import { getAllColumnPosts } from '@/lib/columns';
import { CRIMINAL_BOARD_LOCALES, selectCriminalColumns } from '@/lib/criminal-litigation-board';
import { resolveGuidanceMiddlewareRewrite, resolvePublicLanguageSwitchTarget } from '@/lib/public-guidance';
import { CRIMINAL_SERVICE_COLUMN_SLUGS, CRIMINAL_SERVICE_POINTS, PREVIOUS_CRIMINAL_SERVICE_POINTS } from '@/data/criminal-service-copy';
import { projectInternationalPublicCopy } from '@/lib/services/international-public-copy';
import { expectedCriminalBoardSlugs } from './criminal-coverage-column-files';

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

function collectionUrls(html: string): string[] {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  expect(match, 'the board should expose its collection data').not.toBeNull();
  const collection = JSON.parse(match![1]);
  return collection.mainEntity.itemListElement.map((item: { url: string }) => item.url);
}

describe.each(CRIMINAL_BOARD_LOCALES)('%s criminal board', (locale) => {
  it('serves the exact native publication inventory with reciprocal metadata and local service navigation', async () => {
    const expected = expectedCriminalBoardSlugs(locale);
    const posts = selectCriminalColumns(getAllColumnPosts(locale));
    expect(posts.map((p) => p.slug).sort()).toEqual(expected);
    const html = renderToStaticMarkup(await CriminalLitigationPage({ params: Promise.resolve({ locale }) }));
    expect(html.match(/data-criminal-column=/g)).toHaveLength(expected.length);
    expect(html).toContain(`data-criminal-count="${expected.length}"`);
    expect(collectionUrls(html).sort()).toEqual(expected.map((slug) => `https://tseng-law.com/${locale}/columns/${slug}`));
    expect(html).not.toContain('<main');
    for (const slug of expected) {
      expect(html).toContain(`href="/${locale}/columns/${slug}"`);
    }
    expect(html).toContain(`href="/${locale}/services${locale === 'vi' ? '' : '/criminal'}"`);
    const metadata = await generateMetadata({ params: Promise.resolve({ locale }) });
    expect(metadata.alternates?.canonical).toBe(`https://tseng-law.com/${locale}/criminal-litigation`);
    expect(Object.keys(metadata.alternates?.languages ?? {}).sort()).toEqual(['en', 'ja', 'ko', 'vi', 'x-default', 'zh-Hant'].sort());
  });
});

it.each(CRIMINAL_BOARD_LOCALES)('searches only the %s board inventory and preserves a reset route', async (locale) => {
  const target = getAllColumnPosts(locale).find((post) => post.slug === 'taiwan-non-prosecution-reconsideration-deadline')!;
  const html = renderToStaticMarkup(await CriminalLitigationPage({
    params: Promise.resolve({ locale }), searchParams: Promise.resolve({ q: target.title }),
  }));
  expect(html.match(/data-criminal-column=/g)).toHaveLength(1);
  expect(html).toContain(`data-criminal-column="${target.slug}"`);
  expect(collectionUrls(html)).toEqual([`https://tseng-law.com/${locale}/columns/${target.slug}`]);
  expect(html).toContain(`action="/${locale}/criminal-litigation"`);
  expect(html).toContain(`href="/${locale}/criminal-litigation"`);
  expect(html).toContain('name="q"');
  expect(html).toContain('data-criminal-search-reset="true"');
  const empty = renderToStaticMarkup(await CriminalLitigationPage({
    params: Promise.resolve({ locale }), searchParams: Promise.resolve({ q: 'unmatched-query-817263' }),
  }));
  expect(empty).not.toContain('data-criminal-column=');
  expect(collectionUrls(empty)).toEqual([]);
  expect(empty).toContain('data-criminal-search-results="0"');
  expect(empty).toContain(`data-criminal-count="${expectedCriminalBoardSlugs(locale).length}"`);
});

it('filters internal posts and duplicates before sorting', () => {
  const [a, b] = selectCriminalColumns(getAllColumnPosts('en'));
  expect(selectCriminalColumns([b, a, a, { ...a, slug: 'visual-load-more-1' }]).map((p) => p.slug)).toEqual([a.slug, b.slug]);
});

it('keeps the Vietnamese board on its real route without opening unavailable language versions', () => {
  expect(resolveGuidanceMiddlewareRewrite('/vi/criminal-litigation')).toBeNull();
  expect(resolveGuidanceMiddlewareRewrite('/id/criminal-litigation')?.allowed).toBe(false);
  expect(resolvePublicLanguageSwitchTarget('/en/criminal-litigation', 'vi').href).toBe('/vi/criminal-litigation');
  expect(resolvePublicLanguageSwitchTarget('/vi/criminal-litigation', 'ja').href).toBe('/ja/criminal-litigation');
});

it.each(['ko', 'zh-hant', 'en'] as const)('repairs persisted old %s criminal copy and preserves custom points', (locale) => {
  const input = { slug: 'renamed-criminal', sourceSlug: 'criminal', title: 'title', subtitle: 'subtitle', intro: 'intro',
    keyPoints: [...PREVIOUS_CRIMINAL_SERVICE_POINTS[locale], 'custom'], columnSlugs: ['custom-column'] };
  const result = projectInternationalPublicCopy(locale, input);
  expect(result.keyPoints).toEqual([...CRIMINAL_SERVICE_POINTS[locale], 'custom']);
  expect(result.columnSlugs).toEqual(['custom-column', ...CRIMINAL_SERVICE_COLUMN_SLUGS]);
  expect(input.keyPoints).toEqual([...PREVIOUS_CRIMINAL_SERVICE_POINTS[locale], 'custom']);
});
