'use client';

import { memo, type KeyboardEvent, type MouseEvent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { BuilderCanvasNode, BuilderCanvasNodeKind } from '@/lib/builder/canvas/types';
import type { SandboxLayersPanelCopy } from './sandbox-layers-panel-copy';
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

function CaretIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d={expanded ? 'M3.5 5.25 7 8.75l3.5-3.5' : 'M5.25 3.5 8.75 7l-3.5 3.5'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VisibilityIcon({ visible }: { visible: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M1.8 7.5s2-3.7 5.7-3.7 5.7 3.7 5.7 3.7-2 3.7-5.7 3.7-5.7-3.7-5.7-3.7Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="7.5" r="1.7" stroke="currentColor" strokeWidth="1.35" />
      {!visible ? (
        <path
          d="M3 12 12 3"
          stroke="currentColor"
          strokeWidth="1.45"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}

function LockIcon({ locked }: { locked: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <rect
        x="3.25"
        y="6.35"
        width="8.5"
        height="5.9"
        rx="1.35"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path
        d={locked ? 'M5.25 6.35V5a2.25 2.25 0 0 1 4.5 0v1.35' : 'M5.25 6.35V5a2.25 2.25 0 0 1 4.25-1'}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor" aria-hidden="true">
      <circle cx="3.75" cy="7.5" r="1.05" />
      <circle cx="7.5" cy="7.5" r="1.05" />
      <circle cx="11.25" cy="7.5" r="1.05" />
    </svg>
  );
}

function LayerKindMark({ kind }: { kind: BuilderCanvasNodeKind }) {
  switch (kind) {
    case 'text':
    case 'heading':
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path d="M3 4h9M5 4v7M10 4v7M4 11h7" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
        </svg>
      );
    case 'image':
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <rect x="2.5" y="3" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
          <path d="m3.4 10.8 2.4-2.5 1.9 1.7 1.5-1.4 2.4 2.2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9.9" cy="5.6" r="0.8" fill="currentColor" />
        </svg>
      );
    case 'button':
    case 'form-submit':
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <rect x="2.4" y="5" width="10.2" height="5.2" rx="2.1" stroke="currentColor" strokeWidth="1.35" />
          <path d="M5.4 7.6h4.2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
        </svg>
      );
    case 'container':
    case 'section':
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <rect x="2.5" y="2.8" width="10" height="9.4" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
          <path d="M4.6 5.1h5.8M4.6 7.5h3.8M4.6 9.9h5.1" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
        </svg>
      );
    case 'divider':
    case 'spacer':
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path d="M3 7.5h9" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
          <path d="M4.2 4.7h6.6M4.2 10.3h6.6" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" opacity="0.45" />
        </svg>
      );
    case 'icon':
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path d="M7.5 2.7 8.8 6l3.4.3-2.6 2.2.8 3.3-2.9-1.8-2.9 1.8.8-3.3-2.6-2.2L6.2 6l1.3-3.3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      );
    case 'codeBlock':
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path d="m5.5 4-3 3.5 3 3.5M9.5 4l3 3.5-3 3.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'video-embed':
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <rect x="2.5" y="3.6" width="10" height="7.8" rx="1.4" stroke="currentColor" strokeWidth="1.25" />
          <path d="m6.5 6 3 1.5-3 1.5V6Z" fill="currentColor" />
        </svg>
      );
    case 'form':
    case 'form-input':
    case 'form-textarea':
    case 'form-select':
    case 'form-checkbox':
    case 'form-radio':
    case 'form-file':
    case 'form-date':
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <rect x="3" y="2.8" width="9" height="9.4" rx="1.3" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5 5.1h5M5 7.4h5M5 9.7h3.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.25" />
          <path d="M5.4 5.4h4.2v4.2H5.4z" stroke="currentColor" strokeWidth="1.05" />
        </svg>
      );
  }
}

function LayersTreeRow({
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
  copy,
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
  copy: SandboxLayersPanelCopy;
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
  const kindLabel = copy.kindLabels[node.kind] ?? node.kind;
  const expandLabel = childCount > 0
    ? (isExpanded ? copy.row.collapseLabel : copy.row.expandLabel)
    : copy.row.noChildrenLabel;
  const visibilityLabel = node.visible ? copy.row.hideNodeLabel : copy.row.showNodeLabel;
  const lockLabel = node.locked ? copy.row.unlockNodeLabel : copy.row.lockNodeLabel;

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
        style={{ paddingLeft: Math.min(8 + depth * 10, 58) }}
        data-builder-layer-row={node.id}
        data-builder-layer-depth={depth}
        data-builder-layer-z={node.zIndex}
        title={`${kindLabel} ${node.id}`}
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
          title={expandLabel}
          aria-label={expandLabel}
          disabled={childCount === 0}
          onClick={(event) => {
            event.stopPropagation();
            onToggleExpanded(node.id);
          }}
        >
          {childCount > 0 ? <CaretIcon expanded={isExpanded} /> : null}
        </button>
        <button
          ref={setActivatorNodeRef}
          type="button"
          className={styles.layerGripHandle}
          title={copy.row.dragHandleLabel}
          aria-label={copy.row.dragHandleLabel}
          onClick={(event) => event.stopPropagation()}
          {...attributes}
          {...listeners}
        >
          <GripIcon />
        </button>
        <span className={styles.layerKindIcon} title={kindLabel}>
          <LayerKindMark kind={node.kind} />
        </span>
        <span className={styles.layerTreeText}>
          <strong>{label}</strong>
          <small>
            {kindLabel} · {copy.row.zIndexLabel(node.zIndex)}
            {isPrimary ? ` · ${copy.row.primaryLabel}` : ''}
            {childCount > 0 ? ` · ${copy.row.childCountLabel(childCount)}` : ''}
          </small>
        </span>
        <span className={styles.layerRowActions}>
          <button
            type="button"
            className={styles.layerQuickAction}
            data-builder-layer-visibility={node.id}
            title={visibilityLabel}
            aria-label={visibilityLabel}
            onClick={(event) => {
              event.stopPropagation();
              onToggleVisibility(node.id);
            }}
          >
            <VisibilityIcon visible={node.visible} />
          </button>
          <button
            type="button"
            className={styles.layerQuickAction}
            data-builder-layer-lock={node.id}
            title={lockLabel}
            aria-label={lockLabel}
            onClick={(event) => {
              event.stopPropagation();
              onToggleLock(node.id);
            }}
          >
            <LockIcon locked={Boolean(node.locked)} />
          </button>
          <button
            type="button"
            className={styles.layerQuickAction}
            title={copy.row.moreActionsLabel}
            aria-label={copy.row.moreActionsLabel}
            onClick={(event) => event.stopPropagation()}
          >
            <MoreIcon />
          </button>
        </span>
      </div>
    </li>
  );
}

export default memo(LayersTreeRow);
