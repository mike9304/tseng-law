import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  BuilderCmsValidationError,
  createEditableBuilderCmsCollection,
  deleteEditableBuilderCmsCollection,
  updateEditableBuilderCmsCollection,
} from '@/lib/builder/cms-editable';
import type { BuilderCmsCollectionDetail } from '@/lib/builder/cms-types';
import { listAccountCollections } from '@/lib/builder/workspace/shared-cms';
import { ensureDefaultAccount, listWorkspaceSites } from '@/lib/builder/workspace/workspace-store';
import { DELETE, GET, PATCH, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/cms-editable', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/cms-editable')>();
  return {
    ...actual,
    createEditableBuilderCmsCollection: vi.fn(),
    updateEditableBuilderCmsCollection: vi.fn(),
    deleteEditableBuilderCmsCollection: vi.fn(),
  };
});

vi.mock('@/lib/builder/workspace/workspace-store', () => ({
  ensureDefaultAccount: vi.fn(),
  listWorkspaceSites: vi.fn(),
}));

vi.mock('@/lib/builder/workspace/shared-cms', () => ({
  listAccountCollections: vi.fn(),
}));

const collection = {
  collectionId: 'services',
  name: 'Services',
  recordCount: 2,
  lastUpdatedAt: '2026-06-03T00:00:00.000Z',
  sites: ['main'],
  bindableTargets: [],
};

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const ensureDefaultAccountMock = vi.mocked(ensureDefaultAccount);
const listAccountCollectionsMock = vi.mocked(listAccountCollections);
const listWorkspaceSitesMock = vi.mocked(listWorkspaceSites);
const createEditableBuilderCmsCollectionMock = vi.mocked(createEditableBuilderCmsCollection);
const updateEditableBuilderCmsCollectionMock = vi.mocked(updateEditableBuilderCmsCollection);
const deleteEditableBuilderCmsCollectionMock = vi.mocked(deleteEditableBuilderCmsCollection);

const site = {
  siteId: 'main',
  name: 'Main',
  accountId: 'workspace-1',
  role: 'editor',
  createdAt: '2026-06-03T00:00:00.000Z',
};

const detail = {
  collectionId: 'shared-news',
  name: 'Shared News',
  slug: 'shared-news',
  description: '',
  localized: false,
  fieldCount: 0,
  indexCount: 0,
  recordCount: 0,
  permissions: {
    read: ['admin'],
    create: ['admin'],
    update: ['admin'],
    delete: ['admin'],
  },
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
  fields: [],
  indexes: [],
  records: [],
} satisfies BuilderCmsCollectionDetail;

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/workspace/cms${query ? `?${query}` : ''}`);
}

function mutationRequest(method: 'POST' | 'PATCH', body: string | unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/workspace/cms${query ? `?${query}` : ''}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function deleteRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/workspace/cms${query ? `?${query}` : ''}`, {
    method: 'DELETE',
  });
}

describe('builder workspace CMS API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({ username: 'admin' });
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    ensureDefaultAccountMock.mockResolvedValue({ id: 'workspace-1' } as never);
    listAccountCollectionsMock.mockResolvedValue([collection] as never);
    listWorkspaceSitesMock.mockResolvedValue([site] as never);
    createEditableBuilderCmsCollectionMock.mockResolvedValue(detail);
    updateEditableBuilderCmsCollectionMock.mockResolvedValue(detail);
    deleteEditableBuilderCmsCollectionMock.mockResolvedValue(true);
  });

  it('returns account collections while preserving success response shape', async () => {
    const response = await GET(request('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(expect.any(NextRequest), 'view-cms');
    expect(payload).toEqual({ ok: true, total: 1, collections: [collection] });
  });

  it('returns localized CMS failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listAccountCollectionsMock.mockRejectedValueOnce(new Error('cms rollup secret leaked'));

    const response = await GET(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '작업 공간 CMS 컬렉션을 불러오지 못했습니다.',
      errorCode: 'cms_collections_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('cms rollup secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/workspace/cms] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('creates account collections on a registered workspace site', async () => {
    const collectionInput = { collectionId: 'shared-news', name: 'Shared News', fields: [] };
    const response = await POST(mutationRequest('POST', {
      siteId: 'main',
      locale: 'en',
      collection: collectionInput,
    }));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), { permission: 'edit-pages' });
    expect(createEditableBuilderCmsCollectionMock).toHaveBeenCalledWith('main', 'en', collectionInput);
    expect(payload).toEqual({ ok: true, siteId: 'main', detail });
  });

  it('updates account collections on a registered workspace site', async () => {
    const patch = { name: 'Renamed News' };
    const response = await PATCH(mutationRequest('PATCH', {
      siteId: 'main',
      collectionId: 'shared-news',
      locale: 'en',
      patch,
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), { permission: 'edit-pages' });
    expect(updateEditableBuilderCmsCollectionMock).toHaveBeenCalledWith('main', 'en', 'shared-news', patch);
    expect(payload).toEqual({ ok: true, siteId: 'main', detail });
  });

  it('deletes account collections on a registered workspace site', async () => {
    const response = await DELETE(deleteRequest('siteId=main&collectionId=shared-news&locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), { permission: 'edit-pages' });
    expect(deleteEditableBuilderCmsCollectionMock).toHaveBeenCalledWith('main', 'en', 'shared-news');
    expect(payload).toEqual({ ok: true, siteId: 'main', collectionId: 'shared-news' });
  });

  it('rejects mutations for sites outside the workspace', async () => {
    const response = await POST(mutationRequest('POST', {
      siteId: 'unknown',
      locale: 'en',
      collection: { name: 'Outside' },
    }));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'Workspace site not found.',
      errorCode: 'cms_site_not_found',
    });
    expect(createEditableBuilderCmsCollectionMock).not.toHaveBeenCalled();
  });

  it('returns localized collection validation errors without leaking raw exceptions', async () => {
    createEditableBuilderCmsCollectionMock.mockRejectedValueOnce(
      new BuilderCmsValidationError('Static source collection IDs are reserved.', ['collectionId']),
    );

    const response = await POST(mutationRequest('POST', {
      siteId: 'main',
      locale: 'ko',
      collection: { collectionId: 'lawyers', name: 'Lawyers' },
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '작업 공간 요청을 확인해 주세요.',
      errorCode: 'validation_error',
      issues: ['collectionId'],
    });
    expect(JSON.stringify(payload)).not.toContain('Static source');
  });

  it('returns localized missing collection errors for update misses', async () => {
    updateEditableBuilderCmsCollectionMock.mockResolvedValueOnce(null);

    const response = await PATCH(mutationRequest('PATCH', {
      siteId: 'main',
      collectionId: 'missing',
      locale: 'zh-hant',
      patch: { name: 'Missing' },
    }));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到工作區 CMS 集合。',
      errorCode: 'cms_collection_not_found',
    });
  });
});
