import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createCommerceCheckoutQuote, normalizeCheckoutAddress } from '../checkout-shared';
import { makeCartItemId, makeEmptyCart, upsertCartItem } from '../cart-shared';
import {
  captureAbandonedCart,
  listNotificationEvents,
  listRecoveryCarts,
  queueBillingPaymentReceivedNotification,
  markRecoveryCartsConverted,
  queueOrderDocumentNotification,
  queueOrderCreatedNotifications,
  queueOrderUpdatedNotification,
  saveNotificationSettings,
} from '../notifications-engine';
import { createOrder, issueOrderDocument, updateOrderState } from '../orders-engine';
import type { BuilderBillingDocumentRow } from '@/lib/builder/billing-documents';

let tmpRoot = '';
let previousRoot: string | undefined;
let previousBackend: string | undefined;

beforeEach(async () => {
  previousRoot = process.env.BUILDER_COMMERCE_ROOT;
  previousBackend = process.env.BUILDER_COMMERCE_BACKEND;
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'commerce-notifications-'));
  process.env.BUILDER_COMMERCE_ROOT = tmpRoot;
  process.env.BUILDER_COMMERCE_BACKEND = 'local';
});

afterEach(async () => {
  process.env.BUILDER_COMMERCE_ROOT = previousRoot;
  process.env.BUILDER_COMMERCE_BACKEND = previousBackend;
  if (tmpRoot) await fs.rm(tmpRoot, { recursive: true, force: true });
});

function cart() {
  return upsertCartItem(makeEmptyCart('ko', 'TWD'), {
    itemId: makeCartItemId('product-f66'),
    productId: 'product-f66',
    productSlug: 'product-f66',
    title: 'F66 Product',
    sku: 'F66-SKU',
    priceCents: 10000,
    currency: 'TWD',
    quantity: 1,
    maxQuantity: 3,
    optionValues: {},
  }, 1);
}

function billingRow(overrides: Partial<BuilderBillingDocumentRow> = {}): BuilderBillingDocumentRow {
  return {
    source: 'order',
    sourceLabel: 'Order',
    ownerId: 'order-payment-received',
    ownerLabel: 'TSENG-20260520-PAY',
    documentId: 'doc-payment-received',
    number: 'INV-2026-000001',
    type: 'invoice',
    typeLabel: 'Invoice',
    status: 'issued',
    statusLabel: 'Issued',
    locale: 'ko',
    currency: 'TWD',
    totalAmount: 10000,
    refundedAmount: 0,
    balanceDue: 5000,
    totalLabel: 'NT$100',
    refundedLabel: 'NT$0',
    balanceDueLabel: 'NT$50',
    recipientEmail: 'payer@example.com',
    recipientName: 'Payer',
    customerLabel: 'Payer',
    contextLabel: '1 line item',
    issuedAt: '2026-05-20T00:00:00.000Z',
    shareStatus: 'not_created',
    shareStatusLabel: 'No link',
    viewCount: 0,
    downloadCount: 0,
    detailHref: '/ko/admin-builder/commerce/orders',
    downloadPath: '',
    sharePath: '',
    paymentStatus: 'partially_paid',
    paymentStatusLabel: 'partially paid',
    paymentLinkStatus: 'revoked',
    paymentLinkStatusLabel: 'Pay link revoked',
    paymentReconciliationStatus: 'renew_required',
    paymentReconciliationStatusLabel: 'Balance changed; renew pay link',
    paymentLinkRenewalNeeded: true,
    paymentLinkPath: '',
    paymentLinkEvents: [],
    lines: [],
    details: [],
    ...overrides,
  };
}

