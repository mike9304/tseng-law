import { describe, expect, it } from 'vitest';
import { getCanvasOverlapCandidatesAtPoint } from '../useCanvasStageGeometry';
import { createDefaultCanvasNodeStyle, type BuilderCanvasNode } from '@/lib/builder/canvas/types';

function node({
  id,
  parentId,
  zIndex,
  x = 0,
  y = 0,
  width = 100,
  height = 100,
}: {
  id: string;
  parentId?: string;
  zIndex: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}): BuilderCanvasNode {
  return {
    id,
    kind: 'container',
    parentId,
    rect: { x, y, width, height },
    style: createDefaultCanvasNodeStyle(),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label: id,
      background: '#ffffff',
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      layoutMode: 'absolute',
      padding: 0,
      activeIndex: 0,
      sticky: false,
      variant: 'flat',
    },
  };
}

describe('canvas stage geometry', () => {
  it('keeps only the top overlap candidates without sorting the full matched set', () => {
    const nodes = Array.from({ length: 12 }, (_, index) => node({
      id: `overlap-${index}`,
      zIndex: index,
    }));
    const nodesById = new Map(nodes.map((candidate) => [candidate.id, candidate]));

    const candidates = getCanvasOverlapCandidatesAtPoint({
      absoluteRectById: new Map(),
      geometryViewport: 'desktop',
      nodesById,
      point: { x: 20, y: 20 },
      selectableNodes: nodes,
    });

    expect(candidates.map((candidate) => candidate.id)).toEqual([
      'overlap-11',
      'overlap-10',
      'overlap-9',
      'overlap-8',
      'overlap-7',
      'overlap-6',
      'overlap-5',
      'overlap-4',
    ]);
  });

  it('uses depth as the z-index tie breaker and ignores misses', () => {
    const root = node({ id: 'root', zIndex: 4 });
    const child = node({ id: 'child', parentId: root.id, zIndex: 4 });
    const top = node({ id: 'top', zIndex: 5 });
    const miss = node({ id: 'miss', zIndex: 99, x: 300, y: 300 });
    const nodes = [root, child, top, miss];
    const nodesById = new Map(nodes.map((candidate) => [candidate.id, candidate]));

    const candidates = getCanvasOverlapCandidatesAtPoint({
      absoluteRectById: new Map(),
      geometryViewport: 'desktop',
      nodesById,
      point: { x: 20, y: 20 },
      selectableNodes: nodes,
    });

    expect(candidates.map((candidate) => candidate.id)).toEqual(['top', 'child', 'root']);
  });
});
