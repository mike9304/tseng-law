import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getSubscription,
  saveSubscription,
} from '@/lib/builder/webhooks/storage';
import { DELETE, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/webhooks/storage', () => ({
  getSubscription: vi.fn(),
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
const getSubscriptionMock = vi.mocked(getSubscription);
const saveSubscriptionMock = vi.mocked(saveSubscription);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/webhooks/wh_test${query ? `?${query}` : ''}`);
}

function patchRequest(query = '', body: string | unknown = { active: false }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/webhooks/wh_test${query ? `?${query}` : ''}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/webhooks/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    getSubscriptionMock.mockResolvedValue(subscription as never);
    saveSubscriptionMock.mockResolvedValue(undefined as never);
  });

  it('returns localized not-found errors for patch', async () => {
    getSubscriptionMock.mockResolvedValueOnce(null as never);

    const response = await PATCH(patchRequest('locale=zh-hant'), { params: Promise.resolve({ id: 'missing' }) });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到 Webhook。',
      errorCode: 'webhook_not_found',
    });
  });

  it('returns localized invalid JSON errors for patch', async () => {
    const response = await PATCH(patchRequest('locale=en', '{'), { params: Promise.resolve({ id: 'wh_test' }) });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the webhook request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized validation errors for patch', async () => {
    const response = await PATCH(patchRequest('locale=zh-hant', { url: 'not-a-url' }), { params: Promise.resolve({ id: 'wh_test' }) });
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

  it('updates webhooks while preserving success response shape and masking secrets', async () => {
    const response = await PATCH(patchRequest('locale=ko'), { params: Promise.resolve({ id: 'wh_test' }) });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(saveSubscriptionMock).toHaveBeenCalledWith(expect.objectContaining({
      webhookId: 'wh_test',
      active: false,
    }));
    expect(payload).toMatchObject({
      ok: true,
      subscription: {
        webhookId: 'wh_test',
        active: false,
        secret: 'whsec_123456…',
      },
    });
  });

  it('returns localized update failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveSubscriptionMock.mockRejectedValueOnce(new Error('webhook update secret leaked'));

    const response = await PATCH(patchRequest('locale=en'), { params: Promise.resolve({ id: 'wh_test' }) });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to save the webhook.',
      errorCode: 'webhook_update_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('webhook update secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/webhooks/:id] PATCH failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('deactivates webhooks while preserving success response shape', async () => {
    const response = await DELETE(request('locale=ko'), { params: Promise.resolve({ id: 'wh_test' }) });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(saveSubscriptionMock).toHaveBeenCalledWith(expect.objectContaining({
      webhookId: 'wh_test',
      active: false,
    }));
    expect(payload).toEqual({
      ok: true,
      deactivated: true,
    });
  });

  it('returns localized delete failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveSubscriptionMock.mockRejectedValueOnce(new Error('webhook delete secret leaked'));

    const response = await DELETE(request('locale=ko'), { params: Promise.resolve({ id: 'wh_test' }) });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Webhook을 비활성화하지 못했습니다.',
      errorCode: 'webhook_delete_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('webhook delete secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/webhooks/:id] DELETE failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
