import type { Metadata } from 'next';
import { loadSearchIndex, listQueryLogs } from '@/lib/builder/search/index-storage';
import SearchAdminPanel from '@/components/builder/search/SearchAdminPanel';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Site Search Admin',
  robots: { index: false, follow: false },
};

interface QueryStat {
  query: string;
  count: number;
  avgHits: number;
  zeroResults: boolean;
  locales: string[];
  lastAt: string;
}

export default async function SearchAdminPage() {
  const index = await loadSearchIndex();
  const logs = await listQueryLogs();

  const totals: Record<string, number> = {};
  if (index) {
    for (const [loc, docs] of Object.entries(index.byLocale)) {
      totals[loc] = docs.length;
    }
  }

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
  const aggregated: QueryStat[] = Array.from(byQuery.entries()).map(([query, agg]) => ({
    query,
    count: agg.count,
    avgHits: Math.round((agg.hits / agg.count) * 10) / 10,
    zeroResults: agg.hits === 0,
    locales: Array.from(agg.locales),
    lastAt: agg.lastAt,
  }));
  aggregated.sort((a, b) => b.count - a.count);

  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Site Search</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          빌더 페이지 인덱스 관리 및 검색 쿼리 분석.
        </p>
      </header>
      <SearchAdminPanel
        initialIndexSummary={{ builtAt: index?.builtAt ?? null, totals }}
        initialQueryStats={{
          totalQueries: logs.length,
          uniqueQueries: aggregated.length,
          top: aggregated.slice(0, 50),
          zeroResultQueries: aggregated.filter((a) => a.zeroResults).slice(0, 50),
        }}
      />
    </main>
  );
}
