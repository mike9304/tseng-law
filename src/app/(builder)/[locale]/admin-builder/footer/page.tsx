import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  ensureGlobalHeaderFooterIds,
  readFooterCanvas,
  writeFooterCanvas,
} from '@/lib/builder/site/persistence';
import { createDefaultCanvasDocument, normalizeCanvasDocument } from '@/lib/builder/canvas/types';
import GlobalCanvasEditor from '@/components/builder/global/GlobalCanvasEditor';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Global Footer Editor',
  robots: { index: false, follow: false },
};

export default async function GlobalFooterEditPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = normalizeLocale(params.locale);

  let canvas = await readFooterCanvas('default');
  if (!canvas) {
    // Lazy-seed an empty canvas; published pages fall back to the legacy
    // SiteFooter component until the user adds nodes here.
    const seed = createDefaultCanvasDocument(locale);
    canvas = { ...seed, nodes: [], stageWidth: 1280, stageHeight: 240 };
    try {
      await writeFooterCanvas('default', canvas);
      await ensureGlobalHeaderFooterIds('default', locale);
    } catch {
      // editor still loads with the in-memory document
    }
  }
  const initialDocument = normalizeCanvasDocument(canvas, locale);

  return (
    <GlobalCanvasEditor
      locale={locale}
      slot="footer"
      initialDocument={initialDocument}
    />
  );
}
