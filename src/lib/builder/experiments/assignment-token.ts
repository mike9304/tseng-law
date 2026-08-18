import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const DEFAULT_TTL_MS = 1000 * 60 * 30;
const MIN_SECRET_BYTES = 32;
const LOCAL_DEVELOPMENT_SECRET =
  'local-experiment-assignment-secret-for-development-and-tests-only';

interface AssignmentTokenPayload {
  experimentId: string;
  variantId: string;
  sessionBinding: string;
  exp: number;
}

export interface VerifiedExperimentAssignment {
  experimentId: string;
  variantId: string;
}

function isStrongSecret(value: string | undefined): value is string {
  return Boolean(
    value?.trim()
    && Buffer.byteLength(value.trim(), 'utf8') >= MIN_SECRET_BYTES
  );
}

function resolveSecret(): string | null {
  const candidates = [
    process.env.EXPERIMENT_ASSIGNMENT_SECRET,
    process.env.CMS_SESSION_SECRET,
    process.env.NEXTAUTH_SECRET,
  ];
  for (const candidate of candidates) {
    if (isStrongSecret(candidate)) return candidate.trim();
  }
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return LOCAL_DEVELOPMENT_SECRET;
  }
  return null;
}

function sessionBinding(sessionId: string): string {
  return createHash('sha256').update(sessionId).digest('base64url');
}

function sign(payloadPart: string, secret: string): string {
  return createHmac('sha256', secret).update(payloadPart).digest('base64url');
}

export function createExperimentAssignmentToken(
  experimentId: string,
  variantId: string,
  sessionId: string,
  ttlMs = DEFAULT_TTL_MS,
): string {
  const secret = resolveSecret();
  if (!secret) {
    throw new Error(
      'EXPERIMENT_ASSIGNMENT_SECRET must be configured with at least 32 bytes.',
    );
  }
  const payload: AssignmentTokenPayload = {
    experimentId,
    variantId,
    sessionBinding: sessionBinding(sessionId),
    exp: Date.now() + ttlMs,
  };
  const payloadPart = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${payloadPart}.${sign(payloadPart, secret)}`;
}

export function verifyExperimentAssignmentToken(
  token: string,
  sessionId: string,
): VerifiedExperimentAssignment | null {
  const [payloadPart, providedSignature, ...extra] = token.split('.');
  if (!payloadPart || !providedSignature || extra.length > 0) return null;

  const secret = resolveSecret();
  if (!secret) return null;
  const expectedSignature = sign(payloadPart, secret);
  const expectedBuffer = Buffer.from(expectedSignature);
  const providedBuffer = Buffer.from(providedSignature);
  if (
    expectedBuffer.length !== providedBuffer.length
    || !timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadPart, 'base64url').toString('utf8'),
    ) as Partial<AssignmentTokenPayload>;
    if (
      typeof payload.experimentId !== 'string'
      || !payload.experimentId
      || typeof payload.variantId !== 'string'
      || !payload.variantId
      || typeof payload.sessionBinding !== 'string'
      || payload.sessionBinding !== sessionBinding(sessionId)
      || typeof payload.exp !== 'number'
      || !Number.isSafeInteger(payload.exp)
      || payload.exp < Date.now()
    ) {
      return null;
    }
    return {
      experimentId: payload.experimentId,
      variantId: payload.variantId,
    };
  } catch {
    return null;
  }
}
