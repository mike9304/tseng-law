import { createHash, createHmac } from 'node:crypto';
import { z } from 'zod';
import { safeEqualStrings } from '@/lib/builder/security/timing-safe';
import {
  AI_INTAKE_CLIENT_ID_PATTERN,
  AI_INTAKE_HMAC_MIN_LENGTH,
  AI_INTAKE_INTAKE_ID_PATTERN,
  AI_INTAKE_MAX_TOKEN_CHARS,
  AI_INTAKE_MAX_TOKEN_PAYLOAD_CHARS,
  AI_INTAKE_REQUIREMENTS_VERSION,
  AI_INTAKE_SHA256_HEX_PATTERN,
  AI_INTAKE_TOKEN_CLOCK_SKEW_SECONDS,
  AI_INTAKE_TOKEN_TTL_SECONDS,
  AI_INTAKE_TOKEN_VERSION,
} from '@/lib/ai-intake/constants';
import { aiIntakeNowSeconds, aiIntakeRandomUuid } from '@/lib/ai-intake/clock';

const tokenPayloadSchema = z
  .object({
    v: z.literal(AI_INTAKE_TOKEN_VERSION),
    digest: z.string().regex(AI_INTAKE_SHA256_HEX_PATTERN),
    intakeId: z.string().regex(AI_INTAKE_INTAKE_ID_PATTERN),
    clientId: z.string().regex(AI_INTAKE_CLIENT_ID_PATTERN),
    idempotencyKeyHash: z.string().regex(AI_INTAKE_SHA256_HEX_PATTERN),
    jti: z.string().uuid(),
    requirementsVersion: z.literal(AI_INTAKE_REQUIREMENTS_VERSION),
    iat: z.number().int().positive(),
    exp: z.number().int().positive(),
  })
  .strict();

export type AiIntakeTokenPayload = z.infer<typeof tokenPayloadSchema>;

export type AiIntakeTokenVerifyResult =
  | { ok: true; payload: AiIntakeTokenPayload }
  | { ok: false; reason: 'invalid' | 'expired' | 'config' };

function hmacSecret(): string | null {
  const secret = process.env.AI_INTAKE_HMAC_SECRET;
  if (!secret || secret.length < AI_INTAKE_HMAC_MIN_LENGTH) return null;
  if (/^\s+$/.test(secret)) return null;
  const unique = new Set(secret);
  if (unique.size < 8) return null;
  return secret;
}

function signPayloadPart(payloadPart: string, secret: string): string {
  return createHmac('sha256', secret).update(payloadPart, 'utf8').digest('base64url');
}

function canonicalPayloadJson(payload: AiIntakeTokenPayload): string {
  return JSON.stringify({
    v: payload.v,
    digest: payload.digest,
    intakeId: payload.intakeId,
    clientId: payload.clientId,
    idempotencyKeyHash: payload.idempotencyKeyHash,
    jti: payload.jti,
    requirementsVersion: payload.requirementsVersion,
    iat: payload.iat,
    exp: payload.exp,
  });
}

export function mintAiIntakeConfirmationToken(input: {
  digest: string;
  intakeId: string;
  clientId: string;
  idempotencyKeyHash: string;
  nowSeconds?: number;
}): { token: string; expiresAt: string; payload: AiIntakeTokenPayload } {
  const secret = hmacSecret();
  if (!secret) {
    throw new AiIntakeTokenConfigError();
  }
  const iat = input.nowSeconds ?? aiIntakeNowSeconds();
  const payload: AiIntakeTokenPayload = {
    v: AI_INTAKE_TOKEN_VERSION,
    digest: input.digest,
    intakeId: input.intakeId,
    clientId: input.clientId,
    idempotencyKeyHash: input.idempotencyKeyHash,
    jti: aiIntakeRandomUuid(),
    requirementsVersion: AI_INTAKE_REQUIREMENTS_VERSION,
    iat,
    exp: iat + AI_INTAKE_TOKEN_TTL_SECONDS,
  };
  const payloadPart = Buffer.from(canonicalPayloadJson(payload), 'utf8').toString('base64url');
  const token = `${payloadPart}.${signPayloadPart(payloadPart, secret)}`;
  return {
    token,
    expiresAt: new Date(payload.exp * 1000).toISOString(),
    payload,
  };
}

export function verifyAiIntakeConfirmationToken(
  token: string,
  nowSeconds: number = aiIntakeNowSeconds(),
): AiIntakeTokenVerifyResult {
  const secret = hmacSecret();
  if (!secret) return { ok: false, reason: 'config' };
  if (typeof token !== 'string' || token.length < 16 || token.length > AI_INTAKE_MAX_TOKEN_CHARS) {
    return { ok: false, reason: 'invalid' };
  }
  const parts = token.split('.');
  if (parts.length !== 2) return { ok: false, reason: 'invalid' };
  const [payloadPart, signature] = parts;
  if (!payloadPart || !signature) return { ok: false, reason: 'invalid' };
  if (payloadPart.length > AI_INTAKE_MAX_TOKEN_PAYLOAD_CHARS || signature.length > 128) {
    return { ok: false, reason: 'invalid' };
  }
  if (!/^[A-Za-z0-9_-]+$/.test(payloadPart) || !/^[A-Za-z0-9_-]+$/.test(signature)) {
    return { ok: false, reason: 'invalid' };
  }
  const expected = signPayloadPart(payloadPart, secret);
  if (!safeEqualStrings(signature, expected)) return { ok: false, reason: 'invalid' };

  let json: string;
  try {
    json = Buffer.from(payloadPart, 'base64url').toString('utf8');
  } catch {
    return { ok: false, reason: 'invalid' };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, reason: 'invalid' };
  }
  const payloadResult = tokenPayloadSchema.safeParse(parsed);
  if (!payloadResult.success) return { ok: false, reason: 'invalid' };
  const payload = payloadResult.data;
  if (payload.exp <= payload.iat) return { ok: false, reason: 'invalid' };
  if (payload.exp - payload.iat > AI_INTAKE_TOKEN_TTL_SECONDS + AI_INTAKE_TOKEN_CLOCK_SKEW_SECONDS) {
    return { ok: false, reason: 'invalid' };
  }
  if (payload.iat > nowSeconds + AI_INTAKE_TOKEN_CLOCK_SKEW_SECONDS) {
    return { ok: false, reason: 'invalid' };
  }
  if (payload.exp < nowSeconds - AI_INTAKE_TOKEN_CLOCK_SKEW_SECONDS) {
    return { ok: false, reason: 'expired' };
  }
  return { ok: true, payload };
}

export function hashAiIntakeIdempotencyKey(idempotencyKey: string): string {
  return createHash('sha256').update(idempotencyKey, 'utf8').digest('hex');
}

export class AiIntakeTokenConfigError extends Error {
  readonly code = 'token_config';
  constructor() {
    super('ai_intake_token_config');
    this.name = 'AiIntakeTokenConfigError';
  }
}
