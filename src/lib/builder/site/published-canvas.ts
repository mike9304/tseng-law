import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { normalizeCanvasDocument, type BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import { readPageCanvas } from '@/lib/builder/site/persistence';
import { readRevisionDocument } from '@/lib/builder/site/publish';

function normalizePublishedCanvas(
  document: BuilderCanvasDocument | null,
  pageMeta: BuilderPageMeta,
): BuilderCanvasDocument | null {
  if (!document) return null;
  return normalizeCanvasDocument(document, pageMeta.locale);
}

export async function readPublishedPageCanvas(
  pageMeta: BuilderPageMeta,
  siteId: string = DEFAULT_BUILDER_SITE_ID,
): Promise<BuilderCanvasDocument | null> {
  const current = await readPageCanvas(siteId, pageMeta.pageId, 'published');
  if (current) return normalizePublishedCanvas(current, pageMeta);

  if (pageMeta.publishedRevisionId) {
    const revision = await readRevisionDocument(pageMeta.pageId, pageMeta.publishedRevisionId);
    return normalizePublishedCanvas(revision, pageMeta);
  }

  return null;
}
