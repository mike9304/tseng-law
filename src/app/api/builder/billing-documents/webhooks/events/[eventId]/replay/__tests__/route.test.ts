import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { replayBillingDocumentWebhookEvent } from '@/lib/builder/billing-document-webhooks';
import { guardMutation } from '@/lib/builder/security/guard';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/billing-document-webhooks', () => ({
  replayBillingDocumentWebhookEvent: vi.fn(async () => ({
    event: null,
    document: null,
    order: null,
    booking: null,
    changed: false,
    reason: 'event_not_found',
  })),
}));

const guardMutationMock = vi.mocked(guardMutation);
const replayBillingDocumentWebhookEventMock = vi.mocked(replayBillingDocumentWebhookEvent);

function requestFor(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/webhooks/events/evt-1/replay${query ? `?${query}` : ''}`, {
    method: 'POST',
  });
}

describe('builder billing document webhook replay API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    replayBillingDocumentWebhookEventMock.mockResolvedValue({
      event: null,
      document: null,
      order: null,
      booking: null,
      changed: false,
      reason: 'event_not_found',
    });
  });

  it('returns a localized not-found error when the webhook event is missing', async () => {
    const response = await POST(requestFor('locale=zh-hant'), { params: Promise.resolve({ eventId: 'evt-1' }) });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到 Webhook 事件。',
      errorCode: 'event_not_found',
    });
    expect(replayBillingDocumentWebhookEventMock).toHaveBeenCalledWith('evt-1');
  });

  it('returns a localized stable-code error when replay fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    replayBillingDocumentWebhookEventMock.mockRejectedValueOnce(new Error('stripe payload leaked'));

    const response = await POST(requestFor('locale=ko'), { params: Promise.resolve({ eventId: 'evt-2' }) });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '웹훅 다시 재생에 실패했습니다.',
      errorCode: 'billing_document_webhook_replay_failed',
    });
    expect(payload.error).not.toContain('stripe payload leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/billing-documents/webhooks/events/:eventId/replay] POST failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('replays an event and preserves the success response body', async () => {
    const event = { eventId: 'evt-3', status: 'processed' };
    const document = { documentId: 'doc-1' };
    replayBillingDocumentWebhookEventMock.mockResolvedValueOnce({
      event: event as never,
      document: document as never,
      order: null,
      booking: null,
      changed: true,
      reason: undefined,
    });

    const response = await POST(requestFor('locale=en'), { params: Promise.resolve({ eventId: 'evt-3' }) });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'mutation',
      permission: 'manage-commerce',
    });
    expect(payload).toEqual({
      ok: true,
      changed: true,
      event,
      document,
      order: null,
      booking: null,
    });
  });
});
