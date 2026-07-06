import { expect, test, type APIRequestContext } from '@playwright/test';
import { dayOfWeeks } from '@/lib/builder/bookings/types';
import { getBookingFlowCopy } from '@/lib/builder/bookings/bookings-copy';

const baseStyle = { backgroundColor: 'transparent', borderColor: '#cbd5e1', borderStyle: 'solid', borderWidth: 0, borderRadius: 0, shadowX: 0, shadowY: 0, shadowBlur: 0, shadowSpread: 0, shadowColor: 'rgba(15, 23, 42, 0.16)', opacity: 100 };

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-pay-later';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

function allWeek(start: string, end: string): Record<string, Array<{ start: string; end: string }>> {
  const weekly: Record<string, Array<{ start: string; end: string }>> = {};
  for (const day of dayOfWeeks) weekly[day] = [{ start, end }];
  return weekly;
}

async function createBuilderPage(request: APIRequestContext, slug: string, title: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: { locale: 'ko', slug, title, blank: true },
    headers: mutationHeaders(slug),
  });
  expect(response.status()).toBe(200);
  const payload: { success?: boolean; pageId?: string; error?: string } = await response.json();
  expect(payload.success, payload.error).toBe(true);
  if (!payload.pageId) throw new Error('Builder page creation did not return pageId');
  return payload.pageId;
}

async function currentDraftRevision(request: APIRequestContext, pageId: string): Promise<number> {
  const response = await request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(pageId),
  });
  expect(response.status()).toBe(200);
  const payload: { draft?: { revision?: number } } = await response.json();
  if (typeof payload.draft?.revision !== 'number') throw new Error('Draft revision missing');
  return payload.draft.revision;
}

async function putDraft(request: APIRequestContext, pageId: string, expectedRevision: number, document: unknown): Promise<void> {
  const response = await request.put(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(pageId),
    data: { expectedRevision, document },
  });
  expect(response.status()).toBe(200);
  const payload: { ok?: boolean; error?: string } = await response.json();
  expect(payload.ok, payload.error).toBe(true);
}

function bookingWidgetDocument(token: string, serviceId: string, staffId: string) {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `pay-later-${token}`,
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
          label: 'Pay later booking root',
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
        rect: { x: 80, y: 80, width: 820, height: 620 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          eyebrow: 'Bookings',
          title: 'Pay-later consultation flow',
          locale: 'ko',
          serviceId,
          staffId,
          successMessage: '후불 예약 완료',
          redirectAfterBooking: '',
          showCaseSummary: false,
          showAttachmentLinks: false,
          customFieldLabels: '',
        },
      },
    ],
  };
}

