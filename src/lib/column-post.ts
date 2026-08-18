import type { Locale, SiteLocale } from './locales';

export type ColumnCategory = 'formation' | 'legal' | 'case';

export interface ColumnFaqItem {
  q: string;
  a: string;
}

export interface ColumnPost {
  slug: string;
  title: string;
  /** Original publication date (ISO date or timestamp), distinct from `date`/last modified. */
  publicationDate?: string;
  date: string;
  dateDisplay: string;
  readTime: string;
  category: ColumnCategory;
  categoryLabel: string;
  blogCategory?: string;
  authorName?: string;
  tags?: string[];
  featuredImage: string;
  content: string;
  summary: string;
  faq?: ColumnFaqItem[];
  /** Allowlisted body typography preset id (e.g. ko-body-readable). */
  typographyPresetId?: string;
  typography?: {
    presetId: string;
    bodySize?: 'sm' | 'md' | 'lg';
    headingWeight?: '500' | '600' | '700';
    lineHeight?: 'tight' | 'normal' | 'relaxed';
  };
}

const ENGLISH_MONTHS = new Map([
  ['january', 1],
  ['february', 2],
  ['march', 3],
  ['april', 4],
  ['may', 5],
  ['june', 6],
  ['july', 7],
  ['august', 8],
  ['september', 9],
  ['october', 10],
  ['november', 11],
  ['december', 12],
]);

function toIsoDate(year: string, month: string | number, day: string): string {
  const numericMonth = Number(month);
  const numericDay = Number(day);
  const timestamp = Date.UTC(Number(year), numericMonth - 1, numericDay);
  const parsed = new Date(timestamp);
  if (
    parsed.getUTCFullYear() !== Number(year)
    || parsed.getUTCMonth() !== numericMonth - 1
    || parsed.getUTCDate() !== numericDay
  ) {
    return '';
  }
  return `${year}-${String(numericMonth).padStart(2, '0')}-${String(numericDay).padStart(2, '0')}`;
}

/**
 * Read an original publication date without confusing it with lastmod/updatedAt.
 * Supports the localized archive labels retained from the source Wix articles.
 */
export function parseColumnPublicationDate(value: string | null | undefined): string {
  const normalized = value?.trim() ?? '';
  if (!normalized) return '';

  const isoMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);
  if (isoMatch) return toIsoDate(isoMatch[1], isoMatch[2], isoMatch[3]);

  const cjkMatch = normalized.match(/^(\d{4})\s*[년年]\s*(\d{1,2})\s*[월月]\s*(\d{1,2})\s*[일日]$/);
  if (cjkMatch) return toIsoDate(cjkMatch[1], cjkMatch[2], cjkMatch[3]);

  const englishMatch = normalized.match(/^([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?\s*,?\s*(\d{4})$/i);
  if (!englishMatch) return '';
  const month = ENGLISH_MONTHS.get(englishMatch[1].toLowerCase());
  return month ? toIsoDate(englishMatch[3], month, englishMatch[2]) : '';
}

export function formatColumnPublicationDate(
  publicationDate: string,
  locale: Locale | SiteLocale,
  fallback = '',
): string {
  const isoDate = parseColumnPublicationDate(publicationDate);
  if (!isoDate) return fallback;
  const [year, month, day] = isoDate.split('-').map(Number);
  if (locale === 'ko') return `${year}년 ${month}월 ${day}일`;
  if (locale === 'zh-hant' || locale === 'ja') return `${year}年${month}月${day}日`;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function getColumnPublicationDate(post: Pick<ColumnPost, 'publicationDate' | 'dateDisplay'>): string {
  return parseColumnPublicationDate(post.publicationDate)
    || parseColumnPublicationDate(post.dateDisplay);
}

export function sortColumnPostsNewestFirst(
  posts: readonly ColumnPost[],
  sourceOrderBySlug?: ReadonlyMap<string, number>,
): ColumnPost[] {
  return posts
    .map((post, sourceIndex) => ({
      post,
      publicationDate: getColumnPublicationDate(post),
      sourceIndex,
    }))
    .sort((a, b) => (
      b.publicationDate.localeCompare(a.publicationDate)
      || (sourceOrderBySlug?.get(a.post.slug) ?? a.sourceIndex)
        - (sourceOrderBySlug?.get(b.post.slug) ?? b.sourceIndex)
      || a.sourceIndex - b.sourceIndex
    ))
    .map(({ post }) => post);
}
