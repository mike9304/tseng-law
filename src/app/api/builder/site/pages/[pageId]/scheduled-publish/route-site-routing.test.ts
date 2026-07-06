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
import type { TranslationSiteReviewInput } from '@/lib/builder/publish-gate/translation-policy-review';
import * as route from '@/app/api/builder/site/pages/[pageId]/scheduled-publish/route';

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
        siteId: SELECTED_SITE_ID,
        mode: 'acknowledge-other-page-warnings',
        approvalRequiredForRoles: [],
        updatedAt: '2026-06-21T00:00:00.000Z',
      },
    })),
  };
});

const SELECTED_SITE_ID = 'workspace-scheduled-publish';
const EDITOR_REFERRER = `https://law.example.test/ko/admin-builder?siteId=${SELECTED_SITE_ID}`;
const FUTURE_SCHEDULED_AT = '2099-01-01T00:00:00.000Z';

const mockedCancelScheduledPublishes = vi.mocked(cancelScheduledPublishes);
const mockedGetActiveScheduledPublish = vi.mocked(getActiveScheduledPublish);
const mockedSchedulePagePublish = vi.mocked(schedulePagePublish);
const mockedRecordTranslationPublishPolicyReview = vi.mocked(recordTranslationPublishPolicyReview);
const mockedEvaluateTranslationReleasePolicyForPublish = vi.mocked(evaluateTranslationReleasePolicyForPublish);

function request(method: string, body?: unknown, query = '?locale=ko'): NextRequest {
  return new NextRequest(
    `https://law.example.test/api/builder/site/pages/page-1/scheduled-publish${query}`,
    {
      method,
      headers: {
        referer: EDITOR_REFERRER,
        ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    },
  );
}

const translationSiteReview: TranslationSiteReviewInput = {
  sourceLocale: 'ko',
  syncedAt: '2026-06-21T00:18:00.000Z',
  totalCount: 6,
  currentPageCount: 2,
  otherPageCount: 4,
  warningCount: 5,
  errorCount: 1,
  reviewHref: '/ko/admin-builder/translations?sourceLocale=ko&category=pages',
  warningFingerprint: 'selected-schedule-review-fingerprint',
};

describe('/api/builder/site/pages/[pageId]/scheduled-publish selected site routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ username: 'admin' });
    mockedGetActiveScheduledPublish.mockResolvedValue(null);
    mockedSchedulePagePublish.mockResolvedValue({
      jobId: 'job-1',
      siteId: SELECTED_SITE_ID,
      pageId: 'page-1',
      locale: 'ko',
      scheduledAt: FUTURE_SCHEDULED_AT,
      status: 'scheduled',
      attempts: 0,
      createdAt: '2026-06-21T00:00:00.000Z',
      updatedAt: '2026-06-21T00:00:00.000Z',
    });
    mockedCancelScheduledPublishes.mockResolvedValue([]);
    mockedEvaluateTranslationReleasePolicyForPublish.mockResolvedValue({
      status: 'allowed',
      policy: {
        siteId: SELECTED_SITE_ID,
        mode: 'acknowledge-other-page-warnings',
        approvalRequiredForRoles: [],
        updatedAt: '2026-06-21T00:00:00.000Z',
      },
    });
  });

  it('loads the active scheduled publish from the selected editor site', async () => {
    await route.GET(request('GET'), { params: { pageId: 'page-1' } });

    expect(mockedGetActiveScheduledPublish).toHaveBeenCalledWith(SELECTED_SITE_ID, 'page-1');
  });

  it('schedules and audits publishes against the selected editor site', async () => {
    await route.POST(request('POST', {
      siteId: 'default',
      scheduledAt: FUTURE_SCHEDULED_AT,
      locale: 'ko',
      expectedDraftRevision: 3,
      translationSiteReview,
    }), { params: { pageId: 'page-1' } });

    expect(mockedEvaluateTranslationReleasePolicyForPublish).toHaveBeenCalledWith(
      expect.objectContaining({ siteId: SELECTED_SITE_ID, pageId: 'page-1' }),
    );
    expect(mockedSchedulePagePublish).toHaveBeenCalledWith(expect.objectContaining({
      siteId: SELECTED_SITE_ID,
      pageId: 'page-1',
      expectedDraftRevision: 3,
    }));
    expect(mockedRecordTranslationPublishPolicyReview).toHaveBeenCalledWith(expect.objectContaining({
      siteId: SELECTED_SITE_ID,
      pageId: 'page-1',
      action: 'schedule',
    }));
  });

  it('cancels scheduled publishes from the selected editor site', async () => {
    await route.DELETE(request('DELETE'), { params: { pageId: 'page-1' } });

    expect(mockedCancelScheduledPublishes).toHaveBeenCalledWith(
      SELECTED_SITE_ID,
      'page-1',
      'cancelled by admin',
    );
  });
});
