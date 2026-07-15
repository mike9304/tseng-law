'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

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

export function isOwnedInteractionPointer(pointerId: number, ownerPointerId: number): boolean {
  return pointerId === ownerPointerId;
}

export type CanvasRotationOwnerToken = object;

type CanvasRotationOwner = {
  token: CanvasRotationOwnerToken;
  cancel: () => void;
};

export function createCanvasRotationOwnerCoordinator() {
  let activeOwner: CanvasRotationOwner | null = null;

  return {
    takeover(token: CanvasRotationOwnerToken, cancel: () => void) {
      const previousOwner = activeOwner;
      if (previousOwner?.token === token) {
        activeOwner = { token, cancel };
        return;
      }
      if (previousOwner) {
        previousOwner.cancel();
        if (activeOwner === previousOwner) activeOwner = null;
      }
      activeOwner = { token, cancel };
    },
    release(token: CanvasRotationOwnerToken): boolean {
      if (activeOwner?.token !== token) return false;
      activeOwner = null;
      return true;
    },
    cancelActive(): boolean {
      const owner = activeOwner;
      if (!owner) return false;
      owner.cancel();
      if (activeOwner === owner) activeOwner = null;
      return true;
    },
  };
}

export type CanvasRotationOwnerCoordinator = ReturnType<typeof createCanvasRotationOwnerCoordinator>;

export const CanvasRotationOwnerContext = createContext<CanvasRotationOwnerCoordinator | null>(null);

type RotationPointerSession = {
  pointerId: number;
  startAngle: number;
  startRotation: number;
  currentRotation: number;
};

