import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { bookingHeaders } from './W200-booking-widget-helpers';
import { cleanupFiles } from './W200-booking-widget-cleanup';

// W205 — 예약 확정 시 Zoom/Meet 링크 자동 생성
//
// Zoom mock 모듈(src/lib/builder/bookings/zoom-client.ts)은 실제 Zoom 자격증명이
// 없을 때 mock 미팅 링크를 생성한다. QA 서버(start-qa-server.sh)는
// BUILDER_ZOOM_MOCK_ALLOW=1 로 production 빌드에서도 mock 을 유지한다.
//
// mock 경로가 만든 URL 은 new URL(meetingLinkBase) 에 zoom-client 가 직접 주입하는
// timezone/start/duration/topic(옵션 customerEmail) 쿼리 파라미터를 가진다.
// 실제 Zoom join_url 에는 이 파라미터들이 없으므로, 이 'mock URL shape' 가
// 곧 mock 링크가 생성되었음의 증거가 된다.
//
// 플로우: meetingMode:'zoom' 서비스 + 담당자 availability → 슬롯 → admin-create 로
// status:'confirmed' 예약 생성 → 응답 booking.meetingLink 가 mock URL shape 인지 단언.

type FixtureState = {
  staffId: string | null;
  serviceId: string | null;
  bookingId: string | null;
};

type AvailabilityBlock = { start: string; end: string };
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

type JsonResponseLike = {
  readonly ok: () => boolean;
  readonly status: () => number;
  readonly json: () => Promise<unknown>;
};

type CreatedBooking = {
  bookingId: string;
  startAt: string;
  meetingLink: string | undefined;
};

function blocker(summary: string, detail?: string): CheckpointFinding {
  return detail ? { severity: 'blocker', summary, detail } : { severity: 'blocker', summary };
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
    if (error instanceof Error) return null;
    throw error;
  }
}

function parseEntityId(payload: unknown, key: 'staff' | 'service', idKey: 'staffId' | 'serviceId'): string | null {
  if (!isRecord(payload) || !isRecord(payload[key])) return null;
  return stringValue(payload[key][idKey]) ?? null;
}

function allWeek(start: string, end: string): Record<DayOfWeek, readonly AvailabilityBlock[]> {
  const block = [{ start, end }];
  return {
    monday: block,
    tuesday: block,
    wednesday: block,
    thursday: block,
    friday: block,
    saturday: block,
    sunday: block,
  };
}

function futureWeekdayDate(minDaysFromToday: number): string {
  const today = new Date();
  for (let offset = minDaysFromToday; offset < minDaysFromToday + 30; offset += 1) {
    const candidate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + offset, 12));
    const day = candidate.getUTCDay();
    if (day >= 1 && day <= 5) return candidate.toISOString().slice(0, 10);
  }
  throw new Error('W205 future weekday not found');
}

function parseBooking(payload: unknown): CreatedBooking | null {
  const booking = isRecord(payload) && isRecord(payload.booking) ? payload.booking : null;
  const bookingId = stringValue(booking?.bookingId);
  const startAt = stringValue(booking?.startAt);
  if (!bookingId || !startAt) return null;
  return { bookingId, startAt, meetingLink: stringValue(booking?.meetingLink) };
}

