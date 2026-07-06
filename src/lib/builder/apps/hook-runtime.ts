import { appendLog } from '@/lib/builder/dev/logs-store';
import {
  invokeBuilderFunctionCode,
  type BuilderFunctionInvocationResult,
} from '@/lib/builder/dev/function-invoker';
import { readSecretPlaintextById } from '@/lib/builder/dev/secrets-store';
import {
  getStoredAppHookDelivery,
  recordStoredAppHookDelivery,
  type StoredAppHookDeliveryRecord,
} from './hook-deliveries';
import type { AppHookEvent, AppHookKind, HookDispatchSummary, RegisteredAppHookView } from './hooks-model';
import { dispatchAppHook, listRegisteredAppHooks } from './hooks-registry';

export class StoredAppHookRuntimeError extends Error {
  constructor(message: string) {
    super(message);
  }
}

interface StoredCodeHookView extends RegisteredAppHookView {
  codeSecretId: string;
}

export type StoredAppHookInvocation =
  | {
    readonly hookId: string;
    readonly appId: string;
    readonly ok: true;
    readonly attempt: number;
    readonly deliveryId?: string;
    readonly result: unknown;
    readonly logCount: number;
    readonly runtime: BuilderFunctionInvocationResult['runtime'];
    readonly durationMs: number;
  }
  | {
    readonly hookId: string;
    readonly appId: string;
    readonly ok: false;
    readonly attempt: number;
    readonly deliveryId?: string;
    readonly error: string;
    readonly logCount: number;
    readonly runtime?: BuilderFunctionInvocationResult['runtime'];
    readonly durationMs?: number;
    readonly timedOut?: boolean;
  };

export interface StoredAppHookDispatchSummary {
  readonly kind: AppHookKind;
  readonly invoked: number;
  readonly failed: number;
  readonly skipped: number;
  readonly dispatchedAt: string;
  readonly hooks: readonly StoredAppHookInvocation[];
}

export interface AppHookDispatchEventSummary extends HookDispatchSummary {
  readonly live: HookDispatchSummary;
  readonly stored: StoredAppHookDispatchSummary;
}

export type StoredAppHookRetryResult =
  | { readonly status: 'not-found' }
  | { readonly status: 'unavailable' }
  | {
    readonly status: 'retried';
    readonly delivery: StoredAppHookDeliveryRecord;
    readonly invocation: StoredAppHookInvocation;
  };

function referenceForHook(hook: RegisteredAppHookView): string {
  return `${hook.appId}:${hook.hookId}`;
}

function hasStoredCode(hook: RegisteredAppHookView): hook is StoredCodeHookView {
  return typeof hook.codeSecretId === 'string' && hook.codeSecretId.trim().length > 0;
}

function stringifyForCode(value: unknown): string {
  const json = JSON.stringify(value);
  if (json === undefined) {
    throw new StoredAppHookRuntimeError('App hook event could not be serialized.');
  }
  return json;
}

function buildStoredHookProgram(hook: StoredCodeHookView, event: AppHookEvent, code: string): string {
  const app = {
    appId: hook.appId,
    hookId: hook.hookId,
    kind: hook.kind,
  };
  return [
    `const event = Object.freeze(${stringifyForCode(event)});`,
    `const app = Object.freeze(${stringifyForCode(app)});`,
    code,
    'if (typeof handler === "function") {',
    '  return await handler(event, ctx, app);',
    '}',
    'return null;',
  ].join('\n');
}

function countStoredHooks(event: AppHookEvent, hooks: readonly RegisteredAppHookView[]): number {
  return hooks.filter((hook) => hook.kind === event.kind).length;
}

