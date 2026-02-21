import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import { teamContent, type TeamMember } from '@/data/team-members';

const labels = {
  ko: {
    intro: '소개',
    education: '학력',
    experience: '경력',
    source: '원문 페이지',
    consult: '상담 문의',
    representative: '대표 변호사',
    teamTitle: '소속 변호사 · 직원',
    partnerTitle: '협력 회계사',
  },
  'zh-hant': {
    intro: '簡介',
    education: '學歷',
    experience: '經歷',
    source: '原始頁面',
    consult: '聯絡諮詢',
    representative: '代表律師',
    teamTitle: '所屬律師 · 職員',
    partnerTitle: '合作會計師',
  },
  en: {
    intro: 'Introduction',
    education: 'Education',
    experience: 'Experience',
    source: 'Source page',
    consult: 'Book consultation',
    representative: 'Managing Attorney',
    teamTitle: 'Lawyers & Staff',
    partnerTitle: 'Partner CPA'
  },
} as const;

function MemberCard({ member, locale, size }: { member: TeamMember; locale: Locale; size: 'large' | 'small' }) {
  const l = labels[locale];
  const isLarge = size === 'large';

  return (
    <article id={member.id} className={`attorney-card ${isLarge ? 'attorney-card--lead' : 'attorney-card--sub'}`}>
      <div className={`attorney-card-photo ${isLarge ? 'attorney-card-photo--lead' : 'attorney-card-photo--sub'}`}>
        <Image
          src={member.photo}
          alt={`${member.name} ${member.role}`}
          fill
          style={{ objectFit: 'cover' }}
          sizes={isLarge ? '(max-width: 768px) 100vw, 400px' : '(max-width: 768px) 100vw, 200px'}
        />
      </div>
      <div className="attorney-card-info">
        <h3 className={`attorney-card-name ${isLarge ? 'attorney-card-name--lead' : ''}`}>{member.name}</h3>
        <p className="attorney-card-role">{member.role}</p>
        <a href={`mailto:${member.email}`} className="attorney-card-email">{member.email}</a>

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

        <p className="attorney-card-source">
          {l.source}:{' '}
          <a href={member.sourceUrl} target="_blank" rel="noreferrer" className="link-underline">{member.sourceUrl}</a>
        </p>
        <Link href={`/${locale}/contact`} className="button button--outline attorney-card-cta">{l.consult}</Link>
      </div>
    </article>
  );
}

export default function AttorneyProfileSection({ locale }: { locale: Locale }) {
  const team = teamContent[locale];
  const l = labels[locale];

  const lead = team.members.find((m) => m.id === 'tseng-junwei');
  const staff = team.members.filter((m) => m.id !== 'tseng-junwei' && m.id !== 'huang-shengping');
  const accountant = team.members.find((m) => m.id === 'huang-shengping');

  return (
    <section className="section section--light">
      <div className="container">
        <div className="section-label">{team.label}</div>
        <h2 className="section-title">{team.title}</h2>
        <p className="section-lede">{team.description}</p>

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
