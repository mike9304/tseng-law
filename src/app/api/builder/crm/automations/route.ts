import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  automationCreateSchema,
  type CrmAutomation,
  makeAutomationId,
  mutateAutomations,
  readAutomations,
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
    const automations = await readAutomations();
    return NextResponse.json({ ok: true, automations, total: automations.length });
  } catch (error) {
    console.error('[builder/crm/automations] list failed:', error);
    return errorResponse(locale, 'automations_list_failed', 500);
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
  const parsed = automationCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_automation_payload', 400, {
      details: parsed.error.issues.slice(0, 3),
    });
  }
  const now = new Date().toISOString();
  const automation: CrmAutomation = {
    id: makeAutomationId(),
    name: parsed.data.name,
    trigger: parsed.data.trigger,
    action: parsed.data.action,
    enabled: parsed.data.enabled,
    createdAt: now,
  };
  try {
    await mutateAutomations((current) => ({
      next: [...current, automation],
      result: automation,
    }));
    return NextResponse.json({ ok: true, automation }, { status: 201 });
  } catch (error) {
    console.error('[builder/crm/automations] create failed:', error);
    return errorResponse(locale, 'automation_create_failed', 500);
  }
}
