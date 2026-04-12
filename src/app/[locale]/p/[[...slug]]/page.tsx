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
      {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}
      <JsonLd data={legalServiceSchema} />

      {/* Site Navigation Header */}
      {navItems.length > 0 && (
        <header style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>
            {settings?.firmName || site.name}
          </strong>
          <nav style={{ display: 'flex', gap: 24 }}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                style={{ color: '#374151', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}
              >
                {typeof item.label === 'string' ? item.label : (item.label as Record<string, string>)[locale] || item.label.ko}
              </a>
            ))}
          </nav>
        </header>
      )}

      <main style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', minHeight: '100vh' }}>
      {canvas.nodes
        .filter((node) => node.visible !== false)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((node) => {
          const component = getComponent(node.kind);
          return (
            <div
              key={node.id}
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

      {/* Site Footer */}
      <footer style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '32px 24px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        fontSize: '0.85rem',
        color: '#6b7280',
      }}>
        <div>
          <strong style={{ color: '#374151' }}>{settings?.firmName || site.name}</strong>
          {settings?.address && <span style={{ marginLeft: 12 }}>{settings.address}</span>}
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {settings?.phone && <span>Tel: {settings.phone}</span>}
          {settings?.email && <a href={`mailto:${settings.email}`} style={{ color: '#116dff', textDecoration: 'none' }}>{settings.email}</a>}
        </div>
        <div style={{ width: '100%', textAlign: 'center', marginTop: 8, fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} {settings?.firmName || site.name}. All rights reserved.
        </div>
      </footer>
    </>
  );
}
