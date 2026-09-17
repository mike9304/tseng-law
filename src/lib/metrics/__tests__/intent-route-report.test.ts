import { describe, expect, it } from 'vitest';

import type { AcquisitionCohort, DailySummary } from '../visit-rollup';
import {
  DEFAULT_EN_INTENT_ENTRY_PATHS,
  formatIntentRouteReportJson,
  parseDailySummaryJson,
  parseIntentRouteReportArgs,
  reportIntentRoutes,
  resolveSummaryFileArgument,
} from '../intent-route-report';

const EN_PATHS = [...DEFAULT_EN_INTENT_ENTRY_PATHS];

function cohort(overrides: AcquisitionCohort): AcquisitionCohort {
  return { ...overrides };
}

function dailySummary(overrides: Partial<DailySummary> & Pick<DailySummary, 'day'>): DailySummary {
  return {
    totals: { pageviews: 0, sessions: 0, avgDwellMs: 0, bounceSessions: 0 },
    byChannel: {},
    bySource: {},
    aiBySource: {},
    aiLandingPages: {},
    byLocale: {},
    byCountry: {},
    topPages: [],
    topEntryPages: [],
    keywords: [],
    localeSwitchSessions: 0,
    ...overrides,
  };
}

const mixedCohorts: AcquisitionCohort[] = [
  cohort({
    country: 'US',
    locale: 'en',
    entryPath: '/en/taiwan-lawyer',
    channel: 'search',
    source: 'google',
    sessions: 3,
    trackedSessions: 3,
    intentSessions: 1,
  }),
  cohort({
    country: 'US',
    locale: 'en',
    entryPath: '/en/taiwan-lawyer',
    channel: 'direct',
    source: null,
    sessions: 2,
    trackedSessions: 2,
    intentSessions: 0,
  }),
  cohort({
    country: 'unknown',
    locale: 'en',
    entryPath: '/en/taiwan-lawyer',
    channel: 'search',
    source: 'bing',
    sessions: 1,
    trackedSessions: 1,
    intentSessions: 0,
  }),
  cohort({
    country: 'KR',
    locale: 'ko',
    entryPath: '/en/taiwan-lawyer',
    channel: 'search',
    source: 'naver',
    sessions: 9,
    trackedSessions: 9,
    intentSessions: 4,
  }),
  cohort({
    country: 'JP',
    locale: 'en',
    entryPath: '/en/other',
    channel: 'ai',
    source: 'chatgpt',
    sessions: 5,
    trackedSessions: 5,
    intentSessions: 1,
  }),
  cohort({
    country: 'TW',
    locale: 'en',
    entryPath: '/en',
    channel: 'direct',
    source: null,
    sessions: 4,
    trackedSessions: 4,
    intentSessions: 0,
  }),
];

