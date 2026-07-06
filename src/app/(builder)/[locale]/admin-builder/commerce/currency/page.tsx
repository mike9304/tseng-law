import type { Metadata } from 'next';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { loadCurrencySettings } from '@/lib/builder/commerce/currency-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import CurrencySettingsClient from '@/components/builder/commerce/CurrencySettingsClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const locale = normalizeLocale(params.locale);
  const title = locale === 'ko' ? '통화 설정' : locale === 'zh-hant' ? '幣別設定' : 'Currency settings';
  const description = locale === 'ko'
    ? '체크아웃 통화와 미리보기 환율을 관리합니다.'
    : locale === 'zh-hant'
      ? '管理結帳幣別與預覽匯率。'
      : 'Manage checkout currencies and preview conversion rates.';
  return { title, description };
}

export default async function CommerceCurrencySettingsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, locale);
  const settings = await loadCurrencySettings();

  return (
    <CurrencySettingsClient
      locale={locale}
      siteTitle={site.name}
      initialSettings={settings}
    />
  );
}
