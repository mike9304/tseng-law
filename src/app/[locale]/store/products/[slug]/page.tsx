import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import PublicProductDetail from '@/components/builder/commerce/PublicProductDetail';
import {
  filterProductsByLocale,
  filterProductsByStatus,
  findProductBySlug,
  listProductCategories,
  listProducts,
  sortProducts,
} from '@/lib/builder/commerce/products-engine';
import {
  commerceInventoryAvailability,
  slugifyProductCategory,
  type CommerceAvailabilityState,
  type CommerceProduct,
  type CommerceProductVariant,
} from '@/lib/builder/commerce/products-shared';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildAbsoluteUrl, buildBreadcrumbJsonLd, buildSeoMetadata, getLocalizedPath } from '@/lib/seo';

export const dynamic = 'force-dynamic';

function decodeSlug(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function productPath(product: CommerceProduct): string {
  return `/store/products/${product.slug}`;
}

function productImage(product: CommerceProduct): string | undefined {
  return [...product.media].sort((left, right) => left.sortOrder - right.sortOrder)[0]?.url;
}

function schemaAvailability(availability: CommerceAvailabilityState): string {
  if (availability === 'backorder') return 'https://schema.org/BackOrder';
  if (availability === 'out-of-stock') return 'https://schema.org/OutOfStock';
  if (availability === 'disabled') return 'https://schema.org/Discontinued';
  if (availability === 'low-stock') return 'https://schema.org/LimitedAvailability';
  return 'https://schema.org/InStock';
}

function variantAvailability(variant: CommerceProductVariant): CommerceAvailabilityState {
  return commerceInventoryAvailability(variant.inventory, variant.status);
}

function buildProductJsonLd(locale: Locale, product: CommerceProduct): Record<string, unknown> {
  const path = getLocalizedPath(locale, productPath(product));
  const url = buildAbsoluteUrl(path);
  const image = productImage(product);
  const activeVariants = product.variants.filter((variant) => variant.status === 'active');
  const offerVariants = activeVariants.length > 0 ? activeVariants : product.variants;
  const prices = offerVariants.length > 0 ? offerVariants.map((variant) => variant.priceCents) : [product.priceCents];
  const availability = offerVariants.some((variant) => {
    const state = variantAvailability(variant);
    return state === 'in-stock' || state === 'low-stock' || state === 'backorder';
  })
    ? 'in-stock'
    : commerceInventoryAvailability(product.inventory);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.title,
    description: product.seo.description ?? product.description,
    sku: product.sku,
    image: image ? [buildAbsoluteUrl(image)] : undefined,
    brand: {
      '@type': 'Organization',
      name: locale === 'ko'
        ? '법무법인 호정'
        : locale === 'zh-hant'
          ? '昊鼎國際法律事務所'
          : 'Hovering International Law Firm',
    },
    offers: prices.length > 1
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: product.currency,
          lowPrice: Math.min(...prices) / 100,
          highPrice: Math.max(...prices) / 100,
          offerCount: prices.length,
          availability: schemaAvailability(availability),
          url,
        }
      : {
          '@type': 'Offer',
          priceCurrency: product.currency,
          price: prices[0] / 100,
          availability: schemaAvailability(availability),
          sku: product.variants[0]?.sku ?? product.sku,
          url,
        },
  };
}

function relatedProductsFor(product: CommerceProduct, products: CommerceProduct[]): CommerceProduct[] {
  const categories = new Set(product.categoryIds.map((id) => slugifyProductCategory(id)));
  return products
    .filter((item) => item.productId !== product.productId)
    .filter((item) => item.categoryIds.some((id) => categories.has(slugifyProductCategory(id))))
    .slice(0, 4);
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const locale = normalizeLocale(params.locale);
  const slug = decodeSlug(params.slug);
  const product = await findProductBySlug(locale, slug);

  if (!product || product.status !== 'active') {
    return buildSeoMetadata({
      locale,
      title: 'Store product',
      description: 'Store product',
      path: `/store/products/${slug}`,
      noindex: true,
    });
  }

  return buildSeoMetadata({
    locale,
    title: product.seo.title ?? product.title,
    description: product.seo.description ?? product.description,
    path: productPath(product),
    images: productImage(product),
    noindex: locale === 'en',
  });
}

export default async function StoreProductPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const locale = normalizeLocale(params.locale);
  const slug = decodeSlug(params.slug);
  const product = await findProductBySlug(locale, slug);
  if (!product || product.status !== 'active') return notFound();

  const activeProducts = sortProducts(
    filterProductsByStatus(filterProductsByLocale(await listProducts(), locale), 'active'),
    'updated-desc',
  );
  const categories = await listProductCategories(locale, { products: activeProducts });
  const relatedProducts = relatedProductsFor(product, activeProducts);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home', path: `/${locale}` },
          { name: locale === 'ko' ? '스토어' : locale === 'zh-hant' ? '商店' : 'Store', path: `/${locale}/store` },
          { name: product.title, path: getLocalizedPath(locale, productPath(product)) },
        ])}
      />
      <JsonLd data={buildProductJsonLd(locale, product)} />
      <PublicProductDetail
        locale={locale}
        product={product}
        categories={categories}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
