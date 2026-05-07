import type { Metadata } from 'next';
import SandboxPage from '@/components/builder/canvas/SandboxPage';
import { readSiteDocument, readPageCanvas, writePageCanvas, publishPage } from '@/lib/builder/site/persistence';
import { readCanvasSandboxDraft } from '@/lib/builder/canvas/persistence';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  createBlankCanvasDocument,
  normalizeCanvasDocument,
  type BuilderCanvasDocument,
  type BuilderCanvasNode,
} from '@/lib/builder/canvas/types';
import { createHomePageCanvasDocument, SEED_VERSION } from '@/lib/builder/canvas/seed-home';
import { seedSitePages } from '@/lib/builder/canvas/seed-pages';

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

function upgradeHomeInsightsSource(document: BuilderCanvasDocument, locale: Locale): BuilderCanvasDocument {
  if (!document.nodes.some((node) => node.id === 'home-insights-root')) return document;
  const seeded = createHomePageCanvasDocument(locale);
  const seededById = new Map(
    seeded.nodes
      .filter((node) => node.id.startsWith('home-insights-'))
      .map((node) => [node.id, node]),
  );
  let changed = false;
  const nextNodes = document.nodes.map((node) => {
    const seededNode = seededById.get(node.id);
    if (!seededNode) return node;

    const patch: Partial<Omit<BuilderCanvasNode, 'content'>> & { content?: Record<string, unknown> } = {};
    if (node.kind === 'text' && seededNode.kind === 'text') {
      patch.content = {
        text: seededNode.content.text,
        richText: seededNode.content.richText,
      };
    } else if (node.kind === 'image' && seededNode.kind === 'image') {
      patch.content = {
        src: seededNode.content.src,
        alt: seededNode.content.alt,
      };
    } else if (node.kind === 'button' && seededNode.kind === 'button') {
      patch.content = {
        label: seededNode.content.label,
        href: seededNode.content.href,
        link: seededNode.content.link,
      };
    } else {
      return node;
    }

    const result = withNodePatch(node, patch);
    changed = changed || result.changed;
    return result.node;
  });

  if (!changed) return document;
  return {
    ...document,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+insights-source`,
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
  const homePage = site.pages.find((p) => p.isHomePage) || site.pages[0];
  const requestedPage = searchParams?.pageId
    ? site.pages.find((page) => page.pageId === searchParams.pageId)
    : null;
  const initialPage = requestedPage ?? homePage;

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
    const needsReseed =
      isInitialHomePage
        && (force || !pageCanvas || nodeCount === 0 || (isLegacySeed && !isCurrentSeed));

    if (pageCanvas && !needsReseed) {
      initialDocument = normalizeCanvasDocument(pageCanvas, locale);
    } else if (needsReseed) {
      const seeded = createHomePageCanvasDocument(locale);
      initialDocument = seeded;
      try {
        await writePageCanvas('default', initialPage.pageId, 'draft', seeded);
        await publishPage('default', initialPage.pageId, locale);
      } catch {
        // Best-effort seed; editor still loads from in-memory doc if write fails
      }
    } else {
      const blank = createBlankCanvasDocument(locale);
      initialDocument = blank;
      try {
        await writePageCanvas('default', initialPage.pageId, 'draft', blank);
      } catch {
        // Best-effort initial draft; editor still loads from in-memory doc if write fails
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
    upgradeHomeServicesSection(
      upgradeHomeInsightsSource(upgradeOfficeMapPlaceholders(initialDocument), locale),
    ),
    locale,
  );
  if (upgradedInitialDocument !== initialDocument && initialPage) {
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
