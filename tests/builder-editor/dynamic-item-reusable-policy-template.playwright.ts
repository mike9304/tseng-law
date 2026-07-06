import { expect, test } from '@playwright/test';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  createDynamicItemPageViaApi,
  gotoCmsCollectionDetail,
  useCmsPolicyTestRequestScope,
} from './helpers/dynamic-item-policy';

function makeReusablePolicyCollection(token: string): BuilderCmsCollection {
  const now = '2026-06-25T00:00:00.000Z';
  return {
    collectionId: `recipes-reusable-policy-${token}`,
    name: `Recipe Reusable Policy ${token}`,
    slug: `recipes-reusable-policy-${token}`,
    description: 'Custom recipes used for reusable route policy proof.',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-code', key: 'code', label: 'Code', type: 'text', localized: false, repeated: false, required: false },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
    ],
    indexes: [],
    records: [
      makeRecord(token, 'alpha', `alpha-reusable-policy-${token}`),
      makeRecord(token, 'beta', `beta-reusable-policy-${token}`),
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
      title: `${label} Reusable Policy ${token}`,
      code: `${name}-code-${token}`,
      slug,
    },
    createdAt: now,
    updatedAt: now,
  };
}

test('/ko clean custom CMS dynamic item route can apply another saved policy template', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const collection = makeReusablePolicyCollection(token);
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
    const targetPageId = `reusable-policy-target-${token}`;
    const targetPage = {
      ...sourcePage,
      pageId: targetPageId,
      slug: `${sourcePage.slug}-target-${token}`,
      title: { ...sourcePage.title, ko: `Recipe reusable target ${token}` },
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
        {
          collectionId: collection.collectionId,
          pageId: sourcePageId,
          policyName: 'Public recipe routes',
          sourceFieldKey: 'code',
          slugPattern: '{{code}}-{{title}}',
          slugConflictRule: 'record-id-suffix',
          updatedAt: '2026-06-25T12:34:56.000Z',
          updatedBy: 'Admin',
        },
        ...(siteWithSourcePage.dynamicItemRoutePolicies ?? []).filter((policy) => (
          policy.collectionId !== collection.collectionId
        )),
      ],
      updatedAt: now,
    });

    await gotoCmsCollectionDetail(page, collection.collectionId);
    const targetCard = page.locator(`[data-cms-dynamic-item-linked-page="${targetPageId}"]`);
    await expect(targetCard.locator(`[data-cms-dynamic-item-route-coverage="${targetPageId}"]`))
      .toContainText('2 published record routes ready');
    await expect(targetCard.locator(`[data-cms-dynamic-item-policy-prepare-public-routes="${targetPageId}"]`))
      .toHaveCount(0);

    const policyOptions = targetCard.locator(`[data-cms-dynamic-item-policy-options="${targetPageId}"]`);
    const templateSelect = policyOptions.locator(`[data-cms-dynamic-item-policy-template="${targetPageId}"]`);
    await expect(targetCard.locator(`[data-cms-dynamic-item-lifecycle-policies="${targetPageId}"]`))
      .toContainText('Lifecycle policy');
    await expect(templateSelect).toContainText('Public recipe routes');
    await templateSelect.selectOption(sourcePageId);
    await expect(policyOptions.locator(`[data-cms-dynamic-item-policy-name="${targetPageId}"]`))
      .toHaveValue('Public recipe routes');
    await expect(policyOptions.locator(`[data-cms-dynamic-item-slug-source-field="${targetPageId}"]`))
      .toHaveValue('code');
    await expect(policyOptions.locator(`[data-cms-dynamic-item-slug-pattern="${targetPageId}"]`))
      .toHaveValue('{{code}}-{{title}}');
    await expect(policyOptions.locator(`[data-cms-dynamic-item-slug-conflict-rule="${targetPageId}"]`))
      .toHaveValue('record-id-suffix');

    await targetCard.screenshot({
      path: '/tmp/tseng-law-dynamic-item-reusable-policy-card-desktop.png',
    });
    await page.setViewportSize({ width: 390, height: 900 });
    await targetCard.scrollIntoViewIfNeeded();
    await targetCard.screenshot({
      path: '/tmp/tseng-law-dynamic-item-reusable-policy-card-mobile.png',
    });
    const hasHorizontalOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
    await page.setViewportSize({ width: 1440, height: 1000 });

    const savePolicyResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/dynamic-item-route-policies/${targetPageId}`)
      && response.request().method() === 'PUT',
    );
    await policyOptions.locator(`[data-cms-dynamic-item-policy-save="${targetPageId}"]`).click();
    expect((await savePolicyResponsePromise).status()).toBe(200);
    await expect(policyOptions.locator(`[data-cms-dynamic-item-policy-save-status="${targetPageId}"]`))
      .toContainText('Policy saved');

    await gotoCmsCollectionDetail(page, collection.collectionId);
    const reloadedPolicyOptions = page
      .locator(`[data-cms-dynamic-item-linked-page="${targetPageId}"]`)
      .locator(`[data-cms-dynamic-item-policy-options="${targetPageId}"]`);
    await expect(reloadedPolicyOptions.locator(`[data-cms-dynamic-item-policy-name="${targetPageId}"]`))
      .toHaveValue('Public recipe routes');
    await expect(reloadedPolicyOptions.locator(`[data-cms-dynamic-item-slug-source-field="${targetPageId}"]`))
      .toHaveValue('code');
  } finally {
    await writeSiteDocument(originalSite);
  }
});
