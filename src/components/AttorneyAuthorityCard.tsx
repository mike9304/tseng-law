import Image from 'next/image';
import Link from 'next/link';
import { getAttorneyProfile, getAttorneyProfilePath, primaryAttorneySlug } from '@/data/attorney-profiles';
import type { Locale } from '@/lib/locales';

const cardLabels = {
  ko: {
    eyebrow: 'Lead Attorney',
    heading: '담당 변호사',
    practice: '주요 대응 분야',
    channels: '공개 프로필 및 채널',
    profile: '상세 프로필',
    contact: '상담 문의',
  },
  'zh-hant': {
    eyebrow: 'Lead Attorney',
    heading: '承辦律師',
    practice: '主要服務領域',
    channels: '公開簡介與頻道',
    profile: '完整簡介',
    contact: '聯絡諮詢',
  },
  en: {
    eyebrow: 'Lead Attorney',
    heading: 'Lead Attorney',
    practice: 'Core Practice Areas',
    channels: 'Public Profiles and Channels',
    profile: 'Full Profile',
    contact: 'Book Consultation',
  },
} as const;

export default function AttorneyAuthorityCard({
  locale,
  heading,
}: {
  locale: Locale;
  heading?: string;
}) {
  const profile = getAttorneyProfile(locale, primaryAttorneySlug);

  if (!profile) {
    return null;
  }

  const labels = cardLabels[locale];
  const practiceAreas = profile.practiceAreas.slice(0, 4);
  const channels = profile.externalProfiles.slice(0, 3);
  const profileHref = getAttorneyProfilePath(locale, profile.slug);

  return (
    <section className="authority-card">
      <div className="authority-card-eyebrow">{labels.eyebrow}</div>
      <div className="authority-card-heading">{heading ?? labels.heading}</div>
      <div className="authority-card-top">
        <div className="authority-card-photo">
          <Image
            src={profile.image}
            alt={`${profile.name} ${profile.role}`}
            fill
            sizes="112px"
            className="person-photo"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="authority-card-copy">
          <Link href={profileHref} className="authority-card-name">
            {profile.name}
          </Link>
          <p className="authority-card-role">{profile.role}</p>
          <p className="authority-card-summary">{profile.summary[0]}</p>
        </div>
      </div>

      <div className="authority-card-block">
        <div className="authority-card-label">{labels.practice}</div>
        <div className="authority-chip-list">
          {practiceAreas.map((item) => (
            <span key={item} className="authority-chip">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="authority-card-block">
        <div className="authority-card-label">{labels.channels}</div>
        <ul className="authority-link-list">
          {channels.map((item) => (
            <li key={item.href}>
              <a href={item.href} target="_blank" rel="noreferrer" className="link-underline">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="authority-card-actions">
        <Link href={profileHref} className="button button--outline">
          {labels.profile}
        </Link>
        <Link href={`/${locale}/contact`} className="button">
          {labels.contact}
        </Link>
      </div>
    </section>
  );
}
