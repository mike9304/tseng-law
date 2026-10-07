/**
 * Column topic taxonomy for the public column index (/{locale}/columns).
 *
 * Client-safe (no `fs`): imported by `ColumnsGrid` and by the file loader.
 * A column declares its topic with frontmatter `topic: <id>`; the legacy map
 * below covers columns published before the field existed. The same slug is
 * used in every locale, so one map serves ko / zh-hant / en / ja and the
 * translated guidance locales alike.
 */

import columnUiVi from '@/data/column-ui-vi.json';

export const COLUMN_TOPICS = [
  'criminal',
  'company',
  'tax',
  'visa',
  'family',
  'inheritance',
  'litigation',
  'labor',
  'lawyer',
  'other',
] as const;

export type ColumnTopic = (typeof COLUMN_TOPICS)[number];

export function isColumnTopic(value: unknown): value is ColumnTopic {
  return typeof value === 'string' && (COLUMN_TOPICS as readonly string[]).includes(value);
}

/** Topics of the columns that predate the `topic` frontmatter field. */
export const LEGACY_COLUMN_TOPIC_BY_SLUG: Readonly<Record<string, ColumnTopic>> = {
  'taiwan-company-establishment-basics': 'company',
  'withdraw-capital-taiwan-company': 'company',
  'taiwan-company-subsidiary-vs-branch': 'company',
  'taiwan-company-establishment-advanced-1': 'company',
  'taiwan-company-establishment-advanced-2': 'company',
  'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide': 'company',
  'taiwan-company-setup-pitch-location': 'company',
  'taiwan-logistics-business-setup': 'company',
  'taiwan-semiconductor-market-entry': 'company',
  'taiwan-traffic-accident-procedure': 'litigation',
  'taiwan-overtaking-accident-liability': 'litigation',
  'taiwan-gym-injury-lawsuit': 'litigation',
  'taiwan-labor-severance-law': 'labor',
  'taiwan-voluntary-resignation-severance': 'labor',
  'taiwan-mandatory-employment-period': 'labor',
  'taiwan-divorce-lawsuit-qna': 'family',
  'taiwanese-spouse-divorce-agreement-registration': 'family',
  'taiwanese-spouse-divorce-from-abroad': 'family',
  'taiwanese-spouse-divorce-cross-border-parenting': 'family',
  'marrying-taiwanese-national-registration-checklist': 'family',
  'baby-taiwan-nationality-birth-registration': 'family',
  'taiwan-inheritance-custody-analysis': 'inheritance',
  'taiwan-massage-history-law': 'other',
};

export function resolveColumnTopic(
  slug: string,
  frontmatterTopic?: unknown,
  category?: 'formation' | 'legal' | 'case',
): ColumnTopic {
  if (isColumnTopic(frontmatterTopic)) return frontmatterTopic;
  const legacy = LEGACY_COLUMN_TOPIC_BY_SLUG[slug];
  if (legacy) return legacy;
  if (category === 'formation') return 'company';
  if (category === 'case') return 'litigation';
  return 'other';
}

export type ColumnTopicUiLocale = 'ko' | 'zh-hant' | 'en' | 'ja' | 'vi';

export function isColumnTopicUiLocale(locale: string): locale is ColumnTopicUiLocale {
  return ['ko', 'zh-hant', 'en', 'ja', 'vi'].includes(locale);
}

export const COLUMN_TOPIC_LABELS: Record<ColumnTopicUiLocale, Record<ColumnTopic, string>> = {
  vi: columnUiVi.topics,
  ko: {
    criminal: '형사소송',
    company: '법인설립·투자',
    tax: '세무',
    visa: '비자·체류',
    family: '국제결혼·이혼',
    inheritance: '상속',
    litigation: '소송·분쟁',
    labor: '노동·고용',
    lawyer: '대만 변호사 선임',
    other: '기타 법률정보',
  },
  'zh-hant': {
    criminal: '刑事訴訟',
    company: '公司設立與投資',
    tax: '稅務',
    visa: '簽證與居留',
    family: '跨國婚姻與離婚',
    inheritance: '繼承',
    litigation: '訴訟與糾紛',
    labor: '勞動與僱傭',
    lawyer: '委任台灣律師',
    other: '其他法律資訊',
  },
  en: {
    criminal: 'Criminal litigation',
    company: 'Company setup & investment',
    tax: 'Tax',
    visa: 'Visas & residence',
    family: 'International marriage & divorce',
    inheritance: 'Inheritance',
    litigation: 'Litigation & disputes',
    labor: 'Employment',
    lawyer: 'Working with a Taiwan lawyer',
    other: 'Other legal topics',
  },
  ja: {
    criminal: '刑事訴訟',
    company: '会社設立・投資',
    tax: '税務',
    visa: 'ビザ・在留',
    family: '国際結婚・離婚',
    inheritance: '相続',
    litigation: '訴訟・紛争',
    labor: '労働・雇用',
    lawyer: '台湾の弁護士に依頼する',
    other: 'その他の法律情報',
  },
};

