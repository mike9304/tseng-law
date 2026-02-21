'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import EditorialSection from '@/components/EditorialSection';
import ListModule from '@/components/ListModule';
import SmartLink from '@/components/SmartLink';

export default function FirmUpdatesSection({ locale }: { locale: Locale }) {
  const { firmUpdates } = siteContent[locale];
  const [activeTab, setActiveTab] = useState(firmUpdates.tabs[0]?.id);
  const active = useMemo(
    () => firmUpdates.tabs.find((tab) => tab.id === activeTab) ?? firmUpdates.tabs[0],
    [activeTab, firmUpdates.tabs]
  );
  const tabPanelId = `${locale}-firm-updates-panel`;

  if (!active) return null;

  return (
    <EditorialSection id="insights" label={firmUpdates.label} title={firmUpdates.title}>
      <div className="updates-tabs" role="tablist" aria-label={firmUpdates.title}>
        {firmUpdates.tabs.map((tab) => (
          <button
            key={tab.id}
            id={`${locale}-firm-updates-tab-${tab.id}`}
            type="button"
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={tabPanelId}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ListModule
        className="list-rows reveal-stagger"
        role="tabpanel"
        id={tabPanelId}
        labelledBy={`${locale}-firm-updates-tab-${active.id}`}
      >
        {active.items.map((item) => (
          <div className="list-row" key={item.title}>
            <div className="list-meta">{item.meta}</div>
            <div>
              <SmartLink className="link-underline" href={item.href}>
                {item.title}
              </SmartLink>
            </div>
            {item.tag ? <div className="tag">{item.tag}</div> : null}
          </div>
        ))}
      </ListModule>
    </EditorialSection>
  );
}
