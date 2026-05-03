'use client';

import type { AlignmentGuide } from '@/lib/builder/canvas/snap';

interface AlignmentGuidesProps {
  guides: AlignmentGuide[];
}

export default function AlignmentGuides({ guides }: AlignmentGuidesProps) {
  if (guides.length === 0) return null;

  return (
    <>
      {guides.map((g, i) => {
        const key = `${g.axis}-${g.position}-${i}`;
        const color = g.tone === 'spacing' ? '#f59e0b' : '#be185d';
        const glow = g.tone === 'spacing'
          ? '0 0 0 1px rgba(245, 158, 11, 0.24), 0 0 14px rgba(245, 158, 11, 0.34)'
          : '0 0 0 1px rgba(190, 24, 93, 0.2), 0 0 14px rgba(190, 24, 93, 0.3)';
        const chip = g.label ? (
          <span
            style={{
              position: 'absolute',
              left: g.axis === 'vertical' ? g.position + 7 : (g.from + g.to) / 2,
              top: g.axis === 'vertical' ? (g.from + g.to) / 2 : g.position + 7,
              transform: g.axis === 'vertical' ? 'translateY(-50%)' : 'translateX(-50%)',
              minWidth: 34,
              padding: '3px 6px',
              border: `1px solid ${color}`,
              borderRadius: 999,
              background: '#ffffff',
              boxShadow: glow,
              color,
              fontSize: 11,
              fontWeight: 800,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
              pointerEvents: 'none',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              zIndex: 10000,
            }}
          >
            {g.label}
          </span>
        ) : null;
        if (g.axis === 'vertical') {
          return (
            <div key={key}>
              <div
                style={{
                  position: 'absolute',
                  left: g.position,
                  top: g.from,
                  width: g.tone === 'spacing' ? 2 : 1,
                  height: Math.max(1, g.to - g.from),
                  backgroundColor: color,
                  boxShadow: glow,
                  pointerEvents: 'none',
                  zIndex: 9999,
                }}
              />
              {chip}
            </div>
          );
        }
        return (
          <div key={key}>
            <div
              style={{
                position: 'absolute',
                left: g.from,
                top: g.position,
                width: Math.max(1, g.to - g.from),
                height: g.tone === 'spacing' ? 2 : 1,
                backgroundColor: color,
                boxShadow: glow,
                pointerEvents: 'none',
                zIndex: 9999,
              }}
            />
            {chip}
          </div>
        );
      })}
    </>
  );
}
