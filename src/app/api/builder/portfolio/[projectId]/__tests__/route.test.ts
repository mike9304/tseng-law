import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  deleteProject,
  loadProject,
  saveProject,
  validateProject,
} from '@/lib/builder/portfolio/portfolio-engine';
import { DELETE, GET, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'admin',
    permission: 'edit-pages',
  })),
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/portfolio/portfolio-engine', () => ({
  deleteProject: vi.fn(),
  loadProject: vi.fn(),
  saveProject: vi.fn(),
  validateProject: vi.fn(),
}));

const projectRecord = {
  projectId: 'pf-1',
  slug: 'portfolio-one',
  title: 'Portfolio One',
  summary: 'Portfolio summary',
  description: 'Portfolio description',
  body: 'Portfolio body',
  category: 'company-setup',
  client: 'Client One',
  completedAt: '2026-06-18',
  tags: ['company'],
  locale: 'ko',
  status: 'published',
  featured: true,
  order: 1,
  coverImageUrl: '/portfolio.jpg',
  gallery: [],
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const deleteProjectMock = vi.mocked(deleteProject);
const loadProjectMock = vi.mocked(loadProject);
const saveProjectMock = vi.mocked(saveProject);
const validateProjectMock = vi.mocked(validateProject);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/portfolio/pf-1${query ? `?${query}` : ''}`);
}

function patchRequest(query = '', body: string | unknown = { status: 'draft' }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/portfolio/pf-1${query ? `?${query}` : ''}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/portfolio/[projectId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'admin',
      permission: 'edit-pages',
    });
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    deleteProjectMock.mockResolvedValue(undefined as never);
    loadProjectMock.mockResolvedValue(projectRecord as never);
    saveProjectMock.mockResolvedValue({ ...projectRecord, status: 'draft' } as never);
    validateProjectMock.mockReturnValue([]);
  });

  it('returns a project while preserving success response shape', async () => {
    const req = request('scope=all&locale=ko');
    const response = await GET(req, { params: Promise.resolve({ projectId: 'pf-1' }) });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(req, 'edit-pages');
    expect(payload).toEqual({
      ok: true,
      project: projectRecord,
    });
  });

  it('short-circuits a missing edit-pages permission for scope=all with 403', async () => {
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: edit-pages' }, { status: 403 }),
    );
    const req = request('scope=all&locale=ko');

    const response = await GET(req, { params: Promise.resolve({ projectId: 'pf-1' }) });

    expect(response.status).toBe(403);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(req, 'edit-pages');
    expect(loadProjectMock).not.toHaveBeenCalled();
  });

  it('keeps a published project publicly readable without an admin permission check', async () => {
    const response = await GET(request('scope=public&locale=ko'), {
      params: Promise.resolve({ projectId: 'pf-1' }),
    });

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).not.toHaveBeenCalled();
    expect(loadProjectMock).toHaveBeenCalled();
  });

  it('returns localized not-found errors', async () => {
    loadProjectMock.mockResolvedValueOnce(null as never);

    const response = await GET(request('locale=zh-hant'), { params: Promise.resolve({ projectId: 'missing' }) });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到作品集專案。',
      errorCode: 'portfolio_project_not_found',
    });
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    loadProjectMock.mockRejectedValueOnce(new Error('portfolio load secret leaked'));

    const response = await GET(request('locale=en'), { params: Promise.resolve({ projectId: 'pf-1' }) });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load the portfolio project.',
      errorCode: 'portfolio_load_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('portfolio load secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/portfolio/:projectId] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized invalid JSON errors for patches', async () => {
    const response = await PATCH(patchRequest('locale=en', '{'), { params: Promise.resolve({ projectId: 'pf-1' }) });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the portfolio request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized update validation errors without leaking raw validation strings', async () => {
    validateProjectMock.mockReturnValueOnce(['프로젝트 제목을 입력하세요.']);

    const response = await PATCH(patchRequest('locale=en'), { params: Promise.resolve({ projectId: 'pf-1' }) });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the portfolio request.',
      errorCode: 'validation_error',
    });
    expect(JSON.stringify(payload)).not.toContain('프로젝트 제목을 입력하세요.');
  });

  it('updates a project while preserving success response shape', async () => {
    const response = await PATCH(patchRequest('locale=ko'), { params: Promise.resolve({ projectId: 'pf-1' }) });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(saveProjectMock).toHaveBeenCalledWith({ ...projectRecord, status: 'draft' });
    expect(payload).toEqual({
      ok: true,
      project: { ...projectRecord, status: 'draft' },
    });
  });

  it('returns localized update failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveProjectMock.mockRejectedValueOnce(new Error('portfolio save secret leaked'));

    const response = await PATCH(patchRequest('locale=zh-hant'), { params: Promise.resolve({ projectId: 'pf-1' }) });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法儲存作品集專案。',
      errorCode: 'portfolio_update_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('portfolio save secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/portfolio/:projectId] PATCH failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized delete failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    deleteProjectMock.mockRejectedValueOnce(new Error('portfolio delete secret leaked'));

    const response = await DELETE(request('locale=en'), { params: Promise.resolve({ projectId: 'pf-1' }) });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to delete the portfolio project.',
      errorCode: 'portfolio_delete_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('portfolio delete secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/portfolio/:projectId] DELETE failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
