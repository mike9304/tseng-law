import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { CommerceOrder, CommerceOrderPaymentStatus } from '@/lib/builder/commerce/orders-engine';

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: React.ComponentProps<'a'> & { href: string }) =>
    React.createElement('a', { href, ...rest }, children),
}));

import OrderManagerClient from '../OrderManagerClient';

function makeOrder(orderId: string, paymentStatus: CommerceOrderPaymentStatus): CommerceOrder {
  const isStub = paymentStatus === 'authorized_stub';
  return {
    version: 1,
    orderId,
    confirmationNumber: `CN-${orderId}`,
    locale: 'en',
    currency: 'TWD',
    status: 'confirmed',
    customer: { name: `Customer ${orderId}`, email: `${orderId}@example.test` },
    shippingAddress: {
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: '1 Main St',
    },
    lineItems: [
      {
        itemId: `${orderId}-item-1`,
        productId: 'prod-1',
        productSlug: 'consult',
        title: 'Consultation',
        sku: 'CONSULT-001',
        priceCents: 50000,
        currency: 'TWD',
        quantity: 1,
        maxQuantity: 5,
        optionValues: {},
      },
    ],
    shipping: {
      method: 'digital',
      label: 'Digital delivery',
      amountCents: 0,
      currency: 'TWD',
      estimatedDays: '0',
    },
    tax: { country: 'TW', rateBps: 500, amountCents: 2500, label: 'Taiwan VAT' },
    totals: {
      itemCount: 1,
      subtotalCents: 50000,
      discountCents: 0,
      totalCents: 50000,
      shippingCents: 0,
      taxCents: 2500,
      grandTotalCents: 52500,
    },
    payment: {
      adapter: isStub ? 'sandbox-card' : 'manual-invoice',
      status: paymentStatus,
      label: isStub ? 'sandbox-card' : 'manual-invoice',
      stub: isStub,
    },
    manualPayments: [],
    refunds: [],
    documents: [],
    fulfillment: {
      status: 'unfulfilled',
      method: 'checkout',
      updatedAt: '2026-07-01T00:00:00.000Z',
    },
    source: 'checkout',
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    audit: [],
  };
}

function kpiValue(html: string, key: string): string | null {
  const match = html.match(
    new RegExp(`data-commerce-orders-kpi="${key}">[\\s\\S]*?<strong>(\\d+)</strong>`),
  );
  return match ? match[1] : null;
}

function scopedSpanText(html: string, dataAttr: string, value: string): string | null {
  const match = html.match(new RegExp(`${dataAttr}="${value}">([\\s\\S]*?)<\\/span>`));
  return match ? match[1] : null;
}

describe('OrderManagerClient paid KPI excludes authorized_stub', () => {
  it('counts only genuine paid orders while keeping authorized_stub as its own visible status', () => {
    const orders = [
      makeOrder('ord-auth-stub', 'authorized_stub'),
      makeOrder('ord-paid', 'paid'),
    ];

    const html = renderToStaticMarkup(
      <OrderManagerClient locale="en" siteTitle="Test Site" initialOrders={orders} />,
    );

    expect(kpiValue(html, 'paid')).toBe('1');
    expect(kpiValue(html, 'total')).toBe('2');

    expect(html).toContain('data-commerce-order-row="ord-auth-stub"');
    expect(html).toContain('data-commerce-order-payment-status="authorized_stub"');
    expect(html).toContain('Sandbox authorization (test, not collected)');
    expect(html).toContain('<option value="authorized_stub">Sandbox authorization (test, not collected)</option>');

    expect(html).toContain('data-commerce-order-row="ord-paid"');
    expect(html).toContain('data-commerce-order-payment-status="paid"');

    const stubBalance = scopedSpanText(html, 'data-commerce-order-manual-balance', 'ord-auth-stub');
    expect(stubBalance).not.toBeNull();
    expect(stubBalance).toContain('Manual paid NT$0');
    expect(stubBalance).toContain('due NT$525');

    expect(kpiValue(html, 'refunded')).toBe('0');
    expect(kpiValue(html, 'partialRefund')).toBe('0');
  });
});
