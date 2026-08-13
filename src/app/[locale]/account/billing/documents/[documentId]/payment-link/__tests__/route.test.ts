import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createBillingDocumentPaymentLink,
  listBillingDocuments,
} from '@/lib/builder/billing-documents';
import { listCustomerBillingDocuments } from '@/lib/builder/billing-customer-portal';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { POST } from '../route';

const { canonicalRow, documentRow, renewedDocument } = vi.hoisted(() => ({
  canonicalRow: {
    source: 'order',
    ownerId: 'ord_member_payment_01',
    ownerLabel: 'TSENG-2026-0042',
    documentId: 'doc-member-payment',
    recipientEmail: 'member@example.com',
  },
  documentRow: {
    documentId: 'doc-member-payment',
    type: 'invoice',
    balanceDue: 5000,
    paymentLinkRenewalNeeded: true,
    paymentLinkPath: null,
    source: 'order',
    ownerLabel: 'TSENG-2026-0042',
  },
  renewedDocument: {
    documentId: 'doc-member-payment',
    type: 'invoice',
    balanceDue: 5000,
    paymentLinkPath: '/payment/doc-member-payment',
  },
}));

vi.mock('@/lib/builder/billing-documents', () => ({
  createBillingDocumentPaymentLink: vi.fn(async () => renewedDocument),
  listBillingDocuments: vi.fn(async () => [canonicalRow]),
}));

vi.mock('@/lib/builder/billing-customer-portal', () => ({
  listCustomerBillingDocuments: vi.fn(async () => [documentRow]),
}));

vi.mock('@/lib/builder/members/current-member', () => ({
  getCurrentSiteMember: vi.fn(async () => ({
    memberId: 'member-payment',
    email: 'member@example.com',
  })),
}));

vi.mock('@/lib/builder/members/members-engine', () => ({
  getMemberPortalEmails: vi.fn(() => ['member@example.com']),
}));

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 5, retryAfterMs: 0 })),
}));

function request(
  origin: string | null = 'https://tseng-law.com',
  url = 'https://tseng-law.com/ko/account/billing/documents/doc-member-payment/payment-link',
): NextRequest {
  const headers: Record<string, string> = {};
  if (origin !== null) headers.origin = origin;
  return new NextRequest(url, { method: 'POST', headers });
}

const context = {
  params: Promise.resolve({ locale: 'ko', documentId: 'doc-member-payment' }),
};

describe('/[locale]/account/billing/documents/[documentId]/payment-link', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: true,
      remaining: 5,
      retryAfterMs: 0,
    });
  });

  it('rejects missing and cross-origin requests before session or payment side effects', async () => {
    const missing = await POST(request(null), context);
    const crossOrigin = await POST(request('https://attacker.example'), context);

    expect(missing.status).toBe(403);
    expect(crossOrigin.status).toBe(403);
    await expect(crossOrigin.json()).resolves.toMatchObject({
      error: 'csrf_origin_mismatch',
      code: 'csrf_origin_mismatch',
    });
    expect(getCurrentSiteMember).not.toHaveBeenCalled();
    expect(listCustomerBillingDocuments).not.toHaveBeenCalled();
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(listBillingDocuments).not.toHaveBeenCalled();
    expect(createBillingDocumentPaymentLink).not.toHaveBeenCalled();
  });

  it('uses the canonical order ID rather than the customer-facing confirmation label', async () => {
    const response = await POST(request(), context);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, document: renewedDocument });
    expect(checkRateLimit).toHaveBeenCalledWith('member-payment-link:member-payment', 6, 60_000);
    expect(createBillingDocumentPaymentLink).toHaveBeenCalledOnce();
    expect(createBillingDocumentPaymentLink).toHaveBeenCalledWith(
      'order',
      'ord_member_payment_01',
      'doc-member-payment',
      { renew: true },
    );
    expect(createBillingDocumentPaymentLink).not.toHaveBeenCalledWith(
      'order',
      'TSENG-2026-0042',
      'doc-member-payment',
      { renew: true },
    );
  });

  it('preserves authentication status after a valid same-origin CSRF check', async () => {
    vi.mocked(getCurrentSiteMember).mockResolvedValueOnce(null);

    const response = await POST(request(), context);

    expect(response.status).toBe(401);
    expect(listCustomerBillingDocuments).not.toHaveBeenCalled();
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(listBillingDocuments).not.toHaveBeenCalled();
    expect(createBillingDocumentPaymentLink).not.toHaveBeenCalled();
  });

  it('does not consume the member limit for a document the member does not own', async () => {
    vi.mocked(listCustomerBillingDocuments).mockResolvedValueOnce([]);

    const response = await POST(request(), context);

    expect(response.status).toBe(404);
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(listBillingDocuments).not.toHaveBeenCalled();
    expect(createBillingDocumentPaymentLink).not.toHaveBeenCalled();
  });

  it('rate limits only after ownership and before resolving or creating a payment link', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      retryAfterMs: 2_100,
    });

    const response = await POST(request(), context);

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('3');
    await expect(response.json()).resolves.toEqual({ error: 'too_many_requests' });
    expect(listCustomerBillingDocuments).toHaveBeenCalledOnce();
    expect(checkRateLimit).toHaveBeenCalledOnce();
    expect(listBillingDocuments).not.toHaveBeenCalled();
    expect(createBillingDocumentPaymentLink).not.toHaveBeenCalled();
  });

  it('fails closed without exposing document data when the shared limiter is unavailable', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    });

    const response = await POST(request(), context);

    expect(response.status).toBe(503);
    expect(response.headers.get('Retry-After')).toBeNull();
    await expect(response.json()).resolves.toEqual({ error: 'rate_limit_unavailable' });
    expect(listBillingDocuments).not.toHaveBeenCalled();
    expect(createBillingDocumentPaymentLink).not.toHaveBeenCalled();
  });

  it('does not create a link when the canonical row no longer belongs to the member', async () => {
    vi.mocked(listBillingDocuments).mockResolvedValueOnce([
      { ...canonicalRow, recipientEmail: 'other@example.com' },
    ] as never);

    const response = await POST(request(), context);

    expect(response.status).toBe(404);
    expect(createBillingDocumentPaymentLink).not.toHaveBeenCalled();
  });

  it('preserves origin-less localhost development requests', async () => {
    const response = await POST(
      request(
        null,
        'http://127.0.0.1:3000/ko/account/billing/documents/doc-member-payment/payment-link',
      ),
      context,
    );

    expect(response.status).toBe(200);
    expect(checkRateLimit).toHaveBeenCalledOnce();
    expect(createBillingDocumentPaymentLink).toHaveBeenCalledOnce();
  });
});
