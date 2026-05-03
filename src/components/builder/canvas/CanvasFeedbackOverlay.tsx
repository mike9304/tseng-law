'use client';

import type { ZoomState } from '@/lib/builder/canvas/zoom';
import DragGhost, { type OverlayRect } from './DragGhost';
import MultiSelectionBoundingBox from './MultiSelectionBoundingBox';
import ResizeReadout from './ResizeReadout';
import SnapDistanceLabel from './SnapDistanceLabel';

interface CanvasFeedbackOverlayProps {
  interactionMode: 'move' | 'resize' | null;
  startRects: OverlayRect[];
  currentRects: OverlayRect[];
  resizeRect: OverlayRect | null;
  resizePointer: { x: number; y: number } | null;
  multiSelectionBbox: OverlayRect | null;
  selectedCount: number;
  snapActiveRect: OverlayRect | null;
  snapOtherRects: OverlayRect[];
  zoomState: Pick<ZoomState, 'zoom' | 'panX' | 'panY'>;
}

export default function CanvasFeedbackOverlay({
  interactionMode,
  startRects,
  currentRects,
  resizeRect,
  resizePointer,
  multiSelectionBbox,
  selectedCount,
  snapActiveRect,
  snapOtherRects,
  zoomState,
}: CanvasFeedbackOverlayProps) {
  const { zoom, panX, panY } = zoomState;

  return (
    <>
      {interactionMode ? (
        <DragGhost
          mode={interactionMode}
          startRects={startRects}
          currentRects={currentRects}
          zoom={zoom}
          panX={panX}
          panY={panY}
        />
      ) : null}
      {interactionMode === 'resize' ? (
        <ResizeReadout
          currentRect={resizeRect}
          pointer={resizePointer}
          zoom={zoom}
          panX={panX}
          panY={panY}
        />
      ) : null}
      {!interactionMode ? (
        <MultiSelectionBoundingBox bbox={multiSelectionBbox} selectedCount={selectedCount} />
      ) : null}
      {interactionMode ? (
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
