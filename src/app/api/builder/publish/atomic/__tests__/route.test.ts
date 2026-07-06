import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation, type GuardResult } from '@/lib/builder/security/guard';
import {
  publishAtomic,
  type AtomicPublishOutcome,
} from '@/lib/builder/publish-gate/atomic-publish-orchestrator';
import {
  publishDynamicTemplate,
  type PublishDynamicTemplateOutcome,
} from '@/lib/builder/dynamic-template-publish-coordinator';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(() => false),
}));

vi.mock('@/lib/builder/publish-gate/atomic-publish-orchestrator', () => ({
  publishAtomic: vi.fn(async () => ({ ok: true, status: 'committed', results: [] })),
}));

vi.mock('@/lib/builder/dynamic-template-publish-coordinator', () => ({
  publishDynamicTemplate: vi.fn(async () => ({
    outcome: { ok: true, status: 'committed', results: [] },
    resolvedPages: [],
    referencedCollectionIds: [],
  })),
}));

function atomicRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/publish/atomic', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

const testerAuth: GuardResult = { username: 'tester' };

describe('/api/builder/publish/atomic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when publish permission is missing', async () => {
    vi.mocked(guardMutation).mockResolvedValue(
      NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 }),
    );
    const route = await import('../route');
    const response = await route.POST(atomicRequest({ pageIds: ['page-1'] }));

    expect(response.status).toBe(401);
    expect(publishAtomic).not.toHaveBeenCalled();
  });

  it('rejects empty publish batches', async () => {
    vi.mocked(guardMutation).mockResolvedValue(testerAuth);
    const route = await import('../route');
    const response = await route.POST(atomicRequest({ pageIds: [], cmsCollectionIds: [] }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('nothing_to_publish');
    expect(publishAtomic).not.toHaveBeenCalled();
  });

  it('returns the atomic publish outcome on success', async () => {
    vi.mocked(guardMutation).mockResolvedValue(testerAuth);
    const outcome: AtomicPublishOutcome = {
      ok: true,
      status: 'committed',
      transactionId: 'tx-1',
      results: [{ kind: 'page', id: 'page-1', status: 'succeeded' }],
    };
    vi.mocked(publishAtomic).mockResolvedValue(outcome);
    const route = await import('../route');
    const response = await route.POST(atomicRequest({ pageIds: ['page-1'], cmsCollectionIds: ['col-1'] }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.status).toBe('committed');
    expect(payload.transactionId).toBe('tx-1');
    expect(publishAtomic).toHaveBeenCalledWith({
      pageIds: ['page-1'],
      cmsCollectionIds: ['col-1'],
      siteId: DEFAULT_BUILDER_SITE_ID,
      locale: undefined,
    });
  });

  it('derives dynamic page CMS collections when requested', async () => {
    vi.mocked(guardMutation).mockResolvedValue(testerAuth);
    const coordinated: PublishDynamicTemplateOutcome = {
      outcome: {
        ok: true,
        status: 'committed',
        transactionId: 'tx-dynamic',
        results: [
          { kind: 'page', id: 'dynamic-list-page', status: 'succeeded' },
          { kind: 'cms', id: 'recipes-alpha', status: 'succeeded' },
        ],
      },
      resolvedPages: [
        {
          pageId: 'dynamic-list-page',
          status: 'dynamic-list',
          collectionId: 'recipes-alpha',
        },
      ],
      referencedCollectionIds: ['recipes-alpha'],
    };
    vi.mocked(publishDynamicTemplate).mockResolvedValue(coordinated);

    const route = await import('../route');
    const response = await route.POST(atomicRequest({
      pageIds: ['dynamic-list-page'],
      cmsCollectionIds: ['extra-recipes'],
      deriveDynamicCollections: true,
      locale: 'ko',
      siteId: 'custom-site',
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.status).toBe('committed');
    expect(payload.referencedCollectionIds).toEqual(['recipes-alpha']);
    expect(payload.resolvedPages).toEqual(coordinated.resolvedPages);
    expect(publishDynamicTemplate).toHaveBeenCalledWith({
      pageIds: ['dynamic-list-page'],
      extraCollectionIds: ['extra-recipes'],
      siteId: 'custom-site',
      locale: 'ko',
    });
    expect(publishAtomic).not.toHaveBeenCalled();
  });
});
