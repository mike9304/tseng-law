import { useMemo } from 'react';
import type { LinkPickerContext } from '@/components/builder/editor/LinkPicker';
import type { ShortcutAction } from '@/components/builder/canvas/hooks/useShortcutLabels';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { LinkValue } from '@/lib/builder/links';
import type { SelectionToolbarAction } from './SelectionToolbarActionButton';
import { getSelectionLinkValue, previewSelectionLinkHref } from './selection-overlay-copy';

type SelectionToolbarActionsOptions = {
  readonly anyLocked: boolean;
  readonly canEditLink: boolean;
  readonly isImage: boolean;
  readonly isText: boolean;
  readonly linkPickerContext?: LinkPickerContext;
  readonly linkTargetNode: BuilderCanvasNode | null;
  readonly onBringForward: () => void;
  readonly onChangeLink?: (nodeId: string, value: LinkValue | null) => void;
  readonly onDelete: () => void;
  readonly onDuplicate: () => void;
  readonly onEditLink: () => void;
  readonly onEditText: () => void;
  readonly onOpenMoreMenu: SelectionToolbarAction['onClickEvent'];
  readonly onReplaceImage: () => void;
  readonly onSendBackward: () => void;
  readonly onToggleLinkPopover: () => void;
  readonly selectionCount: number;
  readonly shortcutTitle: (title: string, action: ShortcutAction) => string;
};

export function useSelectionToolbarActions({
  anyLocked,
  canEditLink,
  isImage,
  isText,
  linkTargetNode,
  onBringForward,
  onChangeLink,
  onDelete,
  onDuplicate,
  onEditLink,
  onEditText,
  onOpenMoreMenu,
  onReplaceImage,
  onSendBackward,
  onToggleLinkPopover,
  selectionCount,
  shortcutTitle,
}: SelectionToolbarActionsOptions): SelectionToolbarAction[] {
  return useMemo<SelectionToolbarAction[]>(() => {
    const nextActions: SelectionToolbarAction[] = [];

    if (canEditLink) {
      const currentLink = linkTargetNode ? getSelectionLinkValue(linkTargetNode) : null;
      const hasActiveLink = Boolean(currentLink?.href);
      nextActions.push({
        key: 'edit-link',
        label: hasActiveLink ? previewSelectionLinkHref(currentLink?.href) : '링크 추가',
        icon: 'link',
        title: hasActiveLink
          ? `현재: ${currentLink?.href}\n${shortcutTitle('클릭해서 편집', 'editLink')}`
          : shortcutTitle('링크 추가', 'editLink'),
        onClick: () => {
          if (linkTargetNode && onChangeLink) {
            onToggleLinkPopover();
            return;
          }
          onEditLink();
        },
        disabled: anyLocked,
      });
    }
    if (isText) {
      nextActions.push({
        key: 'edit-text',
        label: '텍스트 편집',
        icon: 'text',
        title: '텍스트 편집 (더블클릭)',
        onClick: onEditText,
        disabled: anyLocked,
      });
    }
    if (isImage) {
      nextActions.push({
        key: 'replace-image',
        label: '교체',
        icon: 'image',
        title: '이미지 교체',
        onClick: onReplaceImage,
        disabled: anyLocked,
      });
    }
    nextActions.push(
      {
        key: 'duplicate',
        label: '복제',
        icon: 'duplicate',
        title: shortcutTitle('복제', 'duplicate'),
        onClick: onDuplicate,
        disabled: anyLocked,
      },
      {
        key: 'forward',
        label: '앞',
        icon: 'bringForward',
        title: shortcutTitle('한 단계 앞', 'bringForward'),
        onClick: onBringForward,
        disabled: selectionCount !== 1 || anyLocked,
      },
      {
        key: 'backward',
        label: '뒤',
        icon: 'sendBackward',
        title: shortcutTitle('한 단계 뒤', 'sendBackward'),
        onClick: onSendBackward,
        disabled: selectionCount !== 1 || anyLocked,
      },
      {
        key: 'delete',
        label: '삭제',
        icon: 'trash',
        title: shortcutTitle('삭제', 'delete'),
        onClick: onDelete,
        disabled: anyLocked,
      },
      {
        key: 'more',
        label: '더보기',
        icon: 'moreHorizontal',
        title: '더보기 (우클릭과 동일)',
        onClickEvent: onOpenMoreMenu,
      },
    );
    return nextActions;
  }, [
    anyLocked,
    canEditLink,
    isImage,
    isText,
    linkTargetNode,
    onBringForward,
    onChangeLink,
    onDelete,
    onDuplicate,
    onEditLink,
    onEditText,
    onOpenMoreMenu,
    onReplaceImage,
    onSendBackward,
    onToggleLinkPopover,
    selectionCount,
    shortcutTitle,
  ]);
}
