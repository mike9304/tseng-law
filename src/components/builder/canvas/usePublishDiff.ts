import { useCallback, useState } from 'react';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import {
  computeDocumentDiff,
  summarizeDocumentDiff,
} from '@/lib/builder/canvas/document-diff';
import type { DocumentDiffCopy } from '@/lib/builder/canvas/document-diff-copy';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import type { PublishModalCopy } from './publish-copy';
import type { PublishDiffState } from './PublishModalTypes';

interface UsePublishDiffParams {
  readonly activePageId?: string | null;
  readonly copy: PublishModalCopy;
  readonly diffCopy: DocumentDiffCopy;
  readonly document: BuilderCanvasDocument | null;
  readonly locale: string;
  readonly siteId: string;
}

export function usePublishDiff({
  activePageId,
  copy,
  diffCopy,
  document,
  locale,
  siteId,
}: UsePublishDiffParams): {
  readonly publishDiff: PublishDiffState;
  readonly resetPublishDiff: () => void;
  readonly loadPublishDiff: () => Promise<void>;
} {
  const [publishDiff, setPublishDiff] = useState<PublishDiffState>({ status: 'idle' });
  const resetPublishDiff = useCallback(() => {
    setPublishDiff({ status: 'idle' });
  }, []);

  const loadPublishDiff = useCallback(async () => {
    if (!document || !activePageId) {
      resetPublishDiff();
      return;
    }

    setPublishDiff({ status: 'loading' });
    try {
      const pagesResponse = await fetch(
        `/api/builder/site/pages?${new URLSearchParams({ locale, siteId }).toString()}`,
        { credentials: 'same-origin' },
      );
      if (!pagesResponse.ok) {
        setPublishDiff({ status: 'error', message: copy.publishedBaselineError });
        return;
      }
      const pagesPayload = (await pagesResponse.json()) as { readonly pages?: readonly BuilderPageMeta[] };
      const pageMeta = (pagesPayload.pages ?? []).find((page) => page.pageId === activePageId);
      const revisionId = pageMeta?.publishedRevisionId;
      if (!revisionId) {
        setPublishDiff({
          status: 'missing',
          message: copy.publishedBaselineMissing,
        });
        return;
      }

      const revisionResponse = await fetch(
        `/api/builder/site/pages/${encodeURIComponent(activePageId)}/revisions?${new URLSearchParams({ siteId, revisionId }).toString()}`,
        { credentials: 'same-origin' },
      );
      if (!revisionResponse.ok) {
        setPublishDiff({ status: 'error', message: copy.lastPublishedRevisionError });
        return;
      }
      const revisionPayload = (await revisionResponse.json()) as {
        readonly document?: BuilderCanvasDocument;
      };
      if (!revisionPayload.document) {
        setPublishDiff({ status: 'error', message: copy.publishedRevisionEmpty });
        return;
      }

      const diff = computeDocumentDiff(document, revisionPayload.document, diffCopy);
      setPublishDiff({
        status: 'ready',
        diff,
        summary: summarizeDocumentDiff(diff),
        publishedRevision: pageMeta?.publishedRevision,
        publishedRevisionId: revisionId,
        publishedSavedAt: pageMeta?.publishedSavedAt ?? pageMeta?.publishedAt,
      });
    } catch {
      setPublishDiff({ status: 'error', message: copy.publishDiffNetworkError });
    }
  }, [activePageId, copy, diffCopy, document, locale, resetPublishDiff, siteId]);

  return { publishDiff, resetPublishDiff, loadPublishDiff };
}
