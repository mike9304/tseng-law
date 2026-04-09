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

export function getConsultationColumnContextText(references: ConsultationColumnReference[]): string {
  if (!references.length) return 'No approved internal column summary available.';
  return references
    .map((ref) => {
      const freshness = ref.freshness === 'fresh' ? 'fresh' : ref.freshness === 'review_needed' ? 'review_needed' : 'unknown';
      return `- ${ref.title} (${ref.slug}) / lastmod=${ref.lastmod || 'unknown'} / freshness=${freshness}\n  ${ref.summary}`;
    })
    .join('\n');
}
