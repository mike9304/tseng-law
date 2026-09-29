/**
 * Columns recommended to English-speaking readers, in display order.
 * They lead the English home archive and the /en/columns index; everything
 * else keeps the usual newest-first + topic grouping/mix behind them.
 *
 * 032–034 were written from scratch for English-speaking foreigners in
 * Taiwan; 024–031 are the English editions of the 2026-09-29 overseas-reader
 * set (tax, visas, inheritance, cross-border litigation, hiring a lawyer).
 */
export const EN_RECOMMENDED_COLUMN_SLUGS = [
  'taiwan-exit-ban-foreigners',
  'foreign-professional-dismissed-taiwan',
  'taiwan-police-questioning-foreigner-rights',
  'taiwan-employment-gold-card',
  'taiwan-income-tax-residency',
  'hire-taiwan-lawyer-from-abroad',
  'taiwan-foreign-spouse-residence',
  'taiwan-permanent-residence-aprc',
  'enforce-foreign-judgment-in-taiwan',
  'taiwan-estate-tax-foreign-decedent',
  'foreign-heir-taiwan-succession-law-land',
] as const;

const RANK = new Map<string, number>(EN_RECOMMENDED_COLUMN_SLUGS.map((slug, index) => [slug, index]));

export function isEnRecommendedColumn(slug: string): boolean {
  return RANK.has(slug);
}

/**
 * Split posts into the recommended ones (in EN_RECOMMENDED_COLUMN_SLUGS order)
 * and the rest (original order kept). Only applies to the English locale.
 */
export function splitEnRecommendedColumns<T extends { slug: string }>(
  locale: string,
  posts: readonly T[],
): { recommended: T[]; rest: T[] } {
  if (locale !== 'en') return { recommended: [], rest: [...posts] };
  const recommended = posts
    .filter((post) => RANK.has(post.slug))
    .sort((a, b) => RANK.get(a.slug)! - RANK.get(b.slug)!);
  const rest = posts.filter((post) => !RANK.has(post.slug));
  return { recommended, rest };
}

/** Recommended first (English only), then the rest in their original order. */
export function prioritizeEnRecommendedColumns<T extends { slug: string }>(locale: string, posts: readonly T[]): T[] {
  const { recommended, rest } = splitEnRecommendedColumns(locale, posts);
  return [...recommended, ...rest];
}
