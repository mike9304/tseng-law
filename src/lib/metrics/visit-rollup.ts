import type { EnrichedVisitEvent } from './visit-schema';

export interface ContactIntentSummary {
  trackingVersion: 1;
  trackedSessions: number;
  intentSessions: number;
  events: number;
  unattributedEvents: number;
  byAction: Record<string, number>;
}

export interface AcquisitionCohort {
  country: string;
  locale: string;
  entryPath: string;
  channel: string;
  source: string | null;
  sessions: number;
  trackedSessions: number;
  intentSessions: number;
}

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
  contactIntent?: ContactIntentSummary;
  acquisitionCohorts?: AcquisitionCohort[];
}

type Pageview = Extract<EnrichedVisitEvent, { type: 'pageview' }>;
type Engagement = Extract<EnrichedVisitEvent, { type: 'engagement' }>;
type ContactIntent = Extract<EnrichedVisitEvent, { type: 'contact_intent' }>;

function increment(counts: Map<string, number>, key: string): void {
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

function toRecord(counts: Map<string, number>): Record<string, number> {
  return Object.fromEntries(counts);
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sanitizeEntryPath(path: string): string {
  const cut = path.search(/[?#]/);
  const stripped = cut === -1 ? path : path.slice(0, cut);
  return stripped.length > 0 ? stripped : '/';
}

function isPageview(event: EnrichedVisitEvent): event is Pageview {
  return event.type === 'pageview';
}

function isEngagement(event: EnrichedVisitEvent): event is Engagement {
  return event.type === 'engagement';
}

function isContactIntent(event: EnrichedVisitEvent): event is ContactIntent {
  return event.type === 'contact_intent';
}

function hasLegacyVisitSignal(events: EnrichedVisitEvent[]): boolean {
  return events.some((event) => isPageview(event) || isEngagement(event));
}

function cohortKey(cohort: Omit<AcquisitionCohort, 'sessions' | 'trackedSessions' | 'intentSessions'>): string {
  return [
    cohort.country,
    cohort.locale,
    cohort.entryPath,
    cohort.channel,
    cohort.source ?? '',
  ].join('\u0000');
}

function compareCohorts(left: AcquisitionCohort, right: AcquisitionCohort): number {
  return compareText(left.country, right.country)
    || compareText(left.locale, right.locale)
    || compareText(left.entryPath, right.entryPath)
    || compareText(left.channel, right.channel)
    || compareText(left.source ?? '', right.source ?? '');
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
  const contactByAction = new Map<string, number>();
  const cohorts = new Map<string, AcquisitionCohort>();

  let contactEvents = 0;

  for (const event of events) {
    const sessionEvents = sessions.get(event.sid);
    if (sessionEvents) sessionEvents.push(event);
    else sessions.set(event.sid, [event]);

    if (event.type === 'pageview') {
      increment(byLocale, event.locale);
      increment(pageViews, event.path);
    } else if (event.type === 'engagement') {
      const dwell = dwellByPath.get(event.path);
      if (dwell) {
        dwell.total += event.dwellMs;
        dwell.count += 1;
      } else {
        dwellByPath.set(event.path, { total: event.dwellMs, count: 1 });
      }
    } else if (event.type === 'contact_intent') {
      contactEvents += 1;
      increment(contactByAction, event.action);
    }
  }

  let totalSessionDwellMs = 0;
  let bounceSessions = 0;
  let localeSwitchSessions = 0;
  let legacySessions = 0;
  let trackedSessions = 0;
  let intentSessions = 0;
  let unattributedEvents = 0;

  for (const sessionEvents of sessions.values()) {
    const pageviews = sessionEvents
      .filter(isPageview)
      .sort((left, right) => Date.parse(left.ts) - Date.parse(right.ts));
    const intents = sessionEvents.filter(isContactIntent);
    const hasPageview = pageviews.length > 0;
    const hasTrackingCoverage = pageviews.some((pageview) => pageview.contactTracking === 1);

    if (intents.length > 0 && (!hasPageview || !hasTrackingCoverage)) {
      unattributedEvents += intents.length;
    }

    if (!hasLegacyVisitSignal(sessionEvents)) continue;

    legacySessions += 1;
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

    const tracked = hasTrackingCoverage;
    const intent = tracked && intents.length > 0;
    if (tracked) trackedSessions += 1;
    if (intent) intentSessions += 1;

    const cohortIdentity = {
      country: entry.country ?? 'unknown',
      locale: entry.locale,
      entryPath: sanitizeEntryPath(entry.path),
      channel: entry.channel ?? 'unknown',
      source: entry.source ?? null,
    };
    const key = cohortKey(cohortIdentity);
    const existing = cohorts.get(key);
    if (existing) {
      existing.sessions += 1;
      if (tracked) existing.trackedSessions += 1;
      if (intent) existing.intentSessions += 1;
    } else {
      cohorts.set(key, {
        ...cohortIdentity,
        sessions: 1,
        trackedSessions: tracked ? 1 : 0,
        intentSessions: intent ? 1 : 0,
      });
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

  const acquisitionCohorts = [...cohorts.values()].sort(compareCohorts);

  return {
    day,
    totals: {
      pageviews: events.filter(isPageview).length,
      sessions: legacySessions,
      avgDwellMs: legacySessions === 0 ? 0 : Math.round(totalSessionDwellMs / legacySessions),
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
    contactIntent: {
      trackingVersion: 1,
      trackedSessions,
      intentSessions,
      events: contactEvents,
      unattributedEvents,
      byAction: toRecord(contactByAction),
    },
    acquisitionCohorts,
  };
}
