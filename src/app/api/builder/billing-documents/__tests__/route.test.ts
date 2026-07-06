import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { listBillingDocuments, parseBillingDocumentSource } from '@/lib/builder/billing-documents';
import { GET } from '../route';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/billing-documents', () => ({
  listBillingDocuments: vi.fn(async () => []),
  parseBillingDocumentSource: vi.fn((source: string) => source),
}));

const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const listBillingDocumentsMock = vi.mocked(listBillingDocuments);
const parseBillingDocumentSourceMock = vi.mocked(parseBillingDocumentSource);

function requestFor(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents${query ? `?${query}` : ''}`);
}

describe('builder billing documents list API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ username: 'admin' } as never);
    listBillingDocumentsMock.mockResolvedValue([]);
    parseBillingDocumentSourceMock.mockImplementation((source) => source as never);
  });

  it('returns a localized validation error for invalid list filters', async () => {
    const response = await GET(requestFor('locale=zh-hant&source=bad'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認帳單文件搜尋條件。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(listBillingDocumentsMock).not.toHaveBeenCalled();
  });

  it('returns a localized stable-code error when list loading fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listBillingDocumentsMock.mockRejectedValueOnce(new Error('storage path leaked'));

    const response = await GET(requestFor('locale=ko&source=all'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '청구서 문서를 불러오지 못했습니다.',
      errorCode: 'billing_documents_failed',
    });
    expect(payload.error).not.toContain('storage path leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/billing-documents] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('lists documents with the parsed locale, query, and source', async () => {
    const row = {
      source: 'booking',
      ownerId: 'booking-1',
      documentId: 'doc-1',
      recipientName: 'Client',
    };
    listBillingDocumentsMock.mockResolvedValueOnce([row as never]);

    const response = await GET(requestFor('locale=en&q=client&source=booking'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(parseBillingDocumentSourceMock).toHaveBeenCalledWith('booking');
    expect(listBillingDocumentsMock).toHaveBeenCalledWith({
      locale: 'en',
      q: 'client',
      source: 'booking',
    });
    expect(payload).toEqual({ ok: true, documents: [row], total: 1 });
  });
});
