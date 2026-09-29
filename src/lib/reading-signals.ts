/**
 * Privacy-light reading signals for on-site recommendations (browser only).
 *
 * - Stored in sessionStorage (this tab's session only); the locale-suggestion
 *   dismissal is the only localStorage entry. No cookies, nothing is sent to
 *   the server or any third party, no personal data.
 * - Signals: topic of the column the visitor landed on, topics of columns
 *   viewed this session, referrer host (search engine / AI assistant) and UTM
 *   keywords on the landing URL. Search engines do not pass the query, so the
 *   landing column's topic is the main signal.
 */

const SESSION_KEY = 'hv-reading-v1';
export const LOCALE_SUGGESTION_DISMISS_KEY = 'hv-locale-suggestion-dismissed-v1';

export type ReadingSignals = {
  /** topic → number of columns of that topic viewed this session */
  topics: Record<string, number>;
  /** slugs viewed this session, newest first */
  viewed: string[];
  landingTopic?: string;
  utmTopic?: string;
  refHost?: string;
  landed?: boolean;
};

const EMPTY: ReadingSignals = { topics: {}, viewed: [] };

function storage(kind: 'session' | 'local'): Storage | null {
  try {
    return typeof window === 'undefined' ? null : kind === 'session' ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function readSignals(): ReadingSignals {
  try {
    const raw = storage('session')?.getItem(SESSION_KEY);
    if (!raw) return { ...EMPTY, topics: {}, viewed: [] };
    const parsed = JSON.parse(raw) as Partial<ReadingSignals>;
    return {
      topics: parsed.topics && typeof parsed.topics === 'object' ? parsed.topics : {},
      viewed: Array.isArray(parsed.viewed) ? parsed.viewed.filter((v) => typeof v === 'string').slice(0, 20) : [],
      landingTopic: typeof parsed.landingTopic === 'string' ? parsed.landingTopic : undefined,
      utmTopic: typeof parsed.utmTopic === 'string' ? parsed.utmTopic : undefined,
      refHost: typeof parsed.refHost === 'string' ? parsed.refHost : undefined,
      landed: parsed.landed === true,
    };
  } catch {
    return { topics: {}, viewed: [] };
  }
}

function writeSignals(signals: ReadingSignals): void {
  try {
    storage('session')?.setItem(SESSION_KEY, JSON.stringify(signals));
  } catch {
    /* storage full or blocked: recommendations just stay static */
  }
}

/** Keywords (several languages) that map UTM text to a column topic. */
const TOPIC_KEYWORDS: Array<[string, RegExp]> = [
  ['family', /divorce|custody|marriage|spouse|이혼|양육|결혼|배우자|離婚|親権|結婚|配偶|ly hôn|kết hôn|perceraian|หย่า|diborsiyo/i],
  ['inheritance', /inherit|estate|heir|succession|상속|유산|相続|遺産|繼承|继承|thừa kế|warisan|มรดก|mana/i],
  ['visa', /visa|gold ?card|residen|arc|aprc|비자|체류|영주|ビザ|在留|居留|永住|金卡|thị thực|cư trú/i],
  ['tax', /tax|세금|소득세|税|thuế|pajak|ภาษี/i],
  ['labor', /labou?r|dismiss|severance|employ|해고|퇴직|노동|解雇|労働|勞動|资遣|資遣|lao động|sa thải/i],
  ['company', /company|incorporat|subsidiar|branch|setup|법인|회사|설립|会社|法人|設立|公司|công ty/i],
  ['litigation', /lawsuit|litigation|judg|court|debt|소송|판결|채권|訴訟|判決|債權|kiện|tòa/i],
  ['lawyer', /lawyer|attorney|변호사|弁護士|律師|律师|luật sư|pengacara|ทนาย|abogado/i],
];

export function topicFromText(text: string): string | undefined {
  if (!text) return undefined;
  for (const [topic, pattern] of TOPIC_KEYWORDS) if (pattern.test(text)) return topic;
  return undefined;
}

/** Referrer host → locale hint (used only for the locale suggestion). */
const REFERRER_LOCALE_HINTS: Array<[RegExp, string]> = [
  [/(^|\.)(naver\.com|daum\.net|google\.co\.kr)$/, 'ko'],
  [/(^|\.)(yahoo\.co\.jp|google\.co\.jp)$/, 'ja'],
  [/(^|\.)(yahoo\.com\.tw|google\.com\.tw)$/, 'zh-hant'],
  [/(^|\.)(coccoc\.com|google\.com\.vn)$/, 'vi'],
];

export function localeHintFromReferrer(host: string | undefined): string | undefined {
  if (!host) return undefined;
  for (const [pattern, locale] of REFERRER_LOCALE_HINTS) if (pattern.test(host)) return locale;
  return undefined;
}

/** Record where this session started (first page view of the session only). */
export function captureLanding(landingTopic?: string): ReadingSignals {
  const signals = readSignals();
  if (signals.landed) {
    // Another widget may have recorded the landing first without the topic.
    if (landingTopic && !signals.landingTopic && signals.viewed.length === 0) {
      signals.landingTopic = landingTopic;
      writeSignals(signals);
    }
    return signals;
  }
  signals.landed = true;
  signals.landingTopic = landingTopic;
  try {
    const ref = document.referrer ? new URL(document.referrer) : null;
    if (ref && ref.host !== window.location.host) signals.refHost = ref.hostname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const utm = ['utm_term', 'utm_campaign', 'utm_content', 'utm_source']
      .map((key) => params.get(key) ?? '')
      .join(' ');
    signals.utmTopic = topicFromText(utm);
  } catch {
    /* ignore malformed referrer */
  }
  writeSignals(signals);
  return signals;
}

export function recordColumnView(slug: string, topic: string | undefined): ReadingSignals {
  const signals = captureLanding(topic);
  if (signals.viewed[0] !== slug) {
    signals.viewed = [slug, ...signals.viewed.filter((s) => s !== slug)].slice(0, 20);
    if (topic) signals.topics[topic] = Math.min(50, (signals.topics[topic] ?? 0) + 1);
    writeSignals(signals);
  }
  return signals;
}

export function hasTopicSignals(signals: ReadingSignals): boolean {
  return Boolean(signals.landingTopic || signals.utmTopic || Object.keys(signals.topics).length > 0);
}

/**
 * Reorder a static list by the session's interests. Stable: ties keep the
 * static (server) order; already-read columns move to the end.
 */
export function personalizeOrder<T extends { slug: string; topic?: string }>(
  posts: readonly T[],
  signals: ReadingSignals,
): T[] {
  const viewed = new Set(signals.viewed);
  const score = (post: T): number => {
    const topic = post.topic;
    let value = 0;
    if (topic) {
      value += 3 * (signals.topics[topic] ?? 0);
      if (signals.landingTopic === topic) value += 4;
      if (signals.utmTopic === topic) value += 3;
    }
    if (viewed.has(post.slug)) value -= 100;
    return value;
  };
  return posts
    .map((post, index) => ({ post, index, value: score(post) }))
    .sort((a, b) => b.value - a.value || a.index - b.index)
    .map(({ post }) => post);
}

/** Browser language tag → site locale code (undefined if the site has no such locale). */
export function localeFromLanguageTag(tag: string, known: readonly string[]): string | undefined {
  const lower = tag.toLowerCase();
  let code: string;
  if (/^zh-(tw|hk|mo|hant)/.test(lower)) code = 'zh-hant';
  else if (lower.startsWith('zh')) code = 'zh-hans';
  else if (lower.startsWith('tl') || lower.startsWith('fil')) code = 'fil';
  else if (lower.startsWith('in')) code = 'id';
  else if (lower.startsWith('iw')) code = 'he';
  else if (lower.startsWith('no') || lower.startsWith('nn')) code = 'nb';
  else code = lower.split('-')[0];
  return known.includes(code) ? code : undefined;
}

export function isLocaleSuggestionDismissed(): boolean {
  try {
    return storage('local')?.getItem(LOCALE_SUGGESTION_DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

export function dismissLocaleSuggestion(): void {
  try {
    storage('local')?.setItem(LOCALE_SUGGESTION_DISMISS_KEY, '1');
  } catch {
    /* ignore */
  }
}
