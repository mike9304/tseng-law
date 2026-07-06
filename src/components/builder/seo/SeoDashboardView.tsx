'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  BuilderSeoChecklistSettings,
  BuilderSeoDefaults,
} from '@/lib/builder/site/types';
import type { BuilderSeoOverview } from '@/lib/builder/seo/overview';
import { getDefaultBuilderSeoPatterns } from '@/lib/builder/seo/defaults';
import { normalizeLocale } from '@/lib/locales';
import { getSeoDashboardCopy } from './seo-dashboard-copy';

type DashboardTab = 'checklist' | 'defaults' | 'pages' | 'tools';

interface SeoSettingsResponse {
  ok?: boolean;
  defaults?: BuilderSeoDefaults;
  robotsTxt?: string;
  preview?: Array<{ pageId: string; title: string; description: string; publicPath: string }>;
  error?: string;
}

const shellStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f8fafc',
  color: '#0f172a',
  padding: '28px',
  display: 'grid',
  gap: 18,
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
};

const sectionStyle: React.CSSProperties = {
  ...cardStyle,
  padding: 18,
  display: 'grid',
  gap: 14,
};

const statGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: 12,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  padding: '9px 10px',
  fontSize: '0.86rem',
  color: '#0f172a',
};

const buttonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 8,
  background: '#123b63',
  color: '#fff',
  fontSize: '0.84rem',
  fontWeight: 800,
  padding: '9px 14px',
  cursor: 'pointer',
};

const ghostButtonStyle: React.CSSProperties = {
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#123b63',
  fontSize: '0.82rem',
  fontWeight: 800,
  padding: '8px 12px',
  textDecoration: 'none',
  cursor: 'pointer',
};

const tabButtonStyle = (active: boolean): React.CSSProperties => ({
  ...ghostButtonStyle,
  background: active ? '#123b63' : '#fff',
  color: active ? '#fff' : '#123b63',
  borderColor: active ? '#123b63' : '#cbd5e1',
});

function statusColor(status: 'done' | 'todo' | 'warning'): string {
  if (status === 'done') return '#15803d';
  if (status === 'warning') return '#b45309';
  return '#dc2626';
}

function scoreColor(score: number): string {
  if (score >= 85) return '#15803d';
  if (score >= 65) return '#b45309';
  return '#dc2626';
}

function isErrorStatusMessage(status: string): boolean {
  return /failed|실패|失敗|error|錯誤/i.test(status);
}

