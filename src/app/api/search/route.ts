import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { mapPublicRateLimitDenial } from '@/lib/builder/security/public-rate-limit-response';
import { normalizeSiteLocale, type SiteLocale } from '@/lib/locales';
import {
  getPublicSearchApiErrorPayload,
  type PublicSearchApiErrorCode,
} from '@/lib/builder/search/search-api-copy';
import { runSearchQuery } from '@/lib/builder/search/query-engine';
import { appendQueryLog } from '@/lib/builder/search/index-storage';
import { loadFreshSearchIndex } from '@/lib/builder/search/index-runtime';
import { retainPublicPageHits } from '@/lib/builder/search/public-eligibility';
import { augmentStaticDocs } from '@/lib/builder/search/augment-static-docs';
import { getPublicIntentSearchDocs } from '@/lib/builder/search/public-intent-docs';
import { SEARCH_DOC_KINDS, type SearchDocKind } from '@/lib/builder/search/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_SEARCH_QUERY_LENGTH = 200;

function normalizeSearchQuery(value: string): string {
  return Array.from(value.trim()).slice(0, MAX_SEARCH_QUERY_LENGTH).join('');
}

function errorResponse(
  locale: SiteLocale,
  errorCode: PublicSearchApiErrorCode,
  status: number,
  init?: ResponseInit,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getPublicSearchApiErrorPayload(locale, errorCode),
    },
    { ...init, status },
  );
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function userAgentDigest(request: NextRequest): string {
  const ua = request.headers.get('user-agent') ?? '';
  return crypto.createHash('sha256').update(ua).digest('hex').slice(0, 16);
}

export async function GET(request: NextRequest) {
  const query = normalizeSearchQuery(request.nextUrl.searchParams.get('q') ?? '');
  const localeParam = request.nextUrl.searchParams.get('locale') ?? 'ko';
  const locale = normalizeSiteLocale(localeParam);
  const kindsParam = request.nextUrl.searchParams.get('kinds') ?? '';
  const limit = Math.max(1, Math.min(50, Number(request.nextUrl.searchParams.get('limit')) || 20));

  const ip = clientIp(request);
  const rate = await checkRateLimit(`search:${ip}`, 60, 60_000);
  if (!rate.allowed) {
    const decision = mapPublicRateLimitDenial(rate);
    return errorResponse(locale, decision.errorCode, decision.status, {
      headers: decision.headers,
    });
  }

  if (query.length === 0) {
    return NextResponse.json({ ok: true, query, hits: [], total: 0 });
  }

  let storedIndex: Awaited<ReturnType<typeof loadFreshSearchIndex>>['storedIndex'];
  let index: Awaited<ReturnType<typeof loadFreshSearchIndex>>['index'];
  try {
    const loaded = await loadFreshSearchIndex();
    storedIndex = loaded.storedIndex;
    index = loaded.index;
  } catch (error) {
    console.error('[public/search] index load failed:', error);
    return errorResponse(locale, 'search_index_failed', 500);
  }

  const kinds = kindsParam
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is SearchDocKind => SEARCH_DOC_KINDS.includes(s as SearchDocKind));

  let hits: ReturnType<typeof runSearchQuery>;
  try {
    const indexForQuery = augmentStaticDocs(index, locale, getPublicIntentSearchDocs(locale));
    hits = await retainPublicPageHits(
      runSearchQuery({
        index: indexForQuery,
        query,
        locale,
        limit,
        kinds: kinds.length > 0 ? kinds : undefined,
      }),
      locale,
    );
  } catch (error) {
    console.error('[public/search] query failed:', error);
    return errorResponse(locale, 'search_query_failed', 500);
  }

  // Fire-and-forget query logging.
  void appendQueryLog({
    query,
    locale,
    hits: hits.length,
    hitId: hits[0]?.doc.id,
    at: new Date().toISOString(),
    userAgentDigest: userAgentDigest(request),
  }).catch((error) => {
    console.error('[public/search] query log failed:', error);
  });

  return NextResponse.json({
    ok: true,
    query,
    locale,
    indexMissing: !storedIndex,
    total: hits.length,
    hits: hits.map((h) => ({
      id: h.doc.id,
      kind: h.doc.kind,
      title: h.doc.title,
      url: h.doc.url,
      summary: h.doc.summary,
      highlights: h.highlights,
      score: Math.round(h.score * 100) / 100,
    })),
  });
}
