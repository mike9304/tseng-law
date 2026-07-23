/**
 * Pure save/publish orchestration + error mapping for ColumnEditor.
 * Extracted so flows can be unit-tested without mounting TipTap/React.
 */

export type MutationKind = 'save' | 'publish';

export interface MutationErrorCopy {
  rateLimitUnavailable: string;
  tooManyRequests: string;
  networkError: string;
  failure: (error: string | number) => string;
}

export interface MutationErrorInput {
  kind: MutationKind;
  status?: number;
  error?: string;
  errorCode?: string;
  networkError?: boolean;
}

export function mapColumnMutationError(
  input: MutationErrorInput,
  copy: MutationErrorCopy,
): string {
  if (input.networkError) return copy.networkError;

  const code = input.errorCode ?? input.error;
  if (code === 'rate_limit_unavailable' || input.error === 'rate_limit_unavailable') {
    return copy.rateLimitUnavailable;
  }

  if (input.status === 429) {
    return copy.tooManyRequests;
  }

  if (typeof input.error === 'string' && input.error.trim()) {
    return copy.failure(input.error);
  }

  if (typeof input.status === 'number') {
    return copy.failure(input.status);
  }

  return copy.failure('unknown');
}

export async function readMutationErrorBody(res: Response): Promise<{
  error?: string;
  errorCode?: string;
}> {
  try {
    const data = await res.json() as { error?: unknown; errorCode?: unknown };
    return {
      error: typeof data.error === 'string' ? data.error : undefined,
      errorCode: typeof data.errorCode === 'string' ? data.errorCode : undefined,
    };
  } catch {
    return {};
  }
}

export type SaveOutcome =
  | { status: 'success'; payloadKey: string }
  | { status: 'noop' }
  | { status: 'error'; message: string };

/**
 * In-flight save coordinator: identical payload shares one PATCH promise;
 * different payloads serialize so max concurrent execute() is always 1.
 *
 * Uses a re-check loop after awaiting the current flight so that when A is
 * in flight and B+C both wait, C cannot start concurrently with B after A
 * settles — it either joins B (same key) or waits for B then runs (diff key).
 */
export class InflightSaveCoordinator {
  private inflight: Promise<SaveOutcome> | null = null;
  private inflightKey: string | null = null;

  async run(payloadKey: string, execute: () => Promise<SaveOutcome>): Promise<SaveOutcome> {
    // Loop until we join an identical in-flight save or become the sole starter.
    // JS is single-threaded: after each await, re-check so waiters that resume
    // together never start two executes at once.
    for (;;) {
      if (this.inflight && this.inflightKey === payloadKey) {
        return this.inflight;
      }
      if (this.inflight) {
        try {
          await this.inflight;
        } catch {
          // Previous flight errors are returned to its callers; re-check state.
        }
        continue;
      }

      this.inflightKey = payloadKey;
      const flight = execute().finally(() => {
        if (this.inflight === flight) {
          this.inflight = null;
          this.inflightKey = null;
        }
      });
      this.inflight = flight;
      return flight;
    }
  }

  get busy(): boolean {
    return this.inflight !== null;
  }
}

/** Mutable lock used by publish UI to prevent double-submit. */
export interface PublishBusyLock {
  isBusy: () => boolean;
  setBusy: (busy: boolean) => void;
}

/**
 * Run publish work under an exclusive busy lock.
 * Always clears the lock in `finally`, even if `work` throws.
 */
export async function withPublishBusyLock<T>(
  lock: PublishBusyLock,
  work: () => Promise<T>,
): Promise<T | { status: 'busy' }> {
  if (lock.isBusy()) {
    return { status: 'busy' };
  }
  lock.setBusy(true);
  try {
    return await work();
  } finally {
    lock.setBusy(false);
  }
}

export interface ExecuteSaveParams {
  payloadKey: string | null;
  lastSavedKey: string;
  hydrated: boolean;
  /** When true, skip the network if payload matches lastSavedKey. */
  skipIfUnchanged?: boolean;
  request: () => Promise<Response>;
  mapHttpError: (res: Response) => Promise<string>;
  mapNetworkError: () => string;
}

export async function executeColumnSave(params: ExecuteSaveParams): Promise<SaveOutcome> {
  const { payloadKey } = params;
  if (!payloadKey) return { status: 'noop' };

  if (!params.hydrated) {
    return { status: 'success', payloadKey };
  }

  if (params.skipIfUnchanged !== false && payloadKey === params.lastSavedKey) {
    return { status: 'noop' };
  }

  try {
    const res = await params.request();
    if (res.ok) {
      return { status: 'success', payloadKey };
    }
    return { status: 'error', message: await params.mapHttpError(res) };
  } catch {
    return { status: 'error', message: params.mapNetworkError() };
  }
}

export type PublishOutcome =
  | {
      status: 'success';
      data: {
        slugRedirect?: {
          status?: string;
          redirects?: unknown[];
          redirect?: unknown;
          skipReason?: string;
        } | null;
      };
    }
  | { status: 'save_failed'; message: string }
  | { status: 'error'; message: string }
  | { status: 'busy' };

export interface ExecutePublishParams {
  /** Cancel pending autosave debounce before save+publish. */
  cancelDebounce: () => void;
  /** Ensure latest editor payload is saved; must not POST publish on failure. */
  ensureSaved: () => Promise<SaveOutcome>;
  requestPublish: () => Promise<Response>;
  mapHttpError: (res: Response) => Promise<string>;
  mapNetworkError: () => string;
  isPublishBusy: boolean;
}

/**
 * Serialize publish: cancel debounce → require save success → single publish POST.
 */
export async function executeColumnPublish(
  params: ExecutePublishParams,
): Promise<PublishOutcome> {
  if (params.isPublishBusy) {
    return { status: 'busy' };
  }

  params.cancelDebounce();

  const saveResult = await params.ensureSaved();
  if (saveResult.status === 'error') {
    return { status: 'save_failed', message: saveResult.message };
  }

  try {
    const res = await params.requestPublish();
    if (res.ok) {
      const data = await res.json().catch(() => ({})) as {
        slugRedirect?: {
          status?: string;
          redirects?: unknown[];
          redirect?: unknown;
          skipReason?: string;
        } | null;
      };
      return { status: 'success', data };
    }
    return { status: 'error', message: await params.mapHttpError(res) };
  } catch {
    return { status: 'error', message: params.mapNetworkError() };
  }
}
