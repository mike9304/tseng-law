import assert from 'node:assert/strict';
import { test } from 'node:test';

import { aggregateSummaries, formatReport, parseGscCsv } from './visit-report.mjs';

function summaryFixture(day, overrides = {}) {
  return {
    day,
    totals: { pageviews: 10, sessions: 4, avgDwellMs: 20_000, bounceSessions: 1 },
    byChannel: { search: 2, ai: 1, direct: 1 },
    bySource: { naver: 2, chatgpt: 1 },
    aiBySource: { chatgpt: 1 },
    aiLandingPages: { '/ko/korean-lawyer-in-taiwan': 1 },
    byLocale: { ko: 8, en: 2 },
    byCountry: { KR: 3, TW: 1 },
    topPages: [
      { path: '/ko', views: 6, avgDwellMs: 30_000 },
      { path: '/ko/lawyers', views: 4, avgDwellMs: 10_000 },
    ],
    topEntryPages: [{ path: '/ko', count: 3 }, { path: '/ko/lawyers', count: 1 }],
    keywords: [{ keyword: '대만 변호사', source: 'naver', count: 2 }],
    localeSwitchSessions: 1,
    ...overrides,
  };
}

test('aggregateSummaries merges two days', () => {
  const aggregate = aggregateSummaries([
    summaryFixture('2026-08-30'),
    summaryFixture('2026-08-31', {
      totals: { pageviews: 20, sessions: 6, avgDwellMs: 30_000, bounceSessions: 2 },
      keywords: [
        { keyword: '대만 변호사', source: 'naver', count: 1 },
        { keyword: '대만 법인설립', source: 'daum', count: 1 },
      ],
    }),
  ]);

  assert.deepEqual(aggregate.days, ['2026-08-30', '2026-08-31']);
  assert.equal(aggregate.totals.pageviews, 30);
  assert.equal(aggregate.totals.sessions, 10);
  assert.equal(aggregate.totals.bounceSessions, 3);
  // Weighted mean: (20000*4 + 30000*6) / 10
  assert.equal(aggregate.totals.avgDwellMs, 26_000);
  assert.deepEqual(aggregate.byChannel, { search: 4, ai: 2, direct: 2 });
  assert.equal(aggregate.localeSwitchSessions, 2);
});

test('aggregateSummaries keeps multi-word keywords intact and sums counts', () => {
  const aggregate = aggregateSummaries([
    summaryFixture('2026-08-30'),
    summaryFixture('2026-08-31'),
  ]);

  assert.deepEqual(aggregate.keywords[0], {
    keyword: '대만 변호사',
    source: 'naver',
    count: 4,
  });
});

test('aggregateSummaries merges top pages with view-weighted dwell', () => {
  const aggregate = aggregateSummaries([
    summaryFixture('2026-08-30'),
    summaryFixture('2026-08-31', {
      topPages: [{ path: '/ko', views: 2, avgDwellMs: 60_000 }],
    }),
  ]);

  const home = aggregate.topPages.find((page) => page.path === '/ko');
  // (30000*6 + 60000*2) / 8
  assert.deepEqual(home, { path: '/ko', views: 8, avgDwellMs: 37_500 });
  const lawyers = aggregate.topPages.find((page) => page.path === '/ko/lawyers');
  assert.deepEqual(lawyers, { path: '/ko/lawyers', views: 4, avgDwellMs: 10_000 });
});

test('aggregateSummaries handles empty input', () => {
  const aggregate = aggregateSummaries([]);
  assert.deepEqual(aggregate.days, []);
  assert.equal(aggregate.totals.sessions, 0);
  assert.equal(aggregate.totals.avgDwellMs, 0);
  assert.deepEqual(aggregate.topPages, []);
});

test('parseGscCsv reads Korean headers with BOM', () => {
  const csv = '\uFEFF' + '쿼리,클릭수,노출수,CTR,평균 게재순위\n"대만 변호사",12,340,3.5%,8.2\n대만 법인설립,5,120,4.1%,12.9\n';
  const rows = parseGscCsv(csv);
  assert.equal(rows.length, 2);
  assert.deepEqual(rows[0], {
    query: '대만 변호사',
    clicks: 12,
    impressions: 340,
    position: 8.2,
  });
});

