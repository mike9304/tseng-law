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

type JsonResponseLike = {
  readonly ok: () => boolean;
  readonly json: () => Promise<unknown>;
};

export type Day =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type AvailabilityBlock = {
  readonly start: string;
  readonly end: string;
};

type DateOverride = {
  readonly date: string;
  readonly blocks: readonly AvailabilityBlock[];
};

export type AvailabilityRecord = {
  readonly staffId: string;
  readonly weekly: Record<Day, readonly AvailabilityBlock[]>;
  readonly dateOverrides: readonly DateOverride[];
  readonly timezone: string | undefined;
  readonly recurringTemplateId: string | undefined;
  readonly holidayCalendar: string | undefined;
};

export type SlotRecord = {
  readonly startAt: string;
  readonly endAt: string;
};

type CleanupIds = {
  readonly staffId: string | null;
  readonly serviceId: string | null;
};

const holidayMmdd = new Set(['01-01', '02-28', '03-01', '04-04', '05-01', '05-05', '06-06', '08-15', '10-03', '10-09', '10-10', '12-25']);
const fixedHolidayCandidates = ['01-01', '05-05', '10-09', '10-10', '12-25'] as const;

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

function parseBlock(value: unknown): AvailabilityBlock | null {
  if (!isRecord(value)) {
    return null;
  }
  const start = stringValue(value.start);
  const end = stringValue(value.end);
  return start && end ? { start, end } : null;
}

function parseBlocks(value: unknown): readonly AvailabilityBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map(parseBlock).filter((block): block is AvailabilityBlock => block !== null);
}

function parseOverrides(value: unknown): readonly DateOverride[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }
    const date = stringValue(item.date);
    return date ? [{ date, blocks: parseBlocks(item.blocks) }] : [];
  });
}

function parseWeekly(value: unknown): Record<Day, readonly AvailabilityBlock[]> | null {
  if (!isRecord(value)) {
    return null;
  }
  return {
    monday: parseBlocks(value.monday),
    tuesday: parseBlocks(value.tuesday),
    wednesday: parseBlocks(value.wednesday),
    thursday: parseBlocks(value.thursday),
    friday: parseBlocks(value.friday),
    saturday: parseBlocks(value.saturday),
    sunday: parseBlocks(value.sunday),
  };
}

function parseAvailability(value: unknown): AvailabilityRecord | null {
  if (!isRecord(value)) {
    return null;
  }
  const staffId = stringValue(value.staffId);
  const weekly = parseWeekly(value.weekly);
  if (!staffId || !weekly) {
    return null;
  }
  return {
    staffId,
    weekly,
    dateOverrides: parseOverrides(value.dateOverrides),
    timezone: stringValue(value.timezone),
    recurringTemplateId: stringValue(value.recurringTemplateId),
    holidayCalendar: stringValue(value.holidayCalendar),
  };
}

function parseSlots(payload: unknown): readonly SlotRecord[] {
  if (!isRecord(payload) || !Array.isArray(payload.slots)) {
    return [];
  }
  return payload.slots.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }
    const startAt = stringValue(item.startAt);
    const endAt = stringValue(item.endAt);
    return startAt && endAt ? [{ startAt, endAt }] : [];
  });
}

function dateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function weekdayIndex(date: Date): number {
  const day = date.getUTCDay();
  return day === 0 ? 7 : day;
}

export function headersFor(token: string): Record<string, string> {
  return { 'x-forwarded-for': `qa-w212-${token}` };
}

export function nextWorkingDate(): string {
  const today = new Date();
  for (let offset = 10; offset < 365; offset += 1) {
    const candidate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + offset, 12));
    const date = dateString(candidate);
    if (weekdayIndex(candidate) <= 5 && !holidayMmdd.has(date.slice(5))) {
      return date;
    }
  }
  throw new Error('W212 future working date not found');
}

export function nextHolidayWorkingDate(): string {
  const today = new Date();
  for (let year = today.getUTCFullYear(); year < today.getUTCFullYear() + 20; year += 1) {
    for (const mmdd of fixedHolidayCandidates) {
      const date = `${year}-${mmdd}`;
      const candidate = new Date(`${date}T12:00:00.000Z`);
      if (candidate > today && weekdayIndex(candidate) <= 5) {
        return date;
      }
    }
  }
  throw new Error('W212 future holiday weekday not found');
}

export async function createRecurringStaff(request: FixtureRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/staff?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: `W212 반복 담당자 ${request.token}`, en: `W212 Recurring Staff ${request.token}`, 'zh-hant': `W212 循環人員 ${request.token}` },
      title: { ko: '반복 가용성 검증 변호사', en: 'Recurring availability attorney', 'zh-hant': '循環可預約律師' },
      bio: { ko: `W212 반복 가용성 검증 ${request.token}`, en: '', 'zh-hant': '' },
      email: `w212-recurring-${request.token}@example.com`,
      photo: '',
      isActive: true,
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'staff', 'staffId') : null;
}

export async function createRecurringService(request: ServiceFixtureRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/services?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: `W212 반복 상담 ${request.token}`, en: `W212 Recurring Consultation ${request.token}`, 'zh-hant': `W212 循環諮詢 ${request.token}` },
      description: { ko: `W212 반복 availability public slot 검증 ${request.token}`, en: '', 'zh-hant': '' },
      durationMinutes: 30,
      priceTwd: 0,
      image: '',
      category: `w212-${request.token}`,
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
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'service', 'serviceId') : null;
}

export async function fetchAvailability(page: Page, staffId: string, headers: Record<string, string>): Promise<AvailabilityRecord | null> {
  const response = await page.request.get(`/api/builder/bookings/staff/${staffId}/availability?locale=ko`, { headers });
  if (!response.ok()) {
    return null;
  }
  const payload = await readJson(response);
  return isRecord(payload) ? parseAvailability(payload.availability) : null;
}

export async function fetchSlots(page: Page, serviceId: string, staffId: string, date: string, headers: Record<string, string>): Promise<readonly SlotRecord[]> {
  const response = await page.request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${date}&locale=ko`, { headers });
  if (!response.ok()) {
    return [];
  }
  return parseSlots(await readJson(response));
}

export async function cleanupBookingFiles(ids: CleanupIds): Promise<void> {
  const root = process.env.BUILDER_BOOKINGS_ROOT ?? path.join(process.cwd(), 'runtime-data', 'builder-bookings');
  if (ids.staffId) {
    await fs.rm(path.join(root, 'staff', `${ids.staffId}.json`), { force: true });
    await fs.rm(path.join(root, 'availability', `${ids.staffId}.json`), { force: true });
  }
  if (ids.serviceId) {
    await fs.rm(path.join(root, 'services', `${ids.serviceId}.json`), { force: true });
  }
}
