'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type {
  BuilderSeoChecklistSettings,
  BuilderSeoDefaults,
} from '@/lib/builder/site/types';
import type { BuilderSeoOverview } from '@/lib/builder/seo/overview';
import { getDefaultBuilderSeoPatterns } from '@/lib/builder/seo/defaults';
import { normalizeLocale } from '@/lib/locales';
import { getSeoDashboardCopy } from './seo-dashboard-copy';
import { createMutationController, type MutationController, type MutationTicket, type WriteResult } from '../cms/mutation-controller.mjs';

type DashboardTab = 'checklist' | 'defaults' | 'pages' | 'tools';

interface SeoSettingsResponse {
  ok?: boolean;
  defaults?: BuilderSeoDefaults;
  robotsTxt?: string;
  preview?: Array<{ pageId: string; title: string; description: string; publicPath: string }>;
  error?: string;
}

type SaveAction = 'checklist' | 'defaults' | 'robots' | 'bulk';
type SaveKey = { action: SaveAction; revision: number };
type SaveInput = { url: string; body: string };
type SaveSession = { controller: MutationController; ticket: MutationTicket };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isDefaults(value: unknown): value is BuilderSeoDefaults {
  return isRecord(value)
    && (value.patterns === undefined || (isRecord(value.patterns) && Object.values(value.patterns).every((item) => typeof item === 'string')))
    && (value.twitterCard === undefined || value.twitterCard === 'summary' || value.twitterCard === 'summary_large_image');
}

function isPreview(value: unknown): value is NonNullable<SeoSettingsResponse['preview']> {
  return Array.isArray(value) && value.every((row) => isRecord(row)
    && ['pageId', 'title', 'description', 'publicPath'].every((key) => typeof row[key] === 'string'));
}

function isOverview(value: unknown): value is BuilderSeoOverview {
  return isRecord(value) && isRecord(value.checklistSettings) && isRecord(value.totals)
    && ['pages', 'publishedPages', 'indexablePages', 'blockers', 'warnings', 'averageScore'].every((key) => typeof (value.totals as Record<string, unknown>)[key] === 'number')
    && Array.isArray(value.checklist) && value.checklist.every((item) => isRecord(item)
      && ['id', 'label', 'detail'].every((key) => typeof item[key] === 'string')
      && ['done', 'todo', 'warning'].includes(String(item.status)))
    && Array.isArray(value.pages) && value.pages.every((page) => isRecord(page)
      && ['pageId', 'title', 'publicPath'].every((key) => typeof page[key] === 'string')
      && typeof page.score === 'number' && typeof page.indexable === 'boolean'
      && isRecord(page.issueCounts) && typeof page.issueCounts.blockers === 'number' && typeof page.issueCounts.warnings === 'number'
      && Array.isArray(page.keywordHits) && page.keywordHits.every((keyword) => typeof keyword === 'string')
      && Array.isArray(page.assistantTasks) && page.assistantTasks.every((task) => isRecord(task) && typeof task.status === 'string'));
}

