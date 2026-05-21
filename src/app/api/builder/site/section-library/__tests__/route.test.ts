import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createSection,
  listSections,
} from '@/lib/builder/site/persistence';
import type { SavedSection } from '@/lib/builder/site/types';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createCanvasNodeTemplate } from '@/lib/builder/canvas/store';
import { draftToSavedSectionSnapshots } from '@/lib/builder/ai-generator/canvas-import';
import { generateSiteDraft } from '@/lib/builder/ai-generator/orchestrator';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'u1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  createSection: vi.fn(),
  listSections: vi.fn(),
  findSection: vi.fn(),
  updateSection: vi.fn(),
  deleteSection: vi.fn(),
  incrementSectionUsage: vi.fn(),
}));

function makeContainer(): BuilderCanvasNode {
  return {
    ...(createCanvasNodeTemplate('container', 0, 0, 0) as BuilderCanvasNode),
    id: 'root-container',
  } as BuilderCanvasNode;
}

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/section-library', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function getRequest(): NextRequest {
  const url = new URL('https://law.example.test/api/builder/site/section-library');
  url.searchParams.set('locale', 'ko');
  return new NextRequest(url, { method: 'GET' });
}

describe('/api/builder/site/section-library', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'u1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
  });

  it('returns the saved-section list with safe thumbnails on GET', async () => {
    const section: SavedSection = {
      sectionId: 'sec-1',
      name: 'Hero',
      rootNodeId: 'root-container',
      nodes: [makeContainer()],
      createdAt: '2026-05-13T00:00:00Z',
      updatedAt: '2026-05-13T00:00:00Z',
      usage: 0,
    };
    vi.mocked(listSections).mockResolvedValue([section]);

    const route = await import('../route');
    const response = await route.GET(getRequest());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.sections).toHaveLength(1);
    expect(payload.sections[0].sectionId).toBe('sec-1');
    expect(payload.sections[0].thumbnail).toContain('<svg');
  });

  it('creates a new section on valid POST and returns the persisted record', async () => {
    const persisted: SavedSection = {
      sectionId: 'sec-new',
      name: 'Pricing block',
      rootNodeId: 'root-container',
      nodes: [makeContainer()],
      createdAt: '2026-05-13T00:00:00Z',
      updatedAt: '2026-05-13T00:00:00Z',
      usage: 0,
    };
    vi.mocked(createSection).mockResolvedValue(persisted);

    const route = await import('../route');
    const response = await route.POST(
      postRequest({
        name: 'Pricing block',
        rootNodeId: 'root-container',
        nodes: [makeContainer()],
        locale: 'ko',
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.section.sectionId).toBe('sec-new');
    expect(createSection).toHaveBeenCalledTimes(1);
  });

  it('accepts AI-generated section snapshots and normalizes the root', async () => {
    const draft = await generateSiteDraft({
      industry: 'law',
      companyName: '호정국제법률사무소',
      goals: ['상담 문의 증가', '칼럼 검색 유입 확보'],
      brandKeywords: ['대만 법률', '한국어 상담'],
      tone: 'professional',
      colorPreference: 'cool',
      locale: 'ko',
    });
    const snapshot = draftToSavedSectionSnapshots({ draft, locale: 'ko', pageId: 'ai-library-api' })
      .find((item) => item.sectionTemplateId === 'services');
    expect(snapshot).toBeTruthy();
    if (!snapshot) return;

    vi.mocked(createSection).mockImplementation(async (_siteId, _locale, input) => ({
      sectionId: 'sec-ai-services',
      name: input.name,
      description: input.description,
      category: input.category,
      thumbnail: input.thumbnail,
      rootNodeId: input.rootNodeId,
      nodes: input.nodes,
      createdAt: '2026-05-13T00:00:00Z',
      updatedAt: '2026-05-13T00:00:00Z',
      usage: 0,
    }));

    const route = await import('../route');
    const response = await route.POST(
      postRequest({
        name: snapshot.name,
        description: snapshot.description,
        category: snapshot.category,
        rootNodeId: snapshot.rootNodeId,
        nodes: snapshot.nodes,
        locale: 'ko',
      }),
    );
    const payload = await response.json();
    const createInput = vi.mocked(createSection).mock.calls[0]?.[2];

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.section.sectionId).toBe('sec-ai-services');
    expect(createInput?.nodes[0]).toMatchObject({
      id: snapshot.rootNodeId,
      parentId: undefined,
      rect: expect.objectContaining({ x: 0, y: 0 }),
    });
    expect(createInput?.nodes.some((node) => (
      node.kind === 'container'
      && node.content.className?.includes('services-detail-card')
    ))).toBe(true);
  });

  it('rejects empty name with 400 (zod validation error)', async () => {
    const route = await import('../route');
    const response = await route.POST(
      postRequest({
        name: '   ',
        rootNodeId: 'root-container',
        nodes: [makeContainer()],
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('validation_error');
    expect(createSection).not.toHaveBeenCalled();
  });

  it('rejects missing nodes array with 400', async () => {
    const route = await import('../route');
    const response = await route.POST(
      postRequest({
        name: 'No nodes',
        rootNodeId: 'root-container',
        nodes: [],
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('validation_error');
    expect(createSection).not.toHaveBeenCalled();
  });

  it('refuses anonymous callers (guardMutation returns NextResponse)', async () => {
    vi.mocked(guardMutation).mockResolvedValue(
      NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    );

    const route = await import('../route');
    const response = await route.GET(getRequest());

    expect(response.status).toBe(401);
    expect(listSections).not.toHaveBeenCalled();
  });
});
