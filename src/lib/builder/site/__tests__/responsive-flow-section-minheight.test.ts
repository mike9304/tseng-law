import { describe, expect, it } from 'vitest';
import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasNode,
} from '@/lib/builder/canvas/types';
import { buildResponsiveStylesheet } from '@/lib/builder/site/responsive-stylesheet';

const flowSection = {
  id: 'flow-section',
  kind: 'composite',
  rect: { x: 0, y: 0, width: 1280, height: 640 },
  content: { componentKey: 'hero-search', config: {} },
  style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
  zIndex: 1,
  rotation: 0,
  locked: false,
  visible: true,
  responsive: {
    mobile: {
      rect: { x: 0, y: 0, width: 375, height: 220 },
    },
  },
} satisfies BuilderCanvasNode;

const absoluteWidget = {
  id: 'absolute-widget',
  kind: 'container',
  rect: { x: 12, y: 24, width: 240, height: 80 },
  content: {
    label: 'absolute widget',
    background: 'transparent',
    borderColor: '#cbd5e1',
    borderStyle: 'solid',
    borderWidth: 0,
    borderRadius: 0,
    padding: 0,
    layoutMode: 'absolute',
    as: 'div',
  },
  style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
  zIndex: 2,
  rotation: 0,
  locked: false,
  visible: true,
  responsive: {
    mobile: {
      rect: { x: 16, y: 48, width: 220, height: 120 },
    },
  },
} satisfies BuilderCanvasNode;

describe('published responsive flow section sizing', () => {
  it('keeps top-level flow section mobile heights as minimums while absolute widgets stay pinned', () => {
    const css = buildResponsiveStylesheet([flowSection, absoluteWidget]);

    const flowRules = css.split('\n').filter((line) => line.includes('[data-node-id="flow-section"]'));
    const widgetRules = css.split('\n').filter((line) => line.includes('[data-node-id="absolute-widget"]'));

    expect(flowRules.some((line) => line.includes('min-height: 220px !important'))).toBe(true);
    expect(flowRules.some((line) => /(^|;\s)height: 220px !important/.test(line))).toBe(false);
    expect(flowRules.some((line) => line.includes('position: absolute'))).toBe(false);
    expect(flowRules.some((line) => line.includes('left:'))).toBe(false);
    expect(flowRules.some((line) => line.includes('top:') && !line.includes('margin-top'))).toBe(false);

    expect(widgetRules.some((line) => line.includes('position: absolute !important'))).toBe(true);
    expect(widgetRules.some((line) => /(^|;\s)height: 120px !important/.test(line))).toBe(true);
  });
});
