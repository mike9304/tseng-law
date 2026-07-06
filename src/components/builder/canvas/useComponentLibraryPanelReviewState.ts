'use client';

import { useState } from 'react';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { ComponentLibraryBindingFieldKey } from './component-library-field-remap.helpers';
import {
  confirmComponentLibraryPendingInsert,
  prepareComponentLibraryInsert,
  updateComponentLibraryPendingFieldOverride,
  type ComponentLibraryPendingRemapReview,
} from './component-library-insert-flow.helpers';
import type {
  ComponentLibraryEntry,
  ComponentLibraryFieldRemapSummary,
  ComponentLibraryInsertResult,
} from './component-library-panel.helpers';
import {
  confirmComponentLibraryPendingReplace,
  prepareComponentLibraryReplace,
  updateComponentLibraryPendingReplaceFieldOverride,
  type ComponentLibraryPendingReplaceRemapReview,
} from './component-library-replace-flow.helpers';
import type { ComponentLibraryReplaceSelectionResult } from './component-library-replace-selection.helpers';
import {
  makeComponentLibraryUpdateReview,
  type ComponentLibraryUpdateReview as ComponentLibraryUpdateReviewModel,
} from './component-library-update-review.helpers';

interface ComponentLibraryPanelReviewStateOptions {
  readonly entries: readonly ComponentLibraryEntry[];
  readonly effectiveSelectedNodeJson: string;
  readonly selectedNodeIds: readonly string[];
  readonly nodesById: ReadonlyMap<string, BuilderCanvasNode>;
  readonly childrenMap: Readonly<Record<string, readonly string[]>>;
  readonly canvasNodeCount: number;
  readonly updateEntryPayload: (options: {
    readonly id: string;
    readonly nextNodeJson: string;
    readonly snapshotLabel?: string;
  }) => void;
  readonly onCommitInsert: (parsed: ComponentLibraryInsertResult, parentNodeId: string | null) => void;
  readonly onCommitReplace: (prepared: ComponentLibraryReplaceSelectionResult) => void;
}

