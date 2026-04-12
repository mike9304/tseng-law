'use client';

import { useState, useCallback } from 'react';
import { getComponent } from '@/lib/builder/components/registry';
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

  const handleDoubleClick = useCallback(() => {
    if (node.locked) return;
    if (node.kind === 'text' || node.kind === 'heading') {
      setIsEditing(true);
    }
  }, [node.kind, node.locked]);

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
    <component.Render node={node} mode="edit" />
  ) : null;
  const hasVisibleBorder = node.style.borderWidth > 0;
  const hasVisibleShadow = node.style.shadowBlur > 0 || node.style.shadowSpread !== 0 || node.style.shadowX !== 0 || node.style.shadowY !== 0;

  return (
    <div
      className={`${styles.node} ${selected ? styles.nodeSelected : ''} ${node.locked ? styles.nodeLocked : ''}`}
      style={{
        left: `${node.rect.x}px`,
        top: `${node.rect.y}px`,
        width: `${node.rect.width}px`,
        height: `${node.rect.height}px`,
        zIndex: node.zIndex + 10,
        transform: `rotate(${node.rotation}deg)`,
        transformOrigin: 'center center',
      }}
      data-node-id={node.id}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        const additive = event.metaKey || event.ctrlKey || event.shiftKey;
        onSelect(node.id, additive);
        if (additive || node.locked) return;
        onMoveStart(node.id, event);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        onContextMenu(node.id, event);
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        handleDoubleClick();
      }}
      onClick={() => {
        if (node.kind !== 'image' || !selected || node.locked) return;
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
          background: node.style.backgroundColor,
          borderRadius: `${node.style.borderRadius}px`,
          border: hasVisibleBorder
            ? `${node.style.borderWidth}px ${node.style.borderStyle} ${node.style.borderColor}`
            : 'none',
          boxShadow: hasVisibleShadow
            ? `${node.style.shadowX}px ${node.style.shadowY}px ${node.style.shadowBlur}px ${node.style.shadowSpread}px ${node.style.shadowColor}`
            : 'none',
          opacity: node.style.opacity / 100,
        }}
      >
        {body}
      </div>
      {selected && !node.locked ? (
        <>
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
