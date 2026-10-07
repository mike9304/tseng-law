import type { ColumnTopic } from '@/lib/column-topics';

/**
 * Japanese-reader arrangement (Opus 5.5 ja lane, 2026-10-01). Order only — no copy.
 *
 * Basis (sources in ~/tseng-zh-hant-pass2-20261001/locale-ja/REPORT.md):
 * - Companies: labour issues lead the 台北市日本工商会 2025 白書 requests and the 交流協会
 *   貿易投資相談Q&A (15 labour questions); JETRO 2025 survey: 人件費の高騰 57.9%, 採用難 61.1%.
 *   Entry/exit (投資審議司 approval, 撤退) is the usual first engagement; contract disputes and
 *   collection follow (Japanese judgments need Taiwan recognition).
 * - Individuals: criminal matters are flagged by every firm on the 交流協会 lawyer list; traffic
 *   accidents (MOFA: 393,883 accidents in 2024, 6-month complaint deadline); then international
 *   divorce/custody and cross-border inheritance.
 */

/** Practice areas, by Japanese demand: entry & corporate, labour, disputes, criminal, family, IP. */
export const JA_SERVICE_ORDER = ['investment', 'labor', 'civil', 'criminal', 'family', 'ip'] as const;

/** Column topics on /ja/columns: business topics first, then individual topics, then the rest. */
export const JA_COLUMN_TOPIC_ORDER: readonly ColumnTopic[] = [
  'company',
  'labor',
  'criminal',
  'litigation',
  'family',
  'inheritance',
  'visa',
  'tax',
  'lawyer',
  'other',
];

/**
 * Cornerstone columns that answer the top Japanese needs, led on the ja home archive and the
 * ja columns index (the rest stay newest-first). One per need:
 * labour dismissal, company setup basics, unpaid invoices, traffic accident Q&A,
 * divorce with a Taiwanese spouse, inheriting Taiwan real estate.
 */
export const JA_PINNED_COLUMN_SLUGS = [
  'taiwan-subsidiary-employee-dismissal',
  'taiwan-company-establishment-basics',
  'taiwan-unpaid-invoice-debt-collection',
  'taiwan-traffic-accident-procedure',
  'taiwanese-spouse-divorce-agreement-registration',
  'foreign-heir-taiwan-succession-law-land',
] as const;

/** Pinned slugs first (in pinned order, only those present), then the rest in their incoming order. */
export function pinJaColumns<T extends { slug: string }>(posts: readonly T[], pinned: readonly string[] = JA_PINNED_COLUMN_SLUGS): T[] {
  const bySlug = new Map(posts.map((post) => [post.slug, post] as const));
  const head = pinned.map((slug) => bySlug.get(slug)).filter((post): post is T => Boolean(post));
  const headSlugs = new Set(head.map((post) => post.slug));
  return [...head, ...posts.filter((post) => !headSlugs.has(post.slug))];
}
