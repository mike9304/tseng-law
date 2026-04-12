import type { Locale } from '@/lib/locales';
import { getAllColumnPosts } from '@/lib/columns';
import type {
  ConsultationCategory,
  ConsultationColumnReference,
  ConsultationSourceFreshness,
} from '@/lib/consultation/types';

const CATEGORY_SLUG_MAP: Record<ConsultationCategory, string[]> = {
  company_setup: [
    'taiwan-company-establishment-basics',
    'withdraw-capital-taiwan-company',
    'taiwan-company-subsidiary-vs-branch',
    'taiwan-company-establishment-advanced-2',
    'taiwan-company-establishment-advanced-1',
    'taiwan-company-setup-pitch-location',
  ],
  traffic_accident: [
    'taiwan-traffic-accident-procedure',
    'taiwan-overtaking-accident-liability',
  ],
  criminal_investigation: [],
  labor: [
    'taiwan-labor-severance-law',
    'taiwan-voluntary-resignation-severance',
    'taiwan-mandatory-employment-period',
  ],
  divorce_family: ['taiwan-divorce-lawsuit-qna'],
  inheritance: ['taiwan-inheritance-custody-analysis'],
  logistics: ['taiwan-logistics-business-setup'],
  cosmetics: ['taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide'],
  // 'general' classification means "no legal-domain keyword matched". The
  // engine USED to attach a 4-column fallback bag here so the LLM had
  // *something* to talk about, but that produced confident-looking
  // off-topic answers (pizza recipes, weather forecasts, jailbreak prompts)
  // grounded in unrelated legal columns. We now intentionally return zero
  // references so the low-confidence bypass fires and the user is routed
  // to human review instead.
  general: [],
  unknown: [],
};

const HIGH_STALENESS_RISK = new Set<ConsultationCategory>([
  'company_setup',
  'labor',
  'logistics',
  'cosmetics',
]);

// In-memory cache: locale → posts (refreshed every 5 minutes)
const CACHE_TTL_MS = 5 * 60 * 1000;
let postsCache: { locale: string; posts: ReturnType<typeof getAllColumnPosts>; expires: number }[] = [];

function getCachedPosts(locale: Locale): ReturnType<typeof getAllColumnPosts> {
  const now = Date.now();
  const existing = postsCache.find((c) => c.locale === locale && c.expires > now);
  if (existing) return existing.posts;

  const posts = getAllColumnPosts(locale);
  // Replace stale entry or add new
  postsCache = postsCache.filter((c) => c.locale !== locale);
  postsCache.push({ locale, posts, expires: now + CACHE_TTL_MS });
  return posts;
}

function resolveFreshness(lastmod: string): ConsultationSourceFreshness {
  if (!lastmod) return 'unknown';
  const date = new Date(lastmod);
  if (Number.isNaN(date.getTime())) return 'unknown';
  const ageMs = Date.now() - date.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  return ageDays > 365 ? 'review_needed' : 'fresh';
}

function clipSummary(value: string): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized.length > 180 ? `${normalized.slice(0, 177)}...` : normalized;
}

/** Strip markdown for clean LLM consumption */
function stripMarkdown(value: string): string {
  return value
    .replace(/^---[\s\S]*?---\s*/m, '') // frontmatter
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
    .replace(/[#`*_>~]/g, '') // markdown symbols
    .replace(/\s+/g, ' ')
    .trim();
}

/** Returns first 1500 chars of cleaned column body for LLM context */
function clipBody(value: string): string {
  const cleaned = stripMarkdown(value);
  return cleaned.length > 1500 ? `${cleaned.slice(0, 1497)}...` : cleaned;
}

// Cache full posts to access content (not just summary)
const fullPostsCache = new Map<
  string,
  { post: ReturnType<typeof getAllColumnPosts>[number]; expires: number }
>();

function getFullPostBySlug(slug: string, locale: Locale) {
  const key = `${locale}:${slug}`;
  const now = Date.now();
  const cached = fullPostsCache.get(key);
  if (cached && cached.expires > now) return cached.post;

  const post = getCachedPosts(locale).find((p) => p.slug === slug);
  if (post) {
    fullPostsCache.set(key, { post, expires: now + CACHE_TTL_MS });
  }
  return post;
}

export function getConsultationColumnReferences(
  category: ConsultationCategory,
  locale: Locale,
  limit = 2,
): ConsultationColumnReference[] {
  const targetSlugs = CATEGORY_SLUG_MAP[category];
  if (!targetSlugs.length) return [];

  const posts = getCachedPosts(locale);
  return targetSlugs
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is NonNullable<typeof post> => Boolean(post))
    .slice(0, limit)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      summary: clipSummary(post.summary),
      lastmod: post.date,
      staleRisk: HIGH_STALENESS_RISK.has(category) ? 'high' : 'medium',
      freshness: resolveFreshness(post.date),
      attorneyReviewStatus: 'pending',
    }));
}

