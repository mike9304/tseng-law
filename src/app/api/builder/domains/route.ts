import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getDomainByName,
  listDomains,
  makeDomainId,
  makeVerificationToken,
  saveDomain,
} from '@/lib/builder/domains/storage';
import type { DomainBinding } from '@/lib/builder/domains/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DOMAIN_RE = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const payloadSchema = z.object({
  domain: z.string().trim().min(3).max(253).toLowerCase().regex(DOMAIN_RE, 'invalid domain'),
});

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const domains = await listDomains();
  return NextResponse.json({ ok: true, domains, total: domains.length });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid domain', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }
  const existing = await getDomainByName(parsed.data.domain);
  if (existing && existing.status !== 'removed') {
    return NextResponse.json({ ok: true, domain: existing, alreadyRegistered: true });
  }
  const now = new Date().toISOString();
  const binding: DomainBinding = {
    domainId: makeDomainId(parsed.data.domain),
    domain: parsed.data.domain,
    verificationToken: makeVerificationToken(),
    cnameTarget: 'cname.vercel-dns.com',
    status: 'pending-dns',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await saveDomain(binding);
  return NextResponse.json({ ok: true, domain: binding }, { status: 201 });
}
