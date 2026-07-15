import { describe, expect, it } from 'vitest';
import {
  buildCanvasNodeRenderStyles,
  SELECTED_CANVAS_NODE_Z_INDEX_BOOST,
} from '@/components/builder/canvas/CanvasNodeRenderStyles';
import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasNode,
  type BuilderCompositeCanvasNode,
  type BuilderContainerCanvasNode,
} from '@/lib/builder/canvas/types';
import type { BuilderTheme } from '@/lib/builder/site/types';

const stubTheme = {
  colors: {},
  fonts: { heading: 'serif', body: 'sans-serif' },
  radii: { sm: 4, md: 8, lg: 16 },
} as BuilderTheme;

function compositeNode(
  id: string,
  overrides: Partial<BuilderCompositeCanvasNode> = {},
): BuilderCompositeCanvasNode {
  return {
    id,
    kind: 'composite',
    parentId: undefined,
    rect: { x: 0, y: 0, width: 1280, height: 640 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      componentKey: 'hero-search',
      config: {},
    },
    ...overrides,
  } satisfies BuilderCompositeCanvasNode;
}

function hoverableCompositeNode(
  id: string,
  overrides: Partial<BuilderCompositeCanvasNode> = {},
): BuilderCompositeCanvasNode {
  return compositeNode(id, {
    hoverStyle: {
      backgroundColor: '#dbeafe',
      borderColor: '#2563eb',
      shadowBlur: 24,
      shadowColor: 'rgba(37, 99, 235, 0.22)',
      shadowSpread: 0,
      translateY: -4,
      transitionMs: 240,
    },
    ...overrides,
  });
}

function buildStyles(node: BuilderCanvasNode, opts: {
  isTopLevelFlowSection?: boolean;
  isContainerLikeNode?: boolean;
  isAccordionPreviewOpen?: boolean;
  selected?: boolean;
  isHovered?: boolean;
  isEditing?: boolean;
  previewOffsetY?: number;
  selectionZIndexBoost?: number;
} = {}) {
  const {
    isTopLevelFlowSection = true,
    isContainerLikeNode = true,
    isAccordionPreviewOpen = false,
    selected = false,
    isHovered = false,
    isEditing = false,
    previewOffsetY = 0,
    selectionZIndexBoost = 0,
  } = opts;
  return buildCanvasNodeRenderStyles({
    animationPreviewPhase: null,
    effectiveFontSize: undefined,
    effectiveRect: node.rect,
    isActiveGroupFrame: false,
    isContainerLikeNode,
    isContainerWithChildren: true,
    isDimmedRoot: false,
    isEditing,
    isHovered,
    isAccordionPreviewOpen,
    isTextShapedNode: false,
    node,
    officeLayoutDisplay: undefined,
    parentUsesFlowLayout: false,
    isTopLevelFlowSection,
    flowSectionMarginTop: 0,
    flowSectionMinHeight: node.rect.height,
    forceAbsoluteDuringInteraction: false,
    previewExpandedHeight: undefined,
    previewOffsetY,
    selected,
    selectionZIndexBoost,
    theme: stubTheme,
  });
}

function containerNode(
  id: string,
  overrides: Partial<BuilderContainerCanvasNode> = {},
): BuilderContainerCanvasNode {
  return {
    id,
    kind: 'container',
    parentId: 'parent',
    rect: { x: 0, y: 82, width: 1136, height: 40 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label: id,
      background: 'transparent',
      borderColor: '#cbd5e1',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      padding: 0,
      layoutMode: 'absolute',
    },
    ...overrides,
  } satisfies BuilderContainerCanvasNode;
}

