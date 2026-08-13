import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { mapPublicRateLimitDenial } from '@/lib/builder/security/public-rate-limit-response';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  getPublicSearchApiErrorPayload,
  type PublicSearchApiErrorCode,
} from '@/lib/builder/search/search-api-copy';
import { runSearchQuery } from '@/lib/builder/search/query-engine';
import {
  appendQueryLog,
  loadSearchIndex,
  saveSearchIndex,
} from '@/lib/builder/search/index-storage';
import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import { collectAllSearchDocs } from '@/lib/builder/search/source-collector';
import { SEARCH_DOC_KINDS, type SearchDocKind, type SearchIndex } from '@/lib/builder/search/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SEARCH_INDEX_FRESHNESS_MS = 5 * 60 * 1000;
const MAX_SEARCH_QUERY_LENGTH = 200;

let searchIndexRefreshPromise: Promise<SearchIndex> | null = null;

function normalizeSearchQuery(value: string): string {
  return Array.from(value.trim()).slice(0, MAX_SEARCH_QUERY_LENGTH).join('');
}

function errorResponse(
  locale: Locale,
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

function isFreshSearchIndex(builtAt: unknown): boolean {
  if (typeof builtAt !== 'string') return false;
  const builtAtMs = Date.parse(builtAt);
  const ageMs = Date.now() - builtAtMs;
  return Number.isFinite(builtAtMs) && ageMs >= 0 && ageMs <= SEARCH_INDEX_FRESHNESS_MS;
}

async function rebuildSearchIndex(): Promise<SearchIndex> {
  const index = buildSearchIndex(await collectAllSearchDocs('default'));
  try {
    await saveSearchIndex(index);
  } catch (error) {
    console.error('[public/search] index save failed:', error);
  }
  return index;
}

function refreshSearchIndex(): Promise<SearchIndex> {
  if (!searchIndexRefreshPromise) {
    searchIndexRefreshPromise = rebuildSearchIndex().finally(() => {
      searchIndexRefreshPromise = null;
    });
  }
  return searchIndexRefreshPromise;
}

export async function GET(request: NextRequest) {
  const query = normalizeSearchQuery(request.nextUrl.searchParams.get('q') ?? '');
  const localeParam = request.nextUrl.searchParams.get('locale') ?? 'ko';
  const locale = normalizeLocale(localeParam);
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

  let storedIndex: Awaited<ReturnType<typeof loadSearchIndex>>;
  let index: NonNullable<typeof storedIndex>;
  try {
    storedIndex = await loadSearchIndex();
    if (storedIndex && isFreshSearchIndex(storedIndex.builtAt)) {
      index = storedIndex;
    } else {
      index = await refreshSearchIndex();
    }
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
    hits = runSearchQuery({ index, query, locale, limit, kinds: kinds.length > 0 ? kinds : undefined });
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
