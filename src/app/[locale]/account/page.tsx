import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from '@/components/members/MembersArea.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const title = locale === 'ko' ? '회원 계정' : locale === 'zh-hant' ? '會員帳戶' : 'Member account';
  return {
    title,
    robots: { index: false, follow: false },
  };
}

export default async function MemberAccountPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const member = await getCurrentSiteMember();
  if (!member) redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/account`)}`);
  const isPremium = member.role === 'premium' || member.role === 'admin';
  const profileNote = member.customFields?.profileNote?.trim() || '';
  const memberEmailAliases = (() => {
    try {
      return member.customFields?.memberEmailAliases ? JSON.parse(member.customFields.memberEmailAliases) : [];
    } catch {
      return [];
    }
  })() as string[];
  const notificationSummary = [
    member.customFields?.bookingEmailReminders === 'true'
      ? (locale === 'ko' ? '예약 이메일' : locale === 'zh-hant' ? '預約信件' : 'Booking email')
      : null,
    member.customFields?.bookingSmsReminders === 'true'
      ? (locale === 'ko' ? '예약 SMS' : locale === 'zh-hant' ? '預約簡訊' : 'Booking SMS')
      : null,
    member.customFields?.billingEmails === 'true'
      ? (locale === 'ko' ? '청구서 이메일' : locale === 'zh-hant' ? '帳單信件' : 'Billing email')
      : null,
  ].filter(Boolean) as string[];

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
            <div className={styles.accountProfileSummary} data-member-account-profile-summary="true">
              {member.profilePhoto ? (
                <Image
                  className={styles.accountProfilePhoto}
                  src={member.profilePhoto}
                  alt={member.name}
                  width={64}
                  height={64}
                  sizes="64px"
                  loading="eager"
                  unoptimized={!member.profilePhoto.startsWith('/') || member.profilePhoto.startsWith('//')}
                  data-member-account-profile-photo="true"
                />
              ) : (
                <div className={styles.accountProfilePhotoPlaceholder} data-member-account-profile-photo="empty">
                  {member.name.slice(0, 1).toUpperCase()}
                </div>
              )}
              <p>{locale === 'ko' ? '이름, 전화번호 등 회원 정보를 관리합니다.' : locale === 'zh-hant' ? '管理姓名、電話等會員資料。' : 'Manage name, phone, and member details.'}</p>
              {profileNote ? (
                <small data-member-account-profile-note="true">{profileNote}</small>
              ) : null}
              {memberEmailAliases.length > 0 ? (
                <div className={styles.accountProfileChipRow} data-member-account-profile-aliases="true">
                  <span className={styles.accountProfileChipLabel}>
                    {locale === 'ko' ? '이전 이메일' : locale === 'zh-hant' ? '舊信箱' : 'Previous emails'}
                  </span>
                  {memberEmailAliases.map((email) => (
                    <span key={email} className={styles.accountProfileChip}>
                      {email}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className={styles.accountProfileChipRow} data-member-account-profile-notification-summary="true">
                <span className={styles.accountProfileChipLabel}>
                  {locale === 'ko' ? '알림' : locale === 'zh-hant' ? '通知' : 'Notifications'}
                </span>
                {notificationSummary.length > 0 ? (
                  notificationSummary.map((item) => (
                    <span key={item} className={styles.accountProfileChip}>
                      {item}
                    </span>
                  ))
                ) : (
                  <small>{locale === 'ko' ? '현재 알림 없음' : locale === 'zh-hant' ? '目前沒有通知偏好' : 'No notification preferences set'}</small>
                )}
              </div>
            </div>
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
            <strong>{locale === 'ko' ? '청구서' : locale === 'zh-hant' ? '帳單' : 'Billing'}</strong>
            <p>{locale === 'ko' ? '회원 이메일과 연결된 청구서와 영수증을 확인하고 결제 링크를 열 수 있습니다.' : locale === 'zh-hant' ? '查看與會員信箱連結的帳單與收據，並可開啟付款連結。' : 'Review invoices and receipts tied to your member email and open payment links.'}</p>
            <Link className={styles.accountLink} href={`/${locale}/account/billing`} data-member-billing-link="true">
              {locale === 'ko' ? '청구서 보기' : locale === 'zh-hant' ? '查看帳單' : 'View billing'}
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
