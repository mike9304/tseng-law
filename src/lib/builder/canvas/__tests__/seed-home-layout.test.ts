import { describe, expect, it } from 'vitest';
// The default home seed is now a live-reflecting composite stack; this layout
// regression suite targets the editable decomposed home (the "decompose to edit"
// output), where granular node positions still matter.
import { createHomePageCanvasDocumentDecomposed as createHomePageCanvasDocument } from '../seed-home';
import type { BuilderCanvasNode, BuilderImageCanvasNode } from '../types';
import {
  buildChildrenMap,
  getCanvasNodeDescendantIds,
  resolveCanvasNodeAbsoluteRectForViewport,
} from '../tree';
import { HERO_SEARCH_WRAPPER_Y } from '../decompose-hero';
import { getAllColumnPosts, type ColumnPost } from '@/lib/columns';
import { createInsightsDecomposedNodes } from '../decompose-insights';
import { computeTopLevelFlowSectionMetrics } from '../flow';

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width
    && a.x + a.width > b.x
    && a.y < b.y + b.height
    && a.y + a.height > b.y;
}

function textNodeText(node: BuilderCanvasNode | undefined): string | undefined {
  if (node?.kind !== 'text') return undefined;
  return node.content.text;
}

function requireNode(nodesById: ReadonlyMap<string, BuilderCanvasNode>, id: string): BuilderCanvasNode {
  const node = nodesById.get(id);
  if (!node) {
    throw new Error(`Expected ${id} to exist.`);
  }
  return node;
}

function isImageNode(node: BuilderCanvasNode): node is BuilderImageCanvasNode {
  return node.kind === 'image';
}

function createColumnPost(overrides: Partial<ColumnPost> & Pick<ColumnPost, 'slug' | 'title'>): ColumnPost {
  const post: ColumnPost = {
    slug: overrides.slug,
    title: overrides.title,
    date: overrides.date ?? '',
    dateDisplay: overrides.dateDisplay ?? '',
    readTime: overrides.readTime ?? '',
    category: overrides.category ?? 'legal',
    categoryLabel: overrides.categoryLabel ?? '법률정보',
    featuredImage: overrides.featuredImage ?? '/images/blog/placeholder.jpg',
    content: overrides.content ?? '',
    summary: overrides.summary ?? '',
  };
  if (overrides.blogCategory) post.blogCategory = overrides.blogCategory;
  if (overrides.authorName) post.authorName = overrides.authorName;
  if (overrides.tags) post.tags = overrides.tags;
  return post;
}

const EXPECTED_ZH_HANT_DECOMPOSED_SECTION_RECTS = [
  { id: 'home-hero-root', y: 0, height: 774 },
  { id: 'home-insights-root', y: 774, height: 1247 },
  { id: 'home-services-root', y: 2021, height: 1279 },
  { id: 'home-attorney-root', y: 3300, height: 926 },
  { id: 'home-case-results-root', y: 4226, height: 843 },
  { id: 'home-stats-root', y: 5069, height: 622 },
  { id: 'home-faq-root', y: 5691, height: 1333 },
  { id: 'home-offices-root', y: 7024, height: 919 },
  { id: 'home-contact-root', y: 7943, height: 543 },
] as const;

const EXPECTED_KO_DECOMPOSED_SECTION_RECTS = [
  { id: 'home-hero-root', y: 0, height: 788 },
  { id: 'home-insights-root', y: 788, height: 1277 },
  { id: 'home-services-root', y: 2065, height: 1279 },
  { id: 'home-attorney-root', y: 3344, height: 926 },
  { id: 'home-case-results-root', y: 4270, height: 800 },
  { id: 'home-stats-root', y: 5070, height: 621 },
  { id: 'home-faq-root', y: 5691, height: 1333 },
  { id: 'home-offices-root', y: 7024, height: 919 },
  { id: 'home-contact-root', y: 7943, height: 532 },
] as const;

