import { describe, it, expect } from 'vitest';
import {
  buildLegacyCompositePageCanvas,
  buildReviewsCompositePageCanvas,
  buildVideosCompositePageCanvas,
  isLegacyReviewLayoutClassName,
  STANDARD_PAGE_SEED_SLUGS,
  STANDARD_PAGE_DECOMPOSERS,
} from '../seed-pages';
import { buildResponsiveStylesheet } from '@/lib/builder/site/responsive-stylesheet';
import { builderCanvasDocumentSchema, type BuilderCanvasDocument, type BuilderCanvasNode } from '../types';
import { DECOMPOSABLE_PAGE_SLUGS, isStandalonePublishParityAnchor } from '../decomposable-slugs';
import { computeTopLevelFlowSectionMetrics } from '../flow';
import { REQUIRED_STANDARD_PAGE_SLUGS } from '@/lib/builder/site/standard-pages';
import type { Locale } from '@/lib/locales';

// Each standard page that the live (legacy) tseng-law.com site renders should be
// seeded into the builder as a `composite` node that renders the SAME component,
// so the builder reflects the real site instead of a diverging approximation.
const LEGACY_PAGES = [
  { key: 'legacy-page-about', rootId: 'about-page-root', slug: 'about' },
  { key: 'legacy-page-services', rootId: 'services-page-root', slug: 'services' },
  { key: 'legacy-page-contact', rootId: 'contact-page-root', slug: 'contact' },
  { key: 'legacy-page-lawyers', rootId: 'lawyers-page-root', slug: 'lawyers' },
  { key: 'legacy-page-faq', rootId: 'faq-page-root', slug: 'faq' },
  { key: 'legacy-page-pricing', rootId: 'pricing-page-root', slug: 'pricing' },
  { key: 'legacy-page-reviews', rootId: 'reviews-page-root', slug: 'reviews' },
  { key: 'legacy-page-columns', rootId: 'columns-page-root', slug: 'columns' },
  { key: 'legacy-page-videos', rootId: 'videos-page-root', slug: 'videos' },
  { key: 'legacy-page-privacy', rootId: 'privacy-page-root', slug: 'privacy' },
  { key: 'legacy-page-disclaimer', rootId: 'disclaimer-page-root', slug: 'disclaimer' },
] as const;

const LOCALES: Locale[] = ['ko', 'zh-hant', 'en'];

function countResponsiveNodes(doc: BuilderCanvasDocument): number {
  return doc.nodes.filter((node) => Boolean(node.responsive?.tablet?.rect || node.responsive?.mobile?.rect)).length;
}

function getNodeClassName(node: BuilderCanvasNode | undefined): string {
  if (!node || !('className' in node.content) || typeof node.content.className !== 'string') return '';
  return node.content.className;
}

function getMobileRectValue(node: BuilderCanvasNode | undefined, key: keyof BuilderCanvasNode['rect']): number {
  const value = node?.responsive?.mobile?.rect?.[key];
  if (typeof value !== 'number') {
    throw new Error(`Missing mobile ${key} for ${node?.id ?? 'unknown node'}.`);
  }
  return value;
}

function getTabletRectValue(node: BuilderCanvasNode | undefined, key: keyof BuilderCanvasNode['rect']): number {
  const value = node?.responsive?.tablet?.rect?.[key];
  if (typeof value !== 'number') {
    throw new Error(`Missing tablet ${key} for ${node?.id ?? 'unknown node'}.`);
  }
  return value;
}

