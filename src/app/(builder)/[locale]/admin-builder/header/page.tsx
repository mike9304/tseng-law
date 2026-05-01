import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  ensureGlobalHeaderFooterIds,
  readHeaderCanvas,
  writeHeaderCanvas,
} from '@/lib/builder/site/persistence';
import { createDefaultCanvasDocument, normalizeCanvasDocument } from '@/lib/builder/canvas/types';
import GlobalCanvasEditor from '@/components/builder/global/GlobalCanvasEditor';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Global Header Editor',
  robots: { index: false, follow: false },
};

export default async function GlobalHeaderEditPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = normalizeLocale(params.locale);

  let canvas = await readHeaderCanvas('default');
  if (!canvas) {
    // Lazy-seed an empty canvas so first-time editors land in the editor with
    // a 1280×120 stage. Published pages fall back to the legacy SiteHeader
    // component until the user adds nodes here.
    const seed = createDefaultCanvasDocument(locale);
    canvas = { ...seed, nodes: [], stageWidth: 1280, stageHeight: 120 };
    try {
      await writeHeaderCanvas('default', canvas);
      await ensureGlobalHeaderFooterIds('default', locale);
    } catch {
      // editor still loads with the in-memory document
    }
  }
  const initialDocument = normalizeCanvasDocument(canvas, locale);

  return (
    <GlobalCanvasEditor
      locale={locale}
      slot="header"
      initialDocument={initialDocument}
    />
  );
}
