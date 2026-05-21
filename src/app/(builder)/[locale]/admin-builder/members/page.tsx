import type { Metadata } from 'next';
import MembersAdminClient from '@/components/builder/members/MembersAdminClient';
import { listMembers, publicMember } from '@/lib/builder/members/members-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: 'Builder Members Admin',
    description: '회원과 회원 역할을 관리하는 화면입니다.',
    path: '/admin-builder/members',
    noindex: true,
  });
}

export default async function BuilderMembersAdminPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const members = (await listMembers()).map(publicMember);

  return <MembersAdminClient locale={locale} initialMembers={members} />;
}
