import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { listOrders } from '@/lib/builder/commerce/orders-engine';
import { requireBuilderPagePermission } from '@/lib/builder/security/page-permission';
import { normalizeLocale, type Locale } from '@/lib/locales';
import OrderManagerClient from '@/components/builder/commerce/OrderManagerClient';

export const dynamic = 'force-dynamic';

export default async function CommerceOrdersPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  await requireBuilderPagePermission('view-commerce');
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, locale);
  const orders = await listOrders({ locale });

  return (
    <OrderManagerClient
      locale={locale}
      siteTitle={site.name}
      initialOrders={orders}
    />
  );
}
