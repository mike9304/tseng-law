import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { readPublishedPageCanvas } from '@/lib/builder/site/published-canvas';
import { stripeCheckoutIdempotencyKey } from '@/lib/builder/forms/stripe-checkout-config';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({
    allowed: true,
    remaining: 9,
    retryAfterMs: 0,
  })),
}));

vi.mock('@/lib/builder/site/persistence', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/site/persistence')>();
  return {
    ...actual,
    readSiteDocument: vi.fn(),
  };
});

vi.mock('@/lib/builder/site/published-canvas', () => ({
  readPublishedPageCanvas: vi.fn(),
}));

const page = {
  pageId: 'page-payment',
  slug: 'pay',
  title: { ko: '결제', 'zh-hant': '付款', en: 'Payment' },
  locale: 'ko',
  createdAt: '2026-07-30T00:00:00.000Z',
  updatedAt: '2026-07-30T00:00:00.000Z',
  publishedAt: '2026-07-30T00:00:00.000Z',
};

const paymentNode = {
  id: 'payment-node',
  kind: 'form-payment',
  content: {
    name: 'payment',
    label: '상담 결제',
    provider: 'stripe-checkout',
    amountCents: 120000,
    currency: 'KRW',
    description: '서버에 게시된 상담 비용',
    successUrl: '',
    cancelUrl: '',
    showSecurityNote: true,
  },
};

