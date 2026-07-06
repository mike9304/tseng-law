import { z } from 'zod';

export type MarketingEmailProvider = 'resend' | 'mailchimp-transactional' | 'stub';

export interface MarketingEmailArgs {
  readonly to: string;
  readonly fromName: string;
  readonly fromAddress: string;
  readonly subject: string;
  readonly html: string;
  readonly text: string;
}

export type MarketingEmailSendResult =
  | { readonly ok: true; readonly provider: MarketingEmailProvider; readonly id: string }
  | { readonly ok: false; readonly provider: MarketingEmailProvider; readonly error: string };

export type MarketingEmailEnv = Readonly<Record<string, string | undefined>>;

export type MarketingEmailFetch = (
  url: string,
  init: RequestInit,
) => Promise<Response>;

export interface MarketingEmailProviderStatus {
  readonly provider: MarketingEmailProvider;
  readonly configured: boolean;
  readonly productionReady: boolean;
  readonly missing: readonly string[];
}

interface SendOptions {
  readonly env?: MarketingEmailEnv;
  readonly fetchImpl?: MarketingEmailFetch;
}

const EMAIL_PROVIDER_TIMEOUT_MS = 8_000;
const MAILCHIMP_TRANSACTIONAL_URL = 'https://mandrillapp.com/api/1.0/messages/send.json';

const resendResponseSchema = z.object({
  id: z.string().optional(),
});

const mailchimpRecipientSchema = z.object({
  email: z.string().optional(),
  status: z.string(),
  _id: z.string().optional(),
  reject_reason: z.string().optional(),
});

const mailchimpResponseSchema = z.array(mailchimpRecipientSchema).min(1);

function normalizeProvider(value: string | undefined): MarketingEmailProvider | null {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized === 'resend') return 'resend';
  if (normalized === 'stub') return 'stub';
  if (normalized === 'mailchimp' || normalized === 'mandrill') return 'mailchimp-transactional';
  if (normalized === 'mailchimp-transactional') return 'mailchimp-transactional';
  return null;
}

function selectProvider(env: MarketingEmailEnv): MarketingEmailProvider {
  const explicit = normalizeProvider(env.MARKETING_EMAIL_PROVIDER);
  if (explicit) return explicit;
  if (env.MAILCHIMP_TRANSACTIONAL_API_KEY || env.MANDRILL_API_KEY) return 'mailchimp-transactional';
  if (env.RESEND_API_KEY) return 'resend';
  return 'stub';
}

export function getMarketingEmailProviderStatus(
  env: MarketingEmailEnv = process.env,
): MarketingEmailProviderStatus {
  const provider = selectProvider(env);
  if (provider === 'resend') {
    const configured = Boolean(env.RESEND_API_KEY?.trim());
    return {
      provider,
      configured,
      productionReady: configured,
      missing: configured ? [] : ['RESEND_API_KEY'],
    };
  }
  if (provider === 'mailchimp-transactional') {
    const configured = Boolean(env.MAILCHIMP_TRANSACTIONAL_API_KEY?.trim() || env.MANDRILL_API_KEY?.trim());
    return {
      provider,
      configured,
      productionReady: configured,
      missing: configured ? [] : ['MAILCHIMP_TRANSACTIONAL_API_KEY'],
    };
  }
  return {
    provider,
    configured: false,
    productionReady: env.NODE_ENV !== 'production',
    missing: ['MARKETING_EMAIL_PROVIDER'],
  };
}

async function readText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch (error) {
    if (error instanceof Error) return '';
    throw error;
  }
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    if (error instanceof Error) return null;
    throw error;
  }
}

async function fetchWithTimeout(
  fetchImpl: MarketingEmailFetch,
  url: string,
  init: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), EMAIL_PROVIDER_TIMEOUT_MS);
  try {
    return await fetchImpl(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function sendResendEmail(
  args: MarketingEmailArgs,
  env: MarketingEmailEnv,
  fetchImpl: MarketingEmailFetch,
): Promise<MarketingEmailSendResult> {
  const apiKey = env.RESEND_API_KEY?.trim();
  if (!apiKey) return { ok: false, provider: 'resend', error: 'RESEND_API_KEY unset' };

  try {
    const response = await fetchWithTimeout(fetchImpl, 'https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${args.fromName} <${args.fromAddress}>`,
        to: args.to,
        subject: args.subject,
        html: args.html,
        text: args.text,
      }),
    });
    if (!response.ok) {
      const detail = await readText(response);
      return { ok: false, provider: 'resend', error: `${response.status} ${detail.slice(0, 200)}` };
    }
    const parsed = resendResponseSchema.safeParse(await readJson(response));
    return { ok: true, provider: 'resend', id: parsed.success ? parsed.data.id ?? 'resend' : 'resend' };
  } catch (error) {
    if (error instanceof Error) return { ok: false, provider: 'resend', error: error.message };
    throw error;
  }
}

function isMailchimpSuccessStatus(status: string): boolean {
  return ['sent', 'queued', 'scheduled'].some((value) => value === status);
}

async function sendMailchimpTransactionalEmail(
  args: MarketingEmailArgs,
  env: MarketingEmailEnv,
  fetchImpl: MarketingEmailFetch,
): Promise<MarketingEmailSendResult> {
  const apiKey = env.MAILCHIMP_TRANSACTIONAL_API_KEY?.trim() || env.MANDRILL_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, provider: 'mailchimp-transactional', error: 'MAILCHIMP_TRANSACTIONAL_API_KEY unset' };
  }

  try {
    const response = await fetchWithTimeout(fetchImpl, env.MAILCHIMP_TRANSACTIONAL_API_URL?.trim() || MAILCHIMP_TRANSACTIONAL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: apiKey,
        message: {
          from_email: args.fromAddress,
          from_name: args.fromName,
          subject: args.subject,
          html: args.html,
          text: args.text,
          to: [{ email: args.to, type: 'to' }],
        },
      }),
    });
    if (!response.ok) {
      const detail = await readText(response);
      return {
        ok: false,
        provider: 'mailchimp-transactional',
        error: `${response.status} ${detail.slice(0, 200)}`,
      };
    }
    const parsed = mailchimpResponseSchema.safeParse(await readJson(response));
    if (!parsed.success) {
      return { ok: false, provider: 'mailchimp-transactional', error: 'invalid Mailchimp response' };
    }
    const first = parsed.data[0];
    if (!first) {
      return { ok: false, provider: 'mailchimp-transactional', error: 'empty Mailchimp response' };
    }
    if (!isMailchimpSuccessStatus(first.status)) {
      return {
        ok: false,
        provider: 'mailchimp-transactional',
        error: [first.status, first.reject_reason].filter(Boolean).join(' '),
      };
    }
    return { ok: true, provider: 'mailchimp-transactional', id: first._id ?? first.status };
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, provider: 'mailchimp-transactional', error: error.message };
    }
    throw error;
  }
}

export async function sendMarketingEmail(
  args: MarketingEmailArgs,
  options: SendOptions = {},
): Promise<MarketingEmailSendResult> {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? fetch;
  const provider = selectProvider(env);
  if (provider === 'stub') {
    if (env.NODE_ENV === 'production') {
      return { ok: false, provider: 'stub', error: 'No marketing email provider configured in production' };
    }
    return { ok: true, provider: 'stub', id: `stub_${Date.now()}` };
  }
  if (provider === 'mailchimp-transactional') {
    return sendMailchimpTransactionalEmail(args, env, fetchImpl);
  }
  return sendResendEmail(args, env, fetchImpl);
}
