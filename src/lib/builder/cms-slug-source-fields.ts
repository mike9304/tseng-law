import type {
  BuilderCmsCollection,
  BuilderCmsFieldDefinition,
  BuilderCmsFieldType,
} from '@/lib/builder/cms-types';
import { BuilderCmsValidationError } from '@/lib/builder/cms-validation-error';

type BuilderCmsSlugSourceFieldType = Extract<BuilderCmsFieldType, 'text' | 'rich-text'>;

export type BuilderCmsSlugSourceField = {
  readonly key: string;
  readonly label: string;
  readonly type: BuilderCmsSlugSourceFieldType;
};

export function listBuilderCmsSlugSourceFields(
  collection: Pick<BuilderCmsCollection, 'fields'>,
  slugFieldKey: string,
): readonly BuilderCmsSlugSourceField[] {
  return collection.fields.flatMap((field) => (
    isSlugSourceField(field, slugFieldKey)
      ? [{ key: field.key, label: field.label, type: field.type }]
      : []
  ));
}

export function normalizeOptionalSlugSourceFieldKey(
  input: unknown,
  collection: Pick<BuilderCmsCollection, 'fields'>,
  slugFieldKey: string,
): string | undefined {
  if (input === undefined || input === null || input === '') return undefined;
  const sourceFieldKey = normalizeSourceFieldKey(input);
  const sourceField = listBuilderCmsSlugSourceFields(collection, slugFieldKey)
    .find((field) => field.key === sourceFieldKey);
  if (!sourceField) {
    throw new BuilderCmsValidationError(`Unknown slug source field: ${sourceFieldKey}`);
  }
  return sourceField.key;
}

function normalizeSourceFieldKey(input: unknown): string {
  if (typeof input !== 'string' || !/^[A-Za-z][A-Za-z0-9_]{0,62}$/.test(input.trim())) {
    throw new BuilderCmsValidationError('sourceFieldKey must be an identifier.');
  }
  return input.trim();
}

function isSlugSourceField(
  field: BuilderCmsFieldDefinition,
  slugFieldKey: string,
): field is BuilderCmsFieldDefinition & { readonly type: BuilderCmsSlugSourceFieldType } {
  return field.key !== slugFieldKey && (field.type === 'text' || field.type === 'rich-text');
}
