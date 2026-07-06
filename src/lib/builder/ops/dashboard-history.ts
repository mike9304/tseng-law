import { mkdir, readFile, writeFile } from 'fs/promises';

import { opsDashboardHistoryFile, opsRoot } from './paths';

export interface OpsDashboardHistoryEntry {
  generatedAt: string;
  logs24h: number;
  errors24h: number;
  deniedRequests: number;
  runtimeCacheKeys: number;
  backupCount: number;
  rssBytes: number;
  heapUsedBytes: number;
}

const MAX_HISTORY = 24;

function normalizeHistory(entries: OpsDashboardHistoryEntry[]): OpsDashboardHistoryEntry[] {
  return entries
    .filter((entry) => Boolean(entry.generatedAt))
    .sort((a, b) => a.generatedAt.localeCompare(b.generatedAt))
    .slice(-MAX_HISTORY);
}

export async function appendOpsDashboardHistory(entry: OpsDashboardHistoryEntry): Promise<void> {
  const history: OpsDashboardHistoryEntry[] = await readOpsDashboardHistory().catch(() => []);
  history.push(entry);
  const next = normalizeHistory(history);
  try {
    await mkdir(opsRoot(), { recursive: true });
    await writeFile(opsDashboardHistoryFile(), JSON.stringify(next, null, 2), 'utf8');
  } catch {
    // advisory only
  }
}

export async function readOpsDashboardHistory(): Promise<OpsDashboardHistoryEntry[]> {
  try {
    const text = await readFile(opsDashboardHistoryFile(), 'utf8');
    const parsed = JSON.parse(text) as OpsDashboardHistoryEntry[] | { entries?: OpsDashboardHistoryEntry[] };
    const entries = Array.isArray(parsed) ? parsed : (parsed.entries ?? []);
    return normalizeHistory(entries);
  } catch {
    return [];
  }
}
