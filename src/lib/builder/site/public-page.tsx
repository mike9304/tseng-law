import type { Metadata } from 'next';
import { getAllColumnPosts } from '@/lib/columns';
import type { Locale } from '@/lib/locales';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import {
  readFooterCanvas,
  readHeaderCanvas,
  readLightboxCanvas,
  readPageCanvas,
  readSiteDocument,
} from '@/lib/builder/site/persistence';
import { readBuilderPageSnapshot } from '@/lib/builder/persistence';
import { readRevisionDocument } from '@/lib/builder/site/publish';
import { getComponent } from '@/lib/builder/components/registry';
import { buildGoogleFontsUrl } from '@/lib/builder/canvas/fonts';
import { buildChildrenMap, resolveCanvasNodeAbsoluteRect } from '@/lib/builder/canvas/tree';
import type {
  BuilderCanvasNode,
  BuilderCanvasDocument,
} from '@/lib/builder/canvas/types';
import { isContainerLikeKind, isTextShapedKind } from '@/lib/builder/canvas/types';
import { buildResponsiveStylesheet } from '@/lib/builder/site/responsive-stylesheet';
import { computeTopLevelFlowSectionMetrics, isTopLevelFlowSection } from '@/lib/builder/canvas/flow';
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
  buildHoverTransform,
  collectThemeFontFamilies,
  createDarkColorsFromLight,
  resolveBuilderBrandAssetUrl,
  resolveBackgroundStyle,
  resolveThemeColor,
} from '@/lib/builder/site/theme';
import { buildPageSeo } from '@/lib/builder/seo/seo-model';
import {
  findBuilderCollectionRecordSeo,
  isBuilderCollectionId,
} from '@/lib/builder/cms';
import { buildBuilderRecordJsonLd } from '@/lib/builder/seo/record-jsonld';
import {
  generateBreadcrumbSchema,
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
import { filterNavigationForLocale } from '@/lib/builder/site/navigation';
import { findPageMetaForLocaleWithDynamicContext } from '@/lib/builder/site/page-resolution';
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
import { createDefaultBuilderPageDatasets } from '@/lib/builder/datasets';
import { buildBuilderDynamicListDatasetDocument } from '@/lib/builder/dynamic-list-pages';
import { buildBuilderDynamicItemDatasetDocument } from '@/lib/builder/dynamic-item-pages';
import type { BuilderPageDocument } from '@/lib/builder/types';

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

async function readPublishedPageCanvas(pageMeta: BuilderPageMeta): Promise<BuilderCanvasDocument | null> {
  if (pageMeta.publishedRevisionId) {
    return readRevisionDocument(pageMeta.pageId, pageMeta.publishedRevisionId);
  }

  return readPageCanvas(DEFAULT_BUILDER_SITE_ID, pageMeta.pageId, 'published');
}

export async function resolvePublishedSitePage(
  locale: Locale,
  slugPath: string,
): Promise<ResolvedPublishedSitePage | null> {
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, locale);
  const pageMatch = findPageMetaForLocaleWithDynamicContext(site.pages, locale, slugPath);
  const pageMeta = pageMatch?.page;
  if (!pageMeta?.publishedAt) return null;

  const canvas = await readPublishedPageCanvas(pageMeta);
  if (!canvas?.nodes?.length) return null;

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
  const [headerCanvas, footerCanvas, homeDatasetSnapshot] = await Promise.all([
    readHeaderCanvas(DEFAULT_BUILDER_SITE_ID),
    readFooterCanvas(DEFAULT_BUILDER_SITE_ID),
    readBuilderPageSnapshot('home', 'published', locale).catch(() => null),
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

  // F23 — when the page is a CMS dynamic item page and a record slug matched,
  // override page-template SEO with the per-record SEO (title/description/
  // canonical/og image/noIndex) so each generated record URL has its own
  // metadata instead of a shared template.
  const dynamicItem = resolved.pageMeta.dynamicItem;
  if (dynamicItem && resolved.dynamicItemRecordSlug && isBuilderCollectionId(dynamicItem.collectionId)) {
    const recordSeo = findBuilderCollectionRecordSeo(
      dynamicItem.collectionId,
      locale,
      resolved.dynamicItemRecordSlug,
    );
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
  const ogImage = seoData.ogImage ? (resolveBuilderBrandAssetUrl(seoData.ogImage) ?? seoData.ogImage) : siteOgImage;
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
      title: seoData.ogTitle,
      description: seoData.ogDescription,
      images: ogImage ? [ogImage] : [],
      siteName: resolved.site.settings?.firmName || resolved.site.name,
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

export async function PublishedSitePageView({ resolved }: { resolved: ResolvedPublishedSitePage }) {
  const { site, canvas, locale, slugPath } = resolved;
  const datasetDocument = resolved.datasetDocument ?? {
    pageKey: 'home' as const,
    datasets: createDefaultBuilderPageDatasets('home'),
  };
  const datasetBindingContext = {
    locale,
    posts: getAllColumnPosts(locale),
    document: datasetDocument,
  };
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
  const settings = site.settings;
  const liveChatSettings = resolveLiveChatSettings(site.installedApps, settings?.liveChatWidgetEnabled, locale);
  const theme = site.theme;
  const headerFooterConfig = normalizeHeaderFooterMobileConfig(site.headerFooter);
  const mobileBottomBar = normalizeMobileBottomBar(site.mobileBottomBar, settings);
  const darkModeConfig = resolveDarkModeConfig(site.darkMode);
  const themeInitScript = buildThemeInitScript(darkModeConfig.defaultMode, darkModeConfig.allowVisitorToggle);
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
  const visibleNodes = canvas.nodes.filter((node) => node.visible !== false);
  const responsiveStylesheet = buildResponsiveStylesheet(canvas.nodes);
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
    ? generateLegalServiceSchema(site.settings || {}, siteUrl)
    : null;
  const organizationSchema = structuredSettings.organization
    ? generateOrganizationSchema(site.settings || {}, siteUrl)
    : null;
  const localBusinessSchema = structuredSettings.localBusiness
    ? generateLocalBusinessSchema(site.settings || {}, siteUrl)
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

  // F23 — when the page is a CMS dynamic item page and a record slug matched,
  // emit a per-record schema.org payload (Article for columns, LegalService
  // for service-areas, Attorney for attorney-profiles) so each generated
  // record URL surfaces its own structured data.
  const dynamicItemMeta = resolved.pageMeta.dynamicItem;
  const recordJsonLd = (dynamicItemMeta && resolved.dynamicItemRecordSlug && isBuilderCollectionId(dynamicItemMeta.collectionId))
    ? buildBuilderRecordJsonLd({
        collectionId: dynamicItemMeta.collectionId,
        locale,
        recordSlug: resolved.dynamicItemRecordSlug,
        siteUrl,
      })
    : null;
  const topLevelNodes = visibleNodes.filter((node) => !node.parentId);
  const hasTopLevelComposite = topLevelNodes.some(isTopLevelFlowSection);
  const flowSectionMetrics = computeTopLevelFlowSectionMetrics(visibleNodes);

  // Render composites first (they participate in document flow with
  // computed margin-top), then absolute non-composites on top. Without
  // this, a non-composite widget placed between two composite sections
  // (e.g. a site-search bar in a gap) ended up partially covered by the
  // next composite because later DOM siblings stack above earlier ones
  // when z-indexes match.
  const renderedTopLevelNodes = [...topLevelNodes].sort((left, right) => {
    const leftIsComposite = isTopLevelFlowSection(left);
    const rightIsComposite = isTopLevelFlowSection(right);
    if (leftIsComposite && rightIsComposite) {
      return left.rect.y - right.rect.y || left.zIndex - right.zIndex;
    }
    if (leftIsComposite && !rightIsComposite) return -1;
    if (!leftIsComposite && rightIsComposite) return 1;
    return left.rect.y - right.rect.y || left.zIndex - right.zIndex;
  });
  const publishedContentHeight = visibleNodes.reduce((maxHeight, node) => {
    const absoluteRect = resolveCanvasNodeAbsoluteRect(node, nodesById);
    return Math.max(maxHeight, absoluteRect.y + absoluteRect.height);
  }, canvas.stageHeight);

  function renderPublishedNode(
    node: BuilderCanvasNode,
    isTopLevel = false,
    parentLayoutMode?: ParentLayoutMode,
    bindingContext: BuilderDatasetFieldBindingContext = datasetBindingContext,
  ): JSX.Element {
    const renderedNode = applyBuilderDatasetBindingToNode(node, bindingContext);
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
    const hoverDuration = `${hoverStyle?.transitionMs ?? 200}ms`;
    const animationAttributes = getPublishedAnimationAttributes(effectiveAnimation);
    const animationStyle = buildPublishedAnimationStyle({
      animation: effectiveAnimation,
      baseTransform,
      baseOpacity: renderedNode.style?.opacity != null ? renderedNode.style.opacity / 100 : 1,
      primaryColor: 'var(--builder-color-primary, #3b82f6)',
    });
    const sectionTemplate = getHomeSectionTemplateMetadata(renderedNode);

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
    const repeaterRecordCount = isRepeaterTemplate && renderedNode.dataBinding
      ? resolveBuilderDatasetBindingRecordCount(bindingContext, renderedNode.dataBinding, 12)
      : 0;
    const repeaterTemplateHeight = childNodes.reduce((height, child) => (
      Math.max(height, child.rect.y + child.rect.height)
    ), 0);
    const repeaterTemplateWidth = childNodes.reduce((width, child) => (
      Math.max(width, child.rect.x + child.rect.width)
    ), 0);
    const appRuntime = resolveBuilderAppWidgetRuntimeForNode(renderedNode, site.installedApps ?? []);
    const canRenderAppWidget = !appRuntime || appRuntime.status === 'enabled';
    const renderedChildren = isRepeaterTemplate && repeaterRecordCount > 0
      ? Array.from({ length: repeaterRecordCount }, (_, recordIndex) => {
          const recordKey = `${renderedNode.id}__record-${recordIndex + 1}`;
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
                  recordIndexOverride: recordIndex,
                },
              ))}
            </div>
          );
        })
      : isRepeaterTemplate
        ? [
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
            ? `background ${hoverDuration} ease, border-color ${hoverDuration} ease, box-shadow ${hoverDuration} ease, transform ${hoverDuration} ease`
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
            <component.Render node={renderedNode} mode="published" theme={publishedTheme} locale={locale}>
              {renderedChildren}
            </component.Render>
          ) : (
            <>
              <component.Render node={renderedNode} mode="published" theme={publishedTheme} locale={locale} />
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
      <div data-builder-published-page="true" style={{ display: 'none' }} />
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
      <style>{`
        html { scroll-behavior: smooth; }
        :root {
          color-scheme: light;
          ${lightCssVars}
        }
        :root[data-theme='dark'] {
          color-scheme: dark;
          ${darkCssVars}
        }
        body {
          background: var(--builder-color-background);
          color: var(--builder-color-text);
          transition: background 200ms ease, color 200ms ease;
        }
        :target {
          scroll-margin-top: 80px;
        }
        .builder-pub-main,
        .builder-pub-node {
          transition-property: background, background-color, border-color, box-shadow, color, transform;
          transition-duration: 200ms;
          transition-timing-function: ease;
        }
        .builder-pub-node[data-lightbox-target] {
          cursor: pointer;
        }
        .builder-pub-node[data-builder-hover='true']:hover {
          background: var(--builder-hover-background) !important;
          border-color: var(--builder-hover-border-color) !important;
          box-shadow: var(--builder-hover-box-shadow) !important;
          transform: var(--builder-hover-transform) !important;
        }
        .builder-pub-node[data-node-id='home-hero-root'] {
          z-index: 30000 !important;
        }
        .builder-pub-node[data-node-id='home-insights-root'] {
          z-index: 20000 !important;
        }
        .builder-pub-node[data-node-id='home-hero-quick-menu'] {
          display: none;
        }
        .builder-pub-node[data-node-id='home-hero-search-wrap']:hover [data-node-id='home-hero-quick-menu'],
        .builder-pub-node[data-node-id='home-hero-search-wrap']:focus-within [data-node-id='home-hero-quick-menu'] {
          display: block;
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
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 16px !important;
            gap: 12px !important;
            min-height: auto !important;
          }
          .builder-pub-node {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            height: auto !important;
            min-height: 60px;
          }
          .builder-pub-node[data-builder-flow-section='true'] {
            margin-top: 0 !important;
            min-height: auto !important;
          }
          .builder-pub-node img {
            position: relative !important;
            width: 100% !important;
            height: auto !important;
          }
        }
      `}</style>
      {responsiveStylesheet ? (
        // Per-node viewport overrides — emitted last so they win over the
        // generic mobile fallback above. Each node's tablet/mobile rect or
        // hidden flag becomes a `[data-node-id="..."]` rule inside @media.
        <style data-builder-responsive="true">{responsiveStylesheet}</style>
      ) : null}
      {legalServiceSchema ? <JsonLd data={legalServiceSchema} /> : null}
      {organizationSchema ? <JsonLd data={organizationSchema} /> : null}
      {localBusinessSchema ? <JsonLd data={localBusinessSchema} /> : null}
      {breadcrumbSchema ? <JsonLd data={breadcrumbSchema} /> : null}
      {recordJsonLd ? <JsonLd data={recordJsonLd} /> : null}
      {structuredDataPayloads.map((payload) => (
        <JsonLd key={payload.id} data={payload.data} />
      ))}
      {customStructuredDataPayloads.map((payload) => (
        <JsonLd key={payload.id} data={payload.data} />
      ))}
      {darkModeConfig.allowVisitorToggle ? (
        <DarkModeToggle
          defaultMode={darkModeConfig.defaultMode}
          allowVisitorToggle={darkModeConfig.allowVisitorToggle}
        />
      ) : null}
      <AnimationsRoot />
      <AppRuntimeLoader />
      <SiteSearchEnhancer />
      <ExperimentVariantSwap />
      {liveChatSettings ? <LiveChatWidget {...liveChatSettings} enabled={liveChatSettings.launcherEnabled} /> : null}
      <PublishedInteractions />
      <PageTransitionWrapper
        preset={settings?.pageTransition ?? 'none'}
        durationMs={settings?.pageTransitionDurationMs ?? 280}
      >
      {resolved.headerCanvas ? (
        <GlobalCanvasSection
          canvas={resolved.headerCanvas}
          theme={publishedTheme}
          tag="header"
          mobileSticky={headerFooterConfig.mobileSticky}
          navItems={navItems}
          locale={locale}
          currentSlug={slugPath}
        />
      ) : (
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
      )}
      <main
        className="builder-pub-main"
        style={{
          // Canvas stage width is 1280 (see canvas/responsive.ts).
          // Published main used to be 1200, so any widget the designer
          // dropped within 80px of the canvas right edge was clipped at
          // runtime. Match the canvas dimensions so WYSIWYG holds.
          maxWidth: hasTopLevelComposite ? undefined : 1280,
          margin: '0 auto',
          position: 'relative',
          minHeight: Math.max(publishedContentHeight, 720),
          fontFamily: theme?.fonts.body,
          color: 'var(--builder-color-text)',
          background: 'var(--builder-color-background)',
        }}
      >
        {renderedTopLevelNodes.map((node) => renderPublishedNode(node, true))}
      </main>
      {resolved.footerCanvas ? (
        <GlobalCanvasSection
          canvas={resolved.footerCanvas}
          theme={publishedTheme}
          tag="footer"
        />
      ) : (
        <SiteFooter
          siteName={site.name}
          settings={settings}
          theme={publishedTheme}
          navItems={navItems}
          locale={locale}
        />
      )}
      <MobileBottomBar config={mobileBottomBar} theme={publishedTheme} />
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
