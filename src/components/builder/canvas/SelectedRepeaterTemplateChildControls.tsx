'use client';

import { useCallback, useMemo } from 'react';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { RepeaterTemplateCopy } from './repeater-template-copy';
import type { RepeaterTemplateBindingSummaryWithLock } from './repeater-template-binding-locks';
import { RepeaterTemplateChildBadge } from './RepeaterTemplateChildBadge';

export interface SelectedRepeaterTemplateChildControlsProps {
  readonly activeSiblingNodeIds: readonly string[];
  readonly copy: RepeaterTemplateCopy['childBadge'];
  readonly currentNodeId: string;
  readonly locked: boolean;
  readonly parentNodeId: string;
  readonly recordNumber: number;
  readonly siblingBindings: readonly RepeaterTemplateBindingSummaryWithLock[];
  readonly onSelectParent: (nodeId: string) => void;
  readonly onSelectSibling: (nodeId: string) => void;
  readonly selectSiblingAriaLabel: (kindLabel: string, fieldId: string) => string;
}

export function resolveRepeaterTemplateLockTargetIds(
  currentNodeId: string,
  activeSiblingNodeIds: readonly string[],
): readonly string[] {
  return Array.from(new Set([currentNodeId, ...activeSiblingNodeIds]));
}

export function SelectedRepeaterTemplateChildControls({
  activeSiblingNodeIds,
  copy,
  currentNodeId,
  locked,
  parentNodeId,
  recordNumber,
  siblingBindings,
  onSelectParent,
  onSelectSibling,
  selectSiblingAriaLabel,
}: SelectedRepeaterTemplateChildControlsProps) {
  const nodesById = useBuilderCanvasStore((state) => state.nodesById);
  const childrenMap = useBuilderCanvasStore((state) => state.childrenMap);
  const duplicateSelectedNode = useBuilderCanvasStore((state) => state.duplicateSelectedNode);
  const groupNodeIds = useBuilderCanvasStore((state) => state.groupNodeIds);
  const setSelectedNodeIds = useBuilderCanvasStore((state) => state.setSelectedNodeIds);
  const ungroupSelectedNode = useBuilderCanvasStore((state) => state.ungroupSelectedNode);
  const updateNode = useBuilderCanvasStore((state) => state.updateNode);
  const updateSelectedNodes = useBuilderCanvasStore((state) => state.updateSelectedNodes);
  const groupableSiblingIds = useMemo(() => {
    const unlockedIds = siblingBindings
      .filter((entry) => !entry.locked)
      .map((entry) => entry.nodeId);
    if (unlockedIds.length < 2) return [];
    const firstParentId = nodesById.get(unlockedIds[0] ?? '')?.parentId ?? null;
    if (firstParentId !== parentNodeId) return [];
    const shareParent = unlockedIds.every((nodeId) => (
      (nodesById.get(nodeId)?.parentId ?? null) === firstParentId
    ));
    return shareParent ? unlockedIds : [];
  }, [nodesById, parentNodeId, siblingBindings]);
  const lockTargetIds = useMemo(() => (
    resolveRepeaterTemplateLockTargetIds(currentNodeId, activeSiblingNodeIds)
  ), [activeSiblingNodeIds, currentNodeId]);
  const lockTargetsAreLocked = lockTargetIds.length > 0
    ? lockTargetIds.every((nodeId) => nodesById.get(nodeId)?.locked === true)
    : locked;
  const toggleLock = useCallback(() => {
    const nextLocked = lockTargetIds.some((nodeId) => nodesById.get(nodeId)?.locked !== true);
    updateSelectedNodes([...lockTargetIds], (current) => ({
      ...current,
      locked: nextLocked,
    }));
  }, [lockTargetIds, nodesById, updateSelectedNodes]);
  const groupSiblings = useCallback(() => {
    if (groupableSiblingIds.length < 2) return;
    const primaryNodeId = groupableSiblingIds.includes(currentNodeId)
      ? currentNodeId
      : groupableSiblingIds[0] ?? null;
    groupNodeIds(groupableSiblingIds, primaryNodeId);
  }, [currentNodeId, groupNodeIds, groupableSiblingIds]);
  const currentNode = nodesById.get(currentNodeId);
  const currentChildIds = childrenMap[currentNodeId] ?? [];
  const canManageTemplateGroup = currentNode?.kind === 'container'
    && currentChildIds.length > 0
    && activeSiblingNodeIds.length > 0;
  const templateGroupName = canManageTemplateGroup
    ? currentNode.content.label
    : undefined;
  const canDuplicateTemplateGroup = canManageTemplateGroup && currentNode.locked !== true;
  const duplicateTemplateGroup = useCallback(() => {
    if (!canDuplicateTemplateGroup) return;
    duplicateSelectedNode();
    const nextState = useBuilderCanvasStore.getState();
    const duplicatedGroupId = nextState.selectedNodeIds.find((nodeId) => {
      const node = nextState.nodesById.get(nodeId);
      return node?.kind === 'container' && (nextState.childrenMap[nodeId]?.length ?? 0) > 0;
    });
    if (duplicatedGroupId) setSelectedNodeIds([duplicatedGroupId], duplicatedGroupId);
  }, [canDuplicateTemplateGroup, duplicateSelectedNode, setSelectedNodeIds]);
  const renameTemplateGroup = useCallback((name: string) => {
    if (!canManageTemplateGroup) return;
    const nextName = name.trim();
    if (!nextName) return;
    updateNode(currentNodeId, (current) => {
      if (current.kind !== 'container') return current;
      return {
        ...current,
        content: {
          ...current.content,
          label: nextName,
        },
      };
    });
  }, [canManageTemplateGroup, currentNodeId, updateNode]);

  return (
    <RepeaterTemplateChildBadge
      activeSiblingNodeIds={activeSiblingNodeIds}
      copy={copy}
      currentNodeId={currentNodeId}
      groupableSiblingCount={groupableSiblingIds.length}
      groupName={templateGroupName}
      locked={lockTargetsAreLocked}
      parentNodeId={parentNodeId}
      recordNumber={recordNumber}
      siblingBindings={siblingBindings}
      onDuplicateGroup={canDuplicateTemplateGroup ? duplicateTemplateGroup : undefined}
      onSelectParent={onSelectParent}
      onSelectSibling={onSelectSibling}
      onToggleLock={toggleLock}
      onGroupSiblings={groupableSiblingIds.length >= 2 ? groupSiblings : undefined}
      onRenameGroup={templateGroupName ? renameTemplateGroup : undefined}
      onUngroup={canManageTemplateGroup ? ungroupSelectedNode : undefined}
      selectSiblingAriaLabel={selectSiblingAriaLabel}
    />
  );
}
