import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { sendMarketingEmail, type MarketingEmailFetch } from '../email-provider';

interface CapturedRequest {
  readonly url: string;
  readonly body: string;
  readonly authorization?: string;
}

function firstCall(calls: readonly CapturedRequest[]): CapturedRequest {
  const call = calls[0];
  if (!call) throw new Error('expected provider request');
  return call;
}

function baseArgs() {
  return {
    to: 'lead@example.test',
    fromName: 'Hojeong',
    fromAddress: 'bookings@hoveringlaw.com.tw',
    subject: 'Newsletter',
    html: '<p>Hello</p>',
    text: 'Hello',
  };
}

const mailchimpBodySchema = z.object({
  key: z.string().optional(),
  message: z.object({
    from_email: z.string().optional(),
    from_name: z.string().optional(),
    subject: z.string().optional(),
    html: z.string().optional(),
    text: z.string().optional(),
    to: z.array(z.object({ email: z.string().optional(), type: z.string().optional() })).optional(),
  }).optional(),
});

const resendBodySchema = z.object({
  to: z.string().optional(),
  from: z.string().optional(),
  subject: z.string().optional(),
});

describe('sendMarketingEmail provider routing', () => {
  it('sends Mailchimp Transactional payloads when Mailchimp is configured', async () => {
    const calls: CapturedRequest[] = [];
    const fetchImpl: MarketingEmailFetch = async (url, init) => {
      calls.push({
        url,
        body: typeof init.body === 'string' ? init.body : '',
      });
      return new Response(JSON.stringify([{ email: 'lead@example.test', status: 'sent', _id: 'mc_1' }]), {
        status: 200,
      });
    };

    const result = await sendMarketingEmail(baseArgs(), {
      env: {
        MARKETING_EMAIL_PROVIDER: 'mailchimp-transactional',
        MAILCHIMP_TRANSACTIONAL_API_KEY: 'mc-secret',
      },
      fetchImpl,
    });

    const call = firstCall(calls);
    const rawBody: unknown = JSON.parse(call.body);
    const body = mailchimpBodySchema.parse(rawBody);

    expect(result).toEqual({ ok: true, provider: 'mailchimp-transactional', id: 'mc_1' });
    expect(call.url).toBe('https://mandrillapp.com/api/1.0/messages/send.json');
    expect(body.key).toBe('mc-secret');
    expect(body.message?.from_email).toBe('bookings@hoveringlaw.com.tw');
    expect(body.message?.from_name).toBe('Hojeong');
    expect(body.message?.subject).toBe('Newsletter');
    expect(body.message?.html).toBe('<p>Hello</p>');
    expect(body.message?.text).toBe('Hello');
    expect(body.message?.to).toEqual([{ email: 'lead@example.test', type: 'to' }]);
  });

  it('reports Mailchimp rejected recipients as provider failures', async () => {
    const fetchImpl: MarketingEmailFetch = async () =>
      new Response(
        JSON.stringify([{ email: 'lead@example.test', status: 'rejected', reject_reason: 'hard-bounce' }]),
        { status: 200 },
      );

    const result = await sendMarketingEmail(baseArgs(), {
      env: {
        MARKETING_EMAIL_PROVIDER: 'mailchimp-transactional',
        MAILCHIMP_TRANSACTIONAL_API_KEY: 'mc-secret',
      },
      fetchImpl,
    });

    expect(result).toEqual({
      ok: false,
      provider: 'mailchimp-transactional',
      error: 'rejected hard-bounce',
    });
  });

  it('keeps Resend delivery available when Resend is the configured provider', async () => {
    const calls: CapturedRequest[] = [];
    const fetchImpl: MarketingEmailFetch = async (url, init) => {
      const headers = new Headers(init.headers);
      const authorization = headers.get('authorization');
      calls.push({
        url,
        body: typeof init.body === 'string' ? init.body : '',
        ...(authorization ? { authorization } : {}),
      });
      return new Response(JSON.stringify({ id: 'rs_1' }), { status: 200 });
    };

    const result = await sendMarketingEmail(baseArgs(), {
      env: {
        MARKETING_EMAIL_PROVIDER: 'resend',
        RESEND_API_KEY: 'rs-secret',
      },
      fetchImpl,
    });

    const call = firstCall(calls);
    const rawBody: unknown = JSON.parse(call.body);
    const body = resendBodySchema.parse(rawBody);

    expect(result).toEqual({ ok: true, provider: 'resend', id: 'rs_1' });
    expect(call.url).toBe('https://api.resend.com/emails');
    expect(call.authorization).toBe('Bearer rs-secret');
    expect(body).toMatchObject({
      to: 'lead@example.test',
      from: 'Hojeong <bookings@hoveringlaw.com.tw>',
      subject: 'Newsletter',
    });
  });

  it('uses the development stub only outside production when no provider is configured', async () => {
    const result = await sendMarketingEmail(baseArgs(), {
      env: { NODE_ENV: 'development' },
      fetchImpl: async () => new Response('{}', { status: 500 }),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.provider).toBe('stub');
      expect(result.id.startsWith('stub_')).toBe(true);
    }
  });

  it('fails closed in production when no email provider is configured', async () => {
    const result = await sendMarketingEmail(baseArgs(), {
      env: { NODE_ENV: 'production' },
      fetchImpl: async () => new Response('{}', { status: 200 }),
    });

    expect(result).toEqual({
      ok: false,
      provider: 'stub',
      error: 'No marketing email provider configured in production',
    });
  });
});
