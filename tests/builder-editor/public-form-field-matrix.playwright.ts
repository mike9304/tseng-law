import { expect, test, type APIRequestContext } from '@playwright/test';

const SITE_ID = 'tseng-law-main-site';
const LOCALE = 'ko';

type TestDocument = {
  version: 1;
  locale: 'ko';
  updatedAt: string;
  updatedBy: string;
  stageWidth: number;
  stageHeight: number;
  nodes: Array<Record<string, unknown>>;
};

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

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'public-form-fields';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function node(
  id: string,
  kind: string,
  rect: { x: number; y: number; width: number; height: number },
  content: Record<string, unknown>,
  parentId?: string,
): Record<string, unknown> {
  return {
    id,
    kind,
    parentId,
    rect,
    style: baseStyle,
    zIndex: parentId ? 10 : 1,
    rotation: 0,
    locked: false,
    visible: true,
    content,
  };
}

function makeFieldMatrixDocument(formId: string): TestDocument {
  const updatedAt = new Date().toISOString();
  return {
    version: 1,
    locale: LOCALE,
    updatedAt,
    updatedBy: 'public-form-fields-playwright',
    stageWidth: 1280,
    stageHeight: 1120,
    nodes: [
      node('field-matrix-form', 'form', { x: 96, y: 80, width: 640, height: 900 }, {
        name: formId,
        submitTo: 'storage',
        successMessage: '필드 매트릭스 접수 완료',
        method: 'POST',
        layoutMode: 'absolute',
        captcha: 'none',
        autoReplyEnabled: false,
      }),
      node('field-matrix-phone', 'form-input', { x: 24, y: 24, width: 560, height: 74 }, {
        name: 'phone',
        label: '전화',
        type: 'tel',
        required: true,
      }, 'field-matrix-form'),
      node('field-matrix-checkbox', 'form-checkbox', { x: 24, y: 112, width: 560, height: 116 }, {
        name: 'caseTypes',
        label: '사건 유형',
        required: false,
        options: [
          { value: 'civil', label: 'Civil' },
          { value: 'family', label: 'Family' },
        ],
      }, 'field-matrix-form'),
      node('field-matrix-radio', 'form-radio', { x: 24, y: 242, width: 560, height: 98 }, {
        name: 'contactMethod',
        label: '연락 방식',
        required: true,
        layout: 'horizontal',
        options: [
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
        ],
      }, 'field-matrix-form'),
      node('field-matrix-select', 'form-select', { x: 24, y: 354, width: 560, height: 78 }, {
        name: 'region',
        label: '지역',
        required: true,
        placeholder: 'Select region',
        options: [
          { value: 'taipei', label: 'Taipei' },
          { value: 'taichung', label: 'Taichung' },
        ],
      }, 'field-matrix-form'),
      node('field-matrix-date', 'form-date', { x: 24, y: 446, width: 560, height: 78 }, {
        name: 'visitDate',
        label: '상담 희망일',
        type: 'date',
        required: true,
      }, 'field-matrix-form'),
      node('field-matrix-file', 'form-file', { x: 24, y: 538, width: 560, height: 118 }, {
        name: 'photo',
        label: '첨부 이미지',
        required: true,
        accept: 'image/png',
        maxSizeMb: 2,
        multiple: false,
      }, 'field-matrix-form'),
      node('field-matrix-consent', 'form-checkbox', { x: 24, y: 674, width: 560, height: 78 }, {
        name: 'consent',
        label: '개인정보 수집에 동의합니다',
        required: true,
        defaultChecked: false,
      }, 'field-matrix-form'),
      node('field-matrix-submit', 'form-submit', { x: 24, y: 790, width: 190, height: 54 }, {
        label: '매트릭스 제출',
        style: 'primary',
        fullWidth: false,
        loadingLabel: '전송 중',
      }, 'field-matrix-form'),
    ],
  };
}

