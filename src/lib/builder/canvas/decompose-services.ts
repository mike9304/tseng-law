import type { BuilderCanvasNode, BuilderImageCanvasNode } from './types';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import {
  HOME_STAGE_WIDTH,
  createHomeButtonNode,
  createHomeContainerNode,
  createHomeImageNode,
  createHomeTextNode,
} from './decompose-home-shared';

const SERVICES_CONTAINER_Y = 72;
const SERVICES_LIST_Y = 220;
const DESKTOP_CARD_WIDTH = 362;
const DESKTOP_CARD_HEIGHT = 216;
const DESKTOP_CARD_GAP = 24;
const SERVICES_LIST_HEIGHT = DESKTOP_CARD_HEIGHT * 2 + DESKTOP_CARD_GAP;
const SERVICES_CONTAINER_HEIGHT = SERVICES_LIST_Y + SERVICES_LIST_HEIGHT;
const SERVICES_ROOT_HEIGHT = SERVICES_CONTAINER_Y + SERVICES_CONTAINER_HEIGHT + 72;

export const SERVICES_SECTION_ROOT_HEIGHT = SERVICES_ROOT_HEIGHT;

const INLINE_SVG_PLACEHOLDER_SRC = '/images/placeholder-image.svg';
const SERVICE_ICON_SVG_NAMES = [
  'service-0',
  'service-1',
  'service-2',
  'service-3',
  'service-4',
  'service-5',
] as const satisfies readonly NonNullable<BuilderImageCanvasNode['content']['svg']>['name'][];

type ServiceIconSvgName = (typeof SERVICE_ICON_SVG_NAMES)[number];
type ResponsiveViewport = 'mobile' | 'tablet';
type CanvasRect = BuilderCanvasNode['rect'];

function setResponsiveRect(
  node: BuilderCanvasNode | undefined,
  viewport: ResponsiveViewport,
  rect: Partial<CanvasRect>,
): void {
  if (!node) return;
  const existing = node.responsive ?? {};
  const existingOverride = existing[viewport] ?? {};
  node.responsive = {
    ...existing,
    [viewport]: {
      ...existingOverride,
      rect: {
        ...(existingOverride.rect ?? {}),
        ...rect,
      },
    },
  };
}

function serviceIconSvgName(index: number): ServiceIconSvgName {
  const clamped = Math.max(0, Math.min(5, index));
  return SERVICE_ICON_SVG_NAMES[clamped] ?? 'service-0';
}

function cardRect(index: number, columns: number, cardWidth: number, cardHeight: number, gap: number) {
  return {
    x: (index % columns) * (cardWidth + gap),
    y: Math.floor(index / columns) * (cardHeight + gap),
    width: cardWidth,
    height: cardHeight,
  };
}

function compactServiceSummary(description: string, maxLength = 120): string {
  const text = description.replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  const candidate = text.slice(0, maxLength + 1);
  const boundary = Math.max(
    candidate.lastIndexOf(' '),
    candidate.lastIndexOf(','),
    candidate.lastIndexOf('，'),
    candidate.lastIndexOf('、'),
  );
  const end = boundary >= Math.floor(maxLength * 0.7) ? boundary : maxLength;
  return `${text.slice(0, end).trimEnd()}…`;
}

