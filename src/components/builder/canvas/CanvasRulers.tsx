'use client';

import type { PointerEvent } from 'react';
import styles from './SandboxPage.module.css';

type CanvasRulersProps = {
  onCreateGuide?: (axis: 'horizontal' | 'vertical', position: number) => void;
  stageHeight: number;
  stageWidth: number;
  zoom: number;
};

export default function CanvasRulers({ onCreateGuide, stageHeight, stageWidth, zoom }: CanvasRulersProps) {
  const handleTopPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!onCreateGuide || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const scale = rect.width > 0 ? rect.width / stageWidth : zoom;
    onCreateGuide('vertical', Math.max(0, Math.min(stageWidth, Math.round((event.clientX - rect.left) / scale))));
  };

  const handleLeftPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!onCreateGuide || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const scale = rect.height > 0 ? rect.height / stageHeight : zoom;
    onCreateGuide('horizontal', Math.max(0, Math.min(stageHeight, Math.round((event.clientY - rect.top) / scale))));
  };

  return (
    <>
      <div
        className={styles.topRuler}
        data-builder-ruler="top"
        data-builder-floating-ui="true"
        aria-label="Horizontal ruler"
        role="presentation"
        style={{ minHeight: 12 / Math.max(zoom, 0.1), pointerEvents: onCreateGuide ? 'auto' : 'none', zIndex: 10020 }}
        onPointerDown={handleTopPointerDown}
      >
        {Array.from({ length: Math.floor(stageWidth / 40) + 1 }).map((_, index) => (
          <span
            key={`top-${index}`}
            className={styles.rulerMark}
            style={{ left: `${index * 40}px` }}
          >
            {index * 40}
          </span>
        ))}
      </div>
      <div
        className={styles.leftRuler}
        data-builder-ruler="left"
        data-builder-floating-ui="true"
        aria-label="Vertical ruler"
        role="presentation"
        style={{ minWidth: 12 / Math.max(zoom, 0.1), pointerEvents: onCreateGuide ? 'auto' : 'none', zIndex: 10020 }}
        onPointerDown={handleLeftPointerDown}
      >
        {Array.from({ length: Math.floor(stageHeight / 40) + 1 }).map((_, index) => (
          <span
            key={`left-${index}`}
            className={`${styles.rulerMark} ${styles.rulerMarkVertical}`}
            style={{ top: `${index * 40}px` }}
          >
            {index * 40}
          </span>
        ))}
      </div>
    </>
  );
}
