'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/locales';
import OpsOverview from './OpsOverview';
import CachePanel from './CachePanel';
import BackupsPanel from './BackupsPanel';
import LogsPanel from './LogsPanel';
import PerfPanel from './PerfPanel';
import SecurityPanel from './SecurityPanel';

type TabKey = 'overview' | 'cache' | 'backups' | 'logs' | 'perf' | 'security';

type OpsCopy = {
  tabsLabel: string;
  tabs: Record<TabKey, string>;
};

export interface OpsAdminInitialSearchParams {
  tab?: string;
  type?: string;
  level?: string;
  q?: string;
  query?: string;
}

const COPY: Record<Locale, OpsCopy> = {
  ko: {
    tabsLabel: 'Ops 섹션',
    tabs: {
      overview: '개요',
      cache: '캐시',
      backups: '백업',
      logs: '로그',
      perf: '성능',
      security: '보안',
    },
  },
  'zh-hant': {
    tabsLabel: 'Ops 區段',
    tabs: {
      overview: '總覽',
      cache: '快取',
      backups: '備份',
      logs: '記錄',
      perf: '效能',
      security: '安全',
    },
  },
  en: {
    tabsLabel: 'Ops sections',
    tabs: {
      overview: 'Overview',
      cache: 'Cache',
      backups: 'Backups',
      logs: 'Logs',
      perf: 'Perf',
      security: 'Security',
    },
  },
};

function readInitialTab(value: string | undefined): TabKey {
  switch (value) {
    case 'cache':
    case 'backups':
    case 'logs':
    case 'perf':
    case 'security':
      return value;
    default:
      return 'overview';
  }
}

export default function OpsAdmin({
  locale,
  initialSearchParams = {},
}: {
  locale: Locale;
  initialSearchParams?: OpsAdminInitialSearchParams;
}) {
  const [active, setActive] = useState<TabKey>(() => readInitialTab(initialSearchParams.tab));
  const text = COPY[locale];
  const initialLogQuery = initialSearchParams.q ?? initialSearchParams.query ?? '';
  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'overview', label: text.tabs.overview },
    { key: 'cache', label: text.tabs.cache },
    { key: 'backups', label: text.tabs.backups },
    { key: 'logs', label: text.tabs.logs },
    { key: 'perf', label: text.tabs.perf },
    { key: 'security', label: text.tabs.security },
  ];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <nav
        role="tablist"
        aria-label={text.tabsLabel}
        data-ops-tabs="true"
        style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              data-ops-tab={tab.key}
              onClick={() => setActive(tab.key)}
              style={{
                padding: '8px 14px',
                border: 0,
                borderBottom: isActive ? '2px solid #0f172a' : '2px solid transparent',
                background: 'transparent',
                color: isActive ? '#0f172a' : '#64748b',
                fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <section role="tabpanel" data-ops-panel={active}>
        {active === 'overview' ? <OpsOverview locale={locale} /> : null}
        {active === 'cache' ? <CachePanel /> : null}
        {active === 'backups' ? <BackupsPanel /> : null}
        {active === 'logs' ? (
          <LogsPanel
            initialType={initialSearchParams.type}
            initialLevel={initialSearchParams.level}
            initialQuery={initialLogQuery}
          />
        ) : null}
        {active === 'perf' ? <PerfPanel /> : null}
        {active === 'security' ? <SecurityPanel /> : null}
      </section>
    </div>
  );
}
