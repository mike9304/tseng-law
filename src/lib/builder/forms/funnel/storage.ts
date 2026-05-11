import { promises as fs } from 'fs';
import path from 'path';
import { get, put } from '@vercel/blob';

export type FunnelEventKind = 'view' | 'step' | 'submit' | 'abandon';

export interface FunnelEvent {
  formId: string;
  kind: FunnelEventKind;
  stepIndex?: number;
  at: string;
}

const ROOT = path.join(process.cwd(), 'runtime-data', 'form-funnel');
const BLOB_PATH = 'form-funnel/events.json';
const CAP = 5000;

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

export async function appendFunnelEvent(event: FunnelEvent): Promise<void> {
  const existing = await listFunnelEvents();
  const next = [...existing, event].slice(-CAP);
  const body = JSON.stringify(next);
  if (backend() === 'blob') {
    await put(BLOB_PATH, body, { access: 'private', allowOverwrite: true, contentType: 'application/json' });
    return;
  }
  await fs.mkdir(ROOT, { recursive: true });
  await fs.writeFile(path.join(ROOT, 'events.json'), body, 'utf8');
}

export async function listFunnelEvents(): Promise<FunnelEvent[]> {
  try {
    if (backend() === 'blob') {
      const result = await get(BLOB_PATH, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as FunnelEvent[];
      }
      return [];
    }
    const raw = await fs.readFile(path.join(ROOT, 'events.json'), 'utf8');
    return JSON.parse(raw) as FunnelEvent[];
  } catch {
    return [];
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
