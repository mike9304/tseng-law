import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  approveRequest,
  getApproval,
  rejectRequest,
} from '@/lib/builder/branches/approval-store';
import { createNotification } from '@/lib/builder/notifications/notification-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { allowReadOnly: true });
  if (auth instanceof NextResponse) return auth;
  const approval = await getApproval(params.id);
  if (!approval) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true, approval });
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;
  const raw = await request.json().catch(() => null) as {
    decision?: unknown;
    comment?: unknown;
  } | null;
  const decision = typeof raw?.decision === 'string' ? raw.decision : '';
  const comment = typeof raw?.comment === 'string' ? raw.comment : undefined;
  try {
    let updated;
    if (decision === 'approve') {
      updated = await approveRequest(params.id, auth.username, comment);
    } else if (decision === 'reject') {
      updated = await rejectRequest(params.id, auth.username, comment);
    } else {
      return NextResponse.json({ error: 'unknown_decision' }, { status: 400 });
    }
    if (!updated) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    await createNotification({
      kind: 'approval',
      subject:
        decision === 'approve'
          ? `Approval granted for branch ${updated.branchId}`
          : `Approval rejected for branch ${updated.branchId}`,
      body: comment
        ? `${auth.username}: ${comment}`
        : `${auth.username} ${decision}d the request.`,
      audience: { role: 'owner' },
    });
    return NextResponse.json({ ok: true, approval: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'patch_failed';
    const status = message === 'approval_already_resolved' ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}