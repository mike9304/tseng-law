import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createDefaultBuilderPageDatasets,
  replaceBuilderPageDatasetBinding,
} from '@/lib/builder/datasets';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import type { BuilderDynamicListPageMeta } from '@/lib/builder/site/types';
import type {
  BuilderDatasetCollectionId,
  BuilderDatasetTargetId,
  BuilderPageDatasetFilter,
  BuilderPageDatasetSort,
} from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';

type SupportedDynamicListCollectionId = Extract<BuilderDatasetCollectionId, 'columns' | 'service-areas'>;

interface DynamicListCollectionConfig {
  collectionId: SupportedDynamicListCollectionId;
  targetId: BuilderDatasetTargetId;
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
];

export function isSupportedDynamicListCollectionId(
  value: string | null | undefined,
): value is SupportedDynamicListCollectionId {
  return dynamicListCollectionConfigs.some((config) => config.collectionId === value);
}

export function getDynamicListCollectionConfig(
  collectionId: SupportedDynamicListCollectionId,
): DynamicListCollectionConfig {
  const config = dynamicListCollectionConfigs.find((candidate) => candidate.collectionId === collectionId);
  if (!config) {
    throw new Error(`Unsupported dynamic list collection: ${collectionId}`);
  }
  return config;
}

export function getDynamicListDefaultSlug(collectionId: SupportedDynamicListCollectionId): string {
  return getDynamicListCollectionConfig(collectionId).defaultSlug;
}

export function getDynamicListDefaultTitle(
  collectionId: SupportedDynamicListCollectionId,
  locale: Locale,
): string {
  const title = getDynamicListCollectionConfig(collectionId).title;
  return title[locale] ?? title.ko;
}

export function createBuilderDynamicListPageMeta({
  collectionId,
  filters = [],
  sort = [],
  limit,
}: {
  collectionId: SupportedDynamicListCollectionId;
  filters?: BuilderPageDatasetFilter[];
  sort?: BuilderPageDatasetSort[];
  limit?: number;
}): BuilderDynamicListPageMeta {
  const config = getDynamicListCollectionConfig(collectionId);
  const binding = resolveBuilderDynamicListDatasetBinding({
    collectionId,
    filters,
    sort,
    limit: limit ?? config.defaultLimit,
  });

  return {
    kind: 'collection-list-v1',
    collectionId,
    targetId: config.targetId,
    filters: binding.filters ?? [],
    sort: binding.sort ?? [],
    limit: binding.limit,
    createdAt: new Date().toISOString(),
  };
}

export function buildBuilderDynamicListDatasetDocument(
  dynamicList: BuilderDynamicListPageMeta,
) {
  const binding = resolveBuilderDynamicListDatasetBinding({
    collectionId: dynamicList.collectionId as SupportedDynamicListCollectionId,
    filters: dynamicList.filters,
    sort: dynamicList.sort,
    limit: dynamicList.limit,
  });

  return {
    pageKey: 'home' as const,
    datasets: replaceBuilderPageDatasetBinding(
      createDefaultBuilderPageDatasets('home'),
      'home',
      binding.targetId,
      binding,
    ),
  };
}

export function createBuilderDynamicListCanvasDocument({
  collectionId,
  locale,
}: {
  collectionId: SupportedDynamicListCollectionId;
  locale: Locale;
}): BuilderCanvasDocument {
  const config = getDynamicListCollectionConfig(collectionId);
  const now = new Date().toISOString();
  const rootId = `dynamic-list-root-${collectionId}`;
  const repeaterId = `dynamic-list-repeater-${collectionId}`;
  const nodes: BuilderCanvasNode[] = [
    {
      id: rootId,
      kind: 'container',
      rect: { x: 0, y: 0, width: 1280, height: 820 },
      style: createDefaultCanvasNodeStyle({ backgroundColor: '#f8fafc' }),
      zIndex: 1,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        label: config.title[locale] ?? config.title.ko,
        background: '#f8fafc',
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        borderWidth: 0,
        borderRadius: 0,
        padding: 56,
        layoutMode: 'absolute',
      },
    } as BuilderCanvasNode,
    createTextNode({
      id: `dynamic-list-eyebrow-${collectionId}`,
      parentId: rootId,
      x: 72,
      y: 72,
      width: 260,
      height: 32,
      zIndex: 2,
      text: 'CMS Dynamic List',
      fontSize: 14,
      color: '#116dff',
      fontWeight: 'bold',
    }),
    createTextNode({
      id: `dynamic-list-title-${collectionId}`,
      parentId: rootId,
      x: 72,
      y: 112,
      width: 620,
      height: 72,
      zIndex: 3,
      text: config.title[locale] ?? config.title.ko,
      fontSize: 42,
      color: '#0f172a',
      fontWeight: 'bold',
    }),
    createTextNode({
      id: `dynamic-list-description-${collectionId}`,
      parentId: rootId,
      x: 72,
      y: 194,
      width: 640,
      height: 56,
      zIndex: 4,
      text: config.description[locale] ?? config.description.ko,
      fontSize: 17,
      color: '#475569',
      lineHeight: 1.45,
    }),
    {
      id: repeaterId,
      kind: 'container',
      parentId: rootId,
      rect: { x: 72, y: 292, width: 1080, height: config.imageField ? 420 : 300 },
      style: createDefaultCanvasNodeStyle({
        backgroundColor: '#ffffff',
        borderColor: '#dbeafe',
        borderWidth: 1,
        borderRadius: 18,
        shadowY: 14,
        shadowBlur: 34,
        shadowColor: 'rgba(15, 23, 42, 0.12)',
      }),
      zIndex: 5,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        label: 'Dynamic list repeater',
        background: '#ffffff',
        borderColor: '#dbeafe',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 18,
        padding: 20,
        layoutMode: 'repeater',
        flexConfig: {
          direction: 'row',
          wrap: true,
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          gap: 18,
        },
      },
      dataBinding: {
        targetId: config.targetId,
        recordIndex: 0,
        fields: {
          title: config.titleField,
          description: config.descriptionField,
          ...(config.imageField ? { src: config.imageField } : {}),
        },
      },
    } as BuilderCanvasNode,
    ...createTemplateNodes(config, repeaterId, locale),
  ];

  return {
    version: 1,
    locale,
    updatedAt: now,
    updatedBy: `dynamic-list-page-${collectionId}`,
    stageWidth: 1280,
    stageHeight: 820,
    nodes,
  };
}

