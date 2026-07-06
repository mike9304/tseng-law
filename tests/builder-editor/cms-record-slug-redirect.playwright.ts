import { expect, test } from '@playwright/test';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';

const SITE_ID = 'default';
const LOCALE = 'ko';

function makeRedirectCollection(input: {
  collectionId: string;
  collectionName: string;
  recordId: string;
  oldSlug: string;
}): BuilderCmsCollection {
  const now = new Date().toISOString();
  return {
    collectionId: input.collectionId,
    name: input.collectionName,
    slug: input.collectionId,
    description: 'Playwright CMS record slug redirect coverage.',
    localized: true,
    fields: [
      {
        fieldId: 'field-title',
        key: 'title',
        label: 'Title',
        type: 'text',
        localized: true,
        repeated: false,
        required: true,
      },
      {
        fieldId: 'field-slug',
        key: 'slug',
        label: 'Slug',
        type: 'slug',
        localized: false,
        repeated: false,
        required: true,
        unique: true,
      },
    ],
    indexes: [],
    records: [
      {
        recordId: input.recordId,
        status: 'published',
        locale: LOCALE,
        fields: {
          title: `Redirect record ${input.recordId}`,
          slug: input.oldSlug,
        },
        createdAt: now,
        updatedAt: now,
      },
    ],
    permissions: {
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin'],
    },
    createdAt: now,
    updatedAt: now,
  };
}

test('/ko/admin-builder/cms record editor acknowledges persisted slug redirects', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const collectionId = `cms-record-slug-${token}`;
  const recordId = `record-${token}`;
  const oldSlug = `redirect-record-${token}`;
  const newSlug = `redirect-record-updated-${token}`;
  const oldPath = `/${LOCALE}/${collectionId}/${oldSlug}`;
  const newPath = `/${LOCALE}/${collectionId}/${newSlug}`;
  const originalSite = await readSiteDocument(SITE_ID, LOCALE);

  try {
    await writeSiteDocument({
      ...originalSite,
      cmsCollections: [
        ...(originalSite.cmsCollections ?? []).filter((collection) => collection.collectionId !== collectionId),
        makeRedirectCollection({
          collectionId,
          collectionName: `CMS Record Redirect ${token}`,
          recordId,
          oldSlug,
        }),
      ],
      redirects: (originalSite.redirects ?? []).filter((redirect) => redirect.from !== oldPath),
      updatedAt: new Date().toISOString(),
    });

    await page.goto(`/${LOCALE}/admin-builder/cms?collectionId=${collectionId}&recordId=${recordId}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.getByRole('heading', { name: `Edit ${recordId}` })).toBeVisible({ timeout: 30_000 });

    const slugInput = page.locator('[data-cms-record-field-input="slug"]').first();
    await expect(slugInput).toBeVisible();
    await slugInput.fill(newSlug);

    await page.getByRole('button', { name: 'Save record' }).click();
    await expect(page.getByText('Record updated. 301 redirect created.')).toBeVisible({ timeout: 30_000 });

    await expect.poll(async () => {
      const updatedSite = await readSiteDocument(SITE_ID, LOCALE);
      return updatedSite.redirects?.find((redirect) => redirect.from === oldPath);
    }, {
      timeout: 10_000,
      message: `${oldPath} should be persisted as a CMS record slug redirect`,
    }).toMatchObject({
      from: oldPath,
      to: newPath,
      type: 301,
      isActive: true,
    });

    const redirectResponse = await page.request.get(oldPath, {
      failOnStatusCode: false,
      maxRedirects: 0,
    });
    expect(redirectResponse.status()).toBe(301);
    expect(redirectResponse.headers().location ?? '').toContain(newPath);

    if (process.env.CMS_RECORD_SLUG_REDIRECT_SCREENSHOT_PATH) {
      await page.screenshot({
        path: process.env.CMS_RECORD_SLUG_REDIRECT_SCREENSHOT_PATH,
        fullPage: true,
      });
    }
  } finally {
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});
