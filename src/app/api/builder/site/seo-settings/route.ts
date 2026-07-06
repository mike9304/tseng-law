import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import { getSiteUrl } from '@/lib/seo';
import {
  DEFAULT_BUILDER_SEO_DEFAULTS,
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

const additionalMetaTagSchema = z.object({
  id: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(120),
  content: z.string().trim().min(1).max(1000),
}).strict();

const structuredDataSchema = z.object({
  legalService: z.boolean().optional(),
  organization: z.boolean().optional(),
  localBusiness: z.boolean().optional(),
  faqPage: z.enum(['auto', 'off']).optional(),
  breadcrumbList: z.boolean().optional(),
}).strict();

const structuredDataBlockSchema = z.object({
  id: z.string().trim().min(1).max(120),
  type: z.enum(['LegalService', 'Organization', 'LocalBusiness', 'FAQPage', 'Article', 'BreadcrumbList', 'Custom']),
  label: optionalString(120),
  enabled: z.boolean(),
  json: optionalString(10000),
}).strict();

const seoDefaultsSchema = z.object({
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
  additionalMetaTags: z.array(additionalMetaTagSchema).max(10).optional(),
  structuredData: structuredDataSchema.optional(),
  structuredDataBlocks: z.array(structuredDataBlockSchema).max(5).optional(),
}).strict();

const seoSettingsSchema = seoDefaultsSchema.extend({
  robotsTxt: z.string().max(5000).optional(),
});

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

function cleanDefaults(input: BuilderSeoDefaults): BuilderSeoDefaults {
  return {
    patterns: input.patterns,
    twitterCard: input.twitterCard,
    noIndex: input.noIndex === true ? true : undefined,
    noFollow: input.noFollow === true ? true : undefined,
    additionalMetaTags: (input.additionalMetaTags ?? [])
      .map((tag) => ({ ...tag, name: tag.name.trim(), content: tag.content.trim() }))
      .filter((tag) => tag.name && tag.content)
      .slice(0, 10),
    structuredData: input.structuredData,
    structuredDataBlocks: (input.structuredDataBlocks ?? [])
      .map((block) => ({
        ...block,
        label: block.label?.trim() || undefined,
        json: block.json?.trim() || undefined,
      }))
      .slice(0, 5),
  };
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-seo' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);
  try {
    const site = await readSiteDocument(siteId, locale);
    return NextResponse.json({
      ok: true,
      defaults: getBuilderSeoDefaults(site, locale),
      factoryDefaults: DEFAULT_BUILDER_SEO_DEFAULTS,
      robotsTxt: site.settings?.robotsTxt ?? '',
      preview: buildSeoPreviewRows({ site, siteUrl: getSiteUrl(), locale }),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    return errorResponse(locale, 'seo_settings_load_failed', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-seo' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);
  try {
    const rawPayload = await request.json();
    const payload = seoSettingsSchema.parse(rawPayload);
    const { robotsTxt, ...defaultsPayload } = payload;
    const site = await readSiteDocument(siteId, locale);
    const nextDefaults = cleanDefaults({
      ...getBuilderSeoDefaults(site, locale),
      ...defaultsPayload,
      patterns: {
        ...(getBuilderSeoDefaults(site, locale).patterns ?? {}),
        ...(defaultsPayload.patterns ?? {}),
      },
      structuredData: {
        ...(getBuilderSeoDefaults(site, locale).structuredData ?? {}),
        ...(defaultsPayload.structuredData ?? {}),
      },
    });

    site.settings = {
      ...(site.settings ?? {}),
      seoDefaults: nextDefaults,
    };
    if (Object.prototype.hasOwnProperty.call(rawPayload, 'robotsTxt')) {
      const cleanedRobots = typeof robotsTxt === 'string' ? robotsTxt.trim() : '';
      if (cleanedRobots) site.settings.robotsTxt = cleanedRobots;
      else delete site.settings.robotsTxt;
    }
    site.updatedAt = new Date().toISOString();
    await writeSiteDocument(site);

    return NextResponse.json({
      ok: true,
      defaults: getBuilderSeoDefaults(site, locale),
      robotsTxt: site.settings?.robotsTxt ?? '',
      preview: buildSeoPreviewRows({ site, siteUrl: getSiteUrl(), locale }),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(locale, 'invalid_json', 400);
    }
    return errorResponse(locale, 'seo_settings_save_failed', 500);
  }
}
