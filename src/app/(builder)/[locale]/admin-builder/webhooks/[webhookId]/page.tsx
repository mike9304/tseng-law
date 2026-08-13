import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import { getSubscription, listDeliveriesForWebhook } from '@/lib/builder/webhooks/storage';
import WebhookDeliveriesView from '@/components/builder/webhooks/WebhookDeliveriesView';

export const dynamic = 'force-dynamic';

const COPY: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: '웹훅 전송 이력',
    description: '선택한 webhook 구독의 전송 결과와 재시도를 관리합니다.',
  },
  'zh-hant': {
    title: 'Webhook 傳送記錄',
    description: '管理所選 webhook 訂閱的傳送結果與重試。',
  },
  en: {
    title: 'Webhook Deliveries',
    description: 'Manage delivery results and retries for the selected webhook subscription.',
  },
};

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: COPY[locale].title,
    description: COPY[locale].description,
    path: '/admin-builder/webhooks',
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function WebhookDetailPage(props: { params: Promise<{ locale: string; webhookId: string }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const subscription = await getSubscription(params.webhookId);
  if (!subscription) notFound();
  const deliveries = await listDeliveriesForWebhook(params.webhookId);
  return (
    <WebhookDeliveriesView
      locale={locale}
      webhookId={subscription.webhookId}
      webhookUrl={subscription.url}
      initialDeliveries={deliveries.slice(0, 200)}
    />
  );
}
