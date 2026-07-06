'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import styles from '@/components/members/MembersArea.module.css';
import type { Locale } from '@/lib/locales';

type BookingSearchLabels = {
  searchLabel: string;
  searchPlaceholder: string;
  searchHint: string;
  clearSearch: string;
  resetFilters: string;
  serviceAll: string;
  staffAll: string;
  timezoneAll: string;
  dateRange: string;
  dateFrom: string;
  dateTo: string;
  dateRangeHint: string;
  statusAll: string;
  statusUpcoming: string;
  statusPast: string;
  statusCancelled: string;
  paymentAll: string;
  paymentUnpaid: string;
  paymentPartiallyPaid: string;
  paymentPaid: string;
  paymentRefunded: string;
  paymentPartialRefund: string;
  sortLatest: string;
  sortEarliest: string;
};

type BookingStatusFilter = 'all' | 'upcoming' | 'past' | 'cancelled';
type BookingServiceFilter = string;
type BookingTimezoneFilter = string;
type BookingPaymentFilter = 'all' | 'unpaid' | 'partially_paid' | 'paid' | 'refunded' | 'partial-refund';
type BookingSortFilter = 'latest' | 'earliest';

type SearchState = {
  query: string;
  status: BookingStatusFilter;
  service: BookingServiceFilter;
  staff: BookingServiceFilter;
  timezone: BookingTimezoneFilter;
  dateFrom: string;
  dateTo: string;
  payment: BookingPaymentFilter;
  sort: BookingSortFilter;
};

type MemberBookingsSearchFormProps = {
  locale: Locale;
  query: string;
  status: BookingStatusFilter;
  service: BookingServiceFilter;
  staff: BookingServiceFilter;
  timezone: BookingTimezoneFilter;
  dateFrom: string;
  dateTo: string;
  payment: BookingPaymentFilter;
  sort: BookingSortFilter;
  serviceOptions: Array<{ key: string; label: string }>;
  staffOptions: Array<{ key: string; label: string }>;
  timezoneOptions: Array<{ key: string; label: string }>;
  labels: BookingSearchLabels;
};

function buildHref(locale: Locale, current: SearchState, overrides: Partial<SearchState> = {}) {
  const next: SearchState = { ...current, ...overrides };
  const params = new URLSearchParams();
  if (next.query.trim()) params.set('q', next.query.trim());
  if (next.status !== 'all') params.set('status', next.status);
  if (next.service.trim()) params.set('service', next.service.trim());
  if (next.staff.trim()) params.set('staff', next.staff.trim());
  if (next.timezone.trim()) params.set('timezone', next.timezone.trim());
  if (next.dateFrom.trim()) params.set('dateFrom', next.dateFrom.trim());
  if (next.dateTo.trim()) params.set('dateTo', next.dateTo.trim());
  if (next.payment !== 'all') params.set('payment', next.payment);
  if (next.sort !== 'latest') params.set('sort', next.sort);
  const search = params.toString();
  return search ? `/${locale}/account/bookings?${search}` : `/${locale}/account/bookings`;
}

const statusOptions: Array<{ key: BookingStatusFilter; labelKey: keyof BookingSearchLabels }> = [
  { key: 'all', labelKey: 'statusAll' },
  { key: 'upcoming', labelKey: 'statusUpcoming' },
  { key: 'past', labelKey: 'statusPast' },
  { key: 'cancelled', labelKey: 'statusCancelled' },
];

const paymentOptions: Array<{ key: BookingPaymentFilter; labelKey: keyof BookingSearchLabels }> = [
  { key: 'all', labelKey: 'paymentAll' },
  { key: 'unpaid', labelKey: 'paymentUnpaid' },
  { key: 'partially_paid', labelKey: 'paymentPartiallyPaid' },
  { key: 'paid', labelKey: 'paymentPaid' },
  { key: 'refunded', labelKey: 'paymentRefunded' },
  { key: 'partial-refund', labelKey: 'paymentPartialRefund' },
];

