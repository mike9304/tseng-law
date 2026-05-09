'use client';

import {
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

type RotationReadout = { degrees: number; x: number; y: number } | null;

type UpdateNode = (
  nodeId: string,
  updater: (node: BuilderCanvasNode) => BuilderCanvasNode,
  mode?: 'commit' | 'transient',
) => void;

type UseCanvasNodeRotationArgs = {
  nodeId: string;
  rotation: number;
  nodeRef: RefObject<HTMLDivElement | null>;
  updateNode: UpdateNode;
  beginMutationSession: () => void;
  commitMutationSession: () => void;
  cancelMutationSession: () => void;
};

export function useCanvasNodeRotation({
  nodeId,
  rotation,
  nodeRef,
  updateNode,
  beginMutationSession,
  commitMutationSession,
  cancelMutationSession,
}: UseCanvasNodeRotationArgs) {
  const [rotationReadout, setRotationReadout] = useState<RotationReadout>(null);
  const rotationDrag = useRef<{ startAngle: number; startRotation: number } | null>(null);

  const handleRotationPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
      event.preventDefault();
      const targetEl = nodeRef.current;
      if (!targetEl) return;
      const activeEl = targetEl;
      const rect = activeEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
      rotationDrag.current = { startAngle, startRotation: rotation };
      setRotationReadout({
        degrees: Math.round(((rotation % 360) + 360) % 360),
        x: event.clientX - rect.left + 14,
        y: event.clientY - rect.top - 30,
      });
      try {
        activeEl.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is best effort; window-level listeners keep rotation dragging stable.
      }
      beginMutationSession();
      let didCleanup = false;

      function handlePointerMove(moveEvent: PointerEvent) {
        if (!rotationDrag.current) return;
        const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * (180 / Math.PI);
        const rawDegrees = rotationDrag.current.startRotation + (currentAngle - rotationDrag.current.startAngle);
        const nextDegrees = moveEvent.shiftKey ? Math.round(rawDegrees / 15) * 15 : Math.round(rawDegrees);
        const normalized = ((nextDegrees % 360) + 360) % 360;
        setRotationReadout({
          degrees: normalized,
          x: moveEvent.clientX - rect.left + 14,
          y: moveEvent.clientY - rect.top - 30,
        });
        updateNode(nodeId, (node) => ({ ...node, rotation: normalized }), 'transient');
      }

      function cleanupRotationDrag(mode: 'commit' | 'cancel', pointerId = event.pointerId) {
        if (didCleanup) return;
        didCleanup = true;
        rotationDrag.current = null;
        setRotationReadout(null);
        try {
          if (activeEl.hasPointerCapture(pointerId)) {
            activeEl.releasePointerCapture(pointerId);
          }
        } catch {
          // Ignore capture cleanup races when the browser has already released it.
        }
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerCancel);
        window.removeEventListener('keydown', handleKeyDown, true);
        if (mode === 'commit') {
          commitMutationSession();
        } else {
          cancelMutationSession();
        }
      }

      function handlePointerUp(upEvent: PointerEvent) {
        cleanupRotationDrag('commit', upEvent.pointerId);
      }

      function handlePointerCancel(cancelEvent: PointerEvent) {
        cleanupRotationDrag('cancel', cancelEvent.pointerId);
      }

      function handleKeyDown(keyEvent: KeyboardEvent) {
        if (keyEvent.key !== 'Escape') return;
        keyEvent.preventDefault();
        keyEvent.stopPropagation();
        cleanupRotationDrag('cancel');
      }

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerCancel);
      window.addEventListener('keydown', handleKeyDown, true);
    },
    [
      nodeId,
      rotation,
      nodeRef,
      beginMutationSession,
      cancelMutationSession,
      commitMutationSession,
      updateNode,
    ],
  );

  return { rotationReadout, handleRotationPointerDown };
}
