import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { AnimationPreviewPhase } from '@/lib/builder/animations/animation-render';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderRichText } from '@/lib/builder/rich-text/types';

export function useCanvasNodeInlineEditing({
  nodeId,
  nodeKind,
  nodeLocked,
  enterGroup,
  onUpdateContent,
  onInlineEditingChange,
  onBeforeStartEditing,
}: {
  nodeId: string;
  nodeKind: BuilderCanvasNode['kind'];
  nodeLocked: boolean | undefined;
  enterGroup: (nodeId: string) => void;
  onUpdateContent?: (nodeId: string, content: Record<string, unknown>) => void;
  onInlineEditingChange?: (nodeId: string, editing: boolean) => void;
  onBeforeStartEditing?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const isTextKind = nodeKind === 'text' || nodeKind === 'heading';

  const handleDoubleClick = useCallback(() => {
    if (nodeLocked) return;
    if (nodeKind === 'composite') {
      enterGroup(nodeId);
      setIsEditing(false);
      return;
    }
    if (isTextKind) {
      onBeforeStartEditing?.();
      setIsEditing(true);
    }
  }, [enterGroup, isTextKind, nodeId, nodeKind, nodeLocked, onBeforeStartEditing]);

  const handleInlineSave = useCallback(
    (payload: { richText: BuilderRichText; plainText: string }) => {
      onUpdateContent?.(nodeId, {
        text: payload.plainText,
        richText: payload.richText,
      });
    },
    [nodeId, onUpdateContent],
  );

  const handleInlineBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  useEffect(() => {
    if (!isTextKind) return undefined;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ nodeId?: string }>).detail;
      if (detail?.nodeId === nodeId && !nodeLocked) {
        onBeforeStartEditing?.();
        setIsEditing(true);
      }
    };
    document.addEventListener('builder:start-text-edit', handler);
    return () => document.removeEventListener('builder:start-text-edit', handler);
  }, [isTextKind, nodeId, nodeLocked, onBeforeStartEditing]);

  useEffect(() => {
    if (!isTextKind) return undefined;
    onInlineEditingChange?.(nodeId, isEditing);
    return () => {
      if (isEditing) onInlineEditingChange?.(nodeId, false);
    };
  }, [isEditing, isTextKind, nodeId, onInlineEditingChange]);

  return {
    handleDoubleClick,
    handleInlineBlur,
    handleInlineSave,
    isEditing,
    isTextKind,
  };
}

export function useCanvasNodeTouchContextMenu({
  isInteractive,
  nodeLocked,
}: {
  isInteractive: boolean;
  nodeLocked: boolean | undefined;
}) {
  const touchContextMenuRef = useRef<{
    timerId: number;
    pointerId: number;
    clientX: number;
    clientY: number;
  } | null>(null);

  const clearTouchContextMenu = useCallback(() => {
    const pending = touchContextMenuRef.current;
    if (!pending) return;
    window.clearTimeout(pending.timerId);
    touchContextMenuRef.current = null;
  }, []);

  const cancelTouchContextMenuOnMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const pending = touchContextMenuRef.current;
      if (!pending || pending.pointerId !== event.pointerId) return;
      const distance = Math.hypot(event.clientX - pending.clientX, event.clientY - pending.clientY);
      if (distance > 8) clearTouchContextMenu();
    },
    [clearTouchContextMenu],
  );

  useEffect(() => () => clearTouchContextMenu(), [clearTouchContextMenu]);

  const scheduleTouchContextMenu = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== 'touch' || nodeLocked || !isInteractive) return;
      clearTouchContextMenu();
      const target = event.currentTarget;
      const { pointerId, clientX, clientY } = event;
      const timerId = window.setTimeout(() => {
        target.dispatchEvent(new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          button: 2,
          clientX,
          clientY,
        }));
        touchContextMenuRef.current = null;
      }, 560);
      touchContextMenuRef.current = { timerId, pointerId, clientX, clientY };
    },
    [clearTouchContextMenu, isInteractive, nodeLocked],
  );

  return {
    cancelTouchContextMenuOnMove,
    clearTouchContextMenu,
    scheduleTouchContextMenu,
  };
}

export function useCanvasNodeAnimationPreview({
  animation,
  nodeId,
  nodeLocked,
}: {
  animation: BuilderCanvasNode['animation'];
  nodeId: string;
  nodeLocked: boolean | undefined;
}): AnimationPreviewPhase {
  const [animationPreviewPhase, setAnimationPreviewPhase] = useState<AnimationPreviewPhase>(null);
  const previewEntrancePreset = animation?.entrance?.preset ?? 'none';
  const previewEntranceDuration = animation?.entrance?.duration ?? 600;
  const previewEntranceDelay = animation?.entrance?.delay ?? 0;

  useEffect(() => {
    let timeoutId: number | undefined;
    let firstFrameId: number | undefined;
    let secondFrameId: number | undefined;

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ nodeId?: string }>).detail;
      if (detail?.nodeId !== nodeId || nodeLocked || previewEntrancePreset === 'none') return;

      if (timeoutId) window.clearTimeout(timeoutId);
      if (firstFrameId) window.cancelAnimationFrame(firstFrameId);
      if (secondFrameId) window.cancelAnimationFrame(secondFrameId);

      setAnimationPreviewPhase('initial');
      firstFrameId = window.requestAnimationFrame(() => {
        secondFrameId = window.requestAnimationFrame(() => {
          setAnimationPreviewPhase('visible');
        });
      });
      timeoutId = window.setTimeout(
        () => setAnimationPreviewPhase(null),
        previewEntranceDuration + previewEntranceDelay + 180,
      );
    };

    document.addEventListener('builder:play-animation-preview', handler);
    return () => {
      document.removeEventListener('builder:play-animation-preview', handler);
      if (timeoutId) window.clearTimeout(timeoutId);
      if (firstFrameId) window.cancelAnimationFrame(firstFrameId);
      if (secondFrameId) window.cancelAnimationFrame(secondFrameId);
    };
  }, [
    nodeId,
    nodeLocked,
    previewEntranceDelay,
    previewEntranceDuration,
    previewEntrancePreset,
  ]);

  return animationPreviewPhase;
}
