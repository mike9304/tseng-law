import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import {
  guardBuilderReadWithPermission,
  guardMutation,
} from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { DEFAULT_TRANSLATION_SOURCE_LOCALE } from '@/lib/builder/translations/sync';
import { resolveBuilderSiteSettings } from '@/lib/builder/site/localized-settings';
import { normalizeHeaderFooterMobileConfig, normalizeMobileBottomBar } from '@/lib/builder/site/mobile-schema';
import {
  resolveBuilderSiteIdForMutationFromRequest,
  resolveBuilderSiteIdFromRequest,
} from '@/lib/builder/site/admin-routing';
import { normalizeLocale } from '@/lib/locales';
import {
  mergeHeaderFooterMobileConfig,
  mergeMobileBottomBarConfig,
  mergeTheme,
  normalizeDarkModeConfig,
} from './route-appearance';
import { errorResponse, validationErrorResponse } from './route-responses';
import { settingsPayloadSchema } from './route-schema';
import {
  applyLocalizedSettingsPatch,
  mergeSettings,
  stripLocalizedSettingsPatch,
} from './route-settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'settings');
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);
  try {
    const site = await readSiteDocument(siteId, locale);
    const resolvedSettings = resolveBuilderSiteSettings(site.settings, locale);

    return NextResponse.json({
      ok: true,
      settings: resolvedSettings ?? {},
      theme: mergeTheme(site.theme),
      darkMode: normalizeDarkModeConfig(site.darkMode),
      headerFooter: normalizeHeaderFooterMobileConfig(site.headerFooter),
      mobileBottomBar: normalizeMobileBottomBar(site.mobileBottomBar, resolvedSettings),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    return errorResponse(locale, 'site_settings_load_failed', 500);
  }
}

export async function PUT(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;
  try {
    const payload = settingsPayloadSchema.parse(await request.json());
    const site = await readSiteDocument(siteId, locale);
    const now = new Date().toISOString();

    const isSourceLocale = locale === DEFAULT_TRANSLATION_SOURCE_LOCALE;
    const globalPatch = isSourceLocale
      ? payload.settings
      : stripLocalizedSettingsPatch(payload.settings);
    site.settings = globalPatch ? mergeSettings(site.settings, globalPatch) : site.settings;
    if (!isSourceLocale && payload.settings) {
      const nextSettings = site.settings ?? {};
      const applied = applyLocalizedSettingsPatch(nextSettings, payload.settings, locale);
      site.settings = applied ? nextSettings : site.settings;
    }
    site.theme = mergeTheme(payload.theme ?? site.theme);
    site.darkMode = payload.darkMode ? normalizeDarkModeConfig(payload.darkMode) : site.darkMode;
    site.headerFooter = payload.headerFooter
      ? mergeHeaderFooterMobileConfig(site.headerFooter, payload.headerFooter)
      : normalizeHeaderFooterMobileConfig(site.headerFooter);
    site.mobileBottomBar = payload.mobileBottomBar
      ? mergeMobileBottomBarConfig(site.mobileBottomBar, payload.mobileBottomBar, resolveBuilderSiteSettings(site.settings, locale))
      : normalizeMobileBottomBar(site.mobileBottomBar, resolveBuilderSiteSettings(site.settings, locale));
    site.updatedAt = now;

    await writeSiteDocument(site);

    return NextResponse.json({
      ok: true,
      settings: resolveBuilderSiteSettings(site.settings, locale) ?? {},
      theme: site.theme,
      darkMode: normalizeDarkModeConfig(site.darkMode),
      headerFooter: normalizeHeaderFooterMobileConfig(site.headerFooter),
      mobileBottomBar: normalizeMobileBottomBar(site.mobileBottomBar, resolveBuilderSiteSettings(site.settings, locale)),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(locale, 'invalid_json', 400);
    }
    return errorResponse(locale, 'site_settings_save_failed', 500);
  }
}
