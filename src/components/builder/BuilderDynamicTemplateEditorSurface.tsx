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
  locale,
}: {
  detail: BuilderDynamicTemplateDetail;
  draft: BuilderDynamicTemplateDraftReadResult;
  locale: Locale;
}) {
  const initialDraftState = draft.snapshot.state;
  const [visibleBlockIds, setVisibleBlockIds] = useState(
    () => new Set(initialDraftState.visibleBlockIds)
  );
  const [selectedRecordId, setSelectedRecordId] = useState(initialDraftState.selectedRecordId ?? '');
  const [draftMeta, setDraftMeta] = useState(() => ({
    persisted: draft.persisted,
    revision: draft.snapshot.revision,
    savedAt: draft.snapshot.savedAt,
    updatedBy: draft.snapshot.updatedBy,
  }));
  const [savedSignature, setSavedSignature] = useState(() => serializeDraftState(initialDraftState));
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setVisibleBlockIds(new Set(draft.snapshot.state.visibleBlockIds));
    setSelectedRecordId(draft.snapshot.state.selectedRecordId ?? '');
    setDraftMeta({
      persisted: draft.persisted,
      revision: draft.snapshot.revision,
      savedAt: draft.snapshot.savedAt,
      updatedBy: draft.snapshot.updatedBy,
    });
    setSavedSignature(serializeDraftState(draft.snapshot.state));
    setSaveStatus('idle');
    setSaveError(null);
  }, [
    detail.templateId,
    draft.persisted,
    draft.snapshot.revision,
    draft.snapshot.savedAt,
    draft.snapshot.state,
    draft.snapshot.updatedBy,
    locale,
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
        </div>
        <div className="builder-dashboard-page-meta" aria-live="polite">
          <span>{draftMeta.persisted ? `Draft v${draftMeta.revision}` : 'Not saved yet'}</span>
          <span>{draftChanged ? 'Unsaved changes' : 'No unsaved changes'}</span>
          <span>{draftMeta.savedAt ?? 'Default state'}</span>
          {draftMeta.updatedBy ? <span>{draftMeta.updatedBy}</span> : null}
        </div>
        {saveError ? <p className="builder-field-error">{saveError}</p> : null}
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
        ) : (
          <p>No record sample is required for this collection-level template.</p>
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

type DynamicTemplateDraftSaveResponse = {
  ok?: boolean;
  error?: string;
  draft?: {
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
