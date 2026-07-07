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

function absoluteRect(
  nodesById: Map<string, BuilderCanvasNode>,
  id: string,
): Rect {
  return resolveCanvasNodeAbsoluteRectForViewport(requireNode(nodesById, id), nodesById, 'desktop');
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
    expect(nodesById.get('home-hero-search-wrapper')?.rect).toMatchObject({ x: 51, y: 743, width: 1151, height: 62 });

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
    expect(nodesById.get('home-offices-container')?.rect).toMatchObject({ x: 51, y: 149, width: 1178, height: 628 });
    expect(nodesById.get('home-offices-tabs')?.rect).toMatchObject({ x: 0, y: 132, width: 1178, height: 47 });
    expect(nodesById.get('home-offices-layout-0')?.rect).toMatchObject({ x: 0, y: 198, width: 1178, height: 422 });
  });

  it('keeps the zh-hant case result title clear of the body copy', () => {
    const doc = createHomePageCanvasDocument('zh-hant');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const title = absoluteRect(nodesById, 'home-case-results-title');
    const desc = absoluteRect(nodesById, 'home-case-results-desc');

    expect(nodesById.get('home-case-results-label')?.rect).toMatchObject({ x: 78 });
    expect(nodesById.get('home-case-results-title')?.rect).toMatchObject({ x: 78, y: 172, width: 720, height: 172 });
    expect(nodesById.get('home-case-results-divider')?.rect).toMatchObject({ x: 78, y: 344 });
    expect(nodesById.get('home-case-results-desc')?.rect).toMatchObject({ x: 78, y: 356, width: 720, height: 80 });
    expect(nodesById.get('home-case-results-summary')?.rect).toMatchObject({ x: 78, y: 446 });
    expect(nodesById.get('home-case-results-cta')?.rect).toMatchObject({ x: 78, y: 516 });
    expect(rectsOverlap(title, desc)).toBe(false);
    expect(desc.y - (title.y + title.height)).toBeGreaterThanOrEqual(12);
  });

  it('matches zh-hant attorney decomposition to the composite split portrait geometry', () => {
    const doc = createHomePageCanvasDocument('zh-hant');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const image = requireNode(nodesById, 'home-attorney-image');

    expect(isImageNode(image)).toBe(true);
    if (!isImageNode(image)) {
      throw new Error('Expected home-attorney-image to be an image node.');
    }
    expect(image.content).toMatchObject({
      src: '/_next/image?url=%2Fimages%2Fteam%2Ftseng-junwei%2Epng&w=640&q=75',
      fit: 'cover',
      alt: '曾俊瑋 代表律師',
      gif: { provider: 'manual' },
      filters: {
        brightness: 93,
        contrast: 98,
        saturation: 93,
        blur: 0,
        grayscale: 0,
        sepia: 0,
      },
    });

    expect(absoluteRect(nodesById, 'home-attorney-image-wrap')).toMatchObject({ x: 0, y: 3442, width: 576, height: 644 });
    expect(absoluteRect(nodesById, 'home-attorney-image')).toMatchObject({ x: 0, y: 3442, width: 576, height: 644 });
    expect(absoluteRect(nodesById, 'home-attorney-badge')).toMatchObject({ x: 0, y: 4009, width: 533, height: 77 });
    expect(absoluteRect(nodesById, 'home-attorney-label')).toMatchObject({ x: 653, y: 3580, width: 550, height: 21 });
    expect(absoluteRect(nodesById, 'home-attorney-title')).toMatchObject({ x: 653, y: 3618, width: 550, height: 86 });
    expect(absoluteRect(nodesById, 'home-attorney-divider')).toMatchObject({ x: 653, y: 3710, width: 40, height: 32 });
    expect(absoluteRect(nodesById, 'home-attorney-intro-1')).toMatchObject({ x: 653, y: 3747, width: 540, height: 27 });
    expect(absoluteRect(nodesById, 'home-attorney-intro-2')).toMatchObject({ x: 653, y: 3790, width: 540, height: 27 });
    expect(absoluteRect(nodesById, 'home-attorney-summary')).toMatchObject({ x: 653, y: 3833, width: 540, height: 27 });
    expect(absoluteRect(nodesById, 'home-attorney-contact-line')).toMatchObject({ x: 653, y: 3876, width: 540, height: 27 });
    expect(absoluteRect(nodesById, 'home-attorney-cta')).toMatchObject({ x: 653, y: 3919, width: 550, height: 29 });

    expect(textNodeText(nodesById.get('home-attorney-label'))).toBe('ABOUT');
    expect(textNodeText(nodesById.get('home-attorney-title'))).toBe('曾俊瑋律師，專注服務韓國客戶的台灣法律夥伴');
    expect(textNodeText(nodesById.get('home-attorney-intro-1'))).toBe('專精企業與個人案件，提供韓文與日文法律溝通。');
    expect(textNodeText(nodesById.get('home-attorney-intro-2'))).toBe('曾代理韓國留學生健身傷害求償案，獲判新台幣 157 萬元。');
    expect(textNodeText(nodesById.get('home-attorney-summary'))).toBe('擁有 10+ 年實務經驗，曾參與韓國 SBS 晨間節目並持續經營 WEI Lawyer 法律內容。');
    expect(textNodeText(nodesById.get('home-attorney-contact-line'))).toBe('曾俊瑋 · 代表律師 · wei@hoveringlaw.com.tw');

    const divider = requireNode(nodesById, 'home-attorney-divider');
    expect(divider).toMatchObject({
      kind: 'divider',
      content: {
        orientation: 'horizontal',
        thickness: 2,
        color: '#16382d',
        style: 'solid',
      },
    });
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
      ['home-hero-search-input', 743],
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

  it('keeps ko and en attorney geometry unchanged by the zh-hant calibration', () => {
    const attorneyIds = [
      'home-attorney-image-wrap',
      'home-attorney-image',
      'home-attorney-badge',
      'home-attorney-content',
      'home-attorney-label',
      'home-attorney-title',
      'home-attorney-divider',
      'home-attorney-intro-1',
      'home-attorney-intro-2',
      'home-attorney-summary',
      'home-attorney-contact-line',
      'home-attorney-cta',
    ] as const;
    const koDoc = createHomePageCanvasDocument('ko');
    const enDoc = createHomePageCanvasDocument('en');
    const koNodesById = new Map(koDoc.nodes.map((node) => [node.id, node]));
    const enNodesById = new Map(enDoc.nodes.map((node) => [node.id, node]));

    expect(attorneyIds.map((id) => [id, absoluteRect(koNodesById, id)])).toEqual([
      ['home-attorney-image-wrap', { x: 0, y: 3485, width: 576, height: 644 }],
      ['home-attorney-image', { x: 0, y: 3485, width: 576, height: 644 }],
      ['home-attorney-badge', { x: 22, y: 4031, width: 533, height: 77 }],
      ['home-attorney-content', { x: 576, y: 3485, width: 704, height: 644 }],
      ['home-attorney-label', { x: 576, y: 3610, width: 180, height: 28 }],
      ['home-attorney-title', { x: 576, y: 3649, width: 560, height: 86 }],
      ['home-attorney-divider', { x: 576, y: 3759, width: 80, height: 4 }],
      ['home-attorney-intro-1', { x: 576, y: 3787, width: 560, height: 58 }],
      ['home-attorney-intro-2', { x: 576, y: 3857, width: 560, height: 58 }],
      ['home-attorney-summary', { x: 576, y: 3927, width: 560, height: 82 }],
      ['home-attorney-contact-line', { x: 576, y: 3995, width: 560, height: 40 }],
      ['home-attorney-cta', { x: 576, y: 3976, width: 220, height: 28 }],
    ]);
    expect(attorneyIds.map((id) => [id, absoluteRect(enNodesById, id)])).toEqual([
      ['home-attorney-image-wrap', { x: 0, y: 3326, width: 576, height: 720 }],
      ['home-attorney-image', { x: 0, y: 3326, width: 576, height: 720 }],
      ['home-attorney-badge', { x: 24, y: 3886, width: 528, height: 108 }],
      ['home-attorney-content', { x: 576, y: 3326, width: 704, height: 720 }],
      ['home-attorney-label', { x: 576, y: 3418, width: 180, height: 28 }],
      ['home-attorney-title', { x: 576, y: 3462, width: 560, height: 96 }],
      ['home-attorney-divider', { x: 576, y: 3572, width: 80, height: 4 }],
      ['home-attorney-intro-1', { x: 576, y: 3600, width: 560, height: 58 }],
      ['home-attorney-intro-2', { x: 576, y: 3670, width: 560, height: 58 }],
      ['home-attorney-summary', { x: 576, y: 3740, width: 560, height: 82 }],
      ['home-attorney-contact-line', { x: 576, y: 3836, width: 560, height: 40 }],
      ['home-attorney-cta', { x: 576, y: 3900, width: 220, height: 28 }],
    ]);
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
