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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'public-form-cms';
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

function makeFormDocument(formId: string): TestDocument {
  const updatedAt = new Date().toISOString();
  return {
    version: 1,
    locale: LOCALE,
    updatedAt,
    updatedBy: 'public-form-cms-playwright',
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      node('public-form-root', 'form', { x: 96, y: 96, width: 560, height: 430 }, {
        name: formId,
        submitTo: 'storage',
        successMessage: '공개 폼 접수 완료',
        method: 'POST',
        layoutMode: 'absolute',
        captcha: 'none',
        autoReplyEnabled: false,
      }),
      node('public-form-name', 'form-input', { x: 24, y: 28, width: 500, height: 76 }, {
        name: 'leadName',
        label: '이름',
        placeholder: '홍길동',
        type: 'text',
        required: false,
      }, 'public-form-root'),
      node('public-form-email', 'form-input', { x: 24, y: 118, width: 500, height: 76 }, {
        name: 'email',
        label: '이메일',
        placeholder: 'client@example.com',
        type: 'email',
        required: true,
      }, 'public-form-root'),
      node('public-form-message', 'form-textarea', { x: 24, y: 208, width: 500, height: 112 }, {
        name: 'message',
        label: '문의 내용',
        placeholder: '상담 내용을 입력해 주세요',
        required: false,
        rows: 4,
      }, 'public-form-root'),
      node('public-form-submit', 'form-submit', { x: 24, y: 344, width: 180, height: 52 }, {
        label: '문의 보내기',
        style: 'primary',
        fullWidth: false,
        loadingLabel: '전송 중',
      }, 'public-form-root'),
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
      description: 'Public form CMS submit regression collection',
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
          fieldId: 'field-message',
          key: 'message',
          label: 'Message',
          type: 'text',
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
  collectionId: string,
  scope: string,
): Promise<void> {
  const response = await request.post('/api/builder/forms/schemas', {
    headers: mutationHeaders(scope),
    data: {
      formId,
      name: `Public Form ${formId}`,
      fields: [
        { id: 'leadName', type: 'text', label: '이름', required: true },
        { id: 'email', type: 'email', label: '이메일', required: true },
        { id: 'message', type: 'textarea', label: '문의 내용', required: false },
      ],
      steps: [{ id: 'default', label: '기본' }],
      submitLabel: '문의 보내기',
      successMessage: '공개 폼 접수 완료',
      errorMessage: '제출에 실패했습니다.',
      storeInCms: true,
      cmsMapping: {
        enabled: true,
        siteId: SITE_ID,
        locale: LOCALE,
        collectionId,
        status: 'pending',
        fields: [
          { formFieldId: 'leadName', cmsFieldKey: 'leadName' },
          { formFieldId: 'email', cmsFieldKey: 'email' },
          { formFieldId: 'message', cmsFieldKey: 'message' },
        ],
      },
    },
  });
  expect(response.status()).toBe(201);
  const payload = (await response.json()) as { ok?: boolean; error?: string; details?: unknown };
  expect(payload.ok, payload.error ?? JSON.stringify(payload.details)).toBe(true);
}

async function createPublishedFormPage(
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
      document: makeFormDocument(formId),
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

test('/ko public form shows server field errors and writes pending CMS records', async ({ page }) => {
  test.setTimeout(60_000);
  const token = Date.now().toString(36);
  const slug = `pw-public-form-${token}`;
  const formId = `pw-public-form-${token}`;
  const collectionId = `pw-public-leads-${token}`;
  const collectionName = `Public Leads ${token}`;
  const scope = `public-form-cms-${token}`;
  const email = `client-${token}@example.com`;
  const message = `Taiwan law inquiry ${token}`;
  let pageId: string | null = null;

  try {
    await createCollection(page.request, collectionId, collectionName, `${scope}-collection`);
    await createFormSchema(page.request, formId, collectionId, `${scope}-form`);
    pageId = await createPublishedFormPage(page.request, slug, `Public Form ${token}`, formId, `${scope}-page`);

    await page.goto(`/${LOCALE}/${slug}?publicForm=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-node-id="public-form-root"] form')).toBeVisible();
    await page.waitForTimeout(3100);

    const nameInput = page.locator('input[name="leadName"]');
    const emailInput = page.locator('input[name="email"]');
    const messageInput = page.locator('textarea[name="message"]');
    await emailInput.fill(email);
    await messageInput.fill(message);
    await page.getByRole('button', { name: '문의 보내기' }).click();

    await expect(nameInput).toBeFocused();
    await expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#field-public-form-name-error')).toContainText('이름은(는) 필수입니다.');

    await nameInput.fill(`방문자 ${token}`);
    await page.getByRole('button', { name: '문의 보내기' }).click();
    await expect(page.getByText('공개 폼 접수 완료')).toBeVisible();

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
    const record = detailPayload.detail?.records?.find((candidate) => candidate.fields?.email === email);
    expect(record).toMatchObject({
      status: 'pending',
      fields: {
        leadName: `방문자 ${token}`,
        email,
        message,
      },
    });
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
