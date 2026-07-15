import { NextRequest, NextResponse } from 'next/server';
import {
  createQaAttestationResponse,
  getQaRuntimeAttestation,
} from '@/lib/builder/security/qa-runtime-attestation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const QA_CHALLENGE_PATTERN = /^[a-f0-9]{64}$/;
const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store',
};

function notFound(): NextResponse {
  return new NextResponse(null, {
    status: 404,
    headers: NO_STORE_HEADERS,
  });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const challenge = request.headers.get('x-builder-qa-challenge');
  if (!challenge || !QA_CHALLENGE_PATTERN.test(challenge)) return notFound();

  try {
    const manifest = getQaRuntimeAttestation({ allowStarting: true });
    if (!manifest) return notFound();

    return NextResponse.json(
      createQaAttestationResponse(manifest, challenge),
      { headers: NO_STORE_HEADERS },
    );
  } catch {
    return notFound();
  }
}
