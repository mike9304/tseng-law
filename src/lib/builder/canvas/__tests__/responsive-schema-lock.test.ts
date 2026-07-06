import { describe, expect, it } from 'vitest';
import {
  createDefaultCanvasNodeStyle,
  normalizeCanvasDocument,
} from '@/lib/builder/canvas/types';
import {
  autoFitMobileTree,
  resolveViewportFontSize,
  resolveViewportHidden,
  resolveViewportRect,
} from '@/lib/builder/canvas/responsive';

describe('M07 responsive schema lock', () => {
  it('sanitizes legacy zero responsive rect dimensions instead of falling back', () => {
    const normalized = normalizeCanvasDocument({
      version: 1,
      locale: 'ko',
      updatedAt: '2026-05-10T00:00:00.000Z',
      updatedBy: 'm07-legacy-zero-test',
      stageWidth: 1280,
      stageHeight: 320,
      nodes: [
        {
          id: 'legacy-zero-responsive-node',
          kind: 'container',
          rect: { x: 0, y: 0, width: 1280, height: 240 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 0,
          rotation: 0,
          locked: false,
          visible: true,
          responsive: {
            tablet: { rect: { x: 0, y: 0, width: 0, height: 0 } },
            mobile: { rect: { x: 0, y: 0, width: 0, height: 0 } },
          },
          content: {
            label: 'Legacy zero responsive node',
            background: 'transparent',
            borderColor: 'transparent',
            borderStyle: 'solid',
            borderWidth: 0,
            borderRadius: 0,
            padding: 0,
          },
        },
      ],
    }, 'ko');

    const node = normalized.nodes.find((entry) => entry.id === 'legacy-zero-responsive-node');
    expect(normalized.nodes).toHaveLength(1);
    expect(node?.responsive?.tablet?.rect).toMatchObject({ width: 1, height: 1 });
    expect(node?.responsive?.mobile?.rect).toMatchObject({ width: 1, height: 1 });
  });

  it('preserves negative local rect coordinates for section-overhang desktop nodes', () => {
    const normalized = normalizeCanvasDocument({
      version: 1,
      locale: 'ko',
      updatedAt: '2026-07-06T00:00:00.000Z',
      updatedBy: 'desktop-overhang-test',
      stageWidth: 1280,
      stageHeight: 880,
      nodes: [
        {
          id: 'section',
          kind: 'container',
          rect: { x: 0, y: 820, width: 1280, height: 420 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 0,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            label: 'Section',
            background: 'transparent',
            borderColor: 'transparent',
            borderStyle: 'solid',
            borderWidth: 0,
            borderRadius: 0,
            padding: 0,
            as: 'section',
          },
        },
        {
          id: 'overhanging-search',
          parentId: 'section',
          kind: 'container',
          rect: { x: 80, y: -36, width: 760, height: 72 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 1,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            label: 'Overhanging search',
            background: 'transparent',
            borderColor: 'transparent',
            borderStyle: 'solid',
            borderWidth: 0,
            borderRadius: 0,
            padding: 0,
          },
        },
      ],
    }, 'ko');

    expect(normalized.nodes.find((entry) => entry.id === 'overhanging-search')?.rect).toMatchObject({
      x: 80,
      y: -36,
      width: 760,
      height: 72,
    });
  });

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

describe('M09 mobile auto-fit', () => {
  it('stacks root sections and scales descendants without replacing explicit mobile overrides', () => {
    const containerContent = (label: string) => ({
      label,
      background: 'transparent',
      borderColor: 'transparent',
      borderStyle: 'solid' as const,
      borderWidth: 0,
      borderRadius: 0,
      padding: 0,
    });
    const normalized = normalizeCanvasDocument({
      version: 1,
      locale: 'ko',
      updatedAt: '2026-05-10T00:00:00.000Z',
      updatedBy: 'm09-test',
      stageWidth: 1280,
      stageHeight: 900,
      nodes: [
        {
          id: 'section-a',
          kind: 'container',
          rect: { x: 0, y: 0, width: 1280, height: 400 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 0,
          rotation: 0,
          locked: false,
          visible: true,
          content: containerContent('Section A'),
        },
        {
          id: 'section-a-title',
          kind: 'text',
          parentId: 'section-a',
          rect: { x: 80, y: 80, width: 640, height: 80 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 0,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            text: 'Scaled title',
            fontSize: 40,
            color: '#0f172a',
            fontWeight: 'bold',
            align: 'left',
            lineHeight: 1.1,
            letterSpacing: 0,
            fontFamily: 'system-ui',
          },
        },
        {
          id: 'section-b',
          kind: 'container',
          rect: { x: 0, y: 420, width: 1280, height: 300 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 1,
          rotation: 0,
          locked: false,
          visible: true,
          responsive: {
            mobile: {
              rect: { x: 12, y: 99, width: 320, height: 200 },
            },
          },
          content: containerContent('Section B'),
        },
      ],
    }, 'ko');

    const overrides = autoFitMobileTree(normalized.nodes, 375);
    expect(overrides.find((entry) => entry.nodeId === 'section-a')?.rect).toEqual({
      x: 0,
      y: 0,
      width: 375,
      height: 117,
    });
    expect(overrides.find((entry) => entry.nodeId === 'section-a-title')).toMatchObject({
      rect: { x: 23, y: 23, width: 188, height: 23 },
      fontSize: 12,
    });
    expect(overrides.find((entry) => entry.nodeId === 'section-b')).toBeUndefined();
  });
});
