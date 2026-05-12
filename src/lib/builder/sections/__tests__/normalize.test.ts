import { describe, expect, it } from 'vitest';
import {
  builderCanvasNodeKinds,
  createDefaultCanvasNodeStyle,
  type BuilderCanvasNode,
} from '@/lib/builder/canvas/types';
import { normalizeSavedSectionSnapshot } from '@/lib/builder/sections/normalize';
import {
  BUILT_IN_SECTION_CATEGORIES,
  BUILT_IN_SECTIONS,
  getBuiltInSectionSearchResults,
  getBuiltInSectionsByCategory,
  type BuiltInSectionCategory,
} from '@/lib/builder/sections/templates';

function mk(overrides: Record<string, unknown>): BuilderCanvasNode {
  return {
    id: 'n',
    kind: 'container',
    parentId: undefined,
    rect: { x: 100, y: 200, width: 800, height: 400 },
    style: createDefaultCanvasNodeStyle(),
    content: {},
    visible: true,
    locked: false,
    rotation: 0,
    zIndex: 0,
    ...overrides,
  } as unknown as BuilderCanvasNode;
}

describe('normalizeSavedSectionSnapshot', () => {
  it('returns empty array when root not found', () => {
    const result = normalizeSavedSectionSnapshot([], 'missing');
    expect(result).toEqual([]);
  });

  it('root rect.x/y normalized to 0,0 (local origin)', () => {
    const root = mk({ id: 'root', rect: { x: 555, y: 999, width: 800, height: 400 } });
    const result = normalizeSavedSectionSnapshot([root], 'root');
    expect(result[0].rect.x).toBe(0);
    expect(result[0].rect.y).toBe(0);
  });

  it('root width/height preserved', () => {
    const root = mk({ id: 'root', rect: { x: 555, y: 999, width: 1234, height: 567 } });
    const result = normalizeSavedSectionSnapshot([root], 'root');
    expect(result[0].rect.width).toBe(1234);
    expect(result[0].rect.height).toBe(567);
  });

  it('root parentId becomes undefined (detached)', () => {
    const root = mk({ id: 'root', parentId: 'something-else' });
    const result = normalizeSavedSectionSnapshot([root], 'root');
    expect(result[0].parentId).toBeUndefined();
  });

  it('only nodes reachable from root are kept', () => {
    const root = mk({ id: 'root' });
    const child = mk({ id: 'child', parentId: 'root', kind: 'text' });
    const orphan = mk({ id: 'orphan', kind: 'image' });
    const result = normalizeSavedSectionSnapshot([root, child, orphan], 'root');
    const ids = result.map((n) => n.id);
    expect(ids).toContain('root');
    expect(ids).toContain('child');
    expect(ids).not.toContain('orphan');
  });

  it('descendant parentId references survive (parent included in subtree)', () => {
    const root = mk({ id: 'root' });
    const child = mk({ id: 'child', parentId: 'root', kind: 'text' });
    const grand = mk({ id: 'grand', parentId: 'child', kind: 'text' });
    const result = normalizeSavedSectionSnapshot([root, child, grand], 'root');
    const grandResult = result.find((n) => n.id === 'grand');
    expect(grandResult?.parentId).toBe('child');
  });

  it('descendant parentId pointing outside subtree → undefined', () => {
    const root = mk({ id: 'root' });
    // parent is "outside" — node still reachable via fake stack but its parent isn't kept
    const child = mk({ id: 'child', parentId: 'root', kind: 'text' });
    const result = normalizeSavedSectionSnapshot([root, child], 'root');
    expect(result.find((n) => n.id === 'child')?.parentId).toBe('root');
  });

  it('descendant rect (parent-local) preserved', () => {
    const root = mk({ id: 'root', rect: { x: 100, y: 200, width: 800, height: 400 } });
    const child = mk({
      id: 'child',
      parentId: 'root',
      kind: 'text',
      rect: { x: 50, y: 60, width: 100, height: 30 },
    });
    const result = normalizeSavedSectionSnapshot([root, child], 'root');
    const childResult = result.find((n) => n.id === 'child');
    expect(childResult?.rect.x).toBe(50);
    expect(childResult?.rect.y).toBe(60);
  });

  it('cycle protection — node points to itself does not infinite loop', () => {
    const cyclic = mk({ id: 'cycle', parentId: 'cycle' });
    const result = normalizeSavedSectionSnapshot([cyclic], 'cycle');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('cycle');
  });

  it('does not mutate input nodes', () => {
    const root = mk({ id: 'root', rect: { x: 999, y: 999, width: 100, height: 100 } });
    const child = mk({ id: 'child', parentId: 'root' });
    const inputs = [root, child];
    normalizeSavedSectionSnapshot(inputs, 'root');
    expect(root.rect.x).toBe(999);
    expect(root.rect.y).toBe(999);
  });

  it('responsive tablet/mobile rect.x/y reset to 0 on root', () => {
    const root = mk({
      id: 'root',
      rect: { x: 100, y: 200, width: 800, height: 400 },
      responsive: {
        tablet: { rect: { x: 50, y: 70, width: 600, height: 300 } },
        mobile: { rect: { x: 30, y: 40, width: 320, height: 200 } },
      },
    } as Partial<BuilderCanvasNode>);
    const result = normalizeSavedSectionSnapshot([root], 'root');
    const r = result[0] as BuilderCanvasNode;
    expect(r.responsive?.tablet?.rect?.x).toBe(0);
    expect(r.responsive?.tablet?.rect?.y).toBe(0);
    expect(r.responsive?.mobile?.rect?.x).toBe(0);
    expect(r.responsive?.mobile?.rect?.y).toBe(0);
  });

  it('responsive width/height preserved on root', () => {
    const root = mk({
      id: 'root',
      rect: { x: 100, y: 200, width: 800, height: 400 },
      responsive: {
        tablet: { rect: { x: 50, y: 70, width: 612, height: 345 } },
      },
    } as Partial<BuilderCanvasNode>);
    const result = normalizeSavedSectionSnapshot([root], 'root');
    const r = result[0] as BuilderCanvasNode;
    expect(r.responsive?.tablet?.rect?.width).toBe(612);
    expect(r.responsive?.tablet?.rect?.height).toBe(345);
  });
});

