import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  listSubscriptions,
  makeWebhookId,
  makeWebhookSecret,
  saveSubscription,
} from '@/lib/builder/webhooks/storage';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/webhooks/storage', () => ({
  listSubscriptions: vi.fn(),
  makeWebhookId: vi.fn(() => 'wh_test'),
  makeWebhookSecret: vi.fn(() => 'whsec_1234567890abcdef1234567890abcdef'),
  saveSubscription: vi.fn(),
}));

const subscription = {
  webhookId: 'wh_test',
  url: 'https://hooks.example.com/incoming',
  events: ['form.submitted'],
  secret: 'whsec_1234567890abcdef1234567890abcdef',
  description: 'Test hook',
  active: true,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const guardMutationMock = vi.mocked(guardMutation);
const listSubscriptionsMock = vi.mocked(listSubscriptions);
const makeWebhookIdMock = vi.mocked(makeWebhookId);
const makeWebhookSecretMock = vi.mocked(makeWebhookSecret);
const saveSubscriptionMock = vi.mocked(saveSubscription);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/webhooks${query ? `?${query}` : ''}`);
}

function postRequest(
  query = '',
  body: string | unknown = {
    url: 'https://hooks.example.com/incoming',
    events: ['form.submitted'],
    description: 'Test hook',
    active: true,
  },
): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/webhooks${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/webhooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    listSubscriptionsMock.mockResolvedValue([subscription] as never);
    makeWebhookIdMock.mockReturnValue('wh_test');
    makeWebhookSecretMock.mockReturnValue('whsec_1234567890abcdef1234567890abcdef');
    saveSubscriptionMock.mockResolvedValue(undefined as never);
  });

  it('lists webhooks while preserving success response shape and masking secrets', async () => {
    const response = await GET(getRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      allowReadOnly: true,
      permission: 'settings',
    });
    expect(payload).toEqual({
      ok: true,
      subscriptions: [
        {
          ...subscription,
          secret: 'whsec_123456…',
        },
      ],
      total: 1,
    });
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listSubscriptionsMock.mockRejectedValueOnce(new Error('webhook list secret leaked'));

    const response = await GET(getRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load webhooks.',
      errorCode: 'webhook_list_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('webhook list secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/webhooks] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await POST(postRequest('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the webhook request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized validation errors', async () => {
    const response = await POST(postRequest('locale=zh-hant', {
      url: 'not-a-url',
      events: [],
      active: true,
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認 Webhook 請求內容。',
      errorCode: 'validation_error',
    });
    expect(payload.details).toBeDefined();
    expect(saveSubscriptionMock).not.toHaveBeenCalled();
  });

  it('creates webhooks while preserving the one-time secret response shape', async () => {
    const response = await POST(postRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(saveSubscriptionMock).toHaveBeenCalledWith(expect.objectContaining({
      webhookId: 'wh_test',
      url: 'https://hooks.example.com/incoming',
      events: ['form.submitted'],
      secret: 'whsec_1234567890abcdef1234567890abcdef',
      active: true,
    }));
    expect(payload).toMatchObject({
      ok: true,
      subscription: {
        webhookId: 'wh_test',
        secret: 'whsec_1234567890abcdef1234567890abcdef',
      },
    });
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveSubscriptionMock.mockRejectedValueOnce(new Error('webhook create secret leaked'));

    const response = await POST(postRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Webhook을 만들지 못했습니다.',
      errorCode: 'webhook_create_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('webhook create secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/webhooks] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
