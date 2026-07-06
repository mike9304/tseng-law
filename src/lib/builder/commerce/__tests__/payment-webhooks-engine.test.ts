import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createOrder,
  loadOrder,
  refundOrderPayment,
} from '../orders-engine';
import {
  listPaymentWebhookEvents,
  receivePaymentWebhookEvent,
  replayPaymentWebhookEvent,
} from '../payment-webhooks-engine';
import { createCommerceCheckoutQuote, normalizeCheckoutAddress } from '../checkout-shared';
import {
  makeCartItemId,
  makeEmptyCart,
  upsertCartItem,
  type CommerceCartItem,
} from '../cart-shared';

let tmpRoot = '';
let previousRoot: string | undefined;
let previousBackend: string | undefined;

function item(overrides: Partial<CommerceCartItem> = {}): CommerceCartItem {
  return {
    itemId: makeCartItemId('product-f68', 'variant-a'),
    productId: 'product-f68',
    productSlug: 'product-f68',
    variantId: 'variant-a',
    title: 'F68 Product',
    sku: 'F68-SKU',
    priceCents: 34000,
    currency: 'TWD',
    quantity: 1,
    maxQuantity: 4,
    optionValues: { Format: 'Webhook' },
    ...overrides,
  };
}

async function makeOrder(referenceId: string, overrides: { currency?: 'TWD' | 'USD'; amountCents?: number } = {}) {
  const currency = overrides.currency ?? 'TWD';
  const address = normalizeCheckoutAddress({
    country: 'TW',
    region: 'Taipei',
    city: 'Taipei',
    postalCode: '100',
    addressLine1: 'No. 1 Road',
  });
  const cart = upsertCartItem(makeEmptyCart('ko', currency), item({ currency, priceCents: overrides.amountCents ?? 34000 }), 1);
  const quote = createCommerceCheckoutQuote(cart, 'ko', 'standard', address);
  return createOrder({
    confirmationNumber: `TSENG-20260520-${referenceId}`,
    locale: 'ko',
    currency,
    customer: { name: 'Webhook Customer', email: `${referenceId}@example.com`, phone: '0912' },
    shippingAddress: address,
    lineItems: cart.items,
    shipping: quote.shipping,
    tax: quote.tax,
    totals: quote.totals,
    payment: {
      adapter: 'sandbox-card',
      status: 'authorized_stub',
      label: 'Sandbox card authorization',
      stub: true,
      referenceId,
    },
    now: '2026-05-20T00:00:00.000Z',
  });
}

beforeEach(async () => {
  previousRoot = process.env.BUILDER_COMMERCE_ROOT;
  previousBackend = process.env.BUILDER_COMMERCE_BACKEND;
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'commerce-payment-webhooks-'));
  process.env.BUILDER_COMMERCE_ROOT = tmpRoot;
  process.env.BUILDER_COMMERCE_BACKEND = 'local';
});

afterEach(async () => {
  process.env.BUILDER_COMMERCE_ROOT = previousRoot;
  process.env.BUILDER_COMMERCE_BACKEND = previousBackend;
  if (tmpRoot) await fs.rm(tmpRoot, { recursive: true, force: true });
});

