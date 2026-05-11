import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { listForms, saveFormSchema, type FormSchema } from '@/lib/builder/forms/form-engine';

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

const schemaPayload = z.object({
  formId: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(200),
  fields: z.array(fieldSchema).max(80),
  steps: z.array(stepSchema).max(10).optional(),
  submitLabel: z.string().trim().min(1).max(80).default('Submit'),
  successMessage: z.string().trim().min(1).max(500),
  errorMessage: z.string().trim().min(1).max(500),
  notifyEmail: z.string().trim().email().optional(),
  redirectUrl: z.string().trim().url().optional(),
  storeInCms: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'manage-forms' });
  if (auth instanceof NextResponse) return auth;
  const forms = await listForms();
  return NextResponse.json({ ok: true, forms, total: forms.length });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-forms' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = schemaPayload.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid form schema', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }
  const now = new Date().toISOString();
  const schema: FormSchema = {
    ...parsed.data,
    createdAt: now,
    updatedAt: now,
  };
  await saveFormSchema(schema);
  return NextResponse.json({ ok: true, schema }, { status: 201 });
}
