import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { DynamicListCollectionConfig } from '@/lib/builder/dynamic-list-page-config';
import {
  createDynamicListRepeaterContainer,
  createDynamicListRootContainer,
  createDynamicListTextNode,
} from '@/lib/builder/dynamic-list-page-nodes';
import { createDynamicListTemplateNodes } from '@/lib/builder/dynamic-list-page-template';
import type { Locale } from '@/lib/locales';

export function createBuilderDynamicListCanvasDocumentFromConfig({
  config,
  locale,
}: {
  config: DynamicListCollectionConfig;
  locale: Locale;
}): BuilderCanvasDocument {
  const now = new Date().toISOString();
  const rootId = `dynamic-list-root-${config.collectionId}`;
  const repeaterId = `dynamic-list-repeater-${config.collectionId}`;
  const nodes: BuilderCanvasNode[] = [
    createDynamicListRootContainer(config, locale, rootId),
    createDynamicListTextNode({
      id: `dynamic-list-eyebrow-${config.collectionId}`,
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
    createDynamicListTextNode({
      id: `dynamic-list-title-${config.collectionId}`,
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
    createDynamicListTextNode({
      id: `dynamic-list-description-${config.collectionId}`,
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
    createDynamicListRepeaterContainer(config, rootId, repeaterId),
    ...createDynamicListTemplateNodes(config, repeaterId, locale),
  ];

  return {
    version: 1,
    locale,
    updatedAt: now,
    updatedBy: `dynamic-list-page-${config.collectionId}`,
    stageWidth: 1280,
    stageHeight: 820,
    nodes,
  };
}
