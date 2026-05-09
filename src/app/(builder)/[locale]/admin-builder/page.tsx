import type { Metadata } from 'next';
import SandboxPage from '@/components/builder/canvas/SandboxPage';
import { readSiteDocument, readPageCanvas, writePageCanvas, publishPage, writeSiteDocument } from '@/lib/builder/site/persistence';
import { readCanvasSandboxDraft } from '@/lib/builder/canvas/persistence';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  createBlankCanvasDocument,
  normalizeCanvasDocument,
  type BuilderCanvasDocument,
  type BuilderCanvasNode,
} from '@/lib/builder/canvas/types';
import { createHomePageCanvasDocument, SEED_VERSION } from '@/lib/builder/canvas/seed-home';
import { repairHomeCanvasLocale } from '@/lib/builder/canvas/home-locale-repair';
import { seedSitePages } from '@/lib/builder/canvas/seed-pages';
import type { BuilderNavItem, BuilderSiteDocument } from '@/lib/builder/site/types';
import { mergeHeaderMegaChildren, type HeaderMegaKey } from '@/lib/builder/site/header-mega';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '호정국제 사이트 에디터',
  robots: { index: false, follow: false },
};

function upgradeOfficeMapPlaceholders(document: BuilderCanvasDocument): BuilderCanvasDocument {
  const nodesById = new Map(document.nodes.map((node) => [node.id, node]));
  let changed = false;
  const nextNodes: BuilderCanvasNode[] = [];

  for (const node of document.nodes) {
    if (/^home-offices-layout-\d+-map-(label|address)$/.test(node.id)) {
      changed = true;
      continue;
    }

    if (/^home-offices-layout-\d+-map$/.test(node.id) && node.kind === 'container') {
      const addressNode = nodesById.get(`${node.id}-address`);
      const rawAddress = addressNode?.content && 'text' in addressNode.content
        ? addressNode.content.text
        : '';
      const address = typeof rawAddress === 'string' ? rawAddress : '';
      nextNodes.push({
        ...node,
        kind: 'map',
        style: { ...node.style, borderRadius: Math.max(node.style.borderRadius, 12) },
        content: {
          address,
          zoom: 16,
        },
      } as BuilderCanvasNode);
      changed = true;
      continue;
    }

    nextNodes.push(node);
  }

  if (!changed) return document;
  return {
    ...document,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+editor-parity`,
    nodes: nextNodes,
  };
}

function withNodePatch(
  node: BuilderCanvasNode,
  patch: Partial<Omit<BuilderCanvasNode, 'content'>> & { content?: Record<string, unknown> },
): { node: BuilderCanvasNode; changed: boolean } {
  const nextNode = {
    ...node,
    ...patch,
    rect: patch.rect ? { ...node.rect, ...patch.rect } : node.rect,
    content: patch.content ? { ...node.content, ...patch.content } : node.content,
  } as BuilderCanvasNode;
  return {
    node: nextNode,
    changed: JSON.stringify(nextNode) !== JSON.stringify(node),
  };
}

function upgradeHeroSearchForm(document: BuilderCanvasDocument, locale: Locale): BuilderCanvasDocument {
  let changed = false;
  const searchButtonLabel = locale === 'ko' ? '검색' : locale === 'zh-hant' ? '搜尋' : 'Search';
  const nextNodes: BuilderCanvasNode[] = [];
  let hasInputNode = document.nodes.some((node) => node.id === 'home-hero-search-input');

  for (const node of document.nodes) {
    let result: { node: BuilderCanvasNode; changed: boolean } | null = null;

    if (node.id === 'home-hero-search-wrapper') {
      result = withNodePatch(node, {
        rect: { x: 0, y: 758, width: 1280, height: 62 },
      });
    } else if (node.id === 'home-hero-search-container') {
      result = withNodePatch(node, {
        rect: { x: 0, y: 0, width: 1280, height: 62 },
      });
    } else if (node.id === 'home-hero-search-wrap') {
      result = withNodePatch(node, {
        rect: { x: 0, y: 0, width: 620, height: 62 },
      });
    } else if (node.id === 'home-hero-search-bar') {
      result = withNodePatch(node, {
        rect: { x: 0, y: 0, width: 620, height: 62 },
        content: {
          as: 'form',
          action: `/${locale}/search`,
          method: 'get',
          layoutMode: 'flex',
          flexConfig: {
            direction: 'row',
            wrap: false,
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 0,
          },
        },
      });
    } else if (node.id === 'home-hero-search-placeholder' && !hasInputNode) {
      const placeholder = node.content && 'text' in node.content && typeof node.content.text === 'string'
        ? node.content.text
        : '';
      result = withNodePatch(node, {
        id: 'home-hero-search-input',
        rect: { x: 0, y: 0, width: 558, height: 62 },
        content: {
          as: 'input',
          inputType: 'search',
          name: 'q',
          placeholder,
          ariaLabel: placeholder,
        },
      });
      hasInputNode = true;
    } else if (node.id === 'home-hero-search-placeholder') {
      changed = true;
      continue;
    } else if (node.id === 'home-hero-search-input') {
      const placeholder = node.content && 'text' in node.content && typeof node.content.text === 'string'
        ? node.content.text
        : '';
      result = withNodePatch(node, {
        rect: { x: 0, y: 0, width: 558, height: 62 },
        content: {
          as: 'input',
          inputType: 'search',
          name: 'q',
          placeholder,
          ariaLabel: placeholder,
        },
      });
    } else if (node.id === 'home-hero-search-button') {
      result = withNodePatch(node, {
        rect: { x: 558, y: 0, width: 62, height: 62 },
        content: {
          as: 'button',
          buttonType: 'submit',
          ariaLabel: searchButtonLabel,
        },
      });
    }

    if (result) {
      changed = changed || result.changed;
      nextNodes.push(result.node);
    } else {
      nextNodes.push(node);
    }
  }

  if (!changed) return document;
  return {
    ...document,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+hero-search-parity`,
    nodes: nextNodes,
  };
}

