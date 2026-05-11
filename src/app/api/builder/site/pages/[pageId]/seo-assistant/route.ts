import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { readPageCanvas, readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import { getSiteUrl } from '@/lib/seo';
import { buildSeoAssistantTasks } from '@/lib/builder/seo/assistant';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const assistantPatchSchema = z.object({
  focusKeyword: z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().max(80).optional(),
  ),
}).strict();

function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

function notFound(pageId: string): NextResponse {
  return NextResponse.json(
    { ok: false, error: `Page not found: ${pageId}` },
    { status: 404 },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    const page = site.pages.find((entry) => entry.pageId === params.pageId);
    if (!page) return notFound(params.pageId);
    const canvas = await readPageCanvas('default', page.pageId, 'draft');

    return NextResponse.json({
      ok: true,
      focusKeyword: page.seo?.focusKeyword ?? '',
      tasks: buildSeoAssistantTasks({
        page,
        site,
        canvas,
        siteUrl: getSiteUrl(),
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  try {
    const payload = assistantPatchSchema.parse(await request.json());
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    const page = site.pages.find((entry) => entry.pageId === params.pageId);
    if (!page) return notFound(params.pageId);

    page.seo = { ...(page.seo ?? {}) };
    if (payload.focusKeyword) page.seo.focusKeyword = payload.focusKeyword;
    else delete page.seo.focusKeyword;
    if (Object.keys(page.seo).length === 0) page.seo = undefined;
    page.updatedAt = new Date().toISOString();
    site.updatedAt = page.updatedAt;
    await writeSiteDocument(site);

    const canvas = await readPageCanvas('default', page.pageId, 'draft');
    return NextResponse.json({
      ok: true,
      focusKeyword: page.seo?.focusKeyword ?? '',
      tasks: buildSeoAssistantTasks({
        page,
        site,
        canvas,
        siteUrl: getSiteUrl(),
      }),
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
