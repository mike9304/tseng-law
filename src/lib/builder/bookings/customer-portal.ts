import { listBookings, listServices, listStaff } from '@/lib/builder/bookings/storage';
import { createBookingManageToken } from '@/lib/builder/bookings/manage-token';
import { textForLocale, type BookingPaymentStatus, type BookingStatus } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';

export interface CustomerPortalBooking {
  bookingId: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  paymentStatus?: BookingPaymentStatus;
  meetingLink?: string;
  customerTimezone?: string;
  managePath?: string;
  calendarPath?: string;
}

export interface CustomerBookingPortal {
  email: string;
  upcoming: CustomerPortalBooking[];
  past: CustomerPortalBooking[];
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeEmails(emails: string[]): string[] {
  return [...new Set(emails.map((email) => normalizeEmail(email)).filter(Boolean))];
}

function isUpcoming(status: BookingStatus, startAt: string, nowIso: string): boolean {
  return status !== 'cancelled' && startAt >= nowIso;
}

export async function getCustomerBookingPortal(
  customerEmail: string,
  locale: Locale,
  nowIso = new Date().toISOString(),
  matchingEmails: string[] = [],
): Promise<CustomerBookingPortal> {
  const email = normalizeEmail(customerEmail);
  const targetEmails = normalizeEmails([customerEmail, ...matchingEmails]);
  const [bookings, services, staff] = await Promise.all([
    listBookings({ includeCancelled: true }),
    listServices(true),
    listStaff(true),
  ]);

  const serviceById = new Map(services.map((service) => [service.serviceId, service]));
  const staffById = new Map(staff.map((member) => [member.staffId, member]));
  const rows = bookings
    .filter((booking) => targetEmails.includes(normalizeEmail(booking.customer.email)))
    .map((booking): CustomerPortalBooking => {
      const service = serviceById.get(booking.serviceId);
      const staffMember = staffById.get(booking.staffId);
      const upcoming = isUpcoming(booking.status, booking.startAt, nowIso);
      return {
        bookingId: booking.bookingId,
        serviceId: booking.serviceId,
        serviceName: textForLocale(service?.name, locale) || booking.serviceId,
        staffId: booking.staffId,
        staffName: textForLocale(staffMember?.name, locale) || booking.staffId,
        startAt: booking.startAt,
        endAt: booking.endAt,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        meetingLink: booking.meetingLink,
        customerTimezone: booking.customerTimezone,
        managePath: upcoming ? `/${locale}/bookings/manage/${encodeURIComponent(createBookingManageToken(booking))}` : undefined,
        calendarPath: upcoming ? `/${locale}/account/bookings/${encodeURIComponent(booking.bookingId)}/calendar` : undefined,
      };
    });

  return {
    email,
    upcoming: rows
      .filter((booking) => isUpcoming(booking.status, booking.startAt, nowIso))
      .sort((a, b) => a.startAt.localeCompare(b.startAt)),
    past: rows
      .filter((booking) => !isUpcoming(booking.status, booking.startAt, nowIso))
      .sort((a, b) => b.startAt.localeCompare(a.startAt)),
  };
}
