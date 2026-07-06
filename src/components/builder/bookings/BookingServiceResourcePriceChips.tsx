'use client';

import type { BookingResource } from '@/lib/builder/bookings/types';
import { textForLocale } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import styles from './BookingsAdmin.module.css';

type BookingServiceResourcePriceChipsProps = {
  readonly serviceId: string;
  readonly paymentMode: 'free' | 'paid';
  readonly priceCurrency: string;
  readonly requiredResourceIds: readonly string[];
  readonly resourcePriceOverrides?: Record<string, number>;
  readonly resourceById: ReadonlyMap<string, BookingResource>;
  readonly locale: Locale;
  readonly formatSummary: (resourceName: string, currency: string, amount: number) => string;
};

export function BookingServiceResourcePriceChips({
  serviceId,
  paymentMode,
  priceCurrency,
  requiredResourceIds,
  resourcePriceOverrides,
  resourceById,
  locale,
  formatSummary,
}: BookingServiceResourcePriceChipsProps) {
  if (paymentMode !== 'paid') return null;

  return (
    <>
      {requiredResourceIds
        .filter((resourceId) => {
          const amount = resourcePriceOverrides?.[resourceId];
          return typeof amount === 'number' && amount > 0;
        })
        .map((resourceId) => {
          const amount = resourcePriceOverrides?.[resourceId] ?? 0;
          const resourceName = textForLocale(resourceById.get(resourceId)?.name, locale) || resourceId;
          return (
            <span
              className={styles.chip}
              data-booking-service-resource-price-summary={serviceId}
              data-booking-service-resource-price-resource={resourceId}
              key={`resource-price-${serviceId}-${resourceId}`}
            >
              {formatSummary(resourceName, priceCurrency, amount)}
            </span>
          );
        })}
    </>
  );
}
