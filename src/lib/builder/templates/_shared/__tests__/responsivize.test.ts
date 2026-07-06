import { describe, expect, it } from 'vitest';
import { createDefaultCanvasNodeStyle, type BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { responsivize } from '../responsivize';

describe('responsivize', () => {
  it('preserves authored responsive fields while filling missing generated rect fields', () => {
    const nodes: BuilderCanvasNode[] = [{
      id: 'headline',
      kind: 'heading',
      rect: { x: 10, y: 20, width: 620, height: 90 },
      style: createDefaultCanvasNodeStyle(),
      zIndex: 1,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        text: 'Responsive headline',
        richText: undefined,
        level: 1,
        color: '#123b63',
        fontSize: 48,
        align: 'left',
        lineHeight: 1.4,
      },
      responsive: {
        mobile: {
          hidden: true,
          fontSize: 88,
          rect: { x: 123 },
        },
      },
    }];

    responsivize(nodes);

    const updated = nodes.find((node) => node.id === 'headline');
    if (!updated) throw new Error('headline node missing');

    expect(updated.responsive?.mobile?.hidden).toBe(true);
    expect(updated.responsive?.mobile?.fontSize).toBe(88);
    expect(updated.responsive?.mobile?.rect?.x).toBe(123);
    expect(updated.responsive?.mobile?.rect?.y).toBeDefined();
    expect(updated.responsive?.mobile?.rect?.width).toBeGreaterThan(0);
    expect(updated.responsive?.mobile?.rect?.height).toBeGreaterThan(0);
    expect(updated.responsive?.tablet?.rect?.width).toBeGreaterThan(0);
  });
});
