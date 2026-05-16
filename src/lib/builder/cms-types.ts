import type { Locale } from '@/lib/locales';

export const builderCmsFieldTypes = [
  'text',
  'rich-text',
  'slug',
  'number',
  'boolean',
  'date',
  'image',
  'email',
  'url',
  'string-list',
  'reference',
] as const;

export type BuilderCmsFieldType = (typeof builderCmsFieldTypes)[number];

export const builderCmsPermissionActors = ['public', 'member', 'staff', 'admin'] as const;
export type BuilderCmsPermissionActor = (typeof builderCmsPermissionActors)[number];

export interface BuilderCmsPermissions {
  read: BuilderCmsPermissionActor[];
  create: BuilderCmsPermissionActor[];
  update: BuilderCmsPermissionActor[];
  delete: BuilderCmsPermissionActor[];
}

export interface BuilderCmsFieldValidation {
  min?: number;
  max?: number;
  pattern?: string;
  options?: string[];
}

export interface BuilderCmsFieldDefinition {
  fieldId: string;
  key: string;
  label: string;
  type: BuilderCmsFieldType;
  localized: boolean;
  repeated: boolean;
  required: boolean;
  unique?: boolean;
  defaultValue?: unknown;
  validation?: BuilderCmsFieldValidation;
  relationCollectionId?: string;
}

export type BuilderCmsIndexSortDirection = 'asc' | 'desc';

export interface BuilderCmsIndexField {
  fieldKey: string;
  direction: BuilderCmsIndexSortDirection;
}

export interface BuilderCmsIndexDefinition {
  indexId: string;
  name: string;
  fields: BuilderCmsIndexField[];
  unique: boolean;
  createdAt: string;
}

export interface BuilderCmsImageValue {
  url: string;
  assetId?: string;
  filename?: string;
  altText?: string;
  focalPoint?: {
    x: number;
    y: number;
  };
}

export type BuilderCmsRecordStatus = 'draft' | 'published' | 'archived';
export type BuilderCmsRecordRevisionAction = 'update' | 'restore';

export interface BuilderCmsRecordRevision {
  revisionId: string;
  status: BuilderCmsRecordStatus;
  locale?: Locale;
  fields: Record<string, unknown>;
  createdAt: string;
  authorLabel: string;
  action: BuilderCmsRecordRevisionAction;
}

export interface BuilderCmsRecord {
  recordId: string;
  status: BuilderCmsRecordStatus;
  locale?: Locale;
  fields: Record<string, unknown>;
  revisions?: BuilderCmsRecordRevision[];
  createdAt: string;
  updatedAt: string;
}

export interface BuilderCmsCollection {
  collectionId: string;
  name: string;
  slug: string;
  description: string;
  localized: boolean;
  fields: BuilderCmsFieldDefinition[];
  indexes: BuilderCmsIndexDefinition[];
  records: BuilderCmsRecord[];
  permissions: BuilderCmsPermissions;
  createdAt: string;
  updatedAt: string;
}

export interface BuilderCmsCollectionSummary {
  collectionId: string;
  name: string;
  slug: string;
  description: string;
  localized: boolean;
  fieldCount: number;
  indexCount: number;
  recordCount: number;
  permissions: BuilderCmsPermissions;
  createdAt: string;
  updatedAt: string;
}

export interface BuilderCmsCollectionDetail extends BuilderCmsCollectionSummary {
  fields: BuilderCmsFieldDefinition[];
  indexes: BuilderCmsIndexDefinition[];
  records: BuilderCmsRecord[];
}
