import type { Metadata } from 'next';
import { listConversations } from '@/lib/builder/live-chat/storage';
import InboxAdmin from '@/components/builder/live-chat/InboxAdmin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Inbox',
  robots: { index: false, follow: false },
};

export default async function InboxPage() {
  const conversations = await listConversations();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Live Chat Inbox</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          방문자의 실시간 대화. SSE 기반 (Fluid Compute streaming). 폴링 1.5s.
        </p>
      </header>
      <InboxAdmin
        initialConversations={conversations.map(({ visitorToken: _v, ...rest }) => rest)}
      />
    </main>
  );
}
