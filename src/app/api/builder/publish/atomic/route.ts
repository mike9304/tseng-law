/**
 * F26 — POST /api/builder/publish/atomic
 *
 * Publishes a batch of pages + CMS collection drafts as a single transaction.
 * On any failure the orchestrator rolls back all earlier successes so the
 * published site never reflects a partial deploy.
 *
 * Body:
 *   { pageIds: string[], cmsCollectionIds: string[], locale?: 'ko'|'zh-hant'|'en' }
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { guardMutation } from '@/lib/builder/security/guard';
import { publishAtomic } from '@/lib/builder/publish-gate/atomic-publish-orchestrator';

export const runtime = 'nodejs';

const bodySchema = z.object({
  pageIds: z.array(z.string().trim().min(1).max(200)).max(200).default([]),
  cmsCollectionIds: z
    .array(z.string().trim().min(1).max(200))
    .max(200)
    .default([]),
  locale: z.enum(['ko', 'zh-hant', 'en']).optional(),
  siteId: z.string().trim().max(120).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const raw = (await request.json().catch(() => ({}))) as unknown;
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_body', issues: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }
  const { pageIds, cmsCollectionIds, locale, siteId } = parsed.data;

  if (pageIds.length === 0 && cmsCollectionIds.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'nothing_to_publish' },
      { status: 400 },
    );
  }

  try {
    const outcome = await publishAtomic({
      pageIds,
      cmsCollectionIds,
      siteId: siteId || DEFAULT_BUILDER_SITE_ID,
      locale,
    });
    return NextResponse.json(outcome, { status: outcome.ok ? 200 : 207 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'internal';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}