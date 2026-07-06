/**
 * Unifies the three log streams an admin actually wants to triage:
 * - builder audit (writeAuditEvent)
 * - captured errors (appendErrorLog)
 * - dev process logs (runtime-data/dev/logs/*.json — best-effort)
 *
 * Each is normalized into a `UnifiedLogEntry` for the Logs panel.
 */
import { readdir, readFile } from 'fs/promises';
import path from 'path';

import { readRecentAuditEvents } from '@/lib/builder/audit/store';
import { listErrorLog } from '@/lib/builder/errors/storage';
import type { AuditEvent } from '@/lib/builder/audit/types';
import type { CapturedError } from '@/lib/builder/errors/types';

import { devLogsRoot } from './paths';

export type UnifiedLogType = 'audit' | 'dev' | 'security' | 'error';

export interface UnifiedLogDetail {
  label: string;
  value: string;
}

export interface UnifiedLogEntry {
  source: UnifiedLogType;
  at: string;
  level: 'info' | 'warning' | 'error';
  summary: string;
  actorRef?: string;
  details?: readonly UnifiedLogDetail[];
}

export interface LogAggregateResult {
  counts: Record<UnifiedLogType, number>;
  entries: UnifiedLogEntry[];
}

function detail(label: string, value: string | undefined): readonly UnifiedLogDetail[] {
  const normalized = value?.trim();
  return normalized ? [{ label, value: normalized }] : [];
}

function idListDetail(label: string, ids: readonly string[] | undefined): readonly UnifiedLogDetail[] {
  return ids?.length ? detail(label, ids.join(', ')) : [];
}

function normalizeCmsRecordsBulkLifecycleEntry(event: Extract<AuditEvent, { type: 'cms.records.bulk_lifecycle' }>): UnifiedLogEntry {
  return {
    source: 'audit',
    at: event.at,
    level: 'info',
    summary: `CMS lifecycle · ${event.action} · ${event.collectionId} · ${event.changedCount}/${event.requestedCount} changed`,
    actorRef: event.actorRef,
    details: [
      { label: 'Collection', value: event.collectionId },
      { label: 'Action', value: event.action },
      { label: 'Changed', value: `${event.changedCount}/${event.requestedCount}` },
      ...idListDetail('Records', event.recordIds),
      ...detail('Locale', event.locale),
      ...detail('Status', event.status),
      ...detail('Slug field', event.slugField),
      ...detail('Source field', event.sourceFieldKey),
      ...detail('Slug pattern', event.slugPattern),
      ...detail('Slug conflict', event.slugConflictRule),
      ...idListDetail('Missing', event.missingRecordIds),
      ...idListDetail('Skipped', event.skippedRecordIds),
    ],
  };
}

function normalizeStandardAuditEntry(event: AuditEvent, source: 'audit' | 'security'): UnifiedLogEntry {
  return {
    source,
    at: event.at,
    level: event.type === 'publish.failure' ? 'error' : 'info',
    summary: `${event.type}${event.pageId ? ` · ${event.pageId}` : ''}`,
    actorRef: event.actorRef,
  };
}

function normalizeAuditEntry(event: AuditEvent): UnifiedLogEntry {
  switch (event.type) {
    case 'cms.records.bulk_lifecycle':
      return normalizeCmsRecordsBulkLifecycleEntry(event);
    case 'publish.blocked':
    case 'publish.failure':
      return normalizeStandardAuditEntry(event, 'security');
    case 'security.user_created':
    case 'security.user_updated':
    case 'security.user_removed':
      return normalizeStandardAuditEntry(event, 'security');
    case 'cms.record_created':
    case 'cms.record_updated':
    case 'cms.record_deleted':
      return {
        source: 'audit',
        at: event.at,
        level: 'info',
        summary: `CMS record · ${event.type.replace('cms.record_', '')} · ${event.collectionId} · ${event.recordId}`,
        actorRef: event.actorRef,
        details: [
          { label: 'Collection', value: event.collectionId },
          { label: 'Record', value: event.recordId },
          ...detail('Site', event.siteId),
        ],
      };
    case 'commerce.settings_updated':
      return {
        source: 'audit',
        at: event.at,
        level: 'info',
        summary: `Commerce settings · ${event.area} updated`,
        actorRef: event.actorRef,
        details: [{ label: 'Area', value: event.area }],
      };
    case 'asset.upload':
    case 'asset.delete':
    case 'publish.success':
    case 'publish.translation_site_review':
    case 'page.rollback':
    case 'column.create':
    case 'column.update':
    case 'column.delete':
    case 'column.publish':
      return normalizeStandardAuditEntry(event, 'audit');
  }
}

function normalizeErrorEntry(entry: CapturedError): UnifiedLogEntry {
  return {
    source: 'error',
    at: entry.capturedAt,
    level: entry.severity === 'info'
      ? 'info'
      : entry.severity === 'warning'
        ? 'warning'
        : 'error',
    summary: `${entry.origin}: ${entry.message.slice(0, 200)}`,
  };
}

interface DevLogShape {
  at?: string;
  level?: string;
  message?: string;
  source?: string;
}

async function readDevLogs(): Promise<UnifiedLogEntry[]> {
  let entries: import('fs').Dirent[] = [];
  try {
    entries = await readdir(devLogsRoot(), { withFileTypes: true });
  } catch {
    return [];
  }
  const out: UnifiedLogEntry[] = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    try {
      const text = await readFile(path.join(devLogsRoot(), entry.name), 'utf8');
      const payload = JSON.parse(text) as DevLogShape | DevLogShape[];
      const arr = Array.isArray(payload) ? payload : [payload];
      for (const item of arr) {
        if (!item?.at) continue;
        const level = item.level === 'error' || item.level === 'warning' ? item.level : 'info';
        out.push({
          source: 'dev',
          at: item.at,
          level,
          summary: (item.message ?? `${item.source ?? 'dev'} log`).slice(0, 200),
        });
      }
    } catch {
      /* skip unreadable */
    }
  }
  return out;
}

export async function aggregateLogs(options: {
  since?: string;
  type?: UnifiedLogType;
  limit?: number;
} = {}): Promise<LogAggregateResult> {
  const sinceMs = options.since ? Date.parse(options.since) : 0;
  const limit = Math.max(1, Math.min(200, options.limit ?? 50));

  const [audit, errors, dev] = await Promise.all([
    readRecentAuditEvents(500).catch(() => []),
    listErrorLog().catch(() => []),
    readDevLogs(),
  ]);

  const unified: UnifiedLogEntry[] = [
    ...audit.map(normalizeAuditEntry),
    ...errors.map(normalizeErrorEntry),
    ...dev,
  ];

  const counts: Record<UnifiedLogType, number> = {
    audit: 0, dev: 0, security: 0, error: 0,
  };
  for (const entry of unified) counts[entry.source] += 1;

  const filtered = unified.filter((entry) => {
    const ts = Date.parse(entry.at);
    if (sinceMs && Number.isFinite(ts) && ts < sinceMs) return false;
    if (options.type && entry.source !== options.type) return false;
    return true;
  });
  filtered.sort((a, b) => b.at.localeCompare(a.at));
  return {
    counts,
    entries: filtered.slice(0, limit),
  };
}
