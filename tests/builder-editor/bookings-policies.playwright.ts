import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-policies';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

test.describe('M80 booking cancellation policies', () => {
  test.setTimeout(120_000);

  test('authoring a cancellation policy updates the services editor select', async ({ browser }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(token);
    const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
    const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
    const context = await browser.newContext({
      httpCredentials: { username, password },
    });
    await context.setExtraHTTPHeaders({ 'x-forwarded-for': headers['x-forwarded-for'] });
    const page = await context.newPage();

    let staffId: string | null = null;
    let serviceId: string | null = null;
    let policyId: string | null = null;

    try {
      const staffResponse = await page.request.get('/api/builder/bookings/staff?includeInactive=1', { headers });
      expect(staffResponse.status()).toBe(200);
      const staffPayload = (await staffResponse.json()) as { staff: Array<{ staffId: string; isActive: boolean }> };
      staffId = staffPayload.staff.find((member) => member.isActive)?.staffId ?? null;
      expect(staffId).toBeTruthy();

      const serviceResponse = await page.request.post('/api/builder/bookings/services', {
        headers,
        data: {
          name: { ko: `Policy service ${token}`, 'zh-hant': `Policy service ${token}`, en: `Policy service ${token}` },
          description: { ko: 'Policy test', 'zh-hant': 'Policy test', en: 'Policy test' },
          durationMinutes: 30,
          priceTwd: 7000,
          image: '',
          category: 'consultation',
          staffIds: [staffId],
          requiredResourceIds: [],
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 0,
          maxParticipants: 1,
          slotStepMinutes: 30,
          isActive: true,
          paymentMode: 'paid',
          priceAmount: 7000,
          priceCurrency: 'TWD',
          meetingMode: 'in-person',
          reminderOffsetsHours: [24],
        },
      });
      expect(serviceResponse.status()).toBe(201);
      serviceId = ((await serviceResponse.json()) as { service: { serviceId: string } }).service.serviceId;

      const policyName = `Policy ${token}`;
      const policyResponse = await page.request.post('/api/builder/bookings/cancellation-policies', {
        headers,
        data: {
          name: policyName,
          description: 'Reusable admin-authored policy',
          cancelHoursBefore: 12,
          rescheduleHoursBefore: 18,
          fullRefundHoursBefore: 24,
          partialRefundHoursBefore: 6,
          partialRefundPercent: 50,
          cancellationFeePercent: 10,
          isActive: true,
        },
      });
      expect(policyResponse.status()).toBe(201);
      policyId = ((await policyResponse.json()) as { policy: { policyId: string } }).policy.policyId;

      await page.goto('/ko/admin-builder/bookings/policies', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('[data-booking-policies-admin="true"]')).toBeVisible();
      const policyCard = page.locator('[data-booking-policy-card]').filter({ hasText: policyName });
      await expect(policyCard).toBeVisible();
      const policyCardId = (await policyCard.locator('[data-booking-policy-id]').textContent())?.trim() ?? null;
      expect(policyCardId).toBe(policyId);
      await expect(policyCard).toContainText(/full refund 24h|전액 환불 24시간 전/);
      await expect(policyCard).toContainText(/cancel 12h|취소 12시간 전/);
      await expect(policyCard).toContainText(/fee 10%|수수료 10%/);

      await page.goto(`/ko/admin-builder/bookings/services?edit=${encodeURIComponent(serviceId!)}`, {
        waitUntil: 'domcontentloaded',
      });
      const serviceCard = page.locator(`[data-booking-service-card="${serviceId}"]`);
      await expect(serviceCard).toBeVisible();
      await expect(page.getByRole('heading', { name: /^Edit service$|^서비스 편집$/ })).toBeVisible();
      const select = page.locator('[data-booking-service-policy-select="true"]');
      await expect(select).toContainText(policyName);
      await expect(select).toContainText(/fee 10%|수수료 10%/);
      await select.selectOption({ value: policyId! });
      const serviceSaveResponse = await page.request.patch(`/api/builder/bookings/services/${serviceId}`, {
        headers,
        data: { cancellationPolicyId: policyId },
      });
      expect(serviceSaveResponse.status()).toBe(200);

      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator(`[data-booking-service-card="${serviceId}"]`)).toContainText(new RegExp(`(?:Policy|정책) ${policyId} · ${policyName}`));
      await expect(page.getByRole('link', { name: /^Services$|^서비스$/ })).toHaveAttribute('data-active', 'true');
    } finally {
      if (serviceId) {
        await page.request.delete(`/api/builder/bookings/services/${serviceId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (policyId) {
        await page.request.delete(`/api/builder/bookings/cancellation-policies/${policyId}`, {
          headers,
          failOnStatusCode: false,
        });
      }
      await context.close();
    }
  });
});