function applyResponsiveServicesLayout(nodes: BuilderCanvasNode[]): void {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  setResponsiveRect(nodesById.get('home-services-root'), 'tablet', { height: 1000 });
  setResponsiveRect(nodesById.get('home-services-container'), 'tablet', {
    x: 31, y: 70, width: 675, height: 860,
  });
  setResponsiveRect(nodesById.get('home-services-label'), 'tablet', { x: 0, y: 0, width: 160, height: 28 });
  setResponsiveRect(nodesById.get('home-services-title'), 'tablet', { x: 0, y: 40, width: 675, height: 60 });
  setResponsiveRect(nodesById.get('home-services-description'), 'tablet', { x: 0, y: 112, width: 675, height: 54 });
  setResponsiveRect(nodesById.get('home-services-divider'), 'tablet', { x: 0, y: 180, width: 675, height: 24 });
  setResponsiveRect(nodesById.get('home-services-divider-mark'), 'tablet', { x: 310, y: 6, width: 54, height: 12 });
  setResponsiveRect(nodesById.get('home-services-list'), 'tablet', { x: 0, y: 230, width: 675, height: 630 });

  setResponsiveRect(nodesById.get('home-services-root'), 'mobile', { height: 1645 });
  setResponsiveRect(nodesById.get('home-services-container'), 'mobile', {
    x: 34, y: 48, width: 308, height: 1549,
  });
  setResponsiveRect(nodesById.get('home-services-label'), 'mobile', { x: 0, y: 0, width: 132, height: 24 });
  setResponsiveRect(nodesById.get('home-services-title'), 'mobile', { x: 0, y: 40, width: 308, height: 96 });
  setResponsiveRect(nodesById.get('home-services-description'), 'mobile', { x: 0, y: 150, width: 308, height: 54 });
  setResponsiveRect(nodesById.get('home-services-divider'), 'mobile', { x: 0, y: 218, width: 308, height: 24 });
  setResponsiveRect(nodesById.get('home-services-divider-mark'), 'mobile', { x: 127, y: 6, width: 54, height: 12 });
  setResponsiveRect(nodesById.get('home-services-list'), 'mobile', { x: 0, y: 250, width: 308, height: 1299 });

  for (let index = 0; index < 6; index += 1) {
    const tabletCard = cardRect(index, 2, 325.5, 194, 24);
    const mobileCard = cardRect(index, 1, 308, 199, 21);
    const cardId = `home-services-card-${index}`;

    setResponsiveRect(nodesById.get(cardId), 'tablet', tabletCard);
    setResponsiveRect(nodesById.get(cardId), 'mobile', mobileCard);
    setResponsiveRect(nodesById.get(`${cardId}-header`), 'tablet', { x: 20, y: 20, width: 285.5, height: 52 });
    setResponsiveRect(nodesById.get(`${cardId}-header`), 'mobile', { x: 20, y: 20, width: 268, height: 52 });
    setResponsiveRect(nodesById.get(`${cardId}-icon`), 'tablet', { x: 0, y: 0, width: 46, height: 46 });
    setResponsiveRect(nodesById.get(`${cardId}-icon`), 'mobile', { x: 0, y: 0, width: 46, height: 46 });
    setResponsiveRect(nodesById.get(`${cardId}-icon-svg`), 'tablet', { x: 11, y: 11, width: 24, height: 24 });
    setResponsiveRect(nodesById.get(`${cardId}-icon-svg`), 'mobile', { x: 11, y: 11, width: 24, height: 24 });
    setResponsiveRect(nodesById.get(`${cardId}-title`), 'tablet', { x: 58, y: 4, width: 227.5, height: 48 });
    setResponsiveRect(nodesById.get(`${cardId}-title`), 'mobile', { x: 58, y: 4, width: 210, height: 48 });
    setResponsiveRect(nodesById.get(`${cardId}-body`), 'tablet', { x: 20, y: 84, width: 285.5, height: 90 });
    setResponsiveRect(nodesById.get(`${cardId}-body`), 'mobile', { x: 20, y: 84, width: 268, height: 95 });
    setResponsiveRect(nodesById.get(`${cardId}-description`), 'tablet', { x: 0, y: 0, width: 285.5, height: 54 });
    setResponsiveRect(nodesById.get(`${cardId}-description`), 'mobile', { x: 0, y: 0, width: 268, height: 58 });
    setResponsiveRect(nodesById.get(`${cardId}-more`), 'tablet', { x: 0, y: 64, width: 170, height: 28 });
    setResponsiveRect(nodesById.get(`${cardId}-more`), 'mobile', { x: 0, y: 67, width: 170, height: 28 });

    for (const node of nodes) {
      if (!node.id.startsWith(`${cardId}-alias-`)) continue;
      setResponsiveRect(node, 'tablet', { x: tabletCard.x, y: Math.max(0, tabletCard.y - 72), width: 4, height: 4 });
      setResponsiveRect(node, 'mobile', { x: mobileCard.x, y: Math.max(0, mobileCard.y - 72), width: 4, height: 4 });
    }
  }
}

