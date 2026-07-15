import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { listContacts } from '@/lib/builder/crm/contact-store';
import { readAutomations, readOutbox } from '@/lib/builder/crm/automation-model';
import { readIntegrations } from '@/lib/builder/crm/integrations-model';
import ContactsAdmin from '@/components/builder/crm/ContactsAdmin';
import AutomationsAdmin from '@/components/builder/crm/AutomationsAdmin';
import IntegrationsAdmin from '@/components/builder/crm/IntegrationsAdmin';
import OutboxAdmin from '@/components/builder/crm/OutboxAdmin';
import CrmTabsClient, { type CrmTab } from '@/components/builder/crm/CrmTabsClient';

export const dynamic = 'force-dynamic';

const CRM_PAGE_COPY = {
  ko: {
    title: 'CRM',
    description: '연락처, 자동화, 외부 연동, 개발용 이메일 시뮬레이션을 관리하는 CRM 관리자 화면입니다.',
    heading: 'CRM',
    summary: '연락처, 자동화, 외부 연동, 개발용 이메일 시뮬레이션을 관리합니다.',
  },
  'zh-hant': {
    title: 'CRM',
    description: '管理聯絡人、自動化、外部整合與開發用 Email 模擬的 CRM 管理畫面。',
    heading: 'CRM',
    summary: '管理聯絡人、自動化、外部整合與開發用 Email 模擬。',
  },
  en: {
    title: 'CRM',
    description: 'Manage contacts, automations, integrations, and development email simulations in the CRM admin surface.',
    heading: 'CRM',
    summary: 'Manage contacts, automations, integrations, and development email simulations.',
  },
} as const satisfies Record<Locale, {
  title: string;
  description: string;
  heading: string;
  summary: string;
}>;

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = CRM_PAGE_COPY[locale];
  return {
    title: copy.title,
    description: copy.description,
    robots: { index: false, follow: false },
  };
}

interface PageProps {
  params: { locale: string };
  searchParams?: { tab?: string };
}

function normalizeCrmTab(tab: string | undefined): CrmTab {
  if (tab === 'automations' || tab === 'integrations' || tab === 'outbox') return tab;
  return 'contacts';
}

export default async function CrmPage({ params, searchParams }: PageProps) {
  const locale: Locale = normalizeLocale(params.locale);
  const copy = CRM_PAGE_COPY[locale];
  const initialTab = normalizeCrmTab(searchParams?.tab);

  const [contacts, automations, integrations, outbox] = await Promise.all([
    listContacts(),
    readAutomations(),
    readIntegrations(),
    readOutbox(),
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
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{copy.heading}</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{copy.summary}</p>
      </header>

      <CrmTabsClient
        initialTab={initialTab}
        locale={locale}
        counts={{
          contacts: contacts.length,
          automations: automations.length,
          integrations: integrations.length,
          outbox: outbox.length,
        }}
      >
        <ContactsAdmin initialContacts={contacts} locale={locale} />
        <AutomationsAdmin initialAutomations={automations} locale={locale} />
        <IntegrationsAdmin initialIntegrations={integrations} locale={locale} />
        <OutboxAdmin initialEntries={outbox} locale={locale} />
      </CrmTabsClient>
    </main>
  );
}
