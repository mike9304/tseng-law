import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createNotification } from '@/lib/builder/notifications/notification-store';
import {
  approveTranslationReleaseApproval,
  getTranslationReleaseApproval,
  rejectTranslationReleaseApproval,
} from '@/lib/builder/publish-gate/translation-release-approval-store';
import { summarizeTranslationReleaseApproval } from '@/lib/builder/publish-gate/translation-release-approval-model';
import {
  guardBuilderReadWithPermission,
  guardMutation,
} from '@/lib/builder/security/guard';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const decisionSchema = z.object({
  decision: z.enum(['approve', 'reject']),
  comment: z.string().trim().max(500).optional(),
}).strict();

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardBuilderReadWithPermission(request, 'manage-translations');
  if (auth instanceof NextResponse) return auth;

  const approval = await getTranslationReleaseApproval(params.id);
  if (!approval) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true, approval: summarizeTranslationReleaseApproval(approval) });
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'settings',
  });
  if (auth instanceof NextResponse) return auth;
  if (!(await userHasPermission(auth.username, 'settings'))) {
    return NextResponse.json(
      { ok: false, error: 'translation_release_approval_forbidden' },
      { status: 403 },
    );
  }

  const parsed = decisionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'unknown_decision' },
      { status: 400 },
    );
  }

  try {
    const updated = parsed.data.decision === 'approve'
      ? await approveTranslationReleaseApproval(params.id, auth.username, parsed.data.comment)
      : await rejectTranslationReleaseApproval(params.id, auth.username, parsed.data.comment);
    if (!updated) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    await createNotification({
      kind: 'approval',
      subject: parsed.data.decision === 'approve'
        ? `Translation release approval granted for ${updated.pageId}`
        : `Translation release approval rejected for ${updated.pageId}`,
      body: parsed.data.comment
        ? `${auth.username}: ${parsed.data.comment}`
        : `${auth.username} ${parsed.data.decision}d the translation release request.`,
      link: updated.summary.reviewHref,
    });
    return NextResponse.json({
      ok: true,
      approval: summarizeTranslationReleaseApproval(updated),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'patch_failed';
    const status = message === 'approval_already_resolved'
      || message === 'approval_self_review_forbidden'
      ? 409
      : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
