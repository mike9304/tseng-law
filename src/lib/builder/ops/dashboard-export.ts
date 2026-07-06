import type { UnifiedLogType } from './logs-aggregator';
import type { OpsDashboardSnapshot } from './dashboard';

export interface OpsDashboardExportFile {
  version: 1;
  generatedAt: string;
  filters: {
    type: '' | UnifiedLogType;
    limit: number;
  };
  snapshot: OpsDashboardSnapshot;
}

export function buildOpsDashboardExportFilename(type: '' | UnifiedLogType): string {
  return `ops-dashboard-${type || 'all'}.json`;
}

export function serializeOpsDashboardExportFile(file: OpsDashboardExportFile): string {
  return JSON.stringify(file, null, 2);
}

export function buildOpsDashboardExportFile(input: {
  snapshot: OpsDashboardSnapshot;
  type: '' | UnifiedLogType;
  limit: number;
}): OpsDashboardExportFile {
  return {
    version: 1,
    generatedAt: input.snapshot.generatedAt,
    filters: {
      type: input.type,
      limit: input.limit,
    },
    snapshot: input.snapshot,
  };
}
