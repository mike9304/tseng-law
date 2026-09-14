import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  PublishedSitePageView,
  PUBLISHED_HOME_HERO_POSTER,
  type ResolvedPublishedSitePage,
} from '@/lib/builder/site/public-page';
import {
  deriveJulyHeroEditorialPresentation,
  publishedHomeEditorialCompositeProps,
} from '@/lib/builder/site/published-home-editorial';
import { createHomePageCanvasDocument } from '@/lib/builder/canvas/seed-home';
import {
  createDefaultCanvasNodeStyle,
  normalizeCanvasDocument,
  type BuilderCompositeCanvasNode,
} from '@/lib/builder/canvas/types';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import CompositeRender from '@/lib/builder/components/composite/Render';
import { siteContent } from '@/data/site-content';
import { getAllColumnPosts, type ColumnPost } from '@/lib/columns';
import savedJulyHome from '@/lib/builder/canvas/__tests__/fixtures/legacy-zh-home-july.json';
import {
  normalizeLegacyZhHantHome,
  normalizeLegacyZhHantHomeRead,
} from '@/lib/builder/canvas/home-zh-hant-parity';
import { BuilderSurfaceProvider } from '@/lib/builder/surface-context';
import type { Locale } from '@/lib/locales';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ko',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&');
}

function visibleText(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' '));
}

function contentString(node: { content: Record<string, unknown> } | undefined, keys: string[]) {
  if (!node) return '';
  for (const key of keys) {
    const value = node.content[key];
    if (typeof value === 'string') return value;
  }
  return '';
}

function stripNonRenderedMarkup(html: string): string {
  return html
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '');
}

