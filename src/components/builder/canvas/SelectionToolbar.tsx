'use client';

import { useCallback, useEffect, useState } from 'react';
import LinkPicker, { type LinkPickerContext } from '@/components/builder/editor/LinkPicker';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { linkValueFromLegacy, type LinkValue } from '@/lib/builder/links';
import styles from './SandboxPage.module.css';

function previewLinkHref(href: string | undefined): string {
  if (!href) return '';
  const trimmed = href.trim();
  if (trimmed.length <= 24) return trimmed;
  return `${trimmed.slice(0, 22)}…`;
}

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
  linkTargetNode = null,
  onChangeLink,
  linkPickerContext,
  linkPopoverOpen: linkPopoverOpenProp,
  onLinkPopoverChange,
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
  linkTargetNode?: BuilderCanvasNode | null;
  onChangeLink?: (nodeId: string, value: LinkValue | null) => void;
  linkPickerContext?: LinkPickerContext;
  /** Optional: lift popover open state to a parent (e.g. so a click on a node-level
   *  link badge can request the popover to open on the toolbar). When provided,
   *  internal toggle still works but mirrors via `onLinkPopoverChange`. */
  linkPopoverOpen?: boolean;
  onLinkPopoverChange?: (open: boolean) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onOpenMoreMenu: (event: React.MouseEvent) => void;
}) {
  const [internalLinkPopoverOpen, setInternalLinkPopoverOpen] = useState(false);
  const linkPopoverOpen = linkPopoverOpenProp ?? internalLinkPopoverOpen;
  const setLinkPopoverOpen = useCallback((next: boolean | ((current: boolean) => boolean)) => {
    const resolved = typeof next === 'function' ? next(linkPopoverOpen) : next;
    setInternalLinkPopoverOpen(resolved);
    onLinkPopoverChange?.(resolved);
  }, [linkPopoverOpen, onLinkPopoverChange]);

  const single = selectedNodes.length === 1 ? selectedNodes[0] : null;
  const isText = single?.kind === 'text' || single?.kind === 'heading';
  const isImage = single?.kind === 'image';
  const isButton = single?.kind === 'button';
  const canEditLink = isButton || showEditLink;
  const anyLocked = selectedNodes.some((node) => node.locked);

  useEffect(() => {
    if (!canEditLink) setLinkPopoverOpen(false);
  }, [canEditLink, setLinkPopoverOpen]);

  if (selectedNodes.length === 0) return null;

  const TOOLBAR_HEIGHT = 36;
  const GAP = 8;

  // Default place above; flip below if not enough room above
  const placeAbove = bbox.y > TOOLBAR_HEIGHT + GAP + 8;
  const top = placeAbove ? bbox.y - TOOLBAR_HEIGHT - GAP : bbox.y + bbox.height + GAP;
  const left = bbox.x + bbox.width / 2;

  const actions: ToolbarAction[] = [];

  // Link 액션을 첫 자리로 — 가장 자주 쓰는 편집. 현재 href 미리보기 또는 "링크 추가".
  if (canEditLink) {
    const currentLink = linkTargetNode ? getNodeLinkValue(linkTargetNode) : null;
    const hasActiveLink = Boolean(currentLink?.href);
    actions.push({
      key: 'edit-link',
      label: hasActiveLink ? previewLinkHref(currentLink?.href) : '링크 추가',
      icon: '🔗',
      title: hasActiveLink ? `현재: ${currentLink?.href}\n클릭해서 편집 (Cmd+K)` : '링크 추가 (Cmd+K)',
      onClick: () => {
        if (linkTargetNode && onChangeLink) {
          setLinkPopoverOpen((current) => !current);
          return;
        }
        onEditLink();
      },
      disabled: anyLocked,
    });
  }
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

  const linkValue = linkTargetNode ? getNodeLinkValue(linkTargetNode) : null;
  const popoverTop = top + TOOLBAR_HEIGHT + GAP;
  const selectionSummary = selectedNodes.length === 1
    ? selectedNodes[0].kind
    : `${selectedNodes.length} items`;

  return (
    <>
      <div
        role="toolbar"
        aria-label="요소 빠른 작업"
        className={styles.selectionToolbar}
        style={{
          top: `${top}px`,
          left: `${left}px`,
          transform: 'translateX(-50%)',
        }}
        onPointerDown={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span
          title={selectionSummary}
          className={styles.selectionToolbarSummary}
        >
          {selectionSummary}
        </span>
        {actions.map((action, index) => {
          const isMore = action.key === 'more';
          const separated = index > 0 && (action.key === 'duplicate' || action.key === 'more');
          return (
            <button
              key={action.key}
              type="button"
              title={action.title}
              disabled={action.disabled}
              className={[
                styles.selectionToolbarButton,
                separated ? styles.selectionToolbarButtonSeparated : '',
              ].filter(Boolean).join(' ')}
              onClick={(event) => {
                event.stopPropagation();
                if (isMore) {
                  onOpenMoreMenu(event);
                } else {
                  action.onClick();
                }
              }}
            >
              <span
                className={styles.selectionToolbarIcon}
                data-wide-icon={action.icon.length === 1 ? undefined : 'true'}
              >
                {action.icon}
              </span>
            </button>
          );
        })}
      </div>
      {linkPopoverOpen && linkTargetNode && onChangeLink ? (
        <div
          role="dialog"
          aria-label="링크 편집"
          className={styles.selectionToolbarPopover}
          style={{
            top: `${popoverTop}px`,
            left: `${left}px`,
            transform: 'translateX(-50%)',
          }}
          onPointerDown={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <LinkPicker
            value={linkValue}
            onChange={(value) => onChangeLink(linkTargetNode.id, value)}
            context={linkPickerContext}
          />
        </div>
      ) : null}
    </>
  );
}

function getNodeLinkValue(node: BuilderCanvasNode): LinkValue | null {
  if (node.kind === 'button') return linkValueFromLegacy(node.content);
  if (node.kind === 'image' || node.kind === 'container') {
    return (node.content.link ?? null) as LinkValue | null;
  }
  return null;
}
