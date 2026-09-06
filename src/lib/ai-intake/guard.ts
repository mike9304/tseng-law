import type { NextRequest, NextResponse } from 'next/server';
import { authenticateAiIntakeRequest, type AiIntakeClient } from '@/lib/ai-intake/auth';
import { aiIntakeError, clientIpFromRequest } from '@/lib/ai-intake/http';
import { enforceAiIntakeRateLimit, type AiIntakeRateScope } from '@/lib/ai-intake/rate-limit';

export type AiIntakeGuardOk = {
  ok: true;
  client: AiIntakeClient;
  ip: string;
};

export async function guardAiIntakeRequest(
  request: NextRequest,
  scope: AiIntakeRateScope,
): Promise<AiIntakeGuardOk | NextResponse> {
  const auth = authenticateAiIntakeRequest(request.headers);
  if (!auth.ok) {
    if (auth.reason === 'config') {
      return aiIntakeError(503, 'CONFIG_UNAVAILABLE', 'Intake authentication is not configured.');
    }
    return aiIntakeError(401, 'UNAUTHENTICATED', 'Authentication is required.');
  }

  const ip = clientIpFromRequest(request.headers);
  let rate;
  try {
    rate = await enforceAiIntakeRateLimit({ scope, client: auth.client, ip });
  } catch {
    return aiIntakeError(503, 'BACKEND_UNAVAILABLE', 'Rate-limit storage is not available.');
  }
  if (!rate.allowed) {
    if (rate.kind === 'backend_unavailable') {
      return aiIntakeError(503, 'BACKEND_UNAVAILABLE', 'Rate-limit storage is not available.');
    }
    return aiIntakeError(
      429,
      'RATE_LIMITED',
      'Request limit reached. Retry later.',
      { retryAfterSeconds: rate.retryAfterSeconds },
      { 'Retry-After': String(rate.retryAfterSeconds) },
    );
  }

  return { ok: true, client: auth.client, ip };
}
