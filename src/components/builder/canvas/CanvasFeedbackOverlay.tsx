'use client';

import { memo } from 'react';
import DragGhost, { type OverlayRect } from './DragGhost';
import MultiSelectionBoundingBox from './MultiSelectionBoundingBox';
import ResizeReadout from './ResizeReadout';
import SnapDistanceLabel from './SnapDistanceLabel';
import type { Locale } from '@/lib/locales';

interface CanvasFeedbackOverlayProps {
  interactionMode: 'move' | 'resize' | null;
  startRects: OverlayRect[];
  currentRects: OverlayRect[];
  locale?: Locale;
  resizeRect: OverlayRect | null;
  resizePointer: { x: number; y: number } | null;
  multiSelectionBbox: OverlayRect | null;
  selectedCount: number;
  snapActiveRect: OverlayRect | null;
  snapOtherRects: OverlayRect[];
  zoom: number;
  panX: number;
  panY: number;
}

function CanvasFeedbackOverlay({
  interactionMode,
  startRects,
  currentRects,
  locale,
  resizeRect,
  resizePointer,
  multiSelectionBbox,
  selectedCount,
  snapActiveRect,
  snapOtherRects,
  zoom,
  panX,
  panY,
}: CanvasFeedbackOverlayProps) {
  const dragGhostMode = interactionMode && startRects.length > 0 ? interactionMode : null;
  const shouldRenderResizeReadout = Boolean(interactionMode === 'resize' && resizeRect);
  const shouldRenderMultiSelectionBbox = Boolean(!interactionMode && multiSelectionBbox && selectedCount >= 2);
  const shouldRenderSnapDistanceLabel = Boolean(
    interactionMode && snapActiveRect && snapOtherRects.length > 0,
  );

  return (
    <>
      {dragGhostMode ? (
        <DragGhost
          mode={dragGhostMode}
          startRects={startRects}
          currentRects={currentRects}
          zoom={zoom}
          panX={panX}
          panY={panY}
        />
      ) : null}
      {shouldRenderResizeReadout ? (
        <ResizeReadout
          currentRect={resizeRect}
          pointer={resizePointer}
          zoom={zoom}
          panX={panX}
          panY={panY}
        />
      ) : null}
      {shouldRenderMultiSelectionBbox ? (
        <MultiSelectionBoundingBox
          bbox={multiSelectionBbox}
          locale={locale}
          selectedCount={selectedCount}
        />
      ) : null}
      {shouldRenderSnapDistanceLabel ? (
        <SnapDistanceLabel
          activeRect={snapActiveRect}
          otherRects={snapOtherRects}
          zoom={zoom}
          panX={panX}
          panY={panY}
        />
      ) : null}
    </>
  );
}

export default memo(CanvasFeedbackOverlay);