async function createStaff(page: Page, headers: Record<string, string>, token: string): Promise<string | null> {
  const response = await page.request.post('/api/builder/bookings/staff?locale=ko', {
    headers,
    data: {
      name: { ko: `W205 미팅 담당자 ${token}`, en: `W205 Meet Staff ${token}`, 'zh-hant': `W205 會議人員 ${token}` },
      title: { ko: '화상 상담 담당', en: 'Video consult attorney', 'zh-hant': '視訊諮詢律師' },
      bio: { ko: `W205 Zoom 링크 검증 ${token}`, en: '', 'zh-hant': '' },
      email: `w205-${token}@example.com`,
      photo: '',
      isActive: true,
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'staff', 'staffId') : null;
}

async function createZoomService(page: Page, headers: Record<string, string>, token: string, staffId: string): Promise<string | null> {
  // meetingMode:'zoom' 이어야 maybeCreateBookingZoomLink 가 동작한다.
  const response = await page.request.post('/api/builder/bookings/services?locale=ko', {
    headers,
    data: {
      name: { ko: `W205 화상 상담 ${token}`, en: `W205 Video Consultation ${token}`, 'zh-hant': `W205 視訊諮詢 ${token}` },
      description: { ko: `W205 Zoom 자동 링크 검증 ${token}`, en: '', 'zh-hant': '' },
      durationMinutes: 30,
      priceTwd: 0,
      image: '',
      category: `w205-${token}`,
      staffIds: [staffId],
      requiredResourceIds: [],
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 15,
      slotStepMinutes: 30,
      maxParticipants: 1,
      isActive: true,
      paymentMode: 'free',
      priceAmount: 0,
      priceCurrency: 'TWD',
      meetingMode: 'zoom',
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'service', 'serviceId') : null;
}

async function saveAvailability(page: Page, headers: Record<string, string>, staffId: string): Promise<boolean> {
  const response = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability?locale=ko`, {
    headers,
    data: {
      weekly: allWeek('09:00', '16:00'),
      blockedDates: [],
      dateOverrides: [],
      timezone: 'Asia/Seoul',
      holidayCalendar: 'none',
    },
  });
  return response.ok();
}

async function fetchSlots(
  page: Page,
  headers: Record<string, string>,
  serviceId: string,
  staffId: string,
  date: string,
): Promise<readonly string[]> {
  const response = await page.request.get(
    `/api/booking/availability?serviceId=${encodeURIComponent(serviceId)}&staffId=${encodeURIComponent(staffId)}&date=${encodeURIComponent(date)}`,
    { headers, timeout: 45_000 },
  );
  if (!response.ok()) return [];
  const payload = await readJson(response);
  if (!isRecord(payload) || !Array.isArray(payload.slots)) return [];
  return payload.slots.flatMap((item) => {
    const startAt = isRecord(item) ? stringValue(item.startAt) : undefined;
    return startAt ? [startAt] : [];
  });
}

async function createConfirmedBooking(
  page: Page,
  headers: Record<string, string>,
  args: { serviceId: string; staffId: string; startAt: string; token: string },
): Promise<CreatedBooking | null> {
  // admin-create 는 status:'confirmed' 로 예약을 확정하면서 zoom-handoff 를 호출한다.
  const response = await page.request.post('/api/builder/bookings/admin-create?locale=ko', {
    headers,
    timeout: 45_000,
    data: {
      serviceId: args.serviceId,
      staffId: args.staffId,
      startAt: args.startAt,
      status: 'confirmed',
      customerTimezone: 'Asia/Seoul',
      customer: {
        name: `W205 화상 고객 ${args.token}`,
        email: `w205-${args.token}@example.com`,
        phone: '+82-10-2050-0000',
        notes: 'W205 Zoom 자동 링크 생성 검증',
        caseSummary: '화상 상담 확정 시 링크 자동 발급을 확인합니다.',
        locale: 'ko',
      },
    },
  });
  return response.ok() ? parseBooking(await readJson(response)) : null;
}

type MeetingLinkShape = { ok: boolean; reason?: string; host?: string; startParam?: string; topicParam?: string };

// mock URL shape: zoom-client 가 주입한 timezone/start/duration/topic 파라미터 존재 +
// start 파라미터 == 예약 startAt. 실제 Zoom join_url 은 이 파라미터를 갖지 않는다.
function describeMeetingLinkShape(meetingLink: string | undefined, expectedStartAt: string): MeetingLinkShape {
  if (!meetingLink) return { ok: false, reason: 'meetingLink 가 응답에 없음' };
  let url: URL;
  try {
    url = new URL(meetingLink);
  } catch {
    return { ok: false, reason: 'meetingLink 가 URL 형태가 아님' };
  }
  const required = ['timezone', 'start', 'duration', 'topic'];
  const missing = required.filter((key) => !url.searchParams.has(key));
  if (missing.length > 0) {
    return { ok: false, reason: `mock 전용 쿼리 파라미터 누락: ${missing.join(', ')}`, host: url.host };
  }
  const startParam = url.searchParams.get('start') ?? undefined;
  if (startParam !== expectedStartAt) {
    return { ok: false, reason: `start 파라미터(${startParam})가 예약 startAt(${expectedStartAt})과 불일치`, host: url.host, startParam };
  }
  return { ok: true, host: url.host, startParam, topicParam: url.searchParams.get('topic') ?? undefined };
}

export const checkpoint: CheckpointDefinition = {
  id: 'W205',
  title: '예약 확정 시 Zoom/Meet 링크 자동 생성 (mock)',
  verification:
    'meetingMode:zoom 서비스 예약을 admin-create 로 확정 → 응답 booking.meetingLink 가 zoom-client mock 이 만든 URL shape(timezone/start/duration/topic 파라미터 + start==startAt)인지 단언 → 정리',
  async run({ page, recordEvidence, log }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const headers = bookingHeaders(`w205-${token}`);
    const state: FixtureState = { staffId: null, serviceId: null, bookingId: null };

    try {
      await page.setExtraHTTPHeaders(headers);

      log('W205 담당자 fixture 생성');
      const staffId = await createStaff(page, headers, token);
      if (!staffId) {
        findings.push(blocker('W205 담당자 fixture 를 생성하지 못했습니다.'));
        return { findings };
      }
      state.staffId = staffId;

      log('W205 meetingMode:zoom 서비스 fixture 생성');
      const serviceId = await createZoomService(page, headers, token, staffId);
      if (!serviceId) {
        findings.push(blocker('W205 meetingMode:zoom 서비스 fixture 를 생성하지 못했습니다.'));
        return { findings };
      }
      state.serviceId = serviceId;

      log('W205 담당자 availability 저장');
      if (!(await saveAvailability(page, headers, staffId))) {
        findings.push(blocker('W205 담당자 availability fixture 를 저장하지 못했습니다.'));
        return { findings };
      }

      const date = futureWeekdayDate(10);
      log(`W205 슬롯 조회 (date=${date})`);
      const slots = await fetchSlots(page, headers, serviceId, staffId, date);
      if (slots.length === 0) {
        findings.push(blocker('W205 예약 가능 슬롯을 찾지 못해 예약 생성 검증을 진행할 수 없습니다.'));
        return { findings };
      }
      const startAt = slots[0];
      log(`W205 예약 확정(admin-create) startAt=${startAt}`);

      const booking = await createConfirmedBooking(page, headers, { serviceId, staffId, startAt, token });
      if (!booking) {
        findings.push(blocker('W205 admin-create 예약 생성이 실패해 meetingLink 검증을 할 수 없습니다.'));
        return { findings };
      }
      state.bookingId = booking.bookingId;
      log(`W205 예약 생성됨 bookingId=${booking.bookingId} meetingLink=${booking.meetingLink ?? '(없음)'}`);

      const shape = describeMeetingLinkShape(booking.meetingLink, booking.startAt);
      if (!shape.ok) {
        findings.push(
          blocker(
            'W205 예약 확정 응답에 zoom-client mock 링크가 없거나 URL shape 가 다릅니다 — BUILDER_ZOOM_MOCK_ALLOW/mock config 를 확인하세요.',
            `reason=${shape.reason} host=${shape.host ?? '-'} meetingLink=${booking.meetingLink ?? '(없음)'}`,
          ),
        );
        await recordEvidence('w205-meeting-link-missing-or-wrong-shape');
        return { findings };
      }

      log(`W205 mock 미팅 링크 확인 host=${shape.host} topic=${shape.topicParam ?? '-'}`);
      findings.push({
        severity: 'minor',
        summary: `W205 mock 미팅 링크가 정상 생성됨(host=${shape.host}) — 실제 Zoom 연동은 자격증명(ZOOM_*) 필요`,
      });
      await recordEvidence('w205-meeting-link-generated');
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker('W205 미팅 링크 검증 중 예외가 발생했습니다.', detail));
    } finally {
      await cleanupFiles({ staffId: state.staffId, serviceId: state.serviceId, bookingId: state.bookingId, pageId: null });
      await page.setExtraHTTPHeaders({});
    }

    return { findings };
  },
};
