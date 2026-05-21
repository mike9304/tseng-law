import { promises as fs } from 'node:fs';
import path from 'node:path';

export interface WCheckpoint {
  id: string;
  title: string;
  verification: string;
  status: 'green' | 'wip' | 'pending-user-qa' | 'pending-provider-qa' | 'red' | 'unknown';
  rawStatus: string;
}

const DEFAULT_CHECKPOINT_PATH = path.resolve(
  process.env.HOME ?? '',
  'Desktop',
  'ai memory save 계획',
  'Wix 체크포인트.md',
);

function classifyStatus(raw: string): WCheckpoint['status'] {
  const r = raw.trim();
  if (r.startsWith('🟢')) return 'green';
  if (r.includes('WIP')) return 'wip';
  if (r.includes('사용자') && r.includes('QA') && r.includes('대기')) return 'pending-user-qa';
  if (r.includes('provider')) return 'pending-provider-qa';
  if (r.startsWith('🔴')) return 'red';
  return 'unknown';
}

export async function loadCheckpoints(filePath = DEFAULT_CHECKPOINT_PATH): Promise<WCheckpoint[]> {
  const raw = await fs.readFile(filePath, 'utf8');
  const out: WCheckpoint[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\|\s*(W\d{2,3})\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$/);
    if (!m) continue;
    out.push({
      id: m[1],
      title: m[2],
      verification: m[3],
      rawStatus: m[4],
      status: classifyStatus(m[4]),
    });
  }
  return out;
}
