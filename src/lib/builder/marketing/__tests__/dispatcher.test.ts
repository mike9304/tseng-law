import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Campaign, CampaignRecipient } from '../campaign-types';
import type { Subscriber } from '../subscriber-types';

/**
 * In-memory fake storage + provider. vi.hoisted keeps these references alive
 * before the hoisted vi.mock factories run, so each test can seed and configure
 * outcomes without touching real Vercel Blob / filesystem / email providers.
 */
const store = vi.hoisted(() => {
  const campaigns = new Map<string, Campaign>();
  const recipients = new Map<string, CampaignRecipient>();
  const subscribers: Subscriber[] = [];
  // Per-recipient provider outcome: email -> 'ok' | 'fail'. Absent => ok.
  const providerOutcomes = new Map<string, 'ok' | 'fail'>();
  const saveCampaignCalls: Campaign[] = [];
  return {
    campaigns,
    recipients,
    subscribers,
    providerOutcomes,
    saveCampaignCalls,
    reset() {
      campaigns.clear();
      recipients.clear();
      subscribers.length = 0;
      providerOutcomes.clear();
      saveCampaignCalls.length = 0;
    },
  };
});

vi.mock('../campaign-storage', () => ({
  getCampaign: vi.fn(async (id: string) => store.campaigns.get(id) ?? null),
  saveCampaign: vi.fn(async (campaign: Campaign) => {
    store.campaigns.set(campaign.campaignId, { ...campaign });
    store.saveCampaignCalls.push({ ...campaign });
  }),
  listRecipientsForCampaign: vi.fn(async (campaignId: string) =>
    [...store.recipients.values()].filter((r) => r.campaignId === campaignId),
  ),
  saveRecipient: vi.fn(async (recipient: CampaignRecipient) => {
    store.recipients.set(`${recipient.campaignId}__${recipient.subscriberId}`, { ...recipient });
  }),
  makeTrackingToken: vi.fn(() => 'tok-preview'),
  listCampaigns: vi.fn(async () => [...store.campaigns.values()]),
  aggregateStats: vi.fn((recipients: CampaignRecipient[]) => {
    let opens = 0;
    let clicks = 0;
    let unsubscribes = 0;
    let bounces = 0;
    for (const r of recipients) {
      if (r.openedAt) opens += 1;
      if (r.clickedAt) clicks += 1;
      if (r.unsubscribedAt) unsubscribes += 1;
      if (r.status === 'bounced') bounces += 1;
    }
    return { recipients: recipients.length, opens, clicks, unsubscribes, bounces };
  }),
}));

vi.mock('../subscriber-storage', () => ({
  listActiveSubscribersForTags: vi.fn(async () => [...store.subscribers]),
  getSubscriberByEmail: vi.fn(
    async (email: string) => store.subscribers.find((s) => s.email === email) ?? null,
  ),
}));

vi.mock('../email-provider', () => ({
  sendMarketingEmail: vi.fn(async (args: { to: string }) => {
    if (store.providerOutcomes.get(args.to) === 'fail') {
      return { ok: false, provider: 'stub', error: 'provider down' };
    }
    return { ok: true, provider: 'stub', id: `stub_${args.to}` };
  }),
}));

vi.mock('../template-renderer', () => ({
  renderCampaignForSubscriber: vi.fn(() => ({
    subject: 's',
    html: '<p>h</p>',
    text: 't',
  })),
}));

const { sendCampaignBatch, dispatchPendingCampaigns } = await import('../dispatcher');
const { sendMarketingEmail } = await import('../email-provider');
const { saveCampaign, saveRecipient } = await import('../campaign-storage');

function makeSubscriber(email: string): Subscriber {
  return {
    subscriberId: `sub-${email}`,
    email,
    status: 'subscribed',
    tags: ['lead'],
    preferredLocale: 'ko',
    unsubscribeToken: `tok-${email}`,
    source: 'test',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

function makeCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    campaignId: 'cmp-1',
    name: 'Test campaign',
    subject: { ko: '안녕', 'zh-hant': '安', en: 'Hi' },
    bodyHtml: { ko: '<p>x</p>', 'zh-hant': '<p>x</p>', en: '<p>x</p>' },
    bodyText: { ko: 'x', 'zh-hant': 'x', en: 'x' },
    segmentTags: [],
    fromName: '호정국제',
    fromAddress: 'bookings@hoveringlaw.com.tw',
    status: 'draft',
    stats: { recipients: 0, opens: 0, clicks: 0, unsubscribes: 0, bounces: 0 },
    createdAt: '2026-05-13T00:00:00Z',
    updatedAt: '2026-05-13T00:00:00Z',
    ...overrides,
  };
}

