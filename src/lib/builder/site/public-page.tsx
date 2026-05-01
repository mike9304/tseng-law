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
import { generateBreadcrumbSchema, generateLegalServiceSchema } from '@/lib/builder/seo/schema-org';
import { buildStructuredDataPayloads } from '@/lib/builder/seo/structured-data';
import { linkValueFromLegacy, sanitizeLinkValue } from '@/lib/builder/links';
import { getSiteUrl } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import SiteHeader from '@/components/builder/published/SiteHeader';
import SiteFooter from '@/components/builder/published/SiteFooter';
import AnimationsRoot from '@/components/builder/published/AnimationsRoot';
import DarkModeToggle from '@/components/builder/published/DarkModeToggle';
import LightboxMount from '@/components/builder/published/LightboxMount';
import LightboxOverlay from '@/components/builder/published/LightboxOverlay';
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

  return {
    locale,
    slugPath,
    site,
    pageMeta,
    canvas,
    lightboxes,
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
  const seoData = buildPageSeo(resolved.pageMeta, siteUrl, locale, resolved.site.pages);
  const settings = resolved.site.settings;
  const favicon = resolveBuilderBrandAssetUrl(settings?.assets?.faviconAssetId) ?? settings?.favicon;
  const siteOgImage = resolveBuilderBrandAssetUrl(settings?.assets?.ogImageAssetId) ?? settings?.ogImage;
  const languages: Record<string, string> = {};

  for (const alt of seoData.hreflang) {
    languages[alt.hreflang] = alt.href;
  }

  return {
    title: seoData.title,
    description: seoData.description,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      images: seoData.ogImage ? [seoData.ogImage] : siteOgImage ? [siteOgImage] : [],
      siteName: resolved.site.settings?.firmName || resolved.site.name,
    },
    icons: favicon ? { icon: [favicon] } : undefined,
    robots: seoData.noIndex ? 'noindex,nofollow' : 'index,follow',
    alternates: {
      canonical: seoData.canonical,
      languages,
    },
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
  const legalServiceSchema = generateLegalServiceSchema(site.settings || {});
  const pagePath = `/${locale}/p/${slugPath}`.replace(/\/+$/, '') || `/${locale}`;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: site.name || 'Home', url: `${getSiteUrl()}/${locale}` },
    {
      name: resolved.pageMeta.title?.[locale] || slugPath || site.name || 'Page',
      url: `${getSiteUrl()}${pagePath}`,
    },
  ]);
  const structuredDataPayloads = buildStructuredDataPayloads(canvas);
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
    const hoverStyle = node.hoverStyle;
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
    const animationAttributes = getPublishedAnimationAttributes(node.animation);
    const animationStyle = buildPublishedAnimationStyle({
      animation: node.animation,
      baseTransform,
      baseOpacity: node.style?.opacity != null ? node.style.opacity / 100 : 1,
      primaryColor: 'var(--builder-color-primary, #3b82f6)',
    });

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
      <JsonLd data={legalServiceSchema} />
      <JsonLd data={breadcrumbSchema} />
      {structuredDataPayloads.map((payload) => (
        <JsonLd key={payload.id} data={payload.data} />
      ))}
      {darkModeConfig.allowVisitorToggle ? (
        <DarkModeToggle
          defaultMode={darkModeConfig.defaultMode}
          allowVisitorToggle={darkModeConfig.allowVisitorToggle}
        />
      ) : null}
      <AnimationsRoot />
      {resolved.headerCanvas ? (
        <GlobalCanvasSection
          canvas={resolved.headerCanvas}
          theme={publishedTheme}
          tag="header"
        />
      ) : (
        <SiteHeader
          siteName={site.name}
          settings={settings}
          theme={publishedTheme}
          navItems={navItems}
          locale={locale}
          currentSlug={slugPath}
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

    return (
      <div
        key={node.id}
        data-lightbox-target={lightboxTarget || undefined}
        role={lightboxTarget ? 'button' : undefined}
        tabIndex={lightboxTarget ? 0 : undefined}
        style={{
          position: 'absolute',
          left: node.rect.x,
          top: node.rect.y,
          width: node.rect.width,
          height: node.rect.height,
          zIndex: node.zIndex,
          transform: node.rotation ? `rotate(${node.rotation}deg)` : undefined,
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
}: {
  canvas: BuilderCanvasDocument;
  theme: BuilderSiteDocument['theme'];
  tag: 'header' | 'footer';
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

    return (
      <div
        key={node.id}
        id={node.anchorName ? node.anchorName : undefined}
        style={{
          position: 'absolute',
          left: node.rect.x,
          top: node.rect.y,
          width: node.rect.width,
          height: node.rect.height,
          zIndex: node.zIndex,
          transform: node.rotation ? `rotate(${node.rotation}deg)` : undefined,
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
