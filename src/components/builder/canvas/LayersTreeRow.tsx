'use client';

import type { KeyboardEvent, MouseEvent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { BuilderCanvasNode, BuilderCanvasNodeKind } from '@/lib/builder/canvas/types';
import styles from './SandboxPage.module.css';

function GripIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" aria-hidden="true">
      <circle cx="3" cy="2" r="1.25" />
      <circle cx="7" cy="2" r="1.25" />
      <circle cx="3" cy="7" r="1.25" />
      <circle cx="7" cy="7" r="1.25" />
      <circle cx="3" cy="12" r="1.25" />
      <circle cx="7" cy="12" r="1.25" />
    </svg>
  );
}

function getLayerNodeKindGlyph(kind: BuilderCanvasNodeKind) {
  switch (kind) {
    case 'text':
      return 'T';
    case 'heading':
      return 'H';
    case 'image':
      return 'IMG';
    case 'button':
      return 'BTN';
    case 'container':
      return 'BOX';
    case 'section':
      return 'SEC';
    case 'divider':
      return 'DIV';
    case 'spacer':
      return 'SPC';
    case 'icon':
      return 'ICO';
    case 'video-embed':
      return 'VID';
    case 'form':
      return 'FRM';
    case 'form-input':
      return 'IN';
    case 'form-textarea':
      return 'TXT';
    case 'form-select':
      return 'SEL';
    case 'form-checkbox':
      return 'CHK';
    case 'form-radio':
      return 'RAD';
    case 'form-file':
      return 'FILE';
    case 'form-date':
      return 'DATE';
    case 'form-submit':
      return 'GO';
    default:
      return 'NODE';
  }
}

export default function LayersTreeRow({
  node,
  depth,
  label,
  childCount,
  isExpanded,
  isSelected,
  isPrimary,
  isActiveGroup,
  isMatched,
  isDimmed,
  dropMode,
  onSelect,
  onToggleExpanded,
  onToggleVisibility,
  onToggleLock,
  onHoverStart,
  onHoverEnd,
  onEnterGroup,
}: {
  node: BuilderCanvasNode;
  depth: number;
  label: string;
  childCount: number;
  isExpanded: boolean;
  isSelected: boolean;
  isPrimary: boolean;
  isActiveGroup: boolean;
  isMatched: boolean;
  isDimmed: boolean;
  dropMode?: 'before' | 'after' | 'inside' | null;
  onSelect: (nodeId: string, event: MouseEvent | KeyboardEvent) => void;
  onToggleExpanded: (nodeId: string) => void;
  onToggleVisibility: (nodeId: string) => void;
  onToggleLock: (nodeId: string) => void;
  onHoverStart: (nodeId: string) => void;
  onHoverEnd: () => void;
  onEnterGroup: (nodeId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  return (
    <li
      ref={setNodeRef}
      className={`${styles.layerTreeItem} ${isDragging ? styles.layerDragging : ''}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition ?? undefined,
      }}
    >
      <div
        role="button"
        tabIndex={0}
        className={[
          styles.layerTreeRow,
          isSelected ? styles.layerRowSelected : '',
          isActiveGroup ? styles.layerTreeRowActiveGroup : '',
          isMatched ? styles.layerTreeRowMatched : '',
          isDimmed ? styles.layerTreeRowDimmed : '',
          dropMode === 'before' ? styles.layerDropBefore : '',
          dropMode === 'after' ? styles.layerDropAfter : '',
          dropMode === 'inside' ? styles.layerDropInside : '',
        ].filter(Boolean).join(' ')}
        style={{ paddingLeft: 8 + depth * 16 }}
        title={`${node.kind} ${node.id}`}
        onMouseEnter={() => onHoverStart(node.id)}
        onMouseLeave={onHoverEnd}
        onClick={(event) => onSelect(node.id, event)}
        onDoubleClick={(event) => {
          event.stopPropagation();
          if (childCount > 0) onEnterGroup(node.id);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect(node.id, event);
          }
          if (event.key === 'ArrowRight' && childCount > 0 && !isExpanded) {
            event.preventDefault();
            onToggleExpanded(node.id);
          }
          if (event.key === 'ArrowLeft' && childCount > 0 && isExpanded) {
            event.preventDefault();
            onToggleExpanded(node.id);
          }
        }}
      >
        <button
          type="button"
          className={styles.layerCaret}
          title={childCount > 0 ? (isExpanded ? 'Collapse' : 'Expand') : 'No children'}
          disabled={childCount === 0}
          onClick={(event) => {
            event.stopPropagation();
            onToggleExpanded(node.id);
          }}
        >
          {childCount > 0 ? (isExpanded ? 'v' : '>') : ''}
        </button>
        <button
          ref={setActivatorNodeRef}
          type="button"
          className={styles.layerGripHandle}
          title="Drag to reorder or move into containers"
          onClick={(event) => event.stopPropagation()}
          {...attributes}
          {...listeners}
        >
          <GripIcon />
        </button>
        <span className={styles.layerKindIcon}>{getLayerNodeKindGlyph(node.kind)}</span>
        <span className={styles.layerTreeText}>
          <strong>{label}</strong>
          <small>
            {node.kind} · z {node.zIndex}
            {isPrimary ? ' · primary' : ''}
            {childCount > 0 ? ` · ${childCount} child${childCount === 1 ? '' : 'ren'}` : ''}
          </small>
        </span>
        <span className={styles.layerRowActions}>
          <button
            type="button"
            className={styles.layerQuickAction}
            title={node.visible ? 'Hide on canvas' : 'Show on canvas'}
            onClick={(event) => {
              event.stopPropagation();
              onToggleVisibility(node.id);
            }}
          >
            {node.visible ? 'eye' : 'off'}
          </button>
          <button
            type="button"
            className={styles.layerQuickAction}
            title={node.locked ? 'Unlock' : 'Lock'}
            onClick={(event) => {
              event.stopPropagation();
              onToggleLock(node.id);
            }}
          >
            {node.locked ? 'lock' : 'open'}
          </button>
          <button
            type="button"
            className={styles.layerQuickAction}
            title="More layer actions pending"
            onClick={(event) => event.stopPropagation()}
          >
            ...
          </button>
        </span>
      </div>
    </li>
  );
}
