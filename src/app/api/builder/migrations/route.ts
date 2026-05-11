import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { runMigrations } from '@/lib/builder/migrations/runner';
import { MIGRATIONS } from '@/lib/builder/migrations/registry';
import { loadMigrationJournal } from '@/lib/builder/migrations/journal';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const journal = await loadMigrationJournal();
  const appliedIds = new Set(journal.applied.map((r) => r.id));
  const pending = MIGRATIONS.filter((m) => !appliedIds.has(m.id)).map((m) => ({ id: m.id, description: m.description }));
  return NextResponse.json({
    ok: true,
    journal,
    pending,
    total: MIGRATIONS.length,
  });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const result = await runMigrations(MIGRATIONS);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
