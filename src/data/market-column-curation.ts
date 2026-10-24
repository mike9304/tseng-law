import { columnAudienceRank } from '@/lib/column-audience';

/**
 * Market column boards (2026-10-24 operator direction): the th, id, hi, fr, de, it, es, pt and ar boards list only
 * columns that fit that market's readers — the columns written for it (`audience`) and the shared translated columns
 * picked below. A shared column left out keeps its URL and sitemap entry; it is only dropped from the board, its
 * search, the article's previous/next links and recommendations, and the locale home.
 *
 * The world-columns batch of the same day gave the remaining 35 guidance locales their own columns (801–905), so their
 * boards follow the same rule: their own columns plus the shared translations that do not assume a Korean reader, and
 * no list of untranslated Korean titles.
 */
const NINE_MARKET_BOARD_LOCALES = ['th', 'id', 'hi', 'fr', 'de', 'it', 'es', 'pt', 'ar'] as const;
export const WORLD_BOARD_LOCALES = [
  'fil', 'zh-hans', 'ms', 'my', 'km', 'mn', 'ne', 'bn', 'ur', 'fa', 'ta',
  'nl', 'sv', 'da', 'nb', 'fi', 'is', 'ca', 'el', 'he', 'tr', 'ru', 'uk',
  'pl', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sr', 'sl', 'lt', 'lv', 'et',
] as const;
export const MARKET_BOARD_LOCALES = [...NINE_MARKET_BOARD_LOCALES, ...WORLD_BOARD_LOCALES] as const;
export type MarketBoardLocale = (typeof MARKET_BOARD_LOCALES)[number];

export function isMarketBoardLocale(locale: string): locale is MarketBoardLocale {
  return (MARKET_BOARD_LOCALES as readonly string[]).includes(locale);
}

/**
 * The 18 shared translations (001–018) every market locale carries, reviewed 2026-10-24. Off every board: 001, 004
 * and 005 (built on the Taiwan–Korea tax treaty and Korean banking rules), 006 (massage regulation read against
 * Korea) and 010 (a Korean student's gym case).
 */
export const MARKET_BOARD_REVIEWED_SHARED_SLUGS: readonly string[] = [
  'taiwan-company-establishment-basics',
  'withdraw-capital-taiwan-company',
  'taiwan-traffic-accident-procedure',
  'taiwan-company-subsidiary-vs-branch',
  'taiwan-company-establishment-advanced-2',
  'taiwan-massage-history-law',
  'taiwan-divorce-lawsuit-qna',
  'taiwan-labor-severance-law',
  'taiwan-voluntary-resignation-severance',
  'taiwan-gym-injury-lawsuit',
  'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
  'taiwan-overtaking-accident-liability',
  'taiwan-company-establishment-advanced-1',
  'taiwan-mandatory-employment-period',
  'taiwan-company-setup-pitch-location',
  'taiwan-inheritance-custody-analysis',
  'taiwan-logistics-business-setup',
  'taiwan-semiconductor-market-entry',
];

// Shared columns grouped by the readers each market's own columns address.
const MARKET_ENTRY = [
  'withdraw-capital-taiwan-company',
  'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
  'taiwan-logistics-business-setup',
  'taiwan-semiconductor-market-entry',
] as const;
// Founders who set up and run a small company in Taiwan themselves (work visa, shop lease, a Taipei restaurant).
const SMALL_FOUNDER = [
  'taiwan-company-establishment-advanced-1',
  'taiwan-company-setup-pitch-location',
] as const;
const WORK = [
  'taiwan-labor-severance-law',
  'taiwan-voluntary-resignation-severance',
  'taiwan-mandatory-employment-period',
] as const;
const TRAFFIC = ['taiwan-traffic-accident-procedure', 'taiwan-overtaking-accident-liability'] as const;
const INHERITANCE = ['taiwan-inheritance-custody-analysis'] as const;
const LIFE = [...TRAFFIC, 'taiwan-divorce-lawsuit-qna', ...INHERITANCE] as const;

/**
 * Shared columns listed on each market board, besides the columns written for that market. A shared column that one
 * of the market's own columns links to is listed too, unless it is off every board.
 */
// World-batch boards keep every shared translation except the five built on Korean premises.
const OFF_EVERY_BOARD: readonly string[] = [
  'taiwan-company-establishment-basics',
  'taiwan-company-subsidiary-vs-branch',
  'taiwan-company-establishment-advanced-2',
  'taiwan-massage-history-law',
  'taiwan-gym-injury-lawsuit',
];
const WORLD_SHARED = MARKET_BOARD_REVIEWED_SHARED_SLUGS.filter((slug) => !OFF_EVERY_BOARD.includes(slug));

function worldBoardSharedSlugs(): Record<(typeof WORLD_BOARD_LOCALES)[number], readonly string[]> {
  const picks = {} as Record<(typeof WORLD_BOARD_LOCALES)[number], readonly string[]>;
  for (const locale of WORLD_BOARD_LOCALES) picks[locale] = WORLD_SHARED;
  return picks;
}

export const MARKET_BOARD_SHARED_COLUMN_SLUGS: Record<MarketBoardLocale, readonly string[]> = {
  ...worldBoardSharedSlugs(),
  // Workers and caregivers in Taiwan.
  th: [...WORK, ...LIFE],
  // Workers and caregivers; 668 (machinery defects) points buyers to the semiconductor-entry column.
  id: [...WORK, ...LIFE, 'taiwan-semiconductor-market-entry'],
  // Exporters and suppliers, engineers and other employees living in Taiwan; 672 (rental deposit) points to the lease column.
  hi: [...MARKET_ENTRY, ...WORK, 'taiwan-company-setup-pitch-location'],
  // Companies and founders (working holiday, takeovers), plus inheritance and closure-wage questions.
  fr: [...MARKET_ENTRY, ...SMALL_FOUNDER, ...WORK, ...INHERITANCE],
  // Manufacturers and suppliers.
  de: [...MARKET_ENTRY],
  // Companies, plus inheritance; 688 (a business visitor's police summons) points to the traffic-accident column.
  it: [...MARKET_ENTRY, ...INHERITANCE, ...TRAFFIC],
  // Companies and one-shareholder founders, workers and families.
  es: [...MARKET_ENTRY, ...SMALL_FOUNDER, ...WORK, ...LIFE],
  // Companies and former employees.
  pt: [...MARKET_ENTRY, ...WORK],
  // Companies in the UAE and Saudi Arabia, inheritance, and ARC 706's employment-ending reference.
  ar: [...MARKET_ENTRY, ...INHERITANCE, 'taiwan-voluntary-resignation-severance'],
};

/** True when the column belongs on this market board: written for it, shared with every locale, or picked above. */
export function isMarketBoardColumn(
  locale: MarketBoardLocale,
  post: { slug: string; audience?: readonly string[] },
): boolean {
  return columnAudienceRank(locale, post.audience) < 2 || MARKET_BOARD_SHARED_COLUMN_SLUGS[locale].includes(post.slug);
}

/** Market locales: the columns their board lists. Other locales: unchanged. */
export function filterMarketBoardColumns<T extends { slug: string; audience?: readonly string[] }>(
  locale: string,
  posts: readonly T[],
): T[] {
  return isMarketBoardLocale(locale) ? posts.filter((post) => isMarketBoardColumn(locale, post)) : [...posts];
}
