import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  integrationPatchSchema,
  mutateIntegrations,
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
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderCrmApiErrorPayload(locale, errorCode) },
    { status },
  );
}

// Enable/disable an existing integration. Closes the gap where integrations were
// create-only (no way to disable, edit, or delete after creation).
export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }
  const parsed = integrationPatchSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_integration_payload', 400);
  }

  try {
    const updated = await mutateIntegrations((current) => {
      const index = current.findIndex((integration) => integration.id === params.id);
      if (index === -1) return { next: current, result: null };
      const next = { ...current[index], enabled: parsed.data.enabled };
      const all = [...current];
      all[index] = next;
      return { next: all, result: next };
    });
    if (!updated) return errorResponse(locale, 'integration_not_found', 404);
    return NextResponse.json({ ok: true, integration: updated });
  } catch (error) {
    console.error('[builder/crm/integrations/:id] update failed:', error);
    return errorResponse(locale, 'integration_update_failed', 500);
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');

  try {
    const removed = await mutateIntegrations((current) => {
      const next = current.filter((integration) => integration.id !== params.id);
      return { next, result: next.length !== current.length };
    });
    if (!removed) return errorResponse(locale, 'integration_not_found', 404);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[builder/crm/integrations/:id] delete failed:', error);
    return errorResponse(locale, 'integration_delete_failed', 500);
  }
}
