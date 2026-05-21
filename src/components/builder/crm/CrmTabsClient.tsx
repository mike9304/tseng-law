'use client';

import { useState, type ReactNode } from 'react';
import type { Locale } from '@/lib/locales';

interface Counts {
  contacts: number;
  automations: number;
  integrations: number;
}

type Tab = 'contacts' | 'automations' | 'integrations';

interface Props {
  initialTab: Tab;
  locale: Locale;
  counts: Counts;
  /** Children must be exactly 3 panels in [contacts, automations, integrations] order. */
  children: [ReactNode, ReactNode, ReactNode];
}

const LABELS: Record<Tab, string> = {
  contacts: '연락처',
  automations: '자동화',
  integrations: '외부 연동',
};

const ORDER: Tab[] = ['contacts', 'automations', 'integrations'];

export default function CrmTabsClient({ initialTab, locale, counts, children }: Props) {
  const [active, setActive] = useState<Tab>(initialTab);
  const indexByTab: Record<Tab, number> = { contacts: 0, automations: 1, integrations: 2 };
  void locale;

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
        aria-label="CRM tabs"
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
              {LABELS[tab]} ({counts[tab]})
            </button>
          );
        })}
      </nav>
      <div style={{ padding: '0 0 24px' }}>{children[indexByTab[active]]}</div>
    </div>
  );
}