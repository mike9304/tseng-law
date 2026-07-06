import { expect, test } from '@playwright/test';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  createDynamicItemPageViaApi,
  gotoCmsCollectionDetail,
  useCmsPolicyTestRequestScope,
} from './helpers/dynamic-item-policy';

function makePolicyRolloutCollection(token: string): BuilderCmsCollection {
  const now = '2026-06-25T00:00:00.000Z';
  return {
    collectionId: `recipes-policy-rollout-${token}`,
    name: `Recipe Policy Rollout ${token}`,
    slug: `recipes-policy-rollout-${token}`,
    description: 'Custom recipes used for route policy rollout proof.',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-code', key: 'code', label: 'Code', type: 'text', localized: false, repeated: false, required: false },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
    ],
    indexes: [],
    records: [
      makeRecord(token, 'alpha', `alpha-policy-rollout-${token}`),
      makeRecord(token, 'beta', `beta-policy-rollout-${token}`),
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
      title: `${label} Policy Rollout ${token}`,
      code: `${name}-code-${token}`,
      slug,
    },
    createdAt: now,
    updatedAt: now,
  };
}

test('/ko custom CMS dynamic item route can roll out one named policy to clean target pages', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const collection = makePolicyRolloutCollection(token);
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
    const firstTargetPageId = `policy-rollout-target-a-${token}`;
    const secondTargetPageId = `policy-rollout-target-b-${token}`;
    const firstTargetPage = {
      ...sourcePage,
      pageId: firstTargetPageId,
      slug: `${sourcePage.slug}-rollout-a-${token}`,
      title: { ...sourcePage.title, ko: `Recipe rollout target A ${token}` },
      dynamicItem: { ...sourcePage.dynamicItem, createdAt: now },
      createdAt: now,
      updatedAt: now,
    };
    const secondTargetPage = {
      ...sourcePage,
      pageId: secondTargetPageId,
      slug: `${sourcePage.slug}-rollout-b-${token}`,
      title: { ...sourcePage.title, ko: `Recipe rollout target B ${token}` },
      dynamicItem: { ...sourcePage.dynamicItem, createdAt: now },
      createdAt: now,
      updatedAt: now,
    };
    await writeSiteDocument({
      ...siteWithSourcePage,
      pages: [
        ...siteWithSourcePage.pages.filter((candidate) => (
          candidate.pageId !== firstTargetPageId && candidate.pageId !== secondTargetPageId
        )),
        firstTargetPage,
        secondTargetPage,
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
    const rolloutPanel = page.locator(`[data-cms-dynamic-item-policy-rollout="${collection.collectionId}"]`);
    await expect(rolloutPanel).toContainText('2 clean linked item page(s)');
    const rolloutTemplateSelect = rolloutPanel
      .locator(`[data-cms-dynamic-item-policy-rollout-template="${collection.collectionId}"]`);
    await expect(rolloutTemplateSelect).toContainText('Public recipe routes');
    await rolloutTemplateSelect.selectOption(sourcePageId);
    await rolloutPanel.screenshot({
      path: '/tmp/tseng-law-dynamic-item-policy-rollout-panel-desktop.png',
    });

    const firstSaveResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/dynamic-item-route-policies/${firstTargetPageId}`)
      && response.request().method() === 'PUT',
    );
    const secondSaveResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/dynamic-item-route-policies/${secondTargetPageId}`)
      && response.request().method() === 'PUT',
    );
    await rolloutPanel.locator(`[data-cms-dynamic-item-policy-rollout-apply="${collection.collectionId}"]`).click();
    expect((await firstSaveResponsePromise).status()).toBe(200);
    expect((await secondSaveResponsePromise).status()).toBe(200);
    await expect(rolloutPanel.locator(`[data-cms-dynamic-item-policy-rollout-status="${collection.collectionId}"]`))
      .toContainText('Applied Public recipe routes to 2 clean page(s).');

    await page.setViewportSize({ width: 390, height: 900 });
    await rolloutPanel.scrollIntoViewIfNeeded();
    await rolloutPanel.screenshot({
      path: '/tmp/tseng-law-dynamic-item-policy-rollout-panel-mobile.png',
    });
    const hasHorizontalOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
    await page.setViewportSize({ width: 1440, height: 1000 });

    await gotoCmsCollectionDetail(page, collection.collectionId);
    await expect(page.locator(`[data-cms-dynamic-item-policy-rollout="${collection.collectionId}"]`)).toHaveCount(0);
    for (const targetPageId of [firstTargetPageId, secondTargetPageId]) {
      const policyOptions = page
        .locator(`[data-cms-dynamic-item-linked-page="${targetPageId}"]`)
        .locator(`[data-cms-dynamic-item-policy-options="${targetPageId}"]`);
      await expect(policyOptions.locator(`[data-cms-dynamic-item-policy-name="${targetPageId}"]`))
        .toHaveValue('Public recipe routes');
      await expect(policyOptions.locator(`[data-cms-dynamic-item-slug-source-field="${targetPageId}"]`))
        .toHaveValue('code');
      await expect(policyOptions.locator(`[data-cms-dynamic-item-slug-pattern="${targetPageId}"]`))
        .toHaveValue('{{code}}-{{title}}');
      await expect(policyOptions.locator(`[data-cms-dynamic-item-slug-conflict-rule="${targetPageId}"]`))
        .toHaveValue('record-id-suffix');
    }
  } finally {
    await writeSiteDocument(originalSite);
  }
});
