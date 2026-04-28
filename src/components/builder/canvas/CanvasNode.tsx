'use client';

import { useState, useCallback, useRef } from 'react';
import { getComponent } from '@/lib/builder/components/registry';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import InlineTextEditor from './InlineTextEditor';
import styles from './SandboxPage.module.css';

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
  const component = getComponent(node.kind);
  const nodeRef = useRef<HTMLDivElement>(null);
  const rotationDrag = useRef<{ startAngle: number; startRotation: number } | null>(null);
  const updateNode = useBuilderCanvasStore((s) => s.updateNode);
  const beginMutationSession = useBuilderCanvasStore((s) => s.beginMutationSession);
  const commitMutationSession = useBuilderCanvasStore((s) => s.commitMutationSession);
  const activeGroupId = useBuilderCanvasStore((s) => s.activeGroupId);
  const enterGroup = useBuilderCanvasStore((s) => s.enterGroup);
  const selectedNodeIds = useBuilderCanvasStore((s) => s.selectedNodeIds);

  const handleRotationPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
      event.preventDefault();
      const el = nodeRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
      rotationDrag.current = { startAngle, startRotation: node.rotation };
      el.setPointerCapture(event.pointerId);
      beginMutationSession();

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (!rotationDrag.current) return;
        const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * (180 / Math.PI);
        const rawDegrees = rotationDrag.current.startRotation + (currentAngle - rotationDrag.current.startAngle);
        const snapped = Math.round(rawDegrees / 15) * 15;
        const normalized = ((snapped % 360) + 360) % 360;
        updateNode(node.id, (n) => ({ ...n, rotation: normalized }));
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        rotationDrag.current = null;
        el.releasePointerCapture(upEvent.pointerId);
        commitMutationSession();
        el.removeEventListener('pointermove', handlePointerMove);
        el.removeEventListener('pointerup', handlePointerUp);
      };

      el.addEventListener('pointermove', handlePointerMove);
      el.addEventListener('pointerup', handlePointerUp);
    },
    [node.id, node.rotation, beginMutationSession, commitMutationSession, updateNode],
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
    (html: string, plainText: string) => {
      onUpdateContent?.(node.id, { text: plainText });
    },
    [node.id, onUpdateContent],
  );

  const handleInlineBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const isTextKind = node.kind === 'text' || node.kind === 'heading';
  const textContent = node.content as Record<string, unknown>;
  const isActiveGroupFrame = activeGroupId === node.id;
  const isRootNode = !node.parentId;
  const isDimmedRoot = activeGroupId !== null && isRootNode && node.id !== activeGroupId;
  const isInteractive = !isDimmedRoot;
  const selectionZIndexBoost = selected ? 10000 : 0;
  const childrenMap = useBuilderCanvasStore((s) => s.childrenMap);
  const allNodes = useBuilderCanvasStore((s) => s.document?.nodes ?? []);
  const nodesById = new Map(allNodes.map((candidate) => [candidate.id, candidate]));
  const parentNode = node.parentId ? nodesById.get(node.parentId) : undefined;
  const parentLayoutMode = parentNode?.kind === 'container'
    ? parentNode.content.layoutMode ?? 'absolute'
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
      fontSize={typeof textContent.fontSize === 'number' ? textContent.fontSize : 16}
      color={typeof textContent.color === 'string' ? textContent.color : '#1f2937'}
      fontWeight={typeof textContent.fontWeight === 'string' ? textContent.fontWeight : 'regular'}
      align={typeof textContent.align === 'string' ? textContent.align : 'left'}
      onSave={handleInlineSave}
      onBlur={handleInlineBlur}
    />
  ) : component ? (
    node.kind === 'container' ? (
      <component.Render node={node} mode="edit">
        {renderNestedChildNodes()}
      </component.Render>
    ) : (
      <component.Render node={node} mode="edit" />
    )
  ) : null;

  const hasVisibleBorder = node.style.borderWidth > 0;
  const hasVisibleShadow = node.style.shadowBlur > 0 || node.style.shadowSpread !== 0 || node.style.shadowX !== 0 || node.style.shadowY !== 0;
  const isContainerWithChildren = node.kind === 'container' && nestedChildren.length > 0;
  const showSelectionHandles = selected && !node.locked && isInteractive;

  return (
    <div
      ref={nodeRef}
      className={`${styles.node} ${selected ? styles.nodeSelected : ''} ${node.locked ? styles.nodeLocked : ''}`}
      style={{
        position: parentUsesFlowLayout ? 'relative' : 'absolute',
        left: parentUsesFlowLayout ? undefined : `${node.rect.x}px`,
        top: parentUsesFlowLayout ? undefined : `${node.rect.y}px`,
        width: `${node.rect.width}px`,
        height: `${node.rect.height}px`,
        zIndex: parentUsesFlowLayout ? undefined : node.zIndex + 10 + selectionZIndexBoost,
        transform: `rotate(${node.rotation}deg)`,
        transformOrigin: 'center center',
        opacity: isDimmedRoot ? 0.3 : 1,
        pointerEvents: isDimmedRoot || isActiveGroupFrame ? 'none' : undefined,
        outline: isActiveGroupFrame ? '2px dashed rgba(37, 99, 235, 0.72)' : undefined,
        outlineOffset: isActiveGroupFrame ? 4 : undefined,
      }}
      data-node-id={node.id}
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
      onClick={(event) => {
        event.stopPropagation();
        if (node.kind !== 'image' || !selected || node.locked || !isInteractive) return;
        onOpenAssetLibrary?.(node.id);
      }}
    >
      <div className={styles.nodeBadge}>
        <span>{node.kind}</span>
        <strong>{node.id}</strong>
        {node.locked ? <em>locked</em> : null}
      </div>
      <div
        className={styles.nodeBody}
        style={{
          position: 'relative',
          background: node.style.backgroundColor,
          borderRadius: `${node.style.borderRadius}px`,
          border: hasVisibleBorder
            ? `${node.style.borderWidth}px ${node.style.borderStyle} ${node.style.borderColor}`
            : isActiveGroupFrame
              ? '2px dashed rgba(37, 99, 235, 0.72)'
              : isContainerWithChildren && selected
              ? '1px dashed #94a3b8'
              : 'none',
          boxShadow: hasVisibleShadow
            ? `${node.style.shadowX}px ${node.style.shadowY}px ${node.style.shadowBlur}px ${node.style.shadowSpread}px ${node.style.shadowColor}`
            : isActiveGroupFrame
              ? '0 0 0 1px rgba(147, 197, 253, 0.5)'
              : 'none',
          opacity: node.style.opacity / 100,
          overflow: node.kind === 'container' ? 'visible' : undefined,
        }}
      >
        {body}
        {node.kind !== 'container' ? renderNestedChildNodes() : null}
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
            {Math.round(node.rect.width)} x {Math.round(node.rect.height)}
          </div>
        </>
      ) : null}
    </div>
  );
}
