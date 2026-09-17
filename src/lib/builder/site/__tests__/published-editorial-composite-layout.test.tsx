import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { createHomeTextNode } from '@/lib/builder/canvas/decompose-home-shared';
import { CANVAS_SANDBOX_UPDATED_BY } from '@/lib/builder/canvas/types';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  LEGACY_EDITORIAL_COMPOSITE_LAYOUT_CSS,
  LEGACY_EDITORIAL_COMPOSITE_LAYOUT_MARKER,
} from '@/lib/builder/site/legacy-editorial-composite-layout';
import { PublishedSitePageView, type ResolvedPublishedSitePage } from '@/lib/builder/site/public-page';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ko/lawyers',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

function exactKoLawyersNodes(): BuilderCanvasNode[] {
  return [
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
  ] as BuilderCanvasNode[];
}

function publishedPage(
  nodes: BuilderCanvasNode[],
  slugPath = 'lawyers',
  locale: Locale = 'ko',
  stageHeight = 2653,
): ResolvedPublishedSitePage {
  const now = '2026-09-07T00:00:00.000Z';
  const canvas: BuilderCanvasDocument = {
    version: 1,
    locale,
    updatedAt: now,
    updatedBy: CANVAS_SANDBOX_UPDATED_BY,
    stageWidth: 1280,
    stageHeight,
    nodes,
  };
  return {
    locale,
    slugPath,
    canvas,
    site: {
      version: 1,
      siteId: 'legacy-editorial-composite-fixture',
      name: 'Legacy Editorial Composite Fixture',
      locale,
      navigation: [],
      theme: DEFAULT_THEME,
      settings: { firmName: 'Legacy Editorial Composite Fixture' },
      pages: [],
      createdAt: now,
      updatedAt: now,
    },
    pageMeta: {
      pageId: 'legacy-editorial-composite-fixture',
      slug: slugPath,
      title: { ko: '변호사', 'zh-hant': '律師', en: 'Lawyers' },
      locale,
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

function openingTag(html: string, marker: string): string {
  const tags = html.match(/<[a-z][^>]*>/gi) ?? [];
  return tags.find((tag) => tag.includes(marker)) ?? '';
}

function styleAttr(tag: string): string {
  const match = tag.match(/style="([^"]*)"/);
  return match?.[1] ?? '';
}

function editorialStyleTag(html: string): string {
  const match = html.match(
    /<style[^>]*data-builder-legacy-editorial-composite="true"[^>]*>[\s\S]*?<\/style>/,
  );
  return match?.[0] ?? '';
}

describe('published legacy editorial composite layout',
  () => {
    it('emits the exact-match marker, scoped CSS, and omits the saved-stage main floor',
      async () => {
        const element = await PublishedSitePageView({
          resolved: publishedPage(exactKoLawyersNodes()),
        });
        const html = renderToStaticMarkup(element);
        const mainTag = openingTag(html, 'class="builder-pub-main"');
        const rootTag = openingTag(html, 'data-node-id="lawyers-page-root"');
        const compositeTag = openingTag(html, 'data-node-id="lawyers-page-root-composite"');
        const styleTag = editorialStyleTag(html);

        expect(mainTag).toContain(`${LEGACY_EDITORIAL_COMPOSITE_LAYOUT_MARKER}="true"`);
        expect(styleTag).toContain(LEGACY_EDITORIAL_COMPOSITE_LAYOUT_CSS);
        expect(styleTag).toContain('height: auto !important');
        expect(styleTag).toContain('min-height: 0 !important');
        expect(styleTag).toContain('position: relative !important');
        expect(styleTag).toContain('lawyers-page-root-composite');
        expect(styleTag).not.toMatch(/overflow\s*:\s*hidden/i);

        expect(styleAttr(mainTag)).toMatch(/max-width:\s*1280px/);
        expect(styleAttr(mainTag)).toMatch(/position:\s*relative/);
        expect(styleAttr(mainTag)).not.toMatch(/min-height:\s*2653px/);
        expect(styleAttr(mainTag)).not.toMatch(/min-height:\s*720px/);

        expect(rootTag).toContain('data-node-id="lawyers-page-root"');
        expect(compositeTag).toContain('data-node-id="lawyers-page-root-composite"');
        expect(rootTag).not.toContain(LEGACY_EDITORIAL_COMPOSITE_LAYOUT_MARKER);
      },
    );

    it('keeps unmatched authored wrappers without the marker or style block',
      async () => {
        const nodes = [
          ...exactKoLawyersNodes(),
          createHomeTextNode({
            id: 'extra-editorial-widget',
            parentId: 'lawyers-page-root',
            rect: { x: 40, y: 80, width: 200, height: 40 },
            zIndex: 0,
            text: 'Extra',
            as: 'p',
          }),
        ];
        const element = await PublishedSitePageView({
          resolved: publishedPage(nodes),
        });
        const html = renderToStaticMarkup(element);
        const mainTag = openingTag(html, 'class="builder-pub-main"');
        const rootTag = openingTag(html, 'data-node-id="lawyers-page-root"');
        const compositeTag = openingTag(html, 'data-node-id="lawyers-page-root-composite"');
        const extraTag = openingTag(html, 'data-node-id="extra-editorial-widget"');

        expect(html).not.toContain(`${LEGACY_EDITORIAL_COMPOSITE_LAYOUT_MARKER}="true"`);
        expect(editorialStyleTag(html)).toBe('');
        expect(styleAttr(mainTag)).toMatch(/min-height:\s*2653px/);
        expect(styleAttr(rootTag)).toMatch(/position:\s*absolute/);
        expect(styleAttr(rootTag)).toMatch(/height:\s*2653px/);
        expect(styleAttr(compositeTag)).toMatch(/position:\s*absolute/);
        expect(styleAttr(compositeTag)).toMatch(/height:\s*2653px/);
        expect(styleAttr(extraTag)).toMatch(/position:\s*absolute/);
      },
    );
  },
);
