import { describe, expect, it } from 'vitest';
import {
  createDefaultCanvasNodeStyle,
  normalizeCanvasDocument,
} from '@/lib/builder/canvas/types';
import {
  resolveViewportFontSize,
  resolveViewportHidden,
  resolveViewportRect,
} from '@/lib/builder/canvas/responsive';

describe('M07 responsive schema lock', () => {
  it('keeps viewport overrides under responsive.<viewport> and cascades to mobile', () => {
    const normalized = normalizeCanvasDocument({
      version: 1,
      locale: 'ko',
      updatedAt: '2026-05-10T00:00:00.000Z',
      updatedBy: 'm07-test',
      stageWidth: 1280,
      stageHeight: 880,
      nodes: [
        {
          id: 'text-1',
          kind: 'text',
          rect: { x: 100, y: 120, width: 360, height: 80 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 0,
          rotation: 0,
          locked: false,
          visible: true,
          hiddenOnViewports: ['mobile'],
          responsive: {
            tablet: {
              rect: { x: 32, width: 640 },
              fontSize: 28,
            },
            mobile: {
              rect: { x: 16, width: 343 },
              hidden: true,
            },
          },
          content: {
            text: 'Responsive text',
            fontSize: 36,
            color: '#0f172a',
            fontWeight: 'regular',
            align: 'left',
            lineHeight: 1.25,
            letterSpacing: 0,
            fontFamily: 'system-ui',
          },
        },
      ],
    }, 'ko');

    const node = normalized.nodes[0]!;
    expect('hiddenOnViewports' in node).toBe(false);
    expect(node.responsive?.tablet?.fontSize).toBe(28);
    expect(node.responsive?.mobile?.hidden).toBe(true);
    expect(resolveViewportFontSize(node, 'desktop')).toBe(36);
    expect(resolveViewportFontSize(node, 'tablet')).toBe(28);
    expect(resolveViewportFontSize(node, 'mobile')).toBe(28);
    expect(resolveViewportHidden(node, 'desktop')).toBe(false);
    expect(resolveViewportHidden(node, 'tablet')).toBe(false);
    expect(resolveViewportHidden(node, 'mobile')).toBe(true);
    expect(resolveViewportRect(node, 'mobile')).toMatchObject({
      x: 16,
      y: 120,
      width: 343,
      height: 80,
    });
  });
});
