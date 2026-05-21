import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyOrderPaymentWebhook,
  createOrder,
  filterOrders,
  issueOrderDocument,
  listOrders,
  loadOrder,
  markOrderDocumentEmailed,
  manualPaymentBalanceDue,
  recordOrderManualPayment,
  refundableAmount,
  refundOrderPayment,
  successfulManualPaymentTotal,
  softDeleteOrder,
  updateOrderState,
} from '../orders-engine';
import { createCommerceCheckoutQuote, normalizeCheckoutAddress } from '../checkout-shared';
import {
  makeCartItemId,
  makeEmptyCart,
  setCartCoupon,
  upsertCartItem,
  type CommerceCartItem,
} from '../cart-shared';

let tmpRoot = '';
let previousRoot: string | undefined;
let previousBackend: string | undefined;
let previousStripeSecret: string | undefined;

function item(overrides: Partial<CommerceCartItem> = {}): CommerceCartItem {
  return {
    itemId: makeCartItemId('product-f61', 'variant-a'),
    productId: 'product-f61',
    productSlug: 'product-f61',
    variantId: 'variant-a',
    title: 'F61 Product',
    sku: 'F61-SKU',
    priceCents: 34000,
    currency: 'TWD',
    quantity: 1,
    maxQuantity: 4,
    optionValues: { Format: 'Consultation' },
    ...overrides,
  };
}

beforeEach(async () => {
  previousRoot = process.env.BUILDER_COMMERCE_ROOT;
  previousBackend = process.env.BUILDER_COMMERCE_BACKEND;
  previousStripeSecret = process.env.STRIPE_SECRET_KEY;
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'commerce-orders-'));
  process.env.BUILDER_COMMERCE_ROOT = tmpRoot;
  process.env.BUILDER_COMMERCE_BACKEND = 'local';
});

afterEach(async () => {
  if (previousRoot === undefined) delete process.env.BUILDER_COMMERCE_ROOT;
  else process.env.BUILDER_COMMERCE_ROOT = previousRoot;
  if (previousBackend === undefined) delete process.env.BUILDER_COMMERCE_BACKEND;
  else process.env.BUILDER_COMMERCE_BACKEND = previousBackend;
  if (previousStripeSecret === undefined) delete process.env.STRIPE_SECRET_KEY;
  else process.env.STRIPE_SECRET_KEY = previousStripeSecret;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  if (tmpRoot) await fs.rm(tmpRoot, { recursive: true, force: true });
});

