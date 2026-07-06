import {
  getBuilderBindableTarget,
  type BuilderDatasetFieldDefinition,
} from '@/lib/builder/datasets';
import type {
  BuilderDataBinding,
  BuilderDataBindingFieldMap,
} from '@/lib/builder/canvas/types';

export type ComponentLibraryBindingFieldKey = keyof BuilderDataBindingFieldMap;
type ComponentLibraryDatasetValueKind = NonNullable<BuilderDatasetFieldDefinition['valueKind']>;

export interface ComponentLibraryRemappedField {
  readonly fieldKey: ComponentLibraryBindingFieldKey;
  readonly sourceFieldId: string;
  readonly targetFieldId: string;
}

export interface ComponentLibraryDroppedField {
  readonly fieldKey: ComponentLibraryBindingFieldKey;
  readonly sourceFieldId: string;
}

export type ComponentLibraryFieldOverrideKey = `${ComponentLibraryBindingFieldKey}:${string}`;
export type ComponentLibraryFieldOverrideMap = Readonly<
  Partial<Record<ComponentLibraryFieldOverrideKey, string | null>>
>;

export interface ComponentLibraryDataBindingRemapOptions {
  readonly targetIdOverride?: BuilderDataBinding['targetId'];
  readonly fieldOverrides?: ComponentLibraryFieldOverrideMap;
}

export interface ComponentLibraryDataBindingRemapResult {
  readonly dataBinding: BuilderDataBinding | undefined;
  readonly remappedFields: readonly ComponentLibraryRemappedField[];
  readonly droppedFields: readonly ComponentLibraryDroppedField[];
}

interface ComponentLibraryBindingFieldsRemapResult {
  readonly fields: BuilderDataBindingFieldMap;
  readonly remappedFields: readonly ComponentLibraryRemappedField[];
  readonly droppedFields: readonly ComponentLibraryDroppedField[];
}

interface ComponentLibraryBindingFieldResolveOptions {
  readonly sourceFieldId: string;
  readonly fieldKey: ComponentLibraryBindingFieldKey;
  readonly targetFields: readonly BuilderDatasetFieldDefinition[];
  readonly fieldOverrides: ComponentLibraryFieldOverrideMap;
}

export interface ComponentLibraryTargetFieldOption {
  readonly fieldId: string;
  readonly label: string;
  readonly valueKind: ComponentLibraryDatasetValueKind;
}

const componentLibraryBindingFieldKeys = [
  'title',
  'text',
  'label',
  'description',
  'href',
  'src',
  'alt',
  'caption',
] as const satisfies readonly ComponentLibraryBindingFieldKey[];

const componentLibraryFieldAliases: Readonly<Partial<Record<string, readonly string[]>>> = {
  title: ['title', 'name'],
  name: ['name', 'title'],
  role: ['role', 'categoryLabel', 'category', 'title'],
  readTime: ['description', 'details', 'title'],
  summary: ['summary', 'description', 'details', 'title'],
  description: ['description', 'summary', 'details', 'title'],
  details: ['details', 'description', 'summary', 'title'],
  featuredImage: ['featuredImage', 'image'],
  image: ['image', 'featuredImage'],
  category: ['role', 'categoryLabel', 'title'],
  categoryLabel: ['role', 'category', 'title'],
  date: ['description', 'details', 'title'],
  dateDisplay: ['description', 'details', 'title'],
  slug: ['slug', 'title'],
  href: ['href'],
  email: ['email', 'href'],
} as const;

const componentLibraryFieldFallbacks = {
  title: ['title', 'name', 'description', 'summary', 'details', 'role'],
  text: ['title', 'description', 'summary', 'details', 'name', 'role', 'email', 'slug'],
  label: ['title', 'name', 'description', 'summary', 'details', 'role'],
  description: ['description', 'summary', 'details', 'title', 'name'],
  href: ['href'],
  src: ['featuredImage', 'image'],
  alt: ['title', 'name', 'description', 'summary', 'slug'],
  caption: ['title', 'description', 'summary', 'details', 'name'],
} as const satisfies Record<ComponentLibraryBindingFieldKey, readonly string[]>;

export function makeComponentLibraryFieldOverrideKey(
  fieldKey: ComponentLibraryBindingFieldKey,
  sourceFieldId: string,
): ComponentLibraryFieldOverrideKey {
  return `${fieldKey}:${sourceFieldId}`;
}

export function remapComponentLibraryDataBinding(
  dataBinding: BuilderDataBinding | undefined,
  options: ComponentLibraryDataBindingRemapOptions,
): ComponentLibraryDataBindingRemapResult {
  const targetIdOverride = options.targetIdOverride;
  if (!dataBinding || !targetIdOverride || dataBinding.targetId === targetIdOverride) {
    return { dataBinding, remappedFields: [], droppedFields: [] };
  }

  const result = remapComponentLibraryBindingFields(dataBinding.fields, targetIdOverride, options.fieldOverrides ?? {});
  if (Object.keys(result.fields).length === 0) {
    return {
      dataBinding: undefined,
      remappedFields: result.remappedFields,
      droppedFields: result.droppedFields,
    };
  }

  return {
    dataBinding: {
      ...dataBinding,
      targetId: targetIdOverride,
      fields: result.fields,
    },
    remappedFields: result.remappedFields,
    droppedFields: result.droppedFields,
  };
}

