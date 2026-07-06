import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BuilderCmsValidationError } from '@/lib/builder/cms-validation-error';
import { isBuilderCollectionId } from '@/lib/builder/cms';
import { resolveBuilderCmsRouteActor } from '@/lib/builder/cms-route-actor';
import { BUILDER_CMS_SLUG_CONFLICT_RULE_VALUES } from '@/lib/builder/cms-slug-conflict-rule';
import {
  deleteBuilderCmsDynamicItemRoutePolicy,
  saveBuilderCmsDynamicItemRoutePolicyOptions,
} from '@/lib/builder/cms-dynamic-item-route-policy';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { guardMutation } from '@/lib/builder/security/guard';

const routePolicyPayloadSchema = z.object({
  policyName: z.string().optional(),
  sourceFieldKey: z.string().optional(),
  slugPattern: z.string().optional(),
  slugConflictRule: z.enum(BUILDER_CMS_SLUG_CONFLICT_RULE_VALUES).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { siteId: string; collectionId: string; pageId: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const routeGuard = guardRoutePolicyParams(params);
  if (routeGuard) return routeGuard;

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const payload = routePolicyPayloadSchema.parse(await request.json());
    const routeActor = resolveBuilderCmsRouteActor(auth, request);
    const policy = await saveBuilderCmsDynamicItemRoutePolicyOptions({
      siteId: params.siteId,
      localeInput: locale,
      collectionId: params.collectionId,
      pageId: params.pageId,
      options: payload,
      actorLabel: routeActor.actorLabel,
    });
    if (!policy) {
      return NextResponse.json(
        { ok: false, error: 'Unknown linked dynamic item route policy.' },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, actor: routeActor.actor, policy });
  } catch (error) {
    if (error instanceof BuilderCmsValidationError) {
      return NextResponse.json(
        { ok: false, error: error.message, issues: error.issues },
        { status: 400 },
      );
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid dynamic item route policy payload.',
          issues: error.issues.map((issue) => issue.message),
        },
        { status: 400 },
      );
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { ok: false, error: 'Invalid dynamic item route policy JSON.' },
        { status: 400 },
      );
    }
    console.error('[builder-dynamic-item-route-policy] save failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to save dynamic item route policy.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { siteId: string; collectionId: string; pageId: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const routeGuard = guardRoutePolicyParams(params);
  if (routeGuard) return routeGuard;

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const routeActor = resolveBuilderCmsRouteActor(auth, request);
    const policy = await deleteBuilderCmsDynamicItemRoutePolicy({
      siteId: params.siteId,
      localeInput: locale,
      collectionId: params.collectionId,
      pageId: params.pageId,
    });
    if (!policy) {
      return NextResponse.json(
        { ok: false, error: 'Unknown linked dynamic item route policy.' },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, actor: routeActor.actor, policy });
  } catch (error) {
    console.error('[builder-dynamic-item-route-policy] delete failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete dynamic item route policy.' },
      { status: 500 },
    );
  }
}

function guardRoutePolicyParams(
  params: { readonly siteId: string; readonly collectionId: string },
): NextResponse | null {
  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }
  if (isBuilderCollectionId(params.collectionId)) {
    return NextResponse.json(
      { ok: false, error: 'Static source collection route policies cannot be edited here.' },
      { status: 409 },
    );
  }
  return null;
}