function recipient(
  campaignId: string,
  email: string,
  status: CampaignRecipient['status'],
  extra: Partial<CampaignRecipient> = {},
): CampaignRecipient {
  return {
    campaignId,
    subscriberId: `sub-${email}`,
    email,
    status,
    attempts: 0,
    trackingToken: `tok-${email}`,
    ...extra,
  };
}

function seedRecipients(campaignId: string, list: CampaignRecipient[]): void {
  for (const r of list) store.recipients.set(`${r.campaignId}__${r.subscriberId}`, { ...r });
}

function getCampaign(id = 'cmp-1'): Campaign {
  const c = store.campaigns.get(id);
  if (!c) throw new Error('campaign not seeded');
  return c;
}

function listRecipients(campaignId: string): CampaignRecipient[] {
  return [...store.recipients.values()].filter((r) => r.campaignId === campaignId);
}

describe('sendCampaignBatch — delivery classification', () => {
  beforeEach(() => {
    store.reset();
  });

  it('all-success => sent, ok true, sentAt set', async () => {
    const emails = ['a@example.test', 'b@example.test'];
    store.subscribers.push(...emails.map(makeSubscriber));
    store.campaigns.set('cmp-1', makeCampaign());
    seedRecipients(
      'cmp-1',
      emails.map((e) => recipient('cmp-1', e, 'pending')),
    );

    const result = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 50 });

    expect(result.ok).toBe(true);
    expect(result.succeeded).toBe(2);
    expect(result.failed).toBe(0);
    expect(result.remaining).toBe(0);
    expect(getCampaign().status).toBe('sent');
    expect(getCampaign().sentAt).toBeTruthy();
    expect(listRecipients('cmp-1').every((r) => r.status === 'sent')).toBe(true);
  });

  it('all-failed => failed, ok false, sentAt absent, no delivered-success claim', async () => {
    const emails = ['a@example.test', 'b@example.test'];
    store.subscribers.push(...emails.map(makeSubscriber));
    store.providerOutcomes.set('a@example.test', 'fail');
    store.providerOutcomes.set('b@example.test', 'fail');
    store.campaigns.set('cmp-1', makeCampaign());
    seedRecipients(
      'cmp-1',
      emails.map((e) => recipient('cmp-1', e, 'pending')),
    );

    const result = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 50 });

    expect(result.ok).toBe(false);
    expect(result.succeeded).toBe(0);
    expect(result.failed).toBe(2);
    expect(result.remaining).toBe(0);
    expect(getCampaign().status).toBe('failed');
    expect(getCampaign().sentAt).toBeUndefined();
    expect(listRecipients('cmp-1').every((r) => r.status === 'failed')).toBe(true);
  });

  it('mixed => partial, ok false, sentAt set', async () => {
    store.subscribers.push(makeSubscriber('a@example.test'), makeSubscriber('b@example.test'));
    store.providerOutcomes.set('b@example.test', 'fail');
    store.campaigns.set('cmp-1', makeCampaign());
    seedRecipients('cmp-1', [
      recipient('cmp-1', 'a@example.test', 'pending'),
      recipient('cmp-1', 'b@example.test', 'pending'),
    ]);

    const result = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 50 });

    expect(result.ok).toBe(false);
    expect(result.succeeded).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.remaining).toBe(0);
    expect(getCampaign().status).toBe('partial');
    expect(getCampaign().sentAt).toBeTruthy();
  });

  it('multi-batch all-failed => never marked sent and final status failed', async () => {
    const emails = Array.from({ length: 4 }, (_, i) => `r${i}@example.test`);
    store.subscribers.push(...emails.map(makeSubscriber));
    for (const e of emails) store.providerOutcomes.set(e, 'fail');
    store.campaigns.set('cmp-1', makeCampaign());
    seedRecipients(
      'cmp-1',
      emails.map((e) => recipient('cmp-1', e, 'pending')),
    );

    const first = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 2 });
    // First batch failed but recipients remain: not terminal, status 'sending'.
    expect(first.failed).toBe(2);
    expect(first.remaining).toBe(2);
    expect(first.ok).toBe(false);
    expect(getCampaign().status).toBe('sending');
    expect(getCampaign().sentAt).toBeUndefined();

    const second = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 2 });
    expect(second.ok).toBe(false);
    expect(second.succeeded).toBe(0);
    expect(second.failed).toBe(4);
    expect(second.remaining).toBe(0);
    expect(getCampaign().status).toBe('failed');
    expect(getCampaign().sentAt).toBeUndefined();
    expect(store.saveCampaignCalls.some((c) => c.status === 'sent')).toBe(false);
  });

  it('zero recipients => honest failed result/status, ok false, no sentAt', async () => {
    store.campaigns.set('cmp-1', makeCampaign());

    const result = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 50 });

    expect(result.ok).toBe(false);
    expect(result.attempted).toBe(0);
    expect(result.succeeded).toBe(0);
    expect(result.failed).toBe(0);
    expect(result.remaining).toBe(0);
    expect(getCampaign().status).toBe('failed');
    expect(getCampaign().sentAt).toBeUndefined();
    expect(getCampaign().lastError).toBe('no recipients to deliver to');
  });
});

