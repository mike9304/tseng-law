import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { saveSubmission, type FormSubmission } from '@/lib/builder/forms/form-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── Rate limit (in-memory; resets on cold start) ────────────────────
type RateBucket = { count: number; windowStart: number };
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, RateBucket>();

function allowRequest(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateBuckets.set(ip, { count: 1, windowStart: now });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= RATE_LIMIT_MAX;
}

// ─── Body schema ─────────────────────────────────────────────────────

const submitBodySchema = z.object({
  formName: z.string().trim().min(1).max(80),
  submitTo: z.enum(['email', 'webhook', 'storage']).default('storage'),
  targetEmail: z.string().email().max(200).optional(),
  webhookUrl: z.string().url().max(2000).optional(),
  fields: z.record(z.string().max(80), z.string().max(20000)).default({}),
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
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch (err) {
    console.error('[forms/submit] webhook forward failed:', err);
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

// ─── POST handler ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!allowRequest(ip)) {
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 429 },
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

  const submissionId = makeSubmissionId();
  const submission: FormSubmission = {
    submissionId,
    formId: body.formName,
    data: { ...body.fields, _pageSlug: body.pageSlug, _locale: body.locale },
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

  // Routing
  if (body.submitTo === 'email' && body.targetEmail) {
    await attemptEmail(body.targetEmail, body.formName, body.fields);
  }
  if (body.submitTo === 'webhook' && body.webhookUrl) {
    await forwardToWebhook(body.webhookUrl, {
      formName: body.formName,
      fields: body.fields,
      submittedAt: submission.submittedAt,
    });
  }
  if (body.autoReplyEnabled) {
    const replyEmail = findReplyEmail(body.fields);
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
