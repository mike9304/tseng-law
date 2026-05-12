'use client';

import ContextMenu from '@/components/builder/canvas/ContextMenu';
import type { ImageEditTab } from '@/components/builder/canvas/ImageEditDialog';
import { type ContextMenuState } from '@/components/builder/canvas/canvasInteraction';
import { linkValueFromLegacy, type LinkValue } from '@/lib/builder/links';
import { isContainerLikeKind, type BuilderCanvasNode } from '@/lib/builder/canvas/types';

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
  matchSelectedNodesSize: (axis: 'width' | 'height') => void;
  nodes: BuilderCanvasNode[];
  onRequestAssetLibrary?: (nodeId: string) => void;
  onRequestImageEditor?: (nodeId: string, initialTab?: ImageEditTab) => void;
  onRequestMoveToPage?: (nodeIds: string[]) => void;
  onRequestSaveAsSection?: (rootNodeId: string) => void;
  selectedLinkTargetNode: BuilderCanvasNode | null;
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

export default function CanvasContextMenuLayer({
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
  matchSelectedNodesSize,
  nodes,
  onRequestAssetLibrary,
  onRequestImageEditor,
  onRequestMoveToPage,
  onRequestSaveAsSection,
  selectedLinkTargetNode,
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
  if (!contextMenu) return null;

  const contextMenuTitle = selectedNodeIds.length > 1
    ? `${selectedNodeIds.length} selected`
    : contextMenu.nodeId ?? 'Context menu';
  const contextMenuNode = nodes.find((node) => node.id === contextMenu.nodeId) ?? null;
  const contextPrimaryNode = contextMenuNode ?? selectedNodes[0] ?? null;
  const contextSelectionCount =
    contextMenuNode && !(selectedNodeIds.length > 1 && selectedNodeIds.includes(contextMenuNode.id))
      ? 1
      : selectedNodeIds.length;

  return (
    <ContextMenu
      x={contextMenu.x}
      y={contextMenu.y}
      title={contextMenuTitle}
      actions={[
        {
          key: 'edit-text',
          label: '텍스트 편집',
          title: '인라인 텍스트 편집 (또는 더블클릭)',
          disabled:
            contextSelectionCount !== 1 ||
            (contextPrimaryNode?.kind !== 'text' && contextPrimaryNode?.kind !== 'heading') ||
            Boolean(contextPrimaryNode?.locked),
          onSelect: () => {
            setContextMenu(null);
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
          label: 'Crop / Filter / Alt...',
          title: '이미지 자르기, 필터, alt 텍스트 편집',
          disabled:
            contextSelectionCount !== 1 ||
            contextPrimaryNode?.kind !== 'image' ||
            Boolean(contextPrimaryNode?.locked) ||
            !onRequestImageEditor,
          onSelect: () => {
            setContextMenu(null);
            if (contextPrimaryNode && onRequestImageEditor) {
              onRequestImageEditor(contextPrimaryNode.id, 'crop');
            }
          },
        },
        {
          key: 'replace-image',
          label: '이미지 교체',
          title: '에셋 라이브러리 열기',
          disabled:
            contextSelectionCount !== 1 ||
            contextPrimaryNode?.kind !== 'image' ||
            Boolean(contextPrimaryNode?.locked),
          onSelect: () => {
            setContextMenu(null);
            if (contextPrimaryNode && onRequestAssetLibrary) {
              onRequestAssetLibrary(contextPrimaryNode.id);
            }
          },
        },
        {
          key: 'edit-alt',
          label: 'Alt 텍스트 편집',
          title: '이미지 alt 텍스트 편집',
          disabled:
            contextSelectionCount !== 1 ||
            contextPrimaryNode?.kind !== 'image' ||
            Boolean(contextPrimaryNode?.locked) ||
            !onRequestImageEditor,
          onSelect: () => {
            setContextMenu(null);
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
              return `링크 편집 - ${preview}`;
            }
            return '링크 편집';
          })(),
          title: '링크 편집 (Cmd+K)',
          shortcut: '⌘K',
          disabled:
            selectedNodeIds.length !== 1 ||
            !selectedLinkTargetNode ||
            Boolean(selectedNodes[0]?.locked) ||
            Boolean(selectedLinkTargetNode.locked),
          onSelect: () => {
            setContextMenu(null);
            focusSelectedLinkInput();
          },
        },
        {
          key: 'remove-link',
          label: '링크 제거',
          title: '현재 링크 제거',
          disabled: (() => {
            if (!selectedLinkTargetNode || selectedLinkTargetNode.locked) return true;
            const value = linkValueFromLegacy(
              (selectedLinkTargetNode.content as Parameters<typeof linkValueFromLegacy>[0]) || {},
            );
            return !value?.href;
          })(),
          onSelect: () => {
            setContextMenu(null);
            if (selectedLinkTargetNode) {
              updateSelectedLink(selectedLinkTargetNode.id, null);
            }
          },
        },
        { key: 'sep-clipboard', label: '', separator: true },
        {
          key: 'copy',
          label: 'Copy',
          shortcut: '⌘C',
          title: '복사 (Cmd-C)',
          disabled: selectedNodeIds.length === 0,
          onSelect: handleCopy,
        },
        {
          key: 'cut',
          label: 'Cut',
          shortcut: '⌘X',
          title: '잘라내기 (Cmd-X)',
          disabled: !hasUnlockedSelection,
          onSelect: handleCut,
        },
        {
          key: 'paste',
          label: 'Paste',
          shortcut: '⌘V',
          title: '붙여넣기 (Cmd-V)',
          disabled: !clipboardHasContent,
          onSelect: handlePaste,
        },
        {
          key: 'duplicate',
          label: 'Duplicate',
          shortcut: '⌘D',
          title: '복제 (Cmd-D)',
          disabled: !hasUnlockedSelection,
          onSelect: handleDuplicate,
        },
        {
          key: 'paste-style',
          label: 'Paste style',
          shortcut: '⌥⌘V',
          title: '선택 노드에 스타일만 붙여넣기',
          disabled: !styleClipboardHasContent || !hasUnlockedSelection,
          onSelect: () => {
            setContextMenu(null);
            handlePasteStyle();
          },
        },
        {
          key: 'copy-style',
          label: 'Copy style',
          shortcut: '⌥⌘C',
          title: '선택 노드의 스타일만 복사',
          disabled: contextSelectionCount !== 1 || !contextPrimaryNode,
          onSelect: () => {
            setContextMenu(null);
            handleCopyStyle();
          },
        },
        { key: 'sep-arrange', label: '', separator: true },
        {
          key: 'bring-front',
          label: 'Bring to front',
          shortcut: '⇧⌘]',
          title: '맨 앞으로 가져오기',
          disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
          onSelect: bringSelectedNodeToFront,
        },
        {
          key: 'bring-forward',
          label: 'Bring forward',
          shortcut: '⌘]',
          title: '한 단계 앞으로',
          disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
          onSelect: bringSelectedNodeForward,
        },
        {
          key: 'send-backward',
          label: 'Send backward',
          shortcut: '⌘[',
          title: '한 단계 뒤로',
          disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
          onSelect: sendSelectedNodeBackward,
        },
        {
          key: 'send-back',
          label: 'Send to back',
          shortcut: '⇧⌘[',
          title: '맨 뒤로 보내기',
          disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
          onSelect: sendSelectedNodeToBack,
        },
        {
          key: 'lock',
          label: selectedNodes.every((node) => node.locked) ? 'Unlock selection' : 'Lock selection',
          title: '선택 잠금 토글',
          shortcut: '⌘L',
          disabled: selectedNodeIds.length === 0,
          onSelect: toggleSelectedNodeLock,
        },
        { key: 'sep-align', label: '', separator: true },
        {
          key: 'align-left',
          label: 'Align left',
          title: '왼쪽 정렬',
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => alignSelectedNodes('left'),
        },
        {
          key: 'align-center',
          label: 'Align center',
          title: '가운데 정렬',
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => alignSelectedNodes('center'),
        },
        {
          key: 'align-right',
          label: 'Align right',
          title: '오른쪽 정렬',
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => alignSelectedNodes('right'),
        },
        {
          key: 'align-top',
          label: 'Align top',
          title: '상단 정렬',
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => alignSelectedNodes('top'),
        },
        {
          key: 'align-middle',
          label: 'Align middle',
          title: '중앙 정렬',
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => alignSelectedNodes('middle'),
        },
        {
          key: 'align-bottom',
          label: 'Align bottom',
          title: '하단 정렬',
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => alignSelectedNodes('bottom'),
        },
        { key: 'sep-distribute', label: '', separator: true, onSelect: () => {} },
        {
          key: 'distribute-horizontal',
          label: 'Distribute horizontally',
          title: '가로 균등 분배 (3개 이상)',
          disabled: selectedNodeIds.length < 3 || !hasUnlockedSelection,
          onSelect: () => distributeSelectedNodes('horizontal'),
        },
        {
          key: 'distribute-vertical',
          label: 'Distribute vertically',
          title: '세로 균등 분배 (3개 이상)',
          disabled: selectedNodeIds.length < 3 || !hasUnlockedSelection,
          onSelect: () => distributeSelectedNodes('vertical'),
        },
        {
          key: 'match-width',
          label: 'Match width',
          title: '선택 요소 너비 동일화',
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => matchSelectedNodesSize('width'),
        },
        {
          key: 'match-height',
          label: 'Match height',
          title: '선택 요소 높이 동일화',
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: () => matchSelectedNodesSize('height'),
        },
        { key: 'sep-state', label: '', separator: true },
        {
          key: 'hide-on-viewport',
          label: 'Hide on viewport',
          title: '현재 선택을 특정 viewport에서 숨깁니다',
          disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
          children: [
            {
              key: 'hide-desktop',
              label: 'Hide on desktop',
              onSelect: () => {
                if (!selectedNodes[0]) return;
                updateNode(selectedNodes[0].id, (node) => ({ ...node, visible: false }));
              },
            },
            {
              key: 'hide-tablet',
              label: 'Hide on tablet',
              onSelect: () => {
                if (!selectedNodes[0]) return;
                updateResponsiveOverride(selectedNodes[0].id, 'tablet', { hidden: true });
              },
            },
            {
              key: 'hide-mobile',
              label: 'Hide on mobile',
              onSelect: () => {
                if (!selectedNodes[0]) return;
                updateResponsiveOverride(selectedNodes[0].id, 'mobile', { hidden: true });
              },
            },
          ],
        },
        {
          key: 'pin-to-screen',
          label: 'Pin to screen',
          title: 'Coming soon - Codex F-track',
          disabled: true,
        },
        {
          key: 'anchor-link',
          label: 'Anchor link...',
          title: 'Use the Layout tab to edit anchor name',
          disabled: true,
        },
        {
          key: 'animations',
          label: 'Animations...',
          title: 'Open the Animations tab in the inspector',
          disabled: true,
        },
        {
          key: 'effects',
          label: 'Effects...',
          title: 'Coming soon - Codex F-track',
          disabled: true,
        },
        { key: 'sep-pages', label: '', separator: true, onSelect: () => {} },
        {
          key: 'move-to-page',
          label: 'Move to page...',
          title: '다른 페이지로 이동',
          disabled: selectedNodeIds.length === 0 || !hasUnlockedSelection || !onRequestMoveToPage,
          onSelect: () => {
            if (onRequestMoveToPage) {
              onRequestMoveToPage(selectedNodeIds);
            }
          },
        },
        {
          key: 'save-as-section',
          label: 'Save as section...',
          title: '컨테이너 + 자식을 라이브러리에 저장 (재사용)',
          disabled:
            selectedNodeIds.length !== 1 ||
            !selectedNodes[0] ||
            !isContainerLikeKind(selectedNodes[0].kind) ||
            !onRequestSaveAsSection,
          onSelect: () => {
            setContextMenu(null);
            if (onRequestSaveAsSection && selectedNodes[0]) {
              onRequestSaveAsSection(selectedNodes[0].id);
            }
          },
        },
        {
          key: 'add-to-library',
          label: 'Add to library',
          title: 'Coming soon - Codex F-track',
          disabled: true,
        },
        {
          key: 'convert-to-component',
          label: 'Convert to component',
          title: 'Coming soon - Codex F-track',
          disabled: true,
        },
        {
          key: 'style-override',
          label: 'Style override',
          title: 'Coming soon - Codex F-track',
          disabled: true,
          children: [
            { key: 'override-fill', label: 'Fill override', disabled: true, title: 'Coming soon - Codex F-track' },
            { key: 'override-typography', label: 'Typography override', disabled: true, title: 'Coming soon - Codex F-track' },
            { key: 'override-effects', label: 'Effects override', disabled: true, title: 'Coming soon - Codex F-track' },
          ],
        },
        {
          key: 'reset-style',
          label: 'Reset style',
          title: 'Coming soon - Codex F-track',
          disabled: true,
        },
        { key: 'sep-group', label: '', separator: true, onSelect: () => {} },
        {
          key: 'group',
          label: 'Group',
          title: '그룹 만들기 (2개 이상)',
          shortcut: 'Cmd+G',
          disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
          onSelect: groupSelectedNodes,
        },
        {
          key: 'ungroup',
          label: 'Ungroup',
          title: '그룹 해제',
          shortcut: 'Cmd+Shift+G',
          disabled:
            selectedNodeIds.length !== 1 ||
            selectedNodes[0]?.kind !== 'container' ||
            (selectedNodes[0]?.id ? (childrenMap[selectedNodes[0].id]?.length ?? 0) === 0 : true),
          onSelect: ungroupSelectedNode,
        },
        { key: 'sep-danger', label: '', separator: true },
        {
          key: 'delete',
          label: 'Delete',
          shortcut: '⌫',
          title: '삭제 (Delete)',
          tone: 'danger',
          disabled: !hasUnlockedSelection,
          onSelect: deleteSelectedNode,
        },
      ]}
      onClose={() => setContextMenu(null)}
    />
  );
}
