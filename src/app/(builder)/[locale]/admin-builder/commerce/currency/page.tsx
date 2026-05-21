import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { loadCurrencySettings } from '@/lib/builder/commerce/currency-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import CurrencySettingsClient from '@/components/builder/commerce/CurrencySettingsClient';

export const dynamic = 'force-dynamic';

export default async function CommerceCurrencySettingsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, locale);
  const settings = await loadCurrencySettings();

  return (
    <CurrencySettingsClient
      locale={locale}
      siteTitle={site.name}
      initialSettings={settings}
    />
  );
}
