import { describe, expect, it } from 'vitest';
import { createHomePageCanvasDocument } from '../seed-home';
import {
  buildChildrenMap,
  getCanvasNodeDescendantIds,
  resolveCanvasNodeAbsoluteRectForViewport,
} from '../tree';

describe('home seed canvas layout', () => {
  it('keeps visible seed nodes within the desktop stage width', () => {
    const doc = createHomePageCanvasDocument('ko');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const offenders = doc.nodes
      .filter((node) => node.visible !== false)
      .map((node) => ({
        id: node.id,
        rect: resolveCanvasNodeAbsoluteRectForViewport(node, nodesById, 'desktop'),
      }))
      .filter(({ rect }) => rect.x < -1 || rect.x + rect.width > doc.stageWidth + 1)
      .map(({ id, rect }) => ({
        id,
        x: rect.x,
        right: rect.x + rect.width,
        stageWidth: doc.stageWidth,
      }));

    expect(offenders).toEqual([]);
  });

  it('keeps boundary controls clear of the following home section', () => {
    const doc = createHomePageCanvasDocument('ko');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const heroRoot = nodesById.get('home-hero-root');
    const heroSearch = nodesById.get('home-hero-search-wrap');
    const insightsRoot = nodesById.get('home-insights-root');
    const insightsCta = nodesById.get('home-insights-view-all');

    expect(heroRoot).toBeDefined();
    expect(heroSearch).toBeDefined();
    expect(insightsRoot).toBeDefined();
    expect(insightsCta).toBeDefined();

    const heroRootRect = resolveCanvasNodeAbsoluteRectForViewport(heroRoot!, nodesById, 'desktop');
    const heroSearchRect = resolveCanvasNodeAbsoluteRectForViewport(heroSearch!, nodesById, 'desktop');
    const insightsRootRect = resolveCanvasNodeAbsoluteRectForViewport(insightsRoot!, nodesById, 'desktop');
    const insightsCtaRect = resolveCanvasNodeAbsoluteRectForViewport(insightsCta!, nodesById, 'desktop');

    expect(heroRootRect.y + heroRootRect.height - (heroSearchRect.y + heroSearchRect.height)).toBeGreaterThanOrEqual(160);
    expect(insightsRootRect.y + insightsRootRect.height - (insightsCtaRect.y + insightsCtaRect.height)).toBeGreaterThanOrEqual(80);
  });

  it('keeps non-overlay home section descendants inside their section bounds', () => {
    const doc = createHomePageCanvasDocument('ko');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const childrenMap = buildChildrenMap(doc.nodes);
    const overlaySectionIds = new Set(['home-hero-root']);
    const offenders = doc.nodes
      .filter((node) => !node.parentId && /^home-.+-root$/.test(node.id) && !overlaySectionIds.has(node.id))
      .flatMap((root) => {
        const rootRect = resolveCanvasNodeAbsoluteRectForViewport(root, nodesById, 'desktop');
        return getCanvasNodeDescendantIds(root.id, childrenMap)
          .map((descendantId) => {
            const descendant = nodesById.get(descendantId);
            if (!descendant || descendant.visible === false) return null;
            const rect = resolveCanvasNodeAbsoluteRectForViewport(descendant, nodesById, 'desktop');
            return {
              id: descendant.id,
              sectionId: root.id,
              bottom: rect.y + rect.height,
              sectionBottom: rootRect.y + rootRect.height,
            };
          })
          .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
          .filter((entry) => entry.bottom > entry.sectionBottom + 1);
      });

    expect(offenders).toEqual([]);
  });

  it('keeps the home FAQ list sized around all collapsed items', () => {
    const doc = createHomePageCanvasDocument('ko');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const childrenMap = buildChildrenMap(doc.nodes);
    const list = nodesById.get('home-faq-list');

    expect(list).toBeDefined();

    const listRect = resolveCanvasNodeAbsoluteRectForViewport(list!, nodesById, 'desktop');
    const offenders = getCanvasNodeDescendantIds(list!.id, childrenMap)
      .map((descendantId) => {
        const descendant = nodesById.get(descendantId);
        if (!descendant || descendant.visible === false) return null;
        const rect = resolveCanvasNodeAbsoluteRectForViewport(descendant, nodesById, 'desktop');
        return {
          id: descendant.id,
          bottom: rect.y + rect.height,
          listBottom: listRect.y + listRect.height,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
      .filter((entry) => entry.bottom > entry.listBottom + 1);

    expect(offenders).toEqual([]);
  });
});
