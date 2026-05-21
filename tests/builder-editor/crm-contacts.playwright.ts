import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'crm-test';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

test.describe('CRM contacts admin', () => {
  test.setTimeout(120_000);

  test('creates, edits tags, and deletes a contact via admin UI', async ({ page }) => {
    const token = Date.now().toString(36);
    const email = `playwright-${token}@example.com`;
    const headers = mutationHeaders(token);
    await page.setExtraHTTPHeaders(headers);

    let createdContactId: string | null = null;

    try {
      await page.goto('/ko/admin-builder/crm');
      await expect(page.getByTestId('crm-admin')).toBeVisible();
      await page.getByTestId('crm-tab-contacts').click();

      // Open create form, fill it, submit.
      await page.getByTestId('crm-contact-create-toggle').click();
      await page.getByTestId('crm-contact-create-email').fill(email);
      await page.getByTestId('crm-contact-create-name').fill('Playwright User');
      await page.getByTestId('crm-contact-create-tags').fill('lead, vip');
      const createPromise = page.waitForResponse(
        (resp) => resp.url().endsWith('/api/builder/crm/contacts') && resp.request().method() === 'POST',
      );
      await page.getByTestId('crm-contact-create-submit').click();
      const createRes = await createPromise;
      expect(createRes.status()).toBe(201);
      const createdPayload = (await createRes.json()) as { contact: { id: string; email: string } };
      createdContactId = createdPayload.contact.id;
      expect(createdPayload.contact.email).toBe(email);

      // Row appears in list.
      await expect(page.getByTestId(`crm-contact-row-${email}`)).toBeVisible();

      // Edit tags.
      await page.getByTestId(`crm-contact-edit-${email}`).click();
      await page.getByTestId(`crm-contact-edit-tags-${email}`).fill('lead, vip, customer');
      const patchPromise = page.waitForResponse(
        (resp) =>
          resp.url().includes(`/api/builder/crm/contacts/${createdContactId}`) &&
          resp.request().method() === 'PATCH',
      );
      await page.getByTestId(`crm-contact-save-${email}`).click();
      const patchRes = await patchPromise;
      expect(patchRes.status()).toBe(200);
      await expect(page.getByTestId(`crm-contact-row-${email}`)).toContainText('customer');

      // Delete (auto-accept confirm).
      page.once('dialog', (dialog) => dialog.accept());
      const deletePromise = page.waitForResponse(
        (resp) =>
          resp.url().includes(`/api/builder/crm/contacts/${createdContactId}`) &&
          resp.request().method() === 'DELETE',
      );
      await page.getByTestId(`crm-contact-delete-${email}`).click();
      const deleteRes = await deletePromise;
      expect(deleteRes.status()).toBe(200);
      await expect(page.getByTestId(`crm-contact-row-${email}`)).toHaveCount(0);
      createdContactId = null;
    } finally {
      if (createdContactId) {
        await page.request
          .delete(`/api/builder/crm/contacts/${createdContactId}`, { headers })
          .catch(() => undefined);
      }
    }
  });
});