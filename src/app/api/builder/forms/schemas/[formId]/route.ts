import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  loadFormSchema,
  saveFormSchema,
  type FormSchema,
} from '@/lib/builder/forms/form-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const fieldSchema = z.object({
  id: z.string().trim().min(1).max(120),
  type: z.enum(['text', 'email', 'phone', 'textarea', 'select', 'checkbox', 'radio', 'file', 'date', 'number']),
  label: z.string().trim().min(1).max(200),
  placeholder: z.string().max(200).optional(),
  required: z.boolean().default(false),
  options: z.array(z.string().max(200)).max(40).optional(),
  validation: z
    .object({
      pattern: z.string().max(500).optional(),
      minLength: z.number().int().min(0).max(10_000).optional(),
      maxLength: z.number().int().min(0).max(10_000).optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      step: z.number().min(0).optional(),
      allowDecimals: z.boolean().optional(),
      dateMin: z.string().max(80).optional(),
      dateMax: z.string().max(80).optional(),
      accept: z.string().max(200).optional(),
      maxFileSize: z.number().int().min(0).max(50_000_000).optional(),
    })
    .optional(),
  conditionalOn: z
    .object({
      fieldId: z.string().trim().min(1).max(120),
      value: z.string().max(500).optional(),
      operator: z.enum(['equals', 'not-equals', 'contains', 'empty', 'not-empty']).optional(),
    })
    .optional(),
  step: z.number().int().min(0).max(20).optional(),
});

const stepSchema = z.object({
  id: z.string().trim().min(1).max(40),
  label: z.string().trim().min(1).max(120),
});

const updatePayload = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  fields: z.array(fieldSchema).max(80).optional(),
  steps: z.array(stepSchema).max(10).optional(),
  submitLabel: z.string().trim().min(1).max(80).optional(),
  successMessage: z.string().trim().min(1).max(500).optional(),
  errorMessage: z.string().trim().min(1).max(500).optional(),
  notifyEmail: z.string().trim().email().optional(),
  redirectUrl: z.string().trim().url().optional(),
  storeInCms: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { formId: string } },
) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'manage-forms' });
  if (auth instanceof NextResponse) return auth;
  const schema = await loadFormSchema(params.formId);
  if (!schema) return NextResponse.json({ error: 'Form not found' }, { status: 404 });
  return NextResponse.json({ ok: true, schema });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { formId: string } },
) {
  const auth = await guardMutation(request, { permission: 'manage-forms' });
  if (auth instanceof NextResponse) return auth;

  const existing = await loadFormSchema(params.formId);
  if (!existing) return NextResponse.json({ error: 'Form not found' }, { status: 404 });

  const raw = await request.json().catch(() => null);
  const parsed = updatePayload.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid form update' }, { status: 400 });
  }
  const merged: FormSchema = {
    ...existing,
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  };
  await saveFormSchema(merged);
  return NextResponse.json({ ok: true, schema: merged });
}
