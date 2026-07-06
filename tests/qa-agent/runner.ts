import { execSync } from 'node:child_process';
import { chromium, type BrowserContext, type Page } from '@playwright/test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { writeReport } from './reporter';
import { checkOllama } from './llm/ollama';
import { reviewCheckpointVisually, summarizeForClaude } from './llm/vision-reviewer';
import type {
  CheckpointContext,
  CheckpointDefinition,
  CheckpointEvidence,
  CheckpointFinding,
  CheckpointResult,
} from './types';
import { ALL_CHECKPOINTS } from './checkpoint-registry';

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USERNAME = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
const PASSWORD = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
const REPORT_ROOT = process.env.QA_REPORT_ROOT ?? path.resolve(process.cwd(), 'qa-reports');
const ENABLE_VISION = process.env.QA_DISABLE_VISION !== '1';
const ENABLE_SUMMARY = process.env.QA_DISABLE_SUMMARY !== '1';
// Sweep determinism: supervisor-supplied shell command that rm+cp-refreshes the
// BUILDER_SITE_ROOT fixture dir before each checkpoint, so earlier scenarios'
// on-disk mutations (e.g. added/deleted nodes, open popovers) don't leak into
// later ones (documented flake class — e.g. W36 fails only in full sweeps).
// Unset = no-op, preserving default single-checkpoint behavior.
const FIXTURE_RESET_CMD = process.env.QA_FIXTURE_RESET_CMD;

function tsSlug(d: Date): string {
  const iso = d.toISOString().replace(/[:.]/g, '-');
  return iso.slice(0, 19);
}

async function ensureDevServer(): Promise<void> {
  try {
    const res = await fetch(BASE_URL, {
      headers: { authorization: 'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64') },
    });
    if (!res.ok && res.status !== 401 && res.status !== 404) {
      console.warn(`[qa-agent] dev server returned ${res.status} for ${BASE_URL}`);
    }
  } catch (err) {
    throw new Error(
      `dev server (${BASE_URL}) 에 닿지 않습니다. 먼저 \`npm run dev\` 를 별도 터미널에서 실행하세요. 원인: ${(err as Error).message}`,
    );
  }
}

function resetFixturesIfConfigured(): void {
  if (!FIXTURE_RESET_CMD) return;
  const t0 = Date.now();
  try {
    execSync(FIXTURE_RESET_CMD, { stdio: 'pipe', timeout: 30_000 });
    console.log(`[qa-agent] fixture reset ok (${Date.now() - t0}ms)`);
  } catch (err) {
    console.warn(`[qa-agent] fixture reset FAILED (${Date.now() - t0}ms): ${(err as Error).message}`);
  }
}

async function runCheckpoint(
  context: BrowserContext,
  def: CheckpointDefinition,
  reportDir: string,
): Promise<CheckpointResult> {
  const page = await context.newPage();
  const consoleErrors: string[] = [];
  const networkFailures: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!/Invalid or unexpected token|Failed to load resource: net::ERR_/.test(text)) {
        consoleErrors.push(text);
      }
    }
  });
  page.on('response', (res) => {
    const status = res.status();
    if (status >= 400 && status < 600) {
      networkFailures.push(`${status} ${res.url()}`);
    }
  });

  const screenshotDir = path.join(reportDir, 'screenshots', def.id);
  await fs.mkdir(screenshotDir, { recursive: true });

  const evidence: CheckpointEvidence[] = [];
  const steps: string[] = [];
  let seq = 0;

  const recordEvidence = async (label: string, p: Page = page): Promise<CheckpointEvidence> => {
    seq += 1;
    const safe = label.replace(/[^a-z0-9_-]+/gi, '_').slice(0, 60);
    const file = path.join(screenshotDir, `${String(seq).padStart(2, '0')}-${safe}.png`);
    await p.screenshot({ path: file, fullPage: false }).catch(() => undefined);
    const item: CheckpointEvidence = { label, screenshotPath: file };
    evidence.push(item);
    return item;
  };

  const ctx: CheckpointContext = {
    page,
    screenshotDir,
    baseUrl: BASE_URL,
    recordEvidence,
    log: (step) => steps.push(step),
  };

  const startedAt = Date.now();
  let findings: CheckpointFinding[] = [];
  let error: CheckpointResult['error'];
  try {
    const out = await def.run(ctx);
    findings = out.findings;
  } catch (err) {
    error = { message: (err as Error).message, stack: (err as Error).stack };
    findings.push({
      severity: 'blocker',
      summary: '시나리오 실행 중 예외 발생',
      detail: error.message,
    });
    await recordEvidence('error-state').catch(() => undefined);
  } finally {
    await page.close().catch(() => undefined);
  }

  const durationMs = Date.now() - startedAt;
  const status: CheckpointResult['status'] = error
    ? 'fail'
    : findings.some((f) => f.severity === 'blocker')
      ? 'fail'
      : findings.length > 0
        ? 'unclear'
        : 'pass';

  return {
    id: def.id,
    title: def.title,
    status,
    steps,
    findings,
    evidence,
    consoleErrors,
    networkFailures,
    durationMs,
    error,
  };
}

