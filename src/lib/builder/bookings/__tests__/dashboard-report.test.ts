import { describe, expect, it } from 'vitest';
import {
  buildBookingDashboardReportFile,
  buildBookingDashboardReportFilename,
  buildBookingDashboardVisibleBookingsCsvFilename,
  serializeBookingDashboardReportFile,
  serializeBookingDashboardVisibleBookingsCsv,
} from '@/lib/builder/bookings/dashboard-report';
import type { Booking, BookingService, BookingWaitlistEntry, Staff } from '@/lib/builder/bookings/types';

const services: BookingService[] = [
  {
    serviceId: 'svc-report',
    slug: 'svc-report',
    name: { ko: '보고서 상담', 'zh-hant': '報告諮詢', en: 'Report Consultation' },
    description: { ko: '', 'zh-hant': '', en: '' },
    durationMinutes: 30,
    priceTwd: 5000,
    category: 'consultation',
    staffIds: ['staff-report'],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  },
];

const staff: Staff[] = [
  {
    staffId: 'staff-report',
    name: { ko: '보고서 담당', 'zh-hant': '報告負責人', en: 'Report Attorney' },
    title: { ko: '', 'zh-hant': '', en: '' },
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  },
];

function booking(partial: Partial<Booking> = {}): Booking {
  const base: Booking = {
    bookingId: 'booking-report-1',
    serviceId: 'svc-report',
    staffId: 'staff-report',
    customer: {
      name: 'Report Client',
      email: 'report@example.com',
      phone: '+82105550000',
      locale: 'ko',
    },
    startAt: '2026-05-30T09:00:00.000Z',
    endAt: '2026-05-30T09:30:00.000Z',
    status: 'pending',
    source: 'web',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    reminders: [],
    paymentStatus: 'paid',
    paymentIntentId: 'pi_report_paid',
    paymentAmount: 5000,
    paymentCurrency: 'TWD',
    onlinePaidAmount: 5000,
    billingDocuments: [{
      documentId: 'doc-1',
      type: 'invoice',
      number: 'INV-001',
      status: 'issued',
      currency: 'TWD',
      amount: 5000,
      refundedAmount: 0,
      balanceDue: 5000,
      recipientEmail: 'report@example.com',
      recipientName: 'Report Client',
      actor: 'admin',
      issuedAt: '2026-05-01T00:00:00.000Z',
    }],
  };
  return {
    ...base,
    ...partial,
    customer: {
      ...base.customer,
      ...(partial.customer ?? {}),
    },
  };
}

function waitlist(): BookingWaitlistEntry {
  return {
    waitlistId: 'waitlist-report-1',
    serviceId: 'svc-report',
    staffId: 'staff-report',
    requestedDate: '2026-05-30',
    customer: {
      name: 'Waitlist Client',
      email: 'waitlist@example.com',
      phone: '',
      locale: 'ko',
    },
    status: 'active',
    source: 'web',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  };
}

describe('booking dashboard report export', () => {
  it('captures the current dashboard filters, utilization, and queue rows', () => {
    const report = buildBookingDashboardReportFile({
      actionFilter: 'pending',
      bookings: [booking()],
      filters: {
        query: 'report',
        statusFilter: 'pending',
        staffFilter: 'staff-report',
        serviceFilter: 'svc-report',
        fromDate: '2026-05-01',
        toDate: '2026-06-01',
      },
      locale: 'ko',
      services,
      staff,
      visibleBookings: [booking()],
      actionQueueBookings: [booking()],
      actionQueueWaitlist: [waitlist()],
    });

    expect(report.summary.totalBookings).toBe(1);
    expect(report.summary.pendingBookings).toBe(1);
    expect(report.summary.waitlistEntries).toBe(1);
    expect(report.summary.sourceBreakdown).toHaveLength(1);
    expect(report.summary.sourceBreakdown[0].source).toBe('web');
    expect(report.summary.sourceFunnel).toHaveLength(1);
    expect(report.summary.sourceFunnel[0].source).toBe('web');
    expect(report.summary.paymentAttribution[0]).toMatchObject({
      provider: 'stripe',
      total: 1,
      paidBookings: 1,
      revenueAmount: 5000,
    });
    expect(report.summary.utilization.serviceUtilization[0].bookedMinutes).toBe(30);
    expect(report.visibleBookings[0].customer.email).toBe('report@example.com');
    expect(report.actionQueue.waitlist[0].waitlistId).toBe('waitlist-report-1');
    expect(serializeBookingDashboardReportFile(report)).toContain('"actionFilter": "pending"');
    expect(serializeBookingDashboardVisibleBookingsCsv(report)).toContain('bookingId,startAt,endAt,status,customerName,customerEmail');
    expect(serializeBookingDashboardVisibleBookingsCsv(report)).toContain('booking-report-1');
    expect(buildBookingDashboardVisibleBookingsCsvFilename()).toBe('bookings-dashboard-visible-bookings.csv');
    expect(buildBookingDashboardReportFilename()).toBe('bookings-dashboard-report.json');
  });

  it('scopes summary analytics to the visible dashboard bookings', () => {
    const visible = booking();
    const hidden = booking({
      bookingId: 'booking-report-hidden',
      customer: {
        name: 'Hidden Client',
        email: 'hidden@example.com',
        phone: '',
        locale: 'ko',
      },
      source: 'admin',
      paymentStatus: 'unpaid',
      paymentIntentId: undefined,
      onlinePaidAmount: 0,
      billingDocuments: [],
    });

    const report = buildBookingDashboardReportFile({
      actionFilter: 'pending',
      bookings: [visible, hidden],
      filters: {
        query: 'report',
        statusFilter: 'pending',
        staffFilter: 'staff-report',
        serviceFilter: 'svc-report',
        fromDate: '2026-05-01',
        toDate: '2026-06-01',
      },
      locale: 'ko',
      services,
      staff,
      visibleBookings: [visible],
      actionQueueBookings: [visible, hidden],
      actionQueueWaitlist: [],
    });

    expect(report.summary.totalBookings).toBe(1);
    expect(report.summary.sourceBreakdown.map((item) => item.source)).toEqual(['web']);
    expect(report.summary.paymentAttribution.map((item) => item.provider)).toEqual(['stripe']);
    expect(report.summary.customerProfiles).toBe(1);
    expect(report.customerProfiles.map((profile) => profile.email)).toEqual(['report@example.com']);
    expect(report.actionQueue.bookings.map((item) => item.bookingId)).toEqual(['booking-report-1', 'booking-report-hidden']);
  });
});
