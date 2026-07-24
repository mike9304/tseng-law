import Image from 'next/image';
import Link from 'next/link';
import type { SiteLocale } from '@/lib/locales';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { teamContent, type TeamMember } from '@/data/team-members';

const labels = {
  ko: {
    intro: '소개',
    education: '학력',
    experience: '경력',
    fullProfile: '상세 프로필',
    consult: '상담 문의',
    representative: '대표 변호사',
    teamTitle: '소속 변호사 · 직원',
    partnerTitle: '협력 회계사',
  },
  'zh-hant': {
    intro: '簡介',
    education: '學歷',
    experience: '經歷',
    fullProfile: '完整簡介',
    consult: '聯絡諮詢',
    representative: '代表律師',
    teamTitle: '所屬律師 · 職員',
    partnerTitle: '合作會計師',
  },
  en: {
    intro: 'Introduction',
    education: 'Education',
    experience: 'Experience',
    fullProfile: 'Full profile',
    consult: 'Book consultation',
    representative: 'Managing Attorney',
    teamTitle: 'Lawyers & Staff',
    partnerTitle: 'Partner CPA',
  },
  ja: {
    intro: '紹介',
    education: '学歴',
    experience: '経歴',
    fullProfile: '詳細プロフィール',
    consult: '相談を申し込む',
    representative: '代表弁護士',
    teamTitle: '所属弁護士・スタッフ',
    partnerTitle: '提携会計士',
  },
} as const;

function MemberCard({ member, locale, size }: { member: TeamMember; locale: SiteLocale; size: 'large' | 'small' }) {
  const l = labels[locale];
  const isLarge = size === 'large';
  const profileHref = member.profileSlug ? getAttorneyProfilePath(locale, member.profileSlug) : null;
  const imageAlt = locale === 'ko'
    ? `${member.role.includes('변호사') ? '대만변호사' : member.role} ${member.name} — 법무법인 호정 ${member.role}`
    : `${member.name} ${member.role}`;

  return (
    <article id={member.id} className={`attorney-card ${isLarge ? 'attorney-card--lead' : 'attorney-card--sub'}`}>
      <div className={`attorney-card-photo ${isLarge ? 'attorney-card-photo--lead' : 'attorney-card-photo--sub'}`}>
        <Image
          src={member.photo}
          alt={imageAlt}
          fill
          className="person-photo"
          style={{ objectFit: 'cover' }}
          sizes={isLarge ? '(max-width: 768px) 100vw, 400px' : '(max-width: 768px) 100vw, 200px'}
        />
      </div>
      <div className="attorney-card-info">
        <h3 className={`attorney-card-name ${isLarge ? 'attorney-card-name--lead' : ''}`}>
          {profileHref ? (
            <Link href={profileHref} className="attorney-card-name-link">
              {member.name}
            </Link>
          ) : (
            member.name
          )}
        </h3>
        <p className="attorney-card-role">{member.role}</p>
        {member.email ? (
          <a href={`mailto:${member.email}`} className="attorney-card-email">{member.email}</a>
        ) : null}

        <div className="attorney-card-section">
          <div className="attorney-card-label">{l.intro}</div>
          <ul className="attorney-list">
            {member.intro.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>

        <div className="attorney-card-section">
          <div className="attorney-card-label">{l.education}</div>
          <ul className="attorney-list">
            {member.education.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>

        <div className="attorney-card-section">
          <div className="attorney-card-label">{l.experience}</div>
          <ul className="attorney-list">
            {member.experience.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>

        <div className="attorney-card-actions">
          {profileHref ? (
            <Link href={profileHref} className="button button--outline attorney-card-cta">
              {l.fullProfile}
            </Link>
          ) : null}
          <Link href={`/${locale}/contact`} className="button button--outline attorney-card-cta">
            {l.consult}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function AttorneyProfileSection({
  locale,
  showIntro = true,
}: {
  locale: SiteLocale;
  showIntro?: boolean;
}) {
  const team = teamContent[locale];
  const members = teamContent[locale].members;
  const l = labels[locale];

  const lead = members.find((m) => m.id === 'tseng-junwei');
  const staff = members.filter((m) => m.id !== 'tseng-junwei' && m.id !== 'huang-shengping');
  const accountant = members.find((m) => m.id === 'huang-shengping');

  return (
    <section className="section section--light attorney-team-section">
      <div className="container">
        {showIntro ? (
          <>
            <div className="section-label" data-builder-surface-key="section-label">
              {team.label}
            </div>
            <h2 className="section-title" data-builder-surface-key="headline">
              {team.title}
            </h2>
            <p className="section-lede" data-builder-surface-key="description">
              {team.description}
            </p>
          </>
        ) : null}

        {/* 대표 변호사 */}
        {lead && (
          <div className="attorney-lead-wrap">
            <h3 className="attorney-group-title">
              <span className="attorney-group-badge">{l.representative}</span>
            </h3>
            <MemberCard member={lead} locale={locale} size="large" />
          </div>
        )}

        {/* 소속 변호사 · 직원 */}
        {staff.length > 0 && (
          <div className="attorney-staff-wrap">
            <h3 className="attorney-group-title">{l.teamTitle}</h3>
            <div className="attorney-staff-grid">
              {staff.map((m) => (
                <MemberCard key={m.id} member={m} locale={locale} size="small" />
              ))}
            </div>
          </div>
        )}

        {/* 협력 회계사 */}
        {accountant && (
          <div className="attorney-partner-wrap">
            <h3 className="attorney-group-title">{l.partnerTitle}</h3>
            <MemberCard member={accountant} locale={locale} size="small" />
          </div>
        )}
      </div>
    </section>
  );
}
