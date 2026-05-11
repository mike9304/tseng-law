import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getTemplate, saveTemplate } from '@/lib/builder/marketing/templates/storage';
import {
  renderTemplateToHtml,
  renderTemplateToText,
} from '@/lib/builder/marketing/templates/renderer';
import { templateUpdateSchema } from '@/lib/builder/marketing/templates/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { templateId: string } },
) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'manage-campaigns' });
  if (auth instanceof NextResponse) return auth;
  const template = await getTemplate(params.templateId);
  if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  const renderHtml = request.nextUrl.searchParams.get('render') === 'html';
  if (renderHtml) {
    return NextResponse.json({
      ok: true,
      template,
      html: renderTemplateToHtml(template),
      text: renderTemplateToText(template),
    });
  }
  return NextResponse.json({ ok: true, template });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { templateId: string } },
) {
  const auth = await guardMutation(request, { permission: 'manage-campaigns' });
  if (auth instanceof NextResponse) return auth;

  const existing = await getTemplate(params.templateId);
  if (!existing) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

  const raw = await request.json().catch(() => null);
  const parsed = templateUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid update' }, { status: 400 });
  }
  const merged = {
    ...existing,
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  };
  await saveTemplate(merged);
  return NextResponse.json({ ok: true, template: merged });
}
