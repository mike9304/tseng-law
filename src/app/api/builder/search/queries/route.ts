import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { listQueryLogs } from '@/lib/builder/search/index-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true });
  if (auth instanceof NextResponse) return auth;

  const logs = await listQueryLogs();
  // Aggregate top queries + no-result queries.
  const totalQueries = logs.length;
  const byQuery = new Map<string, { count: number; hits: number; lastAt: string; locales: Set<string> }>();
  for (const log of logs) {
    const key = log.query.toLowerCase().trim();
    if (!key) continue;
    if (!byQuery.has(key)) byQuery.set(key, { count: 0, hits: 0, lastAt: log.at, locales: new Set() });
    const agg = byQuery.get(key)!;
    agg.count += 1;
    agg.hits += log.hits;
    agg.locales.add(log.locale);
    if (log.at > agg.lastAt) agg.lastAt = log.at;
  }
  const aggregated = Array.from(byQuery.entries()).map(([query, agg]) => ({
    query,
    count: agg.count,
    avgHits: Math.round((agg.hits / agg.count) * 10) / 10,
    zeroResults: agg.hits === 0,
    locales: Array.from(agg.locales),
    lastAt: agg.lastAt,
  }));
  aggregated.sort((a, b) => b.count - a.count);

  return NextResponse.json({
    ok: true,
    totalQueries,
    uniqueQueries: aggregated.length,
    top: aggregated.slice(0, 50),
    zeroResultQueries: aggregated.filter((a) => a.zeroResults).slice(0, 50),
  });
}
