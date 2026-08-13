import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  listBillingDocumentWebhookEvents,
  summarizeBillingDocumentWebhookEvents,
} from '@/lib/builder/billing-document-webhooks';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'admin',
    permission: 'view-commerce',
  })),
}));

vi.mock('@/lib/builder/billing-document-webhooks', () => ({
  listBillingDocumentWebhookEvents: vi.fn(async () => []),
  summarizeBillingDocumentWebhookEvents: vi.fn(() => ({
    total: 0,
    processed: 0,
    failed: 0,
    ignored: 0,
    replayed: 0,
  })),
}));

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const listBillingDocumentWebhookEventsMock = vi.mocked(listBillingDocumentWebhookEvents);
const summarizeBillingDocumentWebhookEventsMock = vi.mocked(summarizeBillingDocumentWebhookEvents);

function requestFor(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/webhooks${query ? `?${query}` : ''}`);
}

describe('builder billing document webhooks list API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'admin',
      permission: 'view-commerce',
    } as never);
    listBillingDocumentWebhookEventsMock.mockResolvedValue([]);
    summarizeBillingDocumentWebhookEventsMock.mockReturnValue({
      total: 0,
      processed: 0,
      failed: 0,
      ignored: 0,
      replayed: 0,
    });
  });

  it('returns a localized validation error for invalid webhook filters', async () => {
    const response = await GET(requestFor('locale=zh-hant&status=bad'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認帳單文件搜尋條件。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(listBillingDocumentWebhookEventsMock).not.toHaveBeenCalled();
  });

  it('returns a localized stable-code error when webhook loading fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listBillingDocumentWebhookEventsMock.mockRejectedValueOnce(new Error('blob path leaked'));

    const response = await GET(requestFor('locale=ko&status=all'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '청구서 웹훅 기록을 불러오지 못했습니다.',
      errorCode: 'billing_document_webhooks_failed',
    });
    expect(payload.error).not.toContain('blob path leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/billing-documents/webhooks] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('lists webhook events with parsed query filters', async () => {
    const event = {
      eventId: 'evt-1',
      status: 'failed',
    };
    listBillingDocumentWebhookEventsMock.mockResolvedValueOnce([event as never]);
    summarizeBillingDocumentWebhookEventsMock.mockReturnValueOnce({
      total: 1,
      processed: 0,
      failed: 1,
      ignored: 0,
      replayed: 0,
    });

    const response = await GET(requestFor('locale=en&q=evt&status=failed'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(listBillingDocumentWebhookEventsMock).toHaveBeenCalledWith({
      q: 'evt',
      status: 'failed',
    });
    expect(summarizeBillingDocumentWebhookEventsMock).toHaveBeenCalledWith([event]);
    expect(payload).toEqual({
      ok: true,
      events: [event],
      kpis: {
        total: 1,
        processed: 0,
        failed: 1,
        ignored: 0,
        replayed: 0,
      },
    });
  });
});
