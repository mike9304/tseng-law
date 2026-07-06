import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { del, get, put } from '@vercel/blob';
import { z } from 'zod';
import type { TranslationProviderSmokeHistoryEntry } from './diagnostics';

const HISTORY_FILE_VERSION = 1;
const MAX_SMOKE_HISTORY_ENTRIES = 5;
const BLOB_PATH = 'translations/providers/smoke-history.json';

const smokeHistoryEntrySchema = z.object({
  checkedAt: z.string().min(1),
  ok: z.boolean(),
  provider: z.enum(['openai', 'deepl']),
  status: z.enum(['pass', 'fail', 'unconfigured']),
  sourceLocale: z.enum(['ko', 'zh-hant', 'en']),
  targetLocale: z.enum(['ko', 'zh-hant', 'en']),
  durationMs: z.number(),
  translatedTextPreview: z.string().optional(),
  reason: z.string().optional(),
  error: z.string().optional(),
}).strict();

const smokeHistoryFileSchema = z.object({
  version: z.literal(HISTORY_FILE_VERSION),
  updatedAt: z.string().min(1),
  entries: z.array(smokeHistoryEntrySchema),
}).strict();

type StoredSmokeHistoryEntry = z.infer<typeof smokeHistoryEntrySchema>;

let writeQueue: Promise<void> = Promise.resolve();

function smokeHistoryRoot(): string {
  return process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH
    ?? path.join(process.cwd(), 'runtime-data', 'translations', 'providers');
}

function smokeHistoryFilePath(): string {
  return path.join(smokeHistoryRoot(), 'smoke-history.json');
}

function shouldUseBlobSmokeHistory(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) return false;
  if (process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_BACKEND === 'local') return false;
  if (process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_BACKEND === 'blob') return true;
  if (process.env.NODE_ENV === 'production') return true;
  return process.env.BUILDER_USE_BLOB_IN_DEV === '1';
}

function toSmokeHistoryEntry(entry: StoredSmokeHistoryEntry): TranslationProviderSmokeHistoryEntry {
  return {
    checkedAt: entry.checkedAt,
    ok: entry.ok,
    provider: entry.provider,
    status: entry.status,
    sourceLocale: entry.sourceLocale,
    targetLocale: entry.targetLocale,
    durationMs: entry.durationMs,
    ...(entry.translatedTextPreview === undefined ? {} : { translatedTextPreview: entry.translatedTextPreview }),
    ...(entry.reason === undefined ? {} : { reason: entry.reason }),
    ...(entry.error === undefined ? {} : { error: entry.error }),
  };
}

function historyKey(entry: TranslationProviderSmokeHistoryEntry): string {
  return `${entry.checkedAt}:${entry.provider}:${entry.status}:${entry.sourceLocale}:${entry.targetLocale}:${entry.durationMs}`;
}

function normalizeHistory(
  entries: readonly TranslationProviderSmokeHistoryEntry[],
): readonly TranslationProviderSmokeHistoryEntry[] {
  const seen = new Set<string>();
  const normalized: TranslationProviderSmokeHistoryEntry[] = [];
  for (const entry of [...entries].sort((left, right) => right.checkedAt.localeCompare(left.checkedAt))) {
    const key = historyKey(entry);
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push(entry);
  }
  return normalized.slice(0, MAX_SMOKE_HISTORY_ENTRIES);
}

async function withWriteQueue<T>(task: () => Promise<T>): Promise<T> {
  const previous = writeQueue;
  let release: () => void = () => undefined;
  writeQueue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous.catch((error: unknown) => {
    if (error instanceof Error) return;
    throw error;
  });
  try {
    return await task();
  } finally {
    release();
  }
}

async function readFileHistory(): Promise<readonly TranslationProviderSmokeHistoryEntry[]> {
  try {
    const raw = await readFile(smokeHistoryFilePath(), 'utf8');
    const parsed = smokeHistoryFileSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return [];
    return normalizeHistory(parsed.data.entries.map(toSmokeHistoryEntry));
  } catch (error) {
    if (error instanceof Error) return [];
    throw error;
  }
}

async function readBlobHistory(): Promise<readonly TranslationProviderSmokeHistoryEntry[]> {
  try {
    const result = await get(BLOB_PATH, { access: 'private', useCache: false });
    if (result?.statusCode !== 200 || !result.stream) return [];
    const raw = await new Response(result.stream).text();
    const parsed = smokeHistoryFileSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return [];
    return normalizeHistory(parsed.data.entries.map(toSmokeHistoryEntry));
  } catch (error) {
    if (error instanceof Error) return [];
    throw error;
  }
}

async function writeHistory(entries: readonly TranslationProviderSmokeHistoryEntry[]): Promise<void> {
  const body = JSON.stringify({
    version: HISTORY_FILE_VERSION,
    updatedAt: new Date().toISOString(),
    entries: normalizeHistory(entries),
  }, null, 2);
  if (shouldUseBlobSmokeHistory()) {
    await put(BLOB_PATH, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  await mkdir(smokeHistoryRoot(), { recursive: true, mode: 0o700 });
  await writeFile(smokeHistoryFilePath(), body, { encoding: 'utf8', mode: 0o600 });
}

export async function readTranslationProviderSmokeHistory(): Promise<readonly TranslationProviderSmokeHistoryEntry[]> {
  if (shouldUseBlobSmokeHistory()) return readBlobHistory();
  return readFileHistory();
}

export async function appendTranslationProviderSmokeHistory(
  entry: TranslationProviderSmokeHistoryEntry,
): Promise<readonly TranslationProviderSmokeHistoryEntry[]> {
  return withWriteQueue(async () => {
    const current = await readTranslationProviderSmokeHistory();
    const next = normalizeHistory([entry, ...current]);
    await writeHistory(next);
    return next;
  });
}

export async function clearTranslationProviderSmokeHistoryStore(): Promise<void> {
  await withWriteQueue(async () => {
    if (shouldUseBlobSmokeHistory()) {
      await del(BLOB_PATH);
      return;
    }
    await rm(smokeHistoryFilePath(), { force: true });
  });
}
