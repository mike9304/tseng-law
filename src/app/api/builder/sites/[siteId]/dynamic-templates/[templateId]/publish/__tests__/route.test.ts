import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation, type GuardResult } from '@/lib/builder/security/guard';
import {
  publishDynamicTemplateBlockDraft,
  type PublishDynamicTemplateBlockOutcome,
} from '@/lib/builder/dynamic-template-block-publish';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(),
}));

vi.mock('@/lib/builder/dynamic-template-block-publish', () => ({
  publishDynamicTemplateBlockDraft: vi.fn(),
}));

const testerAuth: GuardResult = { username: 'template-publisher' };

const publishedOutcome = {
  status: 'published',
  templateCollectionId: 'service-areas',
  referencedCollectionIds: ['service-areas'],
  cmsPublish: {
    ok: true,
    transactionId: 'tx-template',
    status: 'committed',
    results: [{ kind: 'cms', id: 'service-areas', status: 'succeeded' }],
  },
  draft: {
    backend: 'file',
    persisted: true,
    snapshot: {
      version: 1,
      templateId: 'service-areas.item-template',
      locale: 'ko',
      revision: 3,
      savedAt: '2026-06-21T00:00:00.000Z',
      updatedBy: 'draft-editor',
      state: {
        version: 1,
        visibleBlockIds: ['service-areas.item.hero'],
        selectedRecordId: 'family',
      },
    },
  },
  published: {
    backend: 'file',
    persisted: true,
    snapshot: {
      version: 1,
      templateId: 'service-areas.item-template',
      locale: 'ko',
      revision: 4,
      savedAt: '2026-06-21T00:05:00.000Z',
      updatedBy: 'template-publisher',
      state: {
        version: 1,
        visibleBlockIds: ['service-areas.item.hero'],
        selectedRecordId: 'family',
      },
    },
  },
  snapshot: {
    version: 1,
    templateId: 'service-areas.item-template',
    locale: 'ko',
    revision: 4,
    savedAt: '2026-06-21T00:05:00.000Z',
    updatedBy: 'template-publisher',
    state: {
      version: 1,
      visibleBlockIds: ['service-areas.item.hero'],
      selectedRecordId: 'family',
    },
  },
} satisfies PublishDynamicTemplateBlockOutcome;

const cmsFailedOutcome = {
  status: 'cms-publish-failed',
  templateCollectionId: 'service-areas',
  referencedCollectionIds: ['service-areas'],
  cmsPublish: {
    ok: false,
    transactionId: 'tx-template',
    status: 'rolled-back',
    results: [{ kind: 'cms', id: 'service-areas', status: 'failed', error: 'cms_collection_not_found' }],
  },
  draft: publishedOutcome.draft,
  published: publishedOutcome.published,
  snapshot: publishedOutcome.snapshot,
} satisfies PublishDynamicTemplateBlockOutcome;

function publishRequest(body: unknown): NextRequest {
  return new NextRequest(
    'https://law.example.test/api/builder/sites/default/dynamic-templates/service-areas.item-template/publish?locale=ko',
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' },
    },
  );
}

describe('/api/builder/sites/[siteId]/dynamic-templates/[templateId]/publish', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue(testerAuth);
    vi.mocked(publishDynamicTemplateBlockDraft).mockResolvedValue(publishedOutcome);
  });

  it('denies a designer publish before running the template publisher', async () => {
    vi.mocked(guardMutation).mockResolvedValue(
      NextResponse.json({ ok: false, error: 'Missing permission: publish' }, { status: 403 }),
    );
    const route = await import('../route');
    const response = await route.POST(publishRequest({}), {
      params: Promise.resolve({ siteId: 'default', templateId: 'service-areas.item-template' }),
    });

    expect(response.status).toBe(403);
    expect(guardMutation).toHaveBeenCalledWith(
      expect.any(NextRequest),
      { bucket: 'publish', permission: 'publish' },
    );
    expect(publishDynamicTemplateBlockDraft).not.toHaveBeenCalled();
  });

  it('publishes through the dynamic template block coordinator', async () => {
    const route = await import('../route');
    const response = await route.POST(publishRequest({ updatedBy: 'route-user' }), {
      params: Promise.resolve({ siteId: 'default', templateId: 'service-areas.item-template' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.referencedCollectionIds).toEqual(['service-areas']);
    expect(payload.cmsPublish.status).toBe('committed');
    expect(payload.action).toBe('publish');
    expect(publishDynamicTemplateBlockDraft).toHaveBeenCalledWith({
      siteId: 'default',
      templateId: 'service-areas.item-template',
      locale: 'ko',
      updatedBy: 'route-user',
    });
  });

  it('returns a non-committed response without publishing the template when CMS atomic publish fails', async () => {
    vi.mocked(publishDynamicTemplateBlockDraft).mockResolvedValue(cmsFailedOutcome);

    const route = await import('../route');
    const response = await route.POST(publishRequest({}), {
      params: Promise.resolve({ siteId: 'default', templateId: 'service-areas.item-template' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(207);
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('cms_publish_failed');
    expect(payload.cmsPublish.status).toBe('rolled-back');
    expect(payload.referencedCollectionIds).toEqual(['service-areas']);
  });

  it('rejects invalid updatedBy values before calling the coordinator', async () => {
    const route = await import('../route');
    const response = await route.POST(publishRequest({ updatedBy: '' }), {
      params: Promise.resolve({ siteId: 'default', templateId: 'service-areas.item-template' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('invalid_body');
    expect(publishDynamicTemplateBlockDraft).not.toHaveBeenCalled();
  });
});
