'use client';

import { useMemo, useState } from 'react';
import type {
  BuilderCmsCollectionDetail,
  BuilderCmsCollectionSummary,
  BuilderCmsFieldDefinition,
  BuilderCmsRecord,
  BuilderCmsRecordRevision,
} from '@/lib/builder/cms-types';
import type { BuilderCollectionSummary } from '@/lib/builder/cms';
import type { Locale } from '@/lib/locales';

type ApiCollectionList = {
  ok: boolean;
  collections: BuilderCollectionSummary[];
  editableCollections: BuilderCmsCollectionSummary[];
  error?: string;
};

type ApiCollectionDetail = {
  ok: boolean;
  detail?: BuilderCmsCollectionDetail;
  error?: string;
  issues?: string[];
};

type ApiRecordMutation = {
  ok: boolean;
  record?: BuilderCmsRecord;
  error?: string;
  issues?: string[];
};

type ApiCsvImport = {
  ok: boolean;
  imported?: number;
  error?: string;
  issues?: string[];
};

type ContentManagerClientProps = {
  locale: Locale;
  siteId: string;
  initialSourceCollections: BuilderCollectionSummary[];
  initialEditableCollections: BuilderCmsCollectionSummary[];
};

type RecordFormState = Record<string, string | boolean>;
type RecordSortDirection = 'asc' | 'desc';
type CsvImportMode = 'append' | 'replace';

const panelStyle = {
  display: 'grid',
  gridTemplateColumns: 'minmax(220px, 280px) minmax(0, 1fr)',
  gap: 16,
  alignItems: 'start',
} satisfies React.CSSProperties;

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 12,
} satisfies React.CSSProperties;

const inputStyle = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  padding: '9px 10px',
  fontSize: 13,
  color: '#0f172a',
  background: '#ffffff',
} satisfies React.CSSProperties;

const labelStyle = {
  display: 'grid',
  gap: 6,
  color: '#475569',
  fontSize: 12,
  fontWeight: 700,
} satisfies React.CSSProperties;

