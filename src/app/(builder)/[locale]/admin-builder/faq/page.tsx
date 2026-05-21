import type { Metadata } from 'next';
import FaqAdminClient from '@/components/builder/faq/FaqAdminClient';
import {
  listFaqCategories,
  listFaqItems,
} from '@/lib/builder/faq/faq-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: 'Builder FAQ Admin',
    description: 'FAQ 앱 질문, 카테고리, 공개 상태와 schema 설정을 관리합니다.',
    path: '/admin-builder/faq',
    noindex: true,
  });
}

export default async function BuilderFaqAdminPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const [items, categories] = await Promise.all([
    listFaqItems({ locale, status: 'all', limit: 200 }),
    Promise.resolve(listFaqCategories()),
  ]);

  return <FaqAdminClient locale={locale} initialItems={items} categories={categories} />;
}
