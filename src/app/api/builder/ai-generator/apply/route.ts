import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { siteSpecSchema } from '@/lib/builder/ai-generator/site-spec';
import { generateSiteDraft } from '@/lib/builder/ai-generator/orchestrator';
import { draftToCanvasNodes } from '@/lib/builder/ai-generator/canvas-import';
import {
  createPage,
  writePageCanvas,
} from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
  spec: siteSpecSchema,
  slug: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(200).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const draft = await generateSiteDraft(parsed.data.spec);
  const nodes = draftToCanvasNodes({
    draft,
    locale: parsed.data.spec.locale,
    pageId: 'pending',
  });

  const locale = normalizeLocale(parsed.data.spec.locale);
  const meta = await createPage(
    'default',
    locale,
    parsed.data.slug,
    parsed.data.title ?? parsed.data.spec.companyName,
  );

  await writePageCanvas('default', meta.pageId, 'draft', {
    schemaVersion: 1,
    version: 1,
    locale,
    title: meta.title[locale] || meta.title.ko,
    nodes,
  } as unknown as Parameters<typeof writePageCanvas>[3]);

  return NextResponse.json({
    ok: true,
    pageId: meta.pageId,
    slug: meta.slug,
    nodeCount: nodes.length,
    locale,
  });
}