test('parseGscCsv reads English headers', () => {
  const csv = 'Query,Clicks,Impressions,CTR,Position\ntaiwan lawyer,3,80,3.7%,15.1\n';
  const rows = parseGscCsv(csv);
  assert.deepEqual(rows, [
    { query: 'taiwan lawyer', clicks: 3, impressions: 80, position: 15.1 },
  ]);
});

test('parseGscCsv returns empty for unknown headers', () => {
  assert.deepEqual(parseGscCsv('foo,bar\n1,2\n'), []);
});

function contactIntentFields(overrides = {}) {
  return {
    trackingVersion: 1,
    trackedSessions: 2,
    intentSessions: 1,
    events: 2,
    unattributedEvents: 0,
    byAction: { email_compose: 2 },
    ...overrides,
  };
}

function cohortFixture(overrides = {}) {
  return {
    country: 'US',
    locale: 'en',
    entryPath: '/en/contact',
    channel: 'search',
    source: 'google',
    sessions: 2,
    trackedSessions: 2,
    intentSessions: 1,
    ...overrides,
  };
}

test('legacy summaries stay unmeasured instead of reporting 0 email compose actions', () => {
  const aggregate = aggregateSummaries([
    summaryFixture('2026-08-30'),
    summaryFixture('2026-08-31'),
  ]);
  assert.equal(aggregate.contactCoverage.status, 'unmeasured');
  assert.equal(aggregate.contactCoverage.measuredDays, 0);
  assert.equal(aggregate.contactCoverage.intentSessions, 0);
  const report = formatReport(aggregate, null, 7);
  assert.match(report, /일별세션합계/);
  assert.match(report, /이메일 작성 동작/);
  assert.match(report, /미측정/);
  assert.match(report, /AI 경유\(리퍼러 분류\)/);
  assert.doesNotMatch(report, /AI 추천/);
  assert.doesNotMatch(report, /이메일 작성 동작 일별세션합계: 0/);
});

test('mixed coverage is partial and does not zero-fill unmeasured days', () => {
  const aggregate = aggregateSummaries([
    summaryFixture('2026-08-30'),
    summaryFixture('2026-08-31', {
      totals: { pageviews: 4, sessions: 4, avgDwellMs: 30_000, bounceSessions: 2 },
      contactIntent: contactIntentFields({ trackedSessions: 4, intentSessions: 2, events: 3 }),
      acquisitionCohorts: [cohortFixture({ sessions: 4, trackedSessions: 4, intentSessions: 2 })],
    }),
  ]);
  assert.equal(aggregate.contactCoverage.status, 'partial');
  assert.equal(aggregate.contactCoverage.measuredDays, 1);
  assert.equal(aggregate.contactCoverage.fieldDays, 1);
  assert.equal(aggregate.contactCoverage.totalDays, 2);
  assert.equal(aggregate.contactCoverage.intentSessions, 2);
  assert.equal(aggregate.contactCoverage.trackedSessions, 4);
  const report = formatReport(aggregate, null, 7);
  assert.match(report, /부분 측정/);
  assert.match(report, /이메일 작성 동작 일별세션합계: 2/);
  assert.match(report, /US · en · \/en\/contact/);
});

