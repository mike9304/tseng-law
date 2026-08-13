import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { issueOrderDocument, markOrderDocumentEmailed } from '@/lib/builder/commerce/orders-engine';
import { queueOrderDocumentNotification } from '@/lib/builder/commerce/notifications-engine';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/commerce/orders-engine', () => ({
  issueOrderDocument: vi.fn(async () => ({ order: null, document: null, created: false, error: 'order_not_found' })),
  markOrderDocumentEmailed: vi.fn(async () => ({ order: null, document: null })),
}));

vi.mock('@/lib/builder/commerce/notifications-engine', () => ({
  queueOrderDocumentNotification: vi.fn(async () => ({ eventId: 'notification-1' })),
}));

const order = {
  orderId: 'order-1',
  locale: 'ko',
  payment: { status: 'requires_manual_payment' },
};
const document = {
  documentId: 'doc-1',
  type: 'invoice',
  number: 'INV-1',
};
const notification = { eventId: 'notification-1' };

const guardMutationMock = vi.mocked(guardMutation);
const issueOrderDocumentMock = vi.mocked(issueOrderDocument);
const markOrderDocumentEmailedMock = vi.mocked(markOrderDocumentEmailed);
const queueOrderDocumentNotificationMock = vi.mocked(queueOrderDocumentNotification);

function postRequest(query = '', body: string | unknown = { type: 'invoice', email: false }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/orders/order-1/documents${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const params = { params: Promise.resolve({ orderId: 'order-1' }) };

describe('builder commerce order documents API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    issueOrderDocumentMock.mockResolvedValue({ order, document, created: true } as never);
    markOrderDocumentEmailedMock.mockResolvedValue({ order, document } as never);
    queueOrderDocumentNotificationMock.mockResolvedValue(notification as never);
  });

  it('returns localized validation errors with stable codes', async () => {
    const response = await POST(postRequest('locale=zh-hant', { type: 'bad' }), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認訂單請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(issueOrderDocumentMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid-json errors', async () => {
    const response = await POST(postRequest('locale=ko', '{'), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '주문 요청 형식을 확인해 주세요.',
      errorCode: 'invalid_json',
    });
    expect(issueOrderDocumentMock).not.toHaveBeenCalled();
  });

  it('returns localized missing-order errors', async () => {
    issueOrderDocumentMock.mockResolvedValueOnce({
      order: null,
      document: null,
      created: false,
      error: 'order_not_found',
    } as never);

    const response = await POST(postRequest('locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到訂單。',
      errorCode: 'order_not_found',
    });
  });

  it('returns localized receipt eligibility errors while preserving order payload', async () => {
    issueOrderDocumentMock.mockResolvedValueOnce({
      order,
      document: null,
      created: false,
      error: 'receipt_requires_paid_order',
    } as never);

    const response = await POST(postRequest('locale=ko', { type: 'receipt', email: false }), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '영수증은 결제 완료 또는 환불 처리된 주문에만 발급할 수 있습니다.',
      errorCode: 'receipt_requires_paid_order',
      order,
    });
  });

  it('returns localized fallback failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    issueOrderDocumentMock.mockRejectedValueOnce(new Error('document secret leaked'));

    const response = await POST(postRequest('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to issue order document.',
      errorCode: 'document_issue_failed',
    });
    expect(payload.error).not.toContain('document secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/orders/:id/documents] POST failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('issues documents while preserving success response shape', async () => {
    const response = await POST(postRequest('locale=en', { type: 'invoice', notes: 'Admin note' }), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, order, document, notification: null });
    expect(issueOrderDocumentMock).toHaveBeenCalledWith('order-1', {
      type: 'invoice',
      notes: 'Admin note',
      actor: 'admin',
    });
    expect(queueOrderDocumentNotificationMock).not.toHaveBeenCalled();
  });

  it('queues document email while preserving success response shape', async () => {
    const response = await POST(postRequest('locale=en', { type: 'invoice', email: true }), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, order, document, notification });
    expect(queueOrderDocumentNotificationMock).toHaveBeenCalledWith(order, document);
    expect(markOrderDocumentEmailedMock).toHaveBeenCalledWith('order-1', 'doc-1', {
      notificationEventId: 'notification-1',
      actor: 'admin',
    });
  });
});
