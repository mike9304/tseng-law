import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-m27-reminders';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

test.describe('M27 booking service reminders', () => {
  test.setTimeout(90_000);

  test('saves reminder cadence changes and restores them after reload', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(token);
    let serviceId: string | null = null;

    await page.setExtraHTTPHeaders(headers);

    try {
      const createResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `M27 알림 상담 ${token}`, 'zh-hant': `M27 通知諮詢 ${token}`, en: `M27 Reminder Consultation ${token}` },
          description: { ko: 'M27 reminder coverage', 'zh-hant': 'M27 通知測試', en: 'M27 reminder test' },
          durationMinutes: 30,
          priceTwd: 0,
          image: '',
          category: 'consultation',
          staffIds: [],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          maxParticipants: 1,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'free',
          priceAmount: 0,
          priceCurrency: 'TWD',
          depositAmount: 0,
          meetingMode: 'in-person',
          cancellationPolicyId: '',
          reminderOffsetsHours: [24, 1],
        },
      });
      expect(createResponse.status()).toBe(201);
      serviceId = ((await createResponse.json()) as { service: { serviceId: string } }).service.serviceId;

      await page.goto('/ko/admin-builder/bookings/services', { waitUntil: 'domcontentloaded' });
      const card = page.locator(`[data-booking-service-card="${serviceId}"]`);
      await expect(card).toContainText(`M27 알림 상담 ${token}`);
      await expect(page.locator(`[data-booking-service-reminder-summary="${serviceId}"]`)).toContainText(/Reminder 24h \+ 1h|리마인더 24h \+ 1h/);
      await card.getByRole('button', { name: /^Edit$|^편집$/ }).click();
      await expect(page.getByText(/Edit service|서비스 편집/)).toBeVisible();
      await page.getByRole('checkbox', { name: /24h before|24시간 전/ }).uncheck();
      await page.getByRole('checkbox', { name: /1h before|1시간 전/ }).uncheck();

      await page.getByRole('button', { name: /^Cancel$|^취소$/ }).click();
      await expect(page.locator(`[data-booking-service-reminder-summary="${serviceId}"]`)).toContainText(/Reminder 24h \+ 1h|리마인더 24h \+ 1h/);

      await card.getByRole('button', { name: /^Edit$|^편집$/ }).click();
      await expect(page.getByRole('checkbox', { name: /24h before|24시간 전/ })).toBeChecked();
      await expect(page.getByRole('checkbox', { name: /1h before|1시간 전/ })).toBeChecked();
    } finally {
      if (serviceId) {
        await page.request.delete(`/api/builder/bookings/services/${serviceId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
    }
  });
});
