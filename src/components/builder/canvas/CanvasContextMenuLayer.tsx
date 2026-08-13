'use client';

import { memo, useCallback, useMemo } from 'react';
import ContextMenu, { type ContextMenuAction } from '@/components/builder/canvas/ContextMenu';
import type { ImageEditTab } from '@/components/builder/canvas/ImageEditDialog';
import { useShortcutLabels, type ShortcutAction } from '@/components/builder/canvas/hooks/useShortcutLabels';
import { type ContextMenuState } from '@/components/builder/canvas/canvasInteraction';
import { linkValueFromLegacy, type LinkValue } from '@/lib/builder/links';
import { isContainerLikeKind, type BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getCanvasContextMenuCopy } from './canvas-context-menu-copy';

const CONTEXT_MENU_SHORTCUT_ACTIONS: ShortcutAction[] = [
  'editLink',
  'copy',
  'cut',
  'paste',
  'duplicate',
  'pasteStyle',
  'copyStyle',
  'bringToFront',
  'bringForward',
  'sendBackward',
  'sendToBack',
  'toggleLock',
  'group',
  'ungroup',
  'delete',
];

const EMPTY_CONTEXT_MENU_ACTIONS: ContextMenuAction[] = [];

type CanvasContextMenuLayerProps = {
  alignSelectedNodes: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  bringSelectedNodeForward: () => void;
  bringSelectedNodeToFront: () => void;
  childrenMap: Record<string, string[]>;
  clipboardHasContent: boolean;
  contextMenu: ContextMenuState | null;
  deleteSelectedNode: () => void;
  distributeSelectedNodes: (axis: 'horizontal' | 'vertical') => void;
  focusSelectedLinkInput: () => void;
  groupSelectedNodes: () => void;
  handleCopy: () => void;
  handleCopyStyle: () => void;
  handleCut: () => void;
  handleDuplicate: () => void;
  handlePaste: () => void;
  handlePasteStyle: () => void;
  hasUnlockedSelection: boolean;
  locale?: Locale;
  matchSelectedNodesSize: (axis: 'width' | 'height') => void;
  nodesById: Map<string, BuilderCanvasNode>;
  onRequestAssetLibrary?: (nodeId: string) => void;
  onRequestImageEditor?: (nodeId: string, initialTab?: ImageEditTab) => void;
  onRequestMoveToPage?: (nodeIds: string[]) => void;
  onRequestSaveAsSection?: (rootNodeId: string) => void;
  selectedLinkTargetNode: BuilderCanvasNode | null;
  selectedNodeIdSet: ReadonlySet<string>;
  selectedNodeIds: string[];
  selectedNodes: BuilderCanvasNode[];
  sendSelectedNodeBackward: () => void;
  sendSelectedNodeToBack: () => void;
  setContextMenu: (menu: ContextMenuState | null) => void;
  styleClipboardHasContent: boolean;
  toggleSelectedNodeLock: () => void;
  ungroupSelectedNode: () => void;
  updateNode: (nodeId: string, updater: (node: BuilderCanvasNode) => BuilderCanvasNode) => void;
  updateResponsiveOverride: (nodeId: string, viewport: 'tablet' | 'mobile', override: { hidden: true }) => void;
  updateSelectedLink: (nodeId: string, link: LinkValue | null) => void;
};

