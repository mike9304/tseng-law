/**
 * Traffic-accident collection for /{locale}/traffic-accidents.
 *
 * Client-safe (no `fs`), and separate from the general column topic taxonomy
 * (column-topics.ts), which stays unchanged: a traffic column keeps its
 * `topic: litigation` there and gets a narrower traffic subject here.
 *
 * Inclusion never reads titles or bodies. A post belongs to the collection when
 *   1. its tags contain a subject tag (`traffic-procedure`, `traffic-evidence`,
 *      `traffic-liability`, `traffic-compensation`) → that subject;
 *   2. otherwise, it is a column in the reviewed legacy slug map → that subject;
 *   3. otherwise, its tags contain `traffic-accidents` → `general`.
 * The same rule applies to markdown files and CMS posts, so a newly published
 * tagged post appears without editing a slug list. Authoring contract:
 * docs/columns/TRAFFIC-COLLECTION.md.
 */
import { isAiAuthoredColumn } from './ai-authored-columns';
import { isInternalColumnPost } from './builder/columns/public-post-filter';
import { getColumnPublicationDate, type ColumnPost } from './column-post';
import { normalizeColumnTags } from './column-tags';
import type { SiteLocale } from './locales';
import { TRAFFIC_PATH } from '@/data/traffic-hub';
import { TRAFFIC_DIAGRAMS, isTrafficDiagramId, type TrafficDiagram } from '@/data/traffic-diagrams';

export const TRAFFIC_SUBJECTS = ['procedure', 'evidence', 'liability', 'compensation', 'general'] as const;
export type TrafficSubject = (typeof TRAFFIC_SUBJECTS)[number];

export const TRAFFIC_COLLECTION_TAG = 'traffic-accidents';

const TRAFFIC_SUBJECT_TAGS: ReadonlyMap<string, TrafficSubject> = new Map([
  ['traffic-procedure', 'procedure'],
  ['traffic-evidence', 'evidence'],
  ['traffic-liability', 'liability'],
  ['traffic-compensation', 'compensation'],
]);

/** Columns published before traffic tags existed; subjects checked against each article body. */
export const LEGACY_TRAFFIC_SUBJECT_BY_SLUG: Readonly<Record<string, TrafficSubject>> = {
  'taiwan-traffic-accident-procedure': 'procedure',
  'taiwan-overtaking-accident-liability': 'liability',
  'taiwan-accident-police-records': 'evidence',
  'taiwan-left-turn-vs-straight-motorcycle': 'liability',
  'taiwan-lane-change-side-rear-collision-liability': 'liability',
  'taiwan-right-turn-car-straight-motorcycle-evidence': 'evidence',
  'taiwan-flashing-red-yellow-intersection-liability': 'liability',
  'taiwan-car-door-opening-motorcycle-liability': 'liability',
};
const LEGACY_SUBJECTS: ReadonlyMap<string, TrafficSubject> = new Map(Object.entries(LEGACY_TRAFFIC_SUBJECT_BY_SLUG));

export type TrafficSource = 'column' | 'issue';

export function isTrafficSubject(value: unknown): value is TrafficSubject {
  return typeof value === 'string' && (TRAFFIC_SUBJECTS as readonly string[]).includes(value);
}

/** The post's traffic subject, or null when it is not part of the collection. */
export function resolveTrafficSubject(
  post: { slug: string; tags?: unknown },
  source: TrafficSource = 'column',
): TrafficSubject | null {
  const tags = normalizeColumnTags(post.tags);
  for (const tag of tags) {
    const subject = TRAFFIC_SUBJECT_TAGS.get(tag);
    if (subject) return subject;
  }
  if (source === 'column') {
    const legacy = LEGACY_SUBJECTS.get(post.slug);
    if (legacy) return legacy;
  }
  return tags.includes(TRAFFIC_COLLECTION_TAG) ? 'general' : null;
}

/** True only for a registered diagram with playable video sources, never a still. */
export function isTrafficVideoDiagram(id: unknown): boolean {
  if (!isTrafficDiagramId(id)) return false;
  const diagram: TrafficDiagram = TRAFFIC_DIAGRAMS[id];
  return diagram.kind !== 'still' && Boolean(diagram.mp4 || diagram.webm);
}

/** List-row fields only: the board never receives article bodies. */
export type TrafficBoardItem = {
  key: string;
  source: TrafficSource;
  slug: string;
  href: string;
  title: string;
  summary: string;
  subject: TrafficSubject;
  /** ISO date, or '' when the post has no parsable publication date. */
  publicationDate: string;
  dateDisplay: string;
  readTime: string;
  /** Site path or https URL; '' when there is no real image. */
  image: string;
  aiAuthored: boolean;
  hasVideo: boolean;
  columnNumber?: number;
};

const SUMMARY_MAX_LENGTH = 240;
const PLACEHOLDER_IMAGE = '/images/blog/placeholder.jpg';

function safeImage(value: string | undefined): string {
  const src = (value ?? '').trim();
  if (!src || src === PLACEHOLDER_IMAGE) return '';
  return /^\/(?!\/)/.test(src) || /^https:\/\//i.test(src) ? src : '';
}

