import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { generateSiteDraft } from '@/lib/builder/ai-generator/orchestrator';
import { readDraftCache, writeDraftCache } from '@/lib/builder/ai-generator/cache';
import { appendAiIntakeVersion } from '@/lib/builder/ai-generator/intake-versions-store';
import type { GeneratedSiteDraft } from '@/lib/builder/ai-generator/orchestrator';
import type { SiteSpec } from '@/lib/builder/ai-generator/site-spec';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/ai-generator/orchestrator', () => ({
  generateSiteDraft: vi.fn(),
  isSupportedAiGeneratorPromptVersion: vi.fn((version: string) => version === 'ai-site-builder-2026-05-21-af'),
  resolveAiGeneratorPromptVersion: vi.fn(() => 'ai-site-builder-2026-05-21-af'),
}));

vi.mock('@/lib/builder/ai-generator/cache', () => ({
  readDraftCache: vi.fn(() => null),
  writeDraftCache: vi.fn(),
}));

vi.mock('@/lib/builder/ai-generator/intake-versions-store', () => ({
  appendAiIntakeVersion: vi.fn(async () => ({
    id: 'ver_generated',
    siteId: 'builder-alpha',
    createdAt: '2026-07-03T00:00:00.000Z',
    createdBy: 'admin',
    promptVersion: 'ai-site-builder-2026-05-21-af',
  })),
  normalizeAiIntakeSiteId: vi.fn((siteId?: string) => siteId?.trim() || 'tseng-law-main-site'),
}));

const spec: SiteSpec = {
  industry: 'law',
  companyName: '호정국제법률사무소',
  desiredPages: ['Home'],
  tone: 'professional',
  colorPreference: 'cool',
  locale: 'ko',
};

function draft(): GeneratedSiteDraft {
  const palette = { primary: '#0f172a', secondary: '#1e3a8a', accent: '#2563eb', background: '#f8fafc' };
  return {
    spec,
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
      hero: { sectionId: 'hero', headline: '대만 법률 상담', body: 'Body' },
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

function postRequest(body: unknown, siteId = 'builder-alpha'): NextRequest {
  const search = siteId ? `?siteId=${encodeURIComponent(siteId)}` : '';
  return new NextRequest(`https://law.example.test/api/builder/ai-generator${search}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('/api/builder/ai-generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generateSiteDraft).mockResolvedValue(draft());
  });

  it('records each generated draft in the server-side intake version ledger', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({
      spec,
      promptVersion: 'ai-site-builder-2026-05-21-af',
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.versionId).toBe('ver_generated');
    expect(generateSiteDraft).toHaveBeenCalledWith(spec, {
      promptVersion: 'ai-site-builder-2026-05-21-af',
    });
    expect(writeDraftCache).toHaveBeenCalledWith(spec, expect.objectContaining({
      promptVersion: 'ai-site-builder-2026-05-21-af',
    }));
    expect(appendAiIntakeVersion).toHaveBeenCalledWith({
      siteId: 'builder-alpha',
      createdBy: 'admin',
      spec,
      draft: expect.objectContaining({
        promptVersion: 'ai-site-builder-2026-05-21-af',
      }),
      promptVersion: 'ai-site-builder-2026-05-21-af',
    });
    expect(guardMutation).toHaveBeenCalledWith(expect.any(NextRequest), { permission: 'edit-pages' });
  });

  it('records cached draft runs as new intake versions', async () => {
    vi.mocked(readDraftCache).mockReturnValue(draft());

    const route = await import('../route');
    const response = await route.POST(postRequest({
      spec,
      promptVersion: 'ai-site-builder-2026-05-21-af',
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.cached).toBe(true);
    expect(payload.versionId).toBe('ver_generated');
    expect(generateSiteDraft).not.toHaveBeenCalled();
    expect(appendAiIntakeVersion).toHaveBeenCalled();
  });

  it('returns generated drafts even when the server-side intake version write fails', async () => {
    vi.mocked(appendAiIntakeVersion).mockRejectedValueOnce(new Error('ledger unavailable'));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    try {
      const route = await import('../route');
      const response = await route.POST(postRequest({
        spec,
        promptVersion: 'ai-site-builder-2026-05-21-af',
      }));
      const payload = await response.json();

      expect(response.status).toBe(200);
      expect(payload.ok).toBe(true);
      expect(payload.versionId).toBeUndefined();
      expect(payload.versionWarning).toBe('server_version_record_failed');
      expect(payload.draft.spec.companyName).toBe(spec.companyName);
    } finally {
      warnSpy.mockRestore();
    }
  });
});
