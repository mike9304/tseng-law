import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  automationPatchSchema,
  mutateAutomations,
} from '@/lib/builder/crm/automation-model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;
  const raw = await request.json().catch(() => null);
  const parsed = automationPatchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid automation patch' }, { status: 400 });
  }
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
  if (!updated) return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
  return NextResponse.json({ ok: true, automation: updated });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;
  const removed = await mutateAutomations((current) => {
    const next = current.filter((a) => a.id !== params.id);
    return { next, result: next.length !== current.length };
  });
  if (!removed) return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}