// Regression contract for the "half-straddle overlap" design (Wix parity):
// a child that overflows its section's bottom boundary (e.g. home-hero-search-wrapper,
// position:absolute, z-index 271) must render fully and ABOVE the following section's
// background in the editor — matching the published (public-page.tsx) render.
//
// This is only possible when the section wrapper does NOT establish a stacking context
// around its descendants. Two conditions must hold on the section wrapper style:
//   1. overflow: visible  (no clip at the section boundary)
//   2. NO transform value  (a stray `rotate(0deg)` still creates a stacking context that
//      traps the child, letting the next sibling section paint over its bottom)
// Public parity reference: public-page.tsx baseTransform = rotation ? rotate() : undefined.
describe('buildCanvasNodeRenderStyles — section overflow/stacking parity', () => {
  it('a non-rotated top-level flow section does not clip or trap overflowing children', () => {
    const section = compositeNode('home-hero', { rotation: 0 });
    const { bodyStyle, nodeStyle } = buildStyles(section, {
      isContainerLikeNode: false,
      isTopLevelFlowSection: true,
    });

    // (1) never clip at the section boundary
    expect(nodeStyle.overflow).toBe('visible');
    expect(bodyStyle.overflow).toBe('visible');
    // (2) no stacking context via transform — the unconditional `rotate(0deg)` that used
    //     to land here would create one and bury the straddling child.
    expect(nodeStyle.transform).toBeUndefined();
    expect(nodeStyle.transformOrigin).toBeUndefined();
    expect(bodyStyle.height).toBe('100%');
    expect(bodyStyle.minHeight).toBe('inherit');
  });

  it('keeps selected flow sections above adjacent section backgrounds without outranking toolbar chrome', () => {
    const section = compositeNode('home-services-root', { rotation: 0 });
    const { nodeStyle } = buildStyles(section, {
      isContainerLikeNode: false,
      isTopLevelFlowSection: true,
      selected: true,
    });

    expect(nodeStyle.zIndex).toBe(SELECTED_CANVAS_NODE_Z_INDEX_BOOST + 10);
  });

  it('lets selected absolute containers paint above neighboring section backgrounds', () => {
    const node = containerNode('floating-search', {
      parentId: 'home-hero-root',
      zIndex: 2,
    });
    const { nodeStyle } = buildStyles(node, {
      isTopLevelFlowSection: false,
      selected: true,
      selectionZIndexBoost: SELECTED_CANVAS_NODE_Z_INDEX_BOOST,
    });

    expect(nodeStyle.zIndex).toBe(SELECTED_CANVAS_NODE_Z_INDEX_BOOST + 12);
  });

  it('still applies rotation when the section is rotated', () => {
    const section = compositeNode('home-hero', { rotation: 45 });
    const { nodeStyle } = buildStyles(section, { isTopLevelFlowSection: true });

    expect(nodeStyle.transform).toBe('rotate(45deg)');
    expect(nodeStyle.transformOrigin).toBe('center center');
    expect(nodeStyle.overflow).toBe('visible');
  });

  it('preserves preview/accordion translateY offset even at zero rotation', () => {
    const section = compositeNode('home-hero', { rotation: 0 });
    const { nodeStyle } = buildStyles(section, {
      isTopLevelFlowSection: true,
      previewOffsetY: 10,
    });

    expect(nodeStyle.transform).toBe('translateY(10px) rotate(0deg)');
  });

  it('keeps hover styling out of the editing surface so inline text editing stays steady', () => {
    const section = hoverableCompositeNode('home-hero', { rotation: 0 });
    const { bodyStyle } = buildStyles(section, {
      isTopLevelFlowSection: true,
      isHovered: true,
    });
    const { bodyStyle: editingBodyStyle } = buildStyles(section, {
      isTopLevelFlowSection: true,
      isHovered: true,
      isEditing: true,
    });

    expect(bodyStyle.transform).toBe('translateY(-4px)');
    expect(bodyStyle.boxShadow).toContain('rgba(37, 99, 235, 0.22)');
    expect(editingBodyStyle.transform).toBeUndefined();
    expect(editingBodyStyle.boxShadow).toBe('none');
    expect(editingBodyStyle.transition).toBeUndefined();
  });

  it('collapses closed services accordion body nodes without relying on CSS modules', () => {
    const body = containerNode('home-services-card-0-body');
    const { nodeStyle } = buildStyles(body, {
      isTopLevelFlowSection: false,
      isAccordionPreviewOpen: false,
    });

    expect(nodeStyle.height).toBe('0px');
    expect(nodeStyle.overflow).toBe('hidden');
    expect(nodeStyle.display).toBeUndefined();
  });

  it('hides closed services accordion detail nodes without relying on CSS modules', () => {
    const detail = containerNode('home-services-card-0-checklist');
    const { nodeStyle } = buildStyles(detail, {
      isTopLevelFlowSection: false,
      isAccordionPreviewOpen: false,
    });

    expect(nodeStyle.display).toBe('none');
  });

  it('keeps services accordion nodes visible when the editor preview opens them', () => {
    const detail = containerNode('home-services-card-0-checklist');
    const { nodeStyle } = buildStyles(detail, {
      isTopLevelFlowSection: false,
      isAccordionPreviewOpen: true,
    });

    expect(nodeStyle.display).toBeUndefined();
    expect(nodeStyle.height).toBe('40px');
  });

  it('collapses closed FAQ answer wraps without relying on CSS modules', () => {
    const answerWrap = containerNode('home-faq-item-0-answer-wrap', {
      rect: { x: 16, y: 52, width: 1104, height: 56 },
    });
    const { nodeStyle } = buildStyles(answerWrap, {
      isTopLevelFlowSection: false,
      isAccordionPreviewOpen: false,
    });

    expect(nodeStyle.height).toBe('0px');
    expect(nodeStyle.overflow).toBe('hidden');
    expect(nodeStyle.display).toBeUndefined();
  });

  it('hides closed FAQ answer nodes without relying on CSS modules', () => {
    const answer = containerNode('home-faq-item-0-answer', {
      rect: { x: 0, y: 0, width: 1104, height: 56 },
    });
    const { nodeStyle } = buildStyles(answer, {
      isTopLevelFlowSection: false,
      isAccordionPreviewOpen: false,
    });

    expect(nodeStyle.display).toBe('none');
  });

  it('keeps FAQ answer nodes visible when the editor preview opens them', () => {
    const answer = containerNode('home-faq-item-0-answer', {
      rect: { x: 0, y: 0, width: 1104, height: 56 },
    });
    const { nodeStyle } = buildStyles(answer, {
      isTopLevelFlowSection: false,
      isAccordionPreviewOpen: true,
    });

    expect(nodeStyle.display).toBeUndefined();
    expect(nodeStyle.height).toBe('56px');
  });
});

