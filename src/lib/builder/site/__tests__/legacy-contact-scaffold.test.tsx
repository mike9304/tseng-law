import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import {
  createHomeContainerNode,
  createHomeTextNode,
} from '@/lib/builder/canvas/decompose-home-shared';
import {
  LEGACY_CONTACT_SCAFFOLD_COMPOSITE_ID,
  LEGACY_CONTACT_SCAFFOLD_ROOT_ID,
} from '@/lib/builder/canvas/legacy-contact-scaffold';
import { CANVAS_SANDBOX_UPDATED_BY } from '@/lib/builder/canvas/types';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { PublishedSitePageView, type ResolvedPublishedSitePage } from '@/lib/builder/site/public-page';
import { DEFAULT_THEME } from '@/lib/builder/site/types';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ko/contact',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

function makeNode(overrides: Record<string, unknown> = {}): BuilderCanvasNode {
  return {
    id: 'node',
    kind: 'container',
    parentId: undefined,
    rect: { x: 0, y: 0, width: 1280, height: 3057 },
    style: {},
    content: {},
    visible: true,
    locked: false,
    rotation: 0,
    zIndex: 0,
    ...overrides,
  } as BuilderCanvasNode;
}

function exactContactScaffoldNodes(): BuilderCanvasNode[] {
  return [
    createHomeContainerNode({
      id: LEGACY_CONTACT_SCAFFOLD_ROOT_ID,
      rect: { x: 0, y: 0, width: 1280, height: 3057 },
      zIndex: 0,
      label: 'contact page',
      as: 'main',
      background: '#ffffff',
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      padding: 0,
      layoutMode: 'absolute',
    }),
    makeNode({
      id: LEGACY_CONTACT_SCAFFOLD_COMPOSITE_ID,
      kind: 'composite',
      parentId: LEGACY_CONTACT_SCAFFOLD_ROOT_ID,
      content: { componentKey: 'legacy-page-contact', config: { locale: 'ko' } },
    }),
  ];
}

function publishedPage(
  nodes: BuilderCanvasNode[],
  slugPath = 'contact',
  locale: Locale = 'ko',
): ResolvedPublishedSitePage {
  const now = '2026-09-05T00:00:00.000Z';
  return {
    locale,
    slugPath,
    canvas: {
      version: 1,
      locale,
      updatedAt: now,
      updatedBy: CANVAS_SANDBOX_UPDATED_BY,
      stageWidth: 1280,
      stageHeight: 3057,
      nodes,
    },
    site: {
      version: 1,
      siteId: 'legacy-contact-scaffold-fixture',
      name: 'Legacy Contact Scaffold Fixture',
      locale,
      navigation: [],
      theme: DEFAULT_THEME,
      settings: { firmName: 'Legacy Contact Scaffold Fixture' },
      pages: [],
      createdAt: now,
      updatedAt: now,
    },
    pageMeta: {
      pageId: 'legacy-contact-scaffold-fixture',
      slug: slugPath,
      title: { ko: '연락처', 'zh-hant': '聯絡', en: 'Contact' },
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

function openingTag(html: string, nodeId: string): string {
  const marker = `data-node-id="${nodeId}"`;
  const tags = html.match(/<[a-z][^>]*>/gi) ?? [];
  return tags.find((tag) => tag.includes(marker)) ?? '';
}

function styleAttr(tag: string): string {
  const match = tag.match(/style="([^"]*)"/);
  return match?.[1] ?? '';
}

describe('published legacy contact scaffold wrappers', () => {
  it('puts the exact 2-node contact scaffold in flow with auto height and a min-height floor', async () => {
    const element = await PublishedSitePageView({
      resolved: publishedPage(exactContactScaffoldNodes()),
    });
    const html = renderToStaticMarkup(element);

    const rootTag = openingTag(html, LEGACY_CONTACT_SCAFFOLD_ROOT_ID);
    const compositeTag = openingTag(html, LEGACY_CONTACT_SCAFFOLD_COMPOSITE_ID);
    const rootStyle = styleAttr(rootTag);
    const compositeStyle = styleAttr(compositeTag);

    expect(rootTag).toContain('data-builder-legacy-contact-scaffold="root"');
    expect(compositeTag).toContain('data-builder-legacy-contact-scaffold="composite"');

    for (const style of [rootStyle, compositeStyle]) {
      expect(style).toMatch(/position:\s*relative/);
      expect(style).toMatch(/height:\s*auto/);
      expect(style).toMatch(/min-height:\s*3057px/);
      expect(style).not.toMatch(/position:\s*absolute/);
      expect(style).not.toMatch(/(?:^|;)\s*left:/);
      expect(style).not.toMatch(/(?:^|;)\s*top:/);
    }
  });

  it('keeps absolute wrappers when the same contact doc has an extra widget', async () => {
    const nodes = [
      ...exactContactScaffoldNodes(),
      createHomeTextNode({
        id: 'extra-contact-widget',
        parentId: LEGACY_CONTACT_SCAFFOLD_ROOT_ID,
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

    const rootTag = openingTag(html, LEGACY_CONTACT_SCAFFOLD_ROOT_ID);
    const compositeTag = openingTag(html, LEGACY_CONTACT_SCAFFOLD_COMPOSITE_ID);
    const extraTag = openingTag(html, 'extra-contact-widget');

    expect(rootTag).not.toContain('data-builder-legacy-contact-scaffold');
    expect(compositeTag).not.toContain('data-builder-legacy-contact-scaffold');
    expect(styleAttr(rootTag)).toMatch(/position:\s*absolute/);
    expect(styleAttr(compositeTag)).toMatch(/position:\s*absolute/);
    expect(styleAttr(extraTag)).toMatch(/position:\s*absolute/);
    expect(styleAttr(rootTag)).toMatch(/height:\s*3057px/);
  });
});
