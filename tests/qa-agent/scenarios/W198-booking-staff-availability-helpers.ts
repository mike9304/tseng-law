import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { APIResponse, Page } from '@playwright/test';

export type Day =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

type AvailabilityBlock = {
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

type SlotRecord = {
  readonly startAt: string;
  readonly endAt: string;
};

type CleanupIds = {
  readonly staffId: string | null;
  readonly serviceId: string | null;
};

export const targetStart = '10:30';
export const targetEnd = '15:30';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

async function readJson(response: APIResponse): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      return null;
    }
    throw error;
  }
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

function parseIdPayload(payload: unknown, key: 'staff' | 'service', idKey: 'staffId' | 'serviceId'): string | null {
  if (!isRecord(payload) || !isRecord(payload[key])) {
    return null;
  }
  return stringValue(payload[key][idKey]) ?? null;
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

export function headersFor(token: string): Record<string, string> {
  return { 'x-forwarded-for': `qa-w198-${token}` };
}

export function nextWeekdayDate(): string {
  const now = new Date();
  for (let offset = 10; offset < 40; offset += 1) {
    const candidate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offset, 12));
    const day = candidate.getUTCDay();
    if (day >= 1 && day <= 5) {
      return candidate.toISOString().slice(0, 10);
    }
  }
  throw new Error('future weekday not found');
}

export function dayForDate(date: string): Day {
  const day = new Date(`${date}T12:00:00.000Z`).getUTCDay();
  switch (day) {
    case 1:
      return 'monday';
    case 2:
      return 'tuesday';
    case 3:
      return 'wednesday';
    case 4:
      return 'thursday';
    case 5:
      return 'friday';
    case 6:
      return 'saturday';
    default:
      return 'sunday';
  }
}

export function dayLabel(day: Day): string {
  switch (day) {
    case 'monday':
      return '월요일';
    case 'tuesday':
      return '화요일';
    case 'wednesday':
      return '수요일';
    case 'thursday':
      return '목요일';
    case 'friday':
      return '금요일';
    case 'saturday':
      return '토요일';
    case 'sunday':
      return '일요일';
  }
}

export async function createStaff(page: Page, token: string, headers: Record<string, string>): Promise<string | null> {
  const response = await page.request.post('/api/builder/bookings/staff?locale=ko', {
    headers,
    data: {
      name: { ko: `W198 일정 담당자 ${token}`, en: `W198 Availability ${token}`, 'zh-hant': `W198 可預約 ${token}` },
      title: { ko: '가용성 검증 변호사', en: 'Availability attorney', 'zh-hant': '可預約律師' },
      bio: { ko: `W198 일정 검증 ${token}`, en: `W198 availability check ${token}`, 'zh-hant': `W198 可預約驗證 ${token}` },
      email: `w198-${token}@example.com`,
      photo: '',
      isActive: true,
    },
  });
  return response.ok() ? parseIdPayload(await readJson(response), 'staff', 'staffId') : null;
}

export async function createService(page: Page, token: string, headers: Record<string, string>, staffId: string): Promise<string | null> {
  const response = await page.request.post('/api/builder/bookings/services?locale=ko', {
    headers,
    data: {
      name: { ko: `W198 일정 상담 ${token}`, en: `W198 Availability Service ${token}`, 'zh-hant': `W198 可預約諮詢 ${token}` },
      description: { ko: `W198 공개 슬롯 검증 ${token}`, en: '', 'zh-hant': '' },
      durationMinutes: 30,
      priceTwd: 0,
      category: `w198-${token}`,
      staffIds: [staffId],
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
  return response.ok() ? parseIdPayload(await readJson(response), 'service', 'serviceId') : null;
}

export async function fetchAvailability(page: Page, staffId: string, headers: Record<string, string>): Promise<AvailabilityRecord | null> {
  const response = await page.request.get(`/api/builder/bookings/staff/${staffId}/availability`, { headers });
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

export async function cleanupFiles(ids: CleanupIds): Promise<void> {
  const bookingsRoot = process.env.BUILDER_BOOKINGS_ROOT ?? path.join(process.cwd(), 'runtime-data', 'builder-bookings');
  if (ids.staffId) {
    await fs.rm(path.join(bookingsRoot, 'staff', `${ids.staffId}.json`), { force: true });
    await fs.rm(path.join(bookingsRoot, 'availability', `${ids.staffId}.json`), { force: true });
  }
  if (ids.serviceId) {
    await fs.rm(path.join(bookingsRoot, 'services', `${ids.serviceId}.json`), { force: true });
  }
}
