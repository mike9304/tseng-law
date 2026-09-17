import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { normalizeCanvasDocument, type BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { normalizeLegacyPublishedHomeComposite } from '@/lib/builder/canvas/home-composite-parity';
import { normalizeLegacyZhHantHomeRead } from '@/lib/builder/canvas/home-zh-hant-parity';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import { readPageCanvas } from '@/lib/builder/site/persistence';
import { readRevisionDocument } from '@/lib/builder/site/publish';

async function normalizePublishedCanvas(
  document: BuilderCanvasDocument | null,
  pageMeta: BuilderPageMeta,
): Promise<BuilderCanvasDocument | null> {
  if (!document) return null;
  const normalized = normalizeCanvasDocument(document, pageMeta.locale);
  const isHomePage = pageMeta.isHomePage === true || pageMeta.slug === '';
  return isHomePage
    ? normalizeLegacyZhHantHomeRead(normalizeLegacyPublishedHomeComposite(normalized, pageMeta.locale), pageMeta.locale, true)
    : normalized;
}

export async function readPublishedPageCanvas(
  pageMeta: BuilderPageMeta,
  siteId: string = DEFAULT_BUILDER_SITE_ID,
): Promise<BuilderCanvasDocument | null> {
  const current = await readPageCanvas(siteId, pageMeta.pageId, 'published');
  if (current) return normalizePublishedCanvas(current, pageMeta);

  if (pageMeta.publishedRevisionId) {
    const revision = await readRevisionDocument(siteId, pageMeta.pageId, pageMeta.publishedRevisionId);
    return normalizePublishedCanvas(revision, pageMeta);
  }

  return null;
}
