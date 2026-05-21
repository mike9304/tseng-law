import { describe, expect, it } from 'vitest';
import { makeEmptyCart, makeCartItemId, upsertCartItem } from '../cart-shared';
import {
  COMMERCE_NOTIFICATION_VERSION,
  normalizeNotificationEvent,
  normalizeNotificationSettings,
  normalizeRecoveryCart,
} from '../notifications-shared';

describe('commerce notification shared helpers', () => {
  it('normalizes settings, events, and recovery carts', () => {
    const settings = normalizeNotificationSettings({
      enabled: false,
      adminEmail: 'ADMIN@EXAMPLE.COM ',
      abandonedCart: { delayMinutes: 1 },
      templates: {
        'cart.abandoned.customer': { enabled: true, subject: ' Come back ' },
      },
    });
    expect(settings.enabled).toBe(false);
    expect(settings.adminEmail).toBe('admin@example.com');
    expect(settings.abandonedCart.delayMinutes).toBe(5);
    expect(settings.paymentReceived).toMatchObject({
      enabled: true,
      manualEnabled: true,
      hostedEnabled: true,
      suppressFullSettlementReceiptOverlap: true,
    });
    expect(settings.templates['cart.abandoned.customer'].subject).toBe('Come back');

    const paymentSettings = normalizeNotificationSettings({
      paymentReceived: {
        enabled: false,
        manualEnabled: false,
        hostedEnabled: true,
        suppressFullSettlementReceiptOverlap: true,
      },
    });
    expect(paymentSettings.paymentReceived).toMatchObject({
      enabled: false,
      manualEnabled: false,
      hostedEnabled: true,
      suppressFullSettlementReceiptOverlap: true,
    });

    const event = normalizeNotificationEvent({
      version: COMMERCE_NOTIFICATION_VERSION,
      eventId: 'ntf-test',
      type: 'order.created.customer',
      locale: 'ko',
      status: 'queued',
      recipient: { email: 'BUYER@EXAMPLE.COM ' },
      subject: 'Order',
      payload: { orderId: 'order-test' },
      createdAt: '2026-05-20T00:00:00.000Z',
      updatedAt: '2026-05-20T00:00:00.000Z',
    });
    expect(event).toMatchObject({
      eventId: 'ntf-test',
      recipient: { email: 'buyer@example.com' },
    });

    const cart = upsertCartItem(makeEmptyCart('ko', 'TWD'), {
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
    const recovery = normalizeRecoveryCart({
      version: COMMERCE_NOTIFICATION_VERSION,
      recoveryId: 'rcv-test',
      locale: 'ko',
      currency: 'TWD',
      email: 'Buyer@Example.com',
      cart,
      status: 'captured',
      recoveryUrl: '/ko/store/checkout',
      createdAt: '2026-05-20T00:00:00.000Z',
      updatedAt: '2026-05-20T00:00:00.000Z',
      expiresAt: '2026-05-27T00:00:00.000Z',
    });
    expect(recovery).toMatchObject({
      email: 'buyer@example.com',
      totals: { itemCount: 1, totalCents: 10000 },
    });
  });
});