async function writeSeo(input: unknown): Promise<WriteResult> {
  const request = input as SaveInput;
  try {
    const response = await fetch(request.url, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: request.body,
    });
    const payload: unknown = await response.json();
    if (response.ok && isRecord(payload) && payload.ok === true) return { kind: 'ack', value: payload };
    // These route responses precede writes. A 5xx can follow persistence (for
    // example bulk overview construction), so it cannot prove an unsaved state.
    if ([400, 401, 403].includes(response.status) && isRecord(payload) && payload.ok === false) {
      return { kind: 'rejected', reason: payload };
    }
    return { kind: 'unknown', reason: payload };
  } catch (reason) {
    return { kind: 'unknown', reason };
  }
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
  const [statusTone, setStatusTone] = useState<'pending' | 'success' | 'error' | 'unknown'>('pending');
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [settingsState, setSettingsState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [busy, setBusy] = useState(false);
  const [session, setSession] = useState<SaveSession | null>(null);
  const sessionRef = useRef<SaveSession | null>(null);
  const pending = useRef<SaveKey | null>(null);
  const revisions = useRef<Record<SaveAction, number>>({ checklist: 0, defaults: 0, robots: 0, bulk: 0 });
  const initialOverviewRef = useRef(initialOverview);
  useLayoutEffect(() => { initialOverviewRef.current = initialOverview; });
  const revisionAtRender = { ...revisions.current };
  // A retained handler keeps its original operation key, including after ACK or
  // unknown. Fresh rendered handlers represent a subsequent explicit attempt.
  const keys: Record<SaveAction, SaveKey> = {
    checklist: { action: 'checklist', revision: revisionAtRender.checklist },
    defaults: { action: 'defaults', revision: revisionAtRender.defaults },
    robots: { action: 'robots', revision: revisionAtRender.robots },
    bulk: { action: 'bulk', revision: revisionAtRender.bulk },
  };
  const sortedPages = useMemo(
    () => [...overview.pages].sort((left, right) => left.score - right.score || left.title.localeCompare(right.title)),
    [overview.pages],
  );
  const selectedSet = useMemo(() => new Set(selectedPageIds), [selectedPageIds]);

  useLayoutEffect(() => {
    const ownerCopy = getSeoDashboardCopy(locale);
    const initial = initialOverviewRef.current;
    setOverview(initial);
    setBusinessName(initial.checklistSettings.businessName ?? '');
    setKeywords((initial.checklistSettings.keywords ?? []).join(', '));
    setServiceMode(initial.checklistSettings.serviceMode ?? 'both');
    setDefaults(emptyDefaults(locale));
    setRobotsTxt('');
    setPreview([]);
    setSelectedPageIds([]);
    setResetTitle(true);
    setResetDescription(true);
    setSettingsState('loading');
    setStatus('');
    setRefreshFailed(false);
    setBusy(false);
    pending.current = null;
    revisions.current = { checklist: 0, defaults: 0, robots: 0, bulk: 0 };
    const messages = {
      checklist: { pending: ownerCopy.savingChecklistLabel, saved: ownerCopy.savedLabel, rejected: ownerCopy.checklistSaveFailedLabel },
      defaults: { pending: ownerCopy.savingDefaultsLabel, saved: ownerCopy.defaultsSavedLabel, rejected: ownerCopy.defaultsSaveFailedLabel },
      robots: { pending: ownerCopy.savingRobotsLabel, saved: ownerCopy.robotsSavedLabel, rejected: ownerCopy.robotsSaveFailedLabel },
      bulk: { pending: ownerCopy.savingBulkLabel, saved: ownerCopy.bulkSavedLabel, rejected: ownerCopy.bulkSaveFailedLabel },
    };
    const controller = createMutationController({
      write: writeSeo,
      refresh: async (target) => {
        if (typeof target !== 'string') return null;
        const response = await fetch(target, { credentials: 'same-origin' });
        const payload: unknown = await response.json();
        if (!response.ok || !isRecord(payload) || payload.ok !== true || !isOverview(payload.overview)) {
          throw new Error('SEO overview unavailable');
        }
        return payload.overview;
      },
      onAck: (value, context) => {
        const key = context.key as SaveKey;
        const payload = value as Record<string, unknown>;
        const unchanged = revisions.current[key.action] === key.revision;
        setStatus(messages[key.action].saved + (unchanged ? '' : ` ${ownerCopy.newerEditsLabel}`));
        setStatusTone('success');
        if (key.action === 'defaults' && unchanged) {
          if (isDefaults(payload.defaults)) {
            revisions.current.defaults += 1;
            setDefaults(payload.defaults);
          }
          if (isPreview(payload.preview)) setPreview(payload.preview);
        }
        if (key.action === 'robots' && unchanged && typeof payload.robotsTxt === 'string') {
          revisions.current.robots += 1;
          setRobotsTxt(payload.robotsTxt);
        }
        if (key.action === 'bulk') {
          if (isOverview(payload.overview)) setOverview(payload.overview);
          if (unchanged) {
            revisions.current.bulk += 1;
            setSelectedPageIds([]);
          }
        }
      },
      onRefresh: (snapshot) => { if (isOverview(snapshot)) setOverview(snapshot); },
      onState: (state, context) => {
        if (!context.key) return;
        const key = context.key as SaveKey;
        const operation = state.operations.find((item) => item.key === key);
        if (!operation) return;
        if (context.source === 'submit') {
          pending.current = key;
          setBusy(true);
          setStatus(messages[key.action].pending);
          setStatusTone('pending');
          setRefreshFailed(false);
        } else if (operation.phase !== 'pending') {
          pending.current = null;
          setBusy(false);
          if (operation.phase === 'rejected') {
            setStatus(messages[key.action].rejected);
            setStatusTone('error');
          } else if (operation.phase === 'unknown') {
            setStatus(ownerCopy.saveUnknownLabel);
            setStatusTone('unknown');
          }
          if (context.source === 'refresh-error') setRefreshFailed(true);
        }
      },
    });
    // Draft revisions are guarded separately so newer typing cannot suppress
    // settlement, strand the busy lock, or overwrite the newer input on ACK.
    controller.commit({ owner: {}, edit: {} });
    const issued = controller.issueTicket();
    if (!issued.ok) return;
    const currentSession = { controller, ticket: issued.ticket };
    sessionRef.current = currentSession;
    setSession(currentSession);
    let cancelled = false;
    async function loadSettings() {
      try {
        const response = await fetch(`/api/builder/site/seo-settings?locale=${encodeURIComponent(locale)}`, {
          credentials: 'same-origin',
        });
        const payload: unknown = await response.json();
        if (!response.ok || !isRecord(payload) || payload.ok !== true
          || !isDefaults(payload.defaults) || typeof payload.robotsTxt !== 'string' || !isPreview(payload.preview)) {
          throw new Error('SEO settings unavailable');
        }
        if (cancelled) return;
        revisions.current.defaults += 1;
        revisions.current.robots += 1;
        setDefaults(payload.defaults);
        setRobotsTxt(payload.robotsTxt);
        setPreview(payload.preview);
        setSettingsState('ready');
      } catch {
        if (!cancelled) setSettingsState('error');
      }
    }
    void loadSettings();
    return () => {
      cancelled = true;
      controller.dispose();
      if (sessionRef.current === currentSession) sessionRef.current = null;
    };
  }, [locale]);

  const canUseSession = () => session !== null && sessionRef.current === session;
  const markEdited = (action: SaveAction) => {
    if (!canUseSession() || ((action === 'defaults' || action === 'robots') && settingsState !== 'ready')) return false;
    revisions.current[action] += 1;
    return true;
  };
  const submit = (action: SaveAction, route: string, body: unknown) => {
    if (!session || !canUseSession() || pending.current || revisions.current[action] !== revisionAtRender[action]) return;
    if ((action === 'defaults' || action === 'robots') && settingsState !== 'ready') return;
    session.controller.submit(session.ticket, {
      key: keys[action],
      input: Object.freeze({ url: `/api/builder/site/${route}?locale=${encodeURIComponent(locale)}`, body: JSON.stringify(body) }),
      refreshTarget: action === 'checklist' || action === 'defaults'
        ? `/api/builder/site/seo-overview?locale=${encodeURIComponent(locale)}` : null,
    });
  };
  const saveChecklist = () => submit('checklist', 'seo-checklist', {
    businessName, keywords: parseKeywords(keywords), serviceMode,
  });
  const saveDefaults = () => submit('defaults', 'seo-settings', defaults);
  const saveRobots = () => submit('robots', 'seo-settings', { robotsTxt });
  const applyBulk = (setIndexable?: boolean) => {
    if (!canUseSession() || pending.current || revisions.current.bulk !== revisionAtRender.bulk) return;
    if (selectedPageIds.length === 0) {
      setStatus(copy.selectPagesFirstLabel);
      setStatusTone('error');
      return;
    }
    const resetFields = [
      ...(resetTitle ? ['title' as const] : []),
      ...(resetDescription ? ['description' as const] : []),
    ];
    submit('bulk', 'seo-bulk', {
      pageIds: selectedPageIds,
      ...(setIndexable !== undefined ? { setIndexable } : {}),
      ...(resetFields.length > 0 ? { resetFields } : {}),
    });
  };

  const updatePattern = (key: keyof NonNullable<BuilderSeoDefaults['patterns']>, value: string) => {
    if (!markEdited('defaults')) return;
    setDefaults((current) => ({ ...current, patterns: { ...(current.patterns ?? {}), [key]: value } }));
  };

  const toggleSelected = (pageId: string, checked: boolean) => {
    if (!markEdited('bulk')) return;
    setSelectedPageIds((current) => (
      checked ? [...new Set([...current, pageId])] : current.filter((id) => id !== pageId)
    ));
  };
  const saveDisabled = busy || !session;
  const settingsDisabled = settingsState !== 'ready';

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

      {status ? <div role="status" aria-live="polite" style={{ color: statusTone === 'error' ? '#dc2626' : statusTone === 'unknown' ? '#b45309' : statusTone === 'success' ? '#15803d' : '#64748b', fontSize: '0.82rem', fontWeight: 800 }}>{status}</div> : null}
      {refreshFailed ? <div role="status" style={{ color: '#b45309', fontSize: '0.82rem' }}>{copy.overviewRefreshFailedLabel}</div> : null}
      {settingsState !== 'ready' ? <div role="status" style={{ color: settingsState === 'error' ? '#dc2626' : '#64748b', fontSize: '0.82rem' }}>{settingsState === 'error' ? copy.settingsLoadFailedLabel : copy.settingsLoadingLabel}</div> : null}

      {activeTab === 'checklist' ? (
        <section style={sectionStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1rem' }}>{copy.checklistTitle}</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.8rem' }}>
                {copy.checklistDescription}
              </p>
            </div>
            <button type="button" style={buttonStyle} disabled={saveDisabled} onClick={saveChecklist}>{copy.saveChecklistLabel}</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) minmax(220px, 1.4fr) 170px', gap: 10 }}>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.businessNameLabel}
              <input value={businessName} onChange={(event) => { if (markEdited('checklist')) setBusinessName(event.target.value); }} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.keywordsLabel}
              <input value={keywords} onChange={(event) => { if (markEdited('checklist')) setKeywords(event.target.value); }} placeholder={copy.keywordsPlaceholder} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.serviceModeLabel}
              <select value={serviceMode} onChange={(event) => { if (markEdited('checklist')) setServiceMode(event.target.value as typeof serviceMode); }} style={inputStyle}>
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
            <button type="button" style={buttonStyle} disabled={saveDisabled || settingsDisabled} onClick={saveDefaults}>{copy.saveDefaultsLabel}</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
              <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.titlePatternLabel}
              <input disabled={settingsDisabled} value={defaults.patterns?.titleTemplate ?? ''} onChange={(event) => updatePattern('titleTemplate', event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.descriptionPatternLabel}
              <textarea disabled={settingsDisabled} value={defaults.patterns?.descriptionTemplate ?? ''} onChange={(event) => updatePattern('descriptionTemplate', event.target.value)} style={{ ...inputStyle, minHeight: 84 }} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.ogTitlePatternLabel}
              <input disabled={settingsDisabled} value={defaults.patterns?.ogTitleTemplate ?? ''} onChange={(event) => updatePattern('ogTitleTemplate', event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.ogDescriptionPatternLabel}
              <input disabled={settingsDisabled} value={defaults.patterns?.ogDescriptionTemplate ?? ''} onChange={(event) => updatePattern('ogDescriptionTemplate', event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: 5, fontSize: '0.78rem', fontWeight: 800 }}>
              {copy.twitterCardLabel}
              <select disabled={settingsDisabled} value={defaults.twitterCard ?? 'summary_large_image'} onChange={(event) => { if (markEdited('defaults')) setDefaults((current) => ({ ...current, twitterCard: event.target.value as BuilderSeoDefaults['twitterCard'] })); }} style={inputStyle}>
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
                <input type="checkbox" checked={resetTitle} onChange={(event) => { if (markEdited('bulk')) setResetTitle(event.target.checked); }} />
                {copy.resetTitleLabel}
              </label>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.78rem', fontWeight: 800 }}>
                <input type="checkbox" checked={resetDescription} onChange={(event) => { if (markEdited('bulk')) setResetDescription(event.target.checked); }} />
                {copy.resetDescriptionLabel}
              </label>
              <button type="button" style={ghostButtonStyle} disabled={saveDisabled} onClick={() => void applyBulk(true)}>{copy.allowIndexingLabel}</button>
              <button type="button" style={ghostButtonStyle} disabled={saveDisabled} onClick={() => void applyBulk(false)}>{copy.blockIndexingLabel}</button>
              <button type="button" style={buttonStyle} disabled={saveDisabled} onClick={() => void applyBulk(undefined)}>{copy.resetSelectedLabel}</button>
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
                      onChange={(event) => { if (markEdited('bulk')) setSelectedPageIds(event.target.checked ? sortedPages.map((page) => page.pageId) : []); }}
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
              <button type="button" style={buttonStyle} disabled={saveDisabled || settingsDisabled} onClick={saveRobots}>{copy.saveRobotsLabel}</button>
            </div>
            <textarea
              aria-label={copy.customRobotsAriaLabel}
              disabled={settingsDisabled}
              value={robotsTxt}
              onChange={(event) => { if (markEdited('robots')) setRobotsTxt(event.target.value); }}
              placeholder={copy.robotsPlaceholder}
              style={{ ...inputStyle, minHeight: 150, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', lineHeight: 1.55 }}
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}
