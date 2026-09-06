import { NextRequest } from 'next/server';
import { AI_INTAKE_MAX_BODY_BYTES } from '@/lib/ai-intake/constants';
import { guardAiIntakeRequest } from '@/lib/ai-intake/guard';
import { aiIntakeError, aiIntakeJson, readBoundedJson, withAiIntakeRouteHandler } from '@/lib/ai-intake/http';
import {
  aiIntakeExternalSubmitRequestSchema,
  classifyAiIntakeExternalSubmitAttestation,
  sanitizeZodIssues,
  stripAiIntakeExternalSubmitRequest,
} from '@/lib/ai-intake/schemas';
import { submitAiIntake } from '@/lib/ai-intake/submit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  return withAiIntakeRouteHandler(async () => {
    const guarded = await guardAiIntakeRequest(request, 'submit');
    if (guarded instanceof Response) return guarded;

    const raw = await readBoundedJson(request, AI_INTAKE_MAX_BODY_BYTES);
    if (!raw.ok) {
      return aiIntakeError(400, 'INVALID_REQUEST', 'Request is invalid.');
    }

    const attestation = classifyAiIntakeExternalSubmitAttestation(raw.value);
    if (attestation === 'CONSENT_REQUIRED') {
      return aiIntakeError(400, 'CONSENT_REQUIRED', 'Privacy consent is required before submission.');
    }
    if (attestation === 'APPROVAL_REQUIRED') {
      return aiIntakeError(400, 'APPROVAL_REQUIRED', 'Exact preview approval is required before submission.');
    }

    const parsed = aiIntakeExternalSubmitRequestSchema.safeParse(raw.value);
    if (!parsed.success) {
      const fields = sanitizeZodIssues(parsed.error);
      if (fields.some((field) => field.name === 'privacyConsent')) {
        return aiIntakeError(400, 'CONSENT_REQUIRED', 'Privacy consent is required before submission.', { fields });
      }
      if (fields.some((field) => field.name === 'userApprovedExactPreview')) {
        return aiIntakeError(400, 'APPROVAL_REQUIRED', 'Exact preview approval is required before submission.', { fields });
      }
      return aiIntakeError(400, 'INVALID_REQUEST', 'Request is invalid.', { fields });
    }

    const result = await submitAiIntake({
      request: stripAiIntakeExternalSubmitRequest(parsed.data),
      clientId: guarded.client.clientId,
    });

    if (!result.ok) {
      return aiIntakeError(result.statusCode, result.code, result.message, {
        findings: result.findings,
        intakeId: result.intakeId,
        deliveryStatus: result.deliveryStatus,
        duplicate: result.duplicate,
      });
    }

    return aiIntakeJson(result.response, result.statusCode);
  }, aiIntakeError(503, 'BACKEND_UNAVAILABLE', 'Intake submit is not available.'));
}
