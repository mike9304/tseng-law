import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createReviewSession,
  listReviewSessions,
} from '@/lib/builder/security/review-tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const createSchema = z.object({
  branchOrPageId: z.string().trim().min(1).max(180),
  ttlMs: z.number().int().positive().max(1000 * 60 * 60 * 24 * 30).optional(),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'edit-pages',
  });
  if (auth instanceof NextResponse) return auth;
  const sessions = await listReviewSessions();
  return NextResponse.json({ ok: true, sessions });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'edit-pages',
  });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = createSchema.parse(await request.json());
    const result = await createReviewSession({
      branchOrPageId: input.branchOrPageId,
      ttlMs: input.ttlMs,
      createdBy: auth.username,
    });
    return NextResponse.json(
      { ok: true, session: result.session, token: result.token, url: result.url },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 400 },
    );
  }
}