describe('reportIntentRoutes', () => {
  it('groups mixed-locale cohorts, merges repeated channels/countries, and keeps unknown IP country', () => {
    const summary = dailySummary({
      day: '2026-09-01',
      totals: { pageviews: 50, sessions: 99, avgDwellMs: 0, bounceSessions: 0 },
      acquisitionCohorts: mixedCohorts,
      contactIntent: {
        trackingVersion: 1,
        trackedSessions: 0,
        intentSessions: 0,
        events: 3,
        unattributedEvents: 3,
        byAction: { email_compose: 3 },
      },
    });

    const report = reportIntentRoutes(summary, 'en', EN_PATHS);

    expect(report.day).toBe('2026-09-01');
    expect(report.locale).toBe('en');
    expect(report.cohortDataStatus).toBe('available');
    expect(report.unattributedEvents).toBe(3);
    expect(report.unattributedEventsScope).toBe('day-global-not-route-specific');
    expect(report.ratioAllowed).toBe(true);
    expect(summary.totals.sessions).toBe(99);
    expect(report.rows.reduce((sum, row) => sum + row.sessions, 0)).toBe(10);
    expect(report.rows.map((row) => row.entryPath)).toEqual(EN_PATHS);
    expect(report.rows.find((row) => row.entryPath === '/en/other')).toBeUndefined();

    const home = report.rows[0];
    expect(home).toMatchObject({
      entryPath: '/en',
      observation: 'observed',
      sessions: 4,
      trackedSessions: 4,
      intentSessions: 0,
      byChannel: { direct: 4 },
      byCountryIp: { TW: 4 },
      observedTrackingCoverage: 1,
      intentRate: 0,
    });

    const lawyer = report.rows[1];
    expect(lawyer).toMatchObject({
      entryPath: '/en/taiwan-lawyer',
      observation: 'observed',
      sessions: 6,
      trackedSessions: 6,
      intentSessions: 1,
      byChannel: { direct: 2, search: 4 },
      byCountryIp: { US: 5, unknown: 1 },
      observedTrackingCoverage: 1,
      intentRate: 1 / 6,
    });
    expect(Object.keys(lawyer?.byCountryIp ?? {})).toContain('unknown');

    expect(report.rows[2]).toMatchObject({
      entryPath: '/en/taiwan-company-setup-lawyer',
      observation: 'absent-from-selected-paths',
      sessions: 0,
      trackedSessions: 0,
      intentSessions: 0,
      byChannel: {},
      byCountryIp: {},
      observedTrackingCoverage: null,
      intentRate: null,
    });
    expect(report.rows[3]).toMatchObject({
      entryPath: '/en/taiwan-litigation-lawyer',
      observation: 'absent-from-selected-paths',
      sessions: 0,
      intentRate: null,
    });

    expect(report.disclaimers.contactEmailClickIsNotAQualifiedLead).toBe(true);
    expect(report.disclaimers.noQualifiedLeadEstimate).toBe(true);
    expect(report.disclaimers.byCountryIpIsIpDerivedNotNationality).toBe(true);
    expect('qualifiedLeads' in report).toBe(false);
    expect('qualifiedLeadEstimate' in report).toBe(false);
    expect('qualifiedInquiryCount' in report).toBe(false);
    expect(report.rows.some((row) => 'nationality' in row || 'qualifiedLeads' in row)).toBe(false);
  });

  it('excludes paths that were not selected even when they have sessions', () => {
    const report = reportIntentRoutes(
      dailySummary({ day: '2026-09-01', acquisitionCohorts: mixedCohorts }),
      'en',
      ['/en/taiwan-lawyer'],
    );

    expect(report.rows).toHaveLength(1);
    expect(report.rows[0]?.entryPath).toBe('/en/taiwan-lawyer');
    expect(report.rows.some((row) => row.entryPath === '/en/other')).toBe(false);
    expect(report.rows.some((row) => row.entryPath === '/en')).toBe(false);
  });

  it('treats undefined acquisitionCohorts as unavailable, not zero success, and does not throw', () => {
    const summary = dailySummary({
      day: '2026-09-02',
      contactIntent: {
        trackingVersion: 1,
        trackedSessions: 0,
        intentSessions: 0,
        events: 2,
        unattributedEvents: 2,
        byAction: { email_compose: 2 },
      },
    });
    delete (summary as { acquisitionCohorts?: DailySummary['acquisitionCohorts'] }).acquisitionCohorts;

    const report = reportIntentRoutes(summary, 'en', EN_PATHS);

    expect(report.cohortDataStatus).toBe('unavailable');
    expect(report.rows).toEqual([]);
    expect(report.ratioAllowed).toBe(false);
    expect(report.unattributedEvents).toBe(2);
    expect(report.rows.every((row) => row.sessions === row.trackedSessions)).toBe(true);
  });

  it('does not treat an empty selected-path list as ratioAllowed true', () => {
    const report = reportIntentRoutes(
      dailySummary({ day: '2026-09-01', acquisitionCohorts: mixedCohorts }),
      'en',
      [],
    );

    expect(report.cohortDataStatus).toBe('available');
    expect(report.rows).toEqual([]);
    expect(report.ratioAllowed).toBe(false);
  });

  it('keeps selected paths with no matching cohort distinct from missing cohort data', () => {
    const report = reportIntentRoutes(
      dailySummary({ day: '2026-09-01', acquisitionCohorts: [] }),
      'en',
      ['/en/taiwan-lawyer'],
    );

    expect(report.cohortDataStatus).toBe('available');
    expect(report.rows).toEqual([
      {
        entryPath: '/en/taiwan-lawyer',
        observation: 'absent-from-selected-paths',
        sessions: 0,
        trackedSessions: 0,
        intentSessions: 0,
        byChannel: {},
        byCountryIp: {},
        observedTrackingCoverage: null,
        intentRate: null,
      },
    ]);
    expect(report.ratioAllowed).toBe(false);
  });

  it('flips ratioAllowed off when tracked coverage is incomplete and withholds intent rates', () => {
    const report = reportIntentRoutes(
      dailySummary({
        day: '2026-09-03',
        acquisitionCohorts: [
          cohort({
            country: 'US',
            locale: 'en',
            entryPath: '/en',
            channel: 'search',
            source: 'google',
            sessions: 4,
            trackedSessions: 2,
            intentSessions: 1,
          }),
        ],
      }),
      'en',
      ['/en'],
    );

    expect(report.ratioAllowed).toBe(false);
    expect(report.rows[0]).toMatchObject({
      sessions: 4,
      trackedSessions: 2,
      intentSessions: 1,
      observedTrackingCoverage: 0.5,
      intentRate: null,
    });
  });

  it('withholds rates when the only selected paths have a zero denominator', () => {
    const report = reportIntentRoutes(
      dailySummary({
        day: '2026-09-03',
        acquisitionCohorts: [
          cohort({
            country: 'US',
            locale: 'en',
            entryPath: '/en/other',
            channel: 'direct',
            source: null,
            sessions: 2,
            trackedSessions: 2,
            intentSessions: 1,
          }),
        ],
      }),
      'en',
      ['/en/taiwan-lawyer'],
    );

    expect(report.rows[0]?.sessions).toBe(0);
    expect(report.rows[0]?.intentRate).toBeNull();
    expect(report.ratioAllowed).toBe(false);
  });

  it('does not invent unattributedEvents=0 when contactIntent is absent', () => {
    const report = reportIntentRoutes(
      dailySummary({ day: '2026-09-04', acquisitionCohorts: mixedCohorts }),
      'en',
      EN_PATHS,
    );

    expect(report.unattributedEvents).toBeNull();
    expect(report.unattributedEventsScope).toBe('day-global-not-route-specific');
  });

  it('does not mutate the input summary or cohort objects', () => {
    const summary = dailySummary({
      day: '2026-09-01',
      acquisitionCohorts: mixedCohorts.map((item) => ({ ...item })),
    });
    const before = structuredClone(summary);

    reportIntentRoutes(summary, 'en', EN_PATHS);
    reportIntentRoutes(summary, 'en', ['/en/taiwan-lawyer?utm=x']);

    expect(summary).toEqual(before);
  });

  it('sanitizes selected entry paths the same way rollup stores them', () => {
    const report = reportIntentRoutes(
      dailySummary({ day: '2026-09-01', acquisitionCohorts: mixedCohorts }),
      'en',
      ['/en/taiwan-lawyer?utm=later#hero'],
    );

    expect(report.rows).toHaveLength(1);
    expect(report.rows[0]?.entryPath).toBe('/en/taiwan-lawyer');
    expect(report.rows[0]?.sessions).toBe(6);
  });
});

