/**
 * F112 — Per-secret rotate (PATCH) + revoke (DELETE).
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  rotateSecret,
  revokeSecret,
  updateSecretAllowedFunctions,
  SecretNotFoundError,
  SecretValidationFailure,
} from '@/lib/builder/dev/secrets-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  value: z.string().min(1).max(8192).optional(),
  allowedFunctions: z.array(z.string().trim().min(1)).optional(),
}).strict();

function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-secrets' });
  if (auth instanceof NextResponse) return auth;
  try {
    const payload = patchSchema.parse(await request.json());
    if (payload.value === undefined && payload.allowedFunctions === undefined) {
      return NextResponse.json(
        { ok: false, error: 'validation_error', issue: { field: 'value', message: 'no fields to update' } },
        { status: 400 },
      );
    }

    let rotateResult: { plaintext: string } | null = null;
    let metadata = null;

    if (payload.value !== undefined) {
      const result = await rotateSecret(params.id, payload.value, auth.username);
      rotateResult = { plaintext: result.plaintext };
      metadata = result.secret;
    }

    if (payload.allowedFunctions !== undefined) {
      metadata = await updateSecretAllowedFunctions(params.id, payload.allowedFunctions);
    }

    const responseBody: Record<string, unknown> = { ok: true, secret: metadata };
    if (rotateResult) responseBody.plaintext = rotateResult.plaintext;
    return NextResponse.json(responseBody);
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    if (error instanceof SecretNotFoundError) {
      return NextResponse.json({ ok: false, error: 'Secret not found' }, { status: 404 });
    }
    if (error instanceof SecretValidationFailure) {
      return NextResponse.json({ ok: false, error: 'validation_error', issue: error.issue }, { status: 400 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-secrets' });
  if (auth instanceof NextResponse) return auth;
  try {
    const removed = await revokeSecret(params.id);
    if (!removed) {
      return NextResponse.json({ ok: false, error: 'Secret not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}