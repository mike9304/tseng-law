import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import TaxAccountingBoard from '@/components/tax-accounting/TaxAccountingBoard';
import type { ColumnPost } from '@/lib/column-post';
import { getAllColumnPosts } from '@/lib/columns';
import { siteLocales } from '@/lib/locales';
import {
  LEGACY_TAX_ACCOUNTING_SLUGS,
  TAX_ACCOUNTING_TAG,
  selectTaxAccountingColumns,
  taxAccountingBoardCopy,
} from '@/lib/tax-accounting-board';
import { TAX_ACCOUNTING_COLUMN_FILES } from './tax-accounting-column-files';

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

function post(slug: string, extra: Partial<ColumnPost> = {}): ColumnPost {
  return {
    slug,
    title: slug,
    date: '2026-10-06',
    dateDisplay: '',
    readTime: '',
    category: 'legal',
    categoryLabel: '',
    featuredImage: '',
    content: '',
    summary: '',
    ...extra,
  } as ColumnPost;
}

describe('selectTaxAccountingColumns', () => {
  it('splits tagged columns from legacy columns and drops everything else', () => {
    const lists = selectTaxAccountingColumns([
      post('tagged', { tags: ['Tax-Accounting '] }),
      post('withdraw-capital-taiwan-company'),
      post('unrelated', { tags: ['traffic-accidents'], topic: 'tax' }),
      post('string-tag', { tags: 'tax-accounting' as unknown as string[] }),
      post('visual-load-more-1', { tags: [TAX_ACCOUNTING_TAG] }),
    ]);
    expect(lists.board.map((p) => p.slug)).toEqual(['tagged']);
    expect(lists.related.map((p) => p.slug)).toEqual(['withdraw-capital-taiwan-company']);
  });

  it('puts a tagged legacy column on the board once and sorts newest first, file number breaking ties', () => {
    const lists = selectTaxAccountingColumns([
      post('older', { tags: [TAX_ACCOUNTING_TAG], publicationDate: '2026-10-01', columnNumber: 400 }),
      post('same-day-low', { tags: [TAX_ACCOUNTING_TAG], publicationDate: '2026-10-06', columnNumber: 301 }),
      post('same-day-high', { tags: [TAX_ACCOUNTING_TAG], publicationDate: '2026-10-06', columnNumber: 302 }),
      post('taiwan-income-tax-residency', { tags: [TAX_ACCOUNTING_TAG], publicationDate: '2026-09-01' }),
      post('taiwan-income-tax-residency', { publicationDate: '2026-09-01' }),
    ]);
    expect(lists.board.map((p) => p.slug)).toEqual([
      'same-day-high',
      'same-day-low',
      'older',
      'taiwan-income-tax-residency',
    ]);
    expect(lists.related).toEqual([]);
  });
});

describe.each([...siteLocales])('%s tax & accounting board on the real corpus', (locale) => {
  const lists = selectTaxAccountingColumns(getAllColumnPosts(locale));

  it('lists exactly the registered board columns of this locale', () => {
    const expected = TAX_ACCOUNTING_COLUMN_FILES[locale]
      .map((file) => file.replace(/^\d{3}-/, '').replace(/\.md$/, ''))
      .sort();
    expect(lists.board.map((p) => p.slug).sort()).toEqual(expected);
    for (const column of lists.board) expect(column.tags).toContain(TAX_ACCOUNTING_TAG);
  });

  it('lists every legacy column that exists in this locale', () => {
    const available = new Set(getAllColumnPosts(locale).map((p) => p.slug));
    const expected = LEGACY_TAX_ACCOUNTING_SLUGS.filter((slug) => available.has(slug)).sort();
    expect(lists.related.map((p) => p.slug).sort()).toEqual(expected);
    expect(lists.related.length).toBeGreaterThan(0);
  });

  it('renders board and related cards linking to this locale only', () => {
    const html = renderToStaticMarkup(<TaxAccountingBoard locale={locale} lists={lists} />);
    const copy = taxAccountingBoardCopy[locale];
    expect(html).toContain(`<h1 class="svc-hero-title">${copy.title}</h1>`);
    for (const column of [...lists.board, ...lists.related]) {
      expect(html).toContain(`href="/${locale}/columns/${column.slug}"`);
    }
    expect(html.match(/data-tax-accounting-kind="board"/g) ?? []).toHaveLength(lists.board.length);
    expect(html.match(/data-tax-accounting-kind="related"/g) ?? []).toHaveLength(lists.related.length);
    for (const other of siteLocales.filter((l) => l !== locale)) {
      expect(html).not.toContain(`href="/${other}/columns/`);
    }
    expect(html).not.toMatch(/<strong|<b>/);
    // Badges sit on the card image (svc-col-badge is absolutely positioned).
    expect(html.match(/class="svc-col-badge"/g) ?? []).toHaveLength(html.match(/class="svc-col-card-media"/g)?.length ?? 0);
  });
});
