import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import { dayOfWeeks } from '@/lib/builder/bookings/types';
import { getBookingFlowCopy } from '@/lib/builder/bookings/bookings-copy';

const evidenceDir = join(process.cwd(), '.omo/evidence/bookings-resource-pricing');

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
const resourcePayloadSchema = z.object({ resource: z.object({ resourceId: z.string() }) });
const servicePayloadSchema = z.object({
  service: z.object({
    serviceId: z.string(),
    requiredResourceIds: z.array(z.string()).optional(),
    resourcePriceOverrides: z.record(z.string(), z.number()).optional(),
  }),
});
const servicesPayloadSchema = z.object({
  services: z.array(z.object({
    serviceId: z.string(),
    resourcePriceOverrides: z.record(z.string(), z.number()).optional(),
  })),
});
const paymentPayloadSchema = z.object({
  ok: z.literal(true),
  amount: z.number(),
  totalAmount: z.number(),
  currency: z.string(),
});

function authValues(): { readonly username: string; readonly password: string } {
  return {
    username: process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin',
    password: process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!',
  };
}

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-resource-pricing';
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
    updatedBy: `resource-pricing-${token}`,
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
          label: 'Resource pricing root',
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
        rect: { x: 80, y: 80, width: 860, height: 620 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          eyebrow: 'Bookings',
          title: 'Resource-priced consultation flow',
          locale: 'ko',
          serviceId,
          staffId,
          successMessage: '리소스 가격 예약 완료',
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
  if (await pageSizeSelect.count() > 0) {
    await pageSizeSelect.selectOption('100');
  }

  const newestFirstIndex = services.length - 1 - serviceIndex;
  const targetPage = Math.floor(newestFirstIndex / 100);
  for (let pageIndex = 0; pageIndex < targetPage; pageIndex += 1) {
    const nextButton = page.locator('[data-pagination-next]');
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
  }

  return page.locator(`[data-booking-service-card="${serviceId}"]`);
}

