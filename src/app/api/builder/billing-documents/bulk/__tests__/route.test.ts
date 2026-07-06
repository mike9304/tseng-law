import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bulkExportCsv,
  bulkIssueInvoicesForOrders,
  bulkVoidDocuments,
  parseBulkDocumentIds,
} from '@/lib/builder/billing-documents-bulk';
import { guardMutation } from '@/lib/builder/security/guard';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/billing-documents-bulk', () => ({
  bulkExportCsv: vi.fn(async () => 'source,ownerId\n'),
  bulkIssueInvoicesForOrders: vi.fn(async () => ({ issued: [], skipped: [], errors: [] })),
  bulkVoidDocuments: vi.fn(async () => ({ voided: [], skipped: [], errors: [] })),
  parseBulkDocumentIds: vi.fn(() => []),
}));

const guardMutationMock = vi.mocked(guardMutation);
const bulkExportCsvMock = vi.mocked(bulkExportCsv);
const bulkIssueInvoicesForOrdersMock = vi.mocked(bulkIssueInvoicesForOrders);
const bulkVoidDocumentsMock = vi.mocked(bulkVoidDocuments);
const parseBulkDocumentIdsMock = vi.mocked(parseBulkDocumentIds);

function postRequest(query = '', body: unknown = { action: 'export-csv' }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/bulk${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('builder billing documents bulk API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    bulkExportCsvMock.mockResolvedValue('source,ownerId\n');
    bulkIssueInvoicesForOrdersMock.mockResolvedValue({ issued: [], skipped: [], errors: [] });
    bulkVoidDocumentsMock.mockResolvedValue({ voided: [], skipped: [], errors: [] });
    parseBulkDocumentIdsMock.mockReturnValue([]);
  });

  it('returns localized validation errors using body filter locale fallback', async () => {
    const response = await POST(postRequest('', {
      filter: { locale: 'zh-hant' },
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認批次操作請求資料。',
      errorCode: 'invalid_bulk_operation_payload',
    });
    expect(payload.issues).toBeDefined();
  });

  it('returns localized no-target errors for issue-invoice bulk actions', async () => {
    const response = await POST(postRequest('locale=ko', {
      action: 'issue-invoice',
      ids: ['bad-target'],
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '일괄 작업할 유효한 문서가 없습니다.',
      errorCode: 'no_valid_targets',
    });
    expect(bulkIssueInvoicesForOrdersMock).not.toHaveBeenCalled();
  });

  it('returns localized no-target errors for void bulk actions', async () => {
    const response = await POST(postRequest('locale=zh-hant', {
      action: 'void',
      ids: ['bad-target'],
      reason: 'duplicate',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '沒有可批次操作的有效文件。',
      errorCode: 'no_valid_targets',
    });
    expect(bulkVoidDocumentsMock).not.toHaveBeenCalled();
  });

  it('returns localized bulk failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    parseBulkDocumentIdsMock.mockReturnValueOnce([{ source: 'order', ownerId: 'order-1' }]);
    bulkIssueInvoicesForOrdersMock.mockRejectedValueOnce(new Error('bulk secret leaked'));

    const response = await POST(postRequest('locale=en', {
      action: 'issue-invoice',
      ids: ['order:order-1'],
    }));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Bulk operation failed.',
      errorCode: 'bulk_operation_failed',
    });
    expect(payload.error).not.toContain('bulk secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/billing-documents/bulk] POST failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('issues invoices and voids documents while preserving success response shapes', async () => {
    const targets = [{ source: 'order' as const, ownerId: 'order-1' }];
    parseBulkDocumentIdsMock.mockReturnValue(targets);
    bulkIssueInvoicesForOrdersMock.mockResolvedValueOnce({
      issued: [{ source: 'order', ownerId: 'order-1', documentId: 'doc-1' }],
      skipped: [],
      errors: [],
    } as never);
    bulkVoidDocumentsMock.mockResolvedValueOnce({
      voided: [{ source: 'order', ownerId: 'order-1', documentId: 'doc-1' }],
      skipped: [],
      errors: [],
    } as never);

    const issueResponse = await POST(postRequest('locale=en', {
      action: 'issue-invoice',
      ids: ['order:order-1'],
      notes: 'bulk issue',
    }));
    const issuePayload = await issueResponse.json();
    const voidResponse = await POST(postRequest('locale=en', {
      action: 'void',
      ids: ['order:order-1:doc-1'],
      reason: 'duplicate',
    }));
    const voidPayload = await voidResponse.json();

    expect(issueResponse.status).toBe(200);
    expect(issuePayload).toEqual({
      ok: true,
      action: 'issue-invoice',
      issued: [{ source: 'order', ownerId: 'order-1', documentId: 'doc-1' }],
      skipped: [],
      errors: [],
      counts: { issued: 1, skipped: 0, errors: 0 },
    });
    expect(bulkIssueInvoicesForOrdersMock).toHaveBeenCalledWith(targets, { notes: 'bulk issue' });
    expect(voidResponse.status).toBe(200);
    expect(voidPayload).toEqual({
      ok: true,
      action: 'void',
      voided: [{ source: 'order', ownerId: 'order-1', documentId: 'doc-1' }],
      skipped: [],
      errors: [],
      counts: { voided: 1, skipped: 0, errors: 0 },
    });
    expect(bulkVoidDocumentsMock).toHaveBeenCalledWith(targets, 'duplicate');
  });

  it('exports csv while preserving download headers', async () => {
    bulkExportCsvMock.mockResolvedValueOnce('source,ownerId\norder,order-1\n');

    const response = await POST(postRequest('locale=en', {
      action: 'export-csv',
      filter: { locale: 'en', source: 'order' },
    }));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toBe('source,ownerId\norder,order-1\n');
    expect(response.headers.get('Content-Type')).toBe('text/csv; charset=utf-8');
    expect(response.headers.get('Content-Disposition')).toContain('attachment; filename="billing-documents-');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(bulkExportCsvMock).toHaveBeenCalledWith({ locale: 'en', source: 'order' });
  });
});
