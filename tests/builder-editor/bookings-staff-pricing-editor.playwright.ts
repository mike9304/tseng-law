import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { z } from 'zod';

const staffPayloadSchema = z.object({ staff: z.object({ staffId: z.string() }) });
const resourcesPayloadSchema = z.object({
  resources: z.array(z.object({ resourceId: z.string(), isActive: z.boolean() })),
});
const servicePayloadSchema = z.object({
  service: z.object({
    serviceId: z.string(),
    staffPriceOverrides: z.record(z.string(), z.number()).optional(),
    resourcePriceOverrides: z.record(z.string(), z.number()).optional(),
  }),
});
const servicesPayloadSchema = z.object({
  services: z.array(z.object({
    serviceId: z.string(),
    staffPriceOverrides: z.record(z.string(), z.number()).optional(),
    resourcePriceOverrides: z.record(z.string(), z.number()).optional(),
  })),
});

function authValues(): { readonly username: string; readonly password: string } {
  return {
    username: process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin',
    password: process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!',
  };
}

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-staff-pricing-editor';
  const { username, password } = authValues();
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

async function createStaff(
  request: APIRequestContext,
  headers: Record<string, string>,
  token: string,
  label: string,
): Promise<string> {
  const response = await request.post('/api/builder/bookings/staff', {
    headers,
    data: {
      name: { ko: `${label} 담당 ${token}`, 'zh-hant': `${label} 律師 ${token}`, en: `${label} Attorney ${token}` },
      title: { ko: `${label} 상담`, 'zh-hant': `${label} 諮詢`, en: `${label} counsel` },
      bio: { ko: '담당자별 가격 편집 검증', 'zh-hant': '員工價格編輯測試', en: 'Staff price editor check' },
      email: '',
      photo: '',
      isActive: true,
    },
  });
  expect(response.status()).toBe(201);
  return staffPayloadSchema.parse(await response.json()).staff.staffId;
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

  const card = page.locator(`[data-booking-service-card="${serviceId}"]`);
  return card;
}

