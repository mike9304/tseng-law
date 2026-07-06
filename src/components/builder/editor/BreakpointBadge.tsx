'use client';

import type { Viewport } from '@/lib/builder/canvas/responsive';
import styles from './BreakpointBadge.module.css';

const LABELS: Record<Viewport, string> = {
  desktop: 'desktop',
  tablet: 'tablet',
  mobile: 'mobile',
};

export default function BreakpointBadge({
  viewport,
  active = true,
  label,
  title,
  ariaLabel,
}: {
  viewport: Viewport;
  active?: boolean;
  label?: string;
  title?: string;
  ariaLabel?: string;
}) {
  if (!active) return null;
  const visibleLabel = label ?? LABELS[viewport];
  const resolvedTitle = title ?? `${LABELS[viewport]} override active`;

  return (
    <span
      aria-label={ariaLabel ?? resolvedTitle}
      title={resolvedTitle}
      className={styles.breakpointBadge}
      data-builder-breakpoint-badge={viewport}
      data-has-label={visibleLabel ? 'true' : 'false'}
    >
      <span aria-hidden className={styles.breakpointBadgeDot} />
      {visibleLabel ? (
        <span className={styles.breakpointBadgeLabel}>{visibleLabel}</span>
      ) : null}
    </span>
  );
}
