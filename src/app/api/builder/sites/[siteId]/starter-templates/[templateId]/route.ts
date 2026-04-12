import { NextResponse } from 'next/server';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import {
  decodeBuilderStarterTemplateParam,
  readBuilderStarterTemplateDetail,
} from '@/lib/builder/starter-templates';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: { siteId: string; templateId: string } }
) {
  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  const templateId = decodeBuilderStarterTemplateParam(params.templateId);
  if (!templateId) {
    return NextResponse.json({ ok: false, error: 'Unknown builder starter template.' }, { status: 404 });
  }

  try {
    const url = new URL(request.url);
    const locale = normalizeLocale(url.searchParams.get('locale') ?? undefined);
    const detail = readBuilderStarterTemplateDetail(templateId, locale);
    return NextResponse.json({ ok: true, siteId: params.siteId, locale, detail });
  } catch (error) {
    console.error('[builder-starter-template-detail] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to read builder starter template detail.' },
      { status: 500 }
    );
  }
}
