import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { Page } from '@playwright/test';

type FixtureRequest = {
  readonly page: Page;
  readonly headers: Record<string, string>;
  readonly token: string;
};

type ServiceFixtureRequest = FixtureRequest & {
  readonly staffId: string;
};

type CustomField = {
  readonly label: string;
  readonly value: string;
};

export type CustomBookingRecord = {
  readonly bookingId: string;
  readonly serviceId: string;
  readonly staffId: string;
  readonly startAt: string;
  readonly caseSummary: string | undefined;
  readonly attachmentUrls: readonly string[] | undefined;
  readonly customFields: readonly CustomField[] | undefined;
};

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

function stringArrayValue(value: unknown): readonly string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const strings = value.filter((item): item is string => typeof item === 'string');
  return strings.length === value.length ? strings : undefined;
}

function customFieldsValue(value: unknown): readonly CustomField[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const fields: CustomField[] = [];
  for (const item of value) {
    if (!isRecord(item)) {
      return undefined;
    }
    const label = stringValue(item.label);
    const fieldValue = stringValue(item.value);
    if (!label || fieldValue === undefined) {
      return undefined;
    }
    fields.push({ label, value: fieldValue });
  }
  return fields;
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

function parseCustomBookingRecord(payload: unknown): CustomBookingRecord | null {
  const envelope = isRecord(payload) ? payload : null;
  const booking = isRecord(envelope?.booking) ? envelope.booking : envelope;
  const customer = isRecord(booking) && isRecord(booking.customer) ? booking.customer : null;
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
    caseSummary: isRecord(customer) ? stringValue(customer.caseSummary) : undefined,
    attachmentUrls: isRecord(customer) ? stringArrayValue(customer.attachmentUrls) : undefined,
    customFields: isRecord(customer) ? customFieldsValue(customer.customFields) : undefined,
  };
}

export async function createCustomFieldsStaff(request: FixtureRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/staff?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: `W202 커스텀 필드 담당자 ${request.token}`, en: `W202 Custom Fields Staff ${request.token}`, 'zh-hant': `W202 自訂欄位人員 ${request.token}` },
      title: { ko: '예약 폼 검증 변호사', en: 'Booking form verification attorney', 'zh-hant': '預約表單驗證律師' },
      bio: { ko: `W202 예약 폼 검증 ${request.token}`, en: `W202 booking form check ${request.token}`, 'zh-hant': `W202 預約表單驗證 ${request.token}` },
      email: `w202-${request.token}@example.com`,
      photo: '',
      isActive: true,
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'staff', 'staffId') : null;
}

export async function createCustomFieldsService(request: ServiceFixtureRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/services?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: `W202 커스텀 필드 상담 ${request.token}`, en: `W202 Custom Fields Consultation ${request.token}`, 'zh-hant': `W202 自訂欄位諮詢 ${request.token}` },
      description: { ko: `W202 예약 폼 커스텀 필드 검증 ${request.token}`, en: '', 'zh-hant': '' },
      durationMinutes: 30,
      priceTwd: 0,
      image: '',
      category: `w202-${request.token}`,
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

export async function parseCustomBookingResponse(response: JsonResponseLike): Promise<CustomBookingRecord | null> {
  if (!response.ok()) {
    return null;
  }
  return parseCustomBookingRecord(await readJson(response));
}

export async function readStoredCustomBooking(bookingId: string): Promise<CustomBookingRecord | null> {
  const raw = await fs.readFile(path.join(bookingsRoot(), 'bookings', `${bookingId}.json`), 'utf8');
  const payload: unknown = JSON.parse(raw);
  return parseCustomBookingRecord(payload);
}
