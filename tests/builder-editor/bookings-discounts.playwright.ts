import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { dayOfWeeks } from '@/lib/builder/bookings/types';
import { getBookingFlowCopy } from '@/lib/builder/bookings/bookings-copy';

const evidenceDir = join(process.cwd(), '.omo/evidence/bookings-discounts');

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

const staffPayloadSchema = z.object({ staff: z.object({ staffId: z.string() }) });
const servicePayloadSchema = z.object({ service: z.object({ serviceId: z.string() }) });
const servicesPayloadSchema = z.object({
  services: z.array(z.object({
    serviceId: z.string(),
    discountCodes: z.array(z.object({
      code: z.string(),
      type: z.enum(['percent', 'fixed']),
      value: z.number(),
      active: z.boolean(),
    })).optional(),
  })),
});

function authValues(): { readonly username: string; readonly password: string } {
  return {
    username: process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin',
    password: process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!',
  };
}

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-discounts';
  const { username, password } = authValues();
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
    updatedBy: `discounts-${token}`,
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
          label: 'Discount booking root',
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
        rect: { x: 80, y: 80, width: 860, height: 660 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          eyebrow: 'Bookings',
          title: 'Discounted consultation flow',
          locale: 'ko',
          serviceId,
          staffId,
          successMessage: '할인 예약 완료',
          redirectAfterBooking: '',
          showCaseSummary: false,
          showAttachmentLinks: false,
          customFieldLabels: '',
        },
      },
    ],
  };
}

async function serviceCardOnVisiblePage(
  page: Page,
  request: APIRequestContext,
  headers: Record<string, string>,
  serviceId: string,
) {
  const servicesResponse = await request.get('/api/builder/bookings/services?includeInactive=1', { headers });
  expect(servicesResponse.status()).toBe(200);
  const services = servicesPayloadSchema.parse(await servicesResponse.json()).services;
  const serviceIndex = services.findIndex((service) => service.serviceId === serviceId);
  expect(serviceIndex).toBeGreaterThanOrEqual(0);

  await page.goto('/ko/admin-builder/bookings/services', { waitUntil: 'domcontentloaded' });
  const pageSizeSelect = page.locator('[data-pagination-page-size]');
  if (await pageSizeSelect.count() > 0) await pageSizeSelect.selectOption('100');

  const newestFirstIndex = services.length - 1 - serviceIndex;
  const targetPage = Math.floor(newestFirstIndex / 100);
  for (let pageIndex = 0; pageIndex < targetPage; pageIndex += 1) {
    const nextButton = page.locator('[data-pagination-next]');
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
  }

  return page.locator(`[data-booking-service-card="${serviceId}"]`);
}

