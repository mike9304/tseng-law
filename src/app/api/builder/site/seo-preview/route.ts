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

function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const payload = previewSchema.parse(await request.json());
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    const current = getBuilderSeoDefaults(site);
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
    if (error instanceof ZodError) return validationErrorResponse(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
