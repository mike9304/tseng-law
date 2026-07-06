import type { Page } from '@playwright/test';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { bookingHeaders } from './W200-booking-widget-helpers';
import { cleanupFiles } from './W200-booking-widget-cleanup';

// W210 — 예약 온라인 결제/보증금 (stub provider path)
//
// 결제 stub 경로(src/app/api/booking/payment-intent/route.ts)는 STRIPE_SECRET_KEY 가
// 없을 때 BOOKING_PAYMENT_ALLOW_STUB=1 인 환경(QA 서버 start-qa-server.sh)에서
// stub client_secret(pi_stub_dev_secret / pi_stub_dev)과 보증금 분해(isDeposit,
// depositAmount, balanceDueAfterPayment)을 반환한다.
//
// 플로우: paymentMode:'paid' + depositAmount 서비스 → /api/booking/payment-intent 로
// stub 결제의도 생성 → /api/booking/book 에 paymentIntentId 를 전달해 예약 생성 →
// stub 의도가 예약에 기록되는지(paymentIntentId, paymentStatus) 단언.
//
// 정직한 한계: stub 의도는 서버 검증(fetchPaymentIntentStatus)이 불가능해 book 라우트는
// paymentStatus 를 'paid' 가 아닌 'unpaid' 로 기록한다(실제 settled 전환은 Stripe
// 키+웹훅 필요). 시나리오는 이 사실을 minor finding 으로 보고하고, stub 경로가
// '결제 의도 연결'까지는 도달했음을 증명한다. stub 경로가 아예 응답하지 않으면 blocker.

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

type StubIntent = {
  stub: boolean;
  clientSecret: string | undefined;
  paymentIntentId: string | undefined;
  isDeposit: boolean | undefined;
  depositAmount: number | undefined;
  balanceDueAfterPayment: number | undefined;
  amount: number | undefined;
  totalAmount: number | undefined;
  currency: string | undefined;
};

type BookedPayment = {
  bookingId: string;
  paymentIntentId: string | undefined;
  paymentStatus: string | undefined;
};

const TOTAL_AMOUNT = 5000;
const DEPOSIT_AMOUNT = 1000;
const EXPECTED_BALANCE = TOTAL_AMOUNT - DEPOSIT_AMOUNT;
const STUB_CLIENT_SECRET = 'pi_stub_dev_secret';
const STUB_PAYMENT_INTENT_ID = 'pi_stub_dev';

