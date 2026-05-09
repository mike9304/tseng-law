'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { resolveViewportRect, type Viewport } from '@/lib/builder/canvas/responsive';
import type { LinkValue } from '@/lib/builder/links';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

type UseCanvasLinkEditingArgs = {
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
  childrenMap: Record<string, string[]>;
  geometryViewport: Viewport;
  nodes: BuilderCanvasNode[];
  nodesById: Map<string, BuilderCanvasNode>;
  selectedNodeId: string | null;
  selectedNodes: BuilderCanvasNode[];
  setSelectedNodeIds: (nodeIds: string[], primaryNodeId?: string | null) => void;
  updateNodeContent: (nodeId: string, content: Record<string, unknown>, mode?: 'commit' | 'transient') => void;
  visibleNodes: BuilderCanvasNode[];
};

export function useCanvasLinkEditing({
  absoluteRectById,
  childrenMap,
  geometryViewport,
  nodes,
  nodesById,
  selectedNodeId,
  selectedNodes,
  setSelectedNodeIds,
  updateNodeContent,
  visibleNodes,
}: UseCanvasLinkEditingArgs) {
  const [selectionLinkPopoverOpen, setSelectionLinkPopoverOpen] = useState(false);
  const [inlineEditingNodeId, setInlineEditingNodeId] = useState<string | null>(null);

  const handleInlineEditingChange = useCallback((nodeId: string, editing: boolean) => {
    setInlineEditingNodeId((current) => {
      if (editing) return nodeId;
      return current === nodeId ? null : current;
    });
  }, []);

  useEffect(() => {
    if (!inlineEditingNodeId) return;
    if (!nodes.some((node) => node.id === inlineEditingNodeId)) {
      setInlineEditingNodeId(null);
    }
  }, [inlineEditingNodeId, nodes]);

  const resolveEditableLinkNode = useCallback(
    (node: BuilderCanvasNode | undefined): BuilderCanvasNode | null => {
      if (!node) return null;
      if (node.kind === 'button' || node.kind === 'image' || node.kind === 'container') return node;

      const matches: BuilderCanvasNode[] = [];
      const visit = (nodeId: string) => {
        for (const childId of childrenMap[nodeId] ?? []) {
          const child = nodesById.get(childId);
          if (!child || !child.visible) continue;
          if (child.kind === 'button') {
            matches.push(child);
          }
          visit(child.id);
        }
      };

      visit(node.id);
      if (matches.length === 0) {
        const nodeRect = absoluteRectById.get(node.id) ?? resolveViewportRect(node, geometryViewport);
        for (const candidate of visibleNodes) {
          if (candidate.id === node.id || candidate.kind !== 'button') continue;
          const candidateRect = absoluteRectById.get(candidate.id) ?? resolveViewportRect(candidate, geometryViewport);
          const centerX = candidateRect.x + candidateRect.width / 2;
          const centerY = candidateRect.y + candidateRect.height / 2;
          const isInside =
            centerX >= nodeRect.x &&
            centerX <= nodeRect.x + nodeRect.width &&
            centerY >= nodeRect.y &&
            centerY <= nodeRect.y + nodeRect.height;
          if (isInside) {
            matches.push(candidate);
          }
        }
      }
      return matches.length === 1 ? matches[0] : null;
    },
    [absoluteRectById, childrenMap, geometryViewport, nodesById, visibleNodes],
  );

  const selectedLinkTargetNode = useMemo(
    () => (selectedNodes.length === 1 ? resolveEditableLinkNode(selectedNodes[0]) : null),
    [resolveEditableLinkNode, selectedNodes],
  );

  const focusSelectedLinkInput = useCallback(() => {
    if (!selectedLinkTargetNode || typeof document === 'undefined') return;
    if (selectedNodeId !== selectedLinkTargetNode.id) {
      setSelectedNodeIds([selectedLinkTargetNode.id], selectedLinkTargetNode.id);
    }
    document.dispatchEvent(
      new CustomEvent('builder:focus-href-input', {
        detail: { nodeId: selectedLinkTargetNode.id },
      }),
    );
  }, [selectedLinkTargetNode, selectedNodeId, setSelectedNodeIds]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ nodeId?: string }>).detail;
      if (!detail?.nodeId) return;
      if (selectedNodeId !== detail.nodeId) {
        setSelectedNodeIds([detail.nodeId], detail.nodeId);
      }
      setSelectionLinkPopoverOpen(true);
    };
    document.addEventListener('builder:open-link-popover', handler);
    return () => document.removeEventListener('builder:open-link-popover', handler);
  }, [selectedNodeId, setSelectedNodeIds]);

  const updateSelectedLink = useCallback(
    (nodeId: string, link: LinkValue | null) => {
      const node = nodesById.get(nodeId);
      if (!node) return;
      if (node.kind === 'button') {
        updateNodeContent(nodeId, {
          link: link ?? undefined,
          href: link?.href ?? '',
          target: link?.target === '_blank' ? '_blank' : undefined,
          rel: link?.rel,
          title: link?.title,
          ariaLabel: link?.ariaLabel,
        });
        return;
      }
      if (node.kind === 'image' || node.kind === 'container') {
        updateNodeContent(nodeId, { link: link ?? undefined });
      }
    },
    [nodesById, updateNodeContent],
  );

  return {
    focusSelectedLinkInput,
    handleInlineEditingChange,
    inlineEditingNodeId,
    selectedLinkTargetNode,
    selectionLinkPopoverOpen,
    setSelectionLinkPopoverOpen,
    updateSelectedLink,
  };
}
