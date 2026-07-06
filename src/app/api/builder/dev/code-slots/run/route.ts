import { NextRequest, NextResponse } from 'next/server';
import {
  parseCanvasCodeSlotRunPayload,
  runCanvasCodeSlot,
} from '@/lib/builder/dev/code-slots';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function invalidJsonResponse(): NextResponse {
  return NextResponse.json(
    { ok: false, errorCode: 'invalid_json', error: 'Request body must be valid JSON.' },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof TypeError) {
      return invalidJsonResponse();
    }
    throw error;
  }

  const parsed = parseCanvasCodeSlotRunPayload(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, errorCode: parsed.errorCode, error: parsed.error },
      { status: parsed.status },
    );
  }

  const invocation = await runCanvasCodeSlot(parsed.payload);
  const status = 'status' in invocation
    ? invocation.status
    : invocation.ok
      ? 200
      : invocation.timedOut
        ? 408
        : 500;

  return NextResponse.json(
    invocation,
    { status },
  );
}
