import { createDefaultCanvasNodeStyle, type BuilderCanvasNode } from './types';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import {
  HOME_STAGE_WIDTH,
  createHomeContainerNode,
  createHomeTextNode,
} from './decompose-home-shared';

const STATS_ROOT_HEIGHT = 560;

export const STATS_SECTION_ROOT_HEIGHT = STATS_ROOT_HEIGHT;

export function createStatsDecomposedNodes(
  rootY: number,
  locale: Locale,
  zBase: number,
): BuilderCanvasNode[] {
  const stats = siteContent[locale].stats;
  const useLocalizedZhHantLayout = locale === 'zh-hant';
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
      rect: {
        x: useLocalizedZhHantLayout ? 51 : 72,
        y: 64,
        width: useLocalizedZhHantLayout ? 1178 : 1136,
        height: 432,
      },
      zIndex: 0,
      label: 'home stats container',
      className: 'container',
    }),
    createHomeTextNode({
      id: 'home-stats-label',
      parentId: containerId,
      rect: { x: 0, y: useLocalizedZhHantLayout ? 30 : 0, width: 180, height: 28 },
      zIndex: 0,
      text: stats.label,
      className: 'section-label',
      as: 'div',
      fontWeight: 'medium',
    }),
    createHomeTextNode({
      id: 'home-stats-title',
      parentId: containerId,
      rect: { x: 0, y: useLocalizedZhHantLayout ? 109 : 40, width: useLocalizedZhHantLayout ? 1178 : 560, height: 54 },
      zIndex: 1,
      text: stats.title,
      className: 'section-title',
      as: 'h2',
    }),
    createHomeTextNode({
      id: 'home-stats-description',
      parentId: containerId,
      rect: {
        x: 0,
        y: useLocalizedZhHantLayout ? 201 : 106,
        width: useLocalizedZhHantLayout ? 720 : 760,
        height: useLocalizedZhHantLayout ? 72 : 64,
      },
      zIndex: 2,
      text: stats.description,
      className: 'section-lede',
      as: 'p',
    }),
    createHomeContainerNode({
      id: gridId,
      parentId: containerId,
      rect: {
        x: 0,
        y: useLocalizedZhHantLayout ? 228 : 200,
        width: useLocalizedZhHantLayout ? 1178 : 1136,
        height: useLocalizedZhHantLayout ? 126 : 164,
      },
      zIndex: 3,
      label: 'home stats grid',
      className: 'stats-grid reveal-stagger',
    }),
  ];

  stats.items.forEach((item, index) => {
    const cardId = `home-stats-card-${index}`;
    const progressId = `home-stats-progress-${index}`;
    const cardWidth = useLocalizedZhHantLayout ? 285 : 266;
    const cardHeight = useLocalizedZhHantLayout ? 106 : 164;
    const x = useLocalizedZhHantLayout ? index * 299 : index * 287;
    const progressY = useLocalizedZhHantLayout ? 90 : 132;

    const progressNode: BuilderCanvasNode = useLocalizedZhHantLayout
      ? {
          id: progressId,
          kind: 'divider',
          parentId: cardId,
          rect: { x: 16, y: progressY, width: 253, height: 1 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 2,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            orientation: 'horizontal',
            thickness: 1,
            color: '#5b3a8c',
            style: 'solid',
          },
        }
      : createHomeContainerNode({
          id: progressId,
          parentId: cardId,
          rect: { x: 16, y: progressY, width: 234, height: 1 },
          zIndex: 2,
          label: `home stats progress ${index + 1}`,
          className: 'stat-progress',
        });

    const progressBarNode = createHomeTextNode({
      id: `home-stats-progress-bar-${index}`,
      parentId: progressId,
      rect: { x: 0, y: 0, width: useLocalizedZhHantLayout ? 253 : 234, height: 1 },
      zIndex: 0,
      text: useLocalizedZhHantLayout ? '\u200B' : ' ',
      as: 'span',
    });

    nodes.push(
      createHomeContainerNode({
        id: cardId,
        parentId: gridId,
        rect: { x, y: 0, width: cardWidth, height: cardHeight },
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
        rect: { x: 16, y: useLocalizedZhHantLayout ? 59 : 76, width: 220, height: 46 },
        zIndex: 1,
        text: item.label,
        className: 'stat-label',
        as: 'p',
      }),
      progressNode,
      ...(useLocalizedZhHantLayout ? [] : [progressBarNode]),
    );
  });

  return nodes;
}
