'use client';

/**
 * F19 — Visual multi-record repeater preview.
 *
 * Lets the editor inspect how a repeater container will render when bound
 * to a CMS collection by previewing three records side-by-side with a
 * click-to-switch active record indicator. The component is dataset-agnostic
 * — it receives a list of `BuilderCollectionRecordPreview` objects from the
 * server parent (CMS panel or inspector) and only owns the active-record
 * UI state.
 *
 * Rendering contract
 * ------------------
 * - 1 record  → one card, no switcher.
 * - 2 records → two cards, no switcher.
 * - 3+ records → exactly three cards, the active one expanded, plus a
 *   row of switcher chips for the remaining records.
 *
 * Keyboard
 * --------
 * - Tab moves through cards in DOM order.
 * - Enter / Space on a card sets it active.
 * - ArrowLeft / ArrowRight on a focused switcher chip moves the active
 *   record without losing focus.
 */
import { useId, useMemo, useState } from 'react';
import type { BuilderCollectionRecordPreview } from '@/lib/builder/cms';

const MAX_VISIBLE_CARDS = 3;

export interface RepeaterMultiRecordPreviewProps {
  records: readonly BuilderCollectionRecordPreview[];
  /** Initial active record id. Defaults to the first record. */
  initialActiveRecordId?: string;
  /** Hint shown above the preview — usually the dataset target title. */
  title?: string;
  /** Hint shown under the title — usually the binding description. */
  description?: string;
  /** Notified whenever the editor picks a different record. */
  onActiveRecordChange?: (recordId: string) => void;
}

export default function RepeaterMultiRecordPreview({
  records,
  initialActiveRecordId,
  title,
  description,
  onActiveRecordChange,
}: RepeaterMultiRecordPreviewProps) {
  const headingId = useId();
  const visibleRecords = useMemo(
    () => records.slice(0, MAX_VISIBLE_CARDS),
    [records],
  );
  const overflowRecords = useMemo(
    () => records.slice(MAX_VISIBLE_CARDS),
    [records],
  );
  const initialId = useMemo(() => {
    if (initialActiveRecordId && records.some((entry) => entry.recordId === initialActiveRecordId)) {
      return initialActiveRecordId;
    }
    return records[0]?.recordId ?? '';
  }, [initialActiveRecordId, records]);
  const [activeRecordId, setActiveRecordId] = useState(initialId);

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
          이 컬렉션에 표시할 레코드가 없습니다. CMS에서 레코드를 추가하면 미리보기가 나타납니다.
        </p>
      </section>
    );
  }

  const handleActivate = (recordId: string) => {
    setActiveRecordId(recordId);
    onActiveRecordChange?.(recordId);
  };

  const handleCardKey = (event: React.KeyboardEvent<HTMLDivElement>, recordId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleActivate(recordId);
    }
  };

  const handleChipKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = (index + 1) % records.length;
      handleActivate(records[next]!.recordId);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = (index - 1 + records.length) % records.length;
      handleActivate(records[prev]!.recordId);
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
          {records.length}개 레코드 중 {Math.min(records.length, MAX_VISIBLE_CARDS)}개 표시
        </small>
      </header>
      <div style={gridStyle} role="list">
        {visibleRecords.map((record) => {
          const isActive = record.recordId === activeRecordId;
          return (
            <div
              key={record.recordId}
              role="listitem"
              tabIndex={0}
              data-record-id={record.recordId}
              data-record-active={isActive ? 'true' : 'false'}
              aria-pressed={isActive}
              onClick={() => handleActivate(record.recordId)}
              onKeyDown={(event) => handleCardKey(event, record.recordId)}
              style={isActive ? cardActiveStyle : cardStyle}
            >
              {record.seo.image ? (
                <div
                  style={imageStyle}
                  role="img"
                  aria-label={record.primaryLabel}
                  data-card-image="true"
                >
                  <img
                    src={record.seo.image}
                    alt=""
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
            </div>
          );
        })}
      </div>
      {overflowRecords.length > 0 ? (
        <nav aria-label="Switch repeater preview record" style={switcherStyle}>
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

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 20,
  borderRadius: 14,
  border: '1px solid #dbeafe',
  background: '#ffffff',
  boxShadow: '0 14px 32px rgba(15, 23, 42, 0.08)',
};

const emptyContainerStyle: React.CSSProperties = {
  ...containerStyle,
  alignItems: 'flex-start',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const headingStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 16,
  color: '#0f172a',
  fontWeight: 600,
};

const descriptionStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: '#475569',
};

const metaStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#94a3b8',
};

const emptyMessageStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: '#475569',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))',
  gap: 12,
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 12,
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  background: '#f8fafc',
  cursor: 'pointer',
  outline: 'none',
};

const cardActiveStyle: React.CSSProperties = {
  ...cardStyle,
  borderColor: '#116dff',
  background: '#eff6ff',
  boxShadow: '0 0 0 2px rgba(17, 109, 255, 0.18)',
};

const imageStyle: React.CSSProperties = {
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: 8,
  overflow: 'hidden',
  background: '#cbd5f5',
};

const imagePlaceholderStyle: React.CSSProperties = {
  ...imageStyle,
  background: 'linear-gradient(135deg, #dbeafe, #c7d2fe)',
};

const cardBodyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const primaryLabelStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#0f172a',
};

const secondaryLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#475569',
};

const routePathStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#1e3a8a',
  background: '#eef2ff',
  padding: '2px 6px',
  borderRadius: 6,
  alignSelf: 'flex-start',
};

const switcherStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
};

const chipStyle: React.CSSProperties = {
  border: '1px solid #cbd5f5',
  background: '#ffffff',
  color: '#1e3a8a',
  fontSize: 12,
  padding: '4px 10px',
  borderRadius: 999,
  cursor: 'pointer',
};

const chipActiveStyle: React.CSSProperties = {
  ...chipStyle,
  background: '#1e40af',
  borderColor: '#1e40af',
  color: '#ffffff',
};