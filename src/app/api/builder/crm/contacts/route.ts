import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createContact,
  listContacts,
  type ListContactsFilter,
} from '@/lib/builder/crm/contact-store';
import { runAutomationsForEvent } from '@/lib/builder/crm/automation-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const sourceSchema = z.enum(['form', 'manual', 'booking']);

const createBodySchema = z.object({
  email: z.string().trim().email().max(200),
  name: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(80).optional(),
  source: sourceSchema.optional(),
  tags: z.array(z.string().trim().min(1).max(64)).max(32).optional(),
  notes: z.string().max(4000).optional(),
  customFields: z.record(z.string().max(80), z.string().max(2000)).optional(),
});

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'view-contacts' });
  if (auth instanceof NextResponse) return auth;

  const url = request.nextUrl;
  const filter: ListContactsFilter = {
    tag: url.searchParams.get('tag')?.trim() || undefined,
    source: (url.searchParams.get('source') as ListContactsFilter['source']) || undefined,
    q: url.searchParams.get('q')?.trim() || undefined,
  };
  const contacts = await listContacts(filter);
  return NextResponse.json({ ok: true, contacts, total: contacts.length });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = createBodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid contact payload', details: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }
  const contact = await createContact(parsed.data);

  // Best-effort automation firing — never break the API on automation errors.
  try {
    await runAutomationsForEvent({
      kind: 'contact-created',
      contact,
      payload: { source: contact.source },
    });
  } catch (err) {
    console.error('[crm/contacts] automation dispatch failed:', err);
  }

  return NextResponse.json({ ok: true, contact }, { status: 201 });
}