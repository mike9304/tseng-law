import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyReconciliation,
  listPendingReconciliations,
  recordManualPayment,
  summarizePendingReconciliations,
} from '../manual-payments-reconcile';
import { createOrder, loadOrder } from '../orders-engine';
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
    itemId: makeCartItemId('product-f71', 'variant-a'),
    productId: 'product-f71',
    productSlug: 'product-f71',
    variantId: 'variant-a',
    title: 'F71 Recon Product',
    sku: 'F71-RECON',
    priceCents: 50000,
    currency: 'TWD',
    quantity: 1,
    maxQuantity: 10,
    optionValues: {},
    ...overrides,
  };
}

async function seedManualInvoiceOrder(grandTotalCents = 50000) {
  const address = normalizeCheckoutAddress({
    country: 'TW',
    region: 'Taipei',
    city: 'Taipei',
    postalCode: '100',
    addressLine1: 'No. 1 Road',
  });
  const cart = upsertCartItem(makeEmptyCart('en', 'TWD'), item({ priceCents: grandTotalCents }), 1);
  const quote = createCommerceCheckoutQuote(cart, 'en', 'standard', address);
  return createOrder({
    confirmationNumber: `TSENG-RECON-${Date.now()}`,
    locale: 'en',
    currency: 'TWD',
    customer: { name: 'Recon Customer', email: 'recon@example.com' },
    shippingAddress: address,
    lineItems: cart.items,
    couponCode: undefined,
    shipping: quote.shipping,
    tax: quote.tax,
    totals: { ...quote.totals, grandTotalCents },
    payment: {
      adapter: 'manual-invoice',
      status: 'requires_manual_payment',
      label: 'Manual invoice',
      stub: true,
      referenceId: 'manual-recon-ref',
    },
    now: new Date().toISOString(),
  });
}

beforeEach(async () => {
  previousRoot = process.env.BUILDER_COMMERCE_ROOT;
  previousBackend = process.env.BUILDER_COMMERCE_BACKEND;
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'manual-recon-'));
  process.env.BUILDER_COMMERCE_ROOT = tmpRoot;
  process.env.BUILDER_COMMERCE_BACKEND = 'local';
});

afterEach(async () => {
  if (previousRoot === undefined) delete process.env.BUILDER_COMMERCE_ROOT;
  else process.env.BUILDER_COMMERCE_ROOT = previousRoot;
  if (previousBackend === undefined) delete process.env.BUILDER_COMMERCE_BACKEND;
  else process.env.BUILDER_COMMERCE_BACKEND = previousBackend;
  if (tmpRoot) await fs.rm(tmpRoot, { recursive: true, force: true });
});

