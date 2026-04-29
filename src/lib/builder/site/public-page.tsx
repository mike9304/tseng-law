import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
import { readPageCanvas, readSiteDocument } from '@/lib/builder/site/persistence';
import { getComponent } from '@/lib/builder/components/registry';
import { buildGoogleFontsUrl } from '@/lib/builder/canvas/fonts';
import { buildChildrenMap, resolveCanvasNodeAbsoluteRect } from '@/lib/builder/canvas/tree';
import type { BuilderCanvasNode, BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { BuilderPageMeta, BuilderSiteDocument, BuilderTheme } from '@/lib/builder/site/types';
import {
  THEME_COLOR_TOKENS,
  buildHoverTransform,
  collectThemeFontFamilies,
  createDarkColorsFromLight,
  resolveBackgroundStyle,
  resolveThemeColor,
} from '@/lib/builder/site/theme';
import { buildPageSeo } from '@/lib/builder/seo/seo-model';
import { generateLegalServiceSchema } from '@/lib/builder/seo/schema-org';
import { getSiteUrl } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import SiteHeader from '@/components/builder/published/SiteHeader';
import SiteFooter from '@/components/builder/published/SiteFooter';
import AnimationsRoot from '@/components/builder/published/AnimationsRoot';
import DarkModeToggle from '@/components/builder/published/DarkModeToggle';
import {
  buildPublishedAnimationStyle,
  getPublishedAnimationAttributes,
} from '@/lib/builder/animations/animation-render';
import '@/lib/builder/components/registry';

export interface ResolvedPublishedSitePage {
  locale: Locale;
  slugPath: string;
  site: BuilderSiteDocument;
  pageMeta: BuilderPageMeta;
  canvas: BuilderCanvasDocument;
}

type ParentLayoutMode = 'absolute' | 'flex' | 'grid';

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

export async function resolvePublishedSitePage(
  locale: Locale,
  slugPath: string,
): Promise<ResolvedPublishedSitePage | null> {
  const site = await readSiteDocument('default', locale);
  const pageMeta = findPageMeta(site, slugPath);
  if (!pageMeta?.publishedAt) return null;

  const canvas = await readPageCanvas('default', pageMeta.pageId, 'published');
  if (!canvas?.nodes?.length) return null;

  return {
    locale,
    slugPath,
    site,
    pageMeta,
    canvas,
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
  const languages: Record<string, string> = {};

  for (const hreflang of seoData.hreflang) {
    languages[hreflang.locale === 'zh-hant' ? 'zh-Hant' : hreflang.locale] = hreflang.url;
  }

  return {
    title: seoData.title,
    description: seoData.description,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      images: seoData.ogImage ? [seoData.ogImage] : [],
      siteName: resolved.site.settings?.firmName || resolved.site.name,
    },
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
  const childrenMap = buildChildrenMap(visibleNodes);
  const nodesById = new Map(canvas.nodes.map((node) => [node.id, node]));
  const legalServiceSchema = generateLegalServiceSchema(site.settings || {});
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
      node.kind === 'container' ? node.content.layoutMode ?? 'absolute' : undefined;
    const flowSectionMetric = flowAsSection ? flowSectionMetrics.get(node.id) : undefined;
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

    return (
      <div
        key={node.id}
        className="builder-pub-node"
        data-builder-flow-section={flowAsSection ? 'true' : undefined}
        data-builder-hover={hoverStyle ? 'true' : undefined}
        {...animationAttributes}
        style={{
          position: useFlowWrapper ? 'relative' : 'absolute',
          left: useFlowWrapper ? undefined : node.rect.x,
          top: useFlowWrapper ? undefined : node.rect.y,
          width: flowAsSection ? '100%' : node.rect.width,
          height: flowAsSection ? 'auto' : node.rect.height,
          minHeight: flowAsSection ? flowSectionMetric?.minHeight : undefined,
          marginTop: flowAsSection ? flowSectionMetric?.marginTop : undefined,
          zIndex: useFlowWrapper ? undefined : node.zIndex,
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
          node.kind === 'container' ? (
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
      <JsonLd data={legalServiceSchema} />
      <DarkModeToggle />
      <AnimationsRoot />
      <SiteHeader
        siteName={site.name}
        settings={settings}
        theme={publishedTheme}
        navItems={navItems}
        locale={locale}
        currentSlug={slugPath}
      />
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
      <SiteFooter
        siteName={site.name}
        settings={settings}
        theme={publishedTheme}
        navItems={navItems}
        locale={locale}
      />
    </>
  );
}