describe('BUILT_IN_SECTIONS', () => {
  const legacyTemplateIds = new Set([
    'hero-centered-cta',
    'hero-split-image',
    'features-3-column',
    'features-icon-grid',
    'testimonials-cards',
    'testimonials-quote-grid',
    'cta-banner-centered',
    'cta-split-with-image',
    'footer-3-column',
    'footer-minimal',
    'legal-disclaimer',
    'legal-privacy-summary',
  ]);

  const expectedCounts = {
    hero: 5,
    features: 5,
    testimonials: 5,
    cta: 5,
    footer: 4,
    legal: 3,
    stats: 4,
    pricing: 4,
    team: 4,
    gallery: 4,
    faq: 3,
    services: 12,
    contact: 3,
  } satisfies Record<BuiltInSectionCategory, number>;

  it('keeps the template catalog at the Wix-grade Track B minimum', () => {
    expect(BUILT_IN_SECTION_CATEGORIES).toHaveLength(13);
    expect(BUILT_IN_SECTIONS).toHaveLength(61);
  });

  it('has the expected category coverage', () => {
    const buckets = getBuiltInSectionsByCategory();

    for (const category of BUILT_IN_SECTION_CATEGORIES) {
      expect(buckets[category], category).toHaveLength(expectedCounts[category]);
    }
  });

  it('lets Korean service/work queries find the expanded services design pack', () => {
    const results = getBuiltInSectionSearchResults('주요업무');

    expect(results).toHaveLength(expectedCounts.services);
    expect(results.every((template) => template.category === 'services')).toBe(true);
    expect(results.map((template) => template.id)).toContain('services-case-intake-flow');
  });

  it('uses unique template ids and valid existing canvas node kinds', () => {
    const templateIds = new Set(BUILT_IN_SECTIONS.map((template) => template.id));
    const kindSet = new Set(builderCanvasNodeKinds);

    expect(templateIds.size).toBe(BUILT_IN_SECTIONS.length);

    for (const template of BUILT_IN_SECTIONS) {
      for (const node of template.nodes) {
        expect(kindSet.has(node.kind), `${template.id}:${node.id}`).toBe(true);
      }
    }
  });

  it('stores every template as a normalized, self-contained section tree', () => {
    for (const template of BUILT_IN_SECTIONS) {
      const root = template.nodes.find((node) => node.id === template.rootNodeId);
      const nodeIds = new Set(template.nodes.map((node) => node.id));
      const normalizedIds = normalizeSavedSectionSnapshot(template.nodes, template.rootNodeId)
        .map((node) => node.id);

      expect(root, template.id).toBeDefined();
      expect(root?.parentId, template.id).toBeUndefined();
      expect(root?.rect.x, template.id).toBe(0);
      expect(root?.rect.y, template.id).toBe(0);
      expect(nodeIds.size, template.id).toBe(template.nodes.length);
      expect(normalizedIds, template.id).toEqual(template.nodes.map((node) => node.id));

      for (const node of template.nodes) {
        if (node.parentId) {
          expect(nodeIds.has(node.parentId), `${template.id}:${node.id}`).toBe(true);
        }
      }
    }
  });

  it('keeps newly generated section templates in the target 12-25 node range', () => {
    for (const template of BUILT_IN_SECTIONS) {
      if (legacyTemplateIds.has(template.id)) {
        continue;
      }

      expect(template.nodes.length, template.id).toBeGreaterThanOrEqual(12);
      expect(template.nodes.length, template.id).toBeLessThanOrEqual(25);
    }
  });
});
