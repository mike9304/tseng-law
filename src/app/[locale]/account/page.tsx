import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from '@/components/members/MembersArea.module.css';

export const dynamic = 'force-dynamic';

export default async function MemberAccountPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const member = await getCurrentSiteMember();
  if (!member) redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/account`)}`);
  const isPremium = member.role === 'premium' || member.role === 'admin';

  return (
    <main className={styles.accountPage} data-member-account-page="true">
      <section className={styles.accountShell}>
        <div className={styles.accountHero}>
          <p>{member.role}</p>
          <h1>{locale === 'ko' ? `${member.name}님의 계정` : locale === 'zh-hant' ? `${member.name} 的帳戶` : `${member.name}'s account`}</h1>
          <span>{member.email}</span>
        </div>
        <div className={styles.accountGrid}>
          <article className={styles.accountCard}>
            <strong>{locale === 'ko' ? '프로필' : locale === 'zh-hant' ? '個人資料' : 'Profile'}</strong>
            <p>{locale === 'ko' ? '이름, 전화번호 등 회원 정보를 관리합니다.' : locale === 'zh-hant' ? '管理姓名、電話等會員資料。' : 'Manage name, phone, and member details.'}</p>
            <Link className={styles.accountLink} href={`/${locale}/account/profile`}>
              {locale === 'ko' ? '프로필 열기' : locale === 'zh-hant' ? '開啟個人資料' : 'Open profile'}
            </Link>
          </article>
          <article className={styles.accountCard}>
            <strong>{locale === 'ko' ? '회원 전용 콘텐츠' : locale === 'zh-hant' ? '會員內容' : 'Member content'}</strong>
            <p>{locale === 'ko' ? '로그인한 회원만 접근할 수 있는 보호 페이지입니다.' : locale === 'zh-hant' ? '登入會員才能查看的頁面。' : 'A protected page for signed-in members.'}</p>
            <Link className={styles.accountLink} href={`/${locale}/account`}>
              {locale === 'ko' ? '현재 페이지' : locale === 'zh-hant' ? '目前頁面' : 'Current page'}
            </Link>
          </article>
          <article className={styles.accountCard}>
            <strong>{locale === 'ko' ? '예약' : locale === 'zh-hant' ? '預約' : 'Bookings'}</strong>
            <p>{locale === 'ko' ? '회원 이메일과 일치하는 예정/지난 상담 예약을 확인합니다.' : locale === 'zh-hant' ? '查看與會員信箱相符的即將到來與過去諮詢。' : 'Review upcoming and past consultations tied to your member email.'}</p>
            <Link className={styles.accountLink} href={`/${locale}/account/bookings`} data-member-bookings-link="true">
              {locale === 'ko' ? '예약 보기' : locale === 'zh-hant' ? '查看預約' : 'View bookings'}
            </Link>
          </article>
          <article className={styles.accountCard}>
            <strong>{locale === 'ko' ? '프리미엄 영역' : locale === 'zh-hant' ? '進階會員區' : 'Premium area'}</strong>
            <p>{isPremium
              ? (locale === 'ko' ? '현재 역할로 접근할 수 있습니다.' : locale === 'zh-hant' ? '目前角色可存取。' : 'Your current role can access this.')
              : (locale === 'ko' ? 'Premium 또는 Admin 역할이 필요합니다.' : locale === 'zh-hant' ? '需要 Premium 或 Admin 角色。' : 'Premium or Admin role is required.')}
            </p>
            <Link className={styles.accountLink} href={`/${locale}/account/premium`} data-member-premium-link={isPremium ? 'visible' : 'locked'}>
              {locale === 'ko' ? '프리미엄 확인' : locale === 'zh-hant' ? '查看進階區' : 'Check premium'}
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
