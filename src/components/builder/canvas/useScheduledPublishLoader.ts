import { useEffect } from 'react';
import {
  defaultScheduleInput,
  formatScheduleInput,
} from './PublishModalPreflight';
import type { ScheduledPublishJob } from './PublishModalTypes';

interface UseScheduledPublishLoaderParams {
  readonly activePageId?: string | null;
  readonly locale: string;
  readonly siteId: string;
  readonly open: boolean;
  readonly captureScheduledRead: () => (() => boolean) | null;
  readonly setScheduledAtInput: (value: string) => void;
  readonly setScheduledJob: (job: ScheduledPublishJob | null) => void;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isScheduledPublishJob(value: unknown): value is ScheduledPublishJob {
  if (!isObjectRecord(value)) return false;
  return (
    typeof value.jobId === 'string'
    && typeof value.scheduledAt === 'string'
    && typeof value.status === 'string'
    && (
      value.expectedDraftRevision === undefined
      || typeof value.expectedDraftRevision === 'number'
    )
  );
}

function parseScheduledPublishPayload(value: unknown): {
  readonly ok: boolean;
  readonly job?: ScheduledPublishJob | null;
} | null {
  if (!isObjectRecord(value) || typeof value.ok !== 'boolean') return null;
  return {
    ok: value.ok,
    job: value.job === null || isScheduledPublishJob(value.job) ? value.job : undefined,
  };
}

export function useScheduledPublishLoader({
  activePageId,
  locale,
  siteId,
  open,
  captureScheduledRead,
  setScheduledAtInput,
  setScheduledJob,
}: UseScheduledPublishLoaderParams): void {
  useEffect(() => {
    if (!open || !activePageId) return;

    const isCurrent = captureScheduledRead();
    if (!isCurrent) return;
    let cancelled = false;
    setScheduledAtInput(defaultScheduleInput());

    async function loadScheduledPublish(): Promise<void> {
      try {
        const response = await fetch(
          `/api/builder/site/pages/${activePageId}/scheduled-publish?${new URLSearchParams({ locale, siteId }).toString()}`,
          { method: 'GET', credentials: 'same-origin' },
        );
        if (!response.ok) return;

        const data = parseScheduledPublishPayload(await response.json());
        if (!cancelled && isCurrent?.() && data?.ok && data.job !== undefined) {
          setScheduledJob(data.job);
          setScheduledAtInput(data.job ? formatScheduleInput(data.job.scheduledAt) : defaultScheduleInput());
        }
      } catch (error) {
        if (!(error instanceof Error)) throw error;
      }
    }

    void loadScheduledPublish();
    return () => {
      cancelled = true;
    };
  }, [open, activePageId, captureScheduledRead, locale, setScheduledAtInput, setScheduledJob, siteId]);
}