/**
 * Convert a list of slugs (from semantic search hits) into fully
 * populated ConsultationColumnReference objects in the requested
 * locale. Slugs with no matching post in that locale are silently
 * skipped — the calling code can decide whether to fall back.
 *
 * Sprint 0: this is the canonical merged-source resolver. It now reads
 * file columns + Vercel Blob columns (Sprint 0 column CMS) so that
 * lawyer-authored content surfaces alongside the legacy `src/content/columns`
 * file set. Sync callers go through `materializeSlugsSync` (file-only).
 */
async function materializeSlugs(
  slugs: string[],
  locale: Locale,
  category: ConsultationCategory,
  limit: number,
): Promise<ConsultationColumnReference[]> {
  const { getAllColumnPostsIncludingBlob } = await import('@/lib/consultation/columns-blob-reader');
  const posts = await getAllColumnPostsIncludingBlob(locale);
  const out: ConsultationColumnReference[] = [];
  const seen = new Set<string>();
  for (const slug of slugs) {
    if (seen.has(slug)) continue;
    const post = posts.find((p) => p.slug === slug);
    if (!post) continue;
    out.push({
      slug: post.slug,
      title: post.title,
      summary: clipSummary(post.summary),
      lastmod: post.date,
      staleRisk: HIGH_STALENESS_RISK.has(category) ? 'high' : 'medium',
      freshness: resolveFreshness(post.date),
      attorneyReviewStatus: 'pending',
    });
    seen.add(slug);
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * Semantic re-ranking within a category:
 * 1. Start from the category's full static slug list (the classifier's
 *    trusted category filter).
 * 2. Call the embeddings store to score each candidate against the
 *    user query via cosine similarity.
 * 3. Return the top `limit` candidates, re-ordered by similarity.
 *
 * This preserves the hard category filter (so a labor query cannot
 * accidentally be answered with a traffic-accident column because of
 * multilingual embedding cross-talk) while letting the semantic signal
 * pick the most relevant column WITHIN the category's bag (so the
 * "subsidiary vs branch" question surfaces the subsidiary column
 * instead of the generic basics column that always sat at index 0).
 *
 * Falls back to the original static order (old getConsultationColumnReferences
 * behaviour) when:
 *   - the embeddings file is missing,
 *   - the embedding API call fails,
 *   - the category has no slugs defined,
 *   - or the slug list has zero or one element (re-ranking is a no-op).
 */
