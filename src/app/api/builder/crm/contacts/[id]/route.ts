import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteContact,
  getContact,
  updateContact,
} from '@/lib/builder/crm/contact-store';
import {
  getBuilderCrmApiErrorPayload,
  type BuilderCrmApiErrorCode,
} from '@/lib/builder/crm/crm-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

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

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'view-contacts' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  try {
    const contact = await getContact(params.id);
    if (!contact) return errorResponse(locale, 'contact_not_found', 404);
    return NextResponse.json({ ok: true, contact });
  } catch (error) {
    console.error('[builder/crm/contacts/:id] load failed:', error);
    return errorResponse(locale, 'contact_load_failed', 500);
  }
}

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
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_contact_payload', 400);
  }
  try {
    const contact = await updateContact(params.id, parsed.data);
    if (!contact) return errorResponse(locale, 'contact_not_found', 404);
    return NextResponse.json({ ok: true, contact });
  } catch (error) {
    console.error('[builder/crm/contacts/:id] update failed:', error);
    return errorResponse(locale, 'contact_update_failed', 500);
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  try {
    const removed = await deleteContact(params.id);
    if (!removed) return errorResponse(locale, 'contact_not_found', 404);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[builder/crm/contacts/:id] delete failed:', error);
    return errorResponse(locale, 'contact_delete_failed', 500);
  }
}
