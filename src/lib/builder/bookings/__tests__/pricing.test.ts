import { describe, expect, it } from 'vitest';
import { bookingServicePriceSnapshot } from '@/lib/builder/bookings/pricing';
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

  it('falls back to full price when deposit is zero or not lower than total', () => {
    expect(bookingServicePriceSnapshot(service({ depositAmount: 0 })).amountDueNow).toBe(5000);
    expect(bookingServicePriceSnapshot(service({ depositAmount: 5000 })).amountDueNow).toBe(5000);
  });
});