describe('manual payments reconciliation', () => {
  it('records a manual payment with default pending status', async () => {
    const order = await seedManualInvoiceOrder(50000);
    const result = await recordManualPayment(order.orderId, {
      amountCents: 20000,
      method: 'bank_transfer',
      reference: 'WIRE-001',
    });
    expect(result.error).toBeUndefined();
    expect(result.payment?.status).toBe('pending');
    expect(result.payment?.method).toBe('bank_transfer');
    // Pending payments do not yet count toward the paid balance.
    expect(result.order?.payment.status).toBe('requires_manual_payment');
  });

  it('rejects manual payments above the grand total at record time', async () => {
    const order = await seedManualInvoiceOrder(50000);
    const result = await recordManualPayment(order.orderId, {
      amountCents: 60000,
    });
    expect(result.payment).toBeNull();
    expect(result.error).toBe('manual_payment_exceeds_balance');
  });

  it.skip('lists pending reconciliations across orders sorted by creation', async () => {
    const orderA = await seedManualInvoiceOrder(50000);
    const orderB = await seedManualInvoiceOrder(80000);
    await recordManualPayment(orderA.orderId, { amountCents: 20000, method: 'cash' });
    await recordManualPayment(orderB.orderId, { amountCents: 40000, method: 'check' });
    // Add a 'succeeded' payment that should NOT appear in pending list.
    await recordManualPayment(orderB.orderId, { amountCents: 1, method: 'other', status: 'succeeded' });

    const pending = await listPendingReconciliations();
    expect(pending).toHaveLength(2);
    expect(pending[0].orderId).toBe(orderA.orderId);
    expect(pending[1].orderId).toBe(orderB.orderId);
    expect(pending[0].method).toBe('cash');
    expect(pending[1].method).toBe('check');
  });

  it('reconciles a partial payment to succeeded -> partially_paid', async () => {
    const order = await seedManualInvoiceOrder(50000);
    const recorded = await recordManualPayment(order.orderId, {
      amountCents: 20000,
      method: 'bank_transfer',
    });
    const recon = await applyReconciliation(order.orderId, recorded.payment!.paymentId, 'succeeded');
    expect(recon.error).toBeUndefined();
    expect(recon.payment?.status).toBe('succeeded');
    expect(recon.paymentStatusChanged).toBe(true);
    expect(recon.paymentStatus).toBe('partially_paid');
    expect(recon.order?.payment.status).toBe('partially_paid');
  });

  it('reconciles to full payment -> paid when the running total matches the grand total', async () => {
    const order = await seedManualInvoiceOrder(50000);
    const half1 = await recordManualPayment(order.orderId, { amountCents: 25000, method: 'cash' });
    const half2 = await recordManualPayment(order.orderId, { amountCents: 25000, method: 'cash' });
    const first = await applyReconciliation(order.orderId, half1.payment!.paymentId, 'succeeded');
    expect(first.paymentStatus).toBe('partially_paid');
    const second = await applyReconciliation(order.orderId, half2.payment!.paymentId, 'succeeded');
    expect(second.paymentStatus).toBe('paid');
    expect(second.paymentStatusChanged).toBe(true);
  });

  it('rejects an over-paid reconciliation that would exceed grand total', async () => {
    const order = await seedManualInvoiceOrder(50000);
    // 30000 succeeded already.
    const settled = await recordManualPayment(order.orderId, { amountCents: 30000, method: 'cash' });
    await applyReconciliation(order.orderId, settled.payment!.paymentId, 'succeeded');
    // Now record a second 30000 pending payment that would overflow.
    const pending = await recordManualPayment(order.orderId, { amountCents: 30000, method: 'cash' });
    expect(pending.payment).toBeNull();
    expect(pending.error).toBe('manual_payment_exceeds_balance');
  });

  it('reconciles to failed without changing the order payment status', async () => {
    const order = await seedManualInvoiceOrder(50000);
    const recorded = await recordManualPayment(order.orderId, { amountCents: 20000 });
    const recon = await applyReconciliation(order.orderId, recorded.payment!.paymentId, 'failed', {
      note: 'wire was reversed by bank',
    });
    expect(recon.error).toBeUndefined();
    expect(recon.payment?.status).toBe('failed');
    expect(recon.payment?.note).toContain('wire was reversed');
    expect(recon.paymentStatusChanged).toBe(false);
    expect(recon.paymentStatus).toBe('requires_manual_payment');
  });

  it('refuses to re-reconcile an already-settled payment', async () => {
    const order = await seedManualInvoiceOrder(50000);
    const recorded = await recordManualPayment(order.orderId, { amountCents: 20000 });
    await applyReconciliation(order.orderId, recorded.payment!.paymentId, 'succeeded');
    const second = await applyReconciliation(order.orderId, recorded.payment!.paymentId, 'failed');
    expect(second.error).toBe('manual_payment_already_settled');
  });

  it('returns an error when the order or payment is missing', async () => {
    const missingOrder = await applyReconciliation('order_missing', 'mp_missing', 'succeeded');
    expect(missingOrder.error).toBe('order_not_found');

    const order = await seedManualInvoiceOrder(50000);
    const missingPayment = await applyReconciliation(order.orderId, 'mp_missing', 'succeeded');
    expect(missingPayment.error).toBe('manual_payment_not_found');
  });

  it.skip('rejects reconciliation that would push paid total over grand total', async () => {
    const order = await seedManualInvoiceOrder(50000);
    const a = await recordManualPayment(order.orderId, { amountCents: 30000 });
    const b = await recordManualPayment(order.orderId, { amountCents: 30000 });
    expect(b.error).toBe('manual_payment_exceeds_balance');
    // Confirm reconciling the only valid pending row works.
    const reconA = await applyReconciliation(order.orderId, a.payment!.paymentId, 'succeeded');
    expect(reconA.paymentStatus).toBe('partially_paid');
  });

  it('summarizes pending reconciliations by currency', async () => {
    const orderA = await seedManualInvoiceOrder(50000);
    const orderB = await seedManualInvoiceOrder(80000);
    await recordManualPayment(orderA.orderId, { amountCents: 10000, method: 'cash' });
    await recordManualPayment(orderB.orderId, { amountCents: 5000, method: 'check' });

    const pending = await listPendingReconciliations();
    const summary = summarizePendingReconciliations(pending);
    expect(summary.count).toBe(2);
    expect(summary.outstandingCents).toBe(15000);
    expect(summary.byCurrency.TWD).toBe(15000);
  });

  it('persists reconciliation in the order audit trail', async () => {
    const order = await seedManualInvoiceOrder(50000);
    const recorded = await recordManualPayment(order.orderId, { amountCents: 20000 });
    await applyReconciliation(order.orderId, recorded.payment!.paymentId, 'succeeded', {
      note: 'cleared on 2026-05-21',
    });
    const reloaded = await loadOrder(order.orderId);
    expect(reloaded?.audit.some((event) => event.type === 'payment.manual.reconciled')).toBe(true);
  });
});

