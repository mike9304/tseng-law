import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createBranch,
  listBranches,
} from '@/lib/builder/branches/branch-store';
import { summarizeBranch } from '@/lib/builder/branches/branch-model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true });
  if (auth instanceof NextResponse) return auth;
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const branches = await listBranches(
    status === 'draft' || status === 'merged' || status === 'discarded'
      ? { status }
      : undefined,
  );
  return NextResponse.json({
    ok: true,
    branches: branches.map(summarizeBranch),
    total: branches.length,
  });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;
  const raw = await request.json().catch(() => null) as {
    name?: unknown;
    baseRevisionId?: unknown;
  } | null;
  const name = typeof raw?.name === 'string' ? raw.name.trim() : '';
  const baseRevisionId = typeof raw?.baseRevisionId === 'string' ? raw.baseRevisionId : '';
  if (!name) {
    return NextResponse.json({ error: 'name_required' }, { status: 400 });
  }
  if (!baseRevisionId) {
    return NextResponse.json({ error: 'baseRevisionId_required' }, { status: 400 });
  }
  try {
    const branch = await createBranch({
      name,
      baseRevisionId,
      createdBy: auth.username,
    });
    return NextResponse.json({ ok: true, branch }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'create_failed' },
      { status: 400 },
    );
  }
}