import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteContact,
  getContact,
  updateContact,
} from '@/lib/builder/crm/contact-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  email: z.string().trim().email().max(200).optional(),
  name: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(80).optional(),
  tags: z.array(z.string().trim().min(1).max(64)).max(32).optional(),
  notes: z.string().max(4000).optional(),
  source: z.enum(['form', 'manual', 'booking']).optional(),
  customFields: z.record(z.string().max(80), z.string().max(2000)).optional(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'view-contacts' });
  if (auth instanceof NextResponse) return auth;
  const contact = await getContact(params.id);
  if (!contact) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  return NextResponse.json({ ok: true, contact });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;
  const raw = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid patch payload' }, { status: 400 });
  }
  const contact = await updateContact(params.id, parsed.data);
  if (!contact) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  return NextResponse.json({ ok: true, contact });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;
  const removed = await deleteContact(params.id);
  if (!removed) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}