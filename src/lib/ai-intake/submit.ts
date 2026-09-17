import {
  PreparedAiIntakeMailConfigError,
  prepareAiIntakeMailSend,
} from '@/lib/email/send-consultation-email';
import { safeEqualStrings } from '@/lib/builder/security/timing-safe';
import { compareAiIntakeDigest, isAiIntakeSendingFresh } from '@/lib/ai-intake/claim-state';
import { buildCanonicalAiIntakeEmail } from '@/lib/ai-intake/canonical';
import { aiIntakeNowMs } from '@/lib/ai-intake/clock';
import { getAiIntakeCopy, getAiIntakeSensitiveCorrective } from '@/lib/ai-intake/copy';
import { logAiIntakeEvent, type AiIntakeLogStage } from '@/lib/ai-intake/log';
import { rejectFindings, scanAiIntakeFields } from '@/lib/ai-intake/sensitive';
import {
  getAiIntakeClaimStore,
  type AiIntakeClaimRecord,
  type AiIntakeClaimStore,
  type AiIntakeClaimUpdateOutcome,
} from '@/lib/ai-intake/store';
import {
  hashAiIntakeIdempotencyKey,
  verifyAiIntakeConfirmationToken,
} from '@/lib/ai-intake/token';
import type {
  AiIntakeCategory,
  AiIntakeErrorCode,
  AiIntakeSensitiveFinding,
  AiIntakeSubmitRequest,
  AiIntakeSubmitResponse,
} from '@/lib/ai-intake/schemas';

type SubmitAudit = {
  clientId: string;
  locale: AiIntakeSubmitRequest['locale'];
  started: number;
  aiIntakeCategory?: AiIntakeCategory;
};

export type AiIntakeSubmitResult =
  | { ok: true; statusCode: 200 | 201 | 202; response: AiIntakeSubmitResponse }
  | {
    ok: false;
    statusCode: number;
    code: AiIntakeErrorCode;
    message: string;
    findings?: AiIntakeSensitiveFinding[];
    intakeId?: string;
    deliveryStatus?: 'failed_unknown';
    duplicate?: boolean;
  };

type SubmitRequestLike = Omit<AiIntakeSubmitRequest, 'privacyConsent'> & {
  privacyConsent: unknown;
};

type ClaimUpdateInput = Parameters<AiIntakeClaimStore['update']>[0];

function duplicateMessage(locale: AiIntakeSubmitRequest['locale'], status: AiIntakeSubmitResponse['status']): string {
  const copy = getAiIntakeCopy(locale);
  if (status === 'sending') return copy.sendingMessage;
  if (status === 'failed_unknown') return copy.failedUnknownReplayMessage;
  return copy.duplicateMessage;
}

function auditStage(result: AiIntakeSubmitResult): AiIntakeLogStage {
  if (result.ok) {
    if (result.response.duplicate) return 'ai_intake_submit_duplicate';
    return 'ai_intake_submit_sent';
  }
  if (result.code === 'DELIVERY_UNKNOWN') return 'ai_intake_submit_failed_unknown';
  return 'ai_intake_submit_rejected';
}

async function recordSubmitAudit(
  result: AiIntakeSubmitResult,
  input: SubmitAudit,
): Promise<void> {
  const intakeId = result.ok ? result.response.intakeId : result.intakeId;
  const status = result.ok ? result.response.status : result.code;
  try {
    await logAiIntakeEvent({
      stage: auditStage(result),
      clientId: input.clientId,
      intakeId,
      locale: input.locale,
      durationMs: Date.now() - input.started,
      status,
      aiIntakeCategory: input.aiIntakeCategory,
    });
  } catch {
    // Audit failure must not change the already-determined delivery response.
  }
}

async function finish(
  result: AiIntakeSubmitResult,
  audit: SubmitAudit,
): Promise<AiIntakeSubmitResult> {
  await recordSubmitAudit(result, audit);
  return result;
}

async function attemptClaimUpdate(
  store: AiIntakeClaimStore,
  input: ClaimUpdateInput,
): Promise<AiIntakeClaimUpdateOutcome | 'threw'> {
  try {
    return await store.update(input);
  } catch {
    return 'threw';
  }
}

const CONFLICT_MESSAGE = 'This idempotency key was used with different content. Create a new preview with a new key.';

