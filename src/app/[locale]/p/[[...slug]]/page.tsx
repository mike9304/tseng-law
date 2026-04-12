import { notFound } from 'next/navigation';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import { readSiteDocument, readPageCanvas } from '@/lib/builder/site/persistence';
import { getComponent } from '@/lib/builder/components/registry';
import '@/lib/builder/components/registry';

export const dynamic = 'force-dynamic';

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

  return (
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
  );
}
