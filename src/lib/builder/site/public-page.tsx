import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
import { readPageCanvas, readSiteDocument } from '@/lib/builder/site/persistence';
import { getComponent } from '@/lib/builder/components/registry';
import { buildGoogleFontsUrl } from '@/lib/builder/canvas/fonts';
import { buildChildrenMap, resolveCanvasNodeAbsoluteRect } from '@/lib/builder/canvas/tree';
import type { BuilderCanvasNode, BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import { buildPageSeo } from '@/lib/builder/seo/seo-model';
import { generateLegalServiceSchema } from '@/lib/builder/seo/schema-org';
import { getSiteUrl } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import SiteHeader from '@/components/builder/published/SiteHeader';
import SiteFooter from '@/components/builder/published/SiteFooter';
import '@/lib/builder/components/registry';

export interface ResolvedPublishedSitePage {
  locale: Locale;
  slugPath: string;
  site: BuilderSiteDocument;
  pageMeta: BuilderPageMeta;
  canvas: BuilderCanvasDocument;
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

  if (site.theme?.fonts.heading) usedFonts.add(site.theme.fonts.heading);
  if (site.theme?.fonts.body) usedFonts.add(site.theme.fonts.body);

  const fontsUrl = buildGoogleFontsUrl([...usedFonts]);
  const navItems = site.navigation || [];
  const settings = site.settings;
  const theme = site.theme;
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
  ): JSX.Element {
    const component = getComponent(node.kind);
    const childNodes = (childrenMap[node.id] ?? [])
      .map((childId) => nodesById.get(childId))
      .filter((child): child is BuilderCanvasNode => Boolean(child && child.visible !== false));
    const flowAsSection = isTopLevel && node.kind === 'composite';
    const flowSectionMetric = flowAsSection ? flowSectionMetrics.get(node.id) : undefined;

    return (
      <div
        key={node.id}
        className="builder-pub-node"
        data-builder-flow-section={flowAsSection ? 'true' : undefined}
        style={{
          position: flowAsSection ? 'relative' : 'absolute',
          left: flowAsSection ? undefined : node.rect.x,
          top: flowAsSection ? undefined : node.rect.y,
          width: flowAsSection ? '100%' : node.rect.width,
          height: flowAsSection ? 'auto' : node.rect.height,
          minHeight: flowAsSection ? flowSectionMetric?.minHeight : undefined,
          marginTop: flowAsSection ? flowSectionMetric?.marginTop : undefined,
          zIndex: flowAsSection ? undefined : node.zIndex,
          overflow: flowAsSection ? 'visible' : undefined,
          transform: node.rotation ? `rotate(${node.rotation}deg)` : undefined,
          backgroundColor: node.style?.backgroundColor || undefined,
          borderRadius: node.style?.borderRadius ? `${node.style.borderRadius}px` : undefined,
          border: node.style?.borderWidth
            ? `${node.style.borderWidth}px ${node.style.borderStyle || 'solid'} ${node.style.borderColor || '#000'}`
            : undefined,
          boxShadow: node.style?.shadowBlur
            ? `${node.style.shadowX || 0}px ${node.style.shadowY || 0}px ${node.style.shadowBlur}px ${node.style.shadowSpread || 0}px ${node.style.shadowColor || 'rgba(0,0,0,0.1)'}`
            : undefined,
          opacity: node.style?.opacity != null ? node.style.opacity / 100 : undefined,
        }}
      >
        {component ? (
          node.kind === 'container' ? (
            <component.Render node={node} mode="published">
              {childNodes.map((child) => renderPublishedNode(child))}
            </component.Render>
          ) : (
            <>
              <component.Render node={node} mode="published" />
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
            {childNodes.map((child) => renderPublishedNode(child))}
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
      <SiteHeader
        siteName={site.name}
        settings={settings}
        theme={theme}
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
          color: theme?.colors.text,
          background: theme?.colors.background,
        }}
      >
        {renderedTopLevelNodes.map((node) => renderPublishedNode(node, true))}
      </main>
      <SiteFooter
        siteName={site.name}
        settings={settings}
        theme={theme}
        navItems={navItems}
        locale={locale}
      />
    </>
  );
}
