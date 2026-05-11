import type { Metadata } from 'next';
import { listSubscriptions } from '@/lib/builder/webhooks/storage';
import WebhooksAdmin from '@/components/builder/webhooks/WebhooksAdmin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Webhooks',
  robots: { index: false, follow: false },
};

export default async function WebhooksPage() {
  const subscriptions = await listSubscriptions();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Webhooks</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          외부 시스템으로 이벤트를 보내는 webhook 구독. HMAC-SHA256 서명 포함.
        </p>
      </header>
      <WebhooksAdmin
        initialSubscriptions={subscriptions.map((s) => ({ ...s, secret: `${s.secret.slice(0, 12)}…` }))}
      />
    </main>
  );
}
