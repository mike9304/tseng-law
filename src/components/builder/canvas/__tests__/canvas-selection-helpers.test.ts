import { describe, expect, it } from 'vitest';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { getSelectedCanvasNodes } from '../canvasSelection';

type TestNodeOverrides = Partial<Omit<BuilderCanvasNode, 'content'>> & {
  content?: Record<string, unknown>;
};

function node(overrides: TestNodeOverrides): BuilderCanvasNode {
  return {
    id: 'node',
    kind: 'text',
    rect: { x: 0, y: 0, width: 120, height: 80 },
    content: { text: 'Node' },
    style: {},
    zIndex: 0,
    visible: true,
    ...overrides,
  } as BuilderCanvasNode;
}

describe('canvas selection helpers', () => {
  it('resolves selected nodes from the node map in selected-id order', () => {
    const nodeA = node({ id: 'node-a' });
    const nodeB = node({ id: 'node-b' });
    const nodeC = node({ id: 'node-c' });
    const nodesById = new Map([
      [nodeA.id, nodeA],
      [nodeB.id, nodeB],
      [nodeC.id, nodeC],
    ]);

    expect(getSelectedCanvasNodes(['node-c', 'missing', 'node-a'], nodesById)).toEqual([
      nodeC,
      nodeA,
    ]);
  });
});