describe('commerce notifications engine', () => {
  it('captures recoverable carts and converts them after checkout', async () => {
    await saveNotificationSettings({
      adminEmail: 'ops@example.com',
      abandonedCart: { enabled: true, delayMinutes: 15 },
      templates: {
        'cart.abandoned.customer': { enabled: true, subject: 'Resume checkout' },
      },
    });

    const captured = await captureAbandonedCart({
      locale: 'ko',
      email: 'buyer@example.com',
      currency: 'TWD',
      cart: cart(),
      recoveryUrl: '/ko/store/checkout',
      now: '2026-05-20T00:00:00.000Z',
    });
    expect(captured.event).toMatchObject({
      type: 'cart.abandoned.customer',
      status: 'queued',
      subject: 'Resume checkout',
      recipient: { email: 'buyer@example.com' },
    });

    const recoveries = await listRecoveryCarts({ locale: 'ko' });
    expect(recoveries).toHaveLength(1);
    expect(recoveries[0]).toMatchObject({ status: 'captured', notificationEventId: captured.event.eventId });

    const converted = await markRecoveryCartsConverted({
      locale: 'ko',
      email: 'buyer@example.com',
      orderId: 'order-f66',
      now: '2026-05-20T00:05:00.000Z',
    });
    expect(converted[0]).toMatchObject({ status: 'converted', orderId: 'order-f66' });
  });

  it('queues order created and updated notifications', async () => {
    await saveNotificationSettings({ adminEmail: 'ops@example.com' });
    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 66 Road',
    });
    const orderCart = cart();
    const quote = createCommerceCheckoutQuote(orderCart, 'ko', 'standard', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-20260520-F66',
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Buyer', email: 'buyer@example.com' },
      shippingAddress: address,
      lineItems: orderCart.items,
      shipping: quote.shipping,
      tax: quote.tax,
      totals: quote.totals,
      payment: {
        adapter: 'manual-invoice',
        status: 'requires_manual_payment',
        label: 'Manual invoice',
        stub: true,
      },
      now: '2026-05-20T00:00:00.000Z',
    });

    await queueOrderCreatedNotifications(order);
    const updated = await updateOrderState(order.orderId, { fulfillmentStatus: 'processing', actor: 'admin' });
    expect(updated).toBeTruthy();
    await queueOrderUpdatedNotification(updated!, { fulfillmentStatus: 'processing' });

    const events = await listNotificationEvents({ locale: 'ko' });
    expect(events.map((event) => event.type)).toEqual(expect.arrayContaining([
      'order.created.customer',
      'order.created.admin',
      'order.updated.customer',
    ]));
    expect(events.find((event) => event.type === 'order.created.admin')?.recipient.email).toBe('ops@example.com');
  });

  it('queues invoice and receipt document notifications', async () => {
    await saveNotificationSettings({
      templates: {
        'order.invoice.customer': { enabled: true, subject: 'Your invoice' },
        'order.receipt.customer': { enabled: true, subject: 'Your receipt' },
      },
    });
    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 70 Road',
    });
    const orderCart = cart();
    const quote = createCommerceCheckoutQuote(orderCart, 'ko', 'standard', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-20260520-F70',
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Buyer', email: 'buyer@example.com' },
      shippingAddress: address,
      lineItems: orderCart.items,
      shipping: quote.shipping,
      tax: quote.tax,
      totals: quote.totals,
      payment: {
        adapter: 'manual-invoice',
        status: 'paid',
        label: 'Manual invoice paid',
        stub: true,
      },
      now: '2026-05-20T00:00:00.000Z',
    });
    const invoice = await issueOrderDocument(order.orderId, { type: 'invoice', actor: 'admin' });
    const receipt = await issueOrderDocument(order.orderId, { type: 'receipt', actor: 'admin' });
    expect(invoice.document).toBeTruthy();
    expect(receipt.document).toBeTruthy();

    await queueOrderDocumentNotification(invoice.order!, invoice.document!);
    await queueOrderDocumentNotification(receipt.order!, receipt.document!);

    const events = await listNotificationEvents({ locale: 'ko' });
    expect(events.map((event) => event.type)).toEqual(expect.arrayContaining([
      'order.invoice.customer',
      'order.receipt.customer',
    ]));
    expect(events.find((event) => event.type === 'order.invoice.customer')?.subject).toBe('Your invoice');
    expect(events.find((event) => event.type === 'order.receipt.customer')?.payload).toMatchObject({
      documentType: 'receipt',
      confirmationNumber: 'TSENG-20260520-F70',
    });
  });

  it('applies payment received workflow controls and exposes template variables', async () => {
    await saveNotificationSettings({
      paymentReceived: {
        enabled: true,
        manualEnabled: false,
        hostedEnabled: true,
        suppressFullSettlementReceiptOverlap: true,
      },
      templates: {
        'billing.payment_received.customer': { enabled: true, subject: 'Payment logged' },
      },
    });

    const skippedManual = await queueBillingPaymentReceivedNotification(billingRow(), {
      amount: 1000,
      paymentId: 'manual-disabled',
      method: 'manual',
      now: '2026-05-20T00:10:00.000Z',
    });
    expect(skippedManual).toMatchObject({
      status: 'skipped',
      subject: 'Payment logged',
      payload: {
        paymentMethod: 'manual',
        paymentReceivedPolicy: { skipReason: 'manual_payment_received_disabled' },
      },
    });

    const skippedHostedReceiptOverlap = await queueBillingPaymentReceivedNotification(billingRow({
      balanceDue: 0,
      balanceDueLabel: 'NT$0',
      paymentStatus: 'paid',
      paymentStatusLabel: 'paid',
    }), {
      amount: 5000,
      paymentId: 'hosted-full-payment',
      method: 'hosted',
      provider: 'stripe',
      receiptEmailQueued: true,
      now: '2026-05-20T00:11:00.000Z',
    });
    expect(skippedHostedReceiptOverlap).toMatchObject({
      status: 'skipped',
      payload: {
        paymentMethod: 'hosted',
        provider: 'stripe',
        paymentReceivedPolicy: { receiptEmailQueued: true, skipReason: 'receipt_email_queued' },
      },
    });

    const queuedHosted = await queueBillingPaymentReceivedNotification(billingRow(), {
      amount: 2500,
      paymentId: 'hosted-partial-payment',
      method: 'hosted',
      provider: 'stripe',
      reference: 'cs_test_partial',
      now: '2026-05-20T00:12:00.000Z',
    });
    expect(queuedHosted).toMatchObject({
      status: 'queued',
      payload: {
        paymentMethod: 'hosted',
        reference: 'cs_test_partial',
        templateVariables: expect.arrayContaining(['amountLabel', 'documentNumber', 'paymentMethodLabel']),
      },
    });

    const events = await listNotificationEvents({ locale: 'ko', type: 'billing.payment_received.customer' });
    expect(events).toHaveLength(3);
  });
});