async function resolveExistingClaim(input: {
  store: AiIntakeClaimStore;
  clientId: string;
  idempotencyKey: string;
  digest: string;
  locale: AiIntakeSubmitRequest['locale'];
  copy: ReturnType<typeof getAiIntakeCopy>;
  record: AiIntakeClaimRecord;
}): Promise<AiIntakeSubmitResult> {
  if (!compareAiIntakeDigest(input.record.digest, input.digest)) {
    return {
      ok: false,
      statusCode: 409,
      code: 'IDEMPOTENCY_CONFLICT',
      message: CONFLICT_MESSAGE,
    };
  }
  if (input.record.status === 'sent') {
    return {
      ok: true,
      statusCode: 200,
      response: {
        ok: true,
        intakeId: input.record.intakeId,
        status: 'sent',
        duplicate: true,
        message: duplicateMessage(input.locale, 'sent'),
      },
    };
  }
  if (input.record.status === 'failed_unknown') {
    return {
      ok: false,
      statusCode: 502,
      code: 'DELIVERY_UNKNOWN',
      message: input.copy.failedUnknownReplayMessage,
      intakeId: input.record.intakeId,
      deliveryStatus: 'failed_unknown',
      duplicate: true,
    };
  }
  if (isAiIntakeSendingFresh(input.record, aiIntakeNowMs())) {
    return {
      ok: true,
      statusCode: 202,
      response: {
        ok: true,
        intakeId: input.record.intakeId,
        status: 'sending',
        duplicate: true,
        message: duplicateMessage(input.locale, 'sending'),
      },
    };
  }
  await attemptClaimUpdate(input.store, {
    clientId: input.clientId,
    idempotencyKey: input.idempotencyKey,
    digest: input.digest,
    status: 'failed_unknown',
    failureClass: 'state_update_unknown',
  });
  return {
    ok: false,
    statusCode: 502,
    code: 'DELIVERY_UNKNOWN',
    message: input.copy.failedUnknownReplayMessage,
    intakeId: input.record.intakeId,
    deliveryStatus: 'failed_unknown',
    duplicate: true,
  };
}

