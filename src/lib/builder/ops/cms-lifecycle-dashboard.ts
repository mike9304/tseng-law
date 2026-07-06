import { readRecentAuditEvents } from '@/lib/builder/audit/store';
import type {
  AuditEvent,
  CmsRecordsBulkLifecycleAction,
  CmsRecordsBulkLifecycleEvent,
} from '@/lib/builder/audit/types';

export interface OpsCmsLifecycleActionSummary {
  readonly action: CmsRecordsBulkLifecycleAction;
  readonly count: number;
  readonly requestedRecords: number;
  readonly changedRecords: number;
}

export interface OpsCmsLifecycleCollectionSummary {
  readonly collectionId: string;
  readonly count: number;
  readonly requestedRecords: number;
  readonly changedRecords: number;
  readonly lastAt: string;
}

export interface OpsCmsLifecycleRecentEntry {
  readonly at: string;
  readonly collectionId: string;
  readonly action: CmsRecordsBulkLifecycleAction;
  readonly requestedCount: number;
  readonly changedCount: number;
  readonly status?: string;
  readonly locale?: string;
}

export interface OpsCmsLifecycleDashboard {
  readonly totalEvents: number;
  readonly requestedRecords: number;
  readonly changedRecords: number;
  readonly byAction: readonly OpsCmsLifecycleActionSummary[];
  readonly topCollections: readonly OpsCmsLifecycleCollectionSummary[];
  readonly recent: readonly OpsCmsLifecycleRecentEntry[];
}

type MutableActionSummary = {
  action: CmsRecordsBulkLifecycleAction;
  count: number;
  requestedRecords: number;
  changedRecords: number;
};

type MutableCollectionSummary = {
  collectionId: string;
  count: number;
  requestedRecords: number;
  changedRecords: number;
  lastAt: string;
};

const ACTION_ORDER: readonly CmsRecordsBulkLifecycleAction[] = [
  'delete',
  'generate-slugs',
  'repair-slug-conflicts',
  'status',
] as const;

export async function collectOpsCmsLifecycleDashboard(): Promise<OpsCmsLifecycleDashboard> {
  const events = await readRecentAuditEvents(500).catch(() => []);
  return buildOpsCmsLifecycleDashboard(events);
}

export function buildOpsCmsLifecycleDashboard(
  events: readonly AuditEvent[],
  options: { readonly recentLimit?: number; readonly collectionLimit?: number } = {},
): OpsCmsLifecycleDashboard {
  const recentLimit = Math.max(1, Math.min(10, options.recentLimit ?? 5));
  const collectionLimit = Math.max(1, Math.min(10, options.collectionLimit ?? 5));
  const lifecycleEvents = events
    .filter(isCmsLifecycleEvent)
    .sort((left, right) => right.at.localeCompare(left.at));
  const actionSummaries = new Map<CmsRecordsBulkLifecycleAction, MutableActionSummary>();
  const collectionSummaries = new Map<string, MutableCollectionSummary>();
  let requestedRecords = 0;
  let changedRecords = 0;

  for (const event of lifecycleEvents) {
    requestedRecords += event.requestedCount;
    changedRecords += event.changedCount;
    addActionSummary(actionSummaries, event);
    addCollectionSummary(collectionSummaries, event);
  }

  return {
    totalEvents: lifecycleEvents.length,
    requestedRecords,
    changedRecords,
    byAction: [...actionSummaries.values()].sort(compareActionSummary),
    topCollections: [...collectionSummaries.values()]
      .sort(compareCollectionSummary)
      .slice(0, collectionLimit),
    recent: lifecycleEvents.slice(0, recentLimit).map(toRecentEntry),
  };
}

function isCmsLifecycleEvent(event: AuditEvent): event is CmsRecordsBulkLifecycleEvent {
  return event.type === 'cms.records.bulk_lifecycle';
}

function addActionSummary(
  summaries: Map<CmsRecordsBulkLifecycleAction, MutableActionSummary>,
  event: CmsRecordsBulkLifecycleEvent,
): void {
  const current = summaries.get(event.action);
  if (current) {
    current.count += 1;
    current.requestedRecords += event.requestedCount;
    current.changedRecords += event.changedCount;
    return;
  }
  summaries.set(event.action, {
    action: event.action,
    count: 1,
    requestedRecords: event.requestedCount,
    changedRecords: event.changedCount,
  });
}

function addCollectionSummary(
  summaries: Map<string, MutableCollectionSummary>,
  event: CmsRecordsBulkLifecycleEvent,
): void {
  const current = summaries.get(event.collectionId);
  if (current) {
    current.count += 1;
    current.requestedRecords += event.requestedCount;
    current.changedRecords += event.changedCount;
    if (event.at.localeCompare(current.lastAt) > 0) current.lastAt = event.at;
    return;
  }
  summaries.set(event.collectionId, {
    collectionId: event.collectionId,
    count: 1,
    requestedRecords: event.requestedCount,
    changedRecords: event.changedCount,
    lastAt: event.at,
  });
}

function compareActionSummary(
  left: OpsCmsLifecycleActionSummary,
  right: OpsCmsLifecycleActionSummary,
): number {
  return ACTION_ORDER.indexOf(left.action) - ACTION_ORDER.indexOf(right.action);
}

function compareCollectionSummary(
  left: OpsCmsLifecycleCollectionSummary,
  right: OpsCmsLifecycleCollectionSummary,
): number {
  return right.count - left.count
    || right.changedRecords - left.changedRecords
    || right.lastAt.localeCompare(left.lastAt)
    || left.collectionId.localeCompare(right.collectionId);
}

function toRecentEntry(event: CmsRecordsBulkLifecycleEvent): OpsCmsLifecycleRecentEntry {
  return {
    at: event.at,
    collectionId: event.collectionId,
    action: event.action,
    requestedCount: event.requestedCount,
    changedCount: event.changedCount,
    ...(event.status === undefined ? {} : { status: event.status }),
    ...(event.locale === undefined ? {} : { locale: event.locale }),
  };
}
