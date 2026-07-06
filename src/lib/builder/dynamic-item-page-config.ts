import type { BuilderCmsCollection, BuilderCmsFieldDefinition } from '@/lib/builder/cms-types';
import type {
  BuilderDatasetCollectionId,
  BuilderDatasetTargetId,
} from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';

export type BuiltInDynamicItemCollectionId = Extract<
  BuilderDatasetCollectionId,
  'columns' | 'service-areas' | 'attorney-profiles'
>;

export interface DynamicItemCollectionConfig {
  readonly collectionId: string;
  readonly datasetCollectionId: BuiltInDynamicItemCollectionId;
  readonly targetId: BuilderDatasetTargetId;
  readonly cmsCollectionId?: string;
  readonly title: Record<Locale, string>;
  readonly description: Record<Locale, string>;
  readonly defaultSlug: string;
  readonly slugField: string;
  readonly titleField: string;
  readonly bodyField: string;
  readonly imageField?: string;
  readonly hrefField: string;
  readonly buttonLabel: Record<Locale, string>;
}

const dynamicItemCollectionConfigs: readonly DynamicItemCollectionConfig[] = [
  {
    collectionId: 'columns',
    datasetCollectionId: 'columns',
    targetId: 'home.insights.feed',
    title: {
      ko: '칼럼 동적 상세',
      'zh-hant': '專欄動態詳情',
      en: 'Column Dynamic Item',
    },
    description: {
      ko: 'CMS 칼럼 컬렉션의 개별 레코드를 URL slug로 해석해 상세 페이지로 렌더링합니다.',
      'zh-hant': '依 URL slug 解析 CMS 專欄集合的單筆記錄並輸出詳情頁。',
      en: 'A CMS-backed detail page generated from one columns record.',
    },
    defaultSlug: 'columns-item',
    slugField: 'slug',
    titleField: 'title',
    bodyField: 'content',
    imageField: 'featuredImage',
    hrefField: 'href',
    buttonLabel: {
      ko: '원문 보기',
      'zh-hant': '查看原文',
      en: 'View original',
    },
  },
  {
    collectionId: 'service-areas',
    datasetCollectionId: 'service-areas',
    targetId: 'home.services.list',
    title: {
      ko: '서비스 동적 상세',
      'zh-hant': '服務動態詳情',
      en: 'Service Dynamic Item',
    },
    description: {
      ko: 'CMS 서비스 컬렉션의 개별 레코드를 URL slug로 해석해 상세 페이지로 렌더링합니다.',
      'zh-hant': '依 URL slug 解析 CMS 服務集合的單筆記錄並輸出詳情頁。',
      en: 'A CMS-backed detail page generated from one service record.',
    },
    defaultSlug: 'services-item',
    slugField: 'slug',
    titleField: 'title',
    bodyField: 'details',
    hrefField: 'href',
    buttonLabel: {
      ko: '서비스 보기',
      'zh-hant': '查看服務',
      en: 'View service',
    },
  },
  {
    collectionId: 'attorney-profiles',
    datasetCollectionId: 'attorney-profiles',
    targetId: 'home.attorney.profile',
    title: {
      ko: '변호사 동적 상세',
      'zh-hant': '律師動態詳情',
      en: 'Attorney Dynamic Item',
    },
    description: {
      ko: 'CMS 변호사 프로필 컬렉션의 개별 레코드를 URL slug로 해석해 상세 페이지로 렌더링합니다.',
      'zh-hant': '依 URL slug 解析 CMS 律師個人資料集合的單筆記錄並輸出詳情頁。',
      en: 'A CMS-backed detail page generated from one attorney profile record.',
    },
    defaultSlug: 'lawyers-item',
    slugField: 'slug',
    titleField: 'name',
    bodyField: 'description',
    imageField: 'image',
    hrefField: 'href',
    buttonLabel: {
      ko: '프로필 보기',
      'zh-hant': '查看律師簡介',
      en: 'View profile',
    },
  },
];

