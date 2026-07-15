import type { Campaign, CampaignRecipient, CampaignStatus } from './campaign-types';
import type { Subscriber } from './subscriber-types';
import {
  getCampaign,
  listRecipientsForCampaign,
  saveCampaign,
  saveRecipient,
  makeTrackingToken,
  aggregateStats,
} from './campaign-storage';
import { listActiveSubscribersForTags, getSubscriberByEmail } from './subscriber-storage';
import { renderCampaignForSubscriber } from './template-renderer';
import { sendMarketingEmail } from './email-provider';

/**
 * PR #4 — Email Marketing dispatcher.
 *
 * Sends one campaign in batches through the configured marketing email provider.
 * Recipients are materialized lazily: when send() is called the first time, we
 * expand segmentTags into a fixed recipient set and persist it so later batches
 * resume from the same list.
 */

export interface SendResult {
  ok: boolean;
  attempted: number;
  succeeded: number;
  failed: number;
  remaining: number;
  errors: Array<{ email: string; error: string }>;
}

const NO_RECIPIENTS_ERROR = 'no recipients to deliver to';

/**
 * Classify the full persisted recipient set into successful vs failed delivery
 * history. Tracking-advanced states (opened/clicked/unsubscribed) started from
 * a successful delivery, so they count as successes; bounced recipients are
 * permanent failures. Pending recipients are neither (still in flight).
 */
function classifyDelivery(recipients: CampaignRecipient[]): { successes: number; failures: number } {
  let successes = 0;
  let failures = 0;
  for (const recipient of recipients) {
    switch (recipient.status) {
      case 'sent':
      case 'opened':
      case 'clicked':
      case 'unsubscribed':
        successes += 1;
        break;
      case 'failed':
      case 'bounced':
        failures += 1;
        break;
      // 'pending' recipients are neither delivered nor failed yet.
    }
  }
  return { successes, failures };
}

function getBaseUrl(): string {
  const env = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '';
  if (env) return env.replace(/\/+$/, '');
  return 'https://tseng-law.com';
}

async function ensureRecipients(campaign: Campaign): Promise<void> {
  const existing = await listRecipientsForCampaign(campaign.campaignId);
  if (existing.length > 0) return;
  const subscribers = await listActiveSubscribersForTags(campaign.segmentTags);
  for (const sub of subscribers) {
    await saveRecipient({
      campaignId: campaign.campaignId,
      subscriberId: sub.subscriberId,
      email: sub.email,
      status: 'pending',
      attempts: 0,
      trackingToken: makeTrackingToken(),
    });
  }
}

/** Per-process lock to keep two concurrent batch dispatches from emailing the
 * same recipient twice (storage is not transactional). */
const inFlight = new Set<string>();

export async function sendCampaignBatch(args: {
  campaignId: string;
  batchSize: number;
  /**
   * Only the manual operator path passes this. When explicitly true and the
   * persisted campaign is failed/partial, failed recipients are reset to
   * pending and re-attempted. Already-successful recipients are never reset or
   * resent. Cron must never pass this (terminal failures stay terminal).
   */
  resetFailed?: boolean;
}): Promise<SendResult> {
  if (inFlight.has(args.campaignId)) {
    return { ok: true, attempted: 0, succeeded: 0, failed: 0, remaining: -1, errors: [{ email: '*', error: 'batch already in flight' }] };
  }
  inFlight.add(args.campaignId);
  try {
    return await sendCampaignBatchInner(args);
  } finally {
    inFlight.delete(args.campaignId);
  }
}

/** Honest idempotent result for an already-terminal campaign (no resend). */
async function terminalNoOpResult(campaign: Campaign): Promise<SendResult> {
  const recipients = await listRecipientsForCampaign(campaign.campaignId);
  const { successes, failures } = classifyDelivery(recipients);
  const remaining = recipients.filter((r) => r.status === 'pending').length;
  return {
    ok: campaign.status === 'sent',
    attempted: 0,
    succeeded: successes,
    failed: failures,
    remaining,
    errors: [],
  };
}

/** Reset only retryable (status 'failed') recipients back to pending, preserving
 * attempts/trackingToken and prior delivery history. Bounced (permanent) and
 * any successful recipients are left untouched. */
async function resetFailedRecipientsToPending(campaignId: string): Promise<void> {
  const recipients = await listRecipientsForCampaign(campaignId);
  for (const recipient of recipients) {
    if (recipient.status === 'failed') {
      await saveRecipient({
        ...recipient,
        status: 'pending',
        lastError: undefined,
      });
    }
  }
}

