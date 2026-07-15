import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { PublishCheckSuite } from '@/lib/builder/publish-gate/gate-runner';
import { getPublishModalCopy } from './publish-copy';
import type {
  DraftMeta,
  PublishState,
  ScheduledPublishJob,
  ToastTone,
} from './PublishModalTypes';
import { usePublishActions } from './usePublishActions';
import { useScheduledPublishActions } from './useScheduledPublishActions';

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useCallback: <T>(callback: T): T => callback,
  };
});

const document: BuilderCanvasDocument = {
  version: 1,
  locale: 'en',
  updatedAt: '2026-07-13T00:00:00.000Z',
  updatedBy: 'publish-conflict-test',
  stageWidth: 1280,
  stageHeight: 880,
  nodes: [],
};

const copy = getPublishModalCopy('en');

function draftConflictResponse(): Response {
  return new Response(JSON.stringify({
    ok: false,
    error: 'draft_conflict',
    errorCode: 'draft_conflict',
    errorMessage: 'hostile rawError must not reach the editor',
    rawError: 'draft_conflict storage compare failed',
    storageVersion: 'file-v1:opaque-secret',
    etag: '"opaque-etag"',
    current: {
      revision: 13,
      ETag: '"opaque-etag"',
    },
  }), {
    status: 409,
    headers: {
      'Content-Type': 'application/json',
      ETag: '"opaque-etag"',
    },
  });
}

function assertOnlyStableConflictMessage(
  setPublishError: ReturnType<typeof vi.fn<(message: string | null) => void>>,
  onToast: ReturnType<typeof vi.fn<(message: string, tone: ToastTone) => void>>,
): void {
  const exposedMessages = [
    ...setPublishError.mock.calls.flatMap(([message]) => message === null ? [] : [message]),
    ...onToast.mock.calls.map(([message]) => message),
  ];

  expect(exposedMessages).toEqual([
    copy.draftConflictMessage,
    copy.draftConflictMessage,
  ]);
  const serializedUi = JSON.stringify(exposedMessages);
  expect(serializedUi).not.toContain('rawError');
  expect(serializedUi).not.toContain('errorMessage');
  expect(serializedUi).not.toContain('storageVersion');
  expect(serializedUi).not.toContain('file-v1:opaque-secret');
  expect(serializedUi).not.toContain('ETag');
  expect(serializedUi).not.toContain('opaque-etag');
  expect(serializedUi).not.toContain('hostile');
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('publish conflict actions', () => {
  it('stops publish after an exact draft conflict and exposes only the stable conflict copy', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(draftConflictResponse());
    vi.stubGlobal('fetch', fetchMock);
    const onDraftSaved = vi.fn<(
      draftMeta: DraftMeta,
      savedDocument?: BuilderCanvasDocument,
    ) => void>();
    const onToast = vi.fn<(message: string, tone: ToastTone) => void>();
    const setPublishError = vi.fn<(message: string | null) => void>();
    const setPublishedSlug = vi.fn<(slug: string | null) => void>();
    const setPublishState = vi.fn<(state: PublishState) => void>();
    const setSuite = vi.fn<(suite: PublishCheckSuite | null) => void>();

    const { handlePublish } = usePublishActions({
      activePageId: 'page-1',
      canSubmitPublish: true,
      copy,
      document,
      draftMeta: {
        revision: 12,
        savedAt: '2026-07-13T00:00:00.000Z',
      },
      locale: 'en',
      siteId: 'site-1',
      onDraftSaved,
      onToast,
      setPublishError,
      setPublishedSlug,
      setPublishState,
      setSuite,
    });

    await handlePublish();

    const requestedUrls = fetchMock.mock.calls.map(([input]) => String(input));
    expect(requestedUrls).toHaveLength(1);
    expect(requestedUrls[0]).toContain('/api/builder/site/pages/page-1/draft?');
    expect(requestedUrls.some((url) => url.includes('/publish?'))).toBe(false);
    expect(setPublishState.mock.calls.map(([state]) => state)).toEqual([
      'publishing',
      'error',
    ]);
    expect(setPublishError.mock.calls.map(([message]) => message)).toEqual([
      null,
      copy.draftConflictMessage,
    ]);
    expect(onDraftSaved).not.toHaveBeenCalled();
    expect(setPublishedSlug).not.toHaveBeenCalled();
    expect(setSuite).not.toHaveBeenCalled();
    expect(setPublishState).not.toHaveBeenCalledWith('success');
    expect(onToast).not.toHaveBeenCalledWith(copy.toastPublishSuccess, 'success');
    assertOnlyStableConflictMessage(setPublishError, onToast);
  });

  it('stops scheduled publish after an exact draft conflict and exposes only stable conflict copy', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(draftConflictResponse());
    vi.stubGlobal('fetch', fetchMock);
    const onDraftSaved = vi.fn<(
      draftMeta: DraftMeta,
      savedDocument?: BuilderCanvasDocument,
    ) => void>();
    const onToast = vi.fn<(message: string, tone: ToastTone) => void>();
    const setPublishError = vi.fn<(message: string | null) => void>();
    const setPublishState = vi.fn<(state: PublishState) => void>();
    const setScheduleCancelPending = vi.fn<(pending: boolean) => void>();
    const setScheduledAtInput = vi.fn<(value: string) => void>();
    const setScheduledJob = vi.fn<(job: ScheduledPublishJob | null) => void>();
    const setSchedulePending = vi.fn<(pending: boolean) => void>();

    const { handleSchedulePublish } = useScheduledPublishActions({
      activePageId: 'page-1',
      canSubmitPublish: true,
      copy,
      document,
      draftMeta: {
        revision: 12,
        savedAt: '2026-07-13T00:00:00.000Z',
      },
      locale: 'en',
      siteId: 'site-1',
      onDraftSaved,
      onToast,
      scheduledAtInput: '2099-01-01T00:00:00.000Z',
      scheduledJob: null,
      setPublishError,
      setPublishState,
      setScheduleCancelPending,
      setScheduledAtInput,
      setScheduledJob,
      setSchedulePending,
    });

    await handleSchedulePublish();

    const requestedUrls = fetchMock.mock.calls.map(([input]) => String(input));
    expect(requestedUrls).toHaveLength(1);
    expect(requestedUrls[0]).toContain('/api/builder/site/pages/page-1/draft?');
    expect(requestedUrls.some((url) => url.includes('/scheduled-publish?'))).toBe(false);
    expect(setSchedulePending.mock.calls.map(([pending]) => pending)).toEqual([true, false]);
    expect(setPublishState.mock.calls.map(([state]) => state)).toEqual(['error']);
    expect(setPublishError.mock.calls.map(([message]) => message)).toEqual([
      null,
      copy.draftConflictMessage,
    ]);
    expect(onDraftSaved).not.toHaveBeenCalled();
    expect(setScheduledJob).not.toHaveBeenCalled();
    expect(setScheduledAtInput).not.toHaveBeenCalled();
    expect(setScheduleCancelPending).not.toHaveBeenCalled();
    expect(setPublishState).not.toHaveBeenCalledWith('ready');
    expect(setPublishState).not.toHaveBeenCalledWith('success');
    expect(onToast).not.toHaveBeenCalledWith(copy.toastPublishScheduleSuccess, 'success');
    assertOnlyStableConflictMessage(setPublishError, onToast);
  });
});