export function createRotationPointerSessionController(initialRotation: number) {
  let effectiveRotation = initialRotation;
  let activeSession: RotationPointerSession | null = null;

  return {
    syncRotation(rotation: number) {
      if (!activeSession) effectiveRotation = rotation;
    },
    begin(pointerId: number, startAngle: number): number | null {
      if (activeSession) return null;
      activeSession = {
        pointerId,
        startAngle,
        startRotation: effectiveRotation,
        currentRotation: effectiveRotation,
      };
      return effectiveRotation;
    },
    move(pointerId: number, currentAngle: number, snapToFifteenDegrees: boolean): number | null {
      if (!activeSession || !isOwnedInteractionPointer(pointerId, activeSession.pointerId)) return null;
      const rawDegrees = activeSession.startRotation + (currentAngle - activeSession.startAngle);
      const nextDegrees = snapToFifteenDegrees ? Math.round(rawDegrees / 15) * 15 : Math.round(rawDegrees);
      const normalized = ((nextDegrees % 360) + 360) % 360;
      activeSession.currentRotation = normalized;
      return normalized;
    },
    terminate(mode: 'commit' | 'cancel', pointerId?: number): boolean {
      if (!activeSession) return false;
      if (pointerId !== undefined && !isOwnedInteractionPointer(pointerId, activeSession.pointerId)) return false;
      effectiveRotation = mode === 'commit'
        ? activeSession.currentRotation
        : activeSession.startRotation;
      activeSession = null;
      return true;
    },
  };
}

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
  const readoutClearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRotationCleanupRef = useRef<(() => void) | null>(null);
  const mountedRef = useRef(true);
  const providedRotationOwnerCoordinator = useContext(CanvasRotationOwnerContext);
  const localRotationOwnerCoordinatorRef = useRef<CanvasRotationOwnerCoordinator | null>(null);
  if (!localRotationOwnerCoordinatorRef.current) {
    localRotationOwnerCoordinatorRef.current = createCanvasRotationOwnerCoordinator();
  }
  const rotationOwnerCoordinator = providedRotationOwnerCoordinator ?? localRotationOwnerCoordinatorRef.current;
  const rotationSessionControllerRef = useRef<ReturnType<typeof createRotationPointerSessionController> | null>(null);
  if (!rotationSessionControllerRef.current) {
    rotationSessionControllerRef.current = createRotationPointerSessionController(rotation);
  }
  const rotationSessionController = rotationSessionControllerRef.current;
  rotationSessionController.syncRotation(rotation);

  useIsomorphicLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      activeRotationCleanupRef.current?.();
      activeRotationCleanupRef.current = null;
      if (readoutClearTimer.current) {
        clearTimeout(readoutClearTimer.current);
      }
    };
  }, []);

  const handleRotationPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
      event.preventDefault();
      const targetEl = nodeRef.current;
      if (!targetEl) return;
      activeRotationCleanupRef.current?.();
      if (readoutClearTimer.current) {
        clearTimeout(readoutClearTimer.current);
        readoutClearTimer.current = null;
      }
      const activeEl = targetEl;
      const rect = activeEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
      const startRotation = rotationSessionController.begin(event.pointerId, startAngle);
      if (startRotation === null) return;
      const rotationOwnerToken: CanvasRotationOwnerToken = {};
      setRotationReadout({
        degrees: Math.round(((startRotation % 360) + 360) % 360),
        x: event.clientX - rect.left + 14,
        y: event.clientY - rect.top - 30,
      });
      let didCleanup = false;

      function handlePointerMove(moveEvent: PointerEvent) {
        const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * (180 / Math.PI);
        const normalized = rotationSessionController.move(moveEvent.pointerId, currentAngle, moveEvent.shiftKey);
        if (normalized === null) return;
        setRotationReadout({
          degrees: normalized,
          x: moveEvent.clientX - rect.left + 14,
          y: moveEvent.clientY - rect.top - 30,
        });
        updateNode(nodeId, (node) => ({ ...node, rotation: normalized }), 'transient');
      }

      function cleanupRotationDrag(mode: 'commit' | 'cancel') {
        if (didCleanup) return;
        didCleanup = true;
        const didTerminate = rotationSessionController.terminate(mode, event.pointerId);
        const didReleaseOwner = didTerminate && rotationOwnerCoordinator.release(rotationOwnerToken);
        if (activeRotationCleanupRef.current === cancelThisRotation) {
          activeRotationCleanupRef.current = null;
        }
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerCancel);
        window.removeEventListener('keydown', handleKeyDown, true);
        activeEl.removeEventListener('lostpointercapture', handleLostPointerCapture);
        try {
          if (activeEl.hasPointerCapture(event.pointerId)) {
            activeEl.releasePointerCapture(event.pointerId);
          }
        } catch {
          // Ignore capture cleanup races when the browser has already released it.
        }
        if (!didTerminate) return;
        if (mode === 'cancel') {
          if (mountedRef.current) setRotationReadout(null);
        } else if (mountedRef.current) {
          readoutClearTimer.current = setTimeout(() => {
            setRotationReadout(null);
            readoutClearTimer.current = null;
          }, 900);
        }
        if (!didReleaseOwner) return;
        if (mode === 'commit') {
          commitMutationSession();
        } else {
          cancelMutationSession();
        }
      }

      function handlePointerUp(upEvent: PointerEvent) {
        if (!isOwnedInteractionPointer(upEvent.pointerId, event.pointerId)) return;
        cleanupRotationDrag('commit');
      }

      function handlePointerCancel(cancelEvent: PointerEvent) {
        if (!isOwnedInteractionPointer(cancelEvent.pointerId, event.pointerId)) return;
        cleanupRotationDrag('cancel');
      }

      function handleKeyDown(keyEvent: KeyboardEvent) {
        if (keyEvent.key !== 'Escape') return;
        keyEvent.preventDefault();
        keyEvent.stopPropagation();
        cleanupRotationDrag('cancel');
      }

      function handleLostPointerCapture(captureEvent: PointerEvent) {
        if (!isOwnedInteractionPointer(captureEvent.pointerId, event.pointerId)) return;
        cleanupRotationDrag('cancel');
      }

      function cancelThisRotation() {
        cleanupRotationDrag('cancel');
      }

      rotationOwnerCoordinator.takeover(rotationOwnerToken, cancelThisRotation);
      beginMutationSession();
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerCancel);
      window.addEventListener('keydown', handleKeyDown, true);
      activeEl.addEventListener('lostpointercapture', handleLostPointerCapture);
      activeRotationCleanupRef.current = cancelThisRotation;
      try {
        activeEl.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is best effort; window-level listeners keep rotation dragging stable.
      }
    },
    [
      nodeId,
      nodeRef,
      beginMutationSession,
      cancelMutationSession,
      commitMutationSession,
      rotationOwnerCoordinator,
      rotationSessionController,
      updateNode,
    ],
  );

  return { rotationReadout, handleRotationPointerDown };
}