function parseKeywords(value: string): string[] {
  return value
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function emptyDefaults(locale: string): BuilderSeoDefaults {
  return {
    patterns: getDefaultBuilderSeoPatterns(normalizeLocale(locale)),
    twitterCard: 'summary_large_image',
    structuredData: {
      legalService: true,
      faqPage: 'auto',
      breadcrumbList: true,
    },
  };
}

export default function SeoDashboardView({
  locale,
  initialOverview,
}: {
  locale: string;
  initialOverview: BuilderSeoOverview;
}) {
  const copy = getSeoDashboardCopy(locale);
  const [activeTab, setActiveTab] = useState<DashboardTab>('checklist');
  const [overview, setOverview] = useState(initialOverview);
  const [businessName, setBusinessName] = useState(initialOverview.checklistSettings.businessName ?? '');
  const [keywords, setKeywords] = useState((initialOverview.checklistSettings.keywords ?? []).join(', '));
  const [serviceMode, setServiceMode] = useState<NonNullable<BuilderSeoChecklistSettings['serviceMode']>>(
    initialOverview.checklistSettings.serviceMode ?? 'both',
  );
  const [defaults, setDefaults] = useState<BuilderSeoDefaults>(() => emptyDefaults(locale));
  const [robotsTxt, setRobotsTxt] = useState('');
  const [preview, setPreview] = useState<SeoSettingsResponse['preview']>([]);
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [resetTitle, setResetTitle] = useState(true);
  const [resetDescription, setResetDescription] = useState(true);
  const [status, setStatus] = useState('');
  const sortedPages = useMemo(
    () => [...overview.pages].sort((left, right) => left.score - right.score || left.title.localeCompare(right.title)),
    [overview.pages],
  );
  const selectedSet = useMemo(() => new Set(selectedPageIds), [selectedPageIds]);

  useEffect(() => {
    let cancelled = false;
    async function loadSettings() {
      const response = await fetch(`/api/builder/site/seo-settings?locale=${encodeURIComponent(locale)}`, {
        credentials: 'same-origin',
      });
      const payload = (await response.json().catch(() => ({}))) as SeoSettingsResponse;
      if (!cancelled && response.ok) {
        setDefaults(payload.defaults ?? emptyDefaults(locale));
        setRobotsTxt(payload.robotsTxt ?? '');
        setPreview(payload.preview ?? []);
      }
    }
    void loadSettings();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const saveChecklist = async () => {
    setStatus(copy.savingChecklistLabel);
    const response = await fetch(`/api/builder/site/seo-checklist?locale=${encodeURIComponent(locale)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        businessName,
        keywords: parseKeywords(keywords),
        serviceMode,
      }),
    });
    if (!response.ok) {
      setStatus(copy.checklistSaveFailedLabel);
      return;
    }
    await refreshOverview();
    setStatus(copy.savedLabel);
  };

  const refreshOverview = async () => {
    const overviewResponse = await fetch(`/api/builder/site/seo-overview?locale=${encodeURIComponent(locale)}`, {
      credentials: 'same-origin',
    });
    if (overviewResponse.ok) {
      const payload = (await overviewResponse.json()) as { overview?: BuilderSeoOverview };
      if (payload.overview) setOverview(payload.overview);
    }
  };

  const saveDefaults = async () => {
    setStatus(copy.savingDefaultsLabel);
    const response = await fetch(`/api/builder/site/seo-settings?locale=${encodeURIComponent(locale)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(defaults),
    });
    const payload = (await response.json().catch(() => ({}))) as SeoSettingsResponse;
    if (!response.ok) {
      setStatus(payload.error || copy.defaultsSaveFailedLabel);
      return;
    }
    setDefaults(payload.defaults ?? defaults);
    setPreview(payload.preview ?? []);
    await refreshOverview();
    setStatus(copy.defaultsSavedLabel);
  };

  const saveRobots = async () => {
    setStatus(copy.savingRobotsLabel);
    const response = await fetch(`/api/builder/site/seo-settings?locale=${encodeURIComponent(locale)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ robotsTxt }),
    });
    const payload = (await response.json().catch(() => ({}))) as SeoSettingsResponse;
    if (!response.ok) {
      setStatus(payload.error || copy.robotsSaveFailedLabel);
      return;
    }
    setRobotsTxt(payload.robotsTxt ?? '');
    setStatus(copy.robotsSavedLabel);
  };

  const applyBulk = async (setIndexable?: boolean) => {
    if (selectedPageIds.length === 0) {
      setStatus(copy.selectPagesFirstLabel);
      return;
    }
    setStatus(copy.savingBulkLabel);
    const resetFields = [
      ...(resetTitle ? ['title' as const] : []),
      ...(resetDescription ? ['description' as const] : []),
    ];
    const response = await fetch(`/api/builder/site/seo-bulk?locale=${encodeURIComponent(locale)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        pageIds: selectedPageIds,
        ...(setIndexable !== undefined ? { setIndexable } : {}),
        ...(resetFields.length > 0 ? { resetFields } : {}),
      }),
    });
    const payload = (await response.json().catch(() => ({}))) as { overview?: BuilderSeoOverview; error?: string };
    if (!response.ok) {
      setStatus(payload.error || copy.bulkSaveFailedLabel);
      return;
    }
    if (payload.overview) setOverview(payload.overview);
    setSelectedPageIds([]);
    setStatus(copy.bulkSavedLabel);
  };

  const updatePattern = (key: keyof NonNullable<BuilderSeoDefaults['patterns']>, value: string) => {
    setDefaults((current) => ({
      ...current,
      patterns: {
        ...(current.patterns ?? {}),
        [key]: value,
      },
    }));
  };

  const toggleSelected = (pageId: string, checked: boolean) => {
    setSelectedPageIds((current) => (
      checked
        ? [...new Set([...current, pageId])]
        : current.filter((id) => id !== pageId)
    ));
  };

  return (
    <main style={shellStyle}>
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 18 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.55rem', letterSpacing: 0 }}>{copy.title}</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            {copy.lede}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href={`/${locale}/admin-builder/seo/redirects`} style={ghostButtonStyle}>{copy.redirectsLabel}</a>
          <a href={`/${locale}/admin-builder`} style={ghostButtonStyle}>{copy.builderLabel}</a>
        </div>
      </header>

      <section style={statGridStyle}>
        {[
          [copy.averageScoreLabel, `${overview.totals.averageScore}`],
          [copy.pagesLabel, `${overview.totals.pages}`],
          [copy.publishedLabel, `${overview.totals.publishedPages}`],
          [copy.indexableLabel, `${overview.totals.indexablePages}`],
          [copy.blockersLabel, `${overview.totals.blockers}`],
          [copy.warningsLabel, `${overview.totals.warnings}`],
        ].map(([label, value]) => (
          <div key={label} style={{ ...cardStyle, padding: 14 }}>
            <div style={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>{label}</div>
            <div style={{ marginTop: 6, fontSize: '1.35rem', fontWeight: 900 }}>{value}</div>
          </div>
        ))}
      </section>

      <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          ['checklist', copy.checklistTabLabel],
          ['defaults', copy.defaultsTabLabel],
          ['pages', copy.pagesTabLabel],
          ['tools', copy.toolsTabLabel],
        ].map(([key, label]) => (
          <button key={key} type="button" style={tabButtonStyle(activeTab === key)} onClick={() => setActiveTab(key as DashboardTab)}>
            {label}
          </button>
        ))}
      </nav>

      {status ? <div style={{ color: isErrorStatusMessage(status) ? '#dc2626' : '#15803d', fontSize: '0.82rem', fontWeight: 800 }}>{status}</div> : null}

      {activeTab === 'checklist' ? (
        <section style={sectionStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1rem' }}>{copy.checklistTitle}</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.8rem' }}>
                {copy.checklistDescription}
              </p>
            </div>
            <button type="button" style={buttonStyle} onClick={saveChecklist}>{copy.saveChecklistLabel}</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) minmax(220px, 1.4fr) 170px', gap: 10 }}>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.businessNameLabel}
              <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.keywordsLabel}
              <input value={keywords} onChange={(event) => setKeywords(event.target.value)} placeholder={copy.keywordsPlaceholder} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.serviceModeLabel}
              <select value={serviceMode} onChange={(event) => setServiceMode(event.target.value as typeof serviceMode)} style={inputStyle}>
                <option value="both">{copy.serviceModeBothLabel}</option>
                <option value="physical">{copy.serviceModePhysicalLabel}</option>
                <option value="online">{copy.serviceModeOnlineLabel}</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {overview.checklist.map((item) => (
              <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 10, background: '#f8fafc' }}>
                <div style={{ color: statusColor(item.status), fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase' }}>
                  {copy.checklistStatusLabel(item.status)}
                </div>
                <div style={{ marginTop: 4, fontWeight: 850 }}>{item.label}</div>
                <div style={{ marginTop: 3, color: '#64748b', fontSize: '0.77rem', lineHeight: 1.45 }}>{item.detail}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'defaults' ? (
        <section style={sectionStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1rem' }}>{copy.defaultsTitle}</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.8rem' }}>
                {copy.defaultsDescription}
              </p>
            </div>
            <button type="button" style={buttonStyle} onClick={saveDefaults}>{copy.saveDefaultsLabel}</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
              <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.titlePatternLabel}
              <input value={defaults.patterns?.titleTemplate ?? ''} onChange={(event) => updatePattern('titleTemplate', event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.descriptionPatternLabel}
              <textarea value={defaults.patterns?.descriptionTemplate ?? ''} onChange={(event) => updatePattern('descriptionTemplate', event.target.value)} style={{ ...inputStyle, minHeight: 84 }} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.ogTitlePatternLabel}
              <input value={defaults.patterns?.ogTitleTemplate ?? ''} onChange={(event) => updatePattern('ogTitleTemplate', event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.ogDescriptionPatternLabel}
              <input value={defaults.patterns?.ogDescriptionTemplate ?? ''} onChange={(event) => updatePattern('ogDescriptionTemplate', event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.twitterCardLabel}
              <select value={defaults.twitterCard ?? 'summary_large_image'} onChange={(event) => setDefaults((current) => ({ ...current, twitterCard: event.target.value as BuilderSeoDefaults['twitterCard'] }))} style={inputStyle}>
                <option value="summary_large_image">{copy.twitterSummaryLargeLabel}</option>
                <option value="summary">{copy.twitterSummaryLabel}</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem' }}>{copy.patternPreviewTitle}</h3>
            {(preview ?? []).slice(0, 6).map((row) => (
              <div key={row.pageId} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 10, background: '#f8fafc' }}>
                <div style={{ color: '#64748b', fontSize: '0.74rem' }}>{row.publicPath}</div>
                <div style={{ color: '#1a0dab', fontWeight: 800, marginTop: 4 }}>{row.title}</div>
                <div style={{ color: '#475569', fontSize: '0.78rem', marginTop: 3 }}>{row.description}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'pages' ? (
        <section style={sectionStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1rem' }}>{copy.editByPageTitle}</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.78rem', fontWeight: 800 }}>
                <input type="checkbox" checked={resetTitle} onChange={(event) => setResetTitle(event.target.checked)} />
                {copy.resetTitleLabel}
              </label>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.78rem', fontWeight: 800 }}>
                <input type="checkbox" checked={resetDescription} onChange={(event) => setResetDescription(event.target.checked)} />
                {copy.resetDescriptionLabel}
              </label>
              <button type="button" style={ghostButtonStyle} onClick={() => void applyBulk(true)}>{copy.allowIndexingLabel}</button>
              <button type="button" style={ghostButtonStyle} onClick={() => void applyBulk(false)}>{copy.blockIndexingLabel}</button>
              <button type="button" style={buttonStyle} onClick={() => void applyBulk(undefined)}>{copy.resetSelectedLabel}</button>
            </div>
          </div>
          <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{copy.selectedCountLabel(selectedPageIds.length)}</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '9px 8px' }}>
                    <input
                      type="checkbox"
                      checked={selectedPageIds.length === sortedPages.length && sortedPages.length > 0}
                      onChange={(event) => setSelectedPageIds(event.target.checked ? sortedPages.map((page) => page.pageId) : [])}
                    />
                  </th>
                  <th style={{ padding: '9px 8px' }}>{copy.pageColumnLabel}</th>
                  <th style={{ padding: '9px 8px' }}>{copy.scoreColumnLabel}</th>
                  <th style={{ padding: '9px 8px' }}>{copy.indexableColumnLabel}</th>
                  <th style={{ padding: '9px 8px' }}>{copy.issuesColumnLabel}</th>
                  <th style={{ padding: '9px 8px' }}>{copy.assistantColumnLabel}</th>
                  <th style={{ padding: '9px 8px' }}>{copy.keywordsColumnLabel}</th>
                </tr>
              </thead>
              <tbody>
                {sortedPages.map((page) => (
                  <tr key={page.pageId} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '10px 8px' }}>
                      <input type="checkbox" checked={selectedSet.has(page.pageId)} onChange={(event) => toggleSelected(page.pageId, event.target.checked)} />
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <div style={{ fontWeight: 850 }}>{page.title}</div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{page.publicPath}</div>
                    </td>
                    <td style={{ padding: '10px 8px', color: scoreColor(page.score), fontWeight: 900 }}>{page.score}</td>
                    <td style={{ padding: '10px 8px' }}>{page.indexable ? copy.yesLabel : copy.noLabel}</td>
                    <td style={{ padding: '10px 8px' }}>
                      {copy.issueCountsLabel(page.issueCounts.blockers, page.issueCounts.warnings)}
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      {copy.todoCountLabel(page.assistantTasks.filter((task) => task.status === 'todo').length)}
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      {page.keywordHits.length > 0 ? page.keywordHits.join(', ') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {activeTab === 'tools' ? (
        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: '1rem' }}>{copy.toolsTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <a href={`/${locale}/admin-builder/seo/redirects`} style={{ ...cardStyle, padding: 14, color: '#123b63', textDecoration: 'none', fontWeight: 850 }}>
              {copy.redirectManagerLabel}
              <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: 5 }}>{copy.redirectManagerDescription}</div>
            </a>
            <a href="/sitemap.xml" style={{ ...cardStyle, padding: 14, color: '#123b63', textDecoration: 'none', fontWeight: 850 }}>
              {copy.sitemapLabel}
              <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: 5 }}>{copy.sitemapDescription}</div>
            </a>
            <a href="/robots.txt" style={{ ...cardStyle, padding: 14, color: '#123b63', textDecoration: 'none', fontWeight: 850 }}>
              {copy.robotsLabel}
              <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: 5 }}>{copy.robotsDescription}</div>
            </a>
          </div>
          <div style={{ ...cardStyle, padding: 14, display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.92rem' }}>{copy.customRobotsTitle}</h3>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.78rem' }}>
                  {copy.customRobotsDescription}
                </p>
              </div>
              <button type="button" style={buttonStyle} onClick={saveRobots}>{copy.saveRobotsLabel}</button>
            </div>
            <textarea
              aria-label={copy.customRobotsAriaLabel}
              value={robotsTxt}
              onChange={(event) => setRobotsTxt(event.target.value)}
              placeholder={copy.robotsPlaceholder}
              style={{ ...inputStyle, minHeight: 150, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', lineHeight: 1.55 }}
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}
