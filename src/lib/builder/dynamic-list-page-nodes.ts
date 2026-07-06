import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import type { DynamicListCollectionConfig } from '@/lib/builder/dynamic-list-page-config';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import type { Locale } from '@/lib/locales';

export function createDynamicListRootContainer(
  config: DynamicListCollectionConfig,
  locale: Locale,
  rootId: string,
): BuilderCanvasNode {
  return {
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
  } as BuilderCanvasNode;
}

export function createDynamicListRepeaterContainer(
  config: DynamicListCollectionConfig,
  rootId: string,
  repeaterId: string,
): BuilderCanvasNode {
  return {
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
  } as BuilderCanvasNode;
}

export function createDynamicListImageNode({
  config,
  imageField,
  parentId,
  y,
  zIndex,
}: {
  config: DynamicListCollectionConfig;
  imageField: string;
  parentId: string;
  y: number;
  zIndex: number;
}): BuilderCanvasNode {
  return {
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
        src: imageField,
        alt: config.titleField,
        href: config.hrefField,
      },
    },
  } as BuilderCanvasNode;
}

export function createDynamicListButtonNode({
  config,
  parentId,
  locale,
  y,
  zIndex,
}: {
  config: DynamicListCollectionConfig;
  parentId: string;
  locale: Locale;
  y: number;
  zIndex: number;
}): BuilderCanvasNode {
  return {
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
  } as BuilderCanvasNode;
}

export function createDynamicListTextNode({
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
