import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { listContacts } from '@/lib/builder/crm/contact-store';
import { readAutomations } from '@/lib/builder/crm/automation-model';
import { readIntegrations } from '@/lib/builder/crm/integrations-model';
import ContactsAdmin from '@/components/builder/crm/ContactsAdmin';
import AutomationsAdmin from '@/components/builder/crm/AutomationsAdmin';
import IntegrationsAdmin from '@/components/builder/crm/IntegrationsAdmin';
import CrmTabsClient from '@/components/builder/crm/CrmTabsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CRM',
  robots: { index: false, follow: false },
};

interface PageProps {
  params: { locale: string };
  searchParams?: { tab?: string };
}

export default async function CrmPage({ params, searchParams }: PageProps) {
  const locale: Locale = normalizeLocale(params.locale);
  const initialTab = (searchParams?.tab === 'automations' || searchParams?.tab === 'integrations'
    ? searchParams.tab
    : 'contacts') as 'contacts' | 'automations' | 'integrations';

  const [contacts, automations, integrations] = await Promise.all([
    listContacts(),
    readAutomations(),
    readIntegrations(),
  ]);

  return (
    <main
      data-testid="crm-admin"
      style={{
        padding: '0 0 48px',
        background: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      <header
        style={{
          padding: '20px 24px 12px',
          borderBottom: '1px solid #e2e8f0',
          background: '#ffffff',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a' }}>CRM</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          연락처 · 자동화 · 외부 연동 (Wix Studio CRM parity)
        </p>
      </header>

      <CrmTabsClient
        initialTab={initialTab}
        locale={locale}
        counts={{
          contacts: contacts.length,
          automations: automations.length,
          integrations: integrations.length,
        }}
      >
        <ContactsAdmin initialContacts={contacts} />
        <AutomationsAdmin initialAutomations={automations} />
        <IntegrationsAdmin initialIntegrations={integrations} />
      </CrmTabsClient>
    </main>
  );
}