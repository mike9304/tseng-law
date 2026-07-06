import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  recordPublishBlocked,
  recordPublishFailure,
  recordPublishSuccess,
  recordTranslationPublishPolicyReview,
} from '@/lib/builder/audit/record';
import { evaluateTranslationReleasePolicyForPublish } from '@/lib/builder/publish-gate/translation-release-policy';
import { guardMutation } from '@/lib/builder/security/guard';
import { publishPage } from '@/lib/builder/site/publish';
import * as route from '@/app/api/builder/site/pages/[pageId]/publish/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/site/publish', () => ({
  PublishError: class PublishError extends Error {},
  publishPage: vi.fn(),
}));

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
    evaluateTranslationReleasePolicyForPublish: vi.fn(),
  };
});

const translationSiteReview = {
  sourceLocale: 'ko' as const,
  syncedAt: '2026-06-20T00:18:00.000Z',
  totalCount: 6,
  currentPageCount: 2,
  otherPageCount: 4,
  warningCount: 5,
  errorCount: 1,
  reviewHref: '/ko/admin-builder/translations?sourceLocale=ko&category=pages',
  warningFingerprint: 'publish-review-fingerprint',
};

function postRequest(body: unknown = {}): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/pages/page-1/publish?locale=ko', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/site/pages/[pageId]/publish translation release gate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ username: 'admin' });
  });

  it('refuses publish when organization translation release policy blocks warnings', async () => {
    vi.mocked(evaluateTranslationReleasePolicyForPublish).mockResolvedValueOnce({
      status: 'blocked',
      result: {
        id: 'translation-release-policy-other-pages',
        severity: 'blocker',
        category: 'translations',
        message: 'Organization policy blocks publish while other pages have translation warnings.',
      },
      policy: {
        siteId: 'tseng-law-main-site',
        mode: 'block-other-page-warnings',
        approvalRequiredForRoles: [],
        updatedAt: '2026-06-20T00:00:00.000Z',
      },
      summary: translationSiteReview,
    });

    const response = await route.POST(postRequest({ translationSiteReview }), {
      params: { pageId: 'page-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toMatchObject({
      ok: false,
      error: 'translation_release_policy_blocked',
      errorCode: 'translation_release_policy_blocked',
    });
    expect(evaluateTranslationReleasePolicyForPublish).toHaveBeenCalledWith(
      expect.objectContaining({ actorUsername: 'admin' }),
    );
    expect(publishPage).not.toHaveBeenCalled();
    expect(recordTranslationPublishPolicyReview).not.toHaveBeenCalled();
  });

  it('returns a stable approval-required 409 before publishing', async () => {
    vi.mocked(evaluateTranslationReleasePolicyForPublish).mockResolvedValueOnce({
      status: 'blocked',
      result: {
        id: 'translation-release-approval-required',
        severity: 'blocker',
        category: 'translations',
        message: 'The admin role requires translation release approval.',
      },
      policy: {
        siteId: 'tseng-law-main-site',
        mode: 'acknowledge-other-page-warnings',
        approvalRequiredForRoles: ['admin'],
        updatedAt: '2026-06-20T00:00:00.000Z',
      },
      summary: translationSiteReview,
    });

    const response = await route.POST(postRequest({ translationSiteReview }), {
      params: { pageId: 'page-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toMatchObject({
      ok: false,
      error: 'translation_release_approval_required',
      errorCode: 'translation_release_approval_required',
    });
    expect(publishPage).not.toHaveBeenCalled();
    expect(recordPublishBlocked).not.toHaveBeenCalled();
    expect(recordPublishFailure).not.toHaveBeenCalled();
    expect(recordPublishSuccess).not.toHaveBeenCalled();
  });
});
