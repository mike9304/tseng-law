import {
  useCallback,
  useState,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  addReferenceGuideToPrefs,
  boundGuidePosition,
  createReferenceGuideEntry,
  describeGuideLabel,
  makeGuideId,
  REFERENCE_GUIDE_COLOR,
  removeReferenceGuideFromPrefs,
  repositionReferenceGuideInPrefs,
  saveAndBroadcastEditorPreferences,
  type EditorPreferences,
  type ReferenceGuide,
} from '@/lib/builder/canvas/editor-prefs';

type Axis = ReferenceGuide['axis'];
type Point = { x: number; y: number };
type CanvasPointResolver = (clientX: number, clientY: number) => Point;
type UpdateEditorPrefs = (
  updater: (current: EditorPreferences) => EditorPreferences,
  options?: { persist?: boolean },
) => void;

/**
 * Screen-space forgiveness margin around each ruler strip. Releasing within
 * this many pixels of a ruler strip (extending INTO the stage) is treated as
 * "dropped on the ruler" → cancel creation / delete an existing guide. The
 * ruler strip itself is only ~12/zoom px tall, so a bare hit-test would make
 * the drop target frustratingly thin; this threshold widens it predictably.
 */
export const GUIDE_DELETE_RULER_THRESHOLD_PX = 14;

type EdgeRect = { left: number; top: number; right: number; bottom: number };

function rulerRect(selector: string): EdgeRect | null {
  if (typeof document === 'undefined') return null;
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  // jsdom returns all-zero rects; treat those as "no ruler geometry available".
  if (rect.right - rect.left <= 0 && rect.bottom - rect.top <= 0) return null;
  return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
}

/**
 * True when the pointer is within {@link GUIDE_DELETE_RULER_THRESHOLD_PX} of a
 * ruler strip's stage-facing edge. The threshold extends the ruler's hit area
 * inward (toward the canvas), so a vertical guide dropped just below the top
 * ruler still counts as "on the ruler". Uses the ruler's real screen rect, so
 * it stays correct under arbitrary zoom/pan.
 */
export function isReleaseWithinRulerDeleteZone(
  clientX: number,
  clientY: number,
  threshold: number = GUIDE_DELETE_RULER_THRESHOLD_PX,
): boolean {
  const top = rulerRect('[data-builder-ruler="top"]');
  if (top && clientX >= top.left && clientX <= top.right
    && clientY >= top.top && clientY <= top.bottom + threshold) {
    return true;
  }
  const left = rulerRect('[data-builder-ruler="left"]');
  if (left && clientY >= left.top && clientY <= left.bottom
    && clientX >= left.left && clientX <= left.right + threshold) {
    return true;
  }
  return false;
}

/**
 * A guide drag/release is considered "inside the canvas" (commit/reposition)
 * when the pointer is over the stage ([data-builder-canvas-viewport]) but NOT
 * over a ruler strip ([data-builder-ruler]) and NOT within the near-ruler
 * delete threshold. Releasing over a ruler, near a ruler, or outside the stage
 * cancels creation / deletes an existing guide (Wix parity).
 *
 * DOM hit-test based so it stays correct under arbitrary zoom/pan.
 */
export function isGuideReleaseInsideCanvas(clientX: number, clientY: number): boolean {
  if (typeof document === 'undefined') return true;
  const hit = document.elementFromPoint(clientX, clientY);
  if (!hit) return false;
  if (hit.closest('[data-builder-ruler]')) return false;
  if (isReleaseWithinRulerDeleteZone(clientX, clientY)) return false;
  return Boolean(hit.closest('[data-builder-canvas-viewport]'));
}