export async function getConsultationColumnReferencesForQuery(
  query: string,
  category: ConsultationCategory,
  locale: Locale,
  limit = 2,
): Promise<{
  references: ConsultationColumnReference[];
  /** Which retrieval path produced the final references, for logging/debug. */
  source: 'semantic_rerank' | 'static';
  /** Top similarity score from the re-rank (0 if not attempted). */
  topSimilarity: number;
}> {
  const candidateSlugs = CATEGORY_SLUG_MAP[category];
  if (!candidateSlugs || candidateSlugs.length === 0) {
    return { references: [], source: 'static', topSimilarity: 0 };
  }
  if (candidateSlugs.length === 1 || limit >= candidateSlugs.length) {
    // Re-ranking is pointless: the caller wants all (or the only) slug(s).
    return {
      references: getConsultationColumnReferences(category, locale, limit),
      source: 'static',
      topSimilarity: 0,
    };
  }
  if (limit <= 1) {
    // With limit = 1, re-ranking risks demoting the canonical "first"
    // column (e.g. taiwan-labor-severance-law) in favour of a
    // semantically-similar-but-less-canonical sibling (e.g. the
    // voluntary resignation column for a dismissal question). The
    // static ordering has been hand-tuned per category to put the
    // canonical answer first, so honour it when the caller only wants
    // a single column.
    return {
      references: getConsultationColumnReferences(category, locale, limit),
      source: 'static',
      topSimilarity: 0,
    };
  }

  try {
    // Lazy import so tsc --noEmit contexts don't pull the embeddings store.
    const { reRankSlugsByQuery } = await import('@/lib/consultation/embeddings-store');
    const ranked = await reRankSlugsByQuery(query, candidateSlugs, locale);
    if (ranked && ranked.length > 0) {
      const orderedSlugs = ranked.map((r) => r.slug);
      const semanticRefs = await materializeSlugs(orderedSlugs, locale, category, limit);
      if (semanticRefs.length > 0) {
        return {
          references: semanticRefs,
          source: 'semantic_rerank',
          topSimilarity: ranked[0]?.similarity ?? 0,
        };
      }
    }
  } catch (error) {
    console.error('[column-knowledge] semantic re-rank failed:', error);
  }

  return {
    references: getConsultationColumnReferences(category, locale, limit),
    source: 'static',
    topSimilarity: 0,
  };
}

/** Per-query signal of how well the selected columns actually match the user's question. */
export interface QueryRelevanceSignal {
  /** Overlap score in [0, 1]. 1 = every significant query word appears in the columns. */
  score: number;
  /** How many distinct significant query words also appear in the reference bag. */
  queryWordHits: number;
  /** How many distinct significant query words were extracted from the question. */
  queryWordTotal: number;
}

/**
 * Keywords that identify a user question as time-sensitive: anything
 * about tax rates, fees, deadlines, exchange rates, or regulations that
 * the authorities may have updated since the cited column was written.
 * When any of these appear in the user query AND at least one cited
 * column is more than 180 days old, the engine attaches a staleness
 * warning so the user knows to re-verify the number with a lawyer.
 */
const TIME_SENSITIVE_QUERY_KEYWORDS: readonly string[] = [
  // Korean
  '세율', '세금', '부가세', '소득세', '법인세', '원천세', '관세',
  '수수료', '등록료', '인지세',
  '환율', '금리', '이자율',
  '기한', '마감', '시효', '공소시효',
  '최저자본', '최저임금', '상한', '한도',
  '2024', '2025', '2026',
  // English
  'tax rate', 'tax bracket', 'filing fee', 'registration fee', 'stamp duty',
  'exchange rate', 'interest rate',
  'deadline', 'statute of limitations',
  'minimum capital', 'minimum wage', 'cap', 'ceiling',
  // Traditional Chinese
  '稅率', '稅金', '營業稅', '所得稅', '法人稅', '關稅',
  '規費', '登記費',
  '匯率', '利率',
  '期限', '時效',
  '最低資本', '最低工資',
];

/** Days threshold beyond which a cited column needs the staleness warning. */
const STALENESS_WARNING_DAYS = 180;

export interface TimeSensitivityCheck {
  /** True if the user query contains at least one time-sensitive keyword. */
  isTimeSensitive: boolean;
  /** True if at least one cited column is older than STALENESS_WARNING_DAYS. */
  hasAgedColumn: boolean;
  /** Computed trigger: isTimeSensitive AND hasAgedColumn. */
  shouldWarn: boolean;
  /** For logging / debugging: which column slugs were identified as aged. */
  agedSlugs: string[];
}

function isColumnAged(lastmod: string): boolean {
  if (!lastmod) return false;
  const date = new Date(lastmod);
  if (Number.isNaN(date.getTime())) return false;
  const ageMs = Date.now() - date.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  return ageDays > STALENESS_WARNING_DAYS;
}

/**
 * Check whether the (query, references) pair should trigger a
 * time-sensitivity warning. Pure function, no side effects.
 */
