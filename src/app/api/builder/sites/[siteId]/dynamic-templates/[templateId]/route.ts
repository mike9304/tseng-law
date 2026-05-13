import { NextRequest, NextResponse } from 'next/server';
import {
  decodeBuilderDynamicTemplateParam,
  readBuilderDynamicTemplateDetail,
} from '@/lib/builder/dynamic-templates';
import {
  readBuilderDynamicTemplateDraft,
  readBuilderDynamicTemplatePublished,
  writeBuilderDynamicTemplateDraft,
} from '@/lib/builder/dynamic-template-drafts';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string; templateId: string } }
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

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
    const [detail, draft, published] = await Promise.all([
      Promise.resolve(readBuilderDynamicTemplateDetail(templateId, locale)),
      readBuilderDynamicTemplateDraft(templateId, locale),
      readBuilderDynamicTemplatePublished(templateId, locale),
    ]);
    return NextResponse.json({ ok: true, siteId: params.siteId, locale, detail, draft, published });
  } catch (error) {
    console.error('[builder-dynamic-template-detail] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to read builder dynamic template detail.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { siteId: string; templateId: string } }
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  const templateId = decodeBuilderDynamicTemplateParam(params.templateId);
  if (!templateId) {
    return NextResponse.json({ ok: false, error: 'Unknown builder dynamic template.' }, { status: 404 });
  }

  let body: { state?: unknown; updatedBy?: unknown };
  try {
    body = (await request.json()) as { state?: unknown; updatedBy?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const url = new URL(request.url);
    const locale = normalizeLocale(url.searchParams.get('locale') ?? undefined);
    const detail = readBuilderDynamicTemplateDetail(templateId, locale);
    const draft = await writeBuilderDynamicTemplateDraft({
      templateId,
      locale,
      state: body.state,
      updatedBy: typeof body.updatedBy === 'string' ? body.updatedBy : auth.username,
    });

    return NextResponse.json({ ok: true, siteId: params.siteId, locale, detail, draft });
  } catch (error) {
    console.error('[builder-dynamic-template-draft] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to save builder dynamic template draft.' },
      { status: 500 }
    );
  }
}
