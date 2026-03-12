import Image from 'next/image';
import Link from 'next/link';
import { getAllColumnPosts } from '@/lib/columns';
import type { Locale } from '@/lib/locales';
import { serviceAreas } from '@/data/service-details';
import { getAttorneyProfile, getAttorneyProfilePath, primaryAttorneySlug } from '@/data/attorney-profiles';

const mediaHubLabels = {
  ko: {
    label: 'PUBLIC PROFILE',
    title: '증준외 변호사 프로필과 공개 채널',
    description:
      '공식 프로필, 외부 소개, YouTube, 블로그와 주요 법률 주제를 한곳에 정리했습니다.',
    stats: {
      languages: '상담 언어',
      services: '핵심 업무분야',
      columns: '공개 칼럼',
      channels: '검증 가능한 채널',
    },
    channels: '공식 프로필 및 채널',
    topics: '주요 설명 주제',
    matters: '대표 사례',
    profile: '증준외 프로필 보기',
    contact: '미디어·상담 문의',
  },
  'zh-hant': {
    label: 'PUBLIC PROFILE',
    title: '曾俊瑋律師公開簡介與頻道',
    description:
      '集中整理曾俊瑋律師的官方簡介、外部介紹、YouTube、部落格與主要法律主題。',
    stats: {
      languages: '可服務語言',
      services: '核心服務領域',
      columns: '公開專欄',
      channels: '可驗證頻道',
    },
    channels: '官方簡介與頻道',
    topics: '主要說明主題',
    matters: '代表案例',
    profile: '查看曾俊瑋律師簡介',
    contact: '媒體與諮詢聯絡',
  },
  en: {
    label: 'PUBLIC PROFILE',
    title: 'Attorney Wei Tseng profile, channels, and focus topics',
    description:
      'This page brings together Attorney Wei Tseng’s official profiles, external references, public channels, and core Taiwan-law topics.',
    stats: {
      languages: 'Working Languages',
      services: 'Core Practice Areas',
      columns: 'Published Columns',
      channels: 'Verified Channels',
    },
    channels: 'Official Profiles and Channels',
    topics: 'Focus Topics',
    matters: 'Representative Matters',
    profile: 'View Wei Tseng Profile',
    contact: 'Media and Consultation',
  },
} as const;

export default function AttorneyMediaHub({ locale }: { locale: Locale }) {
  const profile = getAttorneyProfile(locale, primaryAttorneySlug);

  if (!profile) {
    return null;
  }

  const labels = mediaHubLabels[locale];
  const profileHref = getAttorneyProfilePath(locale, profile.slug);
  const columnCount = getAllColumnPosts(locale).length;
  const stats = [
    { label: labels.stats.languages, value: String(profile.languages.length) },
    { label: labels.stats.services, value: String(serviceAreas.length) },
    { label: labels.stats.columns, value: String(columnCount) },
    { label: labels.stats.channels, value: String(profile.externalProfiles.length) },
  ];

  return (
    <section className="section section--light media-hub-section">
      <div className="container">
        <div className="media-hub-hero">
          <div className="media-hub-profile">
            <div className="media-hub-photo">
              <Image
                src={profile.image}
                alt={`${profile.name} ${profile.role}`}
                fill
                sizes="(max-width: 900px) 100vw, 280px"
                className="person-photo"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="media-hub-copy">
              <div className="section-label">{labels.label}</div>
              <h2 className="section-title media-hub-title">{labels.title}</h2>
              <p className="section-lede">{labels.description}</p>
              <p className="media-hub-role">{profile.name} · {profile.role}</p>
              <div className="media-hub-actions">
                <Link href={profileHref} className="button button--outline">
                  {labels.profile}
                </Link>
                <Link href={`/${locale}/contact`} className="button">
                  {labels.contact}
                </Link>
              </div>
            </div>
          </div>

          <div className="media-hub-stats">
            {stats.map((item) => (
              <article key={item.label} className="media-stat-card">
                <div className="media-stat-value">{item.value}</div>
                <div className="media-stat-label">{item.label}</div>
              </article>
            ))}
          </div>
        </div>

        <div className="media-hub-grid">
          <article className="media-hub-card">
            <h3 className="profile-card-title">{labels.channels}</h3>
            <ul className="profile-link-list">
              {profile.externalProfiles.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="link-underline" target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </article>

          <article className="media-hub-card">
            <h3 className="profile-card-title">{labels.topics}</h3>
            <ul className="attorney-list">
              {profile.practiceAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="media-hub-card media-hub-card--wide">
            <h3 className="profile-card-title">{labels.matters}</h3>
            <ul className="attorney-list">
              {profile.notableMatters.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