function resolveBuilderDynamicListDatasetBinding({
  collectionId,
  filters,
  sort,
  limit,
}: {
  collectionId: SupportedDynamicListCollectionId;
  filters?: BuilderPageDatasetFilter[];
  sort?: BuilderPageDatasetSort[];
  limit?: number;
}) {
  const config = getDynamicListCollectionConfig(collectionId);
  const datasets = replaceBuilderPageDatasetBinding(
    createDefaultBuilderPageDatasets('home'),
    'home',
    config.targetId,
    {
      collectionId,
      filters,
      sort,
      limit,
    },
  );
  const binding = datasets.find((dataset) => dataset.targetId === config.targetId);
  if (!binding) {
    throw new Error(`Missing dynamic list dataset binding for ${collectionId}`);
  }
  return binding;
}

function createTemplateNodes(
  config: DynamicListCollectionConfig,
  parentId: string,
  locale: Locale,
): BuilderCanvasNode[] {
  const nodes: BuilderCanvasNode[] = [];
  let y = 0;
  let zIndex = 6;

  if (config.imageField) {
    nodes.push({
      id: `dynamic-list-card-image-${config.collectionId}`,
      kind: 'image',
      parentId,
      rect: { x: 0, y, width: 260, height: 146 },
      style: createDefaultCanvasNodeStyle({ borderRadius: 12 }),
      zIndex,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        src: '/images/placeholder-image.svg',
        alt: 'Dynamic list image',
        fit: 'cover',
        link: null,
      },
      dataBinding: {
        targetId: config.targetId,
        recordIndex: 0,
        fields: {
          src: config.imageField,
          alt: config.titleField,
          href: config.hrefField,
        },
      },
    } as BuilderCanvasNode);
    y += 164;
    zIndex += 1;
  }

  nodes.push(createTextNode({
    id: `dynamic-list-card-title-${config.collectionId}`,
    parentId,
    x: 0,
    y,
    width: 260,
    height: 58,
    zIndex,
    text: 'Record title',
    fontSize: 19,
    color: '#0f172a',
    fontWeight: 'bold',
    dataBinding: {
      targetId: config.targetId,
      recordIndex: 0,
      fields: { text: config.titleField, href: config.hrefField },
    },
  }));
  y += 70;
  zIndex += 1;

  nodes.push(createTextNode({
    id: `dynamic-list-card-summary-${config.collectionId}`,
    parentId,
    x: 0,
    y,
    width: 260,
    height: 76,
    zIndex,
    text: 'Record summary',
    fontSize: 14,
    color: '#475569',
    lineHeight: 1.45,
    dataBinding: {
      targetId: config.targetId,
      recordIndex: 0,
      fields: { text: config.descriptionField },
    },
  }));
  y += 92;
  zIndex += 1;

  nodes.push({
    id: `dynamic-list-card-button-${config.collectionId}`,
    kind: 'button',
    parentId,
    rect: { x: 0, y, width: 148, height: 42 },
    style: createDefaultCanvasNodeStyle({ borderRadius: 999 }),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label: config.buttonLabel[locale] ?? config.buttonLabel.ko,
      href: '',
      style: 'primary-solid',
      link: null,
    },
    dataBinding: {
      targetId: config.targetId,
      recordIndex: 0,
      fields: {
        href: config.hrefField,
      },
    },
  } as BuilderCanvasNode);

  return nodes;
}

function createTextNode({
  id,
  parentId,
  x,
  y,
  width,
  height,
  zIndex,
  text,
  fontSize,
  color,
  fontWeight = 'regular',
  lineHeight = 1.25,
  dataBinding,
}: {
  id: string;
  parentId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  text: string;
  fontSize: number;
  color: string;
  fontWeight?: 'regular' | 'medium' | 'bold';
  lineHeight?: number;
  dataBinding?: BuilderCanvasNode['dataBinding'];
}): BuilderCanvasNode {
  return {
    id,
    kind: 'text',
    parentId,
    rect: { x, y, width, height },
    style: createDefaultCanvasNodeStyle(),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text,
      richText: richTextFromPlainText(text),
      fontSize,
      color,
      fontWeight,
      align: 'left',
      lineHeight,
      letterSpacing: 0,
    },
    dataBinding,
  } as BuilderCanvasNode;
}
