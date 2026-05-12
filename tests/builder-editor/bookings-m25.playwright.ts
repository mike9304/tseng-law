import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { dayOfWeeks } from '@/lib/builder/bookings/types';

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
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-m25';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function todayPlus(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function allWeek(start: string, end: string) {
  return Object.fromEntries(dayOfWeeks.map((day) => [day, [{ start, end }]]));
}

async function createBuilderPage(request: APIRequestContext, slug: string, title: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: { locale: 'ko', slug, title, blank: true },
    headers: mutationHeaders(slug),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

async function currentDraftRevision(request: APIRequestContext, pageId: string): Promise<number> {
  const response = await request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(pageId),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { draft?: { revision?: number } };
  expect(typeof payload.draft?.revision).toBe('number');
  return payload.draft!.revision!;
}

async function putDraft(request: APIRequestContext, pageId: string, expectedRevision: number, document: Record<string, unknown>): Promise<void> {
  const response = await request.put(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(pageId),
    data: { expectedRevision, document },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean; error?: string };
  expect(payload.ok, payload.error).toBe(true);
}

function bookingWidgetDocument(token: string, serviceId: string, staffId: string) {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `m25-bookings-${token}`,
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
          label: 'M25 bookings root',
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
        id: `h1-${token}`,
        kind: 'text',
        parentId: `root-${token}`,
        rect: { x: 80, y: 44, width: 780, height: 58 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `M25 Bookings ${token}`,
          fontSize: 36,
          color: '#172033',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          verticalAlign: 'top',
          textTransform: 'none',
          as: 'h1',
        },
      },
      {
        id: `booking-${token}`,
        kind: 'booking-widget',
        parentId: `root-${token}`,
        rect: { x: 80, y: 124, width: 820, height: 620 },
        style: baseStyle,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          eyebrow: 'Bookings',
          title: 'M25 paid consultation flow',
          locale: 'ko',
          serviceId,
          staffId,
          successMessage: 'M25 예약 완료',
          redirectAfterBooking: '',
          showCaseSummary: true,
          caseSummaryLabel: '사건 개요',
          showAttachmentLinks: true,
          attachmentLinksLabel: '첨부 링크',
          customFieldLabels: '희망 상담 언어\n상대방 이름',
        },
      },
    ],
  };
}

