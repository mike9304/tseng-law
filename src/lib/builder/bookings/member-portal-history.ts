import type { CustomerPortalBooking } from './customer-portal';
import { dateInTimezone } from './timezone';

export type BookingHistoryStatusFilter = 'all' | 'upcoming' | 'past' | 'cancelled';
export type BookingHistoryServiceFilter = string;
export type BookingHistoryStaffFilter = string;
export type BookingHistoryTimezoneFilter = string;
export type BookingHistoryDateFilter = string;
export type BookingHistoryPaymentFilter = 'all' | 'unpaid' | 'partially_paid' | 'paid' | 'refunded' | 'partial-refund';
export type BookingHistorySortFilter = 'latest' | 'earliest';

export interface MemberBookingsHistoryFilters {
  q: string;
  status: BookingHistoryStatusFilter;
  service: BookingHistoryServiceFilter;
  staff: BookingHistoryStaffFilter;
  timezone: BookingHistoryTimezoneFilter;
  dateFrom: BookingHistoryDateFilter;
  dateTo: BookingHistoryDateFilter;
  payment: BookingHistoryPaymentFilter;
  sort: BookingHistorySortFilter;
}

export interface MemberBookingsCsvRow {
  bookingId: string;
  serviceName: string;
  staffName: string;
  startAt: string;
  endAt: string;
  status: string;
  paymentStatus: string;
  customerTimezone: string;
  detailPath: string;
  managePath: string;
}

function normalizeQuery(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? '';
}

export function normalizeBookingHistoryService(value: string | undefined): BookingHistoryServiceFilter {
  return value?.trim() ?? '';
}

export function normalizeBookingHistoryStaff(value: string | undefined): BookingHistoryStaffFilter {
  return value?.trim() ?? '';
}

export function normalizeBookingHistoryTimezone(value: string | undefined): BookingHistoryTimezoneFilter {
  return value?.trim() ?? '';
}

export function normalizeBookingHistoryDate(value: string | undefined): BookingHistoryDateFilter {
  return value?.trim() ?? '';
}

export function normalizeBookingHistoryStatus(value: string | undefined): BookingHistoryStatusFilter {
  if (value === 'upcoming' || value === 'past' || value === 'cancelled') return value;
  return 'all';
}

export function normalizeBookingHistoryPayment(value: string | undefined): BookingHistoryPaymentFilter {
  if (
    value === 'unpaid'
    || value === 'partially_paid'
    || value === 'paid'
    || value === 'refunded'
    || value === 'partial-refund'
  ) return value;
  return 'all';
}

export function normalizeBookingHistorySort(value: string | undefined): BookingHistorySortFilter {
  if (value === 'earliest') return 'earliest';
  return 'latest';
}

export function bookingHistoryMatchesQuery(booking: CustomerPortalBooking, query: string): boolean {
  if (!query) return true;
  const haystack = [
    booking.bookingId,
    booking.serviceName,
    booking.staffName,
    booking.status,
    booking.staffId,
    booking.customerTimezone ?? '',
    booking.paymentStatus ?? '',
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

export function bookingHistoryMatchesStatus(booking: CustomerPortalBooking, status: BookingHistoryStatusFilter, nowIso: string): boolean {
  if (status === 'all') return true;
  if (status === 'upcoming') return booking.status !== 'cancelled' && booking.startAt >= nowIso;
  if (status === 'past') return booking.status !== 'cancelled' && booking.startAt < nowIso;
  return booking.status === 'cancelled';
}

export function bookingHistoryMatchesPayment(booking: CustomerPortalBooking, payment: BookingHistoryPaymentFilter): boolean {
  if (payment === 'all') return true;
  return (booking.paymentStatus ?? 'unpaid') === payment;
}

function bookingDateInCustomerTimezone(booking: CustomerPortalBooking): string {
  return dateInTimezone(booking.startAt, booking.customerTimezone ?? 'Asia/Taipei');
}

function bookingHistoryMatchesDateRange(booking: CustomerPortalBooking, dateFrom: string, dateTo: string): boolean {
  const bookingDate = bookingDateInCustomerTimezone(booking);
  if (dateFrom && bookingDate < dateFrom) return false;
  if (dateTo && bookingDate > dateTo) return false;
  return true;
}

export function filterMemberBookingsHistory(
  bookings: CustomerPortalBooking[],
  filters: MemberBookingsHistoryFilters,
  nowIso: string,
): CustomerPortalBooking[] {
  return bookings.filter((booking) => bookingHistoryMatchesQuery(booking, filters.q)
    && bookingHistoryMatchesStatus(booking, filters.status, nowIso)
    && (filters.service ? booking.serviceId === filters.service : true)
    && (filters.staff ? booking.staffId === filters.staff : true)
    && (filters.timezone ? booking.customerTimezone === filters.timezone : true)
    && bookingHistoryMatchesDateRange(booking, filters.dateFrom, filters.dateTo)
    && bookingHistoryMatchesPayment(booking, filters.payment));
}

export function sortMemberBookingsHistory(
  bookings: CustomerPortalBooking[],
  sort: BookingHistorySortFilter,
): CustomerPortalBooking[] {
  return [...bookings].sort((left, right) => {
    const comparison = left.startAt.localeCompare(right.startAt);
    return sort === 'latest' ? -comparison : comparison;
  });
}

function csvEscape(value: unknown): string {
  const text = value == null ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function serializeMemberBookingsHistoryCsv(bookings: CustomerPortalBooking[], locale: string): string {
  const header = [
    'bookingId',
    'serviceName',
    'staffName',
    'startAt',
    'endAt',
    'status',
    'paymentStatus',
    'customerTimezone',
    'detailPath',
    'managePath',
  ];
  const rows = bookings.map((booking) => [
    booking.bookingId,
    booking.serviceName,
    booking.staffName,
    booking.startAt,
    booking.endAt,
    booking.status,
    booking.paymentStatus ?? '',
    booking.customerTimezone ?? '',
    `/${locale}/account/bookings/${booking.bookingId}`,
    booking.managePath ?? '',
  ].map(csvEscape).join(','));
  return `${[header.join(','), ...rows].join('\r\n')}\r\n`;
}

export function buildMemberBookingsHistoryCsvFilename() {
  return 'member-bookings-history.csv';
}

export function normalizeMemberBookingsHistorySearchParams(searchParams?: {
  q?: string;
  status?: string;
  service?: string;
  staff?: string;
  timezone?: string;
  dateFrom?: string;
  dateTo?: string;
  payment?: string;
  sort?: string;
}): MemberBookingsHistoryFilters {
  return {
    q: normalizeQuery(searchParams?.q),
    status: normalizeBookingHistoryStatus(searchParams?.status),
    service: normalizeBookingHistoryService(searchParams?.service),
    staff: normalizeBookingHistoryStaff(searchParams?.staff),
    timezone: normalizeBookingHistoryTimezone(searchParams?.timezone),
    dateFrom: normalizeBookingHistoryDate(searchParams?.dateFrom),
    dateTo: normalizeBookingHistoryDate(searchParams?.dateTo),
    payment: normalizeBookingHistoryPayment(searchParams?.payment),
    sort: normalizeBookingHistorySort(searchParams?.sort),
  };
}
