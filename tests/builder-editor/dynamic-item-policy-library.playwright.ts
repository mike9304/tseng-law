import { expect, test } from '@playwright/test';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import type { BuilderCmsDynamicItemRoutePolicy } from '@/lib/builder/cms-dynamic-item-route-policy-types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  createDynamicItemPageViaApi,
  gotoCmsCollectionDetail,
  useCmsPolicyTestRequestScope,
} from './helpers/dynamic-item-policy';

function makePolicyLibraryCollection(token: string): BuilderCmsCollection {
  const now = '2026-06-25T00:00:00.000Z';
  return {
    collectionId: `recipes-policy-library-${token}`,
    name: `Recipe Policy Library ${token}`,
    slug: `recipes-policy-library-${token}`,
    description: 'Custom recipes used for route policy library proof.',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-code', key: 'code', label: 'Code', type: 'text', localized: false, repeated: false, required: false },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
    ],
    indexes: [],
    records: [
      makeRecord(token, 'alpha', `alpha-policy-library-${token}`),
      makeRecord(token, 'beta', `beta-policy-library-${token}`),
    ],
    permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
    createdAt: now,
    updatedAt: now,
  };
}

function makeRecord(
  token: string,
  name: string,
  slug: string,
): BuilderCmsCollection['records'][number] {
  const label = `${name[0]?.toUpperCase() ?? ''}${name.slice(1)}`;
  const now = '2026-06-25T00:00:00.000Z';
  return {
    recordId: `recipe-${name}-${token}`,
    status: 'published',
    locale: 'ko',
    fields: {
      title: `${label} Policy Library ${token}`,
      code: `${name}-code-${token}`,
      slug,
    },
    createdAt: now,
    updatedAt: now,
  };
}

test('/ko custom CMS dynamic item route policy library can remove one saved policy', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const collection = makePolicyLibraryCollection(token);
  const originalSite = await readSiteDocument('default', 'ko');

  try {
    await useCmsPolicyTestRequestScope(page, collection.collectionId);
    await writeSiteDocument({
      ...originalSite,
      cmsCollections: [
        ...(originalSite.cmsCollections ?? []).filter((item) => item.collectionId !== collection.collectionId),
        collection,
      ],
      updatedAt: new Date().toISOString(),
    });

    const sourcePageId = (await createDynamicItemPageViaApi(page, collection)).pageId;

    const siteWithSourcePage = await readSiteDocument('default', 'ko');
    const sourcePage = siteWithSourcePage.pages.find((candidate) => candidate.pageId === sourcePageId);
    if (!sourcePage?.dynamicItem) throw new Error('Created dynamic item page was not persisted.');

    const now = new Date().toISOString();
    const targetPageId = `policy-library-target-${token}`;
    const targetPage = {
      ...sourcePage,
      pageId: targetPageId,
      slug: `${sourcePage.slug}-library-target-${token}`,
      title: { ...sourcePage.title, ko: `Recipe library target ${token}` },
      dynamicItem: { ...sourcePage.dynamicItem, createdAt: now },
      createdAt: now,
      updatedAt: now,
    };
    await writeSiteDocument({
      ...siteWithSourcePage,
      pages: [
        ...siteWithSourcePage.pages.filter((candidate) => candidate.pageId !== targetPageId),
        targetPage,
      ],
      dynamicItemRoutePolicies: [
        makePolicy(collection.collectionId, sourcePageId, 'Source Admin'),
        makePolicy(collection.collectionId, targetPageId, 'Target Admin'),
        ...(siteWithSourcePage.dynamicItemRoutePolicies ?? []).filter((policy) => (
          policy.collectionId !== collection.collectionId
        )),
      ],
      updatedAt: now,
    });

    await gotoCmsCollectionDetail(page, collection.collectionId);
    const libraryPanel = page.locator(`[data-cms-dynamic-item-policy-library="${collection.collectionId}"]`);
    await expect(libraryPanel).toContainText('2 saved route policy entries');
    await expect(libraryPanel.locator(`[data-cms-dynamic-item-policy-library-entry="${sourcePageId}"]`))
      .toContainText('Used by 2 linked item pages');
    await libraryPanel.screenshot({
      path: '/tmp/tseng-law-dynamic-item-policy-library-panel-desktop.png',
    });

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Remove saved policy');
      await dialog.accept();
    });
    const deleteResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/dynamic-item-route-policies/${sourcePageId}`)
      && response.request().method() === 'DELETE',
    );
    await libraryPanel.locator(`[data-cms-dynamic-item-policy-library-remove="${sourcePageId}"]`).click();
    expect((await deleteResponsePromise).status()).toBe(200);
    await expect(libraryPanel.locator(`[data-cms-dynamic-item-policy-library-status="${collection.collectionId}"]`))
      .toContainText('Removed Public recipe routes');
    await expect(libraryPanel.locator(`[data-cms-dynamic-item-policy-library-entry="${sourcePageId}"]`))
      .toHaveCount(0);
    await expect(libraryPanel.locator(`[data-cms-dynamic-item-policy-library-entry="${targetPageId}"]`))
      .toContainText('Used by 1 linked item page');

    await page.setViewportSize({ width: 390, height: 900 });
    await libraryPanel.scrollIntoViewIfNeeded();
    await libraryPanel.screenshot({
      path: '/tmp/tseng-law-dynamic-item-policy-library-panel-mobile.png',
    });
    const hasHorizontalOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
    await page.setViewportSize({ width: 1440, height: 1000 });

    await gotoCmsCollectionDetail(page, collection.collectionId);
    const reloadedLibraryPanel = page.locator(`[data-cms-dynamic-item-policy-library="${collection.collectionId}"]`);
    await expect(reloadedLibraryPanel).toContainText('1 saved route policy entry');
    await expect(reloadedLibraryPanel.locator(`[data-cms-dynamic-item-policy-library-entry="${sourcePageId}"]`))
      .toHaveCount(0);
    await expect(reloadedLibraryPanel.locator(`[data-cms-dynamic-item-policy-library-entry="${targetPageId}"]`))
      .toContainText('Used by 1 linked item page');
  } finally {
    await writeSiteDocument(originalSite);
  }
});

function makePolicy(
  collectionId: string,
  pageId: string,
  updatedBy: string,
): BuilderCmsDynamicItemRoutePolicy {
  return {
    collectionId,
    pageId,
    policyName: 'Public recipe routes',
    sourceFieldKey: 'code',
    slugPattern: '{{code}}-{{title}}',
    slugConflictRule: 'record-id-suffix',
    updatedAt: '2026-06-25T12:34:56.000Z',
    updatedBy,
  };
}
