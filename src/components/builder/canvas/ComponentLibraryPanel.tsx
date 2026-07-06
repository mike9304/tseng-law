'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import { getComponentLibraryCopy } from './component-library-copy';
import { ComponentLibraryPanelContent } from './ComponentLibraryPanelContent';
import {
  filterAndSortComponentLibraryEntries,
  type ComponentLibraryEntry,
  type ComponentLibraryInsertResult,
  type ComponentLibrarySortMode,
  type ComponentLibraryViewMode,
} from './component-library-panel.helpers';
import type { ComponentLibraryReplaceSelectionResult } from './component-library-replace-selection.helpers';
import { serializeComponentLibrarySelection } from './component-library-selection.helpers';
import { useComponentLibraryEntries } from './useComponentLibraryEntries';
import { useComponentLibraryPanelReviewState } from './useComponentLibraryPanelReviewState';
import { useComponentLibraryRestoreReviewState } from './useComponentLibraryRestoreReviewState';

interface Props {
  selectedNodeJson?: string;
  locale?: Locale;
  onInsert?: (entry: ComponentLibraryEntry) => void;
}

export default function ComponentLibraryPanel({ selectedNodeJson, locale = 'ko', onInsert }: Props) {
  const copy = getComponentLibraryCopy(locale);
  const canvasDocument = useBuilderCanvasStore((state) => state.document);
  const selectedNodeIds = useBuilderCanvasStore((state) => state.selectedNodeIds);
  const childrenMap = useBuilderCanvasStore((state) => state.childrenMap);
  const nodesById = useBuilderCanvasStore((state) => state.nodesById);
  const addNodes = useBuilderCanvasStore((state) => state.addNodes);
  const replaceSelectedNodeWithNodes = useBuilderCanvasStore((state) => state.replaceSelectedNodeWithNodes);
  const setSelectedNodeIds = useBuilderCanvasStore((state) => state.setSelectedNodeIds);
  const setDraftSaveState = useBuilderCanvasStore((state) => state.setDraftSaveState);
  const [name, setName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<ComponentLibrarySortMode>('recent');
  const [viewMode, setViewMode] = useState<ComponentLibraryViewMode>('grid');
  const {
    entries,
    editingEntryId,
    editingName,
    setEditingName,
    saveEntry,
    removeEntry,
    duplicateEntry,
    togglePinnedEntry,
    updateEntryPayload,
    restoreEntryVersion,
    renameEntryVersion,
    deleteEntryVersion,
    startRename,
    cancelRename,
    saveRename,
  } = useComponentLibraryEntries(copy);

  const effectiveSelectedNodeJson = useMemo(() => {
    return serializeComponentLibrarySelection({ canvasDocument, selectedNodeIds, childrenMap, selectedNodeJson });
  }, [canvasDocument, childrenMap, selectedNodeIds, selectedNodeJson]);

  const visibleEntries = useMemo(
    () => filterAndSortComponentLibraryEntries(entries, searchQuery, sortMode),
    [entries, searchQuery, sortMode],
  );
  const replaceTargetNode = selectedNodeIds.length === 1 ? nodesById.get(selectedNodeIds[0] ?? '') ?? null : null;
  const canReplace = Boolean(replaceTargetNode && !replaceTargetNode.locked);

  function commitInsert(parsed: ComponentLibraryInsertResult, parentNodeId: string | null) {
    if (!parsed || parsed.nodes.length === 0) return;
    reviewState.commitInsertRemapSummary(parsed.fieldRemapSummary);
    addNodes(parsed.nodes, parsed.rootNodeId, parentNodeId);
    if (parsed.selectionNodeIds.length > 0) {
      setSelectedNodeIds([...parsed.selectionNodeIds], parsed.rootNodeId);
    }
    setDraftSaveState('saving');
  }

  function commitReplace(prepared: ComponentLibraryReplaceSelectionResult) {
    reviewState.commitInsertRemapSummary(prepared.fieldRemapSummary);
    replaceSelectedNodeWithNodes(prepared.nodes, prepared.rootNodeId, prepared.selectionNodeIds);
    setDraftSaveState('saving');
  }

  const reviewState = useComponentLibraryPanelReviewState({
    entries,
    effectiveSelectedNodeJson,
    selectedNodeIds,
    nodesById,
    childrenMap,
    canvasNodeCount: canvasDocument?.nodes.length ?? 0,
    updateEntryPayload,
    onCommitInsert: commitInsert,
    onCommitReplace: commitReplace,
  });
  const restoreReview = useComponentLibraryRestoreReviewState({
    entries,
    restoreEntryVersion,
    renameEntryVersion,
    deleteEntryVersion,
    onOpen: reviewState.clearAllReviews,
  });

  function save() {
    if (saveEntry(name, effectiveSelectedNodeJson)) setName('');
  }

  function remove(id: string) {
    removeEntry(id);
    reviewState.clearForEntryRemoval(id);
    restoreReview.clearIfEntry(id);
  }

  function insert(entry: ComponentLibraryEntry) {
    if (onInsert) {
      onInsert(entry);
      return;
    }
    restoreReview.close();
    reviewState.insertEntry(entry);
  }

  function replace(entry: ComponentLibraryEntry) {
    if (onInsert) return;
    restoreReview.close();
    reviewState.replaceEntry(entry);
  }

  function updateEntry(id: string) {
    restoreReview.close();
    reviewState.openUpdateReview(id);
  }

  return (
    <ComponentLibraryPanelContent
      copy={copy}
      entries={entries}
      visibleEntries={visibleEntries}
      name={name}
      searchQuery={searchQuery}
      sortMode={sortMode}
      viewMode={viewMode}
      canSave={name.trim().length > 0 && effectiveSelectedNodeJson.length > 0}
      hasSelection={effectiveSelectedNodeJson.length > 0}
      latestRemapSummary={reviewState.latestRemapSummary}
      remapReview={reviewState.remapReview}
      remapFieldOverrides={reviewState.remapFieldOverrides}
      restoreReview={restoreReview.review}
      restoreSnapshotLabel={restoreReview.snapshotLabel}
      updateReview={reviewState.pendingUpdateReview}
      updateSnapshotLabel={reviewState.pendingUpdateSnapshotLabel}
      editingEntryId={editingEntryId}
      editingName={editingName}
      canReplace={canReplace}
      onNameChange={setName}
      onSearchQueryChange={setSearchQuery}
      onSortModeChange={setSortMode}
      onViewModeChange={setViewMode}
      onSave={save}
      onDismissRemapNotice={() => reviewState.setLatestRemapSummary(null)}
      onRemapFieldOverrideChange={reviewState.updatePendingRemapReviewField}
      onConfirmRemapReview={reviewState.confirmPendingRemapReview}
      onCancelRemapReview={reviewState.cancelPendingRemapReview}
      onConfirmRestoreReview={restoreReview.confirm}
      onCancelRestoreReview={restoreReview.close}
      onSelectRestoreVersion={restoreReview.selectVersion}
      onRestoreSnapshotLabelChange={restoreReview.setSnapshotLabel}
      onSaveRestoreSnapshotLabel={restoreReview.saveSnapshotLabel}
      onDeleteRestoreVersion={restoreReview.deleteSelectedVersion}
      onConfirmUpdateReview={reviewState.confirmPendingUpdateReview}
      onCancelUpdateReview={reviewState.clearUpdateReview}
      onUpdateSnapshotLabelChange={reviewState.setPendingUpdateSnapshotLabel}
      onEditingNameChange={setEditingName}
      onStartRename={startRename}
      onCancelRename={cancelRename}
      onSaveRename={saveRename}
      onInsert={insert}
      onDuplicate={duplicateEntry}
      onReplace={replace}
      onUpdate={updateEntry}
      onRestore={restoreReview.open}
      onTogglePinned={togglePinnedEntry}
      onRemove={remove}
      />
  );
}