// Regression contract for stacked cross-fade slides (e.g. home-hero-media-image
// is the only opaque hero image; -2/-3 carry style.opacity = 0). A transparent
// wrapper with pointerEvents:auto would sit above the visible slide and intercept
// the user's click, so Playwright (and a real user) cannot reach the visible
// sibling beneath it. The contract: an unselected zero-opacity node lets clicks
// pass through; once selected via the Layers panel it keeps pointer events so its
// resize/move chrome remains usable; a fully visible node is unaffected.
describe('buildCanvasNodeRenderStyles — transparent node pointer pass-through', () => {
  function nodeWithOpacity(opacity: number): BuilderCanvasNode {
    return compositeNode('home-hero-media-image-3', {
      style: { ...createDefaultCanvasNodeStyle(), opacity },
    });
  }

  it('an unselected zero-opacity node does not intercept clicks on the visible sibling beneath it', () => {
    const invisible = nodeWithOpacity(0);
    const { nodeStyle } = buildStyles(invisible, {
      isTopLevelFlowSection: false,
      selected: false,
    });

    expect(nodeStyle.pointerEvents).toBe('none');
  });

  it('a selected zero-opacity node keeps pointer events so its selection chrome stays usable', () => {
    const invisible = nodeWithOpacity(0);
    const { nodeStyle } = buildStyles(invisible, {
      isTopLevelFlowSection: false,
      selected: true,
    });

    expect(nodeStyle.pointerEvents).toBe('auto');
  });

  it('a fully visible node remains interactive', () => {
    const visible = nodeWithOpacity(100);
    const { nodeStyle } = buildStyles(visible, {
      isTopLevelFlowSection: false,
      selected: false,
    });

    expect(nodeStyle.pointerEvents).toBe('auto');
  });
});

// Regression contract for locked decorative nodes (e.g. home-hero-overlay is
// locked: true in the seed). A locked wrapper has no intended direct canvas
// interaction — the CanvasNode event handlers already refuse editing locked
// nodes — so a pointer-capturing wrapper only blocks clicks meant for the
// visible siblings beneath it. Users find/unlock locked nodes via the Layers
// panel, not by clicking the canvas wrapper. The contract: a locked visible
// node never intercepts pointers; an unlocked visible node stays interactive.
describe('buildCanvasNodeRenderStyles — locked node pointer pass-through', () => {
  it('a locked visible node does not intercept clicks on the sibling beneath it', () => {
    const locked = compositeNode('home-hero-overlay', { locked: true });
    const { nodeStyle } = buildStyles(locked, {
      isTopLevelFlowSection: false,
      selected: false,
    });

    expect(nodeStyle.pointerEvents).toBe('none');
  });

  it('an unlocked visible node remains interactive', () => {
    const unlocked = compositeNode('home-hero-overlay', { locked: false });
    const { nodeStyle } = buildStyles(unlocked, {
      isTopLevelFlowSection: false,
      selected: false,
    });

    expect(nodeStyle.pointerEvents).toBe('auto');
  });
});
