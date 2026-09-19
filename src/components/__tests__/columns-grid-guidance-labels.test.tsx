import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { guidanceContent } from '@/data/international-guidance-content';
import { guidanceColumnCategoryLabel } from '@/lib/columns';
import { GUIDANCE_LOCALES_4, type GuidanceLocale4 } from '@/lib/public-guidance';
import ColumnsGrid, { type ColumnListItem } from '../ColumnsGrid';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/en/columns',
  useSearchParams: () => null,
}));

const GUIDANCE_CONTENT_SRC = path.join(process.cwd(), 'src/data/international-guidance-content.ts');
const GUIDANCE_WESTERN_SRC = path.join(process.cwd(), 'src/data/international-guidance-western.ts');
const GUIDANCE_ASIA_SRC = path.join(process.cwd(), 'src/data/international-guidance-asia.ts');
const GUIDANCE_IT_NL_PL_SRC = path.join(process.cwd(), 'src/data/international-guidance-it-nl-pl.ts');
const GUIDANCE_NORDIC_SRC = path.join(process.cwd(), 'src/data/international-guidance-nordic.ts');

/**
 * Filter "All" word taken from reviewed `viewAllLabel` already in
 * `international-guidance-content.ts` (grep 2026-09-16). Not invented:
 *   vi  line 140  mega.services.viewAllLabel: 'Xem tất cả'     → 'Tất cả'
 *   id  line 635  mega.services.viewAllLabel: 'Lihat semua'    → 'Semua'
 *   th  line 1130 mega.services.viewAllLabel: 'ดูทั้งหมด'       → 'ทั้งหมด'
 *   fil line 1625 mega.services.viewAllLabel: 'Tingnan lahat'  → 'Lahat'
 *   ar  line 2120 mega.services.viewAllLabel: 'عرض الكل'       → 'الكل'
 */
const GUIDANCE_ALL_LABEL: Record<GuidanceLocale4, string> = {
  vi: 'Tất cả',
  id: 'Semua',
  th: 'ทั้งหมด',
  fil: 'Lahat',
  ar: 'الكل',
  de: 'Alle',
  es: 'Todo',
  fr: 'Tout',
  pt: 'Tudo',
  'zh-hans': '全部',
  ms: 'Semua',
  ru: 'Все',
  tr: 'Tümü',
  it: 'Tutti',
  nl: 'Alles',
  pl: 'Wszystkie',
  hi: 'सभी',
  sv: 'Alla',
  da: 'Alle',
  nb: 'Alle',
  fi: 'Kaikki',
};

const VIEW_ALL_LABEL_EVIDENCE: Record<GuidanceLocale4, string> = {
  vi: "viewAllLabel: 'Xem tất cả'",
  id: "viewAllLabel: 'Lihat semua'",
  th: "viewAllLabel: 'ดูทั้งหมด'",
  fil: "viewAllLabel: 'Tingnan lahat'",
  ar: "viewAllLabel: 'عرض الكل'",
  de: "viewAllLabel: 'Alle anzeigen'",
  es: "viewAllLabel: 'Ver todo'",
  fr: "viewAllLabel: 'Tout afficher'",
  pt: "viewAllLabel: 'Ver tudo'",
  'zh-hans': "viewAllLabel: '查看全部'",
  ms: "viewAllLabel: 'Lihat semua'",
  ru: "viewAllLabel: 'Показать все'",
  tr: "viewAllLabel: 'Tümünü göster'",
  it: "viewAllLabel: 'Mostra tutti'",
  nl: "viewAllLabel: 'Alles tonen'",
  pl: "viewAllLabel: 'Pokaż wszystkie'",
  hi: "viewAllLabel: 'सभी देखें'",
  sv: "viewAllLabel: 'Visa alla'",
  da: "viewAllLabel: 'Vis alle'",
  nb: "viewAllLabel: 'Vis alle'",
  fi: "viewAllLabel: 'Näytä kaikki'",
};

const ENGLISH_FILTER_LABELS = ['All', 'Company Setup', 'Legal Info', 'Case Studies'] as const;
const CATEGORIES = ['formation', 'legal', 'case'] as const;

const posts: ColumnListItem[] = [
  {
    slug: 'company-guide',
    title: 'A complete company guide',
    date: '2026-01-05',
    dateDisplay: '2026-01-05',
    readTime: '4 min',
    category: 'formation',
    categoryLabel: 'Company Setup',
    authorName: 'Wei Tseng',
    tags: ['registration'],
    featuredImage: '/images/real-column.jpg',
    summary: 'Planning company registration in Taiwan.',
  },
  {
    slug: 'labor-guide',
    title: 'A complete labor guide',
    date: '2025-02-05',
    dateDisplay: '2025-02-05',
    readTime: '3 min',
    category: 'legal',
    categoryLabel: 'Legal Info',
    authorName: 'Another Author',
    featuredImage: '/images/real-column.jpg',
    summary: 'Understanding employment contracts.',
  },
  {
    slug: 'case-guide',
    title: 'A complete case guide',
    date: '2025-03-05',
    dateDisplay: '2025-03-05',
    readTime: '5 min',
    category: 'case',
    categoryLabel: 'Case Studies',
    featuredImage: '/images/real-column.jpg',
    summary: 'A published litigation case.',
  },
];

