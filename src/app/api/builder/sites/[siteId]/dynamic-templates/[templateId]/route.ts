import { NextResponse } from 'next/server';
import {
  decodeBuilderDynamicTemplateParam,
  readBuilderDynamicTemplateDetail,
} from '@/lib/builder/dynamic-templates';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: { siteId: string; templateId: string } }
) {
  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  const templateId = decodeBuilderDynamicTemplateParam(params.templateId);
  if (!templateId) {
    return NextResponse.json({ ok: false, error: 'Unknown builder dynamic template.' }, { status: 404 });
  }

  try {
    const url = new URL(request.url);
    const locale = normalizeLocale(url.searchParams.get('locale') ?? undefined);
    const detail = readBuilderDynamicTemplateDetail(templateId, locale);
    return NextResponse.json({ ok: true, siteId: params.siteId, locale, detail });
  } catch (error) {
    console.error('[builder-dynamic-template-detail] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to read builder dynamic template detail.' },
      { status: 500 }
    );
  }
}
