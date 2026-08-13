import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import MemberAuthClient from '@/components/members/MemberAuthClient';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { normalizeSiteLocale, type SiteLocale } from '@/lib/locales';
import { resolveSafeNextPath } from '@/lib/safe-next';

export async function generateMetadata(props: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  const title = locale === 'ko'
    ? '회원 로그인'
    : locale === 'zh-hant'
      ? '會員登入'
      : locale === 'ja'
        ? '会員ログイン'
        : 'Member sign in';
  return { title };
}

export default async function MemberLoginPage(
  props: {
    params: Promise<{ locale: SiteLocale }>;
    searchParams?: Promise<{ next?: string | string[] }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  const nextPath = resolveSafeNextPath(locale, searchParams?.next);
  const member = await getCurrentSiteMember();
  if (member) redirect(nextPath);

  return <MemberAuthClient locale={locale} nextPath={nextPath} />;
}
