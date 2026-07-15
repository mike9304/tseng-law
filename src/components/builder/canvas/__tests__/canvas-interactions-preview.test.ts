import { describe, expect, it, vi } from 'vitest';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  createSnapCandidateEdges,
  createSnapEdgeScratch,
  writeSnapFromEdges,
} from '@/lib/builder/canvas/snap';
import {
  clampAspectRect,
  createMoveInteractionCandidates,
  findContainerHitCandidateForPoint,
  rectIntersectionArea,
  resolveMaxOverlapSectionId,
  writeClampedAspectRect,
  writeClampedRect,
  writeClampedMoveRect,
  writeLocalClampedRectForParent,
  writeResizeDraftRect,
} from '../canvasInteraction';
import {
  areAlignmentGuidesEqual,
  areCanvasRectsEqual,
  areDirectMoveFrameInputsEqual,
  areInteractionPointersEqual,
  buildMoveStartRectRecords,
  buildResizeSnapRects,
  canUseDirectMovePreview,
  createResizePreviewStateSnapshot,
  getDirectMovePreviewTranslate,
  getDirectResizePreviewStyles,
  getMoveSnapCandidateNodes,
  getUnlockedMoveNodeIds,
  isReusablePreviewElement,
  isMoveActivationDistanceMet,
  resolvePendingMoveAbsoluteRect,
  resolvePendingMoveHoverContainerId,
  resolveInitialMoveContainerHit,
  resolvePreferredMoveContainerHit,
  resolveSelectedDomMoveTargetId,
  resolveUnactivatedMoveSelectionId,
  canFreeMoveNodeOnDesktop,
  resolveTopLevelAncestorId,
  collectTopLevelSectionHitRects,
  isSameMoveSelection,
} from '../hooks/useCanvasInteractions';

type TestNodeOverrides = Partial<Omit<BuilderCanvasNode, 'content'>> & {
  content?: Record<string, unknown>;
};

function node(overrides: TestNodeOverrides): BuilderCanvasNode {
  return {
    id: 'node',
    kind: 'text',
    rect: { x: 0, y: 0, width: 320, height: 120 },
    content: { text: 'Node' },
    style: {},
    zIndex: 0,
    visible: true,
    ...overrides,
  } as BuilderCanvasNode;
}

function moveInteraction(nodeIds: string[]) {
  return {
    type: 'move',
    nodeId: nodeIds[0] ?? 'missing',
    nodeIds,
    nodeIdSet: new Set(nodeIds),
    canDirectPreview: true,
    viewport: 'desktop',
    pointerId: 1,
    originX: 0,
    originY: 0,
    startParentId: null,
    startRects: {},
    startAbsoluteRects: {},
    snapBounds: { x: 0, y: 0, width: 1280, height: 1200 },
    snapRects: [],
    snapEdges: [],
    containerHitRects: [],
  };
}