function upgradeHeroQuickMenu(document: BuilderCanvasDocument, locale: Locale): BuilderCanvasDocument {
  if (!document.nodes.some((node) => node.id === 'home-hero-root')) return document;
  if (document.nodes.some((node) => node.id === 'home-hero-quick-menu')) return document;

  const seeded = createHomePageCanvasDocument(locale);
  const quickMenuNodes = seeded.nodes.filter((node) => node.id.startsWith('home-hero-quick-menu'));
  if (quickMenuNodes.length === 0) return document;

  const nextNodes: BuilderCanvasNode[] = [];
  let inserted = false;
  for (const node of document.nodes) {
    nextNodes.push(node);
    if (!inserted && node.id === 'home-hero-search-button') {
      nextNodes.push(...quickMenuNodes);
      inserted = true;
    }
  }

  if (!inserted) nextNodes.push(...quickMenuNodes);
  return {
    ...document,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+hero-quick-menu`,
    nodes: nextNodes,
  };
}

function upgradeHomeInsightsSource(document: BuilderCanvasDocument, locale: Locale): BuilderCanvasDocument {
  if (!document.nodes.some((node) => node.id === 'home-insights-root')) return document;
  const seeded = createHomePageCanvasDocument(locale);
  const seededById = new Map(
    seeded.nodes
      .filter((node) => node.id.startsWith('home-insights-'))
      .map((node) => [node.id, node]),
  );
  const existingIds = new Set(document.nodes.map((node) => node.id));
  const missingInsightsNodes = seeded.nodes.filter((node) => (
    node.id.startsWith('home-insights-') && !existingIds.has(node.id)
  ));
  const currentRoot = document.nodes.find((node) => node.id === 'home-insights-root');
  const seededRoot = seededById.get('home-insights-root');
  const currentRootY = currentRoot?.rect.y ?? 0;
  const oldInsightsBottom = currentRoot ? currentRoot.rect.y + currentRoot.rect.height : 0;
  const insightsHeightDelta = currentRoot && seededRoot
    ? seededRoot.rect.height - currentRoot.rect.height
    : 0;
  let changed = false;
  const nextNodes = document.nodes.flatMap((node) => {
    const seededNode = seededById.get(node.id);
    if (!seededNode) {
      if (node.id.startsWith('home-insights-')) {
        changed = true;
        return [];
      }
      if (insightsHeightDelta !== 0 && !node.parentId && node.rect.y >= oldInsightsBottom - 1) {
        changed = true;
        return [{
          ...node,
          rect: {
            ...node.rect,
            y: node.rect.y + insightsHeightDelta,
          },
        }];
      }
      return [node];
    }

    if (node.kind !== seededNode.kind) {
      return [node];
    }

    const result = withNodePatch(node, {
      rect: seededNode.rect,
      zIndex: seededNode.zIndex,
      style: seededNode.style,
      content: seededNode.content as Record<string, unknown>,
    });
    changed = changed || result.changed;
    return [result.node];
  });

  if (missingInsightsNodes.length > 0) {
    changed = true;
    nextNodes.push(...missingInsightsNodes);
  }

  const nextStageHeight = insightsHeightDelta !== 0
    ? Math.max(880, document.stageHeight + insightsHeightDelta, currentRootY + (seededRoot?.rect.height ?? 0) + 40)
    : document.stageHeight;

  if (!changed) return document;
  return {
    ...document,
    stageHeight: nextStageHeight,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+insights-source`,
    nodes: nextNodes,
  };
}

