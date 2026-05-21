import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { z } from 'zod';
import {
  loadFormSchema,
  saveSubmission,
  validateSubmission,
  type FormField,
  type FormSchema,
  type FormSubmission,
  type FormSubmissionFile,
} from '@/lib/builder/forms/form-engine';
import { saveFormUpload } from '@/lib/builder/forms/uploads';
import { recordFailedWebhook } from '@/lib/builder/forms/webhook-retry';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { reasonUrlUnsafe } from '@/lib/builder/webhooks/url-guard';
import { isLinkSafe } from '@/lib/builder/links';
import {
  BuilderCmsPermissionError,
  BuilderCmsValidationError,
  createEditableBuilderCmsRecord,
  readEditableBuilderCmsCollection,
} from '@/lib/builder/cms-editable';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import type { BuilderCmsFieldDefinition } from '@/lib/builder/cms-types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── Rate limit (distributed via Upstash, falls back to in-memory) ──
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

// ─── Body schema ─────────────────────────────────────────────────────

const submitBodySchema = z.object({
  formId: z.string().trim().min(1).max(120).optional(),
  formName: z.string().trim().min(1).max(80),
  submitTo: z.enum(['email', 'webhook', 'storage']).default('storage'),
  targetEmail: z.string().email().max(200).optional(),
  webhookUrl: z.string().url().max(2000).optional(),
  fields: z.record(z.string().max(80), z.string().max(150000)).default({}),
  files: z
    .array(
      z.object({
        fieldId: z.string().trim().min(1).max(120),
        name: z.string().trim().min(1).max(240),
        size: z.number().int().min(0).max(50_000_000),
        type: z.string().max(200).optional(),
        // Reject unsafe schemes (javascript:/data:/vbscript:/protocol-relative)
        // so admins viewing the submissions dashboard can't be XSS'd by a
        // crafted file URL that arrived through the public submit endpoint.
        url: z
          .string()
          .max(2000)
          .refine((value) => !value || isLinkSafe(value), 'Unsafe URL scheme')
          .optional(),
        uploadedAt: z.string().max(80).optional(),
      }),
    )
    .max(40)
    .default([]),
  loadedAt: z.number().optional(),
  submittedAt: z.number().optional(),
  pageSlug: z.string().max(500).optional(),
  locale: z.string().max(20).optional(),
  captchaProvider: z.enum(['none', 'hcaptcha', 'turnstile']).default('none').optional(),
  captchaToken: z.string().max(4000).optional().nullable(),
  autoReplyEnabled: z.boolean().default(false).optional(),
  autoReplyTemplate: z.string().max(2000).optional(),
});

// ─── Helpers ─────────────────────────────────────────────────────────

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}

