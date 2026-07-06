import { useCallback } from 'react';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { PublishCheckSuite } from '@/lib/builder/publish-gate/gate-runner';
import type { TranslationSiteReviewInput } from '@/lib/builder/publish-gate/translation-policy-review';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import { blockerSuite } from './PublishModalPreflight';
import type { PublishModalCopy } from './publish-copy';
import type {
  DraftMeta,
  PublishErrorBody,
  PublishState,
  ToastTone,
} from './PublishModalTypes';

interface UsePublishActionsParams {
  readonly activePageId?: string | null;
  readonly canSubmitPublish: boolean;
  readonly copy: PublishModalCopy;
  readonly document: BuilderCanvasDocument | null;
  readonly draftMeta?: DraftMeta | null;
  readonly locale: string;
  readonly siteId: string;
  readonly onDraftSaved?: (draftMeta: DraftMeta, document?: BuilderCanvasDocument) => void;
  readonly onToast?: (message: string, tone: ToastTone) => void;
  readonly translationSiteReview?: TranslationSiteReviewInput;
  readonly setPublishError: (message: string | null) => void;
  readonly setPublishedSlug: (slug: string | null) => void;
  readonly setPublishState: (state: PublishState) => void;
  readonly setSuite: (suite: PublishCheckSuite | null) => void;
}

interface DraftSaveResultOk {
  readonly ok: true;
  readonly expectedDraftRevision?: number;
}

interface DraftSaveResultError {
  readonly ok: false;
  readonly message: string;
}

type DraftSaveResult = DraftSaveResultOk | DraftSaveResultError;

export function usePublishActions({
  activePageId,
  canSubmitPublish,
  copy,
  document,
  draftMeta,
  locale,
  siteId,
  onDraftSaved,
  onToast,
  translationSiteReview,
  setPublishError,
  setPublishedSlug,
  setPublishState,
  setSuite,
}: UsePublishActionsParams): {
  readonly handlePublish: () => Promise<void>;
} {
  const saveDraftForPublish = useCallback(async (): Promise<DraftSaveResult> => {
    if (!document || !activePageId) return { ok: false, message: copy.draftMissingPageMessage };
    const saveResponse = await fetch(
      `/api/builder/site/pages/${activePageId}/draft?${new URLSearchParams({ locale, siteId }).toString()}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ siteId, expectedRevision: draftMeta?.revision, document }),
      },
    );
    if (!saveResponse.ok) {
      const errData = (await saveResponse.json().catch(() => ({}))) as {
        readonly error?: string;
        readonly errorCode?: string;
      };
      return {
        ok: false,
        message: (errData.errorCode ?? errData.error) === 'draft_conflict'
          ? copy.draftConflictMessage
          : copy.draftSaveError,
      };
    }
    const saveData = (await saveResponse.json()) as {
      readonly draft?: DraftMeta;
      readonly document?: BuilderCanvasDocument;
    };
    if (saveData.draft) {
      onDraftSaved?.(saveData.draft, saveData.document);
    }
    return {
      ok: true,
      expectedDraftRevision: saveData.draft?.revision ?? draftMeta?.revision,
    };
  }, [activePageId, copy, document, draftMeta?.revision, locale, onDraftSaved, siteId]);

  const handlePublish = useCallback(async () => {
    if (!canSubmitPublish || !document) return;
    setPublishState('publishing');
    setPublishError(null);

    try {
      if (activePageId) {
        const draftSave = await saveDraftForPublish();
        if (!draftSave.ok) {
          setPublishState('error');
          setPublishError(draftSave.message);
          onToast?.(draftSave.message, 'error');
          return;
        }

        const publishResponse = await fetch(
          `/api/builder/site/pages/${activePageId}/publish?${new URLSearchParams({ locale, siteId }).toString()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({
              siteId,
              expectedDraftRevision: draftSave.expectedDraftRevision,
              translationSiteReview,
            }),
          },
        );

        if (!publishResponse.ok) {
          const errData = (await publishResponse.json().catch(() => ({}))) as PublishErrorBody;
          let message = errData.errors?.join(', ') || errData.errorMessage || errData.error || copy.publishErrorDefault;
          if (
            errData.errorCode === 'translation_release_policy_blocked'
            || errData.errorCode === 'translation_release_approval_required'
          ) {
            message = errData.errorMessage || copy.publishBlockedMessage;
          } else if (publishResponse.status === 422 && Array.isArray(errData.blockers)) {
            setSuite(blockerSuite(errData.blockers));
            message = copy.publishBlockedMessage;
          } else if (publishResponse.status === 409 || errData.error === 'draft_stale') {
            message = copy.publishStaleMessage(
              typeof errData.current?.revision === 'number' ? errData.current.revision : undefined,
            );
          } else if (publishResponse.status >= 500) {
            message = copy.publishErrorDefault;
          }
          setPublishState('error');
          setPublishError(message);
          onToast?.(message, 'error');
          return;
        }

        const result = (await publishResponse.json()) as { readonly ok: boolean; readonly slug?: string };
        setPublishState('success');
        setPublishedSlug(buildSitePagePath(locale, result.slug ?? ''));
        onToast?.(copy.toastPublishSuccess, 'success');
        return;
      }

      const response = await fetch(`/api/builder/sandbox/draft?locale=${locale}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ document }),
      });
      if (!response.ok) {
        setPublishState('error');
        setPublishError(copy.publishSandboxSaveError);
        return;
      }
      setPublishState('success');
      setPublishedSlug('/p/sandbox');
    } catch {
      onToast?.(copy.toastPublishNetworkError, 'error');
      setPublishState('error');
      setPublishError(copy.publishNetworkError);
    }
  }, [
    activePageId,
    canSubmitPublish,
    copy,
    document,
    locale,
    onToast,
    saveDraftForPublish,
    setPublishedSlug,
    setPublishError,
    setPublishState,
    setSuite,
    siteId,
    translationSiteReview,
  ]);

  return { handlePublish };
}
