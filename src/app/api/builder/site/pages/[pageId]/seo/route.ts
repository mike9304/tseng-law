import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import type { BuilderSeoMetadata } from '@/lib/builder/site/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const optionalSeoString = (max: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().max(max).optional(),
  );

const builderSeoMetadataSchema = z.object({
  title: optionalSeoString(300),
  description: optionalSeoString(500),
  ogImage: optionalSeoString(2000),
  canonical: optionalSeoString(2000),
  noIndex: z.boolean().optional(),
  noFollow: z.boolean().optional(),
}).strict();

function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: 'validation_error',
      issues: error.flatten(),
    },
    { status: 400 },
  );
}

function unknownErrorResponse(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : 'unknown_error';
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}

function pageNotFoundResponse(pageId: string): NextResponse {
  return NextResponse.json(
    { ok: false, error: `Page not found: ${pageId}` },
    { status: 404 },
  );
}

function hasOwnKey(input: unknown, key: keyof BuilderSeoMetadata): boolean {
  return typeof input === 'object' && input !== null && Object.prototype.hasOwnProperty.call(input, key);
}

function applySeoPatch(
  existingSeo: BuilderSeoMetadata | undefined,
  payload: BuilderSeoMetadata,
  rawBody: unknown,
): BuilderSeoMetadata | undefined {
  const nextSeo: BuilderSeoMetadata = { ...(existingSeo ?? {}) };

  if (hasOwnKey(rawBody, 'title')) {
    if (payload.title) nextSeo.title = payload.title;
    else delete nextSeo.title;
  }

  if (hasOwnKey(rawBody, 'description')) {
    if (payload.description) nextSeo.description = payload.description;
    else delete nextSeo.description;
  }

  if (hasOwnKey(rawBody, 'ogImage')) {
    if (payload.ogImage) nextSeo.ogImage = payload.ogImage;
    else delete nextSeo.ogImage;
  }

  if (hasOwnKey(rawBody, 'canonical')) {
    if (payload.canonical) nextSeo.canonical = payload.canonical;
    else delete nextSeo.canonical;
  }

  if (hasOwnKey(rawBody, 'noIndex')) {
    if (payload.noIndex) nextSeo.noIndex = true;
    else delete nextSeo.noIndex;
  }

  if (hasOwnKey(rawBody, 'noFollow')) {
    if (payload.noFollow) nextSeo.noFollow = true;
    else delete nextSeo.noFollow;
  }

  return Object.keys(nextSeo).length > 0 ? nextSeo : undefined;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    const page = site.pages.find((entry) => entry.pageId === params.pageId);

    if (!page) {
      return pageNotFoundResponse(params.pageId);
    }

    return NextResponse.json({
      ok: true,
      seo: page.seo ?? {},
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return unknownErrorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const rawBody = await request.json();
    const payload = builderSeoMetadataSchema.parse(rawBody);
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    const page = site.pages.find((entry) => entry.pageId === params.pageId);

    if (!page) {
      return pageNotFoundResponse(params.pageId);
    }

    const now = new Date().toISOString();
    page.seo = applySeoPatch(page.seo, payload, rawBody);
    page.updatedAt = now;
    site.updatedAt = now;

    await writeSiteDocument(site);

    return NextResponse.json({
      ok: true,
      seo: page.seo ?? {},
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    return unknownErrorResponse(error);
  }
}
