import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import type { BuilderSeoChecklistSettings } from '@/lib/builder/site/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const checklistSchema = z.object({
  businessName: z.string().trim().max(200).optional(),
  keywords: z.array(z.string().trim().min(1).max(80)).max(5).optional(),
  serviceMode: z.enum(['physical', 'online', 'both']).optional(),
}).strict();

function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

function sanitizeChecklist(input: BuilderSeoChecklistSettings): BuilderSeoChecklistSettings {
  const next: BuilderSeoChecklistSettings = {};
  if (input.businessName?.trim()) next.businessName = input.businessName.trim();
  const keywords = (input.keywords ?? [])
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .slice(0, 5);
  if (keywords.length > 0) next.keywords = [...new Set(keywords)];
  if (input.serviceMode) next.serviceMode = input.serviceMode;
  return next;
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    return NextResponse.json({
      ok: true,
      checklist: site.settings?.seoChecklist ?? {},
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const payload = checklistSchema.parse(await request.json());
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    const now = new Date().toISOString();

    site.settings = {
      ...(site.settings ?? {}),
      seoChecklist: sanitizeChecklist(payload),
    };
    site.updatedAt = now;
    await writeSiteDocument(site);

    return NextResponse.json({
      ok: true,
      checklist: site.settings.seoChecklist ?? {},
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
