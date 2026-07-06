import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { DynamicListCollectionConfig } from '@/lib/builder/dynamic-list-page-config';
import {
  createDynamicListButtonNode,
  createDynamicListImageNode,
  createDynamicListTextNode,
} from '@/lib/builder/dynamic-list-page-nodes';
import type { Locale } from '@/lib/locales';

export function createDynamicListTemplateNodes(
  config: DynamicListCollectionConfig,
  parentId: string,
  locale: Locale,
): BuilderCanvasNode[] {
  const nodes: BuilderCanvasNode[] = [];
  let y = 0;
  let zIndex = 6;

  if (config.imageField) {
    nodes.push(createDynamicListImageNode({
      config,
      imageField: config.imageField,
      parentId,
      y,
      zIndex,
    }));
    y += 164;
    zIndex += 1;
  }

  nodes.push(createDynamicListTextNode({
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

  nodes.push(createDynamicListTextNode({
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

  nodes.push(createDynamicListButtonNode({ config, parentId, locale, y, zIndex }));
  return nodes;
}
