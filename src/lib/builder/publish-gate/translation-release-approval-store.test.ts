import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  approveTranslationReleaseApproval,
  getTranslationReleaseApproval,
  requestTranslationReleaseApproval,
} from './translation-release-approval-store';

const summary = {
  sourceLocale: 'ko' as const,
  syncedAt: '2026-06-21T00:00:00.000Z',
  totalCount: 3,
  currentPageCount: 1,
  otherPageCount: 2,
  warningCount: 2,
  errorCount: 1,
  reviewHref: '/ko/admin-builder/translations?sourceLocale=ko&category=pages',
  warningFingerprint: 'self-review-fingerprint',
};

let approvalRoot: string | null = null;
let previousApprovalRoot: string | undefined;

describe('translation release approval store', () => {
  beforeEach(async () => {
    previousApprovalRoot = process.env.BUILDER_TRANSLATION_RELEASE_APPROVAL_ROOT;
    approvalRoot = await mkdtemp(path.join(tmpdir(), 'translation-release-approvals-'));
    process.env.BUILDER_TRANSLATION_RELEASE_APPROVAL_ROOT = approvalRoot;
  });

  afterEach(async () => {
    if (approvalRoot) await rm(approvalRoot, { recursive: true, force: true });
    approvalRoot = null;
    if (previousApprovalRoot === undefined) {
      delete process.env.BUILDER_TRANSLATION_RELEASE_APPROVAL_ROOT;
    } else {
      process.env.BUILDER_TRANSLATION_RELEASE_APPROVAL_ROOT = previousApprovalRoot;
    }
  });

  it('rejects self-review decisions while keeping the approval pending', async () => {
    const approval = await requestTranslationReleaseApproval({
      siteId: 'tseng-law-main-site',
      pageId: 'page-1',
      locale: 'ko',
      summary,
      requestedBy: 'admin',
      requestedRole: 'owner',
    });

    await expect(
      approveTranslationReleaseApproval(approval.id, 'admin', 'Self approval.'),
    ).rejects.toThrow('approval_self_review_forbidden');
    await expect(getTranslationReleaseApproval(approval.id)).resolves.toMatchObject({
      id: approval.id,
      status: 'pending',
      requestedBy: 'admin',
    });
  });
});
