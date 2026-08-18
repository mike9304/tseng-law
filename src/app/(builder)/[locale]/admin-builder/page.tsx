import type { Metadata } from 'next';
import SandboxPage from '@/components/builder/canvas/SandboxPage';
import {
  projectPagesForLocale,
  readSiteDocument,
  readPageCanvasRecord,
  writePageCanvas,
  publishPage,
} from '@/lib/builder/site/persistence';
import {
  canPersistHomeDraftRenderMigration,
  decideHomeDraftReseed,
  SEED_DRAFT_UPDATED_BY,
} from '@/lib/builder/canvas/home-draft-reseed';
import { readCanvasSandboxDraft } from '@/lib/builder/canvas/persistence';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  createBlankCanvasDocument,
  normalizeCanvasDocument,
  type BuilderCanvasDocument,
  type BuilderCanvasNode,
} from '@/lib/builder/canvas/types';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import { readBuilderPageSnapshot } from '@/lib/builder/persistence';
import {
  createDefaultBuilderPageDatasets,
  readBuilderPageDatasetOverviews,
} from '@/lib/builder/datasets';
import { buildBuilderDynamicListDatasetDocument } from '@/lib/builder/dynamic-list-pages';
import { buildBuilderDynamicItemDatasetDocument } from '@/lib/builder/dynamic-item-pages';
// Migrations use the bare name (DECOMPOSED reference, applied only to decomposed
// homes); the live-matching COMPOSITE home is seeded via ...Composite.
import {
  createHomePageCanvasDocument as createHomePageCanvasDocumentComposite,
  createHomePageCanvasDocumentDecomposed as createHomePageCanvasDocument,
} from '@/lib/builder/canvas/seed-home';
import {
  HERO_MEDIA_IMAGE_NODE_IDS,
  HERO_MEDIA_IMAGE_SOURCES,
  HERO_SECTION_ROOT_HEIGHT,
} from '@/lib/builder/canvas/decompose-hero';
import { upgradeHomeHeroSearchForm } from '@/lib/builder/canvas/home-hero-search-migration';
import { createInsightsDecomposedNodes, INSIGHTS_SECTION_ROOT_HEIGHT } from '@/lib/builder/canvas/decompose-insights';
import { FAQ_SECTION_ROOT_HEIGHT } from '@/lib/builder/canvas/decompose-faq';
import { SERVICES_SECTION_ROOT_HEIGHT } from '@/lib/builder/canvas/decompose-services';
import { upgradeStandardServicesPageDesktopParity } from '@/lib/builder/canvas/decompose-page-services';
import { repairHomeCanvasLocale } from '@/lib/builder/canvas/home-locale-repair';
import { upgradeHomeEditorLayoutParity } from '@/lib/builder/canvas/home-editor-layout-parity';
import { buildFaqCompositePageCanvas, seedSitePages } from '@/lib/builder/canvas/seed-pages';
import { upgradePublicHeaderNavigation } from '@/lib/builder/site/public-header-navigation';
import { needsStandardPageSeedForLocale } from '@/lib/builder/site/standard-pages';
import { listEnabledBuilderAppWidgetsFromInstalled } from '@/lib/builder/apps/widgets';
import { listFaqCategories, listFaqItems } from '@/lib/builder/faq/faq-engine';
import { resolveBuilderSiteIdFromValue } from '@/lib/builder/site/admin-routing';
import { resolveBuilderSiteName } from '@/lib/builder/site/site-name';
import type { ColumnPost } from '@/lib/columns';
import type { DraftMeta } from '@/components/builder/canvas/hooks/useSandboxSiteState';

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

function isHomeCanvasDocument(document: BuilderCanvasDocument): boolean {
  return document.nodes.some((node) => node.id === 'home-hero-root');
}

function prepareEditorCanvasDocument(
  document: BuilderCanvasDocument,
  locale: Locale,
  isInitialHomePage: boolean,
): BuilderCanvasDocument {
  if (isInitialHomePage && isHomeCanvasDocument(document)) {
    return upgradeHomeEditorLayoutParity(
      repairHomeCanvasLocale({ ...document, locale }, locale),
      locale,
      { stampMetadata: false },
    );
  }
  return normalizeCanvasDocument(document, locale);
}

function draftMetaFromRecord(record: Awaited<ReturnType<typeof readPageCanvasRecord>>): DraftMeta | null {
  return record
    ? {
        revision: record.revision,
        savedAt: record.savedAt,
        updatedBy: record.updatedBy,
      }
    : null;
}

function isSeedManagedDraft(updatedBy: string | undefined): boolean {
  return !updatedBy || updatedBy === SEED_DRAFT_UPDATED_BY || /^site-page-seed-v\d+$/.test(updatedBy);
}

function isSeedManagedFaqDocument(document: BuilderCanvasDocument): boolean {
  return isSeedManagedDraft(document.updatedBy);
}

function needsFaqLiveCompositeDraftRepair(
  page: { slug?: string } | null | undefined,
  document: BuilderCanvasDocument | null,
  draftUpdatedBy: string | undefined,
): boolean {
  if (!page || page.slug !== 'faq' || !document) return false;
  if (!isSeedManagedDraft(draftUpdatedBy) && !isSeedManagedFaqDocument(document)) return false;
  const hasLiveComposite = document.nodes.some((node) => (
    node.kind === 'composite' && node.content.componentKey === 'legacy-page-faq'
  ));
  if (hasLiveComposite) return false;

  return document.nodes.some((node) => (
    node.id === 'page-faq-page-header-root' ||
    node.id === 'page-faq-faq-root' ||
    node.id.startsWith('page-faq-faq-item-')
  ));
}

