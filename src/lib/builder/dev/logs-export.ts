import type { DevLogEntry, DevLogSource, DevLogLevel } from './logs-store';

export type DevLogsExportSource = DevLogSource | 'all';
export type DevLogsExportFormat = 'json' | 'jsonl';

export interface DevLogsExportInput {
  source: DevLogsExportSource;
  entries: readonly DevLogEntry[];
  level: DevLogLevel | 'all';
  query: string;
  format?: DevLogsExportFormat;
  generatedAt?: string;
}

export interface DevLogsExportFile {
  version: 1;
  source: DevLogsExportSource;
  generatedAt: string;
  filters: {
    level: DevLogLevel | 'all';
    query: string;
  };
  count: number;
  entries: readonly DevLogEntry[];
}

function slugifyForFilename(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'all';
}

export function buildDevLogsExportFile(input: DevLogsExportInput): DevLogsExportFile {
  return {
    version: 1,
    source: input.source,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    filters: {
      level: input.level,
      query: input.query.trim(),
    },
    count: input.entries.length,
    entries: input.entries,
  };
}

export function serializeDevLogsExportFile(file: DevLogsExportFile): string {
  return JSON.stringify(file, null, 2);
}

export function serializeDevLogsJsonLines(entries: readonly DevLogEntry[]): string {
  const lines = entries.map((entry) => JSON.stringify(entry));
  return lines.length > 0 ? `${lines.join('\n')}\n` : '';
}

export function buildDevLogsExportFilename(input: DevLogsExportInput): string {
  const levelPart = input.level === 'all' ? 'all' : input.level;
  const queryPart = slugifyForFilename(input.query);
  return `dev-logs-${input.source}-${levelPart}-${queryPart}.${input.format ?? 'json'}`;
}
