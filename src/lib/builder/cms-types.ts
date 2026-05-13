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

export type BuilderCmsRecordStatus = 'draft' | 'published' | 'archived';

export interface BuilderCmsRecord {
  recordId: string;
  status: BuilderCmsRecordStatus;
  locale?: Locale;
  fields: Record<string, unknown>;
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
  recordCount: number;
  permissions: BuilderCmsPermissions;
  createdAt: string;
  updatedAt: string;
}

export interface BuilderCmsCollectionDetail extends BuilderCmsCollectionSummary {
  fields: BuilderCmsFieldDefinition[];
  records: BuilderCmsRecord[];
}
