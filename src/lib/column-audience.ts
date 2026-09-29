/**
 * Per-locale column recommendations from frontmatter (client-safe, no `fs`).
 *
 * Frontmatter field `audience` (see docs/columns/FRONTMATTER.md) lists who a
 * column file was written for:
 *   - a site locale code: ko, en, ja, zh-hant, zh-hans, vi, id, th, fil, …
 *     (country codes are accepted as aliases: KR, US, GB, JP, TW, CN, VN, ID,
 *     TH, PH)
 *   - `global`: written for readers of every locale (shared column)
 *
 * Each locale shows, in order:
 *   1. its own-audience columns (audience contains the locale), newest first
 *   2. shared columns (audience contains `global`), newest first
 *   3. everything else, in the caller's usual order (topic mix / grouping)
 * Only the locale's own files are passed in, so nothing falls back to another
 * language. New columns appear automatically once they carry the field.
 */

export const COLUMN_AUDIENCE_GLOBAL = 'global';

const AUDIENCE_ALIASES: Record<string, string> = {
  kr: 'ko',
  kor: 'ko',
  korea: 'ko',
  us: 'en',
  usa: 'en',
  gb: 'en',
  uk: 'en',
  english: 'en',
  jp: 'ja',
  japan: 'ja',
  tw: 'zh-hant',
  taiwan: 'zh-hant',
  'zh-tw': 'zh-hant',
  cn: 'zh-hans',
  'zh-cn': 'zh-hans',
  vn: 'vi',
  vietnam: 'vi',
  indonesia: 'id',
  thailand: 'th',
  ph: 'fil',
  philippines: 'fil',
  tl: 'fil',
  all: COLUMN_AUDIENCE_GLOBAL,
  shared: COLUMN_AUDIENCE_GLOBAL,
  international: COLUMN_AUDIENCE_GLOBAL,
};

/** Normalize a frontmatter `audience` value (string or list) to lowercase locale codes / `global`. */
export function normalizeColumnAudience(raw: unknown): string[] {
  const values = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split(/[,\s]+/) : [];
  const out: string[] = [];
  for (const value of values) {
    if (typeof value !== 'string') continue;
    const key = value.trim().toLowerCase();
    if (!key) continue;
    const normalized = AUDIENCE_ALIASES[key] ?? key;
    if (/^[a-z]{2,3}(-[a-z]{2,4})?$/.test(normalized) || normalized === COLUMN_AUDIENCE_GLOBAL) {
      if (!out.includes(normalized)) out.push(normalized);
    }
  }
  return out;
}

type AudiencePost = {
  slug: string;
  audience?: readonly string[];
  publicationDate?: string;
  date?: string;
  columnNumber?: number;
};

function sortKey(post: AudiencePost): string {
  return post.publicationDate || post.date || '';
}

/** Newest first; same-day ties put the later file (higher column number) first. */
function newestFirst<T extends AudiencePost>(posts: readonly T[]): T[] {
  return posts
    .map((post, index) => ({ post, index }))
    .sort((a, b) => (
      sortKey(b.post).localeCompare(sortKey(a.post))
      || (b.post.columnNumber ?? -1) - (a.post.columnNumber ?? -1)
      || b.index - a.index
    ))
    .map(({ post }) => post);
}

/** 0 = written for this locale, 1 = shared (`global`), 2 = other. */
export function columnAudienceRank(locale: string, audience: readonly string[] | undefined): 0 | 1 | 2 {
  if (!audience || audience.length === 0) return 2;
  if (audience.includes(locale)) return 0;
  if (audience.includes(COLUMN_AUDIENCE_GLOBAL)) return 1;
  return 2;
}

export function isRecommendedColumn(locale: string, post: AudiencePost): boolean {
  return columnAudienceRank(locale, post.audience) < 2;
}

/**
 * Recommended = own-audience newest first, then shared newest first.
 * Rest keeps the incoming order.
 */
export function splitRecommendedColumns<T extends AudiencePost>(
  locale: string,
  posts: readonly T[],
): { recommended: T[]; rest: T[] } {
  const own: T[] = [];
  const shared: T[] = [];
  const rest: T[] = [];
  for (const post of posts) {
    const rank = columnAudienceRank(locale, post.audience);
    (rank === 0 ? own : rank === 1 ? shared : rest).push(post);
  }
  return { recommended: [...newestFirst(own), ...newestFirst(shared)], rest };
}

/** Recommended first, then the rest in their original order. */
export function prioritizeRecommendedColumns<T extends AudiencePost>(locale: string, posts: readonly T[]): T[] {
  const { recommended, rest } = splitRecommendedColumns(locale, posts);
  return [...recommended, ...rest];
}

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
