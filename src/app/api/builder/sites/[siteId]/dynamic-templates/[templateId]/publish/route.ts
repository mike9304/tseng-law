import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { decodeBuilderDynamicTemplateParam } from '@/lib/builder/dynamic-templates';
import {
  BuilderDynamicTemplateDraftMissingError,
} from '@/lib/builder/dynamic-template-drafts';
import { publishDynamicTemplateBlockDraft } from '@/lib/builder/dynamic-template-block-publish';
import { guardMutation } from '@/lib/builder/security/guard';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';

const publishBodySchema = z.object({
  updatedBy: z.string().trim().min(1).max(120).optional(),
});

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

  const rawBody: unknown = await request.json().catch(() => ({}));
  const parsedBody = publishBodySchema.safeParse(rawBody);
  if (!parsedBody.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_body', issues: parsedBody.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
    const outcome = await publishDynamicTemplateBlockDraft({
      siteId: params.siteId,
      templateId,
      locale,
      updatedBy: parsedBody.data.updatedBy ?? auth.username,
    });

    if (outcome.status === 'cms-publish-failed') {
      return NextResponse.json(
        {
          ok: false,
          error: 'cms_publish_failed',
          siteId: params.siteId,
          locale,
          action: 'publish',
          status: outcome.status,
          templateCollectionId: outcome.templateCollectionId,
          referencedCollectionIds: outcome.referencedCollectionIds,
          cmsPublish: outcome.cmsPublish,
          draft: outcome.draft,
          published: outcome.published,
          snapshot: outcome.snapshot,
        },
        { status: 207 },
      );
    }

    return NextResponse.json({
      ok: true,
      siteId: params.siteId,
      locale,
      action: 'publish',
      status: outcome.status,
      templateCollectionId: outcome.templateCollectionId,
      referencedCollectionIds: outcome.referencedCollectionIds,
      cmsPublish: outcome.cmsPublish,
      draft: outcome.draft,
      published: outcome.published,
      snapshot: outcome.snapshot,
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
