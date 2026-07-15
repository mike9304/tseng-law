import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import {
  resolveBuilderSiteSettings,
  setLocalizedBuilderSiteSeoChecklistOverride,
} from '@/lib/builder/site/localized-settings';
import { DEFAULT_TRANSLATION_SOURCE_LOCALE } from '@/lib/builder/translations/sync';
import type { BuilderSeoChecklistSettings } from '@/lib/builder/site/types';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import {
  resolveBuilderSiteIdForMutationFromRequest,
  resolveBuilderSiteIdFromRequest,
} from '@/lib/builder/site/admin-routing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const checklistSchema = z.object({
  businessName: z.string().trim().max(200).optional(),
  keywords: z.array(z.string().trim().min(1).max(80)).max(5).optional(),
  serviceMode: z.enum(['physical', 'online', 'both']).optional(),
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
  const auth = await guardMutation(request, { permission: 'edit-seo' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);
  try {
    const site = await readSiteDocument(siteId, locale);
    const resolvedSettings = resolveBuilderSiteSettings(site.settings, locale);
    return NextResponse.json({
      ok: true,
      checklist: resolvedSettings?.seoChecklist ?? site.settings?.seoChecklist ?? {},
    });
  } catch {
    return errorResponse(locale, 'seo_checklist_load_failed', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-seo' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;
  try {
    const payload = checklistSchema.parse(await request.json());
    const site = await readSiteDocument(siteId, locale);
    const now = new Date().toISOString();
    const sanitized = sanitizeChecklist(payload);
    if (locale === DEFAULT_TRANSLATION_SOURCE_LOCALE) {
      site.settings = {
        ...(site.settings ?? {}),
        seoChecklist: sanitized,
      };
    } else {
      const nextSettings = site.settings ?? {};
      const applied = setLocalizedBuilderSiteSeoChecklistOverride(nextSettings, locale, sanitized);
      site.settings = applied ? nextSettings : site.settings;
    }
    site.updatedAt = now;
    await writeSiteDocument(site);

    return NextResponse.json({
      ok: true,
      checklist: resolveBuilderSiteSettings(site.settings, locale)?.seoChecklist ?? site.settings?.seoChecklist ?? {},
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(locale, 'invalid_json', 400);
    }
    return errorResponse(locale, 'seo_checklist_save_failed', 500);
  }
}
