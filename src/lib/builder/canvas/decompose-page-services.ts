import type { BuilderCanvasDocument, BuilderCanvasNode } from './types';
import type { Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import { createServicesDecomposedNodes } from './decompose-services';
import {
  PAGE_CONTAINER_WIDTH,
  PAGE_CONTAINER_X,
  createPageHeaderSectionNodes,
} from './decompose-page-shared';

const STANDARD_SERVICES_SECTION_ROOT_HEIGHT = 820;
const STANDARD_SERVICES_CONTAINER_Y = 72;
const STANDARD_SERVICES_CONTAINER_HEIGHT = 676;
const STANDARD_SERVICES_LIST_Y = 220;
const STANDARD_SERVICES_LIST_HEIGHT = 456;
const STANDARD_SERVICES_CARD_HEIGHT = 216;
const STANDARD_SERVICES_CARD_GAP = 24;
const STANDARD_SERVICES_CARD_WIDTH = (PAGE_CONTAINER_WIDTH - (STANDARD_SERVICES_CARD_GAP * 2)) / 3;

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

function setNodeClassName(
  nodesById: Map<string, BuilderCanvasNode>,
  nodeId: string,
  className: string,
): void {
  const node = nodesById.get(nodeId);
  if (!node || !('className' in node.content)) return;
  node.content = { ...node.content, className };
}

function staticCardRect(index: number): CanvasRect {
  return {
    x: (index % 3) * (STANDARD_SERVICES_CARD_WIDTH + STANDARD_SERVICES_CARD_GAP),
    y: Math.floor(index / 3) * (STANDARD_SERVICES_CARD_HEIGHT + STANDARD_SERVICES_CARD_GAP),
    width: STANDARD_SERVICES_CARD_WIDTH,
    height: STANDARD_SERVICES_CARD_HEIGHT,
  };
}

function isObsoleteAccordionNode(nodeId: string): boolean {
  return /^home-services-card-\d+-(?:toggle|chevron|checklist|columns(?:-list|-label)?|detail-\d+|column-\d+)$/.test(nodeId);
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
  setNodeRect(nodesById, 'home-services-divider', { x: 0, y: 178, width: PAGE_CONTAINER_WIDTH, height: 24 });
  setNodeRect(nodesById, 'home-services-divider-mark', { x: 562, y: 6, width: 54, height: 12 });
  setNodeRect(nodesById, 'home-services-list', {
    x: 0,
    y: STANDARD_SERVICES_LIST_Y,
    width: PAGE_CONTAINER_WIDTH,
    height: STANDARD_SERVICES_LIST_HEIGHT,
  });
  setNodeClassName(nodesById, 'home-services-list', 'services-detail-list services-card-grid');

  for (let index = 0; index < 6; index += 1) {
    const cardId = `home-services-card-${index}`;
    setNodeRect(nodesById, cardId, staticCardRect(index));
    setNodeClassName(nodesById, cardId, 'services-detail-card services-card');
    setNodeRect(nodesById, `${cardId}-header`, {
      x: 24,
      y: 24,
      width: STANDARD_SERVICES_CARD_WIDTH - 48,
      height: 52,
    });
    setNodeClassName(nodesById, `${cardId}-header`, 'services-detail-header services-card-header');
    setNodeRect(nodesById, `${cardId}-title`, {
      x: 62,
      y: 4,
      width: STANDARD_SERVICES_CARD_WIDTH - 110,
      height: 48,
    });
    setNodeRect(nodesById, `${cardId}-body`, {
      x: 24,
      y: 92,
      width: STANDARD_SERVICES_CARD_WIDTH - 48,
      height: 104,
    });
    setNodeClassName(nodesById, `${cardId}-body`, 'services-detail-body services-card-body');
    setNodeRect(nodesById, `${cardId}-description`, {
      x: 0,
      y: 0,
      width: STANDARD_SERVICES_CARD_WIDTH - 48,
      height: 58,
    });
    setNodeClassName(nodesById, `${cardId}-description`, 'services-detail-desc services-card-summary');
    setNodeRect(nodesById, `${cardId}-more`, { x: 0, y: 70, width: 170, height: 30 });
    setNodeClassName(nodesById, `${cardId}-more`, 'services-detail-more services-card-link');
  }
}

export function upgradeStandardServicesPageDesktopParity(
  document: BuilderCanvasDocument,
  options: { allowGeometryReset: boolean },
): BuilderCanvasDocument {
  if (!isStandardServicesPageDocument(document)) return document;

  const nextNodes: BuilderCanvasNode[] = document.nodes
    .filter((node) => !isObsoleteAccordionNode(node.id))
    .map((node) => ({
      ...node,
      rect: { ...node.rect },
    }));
  applyStandardServicesPageLayout(nextNodes);
  const rootY = document.nodes.find((node) => node.id === 'home-services-root')?.rect.y ?? 0;
  const canonicalNodes = createServicesDecomposedNodes(rootY, document.locale, 0);
  applyStandardServicesPageLayout(canonicalNodes);
  const canonicalById = new Map(canonicalNodes.map((node) => [node.id, node]));
  nextNodes.forEach((node) => {
    const canonical = canonicalById.get(node.id);
    if (canonical?.responsive) node.responsive = canonical.responsive;
  });

  const nextStageHeight = getServicesPageRootHeight(document.locale);
  const originalNodesById = new Map(document.nodes.map((node) => [node.id, node]));
  const changed = nextStageHeight !== document.stageHeight
    || nextNodes.length !== document.nodes.length
    || nextNodes.some((node) => {
      const original = originalNodesById.get(node.id);
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