describe('sendCampaignBatch — multi-batch mid-flight honesty', () => {
  beforeEach(() => {
    store.reset();
  });

  it('earlier batch failure keeps later clean batch ok:false with cumulative counts while pending remains', async () => {
    // Three recipients; batchSize 1 so each send is its own batch dispatch.
    const emails = ['a@example.test', 'b@example.test', 'c@example.test'];
    store.subscribers.push(...emails.map(makeSubscriber));
    // Recipient A fails for the first batch only.
    store.providerOutcomes.set('a@example.test', 'fail');
    store.campaigns.set('cmp-1', makeCampaign());
    seedRecipients(
      'cmp-1',
      emails.map((e) => recipient('cmp-1', e, 'pending')),
    );

    // Batch 1: A fails. B and C still pending => not terminal.
    const first = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 1 });
    expect(first.attempted).toBe(1);
    expect(first.ok).toBe(false);
    expect(first.succeeded).toBe(0);
    expect(first.failed).toBe(1);
    expect(first.remaining).toBe(2);
    expect(getCampaign().status).toBe('sending');
    expect(getCampaign().sentAt).toBeUndefined();

    // Batch 2: B succeeds. A is still persisted as failed and C is still pending,
    // so the complete recipient set contains a failure even though this batch
    // was clean. The result must stay ok:false and report cumulative counts,
    // never claiming a terminal sent.
    const second = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 1 });
    expect(second.attempted).toBe(1);
    expect(second.ok).toBe(false);
    expect(second.succeeded).toBe(1);
    expect(second.failed).toBe(1);
    expect(second.remaining).toBe(1);
    expect(getCampaign().status).toBe('sending');
    expect(getCampaign().sentAt).toBeUndefined();
    expect(store.saveCampaignCalls.some((c) => c.status === 'sent')).toBe(false);

    // Final batch: C succeeds. A remains failed => terminal partial, still ok:false.
    const third = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 1 });
    expect(third.ok).toBe(false);
    expect(third.succeeded).toBe(2);
    expect(third.failed).toBe(1);
    expect(third.remaining).toBe(0);
    expect(getCampaign().status).toBe('partial');
    expect(getCampaign().sentAt).toBeTruthy();
  });

  it('clean multi-batch run reports cumulative successes and ends ok:true / sent', async () => {
    const emails = ['a@example.test', 'b@example.test', 'c@example.test'];
    store.subscribers.push(...emails.map(makeSubscriber));
    store.campaigns.set('cmp-1', makeCampaign());
    seedRecipients(
      'cmp-1',
      emails.map((e) => recipient('cmp-1', e, 'pending')),
    );

    // Batch 1: A succeeds, B/C pending => mid-flight, failure-free.
    const first = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 1 });
    expect(first.ok).toBe(true);
    expect(first.succeeded).toBe(1);
    expect(first.failed).toBe(0);
    expect(first.remaining).toBe(2);
    expect(getCampaign().status).toBe('sending');

    // Batch 2: B succeeds => cumulative successes 2, still mid-flight and ok:true.
    const second = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 1 });
    expect(second.ok).toBe(true);
    expect(second.succeeded).toBe(2);
    expect(second.failed).toBe(0);
    expect(second.remaining).toBe(1);
    expect(getCampaign().status).toBe('sending');

    // Final batch: C succeeds => terminal sent.
    const third = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 1 });
    expect(third.ok).toBe(true);
    expect(third.succeeded).toBe(3);
    expect(third.failed).toBe(0);
    expect(third.remaining).toBe(0);
    expect(getCampaign().status).toBe('sent');
    expect(getCampaign().sentAt).toBeTruthy();
  });
});

