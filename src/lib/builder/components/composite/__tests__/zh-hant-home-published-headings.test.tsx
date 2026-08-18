import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import TextElement from '@/components/builder/canvas/elements/TextElement';
import {
  createHomePageCanvasDocument,
  createHomePageCanvasDocumentDecomposed,
} from '@/lib/builder/canvas/seed-home';
import type { BuilderCompositeCanvasNode, BuilderTextCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { PublishedSitePageView, type ResolvedPublishedSitePage } from '@/lib/builder/site/public-page';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import CompositeRender from '../Render';

vi.mock('next/navigation', () => ({
  usePathname: () => '/zh-hant',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

function publishedHomeHeadingHtml(
  locale: Locale,
  mode: 'decomposed' | 'composite',
): string {
  const document = mode === 'decomposed'
    ? createHomePageCanvasDocumentDecomposed(locale)
    : createHomePageCanvasDocument(locale);
  const authoredH1Nodes = document.nodes.filter((node): node is BuilderTextCanvasNode => (
    node.kind === 'text' && node.content.as === 'h1'
  ));
  const heroSearchNodes = document.nodes.filter((node): node is BuilderCompositeCanvasNode => (
    node.kind === 'composite' && node.content.componentKey === 'hero-search'
  ));

  return renderToStaticMarkup(
    <>
      {authoredH1Nodes.map((node) => (
        <TextElement key={node.id} node={node} mode="published" locale={locale} />
      ))}
      {heroSearchNodes.map((node) => (
        <CompositeRender key={`${node.id}:${node.anchorName ?? ''}`} node={node} mode="published" />
      ))}
    </>,
  );
}

describe('published home heading uniqueness', () => {
  it('keeps a single h1 on the zh-hant decomposed dual-tree home', () => {
    const html = publishedHomeHeadingHtml('zh-hant', 'decomposed');

    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('<h1 class="hero-title"');
    expect(html).toContain('<h2 class="hero-title" data-builder-surface-key="headline">');
    expect(html).toContain('台灣法律，清楚說明。');
    expect(html.match(/<h1\b/g)?.length).toBe(1);
  });

  it.each(['ko', 'en'] as const)('keeps a single h1 on the %s decomposed home', (locale) => {
    const html = publishedHomeHeadingHtml(locale, 'decomposed');
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).not.toContain('<h2 class="hero-title"');
  });

  it.each(['ko', 'zh-hant', 'en'] as const)('keeps a single h1 on the %s composite home', (locale) => {
    const html = publishedHomeHeadingHtml(locale, 'composite');
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).not.toMatch(/<h2 class="hero-title"/);
  });

  it('keeps a single h1 through the published public-page renderer for zh-hant', async () => {
    const now = '2026-08-13T00:00:00.000Z';
    const locale: Locale = 'zh-hant';
    const resolved: ResolvedPublishedSitePage = {
      locale,
      slugPath: '',
      canvas: createHomePageCanvasDocumentDecomposed(locale),
      site: {
        version: 1,
        siteId: 'zh-hant-home-heading-fixture',
        name: 'ZH Home Heading Fixture',
        locale,
        navigation: [],
        theme: DEFAULT_THEME,
        settings: { firmName: 'ZH Home Heading Fixture' },
        pages: [],
        createdAt: now,
        updatedAt: now,
      },
      pageMeta: {
        pageId: 'zh-hant-home-heading-fixture',
        slug: '',
        title: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
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

    const element = await PublishedSitePageView({ resolved });
    const html = renderToStaticMarkup(element);
    const mainStyle = html.match(/class="builder-pub-main"[^>]*style="([^"]*)"/)?.[1] ?? '';
    const mainMinHeight = Number(mainStyle.match(/min-height:\s*(\d+)px/)?.[1] ?? 0);
    const insightsRoot = html.match(/data-node-id="home-insights-root"[^>]*style="([^"]*)"/)?.[1] ?? '';
    const insightsMinHeight = Number(insightsRoot.match(/min-height:\s*(\d+)px/)?.[1] ?? 0);

    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('data-node-id="home-hero-title"');
    expect(html).toContain('data-anchor="mobile-parity-home-hero"');
    expect(html).toContain('<h2 class="hero-title" data-builder-surface-key="headline">');
    expect(html).not.toMatch(/data-anchor="mobile-parity-home-hero"[\s\S]*?<h1\b/);
    expect(mainMinHeight).toBeGreaterThan(7000);
    expect(mainMinHeight).toBeLessThanOrEqual(7124);
    expect(insightsMinHeight).toBe(820);
  });
});
