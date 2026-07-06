import { createHash } from 'node:crypto';
import { z } from 'zod';
import type { CrmContact } from './contact-model';

const statusIfNewSchema = z.enum(['subscribed', 'pending', 'transactional']);

const mailchimpSettingsSchema = z.object({
  apiKey: z.string().trim().min(1).optional(),
  audienceId: z.string().trim().min(1).optional(),
  serverPrefix: z.string().trim().min(1).optional(),
  apiUrl: z.string().trim().url().optional(),
  statusIfNew: statusIfNewSchema.optional(),
}).passthrough();

type MailchimpSettings = z.infer<typeof mailchimpSettingsSchema>;

type MailchimpStatusIfNew = z.infer<typeof statusIfNewSchema>;

export interface MailchimpAudienceEnv {
  readonly MAILCHIMP_MARKETING_API_KEY?: string;
  readonly MAILCHIMP_API_KEY?: string;
  readonly MAILCHIMP_AUDIENCE_ID?: string;
  readonly MAILCHIMP_SERVER_PREFIX?: string;
  readonly MAILCHIMP_MARKETING_API_URL?: string;
  readonly NODE_ENV?: string;
}

export type MailchimpAudienceSyncResult =
  | {
      readonly ok: true;
      readonly status: 'synced';
      readonly subscriberHash: string;
    }
  | {
      readonly ok: true;
      readonly status: 'skipped';
      readonly reason: string;
    }
  | {
      readonly ok: false;
      readonly status: 'failed';
      readonly error: string;
      readonly statusCode?: number;
      readonly subscriberHash?: string;
    };

export interface MailchimpAudienceSyncOptions {
  readonly env?: MailchimpAudienceEnv;
  readonly fetchImpl?: typeof fetch;
  readonly settings?: Record<string, unknown>;
}

interface MailchimpAudienceConfig {
  readonly apiKey: string;
  readonly audienceId: string;
  readonly apiBaseUrl: string;
  readonly statusIfNew: MailchimpStatusIfNew;
}

interface MailchimpMemberPayload {
  readonly email_address: string;
  readonly status_if_new: MailchimpStatusIfNew;
  readonly merge_fields: {
    readonly FNAME?: string;
    readonly LNAME?: string;
  };
}

interface MailchimpTagPayload {
  readonly tags: readonly {
    readonly name: string;
    readonly status: 'active';
  }[];
}

const MISSING_CONFIG = 'Mailchimp Marketing API key or audience id is not configured';

function trimmed(value: string | undefined): string | undefined {
  const candidate = value?.trim();
  return candidate ? candidate : undefined;
}

function parseSettings(settings: Record<string, unknown> | undefined): MailchimpSettings {
  const parsed = mailchimpSettingsSchema.safeParse(settings ?? {});
  return parsed.success ? parsed.data : {};
}

function deriveServerPrefix(apiKey: string | undefined): string | undefined {
  if (!apiKey) return undefined;
  const parts = apiKey.split('-');
  if (parts.length < 2) return undefined;
  const suffix = parts.at(-1)?.trim().toLowerCase();
  return suffix && /^[a-z0-9]+$/.test(suffix) ? suffix : undefined;
}

function resolveConfig(
  settings: MailchimpSettings,
  env: MailchimpAudienceEnv,
): MailchimpAudienceConfig | MailchimpAudienceSyncResult {
  const apiKey =
    trimmed(settings.apiKey) ??
    trimmed(env.MAILCHIMP_MARKETING_API_KEY) ??
    trimmed(env.MAILCHIMP_API_KEY);
  const audienceId = trimmed(settings.audienceId) ?? trimmed(env.MAILCHIMP_AUDIENCE_ID);

  if (!apiKey || !audienceId) {
    if (env.NODE_ENV === 'production') return { ok: false, status: 'failed', error: MISSING_CONFIG };
    return { ok: true, status: 'skipped', reason: MISSING_CONFIG };
  }

  const serverPrefix =
    trimmed(settings.serverPrefix) ??
    trimmed(env.MAILCHIMP_SERVER_PREFIX) ??
    deriveServerPrefix(apiKey);
  const apiBaseUrl =
    trimmed(settings.apiUrl) ??
    trimmed(env.MAILCHIMP_MARKETING_API_URL) ??
    (serverPrefix ? `https://${serverPrefix}.api.mailchimp.com/3.0` : undefined);

  if (!apiBaseUrl) {
    return {
      ok: false,
      status: 'failed',
      error: 'Mailchimp server prefix or API URL is not configured',
    };
  }

  return {
    apiKey,
    audienceId,
    apiBaseUrl: apiBaseUrl.replace(/\/+$/, ''),
    statusIfNew: settings.statusIfNew ?? 'subscribed',
  };
}

