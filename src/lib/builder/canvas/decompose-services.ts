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

const SERVICES_CONTAINER_Y = 88;
const SERVICES_LIST_Y = 236;
const SERVICES_DETAIL_BODY_Y = 82;
const SERVICES_DETAIL_CHECKLIST_Y = 52;
const SERVICES_DETAIL_CHECKLIST_HEIGHT = 88;
const SERVICES_DETAIL_MORE_Y = 100;
const SERVICES_DETAIL_MORE_HEIGHT = 36;
const SERVICES_CARD_HEIGHT = 98;
const SERVICES_CARD_PITCH = 130;
const SERVICES_ITEM_COUNT = 6;
const SERVICES_LIST_BOTTOM_PADDING = 40;
const SERVICES_LIST_HEIGHT =
  ((SERVICES_ITEM_COUNT - 1) * SERVICES_CARD_PITCH) +
  SERVICES_DETAIL_BODY_Y +
  Math.max(
    SERVICES_DETAIL_CHECKLIST_Y + SERVICES_DETAIL_CHECKLIST_HEIGHT,
    SERVICES_DETAIL_MORE_Y + SERVICES_DETAIL_MORE_HEIGHT,
  ) +
  SERVICES_LIST_BOTTOM_PADDING;
// Desktop live-parity: trim the (invisible, collapsed-state) reserved space below
// the services list so the section flows to the live /ko/services desktop height.
// The list still fully contains the last card's expandable checklist/more (list-
// relative bottom 872 <= SERVICES_LIST_HEIGHT 912), so only empty bottom padding
// shrinks. Recovers the +44px the body over-reserved vs live CSS flow.
const SERVICES_CONTAINER_BOTTOM_PADDING = 10;
const SERVICES_CONTAINER_HEIGHT = SERVICES_LIST_Y + SERVICES_LIST_HEIGHT + SERVICES_CONTAINER_BOTTOM_PADDING;
const SERVICES_ROOT_HEIGHT = SERVICES_CONTAINER_Y + SERVICES_CONTAINER_HEIGHT;
const RELATED_COLUMN_LINK_WIDTH = 220;
const RELATED_COLUMN_LINK_GAP_X = 24;
const RELATED_COLUMN_LINK_ROW_HEIGHT = 34;
const RELATED_COLUMN_LINKS_PER_ROW = 4;
const COLLAPSED_RESPONSIVE_RECT_SIZE = 1;

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

