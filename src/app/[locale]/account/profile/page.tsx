import { redirect } from 'next/navigation';
import MemberProfileClient from '@/components/members/MemberProfileClient';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { publicMember } from '@/lib/builder/members/members-engine';
import styles from '@/components/members/MembersArea.module.css';

export const dynamic = 'force-dynamic';

export default async function MemberProfilePage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const member = await getCurrentSiteMember();
  if (!member) redirect(`/${locale}/login?next=${encodeURIComponent(`/${locale}/account/profile`)}`);

  return (
    <main className={styles.accountPage} data-member-profile-page="true">
      <section className={styles.accountShell}>
        <div className={styles.accountHero}>
          <p>{member.role}</p>
          <h1>{locale === 'ko' ? '회원 프로필' : locale === 'zh-hant' ? '會員個人資料' : 'Member profile'}</h1>
          <span>{locale === 'ko' ? '프로필 정보는 저장 후 계정 페이지와 회원 내비게이션에 반영됩니다.' : locale === 'zh-hant' ? '儲存後會反映在帳戶頁面與會員導覽。' : 'Saved profile details power account pages and member navigation.'}</span>
        </div>
        <MemberProfileClient locale={locale} member={publicMember(member)} />
      </section>
    </main>
  );
}