function remapComponentLibraryBindingFields(
  sourceFields: BuilderDataBindingFieldMap,
  targetId: BuilderDataBinding['targetId'],
  fieldOverrides: ComponentLibraryFieldOverrideMap,
): ComponentLibraryBindingFieldsRemapResult {
  const targetFields = getBuilderBindableTarget(targetId).bindableFields;
  const remappedFields: BuilderDataBindingFieldMap = {};
  const remappedFieldEvents: ComponentLibraryRemappedField[] = [];
  const droppedFieldEvents: ComponentLibraryDroppedField[] = [];

  for (const fieldKey of componentLibraryBindingFieldKeys) {
    const sourceFieldId = sourceFields[fieldKey];
    if (!sourceFieldId) continue;

    const targetFieldId = resolveComponentLibraryTargetFieldId({
      sourceFieldId,
      fieldKey,
      targetFields,
      fieldOverrides,
    });
    if (!targetFieldId) {
      droppedFieldEvents.push({ fieldKey, sourceFieldId });
      continue;
    }

    setComponentLibraryBindingField(remappedFields, fieldKey, targetFieldId);
    if (targetFieldId !== sourceFieldId) {
      remappedFieldEvents.push({ fieldKey, sourceFieldId, targetFieldId });
    }
  }

  return {
    fields: remappedFields,
    remappedFields: remappedFieldEvents,
    droppedFields: droppedFieldEvents,
  };
}

export function getComponentLibraryTargetFieldOptions(
  targetId: BuilderDataBinding['targetId'],
  fieldKey: ComponentLibraryBindingFieldKey,
): readonly ComponentLibraryTargetFieldOption[] {
  const desiredKind = getComponentLibraryBindingFieldKind(fieldKey);
  return getBuilderBindableTarget(targetId).bindableFields
    .filter((field) => isComponentLibraryFieldKind(field, desiredKind))
    .map((field) => ({
      fieldId: field.fieldId,
      label: field.label,
      valueKind: field.valueKind ?? 'text',
    }));
}

function resolveComponentLibraryTargetFieldId(options: ComponentLibraryBindingFieldResolveOptions): string | null {
  const desiredKind = getComponentLibraryBindingFieldKind(options.fieldKey);
  const fieldOverride = options.fieldOverrides[
    makeComponentLibraryFieldOverrideKey(options.fieldKey, options.sourceFieldId)
  ];
  if (fieldOverride === null) return null;
  if (fieldOverride) {
    const overrideField = findCompatibleTargetField(fieldOverride, desiredKind, options.targetFields);
    if (overrideField) return overrideField.fieldId;
  }

  const exactField = findCompatibleTargetField(options.sourceFieldId, desiredKind, options.targetFields);
  if (exactField) return exactField.fieldId;

  for (const alias of componentLibraryFieldAliases[options.sourceFieldId] ?? []) {
    const aliasField = findCompatibleTargetField(alias, desiredKind, options.targetFields);
    if (aliasField) return aliasField.fieldId;
  }

  for (const fallbackFieldId of componentLibraryFieldFallbacks[options.fieldKey]) {
    const fallbackField = findCompatibleTargetField(fallbackFieldId, desiredKind, options.targetFields);
    if (fallbackField) return fallbackField.fieldId;
  }

  return options.targetFields.find((field) => isComponentLibraryFieldKind(field, desiredKind))?.fieldId ?? null;
}

function findCompatibleTargetField(
  fieldId: string,
  desiredKind: ComponentLibraryDatasetValueKind,
  targetFields: readonly BuilderDatasetFieldDefinition[],
): BuilderDatasetFieldDefinition | null {
  return targetFields.find((field) =>
    field.fieldId === fieldId && isComponentLibraryFieldKind(field, desiredKind)
  ) ?? null;
}

function isComponentLibraryFieldKind(
  field: BuilderDatasetFieldDefinition,
  desiredKind: ComponentLibraryDatasetValueKind,
): boolean {
  return (field.valueKind ?? 'text') === desiredKind;
}

function getComponentLibraryBindingFieldKind(
  fieldKey: ComponentLibraryBindingFieldKey,
): ComponentLibraryDatasetValueKind {
  if (fieldKey === 'href') return 'url';
  if (fieldKey === 'src') return 'image';
  return 'text';
}

function setComponentLibraryBindingField(
  fields: BuilderDataBindingFieldMap,
  fieldKey: ComponentLibraryBindingFieldKey,
  fieldId: string,
): void {
  switch (fieldKey) {
    case 'title':
      fields.title = fieldId;
      return;
    case 'text':
      fields.text = fieldId;
      return;
    case 'label':
      fields.label = fieldId;
      return;
    case 'description':
      fields.description = fieldId;
      return;
    case 'href':
      fields.href = fieldId;
      return;
    case 'src':
      fields.src = fieldId;
      return;
    case 'alt':
      fields.alt = fieldId;
      return;
    case 'caption':
      fields.caption = fieldId;
      return;
  }
}
