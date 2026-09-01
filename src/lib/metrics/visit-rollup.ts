import type { EnrichedVisitEvent } from './visit-schema';

export interface DailySummary {
  day: string;
  totals: {
    pageviews: number;
    sessions: number;
    avgDwellMs: number;
    bounceSessions: number;
  };
  byChannel: Record<string, number>;
  bySource: Record<string, number>;
  aiBySource: Record<string, number>;
  aiLandingPages: Record<string, number>;
  byLocale: Record<string, number>;
  byCountry: Record<string, number>;
  topPages: Array<{ path: string; views: number; avgDwellMs: number }>;
  topEntryPages: Array<{ path: string; count: number }>;
  keywords: Array<{ keyword: string; source: string; count: number }>;
  localeSwitchSessions: number;
}

type Pageview = Extract<EnrichedVisitEvent, { type: 'pageview' }>;

function increment(counts: Map<string, number>, key: string): void {
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

function toRecord(counts: Map<string, number>): Record<string, number> {
  return Object.fromEntries(counts);
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function buildDailySummary(day: string, events: EnrichedVisitEvent[]): DailySummary {
  const sessions = new Map<string, EnrichedVisitEvent[]>();
  const byChannel = new Map<string, number>();
  const bySource = new Map<string, number>();
  const aiBySource = new Map<string, number>();
  const aiLandingPages = new Map<string, number>();
  const byLocale = new Map<string, number>();
  const byCountry = new Map<string, number>();
  const pageViews = new Map<string, number>();
  const entryPages = new Map<string, number>();
  const dwellByPath = new Map<string, { total: number; count: number }>();
  const keywordCounts = new Map<string, Map<string, number>>();

  for (const event of events) {
    const sessionEvents = sessions.get(event.sid);
    if (sessionEvents) sessionEvents.push(event);
    else sessions.set(event.sid, [event]);

    if (event.type === 'pageview') {
      increment(byLocale, event.locale);
      increment(pageViews, event.path);
    } else {
      const dwell = dwellByPath.get(event.path);
      if (dwell) {
        dwell.total += event.dwellMs;
        dwell.count += 1;
      } else {
        dwellByPath.set(event.path, { total: event.dwellMs, count: 1 });
      }
    }
  }

  let totalSessionDwellMs = 0;
  let bounceSessions = 0;
  let localeSwitchSessions = 0;

  for (const sessionEvents of sessions.values()) {
    const pageviews = sessionEvents
      .filter((event): event is Pageview => event.type === 'pageview')
      .sort((left, right) => Date.parse(left.ts) - Date.parse(right.ts));

    totalSessionDwellMs += sessionEvents.reduce(
      (sum, event) => sum + (event.type === 'engagement' ? event.dwellMs : 0),
      0,
    );

    if (pageviews.length === 1) bounceSessions += 1;
    if (new Set(pageviews.map((pageview) => pageview.locale)).size >= 2) {
      localeSwitchSessions += 1;
    }

    const entry = pageviews[0];
    if (!entry) continue;

    increment(entryPages, entry.path);
    if (entry.channel) increment(byChannel, entry.channel);
    if (entry.source) increment(bySource, entry.source);
    if (entry.country) increment(byCountry, entry.country);

    if (entry.channel === 'ai') {
      increment(aiLandingPages, entry.path);
      if (entry.source) increment(aiBySource, entry.source);
    }

    if (entry.keyword) {
      const source = entry.source ?? '';
      const sources = keywordCounts.get(entry.keyword);
      if (sources) increment(sources, source);
      else keywordCounts.set(entry.keyword, new Map([[source, 1]]));
    }
  }

  const topPages = [...pageViews.entries()]
    .map(([path, views]) => {
      const dwell = dwellByPath.get(path);
      return {
        path,
        views,
        avgDwellMs: dwell ? Math.round(dwell.total / dwell.count) : 0,
      };
    })
    .sort((left, right) => right.views - left.views || compareText(left.path, right.path))
    .slice(0, 20);

  const topEntryPages = [...entryPages.entries()]
    .map(([path, count]) => ({ path, count }))
    .sort((left, right) => right.count - left.count || compareText(left.path, right.path))
    .slice(0, 10);

  const keywords = [...keywordCounts.entries()]
    .flatMap(([keyword, sources]) => (
      [...sources.entries()].map(([source, count]) => ({ keyword, source, count }))
    ))
    .sort((left, right) => (
      right.count - left.count
      || compareText(left.keyword, right.keyword)
      || compareText(left.source, right.source)
    ))
    .slice(0, 50);

  return {
    day,
    totals: {
      pageviews: events.filter((event) => event.type === 'pageview').length,
      sessions: sessions.size,
      avgDwellMs: sessions.size === 0 ? 0 : Math.round(totalSessionDwellMs / sessions.size),
      bounceSessions,
    },
    byChannel: toRecord(byChannel),
    bySource: toRecord(bySource),
    aiBySource: toRecord(aiBySource),
    aiLandingPages: toRecord(aiLandingPages),
    byLocale: toRecord(byLocale),
    byCountry: toRecord(byCountry),
    topPages,
    topEntryPages,
    keywords,
    localeSwitchSessions,
  };
}
