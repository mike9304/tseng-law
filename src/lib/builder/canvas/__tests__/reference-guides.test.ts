import { describe, expect, it } from 'vitest';
import {
  addReferenceGuideToPrefs,
  boundGuidePosition,
  createReferenceGuideEntry,
  DEFAULT_EDITOR_PREFS,
  describeGuideLabel,
  normalizeEditorPreferences,
  REFERENCE_GUIDE_COLOR,
  removeReferenceGuideFromPrefs,
  repositionReferenceGuideInPrefs,
  type EditorPreferences,
  type ReferenceGuide,
} from '../editor-prefs';
import {
  GUIDE_DELETE_RULER_THRESHOLD_PX,
  isGuideReleaseInsideCanvas,
  isReleaseWithinRulerDeleteZone,
} from '@/components/builder/canvas/useCanvasReferenceGuides';

function prefsWith(guides: ReferenceGuide[]): EditorPreferences {
  return { ...DEFAULT_EDITOR_PREFS, referenceGuides: guides };
}

describe('guide position bounds + labels', () => {
  it('clamps vertical to [0, stageWidth] and horizontal to [0, stageHeight]', () => {
    expect(boundGuidePosition('vertical', 5000, 1280, 880)).toBe(1280);
    expect(boundGuidePosition('vertical', -40, 1280, 880)).toBe(0);
    expect(boundGuidePosition('horizontal', 5000, 1280, 880)).toBe(880);
    expect(boundGuidePosition('horizontal', -10, 1280, 880)).toBe(0);
    expect(boundGuidePosition('vertical', 312.7, 1280, 880)).toBe(313);
  });

  it('falls back to 0 for non-finite input or a non-positive stage extent', () => {
    expect(boundGuidePosition('vertical', Number.NaN, 1280, 880)).toBe(0);
    expect(boundGuidePosition('horizontal', Number.POSITIVE_INFINITY, 1280, 880)).toBe(0);
    expect(boundGuidePosition('vertical', 100, 0, 880)).toBe(0);
    expect(boundGuidePosition('horizontal', 100, 1280, 0)).toBe(0);
    expect(boundGuidePosition('horizontal', 100, 1280, -5)).toBe(0);
  });

  it('labels vertical guides with X and horizontal with Y, rounded to px', () => {
    expect(describeGuideLabel('vertical', 312)).toBe('X 312px');
    expect(describeGuideLabel('horizontal', 90.4)).toBe('Y 90px');
  });
});

describe('createReferenceGuideEntry', () => {
  it('bounds the position, attaches label/color, and emits a stable id prefix', () => {
    const guide = createReferenceGuideEntry('vertical', 9999, 1280, 880);
    expect(guide.axis).toBe('vertical');
    expect(guide.position).toBe(1280);
    expect(guide.label).toBe('X 1280px');
    expect(guide.color).toBe(REFERENCE_GUIDE_COLOR);
    expect(guide.id).toMatch(/^gd-/);
  });
});

describe('guide prefs actions are immutable', () => {
  it('addReferenceGuideToPrefs appends without mutating the source', () => {
    const before = prefsWith([{ id: 'g1', axis: 'horizontal', position: 40 }]);
    const next = addReferenceGuideToPrefs(before, { id: 'g2', axis: 'vertical', position: 120 });
    expect(next.referenceGuides).toHaveLength(2);
    expect(before.referenceGuides).toHaveLength(1);
    expect(next.referenceGuides[1]).toEqual({ id: 'g2', axis: 'vertical', position: 120 });
  });

  it('removeReferenceGuideFromPrefs removes only the targeted id', () => {
    const before = prefsWith([
      { id: 'g1', axis: 'horizontal', position: 40 },
      { id: 'g2', axis: 'vertical', position: 120 },
    ]);
    const next = removeReferenceGuideFromPrefs(before, 'g1');
    expect(next.referenceGuides.map((g) => g.id)).toEqual(['g2']);
    expect(before.referenceGuides).toHaveLength(2);
  });

  it('repositionReferenceGuideInPrefs updates only the target, clamps, and refreshes the label', () => {
    const before = prefsWith([
      { id: 'g1', axis: 'vertical', position: 100, label: 'X 100px' },
      { id: 'g2', axis: 'horizontal', position: 50, label: 'Y 50px' },
    ]);
    const next = repositionReferenceGuideInPrefs(before, 'g1', 5000, 1280, 880);
    expect(next.referenceGuides[0]).toMatchObject({
      id: 'g1',
      axis: 'vertical',
      position: 1280,
      label: 'X 1280px',
    });
    expect(next.referenceGuides[1]).toEqual(before.referenceGuides[1]);
    expect(before.referenceGuides[0].position).toBe(100);
  });

  it('repositionReferenceGuideInPrefs is a no-op when the id is absent', () => {
    const before = prefsWith([{ id: 'g1', axis: 'vertical', position: 100 }]);
    const next = repositionReferenceGuideInPrefs(before, 'missing', 500, 1280, 880);
    expect(next.referenceGuides).toEqual(before.referenceGuides);
  });
});

