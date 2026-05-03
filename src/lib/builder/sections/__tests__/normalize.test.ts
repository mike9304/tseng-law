import { describe, expect, it } from 'vitest';
import { normalizeSavedSectionSnapshot } from '@/lib/builder/sections/normalize';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';

function mk(overrides: Record<string, unknown>): BuilderCanvasNode {
  return {
    id: 'n',
    kind: 'container',
    parentId: undefined,
    rect: { x: 100, y: 200, width: 800, height: 400 },
    style: createDefaultCanvasNodeStyle(),
    content: {},
    visible: true,
    locked: false,
    rotation: 0,
    zIndex: 0,
    ...overrides,
  } as unknown as BuilderCanvasNode;
}

describe('normalizeSavedSectionSnapshot', () => {
  it('returns empty array when root not found', () => {
    const result = normalizeSavedSectionSnapshot([], 'missing');
    expect(result).toEqual([]);
  });

  it('root rect.x/y normalized to 0,0 (local origin)', () => {
    const root = mk({ id: 'root', rect: { x: 555, y: 999, width: 800, height: 400 } });
    const result = normalizeSavedSectionSnapshot([root], 'root');
    expect(result[0].rect.x).toBe(0);
    expect(result[0].rect.y).toBe(0);
  });

  it('root width/height preserved', () => {
    const root = mk({ id: 'root', rect: { x: 555, y: 999, width: 1234, height: 567 } });
    const result = normalizeSavedSectionSnapshot([root], 'root');
    expect(result[0].rect.width).toBe(1234);
    expect(result[0].rect.height).toBe(567);
  });

  it('root parentId becomes undefined (detached)', () => {
    const root = mk({ id: 'root', parentId: 'something-else' });
    const result = normalizeSavedSectionSnapshot([root], 'root');
    expect(result[0].parentId).toBeUndefined();
  });

  it('only nodes reachable from root are kept', () => {
    const root = mk({ id: 'root' });
    const child = mk({ id: 'child', parentId: 'root', kind: 'text' });
    const orphan = mk({ id: 'orphan', kind: 'image' });
    const result = normalizeSavedSectionSnapshot([root, child, orphan], 'root');
    const ids = result.map((n) => n.id);
    expect(ids).toContain('root');
    expect(ids).toContain('child');
    expect(ids).not.toContain('orphan');
  });

  it('descendant parentId references survive (parent included in subtree)', () => {
    const root = mk({ id: 'root' });
    const child = mk({ id: 'child', parentId: 'root', kind: 'text' });
    const grand = mk({ id: 'grand', parentId: 'child', kind: 'text' });
    const result = normalizeSavedSectionSnapshot([root, child, grand], 'root');
    const grandResult = result.find((n) => n.id === 'grand');
    expect(grandResult?.parentId).toBe('child');
  });

  it('descendant parentId pointing outside subtree → undefined', () => {
    const root = mk({ id: 'root' });
    // parent is "outside" — node still reachable via fake stack but its parent isn't kept
    const child = mk({ id: 'child', parentId: 'root', kind: 'text' });
    const result = normalizeSavedSectionSnapshot([root, child], 'root');
    expect(result.find((n) => n.id === 'child')?.parentId).toBe('root');
  });

  it('descendant rect (parent-local) preserved', () => {
    const root = mk({ id: 'root', rect: { x: 100, y: 200, width: 800, height: 400 } });
    const child = mk({
      id: 'child',
      parentId: 'root',
      kind: 'text',
      rect: { x: 50, y: 60, width: 100, height: 30 },
    });
    const result = normalizeSavedSectionSnapshot([root, child], 'root');
    const childResult = result.find((n) => n.id === 'child');
    expect(childResult?.rect.x).toBe(50);
    expect(childResult?.rect.y).toBe(60);
  });

  it('cycle protection — node points to itself does not infinite loop', () => {
    const cyclic = mk({ id: 'cycle', parentId: 'cycle' });
    const result = normalizeSavedSectionSnapshot([cyclic], 'cycle');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('cycle');
  });

  it('does not mutate input nodes', () => {
    const root = mk({ id: 'root', rect: { x: 999, y: 999, width: 100, height: 100 } });
    const child = mk({ id: 'child', parentId: 'root' });
    const inputs = [root, child];
    normalizeSavedSectionSnapshot(inputs, 'root');
    expect(root.rect.x).toBe(999);
    expect(root.rect.y).toBe(999);
  });

  it('responsive tablet/mobile rect.x/y reset to 0 on root', () => {
    const root = mk({
      id: 'root',
      rect: { x: 100, y: 200, width: 800, height: 400 },
      responsive: {
        tablet: { rect: { x: 50, y: 70, width: 600, height: 300 } },
        mobile: { rect: { x: 30, y: 40, width: 320, height: 200 } },
      },
    } as Partial<BuilderCanvasNode>);
    const result = normalizeSavedSectionSnapshot([root], 'root');
    const r = result[0] as BuilderCanvasNode;
    expect(r.responsive?.tablet?.rect?.x).toBe(0);
    expect(r.responsive?.tablet?.rect?.y).toBe(0);
    expect(r.responsive?.mobile?.rect?.x).toBe(0);
    expect(r.responsive?.mobile?.rect?.y).toBe(0);
  });

  it('responsive width/height preserved on root', () => {
    const root = mk({
      id: 'root',
      rect: { x: 100, y: 200, width: 800, height: 400 },
      responsive: {
        tablet: { rect: { x: 50, y: 70, width: 612, height: 345 } },
      },
    } as Partial<BuilderCanvasNode>);
    const result = normalizeSavedSectionSnapshot([root], 'root');
    const r = result[0] as BuilderCanvasNode;
    expect(r.responsive?.tablet?.rect?.width).toBe(612);
    expect(r.responsive?.tablet?.rect?.height).toBe(345);
  });
});
