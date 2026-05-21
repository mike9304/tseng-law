/**
 * F106 — Serverless functions list + create endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  createBuilderFunction,
  readBuilderFunctions,
  saveBuilderFunctions,
  validateBuilderFunctionInput,
} from '@/lib/builder/dev/functions-model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const createSchema = z.object({
  name: z.string().trim().min(1).max(80),
  slug: z.string().trim().min(1).max(64),
  code: z.string().max(20000).optional(),
  enabled: z.boolean().optional(),
}).strict();

function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const functions = await readBuilderFunctions();
    return NextResponse.json({ ok: true, functions });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  try {
    const payload = createSchema.parse(await request.json());
    const existing = await readBuilderFunctions();
    const issue = validateBuilderFunctionInput(
      { name: payload.name, slug: payload.slug, code: payload.code ?? '' },
      existing,
    );
    if (issue) {
      return NextResponse.json({ ok: false, error: 'validation_error', issue }, { status: 400 });
    }
    const fn = createBuilderFunction({
      name: payload.name,
      slug: payload.slug,
      code: payload.code ?? '',
      enabled: payload.enabled,
    });
    await saveBuilderFunctions([...existing, fn]);
    return NextResponse.json({ ok: true, function: fn }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}