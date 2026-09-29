/**
 * Columns recommended to each locale's readers, in display order. They lead
 * the home archive and the columns index for that locale; everything else
 * keeps the usual newest-first + topic grouping/mix behind them. Only slugs
 * that exist in the locale's own files are ever shown (callers filter the
 * locale's post list, so nothing falls back to another language).
 *
 * - Native columns written for one audience: 032–034 English-speaking
 *   foreigners, 035–037 Japanese companies/readers, 038–040 Vietnamese readers.
 * - 024–031: overseas-reader set (tax, visas, inheritance, cross-border
 *   litigation, hiring a lawyer) in ko / en / ja / zh-hant.
 * - 019–023: family columns written natively per locale (2026-09-27).
 */
const NATIVE_BY_LOCALE: Record<string, readonly string[]> = {
  en: [
    'taiwan-exit-ban-foreigners',
    'foreign-professional-dismissed-taiwan',
    'taiwan-police-questioning-foreigner-rights',
  ],
  ja: [
    'taiwan-unpaid-invoice-debt-collection',
    'taiwan-subsidiary-responsible-person-liability',
    'taiwan-subsidiary-employee-dismissal',
  ],
  vi: [
    'taiwan-bank-account-lending-fraud-money-laundering',
    'taiwan-migrant-worker-occupational-injury-compensation',
    'vietnamese-spouse-taiwan-residence-after-divorce-domestic-violence',
  ],
};

const OVERSEAS_SET = [
  'taiwan-employment-gold-card',
  'taiwan-income-tax-residency',
  'hire-taiwan-lawyer-from-abroad',
  'taiwan-foreign-spouse-residence',
  'taiwan-permanent-residence-aprc',
  'enforce-foreign-judgment-in-taiwan',
  'taiwan-estate-tax-foreign-decedent',
  'foreign-heir-taiwan-succession-law-land',
] as const;

const FAMILY_SET = [
  'taiwanese-spouse-divorce-agreement-registration',
  'taiwanese-spouse-divorce-from-abroad',
  'taiwanese-spouse-divorce-cross-border-parenting',
  'marrying-taiwanese-national-registration-checklist',
  'baby-taiwan-nationality-birth-registration',
] as const;

/** Recommended slugs for a locale, most relevant first. */
export function getRecommendedColumnSlugs(locale: string): readonly string[] {
  return [...(NATIVE_BY_LOCALE[locale] ?? []), ...OVERSEAS_SET, ...FAMILY_SET];
}

/** English list (kept for callers/tests that name it directly). */
export const EN_RECOMMENDED_COLUMN_SLUGS = getRecommendedColumnSlugs('en');

const rankCache = new Map<string, Map<string, number>>();
function rankFor(locale: string): Map<string, number> {
  let rank = rankCache.get(locale);
  if (!rank) {
    rank = new Map(getRecommendedColumnSlugs(locale).map((slug, index) => [slug, index]));
    rankCache.set(locale, rank);
  }
  return rank;
}

export function isRecommendedColumn(locale: string, slug: string): boolean {
  return rankFor(locale).has(slug);
}

/**
 * Split posts into the recommended ones (in recommended order) and the rest
 * (original order kept).
 */
export function splitRecommendedColumns<T extends { slug: string }>(
  locale: string,
  posts: readonly T[],
): { recommended: T[]; rest: T[] } {
  const rank = rankFor(locale);
  const recommended = posts
    .filter((post) => rank.has(post.slug))
    .sort((a, b) => rank.get(a.slug)! - rank.get(b.slug)!);
  const rest = posts.filter((post) => !rank.has(post.slug));
  return { recommended, rest };
}

/** Recommended first, then the rest in their original order. */
export function prioritizeRecommendedColumns<T extends { slug: string }>(locale: string, posts: readonly T[]): T[] {
  const { recommended, rest } = splitRecommendedColumns(locale, posts);
  return [...recommended, ...rest];
}

// Back-compat names from the English-only first version.
export const splitEnRecommendedColumns = splitRecommendedColumns;
export const prioritizeEnRecommendedColumns = prioritizeRecommendedColumns;
export const isEnRecommendedColumn = (slug: string) => isRecommendedColumn('en', slug);

/** Heading for the recommended section on the columns index. */
export const RECOMMENDED_SECTION_TITLE: Record<string, string> = {
  en: 'Recommended for English-speaking readers',
  ko: '한국 독자를 위한 추천 칼럼',
  ja: '日本の読者におすすめのコラム',
  'zh-hant': '推薦專欄',
  'zh-hans': '推荐专栏',
  vi: 'Bài viết đề xuất cho bạn đọc Việt Nam',
  id: 'Artikel pilihan untuk pembaca Indonesia',
  th: 'บทความแนะนำสำหรับผู้อ่านชาวไทย',
  fil: 'Mga inirerekomendang artikulo para sa mga Pilipino',
};
