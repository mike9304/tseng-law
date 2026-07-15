import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'crm-auto';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

test.describe('CRM automations admin', () => {
  test.setTimeout(120_000);

  test('auto-tags a newly created contact via contact-created → add-tag automation', async ({ page }) => {
    const token = Date.now().toString(36);
    const email = `pw-auto-${token}@example.com`;
    const headers = mutationHeaders(token);
    await page.setExtraHTTPHeaders(headers);

    let automationId: string | null = null;
    let contactId: string | null = null;

    try {
      // 1. Create automation via UI.
      await page.goto('/ko/admin-builder/crm?tab=automations');
      await expect(page.getByTestId('crm-admin')).toBeVisible();
      await page.getByTestId('crm-tab-automations').click();
      await page.getByTestId('crm-automation-create-toggle').click();
      await page.getByTestId('crm-automation-create-name').fill(`Auto lead ${token}`);
      await page.getByTestId('crm-automation-trigger-kind').selectOption('contact-created');
      await page.getByTestId('crm-automation-action-kind').selectOption('add-tag');
      await page.getByTestId('crm-automation-add-tag').fill('lead');

      const createPromise = page.waitForResponse(
        (resp) => resp.url().endsWith('/api/builder/crm/automations') && resp.request().method() === 'POST',
      );
      await page.getByTestId('crm-automation-create-submit').click();
      const createRes = await createPromise;
      expect(createRes.status()).toBe(201);
      automationId = ((await createRes.json()) as { automation: { id: string } }).automation.id;

      // 2. Create contact via API (triggers automation server-side).
      const contactRes = await page.request.post('/api/builder/crm/contacts', {
        headers,
        data: { email, name: 'Auto Lead', source: 'manual' },
      });
      expect(contactRes.status()).toBe(201);
      const contactPayload = (await contactRes.json()) as { contact: { id: string; tags: string[] } };
      contactId = contactPayload.contact.id;

      // 3. Verify the lead tag was applied. The PATCH happens asynchronously
      // inside the automation engine after the create returns, so re-read.
      let tagsConfirmed = false;
      for (let attempt = 0; attempt < 10 && !tagsConfirmed; attempt += 1) {
        const reload = await page.request.get(`/api/builder/crm/contacts/${contactId}`, { headers });
        if (reload.ok()) {
          const payload = (await reload.json()) as { contact: { tags: string[] } };
          if (payload.contact.tags.includes('lead')) {
            tagsConfirmed = true;
            break;
          }
        }
        await page.waitForTimeout(150);
      }
      expect(tagsConfirmed).toBe(true);
    } finally {
      if (contactId) {
        await page.request
          .delete(`/api/builder/crm/contacts/${contactId}`, { headers })
          .catch(() => undefined);
      }
      if (automationId) {
        await page.request
          .delete(`/api/builder/crm/automations/${automationId}`, { headers })
          .catch(() => undefined);
      }
    }
  });

  test('production QA blocks email simulation without automation or outbox mutation', async ({ page }) => {
    const token = Date.now().toString(36);
    const headers = mutationHeaders(`outbox-${token}`);
    await page.setExtraHTTPHeaders(headers);

    await page.goto('/ko/admin-builder/crm?tab=automations');
    await page.getByTestId('crm-automation-create-toggle').click();
    await expect(
      page.getByTestId('crm-automation-action-kind').locator('option[value="simulate-email"]'),
    ).toHaveCount(0);
    await expect(page.getByTestId('crm-automation-action-kind')).not.toContainText('실제 발송');

    const beforeAutomations = await page.request.get('/api/builder/crm/automations', { headers });
    const beforeOutbox = await page.request.get('/api/builder/crm/outbox?recent=100', { headers });
    expect(beforeAutomations.status()).toBe(200);
    expect(beforeOutbox.status()).toBe(200);
    const beforeAutomationPayload = (await beforeAutomations.json()) as {
      automations: Array<{ name: string }>;
    };
    const beforeOutboxPayload = (await beforeOutbox.json()) as {
      entries: Array<{ templateId?: string }>;
    };
    expect(beforeAutomationPayload.automations.some((item) => item.name === `Blocked simulation ${token}`)).toBe(false);
    expect(beforeOutboxPayload.entries.some((item) => item.templateId === `blocked-${token}`)).toBe(false);

    const automationRes = await page.request.post('/api/builder/crm/automations', {
      headers,
      data: {
        name: `Blocked simulation ${token}`,
        trigger: { kind: 'contact-created' },
        action: { kind: 'simulate-email', templateId: `blocked-${token}` },
        enabled: true,
      },
    });
    expect(automationRes.status()).toBe(400);
    await expect(automationRes.json()).resolves.toMatchObject({
      ok: false,
      errorCode: 'invalid_automation_payload',
    });

    const afterAutomations = await page.request.get('/api/builder/crm/automations', { headers });
    const afterOutbox = await page.request.get('/api/builder/crm/outbox?recent=100', { headers });
    expect(afterAutomations.status()).toBe(200);
    expect(afterOutbox.status()).toBe(200);
    const afterAutomationPayload = (await afterAutomations.json()) as {
      automations: Array<{ name: string }>;
    };
    const afterOutboxPayload = (await afterOutbox.json()) as {
      entries: Array<{ templateId?: string }>;
    };
    expect(afterAutomationPayload.automations.some((item) => item.name === `Blocked simulation ${token}`)).toBe(false);
    expect(afterOutboxPayload.entries.some((item) => item.templateId === `blocked-${token}`)).toBe(false);

    await page.goto('/ko/admin-builder/crm?tab=outbox');
    await expect(page.getByTestId('crm-outbox-admin')).toBeVisible();
    await expect(page.getByTestId('crm-tab-outbox')).toContainText('이메일 시뮬레이션');
    await expect(page.getByTestId('crm-outbox-admin')).not.toContainText(`blocked-${token}`);
  });
});
