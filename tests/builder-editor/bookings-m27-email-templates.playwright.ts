import { expect, test } from '@playwright/test';
import type { BookingEmailTemplate } from '@/lib/builder/bookings/types';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-m27-w215';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

test.describe('M27 booking email templates', () => {
  test.setTimeout(90_000);

  test('saves and previews customer confirmation email templates', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(token);
    let original: BookingEmailTemplate | null = null;
    await page.setExtraHTTPHeaders(headers);

    try {
      const initial = await page.request.get('/api/builder/bookings/email-templates', { headers });
      expect(initial.status()).toBe(200);
      const initialPayload = (await initial.json()) as { templates: BookingEmailTemplate[] };
      original = initialPayload.templates.find((template) => template.type === 'customer-confirmation') ?? null;
      expect(original).toBeTruthy();

      await page.goto('/ko/admin-builder/bookings/email-templates', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: 'Booking email templates' })).toBeVisible();
      await page.getByRole('button', { name: /Customer confirmation/ }).click();

      await page.getByLabel('Subject').fill(`W215 {{customerName}} ${token}`);
      await page.getByLabel('Body').fill(`Hello {{customerName}}\nService {{serviceName}}\nManage {{manageUrl}}\nToken ${token}`);
      await expect(page.getByRole('region', { name: 'Email preview' })).toContainText(`W215 김민수 ${token}`);
      await expect(page.getByRole('region', { name: 'Email preview' })).toContainText('초기 상담 30분');

      const saveResponse = page.waitForResponse((response) =>
        response.url().includes('/api/builder/bookings/email-templates/customer-confirmation')
          && response.request().method() === 'PATCH',
        { timeout: 30_000 },
      );
      await page.getByRole('button', { name: 'Save template' }).click();
      expect((await saveResponse).status()).toBe(200);
      await expect(page.getByText('Email template saved.')).toBeVisible();

      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: /Customer confirmation/ }).click();
      await expect(page.getByLabel('Subject')).toHaveValue(`W215 {{customerName}} ${token}`);
      await expect(page.getByLabel('Body')).toHaveValue(`Hello {{customerName}}\nService {{serviceName}}\nManage {{manageUrl}}\nToken ${token}`);
    } finally {
      if (original) {
        await page.request.patch('/api/builder/bookings/email-templates/customer-confirmation', {
          headers,
          failOnStatusCode: false,
          data: {
            subject: original.subject,
            body: original.body,
            isActive: original.isActive,
          },
        });
      }
    }
  });
});
