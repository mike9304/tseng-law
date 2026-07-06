import { describe, expect, it } from 'vitest';
import {
  createServicesDecomposedNodes,
  SERVICES_SECTION_ROOT_HEIGHT,
} from '../decompose-services';
import { upgradeStandardServicesPageDesktopParity } from '../decompose-page-services';
import { computeTopLevelFlowSectionMetrics } from '../flow';
import { STANDARD_PAGE_DECOMPOSERS } from '../seed-pages';
import {
  createDefaultCanvasNodeStyle,
  normalizeCanvasDocument,
  type BuilderCanvasNode,
  type BuilderCanvasDocument,
  type BuilderImageCanvasNode,
} from '../types';

function getImageNode(nodes: ReturnType<typeof createServicesDecomposedNodes>, id: string): BuilderImageCanvasNode {
  const node = nodes.find((candidate) => candidate.id === id);
  if (!node || node.kind !== 'image') {
    throw new Error(`Expected ${id} to be an image node.`);
  }
  return node;
}

function createLegacyServiceIconNode(id: string, src: string): BuilderImageCanvasNode {
  return {
    id,
    kind: 'image',
    rect: { x: 16, y: 16, width: 48, height: 48 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      src,
      alt: '서비스 아이콘',
      fit: 'contain',
    },
  };
}

function createIconDocument(nodes: BuilderImageCanvasNode[]): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-07-03T00:00:00.000Z',
    updatedBy: 'services-icon-normalization-test',
    stageWidth: 1280,
    stageHeight: 300,
    nodes,
  };
}

function resolveNodeBottom(nodes: readonly BuilderCanvasNode[], id: string): number {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const node = nodesById.get(id);
  if (!node) {
    throw new Error(`Expected ${id} to exist.`);
  }

  let y = node.rect.y;
  let cursor = node.parentId ? nodesById.get(node.parentId) : undefined;
  while (cursor) {
    y += cursor.rect.y;
    cursor = cursor.parentId ? nodesById.get(cursor.parentId) : undefined;
  }
  return y + node.rect.height;
}

