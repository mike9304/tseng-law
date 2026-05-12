'use client';

import type { PointerEvent } from 'react';
import type { ReferenceGuide } from '@/lib/builder/canvas/editor-prefs';

type CustomGuidesOverlayProps = {
  guides: ReferenceGuide[];
  onRemoveGuide: (guideId: string) => void;
  onStartGuideDrag: (guide: ReferenceGuide, event: PointerEvent<HTMLButtonElement>) => void;
  stageHeight: number;
  stageWidth: number;
};

export default function CustomGuidesOverlay({
  guides,
  onRemoveGuide,
  onStartGuideDrag,
  stageHeight,
  stageWidth,
}: CustomGuidesOverlayProps) {
  return (
    <div
      data-builder-floating-ui="true"
      role="presentation"
      style={{ inset: 0, pointerEvents: 'none', position: 'absolute', zIndex: 10010 }}
    >
      {guides.map((guide) => {
        const vertical = guide.axis === 'vertical';
        const color = guide.color || '#e11d48';
        return (
          <button
            key={guide.id}
            type="button"
            data-builder-guide-id={guide.id}
            data-builder-guide-axis={guide.axis}
            aria-label={`${vertical ? 'Vertical' : 'Horizontal'} guide at ${Math.round(guide.position)} pixels`}
            title={guide.label || `${guide.axis} guide ${Math.round(guide.position)}px`}
            onDoubleClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onRemoveGuide(guide.id);
            }}
            onPointerDown={(event) => onStartGuideDrag(guide, event)}
            style={{
              background: 'transparent',
              border: 0,
              cursor: vertical ? 'col-resize' : 'row-resize',
              height: vertical ? stageHeight : 13,
              left: vertical ? guide.position - 6 : 0,
              padding: 0,
              pointerEvents: 'auto',
              position: 'absolute',
              top: vertical ? 0 : guide.position - 6,
              width: vertical ? 13 : stageWidth,
            }}
          >
            <span
              style={{
                background: color,
                boxShadow: `0 0 0 1px rgba(255,255,255,0.8), 0 0 0 3px ${color}26`,
                display: 'block',
                height: vertical ? '100%' : 1,
                left: vertical ? 6 : 0,
                opacity: 0.92,
                position: 'absolute',
                top: vertical ? 0 : 6,
                width: vertical ? 1 : '100%',
              }}
            />
            <span
              style={{
                background: '#111827',
                borderRadius: 999,
                color: '#fff',
                fontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
                fontSize: 10,
                fontWeight: 800,
                left: vertical ? 10 : 8,
                lineHeight: 1,
                padding: '4px 6px',
                position: 'absolute',
                top: vertical ? 28 : 9,
                transform: vertical ? 'none' : 'translateY(-50%)',
                whiteSpace: 'nowrap',
              }}
            >
              {Math.round(guide.position)}px
            </span>
          </button>
        );
      })}
    </div>
  );
}
