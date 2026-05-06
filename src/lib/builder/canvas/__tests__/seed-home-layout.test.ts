import { describe, expect, it } from 'vitest';
import { createHomePageCanvasDocument } from '../seed-home';
import { resolveCanvasNodeAbsoluteRectForViewport } from '../tree';

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
});
