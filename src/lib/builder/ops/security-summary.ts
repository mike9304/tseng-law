/**
 * Summarises security-relevant audit events in a sliding window. Used
 * by the Security panel + the health snapshot.
 *
 * Today the project's first-class security events are:
 *   - publish.blocked / publish.failure (mutation rejections)
 *   - asset.delete (privileged action)
 *
 * We surface counts + offending actors/IPs (proxied through actorRef).
 */
import { readRecentAuditEvents } from '@/lib/builder/audit/store';
import type { AuditEvent } from '@/lib/builder/audit/types';

export interface SecuritySummaryRow {
  key: string;
  count: number;
}

export interface SecuritySummary {
  windowHours: number;
  generatedAt: string;
  totalEvents: number;
  deniedRequests: number;
  byType: SecuritySummaryRow[];
  topActors: SecuritySummaryRow[];
}

function isSecurityEvent(event: AuditEvent): boolean {
  return event.type === 'publish.blocked'
    || event.type === 'publish.failure'
    || event.type === 'asset.delete';
}

function topN(map: Map<string, number>, n: number): SecuritySummaryRow[] {
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key))
    .slice(0, n);
}

export async function buildSecuritySummary(options: {
  windowHours?: number;
  now?: Date;
} = {}): Promise<SecuritySummary> {
  const windowHours = Math.max(1, Math.min(168, options.windowHours ?? 24));
  const now = options.now ?? new Date();
  const cutoffMs = now.getTime() - windowHours * 60 * 60 * 1000;

  const events = await readRecentAuditEvents(500).catch(() => []);
  const window = events.filter((e) => {
    const t = Date.parse(e.at);
    return Number.isFinite(t) && t >= cutoffMs;
  });

  const securityEvents = window.filter(isSecurityEvent);
  const byType = new Map<string, number>();
  const byActor = new Map<string, number>();
  for (const event of securityEvents) {
    byType.set(event.type, (byType.get(event.type) ?? 0) + 1);
    const actor = event.actorRef ?? 'anonymous';
    byActor.set(actor, (byActor.get(actor) ?? 0) + 1);
  }

  return {
    windowHours,
    generatedAt: now.toISOString(),
    totalEvents: window.length,
    deniedRequests: securityEvents.filter((e) => (
      e.type === 'publish.blocked' || e.type === 'publish.failure'
    )).length,
    byType: topN(byType, 10),
    topActors: topN(byActor, 10),
  };
}