export async function submitAiIntake(input: {
  request: AiIntakeSubmitRequest | SubmitRequestLike;
  clientId: string;
}): Promise<AiIntakeSubmitResult> {
  const started = Date.now();
  const locale = input.request.locale;
  const copy = getAiIntakeCopy(locale);
  const audit: SubmitAudit = { clientId: input.clientId, locale, started };

  if (input.request.privacyConsent !== true) {
    return finish({
      ok: false,
      statusCode: 400,
      code: 'CONSENT_REQUIRED',
      message: 'Privacy consent is required before submission.',
    }, audit);
  }

  const verified = verifyAiIntakeConfirmationToken(input.request.confirmationToken);
  if (!verified.ok) {
    if (verified.reason === 'config') {
      return finish({
        ok: false,
        statusCode: 503,
        code: 'CONFIG_UNAVAILABLE',
        message: 'Intake confirmation signing is not configured.',
      }, audit);
    }
    if (verified.reason === 'expired') {
      return finish({
        ok: false,
        statusCode: 400,
        code: 'TOKEN_EXPIRED',
        message: 'The confirmation token expired. Create a new preview.',
      }, audit);
    }
    return finish({
      ok: false,
      statusCode: 400,
      code: 'TOKEN_INVALID',
      message: 'The confirmation token is invalid. Create a new preview.',
    }, audit);
  }

  const payload = verified.payload;
  if (payload.clientId !== input.clientId) {
    return finish({
      ok: false,
      statusCode: 400,
      code: 'TOKEN_INVALID',
      message: 'The confirmation token is invalid. Create a new preview.',
    }, audit);
  }
  const idempotencyHash = hashAiIntakeIdempotencyKey(input.request.idempotencyKey);
  if (!safeEqualStrings(payload.idempotencyKeyHash, idempotencyHash)) {
    return finish({
      ok: false,
      statusCode: 400,
      code: 'TOKEN_INVALID',
      message: 'The confirmation token is invalid. Create a new preview.',
    }, audit);
  }

  const scan = scanAiIntakeFields(input.request);
  if (scan.rejected) {
    return finish({
      ok: false,
      statusCode: 422,
      code: 'SENSITIVE_DATA_REJECTED',
      message: getAiIntakeSensitiveCorrective(locale),
      findings: rejectFindings(scan.findings),
    }, audit);
  }

  const canonical = buildCanonicalAiIntakeEmail(input.request, payload.intakeId);
  if (!safeEqualStrings(canonical.digest, payload.digest)) {
    return finish({
      ok: false,
      statusCode: 409,
      code: 'PREVIEW_MISMATCH',
      message: 'The fields no longer match the confirmed preview. Create a new preview.',
    }, audit);
  }
  audit.aiIntakeCategory = input.request.category ?? 'general';

  const store = getAiIntakeClaimStore();
  if (!store) {
    return finish({
      ok: false,
      statusCode: 503,
      code: 'BACKEND_UNAVAILABLE',
      message: 'Intake storage is not available.',
    }, audit);
  }

  const existingInput = {
    store,
    clientId: input.clientId,
    idempotencyKey: input.request.idempotencyKey,
    digest: canonical.digest,
    locale,
    copy,
  };

  let lookup: Awaited<ReturnType<typeof store.lookup>>;
  try {
    lookup = await store.lookup({
      clientId: input.clientId,
      idempotencyKey: input.request.idempotencyKey,
    });
  } catch {
    return finish({
      ok: false,
      statusCode: 503,
      code: 'BACKEND_UNAVAILABLE',
      message: 'Intake storage is not available.',
    }, audit);
  }
  if (lookup.type === 'unavailable') {
    return finish({
      ok: false,
      statusCode: 503,
      code: 'BACKEND_UNAVAILABLE',
      message: 'Intake storage is not available.',
    }, audit);
  }
  if (lookup.type === 'found') {
    return finish(await resolveExistingClaim({ ...existingInput, record: lookup.record }), audit);
  }

  let sendOnce: () => Promise<{ intakeId: string }>;
  try {
    sendOnce = prepareAiIntakeMailSend({
      intakeId: canonical.intakeId,
      subject: canonical.subject,
      textBody: canonical.body,
      replyTo: canonical.replyTo,
    });
  } catch {
    return finish({
      ok: false,
      statusCode: 503,
      code: 'BACKEND_UNAVAILABLE',
      message: 'Mail delivery is not available.',
    }, audit);
  }

  let claim: Awaited<ReturnType<typeof store.claim>>;
  try {
    claim = await store.claim({
      clientId: input.clientId,
      idempotencyKey: input.request.idempotencyKey,
      intakeId: canonical.intakeId,
      digest: canonical.digest,
    });
  } catch {
    return finish({
      ok: false,
      statusCode: 503,
      code: 'BACKEND_UNAVAILABLE',
      message: 'Intake storage is not available.',
    }, audit);
  }

  if (claim.type === 'unavailable') {
    return finish({
      ok: false,
      statusCode: 503,
      code: 'BACKEND_UNAVAILABLE',
      message: 'Intake storage is not available.',
    }, audit);
  }
  if (claim.type === 'conflict') {
    return finish({
      ok: false,
      statusCode: 409,
      code: 'IDEMPOTENCY_CONFLICT',
      message: CONFLICT_MESSAGE,
    }, audit);
  }
  if (claim.type === 'duplicate') {
    return finish(await resolveExistingClaim({ ...existingInput, record: claim.record }), audit);
  }
  if (claim.type !== 'acquired') {
    return finish({
      ok: false,
      statusCode: 503,
      code: 'BACKEND_UNAVAILABLE',
      message: 'Intake storage is not available.',
    }, audit);
  }

  try {
    await sendOnce();
  } catch (error) {
    if (error instanceof PreparedAiIntakeMailConfigError) {
      return finish({
        ok: false,
        statusCode: 503,
        code: 'BACKEND_UNAVAILABLE',
        message: 'Mail delivery is not available.',
        intakeId: canonical.intakeId,
      }, audit);
    }
    await attemptClaimUpdate(store, {
      clientId: input.clientId,
      idempotencyKey: input.request.idempotencyKey,
      digest: canonical.digest,
      status: 'failed_unknown',
      failureClass: 'delivery_unknown',
    });
    return finish({
      ok: false,
      statusCode: 502,
      code: 'DELIVERY_UNKNOWN',
      message: copy.failedUnknownMessage,
      intakeId: canonical.intakeId,
      deliveryStatus: 'failed_unknown',
    }, audit);
  }

  const sentUpdate = {
    clientId: input.clientId,
    idempotencyKey: input.request.idempotencyKey,
    digest: canonical.digest,
    status: 'sent' as const,
  };
  const first = await attemptClaimUpdate(store, sentUpdate);
  let persisted: AiIntakeClaimUpdateOutcome | 'threw' = first;
  if (first === 'unavailable' || first === 'threw') {
    persisted = await attemptClaimUpdate(store, sentUpdate);
  }
  if (persisted === 'updated') {
    return finish({
      ok: true,
      statusCode: 201,
      response: {
        ok: true,
        intakeId: canonical.intakeId,
        status: 'sent',
        duplicate: false,
        message: copy.sentMessage,
      },
    }, audit);
  }

  if (first === 'unavailable' || first === 'threw') {
    await attemptClaimUpdate(store, {
      clientId: input.clientId,
      idempotencyKey: input.request.idempotencyKey,
      digest: canonical.digest,
      status: 'failed_unknown',
      failureClass: 'state_update_unknown',
    });
  }

  return finish({
    ok: false,
    statusCode: 502,
    code: 'DELIVERY_UNKNOWN',
    message: copy.failedUnknownMessage,
    intakeId: canonical.intakeId,
    deliveryStatus: 'failed_unknown',
  }, audit);
}