test('fully instrumented summaries report email compose intent counts', () => {
  const aggregate = aggregateSummaries([
    summaryFixture('2026-08-30', {
      totals: { pageviews: 2, sessions: 2, avgDwellMs: 20_000, bounceSessions: 0 },
      contactIntent: contactIntentFields(),
      acquisitionCohorts: [cohortFixture()],
    }),
    summaryFixture('2026-08-31', {
      totals: { pageviews: 1, sessions: 1, avgDwellMs: 30_000, bounceSessions: 1 },
      contactIntent: contactIntentFields({
        trackedSessions: 1,
        intentSessions: 0,
        events: 0,
        unattributedEvents: 0,
        byAction: {},
      }),
      acquisitionCohorts: [
        cohortFixture({
          country: 'JP',
          locale: 'ja',
          entryPath: '/ja/contact',
          channel: 'direct',
          source: null,
          sessions: 1,
          trackedSessions: 1,
          intentSessions: 0,
        }),
      ],
    }),
  ]);
  assert.equal(aggregate.contactCoverage.status, 'full');
  assert.equal(aggregate.contactCoverage.fieldDays, 2);
  assert.equal(aggregate.contactCoverage.measuredDays, 2);
  assert.equal(aggregate.contactCoverage.trackedSessions, 3);
  assert.equal(aggregate.contactCoverage.pageviewSessions, 3);
  assert.equal(aggregate.contactCoverage.intentSessions, 1);
  assert.equal(aggregate.contactCoverage.events, 2);
  assert.equal(aggregate.contactCoverage.unattributedEvents, 0);
  assert.equal(aggregate.acquisitionCohorts.length, 2);
  const report = formatReport(aggregate, null, 7);
  assert.match(report, /2\/2일 측정/);
  assert.match(report, /이메일 작성 동작 일별세션합계: 1/);
  assert.match(report, /이메일 작성 링크를 선택한 동작입니다/);
  assert.match(report, /메일 앱 실행·발송·수신·상담·수임을 확인한 값은 아닙니다/);
  assert.match(report, /실제 수신·자격·상담 접수·수임: 미측정/);
  assert.doesNotMatch(report, /메일 앱\/작성창을 연 동작입니다/);
  assert.doesNotMatch(report, /전환율/);
});

test('reprocessed old events with untracked cohorts stay unmeasured', () => {
  const aggregate = aggregateSummaries([
    summaryFixture('2026-08-30', {
      totals: { pageviews: 1, sessions: 1, avgDwellMs: 0, bounceSessions: 1 },
      contactIntent: contactIntentFields({
        trackedSessions: 0,
        intentSessions: 0,
        events: 0,
        unattributedEvents: 0,
        byAction: {},
      }),
      acquisitionCohorts: [
        cohortFixture({ sessions: 1, trackedSessions: 0, intentSessions: 0 }),
      ],
    }),
  ]);
  assert.equal(aggregate.contactCoverage.status, 'unmeasured');
  assert.equal(aggregate.contactCoverage.measuredDays, 0);
  assert.equal(aggregate.contactCoverage.fieldDays, 1);
  assert.equal(aggregate.contactCoverage.trackedSessions, 0);
  assert.equal(aggregate.contactCoverage.pageviewSessions, 1);
  assert.equal(aggregate.acquisitionCohorts.length, 1);
  const report = formatReport(aggregate, null, 7);
  assert.match(report, /미측정/);
  assert.match(report, /US · en · \/en\/contact/);
  assert.match(report, /이메일 작성 동작 미측정/);
  assert.doesNotMatch(report, /이메일 작성 동작 일별세션합계: 0/);
});

test('empty summaries keep the existing empty report and do not invent contacts', () => {
  const aggregate = aggregateSummaries([]);
  assert.deepEqual(aggregate.days, []);
  assert.equal(aggregate.contactCoverage.status, 'unmeasured');
  const report = formatReport(aggregate, null, 7);
  assert.match(report, /수집된 방문 데이터가 없습니다/);
  assert.doesNotMatch(report, /이메일 작성 동작 일별세션합계: 0/);
});

test('same-day mixed tracked and legacy pageview sessions are partial', () => {
  const aggregate = aggregateSummaries([
    summaryFixture('2026-08-30', {
      totals: { pageviews: 2, sessions: 2, avgDwellMs: 0, bounceSessions: 2 },
      contactIntent: contactIntentFields({
        trackedSessions: 1,
        intentSessions: 1,
        events: 1,
        unattributedEvents: 0,
        byAction: { email_compose: 1 },
      }),
      acquisitionCohorts: [
        cohortFixture({ sessions: 2, trackedSessions: 1, intentSessions: 1 }),
      ],
    }),
  ]);
  assert.equal(aggregate.contactCoverage.status, 'partial');
  assert.equal(aggregate.contactCoverage.measuredDays, 1);
  assert.equal(aggregate.contactCoverage.trackedSessions, 1);
  assert.equal(aggregate.contactCoverage.pageviewSessions, 2);
  assert.equal(aggregate.contactCoverage.intentSessions, 1);
  const report = formatReport(aggregate, null, 7);
  assert.match(report, /부분 측정/);
  assert.match(report, /측정 1\/2/);
  assert.match(report, /이메일 작성 동작 일별세션합계: 1/);
});

