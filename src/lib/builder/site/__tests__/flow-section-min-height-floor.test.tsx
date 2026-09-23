import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { createHomeTextNode } from '@/lib/builder/canvas/decompose-home-shared';
import {
  CANVAS_SANDBOX_UPDATED_BY,
  createDefaultCanvasNodeStyle,
  type BuilderCanvasDocument,
  type BuilderCanvasNode,
} from '@/lib/builder/canvas/types';
import {
  flowSectionUsesMinHeightFloor,
  PublishedSitePageView,
  type ResolvedPublishedSitePage,
} from '@/lib/builder/site/public-page';
import { DEFAULT_THEME } from '@/lib/builder/site/types';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ko/flow-floor',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

function composite(id: string, y: number, height: number): BuilderCanvasNode {
  return {
    id,
    kind: 'composite',
    rect: { x: 0, y, width: 1280, height },
    content: { componentKey: 'unknown-self-sizing-component', config: {} },
    style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    // Unregistered key: renders nothing, isolating the wrapper's style.
  } as unknown as BuilderCanvasNode;
}

function sectionContainer(id: string, y: number, height: number): BuilderCanvasNode {
  return {
    id,
    kind: 'container',
    rect: { x: 0, y, width: 1280, height },
    content: {
      label: id,
      background: 'transparent',
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      padding: 0,
      layoutMode: 'absolute',
      as: 'section',
    },
    style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
  } as BuilderCanvasNode;
}

function resolvedPage(nodes: BuilderCanvasNode[]): ResolvedPublishedSitePage {
  const now = '2026-09-23T00:00:00.000Z';
  const canvas: BuilderCanvasDocument = {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: CANVAS_SANDBOX_UPDATED_BY,
    stageWidth: 1280,
    stageHeight: 2400,
    nodes,
  };
  return {
    locale: 'ko',
    slugPath: 'flow-floor',
    canvas,
    site: {
      version: 1,
      siteId: 'flow-floor-fixture',
      name: 'Flow Floor Fixture',
      locale: 'ko',
      navigation: [],
      theme: DEFAULT_THEME,
      settings: { firmName: 'Flow Floor Fixture' },
      pages: [],
      createdAt: now,
      updatedAt: now,
    },
    pageMeta: {
      pageId: 'flow-floor-fixture',
      slug: 'flow-floor',
      title: { ko: '플로우', 'zh-hant': '流', en: 'Flow' },
      locale: 'ko',
      createdAt: now,
      updatedAt: now,
      publishedAt: now,
      noIndex: true,
    },
    lightboxes: [],
    popups: [],
    cookieConsent: null,
    headerCanvas: null,
    footerCanvas: null,
    datasetPreviewTargets: [],
    columnPosts: [],
    faqCategories: [],
    faqItems: [],
  };
}

function openingTag(html: string, nodeId: string): string {
  const tags = html.match(/<[a-z][^>]*>/gi) ?? [];
  return tags.find((tag) => tag.includes(`data-node-id="${nodeId}"`)) ?? '';
}

function styleAttr(tag: string): string {
  return tag.match(/style="([^"]*)"/)?.[1] ?? '';
}

function desktopFloorCss(html: string): string {
  return html.match(/<style[^>]*data-builder-flow-section-desktop="true"[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '';
}

describe('flowSectionUsesMinHeightFloor', () => {
  it('drops the floor only for composites without visible builder children', () => {
    expect(flowSectionUsesMinHeightFloor({ id: 'a', kind: 'composite' }, {})).toBe(false);
    expect(flowSectionUsesMinHeightFloor({ id: 'a', kind: 'composite' }, { a: [] })).toBe(false);
    expect(flowSectionUsesMinHeightFloor({ id: 'a', kind: 'composite' }, { a: ['child'] })).toBe(true);
    expect(flowSectionUsesMinHeightFloor({ id: 'b', kind: 'container' }, {})).toBe(true);
  });
});

describe('published top-level flow section min-height floor', () => {
  it('omits inline and desktop !important min-height for a childless composite, keeps it for sections and parent composites', async () => {
    const childless = composite('childless-composite', 0, 900);
    const section = sectionContainer('section-container', 900, 700);
    const parentComposite = composite('parent-composite', 1600, 640);
    const child = {
      ...createHomeTextNode({
        id: 'parent-composite-child',
        parentId: 'parent-composite',
        rect: { x: 24, y: 24, width: 400, height: 40 },
        zIndex: 2,
        text: '자식 텍스트',
      }),
      visible: true,
    } as BuilderCanvasNode;
    const hiddenChildComposite = composite('hidden-child-composite', 2240, 160);
    const hiddenChild = {
      ...createHomeTextNode({
        id: 'hidden-child',
        parentId: 'hidden-child-composite',
        rect: { x: 0, y: 0, width: 100, height: 20 },
        zIndex: 2,
        text: '숨김',
      }),
      visible: false,
    } as BuilderCanvasNode;

    const element = await PublishedSitePageView({
      resolved: resolvedPage([childless, section, parentComposite, child, hiddenChildComposite, hiddenChild]),
    });
    const html = renderToStaticMarkup(element);
    const css = desktopFloorCss(html);

    const childlessStyle = styleAttr(openingTag(html, 'childless-composite'));
    expect(openingTag(html, 'childless-composite')).toContain('data-builder-flow-section');
    expect(childlessStyle).not.toMatch(/min-height/);
    expect(css).not.toContain('[data-node-id="childless-composite"]');

    const hiddenChildStyle = styleAttr(openingTag(html, 'hidden-child-composite'));
    expect(hiddenChildStyle).not.toMatch(/min-height/);
    expect(css).not.toContain('[data-node-id="hidden-child-composite"]');

    expect(styleAttr(openingTag(html, 'section-container'))).toMatch(/min-height:\s*700px/);
    expect(css).toContain('[data-node-id="section-container"]{min-height:700px !important}');

    expect(styleAttr(openingTag(html, 'parent-composite'))).toMatch(/min-height:\s*\d+px/);
    expect(css).toMatch(/\[data-node-id="parent-composite"\]\{min-height:\d+px !important\}/);

    // Mixed page: main keeps its saved-stage floor.
    const mainTag = (html.match(/<[a-z][^>]*class="builder-pub-main"[^>]*>/) ?? [''])[0];
    expect(styleAttr(mainTag)).toMatch(/min-height:\s*2400px/);
  });

  it('drops the main stage floor when every top-level section is a childless composite', async () => {
    const element = await PublishedSitePageView({
      resolved: resolvedPage([
        composite('only-a', 0, 1200),
        composite('only-b', 1200, 1200),
      ]),
    });
    const html = renderToStaticMarkup(element);
    const mainTag = (html.match(/<[a-z][^>]*class="builder-pub-main"[^>]*>/) ?? [''])[0];

    expect(mainTag).toContain('builder-pub-main');
    expect(styleAttr(mainTag)).not.toMatch(/min-height/);
    expect(styleAttr(openingTag(html, 'only-a'))).not.toMatch(/min-height/);
    expect(desktopFloorCss(html)).toBe('');
  });
});
