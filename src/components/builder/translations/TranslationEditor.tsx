'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { AutoTranslateSourceNode } from '@/lib/builder/translations/auto-translate';
import type { ProjectedSeoValue } from '@/lib/builder/translations/seo-projection';

interface Props {
  siteId: string;
  pageId: string;
  sourceLocale: Locale;
  targetLocale: Locale;
  sources: AutoTranslateSourceNode[];
  initialTargetValues: Record<string, string>;
  targetPageReady: boolean;
  initialSourceSeo: ProjectedSeoValue;
  initialTargetSeo: ProjectedSeoValue;
}

interface SaveResponse {
  ok?: boolean;
  error?: string;
  nodeUpdates?: { appliedCount: number; skipped: Array<{ nodeId: string; reason: string }> };
}

interface AutoTranslateResponse {
  ok?: boolean;
  proposals?: Array<{ nodeId: string; text: string }>;
  errors?: Array<{ nodeId: string; error: string }>;
  error?: string;
}

export default function TranslationEditor({
  siteId,
  pageId,
  sourceLocale,
  targetLocale,
  sources,
  initialTargetValues,
  targetPageReady,
  initialSourceSeo,
  initialTargetSeo,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const seeded: Record<string, string> = {};
    for (const source of sources) {
      seeded[source.nodeId] = initialTargetValues[source.nodeId] ?? '';
    }
    return seeded;
  });
  const [seo, setSeo] = useState<ProjectedSeoValue>(initialTargetSeo);
  const [saving, setSaving] = useState(false);
  const [autoBusy, setAutoBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  function updateValue(nodeId: string, next: string) {
    setValues((previous) => ({ ...previous, [nodeId]: next }));
  }

  async function saveAll() {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const nodeUpdates: Record<string, { text: string }> = {};
      for (const source of sources) {
        const candidate = values[source.nodeId] ?? '';
        // Only send entries the user actually filled in.
        if (candidate.length === 0) continue;
        if (candidate === initialTargetValues[source.nodeId]) continue;
        nodeUpdates[source.nodeId] = { text: candidate };
      }
      const seoOverride: Record<string, string> = {};
      if ((seo.title ?? '') !== (initialTargetSeo.title ?? '')) {
        seoOverride.title = seo.title ?? '';
      }
      if ((seo.description ?? '') !== (initialTargetSeo.description ?? '')) {
        seoOverride.description = seo.description ?? '';
      }
      if ((seo.ogImage ?? '') !== (initialTargetSeo.ogImage ?? '')) {
        seoOverride.ogImage = seo.ogImage ?? '';
      }

      const hasNodeUpdates = Object.keys(nodeUpdates).length > 0;
      const hasSeoUpdates = Object.keys(seoOverride).length > 0;
      if (!hasNodeUpdates && !hasSeoUpdates) {
        setNotice('Nothing to save.');
        setSaving(false);
        return;
      }

      const response = await fetch('/api/builder/translations/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          pageId,
          sourceLocale,
          targetLocale,
          nodeUpdates: hasNodeUpdates ? nodeUpdates : undefined,
          seoOverride: hasSeoUpdates ? seoOverride : undefined,
        }),
      });
      const body = (await response.json().catch(() => null)) as SaveResponse | null;
      if (!response.ok || !body?.ok) {
        setError(body?.error ?? `save failed (${response.status})`);
      } else {
        const applied = body.nodeUpdates?.appliedCount ?? 0;
        setNotice(`Saved (${applied} nodes).`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'save failed');
    } finally {
      setSaving(false);
    }
  }

  async function runAutoTranslate() {
    setAutoBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/builder/translations/auto-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, pageId, sourceLocale, targetLocale }),
      });
      const body = (await response.json().catch(() => null)) as AutoTranslateResponse | null;
      if (!response.ok) {
        setError(body?.error ?? `auto-translate failed (${response.status})`);
        return;
      }
      const proposals = body?.proposals ?? [];
      setValues((previous) => {
        const next = { ...previous };
        for (const proposal of proposals) next[proposal.nodeId] = proposal.text;
        return next;
      });
      const errorsCount = body?.errors?.length ?? 0;
      setNotice(
        errorsCount > 0
          ? `Filled ${proposals.length} fields (${errorsCount} failed — review).`
          : `Filled ${proposals.length} fields. Review and save.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'auto-translate failed');
    } finally {
      setAutoBusy(false);
    }
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={runAutoTranslate}
          disabled={autoBusy || sources.length === 0}
          style={btnSecondary}
        >
          {autoBusy ? 'Translating…' : 'Auto-translate page'}
        </button>
        <button
          type="button"
          onClick={saveAll}
          disabled={saving}
          style={btnPrimary}
        >
          {saving ? 'Saving…' : 'Save translation'}
        </button>
        {!targetPageReady && (
          <span style={{ fontSize: 12, color: '#9a3412' }}>
            Target page does not exist — node saves will be skipped until a{' '}
            <code>{targetLocale}</code> page is created.
          </span>
        )}
        {notice && (
          <span style={{ fontSize: 12, color: '#166534' }}>{notice}</span>
        )}
        {error && (
          <span style={{ fontSize: 12, color: '#991b1b' }}>{error}</span>
        )}
      </div>

      <section
        style={{
          marginBottom: 24,
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 16,
          background: '#f8fafc',
        }}
      >
        <h2 style={sectionHeading}>SEO ({targetLocale})</h2>
        <div style={twoCol}>
          <div>
            <label style={labelStyle}>
              <span style={labelText}>Title (source — {sourceLocale})</span>
              <input
                type="text"
                value={initialSourceSeo.title ?? ''}
                readOnly
                style={inputReadOnly}
              />
            </label>
            <label style={labelStyle}>
              <span style={labelText}>Description (source)</span>
              <textarea
                value={initialSourceSeo.description ?? ''}
                readOnly
                rows={3}
                style={inputReadOnly}
              />
            </label>
            <label style={labelStyle}>
              <span style={labelText}>OG image (source)</span>
              <input
                type="text"
                value={initialSourceSeo.ogImage ?? ''}
                readOnly
                style={inputReadOnly}
              />
            </label>
          </div>
          <div>
            <label style={labelStyle}>
              <span style={labelText}>Title (override — {targetLocale})</span>
              <input
                type="text"
                value={seo.title ?? ''}
                placeholder={initialSourceSeo.title ?? ''}
                onChange={(event) =>
                  setSeo((previous) => ({ ...previous, title: event.target.value }))
                }
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              <span style={labelText}>Description (override)</span>
              <textarea
                value={seo.description ?? ''}
                placeholder={initialSourceSeo.description ?? ''}
                rows={3}
                onChange={(event) =>
                  setSeo((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              <span style={labelText}>OG image (override)</span>
              <input
                type="text"
                value={seo.ogImage ?? ''}
                placeholder={initialSourceSeo.ogImage ?? ''}
                onChange={(event) =>
                  setSeo((previous) => ({
                    ...previous,
                    ogImage: event.target.value,
                  }))
                }
                style={inputStyle}
              />
            </label>
          </div>
        </div>
      </section>

      <section>
        <h2 style={sectionHeading}>
          Page text ({sources.length} translatable nodes)
        </h2>
        {sources.length === 0 ? (
          <p style={{ fontSize: 13, color: '#64748b' }}>
            No translatable text nodes were found in this page&apos;s draft canvas.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sources.map((source) => (
              <div
                key={source.nodeId}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: 12,
                  background: '#fff',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: '#64748b',
                    marginBottom: 6,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <code>{source.nodeId}</code>
                  <span>{source.elementHint}</span>
                </div>
                <div style={twoCol}>
                  <div>
                    <span style={labelText}>Source ({sourceLocale})</span>
                    <div style={readOnlyBlock}>{source.text}</div>
                  </div>
                  <div>
                    <span style={labelText}>Target ({targetLocale})</span>
                    <textarea
                      value={values[source.nodeId] ?? ''}
                      onChange={(event) =>
                        updateValue(source.nodeId, event.target.value)
                      }
                      rows={Math.min(6, Math.max(2, Math.ceil(source.text.length / 60)))}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const sectionHeading: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#1f2937',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  margin: '0 0 12px',
};

const twoCol: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16,
};

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  marginBottom: 10,
};

const labelText: React.CSSProperties = {
  fontSize: 11,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  padding: '8px 10px',
  fontSize: 13,
  fontFamily: 'inherit',
  background: '#fff',
};

const inputReadOnly: React.CSSProperties = {
  ...inputStyle,
  background: '#f1f5f9',
  color: '#475569',
};

const readOnlyBlock: React.CSSProperties = {
  fontSize: 13,
  color: '#1f2937',
  background: '#f1f5f9',
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  padding: '8px 10px',
  whiteSpace: 'pre-wrap',
  minHeight: 36,
};

const btnPrimary: React.CSSProperties = {
  fontSize: 13,
  padding: '8px 14px',
  borderRadius: 6,
  border: '1px solid #123b63',
  background: '#123b63',
  color: '#fff',
  cursor: 'pointer',
};

const btnSecondary: React.CSSProperties = {
  fontSize: 13,
  padding: '8px 14px',
  borderRadius: 6,
  border: '1px solid #cbd5e1',
  background: '#fff',
  color: '#1f2937',
  cursor: 'pointer',
};