import {
  useCallback,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  makeGuideId,
  saveAndBroadcastEditorPreferences,
  type EditorPreferences,
  type ReferenceGuide,
} from '@/lib/builder/canvas/editor-prefs';

type CanvasPointResolver = (clientX: number, clientY: number) => { x: number; y: number };
type UpdateEditorPrefs = (
  updater: (current: EditorPreferences) => EditorPreferences,
  options?: { persist?: boolean },
) => void;

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
  const createReferenceGuide = useCallback((axis: ReferenceGuide['axis'], position: number) => {
    const boundedPosition = axis === 'vertical'
      ? Math.max(0, Math.min(stageWidth, position))
      : Math.max(0, Math.min(stageHeight, position));
    const guide: ReferenceGuide = {
      id: makeGuideId(),
      axis,
      position: boundedPosition,
      label: `${axis === 'vertical' ? 'X' : 'Y'} ${Math.round(boundedPosition)}px`,
      color: '#e11d48',
    };
    updateEditorPrefs((current) => ({
      ...current,
      referenceGuides: [...current.referenceGuides, guide],
    }));
    onActivity?.(`Guide added: ${guide.label}`);
  }, [onActivity, stageHeight, stageWidth, updateEditorPrefs]);

  const removeReferenceGuide = useCallback((guideId: string) => {
    updateEditorPrefs((current) => ({
      ...current,
      referenceGuides: current.referenceGuides.filter((guide) => guide.id !== guideId),
    }));
  }, [updateEditorPrefs]);

  const startReferenceGuideDrag = useCallback((guide: ReferenceGuide, event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const pointerId = event.pointerId;
    const moveGuide = (clientX: number, clientY: number) => {
      const point = resolveCanvasPoint(clientX, clientY);
      const position = guide.axis === 'vertical'
        ? Math.max(0, Math.min(stageWidth, point.x))
        : Math.max(0, Math.min(stageHeight, point.y));
      updateEditorPrefs((current) => ({
        ...current,
        referenceGuides: current.referenceGuides.map((item) => (
          item.id === guide.id
            ? {
                ...item,
                position,
                label: `${guide.axis === 'vertical' ? 'X' : 'Y'} ${Math.round(position)}px`,
              }
            : item
        )),
      }), { persist: false });
    };

    function handlePointerMove(pointerEvent: PointerEvent) {
      if (pointerEvent.pointerId !== pointerId) return;
      moveGuide(pointerEvent.clientX, pointerEvent.clientY);
    }

    function handlePointerUp(pointerEvent: PointerEvent) {
      if (pointerEvent.pointerId !== pointerId) return;
      moveGuide(pointerEvent.clientX, pointerEvent.clientY);
      saveAndBroadcastEditorPreferences(editorPrefsRef.current);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [editorPrefsRef, resolveCanvasPoint, stageHeight, stageWidth, updateEditorPrefs]);

  return {
    createReferenceGuide,
    removeReferenceGuide,
    startReferenceGuideDrag,
  };
}