describe('parseDailySummaryJson', () => {
  it('accepts a summary object and rejects raw event arrays', () => {
    const parsed = parseDailySummaryJson(JSON.stringify({
      day: '2026-09-01',
      acquisitionCohorts: [
        {
          country: 'unknown',
          locale: 'en',
          entryPath: '/en',
          channel: 'direct',
          source: null,
          sessions: 1,
          trackedSessions: 1,
          intentSessions: 0,
        },
      ],
      contactIntent: { unattributedEvents: 0 },
    }));

    expect(parsed.day).toBe('2026-09-01');
    expect(parsed.acquisitionCohorts).toHaveLength(1);

    expect(() => parseDailySummaryJson('{"day":')).toThrow(/invalid JSON/);
    expect(() => parseDailySummaryJson('[]')).toThrow(/raw events are not accepted/);
    expect(() => parseDailySummaryJson('null')).toThrow(/expected a JSON object/);
    expect(() => parseDailySummaryJson('{"day":""}')).toThrow(/day must be a non-empty string/);
    expect(() => parseDailySummaryJson('{"day":"2026-09-01","acquisitionCohorts":{}}')).toThrow(/acquisitionCohorts must be an array/);
    expect(() => parseDailySummaryJson('{"day":"2026-09-01","contactIntent":[]}')).toThrow(/contactIntent must be an object/);
    expect(() => parseDailySummaryJson('{"day":"2026-09-01","acquisitionCohorts":[{"country":"US","locale":"en","entryPath":"/en","channel":"direct","source":null,"sessions":-1,"trackedSessions":0,"intentSessions":0}]}')).toThrow(/non-negative integer/);
    expect(() => parseDailySummaryJson('{"day":"2026-09-01","acquisitionCohorts":[{"country":"US","locale":"en","entryPath":"/en","channel":"direct","source":null,"sessions":2,"trackedSessions":3,"intentSessions":0}]}')).toThrow(/cannot exceed sessions/);
    expect(() => parseDailySummaryJson('{"day":"2026-09-01","acquisitionCohorts":[{"country":"US","locale":"en","entryPath":"/en","channel":"direct","source":null,"sessions":2,"trackedSessions":2,"intentSessions":3}]}')).toThrow(/cannot exceed trackedSessions/);
  });
});

