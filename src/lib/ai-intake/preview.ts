import { AI_INTAKE_REQUIREMENTS_VERSION } from '@/lib/ai-intake/constants';
import { buildCanonicalAiIntakeEmail, generateAiIntakeId } from '@/lib/ai-intake/canonical';
import { getAiIntakeConfirmationInstruction, getAiIntakeSensitiveCorrective } from '@/lib/ai-intake/copy';
import { rejectFindings, scanAiIntakeFields, warningFindings } from '@/lib/ai-intake/sensitive';
import {
  hashAiIntakeIdempotencyKey,
  mintAiIntakeConfirmationToken,
  AiIntakeTokenConfigError,
} from '@/lib/ai-intake/token';
import type {
  AiIntakePreviewRequest,
  AiIntakePreviewResponse,
  AiIntakeSensitiveFinding,
} from '@/lib/ai-intake/schemas';

export type AiIntakePreviewResult =
  | { ok: true; response: AiIntakePreviewResponse }
  | {
    ok: false;
    status: 422 | 503;
    code: 'SENSITIVE_DATA_REJECTED' | 'CONFIG_UNAVAILABLE';
    message: string;
    findings?: AiIntakeSensitiveFinding[];
  };

export function previewAiIntake(input: {
  request: AiIntakePreviewRequest;
  clientId: string;
}): AiIntakePreviewResult {
  const scan = scanAiIntakeFields(input.request);
  if (scan.rejected) {
    return {
      ok: false,
      status: 422,
      code: 'SENSITIVE_DATA_REJECTED',
      message: getAiIntakeSensitiveCorrective(input.request.locale),
      findings: rejectFindings(scan.findings),
    };
  }

  const intakeId = generateAiIntakeId();
  const canonical = buildCanonicalAiIntakeEmail(input.request, intakeId);
  try {
    const minted = mintAiIntakeConfirmationToken({
      digest: canonical.digest,
      intakeId: canonical.intakeId,
      clientId: input.clientId,
      idempotencyKeyHash: hashAiIntakeIdempotencyKey(input.request.idempotencyKey),
    });
    return {
      ok: true,
      response: {
        ok: true,
        intakeId: canonical.intakeId,
        subject: canonical.subject,
        body: canonical.body,
        digest: canonical.digest,
        findings: warningFindings(scan.findings),
        expiresAt: minted.expiresAt,
        confirmationToken: minted.token,
        confirmationInstruction: getAiIntakeConfirmationInstruction(input.request.locale),
        requirementsVersion: AI_INTAKE_REQUIREMENTS_VERSION,
      },
    };
  } catch (error) {
    if (error instanceof AiIntakeTokenConfigError) {
      return {
        ok: false,
        status: 503,
        code: 'CONFIG_UNAVAILABLE',
        message: 'Intake confirmation signing is not configured.',
      };
    }
    throw error;
  }
}
