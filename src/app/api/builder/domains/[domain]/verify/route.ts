import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import { getDomain, makeDomainId, saveDomain } from '@/lib/builder/domains/storage';
import { verifyDomainDns } from '@/lib/builder/domains/dns-verifier';
import { attachDomain, getDomainStatus } from '@/lib/builder/domains/vercel-api';
import {
  getBuilderDomainsApiErrorPayload,
  type BuilderDomainsApiErrorCode,
} from '@/lib/builder/domains/domains-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function requestLocale(request: NextRequest): Locale {
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function apiError(locale: Locale, errorCode: BuilderDomainsApiErrorCode): ReturnType<typeof getBuilderDomainsApiErrorPayload> {
  return getBuilderDomainsApiErrorPayload(locale, errorCode);
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderDomainsApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...apiError(locale, errorCode),
    },
    { status },
  );
}

/**
 * PR #12 — Verify a domain's DNS records and, when satisfied, register it
 * with Vercel. Idempotent: calling repeatedly while DNS is still propagating
 * returns the current status without flipping rows back.
 */
export async function POST(request: NextRequest, props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  try {
    const binding = await getDomain(makeDomainId(params.domain));
    if (!binding) return errorResponse(locale, 'domain_not_found', 404);
    if (binding.status === 'active') {
      const status = await getDomainStatus(binding.domain);
      return NextResponse.json({ ok: true, domain: binding, vercel: status });
    }

    const dns = await verifyDomainDns(binding.domain, binding.verificationToken);
    if (!dns.verified) {
      const pendingError = apiError(locale, 'domain_dns_pending');
      const updated = {
        ...binding,
        status: 'pending-dns' as const,
        lastError: pendingError.error,
      };
      await saveDomain(updated);
      return NextResponse.json({ ok: false, ...pendingError, domain: updated, dns });
    }

    const attach = await attachDomain(binding.domain);
    if (!attach.ok) {
      const attachError = apiError(locale, 'domain_attach_failed');
      const updated = {
        ...binding,
        status: 'error' as const,
        lastError: attachError.error,
        lastVerifiedAt: new Date().toISOString(),
      };
      await saveDomain(updated);
      return NextResponse.json({ ok: false, ...attachError, domain: updated, dns, attachError: attachError.error }, { status: 502 });
    }

    const updated = {
      ...binding,
      status: 'active' as const,
      lastVerifiedAt: new Date().toISOString(),
      lastError: undefined,
      vercelDomainId: attach.data?.name,
    };
    await saveDomain(updated);
    return NextResponse.json({ ok: true, domain: updated, dns });
  } catch (error) {
    console.error('[builder/domains/:domain/verify] POST failed:', error);
    return errorResponse(locale, 'domain_verify_failed', 500);
  }
}
