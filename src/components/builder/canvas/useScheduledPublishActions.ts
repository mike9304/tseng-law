import { useCallback } from 'react';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { TranslationSiteReviewInput } from '@/lib/builder/publish-gate/translation-policy-review';
import { defaultScheduleInput } from './PublishModalPreflight';
import type { PublishModalCopy } from './publish-copy';
import type {
  DraftMeta,
  PublishState,
  ScheduledPublishJob,
  ToastTone,
} from './PublishModalTypes';

interface DraftSaveResultOk {
  readonly ok: true;
  readonly expectedDraftRevision?: number;
}

interface DraftSaveResultError {
  readonly ok: false;
  readonly message: string;
}

type DraftSaveResult = DraftSaveResultOk | DraftSaveResultError;

interface UseScheduledPublishActionsParams {
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
  readonly scheduledAtInput: string;
  readonly scheduledJob: ScheduledPublishJob | null;
  readonly setPublishError: (message: string | null) => void;
  readonly setPublishState: (state: PublishState) => void;
  readonly setScheduleCancelPending: (pending: boolean) => void;
  readonly setScheduledAtInput: (value: string) => void;
  readonly setScheduledJob: (job: ScheduledPublishJob | null) => void;
  readonly setSchedulePending: (pending: boolean) => void;
}

export function useScheduledPublishActions({
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
  scheduledAtInput,
  scheduledJob,
  setPublishError,
  setPublishState,
  setScheduleCancelPending,
  setScheduledAtInput,
  setScheduledJob,
  setSchedulePending,
}: UseScheduledPublishActionsParams): {
  readonly handleSchedulePublish: () => Promise<void>;
  readonly handleCancelScheduledPublish: () => Promise<void>;
} {
  const saveDraftForSchedule = useCallback(async (): Promise<DraftSaveResult> => {
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

  const handleSchedulePublish = useCallback(async () => {
    if (!canSubmitPublish || !document || !activePageId) return;
    const scheduledMs = Date.parse(scheduledAtInput);
    if (!Number.isFinite(scheduledMs) || scheduledMs <= Date.now()) {
      const message = copy.scheduleInvalidMessage;
      setPublishError(message);
      setPublishState('error');
      onToast?.(message, 'error');
      return;
    }

    setSchedulePending(true);
    setPublishError(null);
    try {
      const draftSave = await saveDraftForSchedule();
      if (!draftSave.ok) {
        setPublishState('error');
        setPublishError(draftSave.message);
        onToast?.(draftSave.message, 'error');
        return;
      }
      const response = await fetch(
        `/api/builder/site/pages/${activePageId}/scheduled-publish?${new URLSearchParams({ locale, siteId }).toString()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            siteId,
            locale,
            scheduledAt: new Date(scheduledMs).toISOString(),
            expectedDraftRevision: draftSave.expectedDraftRevision,
            translationSiteReview,
          }),
        },
      );
      const data = (await response.json().catch(() => ({}))) as {
        readonly ok?: boolean;
        readonly job?: ScheduledPublishJob;
        readonly error?: string;
        readonly errorMessage?: string;
      };
      if (!response.ok || !data.ok || !data.job) {
        const message = data.errorMessage || data.error || copy.scheduleSaveError;
        setPublishState('error');
        setPublishError(message);
        onToast?.(message, 'error');
        return;
      }
      setScheduledJob(data.job);
      setPublishState('ready');
      onToast?.(copy.toastPublishScheduleSuccess, 'success');
    } catch {
      const message = copy.scheduleSaveNetworkError;
      setPublishState('error');
      setPublishError(message);
      onToast?.(copy.toastPublishScheduleNetworkError, 'error');
    } finally {
      setSchedulePending(false);
    }
  }, [
    activePageId,
    canSubmitPublish,
    copy,
    document,
    locale,
    onToast,
    saveDraftForSchedule,
    scheduledAtInput,
    setPublishError,
    setPublishState,
    setScheduledJob,
    setSchedulePending,
    siteId,
    translationSiteReview,
  ]);

  const handleCancelScheduledPublish = useCallback(async () => {
    if (!document || !activePageId || !scheduledJob) return;
    setScheduleCancelPending(true);
    setPublishError(null);
    try {
      const response = await fetch(
        `/api/builder/site/pages/${activePageId}/scheduled-publish?${new URLSearchParams({ locale, siteId }).toString()}`,
        {
          method: 'DELETE',
          credentials: 'same-origin',
        },
      );
      const data = (await response.json().catch(() => ({}))) as {
        readonly ok?: boolean;
        readonly cancelled?: number;
        readonly error?: string;
      };
      if (!response.ok || !data.ok) {
        const message = data.error || copy.scheduleCancelError;
        setPublishState('error');
        setPublishError(message);
        onToast?.(message, 'error');
        return;
      }
      setScheduledJob(null);
      setScheduledAtInput(defaultScheduleInput());
      setPublishState('ready');
      onToast?.(copy.toastPublishScheduleCancelled, 'success');
    } catch {
      const message = copy.scheduleCancelNetworkError;
      setPublishState('error');
      setPublishError(message);
      onToast?.(copy.toastPublishScheduleNetworkError, 'error');
    } finally {
      setScheduleCancelPending(false);
    }
  }, [
    activePageId,
    copy,
    document,
    locale,
    onToast,
    scheduledJob,
    setPublishError,
    setPublishState,
    setScheduleCancelPending,
    setScheduledAtInput,
    setScheduledJob,
    siteId,
  ]);

  return { handleSchedulePublish, handleCancelScheduledPublish };
}
