import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { guidanceContent } from '@/data/international-guidance-content';
import { guidanceColumnCategoryLabel } from '@/lib/columns';
import { GUIDANCE_LOCALES_4, type GuidanceLocale4 } from '@/lib/public-guidance';
import { COLUMN_TOPIC_LABELS } from '@/lib/column-topics';
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
const GUIDANCE_EASTERN_SRC = path.join(process.cwd(), 'src/data/international-guidance-eastern.ts');
const GUIDANCE_BALTIC_SRC = path.join(process.cwd(), 'src/data/international-guidance-baltic-atlantic.ts');
const GUIDANCE_SOUTH_ASIA_SRC = path.join(process.cwd(), 'src/data/international-guidance-south-asia.ts');
const GUIDANCE_SOUTHEAST_CENTRAL_SRC = path.join(process.cwd(), 'src/data/international-guidance-southeast-central.ts');
const GUIDANCE_CENTRAL_EUROPE_SRC = path.join(process.cwd(), 'src/data/international-guidance-central-europe.ts');

/**
 * Filter "All" word taken from reviewed `viewAllLabel` already in
 * `international-guidance-content.ts` (grep 2026-09-16). Not invented:
 *   vi  line 140  mega.services.viewAllLabel: 'Xem tất cả'     → 'Tất cả'
 *   id  line 635  mega.services.viewAllLabel: 'Lihat semua'    → 'Semua'
 *   th  line 1130 mega.services.viewAllLabel: 'ดูทั้งหมด'       → 'ทั้งหมด'
 *   fil line 1625 mega.services.viewAllLabel: 'Tingnan ang lahat' → 'Lahat'
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
  cs: 'Vše',
  hu: 'Összes',
  ro: 'Toate',
  uk: 'Все',
  el: 'Όλα',
  he: 'הכול',
  bn: 'সব',
  ur: 'سب',
  fa: 'همه',
  my: 'အားလုံး',
  ta: 'அனைத்தும்',
  ne: 'सबै',
  km: 'ទាំងអស់',
  mn: 'Бүгд',
  sk: 'Všetky',
  bg: 'Всички',
  hr: 'Sve',
  sr: 'Sve',
  sl: 'Vse',
  lt: 'Visus',
  lv: 'Visus',
  et: 'Kõik',
  ca: 'Tot',
  is: 'Allt',
};

const VIEW_ALL_LABEL_EVIDENCE: Record<GuidanceLocale4, string> = {
  vi: "viewAllLabel: 'Xem tất cả'",
  id: "viewAllLabel: 'Lihat semua'",
  th: "viewAllLabel: 'ดูทั้งหมด'",
  fil: "viewAllLabel: 'Tingnan ang lahat'",
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
  cs: "viewAllLabel: 'Zobrazit vše'",
  hu: "viewAllLabel: 'Összes megtekintése'",
  ro: "viewAllLabel: 'Vedeți toate'",
  uk: "viewAllLabel: 'Показати все'",
  el: "viewAllLabel: 'Δείτε όλα'",
  he: "viewAllLabel: 'הצגת הכול'",
  bn: "viewAllLabel: 'সব দেখুন'",
  ur: "viewAllLabel: 'سب دیکھیں'",
  fa: "viewAllLabel: 'نمایش همه'",
  my: "viewAllLabel: 'အားလုံးကြည့်ရန်'",
  ta: "viewAllLabel: 'அனைத்தும் காண்க'",
  ne: "viewAllLabel: 'सबै हेर्नुहोस्'",
  km: "viewAllLabel: 'មើលទាំងអស់'",
  mn: "viewAllLabel: 'Бүгдийг харах'",
  sk: "viewAllLabel: 'Zobraziť všetky'",
  bg: "viewAllLabel: 'Вижте всички'",
  hr: "viewAllLabel: 'Prikaži sve'",
  sr: "viewAllLabel: 'Prikaži sve'",
  sl: "viewAllLabel: 'Pokaži vse'",
  lt: "viewAllLabel: 'Rodyti visus'",
  lv: "viewAllLabel: 'Rādīt visus'",
  et: "viewAllLabel: 'Vaadake kõiki'",
  ca: "viewAllLabel: 'Veure-ho tot'",
  is: "viewAllLabel: 'Sýna allt'",
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
    const src = `${readFileSync(GUIDANCE_CONTENT_SRC, 'utf8')}\n${readFileSync(GUIDANCE_WESTERN_SRC, 'utf8')}\n${readFileSync(GUIDANCE_ASIA_SRC, 'utf8')}\n${readFileSync(GUIDANCE_IT_NL_PL_SRC, 'utf8')}\n${readFileSync(GUIDANCE_NORDIC_SRC, 'utf8')}\n${readFileSync(GUIDANCE_EASTERN_SRC, 'utf8')}\n${readFileSync(GUIDANCE_BALTIC_SRC, 'utf8')}\n${readFileSync(GUIDANCE_SOUTH_ASIA_SRC, 'utf8')}\n${readFileSync(GUIDANCE_SOUTHEAST_CENTRAL_SRC, 'utf8')}\n${readFileSync(GUIDANCE_CENTRAL_EUROPE_SRC, 'utf8')}`;
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

  it('keeps the existing English CTA copy on en and switches the chips to topics', () => {
    const html = renderGrid('en');
    // Core locales group by topic (2026-09-29): formation→company, case→litigation, legal→other.
    expect(filterButtonLabels(html).map((label) => label.replace(/&amp;/g, '&'))).toEqual([
      'All',
      COLUMN_TOPIC_LABELS.en.company,
      COLUMN_TOPIC_LABELS.en.litigation,
      COLUMN_TOPIC_LABELS.en.other,
    ]);
    expect(html).toContain('Open column →');
    expect(html).not.toContain('Tất cả');
    expect(html).not.toContain('Đọc tiếp');
  });

  // zh-hant (2026-10-05): the card CTA keeps its words and carries the monoline arrow instead of the typed one.
  it('uses reviewed topic chips and unchanged CTA bytes on ko/ja, and the monoline arrow on zh-hant', () => {
    for (const [locale, all, cta] of [
      ['ko', '전체', '칼럼 보기 →'],
      ['zh-hant', '全部', '查看專欄<svg'],
      ['ja', 'すべて', 'コラムを読む →'],
    ] as const) {
      const html = renderGrid(locale);
      expect(filterButtonLabels(html)).toEqual([
        all,
        COLUMN_TOPIC_LABELS[locale].company,
        COLUMN_TOPIC_LABELS[locale].litigation,
        COLUMN_TOPIC_LABELS[locale].other,
      ]);
      expect(html).toContain(cta);
    }
    const zh = renderGrid('zh-hant');
    expect(zh).toContain('data-zh-icon="arrow-right"');
    expect(zh).not.toContain('查看專欄 →');
    for (const locale of ['ko', 'ja'] as const) expect(renderGrid(locale)).not.toContain('data-zh-icon');
  });
});
