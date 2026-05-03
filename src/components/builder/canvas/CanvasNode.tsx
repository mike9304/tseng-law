'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { getComponent } from '@/lib/builder/components/registry';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { isContainerLikeKind } from '@/lib/builder/canvas/types';
import type { BuilderRichText } from '@/lib/builder/rich-text/types';
import { isBuilderRichText, richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import {
  resolveViewportFontSize,
  resolveViewportHidden,
  resolveViewportRect,
} from '@/lib/builder/canvas/responsive';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import {
  buildEditorAnimationStyle,
  getAnimationSummary,
  mergeCssTransforms,
  type AnimationPreviewPhase,
} from '@/lib/builder/animations/animation-render';
import {
  buildHoverTransform,
  resolveBackgroundStyle,
  resolveThemeColor,
  resolveThemeTextTypography,
} from '@/lib/builder/site/theme';
import InlineTextEditor from './InlineTextEditor';
import { linkValueFromLegacy } from '@/lib/builder/links';
import styles from './SandboxPage.module.css';

function nodeLinkPreviewHref(node: BuilderCanvasNode): string | null {
  const link = linkValueFromLegacy(
    (node.content as Parameters<typeof linkValueFromLegacy>[0]) || {},
  );
  return link?.href?.trim() ? link.href.trim() : null;
}

export type ResizeHandle =
  | 'nw'
  | 'n'
  | 'ne'
  | 'e'
  | 'sw'
  | 's'
  | 'w'
  | 'se';

interface CanvasNodeProps {
  node: BuilderCanvasNode;
  selected: boolean;
  onSelect: (nodeId: string, additive: boolean) => void;
  onContextMenu: (nodeId: string, event: React.MouseEvent<HTMLDivElement>) => void;
  onOpenAssetLibrary?: (nodeId: string) => void;
  onMoveStart: (nodeId: string, event: React.PointerEvent<HTMLDivElement>) => void;
  onResizeStart: (nodeId: string, handle: ResizeHandle, event: React.PointerEvent<HTMLButtonElement>) => void;
  onUpdateContent?: (nodeId: string, content: Record<string, unknown>) => void;
}

export default function CanvasNode({
  node,
  selected,
  onSelect,
  onContextMenu,
  onOpenAssetLibrary,
  onMoveStart,
  onResizeStart,
  onUpdateContent,
}: CanvasNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [rotationReadout, setRotationReadout] = useState<{ degrees: number; x: number; y: number } | null>(null);
  const [animationPreviewPhase, setAnimationPreviewPhase] = useState<AnimationPreviewPhase>(null);
  const component = getComponent(node.kind);
  const theme = useBuilderTheme();
  const nodeRef = useRef<HTMLDivElement>(null);
  const rotationDrag = useRef<{ startAngle: number; startRotation: number } | null>(null);
  const updateNode = useBuilderCanvasStore((s) => s.updateNode);
  const beginMutationSession = useBuilderCanvasStore((s) => s.beginMutationSession);
  const commitMutationSession = useBuilderCanvasStore((s) => s.commitMutationSession);
  const cancelMutationSession = useBuilderCanvasStore((s) => s.cancelMutationSession);
  const activeGroupId = useBuilderCanvasStore((s) => s.activeGroupId);
  const enterGroup = useBuilderCanvasStore((s) => s.enterGroup);
  const selectedNodeIds = useBuilderCanvasStore((s) => s.selectedNodeIds);
  const viewport = useBuilderCanvasStore((s) => s.viewport);
  const effectiveRect = resolveViewportRect(node, viewport);
  const isHiddenAtViewport = viewport !== 'desktop' && resolveViewportHidden(node, viewport);
  const effectiveFontSize = resolveViewportFontSize(node, viewport);

  const handleRotationPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
      event.preventDefault();
      const targetEl = nodeRef.current;
      if (!targetEl) return;
      const activeEl = targetEl;
      const rect = activeEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
      rotationDrag.current = { startAngle, startRotation: node.rotation };
      setRotationReadout({
        degrees: Math.round(((node.rotation % 360) + 360) % 360),
        x: event.clientX - rect.left + 14,
        y: event.clientY - rect.top - 30,
      });
      activeEl.setPointerCapture(event.pointerId);
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
        updateNode(node.id, (n) => ({ ...n, rotation: normalized }), 'transient');
      }

      function cleanupRotationDrag(mode: 'commit' | 'cancel', pointerId = event.pointerId) {
        if (didCleanup) return;
        didCleanup = true;
        rotationDrag.current = null;
        setRotationReadout(null);
        if (activeEl.hasPointerCapture(pointerId)) {
          activeEl.releasePointerCapture(pointerId);
        }
        activeEl.removeEventListener('pointermove', handlePointerMove);
        activeEl.removeEventListener('pointerup', handlePointerUp);
        activeEl.removeEventListener('pointercancel', handlePointerCancel);
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

      activeEl.addEventListener('pointermove', handlePointerMove);
      activeEl.addEventListener('pointerup', handlePointerUp);
      activeEl.addEventListener('pointercancel', handlePointerCancel);
      window.addEventListener('keydown', handleKeyDown, true);
    },
    [node.id, node.rotation, beginMutationSession, cancelMutationSession, commitMutationSession, updateNode],
  );

  const handleDoubleClick = useCallback(() => {
    if (node.locked) return;
    if (node.kind === 'composite') {
      enterGroup(node.id);
      setIsEditing(false);
      return;
    }
    if (node.kind === 'text' || node.kind === 'heading') {
      setIsEditing(true);
    }
  }, [enterGroup, node.id, node.kind, node.locked]);

  const handleInlineSave = useCallback(
    (payload: { richText: BuilderRichText; plainText: string }) => {
      onUpdateContent?.(node.id, {
        text: payload.plainText,
        richText: payload.richText,
      });
    },
    [node.id, onUpdateContent],
  );

  const handleInlineBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  useEffect(() => {
    if (node.kind !== 'text' && node.kind !== 'heading') return;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ nodeId?: string }>).detail;
      if (detail?.nodeId === node.id && !node.locked) {
        setIsEditing(true);
      }
    };
    document.addEventListener('builder:start-text-edit', handler);
    return () => document.removeEventListener('builder:start-text-edit', handler);
  }, [node.id, node.kind, node.locked]);

  const previewEntrancePreset = node.animation?.entrance?.preset ?? 'none';
  const previewEntranceDuration = node.animation?.entrance?.duration ?? 600;
  const previewEntranceDelay = node.animation?.entrance?.delay ?? 0;

  useEffect(() => {
    let timeoutId: number | undefined;
    let firstFrameId: number | undefined;
    let secondFrameId: number | undefined;

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ nodeId?: string }>).detail;
      if (detail?.nodeId !== node.id || node.locked || previewEntrancePreset === 'none') return;

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
    node.id,
    node.locked,
    previewEntranceDelay,
    previewEntranceDuration,
    previewEntrancePreset,
  ]);

  const isTextKind = node.kind === 'text' || node.kind === 'heading';
  const textContent = node.content as Record<string, unknown>;
  const initialRichText = isTextKind
    ? isBuilderRichText(textContent.richText)
      ? textContent.richText
      : richTextFromPlainText(typeof textContent.text === 'string' ? textContent.text : '')
    : undefined;
  const typography = isTextKind
    ? resolveThemeTextTypography(textContent as Parameters<typeof resolveThemeTextTypography>[0], theme)
    : null;
  const isActiveGroupFrame = activeGroupId === node.id;
  const isRootNode = !node.parentId;
  const isDimmedRoot = activeGroupId !== null && isRootNode && node.id !== activeGroupId;
  const isInteractive = !isDimmedRoot;
  const preservesHitTestLayer = node.kind === 'image' || node.kind === 'video-embed' || isContainerLikeKind(node.kind);
  const selectionZIndexBoost = selected && !preservesHitTestLayer ? 10000 : 0;
  const childrenMap = useBuilderCanvasStore((s) => s.childrenMap);
  const allNodes = useBuilderCanvasStore((s) => s.document?.nodes ?? []);
  const nodesById = new Map(allNodes.map((candidate) => [candidate.id, candidate]));
  const parentNode = node.parentId ? nodesById.get(node.parentId) : undefined;
  const parentLayoutMode = parentNode && isContainerLikeKind(parentNode.kind)
    ? (parentNode.content as { layoutMode?: 'absolute' | 'flex' | 'grid' }).layoutMode ?? 'absolute'
    : undefined;
  const parentUsesFlowLayout = parentLayoutMode === 'flex' || parentLayoutMode === 'grid';
  const childIds = childrenMap[node.id] ?? [];
  const nestedChildren = childIds
    .map((cid) => nodesById.get(cid))
    .filter((n): n is BuilderCanvasNode => n != null && n.visible);

  const renderNestedChildNodes = () =>
    nestedChildren.map((child) => {
      const isChildSelected = selectedNodeIds.includes(child.id);
      return (
        <CanvasNode
          key={child.id}
          node={child}
          selected={isChildSelected}
          onSelect={onSelect}
          onContextMenu={onContextMenu}
          onOpenAssetLibrary={onOpenAssetLibrary}
          onMoveStart={onMoveStart}
          onResizeStart={onResizeStart}
          onUpdateContent={onUpdateContent}
        />
      );
    });

  const body = isEditing && isTextKind ? (
    <InlineTextEditor
      initialText={String(textContent.text || '')}
      initialRichText={initialRichText}
      fontSize={typography?.fontSize ?? 16}
      color={resolveThemeColor(typography?.color, theme)}
      fontWeight={typography?.fontWeight ?? 'regular'}
      align={typeof textContent.align === 'string' ? textContent.align : 'left'}
      onSave={handleInlineSave}
      onBlur={handleInlineBlur}
    />
  ) : component ? (
    isContainerLikeKind(node.kind) ? (
      <component.Render node={node} mode="edit" theme={theme}>
        {renderNestedChildNodes()}
      </component.Render>
    ) : (
      <component.Render node={node} mode="edit" theme={theme} />
    )
  ) : null;

  const hasVisibleBorder = node.style.borderWidth > 0;
  const activeHoverStyle = node.hoverStyle && isHovered ? node.hoverStyle : null;
  const animationSummary = getAnimationSummary(node.animation);
  const editorAnimationStyle = buildEditorAnimationStyle({
    animation: node.animation,
    isHovered,
    previewPhase: animationPreviewPhase,
    primaryColor: resolveThemeColor({ token: 'primary' }, theme),
  });
  const backgroundStyle = resolveBackgroundStyle(
    activeHoverStyle?.backgroundColor ?? node.style.backgroundColor,
    theme,
  );
  const renderedBorderColor = activeHoverStyle?.borderColor ?? node.style.borderColor;
  const renderedShadowBlur = activeHoverStyle?.shadowBlur ?? node.style.shadowBlur;
  const renderedShadowSpread = activeHoverStyle?.shadowSpread ?? node.style.shadowSpread;
  const renderedShadowColor = activeHoverStyle?.shadowColor ?? node.style.shadowColor;
  const hasVisibleShadow = renderedShadowBlur > 0
    || renderedShadowSpread !== 0
    || node.style.shadowX !== 0
    || node.style.shadowY !== 0;
  const isContainerWithChildren = isContainerLikeKind(node.kind) && nestedChildren.length > 0;
  const showSelectionHandles = selected && !node.locked && isInteractive;
  const hoverTransition = node.hoverStyle
    ? `background ${node.hoverStyle.transitionMs ?? 200}ms ease, border-color ${node.hoverStyle.transitionMs ?? 200}ms ease, box-shadow ${node.hoverStyle.transitionMs ?? 200}ms ease, transform ${node.hoverStyle.transitionMs ?? 200}ms ease`
    : undefined;
  const bodyTransform = mergeCssTransforms(
    activeHoverStyle ? buildHoverTransform(activeHoverStyle) : undefined,
    editorAnimationStyle.transform,
  );
  const bodyTransition = [hoverTransition, editorAnimationStyle.transition].filter(Boolean).join(', ') || undefined;
  const renderedOpacity = typeof editorAnimationStyle.opacity === 'number'
    ? (node.style.opacity / 100) * editorAnimationStyle.opacity
    : node.style.opacity / 100;

  if (isHiddenAtViewport) {
    return null;
  }

  return (
    <div
      ref={nodeRef}
      className={`${styles.node} ${selected ? styles.nodeSelected : ''} ${node.locked ? styles.nodeLocked : ''}`}
      style={{
        position: parentUsesFlowLayout ? 'relative' : 'absolute',
        left: parentUsesFlowLayout ? undefined : `${effectiveRect.x}px`,
        top: parentUsesFlowLayout ? undefined : `${effectiveRect.y}px`,
        width: `${effectiveRect.width}px`,
        height: `${effectiveRect.height}px`,
        zIndex: parentUsesFlowLayout ? undefined : node.zIndex + 10 + selectionZIndexBoost,
        transform: `rotate(${node.rotation}deg)`,
        transformOrigin: 'center center',
        opacity: isDimmedRoot ? 0.3 : 1,
        pointerEvents: isDimmedRoot || isActiveGroupFrame || (isContainerWithChildren && !isEditing) ? 'none' : undefined,
        outline: isActiveGroupFrame ? '2px dashed rgba(37, 99, 235, 0.72)' : undefined,
        outlineOffset: isActiveGroupFrame ? 4 : undefined,
        fontSize: effectiveFontSize ? `${effectiveFontSize}px` : undefined,
      }}
      data-node-id={node.id}
      data-viewport={viewport}
      onPointerDown={(event) => {
        event.stopPropagation();
        if (event.altKey && node.parentId) {
          let selectedAncestorId: string | null = selected ? node.id : null;

          if (!selectedAncestorId) {
            let ancestorId: string | null = node.parentId;
            while (ancestorId) {
              if (selectedNodeIds.includes(ancestorId)) {
                selectedAncestorId = ancestorId;
                break;
              }
              ancestorId = nodesById.get(ancestorId)?.parentId ?? null;
            }
          }

          const nextSelectedId = selectedAncestorId
            ? (nodesById.get(selectedAncestorId)?.parentId ?? selectedAncestorId)
            : node.parentId;
          onSelect(nextSelectedId, false);
          return;
        }
        if (!isInteractive) return;
        if (event.button !== 0) return;
        const additive = event.metaKey || event.ctrlKey || event.shiftKey;
        onSelect(node.id, additive);
        if (additive || node.locked) return;
        onMoveStart(node.id, event);
      }}
      onContextMenu={(event) => {
        event.stopPropagation();
        if (!isInteractive) return;
        event.preventDefault();
        onContextMenu(node.id, event);
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        handleDoubleClick();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(event) => {
        event.stopPropagation();
        if (node.kind !== 'image' || !selected || node.locked || !isInteractive) return;
        onOpenAssetLibrary?.(node.id);
      }}
    >
      <div className={styles.nodeBadge}>
        <span>{node.kind}</span>
        <strong>· {Math.round(effectiveRect.width)}×{Math.round(effectiveRect.height)}</strong>
        {node.locked ? <em>locked</em> : null}
        {node.sticky ? <em title={`Pinned ${node.sticky.from === 'bottom' ? 'bottom' : 'top'} +${node.sticky.offset}px`} style={{ color: '#60a5fa' }}>📌</em> : null}
        {node.anchorName ? <em title={`Anchor: #${node.anchorName}`} style={{ color: '#34d399' }}>⚓ {node.anchorName}</em> : null}
        {animationSummary ? <em title={animationSummary} style={{ color: '#a78bfa' }}>anim</em> : null}
        {(() => {
          const linkHref = nodeLinkPreviewHref(node);
          if (!linkHref) return null;
          const preview = linkHref.length > 16 ? `${linkHref.slice(0, 14)}…` : linkHref;
          return (
            <em
              title={`Link: ${linkHref}\n클릭하거나 Cmd+K로 편집`}
              style={{
                color: '#fbbf24',
                cursor: 'pointer',
                pointerEvents: 'auto',
                userSelect: 'none',
              }}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                onSelect(node.id, false);
                if (typeof document !== 'undefined') {
                  // Prefer inline popover via SelectionToolbar; CanvasContainer
                  // listens and opens its lifted popover state. Falls back to
                  // inspector focus when no listener intercepts.
                  document.dispatchEvent(
                    new CustomEvent('builder:open-link-popover', {
                      detail: { nodeId: node.id },
                    }),
                  );
                }
              }}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              🔗 {preview}
            </em>
          );
        })()}
      </div>
      <div
        className={styles.nodeBody}
        style={{
          position: 'relative',
          ...backgroundStyle,
          borderRadius: `${node.style.borderRadius}px`,
          border: hasVisibleBorder
            ? `${node.style.borderWidth}px ${node.style.borderStyle} ${resolveThemeColor(renderedBorderColor, theme)}`
            : isActiveGroupFrame
              ? '2px dashed rgba(37, 99, 235, 0.72)'
              : isContainerWithChildren && selected
              ? '1px dashed #94a3b8'
              : 'none',
          boxShadow: editorAnimationStyle.boxShadow
            ?? (hasVisibleShadow
              ? `${node.style.shadowX}px ${node.style.shadowY}px ${renderedShadowBlur}px ${renderedShadowSpread}px ${resolveThemeColor(renderedShadowColor, theme)}`
              : isActiveGroupFrame
              ? '0 0 0 1px rgba(147, 197, 253, 0.5)'
              : 'none'),
          opacity: renderedOpacity,
          overflow: isContainerLikeKind(node.kind) ? 'visible' : undefined,
          pointerEvents: isEditing ? 'auto' : 'none',
          transform: bodyTransform,
          transformOrigin: bodyTransform || editorAnimationStyle.transformOrigin ? 'center center' : undefined,
          transition: bodyTransition,
          clipPath: editorAnimationStyle.clipPath,
          filter: editorAnimationStyle.filter,
        }}
      >
        {body}
        {!isContainerLikeKind(node.kind) ? renderNestedChildNodes() : null}
      </div>
      {showSelectionHandles ? (
        <>
          <div className={styles.rotationLine} />
          <div
            className={styles.rotationHandle}
            onPointerDown={handleRotationPointerDown}
            role="button"
            aria-label={`Rotate ${node.kind} node`}
          />
          {(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as ResizeHandle[]).map((handle) => (
            <button
              key={handle}
              type="button"
              className={`${styles.resizeHandle} ${styles[`resizeHandle${handle.toUpperCase()}` as keyof typeof styles]}`}
              onPointerDown={(event) => {
                event.stopPropagation();
                onResizeStart(node.id, handle, event);
              }}
              aria-label={`Resize ${node.kind} node ${handle}`}
            />
          ))}
          <div className={styles.nodeSizeLabel} aria-hidden>
            {node.kind} · {Math.round(effectiveRect.width)}×{Math.round(effectiveRect.height)}
          </div>
          {rotationReadout ? (
            <div
              className={styles.rotationReadout}
              style={{
                left: `${rotationReadout.x}px`,
                top: `${rotationReadout.y}px`,
              }}
              aria-live="polite"
            >
              {rotationReadout.degrees}°
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
