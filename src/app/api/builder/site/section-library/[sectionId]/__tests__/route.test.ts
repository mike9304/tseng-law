import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteSection,
  findSection,
  incrementSectionUsage,
  updateSection,
} from '@/lib/builder/site/persistence';
import type { SavedSection } from '@/lib/builder/site/types';
import { createCanvasNodeTemplate } from '@/lib/builder/canvas/store';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'u1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  findSection: vi.fn(),
  updateSection: vi.fn(),
  deleteSection: vi.fn(),
  incrementSectionUsage: vi.fn(),
}));

function makeSection(overrides: Partial<SavedSection> = {}): SavedSection {
  const node = {
    ...(createCanvasNodeTemplate('container', 0, 0, 0) as BuilderCanvasNode),
    id: 'root-container',
  } as BuilderCanvasNode;
  return {
    sectionId: 'sec-1',
    name: 'Hero',
    rootNodeId: 'root-container',
    nodes: [node],
    createdAt: '2026-05-13T00:00:00Z',
    updatedAt: '2026-05-13T00:00:00Z',
    usage: 0,
    ...overrides,
  };
}

function patchRequest(body: unknown): NextRequest {
  return new NextRequest(
    'https://law.example.test/api/builder/site/section-library/sec-1?locale=ko',
    {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
}

function deleteRequest(): NextRequest {
  return new NextRequest(
    'https://law.example.test/api/builder/site/section-library/sec-missing?locale=ko',
    { method: 'DELETE' },
  );
}

describe('/api/builder/site/section-library/[sectionId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'u1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
  });

  it('renames an existing section on PATCH', async () => {
    vi.mocked(updateSection).mockResolvedValue(makeSection({ name: 'Renamed' }));

    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ name: 'Renamed' }), {
      params: Promise.resolve({ sectionId: 'sec-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.section.name).toBe('Renamed');
    expect(updateSection).toHaveBeenCalledWith('default', 'ko', 'sec-1', { name: 'Renamed' });
  });

  it('increments usage when PATCH body sets incrementUsage', async () => {
    vi.mocked(incrementSectionUsage).mockResolvedValue(makeSection({ usage: 3 }));

    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ incrementUsage: true }), {
      params: Promise.resolve({ sectionId: 'sec-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.section.usage).toBe(3);
    expect(incrementSectionUsage).toHaveBeenCalledWith('default', 'ko', 'sec-1');
    expect(updateSection).not.toHaveBeenCalled();
  });

  it('returns 404 when PATCH targets an unknown section', async () => {
    vi.mocked(updateSection).mockResolvedValue(null);

    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ name: 'Renamed' }), {
      params: Promise.resolve({ sectionId: 'sec-unknown' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.errorCode).toBe('section_not_found');
  });

  it('rejects unknown fields with strict validation (zod)', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ unknownField: 'x' }), {
      params: Promise.resolve({ sectionId: 'sec-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.errorCode).toBe('validation_error');
    expect(updateSection).not.toHaveBeenCalled();
  });

  it('returns 404 when DELETE targets an unknown section', async () => {
    vi.mocked(deleteSection).mockResolvedValue(false);

    const route = await import('../route');
    const response = await route.DELETE(deleteRequest(), {
      params: Promise.resolve({ sectionId: 'sec-missing' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.errorCode).toBe('section_not_found');
  });

  it('refuses anonymous callers on DELETE (guardMutation deny)', async () => {
    vi.mocked(guardMutation).mockResolvedValue(
      NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    );

    const route = await import('../route');
    const response = await route.DELETE(deleteRequest(), {
      params: Promise.resolve({ sectionId: 'sec-missing' }),
    });

    expect(response.status).toBe(401);
    expect(deleteSection).not.toHaveBeenCalled();
  });

  it('returns the section on GET when found', async () => {
    vi.mocked(findSection).mockResolvedValue(makeSection());

    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/site/section-library/sec-1?locale=ko'),
      { params: Promise.resolve({ sectionId: 'sec-1' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.section.sectionId).toBe('sec-1');
    expect(payload.section.thumbnail).toContain('<svg');
  });

  it('returns 404 on GET when section is missing', async () => {
    vi.mocked(findSection).mockResolvedValue(null);

    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/site/section-library/sec-missing?locale=zh-hant'),
      { params: Promise.resolve({ sectionId: 'sec-missing' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toMatchObject({
      ok: false,
      error: '找不到已儲存區段。',
      errorCode: 'section_not_found',
    });
  });
});
