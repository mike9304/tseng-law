import { expect, test, type APIRequestContext } from '@playwright/test';
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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-m27';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

function todayPlus(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function allWeek(start: string, end: string) {
  return Object.fromEntries(dayOfWeeks.map((day) => [day, [{ start, end }]]));
}

function noWeek() {
  return Object.fromEntries(dayOfWeeks.map((day) => [day, []]));
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
    updatedBy: `m27-waitlist-${token}`,
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
          label: 'M27 waitlist root',
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
          title: 'M27 waitlist flow',
          locale: 'ko',
          serviceId,
          staffId,
          successMessage: 'M27 예약 완료',
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

test.describe('M27 Bookings waitlist', () => {
  test.setTimeout(180_000);

  test('joins waitlist when no slots exist and promotes from admin dashboard', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-m27-waitlist-${token}`;
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
          name: { ko: `M27 대기 변호사 ${token}`, 'zh-hant': `M27 候補律師 ${token}`, en: `M27 Waitlist Attorney ${token}` },
          title: { ko: '대기 검증', 'zh-hant': '候補測試', en: 'Waitlist test' },
          bio: { ko: '대기자 명단 검증 담당자', 'zh-hant': '候補名單測試', en: 'Waitlist flow test counsel' },
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
          name: { ko: `M27 대기 상담 ${token}`, 'zh-hant': `M27 候補諮詢 ${token}`, en: `M27 Waitlist Consultation ${token}` },
          description: { ko: 'W211 대기자 명단 검증', 'zh-hant': 'W211 候補測試', en: 'W211 waitlist verification' },
          durationMinutes: 30,
          priceTwd: 0,
          image: '',
          category: 'consultation',
          staffIds: [staffId],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'free',
          priceAmount: 0,
          priceCurrency: 'TWD',
        },
      });
      expect(serviceResponse.status()).toBe(201);
      serviceId = ((await serviceResponse.json()) as { service: { serviceId: string } }).service.serviceId;

      const emptyAvailability = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: {
          weekly: noWeek(),
          blockedDates: [],
          timezone: 'Asia/Seoul',
        },
      });
      expect(emptyAvailability.status()).toBe(200);

      pageId = await createBuilderPage(page.request, slug, `M27 Waitlist ${token}`);
      const revision = await currentDraftRevision(page.request, pageId);
      await putDraft(page.request, pageId, revision, bookingWidgetDocument(token, serviceId, staffId));
      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
        headers,
        data: {},
      });
      expect(publishResponse.status()).toBe(200);

      await page.goto(`/ko/${slug}?m27=${token}`, { waitUntil: 'domcontentloaded' });
      const flow = page.locator('[data-booking-flow="true"]').first();
      await expect(flow).toBeVisible();
      await flow.getByRole('button', { name: 'Continue' }).click();
      await flow.getByRole('button', { name: 'Continue' }).click();
      await expect(flow.locator('[data-booking-waitlist="true"]')).toBeVisible();
      await flow.getByLabel('Name').fill(`M27 대기 고객 ${token}`);
      await flow.getByLabel('Email').fill(`m27-waitlist-${token}@example.com`);
      await flow.getByLabel('Phone').fill('+82-10-1111-2222');
      await flow.getByLabel('Notes').fill('빈 시간표라 대기 등록합니다.');
      await flow.locator('[data-booking-waitlist="true"] input[type="checkbox"]').check();

      const waitlistResponsePromise = page.waitForResponse((response) =>
        response.url().includes('/api/booking/waitlist') && response.request().method() === 'POST',
        { timeout: 30_000 },
      );
      await flow.getByRole('button', { name: 'Join waitlist' }).click();
      const waitlistResponse = await waitlistResponsePromise;
      expect(waitlistResponse.status()).toBe(201);
      const waitlistPayload = (await waitlistResponse.json()) as { waitlist: { waitlistId: string } };
      const waitlistId = waitlistPayload.waitlist.waitlistId;
      await expect(flow.locator('[data-booking-waitlist-confirmed="true"]')).toBeVisible();

      const openAvailability = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: {
          weekly: allWeek('09:00', '11:00'),
          blockedDates: [],
          timezone: 'Asia/Seoul',
        },
      });
      expect(openAvailability.status()).toBe(200);

      await page.goto('/ko/admin-builder/bookings/dashboard', { waitUntil: 'domcontentloaded' });
      const row = page.locator(`[data-waitlist-row="${waitlistId}"]`);
      await expect(row).toBeVisible();
      await expect(row).toContainText(`m27-waitlist-${token}@example.com`);

      const promoteResponsePromise = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/waitlist/${waitlistId}/promote`) && response.request().method() === 'POST',
        { timeout: 45_000 },
      );
      await row.getByRole('button', { name: 'Promote' }).click();
      const promoteResponse = await promoteResponsePromise;
      expect(promoteResponse.status()).toBe(201);
      const promotePayload = (await promoteResponse.json()) as { booking: { bookingId: string }; waitlist: { status: string; promotedBookingId?: string } };
      bookingId = promotePayload.booking.bookingId;
      expect(promotePayload.waitlist.status).toBe('promoted');
      expect(promotePayload.waitlist.promotedBookingId).toBe(bookingId);
      await expect(row).toContainText('promoted');
      await expect(page.locator(`[data-booking-row="${bookingId}"]`)).toBeVisible();
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
