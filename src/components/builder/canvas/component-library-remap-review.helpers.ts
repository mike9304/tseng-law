import type { BuilderDataBinding } from '@/lib/builder/canvas/types';
import {
  getComponentLibraryTargetFieldOptions,
  makeComponentLibraryFieldOverrideKey,
  type ComponentLibraryBindingFieldKey,
  type ComponentLibraryFieldOverrideMap,
  type ComponentLibraryTargetFieldOption,
} from './component-library-field-remap.helpers';
import type { ComponentLibraryFieldRemapSummary } from './component-library-panel.helpers';

export type ComponentLibraryRemapReviewStatus = 'remapped' | 'dropped';

export interface ComponentLibraryRemapReviewField {
  readonly fieldKey: ComponentLibraryBindingFieldKey;
  readonly sourceFieldId: string;
  readonly sourceFieldLabel: string;
  readonly currentFieldId: string | null;
  readonly options: readonly ComponentLibraryTargetFieldOption[];
  readonly status: ComponentLibraryRemapReviewStatus;
}

export interface ComponentLibraryFieldRemapReview {
  readonly targetId: BuilderDataBinding['targetId'];
  readonly fields: readonly ComponentLibraryRemapReviewField[];
}

export function makeComponentLibraryFieldRemapReview(
  summary: ComponentLibraryFieldRemapSummary | null,
): ComponentLibraryFieldRemapReview | null {
  if (!summary) return null;
  const fields: ComponentLibraryRemapReviewField[] = [
    ...summary.remappedFields.map((field) => ({
      fieldKey: field.fieldKey,
      sourceFieldId: field.sourceFieldId,
      sourceFieldLabel: formatComponentLibraryFieldLabel(field.sourceFieldId),
      currentFieldId: field.targetFieldId,
      options: getComponentLibraryTargetFieldOptions(summary.targetId, field.fieldKey),
      status: 'remapped' as const,
    })),
    ...summary.droppedFields.map((field) => ({
      fieldKey: field.fieldKey,
      sourceFieldId: field.sourceFieldId,
      sourceFieldLabel: formatComponentLibraryFieldLabel(field.sourceFieldId),
      currentFieldId: null,
      options: getComponentLibraryTargetFieldOptions(summary.targetId, field.fieldKey),
      status: 'dropped' as const,
    })),
  ];
  return fields.length > 0 ? { targetId: summary.targetId, fields } : null;
}

export function makeComponentLibraryDefaultFieldOverrides(
  review: ComponentLibraryFieldRemapReview,
): ComponentLibraryFieldOverrideMap {
  const entries = review.fields.map((field) => [
    makeComponentLibraryFieldOverrideKey(field.fieldKey, field.sourceFieldId),
    field.currentFieldId,
  ] as const);
  return Object.fromEntries(entries);
}

function formatComponentLibraryFieldLabel(fieldId: string): string {
  const words = fieldId
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim();
  if (!words) return fieldId;
  return words.slice(0, 1).toUpperCase() + words.slice(1).toLowerCase();
}
