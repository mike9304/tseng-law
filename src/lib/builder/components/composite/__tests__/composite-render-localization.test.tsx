import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { createDefaultCanvasNodeStyle, type BuilderCompositeCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderFaqItem } from '@/lib/builder/faq/faq-shared';
import type { ColumnPost } from '@/lib/columns';
import HeroSearch from '@/components/HeroSearch';
import CompositeRender, { compositeFallbackCopy } from '../Render';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ko/faq',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

function makeInsightsNode(): BuilderCompositeCanvasNode {
  return {
    id: 'composite-insights',
    kind: 'composite',
    rect: { x: 0, y: 0, width: 1280, height: 1277 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      componentKey: 'insights-archive',
      config: { locale: 'ko' },
    },
  };
}

function makeFaqNode(): BuilderCompositeCanvasNode {
  return {
    id: 'composite-faq',
    kind: 'composite',
    rect: { x: 0, y: 0, width: 1280, height: 1750 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      componentKey: 'legacy-page-faq',
      config: { locale: 'ko' },
    },
  };
}

function makeColumnsNode(): BuilderCompositeCanvasNode {
  return {
    id: 'composite-columns',
    kind: 'composite',
    rect: { x: 0, y: 0, width: 1280, height: 2660 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      componentKey: 'legacy-page-columns',
      config: { locale: 'ko' },
    },
  };
}

function makeColumnPost(index: number): ColumnPost {
  return {
    slug: `post-${index}`,
    title: `Column ${index}`,
    date: '2026-01-01',
    dateDisplay: '2026-01-01',
    readTime: '3분',
    category: 'legal',
    categoryLabel: '법률정보',
    featuredImage: '/images/blog/placeholder.jpg',
    content: `Body ${index}`,
    summary: `Summary ${index}`,
  };
}

function makeFaqItem(): BuilderFaqItem {
  return {
    faqId: 'faq-test-1',
    slug: 'test-faq',
    locale: 'ko',
    question: '대만 법인설립은 어떤 절차로 진행되나요?',
    answer: '일반적으로 투자 허가 신청, 회사명 예약, 자본금 송금 및 등기 순서로 진행됩니다.',
    categoryId: 'company-setup',
    tags: ['법인설립'],
    status: 'published',
    sortOrder: 10,
    schemaEnabled: true,
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  };
}

describe('composite render localization', () => {
  it('uses public section anchors for hero search links in edit mode', () => {
    const node = {
      id: 'composite-hero',
      kind: 'composite',
      rect: { x: 0, y: 0, width: 1280, height: 820 },
      style: createDefaultCanvasNodeStyle(),
      zIndex: 0,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        componentKey: 'hero-search',
        config: { locale: 'ko' },
      },
    } satisfies BuilderCompositeCanvasNode;

    const html = renderToStaticMarkup(<CompositeRender node={node} mode="edit" />);

    expect(html).toContain('href="/ko#insights"');
  });

  it('keeps relative section anchors for hero search links in published mode', () => {
    const node = {
      id: 'composite-hero',
      kind: 'composite',
      rect: { x: 0, y: 0, width: 1280, height: 820 },
      style: createDefaultCanvasNodeStyle(),
      zIndex: 0,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        componentKey: 'hero-search',
        config: { locale: 'ko' },
      },
    } satisfies BuilderCompositeCanvasNode;

    const html = renderToStaticMarkup(<CompositeRender node={node} mode="published" />);

    expect(html).toContain('href="#insights"');
  });

  it('keeps exactly one h1 when the legacy hero and mobile parity overlay coexist', () => {
    const parityNode = {
      id: 'home-hero',
      kind: 'composite',
      anchorName: 'mobile-parity-home-hero',
      rect: { x: 0, y: 0, width: 1280, height: 774 },
      style: createDefaultCanvasNodeStyle(),
      zIndex: 0,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        componentKey: 'hero-search',
        config: { locale: 'zh-hant' },
      },
    } satisfies BuilderCompositeCanvasNode;

    const html = renderToStaticMarkup(
      <>
        <HeroSearch locale="zh-hant" />
        <CompositeRender node={parityNode} mode="published" />
      </>,
    );

    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html.match(/<h2\b/g)).toHaveLength(1);
    expect(html).toContain('<h2 class="hero-title" data-builder-surface-key="headline">');
    expect(html).not.toContain('aria-level="1"');
  });

  it('keeps the canonical composite-only published hero as h1', () => {
    const node = {
      id: 'home-hero',
      kind: 'composite',
      rect: { x: 0, y: 0, width: 1280, height: 633 },
      style: createDefaultCanvasNodeStyle(),
      zIndex: 0,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        componentKey: 'hero-search',
        config: { locale: 'zh-hant' },
      },
    } satisfies BuilderCompositeCanvasNode;

    const html = renderToStaticMarkup(<CompositeRender node={node} mode="published" />);

    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).not.toMatch(/<h2\b/);
  });

  it('localizes missing composite diagnostics in zh-hant', () => {
    const copy = compositeFallbackCopy('zh-hant');

    expect(copy.missingTitle).toBe('Composite registry 未註冊');
    expect(copy.missingDescription).toContain('新的 composite kind 必須加入');
    expect(copy.missingTitle).not.toBe('Composite registry 누락');
    expect(copy.missingDescription).not.toContain('추가되어야 합니다');
  });

  it('uses full column posts for published insights pagination', () => {
    const html = renderToStaticMarkup(
      <CompositeRender
        node={makeInsightsNode()}
        mode="published"
        columnPosts={[1, 2, 3, 4, 5].map(makeColumnPost)}
      />,
    );

    expect(html).toContain('Column 1');
    expect(html).toContain('Column 4');
    expect(html).toContain('1 / 2');
  });

  it('uses full column posts for edit insights pagination when public data is available', () => {
    const html = renderToStaticMarkup(
      <CompositeRender
        node={makeInsightsNode()}
        mode="edit"
        columnPosts={[1, 2, 3, 4, 5].map(makeColumnPost)}
      />,
    );

    expect(html).toContain('Column 1');
    expect(html).toContain('Column 4');
    expect(html).toContain('1 / 2');
  });

  it('renders the published columns archive body from injected column posts', () => {
    const html = renderToStaticMarkup(
      <CompositeRender
        node={makeColumnsNode()}
        mode="published"
        columnPosts={[makeColumnPost(1)]}
        searchParams={{}}
      />,
    );

    expect(html).toContain('data-columns-search="true"');
    expect(html).toContain('columns-filter-btn');
    expect(html).toContain('data-columns-visible-count="1"');
    expect(html).toContain('Column 1');
  });

  it('renders the live FAQ explorer for legacy FAQ page composites', () => {
    const html = renderToStaticMarkup(
      <CompositeRender
        node={makeFaqNode()}
        mode="published"
        faqItems={[makeFaqItem()]}
      />,
    );

    expect(html).toContain('data-public-faq-explorer="true"');
    expect(html).toContain('FAQ 검색');
    expect(html).toContain('1개 질문');
    expect(html).toContain('대만 법인설립은 어떤 절차로 진행되나요?');
    expect(html).not.toContain('class="faq-list"');
  });
});
