import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import type { DynamicItemCollectionConfig } from '@/lib/builder/dynamic-item-page-config';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import type { Locale } from '@/lib/locales';

export function createBuilderDynamicItemCanvasDocumentFromConfig({
  config,
  locale,
}: {
  readonly config: DynamicItemCollectionConfig;
  readonly locale: Locale;
}): BuilderCanvasDocument {
  const now = new Date().toISOString();
  const rootId = `dynamic-item-root-${config.collectionId}`;
  const nodes: BuilderCanvasNode[] = [
    createRootNode(config, locale, rootId),
    createTextNode({
      id: `dynamic-item-eyebrow-${config.collectionId}`,
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
      id: `dynamic-item-title-${config.collectionId}`,
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
      id: `dynamic-item-summary-${config.collectionId}`,
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
    createLinkButtonNode(config, locale, rootId),
    ...createDynamicItemMediaNodes(config, rootId),
  ];

  return {
    version: 1,
    locale,
    updatedAt: now,
    updatedBy: `dynamic-item-page-${config.collectionId}`,
    stageWidth: 1280,
    stageHeight: 920,
    nodes,
  };
}

function createRootNode(
  config: DynamicItemCollectionConfig,
  locale: Locale,
  rootId: string,
): BuilderCanvasNode {
  return {
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
  };
}

function createLinkButtonNode(
  config: DynamicItemCollectionConfig,
  locale: Locale,
  parentId: string,
): BuilderCanvasNode {
  return {
    id: `dynamic-item-link-${config.collectionId}`,
    kind: 'button',
    parentId,
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
    },
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
  readonly id: string;
  readonly parentId: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly zIndex: number;
  readonly text: string;
  readonly fontSize: number;
  readonly color: string;
  readonly fontWeight?: 'regular' | 'medium' | 'bold';
  readonly lineHeight?: number;
  readonly dataBinding?: BuilderCanvasNode['dataBinding'];
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
    ...(dataBinding ? { dataBinding } : {}),
  };
}
