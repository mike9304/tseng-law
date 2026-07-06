import type { BuilderCanvasNode, BuilderDataBinding } from '@/lib/builder/canvas/types';
import {
  makeComponentLibraryFieldOverrideKey,
  type ComponentLibraryBindingFieldKey,
  type ComponentLibraryFieldOverrideMap,
} from './component-library-field-remap.helpers';
import {
  resolveComponentLibraryInsertionContext,
  type ComponentLibraryEntry,
} from './component-library-panel.helpers';
import {
  makeComponentLibraryDefaultFieldOverrides,
  makeComponentLibraryFieldRemapReview,
  type ComponentLibraryFieldRemapReview,
} from './component-library-remap-review.helpers';
import {
  prepareComponentLibraryReplaceSelection,
  type ComponentLibraryReplaceSelectionResult,
} from './component-library-replace-selection.helpers';

export interface ComponentLibraryReplacePreparationOptions {
  readonly entry: ComponentLibraryEntry;
  readonly selectedNodeIds: readonly string[];
  readonly nodesById: ReadonlyMap<string, BuilderCanvasNode>;
  readonly childrenMap: Readonly<Record<string, readonly string[]>>;
  readonly canvasNodeCount: number;
}

export interface ComponentLibraryPendingReplaceRemapReview {
  readonly entry: ComponentLibraryEntry;
  readonly targetNodeId: string;
  readonly targetIdOverride?: BuilderDataBinding['targetId'];
  readonly review: ComponentLibraryFieldRemapReview;
  readonly fieldOverrides: ComponentLibraryFieldOverrideMap;
}

export interface ComponentLibraryPendingReplaceConfirmationOptions {
  readonly nodesById: ReadonlyMap<string, BuilderCanvasNode>;
  readonly childrenMap: Readonly<Record<string, readonly string[]>>;
  readonly canvasNodeCount: number;
}

export interface ComponentLibraryPendingReplaceOverrideUpdate {
  readonly pending: ComponentLibraryPendingReplaceRemapReview;
  readonly fieldKey: ComponentLibraryBindingFieldKey;
  readonly sourceFieldId: string;
  readonly targetFieldId: string | null;
}

export type ComponentLibraryPreparedReplace =
  | {
    readonly kind: 'ready';
    readonly prepared: ComponentLibraryReplaceSelectionResult;
  }
  | {
    readonly kind: 'review';
    readonly pending: ComponentLibraryPendingReplaceRemapReview;
  };

export function prepareComponentLibraryReplace(
  options: ComponentLibraryReplacePreparationOptions,
): ComponentLibraryPreparedReplace | null {
  const targetNodeId = resolveSingleReplaceTargetNodeId(options.selectedNodeIds);
  if (!targetNodeId) return null;
  const targetIdOverride = resolveComponentLibraryInsertionContext(
    options.entry,
    options.selectedNodeIds,
    options.nodesById,
  )?.targetIdOverride;
  const prepared = prepareComponentLibraryReplaceSelection({
    ...options,
    targetIdOverride,
  });
  if (!prepared) return null;

  const review = makeComponentLibraryFieldRemapReview(prepared.fieldRemapSummary);
  if (!review) return { kind: 'ready', prepared };

  return {
    kind: 'review',
    pending: {
      entry: options.entry,
      targetNodeId,
      targetIdOverride,
      review,
      fieldOverrides: makeComponentLibraryDefaultFieldOverrides(review),
    },
  };
}

export function confirmComponentLibraryPendingReplace(
  pending: ComponentLibraryPendingReplaceRemapReview,
  options: ComponentLibraryPendingReplaceConfirmationOptions,
): ComponentLibraryPreparedReplace | null {
  const prepared = prepareComponentLibraryReplaceSelection({
    entry: pending.entry,
    selectedNodeIds: [pending.targetNodeId],
    nodesById: options.nodesById,
    childrenMap: options.childrenMap,
    canvasNodeCount: options.canvasNodeCount,
    targetIdOverride: pending.targetIdOverride,
    fieldOverrides: pending.fieldOverrides,
  });
  if (!prepared) return null;
  return { kind: 'ready', prepared };
}

export function updateComponentLibraryPendingReplaceFieldOverride(
  options: ComponentLibraryPendingReplaceOverrideUpdate,
): ComponentLibraryPendingReplaceRemapReview {
  const overrideKey = makeComponentLibraryFieldOverrideKey(options.fieldKey, options.sourceFieldId);
  return {
    ...options.pending,
    fieldOverrides: {
      ...options.pending.fieldOverrides,
      [overrideKey]: options.targetFieldId,
    },
  };
}

function resolveSingleReplaceTargetNodeId(selectedNodeIds: readonly string[]): string | null {
  if (selectedNodeIds.length !== 1) return null;
  const targetNodeId = selectedNodeIds[0];
  return targetNodeId && targetNodeId.length > 0 ? targetNodeId : null;
}
