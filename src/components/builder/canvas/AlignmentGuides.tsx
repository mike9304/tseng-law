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
        if (g.axis === 'vertical') {
          return (
            <div
              key={key}
              style={{
                position: 'absolute',
                left: g.position,
                top: g.from,
                width: 1,
                height: g.to - g.from,
                backgroundColor: '#ef4444',
                pointerEvents: 'none',
                zIndex: 9999,
              }}
            />
          );
        }
        return (
          <div
            key={key}
            style={{
              position: 'absolute',
              left: g.from,
              top: g.position,
              width: g.to - g.from,
              height: 1,
              backgroundColor: '#ef4444',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          />
        );
      })}
    </>
  );
}