export const COLUMN_TOPIC_UI_COPY: Record<
  ColumnTopicUiLocale,
  { nav: string; viewAll: (label: string, n: number) => string; count: (n: number) => string; backToTopics: string }
> = {
  vi: {
    nav: columnUiVi.topicUi.nav,
    viewAll: (label, n) => columnUiVi.topicUi.viewAll.replace('{n}', String(n)).replace('{label}', label),
    count: (n) => columnUiVi.topicUi.count.replace('{n}', String(n)),
    backToTopics: columnUiVi.topicUi.backToTopics,
  },
  ko: {
    nav: '주제별로 보기',
    viewAll: (label, n) => `${label} 칼럼 ${n}편 모두 보기`,
    count: (n) => `${n}편`,
    backToTopics: '주제별 목록으로',
  },
  'zh-hant': {
    nav: '依主題瀏覽',
    viewAll: (label, n) => `查看全部 ${n} 篇「${label}」專欄`,
    count: (n) => `${n} 篇`,
    backToTopics: '回到主題列表',
  },
  en: {
    nav: 'Browse by topic',
    viewAll: (label, n) => `View all ${n} columns in ${label}`,
    count: (n) => `${n} column${n === 1 ? '' : 's'}`,
    backToTopics: 'Back to all topics',
  },
  ja: {
    nav: 'テーマ別に見る',
    viewAll: (label, n) => `「${label}」のコラムをすべて見る（${n}件）`,
    count: (n) => `${n}件`,
    backToTopics: 'テーマ一覧に戻る',
  },
};

/** How many cards each topic section shows before "view all". */
export const COLUMN_TOPIC_SECTION_PREVIEW = 3;

export interface TopicGroup<T> {
  topic: ColumnTopic;
  posts: T[];
}

/** Group posts (already newest-first) by topic, in `COLUMN_TOPICS` order, skipping empty topics. */
export function groupColumnsByTopic<T extends { topic?: ColumnTopic; slug: string }>(posts: readonly T[]): TopicGroup<T>[] {
  const buckets = new Map<ColumnTopic, T[]>();
  for (const post of posts) {
    const topic = post.topic ?? resolveColumnTopic(post.slug);
    const bucket = buckets.get(topic) ?? [];
    bucket.push(post);
    buckets.set(topic, bucket);
  }
  return COLUMN_TOPICS.filter((topic) => buckets.has(topic)).map((topic) => ({ topic, posts: buckets.get(topic)! }));
}

/**
 * Round-robin mix for home-page archives: takes newest-first posts and
 * interleaves topics (topic order = order of each topic's newest post), so
 * one busy topic cannot fill the whole home archive. Within a topic the
 * newest-first order is kept. Posts without a topic resolve via the legacy map.
 */
export function interleaveColumnsByTopic<T extends { slug: string; topic?: ColumnTopic }>(posts: readonly T[]): T[] {
  const order: ColumnTopic[] = [];
  const queues = new Map<ColumnTopic, T[]>();
  for (const post of posts) {
    const topic = post.topic ?? resolveColumnTopic(post.slug);
    if (!queues.has(topic)) {
      queues.set(topic, []);
      order.push(topic);
    }
    queues.get(topic)!.push(post);
  }
  const mixed: T[] = [];
  while (mixed.length < posts.length) {
    for (const topic of order) {
      const next = queues.get(topic)!.shift();
      if (next) mixed.push(next);
    }
  }
  return mixed;
}
