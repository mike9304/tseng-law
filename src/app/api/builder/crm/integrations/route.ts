import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  integrationCreateSchema,
  type CrmIntegration,
  makeIntegrationId,
  mutateIntegrations,
  readIntegrations,
} from '@/lib/builder/crm/integrations-model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'view-contacts' });
  if (auth instanceof NextResponse) return auth;
  const integrations = await readIntegrations();
  return NextResponse.json({ ok: true, integrations, total: integrations.length });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;
  const raw = await request.json().catch(() => null);
  const parsed = integrationCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid integration payload', details: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }
  const integration: CrmIntegration = {
    id: makeIntegrationId(),
    kind: parsed.data.kind,
    webhookUrl: parsed.data.webhookUrl,
    settings: parsed.data.settings as Record<string, unknown> | undefined,
    enabled: parsed.data.enabled,
    createdAt: new Date().toISOString(),
  };
  await mutateIntegrations((current) => ({
    next: [...current, integration],
    result: integration,
  }));
  return NextResponse.json({ ok: true, integration }, { status: 201 });
}