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
  general: [
    'taiwan-company-establishment-basics',
    'taiwan-traffic-accident-procedure',
    'taiwan-gym-injury-lawsuit',
    'taiwan-massage-history-law',
  ],
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
