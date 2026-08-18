import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { checkAccess } from '@/lib/builder/members/members-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from '@/components/members/MembersArea.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const title = locale === 'ko' ? '프리미엄 회원 영역' : locale === 'zh-hant' ? '進階會員區' : 'Premium member area';
  return {
    title,
    robots: { index: false, follow: false },
  };
}

export default async function MemberPremiumPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const member = await getCurrentSiteMember();
  if (!member) redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/account/premium`)}`);

  const allowed = checkAccess({
    pageId: 'premium-account',
    requireLogin: true,
    allowedRoles: ['premium', 'admin'],
  }, member);

  return (
    <main className={styles.accountPage} data-member-premium-page="true" data-member-role-allowed={allowed ? 'true' : 'false'}>
      <section className={styles.protectedPanel}>
        <p>{member.role}</p>
        <h1>{allowed
          ? (locale === 'ko' ? '프리미엄 회원 영역' : locale === 'zh-hant' ? '進階會員區' : 'Premium member area')
          : (locale === 'ko' ? '역할 권한이 필요합니다' : locale === 'zh-hant' ? '需要角色權限' : 'Role access required')}
        </h1>
        <p>{allowed
          ? (locale === 'ko' ? 'Premium/Admin 역할로 보호 콘텐츠에 접근했습니다.' : locale === 'zh-hant' ? '已使用 Premium/Admin 角色進入受保護內容。' : 'You reached protected content with a Premium/Admin role.')
          : (locale === 'ko' ? '이 페이지는 Premium 또는 Admin 회원에게만 공개됩니다.' : locale === 'zh-hant' ? '此頁僅開放給 Premium 或 Admin 會員。' : 'This page is available only to Premium or Admin members.')}
        </p>
        <Link href={`/${locale}/account`}>
          {locale === 'ko' ? '계정으로 돌아가기' : locale === 'zh-hant' ? '返回帳戶' : 'Back to account'}
        </Link>
      </section>
    </main>
  );
}
