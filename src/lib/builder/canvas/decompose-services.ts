import type { BuilderCanvasNode } from './types';
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

const SERVICES_ROOT_HEIGHT = 1400;
const RELATED_COLUMN_LINK_WIDTH = 220;
const RELATED_COLUMN_LINK_GAP_X = 24;
const RELATED_COLUMN_LINK_ROW_HEIGHT = 34;
const RELATED_COLUMN_LINKS_PER_ROW = 4;

export const SERVICES_SECTION_ROOT_HEIGHT = SERVICES_ROOT_HEIGHT;

function serviceIconSrc(index: number): string {
  const clamped = Math.max(0, Math.min(5, index));
  return `/images/home-services/icon-${clamped}.svg`;
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
      className: 'section section--gray alt',
      as: 'section',
      dataTone: 'light',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: 72, y: 88, width: 1136, height: 1240 },
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
      rect: { x: 0, y: 236, width: 1136, height: 980 },
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
    const cardY = index * 156;

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
        rect: { x: 0, y: cardY, width: 1136, height: 132 },
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
        src: serviceIconSrc(index),
        alt: item.title,
        fit: 'contain',
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
        rect: { x: 0, y: 82, width: 1136, height: 40 },
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
          rect: { x: 24, y: 52, width: 980, height: 88 },
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
          rect: { x: 24, y: 246, width: 160, height: 36 },
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

  return nodes;
}
