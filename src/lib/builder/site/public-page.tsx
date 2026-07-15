// allow: SIZE_OK - pre-existing public page renderer; legacy composites share published dataset preload wiring here.
import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import {
  readFooterCanvas,
  readHeaderCanvas,
  readLightboxCanvas,
  readSiteDocument,
} from '@/lib/builder/site/persistence';
import { readBuilderPageSnapshot } from '@/lib/builder/persistence';
import { readPublishedPageCanvas } from '@/lib/builder/site/published-canvas';
import { getComponent } from '@/lib/builder/components/registry';
import { buildGoogleFontsUrl } from '@/lib/builder/canvas/fonts';
import { buildChildrenMap, resolveCanvasNodeAbsoluteRect } from '@/lib/builder/canvas/tree';
import type {
  BuilderCanvasNode,
  BuilderCanvasDocument,
} from '@/lib/builder/canvas/types';
import { isContainerLikeKind, isTextShapedKind } from '@/lib/builder/canvas/types';
import { buildPublishedResponsiveStylesheet } from '@/lib/builder/site/responsive-stylesheet';
import {
  computeTopLevelFlowSectionMetrics,
  compareTopLevelStacking,
  isCollapsedServicesAccordionDetailNode,
  isTopLevelFlowSection,
} from '@/lib/builder/canvas/flow';
import type {
  BuilderLightbox,
  BuilderNavItem,
  BuilderPopup,
  BuilderCookieConsent,
  BuilderPageMeta,
  BuilderSiteDocument,
  BuilderTheme,
} from '@/lib/builder/site/types';
import {
  THEME_COLOR_TOKENS,
  buildCustomColorCssVars,
  buildHoverTransform,
  collectThemeFontFamilies,
  createDarkColorsFromLight,
  resolveBuilderBrandAssetUrl,
  resolveBackgroundStyle,
  resolveThemeColor,
} from '@/lib/builder/site/theme';
import { buildPageSeo } from '@/lib/builder/seo/seo-model';
import {
  isPublishedDynamicItemRecordRoutable,
  resolvePublishedDynamicItemRecordJsonLd,
  resolvePublishedDynamicItemRecordSeo,
} from '@/lib/builder/site/published-dynamic-item-seo';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateLegalServiceSchema,
  generateLocalBusinessSchema,
  generateOrganizationSchema,
} from '@/lib/builder/seo/schema-org';
import {
  buildCustomStructuredDataPayloads,
  buildStructuredDataPayloadsAsync,
} from '@/lib/builder/seo/structured-data';
import { mergeSeoWithDefaults, mergeStructuredDataSettings } from '@/lib/builder/seo/defaults';
import { normalizeStructuredDataSettings } from '@/lib/builder/seo/validation';
import { linkValueFromLegacy, sanitizeLinkValue } from '@/lib/builder/links';
import {
  deriveHeuristicAnimation,
  deriveHeuristicHoverStyle,
} from '@/lib/builder/site/heuristic-defaults';
import { buildPublishedSurfaceFrame } from '@/lib/builder/site/published-node-frame';
import { getHomeSectionTemplateMetadata } from '@/lib/builder/canvas/section-templates';
import { getSiteUrl } from '@/lib/seo';
import { buildSitePagePath, comparableSitePath, normalizeSiteHref } from '@/lib/builder/site/paths';
import { resolveBuilderSiteSettings } from '@/lib/builder/site/localized-settings';
import { filterNavigationForLocale } from '@/lib/builder/site/navigation';
import { findPageMetaForLocaleWithDynamicContext } from '@/lib/builder/site/page-resolution';
import { isStandardPageSlug } from '@/lib/builder/site/standard-pages';
import {
  normalizeHeaderFooterMobileConfig,
  normalizeMobileBottomBar,
} from '@/lib/builder/site/mobile-schema';
import JsonLd from '@/components/JsonLd';
import SiteHeader from '@/components/builder/published/SiteHeader';
import SiteFooter from '@/components/builder/published/SiteFooter';
import MobileBottomBar from '@/components/builder/published/MobileBottomBar';
import AnimationsRoot from '@/components/builder/published/AnimationsRoot';
import PublishedInteractions from '@/components/builder/published/PublishedInteractions';
import DarkModeToggle from '@/components/builder/published/DarkModeToggle';
import LightboxMount from '@/components/builder/published/LightboxMount';
import LightboxOverlay from '@/components/builder/published/LightboxOverlay';
import PopupMount from '@/components/builder/published/PopupMount';
import PopupOverlay from '@/components/builder/published/PopupOverlay';
import CookieConsentBanner from '@/components/builder/published/CookieConsentBanner';
import CookieConsentMount from '@/components/builder/published/CookieConsentMount';
import PageTransitionWrapper from '@/components/builder/published/PageTransitionWrapper';
import SiteSearchEnhancer from '@/components/builder/published/SiteSearchEnhancer';
import AppRuntimeLoader from '@/components/builder/published/AppRuntimeLoader';
import ExperimentVariantSwap from '@/components/builder/published/ExperimentVariantSwap';
import LiveChatWidget from '@/components/builder/published/LiveChatWidget';
import {
  buildPublishedAnimationStyle,
  getPublishedAnimationAttributes,
} from '@/lib/builder/animations/animation-render';
import { resolveBuilderAppWidgetRuntimeForNode } from '@/lib/builder/apps/widgets';
import { resolveLiveChatSettings } from '@/lib/builder/live-chat/app-settings';
import '@/lib/builder/components/registry';
import {
  applyBuilderDatasetBindingToNode,
  resolveBuilderDatasetBindingRecordCount,
  type BuilderDatasetFieldBindingContext,
} from '@/lib/builder/dataset-field-binding';
import {
  createDefaultBuilderPageDatasets,
  readBuilderPageDatasetOverviews,
  type BuilderDataBindingPreviewTarget,
} from '@/lib/builder/datasets';
import { DynamicListVisitorControls } from '@/lib/builder/site/DynamicListVisitorControls';
import { resolveDynamicListPublishedContentHeight } from '@/lib/builder/site/published-dynamic-list-layout';
import { resolvePublishedDynamicListRuntime } from '@/lib/builder/site/published-dynamic-list-runtime';
import { buildBuilderDynamicListDatasetDocument } from '@/lib/builder/dynamic-list-pages';
import { buildBuilderDynamicItemDatasetDocument } from '@/lib/builder/dynamic-item-pages';
import type { BuilderPageDocument } from '@/lib/builder/types';
import { projectImageNodeForLocale } from '@/lib/builder/translations/locale-media';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import { getAllColumnPosts, type ColumnPost } from '@/lib/columns';
import {
  faqItemsToSchemaItems,
  listFaqCategories,
  listFaqItems,
  type BuilderFaqCategory,
  type BuilderFaqItem,
} from '@/lib/builder/faq/faq-engine';

interface ResolvedLightbox {
  meta: BuilderLightbox;
  canvas: BuilderCanvasDocument;
}

export interface ResolvedPublishedSitePage {
  locale: Locale;
  slugPath: string;
  site: BuilderSiteDocument;
  pageMeta: BuilderPageMeta;
  canvas: BuilderCanvasDocument;
  lightboxes: ResolvedLightbox[];
  popups: BuilderPopup[];
  cookieConsent: BuilderCookieConsent | null;
  headerCanvas: BuilderCanvasDocument | null;
  footerCanvas: BuilderCanvasDocument | null;
  datasetDocument?: Pick<BuilderPageDocument, 'pageKey' | 'datasets'>;
  datasetPreviewTargets?: BuilderDataBindingPreviewTarget[];
  columnPosts: ColumnPost[];
  faqCategories: BuilderFaqCategory[];
  faqItems: BuilderFaqItem[];
  dynamicItemRecordSlug?: string;
}

type ParentLayoutMode = 'absolute' | 'flex' | 'grid';
type ResolvedDarkModeConfig = Required<NonNullable<BuilderSiteDocument['darkMode']>>;

function resolveDarkModeConfig(config: BuilderSiteDocument['darkMode']): ResolvedDarkModeConfig {
  const defaultMode = config?.defaultMode === 'dark' || config?.defaultMode === 'auto'
    ? config.defaultMode
    : 'light';
  return {
    defaultMode,
    allowVisitorToggle: config?.allowVisitorToggle !== false,
  };
}

function buildThemeInitScript(
  defaultMode: ResolvedDarkModeConfig['defaultMode'],
  allowVisitorToggle: boolean,
): string {
  const safeMode = defaultMode === 'dark' ? 'dark' : 'light';
  return `(function(){try{var saved=${allowVisitorToggle ? "localStorage.getItem('builder-theme')" : 'null'};if(saved!=='light'&&saved!=='dark'){saved=null;}var defaultMode='${defaultMode}';var prefersDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var theme=saved||(defaultMode==='auto'?(prefersDark?'dark':'light'):defaultMode);document.documentElement.dataset.theme=theme;}catch(e){document.documentElement.dataset.theme='${safeMode}';}})();`;
}

