import { NextRequest, NextResponse } from 'next/server';
import { getMembersApiErrorPayload } from '@/lib/builder/members/members-api-copy';
import { normalizeSiteLocale, type SiteLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function resolveRequestLocale(request: NextRequest): SiteLocale {
  const queryLocale = request.nextUrl.searchParams.get('locale') ?? undefined;
  return normalizeSiteLocale(queryLocale);
}

export async function POST(request: NextRequest) {
  const locale = resolveRequestLocale(request);
  const errorPayload = locale === 'ja'
    ? {
        error: '一般公開の会員登録は受け付けていません。会員アカウントは事務所での確認後に発行されます。',
        errorCode: 'public_signup_disabled' as const,
      }
    : getMembersApiErrorPayload(locale, 'public_signup_disabled');
  return NextResponse.json(
    {
      ok: false,
      ...errorPayload,
    },
    {
      status: 403,
      headers: {
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Robots-Tag': 'noindex, noarchive',
      },
    },
  );
}
