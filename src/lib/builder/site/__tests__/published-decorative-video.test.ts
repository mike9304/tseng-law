import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import savedZhHome from '@/lib/builder/canvas/__tests__/fixtures/legacy-zh-home-july.json';
import { normalizeCanvasDocument, type BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';
import {
  createHomeContainerNode,
  createHomeImageNode,
} from '@/lib/builder/canvas/decompose-home-shared';
import type {
  BuilderImageCanvasNode,
} from '@/lib/builder/canvas/types';
import {
  PublishedSitePageView,
  projectPublishedStockZhHeroDecorativeAlt,
  type ResolvedPublishedSitePage,
  PUBLISHED_HOME_CASE_RESULTS_POSTER,
  PUBLISHED_HOME_HERO_POSTER,
  projectPublishedHomeCaseResultsPoster,
  projectPublishedHomeHeroPoster,
  resolvePublishedDecorativeVideo,
  type PublishedDecorativeVideoNode,
} from '@/lib/builder/site/public-page';
import { DECORATIVE_VIDEO_CONTROL_LABELS } from '@/components/DecorativeAutoplayVideo';

function imageNode(
  id: string,
  src: string,
  alt = 'Authored alternative text',
  contentPatch: Partial<BuilderImageCanvasNode['content']> = {},
  nodePatch: Partial<BuilderImageCanvasNode> = {},
): BuilderImageCanvasNode {
  const node = createHomeImageNode({
    id,
    rect: { x: 0, y: 0, width: 1280, height: 720 },
    zIndex: 0,
    src,
    alt,
  });
  if (node.kind !== 'image') throw new Error('Expected an image seed node.');

  return {
    ...node,
    ...nodePatch,
    content: {
      ...node.content,
      ...contentPatch,
    },
  };
}

describe('published home hero poster projection', () => {
  it.each([
    '/images/hero-bg-01.webp',
    '/images/hero-taipei-101-blue-hour.webp',
    '/images/hero-taiwan-modern-city-opening.webp',
  ])('projects the legacy seed poster %s to the modern static continuation', (legacyPoster) => {
    const projected = projectPublishedHomeHeroPoster(imageNode(
      'home-hero-media-image',
      legacyPoster,
      'Authored hero copy',
    ));

    expect(projected).toMatchObject({
      id: 'home-hero-media-image',
      content: {
        src: PUBLISHED_HOME_HERO_POSTER,
        alt: 'Authored hero copy',
      },
    });
  });

  it.each([
    imageNode('home-hero-media-image', PUBLISHED_HOME_HERO_POSTER),
    imageNode('home-hero-media-image', '/images/customer-selected-hero.webp'),
    imageNode('another-image', '/images/hero-taipei-101-blue-hour.webp'),
    {
      ...imageNode('home-hero-media-image', '/images/hero-taipei-101-blue-hour.webp'),
      dataBinding: {
        targetId: 'home.insights.feed',
        recordIndex: 0,
        fields: { src: 'image' },
      },
    },
  ] satisfies BuilderImageCanvasNode[])(
    'preserves current, authored, non-hero, and dataset-owned media: $id',
    (node) => {
      expect(projectPublishedHomeHeroPoster(node)).toBe(node);
    },
  );
});

describe('resolvePublishedDecorativeVideo', () => {
  it('resolves the v2 homepage hero with desktop and mobile video assets', () => {
    expect(resolvePublishedDecorativeVideo(imageNode(
      'home-hero-media-image',
      PUBLISHED_HOME_HERO_POSTER,
      'Authored hero copy',
    ))).toEqual({
      poster: PUBLISHED_HOME_HERO_POSTER,
      webmSrc: '/videos/taichung-courthouse-civic-daylight-v2.webm',
      mp4Src: '/videos/taichung-courthouse-civic-daylight-v2.mp4',
      mobilePoster: '/images/editorial/taichung-courthouse-civic-daylight-v2-mobile.webp',
      mobileWebmSrc: '/videos/taichung-courthouse-civic-daylight-v2-mobile.webm',
      mobileMp4Src: '/videos/taichung-courthouse-civic-daylight-v2-mobile.mp4',
      alt: 'Authored hero copy',
      sizes: '100vw',
      priority: false,
      controlLabels: DECORATIVE_VIDEO_CONTROL_LABELS.ko,
    });
  });

  it('projects the persisted case-results default to v2 and preserves its alt', () => {
    const projected = projectPublishedHomeCaseResultsPoster(imageNode(
      'home-case-results-media-image',
      '/images/editorial/taipei-courthouse-cinematic.webp',
      'Authored courthouse alternative text',
    ));

    expect(projected).toMatchObject({
      content: {
        src: PUBLISHED_HOME_CASE_RESULTS_POSTER,
        alt: 'Authored courthouse alternative text',
      },
    });
    expect(resolvePublishedDecorativeVideo(projected)).toEqual({
      poster: PUBLISHED_HOME_CASE_RESULTS_POSTER,
      webmSrc: '/videos/taiwan-courtroom-calm-daylight-v2.webm',
      mp4Src: '/videos/taiwan-courtroom-calm-daylight-v2.mp4',
      mobilePoster: '/images/editorial/taiwan-courtroom-calm-daylight-v2-mobile.webp',
      mobileWebmSrc: '/videos/taiwan-courtroom-calm-daylight-v2-mobile.webm',
      mobileMp4Src: '/videos/taiwan-courtroom-calm-daylight-v2-mobile.mp4',
      alt: 'Authored courthouse alternative text',
      sizes: '(max-width: 900px) 100vw, 52vw',
      priority: false,
      imageClassName: 'home-results-media-img',
      videoClassName: 'home-results-media-video',
      loop: false,
      controlLabels: DECORATIVE_VIDEO_CONTROL_LABELS.ko,
    });
  });

  it('localizes the published courthouse control copy from the page locale', () => {
    const node = projectPublishedHomeCaseResultsPoster(imageNode(
      'home-case-results-media-image',
      '/images/editorial/taipei-courthouse-cinematic.webp',
      'Courthouse',
    ));

    expect(resolvePublishedDecorativeVideo(node, 'zh-hant')).toMatchObject({
      controlLabels: DECORATIVE_VIDEO_CONTROL_LABELS['zh-hant'],
    });
    expect(resolvePublishedDecorativeVideo(node, 'en')).toMatchObject({
      controlLabels: DECORATIVE_VIDEO_CONTROL_LABELS.en,
    });
  });

  it.each([
    imageNode('home-hero-media-image', '/images/customer-selected-hero.webp'),
    imageNode('another-image', '/images/hero-taipei-101-blue-hour.webp'),
    imageNode('home-case-results-media-image', '/images/customer-selected-courthouse.webp'),
    createHomeContainerNode({
      id: 'home-hero-media-image',
      rect: { x: 0, y: 0, width: 1280, height: 720 },
      zIndex: 0,
      label: 'not an image',
    }),
  ] satisfies PublishedDecorativeVideoNode[])(
    'does not attach a fixed video to a non-default node: $id / $kind',
    (node) => {
      expect(resolvePublishedDecorativeVideo(node)).toBeNull();
    },
  );

  it.each([
    imageNode(
      'home-hero-media-image',
      PUBLISHED_HOME_HERO_POSTER,
      'Hero with an authored crop',
      { focalPoint: { x: 50, y: 50 } },
    ),
    {
      ...imageNode(
        'home-hero-media-image',
        PUBLISHED_HOME_HERO_POSTER,
        'Dataset-owned hero',
      ),
      dataBinding: {
        targetId: 'home.insights.feed',
        recordIndex: 0,
        fields: { src: 'image' },
      },
    },
  ] satisfies BuilderImageCanvasNode[])(
    'does not attach a fixed video to an authored or dataset-owned hero',
    (node) => {
      expect(resolvePublishedDecorativeVideo(node)).toBeNull();
    },
  );

  it.each([
    ['contain fit', { fit: 'contain' }],
    ['authored focal point', { focalPoint: { x: 50, y: 50 } }],
    ['authored filters', {
      filters: {
        brightness: 90,
        contrast: 110,
        saturation: 80,
        blur: 0,
        grayscale: 0,
        sepia: 0,
      },
    }],
    ['authored crop aspect', { cropAspect: '16:9' }],
  ] satisfies Array<[string, Partial<BuilderImageCanvasNode['content']>]>)(
    'falls back to ImageElement for %s',
    (_label, contentPatch) => {
      expect(resolvePublishedDecorativeVideo(imageNode(
        'home-case-results-media-image',
        PUBLISHED_HOME_CASE_RESULTS_POSTER,
        'Courthouse',
        contentPatch,
      ))).toBeNull();
    },
  );

  it.each([
    ['link value', {
      link: {
        href: '/ko/contact',
        target: '_self',
      },
    }],
    ['link click action', { clickAction: 'link' }],
    ['lightbox click action', { clickAction: 'lightbox' }],
    ['popup click action', { clickAction: 'popup' }],
  ] satisfies Array<[string, Partial<BuilderImageCanvasNode['content']>]>)(
    'falls back to ImageElement for authored interaction: %s',
    (_label, contentPatch) => {
      expect(resolvePublishedDecorativeVideo(imageNode(
        'home-case-results-media-image',
        PUBLISHED_HOME_CASE_RESULTS_POSTER,
        'Courthouse',
        contentPatch,
      ))).toBeNull();
    },
  );

  it.each([
    ['hover swap', {
      contentPatch: { hoverSrc: '/images/authored-hover.webp' },
    }],
    ['hotspots', {
      contentPatch: {
        hotspots: [{ x: 50, y: 50, label: 'Authored hotspot', href: '/ko/contact' }],
      },
    }],
    ['node hover style', {
      nodePatch: { hoverStyle: { scale: 1.05, transitionMs: 200 } },
    }],
    ['hover animation', {
      nodePatch: {
        animation: {
          hover: { preset: 'lift', transitionMs: 200 },
        },
      },
    }],
  ] satisfies Array<[
    string,
    {
      contentPatch?: Partial<BuilderImageCanvasNode['content']>;
      nodePatch?: Partial<BuilderImageCanvasNode>;
    },
  ]>)(
    'falls back to ImageElement for authored hover or hotspot behavior: %s',
    (_label, patch) => {
      expect(resolvePublishedDecorativeVideo(imageNode(
        'home-case-results-media-image',
        PUBLISHED_HOME_CASE_RESULTS_POSTER,
        'Courthouse',
        'contentPatch' in patch ? patch.contentPatch : undefined,
        'nodePatch' in patch ? patch.nodePatch : undefined,
      ))).toBeNull();
    },
  );

  it('falls back to ImageElement so authored rounded clipping is preserved', () => {
    const node = imageNode(
      'home-case-results-media-image',
      PUBLISHED_HOME_CASE_RESULTS_POSTER,
      'Courthouse',
    );

    expect(resolvePublishedDecorativeVideo({
      ...node,
      style: {
        ...node.style,
        borderRadius: 24,
      },
    })).toBeNull();
  });

  it.each([
    ['before/after comparison', {
      compare: {
        enabled: true,
        beforeSrc: '/images/before.webp',
        afterSrc: '/images/after.webp',
        position: 50,
      },
    }],
    ['inline SVG', {
      svg: {
        enabled: true,
        name: 'scales',
        color: '#123b63',
      },
    }],
    ['GIF mode', {
      gif: {
        provider: 'manual',
      },
    }],
  ] satisfies Array<[string, Partial<BuilderImageCanvasNode['content']>]>)(
    'falls back to ImageElement for alternate authored media mode: %s',
    (_label, contentPatch) => {
      expect(resolvePublishedDecorativeVideo(imageNode(
        'home-case-results-media-image',
        PUBLISHED_HOME_CASE_RESULTS_POSTER,
        'Courthouse',
        contentPatch,
      ))).toBeNull();
    },
  );

  it('falls back when a dataset owns the effective image source', () => {
    const node = imageNode(
      'home-case-results-media-image',
      PUBLISHED_HOME_CASE_RESULTS_POSTER,
      'Courthouse',
    );

    const boundNode: BuilderImageCanvasNode = {
      ...node,
      dataBinding: {
        targetId: 'home.insights.feed',
        recordIndex: 0,
        fields: { src: 'image' },
      },
    };

    expect(resolvePublishedDecorativeVideo(boundNode)).toBeNull();
  });
});


vi.mock('next/navigation', () => ({
  usePathname: () => '/zh-hant',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const stockHeroImageIds = ['home-hero-media-image', 'home-hero-media-image-2', 'home-hero-media-image-3'];
const stockHeroAlt = '台北101夜景城市天際線';
const stockZhHome = () => normalizeCanvasDocument(structuredClone(savedZhHome), 'zh-hant');
const stockHeroImage = (id: string) => stockZhHome().nodes.find((node) => node.id === id) as BuilderImageCanvasNode;

function stockPublishedHome(canvas: BuilderCanvasDocument, slugPath = '', locale: Locale = 'zh-hant'): ResolvedPublishedSitePage {
  const now = '2026-09-06T00:00:00.000Z';
  return {
    locale, slugPath, canvas: { ...canvas, locale },
    site: { version: 1, siteId: 'stock-hero-alt-test', name: 'Stock hero test', locale,
      navigation: [], theme: DEFAULT_THEME, settings: { firmName: 'Stock hero test' }, pages: [], createdAt: now, updatedAt: now },
    pageMeta: { pageId: 'stock-hero-alt-test', slug: slugPath, isHomePage: slugPath === '',
      title: { ko: '홈', 'zh-hant': '首頁', en: 'Home' }, locale, createdAt: now, updatedAt: now, publishedAt: now, noIndex: true },
    lightboxes: [], popups: [], cookieConsent: null, headerCanvas: null, footerCanvas: null,
    datasetPreviewTargets: [], columnPosts: [], faqCategories: [], faqItems: [],
  };
}

function renderedImageFragment(html: string, id: string): string {
  const marker = `data-node-id="${id}"`;
  const wrappers = [...html.matchAll(new RegExp(`<div\\b[^>]*${marker}[^>]*>`, 'g'))];
  expect(wrappers).toHaveLength(1);
  const fragment = html.slice(wrappers[0].index);
  const nextNode = fragment.indexOf('data-node-id=', fragment.indexOf(marker) + marker.length);
  return nextNode < 0 ? fragment : fragment.slice(0, nextNode);
}

describe('exact stock ZH decorative hero alternatives', () => {
  it.each(stockHeroImageIds)('changes only the exact %s alternative without mutating its input', (id) => {
    const node = stockHeroImage(id); const before = structuredClone(node);
    const next = projectPublishedStockZhHeroDecorativeAlt(node, true);
    expect(next).toEqual({ ...node, content: { ...node.content, alt: '' } });
    expect(next).not.toBe(node);
    expect(node).toEqual(before);
    expect(projectPublishedStockZhHeroDecorativeAlt(next, true)).toBe(next);
    expect(projectPublishedStockZhHeroDecorativeAlt(node, false)).toBe(node);
  });

  it.each(['alt', 'src', 'parent', 'id', 'binding', 'link', 'lightbox', 'crop', 'hover', 'geometry'])('keeps authored %s intact', (change) => {
    const node = stockHeroImage('home-hero-media-image-2');
    if (change === 'alt') node.content.alt = '作者保留的替代文字';
    if (change === 'src') node.content.src = '/images/author-hero.webp';
    if (change === 'parent') node.parentId = 'author-gallery';
    if (change === 'id') node.id = 'author-image';
    if (change === 'binding') node.dataBinding = { targetId: 'home.insights.feed', recordIndex: 0, fields: { alt: 'caption' } };
    if (change === 'link') node.content.link = { href: '/zh-hant/services' } as never;
    if (change === 'lightbox') node.content.clickAction = 'lightbox';
    if (change === 'crop') node.content.cropAspect = '1:1';
    if (change === 'hover') node.content.hoverSrc = '/images/author-hover.webp';
    if (change === 'geometry') node.rect.width = 1000;
    const before = structuredClone(node);
    // Authored geometry is rejected by the outer full-document fingerprint.
    expect(projectPublishedStockZhHeroDecorativeAlt(node, change !== 'geometry')).toBe(node);
    expect(node).toEqual(before);
  });

  it('renders all three actual stock images as decorative through the public page, retaining the original document', async () => {
    const doc = stockZhHome(); const before = structuredClone(doc);
    const html = renderToStaticMarkup(await PublishedSitePageView({ resolved: stockPublishedHome(doc) }));
    for (const id of stockHeroImageIds) {
      const fragment = renderedImageFragment(html, id);
      expect(fragment).toMatch(/<img\b[^>]*\balt=""/);
      expect(fragment).not.toContain(`alt="${stockHeroAlt}"`);
    }
    expect(html).toContain(PUBLISHED_HOME_HERO_POSTER);
    expect(html).toContain('/images/hero-bg-02.webp');
    expect(html).toContain('/images/hero-bg-03.webp');
    expect(doc).toEqual(before);
  });

  it.each(['custom-alt', 'custom-src', 'geometry', 'nonhome', 'ko', 'en'])('retains hero alternatives for %s public documents', async (change) => {
    const doc = stockZhHome(); const first = doc.nodes.find((node) => node.id === stockHeroImageIds[0]) as BuilderImageCanvasNode;
    if (change === 'custom-alt') first.content.alt = '作者保留的替代文字';
    if (change === 'custom-src') first.content.src = '/images/author-hero.webp';
    if (change === 'geometry') first.rect.width = 1000;
    const before = structuredClone(doc);
    const locale: Locale = change === 'ko' || change === 'en' ? change : 'zh-hant';
    const html = renderToStaticMarkup(await PublishedSitePageView({ resolved: stockPublishedHome(doc, change === 'nonhome' ? 'copied-home' : '', locale) }));
    for (const id of stockHeroImageIds) {
      const expected = id === first.id ? first.content.alt : stockHeroAlt;
      expect(renderedImageFragment(html, id)).toContain(`alt="${expected}"`);
    }
    if (change === 'custom-src') expect(html).toContain('/images/author-hero.webp');
    expect(doc).toEqual(before);
  });
});
