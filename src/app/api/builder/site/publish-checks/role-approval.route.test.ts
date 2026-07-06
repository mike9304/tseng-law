import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { runAllChecks } from '@/lib/builder/publish-gate/gate-runner';
import { readTranslationReleasePolicy } from '@/lib/builder/publish-gate/translation-release-policy';
import {
  applyTranslationReleaseApprovalToSuite,
  evaluateTranslationReleaseApprovalRequirement,
} from '@/lib/builder/publish-gate/translation-release-approval';
import { readPageCanvas, readSiteDocument } from '@/lib/builder/site/persistence';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { PublishCheckSuite } from '@/lib/builder/publish-gate/gate-runner';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/publish-checks/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/publish-gate/gate-runner', () => ({
  runAllChecks: vi.fn(),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readPageCanvas: vi.fn(),
  readSiteDocument: vi.fn(),
}));

vi.mock('@/lib/builder/publish-gate/translation-release-policy', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/publish-gate/translation-release-policy')>();
  return {
    ...actual,
    readTranslationReleasePolicy: vi.fn(async () => ({
      siteId: 'default',
      mode: 'acknowledge-other-page-warnings',
      approvalRequiredForRoles: ['admin'],
      updatedAt: '2026-06-20T00:00:00.000Z',
    })),
  };
});

vi.mock('@/lib/builder/publish-gate/translation-release-approval', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/publish-gate/translation-release-approval')>();
  return {
    ...actual,
    evaluateTranslationReleaseApprovalRequirement: vi.fn(),
    applyTranslationReleaseApprovalToSuite: vi.fn(),
  };
});

const canvas: BuilderCanvasDocument = {
  version: 1,
  locale: 'ko',
  updatedAt: '2026-06-03T00:00:00.000Z',
  updatedBy: 'test',
  stageWidth: 1280,
  stageHeight: 720,
  nodes: [],
};

const emptySuite: PublishCheckSuite = {
  results: [],
  hasBlocker: false,
  blockerCount: 0,
  warningCount: 0,
  infoCount: 0,
  checkedAt: '2026-06-03T00:00:00.000Z',
};

const site: BuilderSiteDocument = {
  version: 1,
  siteId: 'default',
  locale: 'ko',
  name: 'Test',
  navigation: [],
  pages: [
    {
      pageId: 'page-1',
      slug: 'page-1',
      title: { ko: 'Page 1', en: 'Page 1', 'zh-hant': 'Page 1' },
      locale: 'ko',
      createdAt: '2026-06-03T00:00:00.000Z',
      updatedAt: '2026-06-20T00:00:00.000Z',
    },
    {
      pageId: 'page-2',
      slug: 'page-2',
      title: { ko: 'Page 2', en: 'Page 2', 'zh-hant': 'Page 2' },
      locale: 'ko',
      linkedPageIds: { en: 'missing-en-page' },
      createdAt: '2026-06-03T00:00:00.000Z',
      updatedAt: '2026-06-20T00:00:00.000Z',
    },
  ],
  theme: DEFAULT_THEME,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-20T00:00:00.000Z',
};

function postRequest(): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/publish-checks', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ pageId: 'page-1', locale: 'ko' }),
  });
}

describe('/api/builder/site/publish-checks role approval', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ username: 'admin' });
    vi.mocked(readPageCanvas).mockResolvedValue(canvas);
    vi.mocked(readSiteDocument).mockResolvedValue(site);
    vi.mocked(runAllChecks).mockResolvedValue(emptySuite);
  });

  it('adds a role approval blocker when translation release approval is required', async () => {
    const approvalBlocker = {
      id: 'translation-release-approval-required',
      severity: 'blocker' as const,
      category: 'translations' as const,
      message: 'The admin role requires translation release approval.',
    };
    const policy = await readTranslationReleasePolicy('default');
    vi.mocked(evaluateTranslationReleaseApprovalRequirement).mockResolvedValueOnce({
      state: 'required',
      role: 'admin',
      policy,
      summary: {
        sourceLocale: 'ko',
        syncedAt: '2026-06-20T00:00:00.000Z',
        totalCount: 4,
        currentPageCount: 2,
        otherPageCount: 2,
        warningCount: 3,
        errorCount: 1,
        reviewHref: '/ko/admin-builder/translations?sourceLocale=ko&category=pages',
        warningFingerprint: 'role-approval-fingerprint',
      },
      result: approvalBlocker,
    });
    vi.mocked(applyTranslationReleaseApprovalToSuite).mockReturnValueOnce({
      ...emptySuite,
      results: [approvalBlocker],
      hasBlocker: true,
      blockerCount: 1,
    });

    const response = await route.POST(postRequest());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.suite).toMatchObject({ hasBlocker: true, blockerCount: 1 });
    expect(data.suite.results).toEqual([approvalBlocker]);
    expect(data.translationReleaseApproval).toMatchObject({
      state: 'required',
      role: 'admin',
    });
  });
});
