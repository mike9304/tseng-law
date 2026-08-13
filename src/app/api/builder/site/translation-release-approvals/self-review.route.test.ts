import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createNotification } from '@/lib/builder/notifications/notification-store';
import {
  approveTranslationReleaseApproval,
} from '@/lib/builder/publish-gate/translation-release-approval-store';
import * as approvalIdRoute from '@/app/api/builder/site/translation-release-approvals/[id]/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/security/resolve-permission', () => ({
  userHasPermission: vi.fn(async () => true),
}));

vi.mock('@/lib/builder/publish-gate/translation-release-approval-store', () => ({
  approveTranslationReleaseApproval: vi.fn(),
  getTranslationReleaseApproval: vi.fn(async () => null),
  rejectTranslationReleaseApproval: vi.fn(),
}));

vi.mock('@/lib/builder/notifications/notification-store', () => ({
  createNotification: vi.fn(async () => undefined),
}));

function request(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/translation-release-approvals/trapv_1', {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/site/translation-release-approvals/[id] self-review guard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(approveTranslationReleaseApproval)
      .mockRejectedValue(new Error('approval_self_review_forbidden'));
  });

  it('returns conflict without notification when the requester reviews their own approval', async () => {
    const response = await approvalIdRoute.PATCH(
      request({ decision: 'approve', comment: 'Self approval.' }),
      { params: Promise.resolve({ id: 'trapv_1' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({ ok: false, error: 'approval_self_review_forbidden' });
    expect(createNotification).not.toHaveBeenCalled();
  });
});
