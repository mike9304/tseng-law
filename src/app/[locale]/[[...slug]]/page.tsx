import { notFound } from 'next/navigation';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { readPageCanvas } from '@/lib/builder/site/persistence';

export const dynamic = 'force-dynamic';

/**
 * Phase 4 — Catch-all page renderer.
 *
 * Matches /[locale]/any/slug/here and looks up a published canvas
 * document from the site model. If no published page exists for
 * that slug, falls through to Next.js 404.
 *
 * This route has LOWER priority than explicit routes like
 * /[locale]/contact or /[locale]/admin-consultation because Next.js
 * serves exact matches first and optional catch-all last.
 */
export default async function BuilderCatchAllPage({
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

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', minHeight: '100vh' }}>
      {canvas.nodes
        .filter((node) => node.visible !== false)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((node) => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.rect.x,
              top: node.rect.y,
              width: node.rect.width,
              height: node.rect.height,
              zIndex: node.zIndex,
            }}
          >
            {node.kind === 'text' && (
              <div
                style={{
                  fontSize: node.content.fontSize,
                  color: node.content.color,
                  fontWeight: node.content.fontWeight === 'bold' ? 700 : node.content.fontWeight === 'medium' ? 500 : 400,
                  textAlign: node.content.align as 'left' | 'center' | 'right',
                }}
              >
                {node.content.text}
              </div>
            )}
            {node.kind === 'image' && (
              <img
                src={node.content.src}
                alt={node.content.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: node.content.fit as 'cover' | 'contain',
                  borderRadius: 4,
                }}
              />
            )}
            {node.kind === 'button' && (
              <a
                href={node.content.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  backgroundColor: node.content.style === 'primary' ? '#123b63' : 'transparent',
                  color: node.content.style === 'primary' ? '#fff' : '#123b63',
                  border: node.content.style === 'secondary' ? '2px solid #123b63' : 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                }}
              >
                {node.content.label}
              </a>
            )}
          </div>
        ))}
    </main>
  );
}
