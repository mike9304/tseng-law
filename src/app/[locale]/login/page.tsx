import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import MemberAuthClient from '@/components/members/MemberAuthClient';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const title = locale === 'ko' ? '회원 로그인' : locale === 'zh-hant' ? '會員登入' : 'Member sign in';
  return { title };
}

function safeNext(locale: Locale, value?: string | string[]): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !raw.startsWith(`/${locale}`) || raw.startsWith(`/${locale}//`)) return `/${locale}/account`;
  return raw;
}

export default async function MemberLoginPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { next?: string | string[] };
}) {
  const locale = normalizeLocale(params.locale);
  const nextPath = safeNext(locale, searchParams?.next);
  const member = await getCurrentSiteMember();
  if (member) redirect(nextPath);

  return <MemberAuthClient locale={locale} nextPath={nextPath} />;
}