export default function ContentManagerClient({
  locale,
  siteId,
  initialSourceCollections,
  initialEditableCollections,
}: ContentManagerClientProps) {
  const [sourceCollections, setSourceCollections] = useState(initialSourceCollections);
  const [collections, setCollections] = useState(initialEditableCollections);
  const [selectedCollectionId, setSelectedCollectionId] = useState(collections[0]?.collectionId ?? '');
  const [detail, setDetail] = useState<BuilderCmsCollectionDetail | null>(null);
  const [recordForm, setRecordForm] = useState<RecordFormState>({});
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [recordQuery, setRecordQuery] = useState('');
  const [recordSortBy, setRecordSortBy] = useState('updatedAt');
  const [recordSortDirection, setRecordSortDirection] = useState<RecordSortDirection>('desc');
  const [csvImportText, setCsvImportText] = useState('');
  const [csvImportMode, setCsvImportMode] = useState<CsvImportMode>('append');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedSummary = useMemo(
    () => collections.find((collection) => collection.collectionId === selectedCollectionId) ?? null,
    [collections, selectedCollectionId],
  );

  const effectiveRecordSortBy = useMemo(() => {
    if (!detail) return recordSortBy;
    const isSystemSort = systemRecordSortOptions.some((option) => option.value === recordSortBy);
    const isFieldSort = detail.fields.some((field) => field.key === recordSortBy);
    return isSystemSort || isFieldSort ? recordSortBy : 'updatedAt';
  }, [detail, recordSortBy]);

  const visibleRecords = useMemo(() => {
    if (!detail) return [];
    return filterAndSortRecords(detail.records, detail.fields, {
      query: recordQuery,
      sortBy: effectiveRecordSortBy,
      sortDirection: recordSortDirection,
    });
  }, [detail, effectiveRecordSortBy, recordQuery, recordSortDirection]);

  async function refreshCollections(nextSelectedId?: string) {
    const response = await fetch(`${apiBase(siteId)}?locale=${locale}`, { credentials: 'same-origin' });
    const payload = await response.json() as ApiCollectionList;
    if (!response.ok || !payload.ok) throw new Error(payload.error ?? 'Failed to refresh collections.');
    setSourceCollections(payload.collections ?? []);
    setCollections(payload.editableCollections ?? []);
    if (nextSelectedId) setSelectedCollectionId(nextSelectedId);
  }

  async function loadDetail(collectionId = selectedCollectionId) {
    if (!collectionId) {
      setDetail(null);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${apiBase(siteId)}/${encodeURIComponent(collectionId)}?locale=${locale}`, {
        credentials: 'same-origin',
      });
      const payload = await response.json() as ApiCollectionDetail;
      if (!response.ok || !payload.ok || !payload.detail) {
        throw new Error(payload.error ?? 'Failed to load collection.');
      }
      setDetail(payload.detail);
      setRecordForm(createEmptyRecordForm(payload.detail.fields));
      setEditingRecordId(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load collection.');
    } finally {
      setBusy(false);
    }
  }

  async function createCollection(formData: FormData) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        name: String(formData.get('name') ?? ''),
        collectionId: String(formData.get('collectionId') ?? ''),
        description: String(formData.get('description') ?? ''),
        localized: formData.get('localized') === 'on',
      };
      const response = await fetch(`${apiBase(siteId)}?locale=${locale}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as ApiCollectionDetail;
      if (!response.ok || !result.ok || !result.detail) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to create collection.');
      }
      await refreshCollections(result.detail.collectionId);
      setDetail(result.detail);
      setRecordForm(createEmptyRecordForm(result.detail.fields));
      setMessage(`Created ${result.detail.name}.`);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create collection.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteCollection(collectionId: string) {
    if (!collectionId || !window.confirm(`Delete ${collectionId}?`)) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`${apiBase(siteId)}/${encodeURIComponent(collectionId)}?locale=${locale}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const result = await response.json() as ApiCollectionDetail;
      if (!response.ok || !result.ok) throw new Error(result.error ?? 'Failed to delete collection.');
      await refreshCollections();
      setSelectedCollectionId('');
      setDetail(null);
      setMessage(`Deleted ${collectionId}.`);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete collection.');
    } finally {
      setBusy(false);
    }
  }

  async function saveRecord() {
    if (!detail) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const endpoint = editingRecordId
        ? `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/${encodeURIComponent(editingRecordId)}?locale=${locale}`
        : `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records?locale=${locale}`;
      const response = await fetch(endpoint, {
        method: editingRecordId ? 'PATCH' : 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: recordForm }),
      });
      const result = await response.json() as {
        ok: boolean;
        record?: BuilderCmsRecord;
        error?: string;
        issues?: string[];
      };
      if (!response.ok || !result.ok || !result.record) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to save record.');
      }
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      setMessage(editingRecordId ? 'Record updated.' : 'Record created.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save record.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteRecord(recordId: string) {
    if (!detail || !window.confirm(`Delete ${recordId}?`)) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/${encodeURIComponent(recordId)}?locale=${locale}`,
        { method: 'DELETE', credentials: 'same-origin' },
      );
      const result = await response.json() as { ok: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? 'Failed to delete record.');
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      setMessage('Record deleted.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete record.');
    } finally {
      setBusy(false);
    }
  }

  async function duplicateRecord(recordId: string) {
    if (!detail) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/${encodeURIComponent(recordId)}/duplicate?locale=${locale}`,
        { method: 'POST', credentials: 'same-origin' },
      );
      const result = await response.json() as ApiRecordMutation;
      if (!response.ok || !result.ok || !result.record) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to duplicate record.');
      }
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      setMessage('Record duplicated.');
    } catch (duplicateError) {
      setError(duplicateError instanceof Error ? duplicateError.message : 'Failed to duplicate record.');
    } finally {
      setBusy(false);
    }
  }

  async function exportCsv() {
    if (!detail) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/csv?locale=${locale}`,
        { credentials: 'same-origin' },
      );
      if (!response.ok) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error ?? 'Failed to export CSV.');
      }
      const csv = await response.text();
      const filename = filenameFromContentDisposition(response.headers.get('content-disposition'))
        ?? `${detail.slug || detail.collectionId}-records.csv`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
      setMessage('CSV exported.');
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Failed to export CSV.');
    } finally {
      setBusy(false);
    }
  }

  async function importCsv() {
    if (!detail) return;
    if (!csvImportText.trim()) {
      setError('CSV text is required.');
      return;
    }
    if (csvImportMode === 'replace' && !window.confirm(`Replace all records in ${detail.collectionId}?`)) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/csv?locale=${locale}`,
        {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csv: csvImportText, mode: csvImportMode }),
        },
      );
      const result = await response.json() as ApiCsvImport;
      if (!response.ok || !result.ok) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to import CSV.');
      }
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      setCsvImportText('');
      setMessage(`Imported ${result.imported ?? 0} records.`);
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'Failed to import CSV.');
    } finally {
      setBusy(false);
    }
  }

  async function restoreRevision(recordId: string, revisionId: string) {
    if (!detail || !window.confirm(`Restore revision ${revisionId}?`)) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `${apiBase(siteId)}/${encodeURIComponent(detail.collectionId)}/records/${encodeURIComponent(recordId)}/revisions/${encodeURIComponent(revisionId)}/restore?locale=${locale}`,
        { method: 'POST', credentials: 'same-origin' },
      );
      const result = await response.json() as ApiRecordMutation;
      if (!response.ok || !result.ok || !result.record) {
        throw new Error(result.issues?.join('\n') || result.error || 'Failed to restore revision.');
      }
      await loadDetail(detail.collectionId);
      await refreshCollections(detail.collectionId);
      setMessage('Revision restored.');
    } catch (restoreError) {
      setError(restoreError instanceof Error ? restoreError.message : 'Failed to restore revision.');
    } finally {
      setBusy(false);
    }
  }

  function beginEditRecord(record: BuilderCmsRecord) {
    if (!detail) return;
    setEditingRecordId(record.recordId);
    setRecordForm(createRecordFormFromRecord(detail.fields, record));
  }

  return (
    <div style={panelStyle}>
      <section className="builder-preview-inspector-card builder-dashboard-sidebar">
        <h2>CMS</h2>
        <div className="builder-dashboard-nav-list">
          {collections.map((collection) => (
            <button
              key={collection.collectionId}
              type="button"
              className={`builder-dashboard-nav-card${collection.collectionId === selectedCollectionId ? ' is-active' : ''}`}
              style={{ textAlign: 'left' }}
              onClick={() => {
                setSelectedCollectionId(collection.collectionId);
                void loadDetail(collection.collectionId);
              }}
            >
              <strong>{collection.name}</strong>
              <span>{collection.recordCount} records</span>
              <small>{collection.collectionId}</small>
            </button>
          ))}
          {collections.length === 0 ? (
            <article className="builder-dashboard-nav-card">
              <strong>No editable CMS collections</strong>
              <span>Create one below</span>
            </article>
          ) : null}
        </div>
      </section>

      <div className="builder-dashboard-grid">
        <section className="builder-preview-inspector-card">
          <h2>New collection</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void createCollection(new FormData(event.currentTarget));
            }}
            style={{ display: 'grid', gap: 14 }}
          >
            <div style={formGridStyle}>
              <label style={labelStyle}>
                Name
                <input name="name" type="text" style={inputStyle} placeholder="Testimonials" disabled={busy} />
              </label>
              <label style={labelStyle}>
                ID
                <input name="collectionId" type="text" style={inputStyle} placeholder="testimonials" disabled={busy} />
              </label>
              <label style={labelStyle}>
                Description
                <input name="description" type="text" style={inputStyle} placeholder="Client quotes" disabled={busy} />
              </label>
              <label style={{ ...labelStyle, alignContent: 'end' }}>
                <span>Localized</span>
                <input name="localized" type="checkbox" disabled={busy} />
              </label>
            </div>
            <div className="builder-dashboard-page-actions">
              <button type="submit" className="builder-action-btn builder-action-btn--primary" disabled={busy}>
                Create collection
              </button>
            </div>
          </form>
        </section>

        {message ? (
          <section className="builder-preview-inspector-card" aria-live="polite">
            <h2>Status</h2>
            <p>{message}</p>
          </section>
        ) : null}

        {error ? (
          <section className="builder-preview-inspector-card" aria-live="assertive">
            <h2>Error</h2>
            <p style={{ whiteSpace: 'pre-line', color: '#b91c1c' }}>{error}</p>
          </section>
        ) : null}

        <section className="builder-preview-inspector-card">
          <h2>Static source collections</h2>
          <div className="builder-dashboard-page-list">
            {sourceCollections.map((collection) => (
              <article key={collection.id} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{collection.title}</strong>
                    <span>{collection.sourceLabel}</span>
                  </div>
                  <span className="builder-stage-pill">read-only</span>
                </div>
                <div className="builder-dashboard-page-meta">
                  <span>{collection.recordCount} records</span>
                  <span>{collection.fieldCount} fields</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {selectedSummary && !detail ? (
          <section className="builder-preview-inspector-card">
            <h2>{selectedSummary.name}</h2>
            <div className="builder-dashboard-page-actions">
              <button
                type="button"
                className="builder-action-btn builder-action-btn--primary"
                onClick={() => void loadDetail(selectedSummary.collectionId)}
                disabled={busy}
              >
                Open collection
              </button>
              <button
                type="button"
                className="builder-action-btn"
                onClick={() => void deleteCollection(selectedSummary.collectionId)}
                disabled={busy}
              >
                Delete
              </button>
            </div>
          </section>
        ) : null}

        {detail ? (
          <>
            <section className="builder-preview-inspector-card">
              <h2>{detail.name}</h2>
              <div className="builder-dashboard-kpi-grid">
                <article className="builder-dashboard-kpi-card">
                  <strong>{detail.records.length}</strong>
                  <span>Records</span>
                </article>
                <article className="builder-dashboard-kpi-card">
                  <strong>{detail.fields.length}</strong>
                  <span>Fields</span>
                </article>
                <article className="builder-dashboard-kpi-card">
                  <strong>{detail.localized ? 'Locale' : 'Shared'}</strong>
                  <span>Mode</span>
                </article>
              </div>
              <div className="builder-dashboard-page-actions">
                <button
                  type="button"
                  className="builder-action-btn"
                  onClick={() => void deleteCollection(detail.collectionId)}
                  disabled={busy}
                >
                  Delete collection
                </button>
              </div>
            </section>

            <section className="builder-preview-inspector-card">
              <h2>Schema</h2>
              <div className="builder-dashboard-page-list">
                {detail.fields.map((field) => (
                  <article key={field.fieldId} className="builder-dashboard-page-card">
                    <div className="builder-dashboard-page-head">
                      <div>
                        <strong>{field.label}</strong>
                        <span>{field.key}</span>
                      </div>
                      <span className="builder-stage-pill">{field.type}</span>
                    </div>
                    <div className="builder-dashboard-page-meta">
                      <span>{field.required ? 'Required' : 'Optional'}</span>
                      <span>{field.unique ? 'Unique' : 'Not unique'}</span>
                      <span>{field.localized ? 'Localized' : 'Shared'}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="builder-preview-inspector-card">
              <h2>{editingRecordId ? `Edit ${editingRecordId}` : 'New record'}</h2>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={formGridStyle}>
                  {detail.fields.map((field) => (
                    <CmsFieldInput
                      key={field.fieldId}
                      field={field}
                      value={recordForm[field.key]}
                      disabled={busy}
                      onChange={(value) => setRecordForm((current) => ({ ...current, [field.key]: value }))}
                    />
                  ))}
                </div>
                <div className="builder-dashboard-page-actions">
                  <button
                    type="button"
                    className="builder-action-btn builder-action-btn--primary"
                    onClick={() => void saveRecord()}
                    disabled={busy}
                  >
                    {editingRecordId ? 'Save record' : 'Create record'}
                  </button>
                  {editingRecordId ? (
                    <button
                      type="button"
                      className="builder-action-btn"
                      onClick={() => {
                        setEditingRecordId(null);
                        setRecordForm(createEmptyRecordForm(detail.fields));
                      }}
                      disabled={busy}
                    >
                      Cancel edit
                    </button>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="builder-preview-inspector-card">
              <h2>Records</h2>
              <div style={{ ...formGridStyle, marginBottom: 12 }}>
                <label style={labelStyle}>
                  Search
                  <input
                    type="search"
                    style={inputStyle}
                    value={recordQuery}
                    placeholder="Record ID, status, value"
                    disabled={busy}
                    onChange={(event) => setRecordQuery(event.target.value)}
                  />
                </label>
                <label style={labelStyle}>
                  Sort by
                  <select
                    style={inputStyle}
                    value={effectiveRecordSortBy}
                    disabled={busy}
                    onChange={(event) => setRecordSortBy(event.target.value)}
                  >
                    <optgroup label="Record">
                      {systemRecordSortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Fields">
                      {detail.fields.map((field) => (
                        <option key={field.fieldId} value={field.key}>
                          {field.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </label>
                <label style={labelStyle}>
                  Direction
                  <select
                    style={inputStyle}
                    value={recordSortDirection}
                    disabled={busy}
                    onChange={(event) => setRecordSortDirection(event.target.value === 'asc' ? 'asc' : 'desc')}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </label>
              </div>
              <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
                <label style={labelStyle}>
                  CSV
                  <textarea
                    style={{ ...inputStyle, minHeight: 92, resize: 'vertical', fontFamily: 'monospace' }}
                    value={csvImportText}
                    placeholder="recordId,status,locale,title,slug"
                    disabled={busy}
                    onChange={(event) => setCsvImportText(event.target.value)}
                  />
                </label>
                <div className="builder-dashboard-page-actions">
                  <select
                    aria-label="CSV import mode"
                    style={{ ...inputStyle, width: 140 }}
                    value={csvImportMode}
                    disabled={busy}
                    onChange={(event) => setCsvImportMode(event.target.value === 'replace' ? 'replace' : 'append')}
                  >
                    <option value="append">Append</option>
                    <option value="replace">Replace</option>
                  </select>
                  <button
                    type="button"
                    className="builder-action-btn builder-action-btn--primary"
                    onClick={() => void importCsv()}
                    disabled={busy || !csvImportText.trim()}
                  >
                    Import CSV
                  </button>
                  <button
                    type="button"
                    className="builder-action-btn"
                    onClick={() => void exportCsv()}
                    disabled={busy}
                  >
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="builder-dashboard-page-list">
                {visibleRecords.map((record) => (
                  <article key={record.recordId} className="builder-dashboard-page-card">
                    <div className="builder-dashboard-page-head">
                      <div>
                        <strong>{record.fields.title ? String(record.fields.title) : record.recordId}</strong>
                        <span>{record.recordId}</span>
                      </div>
                      <span className="builder-stage-pill">{record.status}</span>
                    </div>
                    <div className="builder-dashboard-page-meta">
                      {detail.fields.slice(0, 4).map((field) => (
                        <span key={field.fieldId}>
                          {field.label}: {formatValue(record.fields[field.key])}
                        </span>
                      ))}
                      <span>{record.revisions?.length ?? 0} revisions</span>
                    </div>
                    <div className="builder-dashboard-page-actions">
                      <button
                        type="button"
                        className="builder-action-btn builder-action-btn--primary"
                        onClick={() => beginEditRecord(record)}
                        disabled={busy}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => void duplicateRecord(record.recordId)}
                        disabled={busy}
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        className="builder-action-btn"
                        onClick={() => void deleteRecord(record.recordId)}
                        disabled={busy}
                      >
                        Delete
                      </button>
                    </div>
                    {record.revisions?.length ? (
                      <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
                        {latestRevisions(record.revisions).map((revision) => (
                          <div
                            key={revision.revisionId}
                            style={{ borderTop: '1px solid #e2e8f0', display: 'grid', gap: 8, paddingTop: 10 }}
                          >
                            <div className="builder-dashboard-page-head">
                              <div>
                                <strong>{revision.action === 'restore' ? 'Restore snapshot' : 'Update snapshot'}</strong>
                                <span>{formatDateTime(revision.createdAt)} by {revision.authorLabel}</span>
                              </div>
                              <span className="builder-stage-pill">{revision.status}</span>
                            </div>
                            <div className="builder-dashboard-page-meta">
                              {detail.fields.slice(0, 3).map((field) => (
                                <span key={field.fieldId}>
                                  {field.label}: {formatValue(revision.fields[field.key])}
                                </span>
                              ))}
                            </div>
                            <div className="builder-dashboard-page-actions">
                              <button
                                type="button"
                                className="builder-action-btn"
                                onClick={() => void restoreRevision(record.recordId, revision.revisionId)}
                                disabled={busy}
                              >
                                Restore
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
                {detail.records.length === 0 ? (
                  <article className="builder-dashboard-page-card">
                    <div className="builder-dashboard-page-head">
                      <div>
                        <strong>No records</strong>
                        <span>{detail.collectionId}</span>
                      </div>
                    </div>
                  </article>
                ) : null}
                {detail.records.length > 0 && visibleRecords.length === 0 ? (
                  <article className="builder-dashboard-page-card">
                    <div className="builder-dashboard-page-head">
                      <div>
                        <strong>No matching records</strong>
                        <span>{detail.collectionId}</span>
                      </div>
                    </div>
                  </article>
                ) : null}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}

function CmsFieldInput({
  field,
  value,
  disabled,
  onChange,
}: {
  field: BuilderCmsFieldDefinition;
  value: string | boolean | undefined;
  disabled: boolean;
  onChange: (value: string | boolean) => void;
}) {
  if (field.type === 'boolean') {
    return (
      <label style={labelStyle}>
        {field.label}
        <select
          style={inputStyle}
          value={value === true ? 'true' : value === false ? 'false' : ''}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value === 'true')}
        >
          <option value="">Select</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </label>
    );
  }

  if (field.repeated || field.type === 'string-list') {
    return (
      <label style={labelStyle}>
        {field.label}
        <textarea
          style={{ ...inputStyle, minHeight: 82, resize: 'vertical' }}
          value={typeof value === 'string' ? value : ''}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    );
  }

  const inputType = field.type === 'number'
    ? 'number'
    : field.type === 'date'
      ? 'date'
      : field.type === 'email'
        ? 'email'
        : field.type === 'url'
          ? 'url'
          : 'text';

  return (
    <label style={labelStyle}>
      {field.label}
      <input
        type={inputType}
        style={inputStyle}
        value={typeof value === 'string' ? value : ''}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function apiBase(siteId: string) {
  return `/api/builder/sites/${encodeURIComponent(siteId)}/collections`;
}

function filenameFromContentDisposition(header: string | null): string | null {
  const match = header?.match(/filename="([^"]+)"/);
  return match?.[1] ?? null;
}

function latestRevisions(revisions: BuilderCmsRecordRevision[]): BuilderCmsRecordRevision[] {
  return [...revisions]
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .slice(0, 3);
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

const systemRecordSortOptions = [
  { value: 'updatedAt', label: 'Updated' },
  { value: 'createdAt', label: 'Created' },
  { value: 'recordId', label: 'Record ID' },
  { value: 'status', label: 'Status' },
];

function createEmptyRecordForm(fields: BuilderCmsFieldDefinition[]): RecordFormState {
  return Object.fromEntries(fields.map((field) => [field.key, '']));
}

function createRecordFormFromRecord(
  fields: BuilderCmsFieldDefinition[],
  record: BuilderCmsRecord,
): RecordFormState {
  return Object.fromEntries(fields.map((field) => {
    const value = record.fields[field.key];
    if (Array.isArray(value)) return [field.key, value.join('\n')];
    if (typeof value === 'boolean') return [field.key, value];
    return [field.key, value === undefined || value === null ? '' : String(value)];
  }));
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value === undefined || value === null || value === '') return '-';
  return String(value);
}

function filterAndSortRecords(
  records: BuilderCmsRecord[],
  fields: BuilderCmsFieldDefinition[],
  options: { query: string; sortBy: string; sortDirection: RecordSortDirection },
): BuilderCmsRecord[] {
  const query = options.query.trim().toLowerCase();
  const filtered = query
    ? records.filter((record) => {
        const searchable = [
          record.recordId,
          record.status,
          record.locale ?? '',
          ...fields.map((field) => formatValue(record.fields[field.key])),
        ].join(' ').toLowerCase();
        return searchable.includes(query);
      })
    : records;

  const direction = options.sortDirection === 'asc' ? 1 : -1;
  return [...filtered].sort((left, right) => (
    compareRecordValues(sortRecordValue(left, options.sortBy), sortRecordValue(right, options.sortBy)) * direction
  ));
}

function sortRecordValue(record: BuilderCmsRecord, sortBy: string): unknown {
  if (sortBy === 'recordId') return record.recordId;
  if (sortBy === 'status') return record.status;
  if (sortBy === 'createdAt') return record.createdAt;
  if (sortBy === 'updatedAt') return record.updatedAt;
  return record.fields[sortBy];
}

function compareRecordValues(left: unknown, right: unknown): number {
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return formatValue(left).localeCompare(formatValue(right), 'en', {
    numeric: true,
    sensitivity: 'base',
  });
}
