/** Requirements document version bound into confirmation tokens. Bump when questions or notices change. */
export const AI_INTAKE_REQUIREMENTS_VERSION = 'ai-intake-requirements-v3';

/**
 * Canonical email serialization version.
 * Digest = SHA-256(UTF-8(`${AI_INTAKE_CANONICAL_VERSION}\\n${subject}\\n${body}`)).
 * Separator is a single LF. Subject is server-generated and never contains CR/LF.
 * Body may contain LF after CRLF normalization.
 */
export const AI_INTAKE_CANONICAL_VERSION = 'ai-intake-canonical-v1';
export const AI_INTAKE_CANONICAL_SEPARATOR = '\n';

export const AI_INTAKE_TOKEN_VERSION = 1;
export const AI_INTAKE_TOKEN_TTL_SECONDS = 10 * 60;
/** Verification allows this much clock skew on iat/exp. Documented in docs/ai/AI-CONSULTATION-INTAKE.md. */
export const AI_INTAKE_TOKEN_CLOCK_SKEW_SECONDS = 30;
export const AI_INTAKE_MAX_TOKEN_CHARS = 2048;
export const AI_INTAKE_MAX_TOKEN_PAYLOAD_CHARS = 1024;

export const AI_INTAKE_HMAC_MIN_LENGTH = 32;
export const AI_INTAKE_MAX_CLIENTS = 16;
export const AI_INTAKE_MAX_CLIENTS_JSON_CHARS = 8_192;
export const AI_INTAKE_MAX_BODY_BYTES = 32_768;
export const AI_INTAKE_MAX_BEARER_CHARS = 256;
export const AI_INTAKE_MIN_BEARER_CHARS = 16;

export const AI_INTAKE_CLAIM_TTL_MS = 30 * 24 * 60 * 60 * 1000;
/** Fresh `sending` lease. After this, a duplicate must not resend and is delivery-unknown. */
export const AI_INTAKE_SENDING_LEASE_MS = 120_000;
export const AI_INTAKE_CLAIM_RECORD_VERSION = 1;
export const AI_INTAKE_MEMORY_CLAIM_CAP = 2_000;
export const AI_INTAKE_MEMORY_RATE_CAP = 2_000;
export const AI_INTAKE_DIGEST_LOG_PREFIX_LENGTH = 12;
export const AI_INTAKE_UPSTASH_RESPONSE_MAX_CHARS = 4_096;

export const AI_INTAKE_RATE_WINDOW_MS = 5 * 60_000;
export const AI_INTAKE_RATE_LIMITS = {
  requirements: { client: 120, ip: 240 },
  preview: { client: 30, ip: 60 },
  submit: { client: 8, ip: 12 },
} as const;

export const AI_INTAKE_INTAKE_ID_PATTERN = /^HC-[A-F0-9]{8}$/;
export const AI_INTAKE_SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;
export const AI_INTAKE_CLIENT_ID_PATTERN = /^[a-zA-Z][a-zA-Z0-9._-]{0,63}$/;

export const AI_INTAKE_BLOB_PREFIX = 'ai-intake/claims/';
export const AI_INTAKE_UPSTASH_KEY_PREFIX = 'ai-intake:claim:';
export const AI_INTAKE_UPSTASH_RATE_KEY_PREFIX = 'ai-intake:rate:submit:';
export const AI_INTAKE_BACKEND_TIMEOUT_MS = 2_000;
/** AI-intake submit audit wait bound. Shared browser consultation log-storage is unchanged. */
export const AI_INTAKE_AUDIT_TIMEOUT_MS = AI_INTAKE_BACKEND_TIMEOUT_MS;
