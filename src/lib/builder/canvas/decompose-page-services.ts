import type { BuilderCanvasDocument, BuilderCanvasNode } from './types';
import type { Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import { createServicesDecomposedNodes } from './decompose-services';
import {
  PAGE_CONTAINER_WIDTH,
  PAGE_CONTAINER_X,
  createPageHeaderSectionNodes,
} from './decompose-page-shared';

const STANDARD_SERVICES_SECTION_ROOT_HEIGHT = 1280;
const STANDARD_SERVICES_CONTAINER_Y = 142;
const STANDARD_SERVICES_CONTAINER_HEIGHT = 996;
const STANDARD_SERVICES_LIST_PUBLIC_Y = 246;
const STANDARD_SERVICES_LIST_MARGIN_TOP = 24;
const STANDARD_SERVICES_LIST_NODE_Y = STANDARD_SERVICES_LIST_PUBLIC_Y - STANDARD_SERVICES_LIST_MARGIN_TOP;
const STANDARD_SERVICES_LIST_HEIGHT = 750;
const STANDARD_SERVICES_CARD_HEIGHT = 98;
const STANDARD_SERVICES_CARD_PITCH = 130;
const STANDARD_SERVICES_TOGGLE_HEIGHT = 96;
const STANDARD_SERVICES_BODY_Y = 97;

type CanvasRect = BuilderCanvasNode['rect'];

function sameRect(left: CanvasRect, right: CanvasRect): boolean {
  return left.x === right.x
    && left.y === right.y
    && left.width === right.width
    && left.height === right.height;
}

function isStandardServicesPageDocument(document: BuilderCanvasDocument): boolean {
  return document.nodes.some((node) => node.id === 'page-services-page-header-root')
    && document.nodes.some((node) => node.id === 'home-services-root');
}

function standardServicesNodeChanged(original: BuilderCanvasNode, next: BuilderCanvasNode): boolean {
  if (!sameRect(original.rect, next.rect)) return true;
  return original.kind === 'container'
    && next.kind === 'container'
    && original.content.className !== next.content.className;
}

function setNodeRect(
  nodesById: Map<string, BuilderCanvasNode>,
  nodeId: string,
  rect: Partial<CanvasRect>,
): void {
  const node = nodesById.get(nodeId);
  if (!node) return;
  node.rect = { ...node.rect, ...rect };
}

export function applyStandardServicesPageLayout(nodes: BuilderCanvasNode[]): void {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const root = nodesById.get('home-services-root');
  if (root?.kind === 'container') {
    root.content = {
      ...root.content,
      className: 'section section--gray alt',
    };
  }

  setNodeRect(nodesById, 'home-services-root', { height: STANDARD_SERVICES_SECTION_ROOT_HEIGHT });
  setNodeRect(nodesById, 'home-services-container', {
    x: PAGE_CONTAINER_X,
    y: STANDARD_SERVICES_CONTAINER_Y,
    width: PAGE_CONTAINER_WIDTH,
    height: STANDARD_SERVICES_CONTAINER_HEIGHT,
  });
  setNodeRect(nodesById, 'home-services-label', { x: 0, y: 9, width: 200, height: 22 });
  setNodeRect(nodesById, 'home-services-title', { x: 0, y: 48, width: PAGE_CONTAINER_WIDTH, height: 72 });
  setNodeRect(nodesById, 'home-services-description', { x: 0, y: 139, width: 720, height: 30 });
  setNodeRect(nodesById, 'home-services-divider', { x: 0, y: 202, width: PAGE_CONTAINER_WIDTH, height: 12 });
  setNodeRect(nodesById, 'home-services-divider-mark', { x: 562, y: 0, width: 54, height: 12 });
  setNodeRect(nodesById, 'home-services-list', {
    x: 0,
    y: STANDARD_SERVICES_LIST_NODE_Y,
    width: PAGE_CONTAINER_WIDTH,
    height: STANDARD_SERVICES_LIST_HEIGHT,
  });

  for (let index = 0; index < 6; index += 1) {
    const cardId = `home-services-card-${index}`;
    setNodeRect(nodesById, cardId, {
      x: 0,
      y: index * STANDARD_SERVICES_CARD_PITCH,
      width: PAGE_CONTAINER_WIDTH,
      height: STANDARD_SERVICES_CARD_HEIGHT,
    });
    setNodeRect(nodesById, `${cardId}-toggle`, {
      x: 0,
      y: 0,
      width: PAGE_CONTAINER_WIDTH,
      height: STANDARD_SERVICES_TOGGLE_HEIGHT,
    });
    setNodeRect(nodesById, `${cardId}-header`, { x: 24, y: 20, width: 1000, height: 56 });
    setNodeRect(nodesById, `${cardId}-title`, { x: 62, y: 14, width: 880, height: 30 });
    setNodeRect(nodesById, `${cardId}-chevron`, { x: PAGE_CONTAINER_WIDTH - 48, y: 38, width: 20, height: 20 });
    setNodeRect(nodesById, `${cardId}-body`, {
      x: 0,
      y: STANDARD_SERVICES_BODY_Y,
      width: PAGE_CONTAINER_WIDTH,
      height: 40,
    });
    setNodeRect(nodesById, `${cardId}-description`, { x: 24, y: 0, width: 1020, height: 40 });
  }
}

export function upgradeStandardServicesPageDesktopParity(
  document: BuilderCanvasDocument,
  options: { allowGeometryReset: boolean },
): BuilderCanvasDocument {
  if (!isStandardServicesPageDocument(document)) return document;

  const nextNodes: BuilderCanvasNode[] = document.nodes.map((node) => ({
    ...node,
    rect: { ...node.rect },
  }));
  applyStandardServicesPageLayout(nextNodes);

  const nextStageHeight = Math.max(document.stageHeight, getServicesPageRootHeight(document.locale));
  const changed = nextStageHeight !== document.stageHeight
    || nextNodes.some((node, index) => {
      const original = document.nodes[index];
      return original ? standardServicesNodeChanged(original, node) : true;
    });

  if (!changed || !options.allowGeometryReset) return document;
  return {
    ...document,
    stageHeight: nextStageHeight,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+standard-services-parity`,
    nodes: nextNodes,
  };
}

function buildServicesPage(y: number, locale: Locale, zBase: number): { nodes: BuilderCanvasNode[]; height: number } {
  const page = pageCopy[locale].services;
  let cursor = y;
  const nodes: BuilderCanvasNode[] = [];

  const header = createPageHeaderSectionNodes({
    prefix: 'page-services',
    y: cursor,
    locale,
    label: page.label,
    title: page.title,
    description: page.description,
    zBase,
  });
  nodes.push(...header.nodes);
  cursor += header.height;

  const servicesNodes = createServicesDecomposedNodes(cursor, locale, zBase + 100);
  applyStandardServicesPageLayout(servicesNodes);
  nodes.push(...servicesNodes);
  cursor += STANDARD_SERVICES_SECTION_ROOT_HEIGHT;

  return { nodes, height: cursor - y };
}

export function getServicesPageRootHeight(locale: Locale): number {
  return buildServicesPage(0, locale, 0).height;
}

export function createServicesPageDecomposedNodes(y: number, locale: Locale, zBase: number): BuilderCanvasNode[] {
  return buildServicesPage(y, locale, zBase).nodes;
}
