import { expect, test } from '@playwright/test';
import type { BookingResource, BookingService } from '@/lib/builder/bookings/types';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-resources';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

const REQUIRED_RESOURCE_ID = 'res-consultation-room';
const BLOCK_START = '2099-01-05T00:00:00.000Z';
const BLOCK_END = '2099-01-05T00:30:00.000Z';
const BLOCK_REASON = 'Room maintenance';
const BOOKING_DATE = '2099-01-05';

function restoreResourcePayload(resource: BookingResource) {
  return {
    name: resource.name,
    description: resource.description,
    location: resource.location,
    capacity: resource.capacity,
    bufferBeforeMinutes: resource.bufferBeforeMinutes ?? 0,
    bufferAfterMinutes: resource.bufferAfterMinutes ?? 0,
    weekly: resource.weekly,
    timezone: resource.timezone,
    recurringTemplateId: resource.recurringTemplateId,
    blockedDates: resource.blockedDates ?? [],
    isActive: resource.isActive,
  };
}

test.describe('M75 booking resources and rooms', () => {
  test.setTimeout(90_000);

  test('blocked resource times remove overlapping public booking slots and stay visible in the admin editor', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(token);
    page.setExtraHTTPHeaders(headers);

    let original: BookingResource | null = null;
    let createdService: BookingService | null = null;
    let staffId: string | null = null;

    try {
      const resourcesResponse = await page.request.get('/api/builder/bookings/resources?includeInactive=1', { headers });
      expect(resourcesResponse.status()).toBe(200);
      const resourcesPayload = (await resourcesResponse.json()) as { resources: BookingResource[] };
      original = resourcesPayload.resources.find((resource) => resource.resourceId === REQUIRED_RESOURCE_ID) ?? null;
      expect(original).toBeTruthy();

      const staffResponse = await page.request.get('/api/builder/bookings/staff?includeInactive=1', { headers });
      expect(staffResponse.status()).toBe(200);
      const staffPayload = (await staffResponse.json()) as { staff: Array<{ staffId: string; isActive: boolean }> };
      staffId = staffPayload.staff.find((member) => member.isActive)?.staffId ?? null;
      expect(staffId).toBeTruthy();

      const serviceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `Resource test ${token}`, 'zh-hant': `Resource test ${token}`, en: `Resource test ${token}` },
          description: { ko: 'Resource test', 'zh-hant': 'Resource test', en: 'Resource test' },
          durationMinutes: 30,
          priceTwd: 0,
          image: '',
          category: 'consultation',
          staffIds: [staffId],
          requiredResourceIds: [REQUIRED_RESOURCE_ID],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          maxParticipants: 1,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'free',
          priceCurrency: 'TWD',
          reminderOffsetsHours: [24],
        },
      });
      expect(serviceResponse.status()).toBe(201);
      createdService = ((await serviceResponse.json()) as { service: BookingService }).service;
      expect(createdService.requiredResourceIds).toEqual([REQUIRED_RESOURCE_ID]);

      const nextBlockedDates = [
        ...(original?.blockedDates ?? []),
        {
          start: BLOCK_START,
          end: BLOCK_END,
          reason: BLOCK_REASON,
        },
      ];

      const patchResponse = await page.request.patch(`/api/builder/bookings/resources/${REQUIRED_RESOURCE_ID}`, {
        headers,
        data: { blockedDates: nextBlockedDates },
      });
      expect(patchResponse.status()).toBe(200);

      await page.goto('/ko/admin-builder/bookings/resources', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: /Booking resources|예약 자원/ })).toBeVisible();

      const resourceCard = page.locator(`[data-booking-resource-card="${REQUIRED_RESOURCE_ID}"]`);
      await expect(resourceCard).toBeVisible();
      await expect(resourceCard).toContainText(/1 blocked|1개 차단됨/);
      await expect(page.locator(`[data-booking-resource-next-blocked="${REQUIRED_RESOURCE_ID}"]`)).toContainText(/Next blocked|다음 차단/);

      await resourceCard.getByRole('button', { name: /^Edit$|^편집$/ }).click();
      const editor = page.locator('[data-booking-resource-blocked-editor="true"]');
      await expect(editor).toBeVisible();
      await expect(editor.locator(`[data-booking-resource-blocked-row="0"]`)).toContainText(BLOCK_REASON);

      await page.goto('/ko/admin-builder/bookings/services', { waitUntil: 'domcontentloaded' });
      await expect(page.locator(`[data-booking-service-card="${createdService.serviceId}"]`)).toContainText(/Resources: 상담실|자원: 상담실/);

      const availabilityResponse = await page.request.get(
        `/api/booking/availability?serviceId=${createdService.serviceId}&staffId=${staffId}&date=${BOOKING_DATE}`,
        { headers },
      );
      expect(availabilityResponse.status()).toBe(200);
      const availabilityPayload = (await availabilityResponse.json()) as { slots: Array<{ startAt: string }> };
      expect(availabilityPayload.slots.map((slot) => slot.startAt)).not.toContain(BLOCK_START);
      expect(availabilityPayload.slots.length).toBeGreaterThan(0);
    } finally {
      if (createdService) {
        await page.request.delete(`/api/builder/bookings/services/${createdService.serviceId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (original) {
        await page.request.patch(`/api/builder/bookings/resources/${REQUIRED_RESOURCE_ID}`, {
          headers,
          failOnStatusCode: false,
          data: {
            name: original.name,
            description: original.description,
            location: original.location,
            capacity: original.capacity,
            blockedDates: original.blockedDates ?? [],
            isActive: original.isActive,
          },
        });
      }
    }
  });

  test('resource-specific buffers remove adjacent public booking slots and stay visible in the admin editor', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(`${token}-buffer`);
    page.setExtraHTTPHeaders(headers);

    let original: BookingResource | null = null;
    let createdService: BookingService | null = null;
    let createdBookingId: string | null = null;
    let staffId: string | null = null;

    try {
      const resourcesResponse = await page.request.get('/api/builder/bookings/resources?includeInactive=1', { headers });
      expect(resourcesResponse.status()).toBe(200);
      const resourcesPayload = (await resourcesResponse.json()) as { resources: BookingResource[] };
      original = resourcesPayload.resources.find((resource) => resource.resourceId === REQUIRED_RESOURCE_ID) ?? null;
      expect(original).toBeTruthy();

      const staffResponse = await page.request.get('/api/builder/bookings/staff?includeInactive=1', { headers });
      expect(staffResponse.status()).toBe(200);
      const staffPayload = (await staffResponse.json()) as { staff: Array<{ staffId: string; isActive: boolean }> };
      staffId = staffPayload.staff.find((member) => member.isActive)?.staffId ?? null;
      expect(staffId).toBeTruthy();

      const serviceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `Buffer test ${token}`, 'zh-hant': `Buffer test ${token}`, en: `Buffer test ${token}` },
          description: { ko: 'Buffer test', 'zh-hant': 'Buffer test', en: 'Buffer test' },
          durationMinutes: 30,
          priceTwd: 0,
          image: '',
          category: 'consultation',
          staffIds: [staffId],
          requiredResourceIds: [REQUIRED_RESOURCE_ID],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          maxParticipants: 1,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'free',
          priceCurrency: 'TWD',
          reminderOffsetsHours: [24],
        },
      });
      expect(serviceResponse.status()).toBe(201);
      createdService = ((await serviceResponse.json()) as { service: BookingService }).service;
      expect(createdService.requiredResourceIds).toEqual([REQUIRED_RESOURCE_ID]);

      const baseAvailabilityResponse = await page.request.get(
        `/api/booking/availability?serviceId=${createdService.serviceId}&staffId=${staffId}&date=${BOOKING_DATE}`,
        { headers },
      );
      expect(baseAvailabilityResponse.status()).toBe(200);
      const baseSlots = (await baseAvailabilityResponse.json() as { slots: Array<{ startAt: string }> }).slots;
      expect(baseSlots.length).toBeGreaterThan(3);
      const bookingIndex = Math.floor(baseSlots.length / 2);
      const bookingStartAt = baseSlots[bookingIndex].startAt;
      const previousSlot = baseSlots[bookingIndex - 1].startAt;
      const nextSlot = baseSlots[bookingIndex + 1].startAt;
      const laterSlot = baseSlots[bookingIndex + 2]?.startAt ?? null;

      const bookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
        headers,
        data: {
          serviceId: createdService.serviceId,
          staffId,
          startAt: bookingStartAt,
          customer: {
            name: `Buffer Customer ${token}`,
            email: `buffer-${token}@example.com`,
            locale: 'ko',
          },
        },
      });
      expect(bookingResponse.status()).toBe(201);
      createdBookingId = ((await bookingResponse.json()) as { booking: { bookingId: string } }).booking.bookingId;

      const originalResource = original;
      if (!originalResource) throw new Error('Missing original resource snapshot');
      const nextResource = {
        name: originalResource.name,
        description: originalResource.description,
        location: originalResource.location,
        capacity: 1,
        bufferBeforeMinutes: 30,
        bufferAfterMinutes: 30,
        blockedDates: originalResource.blockedDates ?? [],
        isActive: originalResource.isActive,
      };
      const patchResponse = await page.request.patch(`/api/builder/bookings/resources/${REQUIRED_RESOURCE_ID}`, {
        headers,
        data: nextResource,
      });
      expect(patchResponse.status()).toBe(200);

      await page.goto('/ko/admin-builder/bookings/resources', { waitUntil: 'domcontentloaded' });
      const resourceCard = page.locator(`[data-booking-resource-card="${REQUIRED_RESOURCE_ID}"]`);
      await expect(resourceCard).toBeVisible();
      await expect(resourceCard).toContainText(/Buffers 30m before \/ 30m after|버퍼 시작 전 30분 \/ 종료 후 30분/);
      await resourceCard.getByRole('button', { name: /^Edit$|^편집$/ }).click();
      const editor = page.locator('[data-booking-resource-blocked-editor="true"]');
      await expect(editor).toBeVisible();
      await expect(page.locator('[data-booking-resource-buffer-before="true"]')).toHaveValue('30');
      await expect(page.locator('[data-booking-resource-buffer-after="true"]')).toHaveValue('30');

      await page.goto('/ko/admin-builder/bookings/services', { waitUntil: 'domcontentloaded' });
      await expect(page.locator(`[data-booking-service-card="${createdService.serviceId}"]`)).toContainText(/Resources: 상담실|자원: 상담실/);

      const availabilityResponse = await page.request.get(
        `/api/booking/availability?serviceId=${createdService.serviceId}&staffId=${staffId}&date=${BOOKING_DATE}`,
        { headers },
      );
      expect(availabilityResponse.status()).toBe(200);
      const availabilityPayload = (await availabilityResponse.json()) as { slots: Array<{ startAt: string }> };
      const starts = availabilityPayload.slots.map((slot) => slot.startAt);
      expect(starts).not.toContain(previousSlot);
      expect(starts).not.toContain(bookingStartAt);
      expect(starts).not.toContain(nextSlot);
      if (laterSlot) {
        expect(starts).toContain(laterSlot);
      }
    } finally {
      if (createdBookingId) {
        await page.request.patch(`/api/builder/bookings/${createdBookingId}`, {
          headers,
          failOnStatusCode: false,
          data: { status: 'cancelled' },
        });
      }
      if (createdService) {
        await page.request.delete(`/api/builder/bookings/services/${createdService.serviceId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (original) {
        await page.request.patch(`/api/builder/bookings/resources/${REQUIRED_RESOURCE_ID}`, {
          headers,
          failOnStatusCode: false,
          data: restoreResourcePayload(original),
        });
      }
    }
  });

  test('resource recurring weekly hours trim public booking slots and stay visible in the admin editor', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(`${token}-weekly`);
    page.setExtraHTTPHeaders(headers);

    let original: BookingResource | null = null;
    let createdService: BookingService | null = null;
    let staffId: string | null = null;

    try {
      const resourcesResponse = await page.request.get('/api/builder/bookings/resources?includeInactive=1', { headers });
      expect(resourcesResponse.status()).toBe(200);
      const resourcesPayload = (await resourcesResponse.json()) as { resources: BookingResource[] };
      original = resourcesPayload.resources.find((resource) => resource.resourceId === REQUIRED_RESOURCE_ID) ?? null;
      expect(original).toBeTruthy();

      const staffResponse = await page.request.get('/api/builder/bookings/staff?includeInactive=1', { headers });
      expect(staffResponse.status()).toBe(200);
      const staffPayload = (await staffResponse.json()) as { staff: Array<{ staffId: string; isActive: boolean }> };
      staffId = staffPayload.staff.find((member) => member.isActive)?.staffId ?? null;
      expect(staffId).toBeTruthy();

      const serviceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `Recurring resource ${token}`, 'zh-hant': `Recurring resource ${token}`, en: `Recurring resource ${token}` },
          description: { ko: 'Recurring resource test', 'zh-hant': 'Recurring resource test', en: 'Recurring resource test' },
          durationMinutes: 30,
          priceTwd: 0,
          image: '',
          category: 'consultation',
          staffIds: [staffId],
          requiredResourceIds: [REQUIRED_RESOURCE_ID],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          maxParticipants: 1,
          slotStepMinutes: 15,
          isActive: true,
          paymentMode: 'free',
          priceCurrency: 'TWD',
          reminderOffsetsHours: [24],
        },
      });
      expect(serviceResponse.status()).toBe(201);
      createdService = ((await serviceResponse.json()) as { service: BookingService }).service;

      const beforeResponse = await page.request.get(
        `/api/booking/availability?serviceId=${createdService.serviceId}&staffId=${staffId}&date=${BOOKING_DATE}`,
        { headers },
      );
      expect(beforeResponse.status()).toBe(200);
      const beforeSlots = (await beforeResponse.json()) as { slots: Array<{ startAt: string }> };
      expect(beforeSlots.slots.length).toBeGreaterThan(2);

      await page.goto('/ko/admin-builder/bookings/resources', { waitUntil: 'domcontentloaded' });
      const resourceCard = page.locator(`[data-booking-resource-card="${REQUIRED_RESOURCE_ID}"]`);
      await expect(resourceCard).toBeVisible();
      await expect(resourceCard).toContainText(/Recurring Weekdays 09:00-18:00|반복 Weekdays 09:00-18:00/);
      await resourceCard.getByRole('button', { name: /^Edit$|^편집$/ }).click();

      const editor = page.locator('[data-booking-resource-weekly-editor="true"]');
      await expect(editor).toBeVisible();
      await page.locator('[data-booking-resource-recurring-template="true"]').selectOption('clear');

      const mondayRow = page.locator('[data-booking-resource-weekly-day="monday"]');
      await expect(mondayRow).toBeVisible();
      await mondayRow.getByRole('checkbox').check();
      await expect(page.getByLabel(/Monday start 1|월요일 시작 1/)).toHaveValue('09:00');
      await expect(page.getByLabel(/Monday end 1|월요일 종료 1/)).toHaveValue('18:00');
      await page.getByLabel(/Monday start 1|월요일 시작 1/).fill('09:00');
      await page.getByLabel(/Monday end 1|월요일 종료 1/).fill('09:45');

      await page.locator('[data-booking-resource-timezone="true"]').selectOption('Asia/Taipei');
      await page.getByRole('button', { name: /^Save resource$|^자원 저장$/ }).click();
      await expect(page.locator(`[data-booking-resource-card="${REQUIRED_RESOURCE_ID}"]`)).toContainText(/Custom weekly calendar|사용자 지정 주간 캘린더/);
      await expect(page.locator(`[data-booking-resource-card="${REQUIRED_RESOURCE_ID}"]`)).toContainText('Asia/Taipei');

      const afterResponse = await page.request.get(
        `/api/booking/availability?serviceId=${createdService.serviceId}&staffId=${staffId}&date=${BOOKING_DATE}`,
        { headers },
      );
      expect(afterResponse.status()).toBe(200);
      const afterSlots = (await afterResponse.json()) as { slots: Array<{ startAt: string }> };
      expect(afterSlots.slots.length).toBeLessThan(beforeSlots.slots.length);
    } finally {
      if (createdService) {
        await page.request.delete(`/api/builder/bookings/services/${createdService.serviceId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (original) {
        await page.request.patch(`/api/builder/bookings/resources/${REQUIRED_RESOURCE_ID}`, {
          headers,
          failOnStatusCode: false,
          data: restoreResourcePayload(original),
        });
      }
    }
  });

  test('resource capacity allows overlapping bookings up to the configured limit', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(`${token}-capacity`);
    page.setExtraHTTPHeaders(headers);

    let original: BookingResource | null = null;
    let firstService: BookingService | null = null;
    let secondService: BookingService | null = null;
    let staffA: string | null = null;
    let staffB: string | null = null;

    try {
      const resourcesResponse = await page.request.get('/api/builder/bookings/resources?includeInactive=1', { headers });
      expect(resourcesResponse.status()).toBe(200);
      const resourcesPayload = (await resourcesResponse.json()) as { resources: BookingResource[] };
      original = resourcesPayload.resources.find((resource) => resource.resourceId === REQUIRED_RESOURCE_ID) ?? null;
      expect(original).toBeTruthy();

      const staffResponse = await page.request.get('/api/builder/bookings/staff?includeInactive=1', { headers });
      expect(staffResponse.status()).toBe(200);
      const staffPayload = (await staffResponse.json()) as { staff: Array<{ staffId: string; isActive: boolean }> };
      const activeStaff = staffPayload.staff.filter((member) => member.isActive).map((member) => member.staffId);
      [staffA, staffB] = activeStaff.slice(0, 2);
      expect(staffA).toBeTruthy();
      expect(staffB).toBeTruthy();

      const firstServiceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `Capacity A ${token}`, 'zh-hant': `Capacity A ${token}`, en: `Capacity A ${token}` },
          description: { ko: 'Capacity A', 'zh-hant': 'Capacity A', en: 'Capacity A' },
          durationMinutes: 30,
          priceTwd: 0,
          image: '',
          category: 'consultation',
          staffIds: [staffA],
          requiredResourceIds: [REQUIRED_RESOURCE_ID],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          maxParticipants: 1,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'free',
          priceCurrency: 'TWD',
          reminderOffsetsHours: [24],
        },
      });
      expect(firstServiceResponse.status()).toBe(201);
      firstService = ((await firstServiceResponse.json()) as { service: BookingService }).service;

      const secondServiceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `Capacity B ${token}`, 'zh-hant': `Capacity B ${token}`, en: `Capacity B ${token}` },
          description: { ko: 'Capacity B', 'zh-hant': 'Capacity B', en: 'Capacity B' },
          durationMinutes: 30,
          priceTwd: 0,
          image: '',
          category: 'consultation',
          staffIds: [staffB],
          requiredResourceIds: [REQUIRED_RESOURCE_ID],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          maxParticipants: 1,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'free',
          priceCurrency: 'TWD',
          reminderOffsetsHours: [24],
        },
      });
      expect(secondServiceResponse.status()).toBe(201);
      secondService = ((await secondServiceResponse.json()) as { service: BookingService }).service;

      const firstAvailabilityResponse = await page.request.get(
        `/api/booking/availability?serviceId=${firstService.serviceId}&staffId=${staffA}&date=${BOOKING_DATE}`,
        { headers },
      );
      expect(firstAvailabilityResponse.status()).toBe(200);
      const firstAvailabilitySlots = (await firstAvailabilityResponse.json()) as { slots: Array<{ startAt: string }> };

      const secondAvailabilityResponse = await page.request.get(
        `/api/booking/availability?serviceId=${secondService.serviceId}&staffId=${staffB}&date=${BOOKING_DATE}`,
        { headers },
      );
      expect(secondAvailabilityResponse.status()).toBe(200);
      const secondAvailabilitySlots = (await secondAvailabilityResponse.json()) as { slots: Array<{ startAt: string }> };

      const bookingStartAt = firstAvailabilitySlots.slots.find((slot) =>
        secondAvailabilitySlots.slots.some((candidate) => candidate.startAt === slot.startAt),
      )?.startAt;
      expect(bookingStartAt).toBeTruthy();
      if (!bookingStartAt) throw new Error('No shared availability slot found for capacity test');

      const bookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
        headers,
        data: {
          serviceId: firstService.serviceId,
          staffId: staffA,
          startAt: bookingStartAt,
          customer: {
            name: `Capacity Customer ${token}`,
            email: `capacity-${token}@example.com`,
            locale: 'ko',
          },
        },
      });
      expect(bookingResponse.status()).toBe(201);

      const beforeCapacityResponse = await page.request.get(
        `/api/booking/availability?serviceId=${secondService.serviceId}&staffId=${staffB}&date=${BOOKING_DATE}`,
        { headers },
      );
      expect(beforeCapacityResponse.status()).toBe(200);
      const beforeCapacitySlots = (await beforeCapacityResponse.json()) as { slots: Array<{ startAt: string }> };
      expect(beforeCapacitySlots.slots.map((slot) => slot.startAt)).toContain(bookingStartAt);

      const originalResource = original;
      if (!originalResource) throw new Error('Missing original resource snapshot');
      const patchedCapacityResponse = await page.request.patch(`/api/builder/bookings/resources/${REQUIRED_RESOURCE_ID}`, {
        headers,
        data: {
          name: originalResource.name,
          description: originalResource.description,
          location: originalResource.location,
          capacity: 1,
          bufferBeforeMinutes: originalResource.bufferBeforeMinutes ?? 0,
          bufferAfterMinutes: originalResource.bufferAfterMinutes ?? 0,
          weekly: originalResource.weekly,
          timezone: originalResource.timezone,
          recurringTemplateId: originalResource.recurringTemplateId,
          blockedDates: originalResource.blockedDates ?? [],
          isActive: originalResource.isActive,
        },
      });
      expect(patchedCapacityResponse.status()).toBe(200);

      const afterCapacityResponse = await page.request.get(
        `/api/booking/availability?serviceId=${secondService.serviceId}&staffId=${staffB}&date=${BOOKING_DATE}`,
        { headers },
      );
      expect(afterCapacityResponse.status()).toBe(200);
      const afterCapacitySlots = (await afterCapacityResponse.json()) as { slots: Array<{ startAt: string }> };
      expect(afterCapacitySlots.slots.map((slot) => slot.startAt)).not.toContain(bookingStartAt);
    } finally {
      if (firstService) {
        await page.request.delete(`/api/builder/bookings/services/${firstService.serviceId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (secondService) {
        await page.request.delete(`/api/builder/bookings/services/${secondService.serviceId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (original) {
        await page.request.patch(`/api/builder/bookings/resources/${REQUIRED_RESOURCE_ID}`, {
          headers,
          failOnStatusCode: false,
          data: restoreResourcePayload(original),
        });
      }
    }
  });

  test('inactive required resources surface warnings in the service card and editor', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(`${token}-inactive`);
    page.setExtraHTTPHeaders(headers);

    let original: BookingResource | null = null;
    let createdService: BookingService | null = null;
    let staffId: string | null = null;

    try {
      const resourcesResponse = await page.request.get('/api/builder/bookings/resources?includeInactive=1', { headers });
      expect(resourcesResponse.status()).toBe(200);
      const resourcesPayload = (await resourcesResponse.json()) as { resources: BookingResource[] };
      original = resourcesPayload.resources.find((resource) => resource.resourceId === REQUIRED_RESOURCE_ID) ?? null;
      expect(original).toBeTruthy();

      const staffResponse = await page.request.get('/api/builder/bookings/staff?includeInactive=1', { headers });
      expect(staffResponse.status()).toBe(200);
      const staffPayload = (await staffResponse.json()) as { staff: Array<{ staffId: string; isActive: boolean }> };
      staffId = staffPayload.staff.find((member) => member.isActive)?.staffId ?? null;
      expect(staffId).toBeTruthy();

      const serviceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `Inactive resource ${token}`, 'zh-hant': `Inactive resource ${token}`, en: `Inactive resource ${token}` },
          description: { ko: 'Inactive resource warning', 'zh-hant': 'Inactive resource warning', en: 'Inactive resource warning' },
          durationMinutes: 30,
          priceTwd: 0,
          image: '',
          category: 'consultation',
          staffIds: [staffId],
          requiredResourceIds: [REQUIRED_RESOURCE_ID],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          maxParticipants: 1,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'free',
          priceCurrency: 'TWD',
          reminderOffsetsHours: [24],
        },
      });
      expect(serviceResponse.status()).toBe(201);
      createdService = ((await serviceResponse.json()) as { service: BookingService }).service;

      const originalResource = original;
      if (!originalResource) throw new Error('Missing original resource snapshot');
      const deactivateResponse = await page.request.patch(`/api/builder/bookings/resources/${REQUIRED_RESOURCE_ID}`, {
        headers,
        data: {
          name: originalResource.name,
          description: originalResource.description,
          location: originalResource.location,
          capacity: originalResource.capacity,
          bufferBeforeMinutes: originalResource.bufferBeforeMinutes ?? 0,
          bufferAfterMinutes: originalResource.bufferAfterMinutes ?? 0,
          blockedDates: originalResource.blockedDates ?? [],
          isActive: false,
        },
      });
      expect(deactivateResponse.status()).toBe(200);

      await page.goto('/ko/admin-builder/bookings/services', { waitUntil: 'domcontentloaded' });
      const serviceCard = page.locator(`[data-booking-service-card="${createdService.serviceId}"]`);
      await expect(serviceCard).toContainText(/Inactive resources: 상담실|비활성 자원: 상담실/);
      await expect(page.locator(`[data-booking-service-resource-warning="${createdService.serviceId}"]`)).toBeVisible();

      await serviceCard.getByRole('button', { name: /^Edit$|^편집$/ }).click();
      await expect(page.getByText(/Edit service|서비스 편집/)).toBeVisible();
      await expect(page.locator('[data-booking-service-resource-warning-editor="true"]')).toContainText(/Inactive resources: 상담실|비활성 자원: 상담실/);
    } finally {
      if (createdService) {
        await page.request.delete(`/api/builder/bookings/services/${createdService.serviceId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (original) {
        await page.request.patch(`/api/builder/bookings/resources/${REQUIRED_RESOURCE_ID}`, {
          headers,
          failOnStatusCode: false,
          data: restoreResourcePayload(original),
        });
      }
    }
  });
});
