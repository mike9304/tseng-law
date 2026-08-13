import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createNotification } from '@/lib/builder/notifications/notification-store';
import {
  approveTranslationReleaseApproval,
  getTranslationReleaseApproval,
  getLatestTranslationReleaseApprovalForContext,
  listTranslationReleaseApprovals,
  requestTranslationReleaseApproval,
} from '@/lib/builder/publish-gate/translation-release-approval-store';
import { readTranslationReleasePolicy } from '@/lib/builder/publish-gate/translation-release-policy';
import {
  guardBuilderReadWithPermission,
  guardMutation,
} from '@/lib/builder/security/guard';
import { resolveUserRole, userHasPermission } from '@/lib/builder/security/resolve-permission';
import * as approvalRoute from '@/app/api/builder/site/translation-release-approvals/route';
import * as approvalIdRoute from '@/app/api/builder/site/translation-release-approvals/[id]/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/security/resolve-permission', () => ({
  resolveUserRole: vi.fn(async () => 'admin'),
  userHasPermission: vi.fn(async () => true),
}));

vi.mock('@/lib/builder/publish-gate/translation-release-policy', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/publish-gate/translation-release-policy')>();
  return {
    ...actual,
    readTranslationReleasePolicy: vi.fn(async () => ({
      siteId: 'tseng-law-main-site',
      mode: 'acknowledge-other-page-warnings',
      approvalRequiredForRoles: ['admin'],
      updatedAt: '2026-06-20T00:00:00.000Z',
    })),
  };
});

vi.mock('@/lib/builder/publish-gate/translation-release-approval-store', () => ({
  approveTranslationReleaseApproval: vi.fn(),
  getLatestTranslationReleaseApprovalForContext: vi.fn(async () => null),
  getTranslationReleaseApproval: vi.fn(async () => null),
  listTranslationReleaseApprovals: vi.fn(async () => []),
  rejectTranslationReleaseApproval: vi.fn(),
  requestTranslationReleaseApproval: vi.fn(),
}));

vi.mock('@/lib/builder/notifications/notification-store', () => ({
  createNotification: vi.fn(async () => undefined),
}));

const summary = {
  sourceLocale: 'ko' as const,
  syncedAt: '2026-06-20T00:00:00.000Z',
  totalCount: 4,
  currentPageCount: 1,
  otherPageCount: 3,
  warningCount: 3,
  errorCount: 1,
  reviewHref: '/ko/admin-builder/translations?sourceLocale=ko&category=pages',
  warningFingerprint: 'approval-fingerprint',
};

const approval = {
  id: 'trapv_1',
  siteId: 'tseng-law-main-site',
  pageId: 'page-1',
  locale: 'ko' as const,
  warningFingerprint: summary.warningFingerprint,
  summary,
  requestedBy: 'admin',
  requestedRole: 'admin' as const,
  requestedAt: '2026-06-20T00:01:00.000Z',
  status: 'pending' as const,
};

