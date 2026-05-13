import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  loadFormSchema,
  saveSubmission,
  validateSubmission,
  type FormSubmission,
  type FormSubmissionFile,
} from '@/lib/builder/forms/form-engine';
import { saveFormUpload } from '@/lib/builder/forms/uploads';
import { recordFailedWebhook } from '@/lib/builder/forms/webhook-retry';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';

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
        url: z.string().max(2000).optional(),
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
    // Persist for later retry by the drain cron; previously this was
    // a silent loss of the submission webhook.
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
  if (body.loadedAt && body.submittedAt) {
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
  if (schema) {
    const validationErrors = validateSubmission(schema, fields, { files });
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: '입력값을 확인해 주세요.', validationErrors },
        { status: 400 },
      );
    }
  }

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
  emitEvent('form.submitted', {
    submissionId: submission.submissionId,
    formId: submission.formId,
    submittedAt: submission.submittedAt,
    fields: submission.data,
    files: submission.files,
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

  return NextResponse.json({ ok: true, submissionId }, { status: 200 });
}
