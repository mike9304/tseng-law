import { expect, type APIRequestContext, type Page } from '@playwright/test';

export function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'apps-hooks';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

export function expectRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`Unexpected ${label}`);
  return value;
}

export function expectArray(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`Unexpected ${label}`);
  return value;
}

function expectString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.length === 0) throw new Error(`Unexpected ${label}`);
  return value;
}

function expectNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`Unexpected ${label}`);
  return value;
}

export async function registerStoredHook(
  page: Page,
  input: {
    readonly token: string;
    readonly appId: string;
    readonly hookId: string;
    readonly kind: string;
    readonly marker: string;
  },
): Promise<string> {
  const response = await page.request.post('/api/builder/apps/hooks', {
    data: {
      appId: input.appId,
      kind: input.kind,
      hookId: input.hookId,
      priority: 5,
      code: `function handler(event, ctx, app) { ctx.log("${input.marker}:" + event.kind + ":" + app.hookId + ":" + JSON.stringify(event.payload)); return "stored-ok"; }`,
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(`${input.token}-${input.kind}`) },
  });
  expect(response.status()).toBe(201);
  const created = expectRecord(await response.json(), `${input.kind} hook create response`);
  const hook = expectRecord(created.hook, `${input.kind} created hook`);
  expect(created.ok).toBe(true);
  expect(hook.hookId).toBe(input.hookId);
  expect(hook.kind).toBe(input.kind);
  expect(typeof hook.codeSecretId, 'stored hook code requires NEXTAUTH_SECRET or BUILDER_SECRET_KEK').toBe('string');
  return `${input.appId}:${input.hookId}`;
}

async function hookLogContains(page: Page, reference: string, marker: string): Promise<boolean> {
  const response = await page.request.get(
    `/api/builder/dev/logs?source=app&reference=${encodeURIComponent(reference)}&limit=40`,
    { failOnStatusCode: false },
  );
  if (!response.ok()) return false;
  const body = expectRecord(await response.json(), 'app logs response');
  const entries = expectArray(body.entries, 'app log entries');
  return entries.some((entry) => (
    isRecord(entry)
      && entry.level === 'log'
      && typeof entry.message === 'string'
      && entry.message.includes(marker)
  ));
}

export async function expectHookLog(page: Page, reference: string, marker: string): Promise<void> {
  await expect(async () => {
    expect(await hookLogContains(page, reference, marker)).toBe(true);
  }).toPass({ timeout: 20_000 });
}

export async function createBuilderPage(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: {
      locale: 'ko',
      slug: `apps-hooks-${token}`,
      title: `Apps Hooks ${token}`,
      blank: true,
    },
    headers: mutationHeaders(`${token}-page-create`),
  });
  expect(response.status()).toBe(200);
  const body = expectRecord(await response.json(), 'page create response');
  expect(body.success).toBe(true);
  return expectString(body.pageId, 'page id');
}

export async function readDraftForSave(
  request: APIRequestContext,
  pageId: string,
  token: string,
): Promise<{ readonly document: Record<string, unknown>; readonly expectedRevision: number }> {
  const response = await request.get(`/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=ko`, {
    headers: mutationHeaders(`${token}-draft-read`),
  });
  expect(response.status()).toBe(200);
  const body = expectRecord(await response.json(), 'draft response');
  const document = expectRecord(body.document, 'draft document');
  const draft = body.draft;
  return {
    document,
    expectedRevision: isRecord(draft) ? expectNumber(draft.revision, 'draft revision') : 0,
  };
}

export async function saveDraft(
  request: APIRequestContext,
  pageId: string,
  token: string,
  draft: { readonly document: Record<string, unknown>; readonly expectedRevision: number },
): Promise<void> {
  const response = await request.put(`/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=ko`, {
    data: draft,
    headers: mutationHeaders(`${token}-draft-save`),
  });
  expect(response.status()).toBe(200);
  const body = expectRecord(await response.json(), 'draft save response');
  expect(body.ok).toBe(true);
}

export async function createEditableCollection(
  request: APIRequestContext,
  collectionId: string,
  token: string,
): Promise<void> {
  const response = await request.post('/api/builder/sites/default/collections?locale=ko', {
    headers: mutationHeaders(`${token}-collection-create`),
    data: {
      collectionId,
      name: `Apps Hooks ${token}`,
      fields: [
        {
          fieldId: 'field-title',
          key: 'title',
          label: 'Title',
          type: 'text',
          localized: false,
          repeated: false,
          required: false,
        },
      ],
    },
  });
  expect(response.status()).toBe(201);
  const body = expectRecord(await response.json(), 'collection create response');
  expect(body.ok).toBe(true);
}

export async function createCmsRecord(
  request: APIRequestContext,
  collectionId: string,
  token: string,
): Promise<void> {
  const response = await request.post(
    `/api/builder/sites/default/collections/${encodeURIComponent(collectionId)}/records?locale=ko`,
    {
      headers: mutationHeaders(`${token}-record-create`),
      data: { fields: { title: `Hook record ${token}` } },
    },
  );
  expect(response.status()).toBe(201);
  const body = expectRecord(await response.json(), 'record create response');
  expect(body.ok).toBe(true);
}

export async function deleteBuilderPage(request: APIRequestContext, pageId: string, token: string): Promise<void> {
  await request.delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=ko`, {
    headers: mutationHeaders(`${token}-page-delete`),
    failOnStatusCode: false,
  });
}

export async function deleteEditableCollection(
  request: APIRequestContext,
  collectionId: string,
  token: string,
): Promise<void> {
  await request.delete(`/api/builder/sites/default/collections/${encodeURIComponent(collectionId)}?locale=ko`, {
    headers: mutationHeaders(`${token}-collection-delete`),
    failOnStatusCode: false,
  });
}
