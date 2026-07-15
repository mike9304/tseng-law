import { describe, expect, it } from 'vitest';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  clearInlineTextCaretCoords,
  readInlineTextCaretCoords,
  rememberInlineTextCaretCoords,
  resolveInlineTextEditTarget,
} from '../CanvasNode';

class FakeElement {
  dataset: DOMStringMap;
  parentElement: FakeElement | null;
  private readonly width: number;
  private readonly height: number;

  constructor(nodeId: string | null, parent: FakeElement | null = null, width = 100, height = 30) {
    this.dataset = (nodeId ? { nodeId } : {}) as DOMStringMap;
    this.parentElement = parent;
    this.width = width;
    this.height = height;
  }

  closest(selector: string): FakeElement | null {
    if (selector !== '[data-node-id]') return null;
    if (this.dataset.nodeId) return this;
    return this.parentElement?.closest(selector) ?? null;
  }

  getBoundingClientRect(): DOMRect {
    return { width: this.width, height: this.height } as DOMRect;
  }
}

function node(id: string, kind: BuilderCanvasNode['kind'], locked = false): BuilderCanvasNode {
  return { id, kind, locked } as BuilderCanvasNode;
}

describe('CanvasNode inline text entry target', () => {
  it('uses the actual clicked descendant rather than a larger sibling', () => {
    const composite = new FakeElement('composite');
    const smallText = new FakeElement('small-text', composite, 100, 20);
    const nestedSpan = new FakeElement(null, smallText, 20, 10);
    const nodes = new Map<string, BuilderCanvasNode>([
      ['composite', node('composite', 'composite')],
      ['small-text', node('small-text', 'text')],
      ['large-text', node('large-text', 'text')],
    ]);

    const target = resolveInlineTextEditTarget(nestedSpan as unknown as EventTarget, nodes);

    expect(target?.nodeId).toBe('small-text');
    expect(target?.nodeId).not.toBe('large-text');
  });

  it('does not fall through from a locked or non-visible clicked text node', () => {
    const parent = new FakeElement('container');
    const lockedText = new FakeElement('locked-text', parent);
    const zeroSizeText = new FakeElement('zero-text', parent, 0, 0);
    const nodes = new Map<string, BuilderCanvasNode>([
      ['container', node('container', 'container')],
      ['locked-text', node('locked-text', 'text', true)],
      ['zero-text', node('zero-text', 'heading')],
    ]);

    expect(resolveInlineTextEditTarget(lockedText as unknown as EventTarget, nodes)).toBeNull();
    expect(resolveInlineTextEditTarget(zeroSizeText as unknown as EventTarget, nodes)).toBeNull();
  });

  it('transports caret coordinates by target node id for nested composites', () => {
    rememberInlineTextCaretCoords('small-text', { x: 281, y: 144 });
    rememberInlineTextCaretCoords('other-text', { x: 40, y: 60 });

    expect(readInlineTextCaretCoords('small-text')).toEqual({ x: 281, y: 144 });
    expect(readInlineTextCaretCoords('other-text')).toEqual({ x: 40, y: 60 });

    clearInlineTextCaretCoords('small-text');
    expect(readInlineTextCaretCoords('small-text')).toBeNull();
    expect(readInlineTextCaretCoords('other-text')).toEqual({ x: 40, y: 60 });
    clearInlineTextCaretCoords('other-text');
  });

  it('rejects invalid caret coordinates instead of leaking an end-position fallback', () => {
    rememberInlineTextCaretCoords('text', { x: Number.NaN, y: 12 });
    expect(readInlineTextCaretCoords('text')).toBeNull();
  });
});
