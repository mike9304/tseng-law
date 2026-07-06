import type { UnifiedLogEntry, UnifiedLogType } from './logs-aggregator';

export interface UnifiedLogsViewFilters {
  type: '' | UnifiedLogType;
  level: '' | UnifiedLogEntry['level'];
  query: string;
}

export interface UnifiedLogsExportFile {
  version: 1;
  generatedAt: string;
  filters: UnifiedLogsViewFilters;
  counts: Record<UnifiedLogType, number>;
  count: number;
  entries: UnifiedLogEntry[];
}

export interface UnifiedLogsExportInput {
  entries: UnifiedLogEntry[];
  counts: Record<UnifiedLogType, number>;
  filters: UnifiedLogsViewFilters;
  generatedAt?: string;
}

function slugifyForFilename(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'all';
}

function searchableValues(entry: UnifiedLogEntry): readonly string[] {
  const detailValues = entry.details?.flatMap((detail) => [detail.label, detail.value]) ?? [];
  return [
    entry.summary,
    entry.actorRef ?? '',
    entry.source,
    entry.level,
    entry.at,
    ...detailValues,
  ];
}

export function filterUnifiedLogEntries(entries: UnifiedLogEntry[], filters: UnifiedLogsViewFilters): UnifiedLogEntry[] {
  const normalizedQuery = filters.query.trim().toLowerCase();
  return entries.filter((entry) => {
    if (filters.type && entry.source !== filters.type) return false;
    if (filters.level && entry.level !== filters.level) return false;
    if (!normalizedQuery) return true;
    return searchableValues(entry).some((value) => value.toLowerCase().includes(normalizedQuery));
  });
}

export function buildUnifiedLogsExportFile(input: UnifiedLogsExportInput): UnifiedLogsExportFile {
  return {
    version: 1,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    filters: {
      type: input.filters.type,
      level: input.filters.level,
      query: input.filters.query.trim(),
    },
    counts: input.counts,
    count: input.entries.length,
    entries: input.entries,
  };
}

export function serializeUnifiedLogsExportFile(file: UnifiedLogsExportFile): string {
  return JSON.stringify(file, null, 2);
}

export function buildUnifiedLogsExportFilename(filters: UnifiedLogsViewFilters): string {
  const typePart = filters.type || 'all';
  const levelPart = filters.level || 'all';
  const queryPart = slugifyForFilename(filters.query);
  return `ops-logs-${typePart}-${levelPart}-${queryPart}.json`;
}
