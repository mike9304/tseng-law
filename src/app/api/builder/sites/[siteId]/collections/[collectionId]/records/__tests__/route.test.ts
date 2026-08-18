import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recordCmsRecordEvent } from '@/lib/builder/audit/record';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  BuilderCmsValidationError,
  createEditableBuilderCmsRecord,
} from '@/lib/builder/cms-editable';
import { emitCmsRecordCreatedHook } from '@/lib/builder/apps/lifecycle-emitters';
import type { BuilderCmsRecord } from '@/lib/builder/cms-types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin-1', permission: 'edit-pages' })),
}));

vi.mock('@/lib/builder/audit/record', () => ({
  recordCmsRecordEvent: vi.fn(),
}));

vi.mock('@/lib/builder/cms-editable', async () => {
  const actual = await vi.importActual<typeof import('@/lib/builder/cms-editable')>(
    '@/lib/builder/cms-editable',
  );
  return {
    ...actual,
    createEditableBuilderCmsRecord: vi.fn(),
    readEditableBuilderCmsCollection: vi.fn(),
  };
});

vi.mock('@/lib/builder/apps/lifecycle-emitters', () => ({
  emitCmsRecordCreatedHook: vi.fn(),
}));

const recordCmsRecordEventMock = vi.mocked(recordCmsRecordEvent);

function postRequest(collectionId: string, body: unknown): NextRequest {
  return new NextRequest(
    `https://law.example.test/api/builder/sites/default/collections/${collectionId}/records?locale=ko`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
}

describe('/api/builder/sites/[siteId]/collections/[collectionId]/records', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      username: 'admin-1',
      permission: 'edit-pages',
    });
  });

  it('emits a cms.record-created lifecycle hook after a successful record create', async () => {
    const record = {
      recordId: 'record-1',
      status: 'published',
      fields: { title: 'Article' },
      createdAt: '2026-05-20T00:11:00.000Z',
      updatedAt: '2026-05-20T00:11:00.000Z',
    } satisfies BuilderCmsRecord;
    vi.mocked(createEditableBuilderCmsRecord).mockResolvedValue(record);

    const route = await import('../route');
    const response = await route.POST(
      postRequest('articles', { fields: { title: 'Article' } }),
      { params: Promise.resolve({ siteId: 'default', collectionId: 'articles' }) },
    );

    expect(response.status).toBe(201);
    expect(emitCmsRecordCreatedHook).toHaveBeenCalledWith({
      kind: 'cms.record-created',
      payload: {
        collectionId: 'articles',
        recordId: 'record-1',
        locale: 'ko',
      },
    });
    expect(recordCmsRecordEventMock).toHaveBeenCalledWith({
      request: expect.any(NextRequest),
      type: 'created',
      siteId: 'default',
      collectionId: 'articles',
      recordId: 'record-1',
    });
  });

  it('does not record a cms.record_created audit event on validation failure', async () => {
    vi.mocked(createEditableBuilderCmsRecord).mockRejectedValueOnce(
      new BuilderCmsValidationError('title is required', ['title is required']),
    );

    const route = await import('../route');
    const response = await route.POST(
      postRequest('articles', { fields: {} }),
      { params: Promise.resolve({ siteId: 'default', collectionId: 'articles' }) },
    );

    expect(response.status).toBe(400);
    expect(recordCmsRecordEventMock).not.toHaveBeenCalled();
  });

  it('does not record a cms.record_created audit event when the collection is unknown', async () => {
    vi.mocked(createEditableBuilderCmsRecord).mockResolvedValueOnce(null);

    const route = await import('../route');
    const response = await route.POST(
      postRequest('missing', { fields: { title: 'x' } }),
      { params: Promise.resolve({ siteId: 'default', collectionId: 'missing' }) },
    );

    expect(response.status).toBe(404);
    expect(recordCmsRecordEventMock).not.toHaveBeenCalled();
  });
});
