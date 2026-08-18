/**
 * F106 + F110 — Invoke a stored serverless function in a bounded sandbox.
 *
 * The user-authored code runs inside a worker thread with a vm context and
 * timeout. This is still an authenticated admin/dev tool, not a production
 * multi-tenant isolation boundary; promote to Vercel Sandbox or equivalent
 * before exposing to untrusted authors.
 *
 * console.log/info/warn/error calls inside the function are mirrored to
 * the F110 logs-store (source='function') via the injected `log` helper.
 */

import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { readBuilderFunctions } from '@/lib/builder/dev/functions-model';
import { invokeBuilderFunctionCode } from '@/lib/builder/dev/function-invoker';
import { appendLog } from '@/lib/builder/dev/logs-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const list = await readBuilderFunctions();
  const fn = list.find((entry) => entry.id === params.id || entry.slug === params.id);
  if (!fn) {
    return NextResponse.json({ ok: false, error: 'Function not found' }, { status: 404 });
  }
  if (!fn.enabled) {
    return NextResponse.json({ ok: false, error: 'Function disabled' }, { status: 409 });
  }

  const invocation = await invokeBuilderFunctionCode(fn.code, {
    onLog: (entry) => {
      appendLog('function', { ...entry, reference: fn.slug });
    },
  });

  if (invocation.ok) {
    return NextResponse.json(invocation);
  }

  appendLog('function', { level: 'error', message: invocation.error, reference: fn.slug });
  return NextResponse.json(invocation, { status: invocation.timedOut ? 408 : 500 });
}
