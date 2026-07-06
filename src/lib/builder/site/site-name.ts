import type { Locale } from '@/lib/locales';
import type { BuilderSiteDocument, BuilderSiteSettings } from './types';
import { resolveBuilderSiteSettings } from './localized-settings';

export function resolveBuilderSiteName(
  site: Pick<BuilderSiteDocument, 'name' | 'settings'>,
  locale: Locale,
): string {
  const resolvedSettings: BuilderSiteSettings | undefined = resolveBuilderSiteSettings(
    site.settings,
    locale,
  );
  return resolvedSettings?.firmName || site.name;
}
