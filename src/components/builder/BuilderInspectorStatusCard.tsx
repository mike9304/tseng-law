'use client';

import type { ReactNode } from 'react';

type BuilderInspectorStatusTone = 'default' | 'success' | 'danger' | 'primary';
type BuilderInspectorStatusVariant = 'readiness' | 'alert';
type BuilderInspectorStatusCardTone =
  | 'default'
  | 'blocked'
  | 'needs-review'
  | 'ready'
  | 'conflict'
  | 'validation'
  | 'success';

export type BuilderInspectorStatusMetaItem = {
  label: ReactNode;
  value: ReactNode;
};

type BuilderInspectorStatusCardProps = {
  variant?: BuilderInspectorStatusVariant;
  tone?: BuilderInspectorStatusCardTone;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  title?: ReactNode;
  summary?: ReactNode;
  statusLabel?: ReactNode;
  statusTone?: BuilderInspectorStatusTone;
  message?: ReactNode;
  meta?: BuilderInspectorStatusMetaItem[];
  note?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export default function BuilderInspectorStatusCard({
  variant = 'alert',
  tone = 'default',
  subtitle,
  eyebrow,
  title,
  summary,
  statusLabel,
  statusTone = 'primary',
  message,
  meta,
  note,
  actions,
  children,
  className,
}: BuilderInspectorStatusCardProps) {
  const cardClassName = [getCardClassName(variant, tone), className].filter(Boolean).join(' ');
  const hasMeta = Array.isArray(meta) && meta.length > 0;

  return (
    <>
      {subtitle ? <div className="builder-preview-inspector-subtitle">{subtitle}</div> : null}
      <div className={cardClassName}>
        {variant === 'readiness' ? (
          <div className="builder-preview-readiness-head">
            <div>
              {eyebrow ? <div className="builder-preview-inspector-label">{eyebrow}</div> : null}
              {title ? <h3>{title}</h3> : null}
              {summary ? <p>{summary}</p> : null}
            </div>
            {statusLabel ? (
              <span className={getStatusChipClassName(statusTone)}>
                {statusLabel}
              </span>
            ) : null}
          </div>
        ) : null}

        {variant === 'alert' && eyebrow ? (
          <div className="builder-preview-inspector-label">{eyebrow}</div>
        ) : null}
        {variant === 'alert' && message ? (
          <p className="builder-preview-draft-status">{message}</p>
        ) : null}
        {variant === 'readiness' && message ? (
          <p className="builder-preview-editor-note">{message}</p>
        ) : null}

        {hasMeta ? (
          <dl className="builder-preview-server-alert-meta">
            {meta.map((item, index) => (
              <div key={index}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {note ? <p className="builder-preview-editor-note">{note}</p> : null}
        {actions ? (
          <div
            className={
              variant === 'readiness'
                ? 'builder-preview-readiness-actions'
                : 'builder-preview-server-alert-actions'
            }
          >
            {actions}
          </div>
        ) : null}
        {children}
      </div>
    </>
  );
}

function getCardClassName(
  variant: BuilderInspectorStatusVariant,
  tone: BuilderInspectorStatusCardTone
) {
  if (variant === 'readiness') {
    return `builder-preview-readiness-card builder-preview-readiness-card--${tone}`;
  }

  return tone === 'default'
    ? 'builder-preview-server-alert'
    : `builder-preview-server-alert builder-preview-server-alert--${tone}`;
}

function getStatusChipClassName(tone: BuilderInspectorStatusTone) {
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
