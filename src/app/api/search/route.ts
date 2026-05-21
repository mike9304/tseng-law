import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { normalizeLocale } from '@/lib/locales';
import { runSearchQuery } from '@/lib/builder/search/query-engine';
import {
  appendQueryLog,
  loadSearchIndex,
} from '@/lib/builder/search/index-storage';
import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import { collectAllSearchDocs } from '@/lib/builder/search/source-collector';
import { SEARCH_DOC_KINDS, type SearchDocKind } from '@/lib/builder/search/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
  const ip = clientIp(request);
  const rate = await checkRateLimit(`search:${ip}`, 60, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const query = (request.nextUrl.searchParams.get('q') ?? '').trim();
  const localeParam = request.nextUrl.searchParams.get('locale') ?? 'ko';
  const locale = normalizeLocale(localeParam);
  const kindsParam = request.nextUrl.searchParams.get('kinds') ?? '';
  const limit = Math.max(1, Math.min(50, Number(request.nextUrl.searchParams.get('limit')) || 20));

  if (query.length === 0) {
    return NextResponse.json({ ok: true, query, hits: [], total: 0 });
  }

  const storedIndex = await loadSearchIndex();
  const index = storedIndex ?? buildSearchIndex(await collectAllSearchDocs('default'));

  const kinds = kindsParam
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is SearchDocKind => SEARCH_DOC_KINDS.includes(s as SearchDocKind));

  const hits = runSearchQuery({ index, query, locale, limit, kinds: kinds.length > 0 ? kinds : undefined });

  // Fire-and-forget query logging.
  void appendQueryLog({
    query: query.slice(0, 200),
    locale,
    hits: hits.length,
    hitId: hits[0]?.doc.id,
    at: new Date().toISOString(),
    userAgentDigest: userAgentDigest(request),
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
