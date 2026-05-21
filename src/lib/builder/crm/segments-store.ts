/**
 * Persistence + CRUD for CRM contact segments.
 *
 * Mirrors the `automation-model.ts` storage pattern: single JSON document
 * under `runtime-data/crm/segments.json` (or Blob), gated by a per-process
 * serialized write queue to avoid lost updates.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'node:crypto';
import { get, put } from '@vercel/blob';
import {
  type CrmSegment,
  type CrmSegmentsFile,
  type SegmentInput,
  type SegmentMatchMode,
  type SegmentRule,
} from './segments-model';

function rootDir(): string {
  return path.join(process.cwd(), 'runtime-data', 'crm');
}
function segmentsFile(): string {
  return path.join(rootDir(), 'segments.json');
}
const BLOB_PATH = 'crm/segments.json';

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CRM_BACKEND === 'local') return false;
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.BUILDER_USE_BLOB_IN_DEV !== '1'
  ) {
    return false;
  }
  return true;
}

function emptyFile(): CrmSegmentsFile {
  return { version: 1, updatedAt: new Date(0).toISOString(), segments: [] };
}

function normalizeRule(raw: unknown): SegmentRule | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  switch (r.kind) {
    case 'tag':
      return typeof r.tag === 'string' ? { kind: 'tag', tag: r.tag } : null;
    case 'attribute':
      if (typeof r.key === 'string' && typeof r.value === 'string') {
        return { kind: 'attribute', key: r.key, value: r.value };
      }
      return null;
    case 'email-domain':
      return typeof r.domain === 'string'
        ? { kind: 'email-domain', domain: r.domain }
        : null;
    case 'created-since':
      return typeof r.since === 'string'
        ? { kind: 'created-since', since: r.since }
        : null;
    default:
      return null;
  }
}

function normalizeSegment(value: unknown): CrmSegment | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Partial<CrmSegment>;
  if (typeof v.id !== 'string' || !v.id) return null;
  if (typeof v.name !== 'string' || !v.name) return null;
  const rules = Array.isArray(v.rules)
    ? v.rules.map(normalizeRule).filter((r): r is SegmentRule => r !== null)
    : [];
  const matchMode: SegmentMatchMode = v.matchMode === 'any' ? 'any' : 'all';
  const now = new Date().toISOString();
  return {
    id: v.id,
    name: v.name,
    description: typeof v.description === 'string' ? v.description : undefined,
    rules,
    matchMode,
    createdAt: typeof v.createdAt === 'string' ? v.createdAt : now,
    updatedAt: typeof v.updatedAt === 'string' ? v.updatedAt : now,
  };
}

function normalizeFile(value: unknown): CrmSegmentsFile {
  if (!value || typeof value !== 'object') return emptyFile();
  const v = value as Partial<CrmSegmentsFile>;
  const segments = Array.isArray(v.segments)
    ? v.segments.map(normalizeSegment).filter((s): s is CrmSegment => s !== null)
    : [];
  return {
    version: 1,
    updatedAt: typeof v.updatedAt === 'string' ? v.updatedAt : new Date().toISOString(),
    segments,
  };
}

async function readFromBackend(): Promise<CrmSegmentsFile> {
  if (isBlobBackend()) {
    try {
      const result = await get(BLOB_PATH, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        return normalizeFile(JSON.parse(text));
      }
    } catch {
      /* fallthrough */
    }
    return emptyFile();
  }
  try {
    const text = await fs.readFile(segmentsFile(), 'utf8');
    return normalizeFile(JSON.parse(text));
  } catch {
    return emptyFile();
  }
}

async function writeToBackend(data: CrmSegmentsFile): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (isBlobBackend()) {
    await put(BLOB_PATH, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  await fs.mkdir(rootDir(), { recursive: true });
  await fs.writeFile(segmentsFile(), body, 'utf8');
}

let writeQueue: Promise<void> = Promise.resolve();

async function withQueue<T>(task: () => Promise<T>): Promise<T> {
  const previous = writeQueue;
  let release!: () => void;
  writeQueue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous.catch(() => undefined);
  try {
    return await task();
  } finally {
    release();
  }
}

export async function readSegments(): Promise<CrmSegment[]> {
  const file = await readFromBackend();
  return file.segments;
}

export async function getSegment(id: string): Promise<CrmSegment | null> {
  const all = await readSegments();
  return all.find((s) => s.id === id) ?? null;
}

export async function mutateSegments<T>(
  updater: (current: CrmSegment[]) => { next: CrmSegment[]; result: T },
): Promise<T> {
  return withQueue(async () => {
    const current = (await readFromBackend()).segments;
    const { next, result } = updater(current);
    const file: CrmSegmentsFile = {
      version: 1,
      updatedAt: new Date().toISOString(),
      segments: next,
    };
    await writeToBackend(file);
    return result;
  });
}

export function makeSegmentId(): string {
  return `seg_${Date.now().toString(36)}_${randomBytes(5).toString('hex')}`;
}

export async function createSegment(input: SegmentInput): Promise<CrmSegment> {
  const now = new Date().toISOString();
  const segment: CrmSegment = {
    id: makeSegmentId(),
    name: input.name,
    description: input.description,
    rules: input.rules,
    matchMode: input.matchMode ?? 'all',
    createdAt: now,
    updatedAt: now,
  };
  await mutateSegments((current) => ({
    next: [...current, segment],
    result: segment,
  }));
  return segment;
}

export async function updateSegment(
  id: string,
  patch: Partial<SegmentInput>,
): Promise<CrmSegment | null> {
  return mutateSegments((current) => {
    const index = current.findIndex((s) => s.id === id);
    if (index === -1) return { next: current, result: null };
    const existing = current[index];
    const next: CrmSegment = {
      ...existing,
      name: patch.name ?? existing.name,
      description:
        patch.description !== undefined ? patch.description : existing.description,
      rules: patch.rules ?? existing.rules,
      matchMode: patch.matchMode ?? existing.matchMode,
      updatedAt: new Date().toISOString(),
    };
    const updated = [...current];
    updated[index] = next;
    return { next: updated, result: next };
  });
}

export async function deleteSegment(id: string): Promise<boolean> {
  return mutateSegments((current) => {
    const next = current.filter((s) => s.id !== id);
    return { next, result: next.length !== current.length };
  });
}