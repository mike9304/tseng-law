import { describe, expect, it } from 'vitest';
import {
  buildUnifiedLogsExportFile,
  buildUnifiedLogsExportFilename,
  filterUnifiedLogEntries,
  serializeUnifiedLogsExportFile,
} from '@/lib/builder/ops/logs-view';

describe('ops logs view', () => {
  const entries = [
    {
      source: 'audit' as const,
      at: '2026-05-29T00:00:00.000Z',
      level: 'info' as const,
      summary: 'publish.success · page-1',
      actorRef: 'user-1',
    },
    {
      source: 'error' as const,
      at: '2026-05-29T00:10:00.000Z',
      level: 'error' as const,
      summary: 'route failed to render',
    },
    {
      source: 'audit' as const,
      at: '2026-05-29T00:20:00.000Z',
      level: 'info' as const,
      summary: 'CMS lifecycle · status · recipes-archive',
      actorRef: 'admin',
      details: [
        { label: 'Collection', value: 'recipes-archive' },
        { label: 'Status', value: 'archived' },
      ],
    },
  ];

  it('filters unified entries by type, level, and query', () => {
    expect(filterUnifiedLogEntries(entries, { type: 'error', level: '', query: '' })).toHaveLength(1);
    expect(filterUnifiedLogEntries(entries, { type: '', level: 'info', query: 'publish' })).toHaveLength(1);
    expect(filterUnifiedLogEntries(entries, { type: 'audit', level: 'error', query: '' })).toHaveLength(0);
  });

  it('matches queries against structured log details', () => {
    const result = filterUnifiedLogEntries(entries, { type: 'audit', level: '', query: 'archived' });

    expect(result).toHaveLength(1);
    expect(result[0]?.summary).toContain('recipes-archive');
  });

  it('builds a stable export payload and filename', () => {
    const file = buildUnifiedLogsExportFile({
      entries,
      counts: { audit: 2, dev: 0, security: 0, error: 1 },
      filters: { type: 'audit', level: 'info', query: 'page 1' },
      generatedAt: '2026-05-29T00:30:00.000Z',
    });

    expect(file).toMatchObject({
      version: 1,
      generatedAt: '2026-05-29T00:30:00.000Z',
      filters: { type: 'audit', level: 'info', query: 'page 1' },
      counts: { audit: 2, dev: 0, security: 0, error: 1 },
      count: 3,
    });
    expect(serializeUnifiedLogsExportFile(file)).toContain('route failed to render');
    expect(buildUnifiedLogsExportFilename({ type: 'audit', level: 'info', query: 'page 1' }))
      .toBe('ops-logs-audit-info-page-1.json');
  });
});
