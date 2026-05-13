import { describe, expect, it } from 'vitest';
import {
  alignCenter,
  alignMiddle,
  alignRight,
  matchHeight,
  matchWidth,
} from '../align';
import { groupNodes } from '../group';
import { createDefaultCanvasNodeStyle, type BuilderCanvasNode } from '../types';

describe('canvas align and group bounds', () => {
  it('aligns and matches large selections without spread argument limits', () => {
    const nodes = Array.from({ length: 130_000 }, (_, index) => ({
      id: `node-${index}`,
      rect: {
        x: index,
        y: index % 97,
        width: 20 + (index % 7),
        height: 12 + (index % 11),
      },
    }));

    let maxRight = -Infinity;
    let maxWidth = -Infinity;
    let maxHeight = -Infinity;
    for (const node of nodes) {
      maxRight = Math.max(maxRight, node.rect.x + node.rect.width);
      maxWidth = Math.max(maxWidth, node.rect.width);
      maxHeight = Math.max(maxHeight, node.rect.height);
    }

    const alignedRight = alignRight(nodes);
    const matchedWidth = matchWidth(nodes);
    const matchedHeight = matchHeight(nodes);

    expect(alignedRight).toHaveLength(nodes.length);
    expect(alignedRight[0]!.rect.x + alignedRight[0]!.rect.width).toBe(maxRight);
    expect(alignedRight.at(-1)!.rect.x + alignedRight.at(-1)!.rect.width).toBe(maxRight);
    expect(matchedWidth[42]!.rect.width).toBe(maxWidth);
    expect(matchedHeight[42]!.rect.height).toBe(maxHeight);
  });

  it('keeps center and middle alignment results stable', () => {
    const nodes = [
      { id: 'a', rect: { x: 10, y: 20, width: 100, height: 40 } },
      { id: 'b', rect: { x: 200, y: 90, width: 80, height: 20 } },
      { id: 'c', rect: { x: 310, y: 150, width: 20, height: 60 } },
    ];

    expect(alignCenter(nodes).map((node) => node.rect.x)).toEqual([157, 167, 197]);
    expect(alignMiddle(nodes).map((node) => node.rect.y)).toEqual([87, 97, 77]);
  });

  it('groups nodes with one-pass bounds and relative child rects', () => {
    const result = groupNodes([
      textNode('a', { x: 10, y: 20, width: 100, height: 40 }, 2),
      textNode('b', { x: 200, y: 5, width: 20, height: 50 }, 9),
    ]);

    expect(result?.groupNode.rect).toEqual({ x: 10, y: 5, width: 210, height: 55 });
    expect(result?.groupNode.zIndex).toBe(9);
    expect((result?.groupNode as unknown as { children: BuilderCanvasNode[] }).children.map((node) => node.rect)).toEqual([
      { x: 0, y: 15, width: 100, height: 40 },
      { x: 190, y: 0, width: 20, height: 50 },
    ]);
  });
});

function textNode(
  id: string,
  rect: BuilderCanvasNode['rect'],
  zIndex: number,
): BuilderCanvasNode {
  return {
    id,
    kind: 'text',
    rect,
    style: createDefaultCanvasNodeStyle(),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text: id,
      fontSize: 16,
      color: '#111827',
      fontWeight: 'regular',
      align: 'left',
      as: 'p',
      lineHeight: 1.4,
      letterSpacing: 0,
    },
  };
}