test.describe('Bookings pay-later public widget', () => {
  test.setTimeout(120_000);

  test('confirms a collect-later paid consultation without a payment panel', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `pw-m25-pay-later-${token}`;
    const headers = mutationHeaders(token);
    const copy = getBookingFlowCopy('ko');
    let pageId: string | null = null;
    let serviceId: string | null = null;
    let staffId: string | null = null;
    let bookingId: string | null = null;
    const paymentIntentRequests: string[] = [];

    page.on('request', (request) => {
      if (request.url().includes('/api/booking/payment-intent')) {
        paymentIntentRequests.push(request.url());
      }
    });
    await page.setExtraHTTPHeaders(headers);

    try {
      const staffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `후불 담당 ${token}`, 'zh-hant': `稍後付款律師 ${token}`, en: `Pay Later Attorney ${token}` },
          title: { ko: '후불 상담 담당', 'zh-hant': '稍後付款諮詢', en: 'Pay-later counsel' },
          bio: { ko: '후불 상담 검증 담당자', 'zh-hant': '稍後付款測試', en: 'Pay-later booking test counsel' },
          email: '',
          photo: '',
          isActive: true,
        },
      });
      expect(staffResponse.status()).toBe(201);
      const staffPayload: { staff: { staffId: string } } = await staffResponse.json();
      staffId = staffPayload.staff.staffId;

      const serviceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `후불 유료 상담 ${token}`, 'zh-hant': `稍後付款諮詢 ${token}`, en: `Pay Later Consultation ${token}` },
          description: { ko: '예약 후 나중에 결제하는 상담', 'zh-hant': '預約後稍後付款', en: 'Book now and pay later.' },
          durationMinutes: 30,
          priceTwd: 120000,
          image: '',
          category: 'consultation',
          staffIds: [staffId],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'paid',
          priceAmount: 120000,
          priceCurrency: 'KRW',
          collectPaymentLater: true,
        },
      });
      expect(serviceResponse.status()).toBe(201);
      const servicePayload: { service: { serviceId: string; collectPaymentLater?: boolean; paymentMode?: string } } = await serviceResponse.json();
      serviceId = servicePayload.service.serviceId;
      expect(servicePayload.service).toMatchObject({ paymentMode: 'paid', collectPaymentLater: true });

      const availabilityResponse = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: {
          weekly: allWeek('09:00', '12:00'),
          blockedDates: [],
          timezone: 'Asia/Seoul',
        },
      });
      expect(availabilityResponse.status()).toBe(200);

      pageId = await createBuilderPage(page.request, slug, `Pay Later ${token}`);
      const revision = await currentDraftRevision(page.request, pageId);
      await putDraft(page.request, pageId, revision, bookingWidgetDocument(token, serviceId, staffId));

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
        headers,
        data: {},
      });
      expect(publishResponse.status()).toBe(200);

      await page.goto(`/ko/${slug}?payLater=${token}`, { waitUntil: 'domcontentloaded' });
      const flow = page.locator('[data-booking-flow="true"]').first();
      await expect(flow).toBeVisible();
      await expect(flow.locator(`[data-booking-service-id="${serviceId}"]`)).toHaveAttribute('data-active', 'true');
      await expect(flow.locator(`[data-booking-service-id="${serviceId}"]`)).toContainText(copy.labels.paymentModePayLater);
      await flow.getByRole('button', { name: copy.labels.continue }).click();

      await expect(flow.locator(`[data-booking-staff-id="${staffId}"]`)).toBeVisible();
      await flow.getByRole('button', { name: copy.labels.continue }).click();

      const slotButton = flow.locator('[data-booking-slot-start]').first();
      await expect(slotButton).toBeVisible();
      const selectedSlot = await slotButton.getAttribute('data-booking-slot-start');
      if (!selectedSlot) throw new Error('No pay-later slot was available');
      await slotButton.click();
      await flow.getByRole('button', { name: copy.labels.continue }).click();

      await flow.getByLabel(copy.labels.name, { exact: true }).fill(`후불 고객 ${token}`);
      await flow.getByLabel(copy.labels.email).fill(`pay-later-${token}@example.com`);
      await flow.getByLabel(copy.labels.phone).fill('+82-10-1111-2222');
      await flow.getByLabel(copy.labels.notes).fill('후불 결제 상담 예약');
      await flow.locator('input[type="checkbox"]').check();
      await expect(flow.locator('[data-booking-payment-panel="true"]')).toHaveCount(0);
      await expect(flow.getByRole('button', { name: copy.labels.confirmBooking })).toBeEnabled();

      const bookResponsePromise = page.waitForResponse((response) =>
        response.url().includes('/api/booking/book') && response.request().method() === 'POST',
      );
      await flow.getByRole('button', { name: copy.labels.confirmBooking }).click();
      const bookResponse = await bookResponsePromise;
      expect(bookResponse.status()).toBe(201);
      const bookPayload: {
        bookingId: string;
        booking: {
          serviceId: string;
          staffId: string;
          startAt: string;
          paymentIntentId?: string;
          paymentStatus?: string;
          paymentAmount?: number;
          paymentDueNow?: number;
          depositAmount?: number;
        };
      } = await bookResponse.json();
      bookingId = bookPayload.bookingId;
      expect(bookPayload.booking.serviceId).toBe(serviceId);
      expect(bookPayload.booking.staffId).toBe(staffId);
      expect(bookPayload.booking.startAt).toBe(selectedSlot);
      expect(bookPayload.booking.paymentIntentId).toBeUndefined();
      expect(bookPayload.booking.paymentStatus).toBe('unpaid');
      expect(bookPayload.booking.paymentAmount).toBe(120000);
      expect(bookPayload.booking.paymentDueNow).toBe(0);
      expect(bookPayload.booking.depositAmount).toBeUndefined();
      expect(paymentIntentRequests).toHaveLength(0);
      await expect(flow.getByText('후불 예약 완료')).toBeVisible();
    } finally {
      if (bookingId) {
        await page.request.patch(`/api/builder/bookings/${bookingId}`, {
          headers,
          data: { status: 'cancelled' },
          failOnStatusCode: false,
        });
      }
      const cleanupPaths = [
        serviceId ? `/api/builder/bookings/services/${serviceId}` : '',
        staffId ? `/api/builder/bookings/staff/${staffId}` : '',
        pageId ? `/api/builder/site/pages/${pageId}?locale=ko` : '',
      ].filter(Boolean);
      for (const path of cleanupPaths) {
        await page.request.delete(path, { headers, failOnStatusCode: false });
      }
    }
  });
});
