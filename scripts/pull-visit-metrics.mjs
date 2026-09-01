#!/usr/bin/env node
// Pulls visit-metrics rollups (summary/daily) from Vercel Blob into metrics-local/.
// Incremental: files that already exist locally are skipped.
// Usage: node scripts/pull-visit-metrics.mjs [--days 35]

import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDirectory, '..');
const localRoot = join(repoRoot, 'metrics-local', 'visits');

const SUMMARY_PREFIX = 'metrics/visits/summary/';
const DAILY_PREFIX = 'metrics/visits/daily/';

function parseArgs(argv) {
  const daysIndex = argv.indexOf('--days');
  const days = daysIndex >= 0 ? Number(argv[daysIndex + 1]) : 35;
  if (!Number.isInteger(days) || days < 1 || days > 400) {
    throw new Error(`--days must be an integer between 1 and 400, got: ${argv[daysIndex + 1]}`);
  }
  return { days };
}

async function loadBlobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  try {
    const envText = await readFile(join(repoRoot, '.env.local'), 'utf8');
    for (const line of envText.split('\n')) {
      const match = line.match(/^\s*BLOB_READ_WRITE_TOKEN\s*=\s*"?([^"\s#]+)"?\s*$/);
      if (match) return match[1];
    }
  } catch {
    // fall through to the error below
  }
  return null;
}

function cutoffDay(days) {
  const date = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function listDays(list, prefix, extension) {
  const days = [];
  let cursor;
  do {
    const page = await list({ prefix, cursor });
    for (const blob of page.blobs) {
      const match = blob.pathname.match(
        new RegExp(`^${prefix}(\\d{4}-\\d{2}-\\d{2})\\.${extension}$`),
      );
      if (match) days.push(match[1]);
    }
    cursor = page.cursor;
  } while (cursor);
  return [...new Set(days)].sort();
}

async function download(get, pathname, destination) {
  const result = await get(pathname, { access: 'private', useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) {
    throw new Error(`blob get failed for ${pathname} (status ${result?.statusCode ?? 'n/a'})`);
  }
  const text = await new Response(result.stream).text();
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, text, 'utf8');
}

async function main() {
  const { days } = parseArgs(process.argv.slice(2));
  const token = await loadBlobToken();
  if (!token) {
    console.error('BLOB_READ_WRITE_TOKEN이 없습니다 (.env.local 또는 환경변수). 중단.');
    process.exit(1);
  }
  process.env.BLOB_READ_WRITE_TOKEN = token;
  const { get, list } = await import('@vercel/blob');

  const cutoff = cutoffDay(days);
  const targets = [
    { prefix: SUMMARY_PREFIX, extension: 'json', localDir: join(localRoot, 'summary') },
    { prefix: DAILY_PREFIX, extension: 'jsonl', localDir: join(localRoot, 'daily') },
  ];

  let downloaded = 0;
  let skipped = 0;
  const failures = [];

  for (const target of targets) {
    const remoteDays = (await listDays(list, target.prefix, target.extension))
      .filter((day) => day >= cutoff);
    for (const day of remoteDays) {
      const destination = join(target.localDir, `${day}.${target.extension}`);
      if (await fileExists(destination)) {
        skipped += 1;
        continue;
      }
      try {
        await download(get, `${target.prefix}${day}.${target.extension}`, destination);
        downloaded += 1;
      } catch (error) {
        failures.push(`${target.prefix}${day}: ${error.message}`);
      }
    }
  }

  console.log(`다운로드 ${downloaded}건 · 스킵(이미 있음) ${skipped}건 · 기준 최근 ${days}일`);
  if (failures.length > 0) {
    console.error(`실패 ${failures.length}건:`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
