import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { applyRecordSlugRedirect } from '@/lib/builder/dynamic-record-redirect-lifecycle';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getBuilderServicesApiErrorPayload,
  type BuilderServicesApiErrorCode,
} from '@/lib/builder/services/services-api-copy';
import {
  BuilderServiceAreaSourceError,
  readServiceAreaSourceRecordBySlug,
  resetServiceAreaSourceRecordOverride,
  updateServiceAreaSourceRecord,
} from '@/lib/builder/services/source';
import { normalizeLocale, type Locale } from '@/lib/locales';

const localizedTextSchema = z.object({
  ko: z.string().trim().min(1).max(4000).optional(),
  'zh-hant': z.string().trim().min(1).max(4000).optional(),
  en: z.string().trim().min(1).max(4000).optional(),
}).partial();

const localizedStringListSchema = z.object({
  ko: z.array(z.string().trim().min(1).max(1200)).max(30).optional(),
  'zh-hant': z.array(z.string().trim().min(1).max(1200)).max(30).optional(),
  en: z.array(z.string().trim().min(1).max(1200)).max(30).optional(),
}).partial();

const serviceAreaPatchSchema = z.object({
  slug: z.string().trim().min(1).max(160).optional(),
  title: localizedTextSchema.optional(),
  subtitle: localizedTextSchema.optional(),
  intro: localizedTextSchema.optional(),
  keyPoints: localizedStringListSchema.optional(),
  columnSlugs: z.array(z.string().trim().min(1).max(160)).max(40).optional(),
}).strict();

function errorResponse(
  locale: Locale,
  errorCode: BuilderServicesApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderServicesApiErrorPayload(locale, errorCode) },
    { status },
  );
}

function resolveLocale(request: NextRequest): Locale {
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = resolveLocale(request);
  try {
    const record = await readServiceAreaSourceRecordBySlug(DEFAULT_BUILDER_SITE_ID, locale, params.slug);
    if (!record) {
      return errorResponse(locale, 'service_area_not_found', 404);
    }
    return NextResponse.json({ ok: true, source: 'service-area-source-overrides', record });
  } catch (error) {
    console.error('[builder-services] load failed', error);
    return errorResponse(locale, 'service_area_load_failed', 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = resolveLocale(request);
  try {
    const before = await readServiceAreaSourceRecordBySlug(DEFAULT_BUILDER_SITE_ID, locale, params.slug);
    if (!before) {
      return errorResponse(locale, 'service_area_not_found', 404);
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return errorResponse(locale, 'invalid_json', 400);
    }
    const patch = serviceAreaPatchSchema.parse(raw);
    const record = await updateServiceAreaSourceRecord(
      DEFAULT_BUILDER_SITE_ID,
      locale,
      params.slug,
      patch,
      auth.username,
    );
    if (!record) {
      return errorResponse(locale, 'service_area_not_found', 404);
    }

    const slugRedirect = before.slug !== record.slug
      ? await applyRecordSlugRedirect(DEFAULT_BUILDER_SITE_ID, {
          collectionId: 'service-areas',
          locale,
          oldSlug: before.slug,
          newSlug: record.slug,
        })
      : null;

    return NextResponse.json({
      ok: true,
      source: 'service-area-source-overrides',
      record,
      slugRedirect,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(locale, 'validation_error', 400);
    }
    if (error instanceof BuilderServiceAreaSourceError) {
      return errorResponse(locale, 'service_area_conflict', 409);
    }
    console.error('[builder-services] update failed', error);
    return errorResponse(locale, 'service_area_update_failed', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = resolveLocale(request);
  try {
    const before = await readServiceAreaSourceRecordBySlug(DEFAULT_BUILDER_SITE_ID, locale, params.slug);
    const record = await resetServiceAreaSourceRecordOverride(DEFAULT_BUILDER_SITE_ID, locale, params.slug);
    if (!record) {
      return errorResponse(locale, 'service_area_not_found', 404);
    }
    const slugRedirect = before && before.slug !== record.slug
      ? await applyRecordSlugRedirect(DEFAULT_BUILDER_SITE_ID, {
          collectionId: 'service-areas',
          locale,
          oldSlug: before.slug,
          newSlug: record.slug,
        })
      : null;
    return NextResponse.json({
      ok: true,
      source: 'service-area-source-overrides',
      record,
      slugRedirect,
    });
  } catch (error) {
    console.error('[builder-services] reset failed', error);
    return errorResponse(locale, 'service_area_reset_failed', 500);
  }
}