export function isSupportedDynamicItemCollectionId(
  value: string | null | undefined,
): value is BuiltInDynamicItemCollectionId {
  return dynamicItemCollectionConfigs.some((config) => config.datasetCollectionId === value);
}

export function getDynamicItemCollectionConfig(
  collectionId: BuiltInDynamicItemCollectionId,
): DynamicItemCollectionConfig {
  const config = dynamicItemCollectionConfigs.find((candidate) => candidate.datasetCollectionId === collectionId);
  if (!config) {
    throw new Error(`Unsupported dynamic item collection: ${collectionId}`);
  }
  return config;
}

export function getDynamicItemDefaultSlug(collectionId: BuiltInDynamicItemCollectionId): string {
  return getDynamicItemCollectionConfig(collectionId).defaultSlug;
}

export function getDynamicItemDefaultTitle(
  collectionId: BuiltInDynamicItemCollectionId,
  locale: Locale,
): string {
  const title = getDynamicItemCollectionConfig(collectionId).title;
  return title[locale] ?? title.ko;
}

export function createCmsDynamicItemCollectionConfig(collection: BuilderCmsCollection): DynamicItemCollectionConfig {
  const fields = collection.fields;
  const titleField = pickTitleField(fields);
  const slugField = pickSlugField(fields);
  const bodyField = pickBodyField(fields, titleField);
  const imageField = fields.find((field) => field.type === 'image')?.key;
  const label = collection.name || collection.collectionId;

  return {
    collectionId: collection.collectionId,
    datasetCollectionId: 'columns',
    targetId: 'home.insights.feed',
    cmsCollectionId: collection.collectionId,
    title: {
      ko: `${label} 동적 상세`,
      'zh-hant': `${label} 動態詳情`,
      en: `${label} Dynamic Item`,
    },
    description: {
      ko: `${label} 컬렉션의 공개 레코드 하나를 URL slug로 렌더링합니다.`,
      'zh-hant': `依 URL slug 輸出 ${label} 集合的單筆公開紀錄。`,
      en: `A CMS-backed detail page generated from one ${label} record.`,
    },
    defaultSlug: `${collection.slug || collection.collectionId}-item`,
    slugField,
    titleField,
    bodyField,
    ...(imageField ? { imageField } : {}),
    hrefField: 'href',
    buttonLabel: {
      ko: '자세히 보기',
      'zh-hant': '查看詳情',
      en: 'View item',
    },
  };
}

export function getCmsDynamicItemDefaultTitle(
  collection: BuilderCmsCollection,
  locale: Locale,
): string {
  const title = createCmsDynamicItemCollectionConfig(collection).title;
  return title[locale] ?? title.ko;
}

export function getCmsDynamicItemDefaultRecordSlug(collection: BuilderCmsCollection): string {
  const config = createCmsDynamicItemCollectionConfig(collection);
  const record = collection.records.find((candidate) => candidate.status === 'published') ?? collection.records[0];
  const slug = readTextValue(record?.fields[config.slugField]);
  return slug ?? record?.recordId ?? 'sample';
}

function pickTitleField(fields: readonly BuilderCmsFieldDefinition[]): string {
  return (
    fields.find((field) => field.key === 'title')?.key
    ?? fields.find((field) => field.key === 'name')?.key
    ?? fields.find((field) => field.type === 'text' && field.key !== 'slug')?.key
    ?? fields[0]?.key
    ?? 'title'
  );
}

function pickSlugField(fields: readonly BuilderCmsFieldDefinition[]): string {
  return fields.find((field) => field.type === 'slug')?.key ?? fields.find((field) => field.key === 'slug')?.key ?? 'slug';
}

function pickBodyField(
  fields: readonly BuilderCmsFieldDefinition[],
  titleField: string,
): string {
  return (
    fields.find((field) => (
      (field.key === 'content' || field.key === 'summary' || field.key === 'description' || field.key === 'body')
      && field.key !== titleField
    ))?.key
    ?? fields.find((field) => (
      (field.type === 'rich-text' || field.type === 'text')
      && field.key !== titleField
      && field.key !== 'slug'
    ))?.key
    ?? titleField
  );
}

function readTextValue(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized || null;
}
