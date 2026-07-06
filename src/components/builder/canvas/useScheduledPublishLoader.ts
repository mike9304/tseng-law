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
  setScheduledAtInput,
  setScheduledJob,
}: UseScheduledPublishLoaderParams): void {
  useEffect(() => {
    if (!open || !activePageId) return;

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
        if (!cancelled && data?.ok && data.job) {
          setScheduledJob(data.job);
          setScheduledAtInput(formatScheduleInput(data.job.scheduledAt));
        }
      } catch (error) {
        if (!(error instanceof Error)) throw error;
      }
    }

    void loadScheduledPublish();
    return () => {
      cancelled = true;
    };
  }, [open, activePageId, locale, setScheduledAtInput, setScheduledJob, siteId]);
}