test.describe('Bookings staff pricing editor', () => {
  test('persists staff-specific prices from the services editor UI and summarizes them on the card', async ({ browser }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(token);
    const { username, password } = authValues();
    const context = await browser.newContext({ httpCredentials: { username, password } });
    await context.addInitScript(() => {
      window.localStorage.setItem('booking-services-page-size', '100');
    });
    await context.setExtraHTTPHeaders({ 'x-forwarded-for': headers['x-forwarded-for'] });
    const page = await context.newPage();
    const staffIds: string[] = [];
    let serviceId: string | null = null;

    try {
      const baseStaffId = await createStaff(page.request, headers, token, '기본');
      const premiumStaffId = await createStaff(page.request, headers, token, '프리미엄');
      staffIds.push(baseStaffId, premiumStaffId);
      const resourcesResponse = await page.request.get('/api/builder/bookings/resources?includeInactive=1', { headers });
      expect(resourcesResponse.status()).toBe(200);
      const resourceId = resourcesPayloadSchema.parse(await resourcesResponse.json()).resources.find((resource) => (
        resource.isActive
      ))?.resourceId;
      if (!resourceId) throw new Error('Need an active booking resource for pricing editor coverage.');

      const createResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `편집 가격 상담 ${token}`, 'zh-hant': `編輯價格諮詢 ${token}`, en: `Editor Pricing Consultation ${token}` },
          description: { ko: '담당자별 가격 편집 검증', 'zh-hant': '員工價格編輯測試', en: 'Staff price editor check' },
          durationMinutes: 30,
          priceTwd: 5000,
          image: '',
          category: 'consultation',
          staffIds,
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
      expect(createResponse.status()).toBe(201);
      serviceId = servicePayloadSchema.parse(await createResponse.json()).service.serviceId;

      await page.goto(`/ko/admin-builder/bookings/services?edit=${encodeURIComponent(serviceId)}`, {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.getByRole('heading', { name: /^Edit service$|^서비스 편집$/ })).toBeVisible();

      const premiumOverrideInput = page.locator(`[data-booking-staff-price-override="${premiumStaffId}"]`);
      await expect(premiumOverrideInput).toBeVisible();
      await expect(premiumOverrideInput).toHaveValue('');
      await premiumOverrideInput.fill('8000');
      const resourceOverrideInput = page.locator(`[data-booking-resource-price-override="${resourceId}"]`);
      await expect(resourceOverrideInput).toBeVisible();
      await expect(resourceOverrideInput).toHaveValue('');
      await resourceOverrideInput.fill('9000');

      const saveButton = page.getByRole('button', { name: /^Save service$|^서비스 저장$/ });
      await saveButton.scrollIntoViewIfNeeded();
      await expect(saveButton).toBeEnabled();
      await saveButton.click();
      await expect(page.locator('[data-booking-service-editor="true"]')).toHaveCount(0);

      const card = await serviceCardOnVisiblePage(page, page.request, headers, serviceId);
      await expect(card).toBeVisible();
      const staffPriceSummary = page.locator(`[data-booking-service-staff-price-summary="${serviceId}"]`);
      await expect(staffPriceSummary).toContainText(`프리미엄 담당 ${token}`);
      await expect(staffPriceSummary).toContainText('TWD 8,000');
      const resourcePriceSummary = page.locator(`[data-booking-service-resource-price-summary="${serviceId}"]`);
      await expect(resourcePriceSummary).toContainText('TWD 9,000');

      await page.goto(`/ko/admin-builder/bookings/services?edit=${encodeURIComponent(serviceId)}`, {
        waitUntil: 'domcontentloaded',
      });
      const reloadedOverrideInput = page.locator(`[data-booking-staff-price-override="${premiumStaffId}"]`);
      await expect(reloadedOverrideInput).toHaveValue('8000');
      const reloadedResourceOverrideInput = page.locator(`[data-booking-resource-price-override="${resourceId}"]`);
      await expect(reloadedResourceOverrideInput).toHaveValue('9000');

      const listResponse = await page.request.get('/api/builder/bookings/services?includeInactive=1', { headers });
      expect(listResponse.status()).toBe(200);
      const savedService = servicesPayloadSchema.parse(await listResponse.json()).services.find((service) => (
        service.serviceId === serviceId
      ));
      expect(savedService?.staffPriceOverrides).toEqual({ [premiumStaffId]: 8000 });
      expect(savedService?.resourcePriceOverrides).toEqual({ [resourceId]: 9000 });

      await reloadedOverrideInput.fill('');
      const clearSaveButton = page.getByRole('button', { name: /^Save service$|^서비스 저장$/ });
      await clearSaveButton.scrollIntoViewIfNeeded();
      await clearSaveButton.click();
      await expect(page.locator('[data-booking-service-editor="true"]')).toHaveCount(0);
      await expect(await serviceCardOnVisiblePage(page, page.request, headers, serviceId)).toBeVisible();
      await expect(page.locator(`[data-booking-service-staff-price-summary="${serviceId}"]`)).toHaveCount(0);

      const clearedListResponse = await page.request.get('/api/builder/bookings/services?includeInactive=1', { headers });
      expect(clearedListResponse.status()).toBe(200);
      const clearedService = servicesPayloadSchema.parse(await clearedListResponse.json()).services.find((service) => (
        service.serviceId === serviceId
      ));
      expect(clearedService?.staffPriceOverrides ?? {}).toEqual({});

      await page.goto(`/ko/admin-builder/bookings/services?edit=${encodeURIComponent(serviceId)}`, {
        waitUntil: 'domcontentloaded',
      });
      await page.locator(`[data-booking-resource-price-override="${resourceId}"]`).fill('');
      const clearResourceSaveButton = page.getByRole('button', { name: /^Save service$|^서비스 저장$/ });
      await clearResourceSaveButton.scrollIntoViewIfNeeded();
      await clearResourceSaveButton.click();
      await expect(page.locator('[data-booking-service-editor="true"]')).toHaveCount(0);
      await expect(await serviceCardOnVisiblePage(page, page.request, headers, serviceId)).toBeVisible();
      await expect(page.locator(`[data-booking-service-resource-price-summary="${serviceId}"]`)).toHaveCount(0);

      const clearedResourceListResponse = await page.request.get('/api/builder/bookings/services?includeInactive=1', { headers });
      expect(clearedResourceListResponse.status()).toBe(200);
      const clearedResourceService = servicesPayloadSchema.parse(await clearedResourceListResponse.json()).services.find((service) => (
        service.serviceId === serviceId
      ));
      expect(clearedResourceService?.resourcePriceOverrides ?? {}).toEqual({});
    } finally {
      if (serviceId) {
        await page.request.delete(`/api/builder/bookings/services/${serviceId}`, { headers, failOnStatusCode: false });
      }
      for (const staffId of staffIds) {
        await page.request.delete(`/api/builder/bookings/staff/${staffId}`, { headers, failOnStatusCode: false });
      }
      await context.close();
    }
  });
});
