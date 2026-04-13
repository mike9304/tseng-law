import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import { readSiteDocument, readPageCanvas } from '@/lib/builder/site/persistence';
import { getComponent } from '@/lib/builder/components/registry';
import { buildGoogleFontsUrl } from '@/lib/builder/canvas/fonts';
import { buildPageSeo } from '@/lib/builder/seo/seo-model';
import { generateLegalServiceSchema } from '@/lib/builder/seo/schema-org';
import { getSiteUrl } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import SiteHeader from '@/components/builder/published/SiteHeader';
import SiteFooter from '@/components/builder/published/SiteFooter';
import '@/lib/builder/components/registry';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug?: string[] };
}): Promise<Metadata> {
  const locale: Locale = normalizeLocale(params.locale);
  const slugPath = params.slug?.join('/') || '';
  const site = await readSiteDocument('default', locale);
  const pageMeta = site.pages.find((p) => p.slug === slugPath);
  if (!pageMeta) return { title: '페이지를 찾을 수 없습니다' };

  const siteUrl = getSiteUrl();
  const seoData = buildPageSeo(pageMeta, siteUrl, locale, site.pages);

  const languages: Record<string, string> = {};
  for (const h of seoData.hreflang) {
    languages[h.locale === 'zh-hant' ? 'zh-Hant' : h.locale] = h.url;
  }

  return {
    title: seoData.title,
    description: seoData.description,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      images: seoData.ogImage ? [seoData.ogImage] : [],
      siteName: site.settings?.firmName || site.name,
    },
    robots: seoData.noIndex ? 'noindex,nofollow' : 'index,follow',
    alternates: {
      canonical: seoData.canonical,
      languages,
    },
  };
}

export default async function BuilderPublishedPage({
  params,
}: {
  params: { locale: string; slug?: string[] };
}) {
  const locale: Locale = normalizeLocale(params.locale);
  const slugPath = params.slug?.join('/') || '';

  const site = await readSiteDocument('default', locale);
  const pageMeta = site.pages.find((p) => p.slug === slugPath);

  if (!pageMeta || !pageMeta.publishedAt) {
    notFound();
  }

  const canvas = await readPageCanvas('default', pageMeta.pageId, 'published');
  if (!canvas || !canvas.nodes || canvas.nodes.length === 0) {
    notFound();
  }

  // Collect used fonts for <link> preload
  const usedFonts = new Set<string>();
  for (const node of canvas.nodes) {
    const content = node.content as Record<string, unknown>;
    if (typeof content.fontFamily === 'string' && content.fontFamily !== 'system-ui') {
      usedFonts.add(content.fontFamily);
    }
  }
  const fontsUrl = buildGoogleFontsUrl([...usedFonts]);

  // Navigation from site document
  const navItems = site.navigation || [];
  const settings = site.settings;

  const legalServiceSchema = generateLegalServiceSchema(site.settings || {});

  return (
    <>
      {fontsUrl && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href={fontsUrl} />
        </>
      )}
      {/* Preload hero image (first image node by z-order) */}
      {(() => {
        const heroImage = canvas.nodes
          .filter((n) => n.kind === 'image' && n.visible !== false)
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
        navItems={navItems}
        locale={locale}
        currentSlug={slugPath}
      />

      <main className="builder-pub-main" style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', minHeight: '100vh' }}>
      {canvas.nodes
        .filter((node) => node.visible !== false)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((node) => {
          const component = getComponent(node.kind);
          return (
            <div
              key={node.id}
              className="builder-pub-node"
              style={{
                position: 'absolute',
                left: node.rect.x,
                top: node.rect.y,
                width: node.rect.width,
                height: node.rect.height,
                zIndex: node.zIndex,
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
                <component.Render node={node} mode="published" />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
                  {node.kind}
                </div>
              )}
            </div>
          );
        })}
    </main>

      <SiteFooter
        siteName={site.name}
        settings={settings}
        navItems={navItems}
        locale={locale}
      />
    </>
  );
}