export function checkTimeSensitivity(
  query: string,
  references: ConsultationColumnReference[],
): TimeSensitivityCheck {
  const normalized = query.toLowerCase();
  const isTimeSensitive = TIME_SENSITIVE_QUERY_KEYWORDS.some((kw) =>
    normalized.includes(kw.toLowerCase()),
  );
  if (!isTimeSensitive) {
    return { isTimeSensitive: false, hasAgedColumn: false, shouldWarn: false, agedSlugs: [] };
  }
  const agedSlugs: string[] = [];
  for (const ref of references) {
    if (isColumnAged(ref.lastmod)) {
      agedSlugs.push(ref.slug);
    }
  }
  const hasAgedColumn = agedSlugs.length > 0;
  return {
    isTimeSensitive,
    hasAgedColumn,
    shouldWarn: isTimeSensitive && hasAgedColumn,
    agedSlugs,
  };
}

/**
 * Stopwords that add noise to the keyword overlap score. Korean question
 * endings and general-purpose verbs/pronouns are removed so that a
 * relevance score is driven by domain-specific nouns, not boilerplate.
 */
const KOREAN_STOPWORDS: ReadonlySet<string> = new Set([
  // Question endings and sentence-level connectives
  '어떻게', '해야', '하나요', '있나요', '됩니다', '입니다', '합니다',
  '했습니다', '했어요', '하고', '하면', '이고', '이에요', '저는', '제가',
  '당신', '우리', '뭐가', '뭔가요', '정말', '지금', '있어', '있습니다',
  '주세요', '알려', '어떤', '또한', '그리고', '하지만', '그런데', '따라서',
  '때문에', '위해', '위한', '대해', '관련', '대한', '처럼', '같은', '만약',
  '어떻게나', '어떻게요', '되나요', '되는', '되어', '되어도', '되면',
  '드립니다', '드려요', '드리고', '할게요', '할까요', '해주세요', '인가요',
  '없나요', '없습니다', '좀', '네요', '요즘', '그냥', '그런', '이런',
  // Generic legal/geographic vocabulary. These words appear in almost
  // every legal column body, so matching them inflates the score on
  // questions that are actually topically off from the column bag.
  // Removing them forces the score to reflect domain-specific terms.
  '대만', '한국', '중국', '일본', '한국인', '대만인',
  '변호사', '법률', '법원', '법조', '법무', '법률사무소',
  '사건', '문제', '상담', '질문', '답변', '답변하', '답변해',
  '경우', '상황', '내용', '부분', '정도', '경험', '방법',
  // Query-framing words (wh-words, quantifiers, process verbs) that
  // appear in almost every user question regardless of topic. Removing
  // them keeps the relevance score tied to content nouns only.
  '신청', '제출', '절차', '문서', '서류', '계약', '계약서',
  '얼마', '몇', '언제', '어디', '누가', '무엇', '누구',
  '남았습니다', '남은', '남아', '남아서',
]);

/**
 * Korean particle suffix regex. Stripping the suffix exposes the noun
 * stem so that "손해배상을" (damages + object particle) matches
 * "손해배상" in the column body text.
 */
const KOREAN_PARTICLE_SUFFIX = /^(.+?)(을|를|이|가|은|는|에|와|과|의|으로|로|에서|부터|까지|만|에게|한테|보다|처럼|도|이나|나|라도|조차|마저|같이|라도)$/u;

function extractKoreanStem(token: string): string | null {
  const match = KOREAN_PARTICLE_SUFFIX.exec(token);
  if (!match || !match[1]) return null;
  const stem = match[1];
  if (stem.length < 2) return null;
  return stem;
}

function isPureCjk(token: string): boolean {
  return /^[\u4E00-\u9FFF]+$/.test(token);
}

/**
 * Tokenise a string into a set of "significant" words for keyword overlap
 * scoring. Handles Korean particles (by also indexing the stem), Chinese
 * continuous text (via 2-gram and 3-gram character windows), and common
 * Korean stopwords (filtered out so high-frequency particles don't
 * inflate the overlap score).
 */
