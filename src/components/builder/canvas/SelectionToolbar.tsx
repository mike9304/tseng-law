'use client';

import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

interface ToolbarAction {
  key: string;
  label: string;
  icon: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function SelectionToolbar({
  selectedNodes,
  bbox,
  onEditText,
  onReplaceImage,
  onEditLink,
  showEditLink = false,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
  onOpenMoreMenu,
}: {
  selectedNodes: BuilderCanvasNode[];
  /** screen-pixel bounding box of selected nodes (already pan/zoom transformed) */
  bbox: { x: number; y: number; width: number; height: number };
  onEditText: () => void;
  onReplaceImage: () => void;
  onEditLink: () => void;
  showEditLink?: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onOpenMoreMenu: (event: React.MouseEvent) => void;
}) {
  if (selectedNodes.length === 0) return null;

  const single = selectedNodes.length === 1 ? selectedNodes[0] : null;
  const isText = single?.kind === 'text' || single?.kind === 'heading';
  const isImage = single?.kind === 'image';
  const isButton = single?.kind === 'button';
  const canEditLink = isButton || showEditLink;
  const anyLocked = selectedNodes.some((node) => node.locked);

  const TOOLBAR_HEIGHT = 36;
  const GAP = 8;

  // Default place above; flip below if not enough room above
  const placeAbove = bbox.y > TOOLBAR_HEIGHT + GAP + 8;
  const top = placeAbove ? bbox.y - TOOLBAR_HEIGHT - GAP : bbox.y + bbox.height + GAP;
  const left = bbox.x + bbox.width / 2;

  const actions: ToolbarAction[] = [];

  if (isText) {
    actions.push({
      key: 'edit-text',
      label: '텍스트 편집',
      icon: 'T',
      title: '텍스트 편집 (더블클릭)',
      onClick: onEditText,
      disabled: anyLocked,
    });
  }
  if (isImage) {
    actions.push({
      key: 'replace-image',
      label: '교체',
      icon: '🖼',
      title: '이미지 교체',
      onClick: onReplaceImage,
      disabled: anyLocked,
    });
  }
  if (canEditLink) {
    actions.push({
      key: 'edit-link',
      label: '링크',
      icon: '🔗',
      title: '링크 편집',
      onClick: onEditLink,
      disabled: anyLocked,
    });
  }
  actions.push(
    {
      key: 'duplicate',
      label: '복제',
      icon: '⎘',
      title: '복제 (Cmd+D)',
      onClick: onDuplicate,
      disabled: anyLocked,
    },
    {
      key: 'forward',
      label: '앞',
      icon: '↑',
      title: '한 단계 앞 (Cmd+])',
      onClick: onBringForward,
      disabled: selectedNodes.length !== 1 || anyLocked,
    },
    {
      key: 'backward',
      label: '뒤',
      icon: '↓',
      title: '한 단계 뒤 (Cmd+[)',
      onClick: onSendBackward,
      disabled: selectedNodes.length !== 1 || anyLocked,
    },
    {
      key: 'delete',
      label: '삭제',
      icon: '🗑',
      title: '삭제 (Delete)',
      onClick: onDelete,
      disabled: anyLocked,
    },
    {
      key: 'more',
      label: '더보기',
      icon: '⋯',
      title: '더보기 (우클릭과 동일)',
      onClick: () => {},
    },
  );

  return (
    <div
      role="toolbar"
      aria-label="요소 빠른 작업"
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        transform: 'translateX(-50%)',
        height: TOOLBAR_HEIGHT,
        zIndex: 9999,
        background: '#0f172a',
        color: '#fff',
        borderRadius: 10,
        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: '2px 4px',
        pointerEvents: 'auto',
        animation: 'fadeIn 120ms ease',
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      {actions.map((action, index) => {
        const isMore = action.key === 'more';
        return (
          <button
            key={action.key}
            type="button"
            title={action.title}
            disabled={action.disabled}
            onClick={(event) => {
              event.stopPropagation();
              if (isMore) {
                onOpenMoreMenu(event);
              } else {
                action.onClick();
              }
            }}
            style={{
              minWidth: 30,
              height: 30,
              padding: '0 8px',
              border: 'none',
              background: 'transparent',
              color: action.disabled ? '#475569' : '#e2e8f0',
              cursor: action.disabled ? 'not-allowed' : 'pointer',
              borderRadius: 6,
              fontSize: '0.85rem',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 100ms ease',
              borderLeft: index > 0 && (action.key === 'duplicate' || action.key === 'more') ? '1px solid rgba(255, 255, 255, 0.12)' : undefined,
              marginLeft: index > 0 && (action.key === 'duplicate' || action.key === 'more') ? 4 : 0,
              paddingLeft: index > 0 && (action.key === 'duplicate' || action.key === 'more') ? 12 : 8,
            }}
            onMouseEnter={(event) => {
              if (action.disabled) return;
              event.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: action.icon.length === 1 ? '0.95rem' : '0.85rem' }}>{action.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
