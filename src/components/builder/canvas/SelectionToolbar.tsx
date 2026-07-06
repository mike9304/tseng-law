'use client';

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from 'react';
import LinkPicker, { type LinkPickerContext } from '@/components/builder/editor/LinkPicker';
import { getLinkPickerCopy } from '@/components/builder/editor/link-picker-copy';
import { useShortcutLabels, type ShortcutAction } from '@/components/builder/canvas/hooks/useShortcutLabels';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { LinkValue } from '@/lib/builder/links';
import type { Locale } from '@/lib/locales';
import SelectionToolbarActionButton from './SelectionToolbarActionButton';
import {
  formatSelectionToolbarSummary,
  getSelectionLinkValue,
  getSelectionToolbarAriaLabel,
} from './selection-overlay-copy';
import { useSelectionToolbarActions } from './useSelectionToolbarActions';
import styles from './SandboxPage.module.css';

const SELECTION_TOOLBAR_SHORTCUT_ACTIONS: ShortcutAction[] = [
  'editLink',
  'duplicate',
  'bringForward',
  'sendBackward',
  'delete',
];

function SelectionToolbar({
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
  locale,
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
  onOpenMoreMenu: (event: MouseEvent<HTMLButtonElement>) => void;
  locale?: Locale;
}) {
  const [internalLinkPopoverOpen, setInternalLinkPopoverOpen] = useState(false);
  const linkPopoverOpen = linkPopoverOpenProp ?? internalLinkPopoverOpen;
  const setLinkPopoverOpen = useCallback((next: boolean | ((current: boolean) => boolean)) => {
    const resolved = typeof next === 'function' ? next(linkPopoverOpen) : next;
    setInternalLinkPopoverOpen(resolved);
    onLinkPopoverChange?.(resolved);
  }, [linkPopoverOpen, onLinkPopoverChange]);

  const selectionCount = selectedNodes.length;
  const single = selectionCount === 1 ? selectedNodes[0] : null;
  const isText = single?.kind === 'text' || single?.kind === 'heading';
  const isImage = single?.kind === 'image';
  const isButton = single?.kind === 'button';
  const canEditLink = isButton || showEditLink;
  const anyLocked = useMemo(() => selectedNodes.some((node) => node.locked), [selectedNodes]);
  const shortcutLabels = useShortcutLabels(SELECTION_TOOLBAR_SHORTCUT_ACTIONS);
  const copy = useMemo(() => getLinkPickerCopy(locale), [locale]);
  const shortcutTitle = useCallback((title: string, action: ShortcutAction) => {
    const label = shortcutLabels.get(action)?.title;
    return label ? `${title} (${label})` : title;
  }, [shortcutLabels]);
  const toggleLinkPopover = useCallback(() => {
    setLinkPopoverOpen((current) => !current);
  }, [setLinkPopoverOpen]);

  useEffect(() => {
    if (!canEditLink) setLinkPopoverOpen(false);
  }, [canEditLink, setLinkPopoverOpen]);

  const actions = useSelectionToolbarActions({
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
    onToggleLinkPopover: toggleLinkPopover,
    selectionCount,
    shortcutTitle,
  });
  const handleLinkPickerChange = useCallback((value: LinkValue | null) => {
    if (!linkTargetNode || !onChangeLink) return;
    onChangeLink(linkTargetNode.id, value);
  }, [linkTargetNode, onChangeLink]);

  if (selectionCount === 0) return null;

  const TOOLBAR_HEIGHT = 36;
  const GAP = 8;
  const ROTATION_HANDLE_CLEARANCE = 52;
  const handleClearance = selectionCount === 1 ? ROTATION_HANDLE_CLEARANCE : 0;

  const placeAbove = bbox.y > TOOLBAR_HEIGHT + GAP + handleClearance + 8;
  const top = placeAbove ? bbox.y - TOOLBAR_HEIGHT - GAP - handleClearance : bbox.y + bbox.height + GAP;
  const left = bbox.x + bbox.width / 2;

  const linkValue = linkTargetNode ? getSelectionLinkValue(linkTargetNode) : null;
  const popoverTop = top + TOOLBAR_HEIGHT + GAP;
  const selectionSummary = formatSelectionToolbarSummary(selectedNodes, locale);

  return (
    <>
      <div
        role="toolbar"
        aria-label={getSelectionToolbarAriaLabel(locale)}
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
          data-builder-selection-toolbar-summary="true"
        >
          {selectionSummary}
        </span>
        {actions.map((action, index) => (
          <SelectionToolbarActionButton
            key={action.key}
            action={action}
            index={index}
          />
        ))}
      </div>
      {linkPopoverOpen && linkTargetNode && onChangeLink ? (
        <div
          role="dialog"
          aria-label={copy.link.dialogLabel}
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
            onChange={handleLinkPickerChange}
            context={linkPickerContext}
            locale={locale}
          />
        </div>
      ) : null}
    </>
  );
}

export default memo(SelectionToolbar);