test('genuinely tracked sessions with no email click are measured zeros', () => {
  const aggregate = aggregateSummaries([
    summaryFixture('2026-08-30', {
      totals: { pageviews: 1, sessions: 1, avgDwellMs: 0, bounceSessions: 1 },
      contactIntent: contactIntentFields({
        trackedSessions: 1,
        intentSessions: 0,
        events: 0,
        unattributedEvents: 0,
        byAction: {},
      }),
      acquisitionCohorts: [
        cohortFixture({ sessions: 1, trackedSessions: 1, intentSessions: 0 }),
      ],
    }),
  ]);
  assert.equal(aggregate.contactCoverage.status, 'full');
  assert.equal(aggregate.contactCoverage.measuredDays, 1);
  assert.equal(aggregate.contactCoverage.fieldDays, 1);
  assert.equal(aggregate.contactCoverage.trackedSessions, 1);
  assert.equal(aggregate.contactCoverage.pageviewSessions, 1);
  assert.equal(aggregate.contactCoverage.intentSessions, 0);
  const report = formatReport(aggregate, null, 7);
  assert.match(report, /이메일 작성 동작 일별세션합계: 0/);
  assert.match(report, /관측된 측정 세션 \(pageview contactTracking=1\): 1\/1/);
  assert.doesNotMatch(report, /측정 범위: 미측정/);
});

test('tracked sessions without cohort denominator are partial', () => {
  const aggregate = aggregateSummaries([
    summaryFixture('2026-08-30', {
      totals: { pageviews: 3, sessions: 3, avgDwellMs: 0, bounceSessions: 0 },
      contactIntent: contactIntentFields({
        trackedSessions: 3,
        intentSessions: 1,
        events: 1,
        unattributedEvents: 0,
        byAction: { email_compose: 1 },
      }),
    }),
  ]);
  assert.equal(aggregate.contactCoverage.status, 'partial');
  assert.equal(aggregate.contactCoverage.trackedSessions, 3);
  assert.equal(aggregate.contactCoverage.pageviewSessions, 0);
  assert.equal(aggregate.contactCoverage.missingDenominator, true);
  assert.equal(aggregate.acquisitionCohorts.length, 0);
  const report = formatReport(aggregate, null, 7);
  assert.match(report, /부분 측정/);
  assert.match(report, /분모/);
  assert.match(report, /이메일 작성 동작 일별세션합계: 1/);
});

test('contact-only orphan events stay visible without inventing tracked sessions', () => {
  const aggregate = aggregateSummaries([
    summaryFixture('2026-08-30', {
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
      contactIntent: contactIntentFields({
        trackedSessions: 0,
        intentSessions: 0,
        events: 1,
        unattributedEvents: 1,
        byAction: { email_compose: 1 },
      }),
      acquisitionCohorts: [],
    }),
  ]);
  assert.equal(aggregate.contactCoverage.status, 'unmeasured');
  assert.equal(aggregate.contactCoverage.trackedSessions, 0);
  assert.equal(aggregate.contactCoverage.intentSessions, 0);
  assert.equal(aggregate.contactCoverage.events, 1);
  assert.equal(aggregate.contactCoverage.unattributedEvents, 1);
  assert.equal(aggregate.acquisitionCohorts.length, 0);
  const report = formatReport(aggregate, null, 7);
  assert.match(report, /미측정/);
  assert.match(report, /관측된 이메일 작성 동작 이벤트: 1/);
  assert.match(report, /귀속 불가 1/);
  assert.doesNotMatch(report, /이메일 작성 동작 일별세션합계: 0/);
  assert.doesNotMatch(report, /관측된 측정 세션 \(pageview contactTracking=1\): 0/);
});

test('formatReport notes GSC overlap double-count risk without changing parser behavior', () => {
  const aggregate = aggregateSummaries([summaryFixture('2026-08-30')]);
  const report = formatReport(
    aggregate,
    [{ query: '대만 변호사', clicks: 12, impressions: 340, position: 8.2 }],
    7,
  );
  assert.match(report, /이중 집계/);
  assert.match(report, /교차 세그먼트/);
  assert.match(report, /"대만 변호사": 클릭 12 · 노출 340 · 순위 8.2/);
});
