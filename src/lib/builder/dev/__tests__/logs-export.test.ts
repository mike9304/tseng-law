import { describe, expect, it } from 'vitest';
import {
  buildDevLogsExportFilename,
  buildDevLogsExportFile,
  serializeDevLogsExportFile,
} from '@/lib/builder/dev/logs-export';

describe('dev logs export', () => {
  it('builds a stable export file payload', () => {
    const file = buildDevLogsExportFile({
      source: 'function',
      level: 'error',
      query: 'timeout worker',
      generatedAt: '2026-05-29T00:00:00.000Z',
      entries: [
        {
          id: 'log-1',
          source: 'function',
          level: 'error',
          message: 'worker timeout after 1000ms',
          timestamp: '2026-05-29T00:00:01.000Z',
          reference: 'now',
        },
      ],
    });

    expect(file).toMatchObject({
      version: 1,
      source: 'function',
      generatedAt: '2026-05-29T00:00:00.000Z',
      filters: {
        level: 'error',
        query: 'timeout worker',
      },
      count: 1,
    });
    expect(serializeDevLogsExportFile(file)).toContain('worker timeout after 1000ms');
  });

  it('produces a readable filename from source filters', () => {
    expect(buildDevLogsExportFilename({
      source: 'app',
      level: 'all',
      query: '  error / timeout  ',
      entries: [],
    })).toBe('dev-logs-app-all-error-timeout.json');
  });
});
