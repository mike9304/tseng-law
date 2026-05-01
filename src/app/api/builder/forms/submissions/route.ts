import { NextRequest, NextResponse } from 'next/server';
import {
  listSubmissionFormIds,
  listSubmissions,
  saveSubmission,
  type FormSubmission,
} from '@/lib/builder/forms/form-engine';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = request.nextUrl;
  const formId = searchParams.get('formId');
  const limit = Number(searchParams.get('limit') || '50');

  try {
    if (!formId) {
      const formIds = await listSubmissionFormIds();
      return NextResponse.json({ formIds });
    }
    const submissions = await listSubmissions(formId, limit);
    return NextResponse.json({ submissions, formId });
  } catch {
    return NextResponse.json({ submissions: [] });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

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
