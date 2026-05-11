import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import {
  readFooterCanvas,
  readHeaderCanvas,
  readLightboxCanvas,
  readPageCanvas,
  readSiteDocument,
} from '@/lib/builder/site/persistence';
import { readRevisionDocument } from '@/lib/builder/site/publish';
import { getComponent } from '@/lib/builder/components/registry';
import { buildGoogleFontsUrl } from '@/lib/builder/canvas/fonts';
import { buildChildrenMap, resolveCanvasNodeAbsoluteRect } from '@/lib/builder/canvas/tree';
import type {
  BuilderCanvasNode,
  BuilderCanvasDocument,
  ResponsiveConfig,
  ResponsiveOverride,
} from '@/lib/builder/canvas/types';
import { isContainerLikeKind } from '@/lib/builder/canvas/types';
import { VIEWPORT_BREAKPOINTS } from '@/lib/builder/canvas/responsive';
import type {
  BuilderLightbox,
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
  generateBreadcrumbSchema,
  generateLegalServiceSchema,
  generateLocalBusinessSchema,
  generateOrganizationSchema,
} from '@/lib/builder/seo/schema-org';
import {
  buildCustomStructuredDataPayloads,
  buildStructuredDataPayloads,
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
import { buildSitePagePath } from '@/lib/builder/site/paths';
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
import {
  buildPublishedAnimationStyle,
  getPublishedAnimationAttributes,
} from '@/lib/builder/animations/animation-render';
import '@/lib/builder/components/registry';

interface ResolvedLightbox {
  meta: BuilderLightbox;
  canvas: BuilderCanvasDocument;
}

/**
 * Tablet breakpoint: applies between mobile (<= 767) and desktop (>= 1024).
 * Mobile breakpoint: applies <= 767px.
 * Tablet rules use a min/max range so they don't bleed into mobile.
 */
const TABLET_MAX = VIEWPORT_BREAKPOINTS.tablet + 255; // 768 + 255 = 1023
const MOBILE_MAX = VIEWPORT_BREAKPOINTS.tablet - 1;   // 767

function escapeCssId(id: string): string {
  // Wrap in [data-node-id="..."]; only need to escape backslashes and quotes.
  return id.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildResponsiveOverrideRule(
  node: BuilderCanvasNode,
  override: ResponsiveOverride,
): string {
  if (!override) return '';
  const declarations: string[] = [];
  if (override.rect) {
    const r = override.rect;
    if (r.x !== undefined) declarations.push(`left: ${r.x}px`);
    if (r.y !== undefined) declarations.push(`top: ${r.y}px`);
    if (r.width !== undefined) declarations.push(`width: ${r.width}px`);
    if (r.height !== undefined) declarations.push(`height: ${r.height}px`);
  }
  if (override.hidden) {
    declarations.push('display: none');
  }
  if (override.fontSize !== undefined) {
    declarations.push(`font-size: ${override.fontSize}px`);
  }
  if (declarations.length === 0) return '';
  const selector = `[data-node-id="${escapeCssId(node.id)}"]`;
  // External CSS always loses to inline styles (the wrapper writes
  // left/top/width/height inline from desktop rect), so `!important`
  // is required for both tablet and mobile rules. The mobile @media
  // also has to beat the existing 768px fallback that resets nodes
  // to position:relative — same `!important` carries that too.
  return `${selector} { ${declarations.map((d) => `${d} !important`).join('; ')}; }`;
}

/**
 * Build a stylesheet that, for each node with `responsive` overrides,
 * emits @media blocks. The cascade in resolver is desktop → tablet → mobile.
 * In CSS we replicate it by emitting tablet rules (min:768 max:1023) and
 * mobile rules (max:767). Mobile rules also include any tablet override
 * that mobile doesn't itself override — so the cascade works in both
 * directions whether the user sets one or both buckets.
 */
function buildResponsiveStylesheet(nodes: BuilderCanvasNode[]): string {
  const tabletRules: string[] = [];
  const mobileRules: string[] = [];
  for (const node of nodes) {
    const responsive = node.responsive as ResponsiveConfig | undefined;
    if (!responsive) continue;
    if (responsive.tablet) {
      const rule = buildResponsiveOverrideRule(node, responsive.tablet);
      if (rule) tabletRules.push(rule);
    }
    if (responsive.mobile || responsive.tablet) {
      // Mobile inherits tablet, then mobile keys win.
      const merged: ResponsiveOverride = {
        ...(responsive.tablet ?? {}),
        ...(responsive.mobile ?? {}),
        rect: {
          ...(responsive.tablet?.rect ?? {}),
          ...(responsive.mobile?.rect ?? {}),
        },
      };
      // If both are present but neither defines the field, keep undefined.
      if (
        merged.rect
        && Object.keys(merged.rect).length === 0
      ) {
        merged.rect = undefined;
      }
      const rule = buildResponsiveOverrideRule(node, merged);
      if (rule) mobileRules.push(rule);
    }
  }
  let css = '';
  if (tabletRules.length > 0) {
    css += `@media (min-width: ${VIEWPORT_BREAKPOINTS.tablet}px) and (max-width: ${TABLET_MAX}px) {\n  ${tabletRules.join('\n  ')}\n}\n`;
  }
  if (mobileRules.length > 0) {
    css += `@media (max-width: ${MOBILE_MAX}px) {\n  ${mobileRules.join('\n  ')}\n}\n`;
  }
  return css;
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

function findPageMeta(site: BuilderSiteDocument, slugPath: string): BuilderPageMeta | undefined {
  const candidates = !slugPath
    ? site.pages.filter((page) => page.isHomePage || page.slug === '')
    : site.pages.filter((page) => page.slug === slugPath);

  return [...candidates].sort((left, right) => {
    const publishedDelta = Number(Boolean(right.publishedAt)) - Number(Boolean(left.publishedAt));
    if (publishedDelta !== 0) return publishedDelta;

    return (right.updatedAt || right.createdAt).localeCompare(left.updatedAt || left.createdAt);
  })[0];
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
  const pageMeta = findPageMeta(site, slugPath);
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
  const [headerCanvas, footerCanvas] = await Promise.all([
    readHeaderCanvas(DEFAULT_BUILDER_SITE_ID),
    readFooterCanvas(DEFAULT_BUILDER_SITE_ID),
  ]);

  const popups = (site.popups ?? []).filter((p) => p.locale === locale && p.active);
  const cookieConsent = site.cookieConsent && site.cookieConsent.enabled && site.cookieConsent.locale === locale
    ? site.cookieConsent
    : null;

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
  };
}

export async function buildPublishedSitePageMetadata(
  locale: Locale,
  slugPath: string,
): Promise<Metadata | null> {
  const resolved = await resolvePublishedSitePage(locale, slugPath);
  if (!resolved) return null;

  const siteUrl = getSiteUrl();
  const seoData = buildPageSeo(resolved.pageMeta, siteUrl, locale, resolved.site.pages, resolved.site);
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

export function PublishedSitePageView({ resolved }: { resolved: ResolvedPublishedSitePage }) {
  const { site, canvas, locale, slugPath } = resolved;
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
  const navItems = site.navigation || [];
  const settings = site.settings;
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
  const structuredDataPayloads = buildStructuredDataPayloads(canvas, {
    includeFaqPage: structuredSettings.faqPage !== 'off',
  });
  const customStructuredDataPayloads = buildCustomStructuredDataPayloads(mergedSeo.structuredDataBlocks);
  const topLevelNodes = visibleNodes.filter((node) => !node.parentId);
  const hasTopLevelComposite = topLevelNodes.some((node) => node.kind === 'composite');
  const flowTopLevelCompositeNodes = topLevelNodes
    .filter((node): node is BuilderCanvasNode => node.kind === 'composite')
    .sort((left, right) => left.rect.y - right.rect.y || left.zIndex - right.zIndex);
  const flowSectionMetrics = new Map<string, { marginTop: number; minHeight: number }>();
  let previousFlowBottom = 0;

  for (const node of flowTopLevelCompositeNodes) {
    const marginTop = Math.max(0, node.rect.y - previousFlowBottom);
    flowSectionMetrics.set(node.id, {
      marginTop,
      minHeight: node.rect.height,
    });
    previousFlowBottom = Math.max(previousFlowBottom + marginTop + node.rect.height, node.rect.y + node.rect.height);
  }

  const renderedTopLevelNodes = [...topLevelNodes].sort((left, right) => {
    if (left.kind === 'composite' && right.kind === 'composite') {
      return left.rect.y - right.rect.y || left.zIndex - right.zIndex;
    }
    return left.zIndex - right.zIndex;
  });
  const publishedContentHeight = visibleNodes.reduce((maxHeight, node) => {
    const absoluteRect = resolveCanvasNodeAbsoluteRect(node, nodesById);
    return Math.max(maxHeight, absoluteRect.y + absoluteRect.height);
  }, canvas.stageHeight);

  function renderPublishedNode(
    node: BuilderCanvasNode,
    isTopLevel = false,
    parentLayoutMode?: ParentLayoutMode,
  ): JSX.Element {
    const component = getComponent(node.kind);
    const childNodes = (childrenMap[node.id] ?? [])
      .map((childId) => nodesById.get(childId))
      .filter((child): child is BuilderCanvasNode => Boolean(child && child.visible !== false));
    const flowAsSection = isTopLevel && node.kind === 'composite';
    const parentUsesFlowLayout = parentLayoutMode === 'flex' || parentLayoutMode === 'grid';
    const useFlowWrapper = flowAsSection || parentUsesFlowLayout;
    const childParentLayoutMode: ParentLayoutMode | undefined =
      isContainerLikeKind(node.kind)
        ? ((node.content as { layoutMode?: ParentLayoutMode }).layoutMode ?? 'absolute')
        : undefined;
    const flowSectionMetric = flowAsSection ? flowSectionMetrics.get(node.id) : undefined;
    const stickyConfig = node.sticky;
    const useSticky = Boolean(stickyConfig) && !useFlowWrapper;
    const baseTransform = node.rotation ? `rotate(${node.rotation}deg)` : undefined;
    const backgroundStyle = resolveBackgroundStyle(node.style?.backgroundColor, publishedTheme);
    const hoverStyle = deriveHeuristicHoverStyle(node);
    const effectiveAnimation = deriveHeuristicAnimation(node);
    const hoverBackgroundStyle = hoverStyle?.backgroundColor
      ? resolveBackgroundStyle(hoverStyle.backgroundColor, publishedTheme)
      : undefined;
    const hoverShadowBlur = hoverStyle?.shadowBlur ?? node.style?.shadowBlur ?? 0;
    const hoverShadowSpread = hoverStyle?.shadowSpread ?? node.style?.shadowSpread ?? 0;
    const hoverShadowColor = hoverStyle?.shadowColor ?? node.style?.shadowColor;
    const hoverBoxShadow = hoverStyle && (hoverShadowBlur > 0 || hoverShadowSpread !== 0 || node.style?.shadowX || node.style?.shadowY)
      ? `${node.style?.shadowX || 0}px ${node.style?.shadowY || 0}px ${hoverShadowBlur}px ${hoverShadowSpread}px ${resolveThemeColor(hoverShadowColor, publishedTheme)}`
      : undefined;
    const hoverTransform = buildHoverTransform(hoverStyle, baseTransform ?? '');
    const hoverDuration = `${hoverStyle?.transitionMs ?? 200}ms`;
    const animationAttributes = getPublishedAnimationAttributes(effectiveAnimation);
    const animationStyle = buildPublishedAnimationStyle({
      animation: effectiveAnimation,
      baseTransform,
      baseOpacity: node.style?.opacity != null ? node.style.opacity / 100 : 1,
      primaryColor: 'var(--builder-color-primary, #3b82f6)',
    });
    const sectionTemplate = getHomeSectionTemplateMetadata(node);

    // Lightbox trigger detection: button with href starting with `lightbox:`
    let lightboxTarget: string | undefined;
    if (node.kind === 'button') {
      const link = sanitizeLinkValue(linkValueFromLegacy(node.content));
      if (link?.href.startsWith('lightbox:')) {
        lightboxTarget = link.href.slice('lightbox:'.length).trim();
      }
    }

    return (
      <div
        key={node.id}
        id={node.anchorName ? node.anchorName : undefined}
        className="builder-pub-node"
        data-node-id={node.id}
        data-builder-flow-section={flowAsSection ? 'true' : undefined}
        data-builder-sticky={useSticky ? 'true' : undefined}
        data-builder-section-template={sectionTemplate?.id}
        data-section-variant={sectionTemplate?.variant}
        data-anchor={node.anchorName ? node.anchorName : undefined}
        data-builder-hover={hoverStyle ? 'true' : undefined}
        data-lightbox-target={lightboxTarget || undefined}
        {...animationAttributes}
        role={lightboxTarget ? 'button' : undefined}
        tabIndex={lightboxTarget ? 0 : undefined}
        style={{
          position: useSticky ? 'sticky' : useFlowWrapper ? 'relative' : 'absolute',
          left: useSticky || useFlowWrapper ? undefined : node.rect.x,
          top: useSticky
            ? (stickyConfig?.from !== 'bottom' ? (stickyConfig?.offset ?? 0) : undefined)
            : useFlowWrapper ? undefined : node.rect.y,
          bottom: useSticky && stickyConfig?.from === 'bottom' ? (stickyConfig?.offset ?? 0) : undefined,
          width: flowAsSection ? '100%' : node.rect.width,
          height: flowAsSection ? 'auto' : node.rect.height,
          minHeight: flowAsSection ? flowSectionMetric?.minHeight : undefined,
          marginTop: flowAsSection ? flowSectionMetric?.marginTop : undefined,
          zIndex: useSticky ? Math.max(node.zIndex, 100) : useFlowWrapper ? undefined : node.zIndex,
          overflow: flowAsSection ? 'visible' : undefined,
          transform: baseTransform,
          ...backgroundStyle,
          borderRadius: node.style?.borderRadius ? `${node.style.borderRadius}px` : undefined,
          border: node.style?.borderWidth
            ? `${node.style.borderWidth}px ${node.style.borderStyle || 'solid'} ${resolveThemeColor(node.style.borderColor, publishedTheme)}`
            : undefined,
          boxShadow: node.style?.shadowBlur
            ? `${node.style.shadowX || 0}px ${node.style.shadowY || 0}px ${node.style.shadowBlur}px ${node.style.shadowSpread || 0}px ${resolveThemeColor(node.style.shadowColor, publishedTheme)}`
            : undefined,
          opacity: node.style?.opacity != null ? node.style.opacity / 100 : undefined,
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
        {component ? (
          isContainerLikeKind(node.kind) ? (
            <component.Render node={node} mode="published" theme={publishedTheme}>
              {childNodes.map((child) => renderPublishedNode(child, false, childParentLayoutMode))}
            </component.Render>
          ) : (
            <>
              <component.Render node={node} mode="published" theme={publishedTheme} />
              {childNodes.map((child) => renderPublishedNode(child))}
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
              {node.kind}
            </div>
            {childNodes.map((child) => renderPublishedNode(child, false, childParentLayoutMode))}
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
        const src = heroImage ? (heroImage.content as { src?: string }).src : null;
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
      <PublishedInteractions />
      {resolved.headerCanvas ? (
        <GlobalCanvasSection
          canvas={resolved.headerCanvas}
          theme={publishedTheme}
          tag="header"
          mobileSticky={headerFooterConfig.mobileSticky}
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
          maxWidth: hasTopLevelComposite ? undefined : 1200,
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
            <component.Render node={node} mode="published" theme={theme}>
              {childNodes.map((child) => renderLightboxNode(child))}
            </component.Render>
          ) : (
            <>
              <component.Render node={node} mode="published" theme={theme} />
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
}: {
  canvas: BuilderCanvasDocument;
  theme: BuilderSiteDocument['theme'];
  tag: 'header' | 'footer';
  mobileSticky?: boolean;
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
            <component.Render node={node} mode="published" theme={theme}>
              {childNodes.map((child) => renderGlobalNode(child))}
            </component.Render>
          ) : (
            <>
              <component.Render node={node} mode="published" theme={theme} />
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
  return (
    <Tag
      data-builder-global-section={tag}
      data-builder-mobile-sticky={tag === 'header' && mobileSticky ? 'true' : undefined}
      className={tag === 'header' && mobileSticky ? 'builder-global-header-mobile-sticky' : undefined}
      style={{
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
    </Tag>
  );
}
