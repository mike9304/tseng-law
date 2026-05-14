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