function upgradeHomeHeroEditorialPolish(document: BuilderCanvasDocument): BuilderCanvasDocument {
  if (!document.nodes.some((node) => node.id === 'home-hero-root')) return document;

  let changed = false;
  const nextNodes = document.nodes.map((node) => {
    let result: { node: BuilderCanvasNode; changed: boolean } | null = null;

    if (node.id === 'home-hero-inner') {
      result = withNodePatch(node, {
        rect: { x: 51, y: 184, width: 1178, height: 483 },
      });
    } else if (node.id === 'home-hero-copy') {
      result = withNodePatch(node, {
        rect: { x: 0, y: 0, width: 780, height: 363 },
      });
    } else if (node.id === 'home-hero-label') {
      result = withNodePatch(node, {
        rect: { x: 0, y: 1, width: 240, height: 32 },
      });
    } else if (node.id === 'home-hero-title') {
      result = withNodePatch(node, {
        rect: { x: 0, y: 56, width: 780, height: 167 },
      });
    } else if (node.id === 'home-hero-subtitle') {
      result = withNodePatch(node, {
        rect: { x: 0, y: 247, width: 580, height: 116 },
      });
    } else if (node.id === 'home-hero-links') {
      result = withNodePatch(node, {
        rect: { x: 0, y: 338, width: 260, height: 32 },
      });
    } else if (node.id === 'home-hero-scroll-arrow') {
      result = withNodePatch(node, {
        rect: { x: 1216, y: 746, width: 48, height: 48 },
      });
    }

    if (!result) return node;
    changed = changed || result.changed;
    return result.node;
  });

  if (!changed) return document;
  return {
    ...document,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+hero-editorial-polish`,
    nodes: nextNodes,
  };
}

type BuilderCanvasResponsiveViewport = 'tablet' | 'mobile';
type BuilderCanvasViewportOverride = NonNullable<NonNullable<BuilderCanvasNode['responsive']>['mobile']>;

function mergeViewportOverride(
  node: BuilderCanvasNode,
  viewport: BuilderCanvasResponsiveViewport,
  override: BuilderCanvasViewportOverride,
): { node: BuilderCanvasNode; changed: boolean } {
  const previousResponsive = node.responsive ?? {};
  const previousViewport = previousResponsive[viewport] ?? {};
  const nextNode = {
    ...node,
    responsive: {
      ...previousResponsive,
      [viewport]: {
        ...previousViewport,
        ...override,
        rect: {
          ...(previousViewport.rect ?? {}),
          ...(override.rect ?? {}),
        },
      },
    },
  } as BuilderCanvasNode;
  return {
    node: nextNode,
    changed: JSON.stringify(nextNode) !== JSON.stringify(node),
  };
}

function upgradeHomeHeroResponsiveParity(document: BuilderCanvasDocument): BuilderCanvasDocument {
  if (!document.nodes.some((node) => node.id === 'home-hero-root')) return document;

  const mobileOverrides: Record<string, BuilderCanvasViewportOverride> = {
    'home-hero-root': { rect: { x: 16, y: 0, width: 343, height: 680 } },
    'home-hero-media': { rect: { x: 16, y: 0, width: 343, height: 680 } },
    'home-hero-media-image': { rect: { x: 0, y: 0, width: 343, height: 680 } },
    'home-hero-media-image-2': { rect: { x: 0, y: 0, width: 343, height: 680 } },
    'home-hero-media-image-3': { rect: { x: 0, y: 0, width: 343, height: 680 } },
    'home-hero-inner': { rect: { x: 34, y: 178, width: 308, height: 362 } },
    'home-hero-copy': { rect: { x: 0, y: 0, width: 308, height: 266 } },
    'home-hero-label': { rect: { x: 0, y: 7, width: 187, height: 22 }, fontSize: 12 },
    'home-hero-title': { rect: { x: 0, y: 54, width: 308, height: 72 }, fontSize: 32 },
    'home-hero-subtitle': { rect: { x: 0, y: 154, width: 308, height: 52 }, fontSize: 15 },
    'home-hero-links': { rect: { x: 0, y: 241, width: 308, height: 26 } },
    'home-hero-columns-link': { rect: { x: 0, y: 0, width: 180, height: 26 }, fontSize: 14 },
    'home-hero-search-wrapper': { rect: { x: 30, y: 649, width: 316, height: 62 } },
    'home-hero-search-container': { rect: { x: 0, y: 0, width: 316, height: 62 } },
    'home-hero-search-wrap': { rect: { x: 0, y: 0, width: 316, height: 62 } },
    'home-hero-search-bar': { rect: { x: 0, y: 0, width: 316, height: 62 } },
    'home-hero-search-input': { rect: { x: 0, y: 0, width: 256, height: 62 }, fontSize: 16 },
    'home-hero-search-button': { rect: { x: 256, y: 0, width: 60, height: 62 } },
    'home-hero-quick-menu': { rect: { x: 0, y: 70, width: 316 } },
  };
  const tabletOverrides: Record<string, BuilderCanvasViewportOverride> = {
    'home-hero-root': { rect: { x: 16, y: 0, width: 736, height: 680 } },
    'home-hero-media': { rect: { x: 16, y: 0, width: 736, height: 680 } },
    'home-hero-media-image': { rect: { x: 0, y: 0, width: 736, height: 680 } },
    'home-hero-media-image-2': { rect: { x: 0, y: 0, width: 736, height: 680 } },
    'home-hero-media-image-3': { rect: { x: 0, y: 0, width: 736, height: 680 } },
    'home-hero-inner': { rect: { x: 47, y: 201, width: 675, height: 318 } },
    'home-hero-copy': { rect: { x: 0, y: 0, width: 675, height: 222 } },
    'home-hero-label': { rect: { x: 0, y: 8, width: 180, height: 22 }, fontSize: 12 },
    'home-hero-title': { rect: { x: 0, y: 55, width: 675, height: 52 }, fontSize: 45 },
    'home-hero-subtitle': { rect: { x: 0, y: 134, width: 580, height: 28 }, fontSize: 16 },
    'home-hero-links': { rect: { x: 0, y: 197, width: 675, height: 26 } },
    'home-hero-columns-link': { rect: { x: 0, y: 0, width: 180, height: 26 }, fontSize: 14 },
    'home-hero-search-wrapper': { rect: { x: 30, y: 649, width: 709, height: 62 } },
    'home-hero-search-container': { rect: { x: 0, y: 0, width: 709, height: 62 } },
    'home-hero-search-wrap': { rect: { x: 0, y: 0, width: 709, height: 62 } },
    'home-hero-search-bar': { rect: { x: 0, y: 0, width: 709, height: 62 } },
    'home-hero-search-input': { rect: { x: 0, y: 0, width: 649, height: 62 }, fontSize: 16 },
    'home-hero-search-button': { rect: { x: 649, y: 0, width: 60, height: 62 } },
    'home-hero-quick-menu': { rect: { x: 0, y: 70, width: 709 } },
  };
  const viewportOverrides = {
    tablet: tabletOverrides,
    mobile: mobileOverrides,
  } satisfies Record<BuilderCanvasResponsiveViewport, Record<string, BuilderCanvasViewportOverride>>;

  let changed = false;
  const nextNodes = document.nodes.map((node) => {
    let nextNode = node;
    for (const viewport of ['tablet', 'mobile'] as const) {
      const override = viewportOverrides[viewport][nextNode.id];
      if (!override) continue;
      const result = mergeViewportOverride(nextNode, viewport, override);
      changed = changed || result.changed;
      nextNode = result.node;
    }
    return nextNode;
  });

  if (!changed) return document;
  return {
    ...document,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+hero-responsive-parity`,
    nodes: nextNodes,
  };
}

const HOME_TABLET_STAGE_HEIGHT = 8800;
const HOME_MOBILE_STAGE_HEIGHT = 9800;
const COLLAPSED_RESPONSIVE_RECT_SIZE = 1;
const FAQ_MOBILE_ITEM_TOPS = [0, 99, 197, 295, 394, 520, 646, 744, 843, 969, 1095, 1193, 1292, 1418] as const;
const FAQ_MOBILE_ITEM_HEIGHTS = [87, 87, 87, 87, 115, 115, 87, 115, 115, 87, 115, 87, 115, 115] as const;

function serviceTabletOverride(nodeId: string): BuilderCanvasViewportOverride | null {
  const aliasMatch = /^home-services-card-(\d+)-alias-\d+$/.exec(nodeId);
  if (aliasMatch) {
    const index = Number(aliasMatch[1]);
    return { rect: { x: 0, y: Math.max(0, (index * 130) - 72), width: 4, height: 4 } };
  }

  const cardMatch = /^home-services-card-(\d+)$/.exec(nodeId);
  if (cardMatch) {
    const index = Number(cardMatch[1]);
    return { rect: { x: 0, y: index * 130, width: 675, height: 98 } };
  }

  const toggleMatch = /^home-services-card-\d+-toggle$/.exec(nodeId);
  if (toggleMatch) return { rect: { x: 0, y: 0, width: 675, height: 98 } };

  const headerMatch = /^home-services-card-\d+-header$/.exec(nodeId);
  if (headerMatch) return { rect: { x: 24, y: 20, width: 560, height: 56 } };

  const iconMatch = /^home-services-card-\d+-icon$/.exec(nodeId);
  if (iconMatch) return { rect: { x: 0, y: 0, width: 46, height: 46 } };

  const iconSvgMatch = /^home-services-card-\d+-icon-svg$/.exec(nodeId);
  if (iconSvgMatch) return { rect: { x: 11, y: 11, width: 24, height: 24 } };

  const titleMatch = /^home-services-card-\d+-title$/.exec(nodeId);
  if (titleMatch) return { rect: { x: 58, y: 16, width: 520, height: 25 } };

  const chevronMatch = /^home-services-card-\d+-chevron$/.exec(nodeId);
  if (chevronMatch) return { rect: { x: 629, y: 33, width: 20, height: 29 } };

  const bodyMatch = /^home-services-card-\d+-body$/.exec(nodeId);
  if (bodyMatch) return { rect: { x: 0, y: 97, width: 675, height: COLLAPSED_RESPONSIVE_RECT_SIZE } };

  const descMatch = /^home-services-card-\d+-description$/.exec(nodeId);
  if (descMatch) return { rect: { x: 24, y: 0, width: 625, height: 82 } };

  const collapsedDetailMatch =
    /^home-services-card-\d+-(?:checklist|columns|columns-list|more|detail-\d+|column-\d+|columns-label)$/.exec(nodeId);
  if (collapsedDetailMatch) {
    return {
      rect: {
        x: 24,
        y: 0,
        width: COLLAPSED_RESPONSIVE_RECT_SIZE,
        height: COLLAPSED_RESPONSIVE_RECT_SIZE,
      },
    };
  }

  return null;
}

function faqTabletOverride(nodeId: string): BuilderCanvasViewportOverride | null {
  const itemMatch = /^home-faq-item-(\d+)$/.exec(nodeId);
  if (itemMatch) {
    const index = Number(itemMatch[1]);
    return { rect: { x: 0, y: index * 71, width: 675, height: 60 } };
  }

  const questionMatch = /^home-faq-item-\d+-question$/.exec(nodeId);
  if (questionMatch) return { rect: { x: 0, y: 0, width: 675, height: 60 } };

  const questionTextMatch = /^home-faq-item-\d+-question-text$/.exec(nodeId);
  if (questionTextMatch) return { rect: { x: 16, y: 18, width: 613, height: 24 } };

  const arrowMatch = /^home-faq-item-\d+-arrow$/.exec(nodeId);
  if (arrowMatch) return { rect: { x: 639, y: 18, width: 20, height: 20 } };

  const answerWrapMatch = /^home-faq-item-\d+-answer-wrap$/.exec(nodeId);
  if (answerWrapMatch) return { rect: { x: 16, y: 60, width: 643, height: COLLAPSED_RESPONSIVE_RECT_SIZE } };

  const answerMatch = /^home-faq-item-\d+-answer$/.exec(nodeId);
  if (answerMatch) return { rect: { x: 0, y: 0, width: 643, height: COLLAPSED_RESPONSIVE_RECT_SIZE } };

  return null;
}

