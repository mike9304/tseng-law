import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import {
  DEFAULT_THEME,
  type BuilderPageMeta,
  type BuilderSiteDocument,
} from '@/lib/builder/site/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  runDueCmsDynamicItemScheduledPolicies,
  scheduleCmsDynamicItemPolicy,
} from '@/lib/builder/cms-dynamic-item-scheduled-policy';
import { normalizeCmsDynamicItemScheduledPolicyJob } from '@/lib/builder/cms-dynamic-item-scheduled-policy-types';

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

describe('CMS dynamic item scheduled route policy', () => {
  let siteDoc: BuilderSiteDocument;
  let scheduleRoot: string;
  let originalRoot: string | undefined;
  let originalBackend: string | undefined;

  beforeEach(async () => {
    siteDoc = makeSiteDoc();
    scheduleRoot = await mkdtemp(path.join(tmpdir(), 'cms-dynamic-policy-'));
    originalRoot = process.env.BUILDER_CMS_DYNAMIC_ITEM_POLICY_SCHEDULE_ROOT;
    originalBackend = process.env.BUILDER_SITE_BACKEND;
    process.env.BUILDER_CMS_DYNAMIC_ITEM_POLICY_SCHEDULE_ROOT = scheduleRoot;
    process.env.BUILDER_SITE_BACKEND = 'local';
    mockedReadSiteDocument.mockReset();
    mockedReadSiteDocument.mockImplementation(async () => siteDoc);
    mockedWriteSiteDocument.mockReset();
    mockedWriteSiteDocument.mockImplementation(async (nextDoc) => {
      siteDoc = nextDoc;
    });
  });

  afterEach(async () => {
    if (originalRoot === undefined) {
      delete process.env.BUILDER_CMS_DYNAMIC_ITEM_POLICY_SCHEDULE_ROOT;
    } else {
      process.env.BUILDER_CMS_DYNAMIC_ITEM_POLICY_SCHEDULE_ROOT = originalRoot;
    }
    if (originalBackend === undefined) {
      delete process.env.BUILDER_SITE_BACKEND;
    } else {
      process.env.BUILDER_SITE_BACKEND = originalBackend;
    }
    await rm(scheduleRoot, { recursive: true, force: true });
  });

  it('runs a due saved prepare policy against current route lifecycle records', async () => {
    // Given: a saved policy is scheduled for a linked custom dynamic item page.
    await scheduleCmsDynamicItemPolicy({
      siteId: 'test-site',
      locale: 'ko',
      collectionId: 'recipes',
      pageId: 'page-recipes-detail',
      kind: 'prepare-public-routes',
      scheduledAt: '2026-06-25T00:00:00.000Z',
      requestedBy: 'Admin',
      policy: {
        policyName: 'Public recipe routes',
        sourceFieldKey: 'code',
        slugPattern: '{{code}}-{{title}}',
        slugConflictRule: 'record-id-suffix',
      },
    });

    // When: the scheduled policy cron runner processes due jobs.
    const result = await runDueCmsDynamicItemScheduledPolicies({
      now: new Date('2026-06-25T00:05:00.000Z'),
      limit: 5,
    });

    // Then: missing slugs, duplicate slugs, and held-back records are prepared.
    expect(result.due).toBe(1);
    expect(result.applied).toBe(1);
    expect(result.failed).toBe(0);
    expect(result.jobs[0]?.status).toBe('applied');
    expect(result.jobs[0]?.generated).toBe(1);
    expect(result.jobs[0]?.repaired).toBe(1);
    expect(result.jobs[0]?.published).toBe(1);
    const collection = siteDoc.cmsCollections?.find((item) => item.collectionId === 'recipes');
    expect(collection?.records.find((record) => record.recordId === 'recipe-draft')?.status).toBe('published');
    expect(collection?.records.find((record) => record.recordId === 'recipe-missing')?.fields.slug)
      .toBe('missing-code-missing-title');
    expect(collection?.records.find((record) => record.recordId === 'recipe-duplicate')?.fields.slug)
      .toBe('duplicate-code-duplicate-title-recipe-duplicate');
  });

  it('keeps UUID scheduled policy jobs when the job ID starts with a digit', () => {
    // Given: a persisted scheduled policy job has a UUID-like job ID starting with a digit.
    const job = normalizeCmsDynamicItemScheduledPolicyJob({
      jobId: '08c55a27-ef88-49dc-8e82-3a023cc9d45b',
      siteId: 'test-site',
      locale: 'ko',
      collectionId: 'recipes',
      pageId: 'page-recipes-detail',
      kind: 'prepare-public-routes',
      scheduledAt: '2026-06-25T00:00:00.000Z',
      status: 'scheduled',
      attempts: 0,
      createdAt: '2026-06-25T00:00:00.000Z',
      updatedAt: '2026-06-25T00:00:00.000Z',
      policy: {
        policyName: 'Public recipe routes',
        sourceFieldKey: 'code',
        slugPattern: '{{code}}-{{title}}',
        slugConflictRule: 'record-id-suffix',
      },
    });

    // When/Then: the persisted job remains readable by the local/blob schedule stores.
    expect(job?.jobId).toBe('08c55a27-ef88-49dc-8e82-3a023cc9d45b');
  });
});

function makeSiteDoc(): BuilderSiteDocument {
  const now = '2026-06-25T00:00:00.000Z';
  return {
    version: 1,
    siteId: 'test-site',
    name: 'Test site',
    locale: 'ko',
    navigation: [],
    theme: DEFAULT_THEME,
    pages: [makeDynamicItemPage(now)],
    cmsCollections: [makeCollection(now)],
    createdAt: now,
    updatedAt: now,
  };
}

function makeDynamicItemPage(now: string): BuilderPageMeta {
  return {
    pageId: 'page-recipes-detail',
    slug: 'recipes-detail',
    title: { ko: 'Recipes detail', en: 'Recipes detail', 'zh-hant': 'Recipes detail' },
    locale: 'ko',
    dynamicItem: {
      kind: 'collection-item-v1',
      collectionId: 'columns',
      targetId: 'home.insights.feed',
      cmsCollectionId: 'recipes',
      slugField: 'slug',
      defaultRecordSlug: 'alpha',
      createdAt: now,
    },
    createdAt: now,
    updatedAt: now,
  };
}

function makeCollection(now: string): BuilderCmsCollection {
  return {
    collectionId: 'recipes',
    name: 'Recipes',
    slug: 'recipes',
    description: '',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-code', key: 'code', label: 'Code', type: 'text', localized: false, repeated: false, required: false },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
    ],
    indexes: [],
    records: [
      makeRecord('recipe-alpha', 'published', 'Alpha Title', 'alpha-code', 'alpha'),
      makeRecord('recipe-draft', 'draft', 'Draft Title', 'draft-code', 'draft-route'),
      makeRecord('recipe-missing', 'published', 'Missing Title', 'missing-code', ''),
      makeRecord('recipe-duplicate', 'published', 'Duplicate Title', 'duplicate-code', 'alpha'),
    ],
    permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
    createdAt: now,
    updatedAt: now,
  };
}

function makeRecord(
  recordId: string,
  status: BuilderCmsCollection['records'][number]['status'],
  title: string,
  code: string,
  slug: string,
): BuilderCmsCollection['records'][number] {
  const now = '2026-06-25T00:00:00.000Z';
  return {
    recordId,
    status,
    locale: 'ko',
    fields: { title, code, slug },
    createdAt: now,
    updatedAt: now,
  };
}