describe('home seed canvas layout', () => {
  it('keeps visible seed nodes within the desktop stage width', () => {
    const doc = createHomePageCanvasDocument('ko');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const offenders = doc.nodes
      .filter((node) => node.visible !== false)
      .map((node) => ({
        id: node.id,
        rect: resolveCanvasNodeAbsoluteRectForViewport(node, nodesById, 'desktop'),
      }))
      .filter(({ rect }) => rect.x < -1 || rect.x + rect.width > doc.stageWidth + 1)
      .map(({ id, rect }) => ({
        id,
        x: rect.x,
        right: rect.x + rect.width,
        stageWidth: doc.stageWidth,
      }));

    expect(offenders).toEqual([]);
  });

  it('keeps legacy boundary controls clear of the following home section', () => {
    const doc = createHomePageCanvasDocument('en');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));

    const heroRootRect = resolveCanvasNodeAbsoluteRectForViewport(requireNode(nodesById, 'home-hero-root'), nodesById, 'desktop');
    const heroSearchRect = resolveCanvasNodeAbsoluteRectForViewport(requireNode(nodesById, 'home-hero-search-wrap'), nodesById, 'desktop');
    const insightsRootRect = resolveCanvasNodeAbsoluteRectForViewport(requireNode(nodesById, 'home-insights-root'), nodesById, 'desktop');
    const insightsCtaRect = resolveCanvasNodeAbsoluteRectForViewport(requireNode(nodesById, 'home-insights-view-all'), nodesById, 'desktop');

    // Live hero keeps the search bar ~83px clear of the hero bottom edge
    // (public probe: bar 786-848 inside hero 111-931). The editor smoke
    // (admin-builder.playwright.ts) requires >=48px rendered clearance, so the
    // model must not pin the bar flush to the section boundary.
    expect(
      heroRootRect.y + heroRootRect.height - (heroSearchRect.y + heroSearchRect.height),
    ).toBeGreaterThanOrEqual(48);
    expect(insightsRootRect.y + insightsRootRect.height - (insightsCtaRect.y + insightsCtaRect.height)).toBeGreaterThanOrEqual(80);
  });

  it('matches the public insights archive pagination layout', () => {
    const doc = createHomePageCanvasDocument('ko');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const controls = nodesById.get('home-insights-controls');
    const pageIndicator = nodesById.get('home-insights-page-indicator');
    const list = nodesById.get('home-insights-list');
    const listWrap = nodesById.get('home-insights-list-wrap');
    const featuredTitle = nodesById.get('home-insights-featured-title');
    const firstListTitle = nodesById.get('home-insights-item-0-title');
    const publicHomePosts = getAllColumnPosts('ko');
    const expectedPageCount = Math.max(1, Math.ceil(Math.max(publicHomePosts.length - 1, 0) / 3));

    expect(controls).toBeDefined();
    expect(textNodeText(pageIndicator)).toBe(`1 / ${expectedPageCount}`);
    expect(listWrap?.rect.x).toBe(623);
    expect(listWrap?.rect.width).toBe(536);
    expect(list?.rect.x).toBe(20);
    expect(list?.rect.y).toBe(72);
    expect(list?.rect.width).toBe(496);
    expect(list?.rect.height).toBe(620);
    expect(listWrap?.rect.height).toBe(720);
    expect(firstListTitle?.rect.width).toBe(352);
    expect(textNodeText(featuredTitle)).toBe(publicHomePosts[0]?.title);
    expect(textNodeText(firstListTitle)).toBe(publicHomePosts[1]?.title);
  });

  it('uses a supplied insights source for decomposed public preview metadata', () => {
    const sourcePosts = [
      createColumnPost({
        slug: 'featured',
        title: 'Featured column',
        dateDisplay: '2026-02-04',
        readTime: '12 min',
      }),
      createColumnPost({
        slug: 'labor',
        title: '대만 노동법：대만에서 퇴직금 받기 어렵다고??',
        dateDisplay: '2025-09-18',
        readTime: '17 min',
      }),
      createColumnPost({
        slug: 'company',
        title: '대만 회사설립 -기초편-',
        dateDisplay: '2025-09-13',
        readTime: '17 min',
      }),
      createColumnPost({
        slug: 'withdraw',
        title: '대만에서 설립한 회사를 더 이상 운영하고 싶지 않을 때, 자본금을 어떻게 회수할 수 있을까요?',
        dateDisplay: '2025-09-13',
        readTime: '8 min',
      }),
    ];
    const nodes = createInsightsDecomposedNodes(0, 'ko', 0, sourcePosts);
    const nodesById = new Map(nodes.map((node) => [node.id, node]));

    expect(textNodeText(nodesById.get('home-insights-item-0-date'))).toBe('2025-09-18');
    expect(textNodeText(nodesById.get('home-insights-item-0-readtime'))).toBe('17 min');
    expect(textNodeText(nodesById.get('home-insights-item-2-readtime'))).toBe('8 min');
    expect(nodesById.get('home-insights-controls')).toBeUndefined();
  });

  it('keeps home hero title and subtitle hit targets separated', () => {
    const doc = createHomePageCanvasDocument('ko');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));

    const titleRect = resolveCanvasNodeAbsoluteRectForViewport(requireNode(nodesById, 'home-hero-title'), nodesById, 'desktop');
    const subtitleRect = resolveCanvasNodeAbsoluteRectForViewport(requireNode(nodesById, 'home-hero-subtitle'), nodesById, 'desktop');

    expect(rectsOverlap(titleRect, subtitleRect)).toBe(false);
    expect(subtitleRect.y - (titleRect.y + titleRect.height)).toBeGreaterThanOrEqual(24);
  });

  it('places the legacy decomposed home hero copy on the published desktop grid', () => {
    const doc = createHomePageCanvasDocument('en');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const inner = nodesById.get('home-hero-inner');
    const copy = nodesById.get('home-hero-copy');
    const label = nodesById.get('home-hero-label');
    const title = nodesById.get('home-hero-title');
    const subtitle = nodesById.get('home-hero-subtitle');
    const links = nodesById.get('home-hero-links');
    const search = nodesById.get('home-hero-search-wrapper');
    const arrow = nodesById.get('home-hero-scroll-arrow');

    expect(inner?.rect).toMatchObject({ x: 51, y: 184, width: 1178, height: 483 });
    expect(copy?.rect).toMatchObject({ x: 0, y: 0, width: 780, height: 363 });
    expect(label?.rect).toMatchObject({ x: 0, y: 1, width: 240, height: 32 });
    expect(title?.rect).toMatchObject({ x: 0, y: 56, width: 780, height: 167 });
    expect(subtitle?.rect).toMatchObject({ x: 0, y: 247, width: 580, height: 116 });
    expect(links?.rect).toMatchObject({ x: 0, y: 338, width: 260, height: 32 });
    expect(search?.rect).toMatchObject({ x: 0, y: HERO_SEARCH_WRAPPER_Y, width: 1280, height: 62 });
    expect(arrow?.rect).toMatchObject({ x: 1216, y: 746, width: 48, height: 48 });
  });

  it('preserves the public home hero media fallback images', () => {
    const doc = createHomePageCanvasDocument('ko');
    const imageNodes = doc.nodes
      .filter((node): node is BuilderImageCanvasNode => node.parentId === 'home-hero-media' && isImageNode(node))
      .map((node) => ({
        id: node.id,
        src: node.content.src,
        opacity: node.style.opacity,
      }));

    expect(imageNodes).toEqual([
      { id: 'home-hero-media-image', src: '/images/hero-bg-01.webp', opacity: 100 },
      { id: 'home-hero-media-image-2', src: '/images/hero-bg-02.webp', opacity: 0 },
      { id: 'home-hero-media-image-3', src: '/images/hero-bg-03.webp', opacity: 0 },
    ]);
  });

  it('keeps non-overlay home section descendants inside their section bounds', () => {
    const doc = createHomePageCanvasDocument('ko');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const childrenMap = buildChildrenMap(doc.nodes);
    const overlaySectionIds = new Set(['home-hero-root']);
    const offenders = doc.nodes
      .filter((node) => !node.parentId && /^home-.+-root$/.test(node.id) && !overlaySectionIds.has(node.id))
      .flatMap((root) => {
        const rootRect = resolveCanvasNodeAbsoluteRectForViewport(root, nodesById, 'desktop');
        return getCanvasNodeDescendantIds(root.id, childrenMap)
          .map((descendantId) => {
            const descendant = nodesById.get(descendantId);
            if (!descendant || descendant.visible === false) return null;
            const rect = resolveCanvasNodeAbsoluteRectForViewport(descendant, nodesById, 'desktop');
            return {
              id: descendant.id,
              sectionId: root.id,
              bottom: rect.y + rect.height,
              sectionBottom: rootRect.y + rootRect.height,
            };
          })
          .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
          .filter((entry) => entry.bottom > entry.sectionBottom + 1);
      });

    expect(offenders).toEqual([]);
  });

  it('matches zh-hant decomposed home section geometry to the localized composite flow', () => {
    const doc = createHomePageCanvasDocument('zh-hant');

    expect(doc.stageHeight).toBe(8488);
    expect(
      doc.nodes
        .filter((node) => !node.parentId && /^home-.+-root$/.test(node.id))
        .map((node) => ({
          id: node.id,
          y: node.rect.y,
          height: node.rect.height,
        })),
    ).toEqual(EXPECTED_ZH_HANT_DECOMPOSED_SECTION_RECTS);
  });

  it('matches zh-hant decomposed child anchors to the measured composite render', () => {
    const doc = createHomePageCanvasDocument('zh-hant');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));

    expect(nodesById.get('home-hero-inner')?.rect).toMatchObject({ x: 51, y: 175, width: 1178, height: 483 });
    expect(nodesById.get('home-hero-links')?.rect).toMatchObject({ x: 0, y: 286, width: 260, height: 32 });
    expect(nodesById.get('home-hero-search-wrapper')?.rect).toMatchObject({ x: 51, y: 712, width: 1151, height: 62 });

    const overlay = nodesById.get('home-hero-overlay');
    expect(overlay).toBeDefined();
    expect(overlay?.parentId).toBe('home-hero-root');
    expect(overlay?.rect).toMatchObject({ x: 0, y: 0, width: 1280, height: 774 });
    expect(String(overlay?.style.backgroundColor)).toContain('linear-gradient(118deg');
    expect(doc.nodes.findIndex((node) => node.id === 'home-hero-overlay')).toBeGreaterThan(
      doc.nodes.findIndex((node) => node.id === 'home-hero-media-image-3'),
    );
    expect(doc.nodes.findIndex((node) => node.id === 'home-hero-overlay')).toBeLessThan(
      doc.nodes.findIndex((node) => node.id === 'home-hero-inner'),
    );

    expect(nodesById.get('home-faq-container')?.rect).toMatchObject({ x: 72, y: 110, width: 1136, height: 1206 });
    expect(nodesById.get('home-faq-list')?.rect).toMatchObject({ x: 0, y: 149, width: 1136, height: 1074 });
    expect(nodesById.get('home-offices-container')?.rect).toMatchObject({ x: 72, y: 149, width: 1136, height: 743 });
    expect(nodesById.get('home-offices-tabs')?.rect).toMatchObject({ x: 0, y: 132, width: 560, height: 36 });
    expect(nodesById.get('home-offices-layout-0')?.rect).toMatchObject({ x: 0, y: 198, width: 1136, height: 548 });
  });

  it('matches ko decomposed home section geometry to the measured composite flow', () => {
    const doc = createHomePageCanvasDocument('ko');

    expect(doc.stageHeight).toBe(8477);
    expect(
      doc.nodes
        .filter((node) => !node.parentId && /^home-.+-root$/.test(node.id))
        .map((node) => ({
          id: node.id,
          y: node.rect.y,
          height: node.rect.height,
        })),
    ).toEqual(EXPECTED_KO_DECOMPOSED_SECTION_RECTS);
  });

  it('matches ko decomposed child anchors to the measured composite render', () => {
    const doc = createHomePageCanvasDocument('ko');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));

    const anchorRects = [
      ['home-hero-title', 217],
      ['home-hero-subtitle', 408],
      ['home-hero-links', 499],
      ['home-hero-search-input', 713],
      ['home-insights-title', 917],
      ['home-insights-featured-title', 1577],
      ['home-services-title', 2256],
      ['home-services-card-0', 2389],
      ['home-attorney-label', 3610],
      ['home-attorney-title', 3649],
      ['home-attorney-cta', 3976],
      ['home-case-results-title', 4528],
      ['home-case-results-cta', 4822],
      ['home-stats-title', 5261],
      ['home-faq-title', 5880],
      ['home-faq-item-0', 5973],
      ['home-offices-tabs', 7305],
      ['home-contact-title', 8133],
      ['home-contact-primary', 8287],
    ] as const;

    expect(nodesById.get('home-hero-overlay')).toBeDefined();
    expect(textNodeText(nodesById.get('home-faq-label'))).toBe('자주 묻는 질문');
    expect(anchorRects.map(([id, y]) => {
      const node = requireNode(nodesById, id);
      return [id, resolveCanvasNodeAbsoluteRectForViewport(node, nodesById, 'desktop').y, y];
    })).toEqual(anchorRects.map(([id, y]) => [id, y, y]));
  });

  it('keeps en decomposed child geometry unchanged by localized calibration', () => {
    const doc = createHomePageCanvasDocument('en');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));

    expect(nodesById.has('home-hero-overlay')).toBe(false);
    expect(nodesById.get('home-hero-inner')?.rect).toMatchObject({ x: 51, y: 184, width: 1178, height: 483 });
    expect(nodesById.get('home-hero-links')?.rect).toMatchObject({ x: 0, y: 338, width: 260, height: 32 });
    expect(nodesById.get('home-hero-search-wrapper')?.rect).toMatchObject({ x: 0, y: HERO_SEARCH_WRAPPER_Y, width: 1280, height: 62 });
    expect(nodesById.get('home-faq-container')?.rect).toMatchObject({ x: 72, y: 88, width: 1136, height: 1280 });
    expect(nodesById.get('home-offices-container')?.rect).toMatchObject({ x: 72, y: 88, width: 1136, height: 600 });
    expect(nodesById.get('home-offices-tabs')?.rect).toMatchObject({ x: 0, y: 116, width: 560, height: 36 });
    expect(nodesById.get('home-offices-layout-0')?.rect).toMatchObject({ x: 0, y: 184, width: 1136, height: 420 });
  });

  it('keeps zh-hant non-overlay descendants inside their localized section bounds', () => {
    const doc = createHomePageCanvasDocument('zh-hant');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const childrenMap = buildChildrenMap(doc.nodes);
    const overlaySectionIds = new Set(['home-hero-root']);
    const offenders = doc.nodes
      .filter((node) => !node.parentId && /^home-.+-root$/.test(node.id) && !overlaySectionIds.has(node.id))
      .flatMap((root) => {
        const rootRect = resolveCanvasNodeAbsoluteRectForViewport(root, nodesById, 'desktop');
        return getCanvasNodeDescendantIds(root.id, childrenMap)
          .map((descendantId) => {
            const descendant = nodesById.get(descendantId);
            if (!descendant || descendant.visible === false) return null;
            const rect = resolveCanvasNodeAbsoluteRectForViewport(descendant, nodesById, 'desktop');
            return {
              id: descendant.id,
              sectionId: root.id,
              bottom: rect.y + rect.height,
              sectionBottom: rootRect.y + rootRect.height,
            };
          })
          .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
          .filter((entry) => entry.bottom > entry.sectionBottom + 1);
      });

    expect(offenders).toEqual([]);
  });

  it('keeps the decomposed home services section collapsed on mobile and tablet', () => {
    const doc = createHomePageCanvasDocument('ko');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const root = nodesById.get('home-services-root');
    const container = nodesById.get('home-services-container');
    const list = nodesById.get('home-services-list');
    const mobileMetrics = computeTopLevelFlowSectionMetrics(doc.nodes, 'mobile');
    const tabletMetrics = computeTopLevelFlowSectionMetrics(doc.nodes, 'tablet');

    expect(root?.responsive?.mobile?.rect?.height).toBe(1285);
    expect(container?.responsive?.mobile?.rect?.height).toBe(1187);
    expect(list?.responsive?.mobile?.rect?.height).toBe(942);
    expect(mobileMetrics.get('home-services-root')?.minHeight).toBe(1285);

    expect(root?.responsive?.tablet?.rect?.height).toBe(1166);
    expect(container?.responsive?.tablet?.rect?.height).toBe(980);
    expect(list?.responsive?.tablet?.rect?.height).toBe(750);
    expect(tabletMetrics.get('home-services-root')?.minHeight).toBe(1166);
  });

  it('keeps the home FAQ list sized around all collapsed items', () => {
    const doc = createHomePageCanvasDocument('ko');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const childrenMap = buildChildrenMap(doc.nodes);
    const list = nodesById.get('home-faq-list');

    expect(list).toBeDefined();
    if (!list) {
      throw new Error('Expected home FAQ list to exist.');
    }

    const listRect = resolveCanvasNodeAbsoluteRectForViewport(list, nodesById, 'desktop');
    const offenders = getCanvasNodeDescendantIds(list.id, childrenMap)
      .map((descendantId) => {
        const descendant = nodesById.get(descendantId);
        if (!descendant || descendant.visible === false) return null;
        const rect = resolveCanvasNodeAbsoluteRectForViewport(descendant, nodesById, 'desktop');
        return {
          id: descendant.id,
          bottom: rect.y + rect.height,
          listBottom: listRect.y + listRect.height,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
      .filter((entry) => entry.bottom > entry.listBottom + 1);

    expect(offenders).toEqual([]);
  });
});