describe('sendCampaignBatch — retry (resetFailed)', () => {
  beforeEach(() => {
    store.reset();
  });

  it('resets and reattempts only failed recipients, never already sent/opened/clicked/unsubscribed', async () => {
    store.subscribers.push(
      makeSubscriber('sent@example.test'),
      makeSubscriber('opened@example.test'),
      makeSubscriber('clicked@example.test'),
      makeSubscriber('unsub@example.test'),
      makeSubscriber('failed@example.test'),
    );
    // On retry the previously-failed recipient now succeeds.
    store.campaigns.set(
      'cmp-1',
      makeCampaign({ status: 'partial', sentAt: '2026-06-01T00:00:00.000Z' }),
    );
    seedRecipients('cmp-1', [
      recipient('cmp-1', 'sent@example.test', 'sent'),
      recipient('cmp-1', 'opened@example.test', 'opened', { openedAt: '2026-06-01T00:00:00.000Z' }),
      recipient('cmp-1', 'clicked@example.test', 'clicked', { clickedAt: '2026-06-01T00:00:00.000Z' }),
      recipient('cmp-1', 'unsub@example.test', 'unsubscribed', {
        unsubscribedAt: '2026-06-01T00:00:00.000Z',
      }),
      recipient('cmp-1', 'failed@example.test', 'failed', { attempts: 1, lastError: 'boom' }),
    ]);

    vi.mocked(sendMarketingEmail).mockClear();
    const result = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 50, resetFailed: true });

    // Only the failed recipient was re-sent.
    expect(sendMarketingEmail).toHaveBeenCalledTimes(1);
    expect(sendMarketingEmail).toHaveBeenCalledWith(expect.objectContaining({ to: 'failed@example.test' }));
    // Final aggregate clears all failures => sent, ok true.
    expect(result.ok).toBe(true);
    expect(result.succeeded).toBe(5);
    expect(result.failed).toBe(0);
    expect(getCampaign().status).toBe('sent');
    // Already-successful recipients kept their history.
    const byEmail = new Map(listRecipients('cmp-1').map((r) => [r.email, r]));
    expect(byEmail.get('opened@example.test')?.status).toBe('opened');
    expect(byEmail.get('unsub@example.test')?.status).toBe('unsubscribed');
  });

  it('retry that remains mixed stays partial', async () => {
    store.subscribers.push(makeSubscriber('ok@example.test'), makeSubscriber('bad@example.test'));
    store.providerOutcomes.set('bad@example.test', 'fail');
    store.campaigns.set('cmp-1', makeCampaign({ status: 'partial', sentAt: '2026-06-01T00:00:00.000Z' }));
    seedRecipients('cmp-1', [
      recipient('cmp-1', 'ok@example.test', 'sent'),
      recipient('cmp-1', 'bad@example.test', 'failed', { attempts: 1 }),
    ]);

    const result = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 50, resetFailed: true });

    expect(result.ok).toBe(false);
    expect(result.succeeded).toBe(1);
    expect(result.failed).toBe(1);
    expect(getCampaign().status).toBe('partial');
    expect(getCampaign().sentAt).toBeTruthy();
  });

  it('default resetFailed:false on a terminal failed campaign is an idempotent no-resend no-op with honest ok false', async () => {
    store.subscribers.push(makeSubscriber('bad@example.test'));
    store.campaigns.set('cmp-1', makeCampaign({ status: 'failed' }));
    seedRecipients('cmp-1', [recipient('cmp-1', 'bad@example.test', 'failed', { attempts: 2 })]);

    vi.mocked(sendMarketingEmail).mockClear();
    vi.mocked(saveRecipient).mockClear();
    const result = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 50 });

    expect(result.ok).toBe(false);
    expect(result.attempted).toBe(0);
    expect(result.failed).toBe(1);
    expect(result.remaining).toBe(0);
    expect(sendMarketingEmail).not.toHaveBeenCalled();
    expect(saveRecipient).not.toHaveBeenCalled();
    expect(getCampaign().status).toBe('failed');
  });

  it('idempotent terminal sent no-op reports honest ok true and never resends', async () => {
    store.campaigns.set('cmp-1', makeCampaign({ status: 'sent', sentAt: '2026-06-01T00:00:00.000Z' }));
    seedRecipients('cmp-1', [recipient('cmp-1', 'ok@example.test', 'sent')]);

    vi.mocked(sendMarketingEmail).mockClear();
    const result = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 50 });

    expect(result.ok).toBe(true);
    expect(result.attempted).toBe(0);
    expect(result.succeeded).toBe(1);
    expect(result.remaining).toBe(0);
    expect(sendMarketingEmail).not.toHaveBeenCalled();
    expect(getCampaign().status).toBe('sent');
  });

  it('resetFailed:true on an already-sent campaign is a no-resend no-op (no successful recipient is reset)', async () => {
    store.campaigns.set('cmp-1', makeCampaign({ status: 'sent', sentAt: '2026-06-01T00:00:00.000Z' }));
    seedRecipients('cmp-1', [recipient('cmp-1', 'ok@example.test', 'sent')]);

    vi.mocked(sendMarketingEmail).mockClear();
    const result = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 50, resetFailed: true });

    expect(result.ok).toBe(true);
    expect(sendMarketingEmail).not.toHaveBeenCalled();
    expect(getCampaign().status).toBe('sent');
  });
});

