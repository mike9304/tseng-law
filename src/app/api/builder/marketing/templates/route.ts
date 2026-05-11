import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  listTemplates,
  makeTemplateId,
  saveTemplate,
} from '@/lib/builder/marketing/templates/storage';
import { templateCreateSchema, type EmailTemplate } from '@/lib/builder/marketing/templates/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'manage-campaigns' });
  if (auth instanceof NextResponse) return auth;
  const templates = await listTemplates();
  return NextResponse.json({ ok: true, templates, total: templates.length });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-campaigns' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = templateCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid template', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }
  const now = new Date().toISOString();
  const template: EmailTemplate = {
    templateId: makeTemplateId(),
    name: parsed.data.name,
    description: parsed.data.description,
    category: parsed.data.category,
    blocks: parsed.data.blocks,
    pageBackground: parsed.data.pageBackground,
    contentBackground: parsed.data.contentBackground,
    createdAt: now,
    updatedAt: now,
  };
  await saveTemplate(template);
  return NextResponse.json({ ok: true, template }, { status: 201 });
}
