'use client';

import { useEffect, useState } from 'react';
import { loadEditorPreferences, type RulerConfig } from '@/lib/builder/canvas/editor-prefs';

interface Props {
  width?: number;
  height?: number;
  /** Optional viewport offset / zoom for label calibration. */
  zoom?: number;
}

const TICK_MAJOR = 100;
const TICK_MINOR = 20;

/**
 * Phase 28 W216 — Rulers component.
 *
 * Renders top + left ruler strips along the canvas. Reads ruler config from
 * editor preferences (enabled / unit). Caller passes width/height (and
 * optionally zoom). Mount inside the canvas frame container.
 */
export default function EditorRulers({ width = 1440, height = 900, zoom = 1 }: Props) {
  const [config, setConfig] = useState<RulerConfig | null>(null);

  useEffect(() => {
    setConfig(loadEditorPreferences().rulers);
  }, []);

  if (!config?.enabled) return null;

  const unit = config.unit;
  const horizontalTicks: Array<{ x: number; label: string; major: boolean }> = [];
  for (let x = 0; x <= width; x += TICK_MINOR) {
    horizontalTicks.push({
      x,
      label: unit === 'percent' ? `${Math.round((x / Math.max(1, width)) * 100)}%` : `${x}`,
      major: x % TICK_MAJOR === 0,
    });
  }
  const verticalTicks: Array<{ y: number; label: string; major: boolean }> = [];
  for (let y = 0; y <= height; y += TICK_MINOR) {
    verticalTicks.push({
      y,
      label: unit === 'percent' ? `${Math.round((y / Math.max(1, height)) * 100)}%` : `${y}`,
      major: y % TICK_MAJOR === 0,
    });
  }

  return (
    <>
      <div
        className="builder-editor-ruler builder-editor-ruler-h"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -22,
          left: 0,
          width,
          height: 22,
          pointerEvents: 'none',
          transformOrigin: '0 0',
          transform: `scaleX(${zoom})`,
        }}
      >
        {horizontalTicks.map((t) => (
          <span
            key={`h-${t.x}`}
            style={{
              position: 'absolute',
              left: t.x,
              bottom: 0,
              borderLeft: '1px solid rgba(15,23,42,0.18)',
              height: t.major ? 10 : 5,
              fontSize: 9,
              color: '#64748b',
              paddingLeft: 2,
              lineHeight: 1,
            }}
          >
            {t.major ? t.label : ''}
          </span>
        ))}
      </div>
      <div
        className="builder-editor-ruler builder-editor-ruler-v"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: -22,
          width: 22,
          height,
          pointerEvents: 'none',
          transformOrigin: '0 0',
          transform: `scaleY(${zoom})`,
        }}
      >
        {verticalTicks.map((t) => (
          <span
            key={`v-${t.y}`}
            style={{
              position: 'absolute',
              top: t.y,
              right: 0,
              borderTop: '1px solid rgba(15,23,42,0.18)',
              width: t.major ? 10 : 5,
              fontSize: 9,
              color: '#64748b',
              paddingTop: 2,
              lineHeight: 1,
              textAlign: 'right',
              boxSizing: 'border-box',
              paddingRight: 4,
              minWidth: 22,
            }}
          >
            {t.major ? t.label : ''}
          </span>
        ))}
      </div>
    </>
  );
}
