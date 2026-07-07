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

type DesktopParityCase = {
  readonly slug: Exclude<StandaloneSlug, 'services'>;
  readonly desktopHeight: number;
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
    stageHeight: 3057,
    rects: [
      { id: 'page-contact-page-header-root', rect: { y: 0, width: 1280, height: 428 } },
      { id: 'page-contact-guide-root', rect: { y: 428, width: 1280, height: 843 } },
      { id: 'page-contact-contact-root', rect: { y: 1271, width: 1280, height: 867 } },
      { id: 'home-offices-root', rect: { y: 2138, width: 1280, height: 909 } },
      { id: 'page-contact-guide-container', rect: { x: 51, y: 141, width: 1178, height: 529 } },
      { id: 'page-contact-guide-grid', rect: { y: 246, width: 1178, height: 284 } },
      { id: 'page-contact-guide-card-0', rect: { x: 0, y: -20, width: 382, height: 284 } },
      { id: 'page-contact-guide-card-0-title', rect: { x: 25, y: 25, width: 332, height: 41 } },
      { id: 'page-contact-card-0-list', rect: { x: 25, y: 82, width: 332, height: 177 } },
      { id: 'page-contact-inquiries-grid', rect: { y: 48, width: 1178, height: 192 } },
      { id: 'page-contact-inquiries-card-0', rect: { x: 0, y: -20, width: 282, height: 192 } },
      { id: 'page-contact-inquiries-card-0-title', rect: { x: 25, y: 25, width: 232, height: 26 } },
      { id: 'page-contact-inquiries-block-0-list', rect: { x: 25, y: 51, width: 232, height: 87 } },
      { id: 'page-contact-contact-cta', rect: { y: 538, width: 115, height: 47 } },
      { id: 'home-offices-container', rect: { x: 51, y: 141, width: 1178, height: 628 } },
      { id: 'home-offices-layout-0', rect: { y: 206, width: 1178, height: 422 } },
      { id: 'home-offices-layout-0-card', rect: { x: 704, y: -40, width: 474, height: 422 } },
    ],
  },
  {
    slug: 'lawyers',
    stageHeight: 2635,
    rects: [
      { id: 'page-lawyers-page-header-root', rect: { y: 0, width: 1280, height: 428 } },
      { id: 'page-lawyers-attorney-root', rect: { y: 428, width: 1280, height: 2203 } },
      { id: 'page-lawyers-attorney-container', rect: { x: 51, y: 141, width: 1178, height: 1921 } },
      { id: 'page-lawyers-attorney-title', rect: { y: 48, width: 1178, height: 72 } },
      { id: 'page-lawyers-lead-wrap', rect: { y: 210, width: 1178, height: 634 } },
      { id: 'page-lawyers-lead-card', rect: { y: 5, width: 1178, height: 589 } },
      { id: 'page-lawyers-lead-card-name', rect: { x: 24, y: 24, width: 756, height: 32 } },
      { id: 'page-lawyers-staff-wrap', rect: { y: 891, width: 1178, height: 481 } },
      { id: 'page-lawyers-staff-grid', rect: { y: -3, width: 1178, height: 437 } },
      { id: 'page-lawyers-staff-card-0', rect: { x: 0, y: 0, width: 579, height: 437 } },
      { id: 'page-lawyers-staff-card-1', rect: { x: 599, y: 0, width: 579, height: 437 } },
      { id: 'page-lawyers-partner-wrap', rect: { y: 1420, width: 1178, height: 501 } },
      { id: 'page-lawyers-partner-card', rect: { y: 37, width: 1178, height: 416 } },
    ],
  },
  {
    slug: 'reviews',
    stageHeight: 1711,
    rects: [
      { id: 'page-reviews-page-header-root', rect: { y: 0, width: 1280, height: 428 } },
      { id: 'page-reviews-section-root', rect: { y: 428, width: 1280, height: 1282 } },
      { id: 'page-reviews-section-container', rect: { x: 51, y: 141, width: 1178, height: 1001 } },
      { id: 'page-reviews-form-wrap', rect: { x: 269, y: 0, width: 640, height: 759 } },
      { id: 'page-reviews-list-title', rect: { y: 816, width: 1178, height: 24 } },
      { id: 'page-reviews-empty', rect: { y: 864, width: 1178, height: 137 } },
    ],
  },
  {
    slug: 'pricing',
    stageHeight: 1450,
    rects: [
      { id: 'page-pricing-page-header-root', rect: { y: 0, width: 1280, height: 428 } },
      { id: 'page-pricing-section-root', rect: { y: 428, width: 1280, height: 875 } },
      { id: 'page-pricing-section-container', rect: { x: 51, y: 141, width: 1178, height: 594 } },
      { id: 'page-pricing-currency', rect: { x: 0, y: 0, width: 1178, height: 23 } },
      { id: 'page-pricing-grid', rect: { y: 67, width: 1178, height: 457 } },
      { id: 'page-pricing-card-0', rect: { x: 0, y: 0, width: 276, height: 457 } },
      { id: 'page-pricing-card-0-icon', rect: { x: 99, y: 32, width: 78, height: 78 } },
      { id: 'page-pricing-card-0-title', rect: { x: 84, y: 123, width: 108, height: 24 } },
      { id: 'page-pricing-card-0-price', rect: { x: 0, y: 163, width: 276, height: 72 } },
      { id: 'page-pricing-card-0-details', rect: { x: 25, y: 260, width: 226, height: 96 } },
      { id: 'page-pricing-disclaimer-wrap', rect: { x: 0, y: 524, width: 1178, height: 22 } },
      { id: 'page-pricing-cta-wrap', rect: { x: 0, y: 547, width: 1178, height: 47 } },
      { id: 'page-pricing-cta', rect: { x: 540, y: 0, width: 97, height: 47 } },
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

const desktopParityCases: readonly DesktopParityCase[] = [
  { slug: 'contact', desktopHeight: 3057 },
  { slug: 'lawyers', desktopHeight: 2653 },
  { slug: 'reviews', desktopHeight: 1711 },
  { slug: 'pricing', desktopHeight: 1450 },
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

  it.each(desktopParityCases)(
    'keeps $slug desktop parity composite aligned to the standalone contract height',
    ({ slug, desktopHeight }) => {
      const document = decomposeZhHant(slug);
      const nodes = nodesById(document);
      const parityNode = expectNode(nodes, `${slug}-desktop-parity`);

      expect(parityNode.kind).toBe('composite');
      expect(parityNode.anchorName).toBe(`desktop-parity-standalone-${slug}`);
      expect(parityNode.rect).toEqual({
        x: 0,
        y: 0,
        width: 1280,
        height: desktopHeight,
      });
    },
  );
});
