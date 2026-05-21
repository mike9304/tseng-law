/**
 * F112 — Secrets list + create endpoint.
 *
 * GET returns metadata only (never plaintext).
 * POST creates a secret and returns the plaintext ONCE so the UI can
 * surface a one-time reveal modal. Both calls require the
 * `manage-secrets` permission via guardMutation/guardBuilderRead.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  createSecret,
  listSecrets,
  SecretValidationFailure,
} from '@/lib/builder/dev/secrets-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const createSchema = z.object({
  key: z.string().trim().min(1).max(64),
  value: z.string().min(1).max(8192),
  scope: z.enum(['site', 'function']),
  allowedFunctions: z.array(z.string().trim().min(1)).optional(),
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
    const secrets = await listSecrets();
    return NextResponse.json({ ok: true, secrets });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-secrets' });
  if (auth instanceof NextResponse) return auth;
  try {
    const payload = createSchema.parse(await request.json());
    const result = await createSecret({
      key: payload.key,
      value: payload.value,
      scope: payload.scope,
      allowedFunctions: payload.allowedFunctions,
      addedBy: auth.username,
    });
    return NextResponse.json({ ok: true, secret: result.secret, plaintext: result.plaintext }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
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