function insightsTabletOverride(nodeId: string): BuilderCanvasViewportOverride | null {
  const itemMatch = /^home-insights-item-(\d+)$/.exec(nodeId);
  if (itemMatch) {
    const index = Number(itemMatch[1]);
    return { rect: { x: 0, y: index * 151, width: 641, height: 133 } };
  }

  const thumbMatch = /^home-insights-item-\d+-thumb$/.exec(nodeId);
  if (thumbMatch) return { rect: { x: 0, y: 0, width: 128, height: 96 } };

  const imageMatch = /^home-insights-item-\d+-image$/.exec(nodeId);
  if (imageMatch) return { rect: { x: 0, y: 0, width: 128, height: 85 } };

  const badgeMatch = /^home-insights-item-\d+-badge$/.exec(nodeId);
  if (badgeMatch) return { rect: { x: 12, y: 56, width: 104, height: 28 } };

  const copyMatch = /^home-insights-item-\d+-copy$/.exec(nodeId);
  if (copyMatch) return { rect: { x: 144, y: 0, width: 497, height: 114 } };

  const metaMatch = /^home-insights-item-\d+-meta$/.exec(nodeId);
  if (metaMatch) return { rect: { x: 0, y: 0, width: 497, height: 20 } };

  const dateMatch = /^home-insights-item-\d+-date$/.exec(nodeId);
  if (dateMatch) return { rect: { x: 0, y: 0, width: 120, height: 20 } };

  const readtimeMatch = /^home-insights-item-\d+-readtime$/.exec(nodeId);
  if (readtimeMatch) return { rect: { x: 419, y: 0, width: 78, height: 20 } };

  const bylineMatch = /^home-insights-item-\d+-byline$/.exec(nodeId);
  if (bylineMatch) return { rect: { x: 0, y: 28, width: 190, height: 21 } };

  const titleMatch = /^home-insights-item-\d+-title$/.exec(nodeId);
  if (titleMatch) return { rect: { x: 0, y: 60, width: 497, height: 24 } };

  const summaryMatch = /^home-insights-item-\d+-summary$/.exec(nodeId);
  if (summaryMatch) return { rect: { x: 0, y: 90, width: 497, height: 23 } };

  return null;
}

function officesTabletOverride(nodeId: string): BuilderCanvasViewportOverride | null {
  const tabMatch = /^home-offices-tab-(\d+)$/.exec(nodeId);
  if (tabMatch) {
    const index = Number(tabMatch[1]);
    return { rect: { x: index * 118, y: 0, width: 104, height: 32 } };
  }

  const layoutMatch = /^home-offices-layout-\d+$/.exec(nodeId);
  if (layoutMatch) return { rect: { x: 0, y: 192, width: 675, height: 689 } };

  const mapMatch = /^home-offices-layout-\d+-map$/.exec(nodeId);
  if (mapMatch) return { rect: { x: 0, y: 0, width: 675, height: 371 } };

  const cardMatch = /^home-offices-layout-\d+-card$/.exec(nodeId);
  if (cardMatch) return { rect: { x: 0, y: 387, width: 675, height: 301 } };

  const labelMatch = /^home-offices-layout-\d+-card-label$/.exec(nodeId);
  if (labelMatch) return { rect: { x: 24, y: 24, width: 120, height: 24 } };

  const titleMatch = /^home-offices-layout-\d+-card-title$/.exec(nodeId);
  if (titleMatch) return { rect: { x: 24, y: 66, width: 240, height: 34 } };

  const addressMatch = /^home-offices-layout-\d+-card-address$/.exec(nodeId);
  if (addressMatch) return { rect: { x: 24, y: 116, width: 627, height: 58 } };

  const phoneMatch = /^home-offices-layout-\d+-card-phone$/.exec(nodeId);
  if (phoneMatch) return { rect: { x: 24, y: 188, width: 220, height: 24 } };

  const faxMatch = /^home-offices-layout-\d+-card-fax$/.exec(nodeId);
  if (faxMatch) return { rect: { x: 24, y: 222, width: 220, height: 24 } };

  const mapLinkMatch = /^home-offices-layout-\d+-card-map-link$/.exec(nodeId);
  if (mapLinkMatch) return { rect: { x: 24, y: 278, width: 280, height: 40 } };

  return null;
}

function statsTabletOverride(nodeId: string): BuilderCanvasViewportOverride | null {
  const cardMatch = /^home-stats-card-(\d+)$/.exec(nodeId);
  if (cardMatch) {
    const index = Number(cardMatch[1]);
    return {
      rect: {
        x: (index % 2) * 343,
        y: Math.floor(index / 2) * 112,
        width: 331,
        height: 100,
      },
    };
  }

  const numberMatch = /^home-stats-number-\d+$/.exec(nodeId);
  if (numberMatch) return { rect: { x: 16, y: 16, width: 180, height: 38 } };

  const labelMatch = /^home-stats-label-\d+$/.exec(nodeId);
  if (labelMatch) return { rect: { x: 16, y: 60, width: 299, height: 34 } };

  const progressMatch = /^home-stats-progress-\d+$/.exec(nodeId);
  if (progressMatch) return { rect: { x: 16, y: 88, width: 299, height: 1 } };

  const progressBarMatch = /^home-stats-progress-bar-\d+$/.exec(nodeId);
  if (progressBarMatch) return { rect: { x: 0, y: 0, width: 299, height: 1 } };

  return null;
}

function serviceMobileOverride(nodeId: string): BuilderCanvasViewportOverride | null {
  const aliasMatch = /^home-services-card-(\d+)-alias-\d+$/.exec(nodeId);
  if (aliasMatch) {
    const index = Number(aliasMatch[1]);
    return { rect: { x: 0, y: Math.max(0, (index * 162) - 72), width: 4, height: 4 } };
  }

  const cardMatch = /^home-services-card-(\d+)$/.exec(nodeId);
  if (cardMatch) {
    const index = Number(cardMatch[1]);
    return { rect: { x: 0, y: index * 162, width: 308, height: 130 } };
  }

  const toggleMatch = /^home-services-card-\d+-toggle$/.exec(nodeId);
  if (toggleMatch) return { rect: { x: 0, y: 0, width: 308, height: 130 } };

  const headerMatch = /^home-services-card-\d+-header$/.exec(nodeId);
  if (headerMatch) return { rect: { x: 24, y: 20, width: 240, height: 90 } };

  const iconMatch = /^home-services-card-\d+-icon$/.exec(nodeId);
  if (iconMatch) return { rect: { x: 0, y: 0, width: 46, height: 46 } };

  const iconSvgMatch = /^home-services-card-\d+-icon-svg$/.exec(nodeId);
  if (iconSvgMatch) return { rect: { x: 11, y: 11, width: 24, height: 24 } };

  const titleMatch = /^home-services-card-\d+-title$/.exec(nodeId);
  if (titleMatch) return { rect: { x: 58, y: 4, width: 206, height: 52 } };

  const chevronMatch = /^home-services-card-\d+-chevron$/.exec(nodeId);
  if (chevronMatch) return { rect: { x: 272, y: 33, width: 20, height: 29 } };

  const bodyMatch = /^home-services-card-\d+-body$/.exec(nodeId);
  if (bodyMatch) return { rect: { x: 0, y: 97, width: 308, height: COLLAPSED_RESPONSIVE_RECT_SIZE } };

  const descMatch = /^home-services-card-\d+-description$/.exec(nodeId);
  if (descMatch) return { rect: { x: 24, y: 0, width: 260, height: 54 } };

  const collapsedDetailMatch =
    /^home-services-card-\d+-(?:checklist|columns|columns-list|more|detail-\d+|column-\d+|columns-label)$/.exec(nodeId);
  if (collapsedDetailMatch) {
    return {
      rect: {
        x: 24,
        y: 0,
        width: COLLAPSED_RESPONSIVE_RECT_SIZE,
        height: COLLAPSED_RESPONSIVE_RECT_SIZE,
      },
    };
  }

  return null;
}

