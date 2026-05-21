import { expect, test, type APIRequestContext, type Locator, type Page } from '@playwright/test';

const SITE_ID = 'tseng-law-main-site';
const LOCALE = 'ko';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'form-builder-cms';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function createLeadCollection(
  request: APIRequestContext,
  collectionId: string,
  collectionName: string,
  scope: string,
): Promise<void> {
  const response = await request.post(`/api/builder/sites/${SITE_ID}/collections?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    data: {
      collectionId,
      name: collectionName,
      description: 'Playwright form builder CMS mapping collection',
      fields: [
        {
          fieldId: 'field-lead-name',
          key: 'leadName',
          label: 'Lead Name',
          type: 'text',
          localized: false,
          repeated: false,
          required: false,
        },
        {
          fieldId: 'field-email',
          key: 'email',
          label: 'Email',
          type: 'email',
          localized: false,
          repeated: false,
          required: false,
        },
        {
          fieldId: 'field-photo',
          key: 'photo',
          label: 'Photo',
          type: 'image',
          localized: false,
          repeated: false,
          required: false,
        },
        {
          fieldId: 'field-case-count',
          key: 'caseCount',
          label: 'Case Count',
          type: 'number',
          localized: false,
          repeated: false,
          required: false,
        },
        {
          fieldId: 'field-internal-notes',
          key: 'internalNotes',
          label: 'Internal Notes',
          type: 'rich-text',
          localized: false,
          repeated: false,
          required: false,
        },
      ],
      permissions: {
        read: ['admin'],
        create: ['public', 'admin'],
        update: ['admin'],
        delete: ['admin'],
      },
    },
  });
  expect(response.status()).toBe(201);
  const payload = (await response.json()) as { ok?: boolean; error?: string; issues?: string[] };
  expect(payload.ok, payload.error ?? payload.issues?.join('\n')).toBe(true);
}

async function createFormSchema(
  request: APIRequestContext,
  formId: string,
  formName: string,
  scope: string,
): Promise<void> {
  const response = await request.post('/api/builder/forms/schemas', {
    headers: mutationHeaders(scope),
    data: {
      formId,
      name: formName,
      fields: [
        {
          id: 'leadName',
          type: 'text',
          label: '이름',
          required: true,
        },
        {
          id: 'email',
          type: 'email',
          label: '이메일',
          required: true,
        },
        {
          id: 'photo',
          type: 'file',
          label: '첨부 이미지',
          required: false,
          validation: {
            accept: 'image/png,image/jpeg',
            maxFileSize: 1_000_000,
          },
        },
      ],
      steps: [{ id: 'default', label: '기본' }],
      submitLabel: '문의 보내기',
      successMessage: '접수되었습니다.',
      errorMessage: '제출에 실패했습니다.',
      storeInCms: false,
    },
  });
  expect(response.status()).toBe(201);
  const payload = (await response.json()) as { ok?: boolean; error?: string };
  expect(payload.ok, payload.error).toBe(true);
}

async function deleteCollection(
  request: APIRequestContext,
  collectionId: string,
  scope: string,
): Promise<void> {
  await request.delete(`/api/builder/sites/${SITE_ID}/collections/${encodeURIComponent(collectionId)}?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
}

async function optionValues(select: Locator): Promise<string[]> {
  return select.locator('option').evaluateAll((options) => (
    options.map((option) => (option as HTMLOptionElement).value)
  ));
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  await expect.poll(() => page.evaluate(() => {
    const rootOverflow = Math.max(
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
      document.body.scrollWidth - document.body.clientWidth,
    );
    const tracked = Array.from(document.querySelectorAll(
      '[data-form-cms-card], [data-form-antispam-card], [data-form-cms-field-mapping-grid]',
    )).map((element) => {
      const rect = element.getBoundingClientRect();
      return Math.ceil(Math.max(0, -rect.left, rect.right - window.innerWidth));
    });
    return Math.max(rootOverflow, 0, ...tracked);
  })).toBeLessThanOrEqual(1);
}

test('/ko/admin-builder/forms/builder persists CMS mapping and anti-spam settings after reload', async ({ page }) => {
  const token = Date.now().toString(36);
  const formId = `pw-form-settings-${token}`;
  const collectionId = `pw-form-leads-${token}`;
  const formName = `Form Settings ${token}`;
  const collectionName = `Form Leads ${token}`;
  const scope = `form-settings-${token}`;

  try {
    await createLeadCollection(page.request, collectionId, collectionName, `${scope}-collection`);
    await createFormSchema(page.request, formId, formName, `${scope}-form`);

    await page.goto(`/ko/admin-builder/forms/builder/${formId}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-form-schema-editor="${formId}"]`)).toBeVisible();

    await page.locator('[data-form-cms-store-toggle]').check();
    await page.locator('[data-form-cms-collection-select]').selectOption(collectionId);
    await expect(page.locator('[data-form-cms-field-select="leadName"]')).toBeVisible();
    await expect.poll(() => optionValues(page.locator('[data-form-cms-field-select="email"]'))).toEqual([
      '',
      'leadName',
      'email',
    ]);
    await expect.poll(() => optionValues(page.locator('[data-form-cms-field-select="photo"]'))).toEqual([
      '',
      'leadName',
      'photo',
    ]);

    await page.locator('[data-form-cms-site-input]').fill(SITE_ID);
    await page.locator('[data-form-cms-locale-input]').fill(LOCALE);
    await page.locator('[data-form-cms-status-select]').selectOption('approved');
    await page.locator('[data-form-cms-field-select="leadName"]').selectOption('leadName');
    await page.locator('[data-form-cms-field-select="email"]').selectOption('email');
    await page.locator('[data-form-cms-field-select="photo"]').selectOption('photo');

    await page.locator('[data-form-anti-spam-honeypot]').fill('companyUrl');
    await page.locator('[data-form-anti-spam-minimum-submit]').fill('1500');
    await page.locator('[data-form-anti-spam-duplicate-window]').fill('60000');
    await page.locator('[data-form-anti-spam-duplicate-field="leadName"]').check();
    await page.locator('[data-form-anti-spam-duplicate-field="email"]').check();

    await page.locator('[data-form-schema-save]').click();
    await expect(page.locator('[data-form-schema-save-message]')).toContainText('저장 완료');

    const savedResponse = await page.request.get(`/api/builder/forms/schemas/${formId}`, {
      headers: mutationHeaders(`${scope}-read`),
    });
    expect(savedResponse.status()).toBe(200);
    const savedPayload = (await savedResponse.json()) as {
      schema?: {
        storeInCms?: boolean;
        cmsMapping?: {
          enabled?: boolean;
          siteId?: string;
          locale?: string;
          collectionId?: string;
          status?: string;
          fields?: Array<{ formFieldId: string; cmsFieldKey: string }>;
        };
        antiSpam?: {
          honeypotFieldName?: string;
          minimumSubmitMs?: number;
          duplicateWindowMs?: number;
          duplicateFields?: string[];
        };
      };
    };
    expect(savedPayload.schema).toMatchObject({
      storeInCms: true,
      cmsMapping: {
        enabled: true,
        siteId: SITE_ID,
        locale: LOCALE,
        collectionId,
        status: 'approved',
        fields: expect.arrayContaining([
          { formFieldId: 'leadName', cmsFieldKey: 'leadName' },
          { formFieldId: 'email', cmsFieldKey: 'email' },
          { formFieldId: 'photo', cmsFieldKey: 'photo' },
        ]),
      },
      antiSpam: {
        honeypotFieldName: 'companyUrl',
        minimumSubmitMs: 1500,
        duplicateWindowMs: 60000,
        duplicateFields: expect.arrayContaining(['leadName', 'email']),
      },
    });

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-form-schema-editor="${formId}"]`)).toBeVisible();
    await expect(page.locator('[data-form-cms-store-toggle]')).toBeChecked();
    await expect(page.locator('[data-form-cms-collection-select]')).toHaveValue(collectionId);
    await expect(page.locator('[data-form-cms-site-input]')).toHaveValue(SITE_ID);
    await expect(page.locator('[data-form-cms-locale-input]')).toHaveValue(LOCALE);
    await expect(page.locator('[data-form-cms-status-select]')).toHaveValue('approved');
    await expect(page.locator('[data-form-cms-field-select="leadName"]')).toHaveValue('leadName');
    await expect(page.locator('[data-form-cms-field-select="email"]')).toHaveValue('email');
    await expect(page.locator('[data-form-cms-field-select="photo"]')).toHaveValue('photo');
    await expect(page.locator('[data-form-anti-spam-honeypot]')).toHaveValue('companyUrl');
    await expect(page.locator('[data-form-anti-spam-minimum-submit]')).toHaveValue('1500');
    await expect(page.locator('[data-form-anti-spam-duplicate-window]')).toHaveValue('60000');
    await expect(page.locator('[data-form-anti-spam-duplicate-field="leadName"]')).toBeChecked();
    await expect(page.locator('[data-form-anti-spam-duplicate-field="email"]')).toBeChecked();

    await page.setViewportSize({ width: 768, height: 1000 });
    await expectNoHorizontalOverflow(page);
    await page.setViewportSize({ width: 375, height: 900 });
    await expectNoHorizontalOverflow(page);
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});
