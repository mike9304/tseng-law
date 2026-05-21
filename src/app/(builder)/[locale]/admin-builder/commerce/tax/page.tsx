import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { loadTaxRules } from '@/lib/builder/commerce/tax-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import TaxRulesClient from '@/components/builder/commerce/TaxRulesClient';

export const dynamic = 'force-dynamic';

export default async function CommerceTaxRulesPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, locale);
  const rules = await loadTaxRules();

  return (
    <TaxRulesClient
      locale={locale}
      siteTitle={site.name}
      initialRules={rules}
    />
  );
}
