import type {
  BuilderCanvasDocument,
  BuilderCanvasNode,
  BuilderDataBindingFieldMap,
} from '@/lib/builder/canvas/types';
import {
  getBuilderBindableTarget,
  type BuilderDatasetFieldDefinition,
} from '@/lib/builder/datasets';
import type { BuilderDatasetTargetId } from '@/lib/builder/types';

export interface BuilderStaleDataBindingField {
  nodeId: string;
  nodeKind: BuilderCanvasNode['kind'];
  targetId: BuilderDatasetTargetId;
  key: keyof BuilderDataBindingFieldMap;
  fieldId: string;
}

const DATA_BINDING_FIELD_KEYS_BY_KIND: Partial<Record<
  BuilderCanvasNode['kind'],
  Array<keyof BuilderDataBindingFieldMap>
>> = {
  text: ['text', 'href'],
  heading: ['text'],
  image: ['src', 'alt', 'href'],
  gallery: ['src', 'alt', 'caption'],
  button: ['label', 'href'],
};

export function getBuilderDataBindingFieldKeysForNode(
  node: BuilderCanvasNode,
): Array<keyof BuilderDataBindingFieldMap> {
  if (node.kind === 'container' && node.content.layoutMode === 'repeater') {
    return ['title', 'description', 'src'];
  }
  return DATA_BINDING_FIELD_KEYS_BY_KIND[node.kind] ?? [];
}

export function isBuilderDataBindingFieldCompatible(
  fieldKind: 'text' | 'image' | 'url' | undefined,
  key: keyof BuilderDataBindingFieldMap,
): boolean {
  const valueKind = fieldKind ?? 'text';
  if (key === 'src') return valueKind === 'image';
  if (key === 'href') return valueKind === 'url';
  return valueKind === 'text';
}

export function getBuilderDataBindingFieldOptions(
  targetId: BuilderDatasetTargetId,
  key: keyof BuilderDataBindingFieldMap,
): BuilderDatasetFieldDefinition[] {
  return getBuilderBindableTarget(targetId).bindableFields.filter((field) =>
    isBuilderDataBindingFieldCompatible(field.valueKind, key)
  );
}

export function resolveBuilderStaleDataBindingFields(
  node: BuilderCanvasNode,
): BuilderStaleDataBindingField[] {
  const dataBinding = node.dataBinding;
  if (!dataBinding) return [];

  const keys = getBuilderDataBindingFieldKeysForNode(node);
  if (!keys.length) return [];

  let fieldsById: Map<string, BuilderDatasetFieldDefinition> | null = null;
  try {
    fieldsById = new Map(
      getBuilderBindableTarget(dataBinding.targetId).bindableFields.map((field) => [field.fieldId, field] as const)
    );
  } catch {
    fieldsById = null;
  }

  return keys
    .map((key) => {
      const fieldId = dataBinding.fields[key];
      if (!fieldId) return null;
      const field = fieldsById?.get(fieldId);
      return field && isBuilderDataBindingFieldCompatible(field.valueKind, key)
        ? null
        : {
            nodeId: node.id,
            nodeKind: node.kind,
            targetId: dataBinding.targetId,
            key,
            fieldId,
          };
    })
    .filter((row): row is BuilderStaleDataBindingField => Boolean(row));
}

export function resolveBuilderStaleDataBindingFieldsForDocument(
  doc: BuilderCanvasDocument,
): BuilderStaleDataBindingField[] {
  return doc.nodes.flatMap((node) => resolveBuilderStaleDataBindingFields(node));
}
