import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getDomain, makeDomainId, saveDomain } from '@/lib/builder/domains/storage';
import { verifyDomainDns } from '@/lib/builder/domains/dns-verifier';
import { attachDomain, getDomainStatus } from '@/lib/builder/domains/vercel-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * PR #12 — Verify a domain's DNS records and, when satisfied, register it
 * with Vercel. Idempotent: calling repeatedly while DNS is still propagating
 * returns the current status without flipping rows back.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { domain: string } },
) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const binding = await getDomain(makeDomainId(params.domain));
  if (!binding) return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
  if (binding.status === 'active') {
    const status = await getDomainStatus(binding.domain);
    return NextResponse.json({ ok: true, domain: binding, vercel: status });
  }

  const dns = await verifyDomainDns(binding.domain, binding.verificationToken);
  if (!dns.verified) {
    const updated = {
      ...binding,
      status: 'pending-dns' as const,
      lastError: !dns.txtMatched
        ? 'TXT record missing or mismatched'
        : 'CNAME / A record not pointing at Vercel',
    };
    await saveDomain(updated);
    return NextResponse.json({ ok: false, domain: updated, dns });
  }

  const attach = await attachDomain(binding.domain);
  if (!attach.ok) {
    const updated = {
      ...binding,
      status: 'error' as const,
      lastError: attach.error ?? 'attach failed',
      lastVerifiedAt: new Date().toISOString(),
    };
    await saveDomain(updated);
    return NextResponse.json({ ok: false, domain: updated, dns, attachError: attach.error }, { status: 502 });
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
}
