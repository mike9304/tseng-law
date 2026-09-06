import { NextRequest } from 'next/server';
import { AI_INTAKE_MAX_BODY_BYTES } from '@/lib/ai-intake/constants';
import { buildRequirementsPayload } from '@/lib/ai-intake/copy';
import { guardAiIntakeRequest } from '@/lib/ai-intake/guard';
import { aiIntakeError, aiIntakeJson, withAiIntakeRouteHandler } from '@/lib/ai-intake/http';
import {
  aiIntakeRequirementsResponseSchema,
  parseAiIntakeRequirementsQuery,
} from '@/lib/ai-intake/schemas';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withAiIntakeRouteHandler(async () => {
    const guarded = await guardAiIntakeRequest(request, 'requirements');
    if (guarded instanceof Response) return guarded;

    const contentLength = request.headers.get('content-length');
    if (contentLength && Number(contentLength) > AI_INTAKE_MAX_BODY_BYTES) {
      return aiIntakeError(400, 'INVALID_REQUEST', 'Request is invalid.');
    }

    const parsed = parseAiIntakeRequirementsQuery(request.nextUrl.searchParams);
    if (!parsed.ok) {
      return aiIntakeError(400, 'INVALID_REQUEST', 'Request is invalid.', {
        fields: [{ name: 'body', reason: 'invalid' }],
      });
    }

    const built = buildRequirementsPayload(parsed.data.locale, parsed.data.category);
    const payload = aiIntakeRequirementsResponseSchema.safeParse(built);
    if (!payload.success) {
      return aiIntakeError(503, 'BACKEND_UNAVAILABLE', 'Intake requirements are not available.');
    }
    return aiIntakeJson(payload.data, 200);
  }, aiIntakeError(503, 'BACKEND_UNAVAILABLE', 'Intake requirements are not available.'));
}