describe('commerce payment webhooks engine', () => {
  it('stores signed-provider events, updates matching orders, and ignores duplicates', async () => {
    const order = await makeOrder('pi_f68_success');
    const result = await receivePaymentWebhookEvent({
      provider: 'sandbox-card',
      providerEventId: 'evt_f68_success',
      eventType: 'payment_intent.succeeded',
      paymentReferenceId: 'pi_f68_success',
      paymentStatus: 'paid',
      amountCents: order.totals.grandTotalCents,
      currency: 'TWD',
      payload: { id: 'evt_f68_success', data: { object: { card: { last4: '4242' } } } },
    });

    expect(result).toMatchObject({
      duplicate: false,
      changed: true,
      event: { status: 'processed', orderId: order.orderId },
      order: { orderId: order.orderId },
    });
    expect(result.event.signatureVerified).toBe(false);
    const loaded = await loadOrder(order.orderId);
    expect(loaded?.payment.status).toBe('paid');
    expect(loaded?.audit.some((event) => event.type === 'payment.webhook.applied')).toBe(true);

    const duplicate = await receivePaymentWebhookEvent({
      provider: 'sandbox-card',
      providerEventId: 'evt_f68_success',
      eventType: 'payment_intent.succeeded',
      paymentReferenceId: 'pi_f68_success',
      paymentStatus: 'paid',
      amountCents: order.totals.grandTotalCents,
      currency: 'TWD',
      payload: {},
    });
    expect(duplicate).toMatchObject({ duplicate: true, changed: false, reason: 'duplicate_event' });
    const afterDuplicate = await loadOrder(order.orderId);
    expect(afterDuplicate?.audit.filter((event) => event.type === 'payment.webhook.applied')).toHaveLength(1);
  });

  it('stores explicit verification state when provided by the caller', async () => {
    const result = await receivePaymentWebhookEvent({
      provider: 'sandbox-card',
      providerEventId: 'evt_f68_verified',
      eventType: 'payment_intent.succeeded',
      paymentReferenceId: 'pi_f68_verified',
      paymentStatus: 'paid',
      amountCents: 1000,
      currency: 'TWD',
      signatureVerified: true,
      payload: {},
    });

    expect(result.event.signatureVerified).toBe(true);
    expect((await listPaymentWebhookEvents())[0]?.signatureVerified).toBe(true);
  });

  it('persists balance transaction fee metadata from normalized payloads', async () => {
    const result = await receivePaymentWebhookEvent({
      provider: 'sandbox-card',
      providerEventId: 'evt_f68_fee_metadata',
      eventType: 'payment_intent.succeeded',
      paymentReferenceId: 'pi_f68_fee_metadata',
      paymentStatus: 'paid',
      amountCents: 1234,
      currency: 'TWD',
      feeCents: 44,
      netAmountCents: 1190,
      balanceTransactionId: 'bt_f68_fee_metadata',
      signatureVerified: true,
      payload: {},
    });

    expect(result.event).toMatchObject({
      feeCents: 44,
      netAmountCents: 1190,
      balanceTransactionId: 'bt_f68_fee_metadata',
    });
    expect(await listPaymentWebhookEvents()).toMatchObject([
      {
        feeCents: 44,
        netAmountCents: 1190,
        balanceTransactionId: 'bt_f68_fee_metadata',
      },
    ]);
  });

  it('keeps unmatched events replayable and blocks amount/currency mismatch', async () => {
    const unmatched = await receivePaymentWebhookEvent({
      provider: 'sandbox-card',
      providerEventId: 'evt_f68_unmatched',
      eventType: 'payment_intent.succeeded',
      paymentReferenceId: 'pi_f68_late_order',
      paymentStatus: 'paid',
      amountCents: 48300,
      currency: 'TWD',
      payload: {},
    });
    expect(unmatched.event.status).toBe('unmatched');

    const lateOrder = await makeOrder('pi_f68_late_order');
    const replayed = await replayPaymentWebhookEvent(unmatched.event.eventId);
    expect(replayed).toMatchObject({
      changed: true,
      event: { status: 'processed', replayCount: 1, orderId: lateOrder.orderId },
    });
    expect((await loadOrder(lateOrder.orderId))?.payment.status).toBe('paid');

    const mismatchOrder = await makeOrder('pi_f68_mismatch');
    const mismatch = await receivePaymentWebhookEvent({
      provider: 'sandbox-card',
      providerEventId: 'evt_f68_mismatch',
      eventType: 'payment_intent.succeeded',
      paymentReferenceId: 'pi_f68_mismatch',
      paymentStatus: 'paid',
      amountCents: mismatchOrder.totals.grandTotalCents + 1,
      currency: 'TWD',
      payload: {},
    });
    expect(mismatch.event).toMatchObject({ status: 'failed', error: 'amount_mismatch' });
    expect((await loadOrder(mismatchOrder.orderId))?.payment.status).toBe('authorized_stub');
  });

  it('does not downgrade an already paid order when a late failure arrives', async () => {
    const order = await makeOrder('pi_f68_paid_lock');
    await receivePaymentWebhookEvent({
      provider: 'sandbox-card',
      providerEventId: 'evt_f68_paid_lock_success',
      eventType: 'payment_intent.succeeded',
      paymentReferenceId: 'pi_f68_paid_lock',
      paymentStatus: 'paid',
      amountCents: order.totals.grandTotalCents,
      currency: 'TWD',
      payload: {},
    });
    const failure = await receivePaymentWebhookEvent({
      provider: 'sandbox-card',
      providerEventId: 'evt_f68_paid_lock_failure',
      eventType: 'payment_intent.payment_failed',
      paymentReferenceId: 'pi_f68_paid_lock',
      paymentStatus: 'failed',
      amountCents: order.totals.grandTotalCents,
      currency: 'TWD',
      payload: {},
    });
    expect(failure.event).toMatchObject({ status: 'ignored', error: 'paid_payment_locked' });
    expect((await loadOrder(order.orderId))?.payment.status).toBe('paid');
    expect(await listPaymentWebhookEvents({ status: 'ignored' })).toHaveLength(1);
  });

  it('does not overwrite refund states with late payment webhooks', async () => {
    const partialOrder = await makeOrder('pi_f69_partial_lock');
    await receivePaymentWebhookEvent({
      provider: 'sandbox-card',
      providerEventId: 'evt_f69_partial_success',
      eventType: 'payment_intent.succeeded',
      paymentReferenceId: 'pi_f69_partial_lock',
      paymentStatus: 'paid',
      amountCents: partialOrder.totals.grandTotalCents,
      currency: 'TWD',
      payload: {},
    });
    const partialRefund = await refundOrderPayment(partialOrder.orderId, { amountCents: 1000, actor: 'admin' });
    expect(partialRefund.order?.payment.status).toBe('partially_refunded');

    const duplicateSuccess = await receivePaymentWebhookEvent({
      provider: 'sandbox-card',
      providerEventId: 'evt_f69_partial_late_success',
      eventType: 'payment_intent.succeeded',
      paymentReferenceId: 'pi_f69_partial_lock',
      paymentStatus: 'paid',
      amountCents: partialOrder.totals.grandTotalCents,
      currency: 'TWD',
      payload: {},
    });
    expect(duplicateSuccess.event).toMatchObject({ status: 'ignored', error: 'refund_payment_locked' });
    expect((await loadOrder(partialOrder.orderId))?.payment.status).toBe('partially_refunded');

    const lateFailure = await receivePaymentWebhookEvent({
      provider: 'sandbox-card',
      providerEventId: 'evt_f69_partial_late_failure',
      eventType: 'payment_intent.payment_failed',
      paymentReferenceId: 'pi_f69_partial_lock',
      paymentStatus: 'failed',
      amountCents: partialOrder.totals.grandTotalCents,
      currency: 'TWD',
      payload: {},
    });
    expect(lateFailure.event).toMatchObject({ status: 'ignored', error: 'paid_payment_locked' });
    expect((await loadOrder(partialOrder.orderId))?.payment.status).toBe('partially_refunded');

    const fullOrder = await makeOrder('pi_f69_refunded_lock');
    await receivePaymentWebhookEvent({
      provider: 'sandbox-card',
      providerEventId: 'evt_f69_refunded_success',
      eventType: 'payment_intent.succeeded',
      paymentReferenceId: 'pi_f69_refunded_lock',
      paymentStatus: 'paid',
      amountCents: fullOrder.totals.grandTotalCents,
      currency: 'TWD',
      payload: {},
    });
    const fullRefund = await refundOrderPayment(fullOrder.orderId, { amountCents: fullOrder.totals.grandTotalCents, actor: 'admin' });
    expect(fullRefund.order?.payment.status).toBe('refunded');
    const refundedLateSuccess = await receivePaymentWebhookEvent({
      provider: 'sandbox-card',
      providerEventId: 'evt_f69_refunded_late_success',
      eventType: 'payment_intent.succeeded',
      paymentReferenceId: 'pi_f69_refunded_lock',
      paymentStatus: 'paid',
      amountCents: fullOrder.totals.grandTotalCents,
      currency: 'TWD',
      payload: {},
    });
    expect(refundedLateSuccess.event).toMatchObject({ status: 'ignored', error: 'refunded_payment_locked' });
    expect((await loadOrder(fullOrder.orderId))?.payment.status).toBe('refunded');
  });
});
