import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { mergeBranch } from '@/lib/builder/branches/branch-store';
import { getLatestApprovalForBranch } from '@/lib/builder/branches/approval-store';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { createNotification } from '@/lib/builder/notifications/notification-store';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;
  const raw = await request.json().catch(() => null) as {
    siteId?: unknown;
    locale?: unknown;
  } | null;
  const siteId = typeof raw?.siteId === 'string' && raw.siteId ? raw.siteId : 'default';
  const locale = normalizeLocale(typeof raw?.locale === 'string' ? raw.locale : 'ko');

  // Site-level flag drives approval enforcement. The flag itself lives on the
  // site doc under `workflow.requireApproval` (added by the F101/F102 admin
  // panel). We read it here so route call sites don't need to.
  let requireApproval = false;
  try {
    const site = await readSiteDocument(siteId, locale) as {
      workflow?: { requireApproval?: boolean };
    };
    requireApproval = Boolean(site.workflow?.requireApproval);
  } catch {
    requireApproval = false;
  }

  let approved = false;
  if (requireApproval) {
    const approval = await getLatestApprovalForBranch(params.id);
    approved = approval?.status === 'approved';
  }

  try {
    const result = await mergeBranch(params.id, {
      siteId,
      mergedBy: auth.username,
      requireApproval,
      approved,
    });
    if (!result) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    await createNotification({
      kind: 'publish',
      subject: `Branch merged: ${result.branch.name}`,
      body: `${auth.username} merged branch ${result.branch.id} into ${siteId}.`,
      audience: { role: 'owner' },
    });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'merge_failed';
    const status = message === 'approval_required' ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}