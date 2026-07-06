'use client';

import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { BuilderCollectionId, BuilderCollectionRecordPreview } from '@/lib/builder/cms';
import type { Locale } from '@/lib/locales';
import {
  buildSourceRecordEndpoint,
  buildSourceRecordPatch,
  createSourceRecordDraft,
  normalizeSlugDraft,
  toEditableSourceCollectionId,
  validateSourceRecordDraft,
  type SourceRecordDraft,
  type SourceRecordPayload,
} from './sourceRecordInlineEditorUtils';
import { SourceRecordAttorneyFields } from './SourceRecordAttorneyFields';
import { SourceRecordServiceFields } from './SourceRecordServiceFields';

type SourceRecordInlineEditorProps = {
  collectionId: BuilderCollectionId;
  locale: Locale;
  record: BuilderCollectionRecordPreview;
  onSaved: () => Promise<void>;
};

const inlineEditorStyle = { background: 'rgba(239, 246, 255, 0.78)', border: '1px solid rgba(17, 109, 255, 0.18)', borderRadius: 8, display: 'grid', gap: 8, marginTop: 10, minWidth: 0, padding: 8 } satisfies CSSProperties;
const labelStyle = { color: '#0f172a', display: 'grid', fontSize: 12, fontWeight: 800, gap: 4, letterSpacing: 0, minWidth: 0 } satisfies CSSProperties;
const inputStyle = { border: '1px solid rgba(148, 163, 184, 0.35)', borderRadius: 8, color: '#0f172a', font: 'inherit', fontSize: 13, minWidth: 0, padding: '8px 10px' } satisfies CSSProperties;
const helperTextStyle = { color: '#64748b', fontSize: 12, fontWeight: 700, letterSpacing: 0, overflowWrap: 'anywhere' } satisfies CSSProperties;
const warningTextStyle = { color: '#b42318', fontSize: 12, fontWeight: 800, letterSpacing: 0, overflowWrap: 'anywhere' } satisfies CSSProperties;

export default function SourceRecordInlineEditor({
  collectionId,
  locale,
  onSaved,
  record,
}: SourceRecordInlineEditorProps) {
  const editableCollectionId = toEditableSourceCollectionId(collectionId);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<SourceRecordDraft>(() => createSourceRecordDraft(record));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validationMessage = useMemo(
    () => validateSourceRecordDraft(editableCollectionId, draft),
    [draft, editableCollectionId],
  );

  if (!editableCollectionId) return null;

  async function saveSourceRecord() {
    if (!editableCollectionId || validationMessage) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(buildSourceRecordEndpoint(editableCollectionId, record.recordId, locale), {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildSourceRecordPatch(editableCollectionId, locale, draft)),
      });
      const payload = await response.json() as SourceRecordPayload;
      if (!response.ok || !payload.ok) {
        const issues = payload.issues?.length ? ` ${payload.issues.join(' ')}` : '';
        throw new Error(`${payload.error ?? 'Failed to save source record.'}${issues}`);
      }
      await onSaved();
      setEditing(false);
      setMessage(payload.slugRedirect?.status === 'created'
        ? 'Source record saved. Redirect created.'
        : 'Source record saved.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to save source record.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div data-cms-source-record-inline={record.recordId}>
      <button
        type="button"
        className="builder-action-btn"
        data-cms-source-record-inline-edit={record.recordId}
        disabled={saving}
        onClick={() => {
          setDraft(createSourceRecordDraft(record));
          setError(null);
          setMessage(null);
          setEditing(true);
        }}
      >
        Inline edit
      </button>
      {editing ? (
        <div style={inlineEditorStyle} data-cms-source-record-inline-editor={record.recordId}>
          <label style={labelStyle}>
            Slug
            <input
              data-cms-source-record-inline-input="slug"
              aria-label="Source record slug"
              style={inputStyle}
              value={draft.slug}
              disabled={saving}
              onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))}
            />
          </label>
          <label style={labelStyle}>
            {editableCollectionId === 'service-areas' ? 'Title' : 'Name'}
            <input
              data-cms-source-record-inline-input="title"
              aria-label="Source record title"
              style={inputStyle}
              value={draft.title}
              disabled={saving}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            />
          </label>
          <label style={labelStyle}>
            {editableCollectionId === 'service-areas' ? 'Subtitle' : 'Role'}
            <textarea
              data-cms-source-record-inline-input="secondary"
              aria-label="Source record secondary label"
              style={{ ...inputStyle, minHeight: 58, resize: 'vertical' }}
              value={draft.secondary}
              disabled={saving}
              onChange={(event) => setDraft((current) => ({ ...current, secondary: event.target.value }))}
            />
          </label>
          {editableCollectionId === 'service-areas' ? (
            <SourceRecordServiceFields
              columnOptions={record.sourceFields?.columnOptions ?? []}
              columnSlugs={draft.columnSlugs}
              disabled={saving}
              intro={draft.intro}
              keyPointsText={draft.keyPointsText}
              onColumnSlugsChange={(columnSlugs) => setDraft((current) => ({ ...current, columnSlugs }))}
              onIntroChange={(intro) => setDraft((current) => ({ ...current, intro }))}
              onKeyPointsTextChange={(keyPointsText) => setDraft((current) => ({ ...current, keyPointsText }))}
            />
          ) : null}
          {editableCollectionId === 'attorney-profiles' ? (
            <SourceRecordAttorneyFields
              disabled={saving}
              draft={draft}
              locale={locale}
              recordId={record.recordId}
              onDraftChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
            />
          ) : null}
          <span style={helperTextStyle} data-cms-source-record-inline-route-preview={record.recordId}>
            Route preview: /{locale}/{editableCollectionId === 'service-areas' ? 'services' : 'lawyers'}/{normalizeSlugDraft(draft.slug) || '{slug}'}
          </span>
          {validationMessage ? (
            <span role="alert" style={warningTextStyle} data-cms-source-record-inline-validation={record.recordId}>
              {validationMessage}
            </span>
          ) : null}
          <div className="builder-dashboard-page-actions">
            <button
              type="button"
              className="builder-action-btn builder-action-btn--primary"
              data-cms-source-record-inline-save={record.recordId}
              disabled={saving || Boolean(validationMessage)}
              onClick={() => {
                void saveSourceRecord();
              }}
            >
              {saving ? 'Saving...' : 'Save source record'}
            </button>
            <button
              type="button"
              className="builder-action-btn"
              disabled={saving}
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      {message ? <span style={helperTextStyle}>{message}</span> : null}
      {error ? <span role="alert" style={warningTextStyle}>{error}</span> : null}
    </div>
  );
}
