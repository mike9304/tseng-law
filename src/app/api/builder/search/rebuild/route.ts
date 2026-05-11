import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import { collectAllSearchDocs } from '@/lib/builder/search/source-collector';
import { saveSearchIndex } from '@/lib/builder/search/index-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-search' });
  if (auth instanceof NextResponse) return auth;

  const docs = await collectAllSearchDocs('default');
  const index = buildSearchIndex(docs);
  await saveSearchIndex(index);

  return NextResponse.json({
    ok: true,
    builtAt: index.builtAt,
    totalDocs: docs.length,
    byLocale: Object.fromEntries(
      Object.entries(index.byLocale).map(([loc, items]) => [loc, items.length]),
    ),
  });
}
