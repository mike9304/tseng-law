import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isBuilderCollectionId } from '@/lib/builder/cms';
import { BUILDER_CMS_SLUG_CONFLICT_RULE_VALUES } from '@/lib/builder/cms-slug-conflict-rule';
import { resolveBuilderCmsRouteActor } from '@/lib/builder/cms-route-actor';
import { scheduleCmsDynamicItemPolicy } from '@/lib/builder/cms-dynamic-item-scheduled-policy';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { guardMutation } from '@/lib/builder/security/guard';
import { normalizeLocale } from '@/lib/locales';

const schedulePayloadSchema = z.object({
  kind: z.literal('prepare-public-routes'),
  scheduledAt: z.string(),
  policyName: z.string().optional(),
  sourceFieldKey: z.string().optional(),
  slugPattern: z.string().optional(),
  slugConflictRule: z.enum(BUILDER_CMS_SLUG_CONFLICT_RULE_VALUES).optional(),
});

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ siteId: string; collectionId: string; pageId: string }> }
) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;
  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }
  if (isBuilderCollectionId(params.collectionId)) {
    return NextResponse.json(
      { ok: false, error: 'Static source collection route policies cannot be scheduled here.' },
      { status: 409 },
    );
  }

  try {
    const url = new URL(request.url);
    const locale = normalizeLocale(url.searchParams.get('locale') ?? undefined);
    const payload = schedulePayloadSchema.parse(await request.json());
    const routeActor = resolveBuilderCmsRouteActor(auth, request);
    const job = await scheduleCmsDynamicItemPolicy({
      siteId: params.siteId,
      locale,
      collectionId: params.collectionId,
      pageId: params.pageId,
      kind: payload.kind,
      scheduledAt: payload.scheduledAt,
      requestedBy: routeActor.actorLabel,
      policy: {
        policyName: payload.policyName ?? '',
        sourceFieldKey: payload.sourceFieldKey ?? '',
        slugPattern: payload.slugPattern ?? '',
        slugConflictRule: payload.slugConflictRule ?? 'next-available',
      },
    });
    return NextResponse.json({ ok: true, actor: routeActor.actor, job });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid dynamic item scheduled policy payload.',
          issues: error.issues.map((issue) => issue.message),
        },
        { status: 400 },
      );
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { ok: false, error: 'Invalid dynamic item scheduled policy JSON.' },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to schedule dynamic item route policy.' },
      { status: 500 },
    );
  }
}
