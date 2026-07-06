import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runOrderBillingAutomation } from '@/lib/builder/billing-document-automation';
import {
  getBillingDocument,
  parseBillingDocumentSource,
} from '@/lib/builder/billing-documents';
import { recordBookingManualPayment } from '@/lib/builder/bookings/payments';
import { queueBillingPaymentReceivedNotification } from '@/lib/builder/commerce/notifications-engine';
import { recordOrderManualPayment } from '@/lib/builder/commerce/orders-engine';
import { guardMutation } from '@/lib/builder/security/guard';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/billing-documents', () => ({
  getBillingDocument: vi.fn(async () => null),
  parseBillingDocumentSource: vi.fn((source: string) => (
    source === 'order' || source === 'booking' ? source : null
  )),
}));

vi.mock('@/lib/builder/billing-document-automation', () => ({
  runOrderBillingAutomation: vi.fn(async () => ({ actions: [] })),
  runBookingBillingAutomation: vi.fn(async () => ({ actions: [] })),
}));

vi.mock('@/lib/builder/bookings/payments', () => ({
  recordBookingManualPayment: vi.fn(async () => ({
    booking: null,
    manualPayment: null,
    error: 'booking_not_found',
  })),
}));

vi.mock('@/lib/builder/commerce/notifications-engine', () => ({
  queueBillingPaymentReceivedNotification: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/commerce/orders-engine', () => ({
  recordOrderManualPayment: vi.fn(async () => ({
    order: null,
    manualPayment: null,
    error: 'order_not_found',
  })),
}));

const guardMutationMock = vi.mocked(guardMutation);
const getBillingDocumentMock = vi.mocked(getBillingDocument);
const parseBillingDocumentSourceMock = vi.mocked(parseBillingDocumentSource);
const recordOrderManualPaymentMock = vi.mocked(recordOrderManualPayment);
const recordBookingManualPaymentMock = vi.mocked(recordBookingManualPayment);
const runOrderBillingAutomationMock = vi.mocked(runOrderBillingAutomation);
const queueBillingPaymentReceivedNotificationMock = vi.mocked(queueBillingPaymentReceivedNotification);

const issuedInvoice = {
  source: 'order',
  ownerId: 'order-1',
  documentId: 'doc-1',
  type: 'invoice',
  status: 'issued',
  balanceDue: 5000,
};

function postRequest(
  source = 'order',
  query = '',
  body: BodyInit = JSON.stringify({ amountCents: 1000, method: 'cash', status: 'succeeded' }),
): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/${source}/order-1/doc-1/manual-payments${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
}

describe('builder billing document manual payments API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    parseBillingDocumentSourceMock.mockImplementation((source) => (
      source === 'order' || source === 'booking' ? source as never : null
    ));
    getBillingDocumentMock.mockResolvedValue(issuedInvoice as never);
    recordOrderManualPaymentMock.mockResolvedValue({
      order: null,
      manualPayment: null,
      error: 'order_not_found',
    } as never);
    recordBookingManualPaymentMock.mockResolvedValue({
      booking: null,
      manualPayment: null,
      error: 'booking_not_found',
    } as never);
    runOrderBillingAutomationMock.mockResolvedValue({ actions: [] } as never);
    queueBillingPaymentReceivedNotificationMock.mockResolvedValue(undefined as never);
  });

  it('returns localized errors for unsupported document sources', async () => {
    const response = await POST(postRequest('bad', 'locale=zh-hant'), {
      params: { source: 'bad', ownerId: 'order-1', documentId: 'doc-1' },
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

  it('returns localized validation errors for invalid manual payment payloads', async () => {
    const response = await POST(postRequest('order', 'locale=ko', JSON.stringify({ amountCents: 0 })), {
      params: { source: 'order', ownerId: 'order-1', documentId: 'doc-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '수동 결제 정보를 확인해 주세요.',
      errorCode: 'invalid_manual_payment_payload',
    });
    expect(payload.issues).toBeDefined();
    expect(recordOrderManualPaymentMock).not.toHaveBeenCalled();
  });

  it('returns localized balance errors before recording a payment', async () => {
    const response = await POST(postRequest('order', 'locale=zh-hant', JSON.stringify({ amountCents: 9000 })), {
      params: { source: 'order', ownerId: 'order-1', documentId: 'doc-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '手動付款超過應付餘額。',
      errorCode: 'manual_payment_exceeds_balance',
    });
    expect(recordOrderManualPaymentMock).not.toHaveBeenCalled();
  });

  it('localizes manual payment engine errors without leaking raw codes as error text', async () => {
    recordOrderManualPaymentMock.mockResolvedValueOnce({
      order: null,
      manualPayment: null,
      error: 'order_already_paid',
    } as never);

    const response = await POST(postRequest('order', 'locale=en'), {
      params: { source: 'order', ownerId: 'order-1', documentId: 'doc-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'This order is already paid.',
      errorCode: 'order_already_paid',
    });
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await POST(postRequest('order', 'locale=ko', '{"amountCents":'), {
      params: { source: 'order', ownerId: 'order-1', documentId: 'doc-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '수동 결제 요청 형식을 확인해 주세요.',
      errorCode: 'invalid_manual_payment_json',
    });
  });

  it('records successful order manual payments and preserves the success response shape', async () => {
    const nextDocument = { ...issuedInvoice, balanceDue: 0 };
    const manualPayment = {
      paymentId: 'manual-1',
      amountCents: 5000,
      status: 'succeeded',
      reference: 'cash',
    };
    const order = {
      orderId: 'order-1',
      payment: { status: 'paid' },
    };
    getBillingDocumentMock
      .mockResolvedValueOnce(issuedInvoice as never)
      .mockResolvedValueOnce(nextDocument as never);
    recordOrderManualPaymentMock.mockResolvedValueOnce({
      order,
      manualPayment,
    } as never);
    runOrderBillingAutomationMock.mockResolvedValueOnce({
      actions: [{ type: 'receipt', emailed: true }],
    } as never);

    const response = await POST(postRequest('order', 'locale=en', JSON.stringify({ amountCents: 5000 })), {
      params: { source: 'order', ownerId: 'order-1', documentId: 'doc-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(recordOrderManualPaymentMock).toHaveBeenCalledWith('order-1', {
      amountCents: 5000,
      method: 'other',
      status: 'succeeded',
      actor: 'admin',
    });
    expect(queueBillingPaymentReceivedNotificationMock).toHaveBeenCalledWith(nextDocument, {
      amount: 5000,
      method: 'manual',
      paymentId: 'manual-1',
      provider: 'manual',
      reference: 'cash',
      receiptEmailQueued: true,
    });
    expect(payload).toEqual({
      ok: true,
      document: nextDocument,
      manualPayment,
    });
  });
});
