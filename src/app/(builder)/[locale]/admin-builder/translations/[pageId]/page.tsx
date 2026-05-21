import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import { readPageCanvas, readSiteDocument } from '@/lib/builder/site/persistence';
import { DEFAULT_TRANSLATION_SOURCE_LOCALE } from '@/lib/builder/translations/sync';
import { findTargetPageMeta } from '@/lib/builder/translations/edit-store';
import { extractTranslatableNodes } from '@/lib/builder/translations/auto-translate';
import { resolveLocaleSeo } from '@/lib/builder/translations/seo-projection';
import TranslationEditor from '@/components/builder/translations/TranslationEditor';

export const dynamic = 'force-dynamic';

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: 'Edit Translation',
    description: 'Side-by-side per-page translation editor.',
    path: '/admin-builder/translations',
    noindex: true,
  });
}

interface SearchParams {
  source?: string;
  target?: string;
}

export default async function TranslationEditorPage({
  params,
  searchParams,
}: {
  params: { locale: Locale; pageId: string };
  searchParams?: SearchParams;
}) {
  const routeLocale = normalizeLocale(params.locale);
  const sourceLocale = normalizeLocale(
    searchParams?.source ?? DEFAULT_TRANSLATION_SOURCE_LOCALE,
  );
  const targetLocale = normalizeLocale(searchParams?.target ?? 'en');
  if (sourceLocale === targetLocale) {
    notFound();
  }

  const site = await readSiteDocument('default', sourceLocale);
  const sourcePage = site.pages.find((page) => page.pageId === params.pageId);
  if (!sourcePage) notFound();
  const targetPage = findTargetPageMeta(site, params.pageId, targetLocale);

  const sourceCanvas = await readPageCanvas('default', sourcePage.pageId, 'draft');
  const sources = sourceCanvas ? extractTranslatableNodes(sourceCanvas) : [];

  const initialTargetValues: Record<string, string> = {};
  if (targetPage) {
    const targetCanvas = await readPageCanvas('default', targetPage.pageId, 'draft');
    if (targetCanvas) {
      const targetSources = extractTranslatableNodes(targetCanvas);
      for (const item of targetSources) {
        initialTargetValues[item.nodeId] = item.text;
      }
    }
  }

  const sourceSeo = resolveLocaleSeo(sourcePage, sourceLocale);
  const targetSeo = resolveLocaleSeo(sourcePage, targetLocale);

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
      <header
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div>
          <Link
            href={`/${routeLocale}/admin-builder/translations/dashboard?sourceLocale=${sourceLocale}`}
            style={{ fontSize: 12, color: '#1e5a96', textDecoration: 'none' }}
          >
            ← Dashboard
          </Link>
          <h1 style={{ margin: '6px 0 0', fontSize: 22, fontWeight: 700 }}>
            {sourcePage.title[sourceLocale] || sourcePage.slug || sourcePage.pageId}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#475569' }}>
            {sourceLocale} → {targetLocale}{' '}
            {targetPage ? null : (
              <span
                style={{
                  color: '#9a3412',
                  background: '#fed7aa',
                  padding: '2px 8px',
                  borderRadius: 999,
                  fontSize: 11,
                  marginLeft: 6,
                }}
              >
                No target page yet
              </span>
            )}
          </p>
        </div>
      </header>

      <TranslationEditor
        siteId="default"
        pageId={params.pageId}
        sourceLocale={sourceLocale}
        targetLocale={targetLocale}
        sources={sources}
        initialTargetValues={initialTargetValues}
        targetPageReady={Boolean(targetPage)}
        initialSourceSeo={sourceSeo}
        initialTargetSeo={targetSeo}
      />
    </div>
  );
}