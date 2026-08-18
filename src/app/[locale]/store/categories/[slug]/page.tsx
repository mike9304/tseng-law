import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  findProductCategoryBySlug,
  listActiveProductsForCategory,
  listProductCategories,
  sortProducts,
} from '@/lib/builder/commerce/products-engine';
import { normalizeLocale, locales, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import PublicStorefront from '@/components/builder/commerce/PublicStorefront';

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  props: {
    params: Promise<{ locale: Locale; slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const category = await findProductCategoryBySlug(locale, params.slug);
  if (!category) {
    return buildSeoMetadata({
      locale,
      title: 'Store collection',
      description: 'Store collection',
      path: `/store/categories/${params.slug}`,
      noindex: true,
      alternateLocales: locales,
    });
  }

  return buildSeoMetadata({
    locale,
    title: category.seo.title ?? category.name,
    description: category.seo.description ?? category.description,
    path: `/store/categories/${category.slug}`,
    noindex: locale === 'en',
    alternateLocales: locales,
  });
}

export default async function StoreCategoryPage(
  props: {
    params: Promise<{ locale: Locale; slug: string }>;
  }
) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const category = await findProductCategoryBySlug(locale, params.slug);
  if (!category) return notFound();

  const products = sortProducts(await listActiveProductsForCategory(locale, category.slug), 'updated-desc');
  const categories = await listProductCategories(locale);

  return (
    <PublicStorefront
      locale={locale}
      title={category.name}
      description={category.description}
      eyebrow="Store collection"
      products={products}
      categories={categories}
      activeCategory={category}
    />
  );
}