async function invokeStoredHook(
  hook: StoredCodeHookView,
  event: AppHookEvent,
  attempt: number,
): Promise<StoredAppHookInvocation> {
  const reference = referenceForHook(hook);
  try {
    const code = await readSecretPlaintextById(hook.codeSecretId);
    const result = await invokeBuilderFunctionCode(buildStoredHookProgram(hook, event, code), {
      onLog: (entry) => {
        appendLog('app', {
          level: entry.level,
          message: entry.message,
          timestamp: entry.timestamp,
          reference,
        });
      },
    });
    if (result.ok) {
      return {
        hookId: hook.hookId,
        appId: hook.appId,
        ok: true,
        attempt,
        result: result.result,
        logCount: result.logs.length,
        runtime: result.runtime,
        durationMs: result.durationMs,
      };
    }
    appendLog('app', {
      level: 'error',
      message: `stored hook ${hook.hookId} (${hook.kind}) failed: ${result.error}`,
      reference,
    });
    return {
      hookId: hook.hookId,
      appId: hook.appId,
      ok: false,
      attempt,
      error: result.error,
      logCount: result.logs.length,
      runtime: result.runtime,
      durationMs: result.durationMs,
      ...(result.timedOut ? { timedOut: true } : {}),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    appendLog('app', {
      level: 'error',
      message: `stored hook ${hook.hookId} (${hook.kind}) failed: ${message}`,
      reference,
    });
    return {
      hookId: hook.hookId,
      appId: hook.appId,
      ok: false,
      attempt,
      error: message,
      logCount: 0,
    };
  }
}

async function invokeAndRecordStoredHook(
  hook: StoredCodeHookView,
  event: AppHookEvent,
  attempt: number,
  bestEffort: boolean,
  retryOfDeliveryId?: string,
): Promise<{ readonly invocation: StoredAppHookInvocation; readonly delivery?: StoredAppHookDeliveryRecord }> {
  const invocation = await invokeStoredHook(hook, event, attempt);
  try {
    const delivery = await recordStoredAppHookDelivery({
      appId: hook.appId,
      hookId: hook.hookId,
      kind: hook.kind,
      event,
      attempt,
      ...(retryOfDeliveryId ? { retryOfDeliveryId } : {}),
      outcome: invocation,
    });
    return {
      invocation: { ...invocation, deliveryId: delivery.deliveryId },
      delivery,
    };
  } catch (error) {
    if (!bestEffort) throw error;
    appendLog('app', {
      level: 'error',
      message: `stored hook ${hook.hookId} delivery persist failed: ${error instanceof Error ? error.message : String(error)}`,
      reference: referenceForHook(hook),
    });
    return { invocation };
  }
}

export async function dispatchStoredAppHookCode(event: AppHookEvent): Promise<StoredAppHookDispatchSummary> {
  const dispatchedAt = new Date().toISOString();
  const hooks = await listRegisteredAppHooks();
  const runnable = hooks
    .filter((hook) => hook.kind === event.kind)
    .filter(hasStoredCode);
  const invocations: StoredAppHookInvocation[] = [];
  for (const hook of runnable) {
    const result = await invokeAndRecordStoredHook(hook, event, 1, true);
    invocations.push(result.invocation);
  }
  const invoked = invocations.filter((result) => result.ok).length;
  const failed = invocations.length - invoked;
  return {
    kind: event.kind,
    invoked,
    failed,
    skipped: countStoredHooks(event, hooks) - runnable.length,
    dispatchedAt,
    hooks: invocations,
  };
}

export async function retryStoredAppHookDelivery(deliveryId: string): Promise<StoredAppHookRetryResult> {
  const prior = await getStoredAppHookDelivery(deliveryId);
  if (!prior) return { status: 'not-found' };
  const hooks = await listRegisteredAppHooks();
  const hook = hooks.find((candidate) => (
    candidate.hookId === prior.hookId
    && candidate.appId === prior.appId
    && candidate.kind === prior.kind
  ));
  if (!hook || !hasStoredCode(hook)) return { status: 'unavailable' };
  const result = await invokeAndRecordStoredHook(hook, prior.event, prior.attempt + 1, false, prior.deliveryId);
  if (!result.delivery) return { status: 'unavailable' };
  return {
    status: 'retried',
    delivery: result.delivery,
    invocation: result.invocation,
  };
}

export async function dispatchAppHookEvent(event: AppHookEvent): Promise<AppHookDispatchEventSummary> {
  const live = await dispatchAppHook(event);
  const stored = await dispatchStoredAppHookCode(event);
  return {
    kind: event.kind,
    invoked: live.invoked + stored.invoked,
    failed: live.failed + stored.failed,
    dispatchedAt: stored.dispatchedAt,
    live,
    stored,
  };
}
