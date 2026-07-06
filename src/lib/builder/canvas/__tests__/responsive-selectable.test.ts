import { describe, expect, it } from 'vitest';
import { filterViewportVisibleNodes } from '../responsive';
import { createDefaultCanvasNodeStyle, type BuilderCanvasNode } from '../types';

function node(id: string, opts: { visible?: boolean; responsive?: unknown } = {}): BuilderCanvasNode {
  return {
    id,
    kind: 'text',
    parentId: undefined,
    rect: { x: 0, y: 0, width: 50, height: 20 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: opts.visible ?? true,
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
    ...(opts.responsive ? { responsive: opts.responsive } : {}),
  } as unknown as BuilderCanvasNode;
}

describe('filterViewportVisibleNodes — select-all/marquee 가 render gate 와 일치', () => {
  it('viewport-hidden 노드는 해당 viewport 선택 대상에서 제외', () => {
    const always = node('always');
    const mobileHidden = node('mobile-hidden', { responsive: { mobile: { hidden: true } } });
    const baseHidden = node('base-hidden', { visible: false });
    const nodes = [always, mobileHidden, baseHidden];

    // desktop/tablet: base-hidden(visible:false)만 제외, mobile override 미영향
    expect(filterViewportVisibleNodes(nodes, 'desktop').map((n) => n.id)).toEqual(['always', 'mobile-hidden']);
    expect(filterViewportVisibleNodes(nodes, 'tablet').map((n) => n.id)).toEqual(['always', 'mobile-hidden']);
    // mobile: responsive.mobile.hidden 노드도 제외 (렌더 안 되는데 선택되던 버그 방지)
    expect(filterViewportVisibleNodes(nodes, 'mobile').map((n) => n.id)).toEqual(['always']);
  });
});
