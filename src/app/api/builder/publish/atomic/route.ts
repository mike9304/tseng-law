/**
 * F26 — POST /api/builder/publish/atomic
 *
 * Publishes a batch of pages + CMS collection drafts as a single transaction.
 * On any failure the orchestrator rolls back all earlier successes so the
 * published site never reflects a partial deploy.
 *
 * Body:
 *   { pageIds: string[], cmsCollectionIds: string[], locale?: 'ko'|'zh-hant'|'en', deriveDynamicCollections?: boolean }
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { guardMutation } from '@/lib/builder/security/guard';
import { publishAtomic } from '@/lib/builder/publish-gate/atomic-publish-orchestrator';
import { publishDynamicTemplate } from '@/lib/builder/dynamic-template-publish-coordinator';

export const runtime = 'nodejs';

const bodySchema = z.object({
  pageIds: z.array(z.string().trim().min(1).max(200)).max(200).default([]),
  cmsCollectionIds: z
    .array(z.string().trim().min(1).max(200))
    .max(200)
    .default([]),
  locale: z.enum(['ko', 'zh-hant', 'en']).optional(),
  siteId: z.string().trim().max(120).optional(),
  deriveDynamicCollections: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'publish', permission: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const raw: unknown = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_body', issues: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }
  const { pageIds, cmsCollectionIds, locale, siteId, deriveDynamicCollections } = parsed.data;
  const effectiveSiteId = siteId || DEFAULT_BUILDER_SITE_ID;

  if (pageIds.length === 0 && cmsCollectionIds.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'nothing_to_publish' },
      { status: 400 },
    );
  }

  try {
    if (deriveDynamicCollections) {
      const coordinated = await publishDynamicTemplate({
        pageIds,
        extraCollectionIds: cmsCollectionIds,
        siteId: effectiveSiteId,
        locale,
      });
      return NextResponse.json(
        {
          ...coordinated.outcome,
          resolvedPages: coordinated.resolvedPages,
          referencedCollectionIds: coordinated.referencedCollectionIds,
        },
        { status: coordinated.outcome.ok ? 200 : 207 },
      );
    }

    const outcome = await publishAtomic({
      pageIds,
      cmsCollectionIds,
      siteId: effectiveSiteId,
      locale,
    });
    return NextResponse.json(outcome, { status: outcome.ok ? 200 : 207 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'internal';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