async function createCollection(
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
      description: 'Public form field matrix regression collection',
      fields: [
        { fieldId: 'field-phone', key: 'phone', label: 'Phone', type: 'text', localized: false, repeated: false, required: false },
        { fieldId: 'field-case-types', key: 'caseTypes', label: 'Case Types', type: 'string-list', localized: false, repeated: false, required: false },
        { fieldId: 'field-contact-method', key: 'contactMethod', label: 'Contact Method', type: 'text', localized: false, repeated: false, required: false },
        { fieldId: 'field-region', key: 'region', label: 'Region', type: 'text', localized: false, repeated: false, required: false },
        { fieldId: 'field-visit-date', key: 'visitDate', label: 'Visit Date', type: 'date', localized: false, repeated: false, required: false },
        { fieldId: 'field-photo', key: 'photo', label: 'Photo', type: 'image', localized: false, repeated: false, required: false },
        { fieldId: 'field-consent', key: 'consent', label: 'Consent', type: 'boolean', localized: false, repeated: false, required: false },
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
  collectionId: string,
  scope: string,
): Promise<void> {
  const response = await request.post('/api/builder/forms/schemas', {
    headers: mutationHeaders(scope),
    data: {
      formId,
      name: `Field Matrix ${formId}`,
      fields: [
        { id: 'phone', type: 'phone', label: '전화', required: true },
        { id: 'caseTypes', type: 'checkbox', label: '사건 유형', required: false, options: ['civil', 'family'] },
        { id: 'contactMethod', type: 'radio', label: '연락 방식', required: true, options: ['email', 'phone'] },
        { id: 'region', type: 'select', label: '지역', required: true, options: ['taipei', 'taichung'] },
        { id: 'visitDate', type: 'date', label: '상담 희망일', required: true },
        {
          id: 'photo',
          type: 'file',
          label: '첨부 이미지',
          required: true,
          validation: { accept: 'image/png', maxFileSize: 2_000_000 },
        },
        { id: 'consent', type: 'checkbox', label: '개인정보 수집 동의', required: true },
      ],
      steps: [{ id: 'default', label: '기본' }],
      submitLabel: '매트릭스 제출',
      successMessage: '필드 매트릭스 접수 완료',
      errorMessage: '제출에 실패했습니다.',
      storeInCms: true,
      cmsMapping: {
        enabled: true,
        siteId: SITE_ID,
        locale: LOCALE,
        collectionId,
        status: 'pending',
        fields: [
          { formFieldId: 'phone', cmsFieldKey: 'phone' },
          { formFieldId: 'caseTypes', cmsFieldKey: 'caseTypes' },
          { formFieldId: 'contactMethod', cmsFieldKey: 'contactMethod' },
          { formFieldId: 'region', cmsFieldKey: 'region' },
          { formFieldId: 'visitDate', cmsFieldKey: 'visitDate' },
          { formFieldId: 'photo', cmsFieldKey: 'photo' },
          { formFieldId: 'consent', cmsFieldKey: 'consent' },
        ],
      },
    },
  });
  expect(response.status()).toBe(201);
  const payload = (await response.json()) as { ok?: boolean; error?: string; details?: unknown };
  expect(payload.ok, payload.error ?? JSON.stringify(payload.details)).toBe(true);
}

async function createPublishedPage(
  request: APIRequestContext,
  slug: string,
  title: string,
  formId: string,
  scope: string,
): Promise<string> {
  const createResponse = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(scope),
    data: {
      locale: LOCALE,
      slug,
      title,
      document: makeFieldMatrixDocument(formId),
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(created.success, created.error).toBe(true);
  expect(created.pageId).toBeTruthy();

  const publishResponse = await request.post(`/api/builder/site/pages/${created.pageId}/publish?locale=${LOCALE}`, {
    headers: mutationHeaders(`${scope}-publish`),
  });
  expect(publishResponse.status()).toBe(200);
  const published = (await publishResponse.json()) as { ok?: boolean; error?: string };
  expect(published.ok, published.error).toBe(true);
  return created.pageId!;
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

test('/ko public form binds checkbox radio select date upload and consent fields to CMS', async ({ page }) => {
  test.setTimeout(60_000);
  const token = Date.now().toString(36);
  const slug = `pw-field-matrix-${token}`;
  const formId = `pw-field-matrix-${token}`;
  const collectionId = `pw-field-matrix-${token}`;
  const scope = `public-form-fields-${token}`;
  const phone = `+886912${String(Date.now() % 1_000_000).padStart(6, '0')}`;
  let pageId: string | null = null;

  try {
    await createCollection(page.request, collectionId, `Field Matrix ${token}`, `${scope}-collection`);
    await createFormSchema(page.request, formId, collectionId, `${scope}-form`);
    pageId = await createPublishedPage(page.request, slug, `Field Matrix ${token}`, formId, `${scope}-page`);

    await page.goto(`/${LOCALE}/${slug}?fieldMatrix=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node-id="field-matrix-form"] form')).toBeVisible();
    await page.waitForTimeout(3100);

    await page.locator('input[name="phone"]').fill(phone);
    await page.locator('input[name="caseTypes"][value="civil"]').check();
    await page.locator('input[name="caseTypes"][value="family"]').check();
    await page.locator('input[name="contactMethod"][value="email"]').check();
    await page.locator('select[name="region"]').selectOption('taipei');
    await page.locator('input[name="visitDate"]').fill('2026-06-15');
    await page.locator('input[name="photo"]').setInputFiles({
      name: `case-${token}.png`,
      mimeType: 'image/png',
      buffer: Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
        0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
      ]),
    });
    await page.locator('input[name="consent"]').check();
    await page.getByRole('button', { name: '매트릭스 제출' }).click();
    await expect(page.getByText('필드 매트릭스 접수 완료')).toBeVisible();

    const detailResponse = await page.request.get(
      `/api/builder/sites/${SITE_ID}/collections/${encodeURIComponent(collectionId)}?locale=${LOCALE}`,
      { headers: mutationHeaders(`${scope}-read`) },
    );
    expect(detailResponse.status()).toBe(200);
    const detailPayload = (await detailResponse.json()) as {
      detail?: {
        records?: Array<{
          status?: string;
          fields?: Record<string, unknown>;
        }>;
      };
    };
    const record = detailPayload.detail?.records?.find((candidate) => candidate.fields?.phone === phone);
    expect(record).toMatchObject({
      status: 'pending',
      fields: {
        phone,
        caseTypes: ['civil', 'family'],
        contactMethod: 'email',
        region: 'taipei',
        visitDate: '2026-06-15',
        consent: true,
      },
    });
    expect(record?.fields?.photo).toMatchObject({
      filename: `case-${token}.png`,
      altText: `case-${token}`,
    });
    expect(String((record?.fields?.photo as { url?: unknown } | undefined)?.url ?? '')).toContain('/api/forms/uploads/');
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=${LOCALE}`, {
        headers: mutationHeaders(`${scope}-cleanup-page`),
        failOnStatusCode: false,
      });
    }
    await deleteCollection(page.request, collectionId, `${scope}-cleanup-collection`);
  }
});
