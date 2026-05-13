'use client';

import { useMemo, useState } from 'react';
import type { BuilderDynamicTemplateDetail } from '@/lib/builder/dynamic-templates';
import type { Locale } from '@/lib/locales';

export default function BuilderDynamicTemplateEditorSurface({
  detail,
  locale,
}: {
  detail: BuilderDynamicTemplateDetail;
  locale: Locale;
}) {
  const defaultVisibleBlockIds = useMemo(
    () =>
      new Set(
        detail.editableBlocks
          .filter((block) => block.defaultVisible)
          .map((block) => block.blockId)
      ),
    [detail.editableBlocks]
  );
  const [visibleBlockIds, setVisibleBlockIds] = useState(defaultVisibleBlockIds);
  const [selectedRecordId, setSelectedRecordId] = useState(
    detail.previewRecords[0]?.recordId ?? ''
  );
  const selectedRecord =
    detail.previewRecords.find((record) => record.recordId === selectedRecordId) ??
    detail.previewRecords[0] ??
    null;

  return (
    <div className="builder-dashboard-grid" data-builder-dynamic-template-editor="true">
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
