import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

import { LegacyHomePageBody } from '@/app/[locale]/(legacy)/home-legacy';
import GuidanceHomeBody, { resolveGuidanceHomeColumns } from '@/components/GuidanceHomeBody';
import { selectJaGalleryPosts } from '@/components/ja-design/kou/JaRead';
import { JA_PINNED_COLUMN_SLUGS } from '@/components/ja-design/ja-arrangement';
import { getAllColumnPosts } from '@/lib/columns';
import { mapColumnPostsToHomeInsights } from '@/lib/insights/home-insight-posts';
import { archiveLeadPublicationDate, archiveLeadSlugsFor } from '@/lib/__tests__/native-locale-columns';

describe('home columns lead with the latest publication batch', () => {
  it.each(['ko', 'zh-hant', 'ja', 'en', 'es'] as const)(
    '%s shows its newest columns before older curated picks',
    (locale) => {
      const html = renderToStaticMarkup(locale === 'es'
        ? <GuidanceHomeBody locale="es" columns={resolveGuidanceHomeColumns('es', getAllColumnPosts)} />
        : <LegacyHomePageBody locale={locale} posts={mapColumnPostsToHomeInsights(getAllColumnPosts(locale))} faqItems={[]} />);
      const section = html.match(/<section\b[^>]*\bid="insights"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
      const links = [...new Set([...section.matchAll(new RegExp(`href="/${locale}/columns/([^"?#]+)"`, 'g'))].map((m) => m[1]))];
      expect(links.length).toBeGreaterThanOrEqual(4);
      // Home recommendations break equal-day ties by descending column number.
      // The fixture registry is in ascending source order, independently of the
      // production recommendation selector.
      const archive = archiveLeadSlugsFor(locale);
      // Newest first by publication day; within a day, descending column number.
      const days = [...new Set(archive.map(archiveLeadPublicationDate))];
      const newest = days.flatMap((day) => archive.filter((slug) => archiveLeadPublicationDate(slug) === day).reverse());
      const count = Math.min(6, links.length);
      expect(links.slice(0, count)).toEqual(newest.slice(0, count));
      if (locale === 'zh-hant' || locale === 'en' || locale === 'es') {
        const imageAlts = [...section.matchAll(/<img\b[^>]*\balt="([^"]+)"[^>]*>/g)].map((m) => m[1]);
        expect(imageAlts.length).toBeGreaterThan(0);
        // Cards keep each column's authored alt; newer batches may use descriptive alts.
        expect(imageAlts.every((alt) => alt.trim().length > 0)).toBe(true);
      }
    },
  );

  it('Japanese gallery uses publication dates, deduplicates pins and keeps the remaining curated picks', () => {
    const post = (slug: string, date: string, publicationDate: string) => ({
      slug, title: slug, date, dateDisplay: publicationDate, publicationDate,
      readTime: '', categoryLabel: '', summary: '', featuredImage: '',
    });
    const selected = selectJaGalleryPosts([
      post('old-revised', '2026-10-24', '2026-09-01'),
      post(JA_PINNED_COLUMN_SLUGS[0], '2026-10-23', '2026-10-23'),
      ...['a', 'b', 'c', 'd', 'e'].map((slug) => post(slug, '2026-10-23', '2026-10-23')),
      post(JA_PINNED_COLUMN_SLUGS[1], '2026-09-01', '2026-09-01'),
    ]);
    expect(selected.map((item) => item.slug)).toEqual([
      JA_PINNED_COLUMN_SLUGS[0], 'a', 'b', 'c', 'd', 'e', JA_PINNED_COLUMN_SLUGS[1],
    ]);
  });
});
