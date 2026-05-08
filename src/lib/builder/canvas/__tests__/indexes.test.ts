import { describe, expect, it } from 'vitest';
import { getCanvasNodesById } from '../indexes';
import type { BuilderCanvasNode } from '../types';

function node(id: string): BuilderCanvasNode {
  return {
    id,
    kind: 'text',
    rect: { x: 0, y: 0, width: 100, height: 20 },
    style: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      opacity: 1,
      shadowBlur: 0,
      shadowColor: 'transparent',
      shadowSpread: 0,
      shadowX: 0,
      shadowY: 0,
    },
    zIndex: 0,
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

describe('getCanvasNodesById', () => {
  it('reuses the same map for the same node array reference', () => {
    const nodes = [node('a'), node('b')];

    expect(getCanvasNodesById(nodes)).toBe(getCanvasNodesById(nodes));
    expect(getCanvasNodesById(nodes).get('b')?.id).toBe('b');
  });

  it('builds a fresh map for a new node array reference', () => {
    const first = [node('a')];
    const second = [...first];

    expect(getCanvasNodesById(first)).not.toBe(getCanvasNodesById(second));
  });
});
