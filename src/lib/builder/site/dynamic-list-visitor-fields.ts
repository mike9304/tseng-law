import {
  getBuilderBindableTarget,
  type BuilderDatasetFieldDefinition,
} from '@/lib/builder/datasets';
import { sanitizeVisitorFieldId } from '@/lib/builder/datasets-visitor-query';
import type { VisitorDatasetFieldAccess } from '@/lib/builder/datasets-visitor-filters';
import type {
  BuilderCmsCollection,
  BuilderCmsFieldDefinition,
  BuilderCmsFieldType,
} from '@/lib/builder/cms-types';
import type { BuilderDynamicListPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import type { BuilderPageDatasetSort } from '@/lib/builder/types';

export interface DynamicListVisitorSortOption {
  readonly fieldId: string;
  readonly direction: BuilderPageDatasetSort['direction'];
  readonly label: string;
}

export interface DynamicListVisitorFieldState {
  readonly fieldAccess: VisitorDatasetFieldAccess;
  readonly sortOptions: readonly DynamicListVisitorSortOption[];
}

const filterableCmsFieldTypes = new Set<BuilderCmsFieldType>([
  'text',
  'rich-text',
  'slug',
  'number',
  'boolean',
  'date',
  'email',
  'url',
  'string-list',
]);

const sortableCmsFieldTypes = new Set<BuilderCmsFieldType>([
  'text',
  'slug',
  'number',
  'boolean',
  'date',
  'email',
  'url',
]);

export function resolveDynamicListVisitorFieldState({
  dynamicList,
  site,
}: {
  dynamicList: BuilderDynamicListPageMeta;
  site: Pick<BuilderSiteDocument, 'cmsCollections'>;
}): DynamicListVisitorFieldState {
  const customCollection = dynamicList.cmsCollectionId
    ? site.cmsCollections?.find((collection) => collection.collectionId === dynamicList.cmsCollectionId)
    : null;
  if (customCollection) {
    const filterFields = pickCmsVisitorFields(customCollection, filterableCmsFieldTypes);
    const sortFields = pickCmsVisitorFields(customCollection, sortableCmsFieldTypes);
    return {
      fieldAccess: {
        filterFields,
        sortFields,
        defaultLimit: dynamicList.limit,
      },
      sortOptions: createSortOptions(sortFields),
    };
  }

  const target = getBuilderBindableTarget(dynamicList.targetId);
  return {
    fieldAccess: {
      filterFields: target.filterFields,
      sortFields: target.sortFields,
      defaultLimit: dynamicList.limit ?? target.defaultLimit,
    },
    sortOptions: createSortOptions(target.sortFields),
  };
}

function pickCmsVisitorFields(
  collection: BuilderCmsCollection,
  allowedTypes: ReadonlySet<BuilderCmsFieldType>,
): BuilderDatasetFieldDefinition[] {
  const fields: BuilderDatasetFieldDefinition[] = [];
  const seen = new Set<string>();
  for (const field of collection.fields) {
    const definition = toVisitorField(field, allowedTypes);
    if (!definition || seen.has(definition.fieldId)) continue;
    seen.add(definition.fieldId);
    fields.push(definition);
  }
  return fields;
}

function toVisitorField(
  field: BuilderCmsFieldDefinition,
  allowedTypes: ReadonlySet<BuilderCmsFieldType>,
): BuilderDatasetFieldDefinition | null {
  if (!allowedTypes.has(field.type)) return null;
  const fieldId = sanitizeVisitorFieldId(field.key);
  if (!fieldId) return null;
  return {
    fieldId,
    label: field.label || field.key,
    valueKind: field.type === 'url' ? 'url' : 'text',
  };
}

function createSortOptions(
  sortFields: readonly BuilderDatasetFieldDefinition[],
): DynamicListVisitorSortOption[] {
  return sortFields.flatMap((field) => ([
    { fieldId: field.fieldId, direction: 'asc', label: `${field.label} ascending` },
    { fieldId: field.fieldId, direction: 'desc', label: `${field.label} descending` },
  ]));
}