function applyCollapsedServicesResponsiveLayout(nodes: BuilderCanvasNode[]): void {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  setResponsiveRect(nodesById.get('home-services-root'), 'mobile', { height: 1285 });
  setResponsiveRect(nodesById.get('home-services-container'), 'mobile', { x: 34, y: 49, width: 308, height: 1187 });
  setResponsiveRect(nodesById.get('home-services-label'), 'mobile', { x: 0, y: 8, width: 132, height: 21 });
  setResponsiveRect(nodesById.get('home-services-title'), 'mobile', { x: 0, y: 47, width: 308, height: 96 });
  setResponsiveRect(nodesById.get('home-services-description'), 'mobile', { x: 0, y: 162, width: 308, height: 54 });
  setResponsiveRect(nodesById.get('home-services-divider'), 'mobile', { x: 0, y: 226, width: 308, height: 12 });
  setResponsiveRect(nodesById.get('home-services-divider-mark'), 'mobile', { x: 127, y: 0, width: 54, height: 12 });
  setResponsiveRect(nodesById.get('home-services-list'), 'mobile', { x: 0, y: 244, width: 308, height: 942 });

  setResponsiveRect(nodesById.get('home-services-root'), 'tablet', { height: 1166 });
  setResponsiveRect(nodesById.get('home-services-container'), 'tablet', { x: 31, y: 92, width: 675, height: 980 });
  setResponsiveRect(nodesById.get('home-services-label'), 'tablet', { x: 0, y: 8, width: 132, height: 21 });
  setResponsiveRect(nodesById.get('home-services-title'), 'tablet', { x: 0, y: 47, width: 675, height: 60 });
  setResponsiveRect(nodesById.get('home-services-description'), 'tablet', { x: 0, y: 126, width: 675, height: 27 });
  setResponsiveRect(nodesById.get('home-services-divider'), 'tablet', { x: 0, y: 185, width: 675, height: 12 });
  setResponsiveRect(nodesById.get('home-services-divider-mark'), 'tablet', { x: 310, y: 0, width: 54, height: 12 });
  setResponsiveRect(nodesById.get('home-services-list'), 'tablet', { x: 0, y: 229, width: 675, height: 750 });

  for (const node of nodesById.values()) {
    const aliasMatch = /^home-services-card-(\d+)-alias-\d+$/.exec(node.id);
    if (aliasMatch) {
      const index = Number(aliasMatch[1]);
      setResponsiveRect(node, 'mobile', { x: 0, y: Math.max(0, index * 162 - 72), width: 4, height: 4 });
      setResponsiveRect(node, 'tablet', { x: 0, y: Math.max(0, index * 130 - 72), width: 4, height: 4 });
      continue;
    }

    const cardMatch = /^home-services-card-(\d+)$/.exec(node.id);
    if (cardMatch) {
      const index = Number(cardMatch[1]);
      setResponsiveRect(node, 'mobile', { x: 0, y: index * 162, width: 308, height: 130 });
      setResponsiveRect(node, 'tablet', { x: 0, y: index * 130, width: 675, height: 98 });
      continue;
    }

    if (/^home-services-card-\d+-toggle$/.test(node.id)) {
      setResponsiveRect(node, 'mobile', { x: 0, y: 0, width: 308, height: 130 });
      setResponsiveRect(node, 'tablet', { x: 0, y: 0, width: 675, height: 98 });
      continue;
    }

    if (/^home-services-card-\d+-header$/.test(node.id)) {
      setResponsiveRect(node, 'mobile', { x: 24, y: 20, width: 240, height: 90 });
      setResponsiveRect(node, 'tablet', { x: 24, y: 20, width: 560, height: 56 });
      continue;
    }

    if (/^home-services-card-\d+-icon$/.test(node.id)) {
      setResponsiveRect(node, 'mobile', { x: 0, y: 0, width: 46, height: 46 });
      setResponsiveRect(node, 'tablet', { x: 0, y: 0, width: 46, height: 46 });
      continue;
    }

    if (/^home-services-card-\d+-icon-svg$/.test(node.id)) {
      setResponsiveRect(node, 'mobile', { x: 11, y: 11, width: 24, height: 24 });
      setResponsiveRect(node, 'tablet', { x: 11, y: 11, width: 24, height: 24 });
      continue;
    }

    if (/^home-services-card-\d+-title$/.test(node.id)) {
      setResponsiveRect(node, 'mobile', { x: 58, y: 4, width: 206, height: 52 });
      setResponsiveRect(node, 'tablet', { x: 58, y: 16, width: 520, height: 25 });
      continue;
    }

    if (/^home-services-card-\d+-chevron$/.test(node.id)) {
      setResponsiveRect(node, 'mobile', { x: 272, y: 33, width: 20, height: 29 });
      setResponsiveRect(node, 'tablet', { x: 629, y: 33, width: 20, height: 29 });
      continue;
    }

    if (/^home-services-card-\d+-body$/.test(node.id)) {
      setResponsiveRect(node, 'mobile', { x: 0, y: 97, width: 308, height: COLLAPSED_RESPONSIVE_RECT_SIZE });
      setResponsiveRect(node, 'tablet', { x: 0, y: 97, width: 675, height: COLLAPSED_RESPONSIVE_RECT_SIZE });
      continue;
    }

    if (/^home-services-card-\d+-description$/.test(node.id)) {
      setResponsiveRect(node, 'mobile', { x: 24, y: 0, width: 260, height: 54 });
      setResponsiveRect(node, 'tablet', { x: 24, y: 0, width: 625, height: 82 });
      continue;
    }

    if (/^home-services-card-\d+-(?:checklist|columns|columns-list|detail-\d+|column-\d+|columns-label)$/.test(node.id)) {
      const rect = { x: 24, y: 0, width: COLLAPSED_RESPONSIVE_RECT_SIZE, height: COLLAPSED_RESPONSIVE_RECT_SIZE };
      setResponsiveRect(node, 'mobile', rect);
      setResponsiveRect(node, 'tablet', rect);
    }
  }
}

function serviceIconSvgName(index: number): ServiceIconSvgName {
  const clamped = Math.max(0, Math.min(5, index));
  return SERVICE_ICON_SVG_NAMES[clamped] ?? 'service-0';
}

