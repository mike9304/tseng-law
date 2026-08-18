import { NextRequest, NextResponse } from 'next/server';
import { saveFormUpload } from '@/lib/builder/forms/uploads';
import {
  isSafeFormStorageSegment,
  loadFormSchema,
  validateFormFileForField,
} from '@/lib/builder/forms/form-engine';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FORM_UPLOAD_SAVE_FAILURE_CODE = 'form_upload_save_failed';
const FORM_UPLOAD_SAVE_FAILURE_MESSAGE = 'Unable to save this file right now. Please try again later.';

function errorKind(error: unknown): string {
  if (error && typeof error === 'object' && 'constructor' in error) {
    const constructor = error.constructor;
    if (typeof constructor === 'function' && constructor.name) return constructor.name;
  }
  return 'unknown_error';
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

  const rate = await checkRateLimit(`forms-uploads:${clientIp(request)}`, 12, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: 'Invalid multipart body.' }, { status: 400 });
  }

  const file = formData.get('file');
  const formId = String(formData.get('formId') || '').trim();
  const fieldId = String(formData.get('fieldId') || '').trim();
  const locale = String(formData.get('locale') || 'ko');

  if (!(file instanceof File)
    || !isSafeFormStorageSegment(formId, 80)
    || !isSafeFormStorageSegment(fieldId, 120)) {
    return NextResponse.json({ error: 'Missing or invalid formId, file, or fieldId.' }, { status: 400 });
  }

  const schema = await loadFormSchema(formId);
  if (!schema) {
    return NextResponse.json({ error: 'Form not found.' }, { status: 404 });
  }
  const field = schema.fields.find((candidate) => candidate.id === fieldId);
  if (!field || field.type !== 'file') {
    return NextResponse.json({ error: 'File field not found.' }, { status: 400 });
  }
  const fieldError = validateFormFileForField(field, file);
  if (fieldError) {
    return NextResponse.json({ error: fieldError }, { status: 400 });
  }

  try {
    const uploaded = await saveFormUpload({ fieldId, file, locale });
    return NextResponse.json({ ok: true, file: uploaded }, { status: 201 });
  } catch (error) {
    console.error('[forms] operation failed', FORM_UPLOAD_SAVE_FAILURE_CODE, errorKind(error));
    return NextResponse.json(
      {
        ok: false,
        error: FORM_UPLOAD_SAVE_FAILURE_CODE,
        code: FORM_UPLOAD_SAVE_FAILURE_CODE,
        message: FORM_UPLOAD_SAVE_FAILURE_MESSAGE,
      },
      { status: 500 },
    );
  }
}
