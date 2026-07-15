'use client';

import { useState, type ReactNode } from 'react';
import type { Locale } from '@/lib/locales';

interface Counts {
  contacts: number;
  automations: number;
  integrations: number;
  outbox: number;
}

export type CrmTab = 'contacts' | 'automations' | 'integrations' | 'outbox';

interface Props {
  initialTab: CrmTab;
  locale: Locale;
  counts: Counts;
  children: [ReactNode, ReactNode, ReactNode, ReactNode];
}

const LABELS: Record<Locale, Record<CrmTab, string>> = {
  ko: {
    contacts: '연락처',
    automations: '자동화',
    integrations: '외부 연동',
    outbox: '이메일 시뮬레이션',
  },
  'zh-hant': {
    contacts: '聯絡人',
    automations: '自動化',
    integrations: '外部整合',
    outbox: 'Email 模擬',
  },
  en: {
    contacts: 'Contacts',
    automations: 'Automations',
    integrations: 'Integrations',
    outbox: 'Email simulation',
  },
};

const COPY = {
  ko: 'CRM 탭',
  'zh-hant': 'CRM 分頁',
  en: 'CRM tabs',
} satisfies Record<Locale, string>;

const ORDER: CrmTab[] = ['contacts', 'automations', 'integrations', 'outbox'];

export default function CrmTabsClient({ initialTab, locale, counts, children }: Props) {
  const [active, setActive] = useState<CrmTab>(initialTab);
  const indexByTab: Record<CrmTab, number> = { contacts: 0, automations: 1, integrations: 2, outbox: 3 };

  return (
    <div>
      <nav
        style={{
          display: 'flex',
          gap: 4,
          padding: '12px 16px',
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          overflowX: 'auto',
        }}
        role="tablist"
        aria-label={COPY[locale]}
      >
        {ORDER.map((tab) => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              data-testid={`crm-tab-${tab}`}
              onClick={() => setActive(tab)}
              style={{
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 700,
                background: isActive ? '#0f172a' : 'transparent',
                color: isActive ? '#fff' : '#475569',
                border: '1px solid',
                borderColor: isActive ? '#0f172a' : '#e2e8f0',
                borderRadius: 999,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {LABELS[locale][tab]} ({counts[tab]})
            </button>
          );
        })}
      </nav>
      <div style={{ padding: '0 0 24px' }}>{children[indexByTab[active]]}</div>
    </div>
  );
}
