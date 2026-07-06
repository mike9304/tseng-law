import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  integrationCreateSchema,
  type CrmIntegration,
  makeIntegrationId,
  mutateIntegrations,
  readIntegrations,
} from '@/lib/builder/crm/integrations-model';
import {
  getBuilderCrmApiErrorPayload,
  type BuilderCrmApiErrorCode,
} from '@/lib/builder/crm/crm-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: BuilderCrmApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderCrmApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'view-contacts' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  try {
    const integrations = await readIntegrations();
    return NextResponse.json({ ok: true, integrations, total: integrations.length });
  } catch (error) {
    console.error('[builder/crm/integrations] list failed:', error);
    return errorResponse(locale, 'integrations_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }
  const parsed = integrationCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_integration_payload', 400, {
      details: parsed.error.issues.slice(0, 3),
    });
  }
  const integration: CrmIntegration = {
    id: makeIntegrationId(),
    kind: parsed.data.kind,
    webhookUrl: parsed.data.webhookUrl,
    settings: parsed.data.settings as Record<string, unknown> | undefined,
    enabled: parsed.data.enabled,
    createdAt: new Date().toISOString(),
  };
  try {
    await mutateIntegrations((current) => ({
      next: [...current, integration],
      result: integration,
    }));
    return NextResponse.json({ ok: true, integration }, { status: 201 });
  } catch (error) {
    console.error('[builder/crm/integrations] create failed:', error);
    return errorResponse(locale, 'integration_create_failed', 500);
  }
}
