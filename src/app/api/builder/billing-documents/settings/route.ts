import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  loadBillingDocumentAutomationSettings,
  saveBillingDocumentAutomationSettings,
} from '@/lib/builder/billing-document-automation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const settings = await loadBillingDocumentAutomationSettings();
    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    console.error('[builder/billing-documents/settings] GET failed:', error);
    return NextResponse.json({ ok: false, error: 'billing_document_settings_failed' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const settings = await saveBillingDocumentAutomationSettings(body?.settings ?? body);
    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    }
    console.error('[builder/billing-documents/settings] PATCH failed:', error);
    return NextResponse.json({ ok: false, error: 'billing_document_settings_save_failed' }, { status: 500 });
  }
}
