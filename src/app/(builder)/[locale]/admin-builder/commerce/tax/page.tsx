import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { loadTaxRules } from '@/lib/builder/commerce/tax-engine';
import { requireBuilderPagePermission } from '@/lib/builder/security/page-permission';
import { normalizeLocale, type Locale } from '@/lib/locales';
import TaxRulesClient from '@/components/builder/commerce/TaxRulesClient';

export const dynamic = 'force-dynamic';

export default async function CommerceTaxRulesPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  await requireBuilderPagePermission('view-commerce');
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
