import { expect, test } from '@playwright/test';
import { z } from 'zod';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  createDynamicItemPageViaApi,
  gotoCmsCollectionDetail,
  useCmsPolicyTestRequestScope,
} from './helpers/dynamic-item-policy';

const atomicPublishResponseSchema = z.object({
  ok: z.boolean().optional(),
  error: z.string().optional(),
  referencedCollectionIds: z.array(z.string()).optional(),
});

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dynamic-item-policy';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makePolicyCollection(token: string): BuilderCmsCollection {
  const now = '2026-06-25T00:00:00.000Z';
  return {
    collectionId: `recipes-policy-${token}`,
    name: `Recipe Policy ${token}`,
    slug: `recipes-policy-${token}`,
    description: 'Custom recipes used for lifecycle policy proof.',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-code', key: 'code', label: 'Code', type: 'text', localized: false, repeated: false, required: false },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
      { fieldId: 'f-content', key: 'content', label: 'Content', type: 'rich-text', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [
      makeRecord(token, 'alpha', 'published', `alpha-policy-${token}`),
      makeRecord(token, 'draft', 'draft', `draft-policy-${token}`),
      makeRecord(token, 'missing', 'published', ''),
      makeRecord(token, 'duplicate', 'published', `alpha-policy-${token}`),
      makeRecord(token, 'archived', 'archived', `archived-policy-${token}`),
    ],
    permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
    createdAt: now,
    updatedAt: now,
  };
}

function makeRecord(
  token: string,
  name: string,
  status: BuilderCmsCollection['records'][number]['status'],
  slug: string,
): BuilderCmsCollection['records'][number] {
  const label = `${name[0]?.toUpperCase() ?? ''}${name.slice(1)}`;
  const now = '2026-06-25T00:00:00.000Z';
  return {
    recordId: `recipe-${name}-${token}`,
    status,
    locale: 'ko',
    fields: {
      title: `${label} Policy ${token}`,
      code: `${name}-code-${token}`,
      slug,
      content: `${label} policy item body ${token}`,
    },
    createdAt: now,
    updatedAt: now,
  };
}

