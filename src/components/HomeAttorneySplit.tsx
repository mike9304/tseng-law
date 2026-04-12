import Image from 'next/image';
import type { Locale } from '@/lib/locales';
import SmartLink from '@/components/SmartLink';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { teamContent } from '@/data/team-members';
import {
  homeAttorneyButtonSurfaceIds,
  homeAttorneyImageSurfaceIds,
  homeAttorneyTextSurfaceIds,
} from '@/lib/builder/registry';

const copyByLocale = {
  ko: {
    label: 'ABOUT',
    title: '증준외 변호사, 한국 고객을 위한 대만 법률 파트너',
    description:
      '대만 변호사 증준외는 한국어·일본어·중국어 커뮤니케이션 역량을 바탕으로 투자·법인설립·소송까지 연결된 전략을 제공합니다.',
    summary:
      '10년 이상 실무 경험, SBS 모닝와이드 출연, WEI Lawyer 채널 운영을 통해 실제 사례 중심의 법률 지원을 이어가고 있습니다.',
    cta: '변호사 프로필 보기'
  },
  'zh-hant': {
    label: 'ABOUT',
    title: '曾俊瑋律師，專注服務韓國客戶的台灣法律夥伴',
    description:
      '曾俊瑋律師具備韓語、日語、中文溝通能力，協助投資、公司設立與訴訟策略整合。',
    summary:
      '擁有 10+ 年實務經驗，曾參與韓國 SBS 晨間節目並持續經營 WEI Lawyer 法律內容。',
    cta: '查看律師簡介'
  },
  en: {
    label: 'ABOUT',
    title: 'Attorney Wei Tseng, Taiwan Legal Partner for Korean Clients',
    description:
      'Attorney Wei Tseng provides integrated strategy across investment, incorporation, and litigation with Korean, Japanese, and Chinese communication support.',
    summary:
      'With 10+ years of practical experience, media appearances, and continuous legal content publishing, we focus on real case-driven support.',
    cta: 'View Lawyer Profile'
  }
} as const;

export default function HomeAttorneySplit({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale];
  const profilePath = getAttorneyProfilePath(locale);
  const lead = teamContent[locale].members[0];

  return (
    <section className="section section--gray split-section split--img-left" id="about" data-tone="light">
      <div className="split-image split-image--portrait" data-builder-node-key="media">
        <Image
          src={lead.photo}
          alt={`${lead.name} ${lead.role}`}
          width={1200}
          height={900}
          className="person-photo"
          data-builder-surface-key={homeAttorneyImageSurfaceIds[0]}
        />
        <div className="split-portrait-badge">
          <strong>{lead.name}</strong>
          <span>{lead.role}</span>
        </div>
      </div>
      <div className="split-content" data-builder-node-key="copy">
        <div className="section-label" data-builder-surface-key={homeAttorneyTextSurfaceIds[0]}>
          {copy.label}
        </div>
        <h2 className="split-title" data-builder-surface-key={homeAttorneyTextSurfaceIds[1]}>
          {copy.title}
        </h2>
        <div className="split-divider" />
        <p className="split-text" data-builder-surface-key={homeAttorneyTextSurfaceIds[2]}>
          {lead.intro[0]}
        </p>
        <p className="split-text" data-builder-surface-key={homeAttorneyTextSurfaceIds[3]}>
          {lead.intro[1]}
        </p>
        <p className="split-text" data-builder-surface-key={homeAttorneyTextSurfaceIds[4]}>
          {copy.summary}
        </p>
        <p className="split-text" data-builder-surface-key={homeAttorneyTextSurfaceIds[5]}>
          {lead.name} · {lead.role} · {lead.email}
        </p>
        <SmartLink
          className="link-underline"
          href={profilePath}
          data-builder-surface-key={homeAttorneyButtonSurfaceIds[0]}
        >
          {copy.cta} →
        </SmartLink>
      </div>
    </section>
  );
}