async function sendCampaignBatchInner(args: {
  campaignId: string;
  batchSize: number;
  resetFailed?: boolean;
}): Promise<SendResult> {
  const campaign = await getCampaign(args.campaignId);
  if (!campaign) {
    return { ok: false, attempted: 0, succeeded: 0, failed: 0, remaining: 0, errors: [{ email: '*', error: 'Campaign not found' }] };
  }

  const resetRequested = args.resetFailed === true;
  const canRetry = campaign.status === 'failed' || campaign.status === 'partial';

  if (resetRequested && canRetry) {
    await resetFailedRecipientsToPending(campaign.campaignId);
    await saveCampaign({ ...campaign, status: 'sending', lastError: undefined });
  } else if (campaign.status === 'sent' || campaign.status === 'failed' || campaign.status === 'partial') {
    // Terminal no-op: never resend. resetFailed without retry eligibility (e.g.
    // an already-sent campaign) also lands here as a no-resend no-op.
    return await terminalNoOpResult(campaign);
  } else if (campaign.status === 'draft' || campaign.status === 'scheduled') {
    await saveCampaign({ ...campaign, status: 'sending' });
  }

  await ensureRecipients(campaign);
  const recipients = await listRecipientsForCampaign(campaign.campaignId);
  const pending = recipients.filter((r) => r.status === 'pending').slice(0, args.batchSize);

  const result: SendResult = {
    ok: true,
    attempted: pending.length,
    succeeded: 0,
    failed: 0,
    remaining: 0,
    errors: [],
  };

  const baseUrl = getBaseUrl();

  for (const recipient of pending) {
    const subscriber = await getSubscriberByEmail(recipient.email);
    if (!subscriber || subscriber.status !== 'subscribed') {
      await saveRecipient({
        ...recipient,
        attempts: recipient.attempts + 1,
        status: 'failed',
        lastError: 'subscriber missing or not subscribed',
      });
      result.failed += 1;
      result.errors.push({ email: recipient.email, error: 'not subscribed' });
      continue;
    }
    const rendered = renderCampaignForSubscriber({
      campaign,
      subscriber,
      trackingToken: recipient.trackingToken,
      baseUrl,
    });
    const sent = await sendMarketingEmail({
      to: recipient.email,
      fromName: campaign.fromName,
      fromAddress: campaign.fromAddress,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    });
    if (sent.ok) {
      await saveRecipient({
        ...recipient,
        status: 'sent',
        attempts: recipient.attempts + 1,
        sentAt: new Date().toISOString(),
      });
      result.succeeded += 1;
    } else {
      await saveRecipient({
        ...recipient,
        status: 'failed',
        attempts: recipient.attempts + 1,
        lastError: sent.error,
      });
      result.failed += 1;
      result.errors.push({ email: recipient.email, error: sent.error ?? 'unknown' });
    }
  }

  const updatedRecipients = await listRecipientsForCampaign(campaign.campaignId);
  result.remaining = updatedRecipients.filter((r) => r.status === 'pending').length;

  // Classify the complete persisted recipient set after every batch, so both
  // mid-flight and terminal results report cumulative successes/failures
  // honestly. An earlier batch that left a recipient failed/bounced must keep
  // ok false even when the current batch had no new failures.
  const { successes, failures } = classifyDelivery(updatedRecipients);
  result.succeeded = successes;
  result.failed = failures;

  if (result.remaining === 0) {
    const total = updatedRecipients.length;
    const now = new Date().toISOString();
    let finalStatus: CampaignStatus;
    let sentAt: string | undefined = campaign.sentAt;
    let lastError: string | undefined;

    if (total === 0) {
      // Honest degenerate case: nothing could be delivered, so it is not "sent".
      finalStatus = 'failed';
      sentAt = undefined;
      lastError = NO_RECIPIENTS_ERROR;
    } else if (failures === 0) {
      finalStatus = 'sent';
      sentAt = campaign.sentAt ?? now;
      lastError = undefined;
    } else if (successes === 0) {
      finalStatus = 'failed';
      sentAt = undefined;
      lastError = undefined;
    } else {
      finalStatus = 'partial';
      sentAt = campaign.sentAt ?? now;
      lastError = undefined;
    }

    await saveCampaign({
      ...campaign,
      status: finalStatus,
      sentAt,
      lastError,
      stats: aggregateStats(updatedRecipients),
    });

    // Report the final aggregate so partial/all-failed feedback is honest.
    result.ok = finalStatus === 'sent';
  } else {
    // Mid-flight (campaign still 'sending'): ok only when the complete persisted
    // recipient set is failure-free, even if the current batch was clean.
    result.ok = failures === 0;
  }

  return result;
}

export async function dispatchPendingCampaigns(batchSize = 50): Promise<{
  campaigns: Array<{ campaignId: string; result: SendResult }>;
}> {
  const { listCampaigns } = await import('./campaign-storage');
  const all = await listCampaigns();
  const out: Array<{ campaignId: string; result: SendResult }> = [];
  const now = Date.now();
  for (const campaign of all) {
    // Cron never retries terminal outcomes (sent/failed/partial) and never
    // auto-sends a draft. It only resumes an in-flight 'sending' campaign or
    // fires a scheduled campaign whose time has come.
    if (
      campaign.status === 'sent' ||
      campaign.status === 'failed' ||
      campaign.status === 'partial' ||
      campaign.status === 'draft'
    ) {
      continue;
    }
    if (campaign.status === 'scheduled' && campaign.scheduledAt && Date.parse(campaign.scheduledAt) > now) continue;
    const result = await sendCampaignBatch({ campaignId: campaign.campaignId, batchSize });
    out.push({ campaignId: campaign.campaignId, result });
  }
  return { campaigns: out };
}

export async function sendTestEmail(args: {
  campaign: Campaign;
  testEmail: string;
  subscriber: Subscriber | null;
}): Promise<{ ok: boolean; error?: string }> {
  const fallbackSubscriber: Subscriber = args.subscriber ?? {
    subscriberId: 'preview',
    email: args.testEmail,
    status: 'subscribed',
    tags: ['preview'],
    preferredLocale: 'ko',
    unsubscribeToken: 'preview-token',
    source: 'preview',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const rendered = renderCampaignForSubscriber({
    campaign: args.campaign,
    subscriber: fallbackSubscriber,
    trackingToken: 'preview-tracking',
    baseUrl: getBaseUrl(),
  });
  const sent = await sendMarketingEmail({
    to: args.testEmail,
    fromName: args.campaign.fromName,
    fromAddress: args.campaign.fromAddress,
    subject: `[TEST] ${rendered.subject}`,
    html: rendered.html,
    text: rendered.text,
  });
  return sent.ok ? { ok: true } : { ok: false, error: sent.error };
}
