import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { mapPublicRateLimitDenial } from '@/lib/builder/security/public-rate-limit-response';
import { normalizeSiteLocale, type SiteLocale } from '@/lib/locales';
import {
  getPublicSearchApiErrorPayload,
  type PublicSearchApiErrorCode,
} from '@/lib/builder/search/search-api-copy';
import { searchCurrentPublication, SearchIndexUnavailableError } from '@/lib/builder/search/current-search';
import { appendQueryLog } from '@/lib/builder/search/index-storage';
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

  const kinds = kindsParam
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is SearchDocKind => SEARCH_DOC_KINDS.includes(s as SearchDocKind));

  let result: Awaited<ReturnType<typeof searchCurrentPublication>>;
  try {
    result = await searchCurrentPublication({query, locale, limit, kinds: kinds.length > 0 ? kinds : undefined});
  } catch (error) {
    console.error(error instanceof SearchIndexUnavailableError ? '[public/search] index load failed:' : '[public/search] query failed:', error);
    return errorResponse(locale, error instanceof SearchIndexUnavailableError ? 'search_index_failed' : 'search_query_failed', 500);
  }
  const {hits, indexMissing} = result;

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
    indexMissing,
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