test.describe('Bookings resource-specific pricing', () => {
  test.setTimeout(180_000);

  test('persists required-resource prices and uses them in the published booking widget', async ({ browser }) => {
    mkdirSync(evidenceDir, { recursive: true });

    const token = Date.now().toString(36);
    const slug = `resource-pricing-${token}`;
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
    let resourceId: string | null = null;

    try {
      const staffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `리소스 담당 ${token}`, 'zh-hant': `資源律師 ${token}`, en: `Resource Attorney ${token}` },
          title: { ko: '리소스 가격 검증', 'zh-hant': '資源價格測試', en: 'Resource pricing counsel' },
          bio: { ko: '필수 자원 가격 검증 담당자', 'zh-hant': '資源價格測試', en: 'Resource pricing test counsel' },
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

      const resourceResponse = await page.request.post('/api/builder/bookings/resources', {
        headers,
        data: {
          name: { ko: `프리미엄 상담실 ${token}`, 'zh-hant': `高級諮詢室 ${token}`, en: `Premium Room ${token}` },
          description: { ko: '자원별 가격 검증', 'zh-hant': '資源價格測試', en: 'Resource-specific price check' },
          location: 'Seoul',
          capacity: 1,
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          weekly: allWeek('09:00', '12:00'),
          timezone: 'Asia/Seoul',
          blockedDates: [],
          isActive: true,
        },
      });
      expect(resourceResponse.status()).toBe(201);
      resourceId = resourcePayloadSchema.parse(await resourceResponse.json()).resource.resourceId;

      const serviceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `리소스 가격 상담 ${token}`, 'zh-hant': `資源價格諮詢 ${token}`, en: `Resource Pricing Consultation ${token}` },
          description: { ko: '필수 자원 가격 검증', 'zh-hant': '資源價格測試', en: 'Required-resource pricing check' },
          durationMinutes: 30,
          priceTwd: 5000,
          image: '',
          category: 'consultation',
          staffIds: [staffId],
          requiredResourceIds: [resourceId],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          maxParticipants: 1,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'paid',
          priceAmount: 5000,
          priceCurrency: 'TWD',
          meetingMode: 'in-person',
          reminderOffsetsHours: [24],
        },
      });
      expect(serviceResponse.status()).toBe(201);
      const createdService = servicePayloadSchema.parse(await serviceResponse.json()).service;
      serviceId = createdService.serviceId;
      expect(createdService.requiredResourceIds).toEqual([resourceId]);

      await page.goto(`/ko/admin-builder/bookings/services?edit=${encodeURIComponent(serviceId)}`, {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.getByRole('heading', { name: /^Edit service$|^서비스 편집$/ })).toBeVisible();
      const overrideInput = page.locator(`[data-booking-resource-price-override="${resourceId}"]`);
      await expect(overrideInput).toBeVisible();
      await expect(overrideInput).toHaveValue('');
      await overrideInput.fill('9000');
      await page.screenshot({ path: join(evidenceDir, 'admin-resource-price-editor.png'), fullPage: true });

      const saveButton = page.getByRole('button', { name: /^Save service$|^서비스 저장$/ });
      await saveButton.scrollIntoViewIfNeeded();
      await expect(saveButton).toBeEnabled();
      await saveButton.click();
      await expect(page.locator('[data-booking-service-editor="true"]')).toHaveCount(0);

      const card = await serviceCardOnVisiblePage(page, page.request, headers, serviceId);
      await expect(card).toBeVisible();
      const resourcePriceSummary = page.locator(`[data-booking-service-resource-price-summary="${serviceId}"]`);
      await expect(resourcePriceSummary).toContainText(`프리미엄 상담실 ${token}`);
      await expect(resourcePriceSummary).toContainText('TWD 9,000');
      await page.screenshot({ path: join(evidenceDir, 'admin-resource-price-card.png'), fullPage: true });

      const listResponse = await page.request.get('/api/builder/bookings/services?includeInactive=1', { headers });
      expect(listResponse.status()).toBe(200);
      const savedService = servicesPayloadSchema.parse(await listResponse.json()).services.find((service) => (
        service.serviceId === serviceId
      ));
      expect(savedService?.resourcePriceOverrides).toEqual({ [resourceId]: 9000 });

      const paymentResponse = await page.request.post('/api/booking/payment-intent', {
        headers,
        data: {
          serviceId,
          staffId,
          customer: { name: `리소스 고객 ${token}`, email: `resource-price-${token}@example.com` },
        },
      });
      expect(paymentResponse.status()).toBe(200);
      expect(paymentPayloadSchema.parse(await paymentResponse.json())).toMatchObject({
        amount: 9000,
        totalAmount: 9000,
        currency: 'twd',
      });

      pageId = await createBuilderPage(page.request, slug, `Resource Pricing ${token}`);
      const revision = await currentDraftRevision(page.request, pageId);
      await putDraft(page.request, pageId, revision, bookingWidgetDocument(token, serviceId, staffId));
      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
        headers,
        data: {},
      });
      expect(publishResponse.status()).toBe(200);

      await page.goto(`/ko/${slug}?resourcePricing=${token}`, { waitUntil: 'domcontentloaded' });
      const flow = page.locator('[data-booking-flow="true"]').first();
      await expect(flow).toBeVisible();
      const serviceButton = flow.locator(`[data-booking-service-id="${serviceId}"]`);
      await expect(serviceButton).toHaveAttribute('data-active', 'true');
      await expect(serviceButton).toContainText('TWD 9,000');
      await expect(serviceButton).toContainText(copy.labels.serviceDueNow);
      await page.screenshot({ path: join(evidenceDir, 'public-resource-priced-service.png'), fullPage: true });

      await flow.getByRole('button', { name: copy.labels.continue }).click();
      const staffButton = flow.locator(`[data-booking-staff-id="${staffId}"]`);
      await expect(staffButton).toBeVisible();
      await expect(staffButton).toContainText('TWD 9,000');
      await expect(staffButton).toContainText(copy.labels.serviceDueNow);
    } finally {
      const cleanupPaths = [
        pageId ? `/api/builder/site/pages/${pageId}?locale=ko` : '',
        serviceId ? `/api/builder/bookings/services/${serviceId}` : '',
        resourceId ? `/api/builder/bookings/resources/${resourceId}` : '',
        staffId ? `/api/builder/bookings/staff/${staffId}` : '',
      ];
      for (const path of cleanupPaths.filter(Boolean)) {
        await page.request.delete(path, { headers, failOnStatusCode: false });
      }
      await context.close();
    }
  });
});
