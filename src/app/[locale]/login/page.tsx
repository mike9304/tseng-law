import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import MemberAuthClient from '@/components/members/MemberAuthClient';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { normalizeSiteLocale, type SiteLocale } from '@/lib/locales';
import { resolveSafeNextPath } from '@/lib/safe-next';
import { buildSeoMetadata } from '@/lib/seo';

const LOGIN_DESCRIPTIONS: Record<SiteLocale, string> = {
  ko: '회원 계정에 로그인합니다.',
  'zh-hant': '登入您的會員帳戶。',
  en: 'Sign in to your member account.',
  ja: '会員アカウントにログインします。',
};

const LOGIN_TITLES: Record<SiteLocale, string> = {
  ko: '회원 로그인',
  'zh-hant': '會員登入',
  en: 'Member sign in',
  ja: '会員ログイン',
};

export async function generateMetadata(props: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: LOGIN_TITLES[locale],
    description: LOGIN_DESCRIPTIONS[locale],
    path: '/login',
    noindex: true,
    follow: true,
  });
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