export function useComponentLibraryPanelReviewState({
  entries,
  effectiveSelectedNodeJson,
  selectedNodeIds,
  nodesById,
  childrenMap,
  canvasNodeCount,
  updateEntryPayload,
  onCommitInsert,
  onCommitReplace,
}: ComponentLibraryPanelReviewStateOptions) {
  const [latestRemapSummary, setLatestRemapSummary] = useState<ComponentLibraryFieldRemapSummary | null>(null);
  const [pendingRemapReview, setPendingRemapReview] = useState<ComponentLibraryPendingRemapReview | null>(null);
  const [pendingReplaceRemapReview, setPendingReplaceRemapReview] =
    useState<ComponentLibraryPendingReplaceRemapReview | null>(null);
  const [pendingUpdateReview, setPendingUpdateReview] = useState<ComponentLibraryUpdateReviewModel | null>(null);
  const [pendingUpdateSnapshotLabel, setPendingUpdateSnapshotLabel] = useState('');
  const activeRemapReview = pendingReplaceRemapReview ?? pendingRemapReview;

  function clearUpdateReview() {
    setPendingUpdateReview(null);
    setPendingUpdateSnapshotLabel('');
  }

  function clearAllReviews() {
    setPendingRemapReview(null);
    setPendingReplaceRemapReview(null);
    clearUpdateReview();
  }

  function clearForEntryRemoval(entryId: string) {
    if (pendingUpdateReview?.entryId === entryId) clearUpdateReview();
    if (pendingReplaceRemapReview?.entry.id === entryId) setPendingReplaceRemapReview(null);
  }

  function openUpdateReview(entryId: string) {
    const entry = entries.find((candidate) => candidate.id === entryId);
    if (!entry) return;
    const review = makeComponentLibraryUpdateReview(entry, effectiveSelectedNodeJson);
    if (!review) return;
    setPendingRemapReview(null);
    setPendingReplaceRemapReview(null);
    setPendingUpdateSnapshotLabel('');
    setPendingUpdateReview(review);
  }

  function confirmPendingUpdateReview() {
    if (!pendingUpdateReview) return;
    updateEntryPayload({
      id: pendingUpdateReview.entryId,
      nextNodeJson: pendingUpdateReview.nextNodeJson,
      snapshotLabel: pendingUpdateSnapshotLabel,
    });
    clearUpdateReview();
  }

  function insertEntry(entry: ComponentLibraryEntry) {
    const prepared = prepareComponentLibraryInsert({
      entry,
      selectedNodeIds,
      nodesById,
      canvasNodeCount,
    });
    if (!prepared) return;
    if (prepared.kind === 'review') {
      setLatestRemapSummary(null);
      setPendingReplaceRemapReview(null);
      clearUpdateReview();
      setPendingRemapReview(prepared.pending);
      return;
    }
    onCommitInsert(prepared.parsed, prepared.parentNodeId);
  }

  function replaceEntry(entry: ComponentLibraryEntry) {
    const prepared = prepareComponentLibraryReplace({
      entry,
      selectedNodeIds,
      nodesById,
      childrenMap,
      canvasNodeCount,
    });
    if (!prepared) return;
    setPendingRemapReview(null);
    clearUpdateReview();
    if (prepared.kind === 'review') {
      setLatestRemapSummary(null);
      setPendingReplaceRemapReview(prepared.pending);
      return;
    }
    setPendingReplaceRemapReview(null);
    onCommitReplace(prepared.prepared);
  }

  function confirmPendingRemapReview() {
    if (pendingReplaceRemapReview) {
      const confirmed = confirmComponentLibraryPendingReplace(pendingReplaceRemapReview, {
        nodesById,
        childrenMap,
        canvasNodeCount,
      });
      if (!confirmed || confirmed.kind !== 'ready') return;
      setPendingReplaceRemapReview(null);
      onCommitReplace(confirmed.prepared);
      return;
    }
    if (!pendingRemapReview) return;
    const prepared = confirmComponentLibraryPendingInsert(pendingRemapReview, canvasNodeCount);
    if (!prepared || prepared.kind !== 'ready') return;
    setPendingRemapReview(null);
    onCommitInsert(prepared.parsed, prepared.parentNodeId);
  }

  function updatePendingRemapReviewField(
    fieldKey: ComponentLibraryBindingFieldKey,
    sourceFieldId: string,
    targetFieldId: string | null,
  ) {
    if (pendingReplaceRemapReview) {
      setPendingReplaceRemapReview((current) => current
        ? updateComponentLibraryPendingReplaceFieldOverride({ pending: current, fieldKey, sourceFieldId, targetFieldId })
        : current);
      return;
    }
    setPendingRemapReview((current) => current
      ? updateComponentLibraryPendingFieldOverride({ pending: current, fieldKey, sourceFieldId, targetFieldId })
      : current);
  }

  function cancelPendingRemapReview() {
    setPendingRemapReview(null);
    setPendingReplaceRemapReview(null);
  }

  function commitInsertRemapSummary(summary: ComponentLibraryFieldRemapSummary | null) {
    setLatestRemapSummary(summary);
  }

  return {
    latestRemapSummary,
    remapReview: activeRemapReview?.review ?? null,
    remapFieldOverrides: activeRemapReview?.fieldOverrides ?? {},
    pendingUpdateReview,
    pendingUpdateSnapshotLabel,
    setPendingUpdateSnapshotLabel,
    setLatestRemapSummary,
    commitInsertRemapSummary,
    clearAllReviews,
    clearForEntryRemoval,
    clearUpdateReview,
    openUpdateReview,
    confirmPendingUpdateReview,
    insertEntry,
    replaceEntry,
    confirmPendingRemapReview,
    updatePendingRemapReviewField,
    cancelPendingRemapReview,
  };
}
