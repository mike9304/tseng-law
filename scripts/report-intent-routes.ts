import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

import {
  formatIntentRouteReportJson,
  parseDailySummaryJson,
  parseIntentRouteReportArgs,
  reportIntentRoutes,
} from '../src/lib/metrics/intent-route-report';

function usage(): string {
  return [
    'Usage: npx --no-install vite-node --config vitest.config.ts scripts/report-intent-routes.ts <summary.json> [--locale en] [--paths /en,/en/taiwan-lawyer] [--json]',
    '',
    'Reads one local daily summary JSON file (metrics-local/visits/summary/<YYYY-MM-DD>.json).',
    'Does not read secrets, .env files, network locations, or customer raw events.',
    'Contact email clicks are not qualified leads; this command prints no qualified estimate.',
  ].join('\n');
}

async function readSummaryFile(filePath: string): Promise<string> {
  const resolved = resolve(filePath);
  let fileStat;
  try {
    fileStat = await stat(resolved);
  } catch {
    throw new Error(`invalid path: file not found: ${filePath}`);
  }
  if (!fileStat.isFile()) {
    throw new Error(`invalid path: not a file: ${filePath}`);
  }
  return readFile(resolved, 'utf8');
}

async function main(argv: string[]): Promise<void> {
  const options = parseIntentRouteReportArgs(argv);
  if (options.help) {
    process.stdout.write(`${usage()}\n`);
    return;
  }
  if (options.filePath == null) {
    throw new Error('invalid arguments: provide exactly one daily summary JSON file');
  }

  const text = await readSummaryFile(options.filePath);
  const summary = parseDailySummaryJson(text);
  const report = reportIntentRoutes(summary, options.locale, options.entryPaths);
  process.stdout.write(formatIntentRouteReportJson(report));
}

main(process.argv.slice(2)).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n${usage()}\n`);
  process.exitCode = 1;
});
