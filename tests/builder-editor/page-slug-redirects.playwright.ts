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
      issues?: Array<{ id?: string; field?: string }>;
    };
    expect(duplicatePayload.error).toBe('validation_error');
    expect(duplicatePayload.issues ?? []).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'seo-slug-duplicate', field: 'slug' }),
      ]),
    );

    await openBuilder(page, editedPageId, token);
    await page.getByRole('button', { name: 'Pages', exact: true }).click();
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
    await page.getByRole('button', { name: 'Pages', exact: true }).click();
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