function upgradeHomeOfficesTabbedLayout(document: BuilderCanvasDocument, locale: Locale): BuilderCanvasDocument {
  if (!document.nodes.some((node) => node.id === 'home-offices-root')) return document;
  const seeded = createHomePageCanvasDocument(locale);
  const seededById = new Map(
    seeded.nodes
      .filter((node) => node.id.startsWith('home-offices-'))
      .map((node) => [node.id, node]),
  );
  const existingIds = new Set(document.nodes.map((node) => node.id));
  const missingOfficeNodes = seeded.nodes.filter((node) => (
    node.id.startsWith('home-offices-') && !existingIds.has(node.id)
  ));
  const currentRoot = document.nodes.find((node) => node.id === 'home-offices-root');
  const seededRoot = seededById.get('home-offices-root');
  const currentRootY = currentRoot?.rect.y ?? 0;
  const oldOfficesBottom = currentRoot ? currentRoot.rect.y + currentRoot.rect.height : 0;
  const officesHeightDelta = currentRoot && seededRoot
    ? seededRoot.rect.height - currentRoot.rect.height
    : 0;
  let changed = false;

  const nextNodes = document.nodes.map((node) => {
    const seededNode = seededById.get(node.id);
    if (!seededNode) {
      if (officesHeightDelta !== 0 && !node.parentId && node.rect.y >= oldOfficesBottom - 1) {
        changed = true;
        return {
          ...node,
          rect: {
            ...node.rect,
            y: node.rect.y + officesHeightDelta,
          },
        };
      }
      return node;
    }

    if (node.kind !== seededNode.kind) return node;

    const result = withNodePatch(node, {
      rect: seededNode.rect,
      zIndex: seededNode.zIndex,
      style: seededNode.style,
    });
    changed = changed || result.changed;
    return result.node;
  });

  if (missingOfficeNodes.length > 0) {
    changed = true;
    nextNodes.push(...missingOfficeNodes);
  }

  const nextStageHeight = officesHeightDelta !== 0
    ? Math.max(880, document.stageHeight + officesHeightDelta, currentRootY + (seededRoot?.rect.height ?? 0) + 40)
    : document.stageHeight;

  if (!changed) return document;
  return {
    ...document,
    stageHeight: nextStageHeight,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+offices-tabs`,
    nodes: nextNodes,
  };
}

function upgradeHomeServicesSection(document: BuilderCanvasDocument): BuilderCanvasDocument {
  let changed = false;
  const nextNodes = document.nodes.map((node) => {
    if (node.id !== 'home-services-root') return node;
    const result = withNodePatch(node, {
      content: {
        className: 'section section--light',
        htmlId: 'practice',
        dataTone: 'light',
      },
    });
    changed = changed || result.changed;
    return result.node;
  });

  if (!changed) return document;
  return {
    ...document,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+services-parity`,
    nodes: nextNodes,
  };
}

