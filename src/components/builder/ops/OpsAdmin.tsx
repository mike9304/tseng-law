'use client';

import { useState } from 'react';
import OpsOverview from './OpsOverview';
import CachePanel from './CachePanel';
import BackupsPanel from './BackupsPanel';
import LogsPanel from './LogsPanel';
import PerfPanel from './PerfPanel';
import SecurityPanel from './SecurityPanel';

type TabKey = 'overview' | 'cache' | 'backups' | 'logs' | 'perf' | 'security';

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'cache', label: 'Cache' },
  { key: 'backups', label: 'Backups' },
  { key: 'logs', label: 'Logs' },
  { key: 'perf', label: 'Perf' },
  { key: 'security', label: 'Security' },
];

export default function OpsAdmin() {
  const [active, setActive] = useState<TabKey>('overview');

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <nav
        role="tablist"
        aria-label="Ops sections"
        data-ops-tabs="true"
        style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}
      >
        {TABS.map((tab) => {
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
        {active === 'overview' ? <OpsOverview /> : null}
        {active === 'cache' ? <CachePanel /> : null}
        {active === 'backups' ? <BackupsPanel /> : null}
        {active === 'logs' ? <LogsPanel /> : null}
        {active === 'perf' ? <PerfPanel /> : null}
        {active === 'security' ? <SecurityPanel /> : null}
      </section>
    </div>
  );
}