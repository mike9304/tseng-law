import { expect, test } from '@playwright/test';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  createDynamicItemPageViaApi,
  gotoCmsCollectionDetail,
  useCmsPolicyTestRequestScope,
} from './helpers/dynamic-item-policy';

function makeCleanPolicyCollection(token: string): BuilderCmsCollection {
  const now = '2026-06-25T00:00:00.000Z';
  return {
    collectionId: `recipes-clean-policy-${token}`,
    name: `Recipe Clean Policy ${token}`,
    slug: `recipes-clean-policy-${token}`,
    description: 'Custom recipes used for clean route policy proof.',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-code', key: 'code', label: 'Code', type: 'text', localized: false, repeated: false, required: false },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
    ],
    indexes: [],
    records: [
      makeRecord(token, 'alpha', `alpha-clean-policy-${token}`),
      makeRecord(token, 'beta', `beta-clean-policy-${token}`),
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
      title: `${label} Clean Policy ${token}`,
      code: `${name}-code-${token}`,
      slug,
    },
    createdAt: now,
    updatedAt: now,
  };
}

test('/ko clean custom CMS dynamic item route keeps saved policy manageable', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const collection = makeCleanPolicyCollection(token);
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

    const pageId = (await createDynamicItemPageViaApi(page, collection)).pageId;

    const siteWithPage = await readSiteDocument('default', 'ko');
    await writeSiteDocument({
      ...siteWithPage,
      dynamicItemRoutePolicies: [
        {
          collectionId: collection.collectionId,
          pageId,
          policyName: 'Public recipe routes',
          sourceFieldKey: 'code',
          slugPattern: '{{code}}-{{title}}',
          slugConflictRule: 'record-id-suffix',
          updatedAt: '2026-06-25T12:34:56.000Z',
          updatedBy: 'Admin',
        },
        ...(siteWithPage.dynamicItemRoutePolicies ?? []).filter((policy) => (
          policy.collectionId !== collection.collectionId || policy.pageId !== pageId
        )),
      ],
      updatedAt: new Date().toISOString(),
    });

    await gotoCmsCollectionDetail(page, collection.collectionId);
    const linkedItemPageCard = page.locator(`[data-cms-dynamic-item-linked-page="${pageId}"]`);
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('2 published record routes ready');
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-policy-prepare-public-routes="${pageId}"]`))
      .toHaveCount(0);

    const policyToolbar = linkedItemPageCard.locator(`[data-cms-dynamic-item-lifecycle-policies="${pageId}"]`);
    const policyOptions = linkedItemPageCard.locator(`[data-cms-dynamic-item-policy-options="${pageId}"]`);
    await expect(policyToolbar).toContainText('Lifecycle policy');
    await expect(policyOptions.locator(`[data-cms-dynamic-item-policy-name="${pageId}"]`))
      .toHaveValue('Public recipe routes');
    await expect(policyOptions.locator(`[data-cms-dynamic-item-slug-source-field="${pageId}"]`))
      .toHaveValue('code');
    await expect(policyOptions.locator(`[data-cms-dynamic-item-slug-pattern="${pageId}"]`))
      .toHaveValue('{{code}}-{{title}}');
    await expect(policyOptions.locator(`[data-cms-dynamic-item-slug-conflict-rule="${pageId}"]`))
      .toHaveValue('record-id-suffix');
    await expect(policyOptions.locator(`[data-cms-dynamic-item-policy-saved-summary="${pageId}"]`))
      .toContainText('Last saved by Admin on 2026-06-25 12:34 UTC');
    await linkedItemPageCard.screenshot({
      path: '/tmp/tseng-law-dynamic-item-clean-policy-card-desktop.png',
    });
    await page.setViewportSize({ width: 390, height: 900 });
    await linkedItemPageCard.scrollIntoViewIfNeeded();
    await linkedItemPageCard.screenshot({
      path: '/tmp/tseng-law-dynamic-item-clean-policy-card-mobile.png',
    });
    const hasHorizontalOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
    await page.setViewportSize({ width: 1440, height: 1000 });

    const savePolicyResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/dynamic-item-route-policies/${pageId}`)
      && response.request().method() === 'PUT',
    );
    await policyOptions.locator(`[data-cms-dynamic-item-policy-save="${pageId}"]`).click();
    expect((await savePolicyResponsePromise).status()).toBe(200);
    await expect(policyOptions.locator(`[data-cms-dynamic-item-policy-save-status="${pageId}"]`))
      .toContainText('Policy saved');
  } finally {
    await writeSiteDocument(originalSite);
  }
});
