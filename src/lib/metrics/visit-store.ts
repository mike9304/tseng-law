import { mkdir, readFile, readdir, unlink, writeFile } from 'fs/promises';
import { randomBytes } from 'node:crypto';
import path from 'path';
import { del, get, list, put } from '@vercel/blob';

import type { EnrichedVisitEvent } from './visit-schema';

export type VisitSummary = Record<string, unknown>;

const VISITS_PREFIX = 'metrics/visits/';
const RAW_PREFIX = `${VISITS_PREFIX}raw/`;
const DAILY_PREFIX = `${VISITS_PREFIX}daily/`;
const SUMMARY_PREFIX = `${VISITS_PREFIX}summary/`;

function localRoot(): string {
  return path.join(process.cwd(), '.data');
}

function usesBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function rawPrefix(day: string): string {
  assertDay(day);
  return `${RAW_PREFIX}${day}/`;
}

function assertDay(day: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    throw new Error(`Invalid UTC day: ${day}`);
  }
}

function rawLocalDir(day: string): string {
  return path.join(localRoot(), ...rawPrefix(day).split('/'));
}

function dailyPath(day: string): string {
  assertDay(day);
  return `${DAILY_PREFIX}${day}.jsonl`;
}

function summaryPath(day: string): string {
  assertDay(day);
  return `${SUMMARY_PREFIX}${day}.json`;
}

function localPath(logicalPath: string): string {
  return path.join(localRoot(), ...logicalPath.split('/'));
}

function warnInvalidRaw(pathname: string): void {
  console.warn(`[visit-metrics] Ignoring invalid raw visit batch: ${pathname}`);
}

async function listAllBlobs(prefix: string): Promise<Array<{ pathname: string }>> {
  const blobs: Array<{ pathname: string }> = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor });
    blobs.push(...page.blobs.map((blob) => ({ pathname: blob.pathname })));
    cursor = page.cursor;
  } while (cursor);
  return blobs;
}

async function readBlobText(pathname: string): Promise<string | null> {
  const result = await get(pathname, { access: 'private', useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  return new Response(result.stream).text();
}

async function parseRawBatch(pathname: string, text: string | null): Promise<EnrichedVisitEvent[]> {
  if (text === null) return [];
  try {
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      warnInvalidRaw(pathname);
      return [];
    }
    return parsed as EnrichedVisitEvent[];
  } catch {
    warnInvalidRaw(pathname);
    return [];
  }
}

/** Persist one collection request as its own append-safe raw batch. */
export async function saveVisitEventBatch(events: EnrichedVisitEvent[], day?: string): Promise<void> {
  const dayKey = day ?? new Date().toISOString().slice(0, 10);
  const prefix = rawPrefix(dayKey);
  if (events.length === 0) return;
  const pathname = `${prefix}${Date.now()}-${randomBytes(3).toString('hex')}.json`;
  const body = JSON.stringify(events);
  if (usesBlob()) {
    await put(pathname, body, {
      access: 'private', allowOverwrite: false, addRandomSuffix: false, contentType: 'application/json',
    });
    return;
  }
  const filename = localPath(pathname);
  await mkdir(path.dirname(filename), { recursive: true, mode: 0o700 });
  await writeFile(filename, body, { encoding: 'utf8', mode: 0o600 });
}

/** Read all raw batches for a UTC day, silently excluding malformed batches. */
export async function listRawDays(): Promise<string[]> {
  if (usesBlob()) {
    const days = (await listAllBlobs(RAW_PREFIX)).flatMap(({ pathname }) => {
      const match = pathname.match(/^metrics\/visits\/raw\/(\d{4}-\d{2}-\d{2})\/\d+-[0-9a-f]{6}\.json$/);
      return match ? [match[1]] : [];
    });
    return [...new Set(days.filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(day)))].sort();
  }
  let names: string[];
  try { names = await readdir(localPath(RAW_PREFIX)); } catch { return []; }
  const days = await Promise.all(names.filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(day)).map(async (day) => {
    try { return (await readdir(rawLocalDir(day))).some((name) => name.endsWith('.json')) ? day : null; }
    catch { return null; }
  }));
  return days.filter((day): day is string => day !== null).sort();
}

