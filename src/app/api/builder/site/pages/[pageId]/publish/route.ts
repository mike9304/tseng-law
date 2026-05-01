import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { publishPageWithChecks } from '@/lib/builder/site/publish';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = guardMutation(request, { bucket: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');

  const result = await publishPageWithChecks('default', params.pageId, locale);

  if (!result.success) {
    return NextResponse.json(
      { ok: false, errors: result.checks.errors, warnings: result.checks.warnings },
      { status: 422 },
    );
  }

  return NextResponse.json({
    ok: true,
    slug: result.slug,
    warnings: result.checks.warnings,
  });
}
