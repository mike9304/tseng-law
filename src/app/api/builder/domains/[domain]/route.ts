import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import { getDomain, makeDomainId, saveDomain } from '@/lib/builder/domains/storage';
import { detachDomain } from '@/lib/builder/domains/vercel-api';
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

export async function GET(request: NextRequest, props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  try {
    const binding = await getDomain(makeDomainId(params.domain));
    if (!binding) return errorResponse(locale, 'domain_not_found', 404);
    return NextResponse.json({ ok: true, domain: binding });
  } catch (error) {
    console.error('[builder/domains/:domain] GET failed:', error);
    return errorResponse(locale, 'domain_load_failed', 500);
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  try {
    const binding = await getDomain(makeDomainId(params.domain));
    if (!binding) return errorResponse(locale, 'domain_not_found', 404);

    const detachResult = await detachDomain(binding.domain);
    const detachError = detachResult.ok ? undefined : apiError(locale, 'domain_detach_failed');
    await saveDomain({
      ...binding,
      status: 'removed',
      lastError: detachError?.error,
    });
    return NextResponse.json({
      ok: true,
      detached: detachResult.ok,
      ...(detachError ? detachError : {}),
    });
  } catch (error) {
    console.error('[builder/domains/:domain] DELETE failed:', error);
    return errorResponse(locale, 'domain_delete_failed', 500);
  }
}
