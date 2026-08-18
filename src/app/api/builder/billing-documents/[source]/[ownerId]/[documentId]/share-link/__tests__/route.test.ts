import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createBillingDocumentShareLink,
  parseBillingDocumentSource,
  revokeBillingDocumentShareLink,
} from '@/lib/builder/billing-documents';
import { guardMutation } from '@/lib/builder/security/guard';
import { DELETE, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/billing-documents', () => ({
  createBillingDocumentShareLink: vi.fn(async () => null),
  parseBillingDocumentSource: vi.fn((source: string) => (
    source === 'order' || source === 'booking' ? source : null
  )),
  revokeBillingDocumentShareLink: vi.fn(async () => null),
}));

const guardMutationMock = vi.mocked(guardMutation);
const parseBillingDocumentSourceMock = vi.mocked(parseBillingDocumentSource);
const createBillingDocumentShareLinkMock = vi.mocked(createBillingDocumentShareLink);
const revokeBillingDocumentShareLinkMock = vi.mocked(revokeBillingDocumentShareLink);

function postRequest(source = 'order', query = '', body: unknown = {}): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/${source}/owner-1/doc-1/share-link${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function deleteRequest(source = 'order', query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/${source}/owner-1/doc-1/share-link${query ? `?${query}` : ''}`, {
    method: 'DELETE',
  });
}

describe('builder billing document share link API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    parseBillingDocumentSourceMock.mockImplementation((source) => (
      source === 'order' || source === 'booking' ? source as never : null
    ));
    createBillingDocumentShareLinkMock.mockResolvedValue(null);
    revokeBillingDocumentShareLinkMock.mockResolvedValue(null);
  });

  it('returns localized source errors', async () => {
    const response = await DELETE(deleteRequest('bad', 'locale=zh-hant'), {
      params: Promise.resolve({ source: 'bad', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '不支援的帳單文件來源。',
      errorCode: 'invalid_document_source',
    });
    expect(revokeBillingDocumentShareLinkMock).not.toHaveBeenCalled();
  });

  it('returns localized validation errors for invalid share-link payloads', async () => {
    const response = await POST(postRequest('order', 'locale=zh-hant', { expiresAt: 'bad-date' }), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認分享連結請求資料。',
      errorCode: 'invalid_share_link_payload',
    });
    expect(payload.issues).toBeDefined();
  });

  it('returns localized not-found errors when a share link cannot be created', async () => {
    const response = await POST(postRequest('order', 'locale=ko'), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '청구서 문서를 찾을 수 없습니다.',
      errorCode: 'document_not_found',
    });
  });

  it('returns localized share-link failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createBillingDocumentShareLinkMock.mockRejectedValueOnce(new Error('share secret leaked'));

    const response = await POST(postRequest('order', 'locale=en'), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to create share link.',
      errorCode: 'share_link_failed',
    });
    expect(payload.error).not.toContain('share secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/billing-documents/share-link] POST failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('returns localized revoke failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    revokeBillingDocumentShareLinkMock.mockRejectedValueOnce(new Error('revoke secret leaked'));

    const response = await DELETE(deleteRequest('order', 'locale=ko'), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '공유 링크를 취소하지 못했습니다.',
      errorCode: 'share_link_revoke_failed',
    });
    expect(payload.error).not.toContain('revoke secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/billing-documents/share-link] DELETE failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('creates and revokes share links while preserving success response shapes', async () => {
    const created = { documentId: 'doc-1', sharePath: '/billing/share/abc' };
    const revoked = { documentId: 'doc-1', sharePath: undefined };
    createBillingDocumentShareLinkMock.mockResolvedValueOnce(created as never);
    revokeBillingDocumentShareLinkMock.mockResolvedValueOnce(revoked as never);

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
    expect(createBillingDocumentShareLinkMock).toHaveBeenCalledWith('order', 'owner-1', 'doc-1', {
      expiresAt: undefined,
    });
    expect(deleteResponse.status).toBe(200);
    expect(deletePayload).toEqual({ ok: true, document: revoked });
  });
});
