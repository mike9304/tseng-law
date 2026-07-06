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
import { listImageNodesForLocaleEditor } from '@/lib/builder/translations/locale-media';
import TranslationEditor from '@/components/builder/translations/TranslationEditor';
import LocaleSlugEditor from '@/components/builder/translations/LocaleSlugEditor';
import LocaleMediaEditor from '@/components/builder/translations/LocaleMediaEditor';
import { getTranslationCopy } from '@/components/builder/translations/translation-copy';

export const dynamic = 'force-dynamic';

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = getTranslationCopy(locale);
  return buildSeoMetadata({
    locale,
    title: copy.editorTitle,
    description: copy.editorDescription,
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
  const copy = getTranslationCopy(routeLocale);
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
  const sourceMediaRows = sourceCanvas ? listImageNodesForLocaleEditor(sourceCanvas) : [];

  const initialTargetValues: Record<string, string> = {};
  let initialTargetMedia: ReadonlyArray<ReturnType<typeof listImageNodesForLocaleEditor>[number]> = [];
  if (targetPage) {
    const targetCanvas = await readPageCanvas('default', targetPage.pageId, 'draft');
    if (targetCanvas) {
      const targetSources = extractTranslatableNodes(targetCanvas);
      for (const item of targetSources) {
        initialTargetValues[item.nodeId] = item.text;
      }
      initialTargetMedia = listImageNodesForLocaleEditor(targetCanvas);
    }
  }

  const sourceSeo = resolveLocaleSeo(sourcePage, sourceLocale);
  const targetSeo = resolveLocaleSeo(sourcePage, targetLocale);
  const targetMediaOverrideMap = new Map(initialTargetMedia.map((row) => [row.nodeId, row] as const));

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
            ← {copy.dashboardTitle}
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
      <LocaleSlugEditor
        pageId={params.pageId}
        sourceLocale={sourceLocale}
        defaultSlug={sourcePage.slug || ''}
        initialSlugByLocale={sourcePage.slugByLocale ?? {}}
        embedded
      />
      <LocaleMediaEditor
        siteId="default"
        pageId={params.pageId}
        sourceLocale={sourceLocale}
        targetLocale={targetLocale}
        rows={sourceMediaRows.map((row) => ({
          nodeId: row.nodeId,
          sourceSrc: row.src,
          sourceAlt: row.alt,
          initialOverrideSrc: targetMediaOverrideMap.get(row.nodeId)?.byLocale.src[targetLocale],
          initialOverrideAlt: targetMediaOverrideMap.get(row.nodeId)?.byLocale.alt[targetLocale],
        }))}
      />
    </div>
  );
}
