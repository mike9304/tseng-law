import { NextRequest, NextResponse } from 'next/server';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { readBuilderStarterTemplateSummaries } from '@/lib/builder/starter-templates';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  try {
    const url = new URL(request.url);
    const locale = normalizeLocale(url.searchParams.get('locale') ?? undefined);
    const templates = readBuilderStarterTemplateSummaries(locale);
    return NextResponse.json({ ok: true, siteId: params.siteId, locale, templates });
  } catch (error) {
    console.error('[builder-starter-template-list] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to read builder starter templates.' },
      { status: 500 }
    );
  }
}
