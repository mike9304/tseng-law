import { describe, expect, it } from 'vitest';
import { createHomePageCanvasDocumentDecomposed } from '../seed-home';
import { upgradeHomeEditorLayoutParity } from '../home-editor-layout-parity';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '../types';

const legacyRoots: Record<string, BuilderCanvasNode['rect']> = {
  'home-hero-root': { x: 0, y: 0, width: 1280, height: 820 },
  'home-insights-root': { x: 0, y: 788, width: 1280, height: 1260 },
  'home-services-root': { x: 0, y: 2080, width: 1280, height: 1246 },
  'home-attorney-root': { x: 0, y: 3326, width: 1280, height: 720 },
  'home-case-results-root': { x: 0, y: 4046, width: 1280, height: 600 },
  'home-stats-root': { x: 0, y: 4646, width: 1280, height: 640 },
  'home-faq-root': { x: 0, y: 5691, width: 1280, height: 1333 },
  'home-offices-root': { x: 0, y: 7151, width: 1280, height: 919 },
  'home-contact-root': { x: 0, y: 7792, width: 1280, height: 640 },
};

function legacyDocument(): BuilderCanvasDocument {
  const seed = createHomePageCanvasDocumentDecomposed('ko');
  return {
    ...seed,
    updatedAt: '2026-07-10T00:00:00.000Z',
    updatedBy: 'home-seed-v12',
    nodes: seed.nodes.map((node) => {
      const rootRect = legacyRoots[node.id];
      if (rootRect) return { ...node, rect: rootRect } as BuilderCanvasNode;
      if (node.id === 'home-case-results-content') {
        return { ...node, rect: { x: 0, y: 0, width: 1280, height: 600 } } as BuilderCanvasNode;
      }
      if (node.id === 'home-case-results-label') {
        return { ...node, rect: { x: 0, y: 0, width: 400, height: 40 } } as BuilderCanvasNode;
      }
      if (node.id === 'home-case-results-title') {
        return {
          ...node,
          rect: { x: 0, y: 50, width: 720, height: 120 },
          responsive: {
            tablet: { rect: { x: 32, y: 82, width: 670, height: 120 } },
            mobile: { rect: { x: 32, y: 82, width: 279, height: 120 } },
          },
        } as BuilderCanvasNode;
      }
      if (node.id === 'home-case-results-divider') {
        return {
          ...node,
          kind: 'container',
          parentId: 'home-case-results-root',
          rect: { x: 51, y: 180, width: 80, height: 40 },
          responsive: {
            tablet: { rect: { x: 32, y: 212, width: 80, height: 4 } },
            mobile: { rect: { x: 32, y: 212, width: 80, height: 4 } },
          },
          content: {
            label: 'divider',
            background: 'transparent',
            borderColor: '#cbd5e1',
            borderStyle: 'solid',
            borderWidth: 0,
            borderRadius: 0,
            padding: 0,
            layoutMode: 'absolute',
            className: 'split-divider',
            as: 'div',
          },
        } as BuilderCanvasNode;
      }
      if (node.id === 'home-case-results-desc') {
        return { ...node, rect: { x: 0, y: 200, width: 720, height: 80 } } as BuilderCanvasNode;
      }
      if (node.id === 'home-case-results-summary') {
        return { ...node, rect: { x: 0, y: 290, width: 720, height: 60 } } as BuilderCanvasNode;
      }
      if (node.id === 'home-case-results-cta') {
        return { ...node, rect: { x: 0, y: 360, width: 200, height: 36 } } as BuilderCanvasNode;
      }
      if (node.id === 'home-contact-container') {
        return { ...node, rect: { x: 72, y: 120, width: 1136, height: 380 } } as BuilderCanvasNode;
      }
      if (node.id === 'home-contact-copy') {
        return {
          ...node,
          parentId: 'home-contact-root',
          rect: { x: 95, y: 120, width: 770, height: 180 },
        } as BuilderCanvasNode;
      }
      if (node.id === 'home-contact-title') {
        return { ...node, rect: { x: 0, y: 42, width: 640, height: 56 } } as BuilderCanvasNode;
      }
      if (node.id === 'home-contact-description') {
        return { ...node, rect: { x: 0, y: 114, width: 560, height: 58 } } as BuilderCanvasNode;
      }
      if (node.id === 'home-contact-actions') {
        return { ...node, rect: { x: 0, y: 214, width: 520, height: 56 } } as BuilderCanvasNode;
      }
      if (node.id === 'home-stats-container') {
        return { ...node, rect: { x: 72, y: 80, width: 1136, height: 480 } } as BuilderCanvasNode;
      }
      if (node.id === 'home-stats-title') {
        return { ...node, rect: { x: 0, y: 40, width: 560, height: 54 } } as BuilderCanvasNode;
      }
      if (node.id === 'home-stats-description') {
        return { ...node, rect: { x: 0, y: 106, width: 760, height: 64 } } as BuilderCanvasNode;
      }
      if (node.id === 'home-stats-grid') {
        return { ...node, rect: { x: 0, y: 214, width: 1136, height: 200 } } as BuilderCanvasNode;
      }
      return node;
    }),
  };
}