test('/ko linked custom CMS dynamic item route card applies lifecycle policy presets', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const collection = makePolicyCollection(token);
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

    const created = await createDynamicItemPageViaApi(page, collection);
    const pageId = created.pageId;
    const publicSlug = created.slug;

    await gotoCmsCollectionDetail(page, collection.collectionId);
    const linkedItemPageCard = page.locator(`[data-cms-dynamic-item-linked-page="${pageId}"]`);
    const routeCoverage = linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`);
    await expect(routeCoverage).toContainText('1 draft held back');
    await expect(routeCoverage).toContainText('1 missing slug values');
    await expect(routeCoverage).toContainText('1 duplicate slug conflicts');
    await expect(routeCoverage).toContainText('1 archived item records');

    const prepareButton = linkedItemPageCard
      .locator(`[data-cms-dynamic-item-policy-prepare-public-routes="${pageId}"]`);
    const policyOptions = linkedItemPageCard.locator(`[data-cms-dynamic-item-policy-options="${pageId}"]`);
    await expect(prepareButton).toContainText('Prepare public routes (3)');
    await expect(policyOptions).toBeVisible();
    await policyOptions.locator(`[data-cms-dynamic-item-slug-source-field="${pageId}"]`).selectOption('code');
    await policyOptions.locator(`[data-cms-dynamic-item-slug-pattern="${pageId}"]`).fill('{{code}}-{{title}}');
    await policyOptions.locator(`[data-cms-dynamic-item-slug-conflict-rule="${pageId}"]`)
      .selectOption('record-id-suffix');
    await expect(policyOptions.locator(`[data-cms-dynamic-item-slug-pattern-preview="${pageId}"]`))
      .toContainText(`missing-code-${token}-missing-policy-${token}`);
    const savePolicyButton = policyOptions.locator(`[data-cms-dynamic-item-policy-save="${pageId}"]`);
    const savePolicyResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/dynamic-item-route-policies/${pageId}`)
      && response.request().method() === 'PUT',
    );
    await savePolicyButton.click();
    const savePolicyResponse = await savePolicyResponsePromise;
    expect(savePolicyResponse.status()).toBe(200);
    await expect(policyOptions.locator(`[data-cms-dynamic-item-policy-save-status="${pageId}"]`))
      .toContainText('Policy saved');
    await expect(policyOptions.locator(`[data-cms-dynamic-item-policy-saved-summary="${pageId}"]`))
      .toContainText('Last saved by');
    await gotoCmsCollectionDetail(page, collection.collectionId);
    const reloadedLinkedItemPageCard = page.locator(`[data-cms-dynamic-item-linked-page="${pageId}"]`);
    const reloadedRouteCoverage = reloadedLinkedItemPageCard
      .locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`);
    const reloadedPolicyOptions = reloadedLinkedItemPageCard
      .locator(`[data-cms-dynamic-item-policy-options="${pageId}"]`);
    await expect(reloadedPolicyOptions.locator(`[data-cms-dynamic-item-slug-source-field="${pageId}"]`))
      .toHaveValue('code');
    await expect(reloadedPolicyOptions.locator(`[data-cms-dynamic-item-slug-pattern="${pageId}"]`))
      .toHaveValue('{{code}}-{{title}}');
    await expect(reloadedPolicyOptions.locator(`[data-cms-dynamic-item-slug-conflict-rule="${pageId}"]`))
      .toHaveValue('record-id-suffix');
    await expect(reloadedPolicyOptions.locator(`[data-cms-dynamic-item-slug-pattern-preview="${pageId}"]`))
      .toContainText(`missing-code-${token}-missing-policy-${token}`);
    await expect(reloadedPolicyOptions.locator(`[data-cms-dynamic-item-policy-saved-summary="${pageId}"]`))
      .toContainText('Last saved by');
    await expect(reloadedLinkedItemPageCard.locator(`[data-cms-dynamic-item-policy-quarantine-held-back="${pageId}"]`))
      .toContainText('Quarantine held-back (1)');
    await expect(reloadedLinkedItemPageCard.locator(`[data-cms-dynamic-item-policy-recover-archived="${pageId}"]`))
      .toContainText('Recover archived (1)');
    await reloadedLinkedItemPageCard.screenshot({
      path: '/tmp/tseng-law-dynamic-item-lifecycle-policy-card-desktop.png',
    });
    await page.setViewportSize({ width: 390, height: 900 });
    await reloadedLinkedItemPageCard.scrollIntoViewIfNeeded();
    await reloadedLinkedItemPageCard.screenshot({
      path: '/tmp/tseng-law-dynamic-item-lifecycle-policy-card-mobile.png',
    });
    const hasHorizontalOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
    await page.setViewportSize({ width: 1440, height: 1000 });

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('generate missing slug values');
      expect(dialog.message()).toContain('repair duplicate slug values');
      expect(dialog.message()).toContain('publish held-back records');
      await dialog.accept();
    });
    const reloadedPrepareButton = reloadedLinkedItemPageCard
      .locator(`[data-cms-dynamic-item-policy-prepare-public-routes="${pageId}"]`);
    await reloadedPrepareButton.click();
    await expect(reloadedRouteCoverage).toContainText('4 published record routes ready');
    await expect(reloadedRouteCoverage).toContainText('0 draft held back');
    await expect(reloadedRouteCoverage).toContainText('0 missing slug values');
    await expect(reloadedRouteCoverage).toContainText('0 duplicate slug conflicts');
    await expect(reloadedPrepareButton).toHaveCount(0);

    const publishResponse = await page.request.post('/api/builder/publish/atomic', {
      headers: mutationHeaders(publicSlug),
      data: {
        pageIds: [pageId],
        cmsCollectionIds: [],
        deriveDynamicCollections: true,
        locale: 'ko',
      },
    });
    const published = atomicPublishResponseSchema.parse(await publishResponse.json());
    expect(publishResponse.status()).toBe(200);
    expect(published.ok, published.error).toBe(true);
    expect(published.referencedCollectionIds).toEqual([collection.collectionId]);

    const updatedSite = await readSiteDocument('default', 'ko');
    const updatedCollection = updatedSite.cmsCollections?.find((item) => item.collectionId === collection.collectionId);
    if (!updatedCollection) throw new Error('Expected updated policy collection.');
    const missingSlug = readRecordSlug(updatedCollection, `recipe-missing-${token}`);
    const duplicateSlug = readRecordSlug(updatedCollection, `recipe-duplicate-${token}`);
    expect(missingSlug).toBe(`missing-code-${token}-missing-policy-${token}`);
    expect(duplicateSlug).toContain(`duplicate-code-${token}`);
    expect(duplicateSlug).toContain(`recipe-duplicate-${token}`);

    await page.goto(`/ko/${publicSlug}/draft-policy-${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-node-id="dynamic-item-title-${collection.collectionId}"]`).first())
      .toContainText(`Draft Policy ${token}`);
    await page.goto(`/ko/${publicSlug}/${missingSlug}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-node-id="dynamic-item-title-${collection.collectionId}"]`).first())
      .toContainText(`Missing Policy ${token}`);
    await page.goto(`/ko/${publicSlug}/${duplicateSlug}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-node-id="dynamic-item-title-${collection.collectionId}"]`).first())
      .toContainText(`Duplicate Policy ${token}`);
  } finally {
    await writeSiteDocument(originalSite);
  }
});

function readRecordSlug(collection: BuilderCmsCollection, recordId: string): string {
  const record = collection.records.find((candidate) => candidate.recordId === recordId);
  const slug = typeof record?.fields.slug === 'string' ? record.fields.slug : '';
  if (slug) return slug;
  throw new Error(`Expected record ${recordId} to have a slug.`);
}
