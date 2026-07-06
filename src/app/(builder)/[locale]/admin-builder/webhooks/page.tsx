import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import { listSubscriptions } from '@/lib/builder/webhooks/storage';
import WebhooksAdmin from '@/components/builder/webhooks/WebhooksAdmin';

export const dynamic = 'force-dynamic';

const COPY: Record<Locale, { title: string; description: string; heading: string; body: string }> = {
  ko: {
    title: '웹훅',
    description: '외부 시스템으로 보내는 이벤트 구독을 관리합니다.',
    heading: '웹훅',
    body: '외부 시스템으로 이벤트를 보내는 webhook 구독. HMAC-SHA256 서명 포함.',
  },
  'zh-hant': {
    title: 'Webhook',
    description: '管理發送到外部系統的事件訂閱。',
    heading: 'Webhook',
    body: '發送事件到外部系統的 webhook 訂閱。包含 HMAC-SHA256 簽章。',
  },
  en: {
    title: 'Webhooks',
    description: 'Manage subscriptions that send events to external systems.',
    heading: 'Webhooks',
    body: 'Webhook subscriptions that send events to external systems. Includes HMAC-SHA256 signing.',
  },
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: COPY[locale].title,
    description: COPY[locale].description,
    path: '/admin-builder/webhooks',
    noindex: true,
  });
}

export default async function WebhooksPage({ params }: { params: { locale: string } }) {
  const locale = normalizeLocale(params.locale);
  const text = COPY[locale];
  const subscriptions = await listSubscriptions();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>{text.heading}</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{text.body}</p>
      </header>
      <WebhooksAdmin
        locale={locale}
        initialSubscriptions={subscriptions.map((s) => ({ ...s, secret: `${s.secret.slice(0, 12)}…` }))}
      />
    </main>
  );
}