describe('commerce orders engine', () => {
  it('persists line items, customer, payment, fulfillment, totals, and audit data', async () => {
    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 1 Road',
    });
    const cart = setCartCoupon(upsertCartItem(makeEmptyCart('ko', 'TWD'), item(), 2), 'SAVE10');
    const quote = createCommerceCheckoutQuote(cart, 'ko', 'express', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-20260520-TEST',
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Order Customer', email: 'order@example.com', phone: '0912' },
      shippingAddress: address,
      lineItems: cart.items,
      couponCode: 'SAVE10',
      shipping: quote.shipping,
      tax: quote.tax,
      totals: quote.totals,
      payment: {
        adapter: 'sandbox-card',
        status: 'authorized_stub',
        label: 'Sandbox card authorization',
        stub: true,
      },
      now: '2026-05-20T00:00:00.000Z',
    });

    const loaded = await loadOrder(order.orderId);
    expect(loaded).toMatchObject({
      orderId: order.orderId,
      confirmationNumber: 'TSENG-20260520-TEST',
      status: 'confirmed',
      customer: { email: 'order@example.com' },
      payment: { adapter: 'sandbox-card', status: 'authorized_stub' },
      fulfillment: { status: 'unfulfilled', method: 'express' },
      totals: { discountCents: 6800, grandTotalCents: 93660 },
      couponCode: 'SAVE10',
    });
    expect(loaded?.lineItems[0]).toMatchObject({ sku: 'F61-SKU', quantity: 2 });
    expect(loaded?.audit[0]).toMatchObject({ type: 'order.created', actor: 'system' });

    const listed = await listOrders({ locale: 'ko', q: 'order@example.com' });
    expect(listed.map((entry) => entry.orderId)).toContain(order.orderId);

    const updated = await updateOrderState(order.orderId, {
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
      actor: 'admin',
    });
    expect(updated).toMatchObject({
      payment: { status: 'paid' },
      fulfillment: { status: 'fulfilled' },
    });
    expect(updated?.audit.some((event) => event.type === 'order.updated' && event.actor === 'admin')).toBe(true);
    const filtered = await filterOrders({ locale: 'ko', paymentStatus: 'paid', fulfillmentStatus: 'fulfilled' });
    expect(filtered.map((entry) => entry.orderId)).toContain(order.orderId);

    expect(await softDeleteOrder(order.orderId)).toBe(true);
    expect(await loadOrder(order.orderId)).toBeNull();
  });

  it('records partial and full manual payments with balance and generic status locks', async () => {
    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 1 Road',
    });
    const cart = upsertCartItem(makeEmptyCart('ko', 'TWD'), item(), 1);
    const quote = createCommerceCheckoutQuote(cart, 'ko', 'standard', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-20260520-MANUAL',
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Manual Customer', email: 'manual@example.com', phone: '0912' },
      shippingAddress: address,
      lineItems: cart.items,
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

    const pending = await recordOrderManualPayment(order.orderId, {
      amountCents: 10000,
      method: 'bank_transfer',
      status: 'pending',
      reference: 'WIRE-PENDING',
      actor: 'admin',
    });
    expect(pending.manualPayment).toMatchObject({
      amountCents: 10000,
      status: 'pending',
      reference: 'WIRE-PENDING',
    });
    expect(pending.order?.payment.status).toBe('requires_manual_payment');
    expect(successfulManualPaymentTotal(pending.order!)).toBe(0);
    expect(manualPaymentBalanceDue(pending.order!)).toBe(order.totals.grandTotalCents);

    const partial = await recordOrderManualPayment(order.orderId, {
      amountCents: 20000,
      method: 'bank_transfer',
      status: 'succeeded',
      reference: 'WIRE-001',
      note: 'First bank transfer',
      actor: 'admin',
    });
    expect(partial.manualPayment).toMatchObject({
      amountCents: 20000,
      method: 'bank_transfer',
      reference: 'WIRE-001',
      note: 'First bank transfer',
    });
    expect(partial.order?.payment.status).toBe('partially_paid');
    expect(successfulManualPaymentTotal(partial.order!)).toBe(20000);
    expect(manualPaymentBalanceDue(partial.order!)).toBe(order.totals.grandTotalCents - 20000);

    const genericDowngrade = await updateOrderState(order.orderId, { paymentStatus: 'failed', actor: 'admin' });
    expect(genericDowngrade?.payment.status).toBe('partially_paid');

    const overpay = await recordOrderManualPayment(order.orderId, {
      amountCents: order.totals.grandTotalCents,
      method: 'cash',
      actor: 'admin',
    });
    expect(overpay.error).toBe('manual_payment_exceeds_balance');
    expect((await loadOrder(order.orderId))?.manualPayments).toHaveLength(2);

    const final = await recordOrderManualPayment(order.orderId, {
      amountCents: order.totals.grandTotalCents - 20000,
      method: 'cash',
      reference: 'CASH-FINAL',
      actor: 'admin',
    });
    expect(final.order?.payment.status).toBe('paid');
    expect(manualPaymentBalanceDue(final.order!)).toBe(0);
    expect(final.order?.manualPayments).toHaveLength(3);
    expect(final.order?.audit.some((event) => event.type === 'payment.manual.recorded')).toBe(true);
    expect((await filterOrders({ locale: 'ko', paymentStatus: 'partially_paid' })).map((entry) => entry.orderId)).not.toContain(order.orderId);
    expect((await filterOrders({ locale: 'ko', paymentStatus: 'paid' })).map((entry) => entry.orderId)).toContain(order.orderId);
  });

  it('does not let non-success manual ledger entries lock provider webhook updates', async () => {
    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 2 Pending Road',
    });
    const cart = upsertCartItem(makeEmptyCart('ko', 'TWD'), item(), 1);
    const quote = createCommerceCheckoutQuote(cart, 'ko', 'standard', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-20260520-MANUAL-WEBHOOK',
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Pending Customer', email: 'pending@example.com', phone: '0912' },
      shippingAddress: address,
      lineItems: cart.items,
      shipping: quote.shipping,
      tax: quote.tax,
      totals: quote.totals,
      payment: {
        adapter: 'manual-invoice',
        status: 'requires_manual_payment',
        label: 'Manual invoice',
        stub: true,
        referenceId: 'pi_pending_manual',
      },
      now: '2026-05-20T00:00:00.000Z',
    });

    const failed = await recordOrderManualPayment(order.orderId, {
      amountCents: 5000,
      method: 'bank_transfer',
      status: 'failed',
      reference: 'WIRE-FAILED',
      actor: 'admin',
    });
    expect(failed.manualPayment?.status).toBe('failed');
    expect(successfulManualPaymentTotal(failed.order!)).toBe(0);

    const webhook = await applyOrderPaymentWebhook({
      referenceId: 'pi_pending_manual',
      paymentStatus: 'paid',
      eventId: 'evt_success_after_failed_manual',
      eventType: 'payment_intent.succeeded',
      provider: 'sandbox-card',
    });
    expect(webhook).toMatchObject({ changed: true });
    expect((await loadOrder(order.orderId))?.payment.status).toBe('paid');
  });

  it('records partial and full refunds without allowing generic status bypasses', async () => {
    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 69 Refund Road',
    });
    const cart = upsertCartItem(makeEmptyCart('ko', 'TWD'), item({ priceCents: 50000 }), 2);
    const quote = createCommerceCheckoutQuote(cart, 'ko', 'standard', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-20260520-REFUND',
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Refund Customer', email: 'refund@example.com', phone: '0912' },
      shippingAddress: address,
      lineItems: cart.items,
      shipping: quote.shipping,
      tax: quote.tax,
      totals: quote.totals,
      payment: {
        adapter: 'sandbox-card',
        status: 'paid',
        label: 'Sandbox card capture',
        stub: true,
        referenceId: 'pi_f69_refund',
      },
      now: '2026-05-20T00:00:00.000Z',
    });
    expect(refundableAmount(order)).toBe(order.totals.grandTotalCents);

    const partial = await refundOrderPayment(order.orderId, {
      amountCents: 30000,
      reason: 'Customer requested partial refund',
      actor: 'admin',
    });
    expect(partial.refund).toMatchObject({
      amountCents: 30000,
      reason: 'Customer requested partial refund',
      status: 'succeeded',
      actor: 'admin',
    });
    expect(partial.order?.payment.status).toBe('partially_refunded');
    expect(partial.order?.audit.some((event) => event.type === 'payment.refund.created')).toBe(true);
    expect(refundableAmount(partial.order!)).toBe(order.totals.grandTotalCents - 30000);

    const genericDowngrade = await updateOrderState(order.orderId, { paymentStatus: 'paid', actor: 'admin' });
    expect(genericDowngrade?.payment.status).toBe('partially_refunded');

    const lateSuccess = await applyOrderPaymentWebhook({
      referenceId: 'pi_f69_refund',
      paymentStatus: 'paid',
      eventId: 'evt_late_success_after_refund',
      eventType: 'payment_intent.succeeded',
      provider: 'sandbox-card',
    });
    expect(lateSuccess).toMatchObject({ changed: false, reason: 'refund_payment_locked' });
    expect((await loadOrder(order.orderId))?.payment.status).toBe('partially_refunded');

    const overRefund = await refundOrderPayment(order.orderId, {
      amountCents: order.totals.grandTotalCents,
      actor: 'admin',
    });
    expect(overRefund).toMatchObject({ refund: null, error: 'refund_amount_exceeds_remaining' });

    const remaining = refundableAmount((await loadOrder(order.orderId))!);
    const full = await refundOrderPayment(order.orderId, {
      amountCents: remaining,
      reason: 'Final refund',
      actor: 'admin',
    });
    expect(full.order?.payment.status).toBe('refunded');
    expect(full.order?.refunds).toHaveLength(2);
    expect(refundableAmount(full.order!)).toBe(0);
    expect((await filterOrders({ locale: 'ko', paymentStatus: 'refunded' })).map((entry) => entry.orderId)).toContain(order.orderId);

    const notRefundable = await refundOrderPayment(order.orderId, {
      amountCents: 1,
      actor: 'admin',
    });
    expect(notRefundable).toMatchObject({ refund: null, error: 'order_not_refundable' });
  });

  it('executes Stripe refunds for non-stub provider payments before mutating order state', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_order_refund';
    const stripeFetch = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      expect(String(url)).toBe('https://api.stripe.com/v1/refunds');
      expect(init?.headers).toMatchObject({
        Authorization: 'Bearer sk_test_order_refund',
        'Content-Type': 'application/x-www-form-urlencoded',
      });
      const body = String(init?.body);
      expect(body).toContain('payment_intent=pi_provider_refund');
      expect(body).toContain('amount=25000');
      return new Response(JSON.stringify({ id: 're_provider_order_1' }), { status: 200 });
    });
    vi.stubGlobal('fetch', stripeFetch);

    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 70 Provider Refund Road',
    });
    const cart = upsertCartItem(makeEmptyCart('ko', 'TWD'), item({ priceCents: 50000 }), 1);
    const quote = createCommerceCheckoutQuote(cart, 'ko', 'standard', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-20260520-PROVIDER-REFUND',
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Provider Refund Customer', email: 'provider-refund@example.com', phone: '0912' },
      shippingAddress: address,
      lineItems: cart.items,
      shipping: quote.shipping,
      tax: quote.tax,
      totals: quote.totals,
      payment: {
        adapter: 'manual-invoice',
        status: 'paid',
        label: 'Stripe Checkout',
        stub: false,
        referenceId: 'pi_provider_refund',
      },
      now: '2026-05-20T00:00:00.000Z',
    });

    const refund = await refundOrderPayment(order.orderId, {
      amountCents: 25000,
      reason: 'Provider refund test',
      actor: 'admin',
    });

    expect(stripeFetch).toHaveBeenCalledTimes(1);
    expect(refund.refund).toMatchObject({
      providerRefundId: 're_provider_order_1',
      amountCents: 25000,
      status: 'succeeded',
    });
    expect(refund.order?.payment.status).toBe('partially_refunded');

    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: { message: 'card refund rejected' } }), { status: 402 })));
    const failed = await refundOrderPayment(order.orderId, {
      amountCents: 1000,
      reason: 'Should not mutate',
      actor: 'admin',
    });
    expect(failed).toMatchObject({ refund: null, error: 'card refund rejected' });
    const afterFailure = await loadOrder(order.orderId);
    expect(afterFailure?.refunds).toHaveLength(1);
    expect(afterFailure?.payment.status).toBe('partially_refunded');
  });

  it('issues invoices and receipts with email status without duplicating unchanged snapshots', async () => {
    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 70 Document Road',
    });
    const cart = upsertCartItem(makeEmptyCart('ko', 'TWD'), item({ priceCents: 42000 }), 1);
    const quote = createCommerceCheckoutQuote(cart, 'ko', 'standard', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-20260520-DOC',
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Document Customer', email: 'doc@example.com', phone: '0912' },
      shippingAddress: address,
      lineItems: cart.items,
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

    const invoice = await issueOrderDocument(order.orderId, { type: 'invoice', actor: 'admin' });
    expect(invoice.document).toMatchObject({
      type: 'invoice',
      status: 'issued',
      balanceDueCents: order.totals.grandTotalCents,
      recipientEmail: 'doc@example.com',
    });
    expect(invoice.created).toBe(true);

    const duplicateInvoice = await issueOrderDocument(order.orderId, { type: 'invoice', actor: 'admin' });
    expect(duplicateInvoice.created).toBe(false);
    expect(duplicateInvoice.document?.documentId).toBe(invoice.document?.documentId);

    const unpaidReceipt = await issueOrderDocument(order.orderId, { type: 'receipt', actor: 'admin' });
    expect(unpaidReceipt).toMatchObject({ document: null, error: 'receipt_requires_paid_order' });

    await updateOrderState(order.orderId, { paymentStatus: 'paid', actor: 'admin' });
    const receipt = await issueOrderDocument(order.orderId, { type: 'receipt', actor: 'admin' });
    expect(receipt.document).toMatchObject({
      type: 'receipt',
      status: 'issued',
      balanceDueCents: 0,
      totalCents: order.totals.grandTotalCents,
    });

    const emailed = await markOrderDocumentEmailed(order.orderId, receipt.document!.documentId, {
      notificationEventId: 'ntf_doc_receipt',
      actor: 'admin',
    });
    expect(emailed.document).toMatchObject({
      status: 'emailed_stub',
      notificationEventId: 'ntf_doc_receipt',
    });
    expect(emailed.order?.audit.some((event) => event.type === 'order.receipt.emailed')).toBe(true);
    expect((await loadOrder(order.orderId))?.documents).toHaveLength(2);
  });
});
