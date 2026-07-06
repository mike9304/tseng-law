import { describe, expect, it } from 'vitest';
import {
  computeSnap,
  computeSnapFromEdges,
  createSnapEdgeScratch,
  createSnapCandidateEdge,
  createSnapCandidateEdges,
  filterSnapCandidatesByBounds,
  writeSnapFromEdges,
  type Rect,
} from '../snap';

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

  it('reuses the empty guide array when no guides are emitted', () => {
    const moving: Rect = { x: 500, y: 500, width: 100, height: 80 };
    const first = computeSnap(moving, [], 0, canvas);
    const second = computeSnap(moving, [], 0, canvas);
    const fromEdges = computeSnapFromEdges(moving, createSnapCandidateEdges([]), 0, canvas);

    expect(first.guides).toEqual([]);
    expect(second.guides).toBe(first.guides);
    expect(fromEdges.guides).toBe(first.guides);
  });

  it('reuses the original snap candidate array when every candidate is inside bounds', () => {
    const candidates: Rect[] = [
      { x: 80, y: 120, width: 160, height: 80 },
      { x: 1240, y: 80, width: 120, height: 80 },
    ];

    expect(filterSnapCandidatesByBounds(
      candidates,
      { x: 0, y: 0, width: 1280, height: 720 },
    )).toBe(candidates);
  });

  it('creates snap candidate edge geometry directly from a rect', () => {
    expect(createSnapCandidateEdge({ x: 40, y: 50, width: 100, height: 80 })).toEqual({
      left: 40,
      right: 140,
      top: 50,
      bottom: 130,
      centerX: 90,
      centerY: 90,
    });
  });

  it('creates snap candidate edge arrays in candidate order', () => {
    expect(createSnapCandidateEdges([
      { x: 10, y: 20, width: 30, height: 40 },
      { x: 50, y: 60, width: 70, height: 80 },
    ])).toEqual([
      { left: 10, right: 40, top: 20, bottom: 60, centerX: 25, centerY: 40 },
      { left: 50, right: 120, top: 60, bottom: 140, centerX: 85, centerY: 100 },
    ]);
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

  it('preserves nearest edge snapping and spacing labels across multiple candidates', () => {
    const leftPeer: Rect = { x: 100, y: 80, width: 120, height: 80 };
    const rightPeer: Rect = { x: 330, y: 80, width: 120, height: 80 };
    const moving: Rect = { x: 246, y: 86, width: 80, height: 60 };
    const result = computeSnap(moving, [leftPeer, rightPeer], 0, canvas);

    expect(result.snappedRect).toEqual({ x: 250, y: 90, width: 80, height: 60 });
    expect(result.guides).toEqual(expect.arrayContaining([
      expect.objectContaining({ axis: 'vertical', position: 330, tone: 'alignment' }),
      expect.objectContaining({ axis: 'horizontal', position: 120, tone: 'alignment' }),
      expect.objectContaining({ axis: 'horizontal', tone: 'spacing', label: '30px' }),
    ]));
  });

  it('returns the same snap result when candidate edges are precomputed', () => {
    const candidates: Rect[] = [
      { x: 100, y: 80, width: 120, height: 80 },
      { x: 330, y: 80, width: 120, height: 80 },
      { x: 620, y: 220, width: 180, height: 120 },
    ];
    const moving: Rect = { x: 246, y: 86, width: 80, height: 60 };
    const referenceGuides = [
      { axis: 'vertical' as const, position: 250 },
      { axis: 'horizontal' as const, position: 200 },
    ];

    expect(computeSnapFromEdges(
      moving,
      createSnapCandidateEdges(candidates),
      0,
      canvas,
      referenceGuides,
    )).toEqual(computeSnap(moving, candidates, 0, canvas, referenceGuides));
  });

  it('writes snap results into a reusable target rect', () => {
    const candidates: Rect[] = [
      { x: 100, y: 80, width: 120, height: 80 },
      { x: 330, y: 80, width: 120, height: 80 },
    ];
    const target: Rect = { x: 0, y: 0, width: 0, height: 0 };
    const moving: Rect = { x: 246, y: 86, width: 80, height: 60 };
    const guides = writeSnapFromEdges(
      target,
      moving,
      createSnapCandidateEdges(candidates),
      0,
      canvas,
    );

    expect(target).toEqual(computeSnap(moving, candidates, 0, canvas).snappedRect);
    expect(guides).toEqual(computeSnap(moving, candidates, 0, canvas).guides);

    const nextGuides = writeSnapFromEdges(
      target,
      { x: 500, y: 500, width: 80, height: 60 },
      createSnapCandidateEdges([]),
      0,
      canvas,
    );

    expect(target).toEqual({ x: 500, y: 500, width: 80, height: 60 });
    expect(nextGuides).toBe(computeSnap({ x: 500, y: 500, width: 80, height: 60 }, [], 0, canvas).guides);
  });

  it('can reuse snap edge scratch objects while writing snap results', () => {
    const candidates: Rect[] = [
      { x: 100, y: 80, width: 120, height: 80 },
      { x: 330, y: 80, width: 120, height: 80 },
    ];
    const target: Rect = { x: 0, y: 0, width: 0, height: 0 };
    const moving: Rect = { x: 246, y: 86, width: 80, height: 60 };
    const scratch = createSnapEdgeScratch();
    const movingEdges = scratch.movingEdges;
    const finalEdges = scratch.finalEdges;
    const referenceGuideEdges = scratch.referenceGuideEdges;
    const guides = writeSnapFromEdges(
      target,
      moving,
      createSnapCandidateEdges(candidates),
      0,
      canvas,
      [
        { axis: 'vertical', position: 250 },
        { axis: 'horizontal', position: 200 },
      ],
      scratch,
    );

    expect(scratch.movingEdges).toBe(movingEdges);
    expect(scratch.finalEdges).toBe(finalEdges);
    expect(scratch.referenceGuideEdges).toBe(referenceGuideEdges);
    expect(target).toEqual(computeSnap(moving, candidates, 0, canvas, [
      { axis: 'vertical', position: 250 },
      { axis: 'horizontal', position: 200 },
    ]).snappedRect);
    expect(guides).toEqual(computeSnap(moving, candidates, 0, canvas, [
      { axis: 'vertical', position: 250 },
      { axis: 'horizontal', position: 200 },
    ]).guides);
  });

  it('snaps to the configured pixel grid when grid snap is enabled', () => {
    const moving: Rect = { x: 47, y: 65, width: 160, height: 80 };
    const result = computeSnap(moving, [], 16, canvas);

    expect(result.snappedRect.x).toBe(48);
    expect(result.snappedRect.y).toBe(64);
  });

  it('snaps edges and centers to custom reference guides', () => {
    const moving: Rect = { x: 245, y: 195, width: 100, height: 80 };
    const result = computeSnap(moving, [], 0, canvas, [
      { axis: 'vertical', position: 250 },
      { axis: 'horizontal', position: 200 },
    ]);

    expect(result.snappedRect.x).toBe(250);
    expect(result.snappedRect.y).toBe(200);
    expect(result.guides).toEqual(expect.arrayContaining([
      expect.objectContaining({ axis: 'vertical', position: 250 }),
      expect.objectContaining({ axis: 'horizontal', position: 200 }),
    ]));
  });

  it('prunes snap candidates outside the active viewport bounds', () => {
    const visiblePeer: Rect = { x: 80, y: 120, width: 160, height: 80 };
    const partiallyVisiblePeer: Rect = { x: 1240, y: 80, width: 120, height: 80 };
    const offscreenPeer: Rect = { x: 2000, y: 80, width: 200, height: 100 };

    expect(filterSnapCandidatesByBounds(
      [visiblePeer, partiallyVisiblePeer, offscreenPeer],
      { x: 0, y: 0, width: 1280, height: 720 },
    )).toEqual([visiblePeer, partiallyVisiblePeer]);
  });
});
