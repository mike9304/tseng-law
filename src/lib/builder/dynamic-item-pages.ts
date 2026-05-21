import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import { readBuilderCollectionRecordPreviews } from '@/lib/builder/cms';
import {
  createDefaultBuilderPageDatasets,
  replaceBuilderPageDatasetBinding,
} from '@/lib/builder/datasets';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import type { BuilderDynamicItemPageMeta } from '@/lib/builder/site/types';
import type { BuilderDatasetCollectionId, BuilderDatasetTargetId } from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';

type SupportedDynamicItemCollectionId = Extract<BuilderDatasetCollectionId, 'columns' | 'service-areas'>;

interface DynamicItemCollectionConfig {
  collectionId: SupportedDynamicItemCollectionId;
  targetId: BuilderDatasetTargetId;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  defaultSlug: string;
  slugField: string;
  titleField: string;
  bodyField: string;
  imageField?: string;
  hrefField: string;
  buttonLabel: Record<Locale, string>;
}

const dynamicItemCollectionConfigs: readonly DynamicItemCollectionConfig[] = [
  {
    collectionId: 'columns',
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
    slugField: 'href',
    titleField: 'title',
    bodyField: 'details',
    hrefField: 'href',
    buttonLabel: {
      ko: '서비스 보기',
      'zh-hant': '查看服務',
      en: 'View service',
    },
  },
];

export function isSupportedDynamicItemCollectionId(
  value: string | null | undefined,
): value is SupportedDynamicItemCollectionId {
  return dynamicItemCollectionConfigs.some((config) => config.collectionId === value);
}

export function getDynamicItemCollectionConfig(
  collectionId: SupportedDynamicItemCollectionId,
): DynamicItemCollectionConfig {
  const config = dynamicItemCollectionConfigs.find((candidate) => candidate.collectionId === collectionId);
  if (!config) {
    throw new Error(`Unsupported dynamic item collection: ${collectionId}`);
  }
  return config;
}

export function getDynamicItemDefaultSlug(collectionId: SupportedDynamicItemCollectionId): string {
  return getDynamicItemCollectionConfig(collectionId).defaultSlug;
}

export function getDynamicItemDefaultTitle(
  collectionId: SupportedDynamicItemCollectionId,
  locale: Locale,
): string {
  const title = getDynamicItemCollectionConfig(collectionId).title;
  return title[locale] ?? title.ko;
}

export function createBuilderDynamicItemPageMeta({
  collectionId,
  locale,
  recordSlug,
}: {
  collectionId: SupportedDynamicItemCollectionId;
  locale: Locale;
  recordSlug?: string;
}): BuilderDynamicItemPageMeta {
  const config = getDynamicItemCollectionConfig(collectionId);
  const fallbackRecordSlug = readBuilderCollectionRecordPreviews(collectionId, locale)[0]?.recordId ?? 'sample';

  return {
    kind: 'collection-item-v1',
    collectionId,
    targetId: config.targetId,
    slugField: config.slugField,
    defaultRecordSlug: normalizeDynamicItemRecordSlug(recordSlug) ?? fallbackRecordSlug,
    createdAt: new Date().toISOString(),
  };
}

export function buildBuilderDynamicItemDatasetDocument(
  dynamicItem: BuilderDynamicItemPageMeta,
  recordSlug?: string | null,
) {
  const config = getDynamicItemCollectionConfig(dynamicItem.collectionId as SupportedDynamicItemCollectionId);
  const resolvedRecordSlug = normalizeDynamicItemRecordSlug(recordSlug) ?? dynamicItem.defaultRecordSlug;

  return {
    pageKey: 'home' as const,
    datasets: replaceBuilderPageDatasetBinding(
      createDefaultBuilderPageDatasets('home'),
      'home',
      config.targetId,
      {
        collectionId: config.collectionId,
        filters: [{ fieldId: config.slugField, operator: 'equals', value: resolvedRecordSlug }],
        sort: [],
        limit: 1,
      },
    ),
  };
}

export function createBuilderDynamicItemCanvasDocument({
  collectionId,
  locale,
}: {
  collectionId: SupportedDynamicItemCollectionId;
  locale: Locale;
}): BuilderCanvasDocument {
  const config = getDynamicItemCollectionConfig(collectionId);
  const now = new Date().toISOString();
  const rootId = `dynamic-item-root-${collectionId}`;
  const nodes: BuilderCanvasNode[] = [
    {
      id: rootId,
      kind: 'container',
      rect: { x: 0, y: 0, width: 1280, height: 920 },
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
        padding: 64,
        layoutMode: 'absolute',
      },
    } as BuilderCanvasNode,
    createTextNode({
      id: `dynamic-item-eyebrow-${collectionId}`,
      parentId: rootId,
      x: 72,
      y: 72,
      width: 280,
      height: 32,
      zIndex: 2,
      text: 'CMS Dynamic Item',
      fontSize: 14,
      color: '#116dff',
      fontWeight: 'bold',
    }),
    createTextNode({
      id: `dynamic-item-title-${collectionId}`,
      parentId: rootId,
      x: 72,
      y: 118,
      width: 720,
      height: 96,
      zIndex: 3,
      text: config.title[locale] ?? config.title.ko,
      fontSize: 42,
      color: '#0f172a',
      fontWeight: 'bold',
      dataBinding: {
        targetId: config.targetId,
        recordIndex: 0,
        fields: { text: config.titleField },
      },
    }),
    createTextNode({
      id: `dynamic-item-summary-${collectionId}`,
      parentId: rootId,
      x: 72,
      y: 236,
      width: 720,
      height: 260,
      zIndex: 4,
      text: config.description[locale] ?? config.description.ko,
      fontSize: 17,
      color: '#475569',
      lineHeight: 1.5,
      dataBinding: {
        targetId: config.targetId,
        recordIndex: 0,
        fields: { text: config.bodyField },
      },
    }),
    {
      id: `dynamic-item-link-${collectionId}`,
      kind: 'button',
      parentId: rootId,
      rect: { x: 72, y: 536, width: 152, height: 44 },
      style: createDefaultCanvasNodeStyle({ borderRadius: 999 }),
      zIndex: 5,
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
        fields: { href: config.hrefField },
      },
    } as BuilderCanvasNode,
    ...createDynamicItemMediaNodes(config, rootId),
  ];

  return {
    version: 1,
    locale,
    updatedAt: now,
    updatedBy: `dynamic-item-page-${collectionId}`,
    stageWidth: 1280,
    stageHeight: 920,
    nodes,
  };
}

function createDynamicItemMediaNodes(
  config: DynamicItemCollectionConfig,
  parentId: string,
): BuilderCanvasNode[] {
  if (!config.imageField) return [];

  return [
    {
      id: `dynamic-item-image-${config.collectionId}`,
      kind: 'image',
      parentId,
      rect: { x: 840, y: 118, width: 340, height: 250 },
      style: createDefaultCanvasNodeStyle({
        borderColor: '#dbeafe',
        borderWidth: 1,
        borderRadius: 18,
        shadowY: 14,
        shadowBlur: 34,
        shadowColor: 'rgba(15, 23, 42, 0.12)',
      }),
      zIndex: 6,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        src: '/images/placeholder-image.svg',
        alt: 'Dynamic item image',
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
    } as BuilderCanvasNode,
  ];
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

function normalizeDynamicItemRecordSlug(value: string | null | undefined): string | null {
  const normalized = value?.trim().replace(/^\/+|\/+$/g, '');
  if (!normalized || normalized.includes('/')) return null;
  return normalized.slice(0, 160);
}
