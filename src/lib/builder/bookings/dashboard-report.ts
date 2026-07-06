import type { Locale } from '@/lib/locales';
import {
  buildBookingAnalytics,
  buildBookingAnalyticsBundle,
  buildBookingSourceBreakdown,
  buildBookingSourceFunnelBreakdown,
  buildCustomerProfiles,
} from './analytics';
import { buildBookingPaymentAttribution } from './analytics-attribution';
import type {
  Booking,
  BookingService,
  BookingStatus,
  BookingWaitlistEntry,
  Staff,
} from './types';
import { textForLocale } from './types';
import type { BookingDashboardActionFilter } from './dashboard-url';

export interface BookingDashboardReportFilters {
  actionFilter: BookingDashboardActionFilter;
  query: string;
  statusFilter: '' | BookingStatus;
  staffFilter: string;
  serviceFilter: string;
  fromDate: string;
  toDate: string;
}

export interface BookingDashboardReportBooking {
  bookingId: string;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  customer: {
    name: string;
    email: string;
    phone: string;
    locale: Locale;
  };
  service: {
    serviceId: string;
    label: string;
  };
  staff: {
    staffId: string;
    label: string;
  };
  paymentStatus: string;
  documentCount: number;
}

export interface BookingDashboardReportWaitlistEntry {
  waitlistId: string;
  requestedDate: string;
  status: BookingWaitlistEntry['status'];
  customer: BookingDashboardReportBooking['customer'];
  service: BookingDashboardReportBooking['service'];
  staff: BookingDashboardReportBooking['staff'];
}

export interface BookingDashboardReportFile {
  generatedAt: string;
  locale: Locale;
  filters: BookingDashboardReportFilters;
  summary: {
    totalBookings: number;
    upcomingBookings: number;
    pendingBookings: number;
    waitlistEntries: number;
    customerProfiles: number;
    sourceBreakdown: ReturnType<typeof buildBookingSourceBreakdown>;
    sourceFunnel: ReturnType<typeof buildBookingSourceFunnelBreakdown>;
    paymentAttribution: ReturnType<typeof buildBookingPaymentAttribution>;
    overview: ReturnType<typeof buildBookingAnalytics>;
    utilization: ReturnType<typeof buildBookingAnalyticsBundle>;
  };
  visibleBookings: BookingDashboardReportBooking[];
  actionQueue: {
    actionFilter: BookingDashboardActionFilter;
    bookings: BookingDashboardReportBooking[];
    waitlist: BookingDashboardReportWaitlistEntry[];
  };
  customerProfiles: ReturnType<typeof buildCustomerProfiles>;
}

function bookingPaymentStatusLabel(booking: Booking, service?: BookingService): string {
  if (booking.paymentStatus) return booking.paymentStatus;
  if (service?.paymentMode === 'paid') return 'unpaid';
  return 'free';
}

function summarizeBooking(
  booking: Booking,
  serviceById: Map<string, BookingService>,
  staffById: Map<string, Staff>,
  locale: Locale,
): BookingDashboardReportBooking {
  const service = serviceById.get(booking.serviceId);
  const member = staffById.get(booking.staffId);
  return {
    bookingId: booking.bookingId,
    startAt: booking.startAt,
    endAt: booking.endAt,
    status: booking.status,
    customer: {
      name: booking.customer.name,
      email: booking.customer.email,
      phone: booking.customer.phone ?? '',
      locale: booking.customer.locale,
    },
    service: {
      serviceId: booking.serviceId,
      label: textForLocale(service?.name, locale) || booking.serviceId,
    },
    staff: {
      staffId: booking.staffId,
      label: textForLocale(member?.name, locale) || booking.staffId,
    },
    paymentStatus: bookingPaymentStatusLabel(booking, service),
    documentCount: booking.billingDocuments?.length ?? 0,
  };
}

