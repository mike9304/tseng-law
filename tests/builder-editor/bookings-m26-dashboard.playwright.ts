import { readFile, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { dayOfWeeks } from '@/lib/builder/bookings/types';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-m26';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

function allWeek(start: string, end: string) {
  return Object.fromEntries(dayOfWeeks.map((day) => [day, [{ start, end }]]));
}

function todayPlus(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function toLocalInputValue(iso: string): string {
  const date = new Date(iso);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function shiftDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function shiftMonthKey(month: string, delta: number): string {
  const [year, monthNumber] = month.split('-').map(Number);
  const next = new Date(year, (monthNumber || 1) - 1 + delta, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
}

const zoomMockPath = join(process.cwd(), 'runtime-data', 'builder-bookings', 'zoom-mock.json');
const zoomMockBaseUrl = 'https://meet.example.com/mock';

test.describe('M26 Bookings dashboard and service operations', () => {
  test.setTimeout(180_000);

  test('covers dashboard filters, reschedule, no-show, and meeting/cancel policy settings', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(token);
    let staffId: string | null = null;
    let serviceId: string | null = null;
    let bookingId: string | null = null;

    await page.setExtraHTTPHeaders(headers);

    try {
      await writeFile(zoomMockPath, JSON.stringify({ meetingLinkBase: zoomMockBaseUrl }, null, 2), 'utf8');

      const staffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `M26 변호사 ${token}`, 'zh-hant': `M26 律師 ${token}`, en: `M26 Attorney ${token}` },
          title: { ko: '예약 운영 담당', 'zh-hant': '預約管理', en: 'Booking Operator' },
          bio: { ko: 'M26 예약 운영 검증 담당자', 'zh-hant': 'M26 預約管理測試', en: 'M26 dashboard test counsel' },
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
          name: { ko: `M26 줌 상담 ${token}`, 'zh-hant': `M26 Zoom 諮詢 ${token}`, en: `M26 Zoom Consultation ${token}` },
          description: { ko: 'M26 관리자 대시보드 검증', 'zh-hant': 'M26 管理測試', en: 'M26 dashboard check' },
          durationMinutes: 30,
          priceTwd: 7000,
          image: '',
          category: 'consultation',
          staffIds: [staffId],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'paid',
          priceAmount: 7000,
          priceCurrency: 'TWD',
          meetingMode: 'zoom',
          cancellationPolicyId: 'standard-24h',
        },
      });
      expect(serviceResponse.status()).toBe(201);
      const servicePayload = (await serviceResponse.json()) as { service: { serviceId: string; meetingMode?: string; cancellationPolicyId?: string } };
      serviceId = servicePayload.service.serviceId;
      expect(servicePayload.service).toMatchObject({ meetingMode: 'zoom', cancellationPolicyId: 'standard-24h' });

      const availabilityResponse = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: {
          weekly: allWeek('09:00', '17:00'),
          blockedDates: [],
          timezone: 'Asia/Seoul',
        },
      });
      expect(availabilityResponse.status()).toBe(200);

      const bookingDate = todayPlus(2);
      const slotResponse = await page.request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${bookingDate}`, {
        headers,
        timeout: 45_000,
      });
      expect(slotResponse.status()).toBe(200);
      const slots = ((await slotResponse.json()) as { slots: Array<{ startAt: string }> }).slots;
      expect(slots.length).toBeGreaterThan(2);
      const startAt = slots[0].startAt;
      const rescheduledStartAt = slots[2].startAt;

      const bookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
        headers,
        timeout: 45_000,
        data: {
          serviceId,
          staffId,
          startAt,
          status: 'pending',
          paymentIntentId: `pi_m26_${token}`,
          customerTimezone: 'Asia/Seoul',
          customer: {
            name: `M26 고객 ${token}`,
            email: `m26-${token}@example.com`,
            phone: '+82105550000',
            notes: 'M26 dashboard row',
            caseSummary: '대시보드에서 상태와 시간을 조정합니다.',
            locale: 'ko',
          },
        },
      });
      expect(bookingResponse.status()).toBe(201);
      const bookingPayload = (await bookingResponse.json()) as { booking: { bookingId: string; meetingLink?: string } };
      bookingId = bookingPayload.booking.bookingId;
      expect(bookingPayload.booking.meetingLink).toContain('timezone=Asia%2FSeoul');
      const webhookResponse = await page.request.post('/api/booking/stripe-webhook', {
        headers,
        data: {
          id: `evt-m26-${token}`,
          type: 'payment_intent.succeeded',
          data: { object: { id: `pi_m26_${token}`, amount: 7000, currency: 'twd' } },
        },
      });
      expect(webhookResponse.status()).toBe(200);
      await expect(webhookResponse.json()).resolves.toMatchObject({ bookingUpdated: true });

      await page.goto('/ko/admin-builder/bookings/dashboard', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-booking-dashboard="true"]')).toBeVisible();
      const analytics = page.locator('[data-booking-analytics="true"]');
      await expect(analytics).toBeVisible();
      await expect(analytics.getByText('완료율', { exact: true })).toBeVisible();
      await expect(analytics.getByText('고객', { exact: true })).toBeVisible();
      await expect(page.getByText('출처 귀속', { exact: true })).toBeVisible();
      await expect(page.getByText('출처 퍼널', { exact: true })).toBeVisible();
      await expect(page.getByText('알림', { exact: true })).toBeVisible();
      await expect(page.getByText('추세', { exact: true })).toBeVisible();
      await expect(page.getByText('활용도', { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: '보이는 CSV 내보내기' })).toBeVisible();
      await expect(page.getByRole('button', { name: '리포트 JSON 내보내기' })).toBeVisible();
      const actionQueue = page.locator('[data-booking-action-queue="true"]');
      await expect(actionQueue).toBeVisible();
      await expect(actionQueue.getByText('오늘 처리할 항목', { exact: true })).toBeVisible();
      await actionQueue.locator('[data-booking-action-filter="pending"]').click();
      const actionRow = actionQueue.locator(`[data-booking-action-row="booking:${bookingId}"]`);
      await expect(actionRow).toBeVisible();
      await actionRow.locator(`[data-booking-action-open="booking:${bookingId}"]`).click();
      await expect(page.locator('[data-booking-timeline="true"]')).toBeVisible();
      await page.locator(`[data-booking-detail-close="${bookingId}"]`).click();
      await expect(page).toHaveTitle(/예약 대시보드/);
      await expect(page.getByRole('link', { name: '대시보드' })).toHaveAttribute('data-active', 'true');
      await page.getByPlaceholder('이름, 이메일, 메모, 서비스').fill(token);
      await page.getByLabel('상태').selectOption('pending');
      const row = page.locator(`[data-booking-row="${bookingId}"]`);
      await expect(row).toBeVisible();
      await expect(row).toContainText('회 방문');
      await row.click();
      await expect(page.locator('[data-booking-timeline="true"]')).toBeVisible();
      await expect(page.locator('[data-booking-office-time="true"]')).toBeVisible();
      await expect(page.locator('[data-booking-office-timezone="true"]')).toContainText('Asia/Seoul');
      await expect(page.locator('[data-customer-profile="true"]')).toContainText('총 방문');
      await expect(page.locator(`[data-customer-history-item="${bookingId}"]`)).toBeVisible();
      const invoiceResponse = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/${bookingId}/documents`) && response.request().method() === 'POST',
        { timeout: 45_000 },
      );
      await page.locator(`[data-booking-document-issue="${bookingId}:invoice"]`).click();
      await expect((await invoiceResponse).json()).resolves.toMatchObject({ document: { type: 'invoice', status: 'issued' } });
      await expect(page.locator(`[data-booking-document-row="${bookingId}:invoice"][data-booking-document-status="issued"]`)).toBeVisible();

      const invoiceEmailResponse = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/${bookingId}/documents`) && response.request().method() === 'POST',
        { timeout: 45_000 },
      );
      await page.locator(`[data-booking-document-email="${bookingId}:invoice"]`).click();
      await expect((await invoiceEmailResponse).json()).resolves.toMatchObject({ document: { type: 'invoice', status: 'emailed_stub' } });
      await expect(page.locator(`[data-booking-document-row="${bookingId}:invoice"][data-booking-document-status="emailed_stub"]`)).toBeVisible();

      const receiptResponse = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/${bookingId}/documents`) && response.request().method() === 'POST',
        { timeout: 45_000 },
      );
      await page.locator(`[data-booking-document-issue="${bookingId}:receipt"]`).click();
      await expect((await receiptResponse).json()).resolves.toMatchObject({ document: { type: 'receipt', status: 'issued' } });
      await expect(page.locator(`[data-booking-document-row="${bookingId}:receipt"][data-booking-document-status="issued"]`)).toBeVisible();

      const receiptEmailResponse = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/${bookingId}/documents`) && response.request().method() === 'POST',
        { timeout: 45_000 },
      );
      await page.locator(`[data-booking-document-email="${bookingId}:receipt"]`).click();
      await expect((await receiptEmailResponse).json()).resolves.toMatchObject({ document: { type: 'receipt', status: 'emailed_stub' } });
      await expect(page.locator(`[data-booking-document-row="${bookingId}:receipt"][data-booking-document-status="emailed_stub"]`)).toBeVisible();

      const noShowResponse = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/${bookingId}`) && response.request().method() === 'PATCH',
        { timeout: 45_000 },
      );
      await page.getByRole('button', { name: '노쇼', exact: true }).click();
      const noShowPayload = (await (await noShowResponse).json()) as { booking: { status: string } };
      expect(noShowPayload.booking.status).toBe('no-show');
      await expect(page.locator('[data-booking-status="no-show"]').first()).toBeVisible();
      const alerts = page.locator('[data-booking-alerts="true"]');
      await expect(alerts).toBeVisible();
      await expect(alerts.locator('[data-booking-alert="no-show-follow-up"]')).toBeVisible();

      const rescheduleResponse = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/${bookingId}`) && response.request().method() === 'PATCH',
        { timeout: 45_000 },
      );
      await page.getByLabel('시작 시간').fill(toLocalInputValue(rescheduledStartAt));
      await page.getByRole('button', { name: '재조정 저장' }).click();
      const reschedulePayload = (await (await rescheduleResponse).json()) as { booking: { startAt: string; staffId: string } };
      expect(reschedulePayload.booking.startAt).toBe(rescheduledStartAt);
      expect(reschedulePayload.booking.staffId).toBe(staffId);

      const confirmResponse = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/${bookingId}`) && response.request().method() === 'PATCH',
        { timeout: 45_000 },
      );
      await page.getByRole('button', { name: '확정' }).click();
      const confirmPayload = (await (await confirmResponse).json()) as { booking: { status: string } };
      expect(confirmPayload.booking.status).toBe('confirmed');

      await page.goto('/zh-hant/admin-builder/bookings/dashboard', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveTitle(/預約儀表板/);
      await expect(page.getByRole('link', { name: '總覽' })).toHaveAttribute('data-active', 'true');
      await expect(page.locator('[data-booking-analytics="true"]').getByText('完成率', { exact: true })).toBeVisible();
      await expect(page.locator('[data-booking-analytics="true"]').getByText('客戶', { exact: true })).toBeVisible();
      await expect(page.getByText('來源歸因', { exact: true })).toBeVisible();
      await expect(page.getByText('今日待處理', { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: '匯出報表 JSON' })).toBeVisible();
      await expect(page.getByRole('button', { name: '匯出顯示中的 CSV' })).toBeVisible();

      await page.goto('/ko/admin-builder/bookings/services', { waitUntil: 'domcontentloaded' });
      await page.getByText(`M26 줌 상담 ${token}`).scrollIntoViewIfNeeded();
      await expect(page.getByText('zoom').first()).toBeVisible();
      await expect(page.getByText('정책 standard-24h').first()).toBeVisible();

      await page.goto('/ko/admin-builder/bookings/calendar', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-calendar-view="month"]')).toBeVisible();
      await page.getByRole('button', { name: '주간' }).click();
      await expect(page.locator('[data-calendar-view="week"]')).toBeVisible();
      await page.getByRole('button', { name: '목록' }).click();
      await expect(page.locator('[data-calendar-view="list"]')).toBeVisible();
    } finally {
      await unlink(zoomMockPath).catch(() => undefined);
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
    }
  });

  test('restores calendar month, view, and staff filter from the URL', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(`calendar-url-${token}`);
    let staffId: string | null = null;
    let serviceId: string | null = null;
    let bookingId: string | null = null;

    await page.setExtraHTTPHeaders(headers);

    try {
      const staffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `M26 캘린더 담당 ${token}`, 'zh-hant': `M26 Calendar ${token}`, en: `M26 Calendar ${token}` },
          title: { ko: '예약 운영 담당', 'zh-hant': '預約管理', en: 'Booking Operator' },
          bio: { ko: '', 'zh-hant': '', en: '' },
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
          name: { ko: `M26 캘린더 상담 ${token}`, 'zh-hant': `M26 Calendar ${token}`, en: `M26 Calendar Consultation ${token}` },
          description: { ko: '', 'zh-hant': '', en: '' },
          durationMinutes: 30,
          priceTwd: 5000,
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
          meetingMode: 'zoom',
          cancellationPolicyId: 'standard-24h',
        },
      });
      expect(serviceResponse.status()).toBe(201);
      serviceId = ((await serviceResponse.json()) as { service: { serviceId: string } }).service.serviceId;

      const availabilityResponse = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: {
          weekly: allWeek('09:00', '17:00'),
          blockedDates: [],
          timezone: 'Asia/Seoul',
        },
      });
      expect(availabilityResponse.status()).toBe(200);

      const bookingDate = todayPlus(2);
      const bookingMonth = bookingDate.slice(0, 7);
      const slotResponse = await page.request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${bookingDate}`, {
        headers,
        timeout: 45_000,
      });
      expect(slotResponse.status()).toBe(200);
      const slots = ((await slotResponse.json()) as { slots: Array<{ startAt: string }> }).slots;
      expect(slots.length).toBeGreaterThan(0);

      const bookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
        headers,
        timeout: 45_000,
        data: {
          serviceId,
          staffId,
          startAt: slots[0].startAt,
          status: 'confirmed',
          paymentIntentId: `pi_calendar_${token}`,
          customerTimezone: 'Asia/Seoul',
          customer: {
            name: `M26 캘린더 고객 ${token}`,
            email: `calendar-${token}@example.com`,
            phone: '',
            notes: 'Calendar deep link test',
            caseSummary: 'Verify calendar URL state.',
            locale: 'ko',
          },
        },
      });
      expect(bookingResponse.status()).toBe(201);
      const bookingPayload = (await bookingResponse.json()) as { booking: { bookingId: string; meetingLink?: string } };
      bookingId = bookingPayload.booking.bookingId;
      expect(bookingPayload.booking.meetingLink).toContain('timezone=Asia%2FSeoul');

      await page.goto(`/ko/admin-builder/bookings/calendar?month=${bookingMonth}&view=list&staffId=${staffId}`, {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.locator('[data-calendar-view="list"]')).toBeVisible();
      await expect(page.locator('[data-bookings-calendar-staff-filter="true"]')).toHaveValue(staffId);
      await expect(page.locator('[data-bookings-calendar-month="true"]')).toContainText(bookingMonth);
      await expect(page.getByText(`M26 캘린더 고객 ${token}`)).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`month=${bookingMonth}`));
      await expect(page).toHaveURL(/view=list/);
      await expect(page).toHaveURL(new RegExp(`staffId=${staffId}`));

      await page.getByRole('button', { name: '주간' }).click();
      await expect(page.locator('[data-calendar-view="week"]')).toBeVisible();
      await expect(page).toHaveURL(/view=week/);

      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-calendar-view="week"]')).toBeVisible();
      await expect(page.locator('[data-bookings-calendar-staff-filter="true"]')).toHaveValue(staffId);
      await expect(page.locator('[data-bookings-calendar-month="true"]')).toContainText(bookingMonth);
      // The week grid is anchored on *today*; the booking (today + 2) is only rendered when its
      // day cell falls inside the rendered week (Thu–Sat runs put it in the next week).
      const weekEntry = page.locator(`[data-calendar-view="week"] [data-calendar-entry-id="${bookingId}"]`);
      if (await page.locator(`[data-calendar-view="week"] [data-calendar-day="${bookingDate}"]`).count() > 0) {
        await expect(weekEntry).toContainText(`M26 캘린더 고객 ${token}`);
      } else {
        await expect(weekEntry).toHaveCount(0);
      }

      const nextMonth = shiftMonthKey(bookingMonth, 1);
      await page.getByRole('button', { name: '다음' }).click();
      await expect(page.locator('[data-bookings-calendar-month="true"]')).toContainText(nextMonth);
      await expect(page).toHaveURL(new RegExp(`month=${nextMonth}`));

      await page.goBack({ waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-bookings-calendar-month="true"]')).toContainText(bookingMonth);
      await expect(page.locator('[data-calendar-view="week"]')).toBeVisible();
      await expect(page.locator('[data-bookings-calendar-staff-filter="true"]')).toHaveValue(staffId);
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
    }
  });

  test('reschedules a booking from the calendar modal', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(`calendar-reschedule-${token}`);
    let primaryStaffId: string | null = null;
    let secondaryStaffId: string | null = null;
    let serviceId: string | null = null;
    let bookingId: string | null = null;

    await page.setExtraHTTPHeaders(headers);

    try {
      await writeFile(zoomMockPath, JSON.stringify({ meetingLinkBase: zoomMockBaseUrl }, null, 2), 'utf8');

      const primaryStaffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `M26 일정 담당 ${token}`, 'zh-hant': `M26 行程 ${token}`, en: `M26 Schedule ${token}` },
          title: { ko: '예약 운영 담당', 'zh-hant': '預約管理', en: 'Booking Operator' },
          bio: { ko: '', 'zh-hant': '', en: '' },
          email: '',
          photo: '',
          isActive: true,
        },
      });
      expect(primaryStaffResponse.status()).toBe(201);
      primaryStaffId = ((await primaryStaffResponse.json()) as { staff: { staffId: string } }).staff.staffId;

      const secondaryStaffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `M26 대체 담당 ${token}`, 'zh-hant': `M26 替代 ${token}`, en: `M26 Backup ${token}` },
          title: { ko: '백업 담당', 'zh-hant': '備用', en: 'Backup' },
          bio: { ko: '', 'zh-hant': '', en: '' },
          email: '',
          photo: '',
          isActive: true,
        },
      });
      expect(secondaryStaffResponse.status()).toBe(201);
      secondaryStaffId = ((await secondaryStaffResponse.json()) as { staff: { staffId: string } }).staff.staffId;

      const serviceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `M26 일정 상담 ${token}`, 'zh-hant': `M26 行程諮詢 ${token}`, en: `M26 Schedule Consultation ${token}` },
          description: { ko: '', 'zh-hant': '', en: '' },
          durationMinutes: 30,
          priceTwd: 6000,
          image: '',
          category: 'consultation',
          staffIds: [primaryStaffId, secondaryStaffId],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'free',
          priceAmount: 0,
          priceCurrency: 'TWD',
          meetingMode: 'zoom',
          cancellationPolicyId: 'standard-24h',
        },
      });
      expect(serviceResponse.status()).toBe(201);
      serviceId = ((await serviceResponse.json()) as { service: { serviceId: string } }).service.serviceId;

      const primaryAvailabilityResponse = await page.request.patch(`/api/builder/bookings/staff/${primaryStaffId}/availability`, {
        headers,
        data: {
          weekly: allWeek('09:00', '17:00'),
          blockedDates: [],
          timezone: 'Asia/Seoul',
        },
      });
      expect(primaryAvailabilityResponse.status()).toBe(200);
      const secondaryAvailabilityResponse = await page.request.patch(`/api/builder/bookings/staff/${secondaryStaffId}/availability`, {
        headers,
        data: {
          weekly: allWeek('09:00', '17:00'),
          blockedDates: [],
          timezone: 'Asia/Taipei',
        },
      });
      expect(secondaryAvailabilityResponse.status()).toBe(200);

      const bookingDate = todayPlus(2);
      const bookingMonth = bookingDate.slice(0, 7);
      const slotResponse = await page.request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${primaryStaffId}&date=${bookingDate}`, {
        headers,
        timeout: 45_000,
      });
      expect(slotResponse.status()).toBe(200);
      const slots = ((await slotResponse.json()) as { slots: Array<{ startAt: string }> }).slots;
      expect(slots.length).toBeGreaterThan(3);
      const initialStartAt = slots[0].startAt;
      const rescheduledStartAt = slots[2].startAt;

      const bookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
        headers,
        timeout: 45_000,
        data: {
          serviceId,
          staffId: primaryStaffId,
          startAt: initialStartAt,
          status: 'confirmed',
          paymentIntentId: `pi_calendar_reschedule_${token}`,
          customerTimezone: 'Asia/Seoul',
          customer: {
            name: `M26 일정 고객 ${token}`,
            email: `schedule-${token}@example.com`,
            phone: '',
            notes: 'Reschedule modal test',
            caseSummary: 'Verify calendar modal reschedule.',
            locale: 'ko',
          },
        },
      });
      expect(bookingResponse.status()).toBe(201);
      const bookingPayload = (await bookingResponse.json()) as { booking: { bookingId: string; meetingLink?: string } };
      bookingId = bookingPayload.booking.bookingId;
      expect(bookingPayload.booking.meetingLink).toContain('timezone=Asia%2FSeoul');

      await page.goto(`/ko/admin-builder/bookings/calendar?month=${bookingMonth}&view=list`, {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.locator('[data-calendar-view="list"]')).toBeVisible();
      await page.locator(`[data-calendar-entry-id="${bookingId}"]`).click();
      await expect(page.locator('[data-booking-calendar-reschedule-start="true"]')).toHaveValue(toLocalInputValue(initialStartAt));
      await expect(page.locator('[data-booking-calendar-reschedule-staff="true"]')).toHaveValue(primaryStaffId);
      await expect(page.locator('[data-booking-calendar-office-time="true"]')).toBeVisible();
      await expect(page.locator('[data-booking-calendar-office-timezone="true"]')).toContainText('Asia/Seoul');

      await page.locator('[data-booking-calendar-reschedule-start="true"]').fill(toLocalInputValue(rescheduledStartAt));
      await page.locator('[data-booking-calendar-reschedule-staff="true"]').selectOption(secondaryStaffId);
      const rescheduleResponse = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/${bookingId}`) && response.request().method() === 'PATCH',
        { timeout: 45_000 },
      );
      await page.locator('[data-booking-calendar-reschedule-save="true"]').click();
      const rescheduleResult = await rescheduleResponse;
      expect(rescheduleResult.status()).toBe(200);

      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator(`[data-calendar-entry-id="${bookingId}"]`)).toHaveAttribute('data-calendar-entry-start-at', rescheduledStartAt);
      await page.locator(`[data-calendar-entry-id="${bookingId}"]`).click();
      await expect(page.locator('[data-booking-calendar-reschedule-start="true"]')).toHaveValue(toLocalInputValue(rescheduledStartAt));
      await expect(page.locator('[data-booking-calendar-reschedule-staff="true"]')).toHaveValue(secondaryStaffId);
      await expect(page.locator('[data-booking-calendar-office-timezone="true"]')).toContainText('Asia/Taipei');

      await page.goto('/ko/admin-builder/bookings/dashboard', { waitUntil: 'domcontentloaded' });
      await page.locator(`[data-booking-row="${bookingId}"]`).click();
      await expect(page.getByRole('link', { name: '미팅 링크' })).toHaveAttribute('href', /timezone=Asia%2FTaipei/);
    } finally {
      await unlink(zoomMockPath).catch(() => undefined);
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
      if (secondaryStaffId) {
        await page.request.delete(`/api/builder/bookings/staff/${secondaryStaffId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (primaryStaffId) {
        await page.request.delete(`/api/builder/bookings/staff/${primaryStaffId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
    }
  });

  test('shows overlapping conflict visualization in the booking modal', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(`calendar-conflict-${token}`);
    let staffId: string | null = null;
    let serviceId: string | null = null;
    let bookingId: string | null = null;

    await page.setExtraHTTPHeaders(headers);

    try {
      const staffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `M26 충돌 담당 ${token}`, 'zh-hant': `M26 衝突 ${token}`, en: `M26 Conflict ${token}` },
          title: { ko: '충돌 확인', 'zh-hant': '衝突', en: 'Conflict check' },
          bio: { ko: '', 'zh-hant': '', en: '' },
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
          name: { ko: `M26 충돌 상담 ${token}`, 'zh-hant': `M26 衝突諮詢 ${token}`, en: `M26 Conflict Consultation ${token}` },
          description: { ko: '', 'zh-hant': '', en: '' },
          durationMinutes: 30,
          priceTwd: 6000,
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
          meetingMode: 'in-person',
          cancellationPolicyId: 'standard-24h',
        },
      });
      expect(serviceResponse.status()).toBe(201);
      serviceId = ((await serviceResponse.json()) as { service: { serviceId: string } }).service.serviceId;

      for (const calendarStaffId of [staffId]) {
        const availabilityResponse = await page.request.patch(`/api/builder/bookings/staff/${calendarStaffId}/availability`, {
          headers,
          data: {
            weekly: allWeek('09:00', '17:00'),
            blockedDates: [],
            timezone: 'Asia/Seoul',
          },
        });
        expect(availabilityResponse.status()).toBe(200);
      }

      const bookingDate = todayPlus(3);
      const bookingMonth = bookingDate.slice(0, 7);
      const slotResponse = await page.request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${bookingDate}`, {
        headers,
        timeout: 45_000,
      });
      expect(slotResponse.status()).toBe(200);
      const slots = ((await slotResponse.json()) as { slots: Array<{ startAt: string; endAt: string }> }).slots;
      expect(slots.length).toBeGreaterThan(3);
      const bookingStartAt = slots[0].startAt;
      const bookingEndAt = slots[0].endAt;

      const bookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
        headers,
        timeout: 45_000,
        data: {
          serviceId,
          staffId,
          startAt: bookingStartAt,
          status: 'confirmed',
          paymentIntentId: `pi_calendar_conflict_${token}`,
          customerTimezone: 'Asia/Seoul',
          customer: {
            name: `M26 충돌 고객 ${token}`,
            email: `conflict-${token}@example.com`,
            phone: '',
            notes: 'Conflict panel test',
            caseSummary: 'Verify calendar conflict visualization.',
            locale: 'ko',
          },
        },
      });
      expect(bookingResponse.status()).toBe(201);
      bookingId = ((await bookingResponse.json()) as { booking: { bookingId: string } }).booking.bookingId;

      const blockedDateResponse = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: {
          weekly: allWeek('09:00', '17:00'),
          blockedDates: [{
            start: bookingStartAt,
            end: bookingEndAt,
            reason: `Provider busy ${token}`,
          }],
          timezone: 'Asia/Seoul',
        },
      });
      expect(blockedDateResponse.status()).toBe(200);

      await page.goto(`/ko/admin-builder/bookings/calendar?month=${bookingMonth}&view=list`, {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.locator('[data-calendar-view="list"]')).toBeVisible();
      await page.locator(`[data-calendar-entry-id="${bookingId}"]`).click();

      const conflictPanel = page.locator('[data-booking-calendar-conflict-count="true"]');
      await expect(conflictPanel).toContainText('1 충돌');
      await expect(page.locator(`[data-booking-calendar-conflict-entry="blocked-${staffId}-0"]`)).toContainText(`Provider busy ${token}`);
      await expect(page.locator(`[data-booking-calendar-conflict-entry="blocked-${staffId}-0"]`)).toContainText('차단');
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
    }
  });

  test('moves a booking by dragging it to another calendar day', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(`calendar-drag-${token}`);
    let staffId: string | null = null;
    let serviceId: string | null = null;
    let bookingId: string | null = null;

    await page.setExtraHTTPHeaders(headers);

    try {
      const staffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `M26 드래그 담당 ${token}`, 'zh-hant': `M26 拖曳 ${token}`, en: `M26 Drag ${token}` },
          title: { ko: '드래그 이동', 'zh-hant': '拖曳', en: 'Drag move' },
          bio: { ko: '', 'zh-hant': '', en: '' },
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
          name: { ko: `M26 드래그 상담 ${token}`, 'zh-hant': `M26 拖曳諮詢 ${token}`, en: `M26 Drag Consultation ${token}` },
          description: { ko: '', 'zh-hant': '', en: '' },
          durationMinutes: 30,
          priceTwd: 5000,
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
          meetingMode: 'in-person',
          cancellationPolicyId: 'standard-24h',
        },
      });
      expect(serviceResponse.status()).toBe(201);
      serviceId = ((await serviceResponse.json()) as { service: { serviceId: string } }).service.serviceId;

      const availabilityResponse = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: {
          weekly: allWeek('09:00', '17:00'),
          blockedDates: [],
          timezone: 'Asia/Seoul',
        },
      });
      expect(availabilityResponse.status()).toBe(200);

      const bookingDate = todayPlus(2);
      const targetDate = shiftDate(3);
      const bookingMonth = bookingDate.slice(0, 7);
      const initialSlotResponse = await page.request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${bookingDate}`, {
        headers,
        timeout: 45_000,
      });
      expect(initialSlotResponse.status()).toBe(200);
      const initialSlots = ((await initialSlotResponse.json()) as { slots: Array<{ startAt: string }> }).slots;
      expect(initialSlots.length).toBeGreaterThan(0);
      const initialStartAt = initialSlots[0].startAt;
      const initialLocal = toLocalInputValue(initialStartAt);

      const targetSlotResponse = await page.request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${targetDate}`, {
        headers,
        timeout: 45_000,
      });
      expect(targetSlotResponse.status()).toBe(200);
      const targetSlots = ((await targetSlotResponse.json()) as { slots: Array<{ startAt: string }> }).slots;
      const targetSlot = targetSlots.find((slot) => toLocalInputValue(slot.startAt).slice(11) === initialLocal.slice(11));
      expect(targetSlot).toBeTruthy();
      const targetStartAt = targetSlot!.startAt;

      const bookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
        headers,
        timeout: 45_000,
        data: {
          serviceId,
          staffId,
          startAt: initialStartAt,
          status: 'confirmed',
          paymentIntentId: `pi_calendar_drag_${token}`,
          customerTimezone: 'Asia/Seoul',
          customer: {
            name: `M26 드래그 고객 ${token}`,
            email: `drag-${token}@example.com`,
            phone: '',
            notes: 'Drag and drop test',
            caseSummary: 'Verify calendar drag and drop.',
            locale: 'ko',
          },
        },
      });
      expect(bookingResponse.status()).toBe(201);
      bookingId = ((await bookingResponse.json()) as { booking: { bookingId: string } }).booking.bookingId;

      await page.goto(`/ko/admin-builder/bookings/calendar?month=${bookingMonth}&view=month`, {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.locator('[data-calendar-view="month"]')).toBeVisible();
      const source = page.locator(`[data-calendar-entry-id="${bookingId}"]`);
      const target = page.locator(`[data-calendar-day="${targetDate}"]`);
      await expect(source).toBeVisible();
      await expect(target).toBeVisible();
      await source.scrollIntoViewIfNeeded();
      const moveResponse = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/${bookingId}`) && response.request().method() === 'PATCH',
        { timeout: 45_000 },
      );
      // Native HTML5 drag via synthetic mouse input is flaky under automation —
      // dispatch dragstart → dragover → drop with a shared DataTransfer so the
      // calendar's React drop handler always fires.
      await page.evaluate(({ sourceSelector, targetSelector }) => {
        const sourceEl = document.querySelector(sourceSelector);
        const targetEl = document.querySelector(targetSelector);
        if (!sourceEl || !targetEl) throw new Error('calendar drag elements missing');
        const dataTransfer = new DataTransfer();
        const fire = (element: Element, type: string) => {
          const rect = element.getBoundingClientRect();
          element.dispatchEvent(new DragEvent(type, {
            bubbles: true,
            cancelable: true,
            dataTransfer,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
          }));
        };
        fire(sourceEl, 'dragstart');
        fire(targetEl, 'dragover');
        fire(targetEl, 'drop');
        fire(sourceEl, 'dragend');
      }, {
        sourceSelector: `[data-calendar-entry-id="${bookingId}"]`,
        targetSelector: `[data-calendar-day="${targetDate}"]`,
      });
      const movePayload = (await (await moveResponse).json()) as { booking: { startAt: string; staffId: string } };
      expect(movePayload.booking.startAt).toBe(targetStartAt);
      expect(movePayload.booking.staffId).toBe(staffId);

      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator(`[data-calendar-day="${targetDate}"] [data-calendar-entry-id="${bookingId}"]`)).toHaveAttribute('data-calendar-entry-start-at', targetStartAt);
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
    }
  });

  test('restores dashboard action filter and search from the URL', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(`dashboard-url-${token}`);
    let staffId: string | null = null;
    let serviceId: string | null = null;
    let publicServiceId: string | null = null;
    let bookingId: string | null = null;
    let publicBookingId: string | null = null;

    await page.setExtraHTTPHeaders(headers);

    try {
      const staffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `M27 대시보드 담당 ${token}`, 'zh-hant': `M27 儀表板 ${token}`, en: `M27 Dashboard Staff ${token}` },
          title: { ko: '대시보드 검증', 'zh-hant': '儀表板測試', en: 'Dashboard test' },
          bio: { ko: '', 'zh-hant': '', en: '' },
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
          name: { ko: `M27 대시보드 상담 ${token}`, 'zh-hant': `M27 儀表板諮詢 ${token}`, en: `M27 Dashboard Consultation ${token}` },
          description: { ko: '', 'zh-hant': '', en: '' },
          durationMinutes: 30,
          priceTwd: 7000,
          image: '',
          category: 'consultation',
          staffIds: [staffId],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          maxParticipants: 1,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'paid',
          priceAmount: 7000,
          priceCurrency: 'TWD',
          meetingMode: 'zoom',
          cancellationPolicyId: 'standard-24h',
          reminderOffsetsHours: [24, 1],
        },
      });
      expect(serviceResponse.status()).toBe(201);
      serviceId = ((await serviceResponse.json()) as { service: { serviceId: string } }).service.serviceId;

      const publicServiceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `M27 대시보드 공개상담 ${token}`, 'zh-hant': `M27 公開諮詢 ${token}`, en: `M27 Public Consultation ${token}` },
          description: { ko: '', 'zh-hant': '', en: '' },
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
          meetingMode: 'in-person',
          cancellationPolicyId: 'standard-24h',
        },
      });
      expect(publicServiceResponse.status()).toBe(201);
      publicServiceId = ((await publicServiceResponse.json()) as { service: { serviceId: string } }).service.serviceId;

      const availabilityResponse = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: {
          weekly: allWeek('09:00', '17:00'),
          blockedDates: [],
          timezone: 'Asia/Seoul',
        },
      });
      expect(availabilityResponse.status()).toBe(200);

      const bookingDate = shiftDate(2);
      const slotResponse = await page.request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${bookingDate}`, {
        headers,
        timeout: 45_000,
      });
      expect(slotResponse.status()).toBe(200);
      const slots = ((await slotResponse.json()) as { slots: Array<{ startAt: string }> }).slots;
      expect(slots.length).toBeGreaterThan(0);

      const bookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
        headers,
        timeout: 45_000,
        data: {
          serviceId,
          staffId,
          startAt: slots[0].startAt,
          status: 'pending',
          paymentIntentId: `pi_dashboard_${token}`,
          customerTimezone: 'Asia/Seoul',
          customer: {
            name: `M27 고객 ${token}`,
            email: `dashboard-${token}@example.com`,
            phone: '+82105550123',
            notes: 'Dashboard URL state',
            caseSummary: 'Verify dashboard URL state.',
            locale: 'ko',
          },
        },
      });
      expect(bookingResponse.status()).toBe(201);
      bookingId = ((await bookingResponse.json()) as { booking: { bookingId: string } }).booking.bookingId;

      const publicBookingDate = shiftDate(4);
      const publicSlotResponse = await page.request.get(`/api/booking/availability?serviceId=${publicServiceId}&staffId=${staffId}&date=${publicBookingDate}`, {
        headers,
        timeout: 45_000,
      });
      expect(publicSlotResponse.status()).toBe(200);
      const publicSlots = ((await publicSlotResponse.json()) as { slots: Array<{ startAt: string }> }).slots;
      expect(publicSlots.length).toBeGreaterThan(0);

      const publicBookingResponse = await page.request.post('/api/booking/book', {
        headers,
        timeout: 45_000,
        data: {
          serviceId: publicServiceId,
          staffId,
          startAt: publicSlots[0].startAt,
          customer: {
            name: `M27 웹 고객 ${token}`,
            email: `web-${token}@example.com`,
            phone: '',
            notes: 'Dashboard source attribution',
            caseSummary: 'Verify source attribution dashboard.',
            locale: 'ko',
          },
          customerTimezone: 'Asia/Seoul',
        },
      });
      expect(publicBookingResponse.status()).toBe(201);
      publicBookingId = ((await publicBookingResponse.json()) as { bookingId: string }).bookingId;

      await page.goto(`/ko/admin-builder/bookings/dashboard?action=pending&q=${token}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-booking-dashboard="true"]')).toBeVisible();
      await expect(page.locator('[data-booking-action-filter="pending"]')).toHaveAttribute('data-active', 'true');
      await expect(page.locator('[data-booking-dashboard-search="true"]')).toHaveValue(token);
      await expect(page.locator(`[data-booking-action-row="booking:${bookingId}"]`)).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`action=pending`));
      await expect(page).toHaveURL(new RegExp(`q=${token}`));

      const reportDownloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: '리포트 JSON 내보내기' }).click();
      const reportDownload = await reportDownloadPromise;
      expect(reportDownload.suggestedFilename()).toBe('bookings-dashboard-report.json');
      const reportPath = await reportDownload.path();
      expect(reportPath).not.toBeNull();
      const report = JSON.parse(await readFile(reportPath!, 'utf8')) as {
        filters: { actionFilter: string; query: string };
        summary: {
          sourceBreakdown: Array<{ source: string; total: number }>;
          sourceFunnel: Array<{ source: string; leadToCompletionRate: number }>;
          paymentAttribution: Array<{ provider: string; total: number; paidBookings: number; revenueAmount: number }>;
          utilization: { serviceUtilization: Array<{ serviceId: string; bookedMinutes: number }> };
        };
        actionQueue: { bookings: Array<{ bookingId: string }> };
        visibleBookings: Array<{ bookingId: string }>;
      };
      expect(report.filters.actionFilter).toBe('pending');
      expect(report.filters.query).toBe(token);
      expect(report.summary.utilization.serviceUtilization.some((item) => item.serviceId === serviceId && item.bookedMinutes === 30)).toBe(true);
      expect(report.summary.utilization.serviceUtilization.some((item) => item.serviceId === publicServiceId && item.bookedMinutes === 30)).toBe(true);
      expect(report.summary.sourceBreakdown.some((item) => item.source === 'web' && item.total > 0)).toBe(true);
      expect(report.summary.sourceBreakdown.some((item) => item.source === 'admin' && item.total > 0)).toBe(true);
      expect(report.summary.sourceFunnel.some((item) => item.source === 'web' && item.leadToCompletionRate >= 0)).toBe(true);
      expect(report.summary.sourceFunnel.some((item) => item.source === 'admin' && item.leadToCompletionRate >= 0)).toBe(true);
      expect(report.summary.paymentAttribution.some((item) => item.provider === 'stripe' && item.total > 0)).toBe(true);
      expect(report.summary.paymentAttribution.some((item) => item.provider === 'free' && item.total > 0)).toBe(true);
      expect(report.actionQueue.bookings.some((item) => item.bookingId === bookingId)).toBe(true);
      expect(report.visibleBookings.some((item) => item.bookingId === bookingId)).toBe(true);
      expect(report.summary.sourceBreakdown.some((item) => item.source === 'web')).toBe(true);
      const csvDownloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: '보이는 CSV 내보내기' }).click();
      const csvDownload = await csvDownloadPromise;
      expect(csvDownload.suggestedFilename()).toBe('bookings-dashboard-visible-bookings.csv');
      const csvPath = await csvDownload.path();
      expect(csvPath).not.toBeNull();
      const csv = await readFile(csvPath!, 'utf8');
      expect(csv).toContain('bookingId,startAt,endAt,status,customerName,customerEmail');
      expect(csv).toContain(bookingId);
      expect(csv).toContain(token);
      const sourceAttribution = page.locator('[data-booking-source-attribution="true"]');
      await expect(sourceAttribution).toBeVisible();
      await expect(sourceAttribution).toContainText('출처 귀속');
      await expect(page.locator('[data-booking-source-breakdown="admin"]')).toBeVisible();
      await expect(page.locator('[data-booking-source-breakdown="web"]')).toBeVisible();
      const sourceFunnel = page.locator('[data-booking-source-funnel="true"]');
      await expect(sourceFunnel).toBeVisible();
      await expect(sourceFunnel).toContainText('출처 퍼널');
      await expect(page.locator('[data-booking-source-funnel-row="admin"]')).toBeVisible();
      await expect(page.locator('[data-booking-source-funnel-row="web"]')).toBeVisible();
      const paymentAttribution = page.locator('[data-booking-payment-attribution="true"]');
      await expect(paymentAttribution).toBeVisible();
      await expect(paymentAttribution).toContainText('결제 채널 귀속');
      await expect(page.locator('[data-booking-payment-attribution-row="stripe"]')).toBeVisible();
      await expect(page.locator('[data-booking-payment-attribution-row="free"]')).toBeVisible();

      expect(publicServiceId).not.toBeNull();
      expect(publicBookingId).not.toBeNull();
      expect(bookingId).not.toBeNull();
      await page.locator('[data-booking-dashboard-service-filter="true"]').selectOption(publicServiceId!);
      await expect(page.locator(`[data-booking-row="${publicBookingId}"]`)).toBeVisible();
      await expect(page.locator(`[data-booking-row="${bookingId}"]`)).toHaveCount(0);
      await expect(page.locator('[data-booking-source-breakdown="admin"]')).toHaveCount(0);
      await expect(page.locator('[data-booking-source-breakdown="web"]')).toBeVisible();
      await expect(page.locator('[data-booking-payment-attribution-row="stripe"]')).toHaveCount(0);
      await expect(page.locator('[data-booking-payment-attribution-row="free"]')).toBeVisible();

      const filteredReportDownloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: '리포트 JSON 내보내기' }).click();
      const filteredReportDownload = await filteredReportDownloadPromise;
      const filteredReportPath = await filteredReportDownload.path();
      expect(filteredReportPath).not.toBeNull();
      const filteredReport = JSON.parse(await readFile(filteredReportPath!, 'utf8')) as typeof report;
      expect(filteredReport.visibleBookings.map((item) => item.bookingId)).toEqual([publicBookingId]);
      expect(filteredReport.summary.sourceBreakdown.map((item) => item.source)).toEqual(['web']);
      expect(filteredReport.summary.paymentAttribution.map((item) => item.provider)).toEqual(['free']);
      expect(filteredReport.summary.utilization.serviceUtilization.some((item) => item.serviceId === serviceId)).toBe(false);
      expect(filteredReport.summary.utilization.serviceUtilization.some((item) => item.serviceId === publicServiceId && item.bookedMinutes === 30)).toBe(true);

      const trend = page.locator('[data-booking-trend="true"]');
      await expect(trend).toBeVisible();
      await expect(trend.getByText('추세', { exact: true })).toBeVisible();
      await expect(trend.locator('[data-booking-trend-day]')).toHaveCount(7);
      const utilization = page.locator('[data-booking-utilization="true"]');
      await expect(utilization).toBeVisible();
      await expect(utilization.getByText('활용도', { exact: true })).toBeVisible();
      await expect(utilization.getByText('서비스', { exact: true })).toBeVisible();
      await expect(utilization.getByText('담당자', { exact: true })).toBeVisible();
      await expect(utilization.getByText('피크 창', { exact: true })).toBeVisible();

      await page.getByRole('button', { name: '오늘' }).click();
      await expect(page.getByRole('button', { name: '오늘' })).toHaveAttribute('data-active', 'true');
      await expect(page).not.toHaveURL(/action=/);
      await expect(page.locator('[data-booking-dashboard-search="true"]')).toHaveValue(token);

      await page.goBack({ waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-booking-action-filter="pending"]')).toHaveAttribute('data-active', 'true');
      await expect(page.locator('[data-booking-dashboard-search="true"]')).toHaveValue(token);
      await expect(page.locator(`[data-booking-action-row="booking:${bookingId}"]`)).toBeVisible();

      await page.goto('/zh-hant/admin-builder/bookings/dashboard', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveTitle(/預約儀表板/);
      await expect(page.getByRole('link', { name: '總覽' })).toHaveAttribute('data-active', 'true');
      await expect(page.locator('[data-booking-analytics="true"]').getByText('完成率', { exact: true })).toBeVisible();
      await expect(page.locator('[data-booking-analytics="true"]').getByText('客戶', { exact: true })).toBeVisible();
      await expect(page.getByText('來源歸因', { exact: true })).toBeVisible();
      await expect(page.getByText('今日待處理', { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: '匯出報表 JSON' })).toBeVisible();
      await expect(page.getByRole('button', { name: '匯出顯示中的 CSV' })).toBeVisible();
    } finally {
      if (bookingId) {
        await page.request.patch(`/api/builder/bookings/${bookingId}`, {
          headers,
          data: { status: 'cancelled' },
          failOnStatusCode: false,
        });
      }
      if (publicBookingId) {
        await page.request.patch(`/api/builder/bookings/${publicBookingId}`, {
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
      if (publicServiceId) {
        await page.request.delete(`/api/builder/bookings/services/${publicServiceId}`, {
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
    }
  });

  test('records partial and final manual payments from the booking detail modal', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(`manual-${token}`);
    let staffId: string | null = null;
    let serviceId: string | null = null;
    let bookingId: string | null = null;

    await page.setExtraHTTPHeaders(headers);

    try {
      const staffResponse = await page.request.post('/api/builder/bookings/staff', {
        headers,
        data: {
          name: { ko: `수동결제 담당 ${token}`, 'zh-hant': `Manual Staff ${token}`, en: `Manual Staff ${token}` },
          title: { ko: '예약 결제', 'zh-hant': 'Payment', en: 'Payment' },
          bio: { ko: '', 'zh-hant': '', en: '' },
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
          name: { ko: `수동결제 상담 ${token}`, 'zh-hant': `Manual Payment ${token}`, en: `Manual Payment ${token}` },
          description: { ko: '부분 수동 결제 검증', 'zh-hant': '', en: 'Manual payment check' },
          durationMinutes: 30,
          priceTwd: 9000,
          priceAmount: 9000,
          priceCurrency: 'TWD',
          image: '',
          category: 'consultation',
          staffIds: [staffId],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'paid',
        },
      });
      expect(serviceResponse.status()).toBe(201);
      serviceId = ((await serviceResponse.json()) as { service: { serviceId: string } }).service.serviceId;

      const availabilityResponse = await page.request.patch(`/api/builder/bookings/staff/${staffId}/availability`, {
        headers,
        data: {
          weekly: allWeek('09:00', '17:00'),
          blockedDates: [],
          timezone: 'Asia/Seoul',
        },
      });
      expect(availabilityResponse.status()).toBe(200);

      const bookingDate = todayPlus(3);
      const slotResponse = await page.request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${bookingDate}`, {
        headers,
        timeout: 45_000,
      });
      expect(slotResponse.status()).toBe(200);
      const slots = ((await slotResponse.json()) as { slots: Array<{ startAt: string }> }).slots;
      expect(slots.length).toBeGreaterThan(0);

      const bookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
        headers,
        timeout: 45_000,
        data: {
          serviceId,
          staffId,
          startAt: slots[0].startAt,
          status: 'pending',
          customer: {
            name: `수동결제 고객 ${token}`,
            email: `manual-${token}@example.com`,
            phone: '+82105550001',
            notes: `manual payment ${token}`,
            caseSummary: '부분 수동 결제를 기록합니다.',
            locale: 'ko',
          },
        },
      });
      expect(bookingResponse.status()).toBe(201);
      bookingId = ((await bookingResponse.json()) as { booking: { bookingId: string } }).booking.bookingId;

      await page.goto('/ko/admin-builder/bookings/dashboard', { waitUntil: 'domcontentloaded' });
      await page.getByPlaceholder('이름, 이메일, 메모, 서비스').fill(token);
      const row = page.locator(`[data-booking-row="${bookingId}"]`);
      await expect(row).toBeVisible();
      await row.click();

      const receiptButton = page.locator(`[data-booking-document-issue="${bookingId}:receipt"]`);
      await expect(receiptButton).toBeDisabled();

      await page.locator(`[data-booking-manual-payment-amount="${bookingId}"]`).fill('30.00');
      await page.locator(`[data-booking-manual-payment-method="${bookingId}"]`).selectOption('bank_transfer');
      await page.locator(`[data-booking-manual-payment-reference="${bookingId}"]`).fill(`WIRE-${token}`);
      await page.locator(`[data-booking-manual-payment-note="${bookingId}"]`).fill(`Partial booking payment ${token}`);
      const partialResponse = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/${bookingId}/manual-payments`) && response.request().method() === 'POST',
        { timeout: 45_000 },
      );
      await page.locator(`[data-booking-manual-payment-submit="${bookingId}"]`).click();
      await expect((await partialResponse).json()).resolves.toMatchObject({ booking: { paymentStatus: 'partially_paid' } });
      await expect(page.locator(`[data-booking-manual-payments="${bookingId}"]`)).toContainText(`WIRE-${token}`);
      await expect(page.locator(`[data-booking-manual-payments="${bookingId}"]`)).toContainText(`Partial booking payment ${token}`);
      await expect(page.locator(`[data-booking-manual-payment-summary="${bookingId}"]`)).toContainText('잔액');
      await expect(receiptButton).toBeDisabled();

      await page.locator(`[data-booking-manual-payment-amount="${bookingId}"]`).fill('60.00');
      const finalResponse = page.waitForResponse((response) =>
        response.url().includes(`/api/builder/bookings/${bookingId}/manual-payments`) && response.request().method() === 'POST',
        { timeout: 45_000 },
      );
      await page.locator(`[data-booking-manual-payment-submit="${bookingId}"]`).click();
      await expect((await finalResponse).json()).resolves.toMatchObject({ booking: { paymentStatus: 'paid' } });
      await expect(receiptButton).toBeEnabled();
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
    }
  });
});