describe('legacy composite page seeds reflect the live site', () => {
  it('keeps the required standard page slugs in sync with seedable pages', () => {
    expect([...STANDARD_PAGE_SEED_SLUGS].sort()).toEqual([...REQUIRED_STANDARD_PAGE_SLUGS].sort());
  });

  for (const locale of LOCALES) {
    for (const { key, rootId } of LEGACY_PAGES) {
      it(`${key} (${locale}) is a schema-valid composite wrapping the live component`, () => {
        const doc = buildLegacyCompositePageCanvas(locale, key, 1200, rootId);

        // Must be structurally valid for persistence + public rendering.
        const parsed = builderCanvasDocumentSchema.parse(doc);
        expect(parsed.locale).toBe(locale);
        expect(parsed.stageWidth).toBe(1280);

        const composite = parsed.nodes.find((node) => node.kind === 'composite');
        expect(composite, 'page must contain a composite node').toBeTruthy();
        expect(
          (composite as { content: { componentKey: string } }).content.componentKey,
        ).toBe(key);

        // Root container exists and owns the composite.
        const root = parsed.nodes.find((node) => node.id === rootId);
        expect(root, 'page must have a root container').toBeTruthy();
        expect((composite as { parentId?: string }).parentId).toBe(rootId);
      });
    }
  }

  it('keeps the editable decomposed builders available for every legacy slug', () => {
    // The decomposed builders are the target of the planned "decompose to edit"
    // action. We only assert they remain wired and produce nodes — not strict
    // schema validity, since these pre-existing builders predate (and do not
    // satisfy) the strict min constraints in builderCanvasDocumentSchema.
    for (const slug of DECOMPOSABLE_PAGE_SLUGS) {
      const decomposer = STANDARD_PAGE_DECOMPOSERS[slug];
      expect(decomposer, `decomposer missing for ${slug}`).toBeTypeOf('function');
      expect(decomposer('ko').nodes.length).toBeGreaterThan(0);
    }
  });

  it('keeps the dynamic legacy ReviewBoard composite while retaining the decomposed reviews edit builder', () => {
    const legacyHelper = buildReviewsCompositePageCanvas('ko');
    const legacyComposite = legacyHelper.nodes.find((node) => node.kind === 'composite');
    const editable = STANDARD_PAGE_DECOMPOSERS.reviews('ko');

    expect(legacyComposite).toBeDefined();
    expect(legacyComposite?.content.componentKey).toBe('legacy-page-reviews');
    expect(legacyHelper.nodes).toHaveLength(2);

    expect(editable.nodes.length).toBeGreaterThan(2);
    // The only composite nodes in the editable tree are the standalone
    // publish-parity overlays (hidden in the editor, shown on publish).
    expect(editable.nodes.some((node) => node.kind === 'composite' && !isStandalonePublishParityAnchor(node.anchorName))).toBe(false);
    expect(editable.nodes.some((node) => node.kind === 'composite' && isStandalonePublishParityAnchor(node.anchorName))).toBe(true);
    expect(editable.nodes.some((node) => node.id === 'page-reviews-form-wrap')).toBe(true);
  });

  it('reserves the live desktop geometry for the editable reviews seed', () => {
    const editable = STANDARD_PAGE_DECOMPOSERS.reviews('ko');
    const nodesById = new Map(editable.nodes.map((node) => [node.id, node]));

    expect(editable.stageHeight).toBe(1711);
    expect(nodesById.get('page-reviews-section-root')?.rect).toMatchObject({ y: 428, height: 1282 });
    expect(nodesById.get('page-reviews-section-container')?.rect).toMatchObject({ x: 51, y: 141, width: 1178, height: 1001 });
    expect(nodesById.get('page-reviews-form-wrap')?.rect).toMatchObject({ x: 269, y: 0, width: 640, height: 759 });
    expect(getNodeClassName(nodesById.get('page-reviews-form-wrap'))).toBe('review-form-wrap');
    expect(nodesById.get('page-reviews-form-title')?.rect).toMatchObject({ x: 32, y: 32, width: 574, height: 24 });
    expect(nodesById.get('page-reviews-form')?.rect).toMatchObject({ x: 32, y: 218, width: 574, height: 508 });
    expect(getNodeClassName(nodesById.get('page-reviews-form'))).toBe('review-form');
    expect(nodesById.get('page-reviews-list-title')?.rect).toMatchObject({ x: 0, y: 816, width: 1178, height: 24 });
    expect(getNodeClassName(nodesById.get('page-reviews-list-title'))).toBe('review-list-title');
    expect(nodesById.get('page-reviews-empty')?.rect).toMatchObject({ x: 0, y: 864, width: 1178, height: 137 });
    expect(getNodeClassName(nodesById.get('page-reviews-empty'))).toBe('review-empty');
  });

  it('keeps the reviews edit builder on public ReviewBoard classes', () => {
    const editable = STANDARD_PAGE_DECOMPOSERS.reviews('ko');
    const nodesById = new Map(editable.nodes.map((node) => [node.id, node]));
    const headerContainer = editable.nodes.find((node) => node.id === 'page-reviews-page-header-container');
    const publicReviewClassNodes = editable.nodes
      .filter((node) => node.id.startsWith('page-reviews-'))
      .map((node) => ({ id: node.id, className: getNodeClassName(node) }))
      .filter(({ className }) => isLegacyReviewLayoutClassName(className));

    expect(getNodeClassName(headerContainer)).toBe('container');
    expect(isLegacyReviewLayoutClassName('container')).toBe(false);
    expect(isLegacyReviewLayoutClassName('review-form-wrap')).toBe(true);
    expect(publicReviewClassNodes.map(({ className }) => className)).toEqual(expect.arrayContaining([
      'section review-section',
      'review-form-wrap',
      'review-form',
      'review-form-row',
      'review-input',
      'review-input review-select',
      'review-input review-textarea',
      'button review-submit',
      'review-list-title',
      'review-empty',
    ]));
    expect(nodesById.get('page-reviews-section-root')?.rect).toMatchObject({ y: 428, height: 1282 });
    expect(nodesById.get('page-reviews-form-wrap')?.rect).toMatchObject({ x: 269, width: 640, height: 759 });
  });

  it('keeps the decomposed reviews edit builder readable without stacked mobile form collisions', () => {
    const editable = STANDARD_PAGE_DECOMPOSERS.reviews('ko');
    const nodesById = new Map(editable.nodes.map((node) => [node.id, node]));
    const title = nodesById.get('page-reviews-page-header-title');
    const row0 = nodesById.get('page-reviews-row-0');
    const row1 = nodesById.get('page-reviews-row-1');
    const starRects = [0, 1, 2, 3, 4].map((index) => ({
      x: getMobileRectValue(nodesById.get(`page-reviews-row-1-rating-star-${index}`), 'x'),
      y: getMobileRectValue(nodesById.get(`page-reviews-row-1-rating-star-${index}`), 'y'),
    }));

    const row0Bottom = getMobileRectValue(row0, 'y') + getMobileRectValue(row0, 'height');

    expect(getMobileRectValue(title, 'x')).toBeGreaterThan(0);
    expect(getMobileRectValue(title, 'width')).toBeLessThan(343);
    expect(getMobileRectValue(row1, 'y')).toBeGreaterThan(row0Bottom);
    expect(starRects.map((rect) => rect.x)).toEqual([0, 34, 68, 102, 136]);
    expect(new Set(starRects.map((rect) => rect.y))).toEqual(new Set([0]));
  });

  it('keeps the decomposed services accordion collapsed on mobile and tablet', () => {
    const editable = STANDARD_PAGE_DECOMPOSERS.services('ko');
    const nodesById = new Map(editable.nodes.map((node) => [node.id, node]));
    const root = nodesById.get('home-services-root');
    const container = nodesById.get('home-services-container');
    const list = nodesById.get('home-services-list');
    const lastCard = nodesById.get('home-services-card-5');
    const lastBody = nodesById.get('home-services-card-5-body');
    const lastMore = nodesById.get('home-services-card-5-more');

    expect(getMobileRectValue(root, 'height')).toBe(1285);
    expect(getMobileRectValue(root, 'width')).toBe(375);
    expect(getMobileRectValue(root, 'y')).toBeLessThan(700);
    expect(getMobileRectValue(container, 'height')).toBe(1187);
    expect(getMobileRectValue(list, 'height')).toBe(942);
    expect(getMobileRectValue(lastCard, 'y')).toBe(810);
    expect(getMobileRectValue(lastCard, 'height')).toBe(130);
    expect(getMobileRectValue(lastBody, 'y')).toBe(97);
    expect(getMobileRectValue(lastBody, 'height')).toBe(1);
    expect(getMobileRectValue(lastMore, 'height')).toBeGreaterThan(1);

    expect(getTabletRectValue(root, 'height')).toBe(1166);
    expect(getTabletRectValue(root, 'width')).toBe(768);
    expect(getTabletRectValue(container, 'height')).toBe(980);
    expect(getTabletRectValue(list, 'height')).toBe(750);
    expect(getTabletRectValue(lastCard, 'y')).toBe(650);
    expect(getTabletRectValue(lastCard, 'height')).toBe(98);
    expect(getTabletRectValue(lastBody, 'height')).toBe(1);
    expect(getTabletRectValue(lastMore, 'height')).toBeGreaterThan(1);

    const mobileMetrics = computeTopLevelFlowSectionMetrics(editable.nodes, 'mobile');
    const tabletMetrics = computeTopLevelFlowSectionMetrics(editable.nodes, 'tablet');
    expect(mobileMetrics.get('home-services-root')?.minHeight).toBe(1285);
    expect(tabletMetrics.get('home-services-root')?.minHeight).toBe(1166);
  });

  it('keeps STANDARD_PAGE_DECOMPOSERS in sync with the shared DECOMPOSABLE_PAGE_SLUGS', () => {
    // The client PageSwitcher gates its "decompose to edit" button on
    // DECOMPOSABLE_PAGE_SLUGS; the server decompose route resolves via
    // STANDARD_PAGE_DECOMPOSERS. They must stay in sync.
    expect(Object.keys(STANDARD_PAGE_DECOMPOSERS).sort()).toEqual([...DECOMPOSABLE_PAGE_SLUGS].sort());
  });

  it('derives responsive CSS for composite seeds and editable decompose targets', () => {
    const decomposableSlugs = new Set<string>(DECOMPOSABLE_PAGE_SLUGS);
    for (const { key, rootId, slug } of LEGACY_PAGES) {
      const docs = [buildLegacyCompositePageCanvas('ko', key, 1200, rootId)];
      if (decomposableSlugs.has(slug)) {
        docs.push(STANDARD_PAGE_DECOMPOSERS[slug as keyof typeof STANDARD_PAGE_DECOMPOSERS]('ko'));
      }
      for (const doc of docs) {
        expect(countResponsiveNodes(doc)).toBeGreaterThan(0);
        expect(buildResponsiveStylesheet(doc.nodes)).toContain('@media (max-width: 767px)');
      }
    }
  });

  it('reserves enough mobile/tablet stage height for the dynamic reviews ReviewBoard', () => {
    // The reviews composite seed is a 2-node document whose composite hosts the
    // dynamic legacy ReviewBoard. responsivize alone crushes both nodes to
    // ~24-64px (no builder children to measure), which lets the footer overlap
    // the rendered form + review list. The seed must reserve real height.
    const seeded = buildReviewsCompositePageCanvas('ko');
    const root = seeded.nodes.find((node) => node.id === 'reviews-page-root');
    const composite = seeded.nodes.find((node) => node.id === 'reviews-page-root-composite');

    expect(root).toBeDefined();
    expect(composite).toBeDefined();

    const rootMobileHeight = root?.responsive?.mobile?.rect?.height;
    const rootTabletHeight = root?.responsive?.tablet?.rect?.height;
    const compositeMobileHeight = composite?.responsive?.mobile?.rect?.height;
    const compositeTabletHeight = composite?.responsive?.tablet?.rect?.height;

    // Must not be the crushed responsivize defaults (64 / 24).
    expect(rootMobileHeight).not.toBe(64);
    expect(compositeMobileHeight).not.toBe(24);
    expect(rootMobileHeight).toBe(1458);
    expect(compositeMobileHeight).toBe(1458);
    expect(rootTabletHeight).toBe(1599);
    expect(compositeTabletHeight).toBe(1599);
  });

  it('keeps the top-level reviews root in flow so the footer follows the reserved height', () => {
    const seeded = buildReviewsCompositePageCanvas('ko');
    const css = buildResponsiveStylesheet(seeded.nodes);
    const rootRules = css.split('\n').filter((line) => line.includes('[data-node-id="reviews-page-root"]'));
    const mobileRules = css.split('@media (max-width: 767px)')[1] ?? '';

    // The reviews root is `as: main`, so it must stay position:relative (in flow),
    // never position:absolute, so the footer lands below the reserved height.
    expect(rootRules.some((line) => line.includes('position: relative !important'))).toBe(true);
    expect(rootRules.some((line) => line.includes('position: absolute'))).toBe(false);
    expect(rootRules.some((line) => line.includes('left:'))).toBe(false);
    expect(rootRules.some((line) => line.includes('top:'))).toBe(false);
    // The reserved mobile height actually reaches the stylesheet.
    expect(mobileRules).toContain('height: 1458px !important');
  });

  it('reserves measured desktop/mobile/tablet geometry for the videos media hub', () => {
    const seeded = buildVideosCompositePageCanvas('ko');
    const root = seeded.nodes.find((node) => node.id === 'videos-page-root');
    const composite = seeded.nodes.find((node) => node.id === 'videos-page-root-composite');

    expect(seeded.stageHeight).toBe(2821);
    expect(root?.rect.height).toBe(2821);
    expect(composite?.rect.height).toBe(2821);
    expect(root?.responsive?.mobile?.rect?.height).toBe(3460);
    expect(composite?.responsive?.mobile?.rect?.height).toBe(3460);
    expect(root?.responsive?.tablet?.rect?.height).toBe(3001);
    expect(composite?.responsive?.tablet?.rect?.height).toBe(3001);
  });
});
