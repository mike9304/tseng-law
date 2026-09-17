#!/usr/bin/env node
// Prints a Korean digest of tseng-law.com visit metrics from metrics-local/.
// Data source: daily summaries pulled by scripts/pull-visit-metrics.mjs.
// Optional: Google Search Console CSV exports dropped in metrics-local/gsc/*.csv.
// Usage: node scripts/visit-report.mjs [--days 7] [--md]

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDirectory, '..');
const summaryDir = join(repoRoot, 'metrics-local', 'visits', 'summary');
const gscDir = join(repoRoot, 'metrics-local', 'gsc');

const CHANNEL_LABELS = {
  ai: 'AI 경유(리퍼러 분류)',
  search: '검색',
  social: '소셜',
  referral: '기타 유입링크',
  direct: '직접 방문',
  internal: '내부 이동',
};

function sumInto(target, source) {
  for (const [key, value] of Object.entries(source ?? {})) {
    target[key] = (target[key] ?? 0) + value;
  }
}

function sortedEntries(record) {
  return Object.entries(record).sort(
    (left, right) => right[1] - left[1] || (left[0] < right[0] ? -1 : 1),
  );
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isValidContactIntentSummary(contact) {
  return contact != null
    && typeof contact === 'object'
    && contact.trackingVersion === 1
    && isFiniteNumber(contact.trackedSessions)
    && isFiniteNumber(contact.intentSessions)
    && isFiniteNumber(contact.events)
    && isFiniteNumber(contact.unattributedEvents)
    && contact.byAction != null
    && typeof contact.byAction === 'object';
}

function isNeutralEmptyDay(summary) {
  return (summary?.totals?.pageviews ?? 0) === 0;
}

function sumCohortField(cohorts, field) {
  let total = 0;
  for (const cohort of cohorts) {
    total += Number(cohort?.[field]) || 0;
  }
  return total;
}

function formatCohortMetrics(cohort) {
  const sessions = cohort.sessions ?? 0;
  const tracked = cohort.trackedSessions ?? 0;
  const intent = cohort.intentSessions ?? 0;
  if (tracked === 0) {
    return `일별세션 ${sessions} · 측정 0/${sessions} · 이메일 작성 동작 미측정`;
  }
  if (tracked < sessions) {
    return `일별세션 ${sessions} · 측정 ${tracked}/${sessions} · 이메일 작성 동작 ${intent}`;
  }
  return `일별세션 ${sessions} · 측정 ${tracked} · 이메일 작성 동작 ${intent}`;
}

function cohortKey(cohort) {
  return [
    cohort.country,
    cohort.locale,
    cohort.entryPath,
    cohort.channel,
    cohort.source ?? '',
  ].join('\u0000');
}

export function aggregateSummaries(summaries) {
  const aggregate = {
    days: summaries.map((summary) => summary.day).sort(),
    totals: { pageviews: 0, sessions: 0, bounceSessions: 0, avgDwellMs: 0 },
    byChannel: {},
    bySource: {},
    aiBySource: {},
    aiLandingPages: {},
    byLocale: {},
    byCountry: {},
    localeSwitchSessions: 0,
    topPages: [],
    topEntryPages: [],
    keywords: [],
    contactCoverage: {
      status: 'unmeasured',
      measuredDays: 0,
      fieldDays: 0,
      totalDays: summaries.length,
      trackedSessions: 0,
      pageviewSessions: 0,
      missingDenominator: false,
      missingCohortDays: 0,
      intentSessions: 0,
      events: 0,
      unattributedEvents: 0,
      byAction: {},
    },
    acquisitionCohorts: [],
  };

  let dwellWeighted = 0;
  const pages = new Map();
  const entryPages = new Map();
  const keywords = new Map();
  const cohorts = new Map();
  let measuredDays = 0;
  let fieldDays = 0;
  let pageviewSessions = 0;
  let missingDenominator = false;
  let missingCohortDays = 0;
  let missingFields = false;
  let inconsistent = false;
  let mixedCohort = false;

  for (const summary of summaries) {
    aggregate.totals.pageviews += summary.totals.pageviews;
    aggregate.totals.sessions += summary.totals.sessions;
    aggregate.totals.bounceSessions += summary.totals.bounceSessions;
    dwellWeighted += summary.totals.avgDwellMs * summary.totals.sessions;
    aggregate.localeSwitchSessions += summary.localeSwitchSessions;
    sumInto(aggregate.byChannel, summary.byChannel);
    sumInto(aggregate.bySource, summary.bySource);
    sumInto(aggregate.aiBySource, summary.aiBySource);
    sumInto(aggregate.aiLandingPages, summary.aiLandingPages);
    sumInto(aggregate.byLocale, summary.byLocale);
    sumInto(aggregate.byCountry, summary.byCountry);

    for (const page of summary.topPages ?? []) {
      const existing = pages.get(page.path) ?? { views: 0, dwellWeighted: 0 };
      existing.views += page.views;
      existing.dwellWeighted += page.avgDwellMs * page.views;
      pages.set(page.path, existing);
    }
    for (const entry of summary.topEntryPages ?? []) {
      entryPages.set(entry.path, (entryPages.get(entry.path) ?? 0) + entry.count);
    }
    for (const keyword of summary.keywords ?? []) {
      const key = `${keyword.keyword}\u0000${keyword.source}`;
      keywords.set(key, (keywords.get(key) ?? 0) + keyword.count);
    }

    const contact = summary.contactIntent;
    const validFields = isValidContactIntentSummary(contact);
    const emptyDay = isNeutralEmptyDay(summary);
    const dayPageviews = summary.totals?.pageviews ?? 0;
    if (validFields) {
      fieldDays += 1;
    } else if (!emptyDay && dayPageviews > 0) {
      missingFields = true;
    }
    if (contact != null && typeof contact === 'object') {
      aggregate.contactCoverage.trackedSessions += Number(contact.trackedSessions) || 0;
      aggregate.contactCoverage.intentSessions += Number(contact.intentSessions) || 0;
      aggregate.contactCoverage.events += Number(contact.events) || 0;
      aggregate.contactCoverage.unattributedEvents += Number(contact.unattributedEvents) || 0;
      sumInto(aggregate.contactCoverage.byAction, contact.byAction);
      if ((Number(contact.trackedSessions) || 0) > 0) {
        measuredDays += 1;
      }
    }

    if (Array.isArray(summary.acquisitionCohorts)) {
      const dayCohortSessions = sumCohortField(summary.acquisitionCohorts, 'sessions');
      const dayCohortTracked = sumCohortField(summary.acquisitionCohorts, 'trackedSessions');
      const dayCohortIntent = sumCohortField(summary.acquisitionCohorts, 'intentSessions');
      pageviewSessions += dayCohortSessions;
      if (dayPageviews > 0 && dayCohortSessions === 0) {
        inconsistent = true;
      }
      if (validFields) {
        if (contact.trackedSessions !== dayCohortTracked) inconsistent = true;
        if (contact.intentSessions !== dayCohortIntent) inconsistent = true;
      }
      for (const cohort of summary.acquisitionCohorts) {
        const cohortSessions = cohort.sessions ?? 0;
        const cohortTracked = cohort.trackedSessions ?? 0;
        if (cohortTracked < cohortSessions) mixedCohort = true;
        if (cohortTracked > cohortSessions) inconsistent = true;
        const key = cohortKey(cohort);
        const existing = cohorts.get(key);
        if (existing) {
          existing.sessions += cohortSessions;
          existing.trackedSessions += cohortTracked;
          existing.intentSessions += cohort.intentSessions ?? 0;
        } else {
          cohorts.set(key, {
            country: cohort.country,
            locale: cohort.locale,
            entryPath: cohort.entryPath,
            channel: cohort.channel,
            source: cohort.source ?? null,
            sessions: cohortSessions,
            trackedSessions: cohortTracked,
            intentSessions: cohort.intentSessions ?? 0,
          });
        }
      }
    } else if (!emptyDay) {
      missingCohortDays += 1;
      if (dayPageviews > 0 || (Number(contact?.trackedSessions) || 0) > 0) {
        missingDenominator = true;
      }
    }
  }

  aggregate.totals.avgDwellMs = aggregate.totals.sessions === 0
    ? 0
    : Math.round(dwellWeighted / aggregate.totals.sessions);

  aggregate.topPages = [...pages.entries()]
    .map(([path, { views, dwellWeighted: weighted }]) => ({
      path,
      views,
      avgDwellMs: views === 0 ? 0 : Math.round(weighted / views),
    }))
    .sort((left, right) => right.views - left.views || (left.path < right.path ? -1 : 1))
    .slice(0, 20);

  aggregate.topEntryPages = [...entryPages.entries()]
    .map(([path, count]) => ({ path, count }))
    .sort((left, right) => right.count - left.count || (left.path < right.path ? -1 : 1))
    .slice(0, 10);

  aggregate.keywords = [...keywords.entries()]
    .map(([key, count]) => {
      const [keyword, source] = key.split('\u0000');
      return { keyword, source, count };
    })
    .sort((left, right) => right.count - left.count || (left.keyword < right.keyword ? -1 : 1))
    .slice(0, 20);

  aggregate.contactCoverage.measuredDays = measuredDays;
  aggregate.contactCoverage.fieldDays = fieldDays;
  aggregate.contactCoverage.totalDays = summaries.length;
  aggregate.contactCoverage.pageviewSessions = pageviewSessions;
  aggregate.contactCoverage.missingDenominator = missingDenominator;
  aggregate.contactCoverage.missingCohortDays = missingCohortDays;
  if (summaries.length === 0 || aggregate.contactCoverage.trackedSessions === 0) {
    aggregate.contactCoverage.status = 'unmeasured';
  } else if (
    missingFields
    || missingDenominator
    || inconsistent
    || mixedCohort
    || (pageviewSessions > 0 && aggregate.contactCoverage.trackedSessions !== pageviewSessions)
  ) {
    aggregate.contactCoverage.status = 'partial';
  } else {
    aggregate.contactCoverage.status = 'full';
  }

  aggregate.acquisitionCohorts = [...cohorts.values()].sort((left, right) => (
    (left.country < right.country ? -1 : left.country > right.country ? 1 : 0)
    || (left.locale < right.locale ? -1 : left.locale > right.locale ? 1 : 0)
    || (left.entryPath < right.entryPath ? -1 : left.entryPath > right.entryPath ? 1 : 0)
    || (left.channel < right.channel ? -1 : left.channel > right.channel ? 1 : 0)
    || ((left.source ?? '') < (right.source ?? '') ? -1 : (left.source ?? '') > (right.source ?? '') ? 1 : 0)
  ));

  return aggregate;
}

function splitCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (inQuotes) {
      if (char === '"' && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

const GSC_HEADER_ALIASES = {
  query: ['쿼리', '검색어', 'query', 'top queries'],
  clicks: ['클릭수', '클릭 수', 'clicks'],
  impressions: ['노출수', '노출 수', 'impressions'],
  position: ['평균 게재순위', '게재순위', 'position', 'average position'],
};

export function parseGscCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter((line) => line.trim() !== '');
  if (lines.length < 2) return [];
  const header = splitCsvLine(lines[0]).map((field) => field.trim().toLowerCase());
  const columnIndex = {};
  for (const [key, aliases] of Object.entries(GSC_HEADER_ALIASES)) {
    columnIndex[key] = header.findIndex((field) => aliases.includes(field));
  }
  if (columnIndex.query < 0) return [];

  return lines.slice(1).map((line) => {
    const fields = splitCsvLine(line);
    const numeric = (index) => {
      if (index < 0) return null;
      const value = Number(String(fields[index] ?? '').replace(/[,%]/g, ''));
      return Number.isFinite(value) ? value : null;
    };
    return {
      query: (fields[columnIndex.query] ?? '').trim(),
      clicks: numeric(columnIndex.clicks) ?? 0,
      impressions: numeric(columnIndex.impressions) ?? 0,
      position: numeric(columnIndex.position),
    };
  }).filter((row) => row.query !== '');
}

async function loadSummaries(days) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  let names;
  try {
    names = await readdir(summaryDir);
  } catch {
    return [];
  }
  const summaries = [];
  for (const name of names.sort()) {
    const match = name.match(/^(\d{4}-\d{2}-\d{2})\.json$/);
    if (!match || match[1] < cutoff) continue;
    try {
      summaries.push(JSON.parse(await readFile(join(summaryDir, name), 'utf8')));
    } catch {
      console.warn(`요약 파일 파싱 실패, 건너뜀: ${name}`);
    }
  }
  return summaries;
}

async function loadGscRows() {
  let names;
  try {
    names = await readdir(gscDir);
  } catch {
    return null;
  }
  const csvNames = names.filter((name) => name.toLowerCase().endsWith('.csv'));
  if (csvNames.length === 0) return null;
  const merged = new Map();
  for (const name of csvNames) {
    try {
      for (const row of parseGscCsv(await readFile(join(gscDir, name), 'utf8'))) {
        const existing = merged.get(row.query);
        if (existing) {
          existing.clicks += row.clicks;
          existing.impressions += row.impressions;
          if (row.position !== null) existing.position = row.position;
        } else {
          merged.set(row.query, { ...row });
        }
      }
    } catch {
      console.warn(`GSC CSV 파싱 실패, 건너뜀: ${name}`);
    }
  }
  return [...merged.values()]
    .sort((left, right) => right.clicks - left.clicks || right.impressions - left.impressions)
    .slice(0, 20);
}

function formatSeconds(ms) {
  return `${Math.round(ms / 1000)}초`;
}

function formatDistribution(record, total) {
  return sortedEntries(record)
    .map(([key, count]) => {
      const share = total === 0 ? 0 : Math.round((count / total) * 100);
      return `  - ${CHANNEL_LABELS[key] ?? key}: ${count} (${share}%)`;
    })
    .join('\n');
}

export function formatReport(aggregate, gscRows, days) {
  const { totals } = aggregate;
  const lines = [];
  const range = aggregate.days.length > 0
    ? `${aggregate.days[0]} ~ ${aggregate.days[aggregate.days.length - 1]} (UTC 일자 기준)`
    : `데이터 없음 (최근 ${days}일)`;

  lines.push(`# tseng-law.com 방문 리포트 — 최근 ${days}일`);
  lines.push(`기간: ${range}`);
  if (aggregate.days.length === 0) {
    lines.push('');
    lines.push('수집된 방문 데이터가 없습니다. (배포 후 크론 롤업 1회 이상 + pull 필요)');
    return lines.join('\n');
  }

  const bounceRate = totals.sessions === 0
    ? 0
    : Math.round((totals.bounceSessions / totals.sessions) * 100);
  lines.push('');
  lines.push('## ① 요약');
  lines.push(`  - 일별세션합계: ${totals.sessions} · 페이지뷰: ${totals.pageviews}`);
  lines.push('  - ※ 일별세션합계는 UTC 일자별 세션 수의 합이며, 기간 전체의 순 방문자(사람) 수가 아닙니다.');
  lines.push(`  - 평균 체류: ${formatSeconds(totals.avgDwellMs)}/세션 · 바운스율: ${bounceRate}%`);
  lines.push('');
  lines.push('## ② 유입 채널 (세션 진입 기준)');
  lines.push(formatDistribution(aggregate.byChannel, totals.sessions) || '  - 없음');
  lines.push('');
  lines.push('## ③ AI 경유 유입 상세 (리퍼러 분류)');
  if (Object.keys(aggregate.aiBySource).length === 0) {
    lines.push('  - AI 경유 유입 없음');
  } else {
    lines.push('  소스별:');
    lines.push(formatDistribution(aggregate.aiBySource, totals.sessions));
    lines.push('  AI 경유 랜딩 페이지:');
    for (const [path, count] of sortedEntries(aggregate.aiLandingPages)) {
      lines.push(`  - ${path}: ${count}`);
    }
  }
  lines.push('');
  lines.push('## ④ 유입 소스 (AI 제외 — AI는 ③ 참조)·수집 키워드');
  const nonAiSources = Object.fromEntries(
    Object.entries(aggregate.bySource)
      .filter(([source]) => !(source in aggregate.aiBySource)),
  );
  lines.push(formatDistribution(nonAiSources, totals.sessions) || '  - 없음');
  if (aggregate.keywords.length > 0) {
    lines.push('  수집된 키워드 톱20 (referrer 잔존분 — 구글 키워드는 ⑤ GSC 참조):');
    for (const { keyword, source, count } of aggregate.keywords) {
      lines.push(`  - "${keyword}" (${source}): ${count}`);
    }
  } else {
    lines.push('  수집된 referrer 키워드 없음 (구글은 referrer에 키워드를 싣지 않음 — ⑤ GSC 참조)');
  }
  lines.push('');
  lines.push('## ⑤ 구글 노출/클릭 (GSC)');
  if (gscRows === null) {
    lines.push('  GSC CSV 없음 — metrics-local/gsc/ 에 서치콘솔 실적 내보내기 CSV를 두면 병합됩니다.');
  } else {
    lines.push('  ※ GSC는 방문 리포트와 별도 집계입니다. 폴더의 여러 CSV를 합치므로, 겹치는 기간·필터로 내보내면 클릭/노출이 이중 집계될 수 있습니다. 국가×언어 교차 세그먼트(US×EN 등) 수치가 아닙니다.');
    if (gscRows.length === 0) {
      lines.push('  - 행 없음');
    } else {
      for (const row of gscRows) {
        const position = row.position === null ? '' : ` · 순위 ${row.position}`;
        lines.push(`  - "${row.query}": 클릭 ${row.clicks} · 노출 ${row.impressions}${position}`);
      }
    }
  }
  lines.push('');
  lines.push('## ⑥ 언어 선택');
  lines.push('  ※ locale은 페이지 언어이며 방문자 국적·모국어가 아닙니다.');
  lines.push(formatDistribution(aggregate.byLocale, totals.pageviews) || '  - 없음');
  lines.push(`  - 세션 중 언어 전환: ${aggregate.localeSwitchSessions}건`);
  lines.push('');
  lines.push('## ⑦ 국가 톱10');
  lines.push('  ※ 국가 코드는 요청 IP 국가이며 방문자 국적이 아닙니다.');
  const countries = sortedEntries(aggregate.byCountry).slice(0, 10);
  lines.push(
    countries.length > 0
      ? countries.map(([code, count]) => `  - ${code}: ${count}`).join('\n')
      : '  - 없음',
  );
  lines.push('');
  lines.push('## ⑧ 본 페이지 톱20 (뷰 · 평균 체류)');
  for (const page of aggregate.topPages) {
    lines.push(`  - ${page.path}: ${page.views}뷰 · ${formatSeconds(page.avgDwellMs)}`);
  }
  lines.push('  진입 페이지 톱10:');
  for (const entry of aggregate.topEntryPages) {
    lines.push(`  - ${entry.path}: ${entry.count}`);
  }
  lines.push('');
  lines.push('## ⑨ 이메일 작성 동작');
  lines.push('  ※ 이메일 작성 링크를 선택한 동작입니다. 메일 앱 실행·발송·수신·상담·수임을 확인한 값은 아닙니다.');
  const coverage = aggregate.contactCoverage;
  const fieldDays = coverage?.fieldDays ?? 0;
  const totalDays = coverage?.totalDays ?? 0;
  const trackedSessions = coverage?.trackedSessions ?? 0;
  const pageviewSessions = coverage?.pageviewSessions ?? 0;
  const missingDenominator = Boolean(coverage?.missingDenominator);
  const formatTrackedSessionsLine = (label) => {
    if (missingDenominator && pageviewSessions === 0) {
      return `  - ${label}: ${trackedSessions} / 분모 없음`;
    }
    if (missingDenominator) {
      return `  - ${label}: ${trackedSessions}/${pageviewSessions} (일부 일자 분모 없음)`;
    }
    return `  - ${label}: ${trackedSessions}/${pageviewSessions}`;
  };
  if (!coverage || coverage.status === 'unmeasured') {
    lines.push('  - 측정 범위: 미측정');
    if (fieldDays === 0) {
      lines.push('  - 요약에 contactIntent 필드가 없습니다. 0건이 아닙니다.');
    } else {
      lines.push(`  - 요약 필드 가용: ${fieldDays}/${totalDays}일 (필드 있음 ≠ 관측된 측정 세션)`);
    }
    if (missingDenominator && pageviewSessions === 0) {
      lines.push('  - 페이지뷰 세션 분모: 없음 (acquisitionCohorts 없는 일자 있음 — 0으로 채우지 않음)');
    } else {
      lines.push(formatTrackedSessionsLine('관측된 측정 세션'));
    }
    if ((coverage?.events ?? 0) > 0 || (coverage?.unattributedEvents ?? 0) > 0) {
      lines.push(`  - 관측된 이메일 작성 동작 이벤트: ${coverage.events} (귀속 불가 ${coverage.unattributedEvents})`);
    }
    lines.push('  - 실제 수신·자격·상담 접수·수임: 미측정');
  } else {
    if (coverage.status === 'partial') {
      lines.push(`  - 측정 범위: ${coverage.measuredDays}/${coverage.totalDays}일 측정 (부분 측정 — 미측정 일자는 0으로 채우지 않음)`);
    } else if (coverage.measuredDays === coverage.totalDays) {
      lines.push(`  - 측정 범위: ${coverage.measuredDays}/${coverage.totalDays}일 측정`);
    } else {
      lines.push('  - 측정 범위: 전체 측정 (페이지뷰 없는 일자는 측정 대상 아님)');
    }
    lines.push(`  - 요약 필드 가용: ${fieldDays}/${totalDays}일`);
    lines.push(formatTrackedSessionsLine('관측된 측정 세션 (pageview contactTracking=1)'));
    lines.push(`  - 이메일 작성 동작 일별세션합계: ${coverage.intentSessions}`);
    lines.push(`  - 이메일 작성 동작 이벤트: ${coverage.events} (같은 세션 반복 클릭 포함)`);
    lines.push(`  - 귀속 불가 이벤트: ${coverage.unattributedEvents}`);
    lines.push('  - 실제 수신·자격·상담 접수·수임: 미측정 (외부 확인된 출처 없음)');
  }
  lines.push('');
  lines.push('## ⑩ 국가(IP)×진입 언어 코호트');
  lines.push('  ※ 국가=요청 IP 국가, 언어=페이지 locale. 방문자 국적이 아닙니다.');
  lines.push('  ※ 세션은 그날 첫 페이지뷰 기준 1회만 귀속합니다. 이후 국가/언어/리퍼러 변경은 재귀속하지 않습니다.');
  lines.push('  ※ 여기 세션은 페이지뷰가 있는 일별세션입니다. ① 일별세션합계(engagement만 있는 세션 포함 가능)와 다를 수 있습니다.');
  const cohorts = aggregate.acquisitionCohorts ?? [];
  const missingCohortDays = coverage?.missingCohortDays ?? 0;
  if (cohorts.length === 0) {
    if (missingCohortDays > 0) {
      lines.push('  - 미측정');
    } else if (coverage?.status === 'partial') {
      lines.push('  - 측정된 일자에 코호트 없음 (미측정 일자는 0으로 채우지 않음)');
    } else {
      lines.push('  - 없음');
    }
  } else {
    if (missingCohortDays > 0) {
      lines.push('  ※ 코호트는 acquisitionCohorts가 있는 일자만 합산합니다. 없는 일자는 0으로 채우지 않습니다.');
    }
    for (const cohort of cohorts) {
      const channelLabel = CHANNEL_LABELS[cohort.channel] ?? cohort.channel;
      const sourceLabel = cohort.source ? cohort.source : '-';
      lines.push(
        `  - ${cohort.country} · ${cohort.locale} · ${cohort.entryPath} · ${channelLabel} · ${sourceLabel}: ${formatCohortMetrics(cohort)}`,
      );
    }
  }
  return lines.join('\n');
}

async function main() {
  const argv = process.argv.slice(2);
  const daysIndex = argv.indexOf('--days');
  const days = daysIndex >= 0 ? Number(argv[daysIndex + 1]) : 7;
  if (!Number.isInteger(days) || days < 1 || days > 400) {
    console.error(`--days는 1~400 정수여야 합니다: ${argv[daysIndex + 1]}`);
    process.exit(1);
  }

  const summaries = await loadSummaries(days);
  const aggregate = aggregateSummaries(summaries);
  const gscRows = await loadGscRows();
  const report = formatReport(aggregate, gscRows, days);

  console.log(report);
  if (argv.includes('--md')) {
    const stamp = new Date().toISOString().slice(0, 10).replaceAll('-', '');
    const outputPath = join(repoRoot, 'metrics-local', `report-${stamp}.md`);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${report}\n`, 'utf8');
    console.log(`\n저장됨: ${outputPath}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