describe('canvas direct move preview', () => {
  it('writes clamped move rects into a reusable target object', () => {
    const target = { x: 0, y: 0, width: 0, height: 0 };
    const result = writeClampedMoveRect(
      target,
      { x: 10.4, y: 20.6, width: 100.2, height: 50.1 },
      15.2,
      -5.1,
      300,
      200,
    );

    expect(result).toBe(target);
    expect(result).toEqual({ x: 26, y: 16, width: 100, height: 50 });

    const result2 = writeClampedMoveRect(
      target,
      { x: 260, y: 190, width: 80, height: 30 },
      20,
      20,
      300,
      200,
    );

    expect(result2).toBe(target);
    expect(result2).toEqual({ x: 220, y: 160, width: 80, height: 40 });
  });

  it('writes local snapped move rects into a reusable target object', () => {
    const target = { x: 0, y: 0, width: 0, height: 0 };
    const changed = writeLocalClampedRectForParent(
      target,
      { x: 180.4, y: 246.6, width: 100.2, height: 50.1 },
      { x: 100, y: 200, width: 240, height: 160 },
      240,
      160,
    );

    expect(changed).toBe(true);
    expect(target).toEqual({ x: 80, y: 47, width: 100, height: 50 });

    const unchanged = writeLocalClampedRectForParent(
      target,
      { x: 180.4, y: 246.6, width: 100.2, height: 50.1 },
      { x: 100, y: 200, width: 240, height: 160 },
      240,
      160,
    );

    expect(unchanged).toBe(false);
    expect(target).toEqual({ x: 80, y: 47, width: 100, height: 50 });
  });

  it('preserves first-frame snap guides when converting direct move previews back to local rects', () => {
    const absolutePreviewRect = { x: 184, y: 264, width: 100, height: 80 };
    const snappedAbsoluteRect = { ...absolutePreviewRect };
    const guides = writeSnapFromEdges(
      snappedAbsoluteRect,
      absolutePreviewRect,
      createSnapCandidateEdges([{ x: 100, y: 200, width: 80, height: 60 }]),
      0,
      { width: 1280, height: 1200 },
      [],
      createSnapEdgeScratch(),
    );

    const localPreviewRect = { x: 0, y: 0, width: 0, height: 0 };
    const changed = writeLocalClampedRectForParent(
      localPreviewRect,
      snappedAbsoluteRect,
      { x: 100, y: 200, width: 500, height: 400 },
      500,
      400,
    );

    expect(snappedAbsoluteRect).toEqual({ x: 180, y: 260, width: 100, height: 80 });
    expect(changed).toBe(true);
    expect(localPreviewRect).toEqual({ x: 80, y: 60, width: 100, height: 80 });
    expect(guides).toEqual(expect.arrayContaining([
      expect.objectContaining({ axis: 'vertical', position: 180, tone: 'alignment' }),
      expect.objectContaining({ axis: 'horizontal', position: 260, tone: 'alignment' }),
    ]));
  });

  it('allows flow sections to use DOM preview instead of per-frame store updates', () => {
    const section = node({
      id: 'section',
      kind: 'container',
      content: { as: 'section' },
    });
    const nodesById = new Map([[section.id, section]]);

    expect(moveInteraction(['section']).canDirectPreview).toBe(true);
    expect(canUseDirectMovePreview(['section'], nodesById)).toBe(true);
  });

  it('allows children inside flow containers to use DOM preview', () => {
    const parent = node({
      id: 'flow-parent',
      kind: 'container',
      content: { layoutMode: 'flex' },
    });
    const child = node({
      id: 'flow-child',
      parentId: parent.id,
    });
    const nodesById = new Map([
      [parent.id, parent],
      [child.id, child],
    ]);

    expect(moveInteraction(['flow-child']).canDirectPreview).toBe(true);
    expect(canUseDirectMovePreview(['flow-child'], nodesById)).toBe(true);
  });

  it('falls back when the moving node is missing from the captured geometry', () => {
    expect(canUseDirectMovePreview(['missing'], new Map())).toBe(false);
  });

  it('requires every selected move node to exist for direct DOM preview', () => {
    const first = node({ id: 'node-a' });
    const second = node({ id: 'node-b' });
    const nodesById = new Map([
      [first.id, first],
      [second.id, second],
    ]);

    expect(canUseDirectMovePreview(['node-a', 'node-b'], nodesById)).toBe(true);
    expect(canUseDirectMovePreview(['node-a', 'missing'], nodesById)).toBe(false);
  });
});

describe('canvas direct resize preview', () => {
  it('creates immutable resize readout snapshots from reused preview rects', () => {
    const current = { x: 10, y: 20, width: 120, height: 80 };
    const reusedPreview = { x: 10, y: 20, width: 121, height: 80 };
    const nextState = createResizePreviewStateSnapshot(current, reusedPreview);

    expect(nextState).toEqual(reusedPreview);
    expect(nextState).not.toBe(reusedPreview);
    expect(createResizePreviewStateSnapshot(nextState, reusedPreview)).toBeUndefined();
    expect(createResizePreviewStateSnapshot(nextState, null)).toBeNull();
    expect(createResizePreviewStateSnapshot(null, null)).toBeUndefined();
  });

  it('writes resize drafts and clamped previews into reusable target objects', () => {
    const startRect = { x: 10, y: 20, width: 120, height: 80 };
    const draft = { x: 0, y: 0, width: 0, height: 0 };
    const preview = { x: 0, y: 0, width: 0, height: 0 };

    const nextDraft = writeResizeDraftRect(draft, startRect, 'se', 15.2, 25.6, false);

    expect(nextDraft).toBe(draft);
    expect(nextDraft).toEqual({ x: 10, y: 20, width: 135.2, height: 105.6 });
    expect(writeClampedRect(preview, nextDraft, 300, 200)).toBe(true);
    expect(preview).toEqual({ x: 10, y: 20, width: 135, height: 106 });
    expect(writeClampedRect(preview, nextDraft, 300, 200)).toBe(false);
  });

  it('allows desktop free-resize previews to overflow parent bounds', () => {
    const preview = { x: 0, y: 0, width: 0, height: 0 };

    expect(writeClampedRect(
      preview,
      { x: 0, y: 20, width: 780 + 48, height: 120 },
      780,
      200,
      true,
    )).toBe(true);
    expect(preview).toEqual({ x: 0, y: 20, width: 828, height: 120 });

    expect(writeClampedAspectRect(
      preview,
      { x: 0, y: 20, width: 900, height: 180 },
      { x: 0, y: 20, width: 780, height: 156 },
      'se',
      780,
      200,
      true,
    )).toBe(true);
    expect(preview.width).toBe(900);
    expect(preview.height).toBe(180);
  });

  it('writes aspect-ratio resize previews without allocating the clamp result', () => {
    const startRect = { x: 10, y: 20, width: 120, height: 60 };
    const draft = { x: 0, y: 0, width: 0, height: 0 };
    const preview = { x: 0, y: 0, width: 0, height: 0 };

    const nextDraft = writeResizeDraftRect(draft, startRect, 'nw', -20, -10, true);
    const expected = clampAspectRect(nextDraft, startRect, 'nw', 300, 200);

    expect(nextDraft).toBe(draft);
    expect(writeClampedAspectRect(preview, nextDraft, startRect, 'nw', 300, 200)).toBe(true);
    expect(preview).toEqual(expected);
    expect(writeClampedAspectRect(preview, nextDraft, startRect, 'nw', 300, 200)).toBe(false);
  });
});