function publishedHomeSequence(html: string): string[] {
  const cleaned = stripNonRenderedMarkup(html);
  const sequence: string[] = [];
  const tagRe = /<div\b[^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(cleaned))) {
    const tag = match[0];
    if (/\bdata-home-heritage-interlude=(['"]?)true\1/.test(tag)) {
      sequence.push('heritage');
      continue;
    }
    if (!/\bbuilder-pub-node\b/.test(tag)) continue;
    const idMatch = tag.match(/\bdata-node-id=(['"])(home-(?:hero|services|attorney|case-results|stats|insights|faq|offices|contact))\1/);
    if (idMatch) sequence.push(idMatch[2]);
  }
  return sequence;
}

function makeInsightPosts(): ColumnPost[] {
  const sample = getAllColumnPosts('ko')[0];
  if (!sample) throw new Error('expected KO column posts');
  const specs = [
    { slug: 'one', title: 'Post one', date: '2024-05-01', categoryLabel: 'Cat-A', summary: 'Summary one' },
    { slug: 'two', title: 'Post two', date: '2024-04-01', categoryLabel: 'Cat-B', summary: 'Summary two' },
    { slug: 'three', title: 'Post three', date: '2024-03-01', categoryLabel: 'Cat-C', summary: 'Summary three' },
    { slug: 'four', title: 'Post four', date: '2024-02-01', categoryLabel: 'Cat-D', summary: 'Summary four' },
    { slug: 'five', title: 'Post five', date: '2024-01-01', categoryLabel: 'Cat-E', summary: 'Summary five' },
  ] as const;
  return specs.map((spec) => ({
    ...sample,
    slug: spec.slug,
    title: spec.title,
    date: spec.date,
    dateDisplay: spec.date,
    category: sample.category,
    categoryLabel: spec.categoryLabel,
    summary: spec.summary,
    content: sample.content,
    featuredImage: sample.featuredImage,
    readTime: sample.readTime,
  }));
}

const insightPosts = makeInsightPosts();

function publishedHomeResolved(
  locale: Locale,
  canvas = normalizeCanvasDocument(createHomePageCanvasDocument(locale), locale),
): ResolvedPublishedSitePage {
  const now = '2026-09-07T00:00:00.000Z';
  return {
    locale,
    slugPath: '',
    canvas,
    site: {
      version: 1,
      siteId: `${locale}-home-editorial-fixture`,
      name: `${locale} Home Editorial Fixture`,
      locale,
      navigation: [],
      theme: DEFAULT_THEME,
      settings: { firmName: `${locale} Home Editorial Fixture` },
      pages: [],
      createdAt: now,
      updatedAt: now,
    },
    pageMeta: {
      pageId: `${locale}-home-editorial-fixture`,
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
    columnPosts: insightPosts,
    faqCategories: [],
    faqItems: [],
  };
}

describe('public-page entry integration', () => {
  it('loads public-page before the helper and keeps the accepted hero poster constant', () => {
    expect(PUBLISHED_HOME_HERO_POSTER).toBe(
      '/images/editorial/taichung-courthouse-civic-daylight-v2.webp',
    );
    expect(typeof publishedHomeEditorialCompositeProps).toBe('function');
  });
});

describe('published current9 editorial render', () => {
  it('keeps all nine wrappers, editorial order, wired hero/services presentation, heritage once, destinations and full service copy', async () => {
    const resolved = publishedHomeResolved('ko');
    const hero = resolved.canvas.nodes.find((node) => node.id === 'home-hero')!;
    const services = resolved.canvas.nodes.find((node) => node.id === 'home-services')!;
    expect(publishedHomeEditorialCompositeProps(hero, { current9: true, july: null })).toEqual({
      homeEditorialPresentation: 'editorial',
    });
    expect(publishedHomeEditorialCompositeProps(services, { current9: true, july: null })).toEqual({
      homeEditorialPresentation: 'editorial',
    });
    const adversarial = '<style>.builder-pub-node[data-node-id="home-attorney"]{color:red}</style>';
    const element = await PublishedSitePageView({ resolved });
    const html = `${adversarial}${renderToStaticMarkup(element)}`;
    const text = visibleText(html);
    const sequence = publishedHomeSequence(html);
    expect(html).toContain('data-home-editorial="current9"');
    expect(html).toContain('data-presentation="editorial"');
    expect(html.split('data-presentation="editorial"').length - 1).toBeGreaterThanOrEqual(2);
    for (const id of [
      'home-hero',
      'home-services',
      'home-attorney',
      'home-case-results',
      'home-stats',
      'home-insights',
      'home-faq',
      'home-offices',
      'home-contact',
    ]) {
      expect(html).toContain(`data-node-id="${id}"`);
    }
    expect(sequence.filter((id) => id === 'heritage')).toHaveLength(1);
    expect(sequence).toEqual([
      'home-hero',
      'home-services',
      'heritage',
      'home-attorney',
      'home-case-results',
      'home-stats',
      'home-insights',
      'home-faq',
      'home-offices',
      'home-contact',
    ]);
    expect(html).toContain('action="/ko/search"');
    expect(html).toMatch(/name="q"/);
    expect(html).toContain('href="/ko/services"');
    expect(html).toContain('href="/ko/columns"');
    expect(html).toContain('href="/ko/columns/one"');
    expect(html).toContain('1 / 2');
    for (const item of siteContent.ko.services.items) {
      expect(text).toContain(item.description);
    }
    expect(html).not.toContain('office-map-wrap--naver');
    const zhHtml = renderToStaticMarkup(
      await PublishedSitePageView({ resolved: publishedHomeResolved('zh-hant') }),
    );
    expect(visibleText(zhHtml)).toContain('曾雋崴律師，在地與跨境客戶的台灣法律夥伴');
    expect(visibleText(zhHtml)).not.toContain('曾雋崴律師，專注服務韓國客戶的台灣法律夥伴');
  });

  it('keeps authored and empty overrides on the unmatched custom path', async () => {
    const custom = publishedHomeResolved('zh-hant');
    const hero = custom.canvas.nodes.find((node) => node.id === 'home-hero');
    if (hero?.kind === 'composite') {
      hero.content = {
        ...hero.content,
        config: {
          locale: 'zh-hant',
          overrides: { headline: '作者自訂且必須保留的標題' },
        },
      };
    }
    const customHtml = renderToStaticMarkup(await PublishedSitePageView({ resolved: custom }));
    expect(visibleText(customHtml)).toContain('作者自訂且必須保留的標題');
    expect(customHtml).not.toContain('data-home-editorial="current9"');
    expect(customHtml).not.toContain('data-presentation="editorial"');
    const customSequence = publishedHomeSequence(customHtml);
    expect(customSequence.indexOf('home-insights')).toBeGreaterThan(-1);
    expect(customSequence.indexOf('home-insights')).toBeLessThan(customSequence.indexOf('home-services'));

    const empty = publishedHomeResolved('en');
    const emptyHero = empty.canvas.nodes.find((node) => node.id === 'home-hero');
    if (emptyHero?.kind === 'composite') {
      emptyHero.content = {
        ...emptyHero.content,
        config: { locale: 'en', overrides: { headline: '' } },
      };
    }
    const emptyHtml = renderToStaticMarkup(await PublishedSitePageView({ resolved: empty }));
    expect(emptyHtml).toContain('<h1 class="hero-title" data-builder-surface-key="headline"></h1>');
    expect(emptyHtml).not.toContain('data-home-editorial="current9"');
  });
});

describe('published July editorial hero strings', () => {
  it('renders primitive four SurfaceText values and six historical menus on the exposed composite hero', async () => {
    const canvas = await normalizeLegacyZhHantHomeRead(
      normalizeLegacyZhHantHome(
        normalizeCanvasDocument(structuredClone(savedJulyHome), 'zh-hant'),
        'zh-hant',
        true,
      ),
      'zh-hant',
      true,
    );
    const derived = deriveJulyHeroEditorialPresentation(canvas, 'zh-hant');
    expect(derived).not.toBeNull();
    const parityHero = canvas.nodes.find((node) => node.anchorName === 'mobile-parity-home-hero')!;
    const wired = publishedHomeEditorialCompositeProps(parityHero, { current9: false, july: derived });
    expect(wired.homeEditorialPresentation).toBe('editorial');
    expect(wired.publishedHeroQuickMenus).toHaveLength(6);
    expect(wired.publishedHeroQuickMenus?.[5]?.label).toBe('聯絡');
    expect(wired.publishedSurfaceOverrides?.headline).toBe(derived?.overrides.headline);
    const resolved = publishedHomeResolved('zh-hant', canvas);
    const html = renderToStaticMarkup(await PublishedSitePageView({ resolved }));
    expect(html).toContain('data-home-editorial="july"');
    const julyStyle = html.match(/<style data-home-editorial="july"[^>]*>([\s\S]*?)<\/style>/)?.[1] ?? '';
    expect(julyStyle).toContain('padding-top: 96px');
    expect(julyStyle).toContain('padding-top: 72px');
    expect(julyStyle).toContain("data-node-id='home-attorney-root'");
    expect(julyStyle).not.toContain('home-case-results-root');
    expect(html).toContain('data-anchor="mobile-parity-home-hero"');
    expect(html).toContain('data-presentation="editorial"');
    const titleText = contentString(canvas.nodes.find((node) => node.id === 'home-hero-title'), ['text', 'label']);
    const labelText = contentString(canvas.nodes.find((node) => node.id === 'home-hero-label'), ['text', 'label']);
    const subtitleText = contentString(canvas.nodes.find((node) => node.id === 'home-hero-subtitle'), ['text', 'label']);
    const columnsLabel = contentString(canvas.nodes.find((node) => node.id === 'home-hero-columns-link'), ['label', 'text']);
    expect(visibleText(html)).toContain(titleText);
    expect(visibleText(html)).toContain(labelText);
    expect(visibleText(html)).toContain(subtitleText);
    expect(visibleText(html)).toContain(columnsLabel);
    const compositeHero = renderToStaticMarkup(
      <BuilderSurfaceProvider
        nodeId={parityHero.id}
        mode="published"
        overrides={wired.publishedSurfaceOverrides ?? {}}
        selectedSurfaceKey={null}
      >
        <CompositeRender
          node={parityHero as BuilderCompositeCanvasNode}
          mode="published"
          homeEditorialPresentation="editorial"
          publishedSurfaceOverrides={wired.publishedSurfaceOverrides}
          publishedHeroQuickMenus={wired.publishedHeroQuickMenus}
        />
      </BuilderSurfaceProvider>,
    );
    expect(compositeHero).toContain('data-presentation="editorial"');
    expect(visibleText(compositeHero)).toContain(titleText);
    expect(visibleText(compositeHero)).toContain(labelText);
    expect(visibleText(compositeHero)).toContain(subtitleText);
    expect(visibleText(compositeHero)).toContain(columnsLabel);
    for (const item of derived!.quickMenus) {
      expect(wired.publishedHeroQuickMenus).toContainEqual(item);
    }
  });
});

describe('published-only runtime presentation', () => {
  const node = {
    id: 'home-hero',
    kind: 'composite',
    rect: { x: 0, y: 0, width: 1280, height: 788 },
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

  it('does not opt the editor preview into editorial presentation', () => {
    const html = renderToStaticMarkup(
      <BuilderSurfaceProvider nodeId={node.id} mode="edit" overrides={{}} selectedSurfaceKey={null}>
        <CompositeRender node={node} mode="edit" homeEditorialPresentation="editorial" />
      </BuilderSurfaceProvider>,
    );
    expect(html).not.toContain('data-presentation="editorial"');
  });

  it('opts published mode into editorial presentation when the runtime prop is set', () => {
    const html = renderToStaticMarkup(
      <BuilderSurfaceProvider nodeId={node.id} mode="published" overrides={{}} selectedSurfaceKey={null}>
        <CompositeRender node={node} mode="published" homeEditorialPresentation="editorial" />
      </BuilderSurfaceProvider>,
    );
    expect(html).toContain('data-presentation="editorial"');
  });
});

describe('published July office reading order', () => {
  async function julyCanvas() {
    return normalizeLegacyZhHantHomeRead(
      normalizeCanvasDocument(structuredClone(savedJulyHome), 'zh-hant'),
      'zh-hant',
      true,
    );
  }

  function nodeMarkup(html: string, id: string): string {
    const cleaned = stripNonRenderedMarkup(html);
    const start = cleaned.search(new RegExp(`<div\\b[^>]*\\bdata-node-id="${id}"[^>]*>`));
    if (start < 0) throw new Error(`Missing published node ${id}`);
    const tags = /<\/?div\b[^>]*>/g;
    tags.lastIndex = start;
    let depth = 0;
    let tag: RegExpExecArray | null;
    while ((tag = tags.exec(cleaned))) {
      depth += tag[0].startsWith('</') ? -1 : 1;
      if (depth === 0) return cleaned.slice(start, tags.lastIndex);
    }
    throw new Error(`Unclosed published node ${id}`);
  }

  function officeContainerIds(html: string): string[] {
    const markup = nodeMarkup(html, 'home-offices-container');
    const ids: string[] = [];
    const tags = /<\/?div\b[^>]*>/g;
    let depth = 0;
    let tag: RegExpExecArray | null;
    while ((tag = tags.exec(markup))) {
      if (tag[0].startsWith('</')) {
        depth -= 1;
      } else {
        // The published wrapper contains the container element at depth 2.
        // Count only its direct node wrappers, never nested office card nodes.
        if (depth === 2) {
          const id = /\bdata-node-id="([^"]+)"/.exec(tag[0]);
          if (id) ids.push(id[1]);
        }
        depth += 1;
      }
    }
    return ids;
  }

  function officeIds(html: string): string[] {
    return [...stripNonRenderedMarkup(html).matchAll(/\bdata-node-id="(home-offices-tab-\d+)"/g)]
      .map((match) => match[1]);
  }

  it('puts stock desktop office buttons in visual reading order without changing identity or the mobile branch', async () => {
    const canvas = await julyCanvas();
    const before = structuredClone(canvas);
    const html = renderToStaticMarkup(await PublishedSitePageView({ resolved: publishedHomeResolved('zh-hant', canvas) }));

    expect(html).toContain('data-home-editorial="july"');
    expect(officeContainerIds(html)).toEqual([
      'home-offices-label', 'home-offices-title', 'home-offices-tabs',
      'home-offices-layout-0', 'home-offices-layout-1', 'home-offices-layout-2', 'home-offices-layout-3',
    ]);
    expect(officeIds(html)).toEqual([
      'home-offices-tab-0', 'home-offices-tab-1', 'home-offices-tab-2', 'home-offices-tab-3',
    ]);
    for (const [index, label] of ['台中', '高雄', '台北', '屏東'].entries()) {
      const tab = nodeMarkup(html, `home-offices-tab-${index}`);
      expect(visibleText(tab)).toContain(label);
      expect(/<button\b[^>]*class="[^"]*\bactive\b/.test(tab)).toBe(index === 0);
      const layoutOpeningTag = nodeMarkup(html, `home-offices-layout-${index}`).split('>')[0];
      expect(/\bstyle="[^"]*display:none/.test(layoutOpeningTag)).toBe(index !== 0);
    }
    const mobile = canvas.nodes.find((node) => node.anchorName === 'mobile-parity-home-offices');
    if (!mobile) throw new Error('Missing July mobile office composite');
    const mobileTabs = [...nodeMarkup(html, mobile.id).matchAll(/<button\b([^>]*\brole="tab"[^>]*)>([\s\S]*?)<\/button>/g)];
    expect(mobileTabs.map((match) => visibleText(match[2]).trim())).toEqual(['台北', '台中', '高雄', '屏東']);
    expect(mobileTabs.filter((match) => match[1].includes('aria-selected="true"')).map((match) => visibleText(match[2]).trim()))
      .toEqual(['台北']);
    expect(canvas).toEqual(before);
  });

  it('preserves authored office order, label and initial selection outside July admission', async () => {
    const canvas = await julyCanvas();
    const first = canvas.nodes.find((node) => node.id === 'home-offices-tab-0');
    const moved = canvas.nodes.find((node) => node.id === 'home-offices-tab-1');
    const selected = canvas.nodes.find((node) => node.id === 'home-offices-tab-2');
    if (first?.kind !== 'button' || moved?.kind !== 'button' || selected?.kind !== 'button') {
      throw new Error('Missing original July office buttons');
    }
    first.content.className = 'tab-button';
    moved.zIndex = -5;
    moved.content.label = '作者自訂據點';
    selected.content.className = 'tab-button active';
    const before = structuredClone(canvas);
    const html = renderToStaticMarkup(await PublishedSitePageView({ resolved: publishedHomeResolved('zh-hant', canvas) }));

    expect(html).not.toContain('data-home-editorial="july"');
    expect(officeContainerIds(html)).toEqual([
      'home-offices-layout-3', 'home-offices-label', 'home-offices-title', 'home-offices-tabs',
      'home-offices-layout-0', 'home-offices-layout-1', 'home-offices-layout-2',
    ]);
    expect(officeIds(html)).toEqual([
      'home-offices-tab-1', 'home-offices-tab-3', 'home-offices-tab-0', 'home-offices-tab-2',
    ]);
    expect(visibleText(nodeMarkup(html, moved.id))).toContain('作者自訂據點');
    expect(nodeMarkup(html, selected.id)).toMatch(/<button\b[^>]*class="[^"]*\bactive\b/);
    expect(nodeMarkup(html, 'home-offices-layout-2').split('>')[0]).not.toMatch(/\bstyle="[^"]*display:none/);
    expect(nodeMarkup(html, 'home-offices-layout-0').split('>')[0]).toMatch(/\bstyle="[^"]*display:none/);
    expect(canvas).toEqual(before);
  });

  it('retains an unknown direct office child and authored stacking outside July admission', async () => {
    const canvas = await julyCanvas();
    const label = canvas.nodes.find((node) => node.id === 'home-offices-label');
    if (label?.kind !== 'text') throw new Error('Missing original July office label');
    canvas.nodes.push({
      ...structuredClone(label),
      id: 'authored-office-note',
      zIndex: -2,
      content: { ...structuredClone(label.content), text: '作者補充據點說明' },
    });
    const before = structuredClone(canvas);
    const html = renderToStaticMarkup(await PublishedSitePageView({ resolved: publishedHomeResolved('zh-hant', canvas) }));

    expect(html).not.toContain('data-home-editorial="july"');
    expect(officeContainerIds(html)).toEqual([
      'authored-office-note', 'home-offices-layout-3', 'home-offices-label', 'home-offices-title',
      'home-offices-tabs', 'home-offices-layout-0', 'home-offices-layout-1', 'home-offices-layout-2',
    ]);
    expect(visibleText(nodeMarkup(html, 'authored-office-note'))).toContain('作者補充據點說明');
    expect(canvas).toEqual(before);
  });

  it('retains an extra authored office child in its original order', async () => {
    const canvas = await julyCanvas();
    const tab = canvas.nodes.find((node) => node.id === 'home-offices-tab-1');
    if (tab?.kind !== 'button') throw new Error('Missing original July office button');
    canvas.nodes.push({ ...structuredClone(tab), id: 'authored-office-link', zIndex: -2 });
    const before = structuredClone(canvas);
    const html = renderToStaticMarkup(await PublishedSitePageView({ resolved: publishedHomeResolved('zh-hant', canvas) }));
    const tabs = nodeMarkup(html, 'home-offices-tabs');

    expect(html).not.toContain('data-home-editorial="july"');
    expect(officeIds(html)).toEqual([
      'home-offices-tab-3', 'home-offices-tab-0', 'home-offices-tab-1', 'home-offices-tab-2',
    ]);
    expect(tabs).toContain('data-node-id="authored-office-link"');
    expect(tabs.indexOf('data-node-id="authored-office-link"')).toBeLessThan(tabs.indexOf('data-node-id="home-offices-tab-3"'));
    expect(canvas).toEqual(before);
  });
});