function faqMobileOverride(nodeId: string): BuilderCanvasViewportOverride | null {
  const itemMatch = /^home-faq-item-(\d+)$/.exec(nodeId);
  if (itemMatch) {
    const index = Number(itemMatch[1]);
    return {
      rect: {
        x: 0,
        y: FAQ_MOBILE_ITEM_TOPS[index] ?? index * 99,
        width: 308,
        height: FAQ_MOBILE_ITEM_HEIGHTS[index] ?? 87,
      },
    };
  }

  const questionMatch = /^home-faq-item-\d+-question$/.exec(nodeId);
  if (questionMatch) return { rect: { x: 0, y: 0, width: 308, height: 87 } };

  const questionTextMatch = /^home-faq-item-\d+-question-text$/.exec(nodeId);
  if (questionTextMatch) return { rect: { x: 16, y: 18, width: 256, height: 48 } };

  const arrowMatch = /^home-faq-item-\d+-arrow$/.exec(nodeId);
  if (arrowMatch) return { rect: { x: 276, y: 22, width: 20, height: 20 } };

  const answerWrapMatch = /^home-faq-item-\d+-answer-wrap$/.exec(nodeId);
  if (answerWrapMatch) return { rect: { x: 16, y: 60, width: 276, height: COLLAPSED_RESPONSIVE_RECT_SIZE } };

  const answerMatch = /^home-faq-item-\d+-answer$/.exec(nodeId);
  if (answerMatch) return { rect: { x: 0, y: 0, width: 276, height: COLLAPSED_RESPONSIVE_RECT_SIZE } };

  return null;
}

function insightsMobileOverride(nodeId: string): BuilderCanvasViewportOverride | null {
  const itemMatch = /^home-insights-item-(\d+)$/.exec(nodeId);
  if (itemMatch) {
    const index = Number(itemMatch[1]);
    return { rect: { x: 0, y: index * 414, width: 274, height: 414 } };
  }

  const thumbMatch = /^home-insights-item-\d+-thumb$/.exec(nodeId);
  if (thumbMatch) return { rect: { x: 0, y: 0, width: 274, height: 217 } };

  const imageMatch = /^home-insights-item-\d+-image$/.exec(nodeId);
  if (imageMatch) return { rect: { x: 0, y: 0, width: 274, height: 192 } };

  const badgeMatch = /^home-insights-item-\d+-badge$/.exec(nodeId);
  if (badgeMatch) return { rect: { x: 12, y: 174, width: 104, height: 28 } };

  const copyMatch = /^home-insights-item-\d+-copy$/.exec(nodeId);
  if (copyMatch) return { rect: { x: 0, y: 232, width: 274, height: 162 } };

  const metaMatch = /^home-insights-item-\d+-meta$/.exec(nodeId);
  if (metaMatch) return { rect: { x: 0, y: 0, width: 274, height: 44 } };

  const dateMatch = /^home-insights-item-\d+-date$/.exec(nodeId);
  if (dateMatch) return { rect: { x: 0, y: 0, width: 120, height: 20 } };

  const readtimeMatch = /^home-insights-item-\d+-readtime$/.exec(nodeId);
  if (readtimeMatch) return { rect: { x: 196, y: 0, width: 78, height: 20 } };

  const bylineMatch = /^home-insights-item-\d+-byline$/.exec(nodeId);
  if (bylineMatch) return { rect: { x: 0, y: 28, width: 190, height: 21 } };

  const titleMatch = /^home-insights-item-\d+-title$/.exec(nodeId);
  if (titleMatch) return { rect: { x: 0, y: 61, width: 274, height: 48 } };

  const summaryMatch = /^home-insights-item-\d+-summary$/.exec(nodeId);
  if (summaryMatch) return { rect: { x: 0, y: 117, width: 274, height: 47 } };

  return null;
}

function officesMobileOverride(nodeId: string): BuilderCanvasViewportOverride | null {
  const tabMatch = /^home-offices-tab-(\d+)$/.exec(nodeId);
  if (tabMatch) {
    const index = Number(tabMatch[1]);
    return { rect: { x: index * 104, y: 0, width: 96, height: 32 } };
  }

  const layoutMatch = /^home-offices-layout-\d+$/.exec(nodeId);
  if (layoutMatch) return { rect: { x: 0, y: 170, width: 308, height: 652 } };

  const mapMatch = /^home-offices-layout-\d+-map$/.exec(nodeId);
  if (mapMatch) return { rect: { x: 0, y: 0, width: 308, height: 340 } };

  const cardMatch = /^home-offices-layout-\d+-card$/.exec(nodeId);
  if (cardMatch) return { rect: { x: 0, y: 356, width: 308, height: 296 } };

  const labelMatch = /^home-offices-layout-\d+-card-label$/.exec(nodeId);
  if (labelMatch) return { rect: { x: 24, y: 24, width: 120, height: 24 } };

  const titleMatch = /^home-offices-layout-\d+-card-title$/.exec(nodeId);
  if (titleMatch) return { rect: { x: 24, y: 66, width: 260, height: 34 } };

  const addressMatch = /^home-offices-layout-\d+-card-address$/.exec(nodeId);
  if (addressMatch) return { rect: { x: 24, y: 116, width: 260, height: 58 } };

  const phoneMatch = /^home-offices-layout-\d+-card-phone$/.exec(nodeId);
  if (phoneMatch) return { rect: { x: 24, y: 188, width: 220, height: 24 } };

  const faxMatch = /^home-offices-layout-\d+-card-fax$/.exec(nodeId);
  if (faxMatch) return { rect: { x: 24, y: 222, width: 220, height: 24 } };

  const mapLinkMatch = /^home-offices-layout-\d+-card-map-link$/.exec(nodeId);
  if (mapLinkMatch) return { rect: { x: 24, y: 278, width: 260, height: 40 } };

  return null;
}

function statsMobileOverride(nodeId: string): BuilderCanvasViewportOverride | null {
  const cardMatch = /^home-stats-card-(\d+)$/.exec(nodeId);
  if (cardMatch) {
    const index = Number(cardMatch[1]);
    return { rect: { x: 0, y: 20 + (index * 107), width: 308, height: 95 } };
  }

  const numberMatch = /^home-stats-number-\d+$/.exec(nodeId);
  if (numberMatch) return { rect: { x: 24, y: 16, width: 180, height: 38 } };

  const labelMatch = /^home-stats-label-\d+$/.exec(nodeId);
  if (labelMatch) return { rect: { x: 24, y: 56, width: 260, height: 34 } };

  const progressMatch = /^home-stats-progress-\d+$/.exec(nodeId);
  if (progressMatch) return { rect: { x: 24, y: 88, width: 260, height: 1 } };

  const progressBarMatch = /^home-stats-progress-bar-\d+$/.exec(nodeId);
  if (progressBarMatch) return { rect: { x: 0, y: 0, width: 260, height: 1 } };

  return null;
}

