/**
 * F106 — Serverless function PATCH / DELETE endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  readBuilderFunctions,
  saveBuilderFunctions,
  validateBuilderFunctionInput,
} from '@/lib/builder/dev/functions-model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  slug: z.string().trim().min(1).max(64).optional(),
  code: z.string().max(20000).optional(),
  enabled: z.boolean().optional(),
}).strict();

function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  try {
    const payload = patchSchema.parse(await request.json());
    const list = await readBuilderFunctions();
    const index = list.findIndex((fn) => fn.id === params.id);
    if (index === -1) {
      return NextResponse.json({ ok: false, error: 'Function not found' }, { status: 404 });
    }
    const existing = list[index];
    const merged = {
      ...existing,
      ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
      ...(payload.slug !== undefined ? { slug: payload.slug.trim().toLowerCase() } : {}),
      ...(payload.code !== undefined ? { code: payload.code } : {}),
      ...(payload.enabled !== undefined ? { enabled: payload.enabled } : {}),
      updatedAt: new Date().toISOString(),
    };
    const issue = validateBuilderFunctionInput(
      { name: merged.name, slug: merged.slug, code: merged.code },
      list,
      existing.id,
    );
    if (issue) {
      return NextResponse.json({ ok: false, error: 'validation_error', issue }, { status: 400 });
    }
    const next = [...list];
    next[index] = merged;
    await saveBuilderFunctions(next);
    return NextResponse.json({ ok: true, function: merged });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  try {
    const list = await readBuilderFunctions();
    const next = list.filter((fn) => fn.id !== params.id);
    if (next.length === list.length) {
      return NextResponse.json({ ok: false, error: 'Function not found' }, { status: 404 });
    }
    await saveBuilderFunctions(next);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}