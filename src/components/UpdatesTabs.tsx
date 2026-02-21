'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';

export default function UpdatesTabs({ locale }: { locale: Locale }) {
  const { updates } = siteContent[locale];
  const [activeTab, setActiveTab] = useState(updates.tabs[0].id);
  const active = useMemo(() => updates.tabs.find((tab) => tab.id === activeTab) ?? updates.tabs[0], [activeTab, updates.tabs]);
  const tabPanelId = `${locale}-profile-updates-panel`;

  return (
    <section className="section">
      <div className="container">
        <SectionLabel>{updates.label}</SectionLabel>
        <h2 className="section-title">{updates.title}</h2>
        <OrnamentDivider />
        <div className="updates-tabs" role="tablist" aria-label="Updates">
          {updates.tabs.map((tab) => (
            <button
              key={tab.id}
              id={`${locale}-profile-updates-tab-${tab.id}`}
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
        <div
          className="list-rows reveal-stagger"
          role="tabpanel"
          id={tabPanelId}
          aria-labelledby={`${locale}-profile-updates-tab-${active.id}`}
        >
          {active.items.map((item) => (
            <div className="list-row" key={item.title}>
              <div className="list-meta">{item.meta}</div>
              <div>
                <Link className="link-underline" href={item.href}>
                  {item.title}
                </Link>
              </div>
              <div className="tag">{item.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
