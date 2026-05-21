import type { Booking, BookingService, Staff } from './types';
import { textForLocale } from './types';
import type { Locale } from '@/lib/locales';

export interface BookingBreakdownItem {
  id: string;
  label: string;
  total: number;
  completed: number;
  cancelled: number;
  revenueAmount: number;
}

export interface BookingAnalytics {
  total: number;
  upcoming: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
  revenueAmount: number;
  byService: BookingBreakdownItem[];
  byStaff: BookingBreakdownItem[];
}

export interface CustomerProfile {
  email: string;
  name: string;
  phone?: string;
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;
  lastBookingAt?: string;
  nextBookingAt?: string;
  bookingIds: string[];
}

function roundRate(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function serviceAmount(service?: BookingService): number {
  return Math.max(0, service?.priceAmount ?? service?.priceTwd ?? 0);
}

function manualPaymentTotal(booking: Booking): number {
  return (booking.manualPayments ?? [])
    .filter((payment) => payment.status === 'succeeded')
    .reduce((total, payment) => total + payment.amountCents, 0);
}

function onlinePaymentTotal(booking: Booking): number {
  return Math.max(0, booking.onlinePaidAmount ?? 0);
}

function bookingRevenueAmount(booking: Booking, service?: BookingService): number {
  const amount = serviceAmount(service);
  if (booking.paymentStatus === 'paid') return amount;
  if (booking.paymentStatus === 'partially_paid') return onlinePaymentTotal(booking) + manualPaymentTotal(booking);
  if (booking.paymentStatus === 'partial-refund') return Math.ceil(amount / 2);
  return 0;
}

function sortBreakdown(items: Map<string, BookingBreakdownItem>): BookingBreakdownItem[] {
  return Array.from(items.values()).sort((a, b) => b.total - a.total || a.label.localeCompare(b.label));
}

export function buildBookingAnalytics(
  bookings: Booking[],
  services: BookingService[],
  staff: Staff[],
  locale: Locale,
  nowMs = Date.now(),
): BookingAnalytics {
  const serviceById = new Map(services.map((service) => [service.serviceId, service]));
  const staffById = new Map(staff.map((member) => [member.staffId, member]));
  const byService = new Map<string, BookingBreakdownItem>();
  const byStaff = new Map<string, BookingBreakdownItem>();
  let revenueAmount = 0;

  for (const booking of bookings) {
    const service = serviceById.get(booking.serviceId);
    const member = staffById.get(booking.staffId);
    const amount = bookingRevenueAmount(booking, service);
    revenueAmount += amount;

    const serviceItem = byService.get(booking.serviceId) ?? {
      id: booking.serviceId,
      label: textForLocale(service?.name, locale) || booking.serviceId,
      total: 0,
      completed: 0,
      cancelled: 0,
      revenueAmount: 0,
    };
    serviceItem.total += 1;
    serviceItem.completed += booking.status === 'completed' ? 1 : 0;
    serviceItem.cancelled += booking.status === 'cancelled' ? 1 : 0;
    serviceItem.revenueAmount += amount;
    byService.set(booking.serviceId, serviceItem);

    const staffItem = byStaff.get(booking.staffId) ?? {
      id: booking.staffId,
      label: textForLocale(member?.name, locale) || booking.staffId,
      total: 0,
      completed: 0,
      cancelled: 0,
      revenueAmount: 0,
    };
    staffItem.total += 1;
    staffItem.completed += booking.status === 'completed' ? 1 : 0;
    staffItem.cancelled += booking.status === 'cancelled' ? 1 : 0;
    staffItem.revenueAmount += amount;
    byStaff.set(booking.staffId, staffItem);
  }

  const total = bookings.length;
  const completed = bookings.filter((booking) => booking.status === 'completed').length;
  const cancelled = bookings.filter((booking) => booking.status === 'cancelled').length;
  const noShow = bookings.filter((booking) => booking.status === 'no-show').length;

  return {
    total,
    upcoming: bookings.filter((booking) => booking.status !== 'cancelled' && Date.parse(booking.startAt) >= nowMs).length,
    pending: bookings.filter((booking) => booking.status === 'pending').length,
    confirmed: bookings.filter((booking) => booking.status === 'confirmed').length,
    completed,
    cancelled,
    noShow,
    completionRate: roundRate(completed, total),
    cancellationRate: roundRate(cancelled, total),
    noShowRate: roundRate(noShow, total),
    revenueAmount,
    byService: sortBreakdown(byService),
    byStaff: sortBreakdown(byStaff),
  };
}

export function buildCustomerProfiles(bookings: Booking[], nowMs = Date.now()): CustomerProfile[] {
  const profiles = new Map<string, CustomerProfile>();

  for (const booking of bookings) {
    const email = booking.customer.email.trim().toLowerCase();
    if (!email) continue;
    const startMs = Date.parse(booking.startAt);
    const existing = profiles.get(email) ?? {
      email,
      name: booking.customer.name,
      phone: booking.customer.phone,
      totalBookings: 0,
      upcomingBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      noShowBookings: 0,
      bookingIds: [],
    };

    existing.name = booking.customer.name || existing.name;
    existing.phone = booking.customer.phone || existing.phone;
    existing.totalBookings += 1;
    existing.upcomingBookings += booking.status !== 'cancelled' && startMs >= nowMs ? 1 : 0;
    existing.completedBookings += booking.status === 'completed' ? 1 : 0;
    existing.cancelledBookings += booking.status === 'cancelled' ? 1 : 0;
    existing.noShowBookings += booking.status === 'no-show' ? 1 : 0;
    existing.bookingIds.push(booking.bookingId);

    if (!existing.lastBookingAt || booking.startAt > existing.lastBookingAt) {
      existing.lastBookingAt = booking.startAt;
    }
    if (startMs >= nowMs && (!existing.nextBookingAt || booking.startAt < existing.nextBookingAt)) {
      existing.nextBookingAt = booking.startAt;
    }

    profiles.set(email, existing);
  }

  return Array.from(profiles.values()).sort((a, b) => {
    const lastA = a.lastBookingAt ?? '';
    const lastB = b.lastBookingAt ?? '';
    return lastB.localeCompare(lastA) || a.email.localeCompare(b.email);
  });
}

// ---------------------------------------------------------------------------
// F84 — Booking funnel & utilization analytics.
//
// Pure functions that derive richer metrics from the same `Booking[]` set.
// Used by the admin analytics dashboard and the `GET /api/builder/bookings/
// analytics` route to surface conversion, utilization, and heatmap views.
// ---------------------------------------------------------------------------

export interface BookingFunnelMetrics {
  /** Bookings created (any status) that fall in the window. */
  leads: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  /** Percentage of leads that reached confirmed/completed status. 0..100. */
  leadToConfirmRate: number;
  /** Percentage of leads that successfully reached completed status. */
  leadToCompletionRate: number;
  /** Percentage of confirmed bookings that turned into no-shows. */
  noShowRate: number;
  /** Percentage of confirmed bookings that were cancelled afterwards. */
  cancellationRate: number;
}

export interface ServiceUtilization {
  serviceId: string;
  label: string;
  total: number;
  completed: number;
  /** Total minutes booked across non-cancelled bookings. */
  bookedMinutes: number;
  /** Completion-divided-by-total as percentage. */
  completionRate: number;
}

export interface StaffUtilization {
  staffId: string;
  label: string;
  total: number;
  completed: number;
  bookedMinutes: number;
  /**
   * Booked minutes divided by `capacityMinutes` when provided, expressed as
   * percentage. When no capacity is available, returns 0.
   */
  utilizationPercent: number;
}

export interface PeakHourCell {
  /** 0..6 — Sunday..Saturday in JS Date convention. */
  dayOfWeek: number;
  /** 0..23. */
  hour: number;
  count: number;
}

export interface PeakHourHeatmap {
  cells: PeakHourCell[];
  /** Peak count across all cells. */
  maxCount: number;
}

export interface BookingFunnelOptions {
  /** Inclusive window start (ISO). */
  from?: string;
  /** Exclusive window end (ISO). */
  to?: string;
  /** Filter by service id. */
  serviceId?: string;
  /** Filter by staff id. */
  staffId?: string;
}

function bookingDurationMinutes(booking: Booking): number {
  const start = Date.parse(booking.startAt);
  const end = Date.parse(booking.endAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.round((end - start) / 60_000);
}

function withinWindow(booking: Booking, from?: string, to?: string): boolean {
  if (from && booking.startAt < from) return false;
  if (to && booking.startAt >= to) return false;
  return true;
}

function applyFilters(bookings: Booking[], options: BookingFunnelOptions): Booking[] {
  return bookings
    .filter((booking) => withinWindow(booking, options.from, options.to))
    .filter((booking) => !options.serviceId || booking.serviceId === options.serviceId)
    .filter((booking) => !options.staffId || booking.staffId === options.staffId);
}

/**
 * Compute the booking funnel (lead -> confirm -> complete -> no-show).
 *
 * Leads = every booking in window (any status). A `confirmed` booking
 * counts as "reaching confirmed" once it has progressed past `pending`;
 * a `completed` booking counts as both confirmed and completed since
 * completion implies prior confirmation.
 */
export function buildBookingFunnelMetrics(
  bookings: Booking[],
  options: BookingFunnelOptions = {},
): BookingFunnelMetrics {
  const filtered = applyFilters(bookings, options);
  const leads = filtered.length;
  const confirmed = filtered.filter((booking) => (
    booking.status === 'confirmed'
      || booking.status === 'completed'
      || booking.status === 'no-show'
  )).length;
  const completed = filtered.filter((booking) => booking.status === 'completed').length;
  const cancelled = filtered.filter((booking) => booking.status === 'cancelled').length;
  const noShow = filtered.filter((booking) => booking.status === 'no-show').length;

  return {
    leads,
    confirmed,
    completed,
    cancelled,
    noShow,
    leadToConfirmRate: roundRate(confirmed, leads),
    leadToCompletionRate: roundRate(completed, leads),
    noShowRate: roundRate(noShow, confirmed),
    cancellationRate: roundRate(cancelled, leads),
  };
}

/**
 * Per-service utilization. Booked minutes ignores cancelled bookings —
 * we treat cancellations as freed time rather than utilization.
 */
export function buildServiceUtilization(
  bookings: Booking[],
  services: BookingService[],
  locale: Locale,
  options: BookingFunnelOptions = {},
): ServiceUtilization[] {
  const filtered = applyFilters(bookings, options);
  const serviceById = new Map(services.map((service) => [service.serviceId, service]));
  const map = new Map<string, ServiceUtilization>();

  for (const booking of filtered) {
    const service = serviceById.get(booking.serviceId);
    const entry = map.get(booking.serviceId) ?? {
      serviceId: booking.serviceId,
      label: textForLocale(service?.name, locale) || booking.serviceId,
      total: 0,
      completed: 0,
      bookedMinutes: 0,
      completionRate: 0,
    };
    entry.total += 1;
    if (booking.status === 'completed') entry.completed += 1;
    if (booking.status !== 'cancelled') entry.bookedMinutes += bookingDurationMinutes(booking);
    map.set(booking.serviceId, entry);
  }

  for (const entry of map.values()) {
    entry.completionRate = roundRate(entry.completed, entry.total);
  }

  return Array.from(map.values()).sort((a, b) => (
    b.bookedMinutes - a.bookedMinutes || a.label.localeCompare(b.label)
  ));
}

/**
 * Per-staff utilization. Pass `capacityMinutesByStaff` to compute a real
 * percentage (e.g. weekly availability × window length). When omitted,
 * `utilizationPercent` is 0 — callers should treat that as "unknown".
 */
export function buildStaffUtilization(
  bookings: Booking[],
  staff: Staff[],
  locale: Locale,
  options: BookingFunnelOptions & { capacityMinutesByStaff?: Record<string, number> } = {},
): StaffUtilization[] {
  const filtered = applyFilters(bookings, options);
  const staffById = new Map(staff.map((member) => [member.staffId, member]));
  const map = new Map<string, StaffUtilization>();

  for (const booking of filtered) {
    const member = staffById.get(booking.staffId);
    const entry = map.get(booking.staffId) ?? {
      staffId: booking.staffId,
      label: textForLocale(member?.name, locale) || booking.staffId,
      total: 0,
      completed: 0,
      bookedMinutes: 0,
      utilizationPercent: 0,
    };
    entry.total += 1;
    if (booking.status === 'completed') entry.completed += 1;
    if (booking.status !== 'cancelled') entry.bookedMinutes += bookingDurationMinutes(booking);
    map.set(booking.staffId, entry);
  }

  for (const entry of map.values()) {
    const capacity = options.capacityMinutesByStaff?.[entry.staffId] ?? 0;
    entry.utilizationPercent = roundRate(entry.bookedMinutes, capacity);
  }

  return Array.from(map.values()).sort((a, b) => (
    b.bookedMinutes - a.bookedMinutes || a.label.localeCompare(b.label)
  ));
}

/**
 * Day-of-week × hour-of-day heatmap of booking starts. Cancelled bookings
 * are excluded so the heatmap reflects actual demand, not abandoned drafts.
 */
export function buildPeakHourHeatmap(
  bookings: Booking[],
  options: BookingFunnelOptions = {},
): PeakHourHeatmap {
  const filtered = applyFilters(bookings, options).filter((booking) => booking.status !== 'cancelled');
  const grid: number[][] = Array.from({ length: 7 }, () => new Array<number>(24).fill(0));

  for (const booking of filtered) {
    const startMs = Date.parse(booking.startAt);
    if (!Number.isFinite(startMs)) continue;
    const date = new Date(startMs);
    const day = date.getUTCDay();
    const hour = date.getUTCHours();
    grid[day][hour] += 1;
  }

  const cells: PeakHourCell[] = [];
  let maxCount = 0;
  for (let day = 0; day < 7; day += 1) {
    for (let hour = 0; hour < 24; hour += 1) {
      const count = grid[day][hour];
      if (count === 0) continue;
      cells.push({ dayOfWeek: day, hour, count });
      if (count > maxCount) maxCount = count;
    }
  }

  return { cells, maxCount };
}

export interface BookingAnalyticsBundle {
  funnel: BookingFunnelMetrics;
  serviceUtilization: ServiceUtilization[];
  staffUtilization: StaffUtilization[];
  peakHours: PeakHourHeatmap;
}

/**
 * Convenience wrapper that builds every funnel-style metric in a single call.
 * Used by the admin route — keeps the route file tiny.
 */
export function buildBookingAnalyticsBundle(
  bookings: Booking[],
  services: BookingService[],
  staff: Staff[],
  locale: Locale,
  options: BookingFunnelOptions & { capacityMinutesByStaff?: Record<string, number> } = {},
): BookingAnalyticsBundle {
  return {
    funnel: buildBookingFunnelMetrics(bookings, options),
    serviceUtilization: buildServiceUtilization(bookings, services, locale, options),
    staffUtilization: buildStaffUtilization(bookings, staff, locale, options),
    peakHours: buildPeakHourHeatmap(bookings, options),
  };
}