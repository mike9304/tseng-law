import type { Metadata } from 'next';
import SandboxPage from '@/components/builder/canvas/SandboxPage';
import { readSiteDocument, readPageCanvas, writePageCanvas, publishPage } from '@/lib/builder/site/persistence';
import { readCanvasSandboxDraft } from '@/lib/builder/canvas/persistence';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { normalizeCanvasDocument } from '@/lib/builder/canvas/types';
import { createHomePageCanvasDocument, SEED_VERSION } from '@/lib/builder/canvas/seed-home';
import { seedSitePages } from '@/lib/builder/canvas/seed-pages';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '호정국제 사이트 에디터',
  robots: { index: false, follow: false },
};

/**
 * Unified builder entry point.
 *
 * This replaces the separate /admin-builder/sandbox route as the
 * single editor experience. Loads the home page (or first page)
 * from the site document if available, falls back to the legacy
 * sandbox draft for backward compat.
 *
 * The SandboxPage component IS the freeform canvas editor — it's
 * not a "sandbox" anymore, it's the main builder.
 */
export default async function BuilderMainPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { reseed?: string };
}) {
  const locale: Locale = normalizeLocale(params.locale);
  const force = searchParams?.reseed === '1';

  await seedSitePages('default', locale);

  // Try to load from site document (multi-page model)
  const site = await readSiteDocument('default', locale);
  const homePage = site.pages.find((p) => p.isHomePage) || site.pages[0];

  let initialDocument;
  let backend: 'blob' | 'file' = 'blob';

  if (homePage) {
    const pageCanvas = await readPageCanvas('default', homePage.pageId, 'draft');
    const nodeCount = pageCanvas?.nodes?.length ?? 0;
    const updatedBy = pageCanvas?.updatedBy ?? '';
    const isLegacySeed =
      updatedBy.startsWith('home-seed-v') || updatedBy === 'site-page-seed';
    const isCurrentSeed = updatedBy === SEED_VERSION;
    const needsReseed =
      force || !pageCanvas || nodeCount === 0 || (isLegacySeed && !isCurrentSeed);

    if (pageCanvas && !needsReseed) {
      initialDocument = normalizeCanvasDocument(pageCanvas, locale);
    } else {
      const seeded = createHomePageCanvasDocument(locale);
      initialDocument = seeded;
      try {
        await writePageCanvas('default', homePage.pageId, 'draft', seeded);
        await publishPage('default', homePage.pageId, locale);
      } catch {
        // Best-effort seed; editor still loads from in-memory doc if write fails
      }
    }
  }

  // Fallback to legacy sandbox draft
  if (!initialDocument) {
    const draft = await readCanvasSandboxDraft(locale);
    initialDocument = draft.document;
    backend = draft.backend;
  }

  return (
    <SandboxPage
      locale={locale}
      backend={backend}
      initialDocument={initialDocument}
      initialPageId={homePage?.pageId}
      siteName={site.name}
      siteSettings={site.settings}
      siteTheme={site.theme}
      navItems={site.navigation || []}
      currentSlug={homePage?.slug || ''}
      sitePages={site.pages}
      siteLightboxes={site.lightboxes ?? []}
    />
  );
}
