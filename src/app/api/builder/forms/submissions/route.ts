import { NextRequest, NextResponse } from 'next/server';
import { listSubmissions, saveSubmission, type FormSubmission } from '@/lib/builder/forms/form-engine';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const formId = searchParams.get('formId') || 'default-contact';
  const limit = Number(searchParams.get('limit') || '50');

  try {
    const submissions = await listSubmissions(formId, limit);
    return NextResponse.json({ submissions });
  } catch {
    return NextResponse.json({ submissions: [] });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as FormSubmission;
    if (!body.submissionId || !body.formId) {
      return NextResponse.json({ error: 'Missing submissionId or formId' }, { status: 400 });
    }

    const updated: FormSubmission = { ...body, read: true };
    await saveSubmission(updated);
    return NextResponse.json({ ok: true, submission: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}
