import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { restoreBackup } from '@/lib/builder/backups/restore-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
  confirm: z.literal('RESTORE'),
  dryRun: z.boolean().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { backupId: string } },
) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Restore requires { confirm: "RESTORE" } in body to proceed' },
      { status: 400 },
    );
  }
  const result = await restoreBackup(params.backupId, { dryRun: parsed.data.dryRun });
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