test.describe('M25 Bookings services, staff, slots, and public widget', () => {
  test('covers W196-W202 with hybrid paid service booking flow', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-m25-bookings-${token}`;
    const headers = mutationHeaders(token);
    let pageId: string | null = null;
    let serviceId: string | null = null;
    let staffId: string | null = null;
    let bookingId: string | null = null;

    await page.setExtraHTTPHeaders(headers);

    try {
      const staffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `M25 변호사 ${token}`, 'zh-hant': `M25 律師 ${token}`, en: `M25 Attorney ${token}` },
          title: { ko: '예약 담당', 'zh-hant': '預約律師', en: 'Booking Attorney' },
          bio: { ko: 'M25 예약 검증 담당자', 'zh-hant': 'M25 預約測試', en: 'M25 booking test counsel' },
          email: '',
          photo: '',
          isActive: true,
        },
      });
      expect(staffResponse.status()).toBe(201);
      staffId = ((await staffResponse.json()) as { staff: { staffId: string } }).staff.staffId;

      const serviceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `M25 유료 상담 ${token}`, 'zh-hant': `M25 付費諮詢 ${token}`, en: `M25 Paid Consultation ${token}` },
          description: { ko: 'M25 서비스 CRUD 검증', 'zh-hant': 'M25 服務測試', en: 'M25 service CRUD check' },
          durationMinutes: 30,
          priceTwd: 5000,
          image: '',
          category: 'consultation',
          staffIds: [staffId],
          bufferBeforeMinutes: 10,
          bufferAfterMinutes: 20,
          slotStepMinutes: 15,
          isActive: true,
          paymentMode: 'paid',
          priceAmount: 5000,
          priceCurrency: 'TWD',
        },
      });
      expect(serviceResponse.status()).toBe(201);
      const servicePayload = (await serviceResponse.json()) as {
        service: { serviceId: string; bufferBeforeMinutes: number; bufferAfterMinutes: number; slotStepMinutes: number; paymentMode?: string };
      };
      serviceId = servicePayload.service.serviceId;
      expect(servicePayload.service).toMatchObject({
        bufferBeforeMinutes: 10,
        bufferAfterMinutes: 20,
        slotStepMinutes: 15,
        paymentMode: 'paid',
      });

      const availabilityResponse = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: {
          weekly: allWeek('09:00', '12:00'),
          blockedDates: [],
          timezone: 'Asia/Seoul',
        },
      });
      expect(availabilityResponse.status()).toBe(200);

      const bookingDate = todayPlus(1);
      const slotResponse = await page.request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${bookingDate}`, {
        headers,
      });
      expect(slotResponse.status()).toBe(200);
      const slotPayload = (await slotResponse.json()) as { slots: Array<{ startAt: string; timezone: string }> };
      expect(slotPayload.slots.length).toBeGreaterThan(1);
      expect(slotPayload.slots[0].timezone).toBe('Asia/Seoul');

      const paymentResponse = await page.request.post('/api/booking/payment-intent', {
        headers,
        data: {
          serviceId,
          customer: { name: `M25 고객 ${token}`, email: `m25-${token}@example.com` },
        },
      });
      expect(paymentResponse.status()).toBe(200);
      await expect(paymentResponse.json()).resolves.toMatchObject({ ok: true, amount: 5000, currency: 'twd' });

      pageId = await createBuilderPage(page.request, slug, `M25 Bookings ${token}`);
      const revision = await currentDraftRevision(page.request, pageId);
      await putDraft(page.request, pageId, revision, bookingWidgetDocument(token, serviceId, staffId));

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
        headers,
        data: {},
      });
      expect(publishResponse.status()).toBe(200);

      await page.goto(`/ko/${slug}?m25=${token}`, { waitUntil: 'domcontentloaded' });
      const flow = page.locator('[data-booking-flow="true"]').first();
      await expect(flow).toBeVisible();
      await expect(flow.locator(`[data-booking-service-id="${serviceId}"]`)).toHaveAttribute('data-active', 'true');
      await flow.getByRole('button', { name: 'Continue' }).click();

      await expect(flow.locator(`[data-booking-staff-id="${staffId}"]`)).toBeVisible();
      await flow.getByRole('button', { name: 'Continue' }).click();

      const slotButton = flow.locator('[data-booking-slot-start]').first();
      await expect(slotButton).toBeVisible();
      const selectedSlot = await slotButton.getAttribute('data-booking-slot-start');
      expect(selectedSlot).toBeTruthy();
      await slotButton.click();
      await flow.getByRole('button', { name: 'Continue' }).click();

      await flow.getByLabel('Name').fill(`M25 고객 ${token}`);
      await flow.getByLabel('Email').fill(`m25-${token}@example.com`);
      await flow.getByLabel('Phone').fill('+82-10-0000-0000');
      await flow.getByLabel('Notes').fill('공개 위젯에서 작성한 예약 메모');
      await flow.getByLabel('사건 개요').fill('계약 분쟁 초기 검토가 필요합니다.');
      await flow.getByLabel('첨부 링크').fill('https://example.com/evidence.pdf');
      await flow.getByLabel('희망 상담 언어').fill('한국어');
      await flow.getByLabel('상대방 이름').fill('테스트 상대방');
      await flow.locator('input[type="checkbox"]').check();

      const bookResponsePromise = page.waitForResponse((response) =>
        response.url().includes('/api/booking/book') && response.request().method() === 'POST',
      );
      await flow.getByRole('button', { name: 'Confirm booking' }).click();
      const bookResponse = await bookResponsePromise;
      expect(bookResponse.status()).toBe(201);
      const bookPayload = (await bookResponse.json()) as {
        bookingId: string;
        booking: {
          serviceId: string;
          staffId: string;
          startAt: string;
          paymentIntentId?: string;
          paymentStatus?: string;
          customerTimezone?: string;
          customer: {
            caseSummary?: string;
            attachmentUrls?: string[];
            customFields?: Array<{ label: string; value: string }>;
          };
        };
      };
      bookingId = bookPayload.bookingId;
      expect(bookPayload.booking.serviceId).toBe(serviceId);
      expect(bookPayload.booking.staffId).toBe(staffId);
      expect(bookPayload.booking.startAt).toBe(selectedSlot);
      expect(bookPayload.booking.paymentIntentId).toBe('pi_stub_dev');
      expect(bookPayload.booking.paymentStatus).toBe('unpaid');
      expect(bookPayload.booking.customerTimezone).toBeTruthy();
      expect(bookPayload.booking.customer.caseSummary).toContain('계약 분쟁');
      expect(bookPayload.booking.customer.attachmentUrls).toEqual(['https://example.com/evidence.pdf']);
      expect(bookPayload.booking.customer.customFields).toEqual([
        { label: '희망 상담 언어', value: '한국어' },
        { label: '상대방 이름', value: '테스트 상대방' },
      ]);
      await expect(flow.getByText('M25 예약 완료')).toBeVisible();
    } finally {
      if (bookingId) {
        await page.request.patch(`/api/builder/bookings/${bookingId}`, {
          headers,
          data: { status: 'cancelled' },
          failOnStatusCode: false,
        });
      }
      if (serviceId) {
        await page.request.delete(`/api/builder/bookings/services/${serviceId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (staffId) {
        await page.request.delete(`/api/builder/bookings/staff/${staffId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers,
          failOnStatusCode: false,
        });
      }
    }
  });
});
