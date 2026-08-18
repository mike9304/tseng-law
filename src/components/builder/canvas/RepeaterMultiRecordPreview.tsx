'use client';

/**
 * F19 — Visual multi-record repeater preview.
 *
 * Lets the editor inspect how a repeater container will render when bound
 * to a CMS collection by previewing three nearby records with a click-to-switch
 * active record indicator. The component is dataset-agnostic — it receives
 * `RepeaterPreviewRecord` values from the server parent (CMS panel or
 * inspector) and keeps the active card synchronized with the parent-selected
 * record id.
 *
 * Rendering contract
 * ------------------
 * - 1 record  → one card, no switcher.
 * - 2 records → two cards, no switcher.
 * - 3+ records → exactly three cards, windowed so the active record remains
 *   visible, plus a row of switcher chips for all records.
 *
 * Keyboard
 * --------
 * - Tab moves through cards in DOM order.
 * - Enter / Space on a card sets it active.
 * - ArrowLeft / ArrowRight on a focused switcher chip moves the active
 *   record without losing focus.
 */
import { useEffect, useId, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import {
  cardActiveStyle,
  cardBodyStyle,
  cardStyle,
  chipActiveStyle,
  chipStyle,
  containerStyle,
  descriptionStyle,
  emptyContainerStyle,
  emptyMessageStyle,
  gridStyle,
  headerStyle,
  headingStyle,
  imagePlaceholderStyle,
  imageStyle,
  loadingContainerStyle,
  metaStyle,
  primaryLabelStyle,
  recordImageStyle,
  routePathStyle,
  secondaryLabelStyle,
  skeletonBodyStyle,
  skeletonCardStyle,
  skeletonGridStyle,
  skeletonImageStyle,
  skeletonLineMediumStyle,
  skeletonLineShortStyle,
  skeletonLineWideStyle,
  switcherStyle,
} from './RepeaterMultiRecordPreview.styles';

export const REPEATER_PREVIEW_MAX_VISIBLE_CARDS = 3;

export type RepeaterPreviewRecord = {
  readonly recordId: string;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
  readonly routePath: string;
  readonly seo?: { readonly image?: string };
};

export interface RepeaterMultiRecordPreviewProps {
  records: readonly RepeaterPreviewRecord[];
  /** Show a loading skeleton while records are being fetched. */
  loading?: boolean;
  /** Initial active record id. Defaults to the first record. */
  initialActiveRecordId?: string;
  /** Hint shown above the preview — usually the dataset target title. */
  title?: string;
  /** Hint shown under the title — usually the binding description. */
  description?: string;
  /** Notified whenever the editor picks a different record. */
  onActiveRecordChange?: (recordId: string) => void;
  labels?: RepeaterMultiRecordPreviewLabels;
}

export type RepeaterMultiRecordPreviewLabels = {
  readonly loadingStatus: string;
  readonly loadingListAriaLabel: string;
  readonly emptyMessage: string;
  readonly visibleRecordSummary: (visibleCount: number, totalCount: number) => string;
  readonly switcherAriaLabel: string;
};

const DEFAULT_LABELS: RepeaterMultiRecordPreviewLabels = {
  loadingStatus: 'Loading CMS records...',
  loadingListAriaLabel: 'Repeater preview loading',
  emptyMessage: 'No records are available for this collection. Add records in the CMS to preview them here.',
  visibleRecordSummary: (visibleCount, totalCount) => `${visibleCount} of ${totalCount} records shown`,
  switcherAriaLabel: 'Switch repeater preview record',
};

export function resolveRepeaterPreviewWindow(
  records: readonly RepeaterPreviewRecord[],
  activeRecordId: string,
): readonly RepeaterPreviewRecord[] {
  if (records.length <= REPEATER_PREVIEW_MAX_VISIBLE_CARDS) {
    return records;
  }

  const activeRecordIndex = records.findIndex((record) => record.recordId === activeRecordId);
  const selectedIndex = activeRecordIndex >= 0 ? activeRecordIndex : 0;
  const startIndex = Math.min(
    Math.max(selectedIndex - 1, 0),
    records.length - REPEATER_PREVIEW_MAX_VISIBLE_CARDS,
  );
  return records.slice(startIndex, startIndex + REPEATER_PREVIEW_MAX_VISIBLE_CARDS);
}

export default function RepeaterMultiRecordPreview({
  records,
  loading = false,
  initialActiveRecordId,
  title,
  description,
  onActiveRecordChange,
  labels = DEFAULT_LABELS,
}: RepeaterMultiRecordPreviewProps) {
  const headingId = useId();
  const initialId = useMemo(() => {
    if (initialActiveRecordId && records.some((entry) => entry.recordId === initialActiveRecordId)) {
      return initialActiveRecordId;
    }
    return records[0]?.recordId ?? '';
  }, [initialActiveRecordId, records]);
  const [activeRecordId, setActiveRecordId] = useState(initialId);
  const visibleRecords = useMemo(
    () => resolveRepeaterPreviewWindow(records, activeRecordId),
    [activeRecordId, records],
  );

  useEffect(() => {
    setActiveRecordId(initialId);
  }, [initialId]);

  if (loading) {
    return (
      <section
        aria-busy="true"
        aria-labelledby={headingId}
        data-builder-multi-record-preview="loading"
        style={loadingContainerStyle}
      >
        <header style={headerStyle}>
          <h3 id={headingId} style={headingStyle}>
            {title ?? 'Repeater preview'}
          </h3>
          {description ? <p style={descriptionStyle}>{description}</p> : null}
          <small style={metaStyle}>{labels.loadingStatus}</small>
        </header>
        <div style={skeletonGridStyle} role="list" aria-label={labels.loadingListAriaLabel}>
          {Array.from({ length: REPEATER_PREVIEW_MAX_VISIBLE_CARDS }).map((_, index) => (
            <article
              key={`skeleton-${index}`}
              role="listitem"
              data-preview-skeleton-card="true"
              aria-hidden="true"
              style={skeletonCardStyle}
            >
              <div style={skeletonImageStyle} />
              <div style={skeletonBodyStyle}>
                <div style={skeletonLineWideStyle} />
                <div style={skeletonLineMediumStyle} />
                <div style={skeletonLineShortStyle} />
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (records.length === 0) {
    return (
      <section
        aria-labelledby={headingId}
        data-builder-multi-record-preview="empty"
        style={emptyContainerStyle}
      >
        <h3 id={headingId} style={headingStyle}>
          {title ?? 'Repeater preview'}
        </h3>
        <p style={emptyMessageStyle}>
          {labels.emptyMessage}
        </p>
      </section>
    );
  }

  const handleActivate = (recordId: string) => {
    setActiveRecordId(recordId);
    onActiveRecordChange?.(recordId);
  };

  const handleChipKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = (index + 1) % records.length;
      const nextRecord = records[next];
      if (nextRecord) handleActivate(nextRecord.recordId);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = (index - 1 + records.length) % records.length;
      const previousRecord = records[prev];
      if (previousRecord) handleActivate(previousRecord.recordId);
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      data-builder-multi-record-preview="ready"
      data-active-record={activeRecordId}
      style={containerStyle}
    >
      <header style={headerStyle}>
        <h3 id={headingId} style={headingStyle}>
          {title ?? 'Repeater preview'}
        </h3>
        {description ? <p style={descriptionStyle}>{description}</p> : null}
        <small style={metaStyle}>
          {labels.visibleRecordSummary(Math.min(records.length, REPEATER_PREVIEW_MAX_VISIBLE_CARDS), records.length)}
        </small>
      </header>
      <div style={gridStyle} role="list">
        {visibleRecords.map((record) => {
          const isActive = record.recordId === activeRecordId;
          return (
            <button
              type="button"
              key={record.recordId}
              data-record-id={record.recordId}
              data-record-active={isActive ? 'true' : 'false'}
              aria-pressed={isActive}
              onClick={() => handleActivate(record.recordId)}
              style={isActive ? cardActiveStyle : cardStyle}
            >
              {record.seo?.image ? (
                <div
                  style={imageStyle}
                  role="img"
                  aria-label={record.primaryLabel}
                  data-card-image="true"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- CMS record previews accept arbitrary remote/blob/data URLs that the Next image optimizer cannot safely proxy. */}
                  <img
                    src={record.seo.image}
                    alt=""
                    loading="lazy"
                    style={recordImageStyle}
                  />
                </div>
              ) : (
                <div style={imagePlaceholderStyle} aria-hidden="true" />
              )}
              <div style={cardBodyStyle}>
                <strong style={primaryLabelStyle}>{record.primaryLabel}</strong>
                <span style={secondaryLabelStyle}>{record.secondaryLabel}</span>
                <code style={routePathStyle}>{record.routePath}</code>
              </div>
            </button>
          );
        })}
      </div>
      {records.length > REPEATER_PREVIEW_MAX_VISIBLE_CARDS ? (
        <nav aria-label={labels.switcherAriaLabel} style={switcherStyle}>
          {records.map((record, index) => {
            const isActive = record.recordId === activeRecordId;
            return (
              <button
                type="button"
                key={record.recordId}
                onClick={() => handleActivate(record.recordId)}
                onKeyDown={(event) => handleChipKey(event, index)}
                data-switcher-record-id={record.recordId}
                data-switcher-active={isActive ? 'true' : 'false'}
                style={isActive ? chipActiveStyle : chipStyle}
              >
                {record.primaryLabel}
              </button>
            );
          })}
        </nav>
      ) : null}
    </section>
  );
}
