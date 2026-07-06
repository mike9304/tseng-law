'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/locales';
import { getTranslationCopy } from './translation-copy';

export interface LocaleMediaEditorRow {
  nodeId: string;
  sourceSrc: string;
  sourceAlt: string;
  initialOverrideSrc?: string;
  initialOverrideAlt?: string;
}

interface Props {
  siteId: string;
  pageId: string;
  sourceLocale: Locale;
  targetLocale: Locale;
  rows: ReadonlyArray<LocaleMediaEditorRow>;
}

interface SaveResponse {
  ok?: boolean;
  error?: string;
  imageOverrides?: { appliedCount: number };
}

type RowState = Record<string, { src: string; alt: string }>;

export default function LocaleMediaEditor({
  siteId,
  pageId,
  sourceLocale,
  targetLocale,
  rows,
}: Props) {
  const copy = getTranslationCopy(sourceLocale);
  const [state, setState] = useState<RowState>(() => {
    const seeded: RowState = {};
    for (const row of rows) {
      seeded[row.nodeId] = {
        src: row.initialOverrideSrc ?? '',
        alt: row.initialOverrideAlt ?? '',
      };
    }
    return seeded;
  });
  const [saving, setSaving] = useState(false);
  const [uploadingNodeId, setUploadingNodeId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  function updateRow(nodeId: string, patch: Partial<{ src: string; alt: string }>) {
    setState((previous) => ({
      ...previous,
      [nodeId]: { ...previous[nodeId], ...patch },
    }));
  }

  async function uploadFor(nodeId: string, file: File) {
    setUploadingNodeId(nodeId);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('locale', targetLocale);
      const response = await fetch('/api/builder/assets', {
        method: 'POST',
        body: form,
      });
      const body = (await response.json().catch(() => null)) as
        | { ok?: boolean; url?: string; error?: string }
        | null;
      if (!response.ok || !body?.ok || typeof body.url !== 'string') {
        setError(body?.error ?? copy.editorUploadFailed);
        return;
      }
      updateRow(nodeId, { src: body.url });
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.editorUploadFailed);
    } finally {
      setUploadingNodeId(null);
    }
  }

  async function saveAll() {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const imageOverrides: Record<string, { src?: string; alt?: string }> = {};
      for (const row of rows) {
        const current = state[row.nodeId];
        if (!current) continue;
        const next: { src?: string; alt?: string } = {};
        if (current.src !== (row.initialOverrideSrc ?? '')) next.src = current.src;
        if (current.alt !== (row.initialOverrideAlt ?? '')) next.alt = current.alt;
        if (Object.keys(next).length > 0) imageOverrides[row.nodeId] = next;
      }
      if (Object.keys(imageOverrides).length === 0) {
        setNotice(copy.editorNothingToSave);
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
          imageOverrides,
        }),
      });
      const body = (await response.json().catch(() => null)) as SaveResponse | null;
      if (!response.ok || !body?.ok) {
        setError(body?.error ?? `${copy.editorSaveFailed} (${response.status})`);
        return;
      }
      const count = body.imageOverrides?.appliedCount ?? 0;
      setNotice(copy.editorSavedImageOverrides(targetLocale, count));
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.editorSaveFailed);
    } finally {
      setSaving(false);
    }
  }

  if (rows.length === 0) {
    return (
      <section style={sectionStyle}>
        <h2 style={sectionHeading}>{copy.editorPerLanguageImages}</h2>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          {copy.editorNoImageNodes}
        </p>
      </section>
    );
  }

  return (
    <section style={sectionStyle} data-locale-media-editor="true">
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <h2 style={{ ...sectionHeading, margin: 0 }}>
            {copy.editorPerLanguageImages} ({rows.length})
          </h2>
        <button
          type="button"
          onClick={saveAll}
          disabled={saving}
          style={btnPrimary}
          data-locale-media-save="true"
        >
          {saving ? copy.editorSavingImageOverrides : copy.editorSaveImageOverrides}
        </button>
        {notice && <span style={{ fontSize: 12, color: '#166534' }}>{notice}</span>}
        {error && <span style={{ fontSize: 12, color: '#991b1b' }}>{error}</span>}
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.map((row) => {
          const current = state[row.nodeId] ?? { src: '', alt: '' };
          const previewSrc = current.src || row.sourceSrc;
          return (
            <div
              key={row.nodeId}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: 12,
                background: '#fff',
                display: 'grid',
                gridTemplateColumns: '160px 1fr',
                gap: 12,
              }}
              data-locale-media-row={row.nodeId}
            >
              <div>
                <div style={labelText}>{copy.editorPreview(targetLocale)}</div>
                {previewSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewSrc}
                    alt={current.alt || row.sourceAlt}
                    style={{
                      width: '100%',
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 6,
                      border: '1px solid #cbd5e1',
                      background: '#f1f5f9',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: 100,
                      background: '#f1f5f9',
                      borderRadius: 6,
                      border: '1px dashed #cbd5e1',
                    }}
                  />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  <code>{row.nodeId}</code>
                </div>
                <label style={labelStyle}>
                  <span style={labelText}>{copy.editorSourceSrc}</span>
                  <input
                    type="text"
                    value={row.sourceSrc}
                    readOnly
                    style={inputReadOnly}
                    data-locale-media-source-src={row.nodeId}
                  />
                </label>
                <label style={labelStyle}>
                    <span style={labelText}>
                      {copy.editorOverrideSrc(targetLocale)}
                    </span>
                  <input
                    type="text"
                    value={current.src}
                    placeholder={row.sourceSrc}
                    onChange={(event) =>
                      updateRow(row.nodeId, { src: event.target.value })
                    }
                    style={inputStyle}
                    data-locale-media-override-src={row.nodeId}
                  />
                </label>
                <label style={labelStyle}>
                  <span style={labelText}>{copy.editorUploadReplacement}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingNodeId === row.nodeId}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadFor(row.nodeId, file);
                      event.target.value = '';
                    }}
                    style={{ fontSize: 12 }}
                  />
                </label>
                <label style={labelStyle}>
                  <span style={labelText}>{copy.editorSourceAlt}</span>
                  <input
                    type="text"
                    value={row.sourceAlt}
                    readOnly
                    style={inputReadOnly}
                    data-locale-media-source-alt={row.nodeId}
                  />
                </label>
                <label style={labelStyle}>
                    <span style={labelText}>
                      {copy.editorOverrideAlt(targetLocale)}
                    </span>
                  <input
                    type="text"
                    value={current.alt}
                    placeholder={row.sourceAlt}
                    onChange={(event) =>
                      updateRow(row.nodeId, { alt: event.target.value })
                    }
                    style={inputStyle}
                    data-locale-media-override-alt={row.nodeId}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const sectionStyle: React.CSSProperties = {
  marginTop: 24,
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: 16,
  background: '#f8fafc',
};

const sectionHeading: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#1f2937',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  margin: '0 0 12px',
};

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
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

const btnPrimary: React.CSSProperties = {
  fontSize: 13,
  padding: '8px 14px',
  borderRadius: 6,
  border: '1px solid #123b63',
  background: '#123b63',
  color: '#fff',
  cursor: 'pointer',
};
