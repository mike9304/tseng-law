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
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { PublishCheckSuite } from '@/lib/builder/publish-gate/gate-runner';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/publish-checks/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
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
      approvalRequiredForRoles: [],
      updatedAt: '2026-06-20T00:00:00.000Z',
    })),
  };
});

vi.mock('@/lib/builder/publish-gate/translation-release-approval', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/publish-gate/translation-release-approval')>();
  return {
    ...actual,
    evaluateTranslationReleaseApprovalRequirement: vi.fn(async () => ({
      state: 'not-required',
      role: 'owner',
      policy: {
        siteId: 'default',
        mode: 'acknowledge-other-page-warnings',
        approvalRequiredForRoles: [],
        updatedAt: '2026-06-20T00:00:00.000Z',
      },
    })),
    applyTranslationReleaseApprovalToSuite: vi.fn((suite) => suite),
  };
});

const mockedReadPageCanvas = vi.mocked(readPageCanvas);
const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedRunAllChecks = vi.mocked(runAllChecks);
const mockedReadTranslationReleasePolicy = vi.mocked(readTranslationReleasePolicy);
const mockedEvaluateTranslationReleaseApprovalRequirement = vi.mocked(evaluateTranslationReleaseApprovalRequirement);
const mockedApplyTranslationReleaseApprovalToSuite = vi.mocked(applyTranslationReleaseApprovalToSuite);

const document: BuilderCanvasDocument = {
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

const siteDocument: BuilderSiteDocument = {
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

function postRequest(body: unknown, query = '', headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/publish-checks${query}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/site/publish-checks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      username: 'admin-1',
    });
    mockedReadPageCanvas.mockResolvedValue(document);
    mockedReadSiteDocument.mockResolvedValue(siteDocument);
    mockedRunAllChecks.mockResolvedValue(emptySuite);
    mockedEvaluateTranslationReleaseApprovalRequirement.mockResolvedValue({
      state: 'not-required',
      role: 'owner',
      policy: {
        siteId: 'default',
        mode: 'acknowledge-other-page-warnings',
        approvalRequiredForRoles: [],
        updatedAt: '2026-06-20T00:00:00.000Z',
      },
    });
    mockedApplyTranslationReleaseApprovalToSuite.mockImplementation((suite) => suite);
  });

  it('returns localized stable-code JSON when pageId is missing', async () => {
    const response = await route.POST(postRequest({ locale: 'zh-hant' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '需要頁面 ID。',
      errorCode: 'page_id_required',
    });
    expect(mockedReadPageCanvas).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when the draft canvas is missing', async () => {
    mockedReadPageCanvas.mockResolvedValueOnce(null);
    const response = await route.POST(postRequest({ pageId: 'page-1', locale: 'en' }));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toMatchObject({
      ok: false,
      error: 'Draft canvas not found.',
      errorCode: 'draft_canvas_not_found',
    });
    expect(mockedRunAllChecks).not.toHaveBeenCalled();
  });

  it('loads the selected workspace site when the editor referer carries siteId', async () => {
    const response = await route.POST(postRequest(
      { pageId: 'page-1', locale: 'ko', siteId: 'default' },
      '',
      { referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-site-b' },
    ));

    expect(response.status).toBe(200);
    expect(mockedReadPageCanvas).toHaveBeenCalledWith('workspace-site-b', 'page-1', 'draft');
    expect(mockedReadSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
    expect(mockedRunAllChecks).toHaveBeenCalledWith(
      document,
      expect.objectContaining({ pageId: 'page-1' }),
      siteDocument,
      'workspace-site-b',
    );
    expect(mockedReadTranslationReleasePolicy).toHaveBeenCalledWith('workspace-site-b');
    expect(mockedEvaluateTranslationReleaseApprovalRequirement).toHaveBeenCalledWith(expect.objectContaining({
      siteId: 'workspace-site-b',
      pageId: 'page-1',
    }));
  });

  it('returns localized stable-code JSON when publish checks fail', async () => {
    mockedRunAllChecks.mockRejectedValueOnce(new Error('raw publish gate failure'));
    const response = await route.POST(postRequest({ pageId: 'page-1', locale: 'ko' }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '게시 전 점검을 실행하지 못했습니다.',
      errorCode: 'publish_checks_failed',
    });
    expect(data.error).not.toContain('raw publish gate failure');
  });

  it('returns a site-wide translation warning summary with the page publish checks', async () => {
    const response = await route.POST(postRequest({ pageId: 'page-1', locale: 'ko' }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      ok: true,
      suite: emptySuite,
      translationSiteWarnings: {
        sourceLocale: 'ko',
        totalCount: 4,
        currentPageCount: 2,
        otherPageCount: 2,
        warningCount: 3,
        errorCount: 1,
        reviewHref: '/ko/admin-builder/translations?sourceLocale=ko&category=pages',
      },
    });
    expect(data.translationSiteWarnings.syncedAt).toEqual(expect.any(String));
  });

  it('adds a translation blocker when the organization policy blocks other-page warnings', async () => {
    mockedReadTranslationReleasePolicy.mockResolvedValueOnce({
      siteId: 'default',
      mode: 'block-other-page-warnings',
      approvalRequiredForRoles: [],
      updatedAt: '2026-06-20T00:00:00.000Z',
    });

    const response = await route.POST(postRequest({ pageId: 'page-1', locale: 'ko' }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.suite).toMatchObject({
      hasBlocker: true,
      blockerCount: 1,
    });
    expect(data.suite.results).toEqual([
      expect.objectContaining({
        id: 'translation-release-policy-other-pages',
        severity: 'blocker',
        category: 'translations',
      }),
    ]);
    expect(data.translationReleasePolicy).toMatchObject({
      mode: 'block-other-page-warnings',
    });
  });
});