function request(method: string, body?: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/translation-release-approvals', {
    method,
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/translation-release-approvals${query}`);
}

describe('/api/builder/site/translation-release-approvals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({ username: 'admin' });
    vi.mocked(guardMutation).mockResolvedValue({ username: 'admin' });
    vi.mocked(resolveUserRole).mockResolvedValue('admin');
    vi.mocked(userHasPermission).mockResolvedValue(true);
    vi.mocked(getLatestTranslationReleaseApprovalForContext).mockResolvedValue(null);
    vi.mocked(requestTranslationReleaseApproval).mockResolvedValue(approval);
    vi.mocked(approveTranslationReleaseApproval).mockResolvedValue({
      ...approval,
      status: 'approved',
      reviewedBy: 'owner',
      reviewedAt: '2026-06-20T00:02:00.000Z',
    });
  });

  it('creates a pending role-scoped translation release approval request', async () => {
    const response = await approvalRoute.POST(request('POST', {
      pageId: 'page-1',
      locale: 'ko',
      summary,
    }));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.approval).toMatchObject({
      id: 'trapv_1',
      status: 'pending',
      requestedRole: 'admin',
      warningFingerprint: 'approval-fingerprint',
    });
    expect(readTranslationReleasePolicy).toHaveBeenCalledWith('tseng-law-main-site');
    expect(requestTranslationReleaseApproval).toHaveBeenCalledWith({
      siteId: 'tseng-law-main-site',
      pageId: 'page-1',
      locale: 'ko',
      warningFingerprint: 'approval-fingerprint',
      summary,
      requestedBy: 'admin',
      requestedRole: 'admin',
    });
    expect(createNotification).toHaveBeenCalled();
  });

  it('filters the reviewer queue by approval status', async () => {
    vi.mocked(listTranslationReleaseApprovals).mockResolvedValueOnce([
      approval,
      {
        ...approval,
        id: 'trapv_2',
        requestedRole: 'owner',
        requestedAt: '2026-06-20T00:03:00.000Z',
        status: 'approved',
        reviewedBy: 'owner',
        reviewedAt: '2026-06-20T00:04:00.000Z',
      },
    ]);

    const response = await approvalRoute.GET(getRequest('?status=pending'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      total: 1,
      approvals: [
        {
          id: 'trapv_1',
          status: 'pending',
        },
      ],
      report: {
        totalCount: 2,
        pendingCount: 1,
        approvedCount: 1,
        rejectedCount: 0,
        pendingByRole: [{ role: 'admin', count: 1 }],
        activityByUser: [
          {
            username: 'admin',
            requestedCount: 2,
            pendingRequestedCount: 1,
            approvedRequestedCount: 1,
            rejectedRequestedCount: 0,
            reviewedCount: 0,
            approvedDecisionCount: 0,
            rejectedDecisionCount: 0,
            lastActivityAt: '2026-06-20T00:03:00.000Z',
          },
          {
            username: 'owner',
            requestedCount: 0,
            pendingRequestedCount: 0,
            approvedRequestedCount: 0,
            rejectedRequestedCount: 0,
            reviewedCount: 1,
            approvedDecisionCount: 1,
            rejectedDecisionCount: 0,
            lastActivityAt: '2026-06-20T00:04:00.000Z',
          },
        ],
        oldestPendingRequestedAt: '2026-06-20T00:01:00.000Z',
      },
    });
    expect(listTranslationReleaseApprovals).toHaveBeenCalledWith(undefined);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(
      expect.any(Request),
      'manage-translations',
    );
  });

  it('returns 403 before listing approval data when translation permission is missing', async () => {
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValueOnce(
      NextResponse.json(
        { error: 'Missing permission: manage-translations' },
        { status: 403 },
      ),
    );

    const response = await approvalRoute.GET(getRequest('?status=pending'));

    expect(response.status).toBe(403);
    expect(listTranslationReleaseApprovals).not.toHaveBeenCalled();
  });

  it('returns 403 before reading approval detail when translation permission is missing', async () => {
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValueOnce(
      NextResponse.json(
        { error: 'Missing permission: manage-translations' },
        { status: 403 },
      ),
    );

    const response = await approvalIdRoute.GET(
      getRequest(),
      { params: Promise.resolve({ id: 'trapv_1' }) },
    );

    expect(response.status).toBe(403);
    expect(getTranslationReleaseApproval).not.toHaveBeenCalled();
  });

  it('returns the authenticated actor for self-review UI decisions', async () => {
    const response = await approvalRoute.GET(getRequest('?status=pending'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.currentActor).toEqual({ username: 'admin' });
  });

  it('rejects unknown approval status filters', async () => {
    const response = await approvalRoute.GET(getRequest('?status=waiting'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: 'unknown_approval_status',
    });
    expect(listTranslationReleaseApprovals).not.toHaveBeenCalled();
  });

  it('returns a 409 when the actor role does not require approval', async () => {
    vi.mocked(resolveUserRole).mockResolvedValueOnce('owner');
    const response = await approvalRoute.POST(request('POST', {
      pageId: 'page-1',
      locale: 'ko',
      summary,
    }));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toMatchObject({
      ok: false,
      error: 'translation_release_approval_not_required',
    });
    expect(requestTranslationReleaseApproval).not.toHaveBeenCalled();
  });

  it('approves a pending translation release approval request', async () => {
    vi.mocked(guardMutation).mockResolvedValueOnce({ username: 'owner' });
    const response = await approvalIdRoute.PATCH(
      request('PATCH', { decision: 'approve', comment: 'Looks acceptable.' }),
      { params: Promise.resolve({ id: 'trapv_1' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.approval).toMatchObject({
      id: 'trapv_1',
      status: 'approved',
      reviewedBy: 'owner',
    });
    expect(userHasPermission).toHaveBeenCalledWith('owner', 'settings');
    expect(approveTranslationReleaseApproval).toHaveBeenCalledWith(
      'trapv_1',
      'owner',
      'Looks acceptable.',
    );
  });

  it('refuses approval decisions from roles without settings permission', async () => {
    vi.mocked(userHasPermission).mockResolvedValueOnce(false);
    const response = await approvalIdRoute.PATCH(
      request('PATCH', { decision: 'approve' }),
      { params: Promise.resolve({ id: 'trapv_1' }) },
    );

    expect(response.status).toBe(403);
    expect(approveTranslationReleaseApproval).not.toHaveBeenCalled();
  });
});
