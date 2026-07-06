import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listTranslationReleaseApprovals } from '@/lib/builder/publish-gate/translation-release-approval-store';
import { listUserRoles } from '@/lib/builder/security/user-role-store';
import * as approvalRoute from '@/app/api/builder/site/translation-release-approvals/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/publish-gate/translation-release-policy', () => ({
  readTranslationReleasePolicy: vi.fn(),
}));

vi.mock('@/lib/builder/publish-gate/translation-release-approval-store', () => ({
  getLatestTranslationReleaseApprovalForContext: vi.fn(async () => null),
  listTranslationReleaseApprovals: vi.fn(async () => []),
  requestTranslationReleaseApproval: vi.fn(),
}));

vi.mock('@/lib/builder/notifications/notification-store', () => ({
  createNotification: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/security/resolve-permission', () => ({
  resolveUserRole: vi.fn(async () => 'owner'),
}));

vi.mock('@/lib/builder/security/user-role-store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/security/user-role-store')>();
  return {
    ...actual,
    listUserRoles: vi.fn(async () => []),
  };
});

const summary = {
  sourceLocale: 'ko' as const,
  syncedAt: '2026-06-21T00:00:00.000Z',
  totalCount: 4,
  currentPageCount: 1,
  otherPageCount: 3,
  warningCount: 3,
  errorCount: 1,
  reviewHref: '/ko/admin-builder/translations?sourceLocale=ko&category=pages',
  warningFingerprint: 'assignment-fingerprint',
};

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/translation-release-approvals${query}`);
}

describe('/api/builder/site/translation-release-approvals assignment report', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(listTranslationReleaseApprovals).mockResolvedValue([
      {
        id: 'trapv_stale_owner',
        siteId: 'tseng-law-main-site',
        pageId: 'page-1',
        locale: 'ko',
        warningFingerprint: summary.warningFingerprint,
        summary,
        requestedBy: 'admin',
        requestedRole: 'owner',
        requestedAt: '2020-01-01T00:00:00.000Z',
        status: 'pending',
      },
    ]);
    vi.mocked(listUserRoles).mockResolvedValue([
      { username: 'admin', role: 'owner', addedAt: '2026-06-20T00:00:00.000Z', addedBy: 'system' },
      { username: 'lead-owner', role: 'owner', addedAt: '2026-06-20T00:01:00.000Z', addedBy: 'admin' },
      { username: 'ops-admin', role: 'admin', addedAt: '2026-06-20T00:02:00.000Z', addedBy: 'admin' },
      { username: 'designer', role: 'designer', addedAt: '2026-06-20T00:03:00.000Z', addedBy: 'admin' },
    ]);
  });

  it('includes reviewer assignments from users with settings permission', async () => {
    const response = await approvalRoute.GET(getRequest('?status=pending'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.report.reviewerAssignments).toEqual([
      {
        username: 'lead-owner',
        role: 'owner',
        assignedCount: 1,
        requestedRoles: ['owner'],
      },
      {
        username: 'ops-admin',
        role: 'admin',
        assignedCount: 1,
        requestedRoles: ['owner'],
      },
    ]);
    expect(payload.report.escalation.assignedReviewers).toEqual(payload.report.reviewerAssignments);
  });
});
