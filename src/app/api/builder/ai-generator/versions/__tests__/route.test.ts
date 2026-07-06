import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import type { GeneratedSiteDraft } from '@/lib/builder/ai-generator/orchestrator';
import type { SiteSpec } from '@/lib/builder/ai-generator/site-spec';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ username: 'admin', permission: 'edit-pages' })),
}));

vi.mock('@/lib/builder/ai-generator/intake-versions-store', () => ({
  appendAiIntakeVersion: vi.fn(),
  diffAiIntakeVersions: vi.fn(() => ({
    isEmpty: false,
    specChanges: [{ field: 'companyName', before: 'Old Law', after: 'New Law' }],
    draftChanges: [{ field: 'pageCount', before: 1, after: 2 }],
  })),
  getAiIntakeVersion: vi.fn(),
  listAiIntakeVersions: vi.fn(),
  normalizeAiIntakeSiteId: vi.fn((siteId?: string) => siteId ?? 'tseng-law-main-site'),
}));

function request(url: string, method = 'GET'): NextRequest {
  return new NextRequest(url, { method });
}

function spec(companyName: string): SiteSpec {
  return {
    industry: 'law',
    companyName,
    desiredPages: ['Home'],
    tone: 'professional',
    colorPreference: 'cool',
    locale: 'ko',
  };
}

function draft(companyName: string): GeneratedSiteDraft {
  const palette = { primary: '#0f172a', secondary: '#1e3a8a', accent: '#2563eb', background: '#f8fafc' };
  return {
    spec: spec(companyName),
    blueprint: {
      industry: 'law',
      sections: ['hero'],
      heroHeadlineHint: 'Trust first',
      palettes: {
        cool: palette,
        warm: palette,
        neutral: palette,
        'high-contrast': palette,
        pastel: palette,
      },
    },
    palette,
    content: {
      hero: { sectionId: 'hero', headline: `${companyName} headline`, body: 'Body' },
      sections: [],
      metaDescription: 'Meta',
    },
    plan: {
      sitemap: [{ title: 'Home', slug: '/', purpose: 'Home', sections: ['hero'] }],
      contentPlan: [],
      visualBrief: {
        direction: 'legal',
        imagePrompt: 'office',
        treatment: 'editorial',
        composition: 'split',
      },
      brandBrief: {
        audience: '',
        goals: [],
        keywords: [],
        constraints: '',
      },
    },
    generatedAt: '2026-07-03T00:00:00.000Z',
    promptVersion: 'ai-site-builder-2026-05-21-af',
    blueprintVersion: 'blueprint-test',
    contentVersion: 'content-test',
    promptChangelog: [],
  };
}

describe('/api/builder/ai-generator/versions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists server-side AI intake versions behind builder read auth', async () => {
    const store = await import('@/lib/builder/ai-generator/intake-versions-store');
    vi.mocked(store.listAiIntakeVersions).mockResolvedValue([
      {
        id: 'ver_1',
        siteId: 'builder-alpha',
        createdAt: '2026-07-03T00:00:00.000Z',
        createdBy: 'admin',
        companyName: 'New Law',
        industry: 'law',
        locale: 'ko',
        promptVersion: 'v1',
        pageCount: 1,
        sectionCount: 0,
        heroHeadline: 'New Law headline',
      },
    ]);

    const route = await import('../route');
    const response = await route.GET(request('https://law.example.test/api/builder/ai-generator/versions?siteId=builder-alpha&locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.versions).toHaveLength(1);
    expect(store.listAiIntakeVersions).toHaveBeenCalledWith('builder-alpha', { locale: 'ko' });
    expect(guardBuilderRead).toHaveBeenCalledWith(expect.any(NextRequest));
  });

  it('returns detail, diff, and restore payloads for a version', async () => {
    const store = await import('@/lib/builder/ai-generator/intake-versions-store');
    const oldRecord = {
      id: 'ver_1',
      siteId: 'builder-alpha',
      createdAt: '2026-07-03T00:00:00.000Z',
      createdBy: 'admin',
      promptVersion: 'v1',
      spec: spec('Old Law'),
      draft: draft('Old Law'),
    };
    const newRecord = {
      id: 'ver_2',
      siteId: 'builder-alpha',
      createdAt: '2026-07-03T00:01:00.000Z',
      createdBy: 'admin',
      promptVersion: 'v2',
      spec: spec('New Law'),
      draft: draft('New Law'),
    };
    vi.mocked(store.getAiIntakeVersion)
      .mockResolvedValueOnce(oldRecord)
      .mockResolvedValueOnce(oldRecord)
      .mockResolvedValueOnce(newRecord)
      .mockResolvedValueOnce(oldRecord);

    const detailRoute = await import('../[id]/route');
    const diffRoute = await import('../[id]/diff/[otherId]/route');
    const restoreRoute = await import('../[id]/restore/route');
    const detail = await detailRoute.GET(
      request('https://law.example.test/api/builder/ai-generator/versions/ver_1?siteId=builder-alpha'),
      { params: { id: 'ver_1' } },
    );
    const diff = await diffRoute.GET(
      request('https://law.example.test/api/builder/ai-generator/versions/ver_1/diff/ver_2?siteId=builder-alpha'),
      { params: { id: 'ver_1', otherId: 'ver_2' } },
    );
    const restore = await restoreRoute.POST(
      request('https://law.example.test/api/builder/ai-generator/versions/ver_1/restore?siteId=builder-alpha', 'POST'),
      { params: { id: 'ver_1' } },
    );

    expect(detail.status).toBe(200);
    expect((await detail.json()).version.spec.companyName).toBe('Old Law');
    expect(diff.status).toBe(200);
    expect((await diff.json()).diff.specChanges[0].field).toBe('companyName');
    expect(store.diffAiIntakeVersions).toHaveBeenCalledWith(oldRecord, newRecord);
    expect(restore.status).toBe(200);
    expect((await restore.json()).draft.spec.companyName).toBe('Old Law');
    expect(store.getAiIntakeVersion).toHaveBeenNthCalledWith(1, 'builder-alpha', 'ver_1');
    expect(store.getAiIntakeVersion).toHaveBeenNthCalledWith(2, 'builder-alpha', 'ver_1');
    expect(store.getAiIntakeVersion).toHaveBeenNthCalledWith(3, 'builder-alpha', 'ver_2');
    expect(store.getAiIntakeVersion).toHaveBeenNthCalledWith(4, 'builder-alpha', 'ver_1');
    expect(guardMutation).toHaveBeenCalledWith(expect.any(NextRequest), { permission: 'edit-pages' });
  });
});
