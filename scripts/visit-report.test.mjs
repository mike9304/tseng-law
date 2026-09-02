import assert from 'node:assert/strict';
import { test } from 'node:test';

import { aggregateSummaries, parseGscCsv } from './visit-report.mjs';

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