// Render-contract: CustomGuidesOverlay reads guide.id / guide.axis /
// guide.position straight from editorPrefs.referenceGuides to emit
// [data-builder-guide-id] / [data-builder-guide-axis]. Persisted prefs must
// round-trip those fields (and filter junk) so the rendered contract holds.
describe('guide render-contract via normalizeEditorPreferences', () => {
  it('preserves valid persisted guides and drops malformed ones', () => {
    const normalized = normalizeEditorPreferences({
      referenceGuides: [
        { id: 'g1', axis: 'vertical', position: 144 },
        { id: 'g2', axis: 'horizontal', position: 320, label: 'Y 320px', color: '#0ea5e9' },
        { id: 'g3', axis: 'diagonal', position: 10 },
        { id: 'g4', axis: 'vertical', position: 'wide' },
      ],
    });
    expect(normalized.referenceGuides.map(({ id, axis, position }) => ({ id, axis, position }))).toEqual([
      { id: 'g1', axis: 'vertical', position: 144 },
      { id: 'g2', axis: 'horizontal', position: 320 },
    ]);
    expect(normalized.referenceGuides[1].label).toBe('Y 320px');
    expect(normalized.referenceGuides[1].color).toBe('#0ea5e9');
  });

  it('defaults to an empty guide array when the field is absent', () => {
    expect(normalizeEditorPreferences({}).referenceGuides).toEqual([]);
  });
});

// Release-zone contract: when the user drops an existing guide (or commits a
// ruler-drag draft), the editor asks isGuideReleaseInsideCanvas. "Inside" =
// commit/reposition; "outside" (over/near a ruler, or off-stage) = delete/cancel.
// These tests pin that contract, including the near-ruler delete threshold, by
// stubbing document.elementFromPoint + the ruler geometry so they run headless.
type FakeHit = { ruler?: boolean; canvasViewport?: boolean };
type EdgeRect = { left: number; top: number; right: number; bottom: number };

function makeRectEl(rect: EdgeRect): Element {
  return {
    getBoundingClientRect: () => ({
      x: rect.left,
      y: rect.top,
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top,
      toJSON() { /* noop */ },
    }),
  } as unknown as Element;
}

function makeHitEl(hit: FakeHit): Element {
  return {
    closest: (selector: string) => {
      if (selector === '[data-builder-ruler]' && hit.ruler) return {} as Element;
      if (selector === '[data-builder-canvas-viewport]' && hit.canvasViewport) return {} as Element;
      return null;
    },
  } as unknown as Element;
}

// The vitest suite runs in the `node` environment (no DOM). Install a minimal
// `document` global with controllable elementFromPoint + ruler geometry so the
// release-zone helpers can be exercised headless. Returns a restore fn.
function installDocument(opts: {
  hit?: FakeHit | null;
  top?: EdgeRect | null;
  left?: EdgeRect | null;
}) {
  const scope = globalThis as { document?: unknown };
  const previous = scope.document;
  scope.document = {
    elementFromPoint: () => (opts.hit ? makeHitEl(opts.hit) : null),
    querySelector: (selector: string) => {
      if (selector === '[data-builder-ruler="top"]' && opts.top) return makeRectEl(opts.top);
      if (selector === '[data-builder-ruler="left"]' && opts.left) return makeRectEl(opts.left);
      return null;
    },
  };
  return () => { scope.document = previous; };
}

