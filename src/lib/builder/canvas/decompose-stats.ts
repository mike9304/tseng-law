import type { BuilderCanvasNode } from './types';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import {
  HOME_STAGE_WIDTH,
  createHomeContainerNode,
  createHomeTextNode,
} from './decompose-home-shared';

const STATS_ROOT_HEIGHT = 640;

export const STATS_SECTION_ROOT_HEIGHT = STATS_ROOT_HEIGHT;

export function createStatsDecomposedNodes(
  rootY: number,
  locale: Locale,
  zBase: number,
): BuilderCanvasNode[] {
  const stats = siteContent[locale].stats;
  const rootId = 'home-stats-root';
  const containerId = 'home-stats-container';
  const gridId = 'home-stats-grid';

  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y: rootY, width: HOME_STAGE_WIDTH, height: STATS_ROOT_HEIGHT },
      zIndex: zBase,
      label: 'home stats root',
      className: 'section section--light stats-section',
      as: 'section',
      htmlId: 'stats',
      dataTone: 'light',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: 72, y: 80, width: 1136, height: 480 },
      zIndex: 0,
      label: 'home stats container',
      className: 'container',
    }),
    createHomeTextNode({
      id: 'home-stats-label',
      parentId: containerId,
      rect: { x: 0, y: 0, width: 180, height: 28 },
      zIndex: 0,
      text: stats.label,
      className: 'section-label',
      as: 'div',
      fontWeight: 'medium',
    }),
    createHomeTextNode({
      id: 'home-stats-title',
      parentId: containerId,
      rect: { x: 0, y: 40, width: 560, height: 54 },
      zIndex: 1,
      text: stats.title,
      className: 'section-title',
      as: 'h2',
    }),
    createHomeTextNode({
      id: 'home-stats-description',
      parentId: containerId,
      rect: { x: 0, y: 106, width: 760, height: 64 },
      zIndex: 2,
      text: stats.description,
      className: 'section-lede',
      as: 'p',
    }),
    createHomeContainerNode({
      id: gridId,
      parentId: containerId,
      rect: { x: 0, y: 214, width: 1136, height: 200 },
      zIndex: 3,
      label: 'home stats grid',
      className: 'stats-grid reveal-stagger',
    }),
  ];

  stats.items.forEach((item, index) => {
    const cardId = `home-stats-card-${index}`;
    const progressId = `home-stats-progress-${index}`;
    const x = index * 287;

    nodes.push(
      createHomeContainerNode({
        id: cardId,
        parentId: gridId,
        rect: { x, y: 0, width: 266, height: 164 },
        zIndex: index,
        label: `home stats card ${index + 1}`,
        className: 'stat-card done',
        as: 'article',
      }),
      createHomeTextNode({
        id: `home-stats-number-${index}`,
        parentId: cardId,
        rect: { x: 16, y: 18, width: 180, height: 44 },
        zIndex: 0,
        text: `${item.target.toLocaleString()}${item.suffix ?? ''}`,
        className: 'stat-number',
        as: 'div',
        color: '#5b496f',
      }),
      createHomeTextNode({
        id: `home-stats-label-${index}`,
        parentId: cardId,
        rect: { x: 16, y: 76, width: 220, height: 46 },
        zIndex: 1,
        text: item.label,
        className: 'stat-label',
        as: 'p',
      }),
      createHomeContainerNode({
        id: progressId,
        parentId: cardId,
        rect: { x: 16, y: 132, width: 234, height: 1 },
        zIndex: 2,
        label: `home stats progress ${index + 1}`,
        className: 'stat-progress',
      }),
      createHomeTextNode({
        id: `home-stats-progress-bar-${index}`,
        parentId: progressId,
        rect: { x: 0, y: 0, width: 234, height: 1 },
        zIndex: 0,
        text: ' ',
        as: 'span',
      }),
    );
  });

  return nodes;
}
