import { NextRequest } from 'next/server';
import { AI_INTAKE_MAX_BODY_BYTES } from '@/lib/ai-intake/constants';
import { guardAiIntakeRequest } from '@/lib/ai-intake/guard';
import { aiIntakeError, aiIntakeJson, readBoundedJson, withAiIntakeRouteHandler } from '@/lib/ai-intake/http';
import { previewAiIntake } from '@/lib/ai-intake/preview';
import { aiIntakePreviewRequestSchema, sanitizeZodIssues } from '@/lib/ai-intake/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  return withAiIntakeRouteHandler(async () => {
    const guarded = await guardAiIntakeRequest(request, 'preview');
    if (guarded instanceof Response) return guarded;

    const raw = await readBoundedJson(request, AI_INTAKE_MAX_BODY_BYTES);
    if (!raw.ok) {
      return aiIntakeError(400, 'INVALID_REQUEST', 'Request is invalid.');
    }

    const parsed = aiIntakePreviewRequestSchema.safeParse(raw.value);
    if (!parsed.success) {
      return aiIntakeError(400, 'INVALID_REQUEST', 'Request is invalid.', {
        fields: sanitizeZodIssues(parsed.error),
      });
    }

    const result = previewAiIntake({
      request: parsed.data,
      clientId: guarded.client.clientId,
    });
    if (!result.ok) {
      return aiIntakeError(result.status, result.code, result.message, {
        findings: result.findings,
      });
    }
    return aiIntakeJson(result.response, 200);
  }, aiIntakeError(503, 'BACKEND_UNAVAILABLE', 'Intake preview is not available.'));
}
