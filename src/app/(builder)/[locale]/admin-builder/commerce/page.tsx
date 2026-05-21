import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import {
  filterProductsByLocale,
  listProducts,
  sortProducts,
} from '@/lib/builder/commerce/products-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import ProductManagerClient from '@/components/builder/commerce/ProductManagerClient';

export const dynamic = 'force-dynamic';

export default async function CommerceProductsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, locale);
  const products = sortProducts(filterProductsByLocale(await listProducts(), locale), 'updated-desc');

  return (
    <ProductManagerClient
      locale={locale}
      siteTitle={site.name}
      initialProducts={products}
    />
  );
}