describe('sendCampaignBatch — concurrency & classification edge cases', () => {
  beforeEach(() => {
    store.reset();
  });

  it('concurrent same-campaign call preserves the in-flight short circuit', async () => {
    const emails = ['a@example.test', 'b@example.test'];
    store.subscribers.push(...emails.map(makeSubscriber));
    store.campaigns.set('cmp-1', makeCampaign());
    seedRecipients(
      'cmp-1',
      emails.map((e) => recipient('cmp-1', e, 'pending')),
    );

    const [first, second] = await Promise.all([
      sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 50 }),
      sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 50 }),
    ]);

    const inFlightNoOp = first.remaining === -1 ? first : second;
    const real = first.remaining === -1 ? second : first;
    expect(inFlightNoOp.remaining).toBe(-1);
    expect(inFlightNoOp.errors[0]?.error).toBe('batch already in flight');
    expect(real.ok).toBe(true);
    expect(real.succeeded).toBe(2);
    // The real dispatch still delivered exactly once (no double-send).
    expect(sendMarketingEmail).toHaveBeenCalledTimes(2);
  });

  it('classifies a retry after tracking events without misclassifying opened/clicked/unsubscribed', async () => {
    store.subscribers.push(
      makeSubscriber('opened@example.test'),
      makeSubscriber('unsub@example.test'),
      makeSubscriber('retry@example.test'),
    );
    store.campaigns.set('cmp-1', makeCampaign({ status: 'partial', sentAt: '2026-06-01T00:00:00.000Z' }));
    seedRecipients('cmp-1', [
      recipient('cmp-1', 'opened@example.test', 'opened', { openedAt: '2026-06-01T00:00:00.000Z' }),
      recipient('cmp-1', 'unsub@example.test', 'unsubscribed', {
        unsubscribedAt: '2026-06-01T00:00:00.000Z',
      }),
      recipient('cmp-1', 'retry@example.test', 'failed', { attempts: 1 }),
    ]);

    const result = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 50, resetFailed: true });

    // opened + unsubscribed stay successful; retry succeeds => 3 success, 0 fail => sent.
    expect(result.succeeded).toBe(3);
    expect(result.failed).toBe(0);
    expect(result.ok).toBe(true);
    expect(getCampaign().status).toBe('sent');
  });

  it('production no-provider fail-closed reaches the all-failed classification with no delivered-success claim', async () => {
    // Simulate the production stub rejecting every send (provider returns ok:false for all).
    const emails = ['a@example.test', 'b@example.test'];
    store.subscribers.push(...emails.map(makeSubscriber));
    for (const e of emails) store.providerOutcomes.set(e, 'fail');
    store.campaigns.set('cmp-1', makeCampaign());
    seedRecipients(
      'cmp-1',
      emails.map((e) => recipient('cmp-1', e, 'pending')),
    );

    const result = await sendCampaignBatch({ campaignId: 'cmp-1', batchSize: 50 });

    expect(result.ok).toBe(false);
    expect(result.succeeded).toBe(0);
    expect(getCampaign().status).toBe('failed');
    expect(getCampaign().sentAt).toBeUndefined();
  });
});

