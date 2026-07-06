import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  automationPatchSchema,
  mutateAutomations,
} from '@/lib/builder/crm/automation-model';
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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }
  const parsed = automationPatchSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_automation_patch', 400);
  }
  try {
    const updated = await mutateAutomations((current) => {
      const index = current.findIndex((a) => a.id === params.id);
      if (index === -1) return { next: current, result: null };
      const existing = current[index];
      const next = {
        ...existing,
        ...parsed.data,
        id: existing.id,
        createdAt: existing.createdAt,
        trigger: parsed.data.trigger ?? existing.trigger,
        action: parsed.data.action ?? existing.action,
      };
      const all = [...current];
      all[index] = next;
      return { next: all, result: next };
    });
    if (!updated) return errorResponse(locale, 'automation_not_found', 404);
    return NextResponse.json({ ok: true, automation: updated });
  } catch (error) {
    console.error('[builder/crm/automations/:id] update failed:', error);
    return errorResponse(locale, 'automation_update_failed', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  try {
    const removed = await mutateAutomations((current) => {
      const next = current.filter((a) => a.id !== params.id);
      return { next, result: next.length !== current.length };
    });
    if (!removed) return errorResponse(locale, 'automation_not_found', 404);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[builder/crm/automations/:id] delete failed:', error);
    return errorResponse(locale, 'automation_delete_failed', 500);
  }
}