export function mailchimpSubscriberHash(email: string): string {
  return createHash('md5').update(email.trim().toLowerCase()).digest('hex');
}

function joinMailchimpUrl(baseUrl: string, parts: readonly string[]): string {
  return `${baseUrl}/${parts.map((part) => encodeURIComponent(part)).join('/')}`;
}

function buildMergeFields(contact: CrmContact): MailchimpMemberPayload['merge_fields'] {
  const name = contact.name?.trim();
  if (!name) return {};
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts.at(0);
  if (!first) return {};
  const rest = parts.slice(1).join(' ');
  return rest ? { FNAME: first, LNAME: rest } : { FNAME: first };
}

function buildMemberPayload(contact: CrmContact, statusIfNew: MailchimpStatusIfNew): MailchimpMemberPayload {
  return {
    email_address: contact.email.trim().toLowerCase(),
    status_if_new: statusIfNew,
    merge_fields: buildMergeFields(contact),
  };
}

function buildTagPayload(contact: CrmContact): MailchimpTagPayload | null {
  const tags = Array.from(
    new Set(contact.tags.map((tag) => tag.trim()).filter(Boolean)),
  )
    .slice(0, 32)
    .map((name) => ({ name, status: 'active' as const }));
  return tags.length ? { tags } : null;
}

async function responsePreview(response: Response): Promise<string> {
  const text = await response.text().catch(() => '');
  return text.slice(0, 200);
}

function authHeader(apiKey: string): string {
  return `Basic ${Buffer.from(`tseng-law:${apiKey}`, 'utf8').toString('base64')}`;
}

async function sendJson(
  fetchImpl: typeof fetch,
  url: string,
  method: 'PUT' | 'POST',
  apiKey: string,
  body: MailchimpMemberPayload | MailchimpTagPayload,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    return await fetchImpl(url, {
      method,
      headers: {
        Authorization: authHeader(apiKey),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function syncMailchimpAudienceMember(
  contact: CrmContact,
  options: MailchimpAudienceSyncOptions = {},
): Promise<MailchimpAudienceSyncResult> {
  const env = options.env ?? process.env;
  const settings = parseSettings(options.settings);
  const resolved = resolveConfig(settings, env);
  if ('ok' in resolved) return resolved;

  const fetchImpl = options.fetchImpl ?? fetch;
  const email = contact.email.trim().toLowerCase();
  const subscriberHash = mailchimpSubscriberHash(email);
  const memberUrl = joinMailchimpUrl(resolved.apiBaseUrl, [
    'lists',
    resolved.audienceId,
    'members',
    subscriberHash,
  ]);

  try {
    const memberResponse = await sendJson(
      fetchImpl,
      memberUrl,
      'PUT',
      resolved.apiKey,
      buildMemberPayload({ ...contact, email }, resolved.statusIfNew),
    );
    if (!memberResponse.ok) {
      const detail = await responsePreview(memberResponse);
      return {
        ok: false,
        status: 'failed',
        error: `${memberResponse.status} ${detail}`,
        statusCode: memberResponse.status,
        subscriberHash,
      };
    }

    const tagPayload = buildTagPayload(contact);
    if (tagPayload) {
      const tagResponse = await sendJson(
        fetchImpl,
        `${memberUrl}/tags`,
        'POST',
        resolved.apiKey,
        tagPayload,
      );
      if (!tagResponse.ok) {
        const detail = await responsePreview(tagResponse);
        return {
          ok: false,
          status: 'failed',
          error: `${tagResponse.status} ${detail}`,
          statusCode: tagResponse.status,
          subscriberHash,
        };
      }
    }

    return { ok: true, status: 'synced', subscriberHash };
  } catch (error) {
    return {
      ok: false,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown Mailchimp sync failure',
      subscriberHash,
    };
  }
}