describe('CLI argument parsing', () => {
  it('requires one explicit file and accepts locale/path flags', () => {
    expect(() => parseIntentRouteReportArgs([])).toThrow(/exactly one daily summary JSON file/);
    expect(parseIntentRouteReportArgs(['--help']).help).toBe(true);
    expect(parseIntentRouteReportArgs(['summary/2026-09-01.json'])).toEqual({
      help: false,
      filePath: 'summary/2026-09-01.json',
      locale: 'en',
      entryPaths: EN_PATHS,
    });
    expect(parseIntentRouteReportArgs([
      '--json',
      '--locale',
      'ja',
      'summary/2026-09-01.json',
      '--paths',
      '/ja,/ja/contact',
    ])).toEqual({
      help: false,
      filePath: 'summary/2026-09-01.json',
      locale: 'ja',
      entryPaths: ['/ja', '/ja/contact'],
    });
    expect(() => parseIntentRouteReportArgs(['--locale', 'fr', 'x.json'])).toThrow(/invalid --locale/);
    expect(() => resolveSummaryFileArgument('https://example.invalid/summary.json')).toThrow(/network or URI/);
    expect(() => resolveSummaryFileArgument('')).toThrow(/explicit JSON summary file is required/);
  });

  it('prints JSON without a qualified-lead estimate', () => {
    const report = reportIntentRoutes(
      dailySummary({ day: '2026-09-01', acquisitionCohorts: mixedCohorts }),
      'en',
      ['/en'],
    );
    const json = formatIntentRouteReportJson(report);
    expect(json.startsWith('{')).toBe(true);
    expect(json.endsWith('\n')).toBe(true);
    expect(json).toContain('"unattributedEventsScope": "day-global-not-route-specific"');
    const parsed = JSON.parse(json);
    expect(parsed).not.toHaveProperty('qualifiedLeads');
    expect(parsed).not.toHaveProperty('qualifiedLeadEstimate');
    expect(parsed).not.toHaveProperty('qualifiedInquiryCount');
    expect(parsed.disclaimers.noQualifiedLeadEstimate).toBe(true);
    expect(parsed.disclaimers.byCountryIpIsIpDerivedNotNationality).toBe(true);
    expect(parsed.rows[0].byCountryIp).toEqual({ TW: 4 });
    expect(parsed.rows[0]).not.toHaveProperty('nationality');
  });
});
