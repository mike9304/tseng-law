import { Worker } from 'node:worker_threads';
import type { DevLogLevel } from '@/lib/builder/dev/logs-store';

export const BUILDER_FUNCTION_INVOCATION_RUNTIME = 'worker-vm' as const;
export const BUILDER_FUNCTION_INVOCATION_TIMEOUT_MS = 1000;
const BUILDER_FUNCTION_SYNC_TIMEOUT_MS = 250;

export interface InvocationLog {
  level: DevLogLevel;
  message: string;
  timestamp: string;
}

export type BuilderFunctionInvocationResult =
  | {
    ok: true;
    result: unknown;
    logs: InvocationLog[];
    runtime: typeof BUILDER_FUNCTION_INVOCATION_RUNTIME;
    durationMs: number;
  }
  | {
    ok: false;
    error: string;
    logs: InvocationLog[];
    runtime: typeof BUILDER_FUNCTION_INVOCATION_RUNTIME;
    durationMs: number;
    timedOut?: boolean;
  };

interface InvokeOptions {
  onLog?: (entry: InvocationLog) => void;
  timeoutMs?: number;
}

type WorkerMessage =
  | { type: 'result'; result: unknown; logs: InvocationLog[] }
  | { type: 'error'; error: string; logs: InvocationLog[] };

type InvocationFinish =
  | { ok: true; result: unknown }
  | { ok: false; error: string; timedOut?: boolean };

const WORKER_SOURCE = `
const { parentPort, workerData } = require('node:worker_threads');
const vm = require('node:vm');

(async () => {
  const sandbox = {
    process: undefined,
    require: undefined,
    module: undefined,
    exports: undefined,
    Buffer: undefined,
    fetch: undefined,
    setTimeout: undefined,
    setInterval: undefined,
    clearTimeout: undefined,
    clearInterval: undefined,
  };

  try {
    const script = new vm.Script(
      \`"use strict";
const __builderLogs = [];

function __builderStringify(arg) {
  if (typeof arg === 'string') return arg;
  if (typeof arg === 'undefined') return 'undefined';
  try {
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
}

function __builderLog(level, ...args) {
  __builderLogs.push({
    level,
    message: args.map(__builderStringify).join(' '),
    timestamp: new Date().toISOString(),
  });
}

function __builderSafeResult(value) {
  if (typeof value === 'undefined') return null;
  if (typeof value === 'bigint') return value.toString();
  if (typeof value === 'function' || typeof value === 'symbol') return String(value);
  return value;
}

const ctx = Object.freeze({
  now: () => new Date().toISOString(),
  log: (...args) => __builderLog('log', ...args),
  info: (...args) => __builderLog('info', ...args),
  warn: (...args) => __builderLog('warn', ...args),
  error: (...args) => __builderLog('error', ...args),
});
const console = Object.freeze({
  log: (...args) => __builderLog('log', ...args),
  info: (...args) => __builderLog('info', ...args),
  warn: (...args) => __builderLog('warn', ...args),
  error: (...args) => __builderLog('error', ...args),
});

(async () => {
  try {
    const result = await (async (ctx) => {
\` + workerData.code + \`
    })(ctx);
    return { ok: true, result: __builderSafeResult(result), logs: __builderLogs.slice() };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      logs: __builderLogs.slice(),
    };
  }
})();\`,
      { filename: 'builder-function.js' },
    );
    const completion = await script.runInContext(vm.createContext(sandbox), {
      timeout: workerData.syncTimeoutMs,
    });
    if (completion.ok) {
      parentPort.postMessage({ type: 'result', result: completion.result, logs: completion.logs });
      return;
    }
    parentPort.postMessage({ type: 'error', error: completion.error, logs: completion.logs });
  } catch (error) {
    parentPort.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
      logs: [],
    });
  }
})();
`;

export function invokeBuilderFunctionCode(code: string, options: InvokeOptions = {}): Promise<BuilderFunctionInvocationResult> {
  const timeoutMs = options.timeoutMs ?? BUILDER_FUNCTION_INVOCATION_TIMEOUT_MS;
  const startedAt = Date.now();
  const logs: InvocationLog[] = [];

  return new Promise((resolve) => {
    let settled = false;
    const worker = new Worker(WORKER_SOURCE, {
      eval: true,
      workerData: {
        code,
        syncTimeoutMs: Math.min(BUILDER_FUNCTION_SYNC_TIMEOUT_MS, timeoutMs),
      },
    });

    const finish = (result: InvocationFinish) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      worker.terminate().catch(() => undefined);
      const durationMs = Date.now() - startedAt;
      if (result.ok) {
        resolve({
          ok: true,
          result: result.result,
          logs,
          runtime: BUILDER_FUNCTION_INVOCATION_RUNTIME,
          durationMs,
        });
        return;
      }
      resolve({
        ok: false,
        error: result.error,
        logs,
        runtime: BUILDER_FUNCTION_INVOCATION_RUNTIME,
        durationMs,
        timedOut: result.timedOut,
      });
    };

    const timeout = setTimeout(() => {
      finish({
        ok: false,
        error: `Function execution exceeded ${timeoutMs}ms timeout`,
        timedOut: true,
      });
    }, timeoutMs);

    const recordLogs = (entries: InvocationLog[]) => {
      logs.push(...entries);
      for (const entry of entries) {
        options.onLog?.(entry);
      }
    };

    worker.on('message', (message: WorkerMessage) => {
      recordLogs(message.logs);
      if (message.type === 'result') {
        finish({ ok: true, result: message.result });
        return;
      }
      finish({ ok: false, error: message.error });
    });

    worker.on('error', (error) => {
      finish({ ok: false, error: error.message });
    });

    worker.on('exit', (codeValue) => {
      if (!settled && codeValue !== 0) {
        finish({ ok: false, error: `Function worker exited with code ${codeValue}` });
      }
    });
  });
}
