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

export type WaitlistJoinRecord = {
  readonly waitlistId: string;
};

export type WaitlistPromoteRecord = {
  readonly bookingId: string;
  readonly waitlistStatus: string;
  readonly promotedBookingId: string | undefined;
};

const baseStyle = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
} as const;

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

type ClosedDateAvailabilityRequest = ServiceFixtureRequest & {
  readonly date: string;
};

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

export function nextWaitlistDate(): string {
  const today = new Date();
  for (let offset = 7; offset < 30; offset += 1) {
    const candidate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + offset, 12));
    const day = candidate.getUTCDay();
    if (day >= 1 && day <= 5) {
      return candidate.toISOString().slice(0, 10);
    }
  }
  throw new Error('W211 future weekday not found');
}

export async function createWaitlistStaff(request: FixtureRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/staff?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: `W211 대기 담당자 ${request.token}`, en: `W211 Waitlist Staff ${request.token}`, 'zh-hant': `W211 候補人員 ${request.token}` },
      title: { ko: '대기열 검증 변호사', en: 'Waitlist verification attorney', 'zh-hant': '候補驗證律師' },
      bio: { ko: `W211 대기열 검증 ${request.token}`, en: '', 'zh-hant': '' },
      email: `w211-waitlist-${request.token}@example.com`,
      photo: '',
      isActive: true,
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'staff', 'staffId') : null;
}

export async function createWaitlistService(request: ServiceFixtureRequest): Promise<string | null> {
  const response = await request.page.request.post('/api/builder/bookings/services?locale=ko', {
    headers: request.headers,
    data: {
      name: { ko: `W211 대기 상담 ${request.token}`, en: `W211 Waitlist Consultation ${request.token}`, 'zh-hant': `W211 候補諮詢 ${request.token}` },
      description: { ko: `W211 대기열 public widget 검증 ${request.token}`, en: '', 'zh-hant': '' },
      durationMinutes: 30,
      priceTwd: 0,
      image: '',
      category: `w211-${request.token}`,
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

export async function saveClosedDateAvailability(request: ClosedDateAvailabilityRequest): Promise<boolean> {
  const response = await request.page.request.patch(`/api/builder/bookings/staff/${request.staffId}/availability?locale=ko`, {
    headers: request.headers,
    data: {
      weekly: allWeek('09:00', '12:00'),
      blockedDates: [],
      dateOverrides: [{ date: request.date, blocks: [], note: `W211 closed ${request.token}` }],
      timezone: 'Asia/Seoul',
      holidayCalendar: 'none',
    },
  });
  return response.ok();
}

export function waitlistWidgetDocument(token: string, serviceId: string, staffId: string): Record<string, unknown> {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `w211-booking-waitlist-${token}`,
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      {
        id: `root-${token}`,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 760 },
        style: baseStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'W211 waitlist root',
          background: '#ffffff',
          borderColor: 'transparent',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute',
          as: 'main',
        },
      },
      {
        id: `booking-${token}`,
        kind: 'booking-widget',
        parentId: `root-${token}`,
        rect: { x: 80, y: 72, width: 860, height: 640 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          eyebrow: 'Bookings',
          title: 'W211 waitlist flow',
          locale: 'ko',
          serviceId,
          staffId,
          successMessage: `W211 예약 완료 ${token}`,
          redirectAfterBooking: '',
          showCaseSummary: true,
          caseSummaryLabel: '사건 개요',
          showAttachmentLinks: false,
          attachmentLinksLabel: '첨부 링크',
          customFieldLabels: '',
        },
      },
    ],
  };
}

export async function parseWaitlistJoinResponse(response: JsonResponseLike): Promise<WaitlistJoinRecord | null> {
  if (!response.ok()) {
    return null;
  }
  const payload = await readJson(response);
  const waitlist = isRecord(payload) && isRecord(payload.waitlist) ? payload.waitlist : null;
  const waitlistId = stringValue(waitlist?.waitlistId);
  return waitlistId ? { waitlistId } : null;
}

export async function parseWaitlistPromoteResponse(response: JsonResponseLike): Promise<WaitlistPromoteRecord | null> {
  if (!response.ok()) {
    return null;
  }
  const payload = await readJson(response);
  const booking = isRecord(payload) && isRecord(payload.booking) ? payload.booking : null;
  const waitlist = isRecord(payload) && isRecord(payload.waitlist) ? payload.waitlist : null;
  const bookingId = stringValue(booking?.bookingId);
  const waitlistStatus = stringValue(waitlist?.status);
  if (!bookingId || !waitlistStatus) {
    return null;
  }
  return { bookingId, waitlistStatus, promotedBookingId: stringValue(waitlist?.promotedBookingId) };
}

export async function cleanupWaitlistEntry(waitlistId: string | null): Promise<void> {
  if (!waitlistId) {
    return;
  }
  const root = process.env.BUILDER_BOOKINGS_ROOT ?? path.join(process.cwd(), 'runtime-data', 'builder-bookings');
  await fs.rm(path.join(root, 'waitlist', `${waitlistId}.json`), { force: true });
}
