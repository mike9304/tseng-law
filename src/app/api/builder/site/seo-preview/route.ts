import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import { getSiteUrl } from '@/lib/seo';
import {
  buildSeoPreviewRows,
  getBuilderSeoDefaults,
} from '@/lib/builder/seo/defaults';
import type { BuilderSeoDefaults } from '@/lib/builder/site/types';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import { resolveBuilderSiteIdFromRequest } from '@/lib/builder/site/admin-routing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const optionalString = (max: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().max(max).optional(),
  );

const previewSchema = z.object({
  defaults: z.object({
    patterns: z.object({
      titleTemplate: optionalString(300),
      descriptionTemplate: optionalString(500),
      ogTitleTemplate: optionalString(300),
      ogDescriptionTemplate: optionalString(500),
      twitterTitleTemplate: optionalString(300),
      twitterDescriptionTemplate: optionalString(500),
    }).strict().optional(),
    twitterCard: z.enum(['summary', 'summary_large_image']).optional(),
    noIndex: z.boolean().optional(),
    noFollow: z.boolean().optional(),
  }).strict().optional(),
}).strict();

function errorResponse(
  locale: ReturnType<typeof normalizeLocale>,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

function validationErrorResponse(locale: ReturnType<typeof normalizeLocale>, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-seo' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);
  try {
    const payload = previewSchema.parse(await request.json());
    const site = await readSiteDocument(siteId, locale);
    const current = getBuilderSeoDefaults(site, locale);
    const defaults: BuilderSeoDefaults = {
      ...current,
      ...(payload.defaults ?? {}),
      patterns: {
        ...(current.patterns ?? {}),
        ...(payload.defaults?.patterns ?? {}),
      },
    };

    return NextResponse.json({
      ok: true,
      preview: buildSeoPreviewRows({
        site: {
          ...site,
          settings: {
            ...(site.settings ?? {}),
            seoDefaults: defaults,
          },
        },
        siteUrl: getSiteUrl(),
        locale,
      }),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(locale, 'invalid_json', 400);
    }
    return errorResponse(locale, 'seo_preview_failed', 500);
  }
}