const PUBLIC_HEADER_NAV_ITEMS: Array<{
  key: string;
  slug: string;
  labels: Record<Locale, string>;
  megaKey?: HeaderMegaKey;
}> = [
  { key: 'services', slug: 'services', labels: { ko: '업무분야', 'zh-hant': '服務領域', en: 'Services' }, megaKey: 'services' },
  { key: 'lawyers', slug: 'lawyers', labels: { ko: '변호사소개', 'zh-hant': '律師介紹', en: 'Lawyers' } },
  { key: 'pricing', slug: 'pricing', labels: { ko: '비용안내', 'zh-hant': '收費標準', en: 'Pricing' } },
  { key: 'columns', slug: 'columns', labels: { ko: '호정칼럼', 'zh-hant': '昊鼎專欄', en: 'Columns' } },
  { key: 'videos', slug: 'videos', labels: { ko: '미디어센터', 'zh-hant': '媒體中心', en: 'Media Center' }, megaKey: 'videos' },
  { key: 'reviews', slug: 'reviews', labels: { ko: '고객후기', 'zh-hant': '客戶評價', en: 'Reviews' } },
];

function navHrefForSlug(slug: string): string {
  return slug ? `/${slug}` : '/';
}

function upgradePublicHeaderNavigation(site: BuilderSiteDocument): BuilderSiteDocument {
  let changed = false;
  const nextNavigation: BuilderNavItem[] = [...site.navigation];

  for (const item of PUBLIC_HEADER_NAV_ITEMS) {
    const href = navHrefForSlug(item.slug);
    const existing = nextNavigation.find((candidate) => candidate.href === href || candidate.id === `nav-${item.key}`);
    const page = site.pages.find((candidate) => candidate.slug === item.slug);
    if (existing) {
      const labelChanged = JSON.stringify(existing.label) !== JSON.stringify(item.labels);
      const nextPageId = page?.pageId ?? existing.pageId;
      const megaResult = item.megaKey ? mergeHeaderMegaChildren(existing, item.megaKey) : { item: existing, changed: false };
      if (labelChanged || existing.href !== href || existing.pageId !== nextPageId) {
        existing.label = item.labels;
        existing.href = href;
        existing.pageId = nextPageId;
        changed = true;
      }
      if (megaResult.changed) {
        existing.children = megaResult.item.children;
        changed = true;
      }
      continue;
    }

    const nextItem: BuilderNavItem = {
      id: `nav-${item.key}`,
      pageId: page?.pageId ?? `external-${item.key}`,
      href,
      label: item.labels,
    };
    nextNavigation.push(item.megaKey ? mergeHeaderMegaChildren(nextItem, item.megaKey).item : nextItem);
    changed = true;
  }

  if (!changed) return site;
  return {
    ...site,
    updatedAt: new Date().toISOString(),
    navigation: nextNavigation,
  };
}

const REQUIRED_SEED_SLUGS = ['', 'about', 'services', 'contact', 'lawyers', 'faq', 'pricing', 'reviews', 'columns', 'privacy', 'disclaimer'];

function needsStandardPageSeed(sitePages: Array<{ slug: string; isHomePage?: boolean }>): boolean {
  if (sitePages.length === 0) return true;
  return REQUIRED_SEED_SLUGS.some((slug) => {
    if (slug === '') {
      return !sitePages.some((page) => page.isHomePage || page.slug === '');
    }
    return !sitePages.some((page) => page.slug === slug);
  });
}

/**
 * Unified builder entry point.
 *
 * This replaces the separate /admin-builder/sandbox route as the
 * single editor experience. Loads the home page (or first page)
 * from the site document if available, falls back to the legacy
 * sandbox draft for backward compat.
 *
 * The SandboxPage component IS the freeform canvas editor — it's
 * not a "sandbox" anymore, it's the main builder.
 */
