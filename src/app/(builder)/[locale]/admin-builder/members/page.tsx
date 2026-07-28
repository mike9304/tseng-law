import type { Metadata } from 'next';
import MembersAdminClient from '@/components/builder/members/MembersAdminClient';
import { listMembers, publicMember } from '@/lib/builder/members/members-engine';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: locale === 'ko' ? '회원 관리자' : locale === 'zh-hant' ? '會員管理員' : 'Builder Members Admin',
    description:
      locale === 'ko'
        ? '회원과 회원 역할을 관리하는 화면입니다.'
        : locale === 'zh-hant'
          ? '管理會員與會員角色的畫面。'
          : 'Manage members and member roles.',
    path: '/admin-builder/members',
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function BuilderMembersAdminPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const members = (await listMembers()).map(publicMember);

  return <MembersAdminClient locale={locale} initialMembers={members} />;
}
