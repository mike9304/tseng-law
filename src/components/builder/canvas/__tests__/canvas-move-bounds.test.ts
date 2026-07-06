import { describe, expect, it } from 'vitest';
import { writeLocalClampedRectForParent } from '../canvasInteraction';

describe('canvas move bounds', () => {
  it('keeps same-size child nodes responsive instead of locking them to the parent origin', () => {
    const target = { x: 0, y: 0, width: 0, height: 0 };
    const changed = writeLocalClampedRectForParent(
      target,
      { x: 135, y: 248, width: 240, height: 160 },
      { x: 100, y: 200, width: 240, height: 160 },
      240,
      160,
    );

    expect(changed).toBe(true);
    expect(target).toEqual({ x: 35, y: 48, width: 240, height: 160 });
  });

  it('hard-clamps a small child inside the parent bounds by default', () => {
    const target = { x: 0, y: 0, width: 0, height: 0 };
    // Child dragged far below the parent bottom: default (allowOverflow=false)
    // pins it back inside the parent's local bounds.
    writeLocalClampedRectForParent(
      target,
      { x: 100, y: 1000, width: 360, height: 56 },
      { x: 0, y: 0, width: 1280, height: 820 },
      1280,
      820,
    );

    expect(target.y).toBe(820 - 56); // clamped to parent bottom
    expect(target.x).toBe(100);
  });

  it('allows free overhang past the parent boundary when allowOverflow is set (Wix parity cross-section drag)', () => {
    const target = { x: 0, y: 0, width: 0, height: 0 };
    // Same drag as above, but free move: local y is NOT clamped, so the node can
    // straddle / overhang the section boundary (the search-bar-across-sections case).
    const changed = writeLocalClampedRectForParent(
      target,
      { x: 100, y: 1000, width: 360, height: 56 },
      { x: 0, y: 0, width: 1280, height: 820 },
      1280,
      820,
      true,
    );

    expect(changed).toBe(true);
    expect(target).toEqual({ x: 100, y: 1000, width: 360, height: 56 });
  });

  it('allows negative local coords (overhang above/left) under free move', () => {
    const target = { x: 0, y: 0, width: 0, height: 0 };
    writeLocalClampedRectForParent(
      target,
      { x: 40, y: 40, width: 360, height: 56 },
      { x: 200, y: 300, width: 800, height: 500 },
      800,
      500,
      true,
    );

    // abs (40,40) relative to parent (200,300) => local (-160,-260), unclamped.
    expect(target).toEqual({ x: -160, y: -260, width: 360, height: 56 });
  });

  it('still enforces the minimum node size under free move', () => {
    const target = { x: 0, y: 0, width: 0, height: 0 };
    writeLocalClampedRectForParent(
      target,
      { x: 0, y: 0, width: 10, height: 5 },
      null,
      1280,
      820,
      true,
    );

    expect(target.width).toBe(72); // MIN_CANVAS_NODE_WIDTH
    expect(target.height).toBe(40); // MIN_CANVAS_NODE_HEIGHT
  });
});
