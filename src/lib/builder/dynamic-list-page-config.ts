import type { BuilderCmsCollection, BuilderCmsFieldDefinition } from '@/lib/builder/cms-types';
import type {
  BuilderDatasetCollectionId,
  BuilderDatasetTargetId,
} from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';

export type BuiltInDynamicListCollectionId = Extract<
  BuilderDatasetCollectionId,
  'columns' | 'service-areas' | 'attorney-profiles'
>;

export interface DynamicListCollectionConfig {
  collectionId: string;
  datasetCollectionId: BuiltInDynamicListCollectionId;
  targetId: BuilderDatasetTargetId;
  cmsCollectionId?: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  defaultSlug: string;
  titleField: string;
  descriptionField: string;
  imageField?: string;
  hrefField: string;
  buttonLabel: Record<Locale, string>;
  defaultLimit: number;
}

const dynamicListCollectionConfigs: readonly DynamicListCollectionConfig[] = [
  {
    collectionId: 'columns',
    datasetCollectionId: 'columns',
    targetId: 'home.insights.feed',
    title: {
      ko: '칼럼 동적 리스트',
      'zh-hant': '專欄動態列表',
      en: 'Columns Dynamic List',
    },
    description: {
      ko: 'CMS 칼럼 컬렉션에서 필터/정렬/제한을 적용해 반복 카드로 렌더링합니다.',
      'zh-hant': '從 CMS 專欄集合套用篩選、排序與數量限制後輸出列表。',
      en: 'A CMS-backed list page generated from the columns collection.',
    },
    defaultSlug: 'columns-list',
    titleField: 'title',
    descriptionField: 'summary',
    imageField: 'featuredImage',
    hrefField: 'href',
    buttonLabel: {
      ko: '칼럼 보기',
      'zh-hant': '查看專欄',
      en: 'View column',
    },
    defaultLimit: 6,
  },
  {
    collectionId: 'service-areas',
    datasetCollectionId: 'service-areas',
    targetId: 'home.services.list',
    title: {
      ko: '주요 서비스 동적 리스트',
      'zh-hant': '主要服務動態列表',
      en: 'Services Dynamic List',
    },
    description: {
      ko: 'CMS 서비스 컬렉션에서 필터/정렬/제한을 적용해 반복 카드로 렌더링합니다.',
      'zh-hant': '從 CMS 服務集合套用篩選、排序與數量限制後輸出列表。',
      en: 'A CMS-backed list page generated from the services collection.',
    },
    defaultSlug: 'services-list',
    titleField: 'title',
    descriptionField: 'description',
    hrefField: 'href',
    buttonLabel: {
      ko: '서비스 보기',
      'zh-hant': '查看服務',
      en: 'View service',
    },
    defaultLimit: 6,
  },
  {
    collectionId: 'attorney-profiles',
    datasetCollectionId: 'attorney-profiles',
    targetId: 'home.attorney.profile',
    title: {
      ko: '변호사 동적 리스트',
      'zh-hant': '律師動態列表',
      en: 'Attorney Dynamic List',
    },
    description: {
      ko: 'CMS 변호사 프로필 컬렉션에서 필터/정렬/제한을 적용해 반복 카드로 렌더링합니다.',
      'zh-hant': '從 CMS 律師個人資料集合套用篩選、排序與數量限制後輸出列表。',
      en: 'A CMS-backed list page generated from attorney profile records.',
    },
    defaultSlug: 'lawyers-list',
    titleField: 'name',
    descriptionField: 'role',
    imageField: 'image',
    hrefField: 'href',
    buttonLabel: {
      ko: '프로필 보기',
      'zh-hant': '查看律師簡介',
      en: 'View profile',
    },
    defaultLimit: 3,
  },
];

export function isSupportedDynamicListCollectionId(
  value: string | null | undefined,
): value is BuiltInDynamicListCollectionId {
  return dynamicListCollectionConfigs.some((config) => config.collectionId === value);
}

export function getDynamicListCollectionConfig(
  collectionId: BuiltInDynamicListCollectionId,
): DynamicListCollectionConfig {
  const config = dynamicListCollectionConfigs.find((candidate) => candidate.collectionId === collectionId);
  if (!config) {
    throw new Error(`Unsupported dynamic list collection: ${collectionId}`);
  }
  return config;
}

export function getDynamicListDefaultSlug(collectionId: BuiltInDynamicListCollectionId): string {
  return getDynamicListCollectionConfig(collectionId).defaultSlug;
}

export function getDynamicListDefaultTitle(
  collectionId: BuiltInDynamicListCollectionId,
  locale: Locale,
): string {
  const title = getDynamicListCollectionConfig(collectionId).title;
  return title[locale] ?? title.ko;
}

export function createCmsDynamicListCollectionConfig(collection: BuilderCmsCollection): DynamicListCollectionConfig {
  const fields = collection.fields;
  const titleField = pickTitleField(fields);
  const descriptionField = pickDescriptionField(fields, titleField);
  const imageField = fields.find((field) => field.type === 'image')?.key;
  const label = collection.name || collection.collectionId;

  return {
    collectionId: collection.collectionId,
    datasetCollectionId: 'columns',
    targetId: 'home.insights.feed',
    cmsCollectionId: collection.collectionId,
    title: {
      ko: `${label} 동적 리스트`,
      'zh-hant': `${label} 動態列表`,
      en: `${label} Dynamic List`,
    },
    description: {
      ko: `${label} 컬렉션의 공개 레코드를 반복 카드로 렌더링합니다.`,
      'zh-hant': `將 ${label} 集合的公開紀錄輸出為重複卡片。`,
      en: `A CMS-backed list page generated from the ${label} collection.`,
    },
    defaultSlug: `${collection.slug || collection.collectionId}-list`,
    titleField,
    descriptionField,
    ...(imageField ? { imageField } : {}),
    hrefField: 'href',
    buttonLabel: {
      ko: '자세히 보기',
      'zh-hant': '查看詳情',
      en: 'View item',
    },
    defaultLimit: 6,
  };
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

function pickDescriptionField(
  fields: readonly BuilderCmsFieldDefinition[],
  titleField: string,
): string {
  return (
    fields.find((field) => (
      (field.key === 'summary' || field.key === 'description' || field.key === 'subtitle')
      && field.key !== titleField
    ))?.key
    ?? fields.find((field) => (
      (field.type === 'text' || field.type === 'rich-text')
      && field.key !== titleField
      && field.key !== 'slug'
    ))?.key
    ?? titleField
  );
}
