'use client';

import type { ReactNode } from 'react';
import type { Locale } from '@/lib/locales';

export type BuilderInspectorAssetLibraryItem = {
  locale: Locale;
  contentType: string;
  url: string;
  filename: string;
  uploadedAt: string;
  size: number;
  isActive?: boolean;
  badgeLabel?: ReactNode;
  badgeTone?: 'primary' | 'success' | 'danger' | 'default';
  thumbnailAlt?: string;
};

type BuilderInspectorAssetLibraryPanelProps = {
  title?: ReactNode;
  description?: ReactNode;
  locale: Locale;
  items: BuilderInspectorAssetLibraryItem[];
  pending?: boolean;
  error?: ReactNode;
  emptyMessage?: ReactNode;
  refreshLabel?: ReactNode;
  onRefresh?: () => void;
  refreshDisabled?: boolean;
  onSelect?: (item: BuilderInspectorAssetLibraryItem) => void;
  selectLabel?: ReactNode | ((item: BuilderInspectorAssetLibraryItem) => ReactNode);
  selectedLabel?: ReactNode | ((item: BuilderInspectorAssetLibraryItem) => ReactNode);
  footer?: ReactNode;
};

export default function BuilderInspectorAssetLibraryPanel({
  title = 'Asset library',
  description = 'Use a previously uploaded builder image instead of pasting a URL.',
  locale,
  items,
  pending = false,
  error,
  emptyMessage = 'No recent builder assets for this locale yet. Upload an image to seed the library.',
  refreshLabel = 'Refresh',
  onRefresh,
  refreshDisabled = false,
  onSelect,
  selectLabel = 'Use this image',
  selectedLabel = 'Selected',
  footer,
}: BuilderInspectorAssetLibraryPanelProps) {
  return (
    <div className="builder-image-library-panel">
      <div className="builder-image-library-head">
        <div>
          <div className="builder-preview-inspector-subtitle">{title}</div>
          <p className="builder-preview-editor-note">{description}</p>
        </div>
        {onRefresh ? (
          <button
            type="button"
            className="builder-action-btn"
            onClick={onRefresh}
            disabled={refreshDisabled}
          >
            {pending ? 'Refreshing…' : refreshLabel}
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="builder-image-upload-status is-error" role="status" aria-live="polite">
          {error}
        </p>
      ) : null}

      {items.length > 0 ? (
        <div className="builder-image-library-grid">
          {items.map((item) => {
            const active = Boolean(item.isActive);
            const badgeTone = item.badgeTone ?? (active ? 'success' : 'primary');
            const badgeLabel = item.badgeLabel ?? (active ? 'Using now' : 'Ready to publish');
            const selectText = resolveLabel(active ? selectedLabel : selectLabel, item);

            return (
              <article key={item.url} className={`builder-image-library-card${active ? ' is-active' : ''}`}>
                <div className="builder-image-library-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.thumbnailAlt ?? item.filename} loading="lazy" />
                </div>
                <div className="builder-image-library-copy">
                  <strong>{truncateAssetFilename(item.filename, 40)}</strong>
                  <span>
                    Uploaded {formatAssetTimestamp(item.uploadedAt, locale)} · {formatBytes(item.size)}
                  </span>
                </div>
                <div className="builder-image-library-actions">
                  <span className={getAssetBadgeClassName(badgeTone)}>{badgeLabel}</span>
                  {onSelect ? (
                    <button
                      type="button"
                      className="builder-action-btn builder-action-btn--primary"
                      onClick={() => {
                        onSelect(item);
                      }}
                      disabled={active}
                    >
                      {selectText}
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : pending ? (
        <p className="builder-preview-editor-note">Loading recent builder assets…</p>
      ) : (
        <p className="builder-preview-editor-note">{emptyMessage}</p>
      )}

      {footer}
    </div>
  );
}

function getAssetBadgeClassName(tone: 'primary' | 'success' | 'danger' | 'default') {
  switch (tone) {
    case 'success':
      return 'builder-preview-status-chip builder-preview-status-chip--success';
    case 'danger':
      return 'builder-preview-status-chip builder-preview-status-chip--danger';
    case 'primary':
      return 'builder-preview-status-chip builder-preview-status-chip--primary';
    default:
      return 'builder-preview-status-chip';
  }
}

function truncateAssetFilename(value: string, maxLength: number) {
  const normalized = stripAssetUuid(value);
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, Math.max(0, maxLength - 1))}…`;
}

function stripAssetUuid(filename: string) {
  return filename.replace(/-[0-9a-f]{8}-[0-9a-f-]{27,}\./i, '.');
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
}

function formatAssetTimestamp(value: string, locale: Locale) {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;

  return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsed);
}

function resolveLabel(
  label: ReactNode | ((item: BuilderInspectorAssetLibraryItem) => ReactNode),
  item: BuilderInspectorAssetLibraryItem
) {
  return typeof label === 'function' ? label(item) : label;
}
