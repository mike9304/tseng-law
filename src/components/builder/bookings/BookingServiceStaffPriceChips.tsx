'use client';

import type { Staff } from '@/lib/builder/bookings/types';
import { textForLocale } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

type BookingServiceStaffPriceChipsProps = {
  readonly serviceId: string;
  readonly paymentMode: 'free' | 'paid';
  readonly priceCurrency: string;
  readonly staffIds: readonly string[];
  readonly staffPriceOverrides?: Record<string, number>;
  readonly staffById: ReadonlyMap<string, Staff>;
  readonly locale: Locale;
  readonly formatSummary: (staffName: string, currency: string, amount: number) => string;
};

export function BookingServiceStaffPriceChips({
  serviceId,
  paymentMode,
  priceCurrency,
  staffIds,
  staffPriceOverrides,
  staffById,
  locale,
  formatSummary,
}: BookingServiceStaffPriceChipsProps) {
  if (paymentMode !== 'paid') return null;

  const assignedStaffIds = new Set(staffIds);
  const staffPriceOverrideEntries = Object.entries(staffPriceOverrides ?? {})
    .filter(([staffId, amount]) => assignedStaffIds.has(staffId) && Number.isFinite(amount) && amount > 0);

  return (
    <>
      {staffPriceOverrideEntries.map(([staffId, amount]) => {
        const staffName = textForLocale(staffById.get(staffId)?.name, locale) || staffId;
        return (
          <span
            className={styles.chip}
            data-booking-service-staff-price-summary={serviceId}
            data-booking-service-staff-price-staff={staffId}
            key={`staff-price-${serviceId}-${staffId}`}
          >
            {formatSummary(staffName, priceCurrency, amount)}
          </span>
        );
      })}
    </>
  );
}