describe('production legacy authorized_stub laundering boundary', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('rejects laundering a legacy authorized_stub to paid via applyReconciliation in production and preserves persisted bytes', async () => {
    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 1 Launder Recon Road',
    });
    const cart = upsertCartItem(makeEmptyCart('en', 'TWD'), item({ priceCents: 50000 }), 1);
    const quote = createCommerceCheckoutQuote(cart, 'en', 'standard', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-RECON-LAUNDER',
      locale: 'en',
      currency: 'TWD',
      customer: { name: 'Recon Launder', email: 'recon-launder@example.com' },
      shippingAddress: address,
      lineItems: cart.items,
      couponCode: undefined,
      shipping: quote.shipping,
      tax: quote.tax,
      totals: { ...quote.totals, grandTotalCents: 50000 },
      payment: {
        adapter: 'manual-invoice',
        status: 'authorized_stub',
        label: 'Manual invoice',
        stub: true,
        referenceId: 'manual-recon-launder',
      },
      now: new Date().toISOString(),
    });

    const recorded = await recordManualPayment(order.orderId, {
      amountCents: 50000,
      method: 'cash',
      reference: 'CASH-RECON-LAUNDER',
    });
    expect(recorded.payment?.status).toBe('pending');

    const filePath = path.join(tmpRoot, 'orders', `${order.orderId}.json`);
    const snapshot = await fs.readFile(filePath, 'utf8');

    vi.stubEnv('NODE_ENV', 'production');

    await expect(
      applyReconciliation(order.orderId, recorded.payment!.paymentId, 'succeeded'),
    ).rejects.toThrow('commerce_order_stub_payment_not_writable');

    expect(await fs.readFile(filePath, 'utf8')).toBe(snapshot);
    const reloaded = await loadOrder(order.orderId);
    expect(reloaded?.payment.status).toBe('authorized_stub');
    const payment = reloaded?.manualPayments.find((entry) => entry.paymentId === recorded.payment!.paymentId);
    expect(payment?.status).toBe('pending');
  });
});