function renderGrid(locale: 'ko' | 'zh-hant' | 'en' | 'ja' | GuidanceLocale4) {
  return renderToStaticMarkup(<ColumnsGrid locale={locale} posts={posts} />);
}

function filterButtonLabels(html: string): string[] {
  return [...html.matchAll(/class="columns-filter-btn[^"]*"[^>]*>([^<]*)/g)].map((match) => match[1]);
}

describe('ColumnsGrid guidance filter and card CTA labels', () => {
  it('pins All labels to reviewed viewAllLabel vocabulary already in the guidance content file', () => {
    const src = `${readFileSync(GUIDANCE_CONTENT_SRC, 'utf8')}\n${readFileSync(GUIDANCE_WESTERN_SRC, 'utf8')}\n${readFileSync(GUIDANCE_ASIA_SRC, 'utf8')}\n${readFileSync(GUIDANCE_IT_NL_PL_SRC, 'utf8')}\n${readFileSync(GUIDANCE_NORDIC_SRC, 'utf8')}`;
    for (const locale of GUIDANCE_LOCALES_4) {
      expect(src, locale).toContain(VIEW_ALL_LABEL_EVIDENCE[locale]);
      const viewAllValue = VIEW_ALL_LABEL_EVIDENCE[locale].match(/'([^']+)'/)?.[1] ?? '';
      expect(viewAllValue.toLocaleLowerCase(locale)).toContain(
        GUIDANCE_ALL_LABEL[locale].toLocaleLowerCase(locale),
      );
    }
  });

  /**
   * columns / Label keys already in each locale block of
   * international-guidance-content.ts (enumerated 2026-09-16):
   *   nav.columns
   *   mega.columns.viewAllLabel
   *   home.heroColumnsCtaLabel
   *   home.columnsViewAllLabel
   *   home.columnsReadMoreLabel   ← card CTA analogue; GuidanceHomeBody already
   *                                 renders `{columnsReadMoreLabel} →`
   *   home.columnsReviewLabel
   *   home.columnsOriginalLanguageBadge
   *   home.columnsOriginalLanguageNote
   *   pages.columns (page copy, not a control label)
   */
  it('reuses home.columnsReadMoreLabel for the card CTA in every guidance locale', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      expect(guidanceContent[locale].home.columnsReadMoreLabel.length).toBeGreaterThan(0);
    }
  });

  it.each(GUIDANCE_LOCALES_4)(
    '%s filter buttons drop English All/bucket labels and match the reviewed resolver',
    (locale) => {
      const html = renderGrid(locale);
      const buttons = filterButtonLabels(html);

      for (const english of ENGLISH_FILTER_LABELS) {
        expect(buttons, locale).not.toContain(english);
        expect(
          html,
          `${locale} filter button ${english}`,
        ).not.toMatch(new RegExp(`class="columns-filter-btn[^"]*"[^>]*>${english}<`));
      }

      expect(buttons).toEqual([
        GUIDANCE_ALL_LABEL[locale],
        guidanceColumnCategoryLabel('formation', locale),
        guidanceColumnCategoryLabel('legal', locale),
        guidanceColumnCategoryLabel('case', locale),
      ]);

      for (const category of CATEGORIES) {
        expect(buttons).toContain(guidanceColumnCategoryLabel(category, locale));
      }
    },
  );

  it.each(GUIDANCE_LOCALES_4)(
    '%s card CTA reuses columnsReadMoreLabel with the existing arrow, not Open column',
    (locale) => {
      const html = renderGrid(locale);
      const cta = `${guidanceContent[locale].home.columnsReadMoreLabel} →`;
      expect(html).toContain(cta);
      expect(html).not.toContain('Open column →');
    },
  );

  it('keeps the existing English filter and CTA copy on en', () => {
    const html = renderGrid('en');
    expect(filterButtonLabels(html)).toEqual([...ENGLISH_FILTER_LABELS]);
    expect(html).toContain('Open column →');
    expect(html).not.toContain('Tất cả');
    expect(html).not.toContain('Đọc tiếp');
  });

  it('does not change ko/zh-hant/ja filter or CTA bytes', () => {
    expect(filterButtonLabels(renderGrid('ko'))).toEqual(['전체', '법인설립', '법률정보', '소송사례']);
    expect(renderGrid('ko')).toContain('칼럼 보기 →');

    expect(filterButtonLabels(renderGrid('zh-hant'))).toEqual(['全部', '公司設立', '法律資訊', '訴訟案例']);
    expect(renderGrid('zh-hant')).toContain('查看專欄 →');

    expect(filterButtonLabels(renderGrid('ja'))).toEqual(['すべて', '台湾会社設立', '台湾法律情報', '訴訟事例分析']);
    expect(renderGrid('ja')).toContain('コラムを読む →');
  });
});
