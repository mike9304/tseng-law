import { expect, test } from '@playwright/test';
import { z } from 'zod';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  createDynamicItemPageViaApi,
  gotoCmsCollectionDetail,
  useCmsPolicyTestRequestScope,
} from './helpers/dynamic-item-policy';

const scheduleResponseSchema = z.object({
  ok: z.boolean().optional(),
  error: z.string().optional(),
  job: z.object({
    status: z.string(),
    scheduledAt: z.string(),
  }).optional(),
});

const cronResponseSchema = z.object({
  ok: z.boolean().optional(),
  due: z.number().optional(),
  applied: z.number().optional(),
  failed: z.number().optional(),
});

const atomicPublishResponseSchema = z.object({
  ok: z.boolean().optional(),
  error: z.string().optional(),
  referencedCollectionIds: z.array(z.string()).optional(),
});

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dynamic-item-policy';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function cronHeaders(): Record<string, string> {
  return process.env.CRON_SECRET ? { 'x-cron-secret': process.env.CRON_SECRET } : {};
}

function makeScheduledPolicyCollection(token: string): BuilderCmsCollection {
  const now = '2026-06-25T00:00:00.000Z';
  return {
    collectionId: `recipes-scheduled-policy-${token}`,
    name: `Recipe Scheduled Policy ${token}`,
    slug: `recipes-scheduled-policy-${token}`,
    description: 'Custom recipes used for scheduled route policy proof.',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-code', key: 'code', label: 'Code', type: 'text', localized: false, repeated: false, required: false },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
      { fieldId: 'f-content', key: 'content', label: 'Content', type: 'rich-text', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [
      makeRecord(token, 'alpha', 'published', `alpha-scheduled-${token}`),
      makeRecord(token, 'draft', 'draft', `draft-scheduled-${token}`),
      makeRecord(token, 'missing', 'published', ''),
      makeRecord(token, 'duplicate', 'published', `alpha-scheduled-${token}`),
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
      title: `${label} Scheduled ${token}`,
      code: `${name}-scheduled-code-${token}`,
      slug,
      content: `${label} scheduled item body ${token}`,
    },
    createdAt: now,
    updatedAt: now,
  };
}

test('/ko linked custom CMS dynamic item route policy can be scheduled and run by cron', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const collection = makeScheduledPolicyCollection(token);
  const originalSite = await readSiteDocument('default', 'ko');

  try {
    await useCmsPolicyTestRequestScope(page, collection.collectionId);
    await page.request.post('/api/cron/cms-dynamic-item-lifecycle-policies?limit=20', {
      headers: cronHeaders(),
    });
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
    const policyOptions = linkedItemPageCard.locator(`[data-cms-dynamic-item-policy-options="${pageId}"]`);
    await expect(routeCoverage).toContainText('1 draft held back');
    await expect(routeCoverage).toContainText('1 missing slug values');
    await expect(routeCoverage).toContainText('1 duplicate slug conflicts');
    await expect(policyOptions).toBeVisible();

    await policyOptions.locator(`[data-cms-dynamic-item-policy-name="${pageId}"]`)
      .fill('Scheduled public recipe routes');
    await policyOptions.locator(`[data-cms-dynamic-item-slug-source-field="${pageId}"]`).selectOption('code');
    await policyOptions.locator(`[data-cms-dynamic-item-slug-pattern="${pageId}"]`).fill('{{code}}-{{title}}');
    await policyOptions.locator(`[data-cms-dynamic-item-slug-conflict-rule="${pageId}"]`)
      .selectOption('record-id-suffix');
    const scheduleInput = linkedItemPageCard.locator(`[data-cms-dynamic-item-policy-schedule-at="${pageId}"]`);
    await expect(scheduleInput).toBeVisible();
    await scheduleInput.fill('2026-06-25T00:00');
    const scheduleResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/dynamic-item-route-policies/${pageId}/schedule`)
      && response.request().method() === 'POST',
    );
    await linkedItemPageCard.locator(`[data-cms-dynamic-item-policy-schedule-save="${pageId}"]`).click();
    const schedulePayload = scheduleResponseSchema.parse(await (await scheduleResponsePromise).json());
    expect(schedulePayload.ok, schedulePayload.error).toBe(true);
    expect(schedulePayload.job?.status).toBe('scheduled');
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-policy-schedule-status="${pageId}"]`))
      .toContainText('Scheduled Prepare public routes');

    await linkedItemPageCard.screenshot({
      path: '/tmp/tseng-law-dynamic-item-scheduled-policy-card-desktop.png',
    });
    await page.setViewportSize({ width: 390, height: 900 });
    await linkedItemPageCard.scrollIntoViewIfNeeded();
    await linkedItemPageCard.screenshot({
      path: '/tmp/tseng-law-dynamic-item-scheduled-policy-card-mobile.png',
    });
    const hasHorizontalOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
    await page.setViewportSize({ width: 1440, height: 1000 });

    const cronResponse = await page.request.post('/api/cron/cms-dynamic-item-lifecycle-policies?limit=5', {
      headers: cronHeaders(),
    });
    const cronPayload = cronResponseSchema.parse(await cronResponse.json());
    expect(cronResponse.status()).toBe(200);
    expect(cronPayload.ok).toBe(true);
    expect(cronPayload.due).toBeGreaterThanOrEqual(1);
    expect(cronPayload.applied).toBeGreaterThanOrEqual(1);
    expect(cronPayload.failed).toBe(0);

    await gotoCmsCollectionDetail(page, collection.collectionId);
    const preparedRouteCoverage = page
      .locator(`[data-cms-dynamic-item-linked-page="${pageId}"]`)
      .locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`);
    await expect(preparedRouteCoverage).toContainText('4 published record routes ready');
    await expect(preparedRouteCoverage).toContainText('0 draft held back');
    await expect(preparedRouteCoverage).toContainText('0 missing slug values');
    await expect(preparedRouteCoverage).toContainText('0 duplicate slug conflicts');

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
    if (!updatedCollection) throw new Error('Expected updated scheduled policy collection.');
    const missingSlug = readRecordSlug(updatedCollection, `recipe-missing-${token}`);
    await page.goto(`/ko/${publicSlug}/${missingSlug}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-node-id="dynamic-item-title-${collection.collectionId}"]`).first())
      .toContainText(`Missing Scheduled ${token}`);
  } finally {
    await writeSiteDocument(originalSite);
  }
});

function readRecordSlug(collection: BuilderCmsCollection, recordId: string): string {
  const record = collection.records.find((candidate) => candidate.recordId === recordId);
  const slug = record?.fields.slug;
  if (typeof slug !== 'string') throw new Error(`Missing slug for ${recordId}`);
  return slug;
}
