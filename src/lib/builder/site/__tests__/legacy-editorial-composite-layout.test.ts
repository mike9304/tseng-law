import { describe, expect, it } from 'vitest';

import { buildLegacyCompositePageCanvas } from '@/lib/builder/canvas/seed-pages';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  LEGACY_EDITORIAL_COMPOSITE_LAYOUT_CSS,
  LEGACY_EDITORIAL_COMPOSITE_LAYOUT_MARKER,
  matchLegacyEditorialCompositeLayout,
} from '@/lib/builder/site/legacy-editorial-composite-layout';

const SOURCE_SPECS = [
  {
    locale: 'ko' as const,
    slug: 'lawyers' as const,
    componentKey: 'legacy-page-lawyers' as const,
    height: 2653,
    rootId: 'lawyers-page-root',
  },
  {
    locale: 'ko' as const,
    slug: 'pricing' as const,
    componentKey: 'legacy-page-pricing' as const,
    height: 1450,
    rootId: 'pricing-page-root',
  },
  {
    locale: 'zh-hant' as const,
    slug: 'lawyers' as const,
    componentKey: 'legacy-page-lawyers' as const,
    height: 2653,
    rootId: 'lawyers-page-root',
  },
  {
    locale: 'zh-hant' as const,
    slug: 'pricing' as const,
    componentKey: 'legacy-page-pricing' as const,
    height: 1450,
    rootId: 'pricing-page-root',
  },
];

function factoryDocument(
  locale: (typeof SOURCE_SPECS)[number]['locale'],
  slug: (typeof SOURCE_SPECS)[number]['slug'],
): BuilderCanvasDocument {
  const spec = SOURCE_SPECS.find((row) => row.locale === locale && row.slug === slug);
  if (!spec) throw new Error('missing source spec');
  return buildLegacyCompositePageCanvas(spec.locale, spec.componentKey, spec.height, spec.rootId);
}

function lawyersKoDoc(): BuilderCanvasDocument {
  return factoryDocument('ko', 'lawyers');
}

const RAW_KO_LAWYERS = {
  version: 1,
  locale: 'ko',
  updatedAt: '2026-09-07T00:00:00.000Z',
  updatedBy: 'site-page-seed-v22',
  stageWidth: 1280,
  stageHeight: 2653,
  nodes: [
    {
      id: 'lawyers-page-root',
      kind: 'container',
      rect: { x: 0, y: 0, width: 1280, height: 2653 },
      style: {
        backgroundColor: 'transparent',
        borderColor: '#cbd5e1',
        borderStyle: 'solid',
        borderWidth: 0,
        borderRadius: 0,
        shadowX: 0,
        shadowY: 0,
        shadowBlur: 0,
        shadowSpread: 0,
        shadowColor: 'rgba(15, 23, 42, 0.16)',
        opacity: 100,
      },
      zIndex: 0,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        label: 'legacy-page-lawyers page root',
        background: '#ffffff',
        borderColor: 'transparent',
        borderStyle: 'solid',
        borderWidth: 0,
        borderRadius: 0,
        padding: 0,
        layoutMode: 'absolute',
        as: 'main',
      },
      responsive: {
        mobile: { rect: { x: 0, y: 0, width: 375, height: 4706 } },
        tablet: { rect: { x: 0, y: 0, width: 768, height: 4474 } },
      },
    },
    {
      id: 'lawyers-page-root-composite',
      kind: 'composite',
      parentId: 'lawyers-page-root',
      rect: { x: 0, y: 0, width: 1280, height: 2653 },
      style: {
        backgroundColor: 'transparent',
        borderColor: '#cbd5e1',
        borderStyle: 'solid',
        borderWidth: 0,
        borderRadius: 0,
        shadowX: 0,
        shadowY: 0,
        shadowBlur: 0,
        shadowSpread: 0,
        shadowColor: 'rgba(15, 23, 42, 0.16)',
        opacity: 100,
      },
      zIndex: 1,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        componentKey: 'legacy-page-lawyers',
        config: { locale: 'ko' },
      },
      responsive: {
        mobile: { rect: { x: 0, y: 0, width: 375, height: 4706 } },
        tablet: { rect: { x: 0, y: 0, width: 768, height: 4474 } },
      },
    },
  ],
} as BuilderCanvasDocument;