export default async function BuilderMainPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { pageId?: string; reseed?: string };
}) {
  const locale: Locale = normalizeLocale(params.locale);
  const force = searchParams?.reseed === '1';

  // Try to load from site document (multi-page model). Seeding every request is
  // expensive because it checks each page canvas; only do it when metadata is missing.
  let site = await readSiteDocument('default', locale);
  if (force || needsStandardPageSeed(site.pages)) {
    await seedSitePages('default', locale);
    site = await readSiteDocument('default', locale);
  }
  const upgradedSite = upgradePublicHeaderNavigation(site);
  if (upgradedSite !== site) {
    site = upgradedSite;
    try {
      await writeSiteDocument(site);
    } catch {
      // Best-effort header parity upgrade; the in-memory editor still receives the nav items.
    }
  }
  const homePage = site.pages.find((p) => p.isHomePage) || site.pages[0];
  const requestedPage = searchParams?.pageId
    ? site.pages.find((page) => page.pageId === searchParams.pageId)
    : null;
  const initialPage = requestedPage ?? homePage;
  const canPersistInitialPageDraft = Boolean(initialPage && initialPage.locale === locale);

  let initialDocument;
  let backend: 'blob' | 'file' = 'blob';

  if (initialPage) {
    const pageCanvas = await readPageCanvas('default', initialPage.pageId, 'draft');
    const nodeCount = pageCanvas?.nodes?.length ?? 0;
    const updatedBy = pageCanvas?.updatedBy ?? '';
    const isLegacySeed =
      updatedBy.startsWith('home-seed-v') || updatedBy === 'site-page-seed';
    const isCurrentSeed = updatedBy === SEED_VERSION;
    const isInitialHomePage = initialPage.pageId === homePage?.pageId || Boolean(initialPage.isHomePage);
    const homeDraftHasHero = Boolean(pageCanvas?.nodes?.some((node) => node.id === 'home-hero-root'));
    const isLegacySandboxDraft = Boolean(pageCanvas?.nodes?.some((node) => (
      node.id === 'headline-1'
      || node.id === 'support-copy-1'
      || node.id === 'cta-button-1'
      || node.id === 'hero-image-1'
    )));
    const needsReseed =
      isInitialHomePage
        && (
          force
          || !pageCanvas
          || nodeCount === 0
          || (isLegacySeed && !isCurrentSeed)
          || !homeDraftHasHero
          || isLegacySandboxDraft
        );

    if (pageCanvas && !needsReseed) {
      const normalized = normalizeCanvasDocument(pageCanvas, locale);
      initialDocument = isInitialHomePage ? repairHomeCanvasLocale(normalized, locale) : normalized;
    } else if (needsReseed) {
      const seeded = createHomePageCanvasDocument(locale);
      initialDocument = seeded;
      if (canPersistInitialPageDraft) {
        try {
          await writePageCanvas('default', initialPage.pageId, 'draft', seeded);
          await publishPage('default', initialPage.pageId, locale);
        } catch {
          // Best-effort seed; editor still loads from in-memory doc if write fails
        }
      }
    } else {
      const blank = createBlankCanvasDocument(locale);
      initialDocument = blank;
      if (canPersistInitialPageDraft) {
        try {
          await writePageCanvas('default', initialPage.pageId, 'draft', blank);
        } catch {
          // Best-effort initial draft; editor still loads from in-memory doc if write fails
        }
      }
    }
  }

  // Fallback to legacy sandbox draft
  if (!initialDocument) {
    const draft = await readCanvasSandboxDraft(locale);
    initialDocument = draft.document;
    backend = draft.backend;
  }

  const upgradedInitialDocument = upgradeHeroSearchForm(
    upgradeHeroQuickMenu(
      upgradeHomeServicesSection(
        upgradeHomeOfficesTabbedLayout(
          upgradeHomeInsightsSource(upgradeOfficeMapPlaceholders(initialDocument), locale),
          locale,
        ),
      ),
      locale,
    ),
    locale,
  );
  if (upgradedInitialDocument !== initialDocument && initialPage && canPersistInitialPageDraft) {
    initialDocument = upgradedInitialDocument;
    try {
      await writePageCanvas('default', initialPage.pageId, 'draft', initialDocument);
    } catch {
      // Best-effort upgrade; the in-memory editor still receives the map nodes.
    }
  } else {
    initialDocument = upgradedInitialDocument;
  }

  return (
    <SandboxPage
      locale={locale}
      backend={backend}
      initialDocument={initialDocument}
      initialPageId={initialPage?.pageId}
      siteName={site.name}
      siteSettings={site.settings}
      siteTheme={site.theme}
      navItems={site.navigation || []}
      currentSlug={initialPage?.slug || ''}
      sitePages={site.pages}
      siteLightboxes={site.lightboxes ?? []}
    />
  );
}
