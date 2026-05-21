/**
 * F106 + F110 — Invoke a stored serverless function in a naive sandbox.
 *
 * Sandbox is `new Function('ctx', code)({ now, log })`. This is NOT a
 * security boundary — the running code shares the Node.js process with
 * the API route. Acceptable for a first-slice authenticated admin tool;
 * promote to vm2 / Vercel Sandbox before exposing to untrusted authors.
 *
 * console.log/info/warn/error calls inside the function are mirrored to
 * the F110 logs-store (source='function') via the injected `log` helper.
 */

import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { readBuilderFunctions } from '@/lib/builder/dev/functions-model';
import { appendLog, type DevLogLevel } from '@/lib/builder/dev/logs-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface InvocationLog {
  level: DevLogLevel;
  message: string;
  timestamp: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const list = await readBuilderFunctions();
  const fn = list.find((entry) => entry.id === params.id);
  if (!fn) {
    return NextResponse.json({ ok: false, error: 'Function not found' }, { status: 404 });
  }
  if (!fn.enabled) {
    return NextResponse.json({ ok: false, error: 'Function disabled' }, { status: 409 });
  }

  const logs: InvocationLog[] = [];
  const log = (level: DevLogLevel, ...args: unknown[]) => {
    const message = args
      .map((arg) => {
        if (typeof arg === 'string') return arg;
        try { return JSON.stringify(arg); } catch { return String(arg); }
      })
      .join(' ');
    const entry: InvocationLog = { level, message, timestamp: new Date().toISOString() };
    logs.push(entry);
    appendLog('function', { level, message, reference: fn.slug });
  };

  const ctx = {
    now: () => new Date().toISOString(),
    log: (...args: unknown[]) => log('log', ...args),
    info: (...args: unknown[]) => log('info', ...args),
    warn: (...args: unknown[]) => log('warn', ...args),
    error: (...args: unknown[]) => log('error', ...args),
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const runner = new Function('ctx', fn.code);
    const result = await Promise.resolve(runner(ctx));
    return NextResponse.json({ ok: true, result, logs });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    appendLog('function', { level: 'error', message, reference: fn.slug });
    return NextResponse.json({ ok: false, error: message, logs }, { status: 500 });
  }
}