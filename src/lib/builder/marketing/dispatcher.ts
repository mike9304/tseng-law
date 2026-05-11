import type { Campaign } from './campaign-types';
import type { Subscriber } from './subscriber-types';
import {
  getCampaign,
  listRecipientsForCampaign,
  saveCampaign,
  saveRecipient,
  makeTrackingToken,
} from './campaign-storage';
import { listActiveSubscribersForTags, getSubscriberByEmail } from './subscriber-storage';
import { renderCampaignForSubscriber } from './template-renderer';

/**
 * PR #4 — Email Marketing dispatcher.
 *
 * Sends one campaign in batches via Resend (or a local stub when RESEND_API_KEY is
 * unset). Recipients are materialized lazily — when send() is called the first
 * time, we expand the campaign's segmentTags into a fixed recipient set and
 * persist them, so subsequent batches resume from the same list.
 */

interface SendResult {
  ok: boolean;
  attempted: number;
  succeeded: number;
  failed: number;
  remaining: number;
  errors: Array<{ email: string; error: string }>;
}

function getBaseUrl(): string {
  const env = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '';
  if (env) return env.replace(/\/+$/, '');
  return 'https://tseng-law.com';
}

async function sendOne(args: {
  to: string;
  fromName: string;
  fromAddress: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY ?? '';
  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, error: 'RESEND_API_KEY unset in production' };
    }
    return { ok: true, id: `stub_${Date.now()}` };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${args.fromName} <${args.fromAddress}>`,
        to: args.to,
        subject: args.subject,
        html: args.html,
        text: args.text,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return { ok: false, error: `${res.status} ${detail.slice(0, 200)}` };
    }
    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
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

export async function sendCampaignBatch(args: {
  campaignId: string;
  batchSize: number;
}): Promise<SendResult> {
  const campaign = await getCampaign(args.campaignId);
  if (!campaign) {
    return { ok: false, attempted: 0, succeeded: 0, failed: 0, remaining: 0, errors: [{ email: '*', error: 'Campaign not found' }] };
  }

  if (campaign.status === 'sent') {
    return { ok: true, attempted: 0, succeeded: 0, failed: 0, remaining: 0, errors: [] };
  }
  if (campaign.status === 'draft' || campaign.status === 'scheduled') {
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
    const sent = await sendOne({
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

  if (result.remaining === 0) {
    await saveCampaign({
      ...campaign,
      status: 'sent',
      sentAt: campaign.sentAt ?? new Date().toISOString(),
      stats: {
        recipients: updatedRecipients.length,
        opens: updatedRecipients.filter((r) => r.openedAt).length,
        clicks: updatedRecipients.filter((r) => r.clickedAt).length,
        unsubscribes: updatedRecipients.filter((r) => r.unsubscribedAt).length,
        bounces: updatedRecipients.filter((r) => r.status === 'bounced').length,
      },
    });
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
    if (campaign.status === 'sent' || campaign.status === 'draft' || campaign.status === 'failed') continue;
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
  const sent = await sendOne({
    to: args.testEmail,
    fromName: args.campaign.fromName,
    fromAddress: args.campaign.fromAddress,
    subject: `[TEST] ${rendered.subject}`,
    html: rendered.html,
    text: rendered.text,
  });
  return sent.ok ? { ok: true } : { ok: false, error: sent.error };
}
