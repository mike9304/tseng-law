import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { siteSpecSchema } from '@/lib/builder/ai-generator/site-spec';
import { generateSiteDraft } from '@/lib/builder/ai-generator/orchestrator';
import {
  readDraftCache,
  writeDraftCache,
} from '@/lib/builder/ai-generator/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = siteSpecSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid site spec', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const cached = readDraftCache(parsed.data);
  if (cached) {
    return NextResponse.json({ ok: true, cached: true, draft: cached });
  }
  const draft = await generateSiteDraft(parsed.data);
  writeDraftCache(parsed.data, draft);
  return NextResponse.json({ ok: true, cached: false, draft });
}
