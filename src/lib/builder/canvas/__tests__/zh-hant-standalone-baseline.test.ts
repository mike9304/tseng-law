import { describe, expect, it } from 'vitest';
import { STANDARD_PAGE_DECOMPOSERS } from '../seed-pages';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '../types';

type StandaloneSlug = 'contact' | 'lawyers' | 'reviews' | 'pricing' | 'services';

type RectExpectation = {
  readonly id: string;
  readonly rect: Partial<BuilderCanvasNode['rect']>;
};

type DesktopBaselineCase = {
  readonly slug: Exclude<StandaloneSlug, 'services'>;
  readonly stageHeight: number;
  readonly rects: readonly RectExpectation[];
};

type MobileParityCase = {
  readonly slug: StandaloneSlug;
  readonly mobileHeight: number;
  readonly tabletHeight: number;
};

function decomposeZhHant(slug: StandaloneSlug): BuilderCanvasDocument {
  return STANDARD_PAGE_DECOMPOSERS[slug]('zh-hant');
}

function nodesById(document: BuilderCanvasDocument): Map<string, BuilderCanvasNode> {
  return new Map(document.nodes.map((node) => [node.id, node]));
}

function expectNode(nodes: Map<string, BuilderCanvasNode>, nodeId: string): BuilderCanvasNode {
  const node = nodes.get(nodeId);
  if (!node) throw new Error(`expected ${nodeId} to exist`);
  return node;
}

const desktopBaselines: readonly DesktopBaselineCase[] = [
  {
    slug: 'contact',
    stageHeight: 3033,
    rects: [
      { id: 'page-contact-page-header-root', rect: { y: 0, width: 1280, height: 428 } },
      { id: 'page-contact-guide-root', rect: { y: 428, width: 1280, height: 602 } },
      { id: 'page-contact-contact-root', rect: { y: 1030, width: 1280, height: 964 } },
      { id: 'home-offices-root', rect: { y: 1994, width: 1280, height: 760 } },
    ],
  },
  {
    slug: 'lawyers',
    stageHeight: 2635,
    rects: [
      { id: 'page-lawyers-page-header-root', rect: { y: 0, width: 1280, height: 428 } },
      { id: 'page-lawyers-attorney-root', rect: { y: 428, width: 1280, height: 2207 } },
      { id: 'page-lawyers-attorney-container', rect: { x: 51, y: 88, width: 1178, height: 2031 } },
      { id: 'page-lawyers-lead-wrap', rect: { y: 278, width: 1178, height: 630 } },
      { id: 'page-lawyers-staff-card-0', rect: { x: 0, y: 0, width: 548, height: 421 } },
      { id: 'page-lawyers-staff-card-1', rect: { x: 588, y: 0, width: 548, height: 400 } },
      { id: 'page-lawyers-partner-card', rect: { y: 40, width: 1178, height: 380 } },
    ],
  },
  {
    slug: 'reviews',
    stageHeight: 1754,
    rects: [
      { id: 'page-reviews-page-header-root', rect: { y: 0, width: 1280, height: 428 } },
      { id: 'page-reviews-section-root', rect: { y: 472, width: 1280, height: 1282 } },
      { id: 'page-reviews-section-container', rect: { x: 51, y: 141, width: 1178, height: 1001 } },
      { id: 'page-reviews-form-wrap', rect: { x: 269, y: 0, width: 640, height: 759 } },
      { id: 'page-reviews-empty', rect: { y: 864, width: 1178, height: 137 } },
    ],
  },
  {
    slug: 'pricing',
    stageHeight: 1380,
    rects: [
      { id: 'page-pricing-page-header-root', rect: { y: 0, width: 1280, height: 428 } },
      { id: 'page-pricing-section-root', rect: { y: 428, width: 1280, height: 952 } },
      { id: 'page-pricing-section-container', rect: { x: 51, y: 88, width: 1178, height: 768 } },
      { id: 'page-pricing-grid', rect: { y: 120, width: 1178, height: 505 } },
      { id: 'page-pricing-cta-wrap', rect: { y: 724, width: 220, height: 44 } },
    ],
  },
];

const mobileParityCases: readonly MobileParityCase[] = [
  { slug: 'contact', mobileHeight: 3850, tabletHeight: 4053 },
  { slug: 'lawyers', mobileHeight: 4706, tabletHeight: 4474 },
  { slug: 'reviews', mobileHeight: 1458, tabletHeight: 1599 },
  { slug: 'pricing', mobileHeight: 2433, tabletHeight: 1747 },
  { slug: 'services', mobileHeight: 1567, tabletHeight: 1580 },
];

describe('zh-hant standalone decomposed baseline contracts', () => {
  it.each(desktopBaselines)(
    'keeps $slug desktop baseline rects independent from mobile parity overlays',
    ({ slug, stageHeight, rects }) => {
      const document = decomposeZhHant(slug);
      const nodes = nodesById(document);

      expect(document.stageHeight).toBe(stageHeight);
      for (const expectation of rects) {
        expect(expectNode(nodes, expectation.id).rect).toMatchObject(expectation.rect);
      }
    },
  );

  it.each(mobileParityCases)(
    'keeps $slug mobile parity composite desktop-inert with exact responsive heights',
    ({ slug, mobileHeight, tabletHeight }) => {
      const document = decomposeZhHant(slug);
      const nodes = nodesById(document);
      const parityNode = expectNode(nodes, `${slug}-mobile-parity`);

      expect(parityNode.kind).toBe('composite');
      expect(parityNode.anchorName).toBe(`mobile-parity-standalone-${slug}`);
      expect(parityNode.rect).toEqual({ x: 0, y: 0, width: 1, height: 1 });
      expect(parityNode.responsive?.mobile?.rect).toEqual({
        x: 0,
        y: 0,
        width: 375,
        height: mobileHeight,
      });
      expect(parityNode.responsive?.tablet?.rect).toEqual({
        x: 0,
        y: 0,
        width: 768,
        height: tabletHeight,
      });
    },
  );
});
