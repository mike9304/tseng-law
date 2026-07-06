import { beforeEach, describe, expect, it, vi } from 'vitest';
import { publishDynamicTemplateBlockDraft } from '@/lib/builder/dynamic-template-block-publish';
import {
  BuilderDynamicTemplateDraftMissingError,
  publishBuilderDynamicTemplateDraft,
  readBuilderDynamicTemplateDraft,
  readBuilderDynamicTemplatePublished,
  type BuilderDynamicTemplateDraftReadResult,
  type BuilderDynamicTemplateDraftState,
  type BuilderDynamicTemplateDraftWriteResult,
} from '@/lib/builder/dynamic-template-drafts';
import { publishAtomic, type AtomicPublishOutcome } from '@/lib/builder/publish-gate/atomic-publish-orchestrator';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';

vi.mock('@/lib/builder/dynamic-template-drafts', async () => {
  const actual = await vi.importActual<typeof import('@/lib/builder/dynamic-template-drafts')>(
    '@/lib/builder/dynamic-template-drafts',
  );
  return {
    ...actual,
    publishBuilderDynamicTemplateDraft: vi.fn(),
    readBuilderDynamicTemplateDraft: vi.fn(),
    readBuilderDynamicTemplatePublished: vi.fn(),
  };
});

vi.mock('@/lib/builder/publish-gate/atomic-publish-orchestrator', () => ({
  publishAtomic: vi.fn(),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
}));

const defaultState: BuilderDynamicTemplateDraftState = {
  version: 1,
  visibleBlockIds: ['service-areas.item.hero'],
  selectedRecordId: 'family',
};

const draftRead = {
  backend: 'file',
  persisted: true,
  snapshot: {
    version: 1,
    templateId: 'service-areas.item-template',
    locale: 'ko',
    revision: 3,
    savedAt: '2026-06-21T01:00:00.000Z',
    updatedBy: 'draft-editor',
    state: defaultState,
  },
} satisfies BuilderDynamicTemplateDraftReadResult;

const publishedRead = {
  ...draftRead,
  snapshot: {
    ...draftRead.snapshot,
    revision: 4,
    savedAt: '2026-06-21T01:05:00.000Z',
    updatedBy: 'publisher',
  },
} satisfies BuilderDynamicTemplateDraftReadResult;

const publishedWrite = {
  backend: 'file',
  snapshot: publishedRead.snapshot,
} satisfies BuilderDynamicTemplateDraftWriteResult;

const serviceAreaCollection = {
  collectionId: 'service-areas',
  name: 'Service areas',
  slug: 'service-areas',
  description: '',
  localized: true,
  fields: [],
  indexes: [],
  records: [
    {
      recordId: 'family',
      status: 'draft',
      fields: {},
      createdAt: '2026-06-21T00:00:00.000Z',
      updatedAt: '2026-06-21T00:00:00.000Z',
    },
  ],
  permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
  createdAt: '2026-06-21T00:00:00.000Z',
  updatedAt: '2026-06-21T00:00:00.000Z',
} satisfies BuilderCmsCollection;

const committedCmsPublish = {
  ok: true,
  transactionId: 'tx-template-cms',
  status: 'committed',
  results: [{ kind: 'cms', id: 'service-areas', status: 'succeeded' }],
} satisfies AtomicPublishOutcome;

const rolledBackCmsPublish = {
  ok: false,
  transactionId: 'tx-template-cms',
  status: 'rolled-back',
  results: [{ kind: 'cms', id: 'service-areas', status: 'failed', error: 'cms_collection_not_found' }],
} satisfies AtomicPublishOutcome;

describe('dynamic template block publish coordinator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readBuilderDynamicTemplateDraft).mockResolvedValue(draftRead);
    vi.mocked(readBuilderDynamicTemplatePublished).mockResolvedValue(publishedRead);
    vi.mocked(publishBuilderDynamicTemplateDraft).mockResolvedValue(publishedWrite);
    vi.mocked(publishAtomic).mockResolvedValue(committedCmsPublish);
    vi.mocked(readSiteDocument).mockResolvedValue({
      ...createDefaultSiteDocument('ko', 'default'),
      cmsCollections: [serviceAreaCollection],
    });
  });

  it('publishes a site-owned CMS collection before writing the template published snapshot', async () => {
    const result = await publishDynamicTemplateBlockDraft({
      siteId: 'default',
      templateId: 'service-areas.item-template',
      locale: 'ko',
      updatedBy: 'route-user',
    });

    expect(result.status).toBe('published');
    expect(result.templateCollectionId).toBe('service-areas');
    expect(result.referencedCollectionIds).toEqual(['service-areas']);
    expect(result.cmsPublish).toBe(committedCmsPublish);
    expect(publishAtomic).toHaveBeenCalledWith({
      siteId: 'default',
      locale: 'ko',
      pageIds: [],
      cmsCollectionIds: ['service-areas'],
    });
    expect(publishBuilderDynamicTemplateDraft).toHaveBeenCalledWith({
      templateId: 'service-areas.item-template',
      locale: 'ko',
      updatedBy: 'route-user',
    });
  });

  it('does not write the template published snapshot when CMS atomic publish rolls back', async () => {
    vi.mocked(publishAtomic).mockResolvedValue(rolledBackCmsPublish);

    const result = await publishDynamicTemplateBlockDraft({
      siteId: 'default',
      templateId: 'service-areas.item-template',
      locale: 'ko',
      updatedBy: 'route-user',
    });

    expect(result.status).toBe('cms-publish-failed');
    expect(result.referencedCollectionIds).toEqual(['service-areas']);
    expect(result.cmsPublish).toBe(rolledBackCmsPublish);
    expect(publishBuilderDynamicTemplateDraft).not.toHaveBeenCalled();
  });

  it('keeps code-owned source templates publishable when the site document has no CMS draft collection', async () => {
    vi.mocked(readSiteDocument).mockResolvedValue(createDefaultSiteDocument('ko', 'default'));

    const result = await publishDynamicTemplateBlockDraft({
      siteId: 'default',
      templateId: 'service-areas.item-template',
      locale: 'ko',
      updatedBy: 'route-user',
    });

    expect(result.status).toBe('published');
    expect(result.referencedCollectionIds).toEqual([]);
    expect(result.cmsPublish).toBeNull();
    expect(publishAtomic).not.toHaveBeenCalled();
    expect(publishBuilderDynamicTemplateDraft).toHaveBeenCalledTimes(1);
  });

  it('checks for a persisted draft before publishing CMS records', async () => {
    vi.mocked(readBuilderDynamicTemplateDraft).mockResolvedValue({
      ...draftRead,
      persisted: false,
    });

    await expect(
      publishDynamicTemplateBlockDraft({
        siteId: 'default',
        templateId: 'service-areas.item-template',
        locale: 'ko',
        updatedBy: 'route-user',
      }),
    ).rejects.toBeInstanceOf(BuilderDynamicTemplateDraftMissingError);

    expect(publishAtomic).not.toHaveBeenCalled();
    expect(publishBuilderDynamicTemplateDraft).not.toHaveBeenCalled();
  });
});