function upgradeHomeDecomposedMobileParity(document: BuilderCanvasDocument): BuilderCanvasDocument {
  if (!document.nodes.some((node) => node.id === 'home-insights-root')) return document;

  const mobileOverrides: Record<string, BuilderCanvasViewportOverride> = {
    'home-insights-root': { rect: { x: 16, y: 692, width: 343, height: 2283 } },
    'home-insights-container': { rect: { x: 34, y: 48, width: 308, height: 2187 } },
    'home-insights-label': { rect: { x: 0, y: 8, width: 131, height: 21 } },
    'home-insights-title': { rect: { x: 0, y: 39, width: 308, height: 96 } },
    'home-insights-description': { rect: { x: 0, y: 154, width: 308, height: 54 } },
    'home-insights-divider': { rect: { x: 0, y: 226, width: 308, height: 12 } },
    'home-insights-divider-mark': { rect: { x: 127, y: 0, width: 54, height: 12 } },
    'home-insights-grid': { rect: { x: 0, y: 244, width: 308, height: 1864 } },
    'home-insights-featured': { rect: { x: 0, y: 20, width: 308, height: 473 } },
    'home-insights-featured-media': { rect: { x: 0, y: 0, width: 308, height: 326 } },
    'home-insights-featured-image': { rect: { x: 0, y: 0, width: 308, height: 326 } },
    'home-insights-featured-category': { rect: { x: 16, y: 16, width: 95, height: 31 } },
    'home-insights-featured-body': { rect: { x: 0, y: 327, width: 308, height: 145 } },
    'home-insights-featured-meta': { rect: { x: 18, y: 18, width: 272, height: 44 } },
    'home-insights-featured-date': { rect: { x: 0, y: 0, width: 120, height: 20 } },
    'home-insights-featured-readtime': { rect: { x: 196, y: 0, width: 78, height: 20 } },
    'home-insights-featured-byline': { rect: { x: 18, y: 48, width: 200, height: 21 } },
    'home-insights-featured-title': { rect: { x: 18, y: 80, width: 272, height: 52 } },
    'home-insights-featured-summary': { rect: { x: 18, y: 139, width: 272, height: 47 } },
    'home-insights-featured-link': { rect: { x: 18, y: 205, width: 180, height: 28 } },
    'home-insights-list-wrap': { rect: { x: 0, y: 532, width: 308, height: 1353 } },
    'home-insights-controls': { rect: { x: 17, y: 16, width: 274, height: 46 } },
    'home-insights-prev': { rect: { x: 0, y: 0, width: 54, height: 34 } },
    'home-insights-page-indicator': { rect: { x: 63, y: 6, width: 148, height: 21 } },
    'home-insights-next': { rect: { x: 220, y: 0, width: 54, height: 34 } },
    'home-insights-list': { rect: { x: 17, y: 96, width: 274, height: 1253 } },
    'home-insights-view-all': { rect: { x: 81, y: 2140, width: 145, height: 47 } },

    'home-services-root': { rect: { x: 16, y: 2987, width: 343, height: 1285 } },
    'home-services-container': { rect: { x: 34, y: 49, width: 308, height: 1187 } },
    'home-services-label': { rect: { x: 0, y: 8, width: 132, height: 21 } },
    'home-services-title': { rect: { x: 0, y: 47, width: 308, height: 96 } },
    'home-services-description': { rect: { x: 0, y: 162, width: 308, height: 54 } },
    'home-services-divider': { rect: { x: 0, y: 226, width: 308, height: 12 } },
    'home-services-divider-mark': { rect: { x: 127, y: 0, width: 54, height: 12 } },
    'home-services-list': { rect: { x: 0, y: 244, width: 308, height: 942 } },

    'home-attorney-root': { rect: { x: 16, y: 4284, width: 343, height: 1084 } },
    'home-attorney-image-wrap': { rect: { x: 16, y: 48, width: 343, height: 477 } },
    'home-attorney-image': { rect: { x: 0, y: 0, width: 343, height: 258 } },
    'home-attorney-badge': { rect: { x: 24, y: 360, width: 295, height: 92 } },
    'home-attorney-content': { rect: { x: 16, y: 525, width: 343, height: 510 } },
    'home-attorney-label': { rect: { x: 18, y: 32, width: 180, height: 28 } },
    'home-attorney-title': { rect: { x: 18, y: 76, width: 308, height: 108 } },
    'home-attorney-divider': { rect: { x: 18, y: 200, width: 80, height: 4 } },
    'home-attorney-intro-1': { rect: { x: 18, y: 226, width: 308, height: 58 } },
    'home-attorney-intro-2': { rect: { x: 18, y: 296, width: 308, height: 58 } },
    'home-attorney-summary': { rect: { x: 18, y: 366, width: 308, height: 82 } },
    'home-attorney-contact-line': { rect: { x: 18, y: 462, width: 308, height: 40 } },
    'home-attorney-cta': { rect: { x: 18, y: 526, width: 220, height: 28 } },

    'home-case-results-root': { rect: { x: 16, y: 5380, width: 343, height: 545 } },
    'home-case-results-content': { rect: { x: 1, y: 49, width: 341, height: 447 } },
    'home-case-results-label': { rect: { x: 32, y: 32, width: 279, height: 40 } },
    'home-case-results-title': { rect: { x: 32, y: 82, width: 279, height: 120 } },
    'home-case-results-divider': { rect: { x: 32, y: 212, width: 80, height: 4 } },
    'home-case-results-desc': { rect: { x: 32, y: 232, width: 279, height: 80 } },
    'home-case-results-summary': { rect: { x: 32, y: 322, width: 279, height: 60 } },
    'home-case-results-cta': { rect: { x: 32, y: 392, width: 200, height: 36 } },

    'home-stats-root': { rect: { x: 16, y: 5937, width: 343, height: 773 } },
    'home-stats-container': { rect: { x: 34, y: 49, width: 308, height: 675 } },
    'home-stats-label': { rect: { x: 0, y: 8, width: 180, height: 28 } },
    'home-stats-title': { rect: { x: 0, y: 47, width: 308, height: 120 } },
    'home-stats-description': { rect: { x: 0, y: 187, width: 308, height: 96 } },
    'home-stats-grid': { rect: { x: 0, y: 258, width: 308, height: 417 } },

    'home-faq-root': { rect: { x: 16, y: 6721, width: 343, height: 1644 } },
    'home-faq-container': { rect: { x: 34, y: 48, width: 308, height: 1548 } },
    'home-faq-label': { rect: { x: 0, y: 0, width: 120, height: 28 } },
    'home-faq-title': { rect: { x: 0, y: 40, width: 308, height: 54 } },
    'home-faq-list': { rect: { x: 0, y: 115, width: 308, height: 1433 } },

    'home-offices-root': { rect: { x: 16, y: 8377, width: 343, height: 918 } },
    'home-offices-container': { rect: { x: 34, y: 48, width: 308, height: 822 } },
    'home-offices-label': { rect: { x: 0, y: 8, width: 180, height: 28 } },
    'home-offices-title': { rect: { x: 0, y: 47, width: 308, height: 60 } },
    'home-offices-tabs': { rect: { x: 0, y: 126, width: 308, height: 46 } },

    'home-contact-root': { rect: { x: 16, y: 9307, width: 343, height: 435 } },
    'home-contact-container': { rect: { x: 34, y: 49, width: 308, height: 337 } },
    'home-contact-copy': { rect: { x: 0, y: 0, width: 308, height: 220 } },
    'home-contact-label': { rect: { x: 0, y: 0, width: 200, height: 28 } },
    'home-contact-title': { rect: { x: 0, y: 42, width: 308, height: 96 } },
    'home-contact-description': { rect: { x: 0, y: 162, width: 308, height: 58 } },
    'home-contact-actions': { rect: { x: 0, y: 242, width: 308, height: 100 } },
    'home-contact-primary': { rect: { x: 0, y: 0, width: 180, height: 44 } },
    'home-contact-phone': { rect: { x: 0, y: 56, width: 220, height: 44 } },
  };

  let changed = false;
  const nextNodes = document.nodes.map((node) => {
    const override =
      mobileOverrides[node.id]
      ?? insightsMobileOverride(node.id)
      ?? serviceMobileOverride(node.id)
      ?? statsMobileOverride(node.id)
      ?? faqMobileOverride(node.id)
      ?? officesMobileOverride(node.id);
    if (!override) return node;
    const result = mergeViewportOverride(node, 'mobile', override);
    changed = changed || result.changed;
    return result.node;
  });

  const nextStageHeight = Math.max(document.stageHeight, HOME_MOBILE_STAGE_HEIGHT);
  changed = changed || nextStageHeight !== document.stageHeight;

  if (!changed) return document;
  return {
    ...document,
    stageHeight: nextStageHeight,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+home-mobile-parity`,
    nodes: nextNodes,
  };
}

function upgradeHomeDecomposedTabletParity(document: BuilderCanvasDocument): BuilderCanvasDocument {
  if (!document.nodes.some((node) => node.id === 'home-insights-root')) return document;

  const tabletOverrides: Record<string, BuilderCanvasViewportOverride> = {
    'home-insights-root': { rect: { x: 16, y: 692, width: 736, height: 1680 } },
    'home-insights-container': { rect: { x: 31, y: 92, width: 675, height: 1495 } },
    'home-insights-label': { rect: { x: 0, y: 8, width: 131, height: 21 } },
    'home-insights-title': { rect: { x: 0, y: 39, width: 675, height: 60 } },
    'home-insights-description': { rect: { x: 0, y: 118, width: 675, height: 27 } },
    'home-insights-divider': { rect: { x: 0, y: 185, width: 675, height: 12 } },
    'home-insights-divider-mark': { rect: { x: 310, y: 0, width: 54, height: 12 } },
    'home-insights-grid': { rect: { x: 0, y: 229, width: 675, height: 1188 } },
    'home-insights-featured': { rect: { x: 0, y: 20, width: 675, height: 646 } },
    'home-insights-featured-media': { rect: { x: 0, y: 0, width: 675, height: 420 } },
    'home-insights-featured-image': { rect: { x: 0, y: 0, width: 675, height: 420 } },
    'home-insights-featured-category': { rect: { x: 16, y: 16, width: 95, height: 31 } },
    'home-insights-featured-body': { rect: { x: 0, y: 421, width: 675, height: 223 } },
    'home-insights-featured-meta': { rect: { x: 22, y: 22, width: 629, height: 20 } },
    'home-insights-featured-date': { rect: { x: 0, y: 0, width: 120, height: 20 } },
    'home-insights-featured-readtime': { rect: { x: 612, y: 0, width: 17, height: 20 } },
    'home-insights-featured-byline': { rect: { x: 22, y: 51, width: 200, height: 21 } },
    'home-insights-featured-title': { rect: { x: 22, y: 83, width: 629, height: 33 } },
    'home-insights-featured-summary': { rect: { x: 22, y: 126, width: 629, height: 28 } },
    'home-insights-featured-link': { rect: { x: 22, y: 171, width: 180, height: 28 } },
    'home-insights-list-wrap': { rect: { x: 0, y: 704, width: 675, height: 504 } },
    'home-insights-controls': { rect: { x: 17, y: 16, width: 641, height: 46 } },
    'home-insights-prev': { rect: { x: 0, y: 0, width: 54, height: 34 } },
    'home-insights-page-indicator': { rect: { x: 63, y: 6, width: 514, height: 21 } },
    'home-insights-next': { rect: { x: 587, y: 0, width: 54, height: 34 } },
    'home-insights-list': { rect: { x: 17, y: 65, width: 641, height: 435 } },
    'home-insights-view-all': { rect: { x: 264, y: 1449, width: 145, height: 47 } },

    'home-services-root': { rect: { x: 16, y: 2384, width: 736, height: 1166 } },
    'home-services-container': { rect: { x: 31, y: 92, width: 675, height: 980 } },
    'home-services-label': { rect: { x: 0, y: 8, width: 132, height: 21 } },
    'home-services-title': { rect: { x: 0, y: 47, width: 675, height: 60 } },
    'home-services-description': { rect: { x: 0, y: 126, width: 675, height: 27 } },
    'home-services-divider': { rect: { x: 0, y: 185, width: 675, height: 12 } },
    'home-services-divider-mark': { rect: { x: 310, y: 0, width: 54, height: 12 } },
    'home-services-list': { rect: { x: 0, y: 229, width: 675, height: 750 } },

    'home-attorney-root': { rect: { x: 16, y: 3562, width: 736, height: 1155 } },
    'home-attorney-image-wrap': { rect: { x: 158, y: 92, width: 420, height: 560 } },
    'home-attorney-image': { rect: { x: 0, y: 0, width: 420, height: 560 } },
    'home-attorney-badge': { rect: { x: 24, y: 432, width: 372, height: 92 } },
    'home-attorney-content': { rect: { x: 0, y: 652, width: 736, height: 411 } },
    'home-attorney-label': { rect: { x: 31, y: 32, width: 180, height: 28 } },
    'home-attorney-title': { rect: { x: 31, y: 76, width: 675, height: 96 } },
    'home-attorney-divider': { rect: { x: 31, y: 188, width: 80, height: 4 } },
    'home-attorney-intro-1': { rect: { x: 31, y: 216, width: 675, height: 58 } },
    'home-attorney-intro-2': { rect: { x: 31, y: 286, width: 675, height: 58 } },
    'home-attorney-summary': { rect: { x: 31, y: 356, width: 675, height: 82 } },
    'home-attorney-contact-line': { rect: { x: 31, y: 452, width: 675, height: 40 } },
    'home-attorney-cta': { rect: { x: 31, y: 516, width: 220, height: 28 } },

    'home-case-results-root': { rect: { x: 16, y: 4729, width: 736, height: 631 } },
    'home-case-results-content': { rect: { x: 1, y: 92, width: 734, height: 445 } },
    'home-case-results-label': { rect: { x: 32, y: 32, width: 400, height: 40 } },
    'home-case-results-title': { rect: { x: 32, y: 82, width: 670, height: 120 } },
    'home-case-results-divider': { rect: { x: 32, y: 212, width: 80, height: 4 } },
    'home-case-results-desc': { rect: { x: 32, y: 232, width: 670, height: 80 } },
    'home-case-results-summary': { rect: { x: 32, y: 322, width: 670, height: 60 } },
    'home-case-results-cta': { rect: { x: 32, y: 392, width: 200, height: 36 } },

    'home-stats-root': { rect: { x: 16, y: 5372, width: 736, height: 610 } },
    'home-stats-container': { rect: { x: 31, y: 92, width: 675, height: 424 } },
    'home-stats-label': { rect: { x: 0, y: 8, width: 180, height: 28 } },
    'home-stats-title': { rect: { x: 0, y: 47, width: 675, height: 60 } },
    'home-stats-description': { rect: { x: 0, y: 126, width: 675, height: 64 } },
    'home-stats-grid': { rect: { x: 0, y: 212, width: 675, height: 212 } },

    'home-faq-root': { rect: { x: 16, y: 5994, width: 736, height: 1250 } },
    'home-faq-container': { rect: { x: 31, y: 92, width: 675, height: 1066 } },
    'home-faq-label': { rect: { x: 0, y: 0, width: 120, height: 28 } },
    'home-faq-title': { rect: { x: 0, y: 40, width: 675, height: 54 } },
    'home-faq-list': { rect: { x: 0, y: 126, width: 675, height: 939 } },

    'home-offices-root': { rect: { x: 16, y: 7256, width: 736, height: 1064 } },
    'home-offices-container': { rect: { x: 31, y: 92, width: 675, height: 880 } },
    'home-offices-label': { rect: { x: 0, y: 8, width: 180, height: 28 } },
    'home-offices-title': { rect: { x: 0, y: 47, width: 675, height: 60 } },
    'home-offices-tabs': { rect: { x: 0, y: 126, width: 675, height: 46 } },

    'home-contact-root': { rect: { x: 16, y: 8332, width: 736, height: 419 } },
    'home-contact-container': { rect: { x: 31, y: 92, width: 675, height: 232 } },
    'home-contact-copy': { rect: { x: 0, y: 0, width: 675, height: 153 } },
    'home-contact-label': { rect: { x: 0, y: 0, width: 200, height: 28 } },
    'home-contact-title': { rect: { x: 0, y: 42, width: 675, height: 56 } },
    'home-contact-description': { rect: { x: 0, y: 114, width: 675, height: 58 } },
    'home-contact-actions': { rect: { x: 0, y: 186, width: 675, height: 47 } },
    'home-contact-primary': { rect: { x: 0, y: 0, width: 180, height: 44 } },
    'home-contact-phone': { rect: { x: 194, y: 0, width: 220, height: 44 } },
  };

  let changed = false;
  const nextNodes = document.nodes.map((node) => {
    const override =
      tabletOverrides[node.id]
      ?? insightsTabletOverride(node.id)
      ?? serviceTabletOverride(node.id)
      ?? statsTabletOverride(node.id)
      ?? faqTabletOverride(node.id)
      ?? officesTabletOverride(node.id);
    if (!override) return node;
    const result = mergeViewportOverride(node, 'tablet', override);
    changed = changed || result.changed;
    return result.node;
  });

  const nextStageHeight = Math.max(document.stageHeight, HOME_TABLET_STAGE_HEIGHT);
  changed = changed || nextStageHeight !== document.stageHeight;

  if (!changed) return document;
  return {
    ...document,
    stageHeight: nextStageHeight,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+home-tablet-parity`,
    nodes: nextNodes,
  };
}

