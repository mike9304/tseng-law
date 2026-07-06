import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  addSite,
  ensureDefaultAccount,
  listWorkspaceSites,
} from '@/lib/builder/workspace/workspace-store';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/workspace/workspace-store', () => ({
  addSite: vi.fn(),
  ensureDefaultAccount: vi.fn(),
  listWorkspaceSites: vi.fn(),
}));

const account = {
  id: 'workspace-1',
  name: 'Workspace',
  ownerEmail: 'owner@example.com',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const site = {
  siteId: 'main',
  name: 'Main',
  accountId: 'workspace-1',
  role: 'editor',
  createdAt: '2026-06-03T00:00:00.000Z',
};

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const addSiteMock = vi.mocked(addSite);
const ensureDefaultAccountMock = vi.mocked(ensureDefaultAccount);
const listWorkspaceSitesMock = vi.mocked(listWorkspaceSites);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/workspace/sites${query ? `?${query}` : ''}`);
}

function postRequest(
  query = '',
  body: string | unknown = { siteId: 'second', name: 'Second', role: 'viewer', locale: 'ko' },
): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/workspace/sites${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder workspace sites API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({ username: 'admin' });
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    ensureDefaultAccountMock.mockResolvedValue(account as never);
    listWorkspaceSitesMock.mockResolvedValue([site] as never);
    addSiteMock.mockResolvedValue({ ...site, siteId: 'second', name: 'Second', role: 'viewer' } as never);
  });

  it('returns workspace sites while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(expect.any(NextRequest), 'settings');
    expect(payload).toEqual({ ok: true, total: 1, sites: [site] });
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listWorkspaceSitesMock.mockRejectedValueOnce(new Error('workspace sites secret leaked'));

    const response = await GET(getRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入工作區網站清單。',
      errorCode: 'sites_list_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('workspace sites secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/workspace/sites] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized validation errors using the body locale', async () => {
    const response = await POST(postRequest('', { siteId: '', locale: 'zh-hant' }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認工作區請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(addSiteMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors using the query locale', async () => {
    const response = await POST(postRequest('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the workspace request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    addSiteMock.mockRejectedValueOnce(new Error('workspace site create secret leaked'));

    const response = await POST(postRequest('locale=en', {
      siteId: 'second',
      name: 'Second',
      role: 'viewer',
      locale: 'en',
    }));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to add the workspace site.',
      errorCode: 'site_create_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('workspace site create secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/workspace/sites] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('creates workspace sites while preserving success response shape', async () => {
    const response = await POST(postRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'mutation',
      permission: 'settings',
    });
    expect(addSiteMock).toHaveBeenCalledWith({
      siteId: 'second',
      name: 'Second',
      role: 'viewer',
    });
    expect(payload).toEqual({
      ok: true,
      site: { ...site, siteId: 'second', name: 'Second', role: 'viewer' },
    });
  });
});
