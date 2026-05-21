'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  BuilderDynamicTemplateDraftReadResult,
  BuilderDynamicTemplateDraftSnapshot,
  BuilderDynamicTemplateDraftState,
} from '@/lib/builder/dynamic-template-drafts';
import type { BuilderDynamicTemplateDetail } from '@/lib/builder/dynamic-templates';
import type { Locale } from '@/lib/locales';

export default function BuilderDynamicTemplateEditorSurface({
  detail,
  draft,
  published,
  locale,
  initialPreviewRecordId,
}: {
  detail: BuilderDynamicTemplateDetail;
  draft: BuilderDynamicTemplateDraftReadResult;
  published: BuilderDynamicTemplateDraftReadResult;
  locale: Locale;
  initialPreviewRecordId?: string | null;
}) {
  const initialDraftState = draft.snapshot.state;
  const initialSelectedRecordId = resolveInitialPreviewRecordId(
    detail,
    initialDraftState.selectedRecordId,
    initialPreviewRecordId
  );
  const [visibleBlockIds, setVisibleBlockIds] = useState(
    () => new Set(initialDraftState.visibleBlockIds)
  );
  const [selectedRecordId, setSelectedRecordId] = useState(() => initialSelectedRecordId);
  const [draftMeta, setDraftMeta] = useState(() => ({
    persisted: draft.persisted,
    revision: draft.snapshot.revision,
    savedAt: draft.snapshot.savedAt,
    updatedBy: draft.snapshot.updatedBy,
  }));
  const [publishedMeta, setPublishedMeta] = useState(() => ({
    persisted: published.persisted,
    revision: published.snapshot.revision,
    savedAt: published.snapshot.savedAt,
    updatedBy: published.snapshot.updatedBy,
  }));
  const [savedSignature, setSavedSignature] = useState(() => serializeDraftState(initialDraftState));
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'published' | 'error'>('idle');
  const [publishError, setPublishError] = useState<string | null>(null);
  const requestedPreviewRecordId = initialPreviewRecordId?.trim() || null;
  const requestedPreviewRecordMissing = Boolean(
    requestedPreviewRecordId &&
      !detail.previewRecords.some((record) => record.recordId === requestedPreviewRecordId)
  );

  useEffect(() => {
    setVisibleBlockIds(new Set(draft.snapshot.state.visibleBlockIds));
    setSelectedRecordId(initialSelectedRecordId);
    setDraftMeta({
      persisted: draft.persisted,
      revision: draft.snapshot.revision,
      savedAt: draft.snapshot.savedAt,
      updatedBy: draft.snapshot.updatedBy,
    });
    setPublishedMeta({
      persisted: published.persisted,
      revision: published.snapshot.revision,
      savedAt: published.snapshot.savedAt,
      updatedBy: published.snapshot.updatedBy,
    });
    setSavedSignature(serializeDraftState(draft.snapshot.state));
    setSaveStatus('idle');
    setSaveError(null);
    setPublishStatus('idle');
    setPublishError(null);
  }, [
    detail.templateId,
    draft.persisted,
    draft.snapshot.revision,
    draft.snapshot.savedAt,
    draft.snapshot.state,
    draft.snapshot.updatedBy,
    initialSelectedRecordId,
    locale,
    published.persisted,
    published.snapshot.revision,
    published.snapshot.savedAt,
    published.snapshot.updatedBy,
  ]);

  const selectedRecord =
    detail.previewRecords.find((record) => record.recordId === selectedRecordId) ??
    detail.previewRecords[0] ??
    null;
  const currentDraftState = useMemo<BuilderDynamicTemplateDraftState>(
    () => ({
      version: 1,
      visibleBlockIds: detail.editableBlocks
        .filter((block) => visibleBlockIds.has(block.blockId))
        .map((block) => block.blockId),
      selectedRecordId: selectedRecord?.recordId ?? null,
    }),
    [detail.editableBlocks, selectedRecord, visibleBlockIds]
  );
  const currentSignature = useMemo(
    () => serializeDraftState(currentDraftState),
    [currentDraftState]
  );
  const draftChanged = currentSignature !== savedSignature;
  const canSave = saveStatus !== 'saving' && (!draftMeta.persisted || draftChanged);
  const canPublish =
    draftMeta.persisted &&
    !draftChanged &&
    saveStatus !== 'saving' &&
    publishStatus !== 'publishing';

  async function handleSaveDraft() {
    if (!canSave) return;

    setSaveStatus('saving');
    setSaveError(null);

    try {
      const response = await fetch(
        `/api/builder/sites/default/dynamic-templates/${encodeURIComponent(
          detail.templateId
        )}?locale=${encodeURIComponent(locale)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            state: currentDraftState,
            updatedBy: 'builder-dynamic-template-editor',
          }),
        }
      );
      const payload = (await response.json().catch(() => null)) as DynamicTemplateDraftSaveResponse | null;

      if (!response.ok || !payload?.ok || !payload.draft?.snapshot) {
        throw new Error(payload?.error ?? 'Failed to save dynamic template draft.');
      }

      const nextSnapshot = payload.draft.snapshot;
      setVisibleBlockIds(new Set(nextSnapshot.state.visibleBlockIds));
      setSelectedRecordId(nextSnapshot.state.selectedRecordId ?? '');
      setDraftMeta({
        persisted: true,
        revision: nextSnapshot.revision,
        savedAt: nextSnapshot.savedAt,
        updatedBy: nextSnapshot.updatedBy,
      });
      setSavedSignature(serializeDraftState(nextSnapshot.state));
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
      setSaveError(error instanceof Error ? error.message : 'Failed to save dynamic template draft.');
    }
  }

  async function handlePublishTemplate() {
    if (!canPublish) return;

    setPublishStatus('publishing');
    setPublishError(null);

    try {
      const response = await fetch(
        `/api/builder/sites/default/dynamic-templates/${encodeURIComponent(
          detail.templateId
        )}/publish?locale=${encodeURIComponent(locale)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ updatedBy: 'builder-dynamic-template-editor' }),
        }
      );
      const payload = (await response.json().catch(() => null)) as DynamicTemplatePublishResponse | null;

      if (!response.ok || !payload?.ok || !payload.published?.snapshot) {
        throw new Error(payload?.error ?? 'Failed to publish dynamic template draft.');
      }

      const nextPublished = payload.published.snapshot;
      setPublishedMeta({
        persisted: true,
        revision: nextPublished.revision,
        savedAt: nextPublished.savedAt,
        updatedBy: nextPublished.updatedBy,
      });
      setPublishStatus('published');
    } catch (error) {
      setPublishStatus('error');
      setPublishError(error instanceof Error ? error.message : 'Failed to publish dynamic template draft.');
    }
  }

  return (
    <div className="builder-dashboard-grid" data-builder-dynamic-template-editor="true">
      <section className="builder-preview-inspector-card" data-builder-dynamic-template-draft-controls="true">
        <div className="builder-dashboard-page-head">
          <div>
            <h2>Template draft</h2>
            <span>Persist block visibility and preview-record selection for this dynamic template.</span>
          </div>
          <button
            type="button"
            className="builder-action-btn"
            data-builder-dynamic-template-save="true"
            disabled={!canSave}
            onClick={handleSaveDraft}
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save draft'}
          </button>
          <button
            type="button"
            className="builder-action-btn builder-action-btn--primary"
            data-builder-dynamic-template-publish="true"
            disabled={!canPublish}
            onClick={handlePublishTemplate}
          >
            {publishStatus === 'publishing' ? 'Publishing...' : 'Publish'}
          </button>
        </div>
        <div className="builder-dashboard-page-meta" aria-live="polite">
          <span>{draftMeta.persisted ? `Draft v${draftMeta.revision}` : 'Not saved yet'}</span>
          <span>{draftChanged ? 'Unsaved changes' : 'No unsaved changes'}</span>
          <span>{draftMeta.savedAt ?? 'Default state'}</span>
          <span>{publishedMeta.persisted ? `Published v${publishedMeta.revision}` : 'Not published'}</span>
          <span>{publishedMeta.savedAt ?? 'No published snapshot'}</span>
          {draftMeta.updatedBy ? <span>{draftMeta.updatedBy}</span> : null}
        </div>
        {saveError ? <p className="builder-field-error">{saveError}</p> : null}
        {publishError ? <p className="builder-field-error">{publishError}</p> : null}
      </section>

      <section className="builder-preview-inspector-card">
        <h2>Template blocks</h2>
        <div className="builder-dashboard-page-list">
          {detail.editableBlocks.map((block) => {
            const visible = visibleBlockIds.has(block.blockId);

            return (
              <article
                key={block.blockId}
                className="builder-dashboard-page-card"
                data-builder-dynamic-template-block={block.blockId}
              >
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{block.label}</strong>
                    <span>{block.description}</span>
                  </div>
                  <span className="builder-stage-pill">{block.control}</span>
                </div>
                <div className="builder-dashboard-page-meta">
                  {block.boundFields.map((field) => (
                    <span key={field}>{field}</span>
                  ))}
                </div>
                <div className="builder-dashboard-page-actions">
                  <button
                    type="button"
                    className="builder-action-btn"
                    aria-pressed={visible}
                    data-builder-dynamic-template-block-toggle={block.blockId}
                    onClick={() =>
                      setVisibleBlockIds((current) => {
                        const next = new Set(current);
                        if (next.has(block.blockId)) {
                          next.delete(block.blockId);
                        } else {
                          next.add(block.blockId);
                        }
                        return next;
                      })
                    }
                  >
                    {visible ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="builder-preview-inspector-card">
        <h2>Preview record</h2>
        {detail.previewRecords.length > 0 ? (
          <>
            {requestedPreviewRecordMissing ? (
              <div
                className="builder-preview-server-alert builder-preview-server-alert--needs-review"
                data-builder-dynamic-template-missing-record="true"
              >
                <strong>Preview record not found</strong>
                <p>
                  Requested record {requestedPreviewRecordId} is not available in this collection preview.
                  {selectedRecord ? ` Showing ${selectedRecord.recordId} instead.` : ' No fallback record is available.'}
                </p>
              </div>
            ) : null}
            <div className="builder-dashboard-page-list">
              {detail.previewRecords.map((record) => (
                <button
                  key={record.recordId}
                  type="button"
                  className={`builder-dashboard-page-card${
                    record.recordId === selectedRecord?.recordId ? ' is-active' : ''
                  }`}
                  data-builder-dynamic-template-record={record.recordId}
                  onClick={() => setSelectedRecordId(record.recordId)}
                >
                  <div className="builder-dashboard-page-head">
                    <div>
                      <strong>{record.primaryLabel}</strong>
                      <span>{record.secondaryLabel}</span>
                    </div>
                    <span className="builder-stage-pill">
                      {record.recordId === selectedRecord?.recordId ? 'Selected' : 'Record'}
                    </span>
                  </div>
                  <div className="builder-dashboard-page-meta">
                    <span>{record.recordId}</span>
                    <span>{record.routePath}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <p>No record sample is required for this collection-level template.</p>
        )}
      </section>

      <section className="builder-preview-inspector-card" data-builder-dynamic-template-binding-map="true">
        <h2>Selected record field map</h2>
        {selectedRecord ? (
          <div className="builder-dashboard-page-list">
            {detail.editableBlocks.map((block) => (
              <article
                key={block.blockId}
                className="builder-dashboard-page-card"
                data-builder-dynamic-template-binding-block={block.blockId}
              >
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{block.label}</strong>
                    <span>{selectedRecord.recordId}</span>
                  </div>
                  <span className="builder-stage-pill">
                    {visibleBlockIds.has(block.blockId) ? 'Visible template block' : 'Hidden template block'}
                  </span>
                </div>
                <div className="builder-dashboard-page-meta">
                  {block.boundFields.map((field) => (
                    <span
                      key={field}
                      className="builder-dashboard-field-value"
                      data-builder-dynamic-template-binding-field={field}
                    >
                      {field}: {resolvePreviewFieldValue(field, selectedRecord, detail)}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>No selected CMS record is available for this template preview.</p>
        )}
      </section>

      <section className="builder-preview-inspector-card">
        <h2>Live template preview</h2>
        <div className="builder-dashboard-page-list" data-builder-dynamic-template-preview="true">
          {detail.editableBlocks
            .filter((block) => visibleBlockIds.has(block.blockId))
            .map((block) => (
              <article key={block.blockId} className="builder-dashboard-page-card">
                <div className="builder-dashboard-page-head">
                  <div>
                    <strong>{resolvePreviewBlockTitle(block.label, selectedRecord)}</strong>
                    <span>{resolvePreviewBlockCopy(block.blockId, detail, selectedRecord, locale)}</span>
                  </div>
                  <span className="builder-stage-pill">Preview</span>
                </div>
                {selectedRecord ? (
                  <div className="builder-dashboard-page-meta">
                    <span>{selectedRecord.routePath}</span>
                    <span>{selectedRecord.seo.noIndex ? 'Noindex' : 'Indexable'}</span>
                  </div>
                ) : null}
              </article>
            ))}
        </div>
      </section>
    </div>
  );
}

function resolvePreviewBlockTitle(
  blockLabel: string,
  record: BuilderDynamicTemplateDetail['previewRecords'][number] | null
) {
  if (!record) return blockLabel;
  if (/hero|body/i.test(blockLabel)) return record.primaryLabel;
  return blockLabel;
}

function resolvePreviewBlockCopy(
  blockId: string,
  detail: BuilderDynamicTemplateDetail,
  record: BuilderDynamicTemplateDetail['previewRecords'][number] | null,
  locale: Locale
) {
  if (blockId.endsWith('.seo')) {
    return record
      ? `${record.seo.title} · ${record.seo.canonicalPath}`
      : `${detail.title} · ${detail.publicPathPattern}`;
  }

  if (blockId.endsWith('.repeater')) {
    return `${detail.previewRecords.length} ${locale === 'ko' ? '개 레코드' : 'records'} · ${detail.publicPathPattern}`;
  }

  if (record) {
    return `${record.secondaryLabel} · ${record.routePath}`;
  }

  return `${detail.collectionTitle} · ${detail.publicPathPattern}`;
}

function resolvePreviewFieldValue(
  field: string,
  record: BuilderDynamicTemplateDetail['previewRecords'][number],
  detail: BuilderDynamicTemplateDetail
) {
  switch (field) {
    case 'record.primaryLabel':
      return record.primaryLabel;
    case 'record.secondaryLabel':
      return record.secondaryLabel;
    case 'record.routePath':
      return record.routePath;
    case 'seo.title':
      return record.seo.title;
    case 'seo.description':
      return record.seo.description;
    case 'seo.canonicalPath':
      return record.seo.canonicalPath;
    case 'seo.noIndex':
      return record.seo.noIndex ? 'true' : 'false';
    case 'collection.title':
      return detail.collectionTitle;
    case 'route.notes':
      return detail.notes;
    case 'route.pathPattern':
      return detail.publicPathPattern;
    default:
      return 'Not resolved in preview';
  }
}

type DynamicTemplateDraftSaveResponse = {
  ok?: boolean;
  error?: string;
  draft?: {
    snapshot?: BuilderDynamicTemplateDraftSnapshot;
  };
};

type DynamicTemplatePublishResponse = {
  ok?: boolean;
  error?: string;
  published?: {
    snapshot?: BuilderDynamicTemplateDraftSnapshot;
  };
};

function serializeDraftState(state: BuilderDynamicTemplateDraftState): string {
  return JSON.stringify({
    version: 1,
    visibleBlockIds: state.visibleBlockIds,
    selectedRecordId: state.selectedRecordId ?? null,
  });
}

function resolveInitialPreviewRecordId(
  detail: BuilderDynamicTemplateDetail,
  draftSelectedRecordId: string | null,
  initialPreviewRecordId: string | null | undefined
) {
  const requestedRecordId = initialPreviewRecordId?.trim();
  if (
    requestedRecordId &&
    detail.previewRecords.some((record) => record.recordId === requestedRecordId)
  ) {
    return requestedRecordId;
  }

  return draftSelectedRecordId ?? '';
}
