import type { BuilderCanvasNode, BuilderDataBinding } from '@/lib/builder/canvas/types';
import {
  makeComponentLibraryFieldOverrideKey,
  type ComponentLibraryBindingFieldKey,
  type ComponentLibraryFieldOverrideMap,
} from './component-library-field-remap.helpers';
import {
  parseComponentLibraryInsertResult,
  resolveComponentLibraryInsertionContext,
  type ComponentLibraryEntry,
  type ComponentLibraryInsertResult,
} from './component-library-panel.helpers';
import {
  makeComponentLibraryDefaultFieldOverrides,
  makeComponentLibraryFieldRemapReview,
  type ComponentLibraryFieldRemapReview,
} from './component-library-remap-review.helpers';

export const EMPTY_COMPONENT_LIBRARY_FIELD_OVERRIDES: ComponentLibraryFieldOverrideMap = {};

export interface ComponentLibraryInsertPreparationOptions {
  readonly entry: ComponentLibraryEntry;
  readonly selectedNodeIds: readonly string[];
  readonly nodesById: ReadonlyMap<string, BuilderCanvasNode>;
  readonly canvasNodeCount: number;
}

export interface ComponentLibraryPendingRemapReview {
  readonly entry: ComponentLibraryEntry;
  readonly parentNodeId: string | null;
  readonly targetIdOverride?: BuilderDataBinding['targetId'];
  readonly review: ComponentLibraryFieldRemapReview;
  readonly fieldOverrides: ComponentLibraryFieldOverrideMap;
}

export type ComponentLibraryPreparedInsert =
  | {
    readonly kind: 'ready';
    readonly parsed: ComponentLibraryInsertResult;
    readonly parentNodeId: string | null;
  }
  | {
    readonly kind: 'review';
    readonly pending: ComponentLibraryPendingRemapReview;
  };

export interface ComponentLibraryPendingOverrideUpdate {
  readonly pending: ComponentLibraryPendingRemapReview;
  readonly fieldKey: ComponentLibraryBindingFieldKey;
  readonly sourceFieldId: string;
  readonly targetFieldId: string | null;
}

export function prepareComponentLibraryInsert(
  options: ComponentLibraryInsertPreparationOptions,
): ComponentLibraryPreparedInsert | null {
  const insertionContext = resolveComponentLibraryInsertionContext(
    options.entry,
    options.selectedNodeIds,
    options.nodesById,
  );
  const parsed = parseComponentLibraryInsertResult(options.entry, options.canvasNodeCount, {
    targetIdOverride: insertionContext?.targetIdOverride,
  });
  if (!parsed || parsed.nodes.length === 0) return null;

  const review = makeComponentLibraryFieldRemapReview(parsed.fieldRemapSummary);
  if (review) {
    return {
      kind: 'review',
      pending: {
        entry: options.entry,
        parentNodeId: insertionContext?.parentNodeId ?? null,
        targetIdOverride: insertionContext?.targetIdOverride,
        review,
        fieldOverrides: makeComponentLibraryDefaultFieldOverrides(review),
      },
    };
  }

  return {
    kind: 'ready',
    parsed,
    parentNodeId: insertionContext?.parentNodeId ?? null,
  };
}

export function confirmComponentLibraryPendingInsert(
  pending: ComponentLibraryPendingRemapReview,
  canvasNodeCount: number,
): ComponentLibraryPreparedInsert | null {
  const parsed = parseComponentLibraryInsertResult(pending.entry, canvasNodeCount, {
    targetIdOverride: pending.targetIdOverride,
    fieldOverrides: pending.fieldOverrides,
  });
  if (!parsed || parsed.nodes.length === 0) return null;
  return {
    kind: 'ready',
    parsed,
    parentNodeId: pending.parentNodeId,
  };
}

export function updateComponentLibraryPendingFieldOverride(
  options: ComponentLibraryPendingOverrideUpdate,
): ComponentLibraryPendingRemapReview {
  const overrideKey = makeComponentLibraryFieldOverrideKey(options.fieldKey, options.sourceFieldId);
  return {
    ...options.pending,
    fieldOverrides: {
      ...options.pending.fieldOverrides,
      [overrideKey]: options.targetFieldId,
    },
  };
}
