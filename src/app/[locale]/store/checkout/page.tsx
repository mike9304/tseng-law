import type { Metadata } from 'next';
import PublicCheckout from '@/components/builder/commerce/PublicCheckout';
import { normalizeLocale, locales, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const copy: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: '스토어 체크아웃',
    description: '장바구니, 배송지, 세금, 결제 어댑터를 확인하고 주문 확인번호를 생성합니다.',
  },
  'zh-hant': {
    title: '商店結帳',
    description: '確認購物車、配送、稅額與付款介面，並產生訂單確認號。',
  },
  en: {
    title: 'Store checkout',
    description: 'Review cart, shipping, tax, and payment adapter details before confirmation.',
  },
};

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: copy[locale].title,
    description: copy[locale].description,
    path: '/store/checkout',
    noindex: true,
    alternateLocales: locales,
  });
}

export default async function StoreCheckoutPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  return <PublicCheckout locale={locale} />;
}
