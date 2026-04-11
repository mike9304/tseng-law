import { NextRequest, NextResponse } from 'next/server';
import { buildColumnEmbeddingsFile } from '@/lib/consultation/embeddings-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
/** Building embeddings can take ~30s and does real OpenAI calls. */
export const maxDuration = 300;

/**
 * Dev-gated endpoint that rebuilds the pre-computed column embedding
 * file. Mirror of /api/consultation/eval's guard: free in development
 * (localhost only), requires CONSULTATION_EVAL_SECRET in production.
 */
function guardOrNull(request: NextRequest): NextResponse | null {
  if (process.env.NODE_ENV === 'development') return null;

  const expected = process.env.CONSULTATION_EVAL_SECRET;
  if (!expected) {
    return NextResponse.json(
      { success: false, error: 'Embeddings build endpoint is disabled in production.' },
      { status: 403 },
    );
  }

  const provided = request.headers.get('x-eval-secret');
  if (provided !== expected) {
    return NextResponse.json(
      { success: false, error: 'Invalid or missing secret.' },
      { status: 403 },
    );
  }

  return null;
}

export async function POST(request: NextRequest) {
  const blocked = guardOrNull(request);
  if (blocked) return blocked;

  try {
    const result = await buildColumnEmbeddingsFile();
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('[consultation] embeddings build failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'unknown_build_failure',
      },
      { status: 500 },
    );
  }
}
