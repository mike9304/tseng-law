import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
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
  readonly open: boolean;
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
  open,
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
  readonly invalidateScheduledActions: () => void;
  readonly captureScheduledRead: () => (() => boolean) | null;
} {
  // Tokens are created during render but installed only by a committed layout.
  const sessionToken = useMemo(
    () => ({ activePageId, locale, open, siteId }),
    [activePageId, locale, open, siteId],
  );
  const owner = useRef<{ token: typeof sessionToken | null; active: boolean; version: number; pending: symbol | null }>({
    token: null, active: false, version: 0, pending: null,
  });
  useLayoutEffect(() => {
    owner.current = { token: sessionToken, active: open, version: owner.current.version + 1, pending: null };
    setScheduledJob(null);
    setSchedulePending(false);
    setScheduleCancelPending(false);
    return () => {
      owner.current.active = false;
      owner.current.version += 1;
      owner.current.pending = null;
    };
  }, [open, sessionToken, setScheduledJob, setSchedulePending, setScheduleCancelPending]);

  const invalidateScheduledActions = useCallback(() => {
    if (owner.current.token !== sessionToken) return;
    owner.current.active = false;
    owner.current.version += 1;
    owner.current.pending = null;
  }, [sessionToken]);

  // A load that began before a mutation cannot replace its acknowledged result.
  const captureScheduledRead = useCallback(() => {
    if (!owner.current.active || owner.current.token !== sessionToken || owner.current.pending) return null;
    const version = owner.current.version;
    return () => owner.current.active && owner.current.token === sessionToken
      && owner.current.version === version && owner.current.pending === null;
  }, [sessionToken]);

  const beginOperation = useCallback(() => {
    if (!owner.current.active || owner.current.token !== sessionToken || owner.current.pending) return null;
    const operation = Symbol('scheduled-publish-operation');
    const version = ++owner.current.version;
    owner.current.pending = operation;
    return () => owner.current.active && owner.current.token === sessionToken
      && owner.current.version === version && owner.current.pending === operation;
  }, [sessionToken]);

  const saveDraftForSchedule = useCallback(async (isCurrent: () => boolean): Promise<DraftSaveResult> => {
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
    if (!isCurrent()) return { ok: false, message: copy.draftSaveError };
    if (!saveResponse.ok) {
      const errData = (await saveResponse.json().catch(() => ({}))) as {
        readonly error?: string;
        readonly errorCode?: string;
      };
      if (!isCurrent()) return { ok: false, message: copy.draftSaveError };
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
    if (!isCurrent()) return { ok: false, message: copy.draftSaveError };
    if (saveData.draft) {
      onDraftSaved?.(saveData.draft, saveData.document);
    }
    if (!isCurrent()) return { ok: false, message: copy.draftSaveError };
    return {
      ok: true,
      expectedDraftRevision: saveData.draft?.revision ?? draftMeta?.revision,
    };
  }, [activePageId, copy, document, draftMeta?.revision, locale, onDraftSaved, siteId]);

  const handleSchedulePublish = useCallback(async () => {
    if (!canSubmitPublish || !document || !activePageId) return;
    if (!owner.current.active || owner.current.token !== sessionToken || owner.current.pending) return;
    const scheduledMs = Date.parse(scheduledAtInput);
    if (!Number.isFinite(scheduledMs) || scheduledMs <= Date.now()) {
      const message = copy.scheduleInvalidMessage;
      setPublishError(message);
      setPublishState('error');
      onToast?.(message, 'error');
      return;
    }

    const isCurrent = beginOperation();
    if (!isCurrent) return;
    setSchedulePending(true);
    setPublishError(null);
    try {
      const draftSave = await saveDraftForSchedule(isCurrent);
      if (!isCurrent()) return;
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
      if (!isCurrent()) return;
      const data = (await response.json().catch(() => ({}))) as {
        readonly ok?: boolean;
        readonly job?: ScheduledPublishJob;
        readonly error?: string;
        readonly errorMessage?: string;
      };
      if (!isCurrent()) return;
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
      if (!isCurrent()) return;
      const message = copy.scheduleSaveNetworkError;
      setPublishState('error');
      setPublishError(message);
      onToast?.(copy.toastPublishScheduleNetworkError, 'error');
    } finally {
      if (isCurrent()) {
        owner.current.pending = null;
        setSchedulePending(false);
      }
    }
  }, [
    activePageId,
    beginOperation,
    sessionToken,
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
    const isCurrent = beginOperation();
    if (!isCurrent) return;
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
      if (!isCurrent()) return;
      const data = (await response.json().catch(() => ({}))) as {
        readonly ok?: boolean;
        readonly cancelled?: number;
        readonly error?: string;
      };
      if (!isCurrent()) return;
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
      if (!isCurrent()) return;
      const message = copy.scheduleCancelNetworkError;
      setPublishState('error');
      setPublishError(message);
      onToast?.(copy.toastPublishScheduleNetworkError, 'error');
    } finally {
      if (isCurrent()) {
        owner.current.pending = null;
        setScheduleCancelPending(false);
      }
    }
  }, [
    activePageId,
    beginOperation,
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

  return { handleSchedulePublish, handleCancelScheduledPublish, invalidateScheduledActions, captureScheduledRead };
}
