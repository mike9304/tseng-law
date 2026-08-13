import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listBillingDocuments, parseBillingDocumentSource } from '@/lib/builder/billing-documents';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'admin',
    permission: 'view-commerce',
  })),
}));

vi.mock('@/lib/builder/billing-documents', () => ({
  listBillingDocuments: vi.fn(async () => []),
  parseBillingDocumentSource: vi.fn((source: string) => source),
}));

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const listBillingDocumentsMock = vi.mocked(listBillingDocuments);
const parseBillingDocumentSourceMock = vi.mocked(parseBillingDocumentSource);

function requestFor(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents${query ? `?${query}` : ''}`);
}

describe('builder billing documents list API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'admin',
      permission: 'view-commerce',
    } as never);
    listBillingDocumentsMock.mockResolvedValue([]);
    parseBillingDocumentSourceMock.mockImplementation((source) => source as never);
  });

  it('returns 401 and short-circuits billing storage when commerce read auth fails', async () => {
    const request = requestFor('locale=en');
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(
      NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 }) as never,
    );

    const response = await GET(request);

    expect(response.status).toBe(401);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(request, 'view-commerce');
    expect(listBillingDocumentsMock).not.toHaveBeenCalled();
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
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-commerce',
    );
    expect(parseBillingDocumentSourceMock).toHaveBeenCalledWith('booking');
    expect(listBillingDocumentsMock).toHaveBeenCalledWith({
      locale: 'en',
      q: 'client',
      source: 'booking',
    });
    expect(payload).toEqual({ ok: true, documents: [row], total: 1 });
  });
});
