import { isLocale, type Locale } from '@/lib/locales';
import type { TranslationDashboardPayload } from '@/lib/builder/translations/dashboard-model';

export type TranslationDashboardRefreshResult =
  | { readonly ok: true; readonly payload: TranslationDashboardPayload }
  | { readonly ok: false; readonly message: string };

function isTranslationDashboardPayload(value: unknown): value is TranslationDashboardPayload {
  if (typeof value !== 'object' || value === null) return false;
  if (!('ok' in value) || value.ok !== true) return false;
  if (!('siteId' in value) || typeof value.siteId !== 'string') return false;
  if (!('sourceLocale' in value) || typeof value.sourceLocale !== 'string' || !isLocale(value.sourceLocale)) return false;
  if (!('targetLocales' in value) || !Array.isArray(value.targetLocales)) return false;
  if (!('rows' in value) || !Array.isArray(value.rows)) return false;
  if (!('coverageSummaries' in value) || !Array.isArray(value.coverageSummaries)) return false;
  if (!('syncedAt' in value) || typeof value.syncedAt !== 'string') return false;
  return value.targetLocales.every((locale) => typeof locale === 'string' && isLocale(locale));
}

function dashboardErrorMessage(value: unknown, fallback: string): string {
  if (
    typeof value === 'object'
    && value !== null
    && 'error' in value
    && typeof value.error === 'string'
    && value.error.trim()
  ) {
    return value.error;
  }
  return fallback;
}

export async function refreshTranslationDashboardPayload(
  sourceLocale: Locale,
): Promise<TranslationDashboardRefreshResult> {
  const query = new URLSearchParams({ sourceLocale });
  const response = await fetch(`/api/builder/translations/dashboard?${query.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  const data: unknown = await response.json().catch(() => null);
  if (response.ok && isTranslationDashboardPayload(data)) {
    return { ok: true, payload: data };
  }
  return {
    ok: false,
    message: dashboardErrorMessage(data, String(response.status)),
  };
}
