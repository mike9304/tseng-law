import { describe, expect, it } from 'vitest';
import {
  defaultBookingEmailTemplate,
  renderBookingEmailTemplate,
} from '@/lib/builder/bookings/email-templates';
import type { Booking, BookingService, Staff } from '@/lib/builder/bookings/types';

function booking(overrides: Partial<Booking> = {}): Booking {
  return {
    bookingId: 'bk-email-test',
    serviceId: 'svc-test',
    staffId: 'staff-test',
    customer: {
      name: 'Kim <script>',
      email: 'kim@example.com',
      phone: '+82-10-0000-0000',
      notes: 'Needs Korean consultation',
      caseSummary: 'Company setup <urgent>',
      attachmentUrls: ['https://example.com/doc.pdf'],
      customFields: [{ label: 'Budget', value: 'TWD 30,000' }],
      locale: 'ko',
    },
    startAt: '2026-05-18T05:00:00.000Z',
    endAt: '2026-05-18T05:30:00.000Z',
    status: 'confirmed',
    source: 'web',
    createdAt: '2026-05-12T00:00:00.000Z',
    updatedAt: '2026-05-12T00:00:00.000Z',
    reminders: [],
    meetingLink: 'https://meet.example.com/abc',
    customerTimezone: 'Asia/Seoul',
    ...overrides,
  };
}

const service: BookingService = {
  serviceId: 'svc-test',
  slug: 'initial',
  name: { ko: '초기 상담', 'zh-hant': '初步諮詢', en: 'Initial consultation' },
  description: { ko: '상담', 'zh-hant': '諮詢', en: 'Consultation' },
  durationMinutes: 30,
  priceTwd: 0,
  category: 'consultation',
  staffIds: ['staff-test'],
  bufferBeforeMinutes: 0,
  bufferAfterMinutes: 0,
  slotStepMinutes: 30,
  isActive: true,
  createdAt: '2026-05-12T00:00:00.000Z',
  updatedAt: '2026-05-12T00:00:00.000Z',
};

const staff: Staff = {
  staffId: 'staff-test',
  name: { ko: '증위명 변호사', 'zh-hant': '曾偉銘 律師', en: 'Attorney Tseng' },
  title: { ko: '대표', 'zh-hant': '主持', en: 'Managing attorney' },
  email: 'attorney@example.com',
  isActive: true,
  createdAt: '2026-05-12T00:00:00.000Z',
  updatedAt: '2026-05-12T00:00:00.000Z',
};

describe('booking email templates', () => {
  it('renders default customer confirmation with booking details and manage link', () => {
    const rendered = renderBookingEmailTemplate(
      defaultBookingEmailTemplate('customer-confirmation'),
      booking(),
      { service, staff },
    );

    expect(rendered.subject).toContain('초기 상담');
    expect(rendered.text).toContain('증위명 변호사');
    expect(rendered.text).toContain('https://meet.example.com/abc');
    expect(rendered.text).toContain('/ko/bookings/manage/');
    expect(rendered.html).toContain('Budget');
    expect(rendered.html).toContain('https://example.com/doc.pdf');
  });

  it('escapes customer-provided values in html output', () => {
    const rendered = renderBookingEmailTemplate(
      {
        ...defaultBookingEmailTemplate('admin-notification'),
        subject: 'New {{customerName}}',
        body: 'Name {{customerName}}\nSummary {{caseSummary}}',
      },
      booking(),
      { service, staff },
    );

    expect(rendered.subject).toContain('Kim <script>');
    expect(rendered.html).toContain('Kim &lt;script&gt;');
    expect(rendered.html).toContain('Company setup &lt;urgent&gt;');
    expect(rendered.html).not.toContain('Kim <script>');
  });
});
