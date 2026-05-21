import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  listApprovals,
  requestApproval,
} from '@/lib/builder/branches/approval-store';
import { summarizeApproval } from '@/lib/builder/branches/approval-model';
import { createNotification } from '@/lib/builder/notifications/notification-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true });
  if (auth instanceof NextResponse) return auth;
  const url = new URL(request.url);
  const branchId = url.searchParams.get('branchId') ?? undefined;
  const statusParam = url.searchParams.get('status');
  const status =
    statusParam === 'pending' || statusParam === 'approved' || statusParam === 'rejected'
      ? statusParam
      : undefined;
  const approvals = await listApprovals({ branchId, status });
  return NextResponse.json({
    ok: true,
    approvals: approvals.map(summarizeApproval),
    total: approvals.length,
  });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;
  const raw = await request.json().catch(() => null) as {
    branchId?: unknown;
    comment?: unknown;
  } | null;
  const branchId = typeof raw?.branchId === 'string' ? raw.branchId : '';
  if (!branchId) {
    return NextResponse.json({ error: 'branchId_required' }, { status: 400 });
  }
  const comment = typeof raw?.comment === 'string' ? raw.comment : undefined;
  try {
    const approval = await requestApproval({
      branchId,
      requestedBy: auth.username,
      comment,
    });
    await createNotification({
      kind: 'approval',
      subject: `Approval requested for branch ${branchId}`,
      body: comment
        ? `${auth.username}: ${comment}`
        : `${auth.username} requested approval.`,
      audience: { role: 'owner' },
    });
    return NextResponse.json({ ok: true, approval }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'request_failed' },
      { status: 400 },
    );
  }
}