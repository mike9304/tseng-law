import { NextRequest, NextResponse } from 'next/server';
import { saveFormUpload } from '@/lib/builder/forms/uploads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: 'Invalid multipart body.' }, { status: 400 });
  }

  const file = formData.get('file');
  const fieldId = String(formData.get('fieldId') || '').trim();
  const locale = String(formData.get('locale') || 'ko');

  if (!(file instanceof File) || !fieldId) {
    return NextResponse.json({ error: 'Missing file or fieldId.' }, { status: 400 });
  }

  try {
    const uploaded = await saveFormUpload({ fieldId, file, locale });
    return NextResponse.json({ ok: true, file: uploaded }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'File upload failed.' },
      { status: 400 },
    );
  }
}