describe('createServicesDecomposedNodes', () => {
  it('uses editable inline SVG service icons instead of external img assets', () => {
    const nodes = createServicesDecomposedNodes(0, 'ko', 0);

    const firstIcon = getImageNode(nodes, 'home-services-card-0-icon-svg');
    const secondIcon = getImageNode(nodes, 'home-services-card-1-icon-svg');
    const thirdIcon = getImageNode(nodes, 'home-services-card-2-icon-svg');

    expect(firstIcon.content.src).toBe('/images/placeholder-image.svg');
    expect(firstIcon.content.svg).toMatchObject({
      enabled: true,
      name: 'service-0',
      color: 'currentColor',
    });
    expect(secondIcon.content.svg?.name).toBe('service-1');
    expect(thirdIcon.content.svg?.name).toBe('service-2');
    expect(nodes.filter((node) => (
      node.kind === 'image'
      && typeof node.content.src === 'string'
      && node.content.src.startsWith('/images/home-services/icon-')
    ))).toHaveLength(0);
  });

  it('normalizes legacy saved service icon image assets to inline SVG content', () => {
    const normalized = normalizeCanvasDocument(createIconDocument([
      createLegacyServiceIconNode('home-services-card-3-icon-svg', '/images/home-services/icon-3.svg'),
    ]), 'ko');

    const icon = normalized.nodes.find((node) => node.id === 'home-services-card-3-icon-svg');
    expect(icon?.kind).toBe('image');
    if (icon?.kind !== 'image') {
      throw new Error('Expected normalized service icon to stay an image node.');
    }

    expect(icon.content.src).toBe('/images/placeholder-image.svg');
    expect(icon.content.svg).toMatchObject({
      enabled: true,
      name: 'service-3',
      color: 'currentColor',
    });
  });

  it('does not convert unrelated image nodes with a service-like id or src alone', () => {
    const normalized = normalizeCanvasDocument(createIconDocument([
      createLegacyServiceIconNode('home-services-card-4-icon-svg', '/images/header-skyline-buildings.webp'),
      createLegacyServiceIconNode('unrelated-icon', '/images/home-services/icon-4.svg'),
    ]), 'ko');

    const serviceLikeId = normalized.nodes.find((node) => node.id === 'home-services-card-4-icon-svg');
    const serviceLikeSrc = normalized.nodes.find((node) => node.id === 'unrelated-icon');

    expect(serviceLikeId?.kind).toBe('image');
    if (serviceLikeId?.kind === 'image') {
      expect(serviceLikeId.content.src).toBe('/images/header-skyline-buildings.webp');
      expect(serviceLikeId.content.svg).toBeUndefined();
    }

    expect(serviceLikeSrc?.kind).toBe('image');
    if (serviceLikeSrc?.kind === 'image') {
      expect(serviceLikeSrc.content.src).toBe('/images/home-services/icon-4.svg');
      expect(serviceLikeSrc.content.svg).toBeUndefined();
    }
  });

  it('keeps the collapsed services section height tight while preserving editable hidden detail nodes', () => {
    const nodes = createServicesDecomposedNodes(0, 'ko', 0);
    const root = nodes.find((node) => node.id === 'home-services-root');
    const container = nodes.find((node) => node.id === 'home-services-container');
    const list = nodes.find((node) => node.id === 'home-services-list');
    const lastCard = nodes.find((node) => node.id === 'home-services-card-5');
    const lastMore = nodes.find((node) => node.id === 'home-services-card-5-more');
    const lastChecklist = nodes.find((node) => node.id === 'home-services-card-5-checklist');

    expect(root?.rect.height).toBe(SERVICES_SECTION_ROOT_HEIGHT);
    expect(container?.rect.y).toBe(88);
    expect(container?.rect.height).toBe(1158);
    expect(list?.rect.y).toBe(236);
    expect(list?.rect.height).toBe(912);
    expect(root?.rect.height).toBe(1246);
    expect(lastCard?.rect.y).toBe(650);
    expect(lastCard?.rect.height).toBe(98);
    expect(lastMore, 'editable service detail button still exists for accordion expansion').toBeDefined();
    expect(lastChecklist, 'editable service checklist remains available for accordion expansion').toBeDefined();
    expect(lastMore?.rect.y).toBeLessThanOrEqual(100);
    expect(container?.rect.height).toBe((list?.rect.y ?? 0) + (list?.rect.height ?? 0) + 10);
    expect(root?.rect.height).toBe((container?.rect.y ?? 0) + (container?.rect.height ?? 0));
    expect(resolveNodeBottom(nodes, 'home-services-card-5-more')).toBeLessThanOrEqual(root?.rect.height ?? 0);
    expect(resolveNodeBottom(nodes, 'home-services-card-5-checklist')).toBeLessThanOrEqual(root?.rect.height ?? 0);

    const metrics = computeTopLevelFlowSectionMetrics(nodes);
    expect(metrics.get('home-services-root')?.minHeight).toBe(SERVICES_SECTION_ROOT_HEIGHT);
  });

  it('keeps the standard services page seeded to the live desktop height target', () => {
    const doc = STANDARD_PAGE_DECOMPOSERS.services('ko');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const header = nodesById.get('page-services-page-header-root');
    const root = nodesById.get('home-services-root');
    const container = nodesById.get('home-services-container');
    const divider = nodesById.get('home-services-divider');
    const dividerMark = nodesById.get('home-services-divider-mark');
    const list = nodesById.get('home-services-list');
    const lastCard = nodesById.get('home-services-card-5');
    const lastMore = nodesById.get('home-services-card-5-more');

    expect(header?.rect.height).toBe(428);
    expect(root?.rect.y).toBe(428);
    expect(root?.rect.height).toBe(1280);
    expect(root?.kind === 'container' ? root.content.className : '').toBe('section section--gray alt');
    expect(container?.rect.x).toBe(51);
    expect(container?.rect.y).toBe(142);
    expect(container?.rect.width).toBe(1178);
    expect(divider?.rect.y).toBe(202);
    expect(divider?.rect.width).toBe(1178);
    expect(dividerMark?.rect.x).toBe(562);
    expect(dividerMark?.rect.width).toBe(54);
    expect(divider?.responsive?.mobile?.rect).toMatchObject({ x: 0, y: 226, width: 308, height: 12 });
    expect(dividerMark?.responsive?.mobile?.rect).toMatchObject({ x: 127, y: 0, width: 54, height: 12 });
    expect(divider?.responsive?.tablet?.rect).toMatchObject({ x: 0, y: 185, width: 675, height: 12 });
    expect(dividerMark?.responsive?.tablet?.rect).toMatchObject({ x: 310, y: 0, width: 54, height: 12 });
    expect(list?.rect.y).toBe(222);
    expect(list?.rect.width).toBe(1178);
    expect(list?.rect.height).toBe(750);
    expect(lastCard?.rect.y).toBe(650);
    expect(lastCard?.rect.height).toBe(98);
    expect(lastMore?.rect.y).toBe(100);
    expect(resolveNodeBottom(doc.nodes, 'home-services-card-5-more')).toBeLessThanOrEqual(doc.stageHeight);
    expect(resolveNodeBottom(doc.nodes, 'home-services-card-5-checklist')).toBeLessThanOrEqual(doc.stageHeight);
    expect(doc.stageHeight).toBe(1708);
  });

  it('does not reset user-edited standard services geometry when geometry reset is blocked', () => {
    const doc = STANDARD_PAGE_DECOMPOSERS.services('ko');
    const userEditedDoc: BuilderCanvasDocument = {
      ...doc,
      nodes: doc.nodes.map((node): BuilderCanvasNode => (
        node.id === 'home-services-card-0'
          ? { ...node, rect: { ...node.rect, y: 12 } }
          : node
      )),
    };

    const upgraded = upgradeStandardServicesPageDesktopParity(userEditedDoc, {
      allowGeometryReset: false,
    });
    const card = upgraded.nodes.find((node) => node.id === 'home-services-card-0');

    expect(upgraded).toBe(userEditedDoc);
    expect(card?.rect.y).toBe(12);
  });

  it('normalizes seed-owned standard services geometry when geometry reset is allowed', () => {
    const doc = STANDARD_PAGE_DECOMPOSERS.services('ko');
    const staleSeedDoc: BuilderCanvasDocument = {
      ...doc,
      nodes: doc.nodes.map((node): BuilderCanvasNode => (
        node.id === 'home-services-card-0'
          ? { ...node, rect: { ...node.rect, y: 12 } }
          : node
      )),
    };

    const upgraded = upgradeStandardServicesPageDesktopParity(staleSeedDoc, {
      allowGeometryReset: true,
    });
    const card = upgraded.nodes.find((node) => node.id === 'home-services-card-0');
    const originalCard = staleSeedDoc.nodes.find((node) => node.id === 'home-services-card-0');

    expect(upgraded).not.toBe(staleSeedDoc);
    expect(card?.rect.y).toBe(0);
    expect(upgraded.stageHeight).toBe(1708);
    expect(originalCard?.rect.y).toBe(12);
  });
});
