import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead } from '@/lib/builder/security/guard';
import { ensureDefaultAccount } from '@/lib/builder/workspace/workspace-store';
import { listAccountCollections } from '@/lib/builder/workspace/shared-cms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const blocked = guardBuilderRead(request);
  if (blocked instanceof NextResponse) return blocked;
  try {
    await ensureDefaultAccount();
    const collections = await listAccountCollections();
    return NextResponse.json({
      ok: true,
      total: collections.length,
      collections,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}