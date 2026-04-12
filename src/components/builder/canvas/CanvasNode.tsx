'use client';

import TextElement from '@/components/builder/canvas/elements/TextElement';
import ImageElement from '@/components/builder/canvas/elements/ImageElement';
import ButtonElement from '@/components/builder/canvas/elements/ButtonElement';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
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
  onSelect: (nodeId: string) => void;
  onMoveStart: (nodeId: string, event: React.PointerEvent<HTMLDivElement>) => void;
  onResizeStart: (nodeId: string, handle: ResizeHandle, event: React.PointerEvent<HTMLButtonElement>) => void;
}

export default function CanvasNode({
  node,
  selected,
  onSelect,
  onMoveStart,
  onResizeStart,
}: CanvasNodeProps) {
  let body: React.ReactNode;
  switch (node.kind) {
    case 'text':
      body = <TextElement node={node} />;
      break;
    case 'image':
      body = <ImageElement node={node} />;
      break;
    case 'button':
      body = <ButtonElement node={node} />;
      break;
    default:
      body = null;
  }

  return (
    <div
      className={`${styles.node} ${selected ? styles.nodeSelected : ''}`}
      style={{
        left: `${node.rect.x}px`,
        top: `${node.rect.y}px`,
        width: `${node.rect.width}px`,
        height: `${node.rect.height}px`,
        zIndex: node.zIndex + 10,
      }}
      data-node-id={node.id}
      onPointerDown={(event) => {
        onSelect(node.id);
        onMoveStart(node.id, event);
      }}
    >
      <div className={styles.nodeBadge}>
        <span>{node.kind}</span>
        <strong>{node.id}</strong>
      </div>
      <div className={styles.nodeBody}>{body}</div>
      {selected ? (
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
              aria-label={`Resize ${node.kind} node`}
            />
          ))}
        </>
      ) : null}
    </div>
  );
}
