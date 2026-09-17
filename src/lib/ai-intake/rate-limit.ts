import { checkRateLimit, type RateLimitResult } from '@/lib/builder/security/rate-limit';
import { AI_INTAKE_RATE_LIMITS, AI_INTAKE_RATE_WINDOW_MS } from '@/lib/ai-intake/constants';
import type { AiIntakeClient } from '@/lib/ai-intake/auth';
import { enforceAiIntakeSubmitRateLimit } from '@/lib/ai-intake/submit-rate-limit';

export type AiIntakeRateScope = 'requirements' | 'preview' | 'submit';

export type AiIntakeRateDecision =
  | { allowed: true }
  | { allowed: false; kind: 'throttled'; retryAfterSeconds: number }
  | { allowed: false; kind: 'backend_unavailable' };

function worse(a: RateLimitResult, b: RateLimitResult): RateLimitResult {
  if (a.reason === 'backend_unavailable') return a;
  if (b.reason === 'backend_unavailable') return b;
  if (!a.allowed && !b.allowed) {
    return a.retryAfterMs >= b.retryAfterMs ? a : b;
  }
  if (!a.allowed) return a;
  if (!b.allowed) return b;
  return a;
}

async function enforceSoftOperationalLimit(input: {
  scope: Exclude<AiIntakeRateScope, 'submit'>;
  client: AiIntakeClient;
  ip: string;
}): Promise<AiIntakeRateDecision> {
  const defaults = AI_INTAKE_RATE_LIMITS[input.scope];
  const clientMax = input.client.limits
    ? (
      input.scope === 'requirements'
        ? input.client.limits.requirementsMax
        : input.client.limits.previewMax
    ) ?? defaults.client
    : defaults.client;

  const [clientResult, ipResult] = await Promise.all([
    checkRateLimit(`ai-intake:${input.scope}:client:${input.client.clientId}`, clientMax, AI_INTAKE_RATE_WINDOW_MS),
    checkRateLimit(`ai-intake:${input.scope}:ip:${input.ip}`, defaults.ip, AI_INTAKE_RATE_WINDOW_MS),
  ]);
  const result = worse(clientResult, ipResult);
  if (result.reason === 'backend_unavailable') {
    return { allowed: false, kind: 'backend_unavailable' };
  }
  if (!result.allowed) {
    return {
      allowed: false,
      kind: 'throttled',
      retryAfterSeconds: Math.max(1, Math.ceil(result.retryAfterMs / 1000)),
    };
  }
  return { allowed: true };
}

export async function enforceAiIntakeRateLimit(input: {
  scope: AiIntakeRateScope;
  client: AiIntakeClient;
  ip: string;
}): Promise<AiIntakeRateDecision> {
  if (input.scope === 'submit') {
    return enforceAiIntakeSubmitRateLimit({
      client: input.client,
      ip: input.ip,
    });
  }
  return enforceSoftOperationalLimit({
    scope: input.scope,
    client: input.client,
    ip: input.ip,
  });
}