function upgradeHeroQuickMenu(document: BuilderCanvasDocument, locale: Locale): BuilderCanvasDocument {
  if (!document.nodes.some((node) => node.id === 'home-hero-root')) return document;
  const seeded = createHomePageCanvasDocument(locale);
  const quickMenuNodes = seeded.nodes.filter((node) => node.id.startsWith('home-hero-quick-menu'));
  if (quickMenuNodes.length === 0) return document;

  const quickMenuNodeById = new Map(quickMenuNodes.map((node) => [node.id, node]));
  let changed = false;
  const labelPatchedNodes = document.nodes.map((node) => {
    if (!/^home-hero-quick-menu-item-\d+$/.test(node.id)) return node;
    const seededNode = quickMenuNodeById.get(node.id);
    if (!seededNode || !('label' in seededNode.content) || typeof seededNode.content.label !== 'string') return node;
    const result = withNodePatch(node, { content: { label: seededNode.content.label } });
    changed = changed || result.changed;
    return result.node;
  });

  if (document.nodes.some((node) => node.id === 'home-hero-quick-menu')) {
    if (!changed) return document;
    return {
      ...document,
      updatedAt: new Date().toISOString(),
      updatedBy: `${document.updatedBy || 'builder'}+hero-quick-menu-labels`,
      nodes: labelPatchedNodes,
    };
  }

  const nextNodes: BuilderCanvasNode[] = [];
  let inserted = false;
  for (const node of labelPatchedNodes) {
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

function upgradeHomeHeroMediaImages(document: BuilderCanvasDocument, locale: Locale): BuilderCanvasDocument {
  if (!document.nodes.some((node) => node.id === 'home-hero-root')) return document;
  if (!document.nodes.some((node) => node.id === 'home-hero-media')) return document;

  const legacySeedSources = new Set([
    '/images/hero-bg-01.webp',
    '/images/hero-taipei-101-blue-hour.webp',
    '/images/hero-taiwan-modern-city-opening.webp',
  ]);
  let changed = false;
  const upgradedNodes = document.nodes.map((node) => {
    if (
      node.kind !== 'image'
      || node.id !== 'home-hero-media-image'
      || node.dataBinding !== undefined
      || !legacySeedSources.has(node.content.src)
    ) {
      return node;
    }
    changed = true;
    return {
      ...node,
      content: {
        ...node.content,
        src: HERO_MEDIA_IMAGE_SOURCES[0],
      },
    };
  });

  const existingIds = new Set(upgradedNodes.map((node) => node.id));
  const seeded = createHomePageCanvasDocument(locale);
  const seededImages = seeded.nodes.filter((node) => HERO_MEDIA_IMAGE_NODE_IDS.includes(node.id));
  const missingImages = seededImages.filter((node) => !existingIds.has(node.id));
  if (missingImages.length === 0 && !changed) return document;

  const nextNodes: BuilderCanvasNode[] = [];
  let inserted = false;
  for (const node of upgradedNodes) {
    nextNodes.push(node);
    if (!inserted && node.id === 'home-hero-media-image') {
      nextNodes.push(...missingImages);
      inserted = true;
    }
  }
  if (!inserted) nextNodes.push(...missingImages);

  return {
    ...document,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+hero-media-images`,
    nodes: nextNodes,
  };
}

function upgradeHomeHeroBoundarySpacing(document: BuilderCanvasDocument): BuilderCanvasDocument {
  const currentRoot = document.nodes.find((node) => node.id === 'home-hero-root');
  if (!currentRoot) return document;

  const oldHeroBottom = currentRoot.rect.y + currentRoot.rect.height;
  const heroHeightDelta = HERO_SECTION_ROOT_HEIGHT - currentRoot.rect.height;
  let changed = false;

  const nextNodes = document.nodes.map((node) => {
    if (node.id === 'home-hero-root' || node.id === 'home-hero-media' || HERO_MEDIA_IMAGE_NODE_IDS.includes(node.id)) {
      const result = withNodePatch(node, {
        rect: {
          ...node.rect,
          height: HERO_SECTION_ROOT_HEIGHT,
        },
      });
      changed = changed || result.changed;
      return result.node;
    }

    if (heroHeightDelta !== 0 && !node.parentId && node.rect.y >= oldHeroBottom - 1) {
      changed = true;
      return {
        ...node,
        rect: {
          ...node.rect,
          y: node.rect.y + heroHeightDelta,
        },
      };
    }

    return node;
  });

  if (!changed) return document;
  return {
    ...document,
    stageHeight: heroHeightDelta !== 0
      ? Math.max(880, document.stageHeight + heroHeightDelta)
      : document.stageHeight,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+hero-boundary`,
    nodes: nextNodes,
  };
}

const HOME_CASE_RESULTS_ID_RENAMES: Record<string, string> = {
  'case-results-root': 'home-case-results-root',
  'case-results-content': 'home-case-results-content',
  'case-results-label': 'home-case-results-label',
  'case-results-title': 'home-case-results-title',
  'case-results-divider': 'home-case-results-divider',
  'case-results-desc': 'home-case-results-desc',
  'case-results-summary': 'home-case-results-summary',
  'case-results-cta': 'home-case-results-cta',
};

function upgradeHomeCaseResultsNodeIds(document: BuilderCanvasDocument): BuilderCanvasDocument {
  const legacyIds = new Set(Object.keys(HOME_CASE_RESULTS_ID_RENAMES));
  if (!document.nodes.some((node) => legacyIds.has(node.id) || (node.parentId && legacyIds.has(node.parentId)))) {
    return document;
  }

  const existingIds = new Set(document.nodes.map((node) => node.id));
  let changed = false;
  const nextNodes = document.nodes.flatMap((node) => {
    const nextId = HOME_CASE_RESULTS_ID_RENAMES[node.id] ?? node.id;
    const nextParentId = node.parentId ? HOME_CASE_RESULTS_ID_RENAMES[node.parentId] ?? node.parentId : node.parentId;
    if (nextId !== node.id && existingIds.has(nextId)) {
      changed = true;
      return [];
    }
    if (nextId === node.id && nextParentId === node.parentId) return [node];
    changed = true;
    return [{
      ...node,
      id: nextId,
      parentId: nextParentId,
    }];
  });

  if (!changed) return document;
  return {
    ...document,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+case-results-ids`,
    nodes: nextNodes,
  };
}

function createHomeInsightsSourceSeed(locale: Locale, sourcePosts: readonly ColumnPost[]): BuilderCanvasDocument {
  const seeded = createHomePageCanvasDocument(locale);
  if (sourcePosts.length === 0) return seeded;

  const seededRoot = seeded.nodes.find((node) => node.id === 'home-insights-root');
  if (!seededRoot) return seeded;

  const sourceNodes = createInsightsDecomposedNodes(seededRoot.rect.y, locale, seededRoot.zIndex, sourcePosts);
  if (sourceNodes.length === 0) return seeded;

  const sourceNodesById = new Map(sourceNodes.map((node) => [node.id, node] as const));
  return {
    ...seeded,
    nodes: seeded.nodes.flatMap((node) => {
      if (!node.id.startsWith('home-insights-')) return [node];
      const replacement = sourceNodesById.get(node.id);
      return replacement ? [replacement] : [];
    }),
  };
}

function upgradeHomeInsightsSource(
  document: BuilderCanvasDocument,
  locale: Locale,
  sourcePosts: readonly ColumnPost[] = [],
): BuilderCanvasDocument {
  if (!document.nodes.some((node) => node.id === 'home-insights-root')) return document;
  const seeded = createHomeInsightsSourceSeed(locale, sourcePosts);
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
    ? INSIGHTS_SECTION_ROOT_HEIGHT - currentRoot.rect.height
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
    ? Math.max(880, document.stageHeight + insightsHeightDelta, currentRootY + INSIGHTS_SECTION_ROOT_HEIGHT + 40)
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
  const currentRoot = document.nodes.find((node) => node.id === 'home-services-root');
  const oldServicesBottom = currentRoot ? currentRoot.rect.y + currentRoot.rect.height : 0;
  const servicesHeightDelta = currentRoot
    ? SERVICES_SECTION_ROOT_HEIGHT - currentRoot.rect.height
    : 0;
  let changed = false;
  const nextNodes = document.nodes.map((node) => {
    if (node.id !== 'home-services-root') {
      if (servicesHeightDelta !== 0 && !node.parentId && node.rect.y >= oldServicesBottom - 1) {
        changed = true;
        return {
          ...node,
          rect: {
            ...node.rect,
            y: node.rect.y + servicesHeightDelta,
          },
        };
      }
      return node;
    }
    const result = withNodePatch(node, {
      rect: {
        ...node.rect,
        height: SERVICES_SECTION_ROOT_HEIGHT,
      },
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
    stageHeight: servicesHeightDelta !== 0
      ? Math.max(880, document.stageHeight + servicesHeightDelta)
      : document.stageHeight,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+services-parity`,
    nodes: nextNodes,
  };
}

function upgradeHomeFaqSection(document: BuilderCanvasDocument, locale: Locale): BuilderCanvasDocument {
  const currentRoot = document.nodes.find((node) => node.id === 'home-faq-root');
  if (!currentRoot) return document;

  const seeded = createHomePageCanvasDocument(locale);
  const seededById = new Map(
    seeded.nodes
      .filter((node) => node.id.startsWith('home-faq-'))
      .map((node) => [node.id, node]),
  );
  const oldFaqBottom = currentRoot.rect.y + currentRoot.rect.height;
  const faqHeightDelta = FAQ_SECTION_ROOT_HEIGHT - currentRoot.rect.height;
  let changed = false;

  const nextNodes = document.nodes.map((node) => {
    const seededNode = seededById.get(node.id);
    if (!seededNode) {
      if (faqHeightDelta !== 0 && !node.parentId && node.rect.y >= oldFaqBottom - 1) {
        changed = true;
        return {
          ...node,
          rect: {
            ...node.rect,
            y: node.rect.y + faqHeightDelta,
          },
        };
      }
      return node;
    }

    if (node.kind !== seededNode.kind) return node;

    const result = withNodePatch(node, {
      rect: seededNode.rect,
      style: seededNode.style,
      content: seededNode.content as Record<string, unknown>,
    });
    changed = changed || result.changed;
    return result.node;
  });

  if (!changed) return document;
  return {
    ...document,
    stageHeight: faqHeightDelta !== 0
      ? Math.max(880, document.stageHeight + faqHeightDelta)
      : document.stageHeight,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+faq-parity`,
    nodes: nextNodes,
  };
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
export default async function BuilderMainPage(
  props: {
    params: Promise<{ locale: string }>;
    searchParams?: Promise<{ pageId?: string; reseed?: string; siteId?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const locale: Locale = normalizeLocale(params.locale);
  const siteId = resolveBuilderSiteIdFromValue(searchParams?.siteId);
  const force = searchParams?.reseed === '1';

  // Try to load from site document (multi-page model). Seeding every request is
  // expensive because it checks each page canvas; only do it when metadata is missing.
  let site = await readSiteDocument(siteId, locale);
  if (force || needsStandardPageSeedForLocale(site.pages, locale)) {
    await seedSitePages(siteId, locale);
    site = await readSiteDocument(siteId, locale);
  }
  const upgradedSite = upgradePublicHeaderNavigation(site);
  if (upgradedSite !== site) {
    site = upgradedSite;
  }
  const visiblePages = projectPagesForLocale(site.pages, locale);
  const appWidgets = listEnabledBuilderAppWidgetsFromInstalled(site.installedApps ?? []);
  const homePage = visiblePages.find((p) => p.isHomePage) || visiblePages[0];
  const requestedPage = searchParams?.pageId
    ? visiblePages.find((page) => page.pageId === searchParams.pageId)
    : null;
  const initialPage = requestedPage ?? homePage;
  const canPersistInitialPageDraft = Boolean(initialPage && initialPage.locale === locale);

  let initialDocument;
  let backend: 'blob' | 'file' = 'blob';
  let initialDraftMeta: DraftMeta | null = null;
  // Record-level updatedBy of the draft as loaded (or as this request rewrote
  // it). Later draft rewrites (parity migrations) must carry it forward — a
  // rewrite that drops the 'admin' marker turns user work back into
  // reseed-eligible state (the 2026-07-02 data-loss path).
  let initialDraftRecordUpdatedBy: string | undefined;

  if (initialPage) {
    let pageCanvasRecord = await readPageCanvasRecord(siteId, initialPage.pageId, 'draft');
    initialDraftRecordUpdatedBy = pageCanvasRecord?.updatedBy;
    initialDraftMeta = draftMetaFromRecord(pageCanvasRecord);
    let pageCanvas = pageCanvasRecord?.document ?? null;
    const isInitialHomePage = initialPage.pageId === homePage?.pageId || Boolean(initialPage.isHomePage);
    if (needsFaqLiveCompositeDraftRepair(initialPage, pageCanvas, initialDraftRecordUpdatedBy)) {
      const seeded = buildFaqCompositePageCanvas(locale);
      pageCanvas = seeded;
      initialDocument = seeded;
      if (canPersistInitialPageDraft) {
        try {
          await writePageCanvas(siteId, initialPage.pageId, 'draft', seeded, {
            updatedBy: SEED_DRAFT_UPDATED_BY,
          });
          pageCanvasRecord = await readPageCanvasRecord(siteId, initialPage.pageId, 'draft');
          initialDraftRecordUpdatedBy = pageCanvasRecord?.updatedBy;
          initialDraftMeta = draftMetaFromRecord(pageCanvasRecord);
        } catch {}
      }
    }
    // Reseed decision must consult the record-level updatedBy ('admin' on every
    // real editor save) — the document-level updatedBy keeps its seed marker
    // forever, so it cannot distinguish a pristine seed from user work.
    const reseedDecision = decideHomeDraftReseed({
      isHomePage: isInitialHomePage,
      force,
      record: pageCanvasRecord,
    });
    const needsReseed = reseedDecision.reseed;

    if (pageCanvas && !needsReseed) {
      initialDocument = prepareEditorCanvasDocument(pageCanvas, locale, isInitialHomePage);
    } else if (needsReseed) {
      const seeded = createHomePageCanvasDocumentComposite(locale);
      initialDocument = seeded;
      if (canPersistInitialPageDraft) {
        try {
          await writePageCanvas(siteId, initialPage.pageId, 'draft', seeded, {
            updatedBy: SEED_DRAFT_UPDATED_BY,
          });
          initialDraftMeta = draftMetaFromRecord(await readPageCanvasRecord(siteId, initialPage.pageId, 'draft'));
          initialDraftRecordUpdatedBy = SEED_DRAFT_UPDATED_BY;
          await publishPage(siteId, initialPage.pageId, locale);
        } catch {
          // Best-effort seed; editor still loads from in-memory doc if write fails
        }
      }
    } else {
      const blank = createBlankCanvasDocument(locale);
      initialDocument = blank;
      if (canPersistInitialPageDraft) {
        try {
          await writePageCanvas(siteId, initialPage.pageId, 'draft', blank, {
            updatedBy: SEED_DRAFT_UPDATED_BY,
          });
          initialDraftMeta = draftMetaFromRecord(await readPageCanvasRecord(siteId, initialPage.pageId, 'draft'));
          initialDraftRecordUpdatedBy = SEED_DRAFT_UPDATED_BY;
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

  const [homeDatasetSnapshot, datasetPosts, faqCategories, faqItems] = await Promise.all([
    readBuilderPageSnapshot('home', 'draft', locale),
    getAllColumnPostsIncludingBlob(locale),
    Promise.resolve(listFaqCategories()),
    listFaqItems({ locale, status: 'published' }),
  ]);

  // These upgrade migrations operate on the editable DECOMPOSED home (keyed by
  // 'home-hero-root' and other decomposed sentinels). A composite live-mirror
  // home (kind=composite sections, no 'home-hero-root') must never run through
  // them — each migration already no-ops via its own node-id guard, but gating
  // the whole pipeline on a decomposed home makes the boundary explicit and is
  // safe against future migrations that forget their guard.
  const canPersistRenderMigration = canPersistHomeDraftRenderMigration(initialDraftRecordUpdatedBy);
  const standardServicesUpgradedInitialDocument = upgradeStandardServicesPageDesktopParity(initialDocument, {
    allowGeometryReset: canPersistRenderMigration,
  });
  const upgradedInitialDocument =
    isHomeCanvasDocument(standardServicesUpgradedInitialDocument)
      ? upgradeHomeEditorLayoutParity(
          upgradeHomeDecomposedMobileParity(
            upgradeHomeDecomposedTabletParity(
              upgradeHomeHeroResponsiveParity(
                upgradeHomeHeroEditorialPolish(
                  upgradeHomeHeroSearchForm(
                    upgradeHeroQuickMenu(
                      upgradeHomeFaqSection(
                        upgradeHomeServicesSection(
                          upgradeHomeOfficesTabbedLayout(
                            upgradeHomeInsightsSource(
                              upgradeHomeCaseResultsNodeIds(
                                upgradeHomeHeroBoundarySpacing(
                                  upgradeHomeHeroMediaImages(upgradeOfficeMapPlaceholders(standardServicesUpgradedInitialDocument), locale),
                                ),
                              ),
                              locale,
                              datasetPosts,
                            ),
                            locale,
                          ),
                        ),
                        locale,
                      ),
                      locale,
                    ),
                    locale,
                  ),
                ),
              ),
            ),
          ),
          locale,
          { stampMetadata: false },
        )
      : standardServicesUpgradedInitialDocument;
  if (
    upgradedInitialDocument !== initialDocument &&
    initialPage &&
    canPersistInitialPageDraft &&
    canPersistRenderMigration
  ) {
    initialDocument = upgradedInitialDocument;
    try {
      // Preserve the record-level updatedBy: this rewrite is a mechanical
      // migration, not a change of authorship. Dropping the marker here would
      // strip 'admin' off user-saved drafts and expose them to factory reseed.
      await writePageCanvas(siteId, initialPage.pageId, 'draft', initialDocument, {
        updatedBy: initialDraftRecordUpdatedBy,
      });
      initialDraftMeta = draftMetaFromRecord(await readPageCanvasRecord(siteId, initialPage.pageId, 'draft'));
    } catch (error) {
      console.error('Failed to persist builder draft render migration', error);
      // Best-effort upgrade; the in-memory editor still receives the map nodes.
    }
  } else {
    initialDocument = upgradedInitialDocument;
  }

  const datasetDocument = initialPage?.dynamicList
    ? buildBuilderDynamicListDatasetDocument(initialPage.dynamicList)
    : initialPage?.dynamicItem
      ? buildBuilderDynamicItemDatasetDocument(initialPage.dynamicItem)
    : homeDatasetSnapshot.snapshot.document ?? {
      pageKey: 'home' as const,
      datasets: createDefaultBuilderPageDatasets('home'),
    };
  const datasetPreviewTargets = readBuilderPageDatasetOverviews(
    'home',
    datasetDocument,
    locale,
    datasetPosts,
    { cmsCollections: site.cmsCollections },
  ).map((overview) => ({
    targetId: overview.targetId,
    title: overview.title,
    collectionId: overview.currentBinding.collectionId,
    mode: overview.currentBinding.mode,
    filters: overview.currentBinding.filters ?? [],
    sort: overview.currentBinding.sort ?? [],
    limit: overview.currentBinding.limit,
    records: overview.sampleRecords,
  }));

  return (
    <SandboxPage
      locale={locale}
      siteId={siteId}
      backend={backend}
      initialDocument={initialDocument}
      initialDraftMeta={initialDraftMeta}
      datasetPreviewTargets={datasetPreviewTargets}
      initialPageId={initialPage?.pageId}
      siteName={resolveBuilderSiteName(site, locale)}
      siteSettings={site.settings}
      siteTheme={site.theme}
      navItems={site.navigation || []}
      currentSlug={initialPage?.slug || ''}
      sitePages={visiblePages}
      columnPosts={datasetPosts}
      faqCategories={faqCategories}
      faqItems={faqItems}
      siteLightboxes={site.lightboxes ?? []}
      sitePopups={site.popups ?? []}
      appWidgets={appWidgets}
    />
  );
}