function briefSummary(value: string): string {
  const chars = Array.from(value.trim());
  return chars.length > SUMMARY_MAX_LENGTH ? `${chars.slice(0, SUMMARY_MAX_LENGTH).join('')}…` : chars.join('');
}

export function trafficArticleHref(locale: SiteLocale, slug: string, source: TrafficSource): string {
  const base = source === 'issue' ? 'columns/issues' : 'columns';
  return `/${locale}/${base}/${encodeURIComponent(slug)}`;
}

export function toTrafficBoardItem(post: ColumnPost, locale: SiteLocale, source: TrafficSource): TrafficBoardItem | null {
  const subject = resolveTrafficSubject(post, source);
  if (!subject) return null;
  return {
    key: `${source}:${post.slug}`,
    source,
    slug: post.slug,
    href: trafficArticleHref(locale, post.slug, source),
    title: post.title,
    summary: briefSummary(post.summary ?? ''),
    subject,
    publicationDate: getColumnPublicationDate(post),
    dateDisplay: post.dateDisplay,
    readTime: post.readTime,
    image: safeImage(post.featuredImage),
    aiAuthored: isAiAuthoredColumn(post),
    hasVideo: isTrafficVideoDiagram(post.diagramVideo?.id),
    ...(post.columnNumber !== undefined ? { columnNumber: post.columnNumber } : {}),
  };
}

/** Newest publication date first; same day → higher column number; then columns before issues, then slug. */
export function compareTrafficBoardItems(a: TrafficBoardItem, b: TrafficBoardItem): number {
  return b.publicationDate.localeCompare(a.publicationDate)
    || (b.columnNumber ?? -1) - (a.columnNumber ?? -1)
    || (a.source === b.source ? 0 : a.source === 'column' ? -1 : 1)
    || a.slug.localeCompare(b.slug, 'en');
}

/**
 * Public traffic posts for one locale: internal test records dropped, the first
 * copy of a slug kept (columns before issues; the CMS-aware reader already puts
 * the CMS copy first), stable newest-first order.
 */
export function buildTrafficCollection(
  locale: SiteLocale,
  posts: { columns: readonly ColumnPost[]; issues: readonly ColumnPost[] },
): TrafficBoardItem[] {
  const seen = new Set<string>();
  const items: TrafficBoardItem[] = [];
  const candidates = [
    ...posts.columns.map((post) => [post, 'column'] as const),
    ...posts.issues.map((post) => [post, 'issue'] as const),
  ];
  for (const [post, source] of candidates) {
    if (!post?.slug || seen.has(post.slug) || isInternalColumnPost(post)) continue;
    const item = toTrafficBoardItem(post, locale, source);
    if (!item) continue;
    seen.add(post.slug);
    items.push(item);
  }
  return items.sort(compareTrafficBoardItems);
}

/* ------------------------------------------------------------------------ *
 * Board state (search / subject / video) lives in the URL query.
 * ------------------------------------------------------------------------ */

export type TrafficBoardQuery = { q: string; subject: TrafficSubject | null; video: boolean };
export type TrafficSearchParams = Record<string, string | string[] | undefined> | null | undefined;

export const TRAFFIC_QUERY_MAX_LENGTH = 80;
const TRAFFIC_QUERY_MAX_TERMS = 8;

function firstParam(value: string | string[] | undefined): string {
  const first = Array.isArray(value) ? value[0] : value;
  return typeof first === 'string' ? first : '';
}

function normalizeSearchText(value: string): string {
  const text = value.normalize('NFKC').replace(/\p{Cc}+/gu, ' ').replace(/\s+/g, ' ').trim();
  return Array.from(text).slice(0, TRAFFIC_QUERY_MAX_LENGTH).join('').trim();
}

/** Unknown keys and values are ignored; nothing here throws. */
export function parseTrafficBoardQuery(params: TrafficSearchParams): TrafficBoardQuery {
  const get = (key: string) => (params && Object.prototype.hasOwnProperty.call(params, key) ? firstParam(params[key]) : '');
  const subject = get('subject').trim().toLowerCase();
  return {
    q: normalizeSearchText(get('q')),
    subject: isTrafficSubject(subject) ? subject : null,
    video: get('video').trim() === '1',
  };
}

function matchesSearch(item: TrafficBoardItem, q: string): boolean {
  if (!q) return true;
  const haystack = `${item.title}\n${item.summary}`.normalize('NFKC').toLowerCase();
  return q.toLowerCase().split(' ').filter(Boolean).slice(0, TRAFFIC_QUERY_MAX_TERMS)
    .every((term) => haystack.includes(term));
}

export function filterTrafficBoardItems(items: readonly TrafficBoardItem[], query: TrafficBoardQuery): TrafficBoardItem[] {
  return items.filter((item) => (!query.subject || item.subject === query.subject)
    && (!query.video || item.hasVideo)
    && matchesSearch(item, query.q));
}

