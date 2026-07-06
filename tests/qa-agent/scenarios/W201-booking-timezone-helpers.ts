import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { Page } from '@playwright/test';
import { localDateTimeToUtcIso } from '@/lib/builder/bookings/timezone';

export const customerTimezone = 'Asia/Seoul';
export const officeTimezone = 'Asia/Taipei';
export const officeStartTime = '09:00';
export const officeEndTime = '12:00';

type FixtureRequest = {
  readonly page: Page;
  readonly headers: Record<string, string>;
  readonly token: string;
};

type ServiceFixtureRequest = FixtureRequest & {
  readonly staffId: string;
};

type BookingRecord = {
  readonly bookingId: string;
  readonly serviceId: string;
  readonly staffId: string;
  readonly startAt: string;
  readonly customerTimezone: string | undefined;
};

type AvailabilityBlock = {
  readonly start: string;
  readonly end: string;
};

type Day =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

type JsonResponseLike = {
  readonly ok: () => boolean;
  readonly json: () => Promise<unknown>;
};

function bookingsRoot(): string {
  return process.env.BUILDER_BOOKINGS_ROOT ?? path.join(process.cwd(), 'runtime-data', 'builder-bookings');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

async function readJson(response: JsonResponseLike): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      return null;
    }
    throw error;
  }
}

function parseEntityId(payload: unknown, key: 'staff' | 'service', idKey: 'staffId' | 'serviceId'): string | null {
  if (!isRecord(payload) || !isRecord(payload[key])) {
    return null;
  }
  return stringValue(payload[key][idKey]) ?? null;
}

function parseBookingRecord(payload: unknown): BookingRecord | null {
  const envelope = isRecord(payload) ? payload : null;
  const booking = isRecord(envelope?.booking) ? envelope.booking : envelope;
  const bookingId = stringValue(envelope?.bookingId) ?? (isRecord(booking) ? stringValue(booking.bookingId) : undefined);
  const serviceId = isRecord(booking) ? stringValue(booking.serviceId) : undefined;
  const staffId = isRecord(booking) ? stringValue(booking.staffId) : undefined;
  const startAt = isRecord(booking) ? stringValue(booking.startAt) : undefined;
  if (!bookingId || !serviceId || !staffId || !startAt) {
    return null;
  }
  return {
    bookingId,
    serviceId,
    staffId,
    startAt,
    customerTimezone: isRecord(booking) ? stringValue(booking.customerTimezone) : undefined,
  };
}

function allWeek(start: string, end: string): Record<Day, readonly AvailabilityBlock[]> {
  return {
    monday: [{ start, end }],
    tuesday: [{ start, end }],
    wednesday: [{ start, end }],
    thursday: [{ start, end }],
    friday: [{ start, end }],
    saturday: [{ start, end }],
    sunday: [{ start, end }],
  };
}

export async function createTimezoneStaff(request: FixtureRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/staff?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: `W201 타임존 담당자 ${request.token}`, en: `W201 Timezone Staff ${request.token}`, 'zh-hant': `W201 時區人員 ${request.token}` },
      title: { ko: '타임존 검증 변호사', en: 'Timezone verification attorney', 'zh-hant': '時區驗證律師' },
      bio: { ko: `W201 타임존 검증 ${request.token}`, en: `W201 timezone check ${request.token}`, 'zh-hant': `W201 時區驗證 ${request.token}` },
      email: `w201-${request.token}@example.com`,
      photo: '',
      isActive: true,
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'staff', 'staffId') : null;
}

export async function createTimezoneService(request: ServiceFixtureRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/services?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: `W201 타임존 상담 ${request.token}`, en: `W201 Timezone Consultation ${request.token}`, 'zh-hant': `W201 時區諮詢 ${request.token}` },
      description: { ko: `W201 고객/오피스 시간대 검증 ${request.token}`, en: '', 'zh-hant': '' },
      durationMinutes: 30,
      priceTwd: 0,
      image: '',
      category: `w201-${request.token}`,
      staffIds: [request.staffId],
      requiredResourceIds: [],
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
      slotStepMinutes: 30,
      maxParticipants: 1,
      isActive: true,
      paymentMode: 'free',
      priceAmount: 0,
      priceCurrency: 'TWD',
      meetingMode: 'in-person',
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'service', 'serviceId') : null;
}

export async function saveTaipeiAvailability(request: ServiceFixtureRequest): Promise<boolean> {
  const response = await request.page.request.patch(`/api/builder/bookings/staff/${request.staffId}/availability?locale=ko`, {
    headers: request.headers,
    data: {
      weekly: allWeek(officeStartTime, officeEndTime),
      blockedDates: [],
      dateOverrides: [],
      timezone: officeTimezone,
      holidayCalendar: 'none',
    },
  });
  return response.ok();
}

export function expectedOfficeStartAt(date: string): string {
  return localDateTimeToUtcIso(date, officeStartTime, officeTimezone);
}

export async function parseTimezoneBookingResponse(response: JsonResponseLike): Promise<BookingRecord | null> {
  if (!response.ok()) {
    return null;
  }
  return parseBookingRecord(await readJson(response));
}

export async function readStoredBooking(bookingId: string): Promise<BookingRecord | null> {
  const raw = await fs.readFile(path.join(bookingsRoot(), 'bookings', `${bookingId}.json`), 'utf8');
  const payload: unknown = JSON.parse(raw);
  return parseBookingRecord(payload);
}