async function main(): Promise<void> {
  const startedAt = new Date();
  console.log(`[qa-agent] starting against ${BASE_URL}`);
  await ensureDevServer();

  const ollama = ENABLE_VISION ? await checkOllama() : { available: false, models: [], baseUrl: '' };
  if (ENABLE_VISION) {
    if (ollama.available) {
      console.log(`[qa-agent] ollama available at ${ollama.baseUrl} (models: ${ollama.models.join(', ') || 'none'})`);
    } else {
      console.warn(`[qa-agent] ollama unavailable, vision review skipped: ${ollama.error ?? ''}`);
    }
  }

  const reportDir = path.join(REPORT_ROOT, tsSlug(startedAt));
  await fs.mkdir(reportDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    baseURL: BASE_URL,
    viewport: { width: 1440, height: 1000 },
    httpCredentials: { username: USERNAME, password: PASSWORD },
  });

  const results: CheckpointResult[] = [];
  const globalConsoleSet = new Set<string>();
  try {
    const filter = (process.env.QA_ONLY ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    const targets = filter.length > 0
      ? ALL_CHECKPOINTS.filter((c) => filter.includes(c.id))
      : ALL_CHECKPOINTS;
    for (const def of targets) {
      console.log(`[qa-agent] running ${def.id} ${def.title}`);
      resetFixturesIfConfigured();
      const r = await runCheckpoint(context, def, reportDir);
      if (ENABLE_VISION && ollama.available && ollama.models.includes(process.env.QA_VISION_MODEL ?? 'qwen2.5vl:32b')) {
        console.log(`[qa-agent]   vision review (${r.evidence.length} screenshots)`);
        try {
          const visionFindings = await reviewCheckpointVisually(r, def.verification);
          r.findings.push(...visionFindings);
          if (r.status === 'pass' && visionFindings.length > 0) {
            r.status = 'unclear';
          }
        } catch (err) {
          r.findings.push({
            severity: 'minor',
            summary: 'vision reviewer 호출 실패',
            detail: (err as Error).message,
          });
        }
      }
      const localOnly: string[] = [];
      for (const line of r.consoleErrors) {
        if (globalConsoleSet.has(line)) continue;
        if (results.length > 0 && results.some((prev) => prev.consoleErrors.includes(line))) {
          globalConsoleSet.add(line);
          continue;
        }
        localOnly.push(line);
      }
      r.consoleErrors = localOnly;
      console.log(`[qa-agent]   → ${r.status} (${r.findings.length} findings, ${r.durationMs}ms)`);
      results.push(r);
    }
    if (globalConsoleSet.size > 0) {
      const globalNoise: CheckpointResult = {
        id: 'GLOBAL',
        title: '모든 W에서 반복 발생한 콘솔 에러 (글로벌 노이즈)',
        status: 'unclear',
        steps: ['여러 시나리오에서 중복 수집된 콘솔 에러 — 페이지 로드 자체의 이슈 가능'],
        findings: Array.from(globalConsoleSet).map((line) => ({
          severity: 'visual' as const,
          summary: line.slice(0, 200),
        })),
        evidence: [],
        consoleErrors: Array.from(globalConsoleSet),
        networkFailures: [],
        durationMs: 0,
      };
      results.push(globalNoise);
    }
  } finally {
    await context.close().catch(() => undefined);
    await browser.close().catch(() => undefined);
  }

  const finishedAt = new Date();
  const reportPath = await writeReport({ reportDir, baseUrl: BASE_URL, startedAt, finishedAt, results });
  console.log(`[qa-agent] report: ${reportPath}`);

  if (ENABLE_SUMMARY && ollama.available && ollama.models.includes(process.env.QA_TEXT_MODEL ?? 'exaone3.5:32b')) {
    try {
      console.log('[qa-agent] generating Korean summary via exaone...');
      const summary = await summarizeForClaude(results);
      const summaryPath = path.join(reportDir, 'summary.ko.md');
      await fs.writeFile(summaryPath, summary, 'utf8');
      console.log(`[qa-agent] summary: ${summaryPath}`);
    } catch (err) {
      console.warn(`[qa-agent] summary failed: ${(err as Error).message}`);
    }
  }

  const failed = results.filter((r) => r.status === 'fail').length;
  console.log(`[qa-agent] done. ${results.length} checkpoints, ${failed} fail.`);
}

main().catch((err) => {
  console.error('[qa-agent] fatal:', err);
  process.exit(1);
});
