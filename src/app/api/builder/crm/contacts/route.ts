import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createContact,
  listContacts,
  type ListContactsFilter,
} from '@/lib/builder/crm/contact-store';
import { runAutomationsForEvent } from '@/lib/builder/crm/automation-engine';
import { dispatchToIntegrations } from '@/lib/builder/crm/integrations-dispatcher';
import {
  getBuilderCrmApiErrorPayload,
  type BuilderCrmApiErrorCode,
} from '@/lib/builder/crm/crm-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

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

  const url = request.nextUrl;
  const source = sourceSchema.safeParse(url.searchParams.get('source'));
  const filter: ListContactsFilter = {
    tag: url.searchParams.get('tag')?.trim() || undefined,
    source: source.success ? source.data : undefined,
    q: url.searchParams.get('q')?.trim() || undefined,
  };
  try {
    const contacts = await listContacts(filter);
    return NextResponse.json({ ok: true, contacts, total: contacts.length });
  } catch (error) {
    console.error('[builder/crm/contacts] list failed:', error);
    return errorResponse(locale, 'contacts_list_failed', 500);
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
  const parsed = createBodySchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_contact_payload', 400, {
      details: parsed.error.issues.slice(0, 3),
    });
  }
  try {
    const contact = await createContact(parsed.data);

    // Best-effort automation firing: never break contact creation on automation errors.
    try {
      await runAutomationsForEvent({
        kind: 'contact-created',
        contact,
        payload: { source: contact.source },
      });
      await dispatchToIntegrations({
        kind: 'contact-created',
        contact,
        payload: { source: contact.source },
      });
    } catch (err) {
      console.error('[crm/contacts] post-create dispatch failed:', err);
    }

    return NextResponse.json({ ok: true, contact }, { status: 201 });
  } catch (error) {
    console.error('[builder/crm/contacts] create failed:', error);
    return errorResponse(locale, 'contact_create_failed', 500);
  }
}
