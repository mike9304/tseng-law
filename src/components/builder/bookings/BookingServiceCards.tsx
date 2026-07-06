'use client';

import type { BookingCancellationPolicy, BookingResource, BookingService, Staff } from '@/lib/builder/bookings/types';
import { textForLocale } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import type { PaginationState } from '@/components/builder/shared/usePagination';
import Pagination from '@/components/builder/shared/Pagination';
import { BookingServiceResourcePriceChips } from './BookingServiceResourcePriceChips';
import { BookingServiceStaffPriceChips } from './BookingServiceStaffPriceChips';
import type { BookingServicesAdminCopy } from './BookingServicesAdmin.copy';
import { inactiveResourceNames, meetingModeLabel } from './BookingServiceDraft';
import styles from './BookingsAdmin.module.css';

type BookingServiceCardsProps = {
  readonly locale: Locale;
  readonly pagination: PaginationState<BookingService>;
  readonly staffById: ReadonlyMap<string, Staff>;
  readonly resourceById: ReadonlyMap<string, BookingResource>;
  readonly policyById: ReadonlyMap<string, BookingCancellationPolicy>;
  readonly copy: BookingServicesAdminCopy;
  readonly onEdit: (service: BookingService) => void;
  readonly onDeactivate: (service: BookingService) => void;
};

function reminderSummary(service: BookingService, c: BookingServicesAdminCopy): string {
  if (service.reminderOffsetsHours === undefined) return `${c.reminderLabel} 24h`;
  if (service.reminderOffsetsHours.length > 0) return `${c.reminderLabel} ${service.reminderOffsetsHours.join('h + ')}h`;
  return `${c.reminderLabel} off`;
}

export function BookingServiceCards({
  locale,
  pagination,
  staffById,
  resourceById,
  policyById,
  copy: c,
  onEdit,
  onDeactivate,
}: BookingServiceCardsProps) {
  return (
    <>
      <div className={styles.grid}>
        {pagination.visible.map((service) => (
          <article className={styles.card} data-booking-service-card={service.serviceId} key={service.serviceId}>
            <div className={styles.cardImage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {service.image ? <img alt="" src={service.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : c.imageFallback}
            </div>
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{textForLocale(service.name, locale)}</h2>
              <p className={styles.muted}>{textForLocale(service.description, locale) || c.serviceNotes}</p>
              <div className={styles.metaRow}>
                <span className={styles.chip}>{service.durationMinutes} {c.minLabel}</span>
                <span className={styles.chip}>TWD {service.priceTwd?.toLocaleString() || 0}</span>
                <span className={styles.chip}>
                  {service.paymentMode === 'paid' ? c.paidBooking(service.priceCurrency ?? 'TWD', service.priceAmount ?? service.priceTwd ?? 0) : c.freeBooking}
                </span>
                {service.paymentMode === 'paid' && service.depositAmount ? (
                  <span className={styles.chip}>{c.deposit(service.priceCurrency ?? 'TWD', service.depositAmount)}</span>
                ) : null}
                {service.paymentMode === 'paid' && service.collectPaymentLater ? <span className={styles.chip}>{c.collectPaymentLater}</span> : null}
                {service.paymentMode === 'paid' ? (service.discountCodes ?? [])
                  .filter((rule) => rule.active !== false)
                  .map((rule) => (
                    <span className={styles.chip} data-booking-service-discount-code={rule.code} key={`${service.serviceId}-${rule.code}`}>
                      {c.discountCodeSummary(rule.code, rule.type, rule.value)}
                    </span>
                  )) : null}
                <BookingServiceStaffPriceChips
                  formatSummary={c.staffPriceOverrideSummary}
                  locale={locale}
                  paymentMode={service.paymentMode ?? 'free'}
                  priceCurrency={service.priceCurrency ?? 'TWD'}
                  serviceId={service.serviceId}
                  staffById={staffById}
                  staffIds={service.staffIds}
                  staffPriceOverrides={service.staffPriceOverrides}
                />
                <BookingServiceResourcePriceChips
                  formatSummary={c.resourcePriceOverrideSummary}
                  locale={locale}
                  paymentMode={service.paymentMode ?? 'free'}
                  priceCurrency={service.priceCurrency ?? 'TWD'}
                  requiredResourceIds={service.requiredResourceIds ?? []}
                  resourceById={resourceById}
                  resourcePriceOverrides={service.resourcePriceOverrides}
                  serviceId={service.serviceId}
                />
                <span className={styles.chip}>{meetingModeLabel(locale, service.meetingMode)}</span>
                {service.cancellationPolicyId ? (
                  <span className={styles.chip}>{c.policySummary(service.cancellationPolicyId, policyById.get(service.cancellationPolicyId)?.name)}</span>
                ) : null}
                <span className={styles.chip}>{service.maxParticipants ?? 1} {c.seatsLabel}</span>
                <span className={styles.chip} data-booking-service-reminder-summary={service.serviceId}>
                  {reminderSummary(service, c)}
                </span>
                <span className={styles.chip}>{c.everyLabel} {service.slotStepMinutes ?? 30} {c.minLabel}</span>
                <span className={styles.chip}>{service.isActive ? c.active : c.inactive}</span>
              </div>
              <p className={styles.muted}>
                {c.staffLabel}: {service.staffIds.map((id) => textForLocale(staffById.get(id)?.name, locale)).filter(Boolean).join(', ') || c.anyActiveStaff}
              </p>
              <p className={styles.muted}>
                {c.resourcesLabel}: {(service.requiredResourceIds ?? []).map((id) => textForLocale(resourceById.get(id)?.name, locale)).filter(Boolean).join(', ') || c.noSharedResources}
              </p>
              {inactiveResourceNames(service, resourceById, locale).length > 0 ? (
                <p className={styles.warning} data-booking-service-resource-warning={service.serviceId}>
                  {c.inactiveResourceWarning(inactiveResourceNames(service, resourceById, locale))}
                </p>
              ) : null}
              <div className={styles.actions}>
                <button className={styles.buttonSecondary} onClick={() => onEdit(service)} type="button">{c.edit}</button>
                {service.isActive ? (
                  <button className={styles.buttonSecondary} onClick={() => onDeactivate(service)} type="button">{c.deactivate}</button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
      <Pagination
        copy={{
          nextLabel: c.paginationNext,
          pageLabel: c.paginationPage,
          pageSizeLabel: c.paginationPageSize,
          prevLabel: c.paginationPrev,
        }}
        pagination={pagination}
      />
    </>
  );
}