export async function resolvePublishedSitePage(
  locale: Locale,
  slugPath: string,
): Promise<ResolvedPublishedSitePage | null> {
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, locale);
  const pageMatch = findPageMetaForLocaleWithDynamicContext(site.pages, locale, slugPath);
  if (!pageMatch?.page.publishedAt) return null;
  const pageMeta = pageMatch.page;
  // EN has no translated builder content yet: projecting the ko default-locale
  // document onto /en would serve Korean to English visitors. Keep /en on the
  // legacy static-English fallback until real EN documents exist.
  if (locale === 'en' && pageMeta.locale !== 'en') return null;
  if (
    pageMeta.dynamicItem
    && pageMatch.dynamicItemRecordSlug
    && !isPublishedDynamicItemRecordRoutable({
      dynamicItem: pageMeta.dynamicItem,
      locale,
      recordSlug: pageMatch.dynamicItemRecordSlug,
      site,
    })
  ) {
    return null;
  }

  const canvas = await readPublishedPageCanvas(pageMeta);
  if (!canvas?.nodes?.length) return null;
  const compositeKeys = new Set(canvas.nodes.flatMap((node) => (
    node.kind === 'composite' ? [node.content.componentKey] : []
  )));
  const isHomePage = slugPath === '' || pageMeta.isHomePage === true;
  const isColumnsArchivePage = slugPath === 'columns';
  const hasFaqExplorerComposite = compositeKeys.has('legacy-page-faq');
  const hasColumnArchivePostConsumer =
    isHomePage ||
    isColumnsArchivePage ||
    compositeKeys.has('insights-archive') ||
    compositeKeys.has('legacy-page-columns');
  const hasVideosColumnCounter = compositeKeys.has('legacy-page-videos');

  const allLightboxes = (site.lightboxes ?? []).filter((lb) => lb.locale === locale);
  const lightboxes: ResolvedLightbox[] = [];
  for (const meta of allLightboxes) {
    const lbCanvas = await readLightboxCanvas(DEFAULT_BUILDER_SITE_ID, meta.id);
    if (lbCanvas) {
      lightboxes.push({ meta, canvas: lbCanvas });
    }
  }

  // Global header/footer canvases — only render when present and non-empty.
  // Otherwise the legacy SiteHeader/SiteFooter components are used as fallback.
  const [headerCanvas, footerCanvas, homeDatasetSnapshot, datasetPosts, faqCategories, faqItems] = await Promise.all([
    readHeaderCanvas(DEFAULT_BUILDER_SITE_ID),
    readFooterCanvas(DEFAULT_BUILDER_SITE_ID),
    readBuilderPageSnapshot('home', 'published', locale).catch(() => null),
    hasColumnArchivePostConsumer
      ? getAllColumnPostsIncludingBlob(locale)
      : Promise.resolve(hasVideosColumnCounter ? getAllColumnPosts(locale) : []),
    hasFaqExplorerComposite ? Promise.resolve(listFaqCategories()) : Promise.resolve([]),
    hasFaqExplorerComposite ? listFaqItems({ locale, status: 'published' }) : Promise.resolve([]),
  ]);

  const popups = (site.popups ?? []).filter((p) => p.locale === locale && p.active);
  const cookieConsent = site.cookieConsent && site.cookieConsent.enabled && site.cookieConsent.locale === locale
    ? site.cookieConsent
    : null;
  const datasetDocument = pageMeta.dynamicList
    ? buildBuilderDynamicListDatasetDocument(pageMeta.dynamicList)
    : pageMeta.dynamicItem
      ? buildBuilderDynamicItemDatasetDocument(pageMeta.dynamicItem, pageMatch?.dynamicItemRecordSlug)
    : homeDatasetSnapshot?.snapshot.document ?? {
      pageKey: 'home' as const,
      datasets: createDefaultBuilderPageDatasets('home'),
    };
  const datasetPreviewTargets = datasetDocument.pageKey === 'home'
    ? readBuilderPageDatasetOverviews('home', datasetDocument, locale, datasetPosts, site).map((overview) => ({
      targetId: overview.targetId,
      title: overview.title,
      collectionId: overview.currentBinding.collectionId,
      mode: overview.currentBinding.mode,
      filters: overview.currentBinding.filters ?? [],
      sort: overview.currentBinding.sort ?? [],
      limit: overview.currentBinding.limit,
      records: overview.sampleRecords,
    }))
    : [];

  return {
    locale,
    slugPath,
    site,
    pageMeta,
    canvas,
    lightboxes,
    popups,
    cookieConsent,
    headerCanvas: headerCanvas && headerCanvas.nodes.length > 0 ? headerCanvas : null,
    footerCanvas: footerCanvas && footerCanvas.nodes.length > 0 ? footerCanvas : null,
    datasetDocument,
    datasetPreviewTargets,
    columnPosts: datasetPosts,
    faqCategories,
    faqItems,
    dynamicItemRecordSlug: pageMatch?.dynamicItemRecordSlug,
  };
}