function summarizeWaitlistEntry(
  entry: BookingWaitlistEntry,
  serviceById: Map<string, BookingService>,
  staffById: Map<string, Staff>,
  locale: Locale,
): BookingDashboardReportWaitlistEntry {
  const service = serviceById.get(entry.serviceId);
  const member = staffById.get(entry.staffId);
  return {
    waitlistId: entry.waitlistId,
    requestedDate: entry.requestedDate,
    status: entry.status,
    customer: {
      name: entry.customer.name,
      email: entry.customer.email,
      phone: entry.customer.phone ?? '',
      locale: entry.customer.locale,
    },
    service: {
      serviceId: entry.serviceId,
      label: textForLocale(service?.name, locale) || entry.serviceId,
    },
    staff: {
      staffId: entry.staffId,
      label: textForLocale(member?.name, locale) || entry.staffId,
    },
  };
}

export function buildBookingDashboardReportFile(options: {
  actionFilter: BookingDashboardActionFilter;
  bookings: Booking[];
  filters: Omit<BookingDashboardReportFilters, 'actionFilter'>;
  locale: Locale;
  services: BookingService[];
  staff: Staff[];
  visibleBookings: Booking[];
  actionQueueBookings: Booking[];
  actionQueueWaitlist: BookingWaitlistEntry[];
}): BookingDashboardReportFile {
  const serviceById = new Map(options.services.map((service) => [service.serviceId, service]));
  const staffById = new Map(options.staff.map((member) => [member.staffId, member]));
  const summaryBookings = options.visibleBookings;
  const customerProfiles = buildCustomerProfiles(summaryBookings);
  const generatedAt = new Date().toISOString();

  return {
    generatedAt,
    locale: options.locale,
    filters: {
      actionFilter: options.actionFilter,
      ...options.filters,
    },
    summary: {
      totalBookings: summaryBookings.length,
      upcomingBookings: summaryBookings.filter((booking) => booking.status !== 'cancelled' && Date.parse(booking.startAt) >= Date.parse(generatedAt)).length,
      pendingBookings: summaryBookings.filter((booking) => booking.status === 'pending').length,
      waitlistEntries: options.actionQueueWaitlist.length,
      customerProfiles: customerProfiles.length,
      sourceBreakdown: buildBookingSourceBreakdown(summaryBookings, options.services),
      sourceFunnel: buildBookingSourceFunnelBreakdown(summaryBookings),
      paymentAttribution: buildBookingPaymentAttribution(summaryBookings, options.services, options.locale),
      overview: buildBookingAnalytics(summaryBookings, options.services, options.staff, options.locale),
      utilization: buildBookingAnalyticsBundle(summaryBookings, options.services, options.staff, options.locale),
    },
    visibleBookings: options.visibleBookings.map((booking) => summarizeBooking(booking, serviceById, staffById, options.locale)),
    actionQueue: {
      actionFilter: options.actionFilter,
      bookings: options.actionQueueBookings.map((booking) => summarizeBooking(booking, serviceById, staffById, options.locale)),
      waitlist: options.actionQueueWaitlist.map((entry) => summarizeWaitlistEntry(entry, serviceById, staffById, options.locale)),
    },
    customerProfiles,
  };
}

export function serializeBookingDashboardReportFile(file: BookingDashboardReportFile): string {
  return JSON.stringify(file, null, 2);
}

export function buildBookingDashboardReportFilename(): string {
  return 'bookings-dashboard-report.json';
}

function csvEscape(value: unknown): string {
  const text = value == null ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function serializeBookingDashboardVisibleBookingsCsv(file: BookingDashboardReportFile): string {
  const header = [
    'bookingId',
    'startAt',
    'endAt',
    'status',
    'customerName',
    'customerEmail',
    'customerPhone',
    'customerLocale',
    'serviceId',
    'serviceLabel',
    'staffId',
    'staffLabel',
    'paymentStatus',
    'documentCount',
  ];
  const lines = [
    header.join(','),
    ...file.visibleBookings.map((booking) => [
      booking.bookingId,
      booking.startAt,
      booking.endAt,
      booking.status,
      booking.customer.name,
      booking.customer.email,
      booking.customer.phone,
      booking.customer.locale,
      booking.service.serviceId,
      booking.service.label,
      booking.staff.staffId,
      booking.staff.label,
      booking.paymentStatus,
      booking.documentCount,
    ].map(csvEscape).join(',')),
  ];
  return `${lines.join('\r\n')}\r\n`;
}

export function buildBookingDashboardVisibleBookingsCsvFilename(): string {
  return 'bookings-dashboard-visible-bookings.csv';
}
