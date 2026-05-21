import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  automationCreateSchema,
  type CrmAutomation,
  makeAutomationId,
  mutateAutomations,
  readAutomations,
} from '@/lib/builder/crm/automation-model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'view-contacts' });
  if (auth instanceof NextResponse) return auth;
  const automations = await readAutomations();
  return NextResponse.json({ ok: true, automations, total: automations.length });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;
  const raw = await request.json().catch(() => null);
  const parsed = automationCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid automation payload', details: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
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
  await mutateAutomations((current) => ({
    next: [...current, automation],
    result: automation,
  }));
  return NextResponse.json({ ok: true, automation }, { status: 201 });
}