/** Per-subject counts under the current search and video filters (the subject filter itself ignored). */
export function countTrafficSubjects(items: readonly TrafficBoardItem[], query: TrafficBoardQuery): Map<TrafficSubject, number> {
  const counts = new Map<TrafficSubject, number>();
  for (const item of filterTrafficBoardItems(items, { ...query, subject: null })) {
    counts.set(item.subject, (counts.get(item.subject) ?? 0) + 1);
  }
  return counts;
}

/** Subjects that have at least one article in the locale, in TRAFFIC_SUBJECTS order. */
export function populatedTrafficSubjects(items: readonly TrafficBoardItem[]): TrafficSubject[] {
  const present = new Set(items.map((item) => item.subject));
  return TRAFFIC_SUBJECTS.filter((subject) => present.has(subject));
}

/** Hub URL for a board state. Always the hub path itself, so it never becomes a canonical. */
export function buildTrafficBoardHref(locale: SiteLocale, query: Partial<TrafficBoardQuery>): string {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.subject) params.set('subject', query.subject);
  if (query.video) params.set('video', '1');
  const search = params.toString();
  return `/${locale}${TRAFFIC_PATH}${search ? `?${search}` : ''}#articles`;
}

/* ------------------------------------------------------------------------ *
 * Board copy
 * ------------------------------------------------------------------------ */

export const TRAFFIC_SUBJECT_LABELS: Record<SiteLocale, Record<TrafficSubject, string>> = {
  ko: { procedure: '사고 처리 절차', evidence: '증거와 경찰 자료', liability: '과실과 책임', compensation: '손해배상과 합의', general: '교통사고 일반' },
  'zh-hant': { procedure: '事故處理程序', evidence: '證據與警方資料', liability: '過失與責任', compensation: '賠償與和解', general: '車禍綜合' },
  en: { procedure: 'Procedure', evidence: 'Evidence and police records', liability: 'Fault and liability', compensation: 'Compensation and settlement', general: 'General' },
  ja: { procedure: '事故後の手続き', evidence: '証拠と警察資料', liability: '過失と責任', compensation: '損害賠償と示談', general: '交通事故全般' },
};

export type TrafficBoardCopy = {
  searchLabel: string;
  searchPlaceholder: string;
  submit: string;
  filtersLabel: string;
  subjectLegend: string;
  all: string;
  videoOnly: string;
  video: string;
  /** Same author wording as the article's AI author box (ai-authored-columns.ts). */
  aiAuthor: string;
  clear: string;
  empty: string;
  resultCount: (shown: number, total: number, filtered: boolean) => string;
};

export const TRAFFIC_BOARD_COPY: Record<SiteLocale, TrafficBoardCopy> = {
  ko: {
    searchLabel: '칼럼 검색',
    searchPlaceholder: '예: 오토바이, 경찰 자료',
    submit: '검색',
    filtersLabel: '칼럼 필터',
    subjectLegend: '주제',
    all: '전체',
    videoOnly: '영상 도해가 있는 글',
    video: '영상 도해',
    aiAuthor: '법률 AI 어시스턴트 작성',
    clear: '필터 모두 해제',
    empty: '조건에 맞는 칼럼이 없습니다.',
    resultCount: (shown, total, filtered) => (filtered ? `${total}편 중 ${shown}편` : `${total}편`),
  },
  'zh-hant': {
    searchLabel: '搜尋專欄',
    searchPlaceholder: '例如：機車、警方資料',
    submit: '搜尋',
    filtersLabel: '專欄篩選',
    subjectLegend: '主題',
    all: '全部',
    videoOnly: '附影片示意',
    video: '影片示意',
    aiAuthor: '法律AI助理撰文',
    clear: '清除全部條件',
    empty: '沒有符合條件的專欄。',
    resultCount: (shown, total, filtered) => (filtered ? `${total} 篇中符合 ${shown} 篇` : `共 ${total} 篇`),
  },
  en: {
    searchLabel: 'Search articles',
    searchPlaceholder: 'e.g. scooter, police records',
    submit: 'Search',
    filtersLabel: 'Article filters',
    subjectLegend: 'Subject',
    all: 'All',
    videoOnly: 'With video diagram',
    video: 'Video diagram',
    aiAuthor: 'Written by Legal AI Assistant',
    clear: 'Clear all filters',
    empty: 'No articles match these filters.',
    resultCount: (shown, total, filtered) => (filtered
      ? `${shown} of ${total} articles`
      : `${total} article${total === 1 ? '' : 's'}`),
  },
  ja: {
    searchLabel: 'コラムを検索',
    searchPlaceholder: '例：バイク、警察資料',
    submit: '検索',
    filtersLabel: 'コラムの絞り込み',
    subjectLegend: 'テーマ',
    all: 'すべて',
    videoOnly: '動画図解つき',
    video: '動画図解',
    aiAuthor: '法律AIアシスタント執筆',
    clear: '条件をすべて解除',
    empty: '条件に合うコラムはありません。',
    resultCount: (shown, total, filtered) => (filtered ? `${total}件中 ${shown}件` : `${total}件`),
  },
};