function makeSubmissionId(): string {
  return `fs-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function forwardToWebhook(url: string, payload: unknown): Promise<void> {
  // SSRF guard. This endpoint is anonymous + public; without the guard an
  // attacker can target loopback / RFC1918 / cloud metadata via webhookUrl.
  // Blind SSRF is still useful for internal port probing and IMDS hits.
  const unsafeReason = reasonUrlUnsafe(url);
  if (unsafeReason) {
    console.warn('[forms/submit] webhook forward refused:', unsafeReason);
    return;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    console.error('[forms/submit] webhook forward failed:', err);
    await recordFailedWebhook(url, payload, err).catch(() => {});
  } finally {
    clearTimeout(timeout);
  }
}

async function attemptEmail(targetEmail: string, formName: string, fields: Record<string, string>): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Email transport not configured — silently skip; storage already happened.
    return;
  }
  const lines = Object.entries(fields)
    .map(([key, value]) => `<p><strong>${escapeHtml(key)}</strong>: ${escapeHtml(value)}</p>`)
    .join('\n');
  const body = {
    from: process.env.FORMS_EMAIL_FROM || 'forms@hoveringlaw.com.tw',
    to: targetEmail,
    subject: `[Form] ${formName}`,
    html: `<h2>Form: ${escapeHtml(formName)}</h2>${lines}`,
  };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch (err) {
    console.error('[forms/submit] email send failed:', err);
  }
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.FORMS_EMAIL_FROM || 'forms@hoveringlaw.com.tw',
        to,
        subject,
        html,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch (err) {
    console.error('[forms/submit] auto-reply send failed:', err);
  }
}

function findReplyEmail(fields: Record<string, string>): string | null {
  for (const [key, value] of Object.entries(fields)) {
    if (!/email/i.test(key)) continue;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return value;
  }
  return null;
}

async function verifyCaptcha(provider: 'none' | 'hcaptcha' | 'turnstile' | undefined, token: string | null | undefined): Promise<boolean> {
  if (!provider || provider === 'none') return true;
  const secret = provider === 'hcaptcha' ? process.env.HCAPTCHA_SECRET : process.env.TURNSTILE_SECRET;
  if (!secret) return true;
  if (!token) return false;
  const endpoint =
    provider === 'hcaptcha'
      ? 'https://hcaptcha.com/siteverify'
      : 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  try {
    const form = new URLSearchParams();
    form.set('secret', secret);
    form.set('response', token);
    const response = await fetch(endpoint, {
      method: 'POST',
      body: form,
    });
    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error('[forms/submit] captcha verification failed:', err);
    return false;
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function materializeDataUrlFields(
  fields: Record<string, string>,
  locale: string | undefined,
): Promise<{ fields: Record<string, string>; files: FormSubmissionFile[] }> {
  const nextFields = { ...fields };
  const files: FormSubmissionFile[] = [];

  for (const [fieldId, value] of Object.entries(fields)) {
    const parsed = parseImageDataUrl(value);
    if (!parsed) continue;
    const extension = parsed.contentType === 'image/jpeg' ? 'jpg' : 'png';
    const file = new File([bufferToArrayBuffer(parsed.content)], `${fieldId}-signature.${extension}`, {
      type: parsed.contentType,
    });
    const uploaded = await saveFormUpload({ fieldId, file, locale });
    nextFields[fieldId] = uploaded.url ?? uploaded.name;
    files.push(uploaded);
  }

  return { fields: nextFields, files };
}

function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(arrayBuffer).set(buffer);
  return arrayBuffer;
}

function parseImageDataUrl(value: string): { contentType: 'image/png' | 'image/jpeg'; content: Buffer } | null {
  const match = /^data:(image\/(?:png|jpeg));base64,([a-z0-9+/=]+)$/i.exec(value.trim());
  if (!match) return null;
  try {
    return {
      contentType: match[1].toLowerCase() as 'image/png' | 'image/jpeg',
      content: Buffer.from(match[2], 'base64'),
    };
  } catch {
    return null;
  }
}

class FormCmsWriteError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly issues: string[] = [message],
  ) {
    super(message);
    this.name = 'FormCmsWriteError';
  }
}

async function writeSubmissionToCms(
  schema: FormSchema | null,
  fields: Record<string, string>,
  files: FormSubmissionFile[],
  locale: string | undefined,
): Promise<string | null> {
  if (!schema?.storeInCms || !schema.cmsMapping?.enabled) return null;

  const mapping = schema.cmsMapping;
  const collectionId = mapping.collectionId?.trim();
  if (!collectionId) {
    throw new FormCmsWriteError('CMS 컬렉션이 설정되지 않았습니다.', 400);
  }

  const siteId = mapping.siteId?.trim() || DEFAULT_BUILDER_SITE_ID;
  const recordLocale = mapping.locale?.trim() || locale;
  let collectionDetail: Awaited<ReturnType<typeof readEditableBuilderCmsCollection>> | null = null;
  try {
    collectionDetail = await readEditableBuilderCmsCollection(siteId, recordLocale, collectionId);
  } catch {
    collectionDetail = null;
  }
  const recordFields = buildCmsRecordFields(schema, fields, files, collectionDetail?.fields ?? []);
  if (Object.keys(recordFields).length === 0) {
    throw new FormCmsWriteError('CMS에 저장할 필드 매핑이 없습니다.', 400);
  }

  const record = await createEditableBuilderCmsRecord(
    siteId,
    recordLocale,
    collectionId,
    {
      status: mapping.status ?? 'pending',
      locale: recordLocale,
      fields: recordFields,
    },
    { actor: 'public', actorLabel: 'Public form visitor' },
  );
  if (!record) {
    throw new FormCmsWriteError('대상 CMS 컬렉션을 찾을 수 없습니다.', 404);
  }
  return record.recordId;
}

function buildCmsRecordFields(
  schema: FormSchema,
  fields: Record<string, string>,
  files: FormSubmissionFile[],
  cmsFields: BuilderCmsFieldDefinition[] = [],
): Record<string, unknown> {
  const formFields = new Map(schema.fields.map((field) => [field.id, field]));
  const cmsFieldsByKey = new Map(cmsFields.map((field) => [field.key, field]));
  const recordFields: Record<string, unknown> = {};

  for (const fieldMapping of schema.cmsMapping?.fields ?? []) {
    const formFieldId = fieldMapping.formFieldId.trim();
    const cmsFieldKey = fieldMapping.cmsFieldKey.trim();
    if (!formFieldId || !cmsFieldKey) continue;

    const formField = formFields.get(formFieldId);
    const cmsField = cmsFieldsByKey.get(cmsFieldKey);
    const value = formField?.type === 'file'
      ? cmsFileValue(files.filter((file) => file.fieldId === formFieldId), cmsField)
      : fields[formFieldId];
    const normalized = normalizeCmsMappedValue(formField, value, cmsField);
    if (normalized === undefined || normalized === '') continue;
    recordFields[cmsFieldKey] = normalized;
  }

  return recordFields;
}

function cmsFileValue(
  files: FormSubmissionFile[],
  cmsField?: BuilderCmsFieldDefinition,
): string | string[] | { url: string; filename?: string; altText?: string } | undefined {
  if (files.length === 0) return undefined;
  const urls = files
    .map((file) => file.url || file.name)
    .filter((value): value is string => Boolean(value));
  if (urls.length === 0) return undefined;
  if (cmsField?.type === 'image') {
    if (files.length > 1) {
      throw new FormCmsWriteError(
        '이미지 CMS 필드에는 하나의 업로드 파일만 매핑할 수 있습니다.',
        400,
      );
    }
    const first = files.find((file) => file.url || file.name);
    if (!first) return undefined;
    if (first.type && !first.type.startsWith('image/')) {
      throw new FormCmsWriteError(
        '이미지 CMS 필드에는 이미지 업로드만 매핑할 수 있습니다.',
        400,
      );
    }
    return {
      url: first.url || first.name,
      filename: first.name,
      altText: first.name.replace(/\.[^.]+$/, '').slice(0, 180),
    };
  }
  if (cmsField?.repeated || cmsField?.type === 'string-list') return urls;
  return urls.length === 1 ? urls[0] : urls;
}

function normalizeCmsMappedValue(
  field: FormField | undefined,
  value: unknown,
  cmsField?: BuilderCmsFieldDefinition,
): unknown {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return value;
  const text = String(value).trim();
  if (!field) return text;

  if (cmsField?.repeated || cmsField?.type === 'string-list') {
    return text
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (field.type === 'number') {
    const numeric = Number(text);
    return Number.isFinite(numeric) ? numeric : text;
  }
  if (field.type === 'checkbox' && !field.options?.length) {
    if (/^(true|1|yes|on|동의|checked)$/i.test(text)) return 'true';
    if (/^(false|0|no|off|unchecked)$/i.test(text)) return 'false';
  }
  return text;
}

function cmsWriteErrorResponse(error: unknown): NextResponse | null {
  if (error instanceof FormCmsWriteError) {
    return NextResponse.json(
      { error: 'CMS 저장 설정을 확인해 주세요.', cmsIssues: error.issues },
      { status: error.status },
    );
  }
  if (error instanceof BuilderCmsValidationError) {
    return NextResponse.json(
      { error: 'CMS 레코드 검증에 실패했습니다.', cmsIssues: error.issues },
      { status: 400 },
    );
  }
  if (error instanceof BuilderCmsPermissionError) {
    return NextResponse.json(
      { error: 'CMS 컬렉션의 공개 생성 권한이 필요합니다.', cmsIssues: [error.message] },
      { status: 403 },
    );
  }
  return null;
}

function antiSpamResponse(
  schema: FormSchema | null,
  body: z.infer<typeof submitBodySchema>,
  fields: Record<string, string>,
): NextResponse | null {
  const antiSpam = schema?.antiSpam;
  if (!antiSpam) return null;

  const honeypotFieldName = antiSpam.honeypotFieldName?.trim();
  if (honeypotFieldName && fields[honeypotFieldName]?.trim()) {
    return NextResponse.json({ error: '잠시 후 다시 시도해 주세요.' }, { status: 400 });
  }

  const minimumSubmitMs = antiSpam.minimumSubmitMs;
  if (
    typeof minimumSubmitMs === 'number' &&
    minimumSubmitMs > 0 &&
    typeof body.loadedAt === 'number' &&
    typeof body.submittedAt === 'number'
  ) {
    const elapsed = body.submittedAt - body.loadedAt;
    if (elapsed >= 0 && elapsed < minimumSubmitMs) {
      return NextResponse.json({ error: '잠시 후 다시 시도해 주세요.' }, { status: 400 });
    }
  }

  return null;
}

async function duplicateSubmissionResponse(
  schema: FormSchema | null,
  fields: Record<string, string>,
): Promise<NextResponse | null> {
  const duplicateWindowMs = schema?.antiSpam?.duplicateWindowMs;
  const duplicateFields = schema?.antiSpam?.duplicateFields?.filter(Boolean) ?? [];
  if (!schema || !duplicateWindowMs || duplicateWindowMs <= 0 || duplicateFields.length === 0) {
    return null;
  }

  const fingerprint = createHash('sha256')
    .update(schema.formId)
    .update('\n')
    .update(duplicateFields.map((fieldId) => `${fieldId}:${fields[fieldId]?.trim() ?? ''}`).join('\n'))
    .digest('hex')
    .slice(0, 40);
  const duplicate = await checkRateLimit(
    `forms-duplicate:${schema.formId}:${fingerprint}`,
    1,
    duplicateWindowMs,
  );
  if (duplicate.allowed) return null;

  return NextResponse.json(
    { error: '이미 접수된 내용입니다. 잠시 후 다시 시도해 주세요.' },
    {
      status: 409,
      headers: { 'Retry-After': String(Math.ceil(duplicate.retryAfterMs / 1000)) },
    },
  );
}

// ─── POST handler ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = await checkRateLimit(`forms-submit:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) },
      },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = submitBodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: '입력값이 올바르지 않습니다.',
        details: parsed.error.issues.slice(0, 3).map((i) => ({ path: i.path.join('.'), message: i.message })),
      },
      { status: 400 },
    );
  }

  const body = parsed.data;

  // Time-trap: reject if submitted within 3s of load (likely bot).
  if (typeof body.loadedAt === 'number' && typeof body.submittedAt === 'number') {
    const elapsed = body.submittedAt - body.loadedAt;
    if (elapsed >= 0 && elapsed < 3_000) {
      return NextResponse.json({ error: '잠시 후 다시 시도해 주세요.' }, { status: 400 });
    }
  }

  const captchaOk = await verifyCaptcha(body.captchaProvider, body.captchaToken);
  if (!captchaOk) {
    return NextResponse.json({ error: 'Captcha verification failed.' }, { status: 400 });
  }

  const materialized = await materializeDataUrlFields(body.fields, body.locale);
  const fields = materialized.fields;
  const files = [...body.files, ...materialized.files];

  const schema = body.formId
    ? await loadFormSchema(body.formId)
    : await loadFormSchema(body.formName);
  const spamResponse = antiSpamResponse(schema, body, fields);
  if (spamResponse) return spamResponse;
  if (schema) {
    const validationErrors = validateSubmission(schema, fields, { files });
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: '입력값을 확인해 주세요.', validationErrors },
        { status: 400 },
      );
    }
  }
  const duplicateResponse = await duplicateSubmissionResponse(schema, fields);
  if (duplicateResponse) return duplicateResponse;

  const submissionId = makeSubmissionId();
  const submission: FormSubmission = {
    submissionId,
    formId: body.formId ?? body.formName,
    data: { ...fields, _pageSlug: body.pageSlug, _locale: body.locale },
    files: files.length > 0 ? files : undefined,
    submittedAt: new Date().toISOString(),
    ip,
    userAgent: request.headers.get('user-agent') || undefined,
    read: false,
  };

  // Storage (best-effort; if Blob isn't configured, log and continue)
  try {
    await saveSubmission(submission);
  } catch (err) {
    console.error('[forms/submit] storage save failed:', err);
    // Don't fail the request — fall through and try email/webhook.
  }
  let cmsRecordId: string | null = null;
  try {
    cmsRecordId = await writeSubmissionToCms(schema, fields, files, body.locale);
  } catch (err) {
    const response = cmsWriteErrorResponse(err);
    if (response) return response;
    console.error('[forms/submit] CMS write failed:', err);
    return NextResponse.json(
      { error: 'CMS 저장 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
  emitEvent('form.submitted', {
    submissionId: submission.submissionId,
    formId: submission.formId,
    submittedAt: submission.submittedAt,
    fields: submission.data,
    files: submission.files,
    cmsRecordId: cmsRecordId ?? undefined,
  });

  // Routing
  if (body.submitTo === 'email' && body.targetEmail) {
    await attemptEmail(body.targetEmail, body.formName, fields);
  }
  if (body.submitTo === 'webhook' && body.webhookUrl) {
    await forwardToWebhook(body.webhookUrl, {
      formName: body.formName,
      fields,
      files,
      submittedAt: submission.submittedAt,
    });
  }
  if (body.autoReplyEnabled) {
    const replyEmail = findReplyEmail(fields);
    if (replyEmail) {
      const template = body.autoReplyTemplate?.trim() || '문의가 접수되었습니다. 곧 연락드리겠습니다.';
      await sendEmail(
        replyEmail,
        `[${body.formName}] 접수 확인`,
        `<p>${escapeHtml(template).replace(/\n/g, '<br />')}</p>`,
      );
    }
  }

  return NextResponse.json({ ok: true, submissionId, cmsRecordId: cmsRecordId ?? undefined }, { status: 200 });
}
