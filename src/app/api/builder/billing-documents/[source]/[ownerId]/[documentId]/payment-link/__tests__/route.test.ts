import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createBillingDocumentPaymentLink,
  parseBillingDocumentSource,
  revokeBillingDocumentPaymentLink,
} from '@/lib/builder/billing-documents';
import { guardMutation } from '@/lib/builder/security/guard';
import { DELETE, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/billing-documents', () => ({
  createBillingDocumentPaymentLink: vi.fn(async () => null),
  parseBillingDocumentSource: vi.fn((source: string) => (
    source === 'order' || source === 'booking' ? source : null
  )),
  revokeBillingDocumentPaymentLink: vi.fn(async () => null),
}));

const guardMutationMock = vi.mocked(guardMutation);
const parseBillingDocumentSourceMock = vi.mocked(parseBillingDocumentSource);
const createBillingDocumentPaymentLinkMock = vi.mocked(createBillingDocumentPaymentLink);
const revokeBillingDocumentPaymentLinkMock = vi.mocked(revokeBillingDocumentPaymentLink);

function postRequest(source = 'order', query = '', body: unknown = { renew: true }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/${source}/owner-1/doc-1/payment-link${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function deleteRequest(source = 'order', query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/${source}/owner-1/doc-1/payment-link${query ? `?${query}` : ''}`, {
    method: 'DELETE',
  });
}

describe('builder billing document payment link API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    parseBillingDocumentSourceMock.mockImplementation((source) => (
      source === 'order' || source === 'booking' ? source as never : null
    ));
    createBillingDocumentPaymentLinkMock.mockResolvedValue(null);
    revokeBillingDocumentPaymentLinkMock.mockResolvedValue(null);
  });

  it('returns localized source errors', async () => {
    const response = await POST(postRequest('bad', 'locale=zh-hant'), {
      params: Promise.resolve({ source: 'bad', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '不支援的帳單文件來源。',
      errorCode: 'invalid_document_source',
    });
    expect(createBillingDocumentPaymentLinkMock).not.toHaveBeenCalled();
  });

  it('returns localized validation errors for invalid link payloads', async () => {
    const response = await POST(postRequest('order', 'locale=ko', { expiresAt: 'bad-date' }), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '결제 링크 요청 정보를 확인해 주세요.',
      errorCode: 'invalid_payment_link_payload',
    });
    expect(payload.issues).toBeDefined();
  });

  it('returns localized unavailable errors when a payment link cannot be created', async () => {
    const response = await POST(postRequest('order', 'locale=en'), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'A payment link cannot be created for this document.',
      errorCode: 'payment_link_unavailable',
    });
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createBillingDocumentPaymentLinkMock.mockRejectedValueOnce(new Error('processor secret leaked'));

    const response = await POST(postRequest('order', 'locale=zh-hant'), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法建立付款連結。',
      errorCode: 'payment_link_failed',
    });
    expect(payload.error).not.toContain('processor secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/billing-documents/payment-link] POST failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('returns localized not-found errors when revoking missing payment links', async () => {
    const response = await DELETE(deleteRequest('order', 'locale=zh-hant'), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到帳單文件。',
      errorCode: 'document_not_found',
    });
  });

  it('returns localized revoke failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    revokeBillingDocumentPaymentLinkMock.mockRejectedValueOnce(new Error('secret token leaked'));

    const response = await DELETE(deleteRequest('order', 'locale=ko'), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '결제 링크를 취소하지 못했습니다.',
      errorCode: 'payment_link_revoke_failed',
    });
    expect(payload.error).not.toContain('secret token leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/billing-documents/payment-link] DELETE failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('creates and revokes payment links while preserving success response shapes', async () => {
    const created = { documentId: 'doc-1', paymentLinkStatus: 'created' };
    const revoked = { documentId: 'doc-1', paymentLinkStatus: 'revoked' };
    createBillingDocumentPaymentLinkMock.mockResolvedValueOnce(created as never);
    revokeBillingDocumentPaymentLinkMock.mockResolvedValueOnce(revoked as never);

    const postResponse = await POST(postRequest('order', 'locale=en'), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const postPayload = await postResponse.json();
    const deleteResponse = await DELETE(deleteRequest('order', 'locale=en'), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const deletePayload = await deleteResponse.json();

    expect(postResponse.status).toBe(200);
    expect(postPayload).toEqual({ ok: true, document: created });
    expect(createBillingDocumentPaymentLinkMock).toHaveBeenCalledWith('order', 'owner-1', 'doc-1', {
      expiresAt: undefined,
      renew: true,
    });
    expect(deleteResponse.status).toBe(200);
    expect(deletePayload).toEqual({ ok: true, document: revoked });
  });
});
