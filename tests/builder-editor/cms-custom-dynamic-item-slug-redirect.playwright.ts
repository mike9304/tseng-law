import { expect, test, type APIResponse } from '@playwright/test';
import { z } from 'zod';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';

const SITE_ID = DEFAULT_BUILDER_SITE_ID;
const LOCALE = 'ko';

const createPageResponseSchema = z.object({
  pageId: z.string(),
});

const redirectListResponseSchema = z.object({
  redirects: z.array(z.object({
    redirectId: z.string(),
    from: z.string(),
    to: z.string(),
    type: z.number(),
    isActive: z.boolean(),
  })).optional(),
});

function makeCollection(input: {
  collectionId: string;
  recordId: string;
  oldSlug: string;
}): BuilderCmsCollection {
  const now = '2026-06-21T00:00:00.000Z';
  return {
    collectionId: input.collectionId,
    name: `Recipe Redirect ${input.collectionId}`,
    slug: input.collectionId,
    description: 'Custom CMS dynamic item slug redirect coverage.',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true, unique: true },
    ],
    indexes: [],
    records: [
      {
        recordId: input.recordId,
        status: 'published',
        locale: LOCALE,
        fields: {
          title: `Recipe ${input.recordId}`,
          slug: input.oldSlug,
        },
        createdAt: now,
        updatedAt: now,
      },
    ],
    permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
    createdAt: now,
    updatedAt: now,
  };
}

async function expectStatus(response: APIResponse, status: number, context: string): Promise<void> {
  if (response.status() === status) return;
  expect(response.status(), `${context}: ${await response.text()}`).toBe(status);
}

function basicAuthHeader(): string {
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

test('/ko/admin-builder/cms creates redirects for custom CMS dynamic item slug changes', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const collectionId = `custom-slug-${token}`;
  const recordId = `record-${token}`;
  const pageSlug = `recipe-detail-${token}`;
  const oldSlug = `old-recipe-${token}`;
  const newSlug = `new-recipe-${token}`;
  const oldCollectionPath = `/${LOCALE}/${collectionId}/${oldSlug}`;
  const oldDynamicPath = `/${LOCALE}/${pageSlug}/${oldSlug}`;
  const newDynamicPath = `/${LOCALE}/${pageSlug}/${newSlug}`;
  const requestHeaders = { 'x-forwarded-for': `pw-cms-custom-slug-${token}` } as const;
  const apiHeaders = { ...requestHeaders, authorization: basicAuthHeader() } as const;
  let createdPageId: string | null = null;
  let createdRedirectIds: string[] = [];

  try {
    await page.route('**/api/builder/**', async (route) => {
      await route.continue({
        headers: {
          ...route.request().headers(),
          ...requestHeaders,
        },
      });
    });

    const collectionSeed = makeCollection({ collectionId, recordId, oldSlug });
    await expectStatus(
      await page.request.post(`/api/builder/sites/${SITE_ID}/collections?locale=${LOCALE}`, {
        headers: apiHeaders,
        data: {
          collectionId: collectionSeed.collectionId,
          name: collectionSeed.name,
          slug: collectionSeed.slug,
          description: collectionSeed.description,
          localized: collectionSeed.localized,
          fields: collectionSeed.fields,
          indexes: collectionSeed.indexes,
          permissions: collectionSeed.permissions,
        },
      }),
      201,
      'create custom CMS collection',
    );
    await expectStatus(
      await page.request.post(`/api/builder/sites/${SITE_ID}/collections/${collectionId}/records?locale=${LOCALE}`, {
        headers: apiHeaders,
        data: {
          recordId,
          status: 'published',
          locale: LOCALE,
          fields: {
            title: `Recipe ${recordId}`,
            slug: oldSlug,
          },
        },
      }),
      201,
      'create custom CMS record',
    );
    const createPageResponse = await page.request.post(`/api/builder/site/pages?locale=${LOCALE}`, {
      headers: apiHeaders,
      data: {
        siteId: SITE_ID,
        locale: LOCALE,
        slug: pageSlug,
        title: `Recipe detail ${token}`,
        addToNavigation: false,
        dynamicItemCmsCollectionId: collectionId,
        dynamicItemRecordSlug: oldSlug,
      },
    });
    await expectStatus(
      createPageResponse,
      200,
      'create custom CMS dynamic item page',
    );
    createdPageId = createPageResponseSchema.parse(await createPageResponse.json()).pageId;

    await expectStatus(
      await page.request.get(`/api/builder/sites/${SITE_ID}/collections/${collectionId}?locale=${LOCALE}`, {
        headers: apiHeaders,
      }),
      200,
      'read seeded custom CMS collection',
    );

    await page.goto(`/${LOCALE}/admin-builder/cms?collectionId=${collectionId}&recordId=${recordId}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByRole('heading', { name: `Edit ${recordId}` })).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('[data-cms-slug-helper-card="slug"]')).toContainText(
      `${oldDynamicPath}`,
    );
    await expect(page.locator('[data-cms-slug-redirect-status="slug"]')).toContainText('301 redirect on save');

    await page.locator('[data-cms-record-field-input="slug"]').first().fill(newSlug);
    await page.getByRole('button', { name: 'Save record' }).click();
    await expect(page.getByText('Record updated. 301 redirect created.')).toBeVisible({ timeout: 30_000 });

    await expect.poll(async () => {
      const response = await page.request.get(`/api/builder/site/redirects?locale=${LOCALE}`, {
        headers: apiHeaders,
      });
      if (!response.ok()) return [];
      const payload = redirectListResponseSchema.parse(await response.json());
      const matchingRedirects = (payload.redirects ?? []).filter((redirect) => (
        redirect.from === oldCollectionPath || redirect.from === oldDynamicPath
      ));
      createdRedirectIds = matchingRedirects.map((redirect) => redirect.redirectId);
      return matchingRedirects.map((redirect) => [redirect.from, redirect.to, redirect.type, redirect.isActive]);
    }, {
      timeout: 10_000,
      message: 'custom CMS slug save should persist collection and dynamic item redirects',
    }).toEqual(expect.arrayContaining([
      [oldCollectionPath, `/${LOCALE}/${collectionId}/${newSlug}`, 301, true],
      [oldDynamicPath, newDynamicPath, 301, true],
    ]));

    const redirectResponse = await page.request.get(oldDynamicPath, {
      failOnStatusCode: false,
      maxRedirects: 0,
    });
    expect(redirectResponse.status()).toBe(301);
    expect(redirectResponse.headers().location ?? '').toContain(newDynamicPath);
  } finally {
    await Promise.all(createdRedirectIds.map((redirectId) => (
      page.request.delete(`/api/builder/site/redirects/${redirectId}?locale=${LOCALE}`, {
        headers: apiHeaders,
        failOnStatusCode: false,
      }).catch(() => undefined)
    )));
    if (createdPageId) {
      await page.request.delete(`/api/builder/site/pages/${createdPageId}?locale=${LOCALE}`, {
        headers: apiHeaders,
        failOnStatusCode: false,
      }).catch(() => undefined);
    }
    await page.request.delete(`/api/builder/sites/${SITE_ID}/collections/${collectionId}?locale=${LOCALE}`, {
      headers: apiHeaders,
      failOnStatusCode: false,
    }).catch(() => undefined);
  }
});
