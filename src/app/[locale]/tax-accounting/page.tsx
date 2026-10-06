import type { Metadata } from 'next';
import TaxAccountingBoard from '@/components/tax-accounting/TaxAccountingBoard';
import { getAllColumnPosts } from '@/lib/columns';
import { normalizeSiteLocale, siteLocales, type SiteLocale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import {
  TAX_ACCOUNTING_BOARD_PATH,
  selectTaxAccountingColumns,
  taxAccountingBoardCopy,
} from '@/lib/tax-accounting-board';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: {
  params: Promise<{ locale: SiteLocale }>;
}): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  const copy = taxAccountingBoardCopy[locale];

  return buildSeoMetadata({
    locale,
    title: copy.metaTitle,
    description: copy.description,
    path: TAX_ACCOUNTING_BOARD_PATH,
    keywords: copy.keywords,
    alternateLocales: siteLocales,
  });
}

export default async function TaxAccountingBoardPage(props: {
  params: Promise<{ locale: SiteLocale }>;
}) {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  const lists = selectTaxAccountingColumns(getAllColumnPosts(locale));
  return <TaxAccountingBoard locale={locale} lists={lists} />;
}