function significantTokens(value: string): Set<string> {
  const normalized = value.toLowerCase();
  const raw = normalized.split(
    /[\s\u3000。、，．・！？『』「」（）\[\],.!?;:()\u3002\uFF0C\uFF01\uFF1F]+/u,
  );
  const out = new Set<string>();

  for (const rawToken of raw) {
    const token = rawToken.trim();
    if (token.length < 2) continue;
    if (KOREAN_STOPWORDS.has(token)) continue;

    if (isPureCjk(token)) {
      // Chinese (or zh-hant) continuous script: build 2-gram and 3-gram
      // windows so meaningful substrings like "設立" or "資本額" get
      // matched against column bodies even without a tokenizer.
      if (token.length >= 4) {
        for (let i = 0; i <= token.length - 2; i += 1) {
          out.add(token.slice(i, i + 2));
        }
        for (let i = 0; i <= token.length - 3; i += 1) {
          out.add(token.slice(i, i + 3));
        }
      } else {
        out.add(token);
      }
      continue;
    }

    out.add(token);
    const stem = extractKoreanStem(token);
    if (stem && !KOREAN_STOPWORDS.has(stem)) {
      out.add(stem);
    }
  }

  return out;
}

/**
 * Compute a lightweight relevance score between a user query and the
 * columns the engine has decided to attach. This is a keyword overlap
 * proxy only — it does NOT do semantic embedding — and is intentionally
 * cheap to run synchronously before every LLM call.
 *
 * A score well below the refusal threshold indicates the static
 * category-to-column mapping returned a bag of columns that has nothing
 * to do with what the user actually asked, at which point it is safer
 * to refuse and route to a human than to let the LLM either hallucinate
 * a grounded-looking answer or produce a citation for an irrelevant
 * source.
 */
export function computeQueryColumnRelevance(
  query: string,
  references: ConsultationColumnReference[],
  locale: Locale,
): QueryRelevanceSignal {
  if (references.length === 0) {
    return { score: 0, queryWordHits: 0, queryWordTotal: 0 };
  }

  const queryWords = significantTokens(query);
  const queryWordTotal = queryWords.size;
  if (queryWordTotal === 0) {
    return { score: 0, queryWordHits: 0, queryWordTotal: 0 };
  }

  // Build a single search blob from titles + summaries + (clipped) bodies.
  const blobParts: string[] = [];
  for (const ref of references) {
    blobParts.push(ref.title.toLowerCase());
    if (ref.summary) blobParts.push(ref.summary.toLowerCase());
    const fullPost = getFullPostBySlug(ref.slug, locale);
    if (fullPost?.content) {
      // Clip to first 4000 chars: body may be huge and full scans hurt
      // latency for no meaningful gain on keyword matching.
      blobParts.push(stripMarkdown(fullPost.content).slice(0, 4000).toLowerCase());
    }
  }
  const blob = blobParts.join(' ');

  let queryWordHits = 0;
  for (const word of queryWords) {
    if (blob.includes(word)) queryWordHits += 1;
  }

  return {
    score: queryWordHits / queryWordTotal,
    queryWordHits,
    queryWordTotal,
  };
}

export function getConsultationColumnContextText(
  references: ConsultationColumnReference[],
  locale: Locale = 'ko',
): string {
  if (!references.length) return 'No approved internal column summary available.';
  // Each column is wrapped in an XML-like <column> tag so the LLM can be
  // instructed (in buildProviderPrompt) to cite the slug as [Column: slug]
  // after every factual claim. Attributes carry slug, title, lastmod and
  // freshness; the body sits on its own line for clean context windows.
  return references
    .map((ref) => {
      const freshness =
        ref.freshness === 'fresh'
          ? 'fresh'
          : ref.freshness === 'review_needed'
            ? 'review_needed'
            : 'unknown';
      const fullPost = getFullPostBySlug(ref.slug, locale);
      const body = fullPost?.content ? clipBody(fullPost.content) : ref.summary;
      const escapedTitle = ref.title.replace(/"/g, '&quot;');
      const lastmod = ref.lastmod || 'unknown';
      return [
        `<column id="${ref.slug}" title="${escapedTitle}" lastmod="${lastmod}" freshness="${freshness}">`,
        body,
        '</column>',
      ].join('\n');
    })
    .join('\n\n');
}
