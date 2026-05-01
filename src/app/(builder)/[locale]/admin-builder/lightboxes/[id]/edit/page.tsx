import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  listLightboxes,
  readLightboxCanvas,
  writeLightboxCanvas,
} from '@/lib/builder/site/persistence';
import { createDefaultCanvasDocument, normalizeCanvasDocument } from '@/lib/builder/canvas/types';
import LightboxEditor from '@/components/builder/lightbox/LightboxEditor';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Lightbox Editor',
  robots: { index: false, follow: false },
};

export default async function LightboxEditPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const locale: Locale = normalizeLocale(params.locale);
  const all = await listLightboxes('default', locale);
  const lightbox = all.find((lb) => lb.id === params.id);
  if (!lightbox) notFound();

  let canvas = await readLightboxCanvas('default', lightbox.id);
  if (!canvas) {
    const seed = createDefaultCanvasDocument(locale);
    canvas = { ...seed, nodes: [], stageWidth: lightbox.width ?? 600, stageHeight: lightbox.height ?? 400 };
    try {
      await writeLightboxCanvas('default', lightbox.id, canvas);
    } catch {
      // editor can still load with in-memory doc
    }
  }
  const initialDocument = normalizeCanvasDocument(canvas, locale);

  return (
    <LightboxEditor
      locale={locale}
      lightbox={lightbox}
      initialDocument={initialDocument}
    />
  );
}
