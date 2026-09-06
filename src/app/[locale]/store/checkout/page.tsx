import type { Metadata } from 'next';
import PublicCheckout from '@/components/builder/commerce/PublicCheckout';
import { normalizeLocale, locales, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import PublicUnavailableState, { publicUnavailableMetadata } from '@/components/PublicUnavailableState';

export const dynamic = 'force-dynamic';

const copy: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: '스토어 체크아웃',
    description: '주문 확인 전 장바구니, 배송지, 세금, 결제 방식을 검토하세요.',
  },
  'zh-hant': {
    title: '商店結帳',
    description: '確認訂單前，請檢查購物車、配送、稅額與付款方式。',
  },
  en: {
    title: 'Store checkout',
    description: 'Review your cart, shipping, tax, and payment method before confirming your order.',
  },
};

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  if ((params.locale as string) === 'ja') {
    return publicUnavailableMetadata('ja', 'checkout');
  }
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
  if ((params.locale as string) === 'ja') {
    return <PublicUnavailableState locale="ja" kind="checkout" />;
  }
  const locale = normalizeLocale(params.locale);
  return <PublicCheckout locale={locale} />;
}
