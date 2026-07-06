import type { CampaignRecipient, CampaignStats } from './campaign-types';

export type CampaignRecipientStatus = CampaignRecipient['status'];

export type CampaignActivityEventKind = 'sent' | 'opened' | 'clicked' | 'unsubscribed';

export type CampaignFunnelKey = 'recipients' | 'opens' | 'clicks' | 'unsubscribes' | 'bounces';

export type CampaignRecipientBreakdown = Readonly<Record<CampaignRecipientStatus, number>>;

export type CampaignActivityEvent = {
  readonly kind: CampaignActivityEventKind;
  readonly occurredAt: string;
  readonly subscriberId: string;
  readonly email: string;
};

export type CampaignFunnelStep = {
  readonly key: CampaignFunnelKey;
  readonly count: number;
  readonly rate: number;
};

export type CampaignAnalyticsSummary = {
  readonly recipientBreakdown: CampaignRecipientBreakdown;
  readonly recentEvents: readonly CampaignActivityEvent[];
  readonly funnel: readonly CampaignFunnelStep[];
};

const RECIPIENT_STATUSES = [
  'pending',
  'sent',
  'failed',
  'bounced',
  'opened',
  'clicked',
  'unsubscribed',
] as const satisfies readonly CampaignRecipientStatus[];

const RECENT_EVENT_LIMIT = 25;

function roundRate(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function rate(count: number, total: number): number {
  return total > 0 ? roundRate(count / total) : 0;
}

function createEmptyBreakdown(): Record<CampaignRecipientStatus, number> {
  return {
    pending: 0,
    sent: 0,
    failed: 0,
    bounced: 0,
    opened: 0,
    clicked: 0,
    unsubscribed: 0,
  };
}

function aggregateRecipientStats(recipients: readonly CampaignRecipient[]): CampaignStats {
  const stats: CampaignStats = {
    recipients: recipients.length,
    opens: 0,
    clicks: 0,
    unsubscribes: 0,
    bounces: 0,
  };
  for (const recipient of recipients) {
    if (recipient.openedAt) stats.opens += 1;
    if (recipient.clickedAt) stats.clicks += 1;
    if (recipient.unsubscribedAt) stats.unsubscribes += 1;
    if (recipient.status === 'bounced') stats.bounces += 1;
  }
  return stats;
}

function pushEvent(
  events: CampaignActivityEvent[],
  recipient: CampaignRecipient,
  kind: CampaignActivityEventKind,
  occurredAt: string | undefined,
): void {
  if (!occurredAt) return;
  events.push({
    kind,
    occurredAt,
    subscriberId: recipient.subscriberId,
    email: recipient.email,
  });
}

function buildRecentEvents(recipients: readonly CampaignRecipient[]): readonly CampaignActivityEvent[] {
  const events: CampaignActivityEvent[] = [];
  for (const recipient of recipients) {
    pushEvent(events, recipient, 'sent', recipient.sentAt);
    pushEvent(events, recipient, 'opened', recipient.openedAt);
    pushEvent(events, recipient, 'clicked', recipient.clickedAt);
    pushEvent(events, recipient, 'unsubscribed', recipient.unsubscribedAt);
  }
  return events
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))
    .slice(0, RECENT_EVENT_LIMIT);
}

function buildFunnel(stats: CampaignStats): readonly CampaignFunnelStep[] {
  const total = stats.recipients;
  return [
    { key: 'recipients', count: total, rate: total > 0 ? 1 : 0 },
    { key: 'opens', count: stats.opens, rate: rate(stats.opens, total) },
    { key: 'clicks', count: stats.clicks, rate: rate(stats.clicks, total) },
    { key: 'unsubscribes', count: stats.unsubscribes, rate: rate(stats.unsubscribes, total) },
    { key: 'bounces', count: stats.bounces, rate: rate(stats.bounces, total) },
  ];
}

export function buildCampaignAnalyticsSummary(
  recipients: readonly CampaignRecipient[],
  stats: CampaignStats = aggregateRecipientStats(recipients),
): CampaignAnalyticsSummary {
  const recipientBreakdown = createEmptyBreakdown();
  for (const recipient of recipients) {
    recipientBreakdown[recipient.status] += 1;
  }
  for (const status of RECIPIENT_STATUSES) {
    recipientBreakdown[status] += 0;
  }
  return {
    recipientBreakdown,
    recentEvents: buildRecentEvents(recipients),
    funnel: buildFunnel(stats),
  };
}
