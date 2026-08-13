import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { buildOpsDashboardExportFile } from '@/lib/builder/ops/dashboard-export';
import { collectOpsDashboardView } from '@/lib/builder/ops/dashboard';
import { type UnifiedLogType } from '@/lib/builder/ops/logs-aggregator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseUnifiedLogType(value: string): UnifiedLogType | undefined {
  switch (value) {
    case 'audit':
    case 'dev':
    case 'security':
    case 'error':
      return value;
    default:
      return undefined;
  }
}

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'settings');
  if (auth instanceof NextResponse) return auth;

  const rawType = request.nextUrl.searchParams.get('type') ?? '';
  const rawLimit = request.nextUrl.searchParams.get('limit') ?? undefined;
  const type = parseUnifiedLogType(rawType);
  const limit = rawLimit ? Number.parseInt(rawLimit, 10) : undefined;
  const resolvedLimit = Number.isFinite(limit) && limit !== undefined ? limit : 10;

  const view = await collectOpsDashboardView({
    type,
    limit: Number.isFinite(limit) ? limit : undefined,
  });
  const exportFile = buildOpsDashboardExportFile({
    snapshot: view.snapshot,
    type: type ?? '',
    limit: resolvedLimit,
  });

  return NextResponse.json({ ok: true, ...view, exportFile });
}
