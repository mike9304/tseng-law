'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  BuilderSeoChecklistSettings,
  BuilderSeoDefaults,
} from '@/lib/builder/site/types';
import type { BuilderSeoOverview } from '@/lib/builder/seo/overview';

type DashboardTab = 'checklist' | 'defaults' | 'pages' | 'tools';

interface SeoSettingsResponse {
  ok?: boolean;
  defaults?: BuilderSeoDefaults;
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

function parseKeywords(value: string): string[] {
  return value
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function emptyDefaults(): BuilderSeoDefaults {
  return {
    patterns: {
      titleTemplate: '{{pageName}} | {{siteName}}',
      descriptionTemplate: '{{pageName}} 페이지입니다. {{businessName}}의 주요 서비스와 상담 정보를 확인하세요.',
      ogTitleTemplate: '{{titleTag}}',
      ogDescriptionTemplate: '{{metaDescription}}',
      twitterTitleTemplate: '{{titleTag}}',
      twitterDescriptionTemplate: '{{metaDescription}}',
    },
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
  const [activeTab, setActiveTab] = useState<DashboardTab>('checklist');
  const [overview, setOverview] = useState(initialOverview);
  const [businessName, setBusinessName] = useState(initialOverview.checklistSettings.businessName ?? '');
  const [keywords, setKeywords] = useState((initialOverview.checklistSettings.keywords ?? []).join(', '));
  const [serviceMode, setServiceMode] = useState<NonNullable<BuilderSeoChecklistSettings['serviceMode']>>(
    initialOverview.checklistSettings.serviceMode ?? 'both',
  );
  const [defaults, setDefaults] = useState<BuilderSeoDefaults>(emptyDefaults);
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
        setDefaults(payload.defaults ?? emptyDefaults());
        setPreview(payload.preview ?? []);
      }
    }
    void loadSettings();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const saveChecklist = async () => {
    setStatus('저장 중...');
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
      setStatus('체크리스트 저장 실패');
      return;
    }
    await refreshOverview();
    setStatus('저장됨');
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
    setStatus('SEO defaults 저장 중...');
    const response = await fetch(`/api/builder/site/seo-settings?locale=${encodeURIComponent(locale)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(defaults),
    });
    const payload = (await response.json().catch(() => ({}))) as SeoSettingsResponse;
    if (!response.ok) {
      setStatus(payload.error || 'SEO defaults 저장 실패');
      return;
    }
    setDefaults(payload.defaults ?? defaults);
    setPreview(payload.preview ?? []);
    await refreshOverview();
    setStatus('SEO defaults 저장됨');
  };

  const applyBulk = async (setIndexable?: boolean) => {
    if (selectedPageIds.length === 0) {
      setStatus('페이지를 먼저 선택하세요.');
      return;
    }
    setStatus('Bulk edit 저장 중...');
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
      setStatus(payload.error || 'Bulk edit 실패');
      return;
    }
    if (payload.overview) setOverview(payload.overview);
    setSelectedPageIds([]);
    setStatus('Bulk edit 저장됨');
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
          <h1 style={{ margin: 0, fontSize: '1.55rem', letterSpacing: 0 }}>SEO Dashboard</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Checklist, default patterns, Edit by Page, redirects를 한 곳에서 관리합니다.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href={`/${locale}/admin-builder/seo/redirects`} style={ghostButtonStyle}>Redirects</a>
          <a href={`/${locale}/admin-builder`} style={ghostButtonStyle}>Builder</a>
        </div>
      </header>

      <section style={statGridStyle}>
        {[
          ['Average score', `${overview.totals.averageScore}`],
          ['Pages', `${overview.totals.pages}`],
          ['Published', `${overview.totals.publishedPages}`],
          ['Indexable', `${overview.totals.indexablePages}`],
          ['Blockers', `${overview.totals.blockers}`],
          ['Warnings', `${overview.totals.warnings}`],
        ].map(([label, value]) => (
          <div key={label} style={{ ...cardStyle, padding: 14 }}>
            <div style={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>{label}</div>
            <div style={{ marginTop: 6, fontSize: '1.35rem', fontWeight: 900 }}>{value}</div>
          </div>
        ))}
      </section>

      <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          ['checklist', 'SEO Setup Checklist'],
          ['defaults', 'SEO Settings'],
          ['pages', 'Edit by Page'],
          ['tools', 'Tools'],
        ].map(([key, label]) => (
          <button key={key} type="button" style={tabButtonStyle(activeTab === key)} onClick={() => setActiveTab(key as DashboardTab)}>
            {label}
          </button>
        ))}
      </nav>

      {status ? <div style={{ color: status.includes('실패') ? '#dc2626' : '#15803d', fontSize: '0.82rem', fontWeight: 800 }}>{status}</div> : null}

      {activeTab === 'checklist' ? (
        <section style={sectionStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1rem' }}>SEO Setup Checklist</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.8rem' }}>
                Business name과 최대 5개 keyword를 기준으로 사이트 작업을 생성합니다.
              </p>
            </div>
            <button type="button" style={buttonStyle} onClick={saveChecklist}>저장</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) minmax(220px, 1.4fr) 170px', gap: 10 }}>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              Business name
              <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              Keywords
              <input value={keywords} onChange={(event) => setKeywords(event.target.value)} placeholder="keyword 1, keyword 2" style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              Service mode
              <select value={serviceMode} onChange={(event) => setServiceMode(event.target.value as typeof serviceMode)} style={inputStyle}>
                <option value="both">Physical + online</option>
                <option value="physical">Physical address</option>
                <option value="online">Online only</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {overview.checklist.map((item) => (
              <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 10, background: '#f8fafc' }}>
                <div style={{ color: statusColor(item.status), fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase' }}>{item.status}</div>
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
              <h2 style={{ margin: 0, fontSize: '1rem' }}>SEO Settings for Main Pages</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.8rem' }}>
                개별 페이지 값이 비어 있을 때 적용되는 Wix식 변수 패턴입니다.
              </p>
            </div>
            <button type="button" style={buttonStyle} onClick={saveDefaults}>Defaults 저장</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              Title tag pattern
              <input value={defaults.patterns?.titleTemplate ?? ''} onChange={(event) => updatePattern('titleTemplate', event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              Meta description pattern
              <textarea value={defaults.patterns?.descriptionTemplate ?? ''} onChange={(event) => updatePattern('descriptionTemplate', event.target.value)} style={{ ...inputStyle, minHeight: 84 }} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              OG title pattern
              <input value={defaults.patterns?.ogTitleTemplate ?? ''} onChange={(event) => updatePattern('ogTitleTemplate', event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              OG description pattern
              <input value={defaults.patterns?.ogDescriptionTemplate ?? ''} onChange={(event) => updatePattern('ogDescriptionTemplate', event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              Twitter card
              <select value={defaults.twitterCard ?? 'summary_large_image'} onChange={(event) => setDefaults((current) => ({ ...current, twitterCard: event.target.value as BuilderSeoDefaults['twitterCard'] }))} style={inputStyle}>
                <option value="summary_large_image">summary_large_image</option>
                <option value="summary">summary</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem' }}>Pattern preview</h3>
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
            <h2 style={{ margin: 0, fontSize: '1rem' }}>Edit by Page</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.78rem', fontWeight: 800 }}>
                <input type="checkbox" checked={resetTitle} onChange={(event) => setResetTitle(event.target.checked)} />
                reset title
              </label>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.78rem', fontWeight: 800 }}>
                <input type="checkbox" checked={resetDescription} onChange={(event) => setResetDescription(event.target.checked)} />
                reset description
              </label>
              <button type="button" style={ghostButtonStyle} onClick={() => void applyBulk(true)}>Allow indexing</button>
              <button type="button" style={ghostButtonStyle} onClick={() => void applyBulk(false)}>Block indexing</button>
              <button type="button" style={buttonStyle} onClick={() => void applyBulk(undefined)}>Reset selected</button>
            </div>
          </div>
          <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{selectedPageIds.length} selected</div>
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
                  <th style={{ padding: '9px 8px' }}>Page</th>
                  <th style={{ padding: '9px 8px' }}>Score</th>
                  <th style={{ padding: '9px 8px' }}>Indexable</th>
                  <th style={{ padding: '9px 8px' }}>Issues</th>
                  <th style={{ padding: '9px 8px' }}>Assistant</th>
                  <th style={{ padding: '9px 8px' }}>Keywords</th>
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
                    <td style={{ padding: '10px 8px' }}>{page.indexable ? 'Yes' : 'No'}</td>
                    <td style={{ padding: '10px 8px' }}>
                      {page.issueCounts.blockers} blocker · {page.issueCounts.warnings} warning
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      {page.assistantTasks.filter((task) => task.status === 'todo').length} todo
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
          <h2 style={{ margin: 0, fontSize: '1rem' }}>Technical SEO Tools</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <a href={`/${locale}/admin-builder/seo/redirects`} style={{ ...cardStyle, padding: 14, color: '#123b63', textDecoration: 'none', fontWeight: 850 }}>
              URL Redirect Manager
              <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: 5 }}>301/302/307/308 redirects</div>
            </a>
            <a href="/sitemap.xml" style={{ ...cardStyle, padding: 14, color: '#123b63', textDecoration: 'none', fontWeight: 850 }}>
              Sitemap
              <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: 5 }}>Published indexable pages only</div>
            </a>
            <a href="/robots.txt" style={{ ...cardStyle, padding: 14, color: '#123b63', textDecoration: 'none', fontWeight: 850 }}>
              Robots.txt
              <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: 5 }}>Noindex pages are disallowed</div>
            </a>
          </div>
        </section>
      ) : null}
    </main>
  );
}
