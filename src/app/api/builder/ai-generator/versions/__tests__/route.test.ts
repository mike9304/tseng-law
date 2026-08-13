import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import type { GeneratedSiteDraft } from '@/lib/builder/ai-generator/orchestrator';
import type { SiteSpec } from '@/lib/builder/ai-generator/site-spec';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'admin',
    permission: 'edit-pages',
  })),
  guardMutation: vi.fn(async () => ({ username: 'admin', permission: 'edit-pages' })),
}));

vi.mock('@/lib/builder/ai-generator/intake-versions-store', () => ({
  AI_INTAKE_RESTORE_ERROR_CODE: 'intake_version_untrusted',
  AI_INTAKE_RESTORE_BLOCKED_MESSAGE:
    '출처가 검증된 OpenAI 생성 결과만 복원할 수 있습니다. 이 기록은 미리보기/이력 용도입니다.',
  appendAiIntakeVersion: vi.fn(),
  diffAiIntakeVersions: vi.fn(() => ({
    isEmpty: false,
    specChanges: [{ field: 'companyName', before: 'Old Law', after: 'New Law' }],
    draftChanges: [{ field: 'pageCount', before: 1, after: 2 }],
  })),
  getAiIntakeVersion: vi.fn(),
  isIntakeVersionRestorable: vi.fn((record: {
    siteId?: string;
    createdAt?: string;
    promptVersion?: string;
    spec?: unknown;
    draft?: Record<string, unknown>;
  }, expectedSiteId?: string) => {
    const draft = record?.draft;
    const content = draft?.content as Record<string, unknown> | undefined;
    const plan = draft?.plan as Record<string, unknown> | undefined;
    const blueprint = draft?.blueprint as Record<string, unknown> | undefined;
    return Boolean(
      record.siteId === expectedSiteId
      && content?.source === 'openai'
      && content.stub === false
      && draft?.palette
      && blueprint?.palettes
      && plan?.visualBrief
      && plan.brandBrief
      && record.promptVersion === draft.promptVersion
      && !Number.isNaN(new Date(record.createdAt ?? '').getTime())
      && !Number.isNaN(new Date(String(draft.generatedAt ?? '')).getTime()),
    );
  }),
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
      source: 'openai' as const,
      stub: false,
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
        provenance: 'openai-verified',
        restorable: true,
        provenanceWarning: 'OpenAI 생성 결과로 신뢰할 수 있습니다.',
      },
    ]);

    const route = await import('../route');
    const response = await route.GET(request('https://law.example.test/api/builder/ai-generator/versions?siteId=builder-alpha&locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.versions).toHaveLength(1);
    expect(store.listAiIntakeVersions).toHaveBeenCalledWith('builder-alpha', { locale: 'ko' });
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'edit-pages',
    );
  });

  it('short-circuits list, detail, and diff reads when edit-pages is denied', async () => {
    const store = await import('@/lib/builder/ai-generator/intake-versions-store');
    const forbidden = () => NextResponse.json({ error: 'Missing permission: edit-pages' }, { status: 403 });
    vi.mocked(guardBuilderReadWithPermission)
      .mockResolvedValueOnce(forbidden())
      .mockResolvedValueOnce(forbidden())
      .mockResolvedValueOnce(forbidden());

    const listRoute = await import('../route');
    const detailRoute = await import('../[id]/route');
    const diffRoute = await import('../[id]/diff/[otherId]/route');
    const list = await listRoute.GET(
      request('https://law.example.test/api/builder/ai-generator/versions?siteId=builder-alpha'),
    );
    const detail = await detailRoute.GET(
      request('https://law.example.test/api/builder/ai-generator/versions/ver_1?siteId=builder-alpha'),
      { params: Promise.resolve({ id: 'ver_1' }) },
    );
    const diff = await diffRoute.GET(
      request('https://law.example.test/api/builder/ai-generator/versions/ver_1/diff/ver_2?siteId=builder-alpha'),
      { params: Promise.resolve({ id: 'ver_1', otherId: 'ver_2' }) },
    );

    expect([list.status, detail.status, diff.status]).toEqual([403, 403, 403]);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledTimes(3);
    expect(guardBuilderReadWithPermission).toHaveBeenNthCalledWith(
      1,
      expect.any(NextRequest),
      'edit-pages',
    );
    expect(guardBuilderReadWithPermission).toHaveBeenNthCalledWith(
      2,
      expect.any(NextRequest),
      'edit-pages',
    );
    expect(guardBuilderReadWithPermission).toHaveBeenNthCalledWith(
      3,
      expect.any(NextRequest),
      'edit-pages',
    );
    expect(store.listAiIntakeVersions).not.toHaveBeenCalled();
    expect(store.getAiIntakeVersion).not.toHaveBeenCalled();
    expect(store.diffAiIntakeVersions).not.toHaveBeenCalled();
  });

  it('returns detail, diff, and restore payloads for a version', async () => {
    const store = await import('@/lib/builder/ai-generator/intake-versions-store');
    const oldRecord = {
      id: 'ver_1',
      siteId: 'builder-alpha',
      createdAt: '2026-07-03T00:00:00.000Z',
      createdBy: 'admin',
      promptVersion: 'ai-site-builder-2026-05-21-af',
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
      { params: Promise.resolve({ id: 'ver_1' }) },
    );
    const diff = await diffRoute.GET(
      request('https://law.example.test/api/builder/ai-generator/versions/ver_1/diff/ver_2?siteId=builder-alpha'),
      { params: Promise.resolve({ id: 'ver_1', otherId: 'ver_2' }) },
    );
    const restore = await restoreRoute.POST(
      request('https://law.example.test/api/builder/ai-generator/versions/ver_1/restore?siteId=builder-alpha', 'POST'),
      { params: Promise.resolve({ id: 'ver_1' }) },
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

  it('fails closed for a legacy restore record lacking provenance and leaks no draft', async () => {
    const store = await import('@/lib/builder/ai-generator/intake-versions-store');
    const legacyDraft = draft('Legacy Law') as GeneratedSiteDraft;
    delete (legacyDraft.content as { source?: unknown }).source;
    delete (legacyDraft.content as { stub?: unknown }).stub;
    const legacyRecord = {
      id: 'ver_legacy',
      siteId: 'builder-alpha',
      createdAt: '2026-07-03T00:00:00.000Z',
      createdBy: 'admin',
      promptVersion: 'v0',
      spec: spec('Legacy Law'),
      draft: legacyDraft,
    };
    vi.mocked(store.getAiIntakeVersion).mockResolvedValueOnce(legacyRecord);

    const restoreRoute = await import('../[id]/restore/route');
    const response = await restoreRoute.POST(
      request('https://law.example.test/api/builder/ai-generator/versions/ver_legacy/restore?siteId=builder-alpha', 'POST'),
      { params: Promise.resolve({ id: 'ver_legacy' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toEqual({
      ok: false,
      error: 'intake_version_untrusted',
      message: '출처가 검증된 OpenAI 생성 결과만 복원할 수 있습니다. 이 기록은 미리보기/이력 용도입니다.',
    });
    expect(payload.draft).toBeUndefined();
    expect(payload.spec).toBeUndefined();
    expect(payload.version).toBeUndefined();
    const serialized = JSON.stringify(payload);
    expect(serialized).not.toContain('openai');
    expect(serialized).not.toContain('Legacy Law');
    expect(serialized).not.toContain('secret');
    expect(store.isIntakeVersionRestorable).toHaveBeenCalledWith(legacyRecord, 'builder-alpha');
  });

  it('fails closed for a local-demo / stub restore record and leaks no draft', async () => {
    const store = await import('@/lib/builder/ai-generator/intake-versions-store');
    const demoDraft = draft('Demo Law') as GeneratedSiteDraft;
    (demoDraft.content as { source?: unknown }).source = 'local-demo';
    (demoDraft.content as { stub?: unknown }).stub = true;
    const demoRecord = {
      id: 'ver_demo',
      siteId: 'builder-alpha',
      createdAt: '2026-07-03T00:00:00.000Z',
      createdBy: 'admin',
      promptVersion: 'v0',
      spec: spec('Demo Law'),
      draft: demoDraft,
    };
    vi.mocked(store.getAiIntakeVersion).mockResolvedValueOnce(demoRecord);

    const restoreRoute = await import('../[id]/restore/route');
    const response = await restoreRoute.POST(
      request('https://law.example.test/api/builder/ai-generator/versions/ver_demo/restore?siteId=builder-alpha', 'POST'),
      { params: Promise.resolve({ id: 'ver_demo' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toEqual({
      ok: false,
      error: 'intake_version_untrusted',
      message: '출처가 검증된 OpenAI 생성 결과만 복원할 수 있습니다. 이 기록은 미리보기/이력 용도입니다.',
    });
    expect(payload.draft).toBeUndefined();
    expect(payload.spec).toBeUndefined();
    expect(payload.version).toBeUndefined();
    const serialized = JSON.stringify(payload);
    expect(serialized).not.toContain('openai');
    expect(serialized).not.toContain('local-demo');
    expect(serialized).not.toContain('Demo Law');
    expect(serialized).not.toContain('secret');
  });

  it.each([
    ['missing visual brief', (record: Record<string, unknown>) => {
      const draftValue = record.draft as Record<string, unknown>;
      delete ((draftValue.plan as Record<string, unknown>)).visualBrief;
    }],
    ['invalid record date', (record: Record<string, unknown>) => {
      record.createdAt = 'not-a-date';
    }],
    ['record/draft version mismatch', (record: Record<string, unknown>) => {
      record.promptVersion = 'spoofed-version';
    }],
    ['cross-site ledger record', (record: Record<string, unknown>) => {
      record.siteId = 'builder-other';
    }],
    ['source/stub spoof types', (record: Record<string, unknown>) => {
      const draftValue = record.draft as Record<string, unknown>;
      const content = draftValue.content as Record<string, unknown>;
      content.source = ['openai'];
      content.stub = 0;
    }],
  ])('returns 422 without draft data for malformed self-labelled record: %s', async (_label, mutate) => {
    const store = await import('@/lib/builder/ai-generator/intake-versions-store');
    const record = JSON.parse(JSON.stringify({
      id: 'ver_adversarial',
      siteId: 'builder-alpha',
      createdAt: '2026-07-03T00:00:01.000Z',
      createdBy: 'admin',
      promptVersion: 'ai-site-builder-2026-05-21-af',
      spec: spec('Adversarial Law'),
      draft: draft('Adversarial Law'),
    })) as Record<string, unknown>;
    mutate(record);
    vi.mocked(store.getAiIntakeVersion).mockResolvedValueOnce(record as never);

    const restoreRoute = await import('../[id]/restore/route');
    const response = await restoreRoute.POST(
      request('https://law.example.test/api/builder/ai-generator/versions/ver_adversarial/restore?siteId=builder-alpha', 'POST'),
      { params: Promise.resolve({ id: 'ver_adversarial' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload.error).toBe('intake_version_untrusted');
    expect(payload).not.toHaveProperty('draft');
    expect(payload).not.toHaveProperty('spec');
    expect(payload).not.toHaveProperty('version');
  });
});
