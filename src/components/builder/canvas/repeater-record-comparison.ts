import type {
  BuilderCanvasNode,
  BuilderDataBindingFieldMap,
} from '@/lib/builder/canvas/types';
import type { BuilderDatasetSampleRecord } from '@/lib/builder/datasets';
import type { BuilderDatasetTargetId } from '@/lib/builder/types';

const FIELD_KEYS = [
  'title',
  'text',
  'label',
  'description',
  'href',
  'src',
  'alt',
  'caption',
] as const satisfies readonly (keyof BuilderDataBindingFieldMap)[];

const PRIMARY_FIELD_KEYS_BY_KIND: Partial<Record<
  BuilderCanvasNode['kind'],
  readonly (keyof BuilderDataBindingFieldMap)[]
>> = {
  text: ['text', 'href'],
  heading: ['text'],
  image: ['src', 'alt', 'href'],
  button: ['label', 'href'],
  gallery: ['src', 'caption', 'alt'],
  container: ['title', 'description', 'src'],
};

const CONTAINER_FALLBACK_FIELD_KEYS: readonly (keyof BuilderDataBindingFieldMap)[] = [
  'title',
  'text',
  'label',
  'description',
  'caption',
  'src',
];

export interface RepeaterRecordComparisonField {
  fieldId: string;
  label: string;
  value: string;
}

export interface RepeaterRecordComparisonRow {
  index: number;
  record: BuilderDatasetSampleRecord;
  fields: RepeaterRecordComparisonField[];
}

export interface RepeaterRecordComparisonModel {
  rows: RepeaterRecordComparisonRow[];
  fieldSummary: string;
}

export function buildRepeaterRecordComparisonModel({
  childNodes,
  containerFields,
  currentIndex,
  emptyValue,
  records,
  resolveFieldLabel,
  targetId,
}: {
  childNodes: readonly BuilderCanvasNode[];
  containerFields: BuilderDataBindingFieldMap;
  currentIndex: number;
  emptyValue: string;
  records: readonly BuilderDatasetSampleRecord[];
  resolveFieldLabel: (fieldId: string) => string | null;
  targetId: BuilderDatasetTargetId;
}): RepeaterRecordComparisonModel {
  const fieldDescriptors = collectComparisonFields({
    childNodes,
    containerFields,
    resolveFieldLabel,
    targetId,
  });
  const rows = resolveComparisonWindow(records, currentIndex).map(({ index, record }) => ({
    index,
    record,
    fields: fieldDescriptors.map((field) => ({
      fieldId: field.fieldId,
      label: field.label,
      value: record.fieldValues[field.fieldId] ?? emptyValue,
    })),
  }));

  return {
    rows,
    fieldSummary: summarizeFieldLabels(fieldDescriptors.map((field) => field.label)),
  };
}

function collectComparisonFields({
  childNodes,
  containerFields,
  resolveFieldLabel,
  targetId,
}: {
  childNodes: readonly BuilderCanvasNode[];
  containerFields: BuilderDataBindingFieldMap;
  resolveFieldLabel: (fieldId: string) => string | null;
  targetId: BuilderDatasetTargetId;
}): RepeaterRecordComparisonField[] {
  const seenFieldIds = new Set<string>();
  const fields: RepeaterRecordComparisonField[] = [];

  const addField = (fieldId: string | undefined) => {
    if (!fieldId || seenFieldIds.has(fieldId)) return;
    seenFieldIds.add(fieldId);
    fields.push({
      fieldId,
      label: resolveFieldLabel(fieldId) ?? fieldId,
      value: '',
    });
  };

  for (const childNode of childNodes) {
    if (childNode.dataBinding?.targetId !== targetId) continue;
    const preferredKeys = PRIMARY_FIELD_KEYS_BY_KIND[childNode.kind] ?? [];
    appendMappedFields(childNode.dataBinding.fields, [...preferredKeys, ...FIELD_KEYS], addField);
  }

  if (fields.length === 0) {
    appendMappedFields(containerFields, CONTAINER_FALLBACK_FIELD_KEYS, addField);
  }

  return fields.slice(0, 6);
}

function appendMappedFields(
  fieldMap: BuilderDataBindingFieldMap,
  keys: readonly (keyof BuilderDataBindingFieldMap)[],
  addField: (fieldId: string | undefined) => void,
) {
  const visitedKeys = new Set<keyof BuilderDataBindingFieldMap>();
  for (const key of keys) {
    if (visitedKeys.has(key)) continue;
    visitedKeys.add(key);
    addField(fieldMap[key]);
  }
}

function resolveComparisonWindow(
  records: readonly BuilderDatasetSampleRecord[],
  currentIndex: number,
): Array<{ index: number; record: BuilderDatasetSampleRecord }> {
  if (records.length <= 1) return [];
  const windowSize = Math.min(3, records.length);
  const start = Math.min(
    Math.max(0, currentIndex - 1),
    Math.max(0, records.length - windowSize),
  );
  return records.slice(start, start + windowSize).map((record, offset) => ({
    index: start + offset,
    record,
  }));
}

function summarizeFieldLabels(labels: readonly string[]): string {
  if (labels.length === 0) return '';
  if (labels.length <= 3) return labels.join(' / ');
  return `${labels.slice(0, 3).join(' / ')} +${labels.length - 3}`;
}