describe('canvas move selection refresh', () => {
  it('detects when drag start can reuse the existing selection', () => {
    expect(isSameMoveSelection(['node-a'], 'node-a', ['node-a'], 'node-a')).toBe(true);
    expect(isSameMoveSelection(['node-a', 'node-b'], 'node-b', ['node-a', 'node-b'], 'node-b')).toBe(true);
  });

  it('refreshes selection when order, size, or primary node changes', () => {
    expect(isSameMoveSelection(['node-a'], 'node-a', ['node-a', 'node-b'], 'node-a')).toBe(false);
    expect(isSameMoveSelection(['node-b', 'node-a'], 'node-a', ['node-a', 'node-b'], 'node-a')).toBe(false);
    expect(isSameMoveSelection(['node-a'], 'node-a', ['node-a'], 'node-b')).toBe(false);
  });

  it('defers exact text selection until a click while preserving selected-parent drag', () => {
    class FakeHTMLElement {
      closest(): unknown {
        return {
          parentElement: {
            closest: () => ({ dataset: { nodeId: 'selected-parent' } }),
          },
        };
      }
    }

    vi.stubGlobal('HTMLElement', FakeHTMLElement);
    try {
      const target = new FakeHTMLElement() as unknown as EventTarget;
      expect(resolveSelectedDomMoveTargetId('text-child', target, false)).toBe('selected-parent');
      expect(resolveUnactivatedMoveSelectionId('text-child', 'selected-parent', 'text')).toBe('text-child');
      expect(resolveUnactivatedMoveSelectionId('heading-child', 'selected-parent', 'heading')).toBe('heading-child');
      expect(resolveUnactivatedMoveSelectionId('button-child', 'selected-parent', 'button')).toBeNull();
      expect(resolveUnactivatedMoveSelectionId('image-child', 'selected-parent', 'image')).toBeNull();
      expect(resolveUnactivatedMoveSelectionId('text-child', 'text-child', 'text')).toBeNull();
      expect(resolveUnactivatedMoveSelectionId('node-b', 'node-b', 'text', {
        pointerType: 'mouse',
        selectedNodeCount: 3,
        moveNodeSelected: true,
      })).toBe('node-b');
      expect(resolveUnactivatedMoveSelectionId('node-b', 'node-b', 'text', {
        pointerType: 'mouse',
        selectedNodeCount: 1,
        moveNodeSelected: true,
      })).toBeNull();
      expect(resolveUnactivatedMoveSelectionId('node-b', 'node-b', 'text', {
        pointerType: 'mouse',
        selectedNodeCount: 3,
        moveNodeSelected: false,
      })).toBeNull();
      expect(resolveUnactivatedMoveSelectionId('node-b', 'node-b', 'text', {
        additive: true,
        pointerType: 'mouse',
        selectedNodeCount: 3,
        moveNodeSelected: true,
      })).toBeNull();
      expect(resolveUnactivatedMoveSelectionId('node-b', 'node-b', 'text', {
        pointerType: 'touch',
        selectedNodeCount: 3,
        moveNodeSelected: true,
      })).toBeNull();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('canvas move activation threshold', () => {
  it('uses squared distance for the 4px drag activation boundary', () => {
    expect(isMoveActivationDistanceMet(2, 3)).toBe(false);
    expect(isMoveActivationDistanceMet(4, 0)).toBe(true);
    expect(isMoveActivationDistanceMet(3, 4)).toBe(true);
  });
});

describe('canvas move start geometry helpers', () => {
  it('uses the active selected set while filtering locked nodes through the node map', () => {
    const unlocked = node({ id: 'node-a', locked: false });
    const locked = node({ id: 'node-b', locked: true });
    const alsoUnlocked = node({ id: 'node-c', locked: false });
    const nodesById = new Map([
      [unlocked.id, unlocked],
      [locked.id, locked],
      [alsoUnlocked.id, alsoUnlocked],
    ]);

    const selectedNodeIdSet = new Set(['node-a', 'node-b']);
    const unlockedSelectedIds = ['node-a', 'node-c'];

    expect(getUnlockedMoveNodeIds('node-a', ['node-a', 'node-b'], selectedNodeIdSet, nodesById)).toEqual(['node-a']);
    expect(getUnlockedMoveNodeIds('node-c', ['node-a', 'node-b'], selectedNodeIdSet, nodesById)).toEqual(['node-c']);
    expect(getUnlockedMoveNodeIds('node-a', unlockedSelectedIds, new Set(unlockedSelectedIds), nodesById)).toBe(unlockedSelectedIds);
  });

  it('builds move start rect records from target ids instead of unrelated nodes', () => {
    const nodeA = node({ id: 'node-a', rect: { x: 10, y: 20, width: 100, height: 80 } });
    const nodeB = node({ id: 'node-b', rect: { x: 30, y: 40, width: 120, height: 90 } });
    const nodesById = new Map([
      [nodeA.id, nodeA],
      [nodeB.id, nodeB],
    ]);
    const absoluteRectById = new Map([
      ['node-b', { x: 300, y: 400, width: 120, height: 90 }],
    ]);

    expect(buildMoveStartRectRecords(['node-a', 'missing', 'node-b'], nodesById, absoluteRectById, 'desktop')).toEqual({
      startAbsoluteRects: {
        'node-a': { x: 10, y: 20, width: 100, height: 80 },
        'node-b': { x: 300, y: 400, width: 120, height: 90 },
      },
      startRects: {
        'node-a': { x: 10, y: 20, width: 100, height: 80 },
        'node-b': { x: 30, y: 40, width: 120, height: 90 },
      },
    });
  });

  it('builds resize snap rects once from visible non-active nodes', () => {
    const resizing = node({ id: 'resizing' });
    const sibling = node({ id: 'sibling', rect: { x: 30, y: 40, width: 120, height: 90 } });
    const hidden = node({ id: 'hidden', visible: false });
    const nodesById = new Map([
      [resizing.id, resizing],
      [sibling.id, sibling],
      [hidden.id, hidden],
    ]);
    const absoluteRectById = new Map([
      [sibling.id, { x: 300, y: 400, width: 120, height: 90 }],
    ]);

    expect(buildResizeSnapRects({
      absoluteRectById,
      nodesById,
      resizingNodeId: resizing.id,
      viewport: 'desktop',
    })).toEqual([
      { x: 300, y: 400, width: 120, height: 90 },
    ]);
  });

  it('can build container hit candidates from a narrowed container list', () => {
    const moving = node({ id: 'moving', parentId: 'parent' });
    const sibling = node({
      id: 'sibling',
      parentId: 'parent',
      rect: { x: 40, y: 50, width: 100, height: 80 },
    });
    const unrelatedContainer = node({
      id: 'unrelated-container',
      kind: 'container',
      rect: { x: 500, y: 40, width: 240, height: 180 },
    });
    const compositeSection = node({
      id: 'composite-section',
      kind: 'composite',
      rect: { x: 0, y: 400, width: 1280, height: 360 },
    });
    const hiddenContainer = node({
      id: 'hidden-container',
      kind: 'container',
      rect: { x: 600, y: 60, width: 240, height: 180 },
      visible: false,
    });
    const absoluteRectById = new Map([
      [sibling.id, { x: 140, y: 150, width: 100, height: 80 }],
      [unrelatedContainer.id, { x: 550, y: 90, width: 240, height: 180 }],
    ]);

    const candidates = createMoveInteractionCandidates({
      activeGroupId: null,
      absoluteRectById,
      containerNodes: [unrelatedContainer, compositeSection, hiddenContainer],
      movingNode: moving,
      movingNodeIds: new Set([moving.id]),
      nodes: [moving, sibling],
      viewport: 'desktop',
    });

    expect(candidates.containerHitRects).toEqual([
      { id: 'unrelated-container', rect: { x: 550, y: 90, width: 240, height: 180 } },
      { id: 'composite-section', rect: { x: 0, y: 400, width: 1280, height: 360 } },
    ]);
    expect(candidates.snapRects).toEqual([
      { x: 140, y: 150, width: 100, height: 80 },
    ]);
    expect(candidates.snapEdges).toEqual([
      { left: 140, right: 240, top: 150, bottom: 230, centerX: 190, centerY: 190 },
    ]);
  });

  it('builds bounded move snap rects and edges in the same candidate pass', () => {
    const moving = node({ id: 'moving' });
    const inside = node({
      id: 'inside',
      rect: { x: 40, y: 50, width: 100, height: 80 },
    });
    const offscreen = node({
      id: 'offscreen',
      rect: { x: 900, y: 50, width: 100, height: 80 },
    });

    const candidates = createMoveInteractionCandidates({
      activeGroupId: null,
      absoluteRectById: new Map(),
      movingNode: moving,
      movingNodeIds: new Set([moving.id]),
      nodes: [moving, inside, offscreen],
      snapBounds: { x: 0, y: 0, width: 300, height: 300 },
      viewport: 'desktop',
    });

    expect(candidates.snapRects).toEqual([
      { x: 40, y: 50, width: 100, height: 80 },
    ]);
    expect(candidates.snapEdges).toEqual([
      { left: 40, right: 140, top: 50, bottom: 130, centerX: 90, centerY: 90 },
    ]);
  });

  it('reuses the previous container hit before scanning the full candidate list', () => {
    const outer = { id: 'outer', rect: { x: 0, y: 0, width: 800, height: 600 } };
    const inner = { id: 'inner', rect: { x: 200, y: 120, width: 220, height: 180 } };
    const candidates = [outer, inner];

    expect(findContainerHitCandidateForPoint(260, 160, candidates)).toBe(outer);
    expect(findContainerHitCandidateForPoint(260, 160, candidates, inner)).toBe(inner);
    expect(findContainerHitCandidateForPoint(900, 900, candidates, inner)).toBe(null);
  });

  it('seeds nested moves with their current parent instead of the outermost hit candidate', () => {
    const outer = { id: 'outer', rect: { x: 0, y: 0, width: 800, height: 600 } };
    const parent = { id: 'parent', rect: { x: 200, y: 120, width: 220, height: 180 } };
    const candidates = [outer, parent];

    expect(resolveInitialMoveContainerHit(candidates, 'parent')).toBe(parent);
    expect(resolveInitialMoveContainerHit(candidates, 'missing')).toBeNull();
    expect(resolveInitialMoveContainerHit(candidates, null)).toBeNull();
    expect(findContainerHitCandidateForPoint(260, 160, candidates, parent)).toBe(parent);
  });

  it('revalidates the current parent at the snapped boundary instead of keeping an outer ancestor sticky', () => {
    const rootNode = node({ id: 'home-hero-root', kind: 'container' });
    const wrapperNode = node({ id: 'home-hero-search-wrapper', kind: 'container', parentId: rootNode.id });
    const parentNode = node({ id: 'home-hero-search-container', kind: 'container', parentId: wrapperNode.id });
    const movedNode = node({ id: 'home-hero-search-wrap', kind: 'container', parentId: parentNode.id });
    const nodesById = new Map([rootNode, wrapperNode, parentNode, movedNode].map((item) => [item.id, item]));
    const rootHit = { id: rootNode.id, rect: { x: 0, y: 0, width: 1280, height: 788 } };
    const parentHit = { id: parentNode.id, rect: { x: 51, y: 618, width: 760, height: 62 } };
    const containerHitRects = [rootHit, parentHit];
    const preferredContainerHit = resolvePreferredMoveContainerHit({
      containerHitRects,
      currentHoveredContainerHit: rootHit,
      nodesById,
      startParentId: parentNode.id,
    });

    expect(preferredContainerHit).toBe(parentHit);
    expect(resolvePendingMoveHoverContainerId({
      containerHitRects,
      parentAbsoluteRect: parentHit.rect,
      preferredContainerHit,
      rect: { x: 54, y: 31, width: 760, height: 62 },
    })).toBe(parentNode.id);
  });

  it('resolves pending local move rects against parent absolute rects for drop hover', () => {
    const parentRect = { x: 120, y: 80, width: 640, height: 480 };
    const localRect = { x: 180, y: 140, width: 100, height: 80 };
    const outer = { id: 'outer', rect: { x: 0, y: 0, width: 900, height: 700 } };
    const inner = { id: 'inner', rect: { x: 260, y: 180, width: 260, height: 180 } };
    const candidates = [outer, inner];

    expect(resolvePendingMoveAbsoluteRect(localRect, parentRect)).toEqual({
      x: 300,
      y: 220,
      width: 100,
      height: 80,
    });
    expect(resolvePendingMoveHoverContainerId({
      containerHitRects: candidates,
      parentAbsoluteRect: parentRect,
      preferredContainerHit: inner,
      rect: localRect,
    })).toBe('inner');
  });

  it('narrows move snap candidates to the current parent or active group scope', () => {
    const rootA = node({ id: 'root-a' });
    const rootB = node({ id: 'root-b' });
    const parent = node({ id: 'parent', kind: 'container' });
    const activeGroup = node({ id: 'active-group', kind: 'container' });
    const childA = node({ id: 'child-a', parentId: parent.id });
    const childB = node({ id: 'child-b', parentId: parent.id });
    const hiddenChild = node({ id: 'child-hidden', parentId: parent.id, visible: false });
    const groupChild = node({ id: 'group-child', parentId: activeGroup.id });
    const nodes = [rootA, rootB, parent, activeGroup, childA, childB, hiddenChild, groupChild];
    const nodesById = new Map(nodes.map((candidate) => [candidate.id, candidate]));
    const childrenMap = {
      [parent.id]: [childA.id, hiddenChild.id, childB.id],
      [activeGroup.id]: [groupChild.id],
    };
    const rootVisibleNodes = [rootA, rootB, parent, activeGroup];
    const ids = (candidates: BuilderCanvasNode[]) => candidates.map((candidate) => candidate.id);

    expect(ids(getMoveSnapCandidateNodes({
      activeGroupId: null,
      childrenMap,
      movingNode: rootA,
      nodesById,
      rootVisibleNodes,
    }))).toEqual(['root-a', 'root-b', 'parent', 'active-group']);

    expect(ids(getMoveSnapCandidateNodes({
      activeGroupId: null,
      childrenMap,
      movingNode: childA,
      nodesById,
      rootVisibleNodes,
    }))).toEqual(['child-a', 'child-b']);

    expect(ids(getMoveSnapCandidateNodes({
      activeGroupId: activeGroup.id,
      childrenMap,
      movingNode: childA,
      nodesById,
      rootVisibleNodes,
    }))).toEqual(['group-child']);
  });
});

describe('canvas direct preview element cache', () => {
  function elementFor(nodeId: string, isConnected = true): HTMLElement {
    return {
      isConnected,
      getAttribute: (name: string) => (name === 'data-node-id' ? nodeId : null),
    } as unknown as HTMLElement;
  }

  it('reuses cached elements only while connected to the same canvas node', () => {
    expect(isReusablePreviewElement(elementFor('node-a'), 'node-a')).toBe(true);
    expect(isReusablePreviewElement(elementFor('node-b'), 'node-a')).toBe(false);
    expect(isReusablePreviewElement(elementFor('node-a', false), 'node-a')).toBe(false);
    expect(isReusablePreviewElement(null, 'node-a')).toBe(false);
  });
});

describe('canvas interaction state churn guards', () => {
  it('detects unchanged alignment guide arrays without changing order semantics', () => {
    const guides = [
      { axis: 'vertical' as const, position: 100, from: 20, to: 200, tone: 'alignment' as const },
      { axis: 'horizontal' as const, position: 240, from: 40, to: 320, tone: 'spacing' as const, label: '24px' },
    ];

    expect(areAlignmentGuidesEqual(guides, guides)).toBe(true);
    expect(areAlignmentGuidesEqual(guides, [
      { axis: 'vertical', position: 100, from: 20, to: 200, tone: 'alignment' },
      { axis: 'horizontal', position: 240, from: 40, to: 320, tone: 'spacing', label: '24px' },
    ])).toBe(true);
    expect(areAlignmentGuidesEqual(guides, [
      { axis: 'horizontal', position: 240, from: 40, to: 320, tone: 'spacing', label: '24px' },
      { axis: 'vertical', position: 100, from: 20, to: 200, tone: 'alignment' },
    ])).toBe(false);
    expect(areAlignmentGuidesEqual(guides, [
      { axis: 'vertical', position: 100, from: 20, to: 200, tone: 'alignment' },
      { axis: 'horizontal', position: 240, from: 40, to: 320, tone: 'spacing', label: '25px' },
    ])).toBe(false);
  });

  it('detects unchanged resize preview rects', () => {
    const rect = { x: 10, y: 20, width: 300, height: 120 };

    expect(areCanvasRectsEqual(rect, rect)).toBe(true);
    expect(areCanvasRectsEqual(rect, { ...rect })).toBe(true);
    expect(areCanvasRectsEqual(rect, { ...rect, x: 11 })).toBe(false);
    expect(areCanvasRectsEqual(rect, null)).toBe(false);
    expect(areCanvasRectsEqual(null, null)).toBe(true);
  });

  it('detects unchanged interaction pointer positions', () => {
    const pointer = { x: 10, y: 20 };

    expect(areInteractionPointersEqual(pointer, pointer)).toBe(true);
    expect(areInteractionPointersEqual(pointer, { ...pointer })).toBe(true);
    expect(areInteractionPointersEqual(pointer, { ...pointer, y: 21 })).toBe(false);
    expect(areInteractionPointersEqual(pointer, null)).toBe(false);
    expect(areInteractionPointersEqual(undefined, undefined)).toBe(true);
  });
});

describe('canvas direct preview DOM write guards', () => {
  it('treats repeated rounded direct move frames as unchanged', () => {
    const frame = {
      pointerId: 1,
      nodeId: 'node-a',
      x: 25,
      y: 13,
      width: 100,
      height: 80,
    };

    expect(areDirectMoveFrameInputsEqual(
      frame,
      1,
      'node-a',
      { x: 24.6, y: 13.4, width: 100.2, height: 79.8 },
    )).toBe(true);
    expect(areDirectMoveFrameInputsEqual(
      frame,
      1,
      'node-a',
      { x: 25.6, y: 13.4, width: 100.2, height: 79.8 },
    )).toBe(false);
    expect(areDirectMoveFrameInputsEqual(
      frame,
      2,
      'node-a',
      { x: 24.6, y: 13.4, width: 100.2, height: 79.8 },
    )).toBe(false);
    expect(areDirectMoveFrameInputsEqual(null, 1, 'node-a', frame)).toBe(false);
  });

  it('builds stable translate values for move preview comparisons', () => {
    expect(
      getDirectMovePreviewTranslate(
        { x: 10, y: 20, width: 100, height: 80 },
        { x: 25, y: 12, width: 100, height: 80 },
      ),
    ).toBe('15px -8px');
  });

  it('builds stable resize style snapshots for write comparisons', () => {
    expect(getDirectResizePreviewStyles({ x: 10, y: 20, width: 300, height: 120 })).toEqual({
      height: '120px',
      left: '10px',
      top: '20px',
      width: '300px',
    });
  });
});

describe('canvas free move + cross-section reparent (Wix parity)', () => {
  it('writeClampedMoveRect keeps the historical in-bounds clamp by default', () => {
    const target = { x: 0, y: 0, width: 0, height: 0 };
    const clamped = writeClampedMoveRect(
      target,
      { x: 100, y: 700, width: 360, height: 56 },
      0,
      400,
      1280,
      820,
    );
    // y = 700 + 400 = 1100 → clamped to stageHeight - height = 820 - 56 = 764.
    expect(clamped).toEqual({ x: 100, y: 764, width: 360, height: 56 });
  });

  it('writeClampedMoveRect allows overhang and does not shrink oversize nodes under allowOverflow', () => {
    const free = writeClampedMoveRect(
      { x: 0, y: 0, width: 0, height: 0 },
      { x: 100, y: 700, width: 1400, height: 56 },
      0,
      400,
      1280,
      820,
      true,
    );
    // Position unclamped (y = 1100) and width NOT shrunk to the 1280 parent width.
    expect(free).toEqual({ x: 100, y: 1100, width: 1400, height: 56 });
  });

  it('rectIntersectionArea returns overlap area and 0 when disjoint', () => {
    expect(rectIntersectionArea(
      { x: 0, y: 0, width: 100, height: 100 },
      { x: 50, y: 50, width: 100, height: 100 },
    )).toBe(2500);
    expect(rectIntersectionArea(
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 100, y: 100, width: 10, height: 10 },
    )).toBe(0);
  });

  it('resolveMaxOverlapSectionId picks the section with the bigger overlap', () => {
    const sections = [
      { id: 'hero', rect: { x: 0, y: 0, width: 1280, height: 820 } },
      { id: 'insights', rect: { x: 0, y: 820, width: 1280, height: 780 } },
    ];
    // Node spanning y 750..1000: 70px into hero, 180px into insights → insights wins.
    expect(resolveMaxOverlapSectionId({ x: 0, y: 750, width: 1280, height: 250 }, sections)).toBe('insights');
    // Fully above both → null.
    expect(resolveMaxOverlapSectionId({ x: 0, y: -400, width: 1280, height: 100 }, sections)).toBe(null);
  });

  it('canFreeMoveNodeOnDesktop is true only for desktop absolute widgets', () => {
    const section = node({ id: 'sec', kind: 'composite' });
    const heroSection = node({
      id: 'home-hero-root',
      kind: 'container',
      content: { as: 'section', layoutMode: 'absolute' },
    });
    const absParent = node({ id: 'abs-parent', kind: 'container', content: { layoutMode: 'absolute' } });
    const flexParent = node({ id: 'flex-parent', kind: 'container', content: { layoutMode: 'flex' } });
    const absChild = node({ id: 'abs-child', parentId: 'abs-parent' });
    const heroSearch = node({ id: 'home-hero-search-wrapper', parentId: 'home-hero-root' });
    const flexChild = node({ id: 'flex-child', parentId: 'flex-parent' });
    const nodesById = new Map([section, heroSection, absParent, flexParent, absChild, heroSearch, flexChild].map((n) => [n.id, n]));

    expect(canFreeMoveNodeOnDesktop(absChild, nodesById, 'desktop')).toBe(true);
    expect(canFreeMoveNodeOnDesktop(heroSearch, nodesById, 'desktop')).toBe(true);
    expect(canFreeMoveNodeOnDesktop(flexChild, nodesById, 'desktop')).toBe(false);
    expect(canFreeMoveNodeOnDesktop(section, nodesById, 'desktop')).toBe(false);
    expect(canFreeMoveNodeOnDesktop(absChild, nodesById, 'tablet')).toBe(false);
    expect(canFreeMoveNodeOnDesktop(absChild, nodesById, 'mobile')).toBe(false);
  });

  it('keeps a desktop absolute section child free beyond the parent bottom during preview', () => {
    const hero = node({
      id: 'home-hero-root',
      kind: 'container',
      rect: { x: 0, y: 0, width: 1280, height: 820 },
      content: { as: 'section', layoutMode: 'absolute' },
    });
    const search = node({
      id: 'home-hero-search-wrapper',
      parentId: 'home-hero-root',
      kind: 'container',
      rect: { x: 0, y: 618, width: 1280, height: 62 },
    });
    const nodesById = new Map([hero, search].map((n) => [n.id, n]));
    const target = { x: 0, y: 0, width: 0, height: 0 };
    const changed = writeLocalClampedRectForParent(
      target,
      { x: 0, y: 1820, width: 1280, height: 62 },
      hero.rect,
      hero.rect.width,
      hero.rect.height,
      canFreeMoveNodeOnDesktop(search, nodesById, 'desktop'),
    );

    expect(changed).toBe(true);
    expect(target).toEqual({ x: 0, y: 1820, width: 1280, height: 62 });
  });

  it('resolveTopLevelAncestorId walks up to the root section', () => {
    const root = node({ id: 'root', kind: 'composite' });
    const mid = node({ id: 'mid', parentId: 'root', kind: 'container' });
    const leaf = node({ id: 'leaf', parentId: 'mid' });
    const nodesById = new Map([root, mid, leaf].map((n) => [n.id, n]));
    expect(resolveTopLevelAncestorId(leaf, nodesById)).toBe('root');
    expect(resolveTopLevelAncestorId(root, nodesById)).toBe('root');
  });

  it('collectTopLevelSectionHitRects filters hit rects down to top-level sections', () => {
    const secA = node({ id: 'sec-a', kind: 'composite' });
    const secB = node({ id: 'sec-b', kind: 'container', content: { as: 'section' } });
    const inner = node({ id: 'inner', parentId: 'sec-a', kind: 'container' });
    const nodesById = new Map([secA, secB, inner].map((n) => [n.id, n]));
    const hits = [
      { id: 'sec-a', rect: { x: 0, y: 0, width: 10, height: 10 } },
      { id: 'inner', rect: { x: 0, y: 0, width: 5, height: 5 } },
      { id: 'sec-b', rect: { x: 0, y: 10, width: 10, height: 10 } },
    ];
    expect(collectTopLevelSectionHitRects(hits, nodesById).map((h) => h.id)).toEqual(['sec-a', 'sec-b']);
  });

  it('resolvePendingMoveHoverContainerId reparents to the bigger-overlap section only when the gate is on', () => {
    const rect = { x: 0, y: 830, width: 1280, height: 250 };
    const containerHitRects = [
      // A nested container of insights that appears BEFORE the section in doc order.
      { id: 'insights-inner', rect: { x: 0, y: 820, width: 1280, height: 780 } },
      { id: 'insights', rect: { x: 0, y: 820, width: 1280, height: 780 } },
    ];
    const sections = [
      { id: 'hero', rect: { x: 0, y: 0, width: 1280, height: 820 } },
      { id: 'insights', rect: { x: 0, y: 820, width: 1280, height: 780 } },
    ];

    // Gate OFF (historical): center-point over all containers → first match = nested container.
    expect(resolvePendingMoveHoverContainerId({
      containerHitRects,
      parentAbsoluteRect: null,
      preferredContainerHit: null,
      rect,
    })).toBe('insights-inner');

    // Gate ON: cross-section drop resolves to the top-level SECTION with bigger overlap.
    expect(resolvePendingMoveHoverContainerId({
      containerHitRects,
      parentAbsoluteRect: null,
      preferredContainerHit: null,
      rect,
      topLevelSectionHitRects: sections,
      currentTopLevelSectionId: 'hero',
      preferSectionOverlap: true,
    })).toBe('insights');
  });

  it('keeps in-section nested drops on center-point resolution even with the gate on', () => {
    const rect = { x: 0, y: 700, width: 1280, height: 60 }; // fully inside hero
    const containerHitRects = [
      { id: 'hero-inner', rect: { x: 0, y: 0, width: 1280, height: 820 } },
      { id: 'hero', rect: { x: 0, y: 0, width: 1280, height: 820 } },
    ];
    const sections = [
      { id: 'hero', rect: { x: 0, y: 0, width: 1280, height: 820 } },
      { id: 'insights', rect: { x: 0, y: 820, width: 1280, height: 780 } },
    ];
    // Bigger overlap is the CURRENT section (hero) → no cross-reparent → center-point → nested.
    expect(resolvePendingMoveHoverContainerId({
      containerHitRects,
      parentAbsoluteRect: null,
      preferredContainerHit: null,
      rect,
      topLevelSectionHitRects: sections,
      currentTopLevelSectionId: 'hero',
      preferSectionOverlap: true,
    })).toBe('hero-inner');
  });
});
