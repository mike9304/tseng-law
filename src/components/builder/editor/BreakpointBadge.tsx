'use client';

import type { Viewport } from '@/lib/builder/canvas/responsive';

const LABELS: Record<Viewport, string> = {
  desktop: 'desktop',
  tablet: 'tablet',
  mobile: 'mobile',
};

export default function BreakpointBadge({
  viewport,
  active = true,
  label,
}: {
  viewport: Viewport;
  active?: boolean;
  label?: string;
}) {
  if (!active) return null;
  const visibleLabel = label ?? LABELS[viewport];

  return (
    <span
      aria-label={`${LABELS[viewport]} override active`}
      title={`${LABELS[viewport]} override active`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: visibleLabel ? 5 : 0,
        color: '#1d4ed8',
        fontSize: '0.66rem',
        fontWeight: 800,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        verticalAlign: 'middle',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#116dff',
          boxShadow: '0 0 0 3px rgba(17, 109, 255, 0.12)',
        }}
      />
      {visibleLabel}
    </span>
  );
}