function blocker(summary: string, detail?: string): CheckpointFinding {
  return detail ? { severity: 'blocker', summary, detail } : { severity: 'blocker', summary };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function booleanValue(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
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
  throw new Error('W210 future weekday not found');
}

function parseStubIntent(payload: unknown): StubIntent | null {
  if (!isRecord(payload)) return null;
  return {
    stub: booleanValue(payload.stub) ?? false,
    clientSecret: stringValue(payload.clientSecret),
    paymentIntentId: stringValue(payload.paymentIntentId),
    isDeposit: booleanValue(payload.isDeposit),
    depositAmount: numberValue(payload.depositAmount),
    balanceDueAfterPayment: numberValue(payload.balanceDueAfterPayment),
    amount: numberValue(payload.amount),
    totalAmount: numberValue(payload.totalAmount),
    currency: stringValue(payload.currency),
  };
}

function parseBookedPayment(payload: unknown): BookedPayment | null {
  const booking = isRecord(payload) && isRecord(payload.booking) ? payload.booking : null;
  const bookingId = stringValue(booking?.bookingId);
  if (!bookingId) return null;
  return {
    bookingId,
    paymentIntentId: stringValue(booking?.paymentIntentId),
    paymentStatus: stringValue(booking?.paymentStatus),
  };
}

async function createStaff(page: Page, headers: Record<string, string>, token: string): Promise<string | null> {
  const response = await page.request.post('/api/builder/bookings/staff?locale=ko', {
    headers,
    data: {
      name: { ko: `W210 결제 담당자 ${token}`, en: `W210 Payment Staff ${token}`, 'zh-hant': `W210 付款人員 ${token}` },
      title: { ko: '유료 상담 담당', en: 'Paid consult attorney', 'zh-hant': '付費諮詢律師' },
      bio: { ko: `W210 결제 stub 검증 ${token}`, en: '', 'zh-hant': '' },
      email: `w210-${token}@example.com`,
      photo: '',
      isActive: true,
    },
  });
  return response.ok() ? parseEntityId(await readJson(response), 'staff', 'staffId') : null;
}

async function createDepositService(page: Page, headers: Record<string, string>, token: string, staffId: string): Promise<string | null> {
  // paymentMode:'paid' + depositAmount(< total) → 보증금 결제 서비스.
  const response = await page.request.post('/api/builder/bookings/services?locale=ko', {
    headers,
    data: {
      name: { ko: `W210 유료 상담 ${token}`, en: `W210 Paid Consultation ${token}`, 'zh-hant': `W210 付費諮詢 ${token}` },
      description: { ko: `W210 보증금 결제 stub 검증 ${token}`, en: '', 'zh-hant': '' },
      durationMinutes: 30,
      priceTwd: 0,
      image: '',
      category: `w210-${token}`,
      staffIds: [staffId],
      requiredResourceIds: [],
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 15,
      slotStepMinutes: 30,
      maxParticipants: 1,
      isActive: true,
      paymentMode: 'paid',
      priceAmount: TOTAL_AMOUNT,
      priceCurrency: 'TWD',
      depositAmount: DEPOSIT_AMOUNT,
      meetingMode: 'in-person',
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

async function requestPaymentIntent(
  page: Page,
  headers: Record<string, string>,
  args: { serviceId: string; email: string; name: string },
): Promise<{ status: number; intent: StubIntent | null }> {
  const response = await page.request.post('/api/booking/payment-intent?locale=ko', {
    headers,
    data: { serviceId: args.serviceId, customer: { email: args.email, name: args.name } },
  });
  return { status: response.status(), intent: response.ok() ? parseStubIntent(await readJson(response)) : null };
}

async function bookWithPaymentIntent(
  page: Page,
  headers: Record<string, string>,
  args: { serviceId: string; staffId: string; startAt: string; paymentIntentId: string; email: string; name: string; token: string },
): Promise<BookedPayment | null> {
  const response = await page.request.post('/api/booking/book?locale=ko', {
    headers,
    timeout: 45_000,
    data: {
      serviceId: args.serviceId,
      staffId: args.staffId,
      startAt: args.startAt,
      customerTimezone: 'Asia/Seoul',
      paymentIntentId: args.paymentIntentId,
      customer: {
        name: args.name,
        email: args.email,
        phone: '+82-10-2100-0000',
        notes: 'W210 보증금 stub 결제 검증',
        caseSummary: 'stub paymentIntent 로 예약 생성 후 결제 상태 기록을 확인합니다.',
        locale: 'ko',
      },
    },
  });
  return response.ok() ? parseBookedPayment(await readJson(response)) : null;
}

export const checkpoint: CheckpointDefinition = {
  id: 'W210',
  title: '예약 온라인 결제/보증금 — stub provider path',
  verification:
    'paid+deposit 서비스 → /api/booking/payment-intent stub 응답(stub:true, clientSecret, 보증금 분해) 단언 → /api/booking/book 에 stub paymentIntentId 전달 → 예약에 paymentIntentId/paymentStatus 기록 단언 → 정리',
  async run({ page, recordEvidence, log }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const headers = bookingHeaders(`w210-${token}`);
    const state: FixtureState = { staffId: null, serviceId: null, bookingId: null };
    const email = `w210-${token}@example.com`;
    const name = `W210 결제 고객 ${token}`;

    try {
      await page.setExtraHTTPHeaders(headers);

      log('W210 담당자 fixture 생성');
      const staffId = await createStaff(page, headers, token);
      if (!staffId) {
        findings.push(blocker('W210 담당자 fixture 를 생성하지 못했습니다.'));
        return { findings };
      }
      state.staffId = staffId;

      log(`W210 paid+deposit 서비스 fixture 생성(total=${TOTAL_AMOUNT}, deposit=${DEPOSIT_AMOUNT})`);
      const serviceId = await createDepositService(page, headers, token, staffId);
      if (!serviceId) {
        findings.push(blocker('W210 paid+deposit 서비스 fixture 를 생성하지 못했습니다.'));
        return { findings };
      }
      state.serviceId = serviceId;

      log('W210 담당자 availability 저장');
      if (!(await saveAvailability(page, headers, staffId))) {
        findings.push(blocker('W210 담당자 availability fixture 를 저장하지 못했습니다.'));
        return { findings };
      }

      log('W210 stub 결제의도 생성(/api/booking/payment-intent)');
      const intentResult = await requestPaymentIntent(page, headers, { serviceId, email, name });
      if (!intentResult.intent) {
        findings.push(
          blocker(
            'W210 payment-intent stub 경로가 응답하지 않습니다 — BOOKING_PAYMENT_ALLOW_STUB/서비스 paymentMode 를 확인하세요.',
            `status=${intentResult.status}`,
          ),
        );
        return { findings };
      }
      const intent = intentResult.intent;
      log(`W210 stub intent: stub=${intent.stub} pi=${intent.paymentIntentId ?? '-'} isDeposit=${intent.isDeposit ?? '-'}`);

      if (!intent.stub) {
        findings.push(
          blocker(
            'W210 payment-intent 가 stub 응답이 아닙니다 — 실제 STRIPE_SECRET_KEY 가 구성되어 있거나 stub 플래그가 꺼져 stub 경로를 검증할 수 없습니다.',
            `stub=${intent.stub}`,
          ),
        );
        return { findings };
      }
      // stub 경로 핵심 필드 단언.
      const stubMismatches: string[] = [];
      if (intent.clientSecret !== STUB_CLIENT_SECRET) stubMismatches.push(`clientSecret=${intent.clientSecret ?? '(없음)'}`);
      if (intent.paymentIntentId !== STUB_PAYMENT_INTENT_ID) stubMismatches.push(`paymentIntentId=${intent.paymentIntentId ?? '(없음)'}`);
      if (intent.isDeposit !== true) stubMismatches.push(`isDeposit=${intent.isDeposit ?? '(없음)'}`);
      if (intent.depositAmount !== DEPOSIT_AMOUNT) stubMismatches.push(`depositAmount=${intent.depositAmount ?? '(없음)'}`);
      if (intent.amount !== DEPOSIT_AMOUNT) stubMismatches.push(`amount=${intent.amount ?? '(없음)'}`);
      if (intent.totalAmount !== TOTAL_AMOUNT) stubMismatches.push(`totalAmount=${intent.totalAmount ?? '(없음)'}`);
      if (intent.balanceDueAfterPayment !== EXPECTED_BALANCE) stubMismatches.push(`balance=${intent.balanceDueAfterPayment ?? '(없음)'}`);
      if (stubMismatches.length > 0) {
        findings.push(blocker('W210 stub 결제의도 응답의 보증금 분해/식별자가 예상과 다릅니다.', stubMismatches.join(' / ')));
        return { findings };
      }
      await recordEvidence('w210-stub-payment-intent-ok');

      // stub 의도로 예약을 생성해 결제 상태가 예약에 기록되는지 확인.
      const date = futureWeekdayDate(10);
      log(`W210 슬롯 조회(date=${date}) 후 stub 의도로 예약 생성`);
      const slots = await fetchSlots(page, headers, serviceId, staffId, date);
      if (slots.length === 0) {
        findings.push(blocker('W210 예약 가능 슬롯을 찾지 못해 stub 결제 예약 생성을 진행할 수 없습니다.'));
        return { findings };
      }
      const booked = await bookWithPaymentIntent(page, headers, {
        serviceId,
        staffId,
        startAt: slots[0],
        paymentIntentId: STUB_PAYMENT_INTENT_ID,
        email,
        name,
        token,
      });
      if (!booked) {
        findings.push(blocker('W210 stub paymentIntentId 로 /api/booking/book 예약 생성이 실패했습니다.'));
        return { findings };
      }
      state.bookingId = booked.bookingId;
      log(`W210 예약 생성됨 bookingId=${booked.bookingId} pi=${booked.paymentIntentId ?? '-'} paymentStatus=${booked.paymentStatus ?? '-'}`);

      if (booked.paymentIntentId !== STUB_PAYMENT_INTENT_ID) {
        findings.push(
          blocker(
            'W210 예약에 stub paymentIntentId 가 기록되지 않았습니다.',
            `expected=${STUB_PAYMENT_INTENT_ID} actual=${booked.paymentIntentId ?? '(없음)'}`,
          ),
        );
        return { findings };
      }
      if (!booked.paymentStatus) {
        findings.push(blocker('W210 예약에 paymentStatus 가 기록되지 않았습니다(stub 결제 상태 미기록).'));
        return { findings };
      }

      // 정직한 한계 보고: stub 의도는 서버 검증 불가 → 'paid' 전환 안 됨.
      if (booked.paymentStatus === 'paid') {
        findings.push({ severity: 'minor', summary: 'W210 stub 경로가 예약을 paid 까지 전환시켰습니다.' });
      } else {
        findings.push({
          severity: 'minor',
          summary: `W210 stub 결제의도는 예약에 기록되었으나(pi=${booked.paymentIntentId}) 서버 검증 불가로 paymentStatus='${booked.paymentStatus}' — stub 경로가 결제 의도 연결까지 도달, 정식 settled(paid) 전환은 Stripe 키+웹훅 필요`,
        });
      }
      await recordEvidence('w210-stub-payment-recorded-on-booking');
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker('W210 stub 결제 검증 중 예외가 발생했습니다.', detail));
    } finally {
      await cleanupFiles({ staffId: state.staffId, serviceId: state.serviceId, bookingId: state.bookingId, pageId: null });
      await page.setExtraHTTPHeaders({});
    }

    return { findings };
  },
};
