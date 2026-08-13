import type { Metadata } from 'next';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { listPaymentWebhookEvents } from '@/lib/builder/commerce/payment-webhooks-engine';
import { requireBuilderPagePermission } from '@/lib/builder/security/page-permission';
import { normalizeLocale, type Locale } from '@/lib/locales';
import PaymentWebhookManagerClient from '@/components/builder/commerce/PaymentWebhookManagerClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const title = locale === 'ko' ? '결제 웹훅' : locale === 'zh-hant' ? '付款 Webhook' : 'Payment webhooks';
  return {
    title,
    description: locale === 'ko'
      ? '결제 이벤트, 주문 매칭, 재시도 상태, 마스킹된 payload를 한곳에서 검토합니다.'
      : locale === 'zh-hant'
        ? '在同一處檢視付款事件、訂單比對、重試狀態與遮罩後的 payload。'
        : 'Review provider events, payment references, order matching, replay state, and masked payload details in one place.',
  };
}

export default async function CommercePaymentWebhooksPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  await requireBuilderPagePermission('view-commerce');
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, locale);
  const events = await listPaymentWebhookEvents();

  return (
    <PaymentWebhookManagerClient
      locale={locale}
      siteTitle={site.name}
      initialEvents={events}
    />
  );
}