function CanvasContextMenuLayer({
  alignSelectedNodes,
  bringSelectedNodeForward,
  bringSelectedNodeToFront,
  childrenMap,
  clipboardHasContent,
  contextMenu,
  deleteSelectedNode,
  distributeSelectedNodes,
  focusSelectedLinkInput,
  groupSelectedNodes,
  handleCopy,
  handleCopyStyle,
  handleCut,
  handleDuplicate,
  handlePaste,
  handlePasteStyle,
  hasUnlockedSelection,
  locale = 'ko',
  matchSelectedNodesSize,
  nodesById,
  onRequestAssetLibrary,
  onRequestImageEditor,
  onRequestMoveToPage,
  onRequestSaveAsSection,
  selectedLinkTargetNode,
  selectedNodeIdSet,
  selectedNodeIds,
  selectedNodes,
  sendSelectedNodeBackward,
  sendSelectedNodeToBack,
  setContextMenu,
  styleClipboardHasContent,
  toggleSelectedNodeLock,
  ungroupSelectedNode,
  updateNode,
  updateResponsiveOverride,
  updateSelectedLink,
}: CanvasContextMenuLayerProps) {
  const copy = useMemo(() => getCanvasContextMenuCopy(locale), [locale]);
  const shortcutLabels = useShortcutLabels(CONTEXT_MENU_SHORTCUT_ACTIONS);
  const shortcutGlyph = useCallback(
    (action: ShortcutAction) => shortcutLabels.get(action)?.glyph ?? '',
    [shortcutLabels],
  );
  const shortcutTitle = useCallback((title: string, action: ShortcutAction) => {
    const label = shortcutLabels.get(action)?.title;
    return label ? `${title} (${label})` : title;
  }, [shortcutLabels]);
  const closeContextMenu = useCallback(() => setContextMenu(null), [setContextMenu]);

  const hasContextMenu = contextMenu != null;
  const contextMenuNode = hasContextMenu ? nodesById.get(contextMenu.nodeId) ?? null : null;
  const contextMenuTitle = hasContextMenu && selectedNodeIds.length > 1
    ? copy.selectedCountTitle(selectedNodeIds.length)
    : copy.nodeMenuTitle(contextMenuNode?.kind);
  const contextPrimaryNode = contextMenuNode ?? selectedNodes[0] ?? null;
  const contextSelectionCount =
    contextMenuNode && !(selectedNodeIds.length > 1 && selectedNodeIdSet.has(contextMenuNode.id))
      ? 1
      : selectedNodeIds.length;

  const actions = useMemo<ContextMenuAction[]>(() => {
    if (!hasContextMenu) return EMPTY_CONTEXT_MENU_ACTIONS;
    return [
        {
          key: 'edit-text',
          label: copy.textEditLabel,
          title: copy.textEditTitle,
          disabled:
            contextSelectionCount !== 1 ||
            (contextPrimaryNode?.kind !== 'text' && contextPrimaryNode?.kind !== 'heading') ||
            Boolean(contextPrimaryNode?.locked),
          onSelect: () => {
            closeContextMenu();
            if (typeof document !== 'undefined' && contextPrimaryNode) {
              document.dispatchEvent(
                new CustomEvent('builder:start-text-edit', {
                  detail: { nodeId: contextPrimaryNode.id },
                }),
              );
            }
          },
        },
        {
          key: 'image-edit',
          label: copy.imageEditLabel,
          title: copy.imageEditTitle,
          disabled:
            contextSelectionCount !== 1 ||
            contextPrimaryNode?.kind !== 'image' ||
            Boolean(contextPrimaryNode?.locked) ||
            !onRequestImageEditor,
          onSelect: () => {
            closeContextMenu();
            if (contextPrimaryNode && onRequestImageEditor) {
              onRequestImageEditor(contextPrimaryNode.id, 'crop');
            }
          },
        },
        {
          key: 'replace-image',
          label: copy.replaceImageLabel,
          title: copy.replaceImageTitle,
          disabled:
            contextSelectionCount !== 1 ||
            contextPrimaryNode?.kind !== 'image' ||
            Boolean(contextPrimaryNode?.locked),
          onSelect: () => {
            closeContextMenu();
            if (contextPrimaryNode && onRequestAssetLibrary) {
              onRequestAssetLibrary(contextPrimaryNode.id);
            }
          },
        },
        {
          key: 'edit-alt',
          label: copy.editAltLabel,
          title: copy.editAltTitle,
          disabled:
            contextSelectionCount !== 1 ||
            contextPrimaryNode?.kind !== 'image' ||
            Boolean(contextPrimaryNode?.locked) ||
            !onRequestImageEditor,
          onSelect: () => {
            closeContextMenu();
            if (contextPrimaryNode && onRequestImageEditor) {
              onRequestImageEditor(contextPrimaryNode.id, 'alt');
            }
          },
        },
        {
          key: 'edit-link',
          label: (() => {
            const value = selectedLinkTargetNode
              ? linkValueFromLegacy((selectedLinkTargetNode.content as Parameters<typeof linkValueFromLegacy>[0]) || {})
              : null;
            if (value?.href) {
              const trimmed = value.href.trim();
              const preview = trimmed.length > 20 ? `${trimmed.slice(0, 18)}...` : trimmed;
              return copy.editLinkWithPreviewLabel(preview);
            }
            return copy.editLinkLabel;
          })(),
          title: shortcutTitle(copy.editLinkLabel, 'editLink'),
          shortcut: shortcutGlyph('editLink'),
          disabled:
            selectedNodeIds.length !== 1 ||
            !selectedLinkTargetNode ||
            Boolean(selectedNodes[0]?.locked) ||
            Boolean(selectedLinkTargetNode.locked),
          onSelect: () => {
            closeContextMenu();
            focusSelectedLinkInput();
          },
        },
        {
          key: 'remove-link',
          label: copy.removeLinkLabel,
          title: copy.removeLinkTitle,
          disabled: (() => {
            if (!selectedLinkTargetNode || selectedLinkTargetNode.locked) return true;
            const value = linkValueFromLegacy(
              (selectedLinkTargetNode.content as Parameters<typeof linkValueFromLegacy>[0]) || {},
            );
            return !value?.href;
          })(),
          onSelect: () => {
            closeContextMenu();
            if (selectedLinkTargetNode) {
              updateSelectedLink(selectedLinkTargetNode.id, null);
            }
          },
        },
        { key: 'sep-clipboard', label: '', separator: true },
        {
          key: 'copy',
          label: copy.copyLabel,
          shortcut: shortcutGlyph('copy'),
          title: shortcutTitle(copy.copyLabel, 'copy'),
          disabled: selectedNodeIds.length === 0,
          onSelect: handleCopy,
        },
        {
          key: 'cut',
          label: copy.cutLabel,
          shortcut: shortcutGlyph('cut'),
          title: shortcutTitle(copy.cutLabel, 'cut'),
          disabled: !hasUnlockedSelection,
          onSelect: handleCut,
        },
        {
          key: 'paste',
          label: copy.pasteLabel,
          shortcut: shortcutGlyph('paste'),
          title: shortcutTitle(copy.pasteLabel, 'paste'),
          disabled: !clipboardHasContent,
          onSelect: handlePaste,
        },
        {
          key: 'duplicate',
          label: copy.duplicateLabel,
          shortcut: shortcutGlyph('duplicate'),
          title: shortcutTitle(copy.duplicateLabel, 'duplicate'),
          disabled: !hasUnlockedSelection,
          onSelect: handleDuplicate,
        },
        {
          key: 'paste-style',
          label: copy.pasteStyleLabel,
          shortcut: shortcutGlyph('pasteStyle'),
          title: copy.pasteStyleTitle,
          disabled: !styleClipboardHasContent || !hasUnlockedSelection,
          onSelect: () => {
            closeContextMenu();
            handlePasteStyle();
          },
        },
        {
          key: 'copy-style',
          label: copy.copyStyleLabel,
          shortcut: shortcutGlyph('copyStyle'),
          title: copy.copyStyleTitle,
          disabled: contextSelectionCount !== 1 || !contextPrimaryNode,
          onSelect: () => {
            closeContextMenu();
            handleCopyStyle();
          },
        },
        { key: 'sep-arrange', label: '', separator: true },
        {
          key: 'bring-front',
          label: copy.bringToFrontLabel,
          shortcut: shortcutGlyph('bringToFront'),
          title: copy.bringToFrontTitle,
          disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
          onSelect: bringSelectedNodeToFront,
        },
        {
          key: 'bring-forward',
          label: copy.bringForwardLabel,
          shortcut: shortcutGlyph('bringForward'),
          title: copy.bringForwardTitle,
          disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
          onSelect: bringSelectedNodeForward,
        },
        {
          key: 'send-backward',
          label: copy.sendBackwardLabel,
          shortcut: shortcutGlyph('sendBackward'),
          title: copy.sendBackwardTitle,
          disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
          onSelect: sendSelectedNodeBackward,
        },
        {
          key: 'send-back',
          label: copy.sendToBackLabel,
          shortcut: shortcutGlyph('sendToBack'),
          title: copy.sendToBackTitle,
          disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
          onSelect: sendSelectedNodeToBack,
        },
        {
          key: 'lock',
          label: selectedNodes.every((node) => node.locked) ? copy.unlockLabel : copy.lockLabel,
          title: copy.lockTitle,
          shortcut: shortcutGlyph('toggleLock'),
          disabled: selectedNodeIds.length === 0,
          onSelect: toggleSelectedNodeLock,
        },
        { key: 'sep-align', label: '', separator: true },
        {
          key: 'align-left',
          label: copy.alignLeftLabel,
          title: copy.alignLeftTitle,
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => alignSelectedNodes('left'),
        },
        {
          key: 'align-center',
          label: copy.alignCenterLabel,
          title: copy.alignCenterTitle,
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => alignSelectedNodes('center'),
        },
        {
          key: 'align-right',
          label: copy.alignRightLabel,
          title: copy.alignRightTitle,
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => alignSelectedNodes('right'),
        },
        {
          key: 'align-top',
          label: copy.alignTopLabel,
          title: copy.alignTopTitle,
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => alignSelectedNodes('top'),
        },
        {
          key: 'align-middle',
          label: copy.alignMiddleLabel,
          title: copy.alignMiddleTitle,
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => alignSelectedNodes('middle'),
        },
        {
          key: 'align-bottom',
          label: copy.alignBottomLabel,
          title: copy.alignBottomTitle,
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => alignSelectedNodes('bottom'),
        },
        { key: 'sep-distribute', label: '', separator: true, onSelect: () => {} },
        {
          key: 'distribute-horizontal',
          label: copy.distributeHorizontalLabel,
          title: copy.distributeHorizontalTitle,
          disabled: selectedNodeIds.length < 3 || !hasUnlockedSelection,
          onSelect: () => distributeSelectedNodes('horizontal'),
        },
        {
          key: 'distribute-vertical',
          label: copy.distributeVerticalLabel,
          title: copy.distributeVerticalTitle,
          disabled: selectedNodeIds.length < 3 || !hasUnlockedSelection,
          onSelect: () => distributeSelectedNodes('vertical'),
        },
        {
          key: 'match-width',
          label: copy.matchWidthLabel,
          title: copy.matchWidthTitle,
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => matchSelectedNodesSize('width'),
        },
        {
          key: 'match-height',
          label: copy.matchHeightLabel,
          title: copy.matchHeightTitle,
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => matchSelectedNodesSize('height'),
        },
        { key: 'sep-state', label: '', separator: true },
        {
          key: 'hide-on-viewport',
          label: copy.hideOnViewportLabel,
          title: copy.hideOnViewportTitle,
          disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
          children: [
            {
              key: 'hide-desktop',
              label: copy.hideDesktopLabel,
              onSelect: () => {
                if (!selectedNodes[0]) return;
                updateNode(selectedNodes[0].id, (node) => ({ ...node, visible: false }));
              },
            },
            {
              key: 'hide-tablet',
              label: copy.hideTabletLabel,
              onSelect: () => {
                if (!selectedNodes[0]) return;
                updateResponsiveOverride(selectedNodes[0].id, 'tablet', { hidden: true });
              },
            },
            {
              key: 'hide-mobile',
              label: copy.hideMobileLabel,
              onSelect: () => {
                if (!selectedNodes[0]) return;
                updateResponsiveOverride(selectedNodes[0].id, 'mobile', { hidden: true });
              },
            },
          ],
        },
        {
          key: 'pin-to-screen',
          label: copy.pinToScreenLabel,
          title: copy.pinToScreenTitle,
          disabled: true,
        },
        {
          key: 'anchor-link',
          label: copy.anchorLinkLabel,
          title: copy.anchorLinkTitle,
          disabled: true,
        },
        {
          key: 'animations',
          label: copy.animationsLabel,
          title: copy.animationsTitle,
          disabled: true,
        },
        {
          key: 'effects',
          label: copy.effectsLabel,
          title: copy.effectsTitle,
          disabled: true,
        },
        { key: 'sep-pages', label: '', separator: true, onSelect: () => {} },
        {
          key: 'move-to-page',
          label: copy.moveToPageLabel,
          title: copy.moveToPageTitle,
          disabled: selectedNodeIds.length === 0 || !hasUnlockedSelection || !onRequestMoveToPage,
          onSelect: () => {
            if (onRequestMoveToPage) {
              onRequestMoveToPage(selectedNodeIds);
            }
          },
        },
        {
          key: 'save-as-section',
          label: copy.saveAsSectionLabel,
          title: copy.saveAsSectionTitle,
          disabled:
            selectedNodeIds.length !== 1 ||
            !selectedNodes[0] ||
            !isContainerLikeKind(selectedNodes[0].kind) ||
            !onRequestSaveAsSection,
          onSelect: () => {
            closeContextMenu();
            if (onRequestSaveAsSection && selectedNodes[0]) {
              onRequestSaveAsSection(selectedNodes[0].id);
            }
          },
        },
        {
          key: 'add-to-library',
          label: copy.addToLibraryLabel,
          title: copy.addToLibraryTitle,
          disabled: true,
        },
        {
          key: 'convert-to-component',
          label: copy.convertToComponentLabel,
          title: copy.convertToComponentTitle,
          disabled: true,
        },
        {
          key: 'style-override',
          label: copy.styleOverrideLabel,
          title: copy.styleOverrideTitle,
          disabled: true,
          children: [
            { key: 'override-fill', label: copy.overrideFillLabel, disabled: true, title: copy.styleOverrideTitle },
            { key: 'override-typography', label: copy.overrideTypographyLabel, disabled: true, title: copy.styleOverrideTitle },
            { key: 'override-effects', label: copy.overrideEffectsLabel, disabled: true, title: copy.styleOverrideTitle },
          ],
        },
        {
          key: 'reset-style',
          label: copy.resetStyleLabel,
          title: copy.resetStyleTitle,
          disabled: true,
        },
        { key: 'sep-group', label: '', separator: true, onSelect: () => {} },
        {
          key: 'group',
          label: copy.groupLabel,
          title: copy.groupTitle,
          shortcut: shortcutGlyph('group'),
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: groupSelectedNodes,
        },
        {
          key: 'ungroup',
          label: copy.ungroupLabel,
          title: copy.ungroupTitle,
          shortcut: shortcutGlyph('ungroup'),
          disabled:
            selectedNodeIds.length !== 1 ||
            selectedNodes[0]?.kind !== 'container' ||
            (selectedNodes[0]?.id ? (childrenMap[selectedNodes[0].id]?.length ?? 0) === 0 : true),
          onSelect: ungroupSelectedNode,
        },
        { key: 'sep-danger', label: '', separator: true },
        {
          key: 'delete',
          label: copy.deleteLabel,
          shortcut: shortcutGlyph('delete'),
          title: shortcutTitle(copy.deleteLabel, 'delete'),
          tone: 'danger',
          disabled: !hasUnlockedSelection,
          onSelect: deleteSelectedNode,
        },
    ];
  }, [
    alignSelectedNodes,
    bringSelectedNodeForward,
    bringSelectedNodeToFront,
    childrenMap,
    clipboardHasContent,
    closeContextMenu,
    hasContextMenu,
    contextPrimaryNode,
    contextSelectionCount,
    copy,
    deleteSelectedNode,
    distributeSelectedNodes,
    focusSelectedLinkInput,
    groupSelectedNodes,
    handleCopy,
    handleCopyStyle,
    handleCut,
    handleDuplicate,
    handlePaste,
    handlePasteStyle,
    hasUnlockedSelection,
    matchSelectedNodesSize,
    onRequestAssetLibrary,
    onRequestImageEditor,
    onRequestMoveToPage,
    onRequestSaveAsSection,
    selectedLinkTargetNode,
    selectedNodeIds,
    selectedNodes,
    sendSelectedNodeBackward,
    sendSelectedNodeToBack,
    shortcutGlyph,
    shortcutTitle,
    styleClipboardHasContent,
    toggleSelectedNodeLock,
    ungroupSelectedNode,
    updateNode,
    updateResponsiveOverride,
    updateSelectedLink,
  ]);

  if (!contextMenu) return null;

  return (
    <ContextMenu
      x={contextMenu.x}
      y={contextMenu.y}
      title={contextMenuTitle}
      actions={actions}
      onClose={closeContextMenu}
    />
  );
}

export default memo(CanvasContextMenuLayer);
