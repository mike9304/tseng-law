import type {
  BuilderCanvasNode,
  BuilderDataBinding,
} from '@/lib/builder/canvas/types';
import type { BuilderDatasetSampleRecord } from '@/lib/builder/datasets';
import {
  resolveRepeaterTemplateBindingSummary,
  type RepeaterTemplateBindingSummary,
} from './repeater-template-nodes';

export type RepeaterTemplateBindingSummaryWithLock = RepeaterTemplateBindingSummary & {
  readonly locked?: boolean;
  readonly previewValue?: string;
};

interface RepeaterTemplateBindingSummaryOptions {
  readonly emptyValue?: string;
  readonly previewRecord?: BuilderDatasetSampleRecord | null;
}

export function resolveRepeaterTemplateBindingSummaryWithLocks(
  childNodes: readonly BuilderCanvasNode[],
  targetId: BuilderDataBinding['targetId'] | undefined,
  options: RepeaterTemplateBindingSummaryOptions = {},
): RepeaterTemplateBindingSummaryWithLock[] {
  const lockedByNodeId = new Map<string, boolean>();
  childNodes.forEach((childNode) => {
    lockedByNodeId.set(childNode.id, Boolean(childNode.locked));
  });

  return resolveRepeaterTemplateBindingSummary(childNodes, targetId).map((entry) => ({
    ...entry,
    ...(lockedByNodeId.get(entry.nodeId) ? { locked: true } : {}),
    ...resolvePreviewValue(entry.fieldId, options),
  }));
}

function resolvePreviewValue(
  fieldId: string,
  options: RepeaterTemplateBindingSummaryOptions,
): Pick<RepeaterTemplateBindingSummaryWithLock, 'previewValue'> | Record<string, never> {
  if (!options.previewRecord) return {};
  const rawValue = options.previewRecord.fieldValues[fieldId];
  const previewValue = rawValue && rawValue.length > 0
    ? rawValue
    : options.emptyValue ?? '';
  return { previewValue };
}
