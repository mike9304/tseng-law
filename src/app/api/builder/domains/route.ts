import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getDomainByName,
  listDomains,
  makeDomainId,
  makeVerificationToken,
  saveDomain,
} from '@/lib/builder/domains/storage';
import type { DomainBinding } from '@/lib/builder/domains/types';
import {
  getBuilderDomainsApiErrorPayload,
  type BuilderDomainsApiErrorCode,
} from '@/lib/builder/domains/domains-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DOMAIN_RE = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const payloadSchema = z.object({
  domain: z.string().trim().min(3).max(253).toLowerCase().regex(DOMAIN_RE, 'invalid domain'),
});

function requestLocale(request: NextRequest): Locale {
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderDomainsApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderDomainsApiErrorPayload(locale, errorCode),
      ...(extra ?? {}),
    },
    { status },
  );
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  try {
    const domains = await listDomains();
    return NextResponse.json({ ok: true, domains, total: domains.length });
  } catch (error) {
    console.error('[builder/domains] GET failed:', error);
    return errorResponse(locale, 'domains_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch (error) {
    console.error('[builder/domains] POST JSON parse failed:', error);
    return errorResponse(locale, 'invalid_json', 400);
  }
  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'validation_error', 400, { details: parsed.error.issues.slice(0, 3) });
  }

  try {
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
  } catch (error) {
    console.error('[builder/domains] POST failed:', error);
    return errorResponse(locale, 'domain_create_failed', 500);
  }
}
