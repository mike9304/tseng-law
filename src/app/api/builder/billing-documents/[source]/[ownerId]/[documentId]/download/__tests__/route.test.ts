import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import {
  billingDocumentFileName,
  getBillingDocument,
  parseBillingDocumentSource,
  renderBillingDocumentHtml,
  renderBillingDocumentPdf,
  trackBillingDocumentAccess,
} from '@/lib/builder/billing-documents';
import { GET } from '../route';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/billing-document-automation', () => ({
  billingManualPaymentInstructionsForTarget: vi.fn(() => []),
  loadBillingDocumentAutomationSettings: vi.fn(async () => ({})),
}));

vi.mock('@/lib/builder/billing-documents', () => ({
  billingDocumentFileName: vi.fn((_document: unknown, format: string) => `document.${format}`),
  getBillingDocument: vi.fn(async () => null),
  parseBillingDocumentSource: vi.fn((source: string) => (
    source === 'order' || source === 'booking' ? source : null
  )),
  renderBillingDocumentHtml: vi.fn(() => '<html><body>invoice</body></html>'),
  renderBillingDocumentPdf: vi.fn(() => new Uint8Array([37, 80, 68, 70])),
  trackBillingDocumentAccess: vi.fn(async () => undefined),
}));

const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const billingDocumentFileNameMock = vi.mocked(billingDocumentFileName);
const getBillingDocumentMock = vi.mocked(getBillingDocument);
const parseBillingDocumentSourceMock = vi.mocked(parseBillingDocumentSource);
const renderBillingDocumentHtmlMock = vi.mocked(renderBillingDocumentHtml);
const renderBillingDocumentPdfMock = vi.mocked(renderBillingDocumentPdf);
const trackBillingDocumentAccessMock = vi.mocked(trackBillingDocumentAccess);

function getRequest(source = 'order', query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/${source}/owner-1/doc-1/download${query ? `?${query}` : ''}`);
}

describe('builder billing document download API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ user: { id: 'admin-1' } } as never);
    billingDocumentFileNameMock.mockImplementation((_document, format) => `document.${format}`);
    getBillingDocumentMock.mockResolvedValue(null);
    parseBillingDocumentSourceMock.mockImplementation((source) => (
      source === 'order' || source === 'booking' ? source as never : null
    ));
    renderBillingDocumentHtmlMock.mockReturnValue('<html><body>invoice</body></html>');
    renderBillingDocumentPdfMock.mockReturnValue(new Uint8Array([37, 80, 68, 70]) as never);
    trackBillingDocumentAccessMock.mockResolvedValue(undefined);
  });

  it('returns localized source errors', async () => {
    const response = await GET(getRequest('bad', 'locale=zh-hant'), {
      params: { source: 'bad', ownerId: 'owner-1', documentId: 'doc-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '不支援的帳單文件來源。',
      errorCode: 'invalid_document_source',
    });
    expect(getBillingDocumentMock).not.toHaveBeenCalled();
  });

  it('returns localized not-found errors', async () => {
    const response = await GET(getRequest('order', 'locale=ko'), {
      params: { source: 'order', ownerId: 'owner-1', documentId: 'doc-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '청구서 문서를 찾을 수 없습니다.',
      errorCode: 'document_not_found',
    });
    expect(trackBillingDocumentAccessMock).not.toHaveBeenCalled();
  });

  it('returns html downloads while preserving headers and access tracking', async () => {
    const document = { documentId: 'doc-1', source: 'order' };
    getBillingDocumentMock.mockResolvedValueOnce(document as never);

    const response = await GET(getRequest('order', 'locale=en&format=html'), {
      params: { source: 'order', ownerId: 'owner-1', documentId: 'doc-1' },
    });
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toBe('<html><body>invoice</body></html>');
    expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
    expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="document.html"');
    expect(trackBillingDocumentAccessMock).toHaveBeenCalledWith('order', 'owner-1', 'doc-1', 'downloaded');
    expect(renderBillingDocumentHtmlMock).toHaveBeenCalledWith(document, { manualInstructions: [] });
  });

  it('returns pdf downloads by default', async () => {
    const document = { documentId: 'doc-1', source: 'booking' };
    getBillingDocumentMock.mockResolvedValueOnce(document as never);

    const response = await GET(getRequest('booking', 'locale=en'), {
      params: { source: 'booking', ownerId: 'owner-1', documentId: 'doc-1' },
    });
    const body = new Uint8Array(await response.arrayBuffer());

    expect(response.status).toBe(200);
    expect([...body]).toEqual([37, 80, 68, 70]);
    expect(response.headers.get('Content-Type')).toBe('application/pdf');
    expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="document.pdf"');
    expect(trackBillingDocumentAccessMock).toHaveBeenCalledWith('booking', 'owner-1', 'doc-1', 'downloaded');
    expect(renderBillingDocumentPdfMock).toHaveBeenCalledWith(document, { manualInstructions: [] });
  });
});
