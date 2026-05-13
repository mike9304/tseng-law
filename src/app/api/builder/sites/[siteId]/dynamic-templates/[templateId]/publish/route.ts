import { NextRequest, NextResponse } from 'next/server';
import { decodeBuilderDynamicTemplateParam } from '@/lib/builder/dynamic-templates';
import {
  BuilderDynamicTemplateDraftMissingError,
  publishBuilderDynamicTemplateDraft,
  readBuilderDynamicTemplateDraft,
  readBuilderDynamicTemplatePublished,
} from '@/lib/builder/dynamic-template-drafts';
import { guardMutation } from '@/lib/builder/security/guard';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: { siteId: string; templateId: string } }
) {
  const auth = await guardMutation(request, { bucket: 'publish' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  const templateId = decodeBuilderDynamicTemplateParam(params.templateId);
  if (!templateId) {
    return NextResponse.json({ ok: false, error: 'Unknown builder dynamic template.' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const updatedBy =
    body &&
    typeof body === 'object' &&
    !Array.isArray(body) &&
    typeof (body as Record<string, unknown>).updatedBy === 'string'
      ? ((body as Record<string, unknown>).updatedBy as string)
      : auth.username;

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
    const published = await publishBuilderDynamicTemplateDraft({
      templateId,
      locale,
      updatedBy,
    });
    const [draft, nextPublished] = await Promise.all([
      readBuilderDynamicTemplateDraft(templateId, locale),
      readBuilderDynamicTemplatePublished(templateId, locale),
    ]);

    return NextResponse.json({
      ok: true,
      siteId: params.siteId,
      locale,
      action: 'publish',
      draft,
      published: nextPublished,
      snapshot: published.snapshot,
    });
  } catch (error) {
    if (error instanceof BuilderDynamicTemplateDraftMissingError) {
      return NextResponse.json(
        { ok: false, error: 'No dynamic template draft exists for this locale.' },
        { status: 404 }
      );
    }

    console.error('[builder-dynamic-template-publish] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to publish builder dynamic template draft.' },
      { status: 500 }
    );
  }
}
