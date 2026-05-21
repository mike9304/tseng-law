import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { loadShippingRules } from '@/lib/builder/commerce/shipping-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import ShippingRulesClient from '@/components/builder/commerce/ShippingRulesClient';

export const dynamic = 'force-dynamic';

export default async function CommerceShippingRulesPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, locale);
  const rules = await loadShippingRules();

  return (
    <ShippingRulesClient
      locale={locale}
      siteTitle={site.name}
      initialRules={rules}
    />
  );
}