describe('dispatchPendingCampaigns (cron)', () => {
  beforeEach(() => {
    store.reset();
  });

  it('skips sent/failed/partial/draft and future-scheduled, resumes sending and fires due-scheduled', async () => {
    store.subscribers.push(makeSubscriber('resume@example.test'));
    const past = '2026-01-01T00:00:00.000Z';
    const future = '2099-01-01T00:00:00.000Z';
    store.campaigns.set('cmp-sent', makeCampaign({ campaignId: 'cmp-sent', status: 'sent', sentAt: past }));
    store.campaigns.set('cmp-failed', makeCampaign({ campaignId: 'cmp-failed', status: 'failed' }));
    store.campaigns.set('cmp-partial', makeCampaign({ campaignId: 'cmp-partial', status: 'partial', sentAt: past }));
    store.campaigns.set('cmp-draft', makeCampaign({ campaignId: 'cmp-draft', status: 'draft' }));
    store.campaigns.set('cmp-future', makeCampaign({ campaignId: 'cmp-future', status: 'scheduled', scheduledAt: future }));
    store.campaigns.set('cmp-due', makeCampaign({ campaignId: 'cmp-due', status: 'scheduled', scheduledAt: past }));
    store.campaigns.set('cmp-sending', makeCampaign({ campaignId: 'cmp-sending', status: 'sending' }));
    seedRecipients('cmp-sending', [recipient('cmp-sending', 'resume@example.test', 'pending')]);
    seedRecipients('cmp-due', [recipient('cmp-due', 'resume@example.test', 'pending')]);

    vi.mocked(sendMarketingEmail).mockClear();
    vi.mocked(saveCampaign).mockClear();
    const { campaigns } = await dispatchPendingCampaigns(50);

    const processed = campaigns.map((c) => c.campaignId).sort();
    expect(processed).toEqual(['cmp-due', 'cmp-sending']);
    // Terminal outcomes were never rewritten by cron.
    expect(store.campaigns.get('cmp-sent')?.status).toBe('sent');
    expect(store.campaigns.get('cmp-failed')?.status).toBe('failed');
    expect(store.campaigns.get('cmp-partial')?.status).toBe('partial');
    expect(store.campaigns.get('cmp-draft')?.status).toBe('draft');
    expect(store.campaigns.get('cmp-future')?.status).toBe('scheduled');
    // The in-flight resume did not pass resetFailed (manual-only).
    expect(sendMarketingEmail).toHaveBeenCalled();
  });

  it('cron never passes resetFailed (terminal failed stays failed)', async () => {
    store.campaigns.set('cmp-failed', makeCampaign({ campaignId: 'cmp-failed', status: 'failed' }));
    seedRecipients('cmp-failed', [recipient('cmp-failed', 'bad@example.test', 'failed', { attempts: 1 })]);

    vi.mocked(sendMarketingEmail).mockClear();
    const { campaigns } = await dispatchPendingCampaigns(50);

    expect(campaigns).toEqual([]);
    expect(sendMarketingEmail).not.toHaveBeenCalled();
    expect(store.campaigns.get('cmp-failed')?.status).toBe('failed');
  });
});