describe('isGuideReleaseInsideCanvas — release zone / delete-on-ruler contract', () => {
  // Typical screen layout: a 12px top ruler at y 60..72 and a 12px left ruler
  // at x 60..72. The stage begins at (72, 72).
  const TOP: EdgeRect = { left: 72, top: 60, right: 1296, bottom: 72 };
  const LEFT: EdgeRect = { left: 60, top: 72, right: 72, bottom: 768 };

  it('commits/repositions when released over the stage away from rulers', () => {
    const restore = installDocument({ hit: { canvasViewport: true }, top: TOP, left: LEFT });
    expect(isGuideReleaseInsideCanvas(400, 400)).toBe(true);
    restore();
  });

  it('deletes/cancels when released directly on a ruler strip', () => {
    const restore = installDocument({ hit: { ruler: true }, top: TOP, left: LEFT });
    expect(isGuideReleaseInsideCanvas(400, 66)).toBe(false);
    restore();
  });

  it('deletes/cancels when released outside the stage entirely (no hit target)', () => {
    const restore = installDocument({ hit: null, top: TOP, left: LEFT });
    expect(isGuideReleaseInsideCanvas(5, 5)).toBe(false);
    restore();
  });

  it('deletes/cancels when released over neither ruler nor stage (e.g. inspector)', () => {
    const restore = installDocument({ hit: { ruler: false, canvasViewport: false }, top: TOP, left: LEFT });
    expect(isGuideReleaseInsideCanvas(1500, 400)).toBe(false);
    restore();
  });

  it('deletes when dropped just inside the stage but within the near-ruler threshold of the top ruler', () => {
    const restore = installDocument({ hit: { canvasViewport: true }, top: TOP, left: LEFT });
    // Hit-test claims "canvas", but proximity to the top ruler must still delete.
    const justInside = TOP.bottom + GUIDE_DELETE_RULER_THRESHOLD_PX - 1;
    expect(isGuideReleaseInsideCanvas(400, justInside)).toBe(false);
    restore();
  });

  it('deletes when dropped within the near-ruler threshold of the left ruler', () => {
    const restore = installDocument({ hit: { canvasViewport: true }, top: TOP, left: LEFT });
    const justInside = LEFT.right + GUIDE_DELETE_RULER_THRESHOLD_PX - 1;
    expect(isGuideReleaseInsideCanvas(justInside, 400)).toBe(false);
    restore();
  });

  it('commits when dropped just beyond the near-ruler threshold of the top ruler', () => {
    const restore = installDocument({ hit: { canvasViewport: true }, top: TOP, left: LEFT });
    const beyond = TOP.bottom + GUIDE_DELETE_RULER_THRESHOLD_PX + 4;
    expect(isGuideReleaseInsideCanvas(400, beyond)).toBe(true);
    restore();
  });

  it('commits when dropped just beyond the near-ruler threshold of the left ruler', () => {
    const restore = installDocument({ hit: { canvasViewport: true }, top: TOP, left: LEFT });
    const beyond = LEFT.right + GUIDE_DELETE_RULER_THRESHOLD_PX + 4;
    expect(isGuideReleaseInsideCanvas(beyond, 400)).toBe(true);
    restore();
  });

  it('ignores proximity for a position outside the top ruler span', () => {
    const restore = installDocument({ hit: { canvasViewport: true }, top: TOP, left: LEFT });
    // Within threshold vertically, but far to the right of the top ruler → commit.
    expect(isGuideReleaseInsideCanvas(5000, TOP.bottom + 1)).toBe(true);
    restore();
  });

  it('falls back to pure hit-test when no ruler geometry is available', () => {
    // No ruler elements present (or jsdom zero-rects) → proximity never fires.
    const restore = installDocument({ hit: { canvasViewport: true } });
    expect(isGuideReleaseInsideCanvas(400, 73)).toBe(true);
    restore();
  });
});

describe('isReleaseWithinRulerDeleteZone — proximity helper', () => {
  const TOP: EdgeRect = { left: 72, top: 60, right: 1296, bottom: 72 };
  const LEFT: EdgeRect = { left: 60, top: 72, right: 72, bottom: 768 };

  it('exposes a positive, sane threshold constant', () => {
    expect(GUIDE_DELETE_RULER_THRESHOLD_PX).toBeGreaterThan(0);
    expect(GUIDE_DELETE_RULER_THRESHOLD_PX).toBeLessThanOrEqual(64);
  });

  it('is true on the top ruler and within the threshold below it', () => {
    const restore = installDocument({ top: TOP, left: LEFT });
    expect(isReleaseWithinRulerDeleteZone(400, 66)).toBe(true);
    expect(isReleaseWithinRulerDeleteZone(400, TOP.bottom + GUIDE_DELETE_RULER_THRESHOLD_PX)).toBe(true);
    expect(isReleaseWithinRulerDeleteZone(400, TOP.bottom + GUIDE_DELETE_RULER_THRESHOLD_PX + 1)).toBe(false);
    restore();
  });

  it('is true on the left ruler and within the threshold to its right', () => {
    const restore = installDocument({ top: TOP, left: LEFT });
    expect(isReleaseWithinRulerDeleteZone(66, 400)).toBe(true);
    expect(isReleaseWithinRulerDeleteZone(LEFT.right + GUIDE_DELETE_RULER_THRESHOLD_PX, 400)).toBe(true);
    expect(isReleaseWithinRulerDeleteZone(LEFT.right + GUIDE_DELETE_RULER_THRESHOLD_PX + 1, 400)).toBe(false);
    restore();
  });

  it('is false deep inside the stage', () => {
    const restore = installDocument({ top: TOP, left: LEFT });
    expect(isReleaseWithinRulerDeleteZone(400, 400)).toBe(false);
    restore();
  });

  it('honors a custom threshold override', () => {
    const restore = installDocument({ top: TOP, left: LEFT });
    expect(isReleaseWithinRulerDeleteZone(400, TOP.bottom + 30, 40)).toBe(true);
    expect(isReleaseWithinRulerDeleteZone(400, TOP.bottom + 30, 20)).toBe(false);
    restore();
  });
});
