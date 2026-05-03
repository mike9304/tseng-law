import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { runConsultationEval } from '@/lib/consultation/eval/run-eval';

function parseDotenvLine(line: string): [string, string] | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;
  const eq = trimmed.indexOf('=');
  if (eq < 0) return null;

  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if (!key) return null;

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return [key, value];
}

function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return;

  const raw = readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const parsed = parseDotenvLine(line);
    if (!parsed) continue;
    const [key, value] = parsed;
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

async function assertOpenAiReachable(): Promise<void> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set. Add it to .env.local or the shell environment.');
  }

  let response: Response;
  try {
    response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown network error';
    throw new Error(`OpenAI preflight failed before eval: ${message}`);
  }

  if (response.status === 401) {
    throw new Error('OpenAI preflight failed: API key was rejected.');
  }
  if (!response.ok) {
    throw new Error(`OpenAI preflight failed with HTTP ${response.status}.`);
  }
}

async function withQuietEngineLogs<T>(
  fn: () => Promise<T>,
): Promise<{ result: T; runtimeLogsSuppressed: { warnings: number; errors: number } }> {
  if (process.argv.includes('--verbose')) {
    return {
      result: await fn(),
      runtimeLogsSuppressed: { warnings: 0, errors: 0 },
    };
  }

  const originalWarn = console.warn;
  const originalError = console.error;
  let warningCount = 0;
  let errorCount = 0;

  console.warn = () => {
    warningCount += 1;
  };
  console.error = () => {
    errorCount += 1;
  };

  try {
    const result = await fn();
    return {
      result,
      runtimeLogsSuppressed: { warnings: warningCount, errors: errorCount },
    };
  } finally {
    console.warn = originalWarn;
    console.error = originalError;
  }
}

async function main(): Promise<void> {
  loadEnvLocal();
  await assertOpenAiReachable();

  const { result: report, runtimeLogsSuppressed } = await withQuietEngineLogs(() => runConsultationEval());
  const summary = {
    total: report.total,
    passed: report.passed,
    failed: report.failed,
    passRate: report.passRate,
    durationMs: report.durationMs,
    runtimeLogsSuppressed,
    byScenario: report.byScenario,
    failures: report.failures.map((failure) => ({
      id: failure.id,
      locale: failure.locale,
      observed: failure.observed,
      checks: failure.checks,
    })),
  };

  console.log(JSON.stringify(summary, null, 2));
  if (report.failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