function node(document: BuilderCanvasDocument, id: string): BuilderCanvasNode {
  const match = document.nodes.find((candidate) => candidate.id === id);
  if (!match) throw new Error(`Missing node: ${id}`);
  return match;
}

describe('upgradeHomeEditorLayoutParity', () => {
  it('repairs the exact legacy home geometry without stamping read-path metadata', () => {
    const legacy = legacyDocument();
    const repaired = upgradeHomeEditorLayoutParity(legacy, 'ko', { stampMetadata: false });

    expect(repaired.updatedAt).toBe(legacy.updatedAt);
    expect(repaired.updatedBy).toBe(legacy.updatedBy);
    expect(repaired.stageHeight).toBe(7127);
    expect(node(repaired, 'home-case-results-root').rect).toEqual({ x: 0, y: 3354, width: 1280, height: 600 });
    expect(node(repaired, 'home-case-results-content').rect).toEqual({ x: 0, y: 0, width: 1280, height: 600 });
    expect(node(repaired, 'home-case-results-title').rect).toEqual({ x: 78, y: 39, width: 720, height: 130 });

    const divider = node(repaired, 'home-case-results-divider');
    expect(divider.kind).toBe('divider');
    expect(divider.parentId).toBe('home-case-results-content');
    expect(divider.rect).toEqual({ x: 78, y: 172, width: 40, height: 32 });
    expect(divider.content).toEqual({
      orientation: 'horizontal',
      thickness: 2,
      color: '#9f8752',
      style: 'solid',
    });
    expect(divider.responsive?.mobile?.rect).toMatchObject({ x: 16, y: 188, width: 40, height: 4 });

    expect(node(repaired, 'home-contact-root').rect).toEqual({ x: 0, y: 6593, width: 1280, height: 532 });
    expect(node(repaired, 'home-contact-copy')).toMatchObject({
      parentId: 'home-contact-container',
      rect: { x: 0, y: 0, width: 1178, height: 180 },
    });
    expect(node(repaired, 'home-contact-title').rect).toEqual({ x: 0, y: 39, width: 1178, height: 56 });
    expect(node(repaired, 'home-contact-description').rect).toEqual({ x: 0, y: 111, width: 720, height: 58 });
    expect(node(repaired, 'home-stats-container').rect).toEqual({ x: 72, y: 64, width: 1136, height: 432 });
    expect(node(repaired, 'home-stats-title').rect).toEqual({ x: 0, y: 40, width: 560, height: 54 });
    expect(node(repaired, 'home-stats-description').rect).toEqual({ x: 0, y: 106, width: 760, height: 64 });
  });

  it('does not reset a customized near-match contact title', () => {
    const legacy = legacyDocument();
    const customized = {
      ...legacy,
      nodes: legacy.nodes.map((entry) => (
        entry.id === 'home-contact-title'
          ? { ...entry, rect: { ...entry.rect, width: 641 } } as BuilderCanvasNode
          : entry
      )),
    };

    const repaired = upgradeHomeEditorLayoutParity(customized, 'ko', { stampMetadata: false });
    expect(node(repaired, 'home-contact-title').rect.width).toBe(641);
  });
});
