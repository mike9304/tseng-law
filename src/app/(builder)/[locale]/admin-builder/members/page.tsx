import type { Metadata } from 'next';
import MembersAdminClient from '@/components/builder/members/MembersAdminClient';
import { listMembers, publicMember } from '@/lib/builder/members/members-engine';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import { requireBuilderPagePermission } from '@/lib/builder/security/page-permission';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
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

export default async function BuilderMembersAdminPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  await requireBuilderPagePermission('manage-users');
  const members = (await listMembers()).map(publicMember);

  return <MembersAdminClient locale={locale} initialMembers={members} />;
}
