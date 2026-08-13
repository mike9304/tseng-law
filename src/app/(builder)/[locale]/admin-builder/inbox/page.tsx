import type { Metadata } from 'next';
import { listConversations } from '@/lib/builder/live-chat/storage';
import { toSafeChatConversation } from '@/lib/builder/live-chat/types';
import InboxAdmin from '@/components/builder/live-chat/InboxAdmin';
import { getLiveChatInboxCopy } from '@/components/builder/live-chat/inbox-copy';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import { requireBuilderPagePermission } from '@/lib/builder/security/page-permission';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const copy = getLiveChatInboxCopy(locale);
  return buildSeoMetadata({
    locale,
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    path: '/admin-builder/inbox',
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function InboxPage(
  props: {
    params: Promise<{ locale: Locale }>;
  }
) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const copy = getLiveChatInboxCopy(locale);
  await requireBuilderPagePermission('manage-contacts');
  const conversations = await listConversations();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>{copy.pageTitle}</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          {copy.pageDescription}
        </p>
      </header>
      <InboxAdmin locale={locale} initialConversations={conversations.map(toSafeChatConversation)} />
    </main>
  );
}
