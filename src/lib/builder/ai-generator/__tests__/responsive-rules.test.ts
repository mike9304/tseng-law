import { describe, expect, it } from 'vitest';
import {
  scanResponsiveSuggestions,
  defaultSafeWidthFor,
  type ResponsiveTargetViewport,
} from '@/lib/builder/ai-generator/responsive-rules';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

function makeTextNode(overrides: Partial<BuilderCanvasNode> & { id: string; text?: string; fontSize?: number }): BuilderCanvasNode {
  return {
    id: overrides.id,
    kind: 'text',
    rect: overrides.rect ?? { x: 0, y: 0, width: 600, height: 60 },
    style: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: 'transparent',
      opacity: 100,
    },
    zIndex: 0,
    rotation: 0,
    locked: overrides.locked ?? false,
    visible: overrides.visible ?? true,
    content: {
      text: overrides.text ?? 'Hello',
      fontSize: overrides.fontSize ?? 18,
      color: '#000000',
      fontWeight: 'regular',
      align: 'left',
      lineHeight: 1.4,
      letterSpacing: 0,
      fontFamily: 'system-ui',
    },
  } as BuilderCanvasNode;
}

function makeContainerNode(overrides: Partial<BuilderCanvasNode> & { id: string; parentId?: string }): BuilderCanvasNode {
  return {
    id: overrides.id,
    kind: 'container',
    parentId: overrides.parentId,
    rect: overrides.rect ?? { x: 0, y: 0, width: 500, height: 200 },
    style: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: 'transparent',
      opacity: 100,
    },
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label: 'container',
      background: 'transparent',
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      padding: 0,
      layoutMode: 'absolute',
      as: 'div',
    },
  } as BuilderCanvasNode;
}

const MOBILE: ResponsiveTargetViewport = 'mobile';
const TABLET: ResponsiveTargetViewport = 'tablet';

describe('responsive-rules', () => {
  it('exposes the default mobile safe width', () => {
    expect(defaultSafeWidthFor(MOBILE)).toBe(360);
    expect(defaultSafeWidthFor(TABLET)).toBe(720);
  });

  it('suggests a width clamp for text wider than 360px on mobile', () => {
    const node = makeTextNode({ id: 'wide-1', rect: { x: 80, y: 80, width: 800, height: 60 }, text: 'wide text' });
    const result = scanResponsiveSuggestions({
      canvas: { nodes: [node] },
      viewport: MOBILE,
    });
    expect(result).toHaveLength(1);
    expect(result[0].reason).toBe('text-overflows-viewport');
    expect(result[0].mobileOverride.rect?.width).toBe(360);
  });

  it('skips text already narrower than the mobile safe width', () => {
    const node = makeTextNode({ id: 'narrow-1', rect: { x: 10, y: 10, width: 300, height: 40 } });
    const result = scanResponsiveSuggestions({ canvas: { nodes: [node] }, viewport: MOBILE });
    expect(result).toHaveLength(0);
  });

  it('scales fonts above the threshold down on mobile', () => {
    const node = makeTextNode({ id: 'huge-1', fontSize: 56, rect: { x: 0, y: 0, width: 200, height: 80 } });
    const result = scanResponsiveSuggestions({
      canvas: { nodes: [node] },
      viewport: MOBILE,
    });
    const fontSuggestion = result.find((item) => item.reason === 'font-too-large');
    expect(fontSuggestion).toBeDefined();
    expect(fontSuggestion?.mobileOverride.fontSize).toBeLessThan(56);
    expect(fontSuggestion?.mobileOverride.fontSize).toBeGreaterThanOrEqual(14);
  });

  it.skip('applies a gentler font scale on tablet than on mobile', () => {
    const node = makeTextNode({ id: 'huge-2', fontSize: 60, rect: { x: 0, y: 0, width: 200, height: 80 } });
    const mobileResult = scanResponsiveSuggestions({ canvas: { nodes: [node] }, viewport: MOBILE });
    const tabletResult = scanResponsiveSuggestions({ canvas: { nodes: [node] }, viewport: TABLET });
    const mobileFs = mobileResult.find((item) => item.reason === 'font-too-large')?.mobileOverride.fontSize ?? 0;
    const tabletFs = tabletResult.find((item) => item.reason === 'font-too-large')?.mobileOverride.fontSize ?? 0;
    expect(tabletFs).toBeGreaterThan(mobileFs);
  });

  it('stacks two side-by-side containers under a shared parent on mobile', () => {
    const parent = makeContainerNode({ id: 'parent', rect: { x: 0, y: 0, width: 1200, height: 400 } });
    const left = makeContainerNode({ id: 'col-left', parentId: 'parent', rect: { x: 60, y: 40, width: 500, height: 240 } });
    const right = makeContainerNode({ id: 'col-right', parentId: 'parent', rect: { x: 640, y: 40, width: 500, height: 240 } });
    const result = scanResponsiveSuggestions({
      canvas: { nodes: [parent, left, right] },
      viewport: MOBILE,
    });
    const stackSuggestions = result.filter((item) => item.reason === 'side-by-side-stack');
    expect(stackSuggestions).toHaveLength(2);
    const leftStack = stackSuggestions.find((item) => item.nodeId === 'col-left');
    const rightStack = stackSuggestions.find((item) => item.nodeId === 'col-right');
    expect(leftStack?.mobileOverride.rect?.y).toBeLessThan(rightStack?.mobileOverride.rect?.y ?? Number.MAX_VALUE);
    expect(leftStack?.mobileOverride.rect?.width).toBeLessThanOrEqual(360);
  });

  it('ignores locked or hidden nodes', () => {
    const locked = makeTextNode({ id: 'locked-1', locked: true, rect: { x: 0, y: 0, width: 999, height: 80 } });
    const hidden = makeTextNode({ id: 'hidden-1', visible: false, rect: { x: 0, y: 0, width: 999, height: 80 } });
    const result = scanResponsiveSuggestions({ canvas: { nodes: [locked, hidden] }, viewport: MOBILE });
    expect(result).toHaveLength(0);
  });

  it('merges width-clamp and font-scale suggestions for the same node into one entry', () => {
    const node = makeTextNode({ id: 'combo-1', fontSize: 64, rect: { x: 0, y: 0, width: 900, height: 80 } });
    const result = scanResponsiveSuggestions({ canvas: { nodes: [node] }, viewport: MOBILE });
    expect(result).toHaveLength(1);
    expect(result[0].mobileOverride.rect?.width).toBe(360);
    expect(result[0].mobileOverride.fontSize).toBeDefined();
  });
});