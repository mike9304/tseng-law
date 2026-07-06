import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { z } from 'zod';

const ORIGINAL_CWD = process.cwd();
const ORIGINAL_ENV = { ...process.env };

let tmpRoot = '';

const memberPayloadSchema = z.object({
  email_address: z.string(),
  status_if_new: z.string(),
  merge_fields: z.object({
    FNAME: z.string().optional(),
    LNAME: z.string().optional(),
  }),
});

const tagPayloadSchema = z.object({
  tags: z.array(z.object({ name: z.string(), status: z.literal('active') })),
});

type CapturedRequest = {
  readonly url: string;
  readonly init?: RequestInit;
};

function headerValue(headers: HeadersInit | undefined, name: string): string | null {
  if (!headers) return null;
  return new Headers(headers).get(name);
}

function requireCaptured(requests: readonly CapturedRequest[], index: number): CapturedRequest {
  const request = requests.at(index);
  if (!request) throw new Error(`Missing captured request ${index}`);
  return request;
}

function createFetchRecorder(requests: CapturedRequest[]): typeof fetch {
  return async (input, init) => {
    requests.push({ url: String(input), init });
    return new Response(JSON.stringify({ id: 'mailchimp-member-1' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };
}

beforeEach(async () => {
  vi.resetModules();
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'crm-mailchimp-'));
  process.chdir(tmpRoot);
  process.env = { ...ORIGINAL_ENV };
  process.env.CRM_BACKEND = 'local';
  delete process.env.BLOB_READ_WRITE_TOKEN;
});

afterEach(async () => {
  process.chdir(ORIGINAL_CWD);
  process.env = { ...ORIGINAL_ENV };
  await fs.rm(tmpRoot, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe('Mailchimp audience sync', () => {
  it('upserts a CRM contact into a Mailchimp list member and activates CRM tags', async () => {
    const { syncMailchimpAudienceMember } = await import('../mailchimp-audience');
    const requests: CapturedRequest[] = [];

    const result = await syncMailchimpAudienceMember(
      {
        id: 'ct_1',
        email: 'Lead@Example.com',
        name: 'Ada Lovelace',
        phone: '+82 10 0000 0000',
        source: 'form',
        tags: ['subscriber', 'vip'],
        createdAt: '2026-06-18T00:00:00.000Z',
        lastActivityAt: '2026-06-18T00:00:00.000Z',
      },
      {
        env: {
          MAILCHIMP_MARKETING_API_KEY: 'abc-us6',
          MAILCHIMP_AUDIENCE_ID: 'aud_123',
          NODE_ENV: 'test',
        },
        fetchImpl: createFetchRecorder(requests),
      },
    );

    expect(result).toEqual({
      ok: true,
      status: 'synced',
      subscriberHash: '30ad2c0f23715693f75dbfc09a93f3e5',
    });
    expect(requests).toHaveLength(2);

    const memberRequest = requireCaptured(requests, 0);
    expect(memberRequest.url).toBe(
      'https://us6.api.mailchimp.com/3.0/lists/aud_123/members/30ad2c0f23715693f75dbfc09a93f3e5',
    );
    expect(memberRequest.init?.method).toBe('PUT');
    expect(headerValue(memberRequest.init?.headers, 'authorization')).toBe(
      `Basic ${Buffer.from('tseng-law:abc-us6').toString('base64')}`,
    );
    expect(memberPayloadSchema.parse(JSON.parse(String(memberRequest.init?.body)))).toEqual({
      email_address: 'lead@example.com',
      status_if_new: 'subscribed',
      merge_fields: { FNAME: 'Ada', LNAME: 'Lovelace' },
    });

    const tagRequest = requireCaptured(requests, 1);
    expect(tagRequest.url).toBe(
      'https://us6.api.mailchimp.com/3.0/lists/aud_123/members/30ad2c0f23715693f75dbfc09a93f3e5/tags',
    );
    expect(tagRequest.init?.method).toBe('POST');
    expect(tagPayloadSchema.parse(JSON.parse(String(tagRequest.init?.body)))).toEqual({
      tags: [
        { name: 'subscriber', status: 'active' },
        { name: 'vip', status: 'active' },
      ],
    });
  });

  it('skips development sync when no Mailchimp audience credentials are configured', async () => {
    const { syncMailchimpAudienceMember } = await import('../mailchimp-audience');
    const fetchImpl = vi.fn<typeof fetch>();

    const result = await syncMailchimpAudienceMember(
      {
        id: 'ct_2',
        email: 'missing@example.com',
        source: 'manual',
        tags: [],
        createdAt: '2026-06-18T00:00:00.000Z',
        lastActivityAt: '2026-06-18T00:00:00.000Z',
      },
      { env: { NODE_ENV: 'development' }, fetchImpl },
    );

    expect(result).toEqual({
      ok: true,
      status: 'skipped',
      reason: 'Mailchimp Marketing API key or audience id is not configured',
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('fails closed in production when a Mailchimp audience integration lacks credentials', async () => {
    const { syncMailchimpAudienceMember } = await import('../mailchimp-audience');

    const result = await syncMailchimpAudienceMember(
      {
        id: 'ct_3',
        email: 'prod@example.com',
        source: 'manual',
        tags: [],
        createdAt: '2026-06-18T00:00:00.000Z',
        lastActivityAt: '2026-06-18T00:00:00.000Z',
      },
      { env: { NODE_ENV: 'production' }, fetchImpl: vi.fn<typeof fetch>() },
    );

    expect(result).toEqual({
      ok: false,
      status: 'failed',
      error: 'Mailchimp Marketing API key or audience id is not configured',
    });
  });

  it('dispatches enabled Mailchimp integrations through the audience sync adapter', async () => {
    const { mutateIntegrations } = await import('../integrations-model');
    const { dispatchToIntegrations } = await import('../integrations-dispatcher');
    const requests: CapturedRequest[] = [];

    await mutateIntegrations((current) => ({
      next: [
        ...current,
        {
          id: 'int_mailchimp',
          kind: 'mailchimp-stub',
          settings: {
            apiKey: 'abc-us6',
            audienceId: 'aud_123',
          },
          enabled: true,
          createdAt: '2026-06-18T00:00:00.000Z',
        },
      ],
      result: null,
    }));

    await dispatchToIntegrations(
      {
        kind: 'contact-created',
        contact: {
          id: 'ct_4',
          email: 'Dispatch@Example.com',
          source: 'manual',
          tags: ['subscriber'],
          createdAt: '2026-06-18T00:00:00.000Z',
          lastActivityAt: '2026-06-18T00:00:00.000Z',
        },
      },
      { fetchImpl: createFetchRecorder(requests) },
    );

    expect(requireCaptured(requests, 0).url).toBe(
      'https://us6.api.mailchimp.com/3.0/lists/aud_123/members/bd530c976810cdcf0abce42cf83a1f8c',
    );
    expect(requireCaptured(requests, 1).url).toBe(
      'https://us6.api.mailchimp.com/3.0/lists/aud_123/members/bd530c976810cdcf0abce42cf83a1f8c/tags',
    );
  });
});
