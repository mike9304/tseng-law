import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createProject,
  listProjects,
  validateProject,
} from '@/lib/builder/portfolio/portfolio-engine';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/portfolio/portfolio-engine', () => ({
  createProject: vi.fn(),
  filterFeaturedProjects: vi.fn((projects) => projects),
  filterProjectsByCategory: vi.fn((projects) => projects),
  filterProjectsByLocale: vi.fn((projects, locale) => projects.filter((project: { locale: string }) => project.locale === locale)),
  filterProjectsByStatus: vi.fn((projects) => projects),
  listProjects: vi.fn(),
  searchProjects: vi.fn((projects) => projects),
  sortProjects: vi.fn((projects) => projects),
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

const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const guardMutationMock = vi.mocked(guardMutation);
const createProjectMock = vi.mocked(createProject);
const listProjectsMock = vi.mocked(listProjects);
const validateProjectMock = vi.mocked(validateProject);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/portfolio${query ? `?${query}` : ''}`);
}

function postRequest(
  query = '',
  body: string | unknown = {
    locale: 'ko',
    title: 'Portfolio One',
    summary: 'Portfolio summary',
    description: 'Portfolio description',
    body: 'Portfolio body',
    category: 'company-setup',
    client: 'Client One',
    completedAt: '2026-06-18',
    tags: ['company'],
    status: 'published',
    featured: true,
    order: 1,
    coverImageUrl: '/portfolio.jpg',
    gallery: [],
  },
): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/portfolio${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/portfolio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ user: { id: 'admin-1' } } as never);
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    createProjectMock.mockResolvedValue(projectRecord as never);
    listProjectsMock.mockResolvedValue([projectRecord] as never);
    validateProjectMock.mockReturnValue([]);
  });

  it('returns projects while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=ko&scope=all&status=all&sort=order-asc'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(requireBuilderAdminAuthMock).toHaveBeenCalled();
    expect(payload).toEqual({
      ok: true,
      locale: 'ko',
      total: 1,
      projects: [projectRecord],
    });
  });

  it('returns localized query validation errors', async () => {
    const response = await GET(getRequest('locale=zh-hant&status=bad'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認作品集請求內容。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(listProjectsMock).not.toHaveBeenCalled();
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listProjectsMock.mockRejectedValueOnce(new Error('portfolio storage secret leaked'));

    const response = await GET(getRequest('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load portfolio projects.',
      errorCode: 'portfolio_list_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('portfolio storage secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/portfolio] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await POST(postRequest('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the portfolio request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized create validation errors using the body locale', async () => {
    const response = await POST(postRequest('', {
      locale: 'zh-hant',
      title: '',
      completedAt: '2026-06-18',
      category: 'company-setup',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認作品集請求內容。',
      errorCode: 'validation_error',
    });
    expect(createProjectMock).not.toHaveBeenCalled();
  });

  it('returns localized engine validation errors without leaking raw validation strings', async () => {
    validateProjectMock.mockReturnValueOnce(['프로젝트 제목을 입력하세요.']);

    const response = await POST(postRequest('', {
      locale: 'en',
      title: 'Portfolio One',
      summary: 'Portfolio summary',
      description: 'Portfolio description',
      body: 'Portfolio body',
      category: 'company-setup',
      completedAt: '2026-06-18',
      tags: [],
      status: 'published',
      featured: false,
      order: 1,
      gallery: [],
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the portfolio request.',
      errorCode: 'validation_error',
    });
    expect(JSON.stringify(payload)).not.toContain('프로젝트 제목을 입력하세요.');
  });

  it('returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createProjectMock.mockRejectedValueOnce(new Error('portfolio create secret leaked'));

    const response = await POST(postRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '포트폴리오 프로젝트를 만들지 못했습니다.',
      errorCode: 'portfolio_create_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('portfolio create secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/portfolio] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
