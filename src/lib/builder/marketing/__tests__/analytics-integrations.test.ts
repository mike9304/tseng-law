import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { z } from 'zod';

const ORIGINAL_CWD = process.cwd();
const ORIGINAL_ENV = { ...process.env };

let tmpRoot = '';

const analyticsPayloadSchema = z.object({
  event: z.enum(['campaign-opened', 'campaign-clicked', 'subscriber-unsubscribed']),
  triggeredAt: z.string(),
  recipient: z.object({
    campaignId: z.string(),
    subscriberId: z.string(),
    email: z.string(),
    status: z.string(),
  }).optional(),
  subscriber: z.object({
    subscriberId: z.string(),
    email: z.string(),
    status: z.string(),
  }).optional(),
  payload: z.record(z.string(), z.unknown()),
});

type CapturedRequest = {
  readonly url: string;
  readonly init?: RequestInit;
};

function createFetchRecorder(requests: CapturedRequest[]): typeof fetch {
  return async (input, init) => {
    requests.push({ url: String(input), init });
    return new Response('ok', { status: 200 });
  };
}

function requireRequest(requests: readonly CapturedRequest[], index: number): CapturedRequest {
  const request = requests.at(index);
  if (!request) throw new Error(`Missing request ${index}`);
  return request;
}

beforeEach(async () => {
  vi.resetModules();
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'marketing-analytics-integrations-'));
  process.chdir(tmpRoot);
  process.env = { ...ORIGINAL_ENV };
  process.env.CRM_BACKEND = 'local';
  delete process.env.BLOB_READ_WRITE_TOKEN;
});

afterEach(async () => {
  process.chdir(ORIGINAL_CWD);
  process.env = { ...ORIGINAL_ENV };
  await fs.rm(tmpRoot, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe('dispatchMarketingAnalyticsEvent', () => {
  it('fans campaign click analytics to enabled generic webhooks and skips Mailchimp audience integrations', async () => {
    const { mutateIntegrations } = await import('@/lib/builder/crm/integrations-model');
    const { dispatchMarketingAnalyticsEvent } = await import('../analytics-integrations');
    const requests: CapturedRequest[] = [];

    await mutateIntegrations((current) => ({
      next: [
        ...current,
        {
          id: 'generic-analytics',
          kind: 'generic-webhook',
          webhookUrl: 'https://hooks.example.test/marketing',
          enabled: true,
          createdAt: '2026-06-18T00:00:00.000Z',
        },
        {
          id: 'mailchimp-audience',
          kind: 'mailchimp-stub',
          settings: { audienceId: 'aud_123', apiKey: 'key-us6' },
          enabled: true,
          createdAt: '2026-06-18T00:00:00.000Z',
        },
      ],
      result: null,
    }));

    await dispatchMarketingAnalyticsEvent(
      {
        kind: 'campaign-clicked',
        occurredAt: '2026-06-18T01:02:03.000Z',
        recipient: {
          campaignId: 'camp_1',
          subscriberId: 'sub_1',
          email: 'lead@example.test',
          status: 'clicked',
          attempts: 1,
          trackingToken: 'track_1',
        },
        payload: { targetUrl: 'https://example.test/landing' },
      },
      { fetchImpl: createFetchRecorder(requests) },
    );

    expect(requests).toHaveLength(1);
    const request = requireRequest(requests, 0);
    expect(request.url).toBe('https://hooks.example.test/marketing');
    expect(request.init?.method).toBe('POST');
    expect(analyticsPayloadSchema.parse(JSON.parse(String(request.init?.body)))).toEqual({
      event: 'campaign-clicked',
      triggeredAt: '2026-06-18T01:02:03.000Z',
      recipient: {
        campaignId: 'camp_1',
        subscriberId: 'sub_1',
        email: 'lead@example.test',
        status: 'clicked',
      },
      payload: { targetUrl: 'https://example.test/landing' },
    });
  });

  it('formats subscriber unsubscribe analytics for Slack webhooks', async () => {
    const { mutateIntegrations } = await import('@/lib/builder/crm/integrations-model');
    const { dispatchMarketingAnalyticsEvent } = await import('../analytics-integrations');
    const requests: CapturedRequest[] = [];

    await mutateIntegrations((current) => ({
      next: [
        ...current,
        {
          id: 'slack-analytics',
          kind: 'slack-webhook',
          webhookUrl: 'https://hooks.slack.test/services/1',
          enabled: true,
          createdAt: '2026-06-18T00:00:00.000Z',
        },
      ],
      result: null,
    }));

    await dispatchMarketingAnalyticsEvent(
      {
        kind: 'subscriber-unsubscribed',
        occurredAt: '2026-06-18T01:02:03.000Z',
        subscriber: {
          subscriberId: 'sub_1',
          email: 'lead@example.test',
          status: 'unsubscribed',
          tags: ['subscriber'],
          preferredLocale: 'en',
          unsubscribeToken: 'unsub_1',
          source: 'public-form',
          createdAt: '2026-06-18T00:00:00.000Z',
          updatedAt: '2026-06-18T00:00:00.000Z',
        },
        payload: { source: 'unsubscribe-route' },
      },
      { fetchImpl: createFetchRecorder(requests) },
    );

    expect(requests).toHaveLength(1);
    const body = JSON.parse(String(requireRequest(requests, 0).init?.body));
    expect(body).toMatchObject({
      text: 'Marketing subscriber unsubscribed: lead@example.test',
    });
    expect(JSON.stringify(body)).toContain('subscriber-unsubscribed');
  });
});
