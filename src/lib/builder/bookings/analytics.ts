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

function bookingRevenueAmount(booking: Booking, service?: BookingService): number {
  const amount = serviceAmount(service);
  if (booking.paymentStatus === 'paid') return amount;
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