test.describe('Bookings service discount codes', () => {
  test.setTimeout(180_000);

  test('saves service-scoped discounts and applies them in the published booking widget', async ({ browser }) => {
    mkdirSync(evidenceDir, { recursive: true });

    const token = Date.now().toString(36);
    const slug = `booking-discount-${token}`;
    const headers = mutationHeaders(token);
    const { username, password } = authValues();
    const copy = getBookingFlowCopy('ko');
    const context = await browser.newContext({ httpCredentials: { username, password } });
    await context.addInitScript(() => {
      window.localStorage.setItem('booking-services-page-size', '100');
    });
    await context.setExtraHTTPHeaders({ 'x-forwarded-for': headers['x-forwarded-for'] });
    const page = await context.newPage();
    let pageId: string | null = null;
    let serviceId: string | null = null;
    let staffId: string | null = null;
    let bookingId: string | null = null;

    try {
      const staffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `할인 담당 ${token}`, 'zh-hant': `折扣律師 ${token}`, en: `Discount Attorney ${token}` },
          title: { ko: '할인 상담 담당', 'zh-hant': '折扣諮詢', en: 'Discount counsel' },
          bio: { ko: '할인 예약 검증 담당자', 'zh-hant': '折扣測試', en: 'Discount booking test counsel' },
          email: '',
          photo: '',
          isActive: true,
        },
      });
      expect(staffResponse.status()).toBe(201);
      staffId = staffPayloadSchema.parse(await staffResponse.json()).staff.staffId;

      const availabilityResponse = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: { weekly: allWeek('09:00', '12:00'), blockedDates: [], timezone: 'Asia/Seoul' },
      });
      expect(availabilityResponse.status()).toBe(200);

      const serviceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `할인 유료 상담 ${token}`, 'zh-hant': `折扣付費諮詢 ${token}`, en: `Discount Paid Consultation ${token}` },
          description: { ko: '할인 코드 검증', 'zh-hant': '折扣碼測試', en: 'Discount code check' },
          durationMinutes: 30,
          priceTwd: 5000,
          image: '',
          category: 'consultation',
          staffIds: [staffId],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          maxParticipants: 1,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'paid',
          priceAmount: 5000,
          priceCurrency: 'TWD',
          meetingMode: 'in-person',
        },
      });
      expect(serviceResponse.status()).toBe(201);
      serviceId = servicePayloadSchema.parse(await serviceResponse.json()).service.serviceId;

      await page.goto(`/ko/admin-builder/bookings/services?edit=${encodeURIComponent(serviceId)}`, {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.getByRole('heading', { name: /^Edit service$|^서비스 편집$/ })).toBeVisible();
      await page.locator('[data-booking-service-discount-add="true"]').click();
      await page.locator('[data-booking-service-discount-code-input="true"]').fill('LEGAL20');
      await page.locator('[data-booking-service-discount-value="true"]').fill('20');
      await page.screenshot({ path: join(evidenceDir, 'admin-discount-editor.png'), fullPage: true });

      const saveButton = page.getByRole('button', { name: /^Save service$|^서비스 저장$/ });
      await saveButton.scrollIntoViewIfNeeded();
      await expect(saveButton).toBeEnabled();
      await saveButton.click();
      await expect(page.locator('[data-booking-service-editor="true"]')).toHaveCount(0);

      const card = await serviceCardOnVisiblePage(page, page.request, headers, serviceId);
      await expect(card).toBeVisible();
      await expect(card.locator('[data-booking-service-discount-code="LEGAL20"]')).toContainText('LEGAL20');
      await page.screenshot({ path: join(evidenceDir, 'admin-discount-card.png'), fullPage: true });

      const listResponse = await page.request.get('/api/builder/bookings/services?includeInactive=1', { headers });
      expect(listResponse.status()).toBe(200);
      const savedService = servicesPayloadSchema.parse(await listResponse.json()).services.find((service) => (
        service.serviceId === serviceId
      ));
      expect(savedService?.discountCodes).toEqual([
        expect.objectContaining({ code: 'LEGAL20', type: 'percent', value: 20, active: true }),
      ]);

      pageId = await createBuilderPage(page.request, slug, `Booking Discount ${token}`);
      const revision = await currentDraftRevision(page.request, pageId);
      await putDraft(page.request, pageId, revision, bookingWidgetDocument(token, serviceId, staffId));
      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
        headers,
        data: {},
      });
      expect(publishResponse.status()).toBe(200);

      await page.goto(`/ko/${slug}?discount=${token}`, { waitUntil: 'domcontentloaded' });
      const flow = page.locator('[data-booking-flow="true"]').first();
      await expect(flow).toBeVisible();
      const serviceButton = flow.locator(`[data-booking-service-id="${serviceId}"]`);
      await expect(serviceButton).toHaveAttribute('data-active', 'true');
      await expect(serviceButton).toContainText('TWD 5,000');
      await flow.getByRole('button', { name: copy.labels.continue }).click();

      await expect(flow.locator(`[data-booking-staff-id="${staffId}"]`)).toBeVisible();
      await flow.getByRole('button', { name: copy.labels.continue }).click();

      const slotButton = flow.locator('[data-booking-slot-start]').first();
      await expect(slotButton).toBeVisible();
      await slotButton.click();
      await flow.getByRole('button', { name: copy.labels.continue }).click();

      await flow.getByLabel(copy.labels.name, { exact: true }).fill(`할인 고객 ${token}`);
      await flow.getByLabel(copy.labels.email).fill(`discount-${token}@example.com`);
      await flow.getByLabel(copy.labels.phone).fill('+82-10-2222-3333');
      await flow.locator('[data-booking-discount-input="true"]').fill('legal20');
      await flow.locator('[data-booking-discount-apply="true"]').click();
      await expect(flow.locator('[data-booking-discount-applied="true"]')).toContainText('LEGAL20');
      await expect(flow.locator('[data-booking-discount-applied="true"]')).toContainText('TWD 1,000');
      await expect(flow.locator('[data-booking-payment-panel="true"]')).toContainText('TWD 4,000');
      await page.screenshot({ path: join(evidenceDir, 'public-discount-applied.png'), fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(flow.locator('[data-booking-discount-panel="true"]')).toBeVisible();
      await expect(flow.locator('[data-booking-payment-panel="true"]')).toContainText('TWD 4,000');
      await page.screenshot({ path: join(evidenceDir, 'public-discount-applied-mobile.png'), fullPage: true });
      await page.setViewportSize({ width: 1440, height: 1000 });

      const paymentResponsePromise = page.waitForResponse((response) =>
        response.url().includes('/api/booking/payment-intent') && response.request().method() === 'POST',
      );
      await flow.getByRole('button', { name: copy.labels.paymentPrepare }).click();
      const paymentResponse = await paymentResponsePromise;
      expect(paymentResponse.status()).toBe(200);
      await expect(paymentResponse.json()).resolves.toMatchObject({
        ok: true,
        amount: 4000,
        totalAmount: 4000,
        discountCode: 'LEGAL20',
        discountAmount: 1000,
      });

      await flow.getByRole('button', { name: copy.labels.paymentStubComplete }).click();
      await expect(flow.locator('[data-booking-payment-confirmed="true"]')).toBeVisible();
      await flow.locator('input[type="checkbox"]').check();

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
          paymentAmount?: number;
          paymentDueNow?: number;
          discountCode?: string;
          discountAmount?: number;
        };
      } = await bookResponse.json();
      bookingId = bookPayload.bookingId;
      expect(bookPayload.booking).toMatchObject({
        serviceId,
        paymentAmount: 4000,
        paymentDueNow: 4000,
        discountCode: 'LEGAL20',
        discountAmount: 1000,
      });
      await expect(flow.getByText('할인 예약 완료')).toBeVisible();
    } finally {
      if (bookingId) {
        await page.request.patch(`/api/builder/bookings/${bookingId}`, {
          headers,
          data: { status: 'cancelled' },
          failOnStatusCode: false,
        });
      }
      const cleanupPaths = [
        pageId ? `/api/builder/site/pages/${pageId}?locale=ko` : '',
        serviceId ? `/api/builder/bookings/services/${serviceId}` : '',
        staffId ? `/api/builder/bookings/staff/${staffId}` : '',
      ];
      for (const path of cleanupPaths.filter(Boolean)) {
        await page.request.delete(path, { headers, failOnStatusCode: false });
      }
      await context.close();
    }
  });
});