describe('legacy editorial composite layout matcher',
  () => {
    for (const spec of SOURCE_SPECS) {
      it(`matches buildLegacyCompositePageCanvas ${spec.locale} ${spec.slug}`, () => {
        const doc = factoryDocument(spec.locale, spec.slug);
        expect(matchLegacyEditorialCompositeLayout(doc, spec.locale, spec.slug)).toBe(true);
      });
    }

    it('matches the raw source-factory KO lawyers document',
      () => {
        expect(matchLegacyEditorialCompositeLayout(RAW_KO_LAWYERS, 'ko', 'lawyers')).toBe(true);
      },
    );

    it('treats JSON-equivalent key ordering as the same document', () => {
      const doc = lawyersKoDoc();
      const reordered = {
        nodes: doc.nodes,
        version: doc.version,
        locale: doc.locale,
        updatedAt: doc.updatedAt,
        updatedBy: doc.updatedBy,
        stageHeight: doc.stageHeight,
        stageWidth: doc.stageWidth,
      } as BuilderCanvasDocument;
      expect(matchLegacyEditorialCompositeLayout(reordered, 'ko', 'lawyers')).toBe(true);
    });

    it('treats root-container content.activeIndex=0 and sticky=false as inert defaults', () => {
      const doc = lawyersKoDoc();
      const content = doc.nodes[0].content as { activeIndex?: number; sticky?: boolean };
      content.activeIndex = 0;
      content.sticky = false;
      expect(matchLegacyEditorialCompositeLayout(doc, 'ko', 'lawyers')).toBe(true);
      expect(content.activeIndex).toBe(0);
      expect(content.sticky).toBe(false);
    });

    it('opts out of non-default root-container activeIndex or sticky', () => {
      const indexed = lawyersKoDoc();
      (indexed.nodes[0].content as { activeIndex?: number }).activeIndex = 1;
      expect(matchLegacyEditorialCompositeLayout(indexed, 'ko', 'lawyers')).toBe(false);

      const sticky = lawyersKoDoc();
      (sticky.nodes[0].content as { sticky?: boolean }).sticky = true;
      expect(matchLegacyEditorialCompositeLayout(sticky, 'ko', 'lawyers')).toBe(false);
    });

    it('does not treat composite content sticky/activeIndex as inert metadata', () => {
      const doc = lawyersKoDoc();
      (doc.nodes[1].content as { sticky?: boolean }).sticky = false;
      expect(matchLegacyEditorialCompositeLayout(doc, 'ko', 'lawyers')).toBe(false);
    });

    it('omits only root updatedAt/updatedBy and does not mutate the candidate', () => {
      const doc = lawyersKoDoc();
      const originalUpdatedAt = '1999-01-01T00:00:00.000Z';
      const originalUpdatedBy = 'authored-editor';
      doc.updatedAt = originalUpdatedAt;
      doc.updatedBy = originalUpdatedBy;
      const snapshot = JSON.stringify(doc);
      expect(matchLegacyEditorialCompositeLayout(doc, 'ko', 'lawyers')).toBe(true);
      expect(JSON.stringify(doc)).toBe(snapshot);
      expect(doc.updatedAt).toBe(originalUpdatedAt);
      expect(doc.updatedBy).toBe(originalUpdatedBy);
    });

    it('rejects non-JSON values instead of dropping them to match', () => {
      const withFn = lawyersKoDoc() as BuilderCanvasDocument & { extra?: unknown };
      withFn.extra = () => 1;
      expect(matchLegacyEditorialCompositeLayout(withFn, 'ko', 'lawyers')).toBe(false);

      const withUndef = lawyersKoDoc() as BuilderCanvasDocument & { extra?: unknown };
      withUndef.extra = undefined;
      expect(matchLegacyEditorialCompositeLayout(withUndef, 'ko', 'lawyers')).toBe(false);

      const withNaN = lawyersKoDoc() as BuilderCanvasDocument & { extra?: unknown };
      withNaN.extra = Number.NaN;
      expect(matchLegacyEditorialCompositeLayout(withNaN, 'ko', 'lawyers')).toBe(false);

      const withDate = lawyersKoDoc() as BuilderCanvasDocument & { extra?: unknown };
      withDate.extra = new Date('2026-09-07T00:00:00.000Z');
      expect(matchLegacyEditorialCompositeLayout(withDate, 'ko', 'lawyers')).toBe(false);
    });

    it.each([
      [
        'an unknown envelope key is added',
        (doc: BuilderCanvasDocument) => {
          (doc as BuilderCanvasDocument & { extraEnvelope?: string }).extraEnvelope = 'x';
        },
      ],
      [
        'an unknown node key is added',
        (doc: BuilderCanvasDocument) => {
          (doc.nodes[0] as BuilderCanvasNode & { anchorName?: string }).anchorName = 'lawyers';
        },
      ],
      [
        'an unknown content key / custom chrome is added',
        (doc: BuilderCanvasDocument) => {
          (doc.nodes[0].content as Record<string, unknown>).htmlId = 'custom-root';
        },
      ],
      [
        'an unknown style key is added',
        (doc: BuilderCanvasDocument) => {
          (doc.nodes[0].style as Record<string, unknown>).mixBlendMode = 'multiply';
        },
      ],
      [
        'an unknown rect key is added',
        (doc: BuilderCanvasDocument) => {
          (doc.nodes[0].rect as Record<string, unknown>).unit = 'px';
        },
      ],
      [
        'an unknown responsive bucket is added',
        (doc: BuilderCanvasDocument) => {
          (doc.nodes[0].responsive as Record<string, unknown>).desktop = {
            rect: { x: 0, y: 0, width: 1280, height: 2653 },
          };
        },
      ],
      [
        'an unknown composite config key is added',
        (doc: BuilderCanvasDocument) => {
          (doc.nodes[1].content as { config: Record<string, unknown> }).config.preview = true;
        },
      ],
      [
        'bindings are added',
        (doc: BuilderCanvasDocument) => {
          (doc.nodes[0] as BuilderCanvasNode & { bindings?: unknown[] }).bindings = [];
        },
      ],
      [
        'overrides are added',
        (doc: BuilderCanvasDocument) => {
          (doc.nodes[1] as BuilderCanvasNode & { overrides?: Record<string, unknown> }).overrides = {};
        },
      ],
      [
        'content.label changes',
        (doc: BuilderCanvasDocument) => {
          (doc.nodes[0].content as { label: string }).label = 'custom lawyers root';
        },
      ],
      [
        'style changes',
        (doc: BuilderCanvasDocument) => {
          doc.nodes[0].style.borderRadius = 4;
        },
      ],
      [
        'stage geometry changes',
        (doc: BuilderCanvasDocument) => {
          doc.stageHeight = 2654;
        },
      ],
      [
        'a node is hidden',
        (doc: BuilderCanvasDocument) => {
          doc.nodes[1].visible = false;
        },
      ],
      [
        'nodes are reordered',
        (doc: BuilderCanvasDocument) => {
          doc.nodes.reverse();
        },
      ],
      [
        'an extra node is added',
        (doc: BuilderCanvasDocument) => {
          doc.nodes.push({
            ...doc.nodes[1],
            id: 'lawyers-page-root-composite-extra',
          });
        },
      ],
      [
        'root and child responsive rects change together',
        (doc: BuilderCanvasDocument) => {
          const rootMobile = doc.nodes[0].responsive?.mobile?.rect;
          const childMobile = doc.nodes[1].responsive?.mobile?.rect;
          if (rootMobile) rootMobile.height = 12;
          if (childMobile) childMobile.height = 12;
        },
      ],
    ] as Array<[string, (doc: BuilderCanvasDocument) => void]>)(
      'opts out when %s',
      (_title, mutate) => {
        const doc = lawyersKoDoc();
        mutate(doc);
        expect(matchLegacyEditorialCompositeLayout(doc, 'ko', 'lawyers')).toBe(false);
      },
    );

    it('opts out of own enumerable JSON __proto__ keys at the root and nested', () => {
      const nested = lawyersKoDoc();
      Object.defineProperty(nested.nodes[0], '__proto__', {
        value: { extra: true },
        enumerable: true,
        writable: true,
        configurable: true,
      });
      expect(matchLegacyEditorialCompositeLayout(nested, 'ko', 'lawyers')).toBe(false);

      const topNull = lawyersKoDoc();
      Object.defineProperty(topNull, '__proto__', {
        value: null,
        enumerable: true,
        writable: true,
        configurable: true,
      });
      expect(matchLegacyEditorialCompositeLayout(topNull, 'ko', 'lawyers')).toBe(false);

      const topPrimitive = lawyersKoDoc();
      Object.defineProperty(topPrimitive, '__proto__', {
        value: 'authored',
        enumerable: true,
        writable: true,
        configurable: true,
      });
      expect(matchLegacyEditorialCompositeLayout(topPrimitive, 'ko', 'lawyers')).toBe(false);
    });

    it('opts out of extra nodes-array keys, holes, and non-enumerable unknown keys', () => {
      const with01 = lawyersKoDoc();
      Object.defineProperty(with01.nodes, '01', {
        value: with01.nodes[0],
        enumerable: true,
        writable: true,
        configurable: true,
      });
      expect(matchLegacyEditorialCompositeLayout(with01, 'ko', 'lawyers')).toBe(false);

      const with00 = lawyersKoDoc();
      Object.defineProperty(with00.nodes, '00', {
        value: with00.nodes[0],
        enumerable: true,
        writable: true,
        configurable: true,
      });
      expect(matchLegacyEditorialCompositeLayout(with00, 'ko', 'lawyers')).toBe(false);

      const sparse = lawyersKoDoc();
      const holey = [sparse.nodes[0], sparse.nodes[1]] as BuilderCanvasNode[];
      delete holey[1];
      sparse.nodes = holey;
      expect(matchLegacyEditorialCompositeLayout(sparse, 'ko', 'lawyers')).toBe(false);

      const hidden = lawyersKoDoc();
      Object.defineProperty(hidden, 'hiddenExtra', {
        value: true,
        enumerable: false,
        writable: true,
        configurable: true,
      });
      expect(matchLegacyEditorialCompositeLayout(hidden, 'ko', 'lawyers')).toBe(false);
    });

    it('rejects accessors without invoking getter callbacks', () => {
      const doc = lawyersKoDoc();
      let invocations = 0;
      Object.defineProperty(doc, 'authoredGetter', {
        get() {
          invocations += 1;
          return 1;
        },
        enumerable: true,
        configurable: true,
      });
      expect(matchLegacyEditorialCompositeLayout(doc, 'ko', 'lawyers')).toBe(false);
      expect(invocations).toBe(0);
    });

    it('opts out for the wrong slug or locale even with a matching lawyers document', () => {
      const doc = lawyersKoDoc();
      expect(matchLegacyEditorialCompositeLayout(doc, 'ko', 'pricing')).toBe(false);
      expect(matchLegacyEditorialCompositeLayout(doc, 'ko', 'faq')).toBe(false);
      expect(matchLegacyEditorialCompositeLayout(doc, 'en', 'lawyers')).toBe(false);
      expect(matchLegacyEditorialCompositeLayout(doc, 'zh-hant', 'lawyers')).toBe(false);
    });

    it('scopes every CSS selector through the exact-match marker',
      () => {
        const css = LEGACY_EDITORIAL_COMPOSITE_LAYOUT_CSS.replace(/\/\*[\s\S]*?\*\//g, '');
        const blocks = css
          .split('}')
          .map((chunk) => chunk.split('{')[0]?.trim() ?? '')
          .filter(Boolean);
        expect(blocks.length).toBeGreaterThan(0);
        for (const block of blocks) {
          for (const selector of block.split(',')) {
            expect(selector).toContain(`[${LEGACY_EDITORIAL_COMPOSITE_LAYOUT_MARKER}="true"]`);
          }
        }
        expect(css).toContain('lawyers-page-root');
        expect(css).toContain('pricing-page-root');
        expect(css).toContain('width: 100% !important');
        expect(css).not.toContain('faq-page-root');
        expect(css).not.toContain('reviews-page-root');
        expect(css).not.toMatch(/overflow\s*:\s*hidden/i);
        expect(css).not.toMatch(/font-size/i);
        expect(css).not.toMatch(/transform/i);
        expect(css).not.toMatch(/line-clamp/i);
      },
    );
  },
);