function resolveAbsoluteSeoUrl(siteUrl: string, value: string): string {
  if (!value) return value;
  if (/^https?:\/\//i.test(value)) return value;
  const base = siteUrl.replace(/\/+$/, '');
  const path = value.startsWith('/') ? value : `/${value}`;
  return `${base}${path}`;
}

export async function buildPublishedSitePageMetadata(
  locale: Locale,
  slugPath: string,
): Promise<Metadata | null> {
  const resolved = await resolvePublishedSitePage(locale, slugPath);
  if (!resolved) return null;

  const siteUrl = getSiteUrl();
  const seoData = buildPageSeo(resolved.pageMeta, siteUrl, locale, resolved.site.pages, resolved.site);

  const dynamicItem = resolved.pageMeta.dynamicItem;
  if (dynamicItem && resolved.dynamicItemRecordSlug) {
    const recordSeo = resolvePublishedDynamicItemRecordSeo({
      dynamicItem,
      locale,
      recordSlug: resolved.dynamicItemRecordSlug,
      site: resolved.site,
      slugPath: resolved.slugPath,
    });
    if (recordSeo) {
      const canonical = resolveAbsoluteSeoUrl(siteUrl, recordSeo.canonicalPath);
      seoData.title = recordSeo.title;
      seoData.description = recordSeo.description;
      seoData.canonical = canonical;
      seoData.ogTitle = recordSeo.title;
      seoData.ogDescription = recordSeo.description;
      seoData.twitterTitle = recordSeo.title;
      seoData.twitterDescription = recordSeo.description;
      if (recordSeo.image) {
        seoData.ogImage = recordSeo.image;
        seoData.twitterImage = recordSeo.image;
      }
      if (recordSeo.noIndex) {
        seoData.noIndex = true;
      }
    }
  }

  const settings = resolved.site.settings;
  const favicon = resolveBuilderBrandAssetUrl(settings?.assets?.faviconAssetId) ?? settings?.favicon;
  const siteOgImage = resolveBuilderBrandAssetUrl(settings?.assets?.ogImageAssetId) ?? settings?.ogImage;
  // Absolute default so every page always emits an og:image/twitter:image —
  // otherwise social crawlers (LINE/KakaoTalk/Facebook/X, which don't run JS)
  // render link previews with no image. The declared twitter:card is
  // summary_large_image, so a wide hero asset is the right fallback.
  const DEFAULT_SOCIAL_IMAGE = resolveAbsoluteSeoUrl(siteUrl, '/images/header-skyline-ratio.webp');
  const ogImage = (seoData.ogImage ? (resolveBuilderBrandAssetUrl(seoData.ogImage) ?? seoData.ogImage) : siteOgImage) || DEFAULT_SOCIAL_IMAGE;
  const twitterImage = seoData.twitterImage
    ? (resolveBuilderBrandAssetUrl(seoData.twitterImage) ?? seoData.twitterImage)
    : ogImage;
  const languages: Record<string, string> = {};

  for (const alt of seoData.hreflang) {
    languages[alt.hreflang] = alt.href;
  }
  const otherMeta: Record<string, string> = {};
  for (const tag of seoData.additionalMetaTags) {
    const name = tag.name.trim();
    const content = tag.content.trim();
    if (name && content) otherMeta[name] = content;
  }

  return {
    title: seoData.title,
    description: seoData.description,
    openGraph: {
      type: 'website',
      url: seoData.canonical,
      title: seoData.ogTitle,
      description: seoData.ogDescription,
      images: ogImage ? [ogImage] : [],
      siteName: settings?.firmName || resolved.site.name,
    },
    twitter: {
      card: seoData.twitterCard,
      title: seoData.twitterTitle,
      description: seoData.twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
    icons: favicon ? { icon: [favicon] } : undefined,
    robots: {
      index: !seoData.noIndex,
      follow: !seoData.noFollow,
    },
    alternates: {
      canonical: seoData.canonical,
      languages,
    },
    other: Object.keys(otherMeta).length > 0 ? otherMeta : undefined,
  };
}

export async function PublishedSitePageView({
  resolved,
  searchParams,
}: {
  resolved: ResolvedPublishedSitePage;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { site, canvas, locale, slugPath } = resolved;
  const datasetDocument = resolved.datasetDocument ?? {
    pageKey: 'home' as const,
    datasets: createDefaultBuilderPageDatasets('home'),
  };
  const datasetPreviewTargets = resolved.datasetPreviewTargets ?? [];
  const dynamicListRuntime = resolvePublishedDynamicListRuntime({
    datasetDocument,
    dynamicList: resolved.pageMeta.dynamicList,
    locale,
    searchParams,
    site,
    slugPath,
  });
  const dynamicListConfig = dynamicListRuntime.config;
  const datasetBindingContext = dynamicListRuntime.bindingContext;
  const dynamicListSlice = dynamicListRuntime.slice;
  const usedFonts = new Set<string>();

  for (const node of canvas.nodes) {
    const content = node.content as Record<string, unknown>;
    if (typeof content.fontFamily === 'string' && content.fontFamily !== 'system-ui') {
      usedFonts.add(content.fontFamily);
    }
  }

  for (const family of collectThemeFontFamilies(site.theme)) {
    usedFonts.add(family);
  }

  const fontsUrl = buildGoogleFontsUrl([...usedFonts]);
  const navItems = filterNavigationForLocale(site.navigation || [], locale, {
    pages: site.pages,
    publishedOnly: true,
  });
  const settings = resolveBuilderSiteSettings(site.settings, locale);
  const liveChatSettings = resolveLiveChatSettings(site.installedApps, settings?.liveChatWidgetEnabled, locale);
  const theme = site.theme;
  const headerFooterConfig = normalizeHeaderFooterMobileConfig(site.headerFooter);
  const mobileBottomBar = normalizeMobileBottomBar(site.mobileBottomBar, settings);
  const darkModeConfig = resolveDarkModeConfig(site.darkMode);
  const useLegacyPublicChrome = isStandardPageSlug(slugPath)
    && !resolved.headerCanvas
    && !resolved.footerCanvas;
  const useBuilderChrome = !useLegacyPublicChrome;
  const requiresMidBandStageScale =
    (locale === 'zh-hant' && slugPath === '') ||
    slugPath === 'privacy' ||
    slugPath === 'disclaimer' ||
    (locale === 'zh-hant' && slugPath === 'services');
  const allowPublishedThemeToggle = useBuilderChrome && darkModeConfig.allowVisitorToggle;
  const themeInitScript = buildThemeInitScript(darkModeConfig.defaultMode, allowPublishedThemeToggle);
  const darkColors = theme.darkColors ?? createDarkColorsFromLight(theme.colors);
  const cssVarColors: BuilderTheme['colors'] = {
    primary: 'var(--builder-color-primary)',
    secondary: 'var(--builder-color-secondary)',
    accent: 'var(--builder-color-accent)',
    background: 'var(--builder-color-background)',
    text: 'var(--builder-color-text)',
    muted: 'var(--builder-color-muted)',
  };
  const publishedTheme: BuilderTheme = {
    ...theme,
    colors: cssVarColors,
    darkColors: cssVarColors,
  };
  const lightCssVars = THEME_COLOR_TOKENS
    .map((token) => `--builder-color-${token}: ${theme.colors[token]};`)
    .join('\n          ');
  const darkCssVars = THEME_COLOR_TOKENS
    .map((token) => `--builder-color-${token}: ${darkColors[token]};`)
    .join('\n          ');
  // Brand kit custom palette colors — emitted as `--builder-custom-color-<i>`.
  // These supplement the fixed theme tokens and stay constant across light/dark
  // (no automatic dark derivation), so they only need to be declared once on
  // :root and cascade into both themes.
  const customColorCssVars = buildCustomColorCssVars(settings?.brand?.customColors);
  const visibleNodes = canvas.nodes.filter((node) => node.visible !== false);
  const responsiveStylesheet = buildPublishedResponsiveStylesheet(canvas.nodes);
  const childrenMap = buildChildrenMap(visibleNodes);
  const nodesById = new Map(canvas.nodes.map((node) => [node.id, node]));
  const siteUrl = getSiteUrl();
  const mergedSeo = mergeSeoWithDefaults({
    page: resolved.pageMeta,
    site,
    siteUrl,
    locale,
  });
  const structuredSettings = normalizeStructuredDataSettings(mergeStructuredDataSettings(resolved.pageMeta, site));
  const legalServiceSchema = structuredSettings.legalService
    ? generateLegalServiceSchema(settings || {}, siteUrl)
    : null;
  const organizationSchema = structuredSettings.organization
    ? generateOrganizationSchema(settings || {}, siteUrl)
    : null;
  const localBusinessSchema = structuredSettings.localBusiness
    ? generateLocalBusinessSchema(settings || {}, siteUrl)
    : null;
  const pagePath = buildSitePagePath(locale, slugPath);
  const breadcrumbSchema = structuredSettings.breadcrumbList
    ? generateBreadcrumbSchema([
        { name: site.name || 'Home', url: `${siteUrl}/${locale}` },
        {
          name: resolved.pageMeta.title?.[locale] || slugPath || site.name || 'Page',
          url: `${siteUrl}${pagePath}`,
        },
      ])
    : null;
  const structuredDataPayloads = await buildStructuredDataPayloadsAsync(canvas, {
    includeFaqPage: structuredSettings.faqPage !== 'off',
    locale,
  });
  const customStructuredDataPayloads = buildCustomStructuredDataPayloads(mergedSeo.structuredDataBlocks);
  const faqExplorerSchemaItems = structuredSettings.faqPage !== 'off'
    ? faqItemsToSchemaItems(resolved.faqItems)
    : [];
  const faqExplorerSchema = faqExplorerSchemaItems.length > 0
    ? generateFAQSchema(faqExplorerSchemaItems)
    : null;

  const dynamicItemMeta = resolved.pageMeta.dynamicItem;
  const recordJsonLd = dynamicItemMeta && resolved.dynamicItemRecordSlug
    ? resolvePublishedDynamicItemRecordJsonLd({
        dynamicItem: dynamicItemMeta,
        locale,
        recordSlug: resolved.dynamicItemRecordSlug,
        site,
        siteUrl,
        slugPath,
      })
    : null;
  const topLevelNodes = visibleNodes.filter((node) => !node.parentId);
  const hasTopLevelComposite = topLevelNodes.some(isTopLevelFlowSection);
  const flowSectionMetrics = computeTopLevelFlowSectionMetrics(visibleNodes);

  // Desktop safety net: pin each top-level flow section's min-height via
  // CSS !important so the designer-intended height survives even when
  // client-side hydration/dynamic-list re-rendering strips the inline
  // min-height (observed on home-services-root / home-faq-root). Scoped to
  // desktop (min-width:1024) so the responsive tablet/mobile stylesheet
  // (narrower breakpoints) still overrides on smaller viewports.
  const desktopFlowSectionMinHeightCss = [...flowSectionMetrics.entries()]
    .filter(([, metric]) => Boolean(metric) && metric.minHeight > 0)
    .map(([id, metric]) => `[data-node-id="${id}"]{min-height:${metric.minHeight}px !important}`)
    .join('\n');

  // Render composites first (they participate in document flow with
  // computed margin-top), then absolute non-composites on top. Without
  // this, a non-composite widget placed between two composite sections
  // (e.g. a site-search bar in a gap) ended up partially covered by the
  // next composite because later DOM siblings stack above earlier ones
  // when z-indexes match. The comparator is shared with the editor stage
  // (CanvasStageNodes) via flow.compareTopLevelStacking so the two cannot
  // drift apart.
  const renderedTopLevelNodes = [...topLevelNodes].sort(compareTopLevelStacking);
  const dynamicListPublishedContentHeight = dynamicListConfig && dynamicListSlice
    ? resolveDynamicListPublishedContentHeight({
        childrenMap,
        nodes: visibleNodes,
        nodesById,
        recordCount: dynamicListSlice.items.length,
        targetId: dynamicListConfig.targetId,
      })
    : 0;
  const publishedContentHeight = visibleNodes.reduce((maxHeight, node) => {
    if (isCollapsedServicesAccordionDetailNode(node)) return maxHeight;
    const absoluteRect = resolveCanvasNodeAbsoluteRect(node, nodesById);
    return Math.max(maxHeight, absoluteRect.y + absoluteRect.height);
  }, Math.max(canvas.stageHeight, dynamicListPublishedContentHeight));

  // Office location tabs: mirror the editor's officeLayoutDisplay gate
  // (CanvasNode.tsx). The designer marks the initially-active tab via the
  // `active` class (decompose-offices.ts bakes `tab-button active` on index 0).
  // Only that layout renders on first paint; PublishedInteractions.tsx toggles
  // the active layout on tab click. Without this gate all three office layouts
  // render together and overlap (they share the same rect.y inside
  // home-offices-container). Data is left untouched.
  const initialActiveOfficeIndex = (() => {
    for (const candidate of visibleNodes) {
      const match = /^home-offices-tab-(\d+)$/.exec(candidate.id);
      if (!match) continue;
      const className = (candidate.content as { className?: string }).className ?? '';
      if (/(?:^|\s)active(?:\s|$)/.test(className)) {
        return Number(match[1]);
      }
    }
    return 0;
  })();

  function renderPublishedNode(
    node: BuilderCanvasNode,
    isTopLevel = false,
    parentLayoutMode?: ParentLayoutMode,
    bindingContext: BuilderDatasetFieldBindingContext = datasetBindingContext,
  ): JSX.Element {
    const localeProjectedNode = projectImageNodeForLocale(node, locale);
    const renderedNode = applyBuilderDatasetBindingToNode(localeProjectedNode, bindingContext);
    const component = getComponent(renderedNode.kind);
    const childNodes = (childrenMap[renderedNode.id] ?? [])
      .map((childId) => nodesById.get(childId))
      .filter((child): child is BuilderCanvasNode => Boolean(child && child.visible !== false));
    const flowAsSection = isTopLevel && isTopLevelFlowSection(renderedNode);
    const parentUsesFlowLayout = parentLayoutMode === 'flex' || parentLayoutMode === 'grid';
    const useFlowWrapper = flowAsSection || parentUsesFlowLayout;
    const childParentLayoutMode: ParentLayoutMode | undefined =
      isContainerLikeKind(renderedNode.kind)
        ? ((renderedNode.content as { layoutMode?: ParentLayoutMode }).layoutMode ?? 'absolute')
        : undefined;
    const flowSectionMetric = flowAsSection ? flowSectionMetrics.get(renderedNode.id) : undefined;
    const stickyConfig = renderedNode.sticky;
    const useSticky = Boolean(stickyConfig) && !useFlowWrapper;
    const baseTransform = renderedNode.rotation ? `rotate(${renderedNode.rotation}deg)` : undefined;
    const backgroundStyle = resolveBackgroundStyle(renderedNode.style?.backgroundColor, publishedTheme);
    const hoverStyle = deriveHeuristicHoverStyle(renderedNode);
    const effectiveAnimation = deriveHeuristicAnimation(renderedNode);
    const hoverBackgroundStyle = hoverStyle?.backgroundColor
      ? resolveBackgroundStyle(hoverStyle.backgroundColor, publishedTheme)
      : undefined;
    const hoverShadowBlur = hoverStyle?.shadowBlur ?? renderedNode.style?.shadowBlur ?? 0;
    const hoverShadowSpread = hoverStyle?.shadowSpread ?? renderedNode.style?.shadowSpread ?? 0;
    const hoverShadowColor = hoverStyle?.shadowColor ?? renderedNode.style?.shadowColor;
    const hoverBoxShadow = hoverStyle && (hoverShadowBlur > 0 || hoverShadowSpread !== 0 || renderedNode.style?.shadowX || renderedNode.style?.shadowY)
      ? `${renderedNode.style?.shadowX || 0}px ${renderedNode.style?.shadowY || 0}px ${hoverShadowBlur}px ${hoverShadowSpread}px ${resolveThemeColor(hoverShadowColor, publishedTheme)}`
      : undefined;
    const hoverTransform = buildHoverTransform(hoverStyle, baseTransform ?? '');
    const hoverDuration = `${hoverStyle?.transitionMs ?? 180}ms`;
    const animationAttributes = getPublishedAnimationAttributes(effectiveAnimation);
    const animationStyle = buildPublishedAnimationStyle({
      animation: effectiveAnimation,
      baseTransform,
      baseOpacity: renderedNode.style?.opacity != null ? renderedNode.style.opacity / 100 : 1,
      primaryColor: 'var(--builder-color-primary, #3b82f6)',
    });
    const sectionTemplate = getHomeSectionTemplateMetadata(renderedNode);

    // Published office-tab gate: hide every office layout except the initially
    // active one (mirrors editor officeLayoutDisplay). The active layout keeps
    // its natural display so `.office-layout { display: grid }` wins; inactive
    // layouts get an inline `display:none`. PublishedInteractions.tsx owns the
    // runtime toggle on tab click.
    const officeLayoutMatch = /^home-offices-layout-(\d+)$/.exec(renderedNode.id);
    const officeLayoutDisplay =
      officeLayoutMatch && Number(officeLayoutMatch[1]) !== initialActiveOfficeIndex
        ? 'none'
        : undefined;

    // Lightbox trigger detection: button with href starting with `lightbox:`
    let lightboxTarget: string | undefined;
    if (renderedNode.kind === 'button') {
      const link = sanitizeLinkValue(linkValueFromLegacy(renderedNode.content));
      if (link?.href.startsWith('lightbox:')) {
        lightboxTarget = link.href.slice('lightbox:'.length).trim();
      }
    }

    const isRepeaterTemplate =
      renderedNode.kind === 'container'
      && renderedNode.content.layoutMode === 'repeater'
      && Boolean(renderedNode.dataBinding)
      && childNodes.length > 0;
    const isDynamicListRepeater =
      Boolean(dynamicListConfig)
      && renderedNode.dataBinding?.targetId === dynamicListConfig?.targetId
      && Boolean(dynamicListSlice);
    const repeaterRecordCount = isRepeaterTemplate && renderedNode.dataBinding
      ? isDynamicListRepeater
        ? dynamicListSlice?.items.length ?? 0
        : resolveBuilderDatasetBindingRecordCount(bindingContext, renderedNode.dataBinding, 12)
      : 0;
    const repeaterTemplateHeight = childNodes.reduce((height, child) => (
      Math.max(height, child.rect.y + child.rect.height)
    ), 0);
    const repeaterTemplateWidth = childNodes.reduce((width, child) => (
      Math.max(width, child.rect.x + child.rect.width)
    ), 0);
    const appRuntime = resolveBuilderAppWidgetRuntimeForNode(renderedNode, site.installedApps ?? []);
    const canRenderAppWidget = !appRuntime || appRuntime.status === 'enabled';
    const compositeDatasetProps = renderedNode.kind === 'composite'
      ? {
        datasetPreviewTargets,
        columnPosts: resolved.columnPosts,
        faqCategories: resolved.faqCategories,
        faqItems: resolved.faqItems,
        searchParams,
      }
      : {};
    const renderedChildren = isRepeaterTemplate && repeaterRecordCount > 0
      ? Array.from({ length: repeaterRecordCount }, (_, recordIndex) => {
          const recordKey = `${renderedNode.id}__record-${recordIndex + 1}`;
          const recordIndexOverride = isDynamicListRepeater && dynamicListRuntime.pagination
            ? dynamicListRuntime.pagination.offset + recordIndex
            : recordIndex;
          return (
            <div
              key={recordKey}
              className="builder-pub-repeater-item"
              data-builder-repeater-item="true"
              data-builder-repeater-record-index={recordIndex}
              style={{
                position: 'relative',
                flex: `1 1 ${Math.max(220, repeaterTemplateWidth)}px`,
                minWidth: Math.min(Math.max(220, repeaterTemplateWidth), Math.max(220, renderedNode.rect.width)),
                minHeight: Math.max(1, repeaterTemplateHeight),
              }}
            >
              {childNodes.map((child) => renderPublishedNode(
                {
                  ...child,
                  id: `${child.id}__record-${recordIndex + 1}`,
                  parentId: recordKey,
                },
                false,
                undefined,
                {
                  ...bindingContext,
                  recordIndexOverride,
                },
              ))}
            </div>
          );
        })
      : isRepeaterTemplate
        ? dynamicListRuntime.hasFilteredEmptyState
          ? [
              <div
                key={`${renderedNode.id}__filtered-empty`}
                className="builder-pub-repeater-empty"
                data-builder-dynamic-list-empty-state="true"
                role="status"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  width: '100%',
                  minHeight: Math.max(72, Math.min(180, repeaterTemplateHeight || renderedNode.rect.height)),
                  padding: 16,
                  border: '1px dashed rgba(148, 163, 184, 0.55)',
                  borderRadius: 12,
                  background: 'rgba(248, 250, 252, 0.74)',
                  color: 'rgba(71, 85, 105, 0.92)',
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: 'center',
                }}
                >
                  <span>{locale === 'ko' ? '현재 필터에 맞는 항목이 없습니다.' : 'No matching items.'}</span>
                  {dynamicListRuntime.filterSummary.length > 0 ? (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      {dynamicListRuntime.filterSummary.map((summary) => (
                        <a
                          key={summary.label}
                          href={summary.href}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            minHeight: 26,
                            padding: '3px 10px',
                            borderRadius: 999,
                            background: 'rgba(15,23,42,.06)',
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'inherit',
                            textDecoration: 'none',
                          }}
                        >
                          {summary.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                  <a
                    href={dynamicListRuntime.pagePath}
                    style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    minHeight: 32,
                    padding: '6px 12px',
                    borderRadius: 999,
                    border: '1px solid rgba(15,23,42,.12)',
                    background: 'rgba(255,255,255,.9)',
                    color: 'var(--builder-color-text)',
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {locale === 'ko' ? '필터 지우기' : 'Clear filters'}
                </a>
              </div>,
            ]
          : [
              <div
                key={`${renderedNode.id}__empty`}
                className="builder-pub-repeater-empty"
                data-builder-repeater-empty="true"
                role="status"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  minHeight: Math.max(72, Math.min(180, repeaterTemplateHeight || renderedNode.rect.height)),
                  padding: 16,
                  border: '1px dashed rgba(148, 163, 184, 0.55)',
                  borderRadius: 12,
                  background: 'rgba(248, 250, 252, 0.74)',
                  color: 'rgba(71, 85, 105, 0.92)',
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                {locale === 'ko' ? '표시할 항목이 없습니다.' : 'No items available.'}
              </div>,
            ]
        : childNodes.map((child) => renderPublishedNode(child, false, childParentLayoutMode, bindingContext));

    return (
      <div
        key={renderedNode.id}
        id={renderedNode.anchorName ? renderedNode.anchorName : undefined}
        className="builder-pub-node"
        data-node-id={renderedNode.id}
        data-parent-node-id={renderedNode.parentId}
        data-builder-flow-section={flowAsSection ? 'true' : undefined}
        data-builder-sticky={useSticky ? 'true' : undefined}
        data-builder-section-template={sectionTemplate?.id}
        data-section-variant={sectionTemplate?.variant}
        data-anchor={renderedNode.anchorName ? renderedNode.anchorName : undefined}
        data-builder-hover={hoverStyle ? 'true' : undefined}
        data-lightbox-target={lightboxTarget || undefined}
        data-builder-app-widget={appRuntime?.id}
        data-builder-app-runtime={appRuntime?.status}
        data-builder-app-runtime-status={appRuntime?.status}
        data-builder-app-status={appRuntime?.status}
        data-builder-app-id={appRuntime?.appId}
        data-builder-app-widget-id={appRuntime?.widgetId}
        data-builder-app-component={appRuntime?.component}
        data-builder-app-instance-id={appRuntime ? renderedNode.id : undefined}
        {...animationAttributes}
        role={lightboxTarget ? 'button' : undefined}
        tabIndex={lightboxTarget ? 0 : undefined}
        style={{
          position: useSticky ? 'sticky' : useFlowWrapper ? 'relative' : 'absolute',
          left: useSticky || useFlowWrapper ? undefined : renderedNode.rect.x,
          top: useSticky
            ? (stickyConfig?.from !== 'bottom' ? (stickyConfig?.offset ?? 0) : undefined)
            : useFlowWrapper ? undefined : renderedNode.rect.y,
          bottom: useSticky && stickyConfig?.from === 'bottom' ? (stickyConfig?.offset ?? 0) : undefined,
          width: flowAsSection ? '100%' : renderedNode.rect.width,
          height: flowAsSection
            ? 'auto'
            : isTextShapedKind(renderedNode.kind)
              ? 'auto'
              : renderedNode.rect.height,
          // Use the designer's rect.height as a floor for flow composites and
          // text-shaped widgets; content can grow without clipping.
          minHeight: flowAsSection
            ? (flowSectionMetric?.minHeight ?? renderedNode.rect.height)
            : isTextShapedKind(renderedNode.kind)
              ? renderedNode.rect.height
              : undefined,
          // Always emit marginTop (even 0) for flow composites so the CSS
          // fallback at globals.css:19245 never silently injects a clamp gap
          // when the designer intended adjacent sections.
          marginTop: flowAsSection ? (flowSectionMetric?.marginTop ?? 0) : undefined,
          zIndex: useSticky
            ? Math.max(renderedNode.zIndex, 100)
            : useFlowWrapper
              ? undefined
              // Top-level absolute widgets between flow composites need
              // a positive baseline z-index so a composite's relative
              // stacking context doesn't end up covering them.
              : isTopLevel
                ? Math.max(renderedNode.zIndex, 1)
                : renderedNode.zIndex,
          overflow: flowAsSection ? 'visible' : undefined,
          display: officeLayoutDisplay,
          transform: baseTransform,
          ...backgroundStyle,
          borderRadius: renderedNode.style?.borderRadius ? `${renderedNode.style.borderRadius}px` : undefined,
          border: renderedNode.style?.borderWidth
            ? `${renderedNode.style.borderWidth}px ${renderedNode.style.borderStyle || 'solid'} ${resolveThemeColor(renderedNode.style.borderColor, publishedTheme)}`
            : undefined,
          boxShadow: renderedNode.style?.shadowBlur
            ? `${renderedNode.style.shadowX || 0}px ${renderedNode.style.shadowY || 0}px ${renderedNode.style.shadowBlur}px ${renderedNode.style.shadowSpread || 0}px ${resolveThemeColor(renderedNode.style.shadowColor, publishedTheme)}`
            : undefined,
          opacity: renderedNode.style?.opacity != null ? renderedNode.style.opacity / 100 : undefined,
          transition: hoverStyle
            ? `background ${hoverDuration} cubic-bezier(0.16, 1, 0.3, 1), border-color ${hoverDuration} cubic-bezier(0.16, 1, 0.3, 1), box-shadow ${hoverDuration} cubic-bezier(0.16, 1, 0.3, 1), transform ${hoverDuration} cubic-bezier(0.16, 1, 0.3, 1)`
            : undefined,
          ['--builder-hover-background' as string]: hoverBackgroundStyle?.background,
          ['--builder-hover-border-color' as string]: hoverStyle?.borderColor
            ? resolveThemeColor(hoverStyle.borderColor, publishedTheme)
            : undefined,
          ['--builder-hover-box-shadow' as string]: hoverBoxShadow,
          ['--builder-hover-transform' as string]: hoverTransform,
          ...animationStyle,
        }}
      >
        {appRuntime && !canRenderAppWidget ? (
          <>
            <div
              data-builder-app-runtime-placeholder="true"
              aria-label={locale === 'ko' ? '기능을 일시적으로 사용할 수 없습니다.' : 'Feature unavailable'}
              style={{
                width: '100%',
                height: '100%',
                minHeight: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 12,
                color: 'rgba(100, 116, 139, 0.82)',
                fontSize: '0.875rem',
                fontWeight: 600,
                textAlign: 'center',
                background: 'rgba(248, 250, 252, 0.72)',
                border: '1px dashed rgba(148, 163, 184, 0.5)',
                borderRadius: 10,
              }}
            >
              {locale === 'ko' ? '이 기능은 일시적으로 사용할 수 없습니다.' : 'This feature is temporarily unavailable.'}
            </div>
            {renderedChildren}
          </>
        ) : component ? (
          isContainerLikeKind(renderedNode.kind) ? (
            <component.Render
              node={renderedNode}
              mode="published"
              theme={publishedTheme}
              locale={locale}
              {...compositeDatasetProps}
            >
              {renderedChildren}
            </component.Render>
          ) : (
            <>
              <component.Render
                node={renderedNode}
                mode="published"
                theme={publishedTheme}
                locale={locale}
                {...compositeDatasetProps}
              />
              {renderedChildren}
            </>
          )
        ) : (
          <>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                fontSize: '0.85rem',
              }}
            >
              {renderedNode.kind}
            </div>
            {renderedChildren}
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <script
        id="builder-theme-init"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: themeInitScript }}
      />
      {useBuilderChrome ? <div data-builder-published-page="true" style={{ display: 'none' }} /> : null}
      {fontsUrl && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href={fontsUrl} />
        </>
      )}
      {(() => {
        const heroImage = canvas.nodes
          .filter((node) => node.kind === 'image' && node.visible !== false)
          .sort((a, b) => a.zIndex - b.zIndex)[0];
        const renderedHeroImage = heroImage
          ? applyBuilderDatasetBindingToNode(heroImage, datasetBindingContext)
          : null;
        const src = renderedHeroImage ? (renderedHeroImage.content as { src?: string }).src : null;
        return src && !src.includes('placeholder') ? (
          <link rel="preload" as="image" href={src} />
        ) : null;
      })()}
      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth; }
        :root {
          color-scheme: light;
          ${lightCssVars}
          ${customColorCssVars}
        }
        :root[data-theme='dark'] {
          color-scheme: dark;
          ${darkCssVars}
        }
        :root[data-theme='dark'] body {
          background: var(--builder-color-background);
          color: var(--builder-color-text);
          transition: background 200ms ease, color 200ms ease;
        }
        :target {
          scroll-margin-top: 80px;
        }
        .builder-pub-node[data-lightbox-target] {
          cursor: pointer;
        }
        .builder-pub-node[data-anchor^='mobile-parity-home-'] {
          display: none !important;
        }
        .builder-pub-node[data-builder-hover='true']:hover {
          background: var(--builder-hover-background) !important;
          border-color: var(--builder-hover-border-color) !important;
          box-shadow: var(--builder-hover-box-shadow) !important;
          transform: var(--builder-hover-transform) !important;
        }
        .builder-pub-main {
          padding-top: 0 !important;
        }
        .builder-pub-node[data-node-id='home-hero-root'],
        .builder-pub-node[data-node-id='home-hero'] {
          margin-top: calc(var(--header-offset-desktop) * -1) !important;
          padding-top: var(--header-offset-desktop);
        }
        .builder-pub-node[data-node-id='home-hero-quick-menu'] {
          display: none;
        }
        .builder-pub-node[data-node-id='home-hero-search-wrap']:hover [data-node-id='home-hero-quick-menu'],
        .builder-pub-node[data-node-id='home-hero-search-wrap']:focus-within [data-node-id='home-hero-quick-menu'] {
          display: block;
        }
        .builder-pub-node[data-node-id='home-hero']:has(.hero-search-dropdown-wrap:focus-within),
        .builder-pub-node[data-node-id='home-hero']:has(.hero-quick-menu),
        .builder-pub-node[data-node-id='home-hero-root']:has([data-node-id='home-hero-search-wrap']:hover),
        .builder-pub-node[data-node-id='home-hero-root']:has([data-node-id='home-hero-search-wrap']:focus-within) {
          z-index: 1000 !important;
        }
        .builder-pub-node[data-node-id='home-hero-root'] + .builder-pub-node[data-builder-flow-section='true'] .section,
        .builder-pub-node[data-node-id='home-hero'] + .builder-pub-node[data-builder-flow-section='true'] .section {
          padding-top: clamp(3.2rem, 7.2vw, 5rem);
        }
        /*
         * The legacy pricing page styles .pricing-disclaimer as a narrow,
         * auto-centered text block (max-width:680px; margin:auto). When the
         * builder decompose reuses that class on a container node, the inner
         * wrapper is the offset parent for an absolutely-positioned full-width
         * child text node — so the marketing max-width/margin shrinks and shifts
         * the wrapper, pushing the child past the viewport and forcing a
         * horizontal scrollbar. Neutralize the marketing width/margin only when
         * the class renders inside the published builder (never on the legacy
         * page, which has no .builder-pub-node ancestor); text-align:center and
         * the .pricing-disclaimer p typography are preserved. Margin is also
         * reset because builder nodes already encode the vertical spacing in
         * their rects; replaying the marketing margin pushes absolute children
         * into the CTA below.
         */
        .builder-pub-node .pricing-disclaimer {
          max-width: none;
          margin: 0;
        }
        .builder-pub-node .pricing-cta {
          margin: 0;
        }
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='elevated'] .services-detail-card,
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='elevated'] .faq-item,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='elevated'] .insights-featured,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='elevated'] .insights-list-wrap,
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='elevated'] .office-card {
          border-color: var(--border-medium);
          background: var(--bg-white);
          box-shadow: 0 18px 48px color-mix(in srgb, var(--primary) 14%, transparent);
        }
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='floating'] .services-detail-card,
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='floating'] .faq-item,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='floating'] .insights-featured,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='floating'] .insights-list-wrap,
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='floating'] .office-card {
          border-color: var(--accent-purple-border);
          border-radius: 20px;
          background: var(--bg-white);
          box-shadow: 0 24px 64px color-mix(in srgb, var(--accent-purple) 16%, transparent);
        }
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='glass'] .services-detail-card,
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='glass'] .faq-item,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='glass'] .insights-featured,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='glass'] .insights-list-wrap,
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='glass'] .office-card {
          border-color: color-mix(in srgb, var(--bg-white) 72%, transparent);
          background: color-mix(in srgb, var(--bg-white) 82%, transparent);
          box-shadow: 0 24px 80px color-mix(in srgb, var(--primary) 14%, transparent);
          backdrop-filter: blur(14px);
        }
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='split'] .services-detail-card,
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='split'] .faq-item,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='split'] .insights-featured,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='split'] .insights-list-wrap,
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='split'] .office-card {
          border-left: 4px solid var(--primary);
          background: linear-gradient(90deg, color-mix(in srgb, var(--primary) 7%, var(--bg-white)) 0%, var(--bg-white) 48%);
          box-shadow: 0 16px 42px color-mix(in srgb, var(--primary) 10%, transparent);
        }
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='editorial'] .services-detail-card,
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='editorial'] .faq-item,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='editorial'] .insights-featured,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='editorial'] .insights-list-wrap,
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='editorial'] .office-card {
          border-color: transparent transparent var(--border-medium);
          border-radius: 0;
          background: var(--bg-white);
          box-shadow: none;
        }
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='compact'] .services-detail-card,
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='compact'] .faq-item,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='compact'] .insights-featured,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='compact'] .insights-list-wrap,
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='compact'] .office-card {
          border-color: var(--border-light);
          border-radius: 8px;
          background: color-mix(in srgb, var(--bg-off-white) 72%, var(--bg-white));
          box-shadow: none;
        }
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='spotlight'] [data-node-id='home-services-card-0'] .services-detail-card,
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='spotlight'] [data-node-id='home-faq-item-0'] .faq-item,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='spotlight'] .insights-featured,
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='spotlight'] .office-card {
          border-color: var(--primary);
          background: color-mix(in srgb, var(--primary) 9%, var(--bg-white));
          box-shadow: 0 22px 58px color-mix(in srgb, var(--primary) 16%, transparent);
        }
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='outline'] .services-detail-card,
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='outline'] .faq-item,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='outline'] .insights-featured,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='outline'] .insights-list-wrap,
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='outline'] .office-card {
          border-color: var(--border-medium);
          border-style: dashed;
          border-radius: 6px;
          background: transparent;
          box-shadow: none;
        }
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='timeline'] .services-detail-card,
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='timeline'] .faq-item,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='timeline'] .insights-featured,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='timeline'] .insights-list-wrap,
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='timeline'] .office-card {
          border-color: var(--border-medium);
          border-radius: 14px;
          background: var(--bg-white);
          box-shadow: 0 12px 34px color-mix(in srgb, var(--primary) 10%, transparent);
        }
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='timeline'] .service-icon,
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='timeline'] .faq-question {
          box-shadow: -16px 0 0 color-mix(in srgb, var(--primary) 28%, transparent);
        }
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='soft'] .services-detail-card,
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='soft'] .faq-item,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='soft'] .insights-featured,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='soft'] .insights-list-wrap,
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='soft'] .office-card {
          border-color: transparent;
          border-radius: 16px;
          background: color-mix(in srgb, var(--bg-off-white) 84%, var(--bg-white));
          box-shadow: 0 10px 30px color-mix(in srgb, var(--primary) 6%, transparent);
        }
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='contrast'] .services-detail-card,
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='contrast'] .faq-item,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='contrast'] .insights-featured,
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='contrast'] .insights-list-wrap,
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='contrast'] .office-card {
          border-color: color-mix(in srgb, var(--primary) 75%, var(--bg-dark));
          background: var(--primary);
          color: var(--bg-white);
          box-shadow: 0 22px 58px color-mix(in srgb, var(--bg-dark) 20%, transparent);
        }
        .builder-pub-node[data-section-variant='contrast'] .services-detail-card *,
        .builder-pub-node[data-section-variant='contrast'] .faq-item *,
        .builder-pub-node[data-section-variant='contrast'] .insights-featured *,
        .builder-pub-node[data-section-variant='contrast'] .insights-list-wrap *,
        .builder-pub-node[data-section-variant='contrast'] .office-card * {
          color: var(--bg-white) !important;
        }
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='floating'] .tab-button,
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='glass'] .tab-button,
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='floating'] .service-icon,
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='glass'] .service-icon {
          border-radius: 999px;
        }
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='glass'] [data-node-id='home-services-card-1'],
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='glass'] [data-node-id='home-services-card-3'],
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='glass'] [data-node-id='home-services-card-5'] {
          left: 28px !important;
          width: 1108px !important;
        }
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='floating'] [data-node-id='home-services-card-0'],
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='floating'] [data-node-id='home-services-card-2'],
        .builder-pub-node[data-builder-section-template='services'][data-section-variant='floating'] [data-node-id='home-services-card-4'] {
          left: 18px !important;
          width: 1094px !important;
        }
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='elevated'] [data-node-id='home-faq-item-1'],
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='elevated'] [data-node-id='home-faq-item-3'],
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='elevated'] [data-node-id='home-faq-item-5'],
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='glass'] [data-node-id='home-faq-item-1'],
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='glass'] [data-node-id='home-faq-item-3'],
        .builder-pub-node[data-builder-section-template='faq'][data-section-variant='glass'] [data-node-id='home-faq-item-5'] {
          left: 36px !important;
          width: 1100px !important;
        }
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='floating'] [data-node-id='home-insights-featured'] {
          left: 516px !important;
        }
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='floating'] [data-node-id='home-insights-list-wrap'] {
          left: 0 !important;
        }
        .builder-pub-node[data-builder-section-template='insights'][data-section-variant='glass'] [data-node-id='home-insights-list-wrap'] {
          left: 578px !important;
          top: 46px !important;
        }
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='floating'] [data-node-id^='home-offices-layout-'][data-node-id$='-map'] {
          left: 476px !important;
        }
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='floating'] [data-node-id^='home-offices-layout-'][data-node-id$='-card'] {
          left: 0 !important;
        }
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='glass'] [data-node-id^='home-offices-layout-'][data-node-id$='-map'] {
          width: 1136px !important;
        }
        .builder-pub-node[data-builder-section-template='offices'][data-section-variant='glass'] [data-node-id^='home-offices-layout-'][data-node-id$='-card'] {
          left: 48px !important;
          top: 48px !important;
          width: 420px !important;
          height: 324px !important;
        }
        @media (max-width: 768px) {
          .builder-pub-main {
            position: static !important;
            box-sizing: border-box !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 0 16px !important;
            gap: 0 !important;
            min-height: auto !important;
          }
          .builder-pub-main[data-builder-chrome='true'] {
            padding-top: 72px !important;
          }
          .builder-pub-node {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            height: auto !important;
            min-height: 60px;
          }
          .builder-pub-node[data-node-id^='page-pricing-card-'][data-node-id$='-icon-svg'] {
            height: 40px !important;
            min-height: 0 !important;
          }
          .builder-pub-node[data-node-id='page-pricing-cta-wrap'] {
            height: 47px !important;
            min-height: 47px !important;
          }
          .builder-pub-node[data-node-id$='-page-header-root'] {
            height: 310px !important;
            min-height: 310px !important;
          }
          .builder-pub-node[data-node-id$='-page-header-container'] {
            height: 230px !important;
            min-height: 0 !important;
          }
          .builder-pub-node[data-node-id$='-breadcrumb'] {
            height: 23px !important;
            min-height: 0 !important;
          }
          .builder-pub-node[data-node-id$='-page-header-label'] {
            height: 22px !important;
            min-height: 0 !important;
          }
          .builder-pub-node[data-node-id$='-page-header-title'] {
            height: 36px !important;
            min-height: 36px !important;
          }
          .builder-pub-node[data-node-id$='-page-header-description'] {
            height: 27px !important;
            min-height: 27px !important;
          }
          .builder-pub-node[data-node-id$='-page-header-divider'],
          .builder-pub-node[data-node-id$='-page-header-divider-ornament'] {
            height: 12px !important;
            min-height: 0 !important;
          }
          .builder-pub-node[data-builder-flow-section='true'] {
            margin-top: 0 !important;
            min-height: auto !important;
          }
          .builder-pub-node[data-node-id='home-hero-root'] + .builder-pub-node[data-builder-flow-section='true'] .section,
          .builder-pub-node[data-node-id='home-hero'] + .builder-pub-node[data-builder-flow-section='true'] .section {
            padding-top: clamp(2.8rem, 8vw, 4rem);
          }
          .builder-pub-node img {
            position: relative !important;
            width: 100% !important;
            height: auto !important;
          }
          .builder-pub-main > .builder-pub-node {
            width: auto !important;
            max-width: 100% !important;
          }
          .builder-pub-node[data-node-id='home-hero-root'],
          .builder-pub-node[data-node-id='home-hero'] {
            overflow: hidden !important;
            min-height: clamp(560px, 78vh, 680px) !important;
          }
          .builder-pub-node[data-node-id='home-hero-media'],
          .builder-pub-node[data-node-id^='home-hero-media-image'] {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
          .builder-pub-node[data-node-id^='home-hero-media-image'] .builder-image-media-frame,
          .builder-pub-node[data-node-id^='home-hero-media-image'] img {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover;
          }
          .builder-pub-node[data-node-id='home-hero-inner'] {
            position: absolute !important;
            left: 24px !important;
            right: 24px !important;
            top: 118px !important;
            width: auto !important;
            height: auto !important;
          }
          .builder-pub-node[data-node-id='home-hero-copy'] {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 18px !important;
            width: 100% !important;
            height: auto !important;
          }
          .builder-pub-node[data-node-id='home-hero-label'],
          .builder-pub-node[data-node-id='home-hero-title'],
          .builder-pub-node[data-node-id='home-hero-subtitle'],
          .builder-pub-node[data-node-id='home-hero-links'],
          .builder-pub-node[data-node-id='home-hero-columns-link'] {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
          }
          .builder-pub-node[data-node-id='home-hero-search-wrapper'] {
            position: absolute !important;
            left: 24px !important;
            right: 24px !important;
            top: auto !important;
            bottom: 28px !important;
            width: auto !important;
            height: auto !important;
            transform: none !important;
          }
          .builder-pub-node[data-node-id='home-hero-search-container'],
          .builder-pub-node[data-node-id='home-hero-search-wrap'],
          .builder-pub-node[data-node-id='home-hero-search-bar'] {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
          }
          .builder-pub-node[data-node-id='home-hero-search-bar'] form,
          .builder-pub-node[data-node-id='home-hero-search-bar'] .hero-search-bar {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .builder-pub-node[data-node-id='home-hero-search-input'] {
            flex: 1 1 auto !important;
            width: auto !important;
            min-width: 0 !important;
            height: auto !important;
          }
          .builder-pub-node[data-node-id='home-hero-search-input'] input,
          .builder-pub-node[data-node-id='home-hero-search-input'] .hero-search-input {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .builder-pub-node[data-node-id='home-hero-search-button'] {
            flex: 0 0 auto !important;
            width: 56px !important;
            height: 56px !important;
          }
          .builder-pub-node[data-node-id='home-hero-quick-menu'] {
            left: 0 !important;
            top: calc(100% + 8px) !important;
            width: 100% !important;
            max-height: min(318px, calc(100vh - 220px));
            overflow: auto;
          }
          .builder-pub-node[data-node-id^='home-hero-quick-menu-item-'] {
            width: 100% !important;
          }
          .builder-pub-node[data-node-id='home-hero-scroll-arrow'] {
            display: none !important;
          }
          .builder-pub-repeater-item > .builder-pub-node[data-node-id^='dynamic-list-card-button'] {
            width: min(100%, 148px) !important;
            min-height: 42px;
          }
          .builder-pub-node[data-builder-section-template][data-builder-section-template] [data-node-id^='home-services-card-'][data-node-id],
          .builder-pub-node[data-builder-section-template][data-builder-section-template] [data-node-id^='home-faq-item-'][data-node-id],
          .builder-pub-node[data-builder-section-template][data-builder-section-template] [data-node-id='home-insights-featured'][data-node-id],
          .builder-pub-node[data-builder-section-template][data-builder-section-template] [data-node-id='home-insights-list-wrap'][data-node-id],
          .builder-pub-node[data-builder-section-template][data-builder-section-template] [data-node-id^='home-offices-layout-'][data-node-id] {
            position: relative !important;
            left: auto !important;
            right: auto !important;
            top: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
          }
        }
      ` }} />
      {desktopFlowSectionMinHeightCss ? (
        <style data-builder-flow-section-desktop="true" dangerouslySetInnerHTML={{ __html: `@media (min-width:1024px){\n${desktopFlowSectionMinHeightCss}\n}` }} />
      ) : null}
      {responsiveStylesheet ? (
        // Per-node viewport overrides — emitted last so they win over the
        // generic mobile fallback above. Each node's tablet/mobile rect or
        // hidden flag becomes a `[data-node-id="..."]` rule inside @media.
        <style data-builder-responsive="true" dangerouslySetInnerHTML={{ __html: responsiveStylesheet }} />
      ) : null}
      {/* r2 overflow follow-up (verified 2026-07-03 via Playwright at 375/768/1280).
          Emitted after the responsive stylesheet so it overrides the per-node
          tablet/mobile overrides that replay desktop coordinates on these section
          children (stats/insights/offices/attorney). Specificity is intentionally
          raised (.builder-pub-main prefix / node-scoped) so the rules survive the
          client-side re-emission that otherwise lets equal-specificity (0,2,0)
          generic-block rules win after hydration. Does NOT alter the desktop
          min-height safety net or the .builder-pub-main padding-top:0 rule. */}
      <style data-builder-r2-overflow="true" dangerouslySetInnerHTML={{ __html: `
        .builder-pub-node[data-node-id='home-hero-search-wrapper'] .hero-search-wrapper {
          left: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        @media (min-width: 1024px) {
          .builder-pub-node[data-node-id='home-case-results-content'] {
            left: -1px !important;
          }
        }
        .builder-pub-node .reveal-stagger > * {
          opacity: 1;
        }
        .builder-pub-main .builder-pub-node[data-anchor^='mobile-parity-standalone-'] {
          display: none !important;
        }
        .builder-pub-main .builder-pub-node[data-anchor^='desktop-parity-standalone-'] {
          display: none !important;
        }
        /* Legacy-composite page roots carry a fixed 1280px inline width; on
           769–1279px viewports (iPad landscape, small laptops) that forced a
           256px horizontal scroll (measured at 1024px on faq/columns/about).
           The wrapped legacy component is fluid, so capping to the viewport
           renders it exactly like the original responsive page. */
        @media (min-width: 769px) and (max-width: 1279px) {
          .builder-pub-main > .builder-pub-node[data-node-id$='-page-root'],
          .builder-pub-main .builder-pub-node[data-node-id$='-page-root-composite'] {
            width: 100% !important;
            max-width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          /* NOTE (T16): decomposed 1280-stage routes are handled by the
             route-scoped scale block below. Keep using full-stage scaling here;
             measured partial per-node caps and overflow clipping both broke
             content parity at 1024px. */
        }
        ${requiresMidBandStageScale ? `
        /* T16: these decomposed routes own a fixed 1280px absolute layout with
           NO responsive rects for the 769-1279px band, so they scroll
           horizontally there (measured 205-256px). The prior attempt used
           transform scale with calc((100vw - 2px) / 1280px) — a dead no-op:
           calc(length / length) is invalid in scale() so the var was empty AND
           transform only shrinks VISUALLY (the 1280 layout box still drives
           scrollWidth). CSS zoom shrinks the LAYOUT box (collapsing height too),
           so it actually removes the overflow. It cannot take a vw-proportional
           value in CSS (same length/length wall), so it is stepped: each step's
           zoom = lowerBound/1280, which guarantees content within the viewport
           across the whole step (<=64px right gutter, far better than a
           horizontal scroll). Scoped to these routes; >=1280 and <=768 are
           untouched. Verified by
           tests/builder-editor/public-standard-midband-overflow.playwright.ts
           (document overflow <=2px at 1024px). */
        @media (min-width: 769px) and (max-width: 1279px) {
          .builder-pub-main {
            width: 1280px !important;
            max-width: none !important;
            min-height: 0 !important;
          }
        }
        @media (min-width: 1216px) and (max-width: 1279px) { .builder-pub-main { zoom: 0.95; } }
        @media (min-width: 1152px) and (max-width: 1215px) { .builder-pub-main { zoom: 0.90; } }
        @media (min-width: 1088px) and (max-width: 1151px) { .builder-pub-main { zoom: 0.85; } }
        @media (min-width: 1024px) and (max-width: 1087px) { .builder-pub-main { zoom: 0.80; } }
        @media (min-width: 960px)  and (max-width: 1023px) { .builder-pub-main { zoom: 0.75; } }
        @media (min-width: 896px)  and (max-width: 959px)  { .builder-pub-main { zoom: 0.70; } }
        @media (min-width: 832px)  and (max-width: 895px)  { .builder-pub-main { zoom: 0.65; } }
        @media (min-width: 769px)  and (max-width: 831px)  { .builder-pub-main { zoom: 0.60; } }
        ` : ''}
        ${locale === 'zh-hant' && !slugPath ? `
        /* ≥1360px the case-results H2 grows ~21px taller (viewport-scaled
           type) and invades the fixed-position body paragraph by ~10px.
           The body's measured published inline top is 356px (NOT the
           document rect y of 200 — it is positioned inside split-content);
           push it to 380px on wide viewports only. 1280, the parity
           baseline, is untouched. */
        @media (min-width: 1360px) {
          .builder-pub-main .builder-pub-node[data-node-id='home-case-results-desc'] {
            top: 380px !important;
          }
        }
        ` : ''}
        ${['about', 'contact', 'lawyers', 'reviews', 'pricing'].includes(slugPath) ? `
        @media (min-width: 769px) {
          .builder-pub-main .builder-pub-node[data-anchor='desktop-parity-standalone-${slugPath}'] {
            display: block !important;
          }
          .builder-pub-main > .builder-pub-node[data-anchor='desktop-parity-standalone-${slugPath}'] {
            ${locale === 'zh-hant' ? `width: 100% !important;
            max-width: none !important;
            margin-left: 0 !important;
            margin-right: 0 !important;` : (() => {
              // ko/en live composite roots render at their rect width (1280),
              // centered, so at wider viewports the section bands keep the
              // live gutters. Top-level flow rendering emits width:100%, so
              // the rect width must be pinned explicitly (margins alone were
              // measured to change nothing at 1440).
              const overlayWidth = canvas.nodes.find((node) => node.anchorName === `desktop-parity-standalone-${slugPath}`)?.rect.width;
              return `margin-left: auto !important;
            margin-right: auto !important;${overlayWidth ? `
            width: ${overlayWidth}px !important;
            max-width: 100% !important;` : ''}`;
            })()}
            ${(() => {
              // The live composite root renders at its measured FIXED height
              // (content may overflow into the bottom whitespace at wide
              // viewports — ko about grows +49px at 1440). Top-level flow
              // rendering only emits min-height, so pin the overlay to its
              // rect height to reproduce the composite page byte-for-byte.
              const overlayHeight = canvas.nodes.find((node) => node.anchorName === `desktop-parity-standalone-${slugPath}`)?.rect.height;
              return overlayHeight ? `height: ${overlayHeight}px !important;
            min-height: ${overlayHeight}px !important;
            max-height: ${overlayHeight}px !important;` : '';
            })()}
          }
          /* The overlay's fixed height defines the page height exactly like
             the live composite root does — the hidden decomposed tree's stage
             must not floor the main box beyond it (it left a 75px blank tail
             on ko about/pricing: stage 5018 vs overlay bottom 5054). */
          .builder-pub-main:has(> .builder-pub-node[data-anchor='desktop-parity-standalone-${slugPath}']) {
            min-height: 0 !important;
            height: auto !important;
          }
          .builder-pub-main > .builder-pub-node[data-node-id='page-about-page-header-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-about-firm-intro-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-about-attorney-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-about-contact-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-contact-page-header-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-contact-guide-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-contact-contact-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-offices-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-lawyers-page-header-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-lawyers-attorney-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-reviews-page-header-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-reviews-section-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-pricing-page-header-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-pricing-section-root'] {
            display: none !important;
          }
        }
        ` : ''}
        @media (max-width: 768px) {
          .builder-pub-main .builder-pub-node[data-node-id='home-hero-root'],
          .builder-pub-main .builder-pub-node[data-node-id='home-hero'] {
            margin-top: calc(-72px - 16px) !important;
          }
          .builder-pub-main .builder-pub-node[data-node-id='home-hero-search-wrapper'] {
            left: 0 !important;
            right: 0 !important;
          }
          .builder-pub-node .reveal-stagger > * {
            transform: translateY(20px);
          }
          .builder-pub-main > .builder-pub-node[data-node-id^='page-'][data-node-id$='-page-header-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='about-page-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='services-page-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='contact-page-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='lawyers-page-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='faq-page-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='pricing-page-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='reviews-page-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-hero'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-insights'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-services'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-attorney'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-case-results'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-stats'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-faq'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-offices'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-contact'] {
            width: calc(100% + 32px) !important;
            max-width: none !important;
            margin-left: -16px !important;
            margin-right: -16px !important;
          }
          ${locale === 'zh-hant' && !slugPath ? `
          .builder-pub-main.builder-pub-main .builder-pub-node[data-node-id='home-hero-root'] {
            margin-top: -111px !important;
          }
          .builder-pub-main .builder-pub-node[data-anchor^='mobile-parity-home-'] {
            display: block !important;
          }
          .builder-pub-main .builder-pub-node[data-anchor='mobile-parity-home-insights'] {
            margin-bottom: -4px !important;
          }
          .builder-pub-main .builder-pub-node[data-anchor='mobile-parity-home-contact'] {
            margin-bottom: -3px !important;
          }
          .builder-pub-main > .builder-pub-node[data-node-id='home-hero-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-insights-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-services-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-attorney-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-case-results-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-stats-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-faq-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-offices-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-contact-root'] {
            display: none !important;
          }
          .builder-pub-main > .builder-pub-node[data-node-id='home-hero-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-insights-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-services-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-attorney-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-case-results-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-stats-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-faq-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-offices-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-contact-root'] {
            width: calc(100% + 32px) !important;
            max-width: none !important;
            margin-left: -16px !important;
            margin-right: -16px !important;
          }
          .builder-pub-main .builder-pub-node[data-builder-section-template='insights'] .builder-pub-node[data-node-id='home-insights-featured'] {
            position: absolute !important;
            left: 0 !important;
            top: 20px !important;
            width: 343px !important;
            height: 473px !important;
            min-height: 473px !important;
          }
          .builder-pub-main .builder-pub-node[data-builder-section-template='insights'] .builder-pub-node[data-node-id='home-insights-list-wrap'] {
            position: absolute !important;
            left: 0 !important;
            top: 532px !important;
            width: 343px !important;
            height: 1577px !important;
            min-height: 1577px !important;
          }
          ` : ''}
          ${['about', 'contact', 'lawyers', 'reviews', 'services', 'pricing'].includes(slugPath) ? `
          .builder-pub-main .builder-pub-node[data-anchor^='mobile-parity-standalone-'] {
            display: block !important;
          }
          .builder-pub-main > .builder-pub-node[data-anchor^='mobile-parity-standalone-'] {
            width: calc(100% + 32px) !important;
            max-width: none !important;
            margin-left: -16px !important;
            margin-right: -16px !important;
          }
          .builder-pub-main > .builder-pub-node[data-node-id='page-about-page-header-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-about-firm-intro-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-about-attorney-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-about-contact-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-contact-page-header-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-contact-guide-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-contact-contact-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-offices-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-lawyers-page-header-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-lawyers-attorney-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-reviews-page-header-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-reviews-section-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-services-page-header-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='home-services-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-pricing-page-header-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-pricing-section-root'] {
            display: none !important;
          }
          ` : ''}
          .builder-pub-main > .builder-pub-node[data-node-id='page-about-page-header-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-lawyers-page-header-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-reviews-page-header-root'],
          .builder-pub-main > .builder-pub-node[data-node-id='page-about-page-header-root'] > .page-header,
          .builder-pub-main > .builder-pub-node[data-node-id='page-lawyers-page-header-root'] > .page-header,
          .builder-pub-main > .builder-pub-node[data-node-id='page-reviews-page-header-root'] > .page-header {
            height: 336px !important;
            min-height: 336px !important;
          }
          .builder-pub-main > .builder-pub-node[data-node-id$='-page-header-root'] > .page-header > .builder-pub-node[data-node-id$='-page-header-container'] {
            left: 17.6px !important;
            top: 48px !important;
            width: calc(100% - 35.2px) !important;
            height: 207px !important;
            min-height: 0 !important;
          }
          .builder-pub-main.builder-pub-main > .builder-pub-node[data-node-id='home-hero'] {
            margin-top: calc(var(--header-offset-desktop) * -1) !important;
            margin-bottom: 14px !important;
            padding-top: var(--header-offset-desktop) !important;
          }
        }
        @media (max-width: 1023px) {
          .site .builder-pub-main.builder-pub-main {
            margin-top: 0 !important;
            padding-top: 0 !important;
            padding-block-start: 0 !important;
          }
          .builder-pub-main > .builder-pub-node[data-node-id='home-insights'] {
            margin-top: -14px !important;
            margin-bottom: 14px !important;
          }
          .builder-pub-main .builder-pub-node[data-node-id='columns-page-root'],
          .builder-pub-main .builder-pub-node[data-node-id='columns-page-root-composite'] {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
          }
          .builder-pub-main .builder-pub-node[data-node-id='columns-page-root'] > main,
          .builder-pub-main .builder-pub-node[data-node-id='columns-page-root-composite'] > div {
            height: auto !important;
            min-height: 0 !important;
          }
          .builder-pub-node[data-node-id^='home-insights-'][data-node-id$='-readtime'] {
            position: relative !important;
            left: auto !important;
            top: auto !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .builder-pub-node[data-node-id^='home-insights-item-'],
          .builder-pub-node[data-node-id^='home-insights-featured-'] {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .builder-pub-node[data-node-id^='home-stats-card-'],
          .builder-pub-node[data-node-id^='home-stats-label-'],
          .builder-pub-node[data-node-id^='home-stats-progress'],
          .builder-pub-node[data-node-id^='home-stats-number-'] {
            position: relative !important;
            left: auto !important;
            top: auto !important;
          }
          .builder-pub-node[data-node-id^='home-attorney-badge-'] {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
        @media (max-width: 767px) {
          .builder-pub-main .builder-pub-node[data-node-id^='home-services-card-'][data-node-id$='-header'] {
            width: 230px !important;
            max-width: 230px !important;
          }
          .builder-pub-main .builder-pub-node[data-node-id^='home-services-card-'][data-node-id$='-icon'] {
            width: 46px !important;
            height: 46px !important;
            flex: 0 0 46px !important;
          }
          .builder-pub-main .builder-pub-node[data-node-id^='home-services-card-'][data-node-id$='-title'] {
            width: 172px !important;
            max-width: 172px !important;
            min-width: 0 !important;
            flex: 1 1 172px !important;
          }
          .builder-pub-main .builder-pub-node[data-node-id^='home-services-card-'][data-node-id$='-chevron'] {
            width: 20px !important;
            max-width: 20px !important;
            flex: 0 0 20px !important;
          }
          .builder-pub-node[data-node-id^='home-offices-tab-'] {
            position: relative !important;
            left: auto !important;
            top: auto !important;
          }
          .builder-pub-main > .builder-pub-node[data-node-id='columns-page-root'] {
            width: calc(100% + 32px) !important;
            max-width: none !important;
            margin-left: -16px !important;
            margin-right: -16px !important;
          }
        }
      ` }} />
      {/* Record-specific schema first — it is the page's primary entity. */}
      {recordJsonLd ? <JsonLd data={recordJsonLd} /> : null}
      {legalServiceSchema ? <JsonLd data={legalServiceSchema} /> : null}
      {organizationSchema ? <JsonLd data={organizationSchema} /> : null}
      {localBusinessSchema ? <JsonLd data={localBusinessSchema} /> : null}
      {breadcrumbSchema ? <JsonLd data={breadcrumbSchema} /> : null}
      {faqExplorerSchema ? <JsonLd data={faqExplorerSchema} /> : null}
      {structuredDataPayloads.map((payload) => (
        <JsonLd key={payload.id} data={payload.data} />
      ))}
      {customStructuredDataPayloads.map((payload) => (
        <JsonLd key={payload.id} data={payload.data} />
      ))}
      {allowPublishedThemeToggle ? (
        <DarkModeToggle
          defaultMode={darkModeConfig.defaultMode}
          allowVisitorToggle={allowPublishedThemeToggle}
        />
      ) : null}
      <AnimationsRoot />
      <AppRuntimeLoader />
      <SiteSearchEnhancer />
      <ExperimentVariantSwap />
      {useBuilderChrome && liveChatSettings ? <LiveChatWidget {...liveChatSettings} enabled={liveChatSettings.launcherEnabled} locale={locale} /> : null}
      <PublishedInteractions />
      <PageTransitionWrapper
        preset={settings?.pageTransition ?? 'none'}
        durationMs={settings?.pageTransitionDurationMs ?? 280}
      >
      {useBuilderChrome && resolved.headerCanvas ? (
        <GlobalCanvasSection
          canvas={resolved.headerCanvas}
          theme={publishedTheme}
          tag="header"
          mobileSticky={headerFooterConfig.mobileSticky}
          navItems={navItems}
          locale={locale}
          currentSlug={slugPath}
        />
      ) : useBuilderChrome ? (
        <SiteHeader
          siteName={site.name}
          settings={settings}
          theme={publishedTheme}
          navItems={navItems}
          locale={locale}
          currentSlug={slugPath}
          mobileSticky={headerFooterConfig.mobileSticky}
          mobileHamburger={headerFooterConfig.mobileHamburger}
        />
      ) : null}
      <main
        className="builder-pub-main"
        data-builder-chrome={useBuilderChrome ? 'true' : 'false'}
        style={{
          // Canvas stage width is 1280 (see canvas/responsive.ts).
          // Published main used to be 1200, so any widget the designer
          // dropped within 80px of the canvas right edge was clipped at
          // runtime. Match the canvas dimensions so WYSIWYG holds.
          maxWidth: hasTopLevelComposite ? undefined : 1280,
          margin: '0 auto',
          position: 'relative',
          minHeight: Math.max(publishedContentHeight, 720),
          // Light mode: inherit color/background/font from body so the
          // public green theme (globals.css) is used, not the builder's
          // blue/gray fallback vars. Dark mode overrides these via the
          // :root[data-theme='dark'] body rule in the inline <style> above.
          // Only honor a brand-kit body font when the designer picked one;
          // skip the generic 'system-ui, sans-serif' fallback so the public
          // site's IBM Plex Sans KR / Noto Serif KR font stack wins.
          fontFamily:
            theme?.fonts.body && theme.fonts.body !== 'system-ui, sans-serif'
              ? theme.fonts.body
              : undefined,
        }}
      >
        {renderedTopLevelNodes.map((node) => renderPublishedNode(node, true))}
      </main>
      {dynamicListConfig && dynamicListSlice && dynamicListRuntime.pagination ? (
        <DynamicListVisitorControls
          basePath={dynamicListRuntime.pagePath}
          locale={locale}
          pagination={dynamicListRuntime.pagination}
          searchParams={searchParams}
          searchTerm={dynamicListRuntime.searchTerm}
          slice={dynamicListSlice}
          sortOptions={dynamicListRuntime.sortOptions}
          sortQuery={dynamicListRuntime.sortQuery}
          totalRecordCount={dynamicListRuntime.totalRecordCount}
          visitorFilters={dynamicListRuntime.filters}
          visitorFilterSummary={dynamicListRuntime.filterSummary}
        />
      ) : null}
      {useBuilderChrome && resolved.footerCanvas ? (
        <GlobalCanvasSection
          canvas={resolved.footerCanvas}
          theme={publishedTheme}
          tag="footer"
        />
      ) : useBuilderChrome ? (
        <SiteFooter
          siteName={site.name}
          settings={settings}
          theme={publishedTheme}
          navItems={navItems}
          locale={locale}
        />
      ) : null}
      {useBuilderChrome ? <MobileBottomBar config={mobileBottomBar} theme={publishedTheme} /> : null}
      {resolved.lightboxes.length > 0 && (
        <>
          <LightboxMount slugs={resolved.lightboxes.map((lb) => lb.meta.slug)} />
          {resolved.lightboxes.map((lb) => (
            <LightboxOverlay
              key={lb.meta.id}
              config={{
                id: lb.meta.id,
                slug: lb.meta.slug,
                sizeMode: lb.meta.sizeMode,
                width: lb.meta.width,
                height: lb.meta.height,
                closeOnOutsideClick: lb.meta.closeOnOutsideClick,
                closeOnEsc: lb.meta.closeOnEsc,
                dismissable: lb.meta.dismissable,
                backdropOpacity: lb.meta.backdropOpacity,
              }}
            >
              <LightboxCanvas canvas={lb.canvas} theme={publishedTheme} />
            </LightboxOverlay>
          ))}
        </>
      )}
      {resolved.popups.length > 0 && (
        <>
          <PopupMount popups={resolved.popups} />
          {resolved.popups.map((p) => (
            <PopupOverlay
              key={p.id}
              config={{
                id: p.id,
                slug: p.slug,
                width: p.width,
                height: p.height,
                closeOnOutsideClick: p.closeOnOutsideClick,
                closeOnEsc: p.closeOnEsc,
                dismissable: p.dismissable,
                backdropOpacity: p.backdropOpacity,
              }}
            >
              <div data-builder-popup-canvas={p.slug}>
                <strong style={{ display: 'block', fontSize: 16, marginBottom: 8 }}>{p.name}</strong>
                <p style={{ margin: 0, fontSize: 14, color: '#475569' }}>
                  팝업 본문을 빌더 admin에서 편집하세요.
                </p>
              </div>
            </PopupOverlay>
          ))}
        </>
      )}
      {resolved.cookieConsent ? (
        <>
          <CookieConsentMount />
          <CookieConsentBanner config={resolved.cookieConsent} />
        </>
      ) : null}
      </PageTransitionWrapper>
    </>
  );
}

/**
 * Stripped-down renderer for lightbox content — supports the core node kinds
 * (text, image, button, heading, container, section) without the flow/sticky
 * complexity of the page-level renderer. Composite nodes and child trees work
 * via the standard component registry.
 */
function LightboxCanvas({
  canvas,
  theme,
}: {
  canvas: BuilderCanvasDocument;
  theme: BuilderSiteDocument['theme'];
}) {
  const visibleNodes = canvas.nodes.filter((node) => node.visible !== false);
  const childrenMap = buildChildrenMap(visibleNodes);
  const nodesById = new Map(canvas.nodes.map((node) => [node.id, node]));
  const topLevelNodes = visibleNodes
    .filter((node) => !node.parentId)
    .sort((left, right) => left.zIndex - right.zIndex);

  function renderLightboxNode(node: BuilderCanvasNode): JSX.Element {
    const component = getComponent(node.kind);
    const childNodes = (childrenMap[node.id] ?? [])
      .map((childId) => nodesById.get(childId))
      .filter((child): child is BuilderCanvasNode => Boolean(child && child.visible !== false));
    const backgroundStyle = resolveBackgroundStyle(node.style?.backgroundColor, theme);

    let lightboxTarget: string | undefined;
    if (node.kind === 'button') {
      const href = (node.content as { href?: string }).href;
      if (typeof href === 'string' && href.startsWith('lightbox:')) {
        lightboxTarget = href.slice('lightbox:'.length).trim();
      }
    }

    const frame = buildPublishedSurfaceFrame(node);
    return (
      <div
        key={node.id}
        className={frame.className}
        {...frame.attrs}
        data-lightbox-target={lightboxTarget || undefined}
        role={lightboxTarget ? 'button' : undefined}
        tabIndex={lightboxTarget ? 0 : undefined}
        style={{
          ...frame.style,
          position: 'absolute',
          left: node.rect.x,
          top: node.rect.y,
          width: node.rect.width,
          height: node.rect.height,
          zIndex: node.zIndex,
          ...backgroundStyle,
          borderRadius: node.style?.borderRadius ? `${node.style.borderRadius}px` : undefined,
          border: node.style?.borderWidth
            ? `${node.style.borderWidth}px ${node.style.borderStyle || 'solid'} ${resolveThemeColor(node.style.borderColor, theme)}`
            : undefined,
          boxShadow: node.style?.shadowBlur
            ? `${node.style.shadowX || 0}px ${node.style.shadowY || 0}px ${node.style.shadowBlur}px ${node.style.shadowSpread || 0}px ${resolveThemeColor(node.style.shadowColor, theme)}`
            : undefined,
          opacity: node.style?.opacity != null ? node.style.opacity / 100 : undefined,
          cursor: lightboxTarget ? 'pointer' : undefined,
        }}
      >
        {component ? (
          isContainerLikeKind(node.kind) ? (
            <component.Render node={node} mode="published" theme={theme} locale={canvas.locale}>
              {childNodes.map((child) => renderLightboxNode(child))}
            </component.Render>
          ) : (
            <>
              <component.Render node={node} mode="published" theme={theme} locale={canvas.locale} />
              {childNodes.map((child) => renderLightboxNode(child))}
            </>
          )
        ) : (
          <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{node.kind}</div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: canvas.stageWidth,
        height: canvas.stageHeight,
      }}
    >
      {topLevelNodes.map((node) => renderLightboxNode(node))}
    </div>
  );
}

/**
 * Render a global header/footer canvas. Mirrors the lightbox canvas renderer
 * (no sticky/flow-section/anchor logic — those are page-scoped concerns), but
 * wraps the stage in a semantic `<header>` or `<footer>` element so the
 * surrounding page layout and screen readers see it correctly.
 *
 * The wrapper is full-width; the stage itself is centered at `stageWidth`.
 */
function GlobalCanvasSection({
  canvas,
  theme,
  tag,
  mobileSticky = false,
  navItems = [],
  locale,
  currentSlug = '',
}: {
  canvas: BuilderCanvasDocument;
  theme: BuilderSiteDocument['theme'];
  tag: 'header' | 'footer';
  mobileSticky?: boolean;
  navItems?: BuilderNavItem[];
  locale?: Locale;
  currentSlug?: string;
}) {
  const visibleNodes = canvas.nodes.filter((node) => node.visible !== false);
  const childrenMap = buildChildrenMap(visibleNodes);
  const nodesById = new Map(canvas.nodes.map((node) => [node.id, node]));
  const topLevelNodes = visibleNodes
    .filter((node) => !node.parentId)
    .sort((left, right) => left.zIndex - right.zIndex);

  function renderGlobalNode(node: BuilderCanvasNode): JSX.Element {
    const component = getComponent(node.kind);
    const childNodes = (childrenMap[node.id] ?? [])
      .map((childId) => nodesById.get(childId))
      .filter((child): child is BuilderCanvasNode => Boolean(child && child.visible !== false));
    const backgroundStyle = resolveBackgroundStyle(node.style?.backgroundColor, theme);

    const frame = buildPublishedSurfaceFrame(node);
    return (
      <div
        key={node.id}
        id={node.anchorName ? node.anchorName : undefined}
        className={frame.className}
        {...frame.attrs}
        style={{
          ...frame.style,
          position: 'absolute',
          left: node.rect.x,
          top: node.rect.y,
          width: node.rect.width,
          height: node.rect.height,
          zIndex: node.zIndex,
          ...backgroundStyle,
          borderRadius: node.style?.borderRadius ? `${node.style.borderRadius}px` : undefined,
          border: node.style?.borderWidth
            ? `${node.style.borderWidth}px ${node.style.borderStyle || 'solid'} ${resolveThemeColor(node.style.borderColor, theme)}`
            : undefined,
          boxShadow: node.style?.shadowBlur
            ? `${node.style.shadowX || 0}px ${node.style.shadowY || 0}px ${node.style.shadowBlur}px ${node.style.shadowSpread || 0}px ${resolveThemeColor(node.style.shadowColor, theme)}`
            : undefined,
          opacity: node.style?.opacity != null ? node.style.opacity / 100 : undefined,
        }}
      >
        {component ? (
          node.kind === 'container' ? (
            <component.Render node={node} mode="published" theme={theme} locale={locale}>
              {childNodes.map((child) => renderGlobalNode(child))}
            </component.Render>
          ) : (
            <>
              <component.Render node={node} mode="published" theme={theme} locale={locale} />
              {childNodes.map((child) => renderGlobalNode(child))}
            </>
          )
        ) : (
          <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{node.kind}</div>
        )}
      </div>
    );
  }

  const Tag = tag;
  const currentPath = locale ? buildSitePagePath(locale, currentSlug) : '';
  const visibleNavItems = locale ? filterNavigationForLocale(navItems, locale) : [];
  const showNavigationFallback = tag === 'header' && locale && visibleNavItems.length > 0;
  return (
    <Tag
      data-builder-global-section={tag}
      data-builder-mobile-sticky={tag === 'header' && mobileSticky ? 'true' : undefined}
      className={tag === 'header' && mobileSticky ? 'builder-global-header-mobile-sticky' : undefined}
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--builder-color-background)',
        color: 'var(--builder-color-text)',
      }}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: canvas.stageWidth,
          height: canvas.stageHeight,
          margin: '0 auto',
        }}
      >
        {topLevelNodes.map((node) => renderGlobalNode(node))}
      </div>
      {showNavigationFallback ? (
        <nav
          aria-label="Main"
          data-builder-global-nav-fallback="true"
          style={{
            position: 'absolute',
            top: 12,
            right: 24,
            zIndex: 20,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            gap: 6,
            maxWidth: 'min(720px, calc(100vw - 48px))',
            pointerEvents: 'auto',
          }}
        >
          {visibleNavItems.map((item) => {
            const href = normalizeSiteHref(item.href, locale);
            const label = typeof item.label === 'string'
              ? item.label
              : item.label[locale] || item.label.ko || item.label.en || item.label['zh-hant'] || 'Menu';
            const isActive = comparableSitePath(href, locale) === comparableSitePath(currentPath, locale);
            return (
              <a
                key={item.id}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: 32,
                  padding: '6px 10px',
                  borderRadius: 999,
                  background: isActive ? 'var(--builder-color-primary)' : 'rgba(255,255,255,.86)',
                  color: isActive ? '#fff' : 'var(--builder-color-text)',
                  border: '1px solid rgba(15,23,42,.12)',
                  boxShadow: '0 8px 22px rgba(15,23,42,.08)',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                {label}
              </a>
            );
          })}
        </nav>
      ) : null}
    </Tag>
  );
}
