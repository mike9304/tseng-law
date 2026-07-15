import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  recordPublishBlocked,
  recordPublishFailure,
  recordPublishSuccess,
  recordTranslationPublishPolicyReview,
} from '@/lib/builder/audit/record';
import { guardMutation } from '@/lib/builder/security/guard';
import { evaluateTranslationReleasePolicyForPublish } from '@/lib/builder/publish-gate/translation-release-policy';
import { PublishError, publishPage, type PublishResult } from '@/lib/builder/site/publish';
import type { CheckResult } from '@/lib/builder/publish-gate/gate-runner';
import type { TranslationSiteReviewInput } from '@/lib/builder/publish-gate/translation-policy-review';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'admin@example.test' } })),
}));

vi.mock('@/lib/builder/site/publish', () => {
  class PublishError extends Error {
    constructor(
      public code: string,
      public status: number,
      public body: Record<string, unknown> = {},
    ) {
      super(code);
      this.name = 'PublishError';
    }
  }

  return {
    PublishError,
    publishPage: vi.fn(),
  };
});

vi.mock('@/lib/builder/audit/record', () => ({
  recordPublishBlocked: vi.fn(async () => undefined),
  recordPublishFailure: vi.fn(async () => undefined),
  recordPublishSuccess: vi.fn(async () => undefined),
  recordTranslationPublishPolicyReview: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/publish-gate/translation-release-policy', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/publish-gate/translation-release-policy')>();
  return {
    ...actual,
    evaluateTranslationReleasePolicyForPublish: vi.fn(async () => ({
      status: 'allowed',
      policy: {
        siteId: 'tseng-law-main-site',
        mode: 'acknowledge-other-page-warnings',
        approvalRequiredForRoles: [],
        updatedAt: '2026-06-20T00:00:00.000Z',
      },
    })),
  };
});

