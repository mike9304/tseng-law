import { expect, test, type APIRequestContext } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'cms-slug-field';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function createCollection(
  request: APIRequestContext,
  collectionId: string,
  name: string,
  scope: string,
): Promise<void> {
  const response = await request.post('/api/builder/sites/default/collections?locale=ko', {
    headers: mutationHeaders(scope),
    data: {
      collectionId,
      name,
      description: 'Slug helper regression collection',
    },
  });
  expect(response.status()).toBe(201);
  const payload = (await response.json()) as { ok?: boolean; error?: string };
  expect(payload.ok, payload.error).toBe(true);
}

async function createRecord(
  request: APIRequestContext,
  collectionId: string,
  scope: string,
): Promise<void> {
  const response = await request.post(
    `/api/builder/sites/default/collections/${encodeURIComponent(collectionId)}/records?locale=ko`,
    {
      headers: mutationHeaders(scope),
      data: {
        fields: {
          title: 'Existing slug record',
          slug: 'existing-slug',
        },
      },
    },
  );
  expect(response.status()).toBe(201);
  const payload = (await response.json()) as { ok?: boolean; error?: string; issues?: string[] };
  expect(payload.ok, payload.error ?? payload.issues?.join('\n')).toBe(true);
}

async function deleteCollection(
  request: APIRequestContext,
  collectionId: string,
  scope: string,
): Promise<void> {
  await request.delete(`/api/builder/sites/default/collections/${encodeURIComponent(collectionId)}?locale=ko`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
}

test('/ko/admin-builder/cms shows record slug URL impact and duplicate warning', async ({ page }) => {
  const token = Date.now().toString(36);
  const collectionId = `slug-ui-${token}`;
  const collectionName = `CMS Slug ${token}`;
  const scope = `cms-slug-${token}`;

  try {
    await createCollection(page.request, collectionId, collectionName, scope);
    await createRecord(page.request, collectionId, `${scope}-record`);

    await page.goto(`/ko/admin-builder/cms?slugField=${token}`, { waitUntil: 'domcontentloaded' });
    const collectionButton = page.getByRole('button', { name: new RegExp(collectionName) });
    await expect(collectionButton).toBeVisible();
    await collectionButton.click();
    await expect(page.getByRole('heading', { name: collectionName })).toBeVisible();

    const recordForm = page.locator('section.builder-preview-inspector-card').filter({
      has: page.getByRole('heading', { name: 'New record' }),
    });
    await expect(recordForm).toBeVisible();
    await expect(recordForm.locator('[data-cms-slug-helper="slug"]')).toContainText(
      `Potential dynamic URL: /ko/${collectionId}/{slug}`,
    );

    await recordForm.getByLabel('Slug').fill('existing slug');
    await expect(recordForm.locator('[data-cms-slug-helper="slug"]')).toContainText(
      `/ko/${collectionId}/existing-slug`,
    );
    await expect(recordForm.locator('[data-cms-slug-duplicate="slug"]')).toContainText(
      'This slug is already used by record',
    );
    await expect(recordForm).toContainText(
      'Record-level 301 redirects are not created automatically yet.',
    );
  } finally {
    await deleteCollection(page.request, collectionId, `${scope}-cleanup`);
  }
});
