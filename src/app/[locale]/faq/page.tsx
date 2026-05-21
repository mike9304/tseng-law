import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import JsonLd from '@/components/JsonLd';
import FaqPublicExplorer from '@/components/faq/FaqPublicExplorer';
import { pageCopy } from '@/data/page-copy';
import {
  faqItemsToSchemaItems,
  listFaqCategories,
  listFaqItems,
} from '@/lib/builder/faq/faq-engine';
import { generateFAQSchema } from '@/lib/builder/seo/schema-org';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].faq;
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/faq',
    noindex: locale === 'en',
  });
}

export default async function FaqPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { category?: string };
}) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].faq;
  const categories = listFaqCategories();
  const items = await listFaqItems({ locale, status: 'published' });
  const schemaItems = faqItemsToSchemaItems(items);

  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <FaqPublicExplorer
        locale={locale}
        categories={categories}
        items={items}
        initialCategory={searchParams?.category}
      />
      {schemaItems.length > 0 ? <JsonLd data={generateFAQSchema(schemaItems)} /> : null}
    </>
  );
}