function postRequest(locale = 'ko', body: unknown = {}, headers: Record<string, string> = {}) {
  return new NextRequest(
    `https://law.example.test/api/builder/site/pages/page-1/publish?locale=${locale}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    },
  );
}

const allowedReleaseDecision: Awaited<ReturnType<typeof evaluateTranslationReleasePolicyForPublish>> = {
  status: 'allowed',
  policy: {
    siteId: 'tseng-law-main-site',
    mode: 'acknowledge-other-page-warnings',
    approvalRequiredForRoles: [],
    updatedAt: '2026-06-20T00:00:00.000Z',
  },
};

const translationSiteReview: TranslationSiteReviewInput = {
  sourceLocale: 'ko',
  syncedAt: '2026-06-20T00:18:00.000Z',
  totalCount: 6,
  currentPageCount: 2,
  otherPageCount: 4,
  warningCount: 5,
  errorCount: 1,
  reviewHref: '/ko/admin-builder/translations?sourceLocale=ko&category=pages',
  warningFingerprint: 'publish-review-fingerprint',
};

function publishSuccessOutcome(input: {
  readonly revision: number;
  readonly revisionId: string;
  readonly savedAt: string;
  readonly cacheAt: string;
  readonly paths: string[];
  readonly slug: string;
}): PublishResult {
  return {
    ok: true,
    revisionId: input.revisionId,
    revision: input.revision,
    publishedRevisionId: input.revisionId,
    publishedRevision: input.revision,
    publishedSavedAt: input.savedAt,
    cacheInvalidatedAt: input.cacheAt,
    revalidatedPaths: input.paths,
    slug: input.slug,
    warnings: [],
    checks: { passed: true, warnings: [], errors: [] },
  };
}

describe('/api/builder/site/pages/[pageId]/publish', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ username: 'admin' });
    vi.mocked(evaluateTranslationReleasePolicyForPublish).mockResolvedValue(allowedReleaseDecision);
  });

  it('rejects a malformed publish site id before policy or publish access', async () => {
    const route = await import('./route');
    const response = await route.POST(
      postRequest('ko', { siteId: '../../x' }),
      { params: { pageId: 'page-1' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({ ok: false, success: false, errorCode: 'invalid_site_id' });
    expect(evaluateTranslationReleasePolicyForPublish).not.toHaveBeenCalled();
    expect(publishPage).not.toHaveBeenCalled();
    expect(recordPublishBlocked).not.toHaveBeenCalled();
    expect(recordPublishFailure).not.toHaveBeenCalled();
    expect(recordPublishSuccess).not.toHaveBeenCalled();
  });

  it('returns localized publish-blocked messages while preserving blocker details', async () => {
    const blocker: CheckResult = {
      id: 'seo-title',
      severity: 'blocker',
      category: 'seo',
      message: 'Missing SEO title',
    };
    vi.mocked(publishPage).mockRejectedValue(
      new PublishError('publish_blocked', 422, { blockers: [blocker] }),
    );

    const route = await import('./route');
    const response = await route.POST(postRequest('zh-hant', { expectedDraftRevision: 4 }), {
      params: { pageId: 'page-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload.error).toBe('publish_blocked');
    expect(payload.errorCode).toBe('publish_blocked');
    expect(payload.errorMessage).toBe('發布前檢查發現封鎖項目。');
    expect(payload.blockers).toEqual([blocker]);
    expect(recordPublishBlocked).toHaveBeenCalledWith(
      expect.objectContaining({
        siteId: 'tseng-law-main-site',
        pageId: 'page-1',
        blockerCount: 1,
      }),
    );
    expect(recordPublishFailure).not.toHaveBeenCalled();
  });

  it('returns a stable safe draft-stale conflict and audits only the losing publish', async () => {
    vi.mocked(publishPage).mockRejectedValue(
      new PublishError('draft_stale', 409, { current: { revision: 13 } }),
    );

    const route = await import('./route');
    const response = await route.POST(postRequest('en', {
      expectedDraftRevision: 12,
      translationSiteReview,
    }), { params: { pageId: 'page-1' } });
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      ok: false,
      error: 'draft_stale',
      errorCode: 'draft_stale',
      errorMessage: 'The draft is not current.',
      current: { revision: 13 },
    });
    expect(recordPublishFailure).toHaveBeenCalledWith(expect.objectContaining({
      siteId: 'tseng-law-main-site',
      pageId: 'page-1',
      reason: 'draft_stale',
    }));
    expect(recordPublishBlocked).not.toHaveBeenCalled();
    expect(recordPublishSuccess).not.toHaveBeenCalled();
    expect(recordTranslationPublishPolicyReview).not.toHaveBeenCalled();
  });

  it('does not expose raw internal publish failures', async () => {
    vi.mocked(publishPage).mockRejectedValue(
      new Error('draft_conflict rawError=file-v1:opaque-secret ETag="opaque-etag"'),
    );

    const route = await import('./route');
    const response = await route.POST(postRequest('ko'), { params: { pageId: 'page-1' } });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '페이지를 게시하지 못했습니다.',
      errorCode: 'page_publish_failed',
    });
    const serializedPayload = JSON.stringify(payload);
    expect(serializedPayload).not.toContain('draft_conflict');
    expect(serializedPayload).not.toContain('rawError');
    expect(serializedPayload).not.toContain('file-v1:opaque-secret');
    expect(serializedPayload).not.toContain('opaque-etag');
    expect(recordPublishFailure).toHaveBeenCalledWith(
      expect.objectContaining({
        siteId: 'tseng-law-main-site',
        pageId: 'page-1',
        reason: 'internal',
      }),
    );
    expect(recordPublishBlocked).not.toHaveBeenCalled();
    expect(recordPublishSuccess).not.toHaveBeenCalled();
    expect(recordTranslationPublishPolicyReview).not.toHaveBeenCalled();
  });

  it('keeps the success response shape', async () => {
    vi.mocked(publishPage).mockResolvedValue(publishSuccessOutcome({
      revisionId: 'rev-9',
      revision: 9,
      savedAt: '2026-05-20T00:20:00.000Z',
      cacheAt: '2026-05-20T00:21:00.000Z',
      paths: ['/ko/columns'],
      slug: 'columns',
    }));

    const route = await import('./route');
    const response = await route.POST(postRequest('en', { expectedDraftRevision: 9 }), {
      params: { pageId: 'page-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      slug: 'columns',
      publishedRevisionId: 'rev-9',
      publishedRevision: 9,
      publishedSavedAt: '2026-05-20T00:20:00.000Z',
      cacheInvalidatedAt: '2026-05-20T00:21:00.000Z',
      revalidatedPaths: ['/ko/columns'],
      warnings: [],
    });
    expect(recordPublishSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        siteId: 'tseng-law-main-site',
        pageId: 'page-1',
        revision: 9,
        revisionId: 'rev-9',
      }),
    );
  });

  it('records translation site review acknowledgement after a successful publish', async () => {
    vi.mocked(publishPage).mockResolvedValue(publishSuccessOutcome({
      revisionId: 'rev-10',
      revision: 10,
      savedAt: '2026-06-20T00:20:00.000Z',
      cacheAt: '2026-06-20T00:21:00.000Z',
      paths: ['/ko/about'],
      slug: 'about',
    }));

    const route = await import('./route');
    const response = await route.POST(postRequest('ko', {
      expectedDraftRevision: 10,
      translationSiteReview,
    }), {
      params: { pageId: 'page-1' },
    });

    expect(response.status).toBe(200);
    expect(recordTranslationPublishPolicyReview).toHaveBeenCalledWith({
      request: expect.any(Request),
      siteId: 'tseng-law-main-site',
      pageId: 'page-1',
      action: 'publish',
      review: translationSiteReview,
    });
  });

  it('publishes the workspace site selected by the editor referer', async () => {
    vi.mocked(publishPage).mockResolvedValue(publishSuccessOutcome({
      revisionId: 'rev-11',
      revision: 11,
      savedAt: '2026-06-21T00:20:00.000Z',
      cacheAt: '2026-06-21T00:21:00.000Z',
      paths: ['/ko/workspace-page'],
      slug: 'workspace-page',
    }));

    const route = await import('./route');
    const response = await route.POST(postRequest(
      'ko',
      { expectedDraftRevision: 11, siteId: 'default' },
      { referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-site-b' },
    ), {
      params: { pageId: 'page-1' },
    });

    expect(response.status).toBe(200);
    expect(evaluateTranslationReleasePolicyForPublish).toHaveBeenCalledWith(expect.objectContaining({
      siteId: 'workspace-site-b',
      pageId: 'page-1',
    }));
    expect(publishPage).toHaveBeenCalledWith('workspace-site-b', 'page-1', {
      expectedDraftRevision: 11,
    });
    expect(recordPublishSuccess).toHaveBeenCalledWith(expect.objectContaining({
      siteId: 'workspace-site-b',
      pageId: 'page-1',
      revision: 11,
      revisionId: 'rev-11',
    }));
  });
});