export function createServicesDecomposedNodes(
  rootY: number,
  locale: Locale,
  zBase: number,
): BuilderCanvasNode[] {
  const { services } = siteContent[locale];
  const serviceSlugs = getServiceSlugs();
  const relatedLabel = locale === 'ko' ? '관련 칼럼' : locale === 'zh-hant' ? '相關專欄' : 'Related Columns';
  const detailLabel = locale === 'ko' ? '자세히 보기 →' : locale === 'zh-hant' ? '查看詳情 →' : 'View details →';
  const rootId = 'home-services-root';
  const containerId = 'home-services-container';
  const dividerId = 'home-services-divider';
  const listId = 'home-services-list';

  const anchorToIndex = new Map<string, number>();
  services.items.forEach((item, index) => {
    const anchor = item.href.split('#')[1];
    if (anchor) anchorToIndex.set(anchor, index);
  });
  const aliasAnchors = new Map<number, string[]>();
  const civilIndex = anchorToIndex.get('civil');
  if (civilIndex != null) aliasAnchors.set(civilIndex, ['real-estate']);
  const ipIndex = anchorToIndex.get('ip');
  if (ipIndex != null) aliasAnchors.set(ipIndex, ['finance']);

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
      rect: { x: 0, y: 182, width: 1136, height: 24 },
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
      label: 'home services detail list',
      className: 'services-detail-list',
    }),
  ];

  services.items.forEach((item, index) => {
    const anchor = item.href.split('#')[1];
    const aliases = aliasAnchors.get(index) ?? [];
    const cardId = `home-services-card-${index}`;
    const toggleId = `${cardId}-toggle`;
    const headerId = `${cardId}-header`;
    const bodyId = `${cardId}-body`;
    const columnsId = `${cardId}-columns`;
    const columnsListId = `${columnsId}-list`;
    const cardY = index * SERVICES_CARD_PITCH;

    aliases.forEach((alias, aliasIndex) => {
      nodes.push(
        createHomeContainerNode({
          id: `${cardId}-alias-${aliasIndex}`,
          parentId: listId,
          rect: { x: 0, y: Math.max(0, cardY - 96), width: 4, height: 4 },
          zIndex: index,
          label: `home services alias ${alias}`,
          className: 'services-anchor-alias',
          as: 'div',
          htmlId: alias,
        }),
      );
    });

    nodes.push(
      createHomeContainerNode({
        id: cardId,
        parentId: listId,
        rect: { x: 0, y: cardY, width: 1136, height: SERVICES_CARD_HEIGHT },
        zIndex: index,
        label: `home services card ${index + 1}`,
        className: 'services-detail-card',
        as: 'article',
        ...(anchor ? { htmlId: anchor } : {}),
      }),
      createHomeContainerNode({
        id: toggleId,
        parentId: cardId,
        rect: { x: 0, y: 0, width: 1136, height: 82 },
        zIndex: 0,
        label: `home services toggle ${index + 1}`,
        className: 'services-detail-toggle',
      }),
      createHomeContainerNode({
        id: headerId,
        parentId: toggleId,
        rect: { x: 24, y: 18, width: 900, height: 46 },
        zIndex: 0,
        label: `home services header ${index + 1}`,
        className: 'services-detail-header',
      }),
      createHomeContainerNode({
        id: `${cardId}-icon`,
        parentId: headerId,
        rect: { x: 0, y: 0, width: 46, height: 46 },
        zIndex: 0,
        label: `home services icon ${index + 1}`,
        className: 'service-icon',
        as: 'div',
      }),
      createHomeImageNode({
        id: `${cardId}-icon-svg`,
        parentId: `${cardId}-icon`,
        rect: { x: 11, y: 11, width: 24, height: 24 },
        zIndex: 0,
        src: INLINE_SVG_PLACEHOLDER_SRC,
        alt: item.title,
        fit: 'contain',
        svg: {
          enabled: true,
          name: serviceIconSvgName(index),
          color: 'currentColor',
        },
      }),
      createHomeTextNode({
        id: `${cardId}-title`,
        parentId: headerId,
        rect: { x: 62, y: 8, width: 760, height: 30 },
        zIndex: 1,
        text: item.title,
        className: 'services-detail-title',
        as: 'h3',
        fontWeight: 'bold',
      }),
      createHomeTextNode({
        id: `${cardId}-chevron`,
        parentId: toggleId,
        rect: { x: 1088, y: 28, width: 20, height: 20 },
        zIndex: 1,
        text: '⌄',
        className: 'services-detail-chevron',
        as: 'span',
      }),
      createHomeContainerNode({
        id: bodyId,
        parentId: cardId,
        rect: { x: 0, y: SERVICES_DETAIL_BODY_Y, width: 1136, height: 40 },
        zIndex: 2,
        label: `home services body ${index + 1}`,
        className: 'services-detail-body',
      }),
      createHomeTextNode({
        id: `${cardId}-description`,
        parentId: bodyId,
        rect: { x: 24, y: 0, width: 980, height: 40 },
        zIndex: 0,
        text: item.description,
        className: 'services-detail-desc',
        as: 'p',
      }),
    );

    if (item.details && item.details.length > 0) {
      const checklistId = `${cardId}-checklist`;
      nodes.push(
        createHomeContainerNode({
          id: checklistId,
          parentId: bodyId,
          rect: { x: 24, y: SERVICES_DETAIL_CHECKLIST_Y, width: 980, height: SERVICES_DETAIL_CHECKLIST_HEIGHT },
          zIndex: 1,
          label: `home services checklist ${index + 1}`,
          className: 'services-detail-checklist',
        }),
      );
      item.details.forEach((detail, detailIndex) => {
        const column = detailIndex % 2;
        const row = Math.floor(detailIndex / 2);
        nodes.push(
          createHomeTextNode({
            id: `${cardId}-detail-${detailIndex}`,
            parentId: checklistId,
            rect: { x: column * 480, y: row * 28, width: 440, height: 24 },
            zIndex: detailIndex,
            text: `✓ ${detail}`,
            as: 'div',
          }),
        );
      });
    }

    if (item.relatedColumns && item.relatedColumns.length > 0) {
      nodes.push(
        createHomeContainerNode({
          id: columnsId,
          parentId: bodyId,
          rect: { x: 24, y: 148, width: 980, height: 88 },
          zIndex: 2,
          label: `home services columns ${index + 1}`,
          className: 'services-detail-columns',
        }),
        createHomeTextNode({
          id: `${cardId}-columns-label`,
          parentId: columnsId,
          rect: { x: 0, y: 0, width: 180, height: 18 },
          zIndex: 0,
          text: relatedLabel,
          className: 'services-detail-columns-label',
          as: 'span',
          fontWeight: 'bold',
        }),
        createHomeContainerNode({
          id: columnsListId,
          parentId: columnsId,
          rect: { x: 0, y: 28, width: 980, height: 34 },
          zIndex: 1,
          label: `home services columns list ${index + 1}`,
          className: 'services-detail-columns-list',
        }),
      );
      item.relatedColumns.forEach((column, columnIndex) => {
        const columnX = (columnIndex % RELATED_COLUMN_LINKS_PER_ROW) *
          (RELATED_COLUMN_LINK_WIDTH + RELATED_COLUMN_LINK_GAP_X);
        const columnY = Math.floor(columnIndex / RELATED_COLUMN_LINKS_PER_ROW) *
          RELATED_COLUMN_LINK_ROW_HEIGHT;
        nodes.push(
          createHomeButtonNode({
            id: `${cardId}-column-${columnIndex}`,
            parentId: columnsListId,
            rect: { x: columnX, y: columnY, width: RELATED_COLUMN_LINK_WIDTH, height: 28 },
            zIndex: columnIndex,
            label: column.title,
            href: `/${locale}/columns/${column.slug}`,
            style: 'secondary',
            className: 'services-column-link',
            as: 'a',
          }),
        );
      });
    }

    if (serviceSlugs[index]) {
      nodes.push(
        createHomeButtonNode({
          id: `${cardId}-more`,
          parentId: bodyId,
          rect: { x: 24, y: SERVICES_DETAIL_MORE_Y, width: 160, height: SERVICES_DETAIL_MORE_HEIGHT },
          zIndex: 3,
          label: detailLabel,
          href: `/${locale}/services/${serviceSlugs[index]}`,
          style: 'primary',
          className: 'services-detail-more',
          as: 'a',
        }),
      );
    }
  });

  applyCollapsedServicesResponsiveLayout(nodes);
  return nodes;
}