const sortOptions: Array<{ key: BookingSortFilter; labelKey: keyof BookingSearchLabels }> = [
  { key: 'latest', labelKey: 'sortLatest' },
  { key: 'earliest', labelKey: 'sortEarliest' },
];

export function MemberBookingsSearchForm({
  locale,
  query,
  status,
  service,
  staff,
  timezone,
  dateFrom,
  dateTo,
  payment,
  sort,
  serviceOptions,
  staffOptions,
  timezoneOptions,
  labels,
}: MemberBookingsSearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(query);
  const [fromValue, setFromValue] = useState(dateFrom);
  const [toValue, setToValue] = useState(dateTo);

  useEffect(() => {
    setValue(query);
  }, [query]);

  useEffect(() => {
    setFromValue(dateFrom);
  }, [dateFrom]);

  useEffect(() => {
    setToValue(dateTo);
  }, [dateTo]);

  const current = useMemo<SearchState>(() => ({
    query: value,
    status,
    service,
    staff,
    timezone,
    dateFrom: fromValue,
    dateTo: toValue,
    payment,
    sort,
  }), [fromValue, payment, service, sort, staff, status, timezone, toValue, value]);
  const hasActiveFilters = value.trim() !== ''
    || status !== 'all'
    || service.trim() !== ''
    || staff.trim() !== ''
    || timezone.trim() !== ''
    || fromValue.trim() !== ''
    || toValue.trim() !== ''
    || payment !== 'all'
    || sort !== 'latest';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(buildHref(locale, current));
  }

  return (
    <form className={styles.bookingsPanel} data-member-booking-search-form="true" onSubmit={handleSubmit}>
      <label className={styles.searchField}>
        <span>{labels.searchLabel}</span>
        <input
          autoComplete="off"
          data-member-booking-search-input="true"
          name="q"
          placeholder={labels.searchPlaceholder}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
      </label>
      <div className={styles.bookingDateRange} data-member-booking-date-range="true">
        <p className={styles.muted}>{labels.dateRange}</p>
        <div className={styles.bookingDateRangeFields}>
          <label className={styles.searchField}>
            <span>{labels.dateFrom}</span>
            <input
              data-member-booking-date-from="true"
              name="dateFrom"
              type="date"
              value={fromValue}
              onChange={(event) => setFromValue(event.currentTarget.value)}
            />
          </label>
          <label className={styles.searchField}>
            <span>{labels.dateTo}</span>
            <input
              data-member-booking-date-to="true"
              name="dateTo"
              type="date"
              value={toValue}
              onChange={(event) => setToValue(event.currentTarget.value)}
            />
          </label>
        </div>
        <p className={styles.muted}>{labels.dateRangeHint}</p>
      </div>
      <p className={styles.muted}>{labels.searchHint}</p>
      <div className={styles.bookingFilterRow} data-member-booking-status-filters="true">
        {statusOptions.map((option) => {
          const isActive = status === option.key;
          return (
            <Link
              aria-pressed={isActive}
              className={`${styles.accountLink} ${isActive ? styles.bookingFilterActive : styles.bookingFilterInactive}`}
              data-member-booking-status-filter={option.key}
              href={buildHref(locale, current, { status: option.key })}
              key={option.key}
            >
              {labels[option.labelKey]}
            </Link>
          );
        })}
      </div>
      <div className={styles.bookingFilterRow} data-member-booking-service-filters="true">
        <Link
          aria-pressed={service.trim() === ''}
          className={`${styles.accountLink} ${service.trim() === '' ? styles.bookingFilterActive : styles.bookingFilterInactive}`}
          data-member-booking-service-filter="all"
          href={buildHref(locale, current, { service: '' })}
        >
          {labels.serviceAll}
        </Link>
        {serviceOptions.map((option) => {
          const isActive = service === option.key;
          return (
            <Link
              aria-pressed={isActive}
              className={`${styles.accountLink} ${isActive ? styles.bookingFilterActive : styles.bookingFilterInactive}`}
              data-member-booking-service-filter={option.key}
              href={buildHref(locale, current, { service: option.key })}
              key={option.key}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
      <div className={styles.bookingFilterRow} data-member-booking-staff-filters="true">
        <Link
          aria-pressed={staff.trim() === ''}
          className={`${styles.accountLink} ${staff.trim() === '' ? styles.bookingFilterActive : styles.bookingFilterInactive}`}
          data-member-booking-staff-filter="all"
          href={buildHref(locale, current, { staff: '' })}
        >
          {labels.staffAll}
        </Link>
        {staffOptions.map((option) => {
          const isActive = staff === option.key;
          return (
            <Link
              aria-pressed={isActive}
              className={`${styles.accountLink} ${isActive ? styles.bookingFilterActive : styles.bookingFilterInactive}`}
              data-member-booking-staff-filter={option.key}
              href={buildHref(locale, current, { staff: option.key })}
              key={option.key}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
      <div className={styles.bookingFilterRow} data-member-booking-timezone-filters="true">
        <Link
          aria-pressed={timezone.trim() === ''}
          className={`${styles.accountLink} ${timezone.trim() === '' ? styles.bookingFilterActive : styles.bookingFilterInactive}`}
          data-member-booking-timezone-filter="all"
          href={buildHref(locale, current, { timezone: '' })}
        >
          {labels.timezoneAll}
        </Link>
        {timezoneOptions.map((option) => {
          const isActive = timezone === option.key;
          return (
            <Link
              aria-pressed={isActive}
              className={`${styles.accountLink} ${isActive ? styles.bookingFilterActive : styles.bookingFilterInactive}`}
              data-member-booking-timezone-filter={option.key}
              href={buildHref(locale, current, { timezone: option.key })}
              key={option.key}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
      <div className={styles.bookingFilterRow} data-member-booking-payment-filters="true">
        {paymentOptions.map((option) => {
          const isActive = payment === option.key;
          return (
            <Link
              aria-pressed={isActive}
              className={`${styles.accountLink} ${isActive ? styles.bookingFilterActive : styles.bookingFilterInactive}`}
              data-member-booking-payment-filter={option.key}
              href={buildHref(locale, current, { payment: option.key })}
              key={option.key}
            >
              {labels[option.labelKey]}
            </Link>
          );
        })}
      </div>
      <div className={styles.bookingFilterRow} data-member-booking-sort-filters="true">
        {sortOptions.map((option) => {
          const isActive = sort === option.key;
          return (
            <Link
              aria-pressed={isActive}
              className={`${styles.accountLink} ${isActive ? styles.bookingFilterActive : styles.bookingFilterInactive}`}
              data-member-booking-sort-filter={option.key}
              href={buildHref(locale, current, { sort: option.key })}
              key={option.key}
            >
              {labels[option.labelKey]}
            </Link>
          );
        })}
      </div>
      <div className={styles.bookingActions}>
        <button className={styles.accountLink} type="submit">
          {labels.searchLabel}
        </button>
        {query || dateFrom || dateTo ? (
          <Link className={styles.accountLink} href={buildHref(locale, current, { query: '', dateFrom: '', dateTo: '' })}>
            {labels.clearSearch}
          </Link>
        ) : null}
        {hasActiveFilters ? (
          <Link
            className={styles.accountLink}
            data-member-booking-search-reset="true"
            href={buildHref(locale, current, {
              query: '',
              status: 'all',
              service: '',
              staff: '',
              timezone: '',
              dateFrom: '',
              dateTo: '',
              payment: 'all',
              sort: 'latest',
            })}
          >
            {labels.resetFilters}
          </Link>
        ) : null}
      </div>
    </form>
  );
}
