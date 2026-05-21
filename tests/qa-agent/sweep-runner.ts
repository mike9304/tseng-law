import { chromium } from '@playwright/test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { checkOllama, ollamaVisionReview, ollamaTextGenerate } from './llm/ollama';
import { parseVisionResponse } from './llm/vision-reviewer';
import { loadCheckpoints, type WCheckpoint } from './checkpoint-catalog';
import { STATIONS, type Station } from './stations';
import type { CheckpointFinding } from './types';

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USERNAME = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
const PASSWORD = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
const REPORT_ROOT = process.env.QA_REPORT_ROOT ?? path.resolve(process.cwd(), 'qa-reports');
const VISION_MODEL = process.env.QA_VISION_MODEL ?? 'qwen2.5vl:32b';
const TEXT_MODEL = process.env.QA_TEXT_MODEL ?? 'exaone3.5:32b';

interface StationResult {
  station: Station;
  navOk: boolean;
  navNote?: string;
  screenshots: { label: string; path: string }[];
  findings: CheckpointFinding[];
  relatedW: WCheckpoint[];
  durationMs: number;
}

function tsSlug(d: Date): string {
  return d.toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

function buildSweepPrompt(station: Station, relatedW: WCheckpoint[]): string {
  const wLines = relatedW
    .map((w) => `- ${w.id} (${w.rawStatus}): ${w.title} | 검증법: ${w.verification}`)
    .join('\n');
  return `당신은 Wix 같은 사이트 빌더의 시각 QA 전문가입니다.
지금 보고 있는 화면 station: ${station.id} — ${station.name}
설명: ${station.description}

이 화면에서 사용자가 수행해야 할 작업 (해당 W 체크포인트들):
${wLines}

이 스크린샷을 보고, 위 작업들을 사용자가 실제로 수행할 수 있을 것 같은지, 그리고 시각/UX 면에서 어떤 점이 우려되는지 평가하세요.

규칙:
- "OK"나 "이슈 없음"으로 끝내지 마세요.
- 반드시 정확히 5가지 관찰 사항을 적으세요.
- 각 항목은 다음 형식 한 줄로:

[severity] summary

severity는 blocker / visual / minor / note 중 하나.
- blocker: 사용자가 작업을 수행할 수 없는 명백한 결함
- visual: 색/정렬/간격/대비 등 시각적 어긋남
- minor: 사소한 폴리시
- note: 정상이지만 짚어둘 만한 관찰 (긍정/특이점)

상상이나 일반론 금지. 스크린샷에 실제로 보이는 것에만 근거하세요.`;
}

async function captureStation(
  page: import('@playwright/test').Page,
  station: Station,
  dir: string,
): Promise<{ navOk: boolean; navNote?: string; screenshots: { label: string; path: string }[] }> {
  await fs.mkdir(dir, { recursive: true });
  const screenshots: { label: string; path: string }[] = [];
  const nav = await station.navigate(page, BASE_URL).catch((err: Error) => ({ ok: false, note: err.message }));
  await page.waitForTimeout(500);
  const file = path.join(dir, '01-after-nav.png');
  await page.screenshot({ path: file, fullPage: false }).catch(() => undefined);
  screenshots.push({ label: 'after-nav', path: file });
  return { navOk: nav.ok, navNote: nav.note, screenshots };
}

async function reviewStation(
  station: Station,
  relatedW: WCheckpoint[],
  screenshots: { label: string; path: string }[],
  ollamaAvailable: boolean,
): Promise<CheckpointFinding[]> {
  if (!ollamaAvailable || screenshots.length === 0) return [];
  const prompt = buildSweepPrompt(station, relatedW);
  const all: CheckpointFinding[] = [];
  for (const shot of screenshots) {
    try {
      const response = await ollamaVisionReview({
        model: VISION_MODEL,
        imagePath: shot.path,
        prompt,
        timeoutMs: 180_000,
      });
      if (process.env.QA_DEBUG_VISION === '1') {
        // eslint-disable-next-line no-console
        console.log(`[vision ${station.id}/${shot.label}]\n${response}\n[/vision]`);
      }
      const parsed = parseVisionResponse(response);
      for (const f of parsed) {
        all.push({ ...f, summary: `[${station.id}] ${f.summary}` });
      }
    } catch (err) {
      all.push({
        severity: 'minor',
        summary: `[${station.id}] vision 호출 실패`,
        detail: (err as Error).message,
      });
    }
  }
  return all;
}

function writeSweepReport(
  reportDir: string,
  startedAt: Date,
  finishedAt: Date,
  results: StationResult[],
): Promise<void> {
  const lines: string[] = [];
  const totals = {
    stations: results.length,
    navOk: results.filter((r) => r.navOk).length,
    navFail: results.filter((r) => !r.navOk).length,
    findings: results.reduce((acc, r) => acc + r.findings.length, 0),
    blockers: results.reduce((acc, r) => acc + r.findings.filter((f) => f.severity === 'blocker').length, 0),
  };
  lines.push('# QA Agent — Station Sweep Report');
  lines.push('');
  lines.push(`- Base URL: \`${BASE_URL}\``);
  lines.push(`- Started: ${startedAt.toISOString()}`);
  lines.push(`- Finished: ${finishedAt.toISOString()}`);
  lines.push(`- Duration: ${((finishedAt.getTime() - startedAt.getTime()) / 1000).toFixed(1)}s`);
  lines.push(`- Stations: ${totals.stations} (nav OK ${totals.navOk}, fail ${totals.navFail})`);
  lines.push(`- Vision findings: ${totals.findings} (blockers ${totals.blockers})`);
  lines.push('');

  lines.push('## Stations 표면 매트릭스');
  lines.push('');
  lines.push('| Station | 화면 | Nav | 관련 W | 발견 |');
  lines.push('|---|---|---|---|---|');
  for (const r of results) {
    const wIds = r.relatedW.map((w) => `${w.id}${w.status === 'green' ? '🟢' : w.status === 'pending-user-qa' ? '🟡' : ''}`).join(', ');
    const nav = r.navOk ? '✅' : `❌ ${r.navNote ?? ''}`;
    lines.push(`| ${r.station.id} | ${r.station.name} | ${nav} | ${wIds} | ${r.findings.length} |`);
  }
  lines.push('');

  lines.push('## Vision Findings (station별)');
  lines.push('');
  for (const r of results) {
    if (r.findings.length === 0 && r.navOk) continue;
    lines.push(`### ${r.station.id} — ${r.station.name}`);
    lines.push('');
    lines.push(`- 설명: ${r.station.description}`);
    lines.push(`- 관련 W: ${r.relatedW.map((w) => w.id).join(', ') || '(없음)'}`);
    if (!r.navOk) {
      lines.push(`- ⚠️ Nav 실패: ${r.navNote ?? '(원인 미상)'}`);
    }
    lines.push('');
    if (r.findings.length > 0) {
      lines.push('**관찰 사항:**');
      lines.push('');
      for (const f of r.findings) {
        const badge = f.severity === 'blocker' ? '🔴' : f.severity === 'visual' ? '🟡' : f.severity === 'minor' ? '⚪' : '🔵';
        lines.push(`- ${badge} **${f.severity}** — ${f.summary}`);
        if (f.detail) lines.push(`  - ${f.detail}`);
      }
      lines.push('');
    }
    if (r.screenshots.length > 0) {
      const rel = path.relative(reportDir, r.screenshots[0].path);
      lines.push(`![${r.station.id}](${rel})`);
      lines.push('');
    }
  }

  return fs.writeFile(path.join(reportDir, 'sweep-report.md'), lines.join('\n'), 'utf8');
}

async function main(): Promise<void> {
  const startedAt = new Date();
  console.log(`[qa-sweep] starting against ${BASE_URL}`);

  const ollama = await checkOllama();
  if (!ollama.available) {
    console.warn(`[qa-sweep] ollama unavailable: ${ollama.error}`);
  } else {
    console.log(`[qa-sweep] ollama models: ${ollama.models.join(', ')}`);
  }

  const checkpoints = await loadCheckpoints();
  const byId = new Map(checkpoints.map((c) => [c.id, c]));
  console.log(`[qa-sweep] loaded ${checkpoints.length} W checkpoints`);

  const reportDir = path.join(REPORT_ROOT, `sweep-${tsSlug(startedAt)}`);
  await fs.mkdir(reportDir, { recursive: true });

  const filter = (process.env.QA_STATIONS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const targets = filter.length > 0 ? STATIONS.filter((s) => filter.includes(s.id)) : STATIONS;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    baseURL: BASE_URL,
    viewport: { width: 1440, height: 1000 },
    httpCredentials: { username: USERNAME, password: PASSWORD },
  });

  const results: StationResult[] = [];
  try {
    for (const station of targets) {
      console.log(`[qa-sweep] ${station.id} ${station.name}`);
      const t0 = Date.now();
      const page = await context.newPage();
      const stationDir = path.join(reportDir, 'screenshots', station.id);
      const capture = await captureStation(page, station, stationDir).catch((err: Error) => ({
        navOk: false,
        navNote: err.message,
        screenshots: [],
      }));
      const relatedW = station.relatedW.map((wid) => byId.get(wid)).filter((w): w is WCheckpoint => Boolean(w));
      let findings: CheckpointFinding[] = [];
      if (capture.navOk) {
        findings = await reviewStation(station, relatedW, capture.screenshots, ollama.available);
      }
      console.log(`[qa-sweep]   nav=${capture.navOk ? 'ok' : 'fail'} findings=${findings.length}`);
      results.push({
        station,
        navOk: capture.navOk,
        navNote: capture.navNote,
        screenshots: capture.screenshots,
        findings,
        relatedW,
        durationMs: Date.now() - t0,
      });
      await page.close().catch(() => undefined);
    }
  } finally {
    await context.close().catch(() => undefined);
    await browser.close().catch(() => undefined);
  }

  const finishedAt = new Date();
  await writeSweepReport(reportDir, startedAt, finishedAt, results);
  console.log(`[qa-sweep] report: ${reportDir}/sweep-report.md`);

  if (ollama.available && ollama.models.includes(TEXT_MODEL)) {
    try {
      console.log('[qa-sweep] generating Korean priority summary via exaone...');
      const lines: string[] = [];
      lines.push('다음은 호정 사이트 빌더의 핵심 화면 station들에 대한 시각 QA 관찰 사항입니다.');
      lines.push('각 관찰 사항을 (1) 우선순위 (P0/P1/P2), (2) 영향받는 W 체크포인트, (3) Claude가 수정 시 먼저 봐야 할 영역 (인스펙터/캔버스/라우트/스토어 등) 으로 묶어 정리해주세요.');
      lines.push('blocker → P0, visual → P1, minor/note → P2로 매핑. 중복은 합치세요.');
      lines.push('출력은 한국어 마크다운으로 간결하게.');
      lines.push('');
      for (const r of results) {
        if (r.findings.length === 0) continue;
        lines.push(`### ${r.station.id} ${r.station.name} (관련 W: ${r.relatedW.map((w) => w.id).join(', ')})`);
        for (const f of r.findings) {
          lines.push(`- [${f.severity}] ${f.summary}`);
        }
      }
      const summary = await ollamaTextGenerate({ model: TEXT_MODEL, prompt: lines.join('\n'), timeoutMs: 180_000 });
      await fs.writeFile(path.join(reportDir, 'sweep-summary.ko.md'), summary, 'utf8');
      console.log(`[qa-sweep] summary: ${reportDir}/sweep-summary.ko.md`);
    } catch (err) {
      console.warn(`[qa-sweep] summary failed: ${(err as Error).message}`);
    }
  }

  console.log(`[qa-sweep] done. ${results.length} stations.`);
}

main().catch((err) => {
  console.error('[qa-sweep] fatal:', err);
  process.exit(1);
});