export function useCanvasReferenceGuides({
  editorPrefsRef,
  onActivity,
  resolveCanvasPoint,
  stageHeight,
  stageWidth,
  updateEditorPrefs,
}: {
  editorPrefsRef: MutableRefObject<EditorPreferences>;
  onActivity?: (message: string) => void;
  resolveCanvasPoint: CanvasPointResolver;
  stageHeight: number;
  stageWidth: number;
  updateEditorPrefs: UpdateEditorPrefs;
}) {
  // Ephemeral live-preview guide shown while dragging out of a ruler, before
  // the user commits by releasing inside the canvas. Not persisted.
  const [draftGuide, setDraftGuide] = useState<ReferenceGuide | null>(null);

  const createReferenceGuide = useCallback((axis: Axis, position: number) => {
    const guide = createReferenceGuideEntry(axis, position, stageWidth, stageHeight);
    updateEditorPrefs((current) => addReferenceGuideToPrefs(current, guide));
    onActivity?.(`Guide added: ${guide.label}`);
  }, [onActivity, stageHeight, stageWidth, updateEditorPrefs]);

  const removeReferenceGuide = useCallback((guideId: string) => {
    updateEditorPrefs((current) => removeReferenceGuideFromPrefs(current, guideId));
  }, [updateEditorPrefs]);

  // --- Ruler drag-to-create: live preview -> commit (release in canvas) / cancel ---

  const beginRulerGuideDrag = useCallback((axis: Axis) => {
    setDraftGuide({
      id: makeGuideId(),
      axis,
      position: 0,
      label: describeGuideLabel(axis, 0),
      color: REFERENCE_GUIDE_COLOR,
    });
  }, []);

  const updateDraftGuidePosition = useCallback((axis: Axis, clientX: number, clientY: number) => {
    const point = resolveCanvasPoint(clientX, clientY);
    const raw = axis === 'vertical' ? point.x : point.y;
    const position = boundGuidePosition(axis, raw, stageWidth, stageHeight);
    setDraftGuide((current) => (
      current && current.axis === axis
        ? { ...current, position, label: describeGuideLabel(axis, position) }
        : current
    ));
  }, [resolveCanvasPoint, stageHeight, stageWidth]);

  const commitRulerGuideDraft = useCallback((axis: Axis, clientX: number, clientY: number) => {
    const point = resolveCanvasPoint(clientX, clientY);
    const guide = createReferenceGuideEntry(
      axis,
      axis === 'vertical' ? point.x : point.y,
      stageWidth,
      stageHeight,
    );
    updateEditorPrefs((current) => addReferenceGuideToPrefs(current, guide));
    setDraftGuide(null);
    onActivity?.(`Guide added: ${guide.label}`);
  }, [onActivity, resolveCanvasPoint, stageHeight, stageWidth, updateEditorPrefs]);

  const cancelRulerGuideDraft = useCallback(() => {
    setDraftGuide(null);
  }, []);

  // --- Existing guide drag: reposition, or delete when released over a ruler ---

  const startReferenceGuideDrag = useCallback((
    guide: ReferenceGuide,
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const pointerId = event.pointerId;

    const moveGuide = (clientX: number, clientY: number) => {
      const point = resolveCanvasPoint(clientX, clientY);
      const position = guide.axis === 'vertical' ? point.x : point.y;
      updateEditorPrefs(
        (current) => repositionReferenceGuideInPrefs(current, guide.id, position, stageWidth, stageHeight),
        { persist: false },
      );
    };

    function handlePointerMove(pointerEvent: PointerEvent) {
      if (pointerEvent.pointerId !== pointerId) return;
      moveGuide(pointerEvent.clientX, pointerEvent.clientY);
    }

    function handlePointerUp(pointerEvent: PointerEvent) {
      if (pointerEvent.pointerId !== pointerId) return;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (isGuideReleaseInsideCanvas(pointerEvent.clientX, pointerEvent.clientY)) {
        moveGuide(pointerEvent.clientX, pointerEvent.clientY);
        saveAndBroadcastEditorPreferences(editorPrefsRef.current);
      } else {
        // Released over a ruler (or outside the stage): delete the guide.
        updateEditorPrefs((current) => removeReferenceGuideFromPrefs(current, guide.id));
        onActivity?.(`Guide removed: ${guide.label ?? 'guide'}`);
      }
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [editorPrefsRef, onActivity, resolveCanvasPoint, stageHeight, stageWidth, updateEditorPrefs]);

  return {
    createReferenceGuide,
    removeReferenceGuide,
    startReferenceGuideDrag,
    draftGuide,
    beginRulerGuideDrag,
    updateDraftGuidePosition,
    commitRulerGuideDraft,
    cancelRulerGuideDraft,
  };
}
