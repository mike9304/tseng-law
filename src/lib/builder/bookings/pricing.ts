import type { BookingService } from './types';

export interface BookingPriceSnapshot {
  paymentRequired: boolean;
  totalAmount: number;
  currency: NonNullable<BookingService['priceCurrency']>;
  amountDueNow: number;
  depositAmount?: number;
  balanceDueAfterOnlinePayment: number;
  isDeposit: boolean;
}

export function bookingServiceTotalAmount(service: BookingService): number {
  return Math.max(0, service.priceAmount ?? service.priceTwd ?? 0);
}

export function bookingServicePriceSnapshot(service: BookingService): BookingPriceSnapshot {
  const totalAmount = bookingServiceTotalAmount(service);
  const currency = service.priceCurrency ?? 'TWD';
  if (service.paymentMode !== 'paid') {
    return {
      paymentRequired: false,
      totalAmount,
      currency,
      amountDueNow: 0,
      balanceDueAfterOnlinePayment: totalAmount,
      isDeposit: false,
    };
  }

  const configuredDeposit = Math.floor(Number(service.depositAmount ?? 0));
  const depositAmount = configuredDeposit > 0 && configuredDeposit < totalAmount
    ? configuredDeposit
    : undefined;
  const amountDueNow = depositAmount ?? totalAmount;

  return {
    paymentRequired: true,
    totalAmount,
    currency,
    amountDueNow,
    depositAmount,
    balanceDueAfterOnlinePayment: Math.max(0, totalAmount - amountDueNow),
    isDeposit: Boolean(depositAmount),
  };
}
