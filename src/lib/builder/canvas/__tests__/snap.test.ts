import { describe, expect, it } from 'vitest';
import { computeSnap, type Rect } from '../snap';

const canvas = { width: 1280, height: 1200 };

describe('builder canvas snap engine', () => {
  const peer: Rect = { x: 100, y: 80, width: 200, height: 120 };

  it('snaps element edges and centers within the 6px Wix-style tolerance', () => {
    const moving: Rect = { x: 304, y: 78, width: 160, height: 80 };
    const result = computeSnap(moving, [peer], 0, canvas);

    expect(result.snappedRect.x).toBe(300);
    expect(result.snappedRect.y).toBe(80);
    expect(result.guides.some((guide) => guide.axis === 'vertical' && guide.tone === 'alignment')).toBe(true);
    expect(result.guides.some((guide) => guide.axis === 'horizontal' && guide.tone === 'alignment')).toBe(true);
  });

  it('does not snap when the nearest alignment is outside the 6px tolerance', () => {
    const moving: Rect = { x: 307, y: 73, width: 160, height: 80 };
    const result = computeSnap(moving, [peer], 0, canvas);

    expect(result.snappedRect.x).toBe(307);
    expect(result.snappedRect.y).toBe(73);
  });

  it('emits orange spacing guide labels such as 24px while dragging near siblings', () => {
    const moving: Rect = { x: 324, y: 90, width: 160, height: 80 };
    const result = computeSnap(moving, [peer], 0, canvas);

    expect(result.guides).toContainEqual(
      expect.objectContaining({
        axis: 'horizontal',
        tone: 'spacing',
        label: '24px',
      }),
    );
  });
});
