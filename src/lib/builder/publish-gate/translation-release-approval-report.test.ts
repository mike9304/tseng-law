import { describe, expect, it } from 'vitest';
import {
  type TranslationReleaseApprovalRequest,
} from './translation-release-approval-model';
import {
  summarizeTranslationReleaseApprovalReviewerReport,
} from './translation-release-approval-report';

const summary = {
  sourceLocale: 'ko' as const,
  syncedAt: '2026-06-21T00:00:00.000Z',
  totalCount: 3,
  currentPageCount: 1,
  otherPageCount: 2,
  warningCount: 2,
  errorCount: 1,
  reviewHref: '/ko/admin-builder/translations?sourceLocale=ko&category=pages',
  warningFingerprint: 'stale-approval-fingerprint',
};

function approval(
  id: string,
  requestedAt: string,
  requestedRole: TranslationReleaseApprovalRequest['requestedRole'],
): TranslationReleaseApprovalRequest {
  return {
    id,
    siteId: 'tseng-law-main-site',
    pageId: 'page-1',
    locale: 'ko',
    warningFingerprint: summary.warningFingerprint,
    summary,
    requestedBy: 'admin',
    requestedRole,
    requestedAt,
    status: 'pending',
  };
}

describe('summarizeTranslationReleaseApprovalReviewerReport', () => {
  it('marks stale pending approvals for escalation by role', () => {
    const report = summarizeTranslationReleaseApprovalReviewerReport(
      [
        approval('trapv_stale_owner', '2026-06-20T00:00:00.000Z', 'owner'),
        approval('trapv_recent_admin', '2026-06-21T00:50:00.000Z', 'admin'),
      ],
      new Date('2026-06-21T01:30:00.000Z'),
    );

    expect(report.escalation).toMatchObject({
      thresholdMinutes: 1440,
      stalePendingCount: 1,
      staleByRole: [{ role: 'owner', count: 1 }],
      oldestStaleRequestedAt: '2026-06-20T00:00:00.000Z',
      oldestStaleAgeMinutes: 1530,
    });
  });

  it('assigns pending and stale approvals to eligible reviewers excluding the requester', () => {
    const report = summarizeTranslationReleaseApprovalReviewerReport(
      [
        approval('trapv_stale_owner', '2026-06-20T00:00:00.000Z', 'owner'),
      ],
      new Date('2026-06-21T01:30:00.000Z'),
      [
        { username: 'admin', role: 'owner' },
        { username: 'lead-owner', role: 'owner' },
        { username: 'ops-admin', role: 'admin' },
        { username: 'design-reviewer', role: 'designer' },
      ],
    );

    expect(report.reviewerAssignments).toEqual([
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
    expect(report.escalation.assignedReviewers).toEqual(report.reviewerAssignments);
  });
});
