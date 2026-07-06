import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'slug-redirects';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

type RedirectRecord = {
  redirectId: string;
  from: string;
  to: string;
  type: number;
  isActive: boolean;
};

async function createBuilderPage(
  request: APIRequestContext,
  slug: string,
  title: string,
  scope: string,
): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(scope),
    data: { locale: 'ko', slug, title, blank: true },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

async function createDynamicItemPage(
  request: APIRequestContext,
  slug: string,
  title: string,
  scope: string,
): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(scope),
    data: {
      locale: 'ko',
      slug,
      title,
      addToNavigation: false,
      dynamicItemCollectionId: 'columns',
    },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as {
    success?: boolean;
    pageId?: string;
    page?: { dynamicItem?: { collectionId?: string } };
    error?: string;
  };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  expect(payload.page?.dynamicItem).toMatchObject({ collectionId: 'columns' });
  return payload.pageId!;
}

async function deleteBuilderPage(
  request: APIRequestContext,
  pageId: string | null,
  scope: string,
): Promise<void> {
  if (!pageId) return;
  await request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
}

async function listRedirects(
  request: APIRequestContext,
  scope: string,
): Promise<RedirectRecord[]> {
  const response = await request.get('/api/builder/site/redirects?locale=ko', {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { redirects?: RedirectRecord[] };
  return payload.redirects ?? [];
}

async function findBuilderPageBySlug(
  request: APIRequestContext,
  slug: string,
  scope: string,
): Promise<{ pageId: string; slug: string } | null> {
  const response = await request.get('/api/builder/site/pages?locale=ko', {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as {
    pages?: Array<{ pageId?: string; slug?: string }>;
  };
  const page = payload.pages?.find((candidate) => candidate.slug === slug);
  return page?.pageId && page.slug ? { pageId: page.pageId, slug: page.slug } : null;
}

async function listBuilderPageIds(
  request: APIRequestContext,
  scope: string,
): Promise<string[]> {
  const response = await request.get('/api/builder/site/pages?locale=ko', {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as {
    pages?: Array<{ pageId?: string }>;
  };
  return (payload.pages ?? [])
    .map((page) => page.pageId)
    .filter((pageId): pageId is string => Boolean(pageId));
}

async function createRedirect(
  request: APIRequestContext,
  input: {
    from: string;
    to: string;
    type?: number;
    note?: string;
  },
  scope: string,
): Promise<string> {
  const response = await request.post('/api/builder/site/redirects?locale=ko', {
    headers: mutationHeaders(scope),
    data: {
      type: 301,
      isActive: true,
      ...input,
    },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as {
    ok?: boolean;
    redirect?: { redirectId?: string };
    error?: string;
  };
  expect(payload.ok, payload.error).toBe(true);
  expect(payload.redirect?.redirectId).toBeTruthy();
  return payload.redirect!.redirectId!;
}

async function deleteRedirect(
  request: APIRequestContext,
  redirectId: string,
  scope: string,
): Promise<void> {
  await request.delete(`/api/builder/site/redirects/${encodeURIComponent(redirectId)}?locale=ko`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
}

async function openBuilder(page: Page, pageId: string, token: string): Promise<void> {
  await page.goto(`/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&slugRedirect=${token}`, {
    waitUntil: 'domcontentloaded',
  });
  const shell = page.locator('[data-editor-shell]').first();
  await expect(shell).toBeVisible({ timeout: 30_000 });
  await expect(shell).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
}

async function expectPublicRedirect(
  page: Page,
  source: string,
  expectedStatus: number,
  expectedLocation: string,
): Promise<void> {
  await expect.poll(async () => {
    const response = await page.request.get(source, {
      failOnStatusCode: false,
      maxRedirects: 0,
    });
    return {
      status: response.status(),
      location: response.headers().location ?? '',
    };
  }, {
    timeout: 10_000,
    message: `${source} should redirect to ${expectedLocation}`,
  }).toEqual(expect.objectContaining({
    status: expectedStatus,
    location: expect.stringContaining(expectedLocation),
  }));
}

test('/ko/admin-builder protects page slug conflicts and creates redirect on slug rename', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const scope = `slug-redirect-${token}`;
  const oldSlug = `slug-old-${token}`;
  const newSlug = `slug-new-${token}`;
  const takenSlug = `slug-taken-${token}`;
  let editedPageId: string | null = null;
  let takenPageId: string | null = null;
  const createdRedirectIds: string[] = [];

  await page.setExtraHTTPHeaders(mutationHeaders(scope));

  try {
    editedPageId = await createBuilderPage(page.request, oldSlug, `Slug old ${token}`, scope);
    takenPageId = await createBuilderPage(page.request, takenSlug, `Slug taken ${token}`, scope);

    const duplicateResponse = await page.request.patch(`/api/builder/site/pages/${editedPageId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-duplicate`),
      data: {
        title: `Duplicate attempt ${token}`,
        slug: takenSlug,
        createRedirect: true,
      },
      failOnStatusCode: false,
    });
    expect(duplicateResponse.status()).toBe(400);
    const duplicatePayload = (await duplicateResponse.json()) as {
      error?: string;
      errorCode?: string;
      issues?: Array<{ id?: string; field?: string }>;
    };
    expect(duplicatePayload.errorCode ?? duplicatePayload.error).toBe('validation_error');
    expect(duplicatePayload.issues ?? []).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'seo-slug-duplicate', field: 'slug' }),
      ]),
    );

    await openBuilder(page, editedPageId, token);
    await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    const row = page.locator(`[data-builder-page-row="${editedPageId}"]`).first();
    await expect(row).toBeVisible();
    await row.hover();
    await row.getByRole('button', { name: '페이지 메뉴' }).click();
    await row.getByRole('button', { name: '이름 변경' }).click();

    const slugInput = row.getByLabel('페이지 slug');
    await slugInput.fill(newSlug);
    const redirectCheckbox = row.getByLabel(/301 redirect 생성/);
    await expect(redirectCheckbox).toBeChecked();

    const renameResponsePromise = page.waitForResponse((response) => (
      response.request().method() === 'PATCH'
      && response.url().includes(`/api/builder/site/pages/${editedPageId}`)
    ));
    await slugInput.press('Enter');
    const renameResponse = await renameResponsePromise;
    expect(renameResponse.status()).toBe(200);
    const renamePayload = (await renameResponse.json()) as {
      ok?: boolean;
      page?: { slug?: string };
      redirectCreated?: boolean;
      error?: string;
    };
    expect(renamePayload.ok, renamePayload.error).toBe(true);
    expect(renamePayload.page?.slug).toBe(newSlug);
    expect(renamePayload.redirectCreated).toBe(true);

    await expect(row).toHaveAttribute('data-builder-page-slug', newSlug);
    const redirects = await listRedirects(page.request, `${scope}-list`);
    const redirect = redirects.find((candidate) =>
      candidate.from === `/ko/${oldSlug}` && candidate.to === `/ko/${newSlug}`
    );
    expect(redirect).toBeTruthy();
    createdRedirectIds.push(redirect!.redirectId);
    expect(redirect).toMatchObject({
      type: 301,
      isActive: true,
    });

    await expectPublicRedirect(page, `/ko/${oldSlug}`, 301, `/ko/${newSlug}`);
  } finally {
    const redirects = await listRedirects(page.request, `${scope}-cleanup`).catch(() => []);
    for (const redirect of redirects) {
      if (
        redirect.from === `/ko/${oldSlug}`
        || redirect.to === `/ko/${newSlug}`
      ) {
        createdRedirectIds.push(redirect.redirectId);
      }
    }
    for (const redirectId of Array.from(new Set(createdRedirectIds))) {
      await deleteRedirect(page.request, redirectId, `${scope}-cleanup`);
    }
    await deleteBuilderPage(page.request, editedPageId, `${scope}-cleanup`);
    await deleteBuilderPage(page.request, takenPageId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder accepts nested page slugs and redirects nested slug renames', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const scope = `nested-slug-${token}`;
  const oldSlug = `columns/nested-old-${token}`;
  const newSlug = `columns/nested-new-${token}`;
  let pageId: string | null = null;
  const createdRedirectIds: string[] = [];

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(scope),
      data: {
        locale: 'ko',
        slug: `/${oldSlug}/`,
        title: `Nested old ${token}`,
        blank: true,
      },
    });
    expect(createResponse.status()).toBe(200);
    const createPayload = (await createResponse.json()) as {
      success?: boolean;
      pageId?: string;
      page?: { slug?: string };
      error?: string;
    };
    expect(createPayload.success, createPayload.error).toBe(true);
    expect(createPayload.pageId).toBeTruthy();
    expect(createPayload.page?.slug).toBe(oldSlug);
    pageId = createPayload.pageId!;

    const renameResponse = await page.request.patch(`/api/builder/site/pages/${pageId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-rename`),
      data: {
        title: `Nested new ${token}`,
        slug: `/${newSlug}/`,
        createRedirect: true,
      },
    });
    expect(renameResponse.status()).toBe(200);
    const renamePayload = (await renameResponse.json()) as {
      ok?: boolean;
      redirectCreated?: boolean;
      page?: { slug?: string };
      error?: string;
    };
    expect(renamePayload.ok, renamePayload.error).toBe(true);
    expect(renamePayload.page?.slug).toBe(newSlug);
    expect(renamePayload.redirectCreated).toBe(true);

    const redirects = await listRedirects(page.request, `${scope}-list`);
    const redirect = redirects.find((candidate) =>
      candidate.from === `/ko/${oldSlug}` && candidate.to === `/ko/${newSlug}`
    );
    expect(redirect).toBeTruthy();
    createdRedirectIds.push(redirect!.redirectId);

    await openBuilder(page, pageId, token);
    await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    const row = page.locator(`[data-builder-page-row="${pageId}"]`).first();
    await expect(row).toBeVisible();
    await expect(row).toHaveAttribute('data-builder-page-slug', newSlug);
    await expect(row).toHaveAttribute('data-builder-page-depth', '1');
    await expect(row).toHaveAttribute('data-builder-page-parent-slug', 'columns');
    await expect(row).toContainText(`/${newSlug}`);

    await expectPublicRedirect(page, `/ko/${oldSlug}`, 301, `/ko/${newSlug}`);
  } finally {
    const redirects = await listRedirects(page.request, `${scope}-cleanup`).catch(() => []);
    for (const redirect of redirects) {
      if (
        redirect.from === `/ko/${oldSlug}`
        || redirect.to === `/ko/${newSlug}`
      ) {
        createdRedirectIds.push(redirect.redirectId);
      }
    }
    for (const redirectId of Array.from(new Set(createdRedirectIds))) {
      await deleteRedirect(page.request, redirectId, `${scope}-cleanup`);
    }
    await deleteBuilderPage(page.request, pageId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder SEO save accepts nested slug paths and creates exact redirects', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const scope = `seo-nested-slug-${token}`;
  const oldSlug = `columns/seo-old-${token}`;
  const newSlug = `columns/seo-new-${token}`;
  let pageId: string | null = null;
  const createdRedirectIds: string[] = [];

  try {
    pageId = await createBuilderPage(page.request, oldSlug, `SEO nested old ${token}`, scope);

    const seoResponse = await page.request.patch(`/api/builder/site/pages/${pageId}/seo?locale=ko`, {
      headers: mutationHeaders(`${scope}-seo`),
      data: {
        slug: `/${newSlug}/`,
        seo: {
          title: `SEO nested title ${token}`,
        },
        createRedirect: true,
      },
    });
    expect(seoResponse.status()).toBe(200);
    const seoPayload = (await seoResponse.json()) as {
      ok?: boolean;
      redirectCreated?: boolean;
      page?: { slug?: string };
      defaults?: { publicPath?: string; canonical?: string };
      error?: string;
    };
    expect(seoPayload.ok, seoPayload.error).toBe(true);
    expect(seoPayload.page?.slug).toBe(newSlug);
    expect(seoPayload.redirectCreated).toBe(true);
    expect(seoPayload.defaults?.publicPath).toBe(`/ko/${newSlug}`);
    expect(seoPayload.defaults?.canonical).toContain(`/ko/${newSlug}`);

    const redirects = await listRedirects(page.request, `${scope}-list`);
    const redirect = redirects.find((candidate) =>
      candidate.from === `/ko/${oldSlug}` && candidate.to === `/ko/${newSlug}`
    );
    expect(redirect).toBeTruthy();
    createdRedirectIds.push(redirect!.redirectId);

    await expectPublicRedirect(page, `/ko/${oldSlug}`, 301, `/ko/${newSlug}`);
  } finally {
    const redirects = await listRedirects(page.request, `${scope}-cleanup`).catch(() => []);
    for (const redirect of redirects) {
      if (
        redirect.from === `/ko/${oldSlug}`
        || redirect.to === `/ko/${newSlug}`
      ) {
        createdRedirectIds.push(redirect.redirectId);
      }
    }
    for (const redirectId of Array.from(new Set(createdRedirectIds))) {
      await deleteRedirect(page.request, redirectId, `${scope}-cleanup`);
    }
    await deleteBuilderPage(page.request, pageId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder groups nested page rows under their parent slug', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const scope = `nested-page-order-${token}`;
  const parentSlug = `nested-parent-${token}`;
  const childSlug = `${parentSlug}/child`;
  let parentPageId: string | null = null;
  let childPageId: string | null = null;

  try {
    childPageId = await createBuilderPage(page.request, childSlug, `Nested child ${token}`, scope);
    parentPageId = await createBuilderPage(page.request, parentSlug, `Nested parent ${token}`, scope);

    await openBuilder(page, parentPageId, token);
    await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    const parentRow = page.locator(`[data-builder-page-row="${parentPageId}"]`).first();
    const childRow = page.locator(`[data-builder-page-row="${childPageId}"]`).first();
    await expect(parentRow).toBeVisible();
    await expect(childRow).toBeVisible();
    await expect(childRow).toHaveAttribute('data-builder-page-depth', '1');
    await expect(childRow).toHaveAttribute('data-builder-page-parent-slug', parentSlug);

    const rowOrder = await page.locator('[data-builder-page-row]').evaluateAll((rows) => rows.map((row, index) => ({
      index,
      pageId: row.getAttribute('data-builder-page-row'),
      slug: row.getAttribute('data-builder-page-slug'),
    })));
    const parentIndex = rowOrder.find((row) => row.pageId === parentPageId)?.index ?? -1;
    const childIndex = rowOrder.find((row) => row.pageId === childPageId)?.index ?? -1;
    expect(parentIndex).toBeGreaterThanOrEqual(0);
    expect(childIndex).toBeGreaterThan(parentIndex);
  } finally {
    await deleteBuilderPage(page.request, childPageId, `${scope}-cleanup`);
    await deleteBuilderPage(page.request, parentPageId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder creates child pages from the nested page row menu', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const scope = `nested-child-ui-${token}`;
  const parentSlug = `nested-menu-parent-${token}`;
  const childSlug = `${parentSlug}/child-page-${token}`;
  let parentPageId: string | null = null;
  let childPageId: string | null = null;

  try {
    parentPageId = await createBuilderPage(page.request, parentSlug, `Nested menu parent ${token}`, scope);

    await openBuilder(page, parentPageId, token);
    await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    const parentRow = page.locator(`[data-builder-page-row="${parentPageId}"]`).first();
    await expect(parentRow).toBeVisible();
    await parentRow.hover();
    await parentRow.getByRole('button', { name: '페이지 메뉴' }).click();
    await parentRow.locator(`[data-builder-add-child-page="${parentPageId}"]`).click();

    const slugPrompt = page.getByRole('dialog', { name: '페이지 slug 입력' });
    await expect(slugPrompt).toBeVisible();
    const slugInput = slugPrompt.getByPlaceholder('예: about, services, columns/taiwan-guide');
    await expect(slugInput).toHaveValue(`${parentSlug}/child-page`);
    await expect(slugPrompt.getByLabel('메뉴에 추가')).not.toBeChecked();
    await expect(slugPrompt).toContainText('하위 페이지는 parent/child 형식');

    await slugInput.fill(childSlug);
    await slugPrompt.getByRole('button', { name: '생성' }).click();
    await expect(slugPrompt).toBeHidden({ timeout: 20_000 });

    const childPage = await findBuilderPageBySlug(page.request, childSlug, `${scope}-find-child`);
    expect(childPage).toBeTruthy();
    childPageId = childPage!.pageId;
    if (await page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).count() === 0) {
      await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    }
    const childRow = page.locator(`[data-builder-page-row="${childPageId}"]`).first();
    await expect(childRow).toBeVisible({ timeout: 20_000 });
    await expect(childRow).toHaveAttribute('data-builder-page-slug', childSlug);
    await expect(childRow).toHaveAttribute('data-builder-page-depth', '1');
    await expect(childRow).toHaveAttribute('data-builder-page-parent-slug', parentSlug);
  } finally {
    await deleteBuilderPage(page.request, childPageId, `${scope}-cleanup`);
    await deleteBuilderPage(page.request, parentPageId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder persists nested child page order from the Pages drawer', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const scope = `nested-reorder-${token}`;
  const parentSlug = `nested-reorder-parent-${token}`;
  const childOneSlug = `${parentSlug}/child-a`;
  const childTwoSlug = `${parentSlug}/child-b`;
  let parentPageId: string | null = null;
  let childOnePageId: string | null = null;
  let childTwoPageId: string | null = null;

  try {
    parentPageId = await createBuilderPage(page.request, parentSlug, `Nested reorder parent ${token}`, scope);
    childOnePageId = await createBuilderPage(page.request, childOneSlug, `Child A ${token}`, scope);
    childTwoPageId = await createBuilderPage(page.request, childTwoSlug, `Child B ${token}`, scope);

    await openBuilder(page, parentPageId, token);
    await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();

    const parentRow = page.locator(`[data-builder-page-row="${parentPageId}"]`).first();
    const childOneRow = page.locator(`[data-builder-page-row="${childOnePageId}"]`).first();
    const childTwoRow = page.locator(`[data-builder-page-row="${childTwoPageId}"]`).first();
    await expect(parentRow).toBeVisible();
    await expect(childOneRow).toBeVisible();
    await expect(childTwoRow).toBeVisible();

    const initialOrder = await page.locator('[data-builder-page-row]').evaluateAll((rows) => rows.map((row) => (
      row.getAttribute('data-builder-page-row')
    )));
    expect(initialOrder.indexOf(parentPageId)).toBeLessThan(initialOrder.indexOf(childOnePageId));
    expect(initialOrder.indexOf(childOnePageId)).toBeLessThan(initialOrder.indexOf(childTwoPageId));

    await childTwoRow.hover();
    await childTwoRow.getByRole('button', { name: '페이지 메뉴' }).click();
    await expect(childTwoRow.locator(`[data-builder-move-page-up="${childTwoPageId}"]`)).toBeEnabled();
    await expect(childTwoRow.locator(`[data-builder-move-page-down="${childTwoPageId}"]`)).toBeDisabled();

    const orderResponsePromise = page.waitForResponse((response) => (
      response.request().method() === 'PATCH'
      && response.url().includes('/api/builder/site/pages/order')
    ));
    await childTwoRow.locator(`[data-builder-move-page-up="${childTwoPageId}"]`).click();
    const orderResponse = await orderResponsePromise;
    expect(orderResponse.status()).toBe(200);
    const orderPayload = (await orderResponse.json()) as {
      ok?: boolean;
      pages?: Array<{ pageId?: string }>;
      error?: string;
    };
    expect(orderPayload.ok, orderPayload.error).toBe(true);

    await expect(childTwoRow).toHaveAttribute('data-builder-page-depth', '1');
    await expect(childTwoRow).toHaveAttribute('data-builder-page-parent-slug', parentSlug);

    const reorderedRows = await page.locator('[data-builder-page-row]').evaluateAll((rows) => rows.map((row) => (
      row.getAttribute('data-builder-page-row')
    )));
    expect(reorderedRows.indexOf(parentPageId)).toBeLessThan(reorderedRows.indexOf(childTwoPageId));
    expect(reorderedRows.indexOf(childTwoPageId)).toBeLessThan(reorderedRows.indexOf(childOnePageId));

    const persistedOrder = await listBuilderPageIds(page.request, `${scope}-persisted`);
    expect(persistedOrder.indexOf(parentPageId)).toBeLessThan(persistedOrder.indexOf(childTwoPageId));
    expect(persistedOrder.indexOf(childTwoPageId)).toBeLessThan(persistedOrder.indexOf(childOnePageId));
  } finally {
    await deleteBuilderPage(page.request, childTwoPageId, `${scope}-cleanup`);
    await deleteBuilderPage(page.request, childOnePageId, `${scope}-cleanup`);
    await deleteBuilderPage(page.request, parentPageId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder drag-reorders nested sibling page rows from the Pages drawer', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const scope = `nested-drag-reorder-${token}`;
  const parentSlug = `nested-drag-parent-${token}`;
  const childOneSlug = `${parentSlug}/child-a`;
  const childTwoSlug = `${parentSlug}/child-b`;
  let parentPageId: string | null = null;
  let childOnePageId: string | null = null;
  let childTwoPageId: string | null = null;

  try {
    parentPageId = await createBuilderPage(page.request, parentSlug, `Nested drag parent ${token}`, scope);
    childOnePageId = await createBuilderPage(page.request, childOneSlug, `Drag Child A ${token}`, scope);
    childTwoPageId = await createBuilderPage(page.request, childTwoSlug, `Drag Child B ${token}`, scope);

    await openBuilder(page, parentPageId, token);
    await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();

    const childOneRow = page.locator(`[data-builder-page-row="${childOnePageId}"]`).first();
    const childTwoRow = page.locator(`[data-builder-page-row="${childTwoPageId}"]`).first();
    await expect(childOneRow).toBeVisible();
    await expect(childTwoRow).toBeVisible();
    await expect(childTwoRow.locator(`[data-builder-page-drag-handle="${childTwoPageId}"]`)).toBeVisible();

    const orderResponsePromise = page.waitForResponse((response) => (
      response.request().method() === 'PATCH'
      && response.url().includes('/api/builder/site/pages/order')
    ));
    await page.evaluate(({ draggedPageId, targetPageId }) => {
      const source = document.querySelector(`[data-builder-page-drag-handle="${draggedPageId}"]`);
      const target = document.querySelector(`[data-builder-page-row="${targetPageId}"]`);
      if (!source || !target) throw new Error('drag source or target missing');
      const dataTransfer = new DataTransfer();
      source.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }));
      target.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer }));
      target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }));
      source.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer }));
    }, {
      draggedPageId: childTwoPageId,
      targetPageId: childOnePageId,
    });
    const orderResponse = await orderResponsePromise;
    expect(orderResponse.status()).toBe(200);

    const reorderedRows = await page.locator('[data-builder-page-row]').evaluateAll((rows) => rows.map((row) => (
      row.getAttribute('data-builder-page-row')
    )));
    expect(reorderedRows.indexOf(parentPageId)).toBeLessThan(reorderedRows.indexOf(childTwoPageId));
    expect(reorderedRows.indexOf(childTwoPageId)).toBeLessThan(reorderedRows.indexOf(childOnePageId));

    const persistedOrder = await listBuilderPageIds(page.request, `${scope}-persisted`);
    expect(persistedOrder.indexOf(parentPageId)).toBeLessThan(persistedOrder.indexOf(childTwoPageId));
    expect(persistedOrder.indexOf(childTwoPageId)).toBeLessThan(persistedOrder.indexOf(childOnePageId));
  } finally {
    await deleteBuilderPage(page.request, childTwoPageId, `${scope}-cleanup`);
    await deleteBuilderPage(page.request, childOnePageId, `${scope}-cleanup`);
    await deleteBuilderPage(page.request, parentPageId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder keyboard-reorders nested sibling page rows from the Pages drawer', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const scope = `nested-key-reorder-${token}`;
  const parentSlug = `nested-key-parent-${token}`;
  const childOneSlug = `${parentSlug}/child-a`;
  const childTwoSlug = `${parentSlug}/child-b`;
  let parentPageId: string | null = null;
  let childOnePageId: string | null = null;
  let childTwoPageId: string | null = null;

  try {
    parentPageId = await createBuilderPage(page.request, parentSlug, `Nested key parent ${token}`, scope);
    childOnePageId = await createBuilderPage(page.request, childOneSlug, `Key Child A ${token}`, scope);
    childTwoPageId = await createBuilderPage(page.request, childTwoSlug, `Key Child B ${token}`, scope);

    await openBuilder(page, parentPageId, token);
    await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();

    const childTwoHandle = page.locator(`[data-builder-page-drag-handle="${childTwoPageId}"]`).first();
    await expect(childTwoHandle).toBeVisible();
    await expect(childTwoHandle).toHaveAttribute('aria-keyshortcuts', 'ArrowUp ArrowDown');
    await expect(childTwoHandle).toHaveAttribute('data-builder-page-can-move-up', 'true');

    const orderResponsePromise = page.waitForResponse((response) => (
      response.request().method() === 'PATCH'
      && response.url().includes('/api/builder/site/pages/order')
    ));
    await childTwoHandle.press('ArrowUp');
    const orderResponse = await orderResponsePromise;
    expect(orderResponse.status()).toBe(200);
    await expect(page.locator('[data-builder-page-order-status="true"]')).toContainText('페이지 순서를 저장했습니다.');

    const reorderedRows = await page.locator('[data-builder-page-row]').evaluateAll((rows) => rows.map((row) => (
      row.getAttribute('data-builder-page-row')
    )));
    expect(reorderedRows.indexOf(parentPageId)).toBeLessThan(reorderedRows.indexOf(childTwoPageId));
    expect(reorderedRows.indexOf(childTwoPageId)).toBeLessThan(reorderedRows.indexOf(childOnePageId));

    const persistedOrder = await listBuilderPageIds(page.request, `${scope}-persisted`);
    expect(persistedOrder.indexOf(parentPageId)).toBeLessThan(persistedOrder.indexOf(childTwoPageId));
    expect(persistedOrder.indexOf(childTwoPageId)).toBeLessThan(persistedOrder.indexOf(childOnePageId));
  } finally {
    await deleteBuilderPage(page.request, childTwoPageId, `${scope}-cleanup`);
    await deleteBuilderPage(page.request, childOnePageId, `${scope}-cleanup`);
    await deleteBuilderPage(page.request, parentPageId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder moves nested parent rows as a subtree from the Pages drawer', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const scope = `nested-subtree-reorder-${token}`;
  const firstParentSlug = `nested-tree-a-${token}`;
  const firstChildSlug = `${firstParentSlug}/child`;
  const secondParentSlug = `nested-tree-b-${token}`;
  const secondChildSlug = `${secondParentSlug}/child`;
  let firstParentPageId: string | null = null;
  let firstChildPageId: string | null = null;
  let secondParentPageId: string | null = null;
  let secondChildPageId: string | null = null;

  try {
    firstParentPageId = await createBuilderPage(page.request, firstParentSlug, `Tree A ${token}`, scope);
    firstChildPageId = await createBuilderPage(page.request, firstChildSlug, `Tree A child ${token}`, scope);
    secondParentPageId = await createBuilderPage(page.request, secondParentSlug, `Tree B ${token}`, scope);
    secondChildPageId = await createBuilderPage(page.request, secondChildSlug, `Tree B child ${token}`, scope);

    await openBuilder(page, firstParentPageId, token);
    await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();

    const firstParentRow = page.locator(`[data-builder-page-row="${firstParentPageId}"]`).first();
    const firstChildRow = page.locator(`[data-builder-page-row="${firstChildPageId}"]`).first();
    const secondParentRow = page.locator(`[data-builder-page-row="${secondParentPageId}"]`).first();
    const secondChildRow = page.locator(`[data-builder-page-row="${secondChildPageId}"]`).first();
    await expect(firstParentRow).toBeVisible();
    await expect(firstChildRow).toBeVisible();
    await expect(secondParentRow).toBeVisible();
    await expect(secondChildRow).toBeVisible();

    await firstParentRow.hover();
    await firstParentRow.getByRole('button', { name: '페이지 메뉴' }).click();
    await expect(firstParentRow.locator(`[data-builder-move-page-down="${firstParentPageId}"]`)).toBeEnabled();

    const orderResponsePromise = page.waitForResponse((response) => (
      response.request().method() === 'PATCH'
      && response.url().includes('/api/builder/site/pages/order')
    ));
    await firstParentRow.locator(`[data-builder-move-page-down="${firstParentPageId}"]`).click();
    const orderResponse = await orderResponsePromise;
    expect(orderResponse.status()).toBe(200);

    const reorderedRows = await page.locator('[data-builder-page-row]').evaluateAll((rows) => rows.map((row) => (
      row.getAttribute('data-builder-page-row')
    )));
    expect(reorderedRows.indexOf(secondParentPageId)).toBeLessThan(reorderedRows.indexOf(secondChildPageId));
    expect(reorderedRows.indexOf(secondChildPageId)).toBeLessThan(reorderedRows.indexOf(firstParentPageId));
    expect(reorderedRows.indexOf(firstParentPageId)).toBeLessThan(reorderedRows.indexOf(firstChildPageId));

    const persistedOrder = await listBuilderPageIds(page.request, `${scope}-persisted`);
    expect(persistedOrder.indexOf(secondParentPageId)).toBeLessThan(persistedOrder.indexOf(secondChildPageId));
    expect(persistedOrder.indexOf(secondChildPageId)).toBeLessThan(persistedOrder.indexOf(firstParentPageId));
    expect(persistedOrder.indexOf(firstParentPageId)).toBeLessThan(persistedOrder.indexOf(firstChildPageId));
  } finally {
    await deleteBuilderPage(page.request, secondChildPageId, `${scope}-cleanup`);
    await deleteBuilderPage(page.request, secondParentPageId, `${scope}-cleanup`);
    await deleteBuilderPage(page.request, firstChildPageId, `${scope}-cleanup`);
    await deleteBuilderPage(page.request, firstParentPageId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder creates wildcard redirects for dynamic item page slug rename', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const scope = `slug-wildcard-${token}`;
  const oldSlug = `dynamic-old-${token}`;
  const newSlug = `dynamic-new-${token}`;
  const recordSlug = 'taiwan-company-establishment-basics';
  let pageId: string | null = null;
  const createdRedirectIds: string[] = [];

  try {
    pageId = await createDynamicItemPage(page.request, oldSlug, `Dynamic old ${token}`, scope);

    const renameResponse = await page.request.patch(`/api/builder/site/pages/${pageId}?locale=ko`, {
      headers: mutationHeaders(`${scope}-rename`),
      data: {
        title: `Dynamic new ${token}`,
        slug: newSlug,
        createRedirect: true,
      },
    });
    expect(renameResponse.status()).toBe(200);
    const renamePayload = (await renameResponse.json()) as {
      ok?: boolean;
      redirectCreated?: boolean;
      page?: { slug?: string };
      error?: string;
    };
    expect(renamePayload.ok, renamePayload.error).toBe(true);
    expect(renamePayload.redirectCreated).toBe(true);
    expect(renamePayload.page?.slug).toBe(newSlug);

    const redirects = await listRedirects(page.request, `${scope}-list`);
    const exact = redirects.find((candidate) =>
      candidate.from === `/ko/${oldSlug}` && candidate.to === `/ko/${newSlug}`
    );
    const wildcard = redirects.find((candidate) =>
      candidate.from === `/ko/${oldSlug}/*` && candidate.to === `/ko/${newSlug}/*`
    );
    expect(exact).toBeTruthy();
    expect(wildcard).toBeTruthy();
    createdRedirectIds.push(exact!.redirectId, wildcard!.redirectId);

    await expectPublicRedirect(page, `/ko/${oldSlug}/${recordSlug}`, 301, `/ko/${newSlug}/${recordSlug}`);
  } finally {
    const redirects = await listRedirects(page.request, `${scope}-cleanup`).catch(() => []);
    for (const redirect of redirects) {
      if (
        redirect.from === `/ko/${oldSlug}`
        || redirect.from === `/ko/${oldSlug}/*`
        || redirect.to === `/ko/${newSlug}`
        || redirect.to === `/ko/${newSlug}/*`
      ) {
        createdRedirectIds.push(redirect.redirectId);
      }
    }
    for (const redirectId of Array.from(new Set(createdRedirectIds))) {
      await deleteRedirect(page.request, redirectId, `${scope}-cleanup`);
    }
    await deleteBuilderPage(page.request, pageId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder SEO save creates wildcard redirects for nested dynamic item page slug rename', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const scope = `seo-wildcard-${token}`;
  const oldSlug = `${scope}/dynamic-old`;
  const newSlug = `${scope}/dynamic-new`;
  const recordSlug = 'taiwan-company-establishment-basics';
  let pageId: string | null = null;
  const createdRedirectIds: string[] = [];

  try {
    pageId = await createDynamicItemPage(page.request, oldSlug, `SEO dynamic old ${token}`, scope);

    const seoResponse = await page.request.patch(`/api/builder/site/pages/${pageId}/seo?locale=ko`, {
      headers: mutationHeaders(`${scope}-seo`),
      data: {
        slug: `/${newSlug}/`,
        seo: {
          title: `SEO dynamic new ${token}`,
        },
        createRedirect: true,
      },
    });
    expect(seoResponse.status()).toBe(200);
    const seoPayload = (await seoResponse.json()) as {
      ok?: boolean;
      redirectCreated?: boolean;
      page?: { slug?: string };
      defaults?: { publicPath?: string };
      error?: string;
    };
    expect(seoPayload.ok, seoPayload.error).toBe(true);
    expect(seoPayload.redirectCreated).toBe(true);
    expect(seoPayload.page?.slug).toBe(newSlug);
    expect(seoPayload.defaults?.publicPath).toBe(`/ko/${newSlug}`);

    const redirects = await listRedirects(page.request, `${scope}-list`);
    const exact = redirects.find((candidate) =>
      candidate.from === `/ko/${oldSlug}` && candidate.to === `/ko/${newSlug}`
    );
    const wildcard = redirects.find((candidate) =>
      candidate.from === `/ko/${oldSlug}/*` && candidate.to === `/ko/${newSlug}/*`
    );
    expect(exact).toBeTruthy();
    expect(wildcard).toBeTruthy();
    createdRedirectIds.push(exact!.redirectId, wildcard!.redirectId);

    await expectPublicRedirect(page, `/ko/${oldSlug}/${recordSlug}`, 301, `/ko/${newSlug}/${recordSlug}`);
  } finally {
    const redirects = await listRedirects(page.request, `${scope}-cleanup`).catch(() => []);
    for (const redirect of redirects) {
      if (
        redirect.from === `/ko/${oldSlug}`
        || redirect.from === `/ko/${oldSlug}/*`
        || redirect.to === `/ko/${newSlug}`
        || redirect.to === `/ko/${newSlug}/*`
      ) {
        createdRedirectIds.push(redirect.redirectId);
      }
    }
    for (const redirectId of Array.from(new Set(createdRedirectIds))) {
      await deleteRedirect(page.request, redirectId, `${scope}-cleanup`);
    }
    await deleteBuilderPage(page.request, pageId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder surfaces redirect conflicts when slug rename cannot create 301', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const scope = `slug-conflict-${token}`;
  const oldSlug = `conflict-old-${token}`;
  const newSlug = `conflict-new-${token}`;
  let pageId: string | null = null;
  const createdRedirectIds: string[] = [];

  try {
    pageId = await createBuilderPage(page.request, oldSlug, `Conflict old ${token}`, scope);
    const existingRedirectId = await createRedirect(page.request, {
      from: `/ko/${oldSlug}`,
      to: `/ko/contact?conflict=${token}`,
      note: `Existing redirect conflict ${token}`,
    }, `${scope}-existing`);
    createdRedirectIds.push(existingRedirectId);

    await openBuilder(page, pageId, token);
    await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    const row = page.locator(`[data-builder-page-row="${pageId}"]`).first();
    await expect(row).toBeVisible();
    await row.hover();
    await row.getByRole('button', { name: '페이지 메뉴' }).click();
    await row.getByRole('button', { name: '이름 변경' }).click();

    const slugInput = row.getByLabel('페이지 slug');
    await slugInput.fill(newSlug);
    const renameResponsePromise = page.waitForResponse((response) => (
      response.request().method() === 'PATCH'
      && response.url().includes(`/api/builder/site/pages/${pageId}`)
    ));
    await slugInput.press('Enter');
    const renameResponse = await renameResponsePromise;
    expect(renameResponse.status()).toBe(200);
    const renamePayload = (await renameResponse.json()) as {
      ok?: boolean;
      redirectCreated?: boolean;
      redirectWarnings?: Array<{ from?: string; message?: string }>;
      page?: { slug?: string };
      error?: string;
    };
    expect(renamePayload.ok, renamePayload.error).toBe(true);
    expect(renamePayload.page?.slug).toBe(newSlug);
    expect(renamePayload.redirectCreated).toBe(false);
    expect(renamePayload.redirectWarnings ?? []).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: `/ko/${oldSlug}`,
          message: expect.stringContaining('already has an active redirect'),
        }),
      ]),
    );

    await expect(row).toHaveAttribute('data-builder-page-slug', newSlug);
    await expect(page.getByText(`페이지는 저장됐지만 /ko/${oldSlug} redirect는 생성되지 않았습니다.`)).toBeVisible();

    const redirects = await listRedirects(page.request, `${scope}-list`);
    expect(redirects.find((candidate) =>
      candidate.from === `/ko/${oldSlug}` && candidate.to === `/ko/${newSlug}`
    )).toBeFalsy();

    await expectPublicRedirect(page, `/ko/${oldSlug}`, 301, `/ko/contact?conflict=${token}`);
  } finally {
    const redirects = await listRedirects(page.request, `${scope}-cleanup`).catch(() => []);
    for (const redirect of redirects) {
      if (
        redirect.from === `/ko/${oldSlug}`
        || redirect.to === `/ko/${newSlug}`
      ) {
        createdRedirectIds.push(redirect.redirectId);
      }
    }
    for (const redirectId of Array.from(new Set(createdRedirectIds))) {
      await deleteRedirect(page.request, redirectId, `${scope}-cleanup`);
    }
    await deleteBuilderPage(page.request, pageId, `${scope}-cleanup`);
  }
});

test('/ko/admin-builder SEO slug save reports redirect conflicts without blocking the save', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const scope = `seo-slug-conflict-${token}`;
  const oldSlug = `seo-conflict-old-${token}`;
  const newSlug = `seo-conflict-new-${token}`;
  let pageId: string | null = null;
  const createdRedirectIds: string[] = [];

  try {
    pageId = await createBuilderPage(page.request, oldSlug, `SEO conflict old ${token}`, scope);
    const existingRedirectId = await createRedirect(page.request, {
      from: `/ko/${oldSlug}`,
      to: `/ko/contact?seo-conflict=${token}`,
      note: `Existing SEO redirect conflict ${token}`,
    }, `${scope}-existing`);
    createdRedirectIds.push(existingRedirectId);

    const seoResponse = await page.request.patch(`/api/builder/site/pages/${pageId}/seo?locale=ko`, {
      headers: mutationHeaders(`${scope}-seo`),
      data: {
        slug: newSlug,
        seo: {
          title: `SEO title ${token}`,
        },
        createRedirect: true,
      },
    });
    expect(seoResponse.status()).toBe(200);
    const seoPayload = (await seoResponse.json()) as {
      ok?: boolean;
      redirectCreated?: boolean;
      redirectWarnings?: Array<{ from?: string; message?: string }>;
      page?: { slug?: string };
      error?: string;
    };
    expect(seoPayload.ok, seoPayload.error).toBe(true);
    expect(seoPayload.page?.slug).toBe(newSlug);
    expect(seoPayload.redirectCreated).toBe(false);
    expect(seoPayload.redirectWarnings ?? []).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: `/ko/${oldSlug}`,
          message: expect.stringContaining('already has an active redirect'),
        }),
      ]),
    );

    const redirects = await listRedirects(page.request, `${scope}-list`);
    expect(redirects.find((candidate) =>
      candidate.from === `/ko/${oldSlug}` && candidate.to === `/ko/${newSlug}`
    )).toBeFalsy();
  } finally {
    const redirects = await listRedirects(page.request, `${scope}-cleanup`).catch(() => []);
    for (const redirect of redirects) {
      if (
        redirect.from === `/ko/${oldSlug}`
        || redirect.to === `/ko/${newSlug}`
      ) {
        createdRedirectIds.push(redirect.redirectId);
      }
    }
    for (const redirectId of Array.from(new Set(createdRedirectIds))) {
      await deleteRedirect(page.request, redirectId, `${scope}-cleanup`);
    }
    await deleteBuilderPage(page.request, pageId, `${scope}-cleanup`);
  }
});
