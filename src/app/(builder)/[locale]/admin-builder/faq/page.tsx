import type { Metadata } from 'next';
import FaqAdminClient from '@/components/builder/faq/FaqAdminClient';
import {
  listFaqCategories,
  listFaqItems,
} from '@/lib/builder/faq/faq-engine';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: locale === 'ko' ? 'FAQ 관리자' : locale === 'zh-hant' ? 'FAQ 管理員' : 'Builder FAQ Admin',
    description:
      locale === 'ko'
        ? 'FAQ 질문, 카테고리, 공개 상태와 schema 설정을 관리합니다.'
        : locale === 'zh-hant'
          ? '管理 FAQ 問題、分類、公開狀態與 schema 設定。'
          : 'Manage FAQ questions, categories, publication state, and schema settings.',
    path: '/admin-builder/faq',
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function BuilderFaqAdminPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const [items, categories] = await Promise.all([
    listFaqItems({ locale, status: 'all', limit: 200 }),
    Promise.resolve(listFaqCategories()),
  ]);

  return <FaqAdminClient locale={locale} initialItems={items} categories={categories} />;
}
