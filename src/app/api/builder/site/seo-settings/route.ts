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
  type: z.enum(['LegalService', 'Organization', 'LocalBusiness', 'FAQPage', 'BreadcrumbList', 'Custom']),
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

function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
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
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    return NextResponse.json({
      ok: true,
      defaults: getBuilderSeoDefaults(site),
      factoryDefaults: DEFAULT_BUILDER_SEO_DEFAULTS,
      preview: buildSeoPreviewRows({ site, siteUrl: getSiteUrl(), locale }),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const payload = seoDefaultsSchema.parse(await request.json());
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    const nextDefaults = cleanDefaults({
      ...getBuilderSeoDefaults(site),
      ...payload,
      patterns: {
        ...(getBuilderSeoDefaults(site).patterns ?? {}),
        ...(payload.patterns ?? {}),
      },
      structuredData: {
        ...(getBuilderSeoDefaults(site).structuredData ?? {}),
        ...(payload.structuredData ?? {}),
      },
    });

    site.settings = {
      ...(site.settings ?? {}),
      seoDefaults: nextDefaults,
    };
    site.updatedAt = new Date().toISOString();
    await writeSiteDocument(site);

    return NextResponse.json({
      ok: true,
      defaults: getBuilderSeoDefaults(site),
      preview: buildSeoPreviewRows({ site, siteUrl: getSiteUrl(), locale }),
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
