import { describe, expect, it } from 'vitest';
import { bookingServicePriceSnapshot, bookingServiceTotalAmount } from '@/lib/builder/bookings/pricing';
import type { BookingService } from '@/lib/builder/bookings/types';
import { createLocalizedText } from '@/lib/builder/bookings/types';

function service(overrides: Partial<BookingService> = {}): BookingService {
  return {
    serviceId: 'svc-price',
    slug: 'pricing',
    name: createLocalizedText('Pricing consultation'),
    description: createLocalizedText('Pricing test'),
    durationMinutes: 30,
    priceTwd: 0,
    staffIds: [],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    paymentMode: 'paid',
    priceAmount: 5000,
    priceCurrency: 'TWD',
    ...overrides,
  };
}

describe('booking service pricing', () => {
  it('uses full price when no deposit is configured', () => {
    expect(bookingServicePriceSnapshot(service())).toMatchObject({
      paymentRequired: true,
      totalAmount: 5000,
      amountDueNow: 5000,
      balanceDueAfterOnlinePayment: 0,
      isDeposit: false,
    });
  });

  it('uses a fixed deposit as amount due now and leaves the balance outstanding', () => {
    expect(bookingServicePriceSnapshot(service({ depositAmount: 1500 }))).toMatchObject({
      paymentRequired: true,
      totalAmount: 5000,
      amountDueNow: 1500,
      depositAmount: 1500,
      balanceDueAfterOnlinePayment: 3500,
      isDeposit: true,
    });
  });

  it('uses the selected staff price override as the total amount', () => {
    expect(bookingServicePriceSnapshot(
      service({ staffPriceOverrides: { 'staff-premium': 8000 } }),
      { staffId: 'staff-premium' },
    )).toMatchObject({
      paymentRequired: true,
      totalAmount: 8000,
      amountDueNow: 8000,
      balanceDueAfterOnlinePayment: 0,
    });
  });

  it('applies a service discount code to the due-now amount', () => {
    expect(bookingServicePriceSnapshot(
      service({
        discountCodes: [{ code: 'LEGAL20', type: 'percent', value: 20, active: true, locale: 'all' }],
      }),
      { discountCode: ' legal20 ', locale: 'ko' },
    )).toMatchObject({
      paymentRequired: true,
      subtotalAmount: 5000,
      totalAmount: 4000,
      amountDueNow: 4000,
      balanceDueAfterOnlinePayment: 0,
      discountCode: 'LEGAL20',
      discountAmount: 1000,
    });
  });

  it('applies deposits against the discounted total', () => {
    expect(bookingServicePriceSnapshot(
      service({
        depositAmount: 1500,
        discountCodes: [{ code: 'LEGAL20', type: 'percent', value: 20, active: true, locale: 'all' }],
      }),
      { discountCode: 'LEGAL20', locale: 'en' },
    )).toMatchObject({
      subtotalAmount: 5000,
      totalAmount: 4000,
      amountDueNow: 1500,
      depositAmount: 1500,
      balanceDueAfterOnlinePayment: 2500,
      isDeposit: true,
      discountAmount: 1000,
    });
  });

  it('ignores invalid discount codes without changing the price', () => {
    expect(bookingServicePriceSnapshot(
      service({
        discountCodes: [{ code: 'LEGAL20', type: 'percent', value: 20, active: true, locale: 'all' }],
      }),
      { discountCode: 'missing', locale: 'ko' },
    )).toMatchObject({
      totalAmount: 5000,
      amountDueNow: 5000,
    });
  });

  it('applies a deposit against the staff override total', () => {
    expect(bookingServicePriceSnapshot(
      service({ staffPriceOverrides: { 'staff-premium': 8000 }, depositAmount: 2000 }),
      { staffId: 'staff-premium' },
    )).toMatchObject({
      paymentRequired: true,
      totalAmount: 8000,
      amountDueNow: 2000,
      depositAmount: 2000,
      balanceDueAfterOnlinePayment: 6000,
      isDeposit: true,
    });
  });

  it('falls back to the base price when the selected staff has no override', () => {
    expect(bookingServicePriceSnapshot(
      service({ staffPriceOverrides: { 'staff-premium': 8000 } }),
      { staffId: 'staff-standard' },
    )).toMatchObject({
      totalAmount: 5000,
      amountDueNow: 5000,
    });
  });

  it('falls back to the base price when a staff override is zero', () => {
    expect(bookingServicePriceSnapshot(
      service({ staffPriceOverrides: { 'staff-premium': 0 } }),
      { staffId: 'staff-premium' },
    )).toMatchObject({
      totalAmount: 5000,
      amountDueNow: 5000,
    });
  });

  it('ignores staff overrides for free services even if present', () => {
    expect(bookingServicePriceSnapshot(
      service({ paymentMode: 'free', staffPriceOverrides: { 'staff-premium': 8000 } }),
      { staffId: 'staff-premium' },
    )).toMatchObject({
      paymentRequired: false,
      totalAmount: 5000,
      amountDueNow: 0,
    });
  });

  it('falls back to full price when deposit is zero or not lower than total', () => {
    expect(bookingServicePriceSnapshot(service({ depositAmount: 0 })).amountDueNow).toBe(5000);
    expect(bookingServicePriceSnapshot(service({ depositAmount: 5000 })).amountDueNow).toBe(5000);
  });

  it('pay-later confirms without online payment but tracks the full balance as outstanding', () => {
    expect(bookingServicePriceSnapshot(service({ collectPaymentLater: true }))).toMatchObject({
      paymentRequired: false,
      totalAmount: 5000,
      amountDueNow: 0,
      balanceDueAfterOnlinePayment: 5000,
      isDeposit: false,
      payLater: true,
    });
  });

  it('pay-later services keep the discounted balance outstanding', () => {
    expect(bookingServicePriceSnapshot(
      service({
        collectPaymentLater: true,
        discountCodes: [{ code: 'FIXED500', type: 'fixed', value: 500, active: true, locale: 'all' }],
      }),
      { discountCode: 'fixed500' },
    )).toMatchObject({
      paymentRequired: false,
      subtotalAmount: 5000,
      totalAmount: 4500,
      amountDueNow: 0,
      balanceDueAfterOnlinePayment: 4500,
      payLater: true,
      discountCode: 'FIXED500',
      discountAmount: 500,
    });
  });

  it('pay-later ignores any configured deposit and treats the full price as the later balance', () => {
    expect(bookingServicePriceSnapshot(service({ collectPaymentLater: true, depositAmount: 1500 }))).toMatchObject({
      paymentRequired: false,
      amountDueNow: 0,
      balanceDueAfterOnlinePayment: 5000,
      isDeposit: false,
      payLater: true,
    });
  });

  it('free and paid services are not flagged as pay-later', () => {
    expect(bookingServicePriceSnapshot(service({ paymentMode: 'free' })).payLater).toBe(false);
    expect(bookingServicePriceSnapshot(service({ paymentMode: 'paid' })).payLater).toBe(false);
  });

  it('uses the first matching required resource override as the total, ahead of staff overrides', () => {
    expect(bookingServicePriceSnapshot(
      service({
        requiredResourceIds: ['room-a', 'room-b'],
        resourcePriceOverrides: { 'room-a': 9000, 'room-b': 9500 },
        staffPriceOverrides: { 'staff-premium': 8000 },
      }),
      { staffId: 'staff-premium', resourceIds: ['room-a', 'room-b'] },
    )).toMatchObject({
      paymentRequired: true,
      totalAmount: 9000,
      amountDueNow: 9000,
      balanceDueAfterOnlinePayment: 0,
      effectiveResourceId: 'room-a',
    });
  });

  it('applies discounts after resolving resource price overrides', () => {
    expect(bookingServicePriceSnapshot(
      service({
        requiredResourceIds: ['room-a'],
        resourcePriceOverrides: { 'room-a': 9000 },
        discountCodes: [{ code: 'LEGAL20', type: 'percent', value: 20, active: true, locale: 'all' }],
      }),
      { resourceIds: ['room-a'], discountCode: 'LEGAL20' },
    )).toMatchObject({
      effectiveResourceId: 'room-a',
      subtotalAmount: 9000,
      totalAmount: 7200,
      amountDueNow: 7200,
      discountAmount: 1800,
    });
  });

  it('bookingServiceTotalAmount resolves resource override ahead of staff and base price', () => {
    expect(bookingServiceTotalAmount(
      service({
        requiredResourceIds: ['room-a'],
        resourcePriceOverrides: { 'room-a': 9000 },
        staffPriceOverrides: { 'staff-premium': 8000 },
      }),
      { staffId: 'staff-premium', resourceIds: ['room-a'] },
    )).toBe(9000);
  });

  it('falls back to the staff override when no required resource override is positive', () => {
    const snapshot = bookingServicePriceSnapshot(
      service({
        requiredResourceIds: ['room-a'],
        resourcePriceOverrides: { 'room-a': 0 },
        staffPriceOverrides: { 'staff-premium': 8000 },
      }),
      { staffId: 'staff-premium', resourceIds: ['room-a'] },
    );
    expect(snapshot.totalAmount).toBe(8000);
    expect(snapshot.effectiveResourceId).toBeUndefined();
  });

  it('ignores resource overrides when no resource ids are supplied to the snapshot', () => {
    const snapshot = bookingServicePriceSnapshot(
      service({
        requiredResourceIds: ['room-a'],
        resourcePriceOverrides: { 'room-a': 9000 },
        staffPriceOverrides: { 'staff-premium': 8000 },
      }),
      { staffId: 'staff-premium' },
    );
    expect(snapshot.totalAmount).toBe(8000);
    expect(snapshot.effectiveResourceId).toBeUndefined();
  });

  it('applies a deposit against the resource override total', () => {
    expect(bookingServicePriceSnapshot(
      service({
        requiredResourceIds: ['room-a'],
        resourcePriceOverrides: { 'room-a': 9000 },
        depositAmount: 2000,
      }),
      { resourceIds: ['room-a'] },
    )).toMatchObject({
      paymentRequired: true,
      totalAmount: 9000,
      amountDueNow: 2000,
      depositAmount: 2000,
      balanceDueAfterOnlinePayment: 7000,
      isDeposit: true,
      effectiveResourceId: 'room-a',
    });
  });

  it('ignores resource overrides for free services even if present', () => {
    const snapshot = bookingServicePriceSnapshot(
      service({
        paymentMode: 'free',
        requiredResourceIds: ['room-a'],
        resourcePriceOverrides: { 'room-a': 9000 },
        discountCodes: [{ code: 'LEGAL20', type: 'percent', value: 20, active: true, locale: 'all' }],
      }),
      { resourceIds: ['room-a'], discountCode: 'LEGAL20' },
    );
    expect(snapshot).toMatchObject({
      paymentRequired: false,
      totalAmount: 5000,
      amountDueNow: 0,
    });
    expect(snapshot.effectiveResourceId).toBeUndefined();
    expect(snapshot.discountAmount).toBeUndefined();
  });
});
