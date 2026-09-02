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
  ai: 'AI 추천',
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
  };

  let dwellWeighted = 0;
  const pages = new Map();
  const entryPages = new Map();
  const keywords = new Map();

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
  lines.push(`  - 방문(세션): ${totals.sessions} · 페이지뷰: ${totals.pageviews}`);
  lines.push(`  - 평균 체류: ${formatSeconds(totals.avgDwellMs)}/세션 · 바운스율: ${bounceRate}%`);
  lines.push('');
  lines.push('## ② 유입 채널 (세션 진입 기준)');
  lines.push(formatDistribution(aggregate.byChannel, totals.sessions) || '  - 없음');
  lines.push('');
  lines.push('## ③ AI 추천 유입 상세');
  if (Object.keys(aggregate.aiBySource).length === 0) {
    lines.push('  - AI 유입 없음');
  } else {
    lines.push('  소스별:');
    lines.push(formatDistribution(aggregate.aiBySource, totals.sessions));
    lines.push('  AI 유입 랜딩 페이지:');
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
    for (const row of gscRows) {
      const position = row.position === null ? '' : ` · 순위 ${row.position}`;
      lines.push(`  - "${row.query}": 클릭 ${row.clicks} · 노출 ${row.impressions}${position}`);
    }
  }
  lines.push('');
  lines.push('## ⑥ 언어 선택');
  lines.push(formatDistribution(aggregate.byLocale, totals.pageviews) || '  - 없음');
  lines.push(`  - 세션 중 언어 전환: ${aggregate.localeSwitchSessions}건`);
  lines.push('');
  lines.push('## ⑦ 국가 톱10');
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