export async function listRawBatchKeys(day: string): Promise<string[]> {
  const prefix = rawPrefix(day);
  if (usesBlob()) {
    const rawKey = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d+-[0-9a-f]{6}\\.json$`);
    return [...new Set((await listAllBlobs(prefix)).map(({ pathname }) => pathname).filter((pathname) => rawKey.test(pathname)))].sort();
  }
  let names: string[];
  try {
    names = await readdir(rawLocalDir(day));
  } catch {
    return [];
  }
  return [...new Set(names.filter((name) => /^\d+-[0-9a-f]{6}\.json$/.test(name)).map((name) => `${prefix}${name}`))].sort();
}

export async function readRawBatch(key: string): Promise<EnrichedVisitEvent[]> {
  if (!new RegExp(`^${RAW_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d{4}-\\d{2}-\\d{2}/[^/]+\\.json$`).test(key)) throw new Error('Invalid raw visit batch key');
  if (usesBlob()) return parseRawBatch(key, await readBlobText(key));
  try { return parseRawBatch(key, await readFile(localPath(key), 'utf8')); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

export async function deleteRawBatches(keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  const rawKey = new RegExp(`^${RAW_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\d{4}-\\d{2}-\\d{2}/[^/]+\\.json$`);
  if (keys.some((key) => !rawKey.test(key))) throw new Error('Invalid raw visit batch key');
  if (usesBlob()) {
    await del(keys);
    return;
  }
  await Promise.all(keys.map(async (key) => {
    try { await unlink(localPath(key)); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
  }));
}

export async function saveDailyRollup(day: string, events: EnrichedVisitEvent[], summary: unknown): Promise<void> {
  const daily = dailyPath(day);
  const body = events.length === 0 ? '' : `${events.map((event) => JSON.stringify(event)).join('\n')}\n`;
  if (usesBlob()) {
    await Promise.all([
      put(daily, body, { access: 'private', allowOverwrite: true, addRandomSuffix: false, contentType: 'application/x-ndjson' }),
      put(summaryPath(day), JSON.stringify(summary), { access: 'private', allowOverwrite: true, addRandomSuffix: false, contentType: 'application/json' }),
    ]);
  } else {
    const filename = localPath(daily);
    await mkdir(path.dirname(filename), { recursive: true, mode: 0o700 });
    await writeFile(filename, body, { encoding: 'utf8', mode: 0o600 });
    const summaryFilename = localPath(summaryPath(day));
    await mkdir(path.dirname(summaryFilename), { recursive: true, mode: 0o700 });
    await writeFile(summaryFilename, JSON.stringify(summary), { encoding: 'utf8', mode: 0o600 });
  }
}

export async function readDailySummary(day: string): Promise<unknown | null> {
  const pathname = summaryPath(day);
  try {
    const text = usesBlob() ? await readBlobText(pathname) : await readFile(localPath(pathname), 'utf8');
    return text === null ? null : JSON.parse(text);
  } catch {
    return null;
  }
}

export async function listSummaryDays(): Promise<string[]> {
  if (usesBlob()) {
    return [...new Set((await listAllBlobs(SUMMARY_PREFIX)).flatMap(({ pathname }) => {
      const match = pathname.match(/^metrics\/visits\/summary\/(\d{4}-\d{2}-\d{2})\.json$/);
      return match ? [match[1]] : [];
    }))].sort();
  }
  let names: string[];
  try { names = await readdir(localPath(SUMMARY_PREFIX)); } catch { return []; }
  return [...new Set(names.flatMap((name) => {
    const match = name.match(/^(\d{4}-\d{2}-\d{2})\.json$/);
    return match ? [match[1]] : [];
  }))].sort();
}
