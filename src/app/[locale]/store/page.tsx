import type { Metadata } from 'next';
import {
  filterProductsByLocale,
  filterProductsByStatus,
  listProductCategories,
  listProducts,
  sortProducts,
} from '@/lib/builder/commerce/products-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import PublicStorefront from '@/components/builder/commerce/PublicStorefront';

export const dynamic = 'force-dynamic';

const copy: Record<Locale, { title: string; description: string; eyebrow: string }> = {
  ko: {
    title: '스토어',
    description: '대만 법률 실무에 필요한 가이드, 상담 패키지, 디지털 상품을 컬렉션별로 확인하세요.',
    eyebrow: 'Store',
  },
  'zh-hant': {
    title: '商店',
    description: '依系列瀏覽台灣法律實務指南、諮詢套組與數位商品。',
    eyebrow: 'Store',
  },
  en: {
    title: 'Store',
    description: 'Browse Taiwan law guides, consultation bundles, and digital products by collection.',
    eyebrow: 'Store',
  },
};

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: copy[locale].title,
    description: copy[locale].description,
    path: '/store',
    noindex: locale === 'en',
  });
}

export default async function StorePage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const products = sortProducts(
    filterProductsByStatus(filterProductsByLocale(await listProducts(), locale), 'active'),
    'updated-desc',
  );
  const categories = await listProductCategories(locale, { products });

  return (
    <PublicStorefront
      locale={locale}
      title={copy[locale].title}
      description={copy[locale].description}
      eyebrow={copy[locale].eyebrow}
      products={products}
      categories={categories}
    />
  );
}
