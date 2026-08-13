import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteBranchFile,
  discardBranch,
  getBranch,
  updateBranchPage,
} from '@/lib/builder/branches/branch-store';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { allowReadOnly: true });
  if (auth instanceof NextResponse) return auth;
  const branch = await getBranch(params.id);
  if (!branch) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true, branch });
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;
  const raw = await request.json().catch(() => null) as {
    action?: unknown;
    pageId?: unknown;
    snapshot?: unknown;
    basedOn?: unknown;
    reason?: unknown;
  } | null;
  const action = typeof raw?.action === 'string' ? raw.action : 'update-page';
  if (action === 'update-page') {
    const pageId = typeof raw?.pageId === 'string' ? raw.pageId : '';
    const basedOn = typeof raw?.basedOn === 'string' ? raw.basedOn : '';
    if (!pageId) return NextResponse.json({ error: 'pageId_required' }, { status: 400 });
    if (!raw?.snapshot || typeof raw.snapshot !== 'object') {
      return NextResponse.json({ error: 'snapshot_required' }, { status: 400 });
    }
    try {
      const updated = await updateBranchPage(
        params.id,
        pageId,
        raw.snapshot as BuilderCanvasDocument,
        basedOn,
      );
      if (!updated) return NextResponse.json({ error: 'not_found' }, { status: 404 });
      return NextResponse.json({ ok: true, branch: updated });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'update_failed' },
        { status: 400 },
      );
    }
  }
  if (action === 'discard') {
    const reason = typeof raw?.reason === 'string' ? raw.reason : undefined;
    const updated = await discardBranch(params.id, reason);
    if (!updated) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true, branch: updated });
  }
  return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;
  const ok = await deleteBranchFile(params.id);
  if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}