export function createServicesDecomposedNodes(
  rootY: number,
  locale: Locale,
  zBase: number,
): BuilderCanvasNode[] {
  const { services } = siteContent[locale];
  const serviceSlugs = getServiceSlugs();
  const detailLabel = locale === 'ko'
    ? '자세히 보기 →'
    : locale === 'zh-hant'
      ? '查看詳情 →'
      : 'View details →';
  const rootId = 'home-services-root';
  const containerId = 'home-services-container';
  const dividerId = 'home-services-divider';
  const listId = 'home-services-list';

  const aliasAnchors = new Map<number, string[]>();
  services.items.forEach((item, index) => {
    const anchor = item.href.split('#')[1];
    if (anchor === 'civil') aliasAnchors.set(index, ['real-estate']);
    if (anchor === 'ip') aliasAnchors.set(index, ['finance']);
  });

  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y: rootY, width: HOME_STAGE_WIDTH, height: SERVICES_ROOT_HEIGHT },
      zIndex: zBase,
      label: 'home services root',
      className: 'section section--light',
      as: 'section',
      htmlId: 'practice',
      dataTone: 'light',
      variant: 'flat',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: 72, y: SERVICES_CONTAINER_Y, width: 1136, height: SERVICES_CONTAINER_HEIGHT },
      zIndex: 0,
      label: 'home services container',
      className: 'container',
    }),
    createHomeTextNode({
      id: 'home-services-label',
      parentId: containerId,
      rect: { x: 0, y: 0, width: 200, height: 28 },
      zIndex: 0,
      text: services.label,
      className: 'section-label',
      as: 'div',
      fontWeight: 'medium',
    }),
    createHomeTextNode({
      id: 'home-services-title',
      parentId: containerId,
      rect: { x: 0, y: 40, width: 620, height: 56 },
      zIndex: 1,
      text: services.title,
      className: 'section-title',
      as: 'h2',
    }),
    createHomeTextNode({
      id: 'home-services-description',
      parentId: containerId,
      rect: { x: 0, y: 104, width: 760, height: 60 },
      zIndex: 2,
      text: services.description,
      className: 'section-lede',
      as: 'p',
    }),
    createHomeContainerNode({
      id: dividerId,
      parentId: containerId,
      rect: { x: 0, y: 178, width: 1136, height: 24 },
      zIndex: 3,
      label: 'home services divider',
      className: 'ornament-divider',
    }),
    createHomeContainerNode({
      id: 'home-services-divider-mark',
      parentId: dividerId,
      rect: { x: 541, y: 6, width: 54, height: 12 },
      zIndex: 0,
      label: 'home services divider mark',
      className: 'ornament',
    }),
    createHomeContainerNode({
      id: listId,
      parentId: containerId,
      rect: { x: 0, y: SERVICES_LIST_Y, width: 1136, height: SERVICES_LIST_HEIGHT },
      zIndex: 4,
      label: 'home services card grid',
      className: 'services-detail-list services-card-grid',
    }),
  ];

  services.items.forEach((item, index) => {
    const anchor = item.href.split('#')[1];
    const cardId = `home-services-card-${index}`;
    const desktopCard = cardRect(index, 3, DESKTOP_CARD_WIDTH, DESKTOP_CARD_HEIGHT, DESKTOP_CARD_GAP);

    for (const [aliasIndex, alias] of (aliasAnchors.get(index) ?? []).entries()) {
      nodes.push(createHomeContainerNode({
        id: `${cardId}-alias-${aliasIndex}`,
        parentId: listId,
        rect: { x: desktopCard.x, y: Math.max(0, desktopCard.y - 72), width: 4, height: 4 },
        zIndex: index,
        label: `home services alias ${alias}`,
        className: 'services-anchor-alias',
        htmlId: alias,
      }));
    }

    nodes.push(
      createHomeContainerNode({
        id: cardId,
        parentId: listId,
        rect: desktopCard,
        zIndex: index,
        label: `home services card ${index + 1}`,
        className: 'services-detail-card services-card',
        as: 'article',
        ...(anchor ? { htmlId: anchor } : {}),
      }),
      createHomeContainerNode({
        id: `${cardId}-header`,
        parentId: cardId,
        rect: { x: 24, y: 24, width: DESKTOP_CARD_WIDTH - 48, height: 52 },
        zIndex: 0,
        label: `home services header ${index + 1}`,
        className: 'services-detail-header services-card-header',
      }),
      createHomeContainerNode({
        id: `${cardId}-icon`,
        parentId: `${cardId}-header`,
        rect: { x: 0, y: 0, width: 46, height: 46 },
        zIndex: 0,
        label: `home services icon ${index + 1}`,
        className: 'service-icon',
      }),
      createHomeImageNode({
        id: `${cardId}-icon-svg`,
        parentId: `${cardId}-icon`,
        rect: { x: 11, y: 11, width: 24, height: 24 },
        zIndex: 0,
        src: INLINE_SVG_PLACEHOLDER_SRC,
        alt: item.title,
        fit: 'contain',
        svg: { enabled: true, name: serviceIconSvgName(index), color: 'currentColor' },
      }),
      createHomeTextNode({
        id: `${cardId}-title`,
        parentId: `${cardId}-header`,
        rect: { x: 62, y: 4, width: DESKTOP_CARD_WIDTH - 110, height: 48 },
        zIndex: 1,
        text: item.title,
        className: 'services-detail-title',
        as: 'h3',
        fontWeight: 'bold',
        lineHeight: 1.35,
      }),
      createHomeContainerNode({
        id: `${cardId}-body`,
        parentId: cardId,
        rect: { x: 24, y: 92, width: DESKTOP_CARD_WIDTH - 48, height: 104 },
        zIndex: 1,
        label: `home services body ${index + 1}`,
        className: 'services-detail-body services-card-body',
      }),
      createHomeTextNode({
        id: `${cardId}-description`,
        parentId: `${cardId}-body`,
        rect: { x: 0, y: 0, width: DESKTOP_CARD_WIDTH - 48, height: 58 },
        zIndex: 0,
        text: compactServiceSummary(item.description),
        className: 'services-detail-desc services-card-summary',
        as: 'p',
        fontSize: 15,
        lineHeight: 1.55,
      }),
    );

    if (serviceSlugs[index]) {
      nodes.push(createHomeButtonNode({
        id: `${cardId}-more`,
        parentId: `${cardId}-body`,
        rect: { x: 0, y: 70, width: 170, height: 30 },
        zIndex: 1,
        label: detailLabel,
        href: `/${locale}/services/${serviceSlugs[index]}`,
        style: 'link',
        className: 'services-detail-more services-card-link',
      }));
    }
  });

  applyResponsiveServicesLayout(nodes);
  return nodes;
}