function request(
  body: Record<string, unknown> = {
    amountCents: 120000,
    currency: 'KRW',
    description: '서버에 게시된 상담 비용',
  },
  headers: Record<string, string> = {},
): NextRequest {
  return new NextRequest('https://tseng-law.com/api/forms/stripe-checkout', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://tseng-law.com',
      referer: 'https://tseng-law.com/ko/pay',
      'x-forwarded-for': '203.0.113.10',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function stripeSuccess(url = 'https://checkout.stripe.com/c/pay_test_123'): Response {
  return new Response(JSON.stringify({ url }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

describe('/api/forms/stripe-checkout POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_not_real');
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: true,
      remaining: 9,
      retryAfterMs: 0,
    });
    vi.mocked(readSiteDocument).mockResolvedValue({
      pages: [page],
    } as unknown as Awaited<ReturnType<typeof readSiteDocument>>);
    vi.mocked(readPublishedPageCanvas).mockResolvedValue({
      version: 1,
      pageId: page.pageId,
      locale: 'ko',
      nodes: [paymentNode],
      updatedAt: '2026-07-30T00:00:00.000Z',
    } as unknown as Awaited<ReturnType<typeof readPublishedPageCanvas>>);
    vi.stubGlobal('fetch', vi.fn(async () => stripeSuccess()));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('uses the price and description resolved from the published payment node', async () => {
    const route = await import('../route');
    const response = await route.POST(request());

    expect(response.status).toBe(200);
    expect(checkRateLimit).toHaveBeenCalledWith('forms-stripe-checkout:203.0.113.10', 10, 60_000);
    const [, options] = vi.mocked(fetch).mock.calls[0]!;
    const stripeBody = options?.body as URLSearchParams;
    expect(stripeBody.get('line_items[0][price_data][unit_amount]')).toBe('120000');
    expect(stripeBody.get('line_items[0][price_data][currency]')).toBe('krw');
    expect(stripeBody.get('line_items[0][price_data][product_data][name]'))
      .toBe('서버에 게시된 상담 비용');
    expect(stripeBody.get('success_url')).toBe('https://tseng-law.com/ko?payment=success');
    expect(stripeBody.get('cancel_url')).toBe('https://tseng-law.com/ko?payment=cancel');
    expect(response.headers.get('set-cookie')).toContain('tseng_form_checkout=');
    expect(response.headers.get('cache-control')).toBe('private, no-store, max-age=0');
  });

  it('rejects a cross-origin request before rate limiting, persistence, or Stripe', async () => {
    const route = await import('../route');
    const response = await route.POST(request(undefined, {
      origin: 'https://evil.example',
      referer: 'https://evil.example/ko/pay',
    }));

    expect(response.status).toBe(403);
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(readSiteDocument).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects a tampered amount that is not present in the published page', async () => {
    const route = await import('../route');
    const response = await route.POST(request({
      amountCents: 50,
      currency: 'KRW',
      description: '위조된 저가 결제',
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: 'Payment does not match a published offer.',
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects a tampered product description instead of forwarding it to Stripe', async () => {
    const route = await import('../route');
    const response = await route.POST(request({
      amountCents: 120000,
      currency: 'KRW',
      description: '공격자가 바꾼 상품명',
    }));

    expect(response.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects a client redirect that differs from the published same-origin configuration', async () => {
    const route = await import('../route');
    const response = await route.POST(request({
      amountCents: 120000,
      currency: 'KRW',
      description: '상담 비용',
      successUrl: 'https://evilstripe.com/paid',
    }));

    expect(response.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('fails closed when the referenced page is not published', async () => {
    vi.mocked(readSiteDocument).mockResolvedValue({
      pages: [{ ...page, publishedAt: undefined }],
    } as unknown as Awaited<ReturnType<typeof readSiteDocument>>);
    const route = await import('../route');
    const response = await route.POST(request());

    expect(response.status).toBe(400);
    expect(readPublishedPageCanvas).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects evilstripe.com and other non-Stripe Checkout response URLs', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => stripeSuccess('https://checkout.evilstripe.com/session')));
    const route = await import('../route');
    const response = await route.POST(request());

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      error: 'Stripe returned an invalid Checkout URL.',
    });
  });

  it('uses the same Stripe idempotency key when a visitor replays the same published offer', async () => {
    const visitor = 'b5b1b2c8-7f7d-4c0d-8a9f-e45da8ab04bd';
    const route = await import('../route');
    const first = await route.POST(request(undefined, {
      cookie: `tseng_form_checkout=${visitor}`,
    }));
    const replay = await route.POST(request(undefined, {
      cookie: `tseng_form_checkout=${visitor}`,
    }));

    expect(first.status).toBe(200);
    expect(replay.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(2);
    const firstHeaders = vi.mocked(fetch).mock.calls[0]?.[1]?.headers as Record<string, string>;
    const replayHeaders = vi.mocked(fetch).mock.calls[1]?.[1]?.headers as Record<string, string>;
    expect(firstHeaders['Idempotency-Key']).toMatch(/^form-checkout-[a-f0-9]{64}$/);
    expect(replayHeaders['Idempotency-Key']).toBe(firstHeaders['Idempotency-Key']);
  });

  it('changes the idempotency key when the published description or return URL changes', () => {
    const baseOffer = {
      pageId: 'page-payment',
      nodeId: 'payment-node',
      amountCents: 120000,
      currency: 'KRW' as const,
      description: '상담 비용',
      successUrl: 'https://tseng-law.com/ko?payment=success',
      cancelUrl: 'https://tseng-law.com/ko?payment=cancel',
    };
    const visitor = 'b5b1b2c8-7f7d-4c0d-8a9f-e45da8ab04bd';
    const original = stripeCheckoutIdempotencyKey(baseOffer, visitor);

    expect(stripeCheckoutIdempotencyKey({
      ...baseOffer,
      description: '변경된 상담 비용',
    }, visitor)).not.toBe(original);
    expect(stripeCheckoutIdempotencyKey({
      ...baseOffer,
      successUrl: 'https://tseng-law.com/ko/thank-you',
    }, visitor)).not.toBe(original);
  });

  it('fails closed before Stripe when the durable limiter backend is unavailable', async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: false,
      remaining: 0,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    });
    const route = await import('../route');
    const response = await route.POST(request());

    expect(response.status).toBe(503);
    expect(readSiteDocument).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
});
