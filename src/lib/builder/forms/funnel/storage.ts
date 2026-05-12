import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { get, list, put } from '@vercel/blob';

export type FunnelEventKind = 'view' | 'step' | 'submit' | 'abandon';

export interface FunnelEvent {
  formId: string;
  kind: FunnelEventKind;
  stepIndex?: number;
  at: string;
}

const ROOT = path.join(process.cwd(), 'runtime-data', 'form-funnel');
const BLOB_PREFIX = 'form-funnel/events/';
const SOFT_CAP = 5000;

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

function eventId(event: FunnelEvent): string {
  const random = crypto.randomBytes(6).toString('hex');
  const dateKey = event.at.slice(0, 10);
  return `${dateKey}/${event.formId.replace(/[^a-z0-9_-]/gi, '_')}_${random}`;
}

/**
 * Per-event file write so concurrent funnel events don't collide. The
 * previous single-events.json read-modify-write pattern lost events under
 * concurrent traffic. SOFT_CAP enforcement now lives in listFunnelEvents
 * by sorting + slicing at read time.
 */
export async function appendFunnelEvent(event: FunnelEvent): Promise<void> {
  const id = eventId(event);
  const body = JSON.stringify(event);
  if (backend() === 'blob') {
    await put(`${BLOB_PREFIX}${id}.json`, body, {
      access: 'private',
      allowOverwrite: false,
      contentType: 'application/json',
    });
    return;
  }
  const target = path.join(ROOT, `${id}.json`);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, body, 'utf8');
}

export async function listFunnelEvents(): Promise<FunnelEvent[]> {
  try {
    const events = backend() === 'blob' ? await listBlob() : await listFile();
    events.sort((a, b) => a.at.localeCompare(b.at));
    return events.slice(-SOFT_CAP);
  } catch {
    return [];
  }
}

async function listBlob(): Promise<FunnelEvent[]> {
  const result = await list({ prefix: BLOB_PREFIX });
  const out: FunnelEvent[] = [];
  for (const blob of result.blobs) {
    try {
      const item = await get(blob.pathname, { access: 'private', useCache: false });
      if (item?.statusCode === 200 && item.stream) {
        out.push(JSON.parse(await new Response(item.stream).text()) as FunnelEvent);
      }
    } catch {
      /* skip */
    }
  }
  return out;
}

async function listFile(): Promise<FunnelEvent[]> {
  const out: FunnelEvent[] = [];
  await walkDir(ROOT, out);
  return out;
}

async function walkDir(dir: string, out: FunnelEvent[]): Promise<void> {
  let entries: import('fs').Dirent[] = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(abs, out);
      continue;
    }
    if (!entry.name.endsWith('.json')) continue;
    try {
      const raw = await fs.readFile(abs, 'utf8');
      out.push(JSON.parse(raw) as FunnelEvent);
    } catch {
      /* skip */
    }
  }
}

export interface FunnelStats {
  formId: string;
  views: number;
  starts: number;
  submits: number;
  abandons: number;
  byStep: Record<number, number>;
  submissionRate: number;
}

export function computeFunnelStats(events: FunnelEvent[], formId: string): FunnelStats {
  const filtered = events.filter((e) => e.formId === formId);
  const stats: FunnelStats = {
    formId,
    views: 0,
    starts: 0,
    submits: 0,
    abandons: 0,
    byStep: {},
    submissionRate: 0,
  };
  for (const event of filtered) {
    switch (event.kind) {
      case 'view': stats.views += 1; break;
      case 'submit': stats.submits += 1; break;
      case 'abandon': stats.abandons += 1; break;
      case 'step':
        if (typeof event.stepIndex === 'number') {
          stats.byStep[event.stepIndex] = (stats.byStep[event.stepIndex] ?? 0) + 1;
          if (event.stepIndex === 0) stats.starts += 1;
        }
        break;
    }
  }
  if (stats.views > 0) stats.submissionRate = stats.submits / stats.views;
  return stats;
}
