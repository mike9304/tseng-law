import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recordTranslationPublishPolicyReview } from '@/lib/builder/audit/record';
import { evaluateTranslationReleasePolicyForPublish } from '@/lib/builder/publish-gate/translation-release-policy';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  cancelScheduledPublishes,
  getActiveScheduledPublish,
  schedulePagePublish,
} from '@/lib/builder/site/scheduled-publish';
import * as route from '@/app/api/builder/site/pages/[pageId]/scheduled-publish/route';
import type { TranslationSiteReviewInput } from '@/lib/builder/publish-gate/translation-policy-review';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/site/scheduled-publish', () => ({
  cancelScheduledPublishes: vi.fn(),
  getActiveScheduledPublish: vi.fn(),
  schedulePagePublish: vi.fn(),
}));

vi.mock('@/lib/builder/audit/record', () => ({
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

const mockedCancelScheduledPublishes = vi.mocked(cancelScheduledPublishes);
const mockedGetActiveScheduledPublish = vi.mocked(getActiveScheduledPublish);
const mockedSchedulePagePublish = vi.mocked(schedulePagePublish);
const mockedRecordTranslationPublishPolicyReview = vi.mocked(recordTranslationPublishPolicyReview);
const mockedEvaluateTranslationReleasePolicyForPublish = vi.mocked(evaluateTranslationReleasePolicyForPublish);

function request(method: string, body?: unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/pages/page-1/scheduled-publish${query}`, {
    method,
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
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
  warningFingerprint: 'schedule-review-fingerprint',
};

describe('/api/builder/site/pages/[pageId]/scheduled-publish', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ username: 'admin' });
    mockedGetActiveScheduledPublish.mockResolvedValue(null);
    mockedSchedulePagePublish.mockResolvedValue({
      jobId: 'job-1',
      siteId: 'default',
      pageId: 'page-1',
      locale: 'ko',
      scheduledAt: '2099-01-01T00:00:00.000Z',
      status: 'scheduled',
      attempts: 0,
      createdAt: '2026-06-03T00:00:00.000Z',
      updatedAt: '2026-06-03T00:00:00.000Z',
    });
    mockedCancelScheduledPublishes.mockResolvedValue([]);
    mockedEvaluateTranslationReleasePolicyForPublish.mockResolvedValue(allowedReleaseDecision);
  });

  it('returns localized stable-code JSON when loading a scheduled publish fails', async () => {
    mockedGetActiveScheduledPublish.mockRejectedValueOnce(new Error('raw scheduled load failure'));
    const response = await route.GET(request('GET', undefined, '?locale=zh-hant'), { params: { pageId: 'page-1' } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '無法載入排程發布資訊。',
      errorCode: 'scheduled_publish_load_failed',
    });
    expect(data.error).not.toContain('raw scheduled load failure');
  });

  it('returns localized stable-code JSON for invalid scheduled publish timestamps', async () => {
    const response = await route.POST(request('POST', { scheduledAt: 'tomorrow', locale: 'en' }), {
      params: { pageId: 'page-1' },
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: 'Check the scheduled publish time.',
      errorCode: 'scheduled_publish_invalid_timestamp',
    });
    expect(mockedSchedulePagePublish).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for past scheduled publish timestamps', async () => {
    const response = await route.POST(request('POST', {
      scheduledAt: '2000-01-01T00:00:00.000Z',
      locale: 'ko',
    }), { params: { pageId: 'page-1' } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '예약 게시 시간은 현재 이후여야 합니다.',
      errorCode: 'scheduled_publish_past',
    });
    expect(mockedSchedulePagePublish).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when saving a scheduled publish fails', async () => {
    mockedSchedulePagePublish.mockRejectedValueOnce(new Error('raw scheduled save failure'));
    const response = await route.POST(request('POST', {
      scheduledAt: '2099-01-01T00:00:00.000Z',
      locale: 'zh-hant',
    }), { params: { pageId: 'page-1' } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '無法儲存排程發布。',
      errorCode: 'scheduled_publish_save_failed',
    });
    expect(data.error).not.toContain('raw scheduled save failure');
  });

  it('returns localized stable-code JSON when cancelling scheduled publishes fails', async () => {
    mockedCancelScheduledPublishes.mockRejectedValueOnce(new Error('raw scheduled cancel failure'));
    const response = await route.DELETE(request('DELETE', undefined, '?locale=en'), { params: { pageId: 'page-1' } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'Unable to cancel the scheduled publish.',
      errorCode: 'scheduled_publish_cancel_failed',
    });
    expect(data.error).not.toContain('raw scheduled cancel failure');
  });

  it('records translation site review acknowledgement after a schedule is saved', async () => {
    const response = await route.POST(request('POST', {
      scheduledAt: '2099-01-01T00:00:00.000Z',
      locale: 'ko',
      expectedDraftRevision: 12,
      translationSiteReview,
    }), { params: { pageId: 'page-1' } });

    expect(response.status).toBe(200);
    expect(mockedRecordTranslationPublishPolicyReview).toHaveBeenCalledWith({
      request: expect.any(Request),
      siteId: 'tseng-law-main-site',
      pageId: 'page-1',
      action: 'schedule',
      review: translationSiteReview,
      scheduledAt: '2099-01-01T00:00:00.000Z',
      jobId: 'job-1',
    });
  });

  it('refuses schedule when organization translation release policy blocks other-page warnings', async () => {
    mockedEvaluateTranslationReleasePolicyForPublish.mockResolvedValueOnce({
      status: 'blocked',
      result: {
        id: 'translation-release-policy-other-pages',
        severity: 'blocker',
        category: 'translations',
        message: 'Organization policy blocks schedule while other pages have translation warnings.',
      },
      policy: {
        siteId: 'tseng-law-main-site',
        mode: 'block-other-page-warnings',
        approvalRequiredForRoles: [],
        updatedAt: '2026-06-20T00:00:00.000Z',
      },
      summary: { ...translationSiteReview, warningFingerprint: 'schedule-review-fingerprint' },
    });

    const response = await route.POST(request('POST', {
      scheduledAt: '2099-01-01T00:00:00.000Z',
      locale: 'ko',
      translationSiteReview,
    }), { params: { pageId: 'page-1' } });
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toMatchObject({
      ok: false,
      error: 'translation_release_policy_blocked',
      errorCode: 'translation_release_policy_blocked',
    });
    expect(mockedSchedulePagePublish).not.toHaveBeenCalled();
    expect(mockedRecordTranslationPublishPolicyReview).not.toHaveBeenCalled();
  });

  it('refuses schedule when role-scoped translation release approval is required', async () => {
    mockedEvaluateTranslationReleasePolicyForPublish.mockResolvedValueOnce({
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
      summary: { ...translationSiteReview, warningFingerprint: 'schedule-review-fingerprint' },
    });

    const response = await route.POST(request('POST', {
      scheduledAt: '2099-01-01T00:00:00.000Z',
      locale: 'ko',
      translationSiteReview,
    }), { params: { pageId: 'page-1' } });
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toMatchObject({
      ok: false,
      error: 'translation_release_approval_required',
      errorCode: 'translation_release_approval_required',
    });
    expect(mockedEvaluateTranslationReleasePolicyForPublish).toHaveBeenCalledWith(
      expect.objectContaining({ actorUsername: 'admin' }),
    );
    expect(mockedSchedulePagePublish).not.toHaveBeenCalled();
  });
});
