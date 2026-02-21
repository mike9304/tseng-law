import Image from 'next/image';
import type { Locale } from '@/lib/locales';
import SmartLink from '@/components/SmartLink';
import { teamContent } from '@/data/team-members';

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
      '擁有 10+ 年實務經驗，曾參與 SBS 모닝와이드 節目並持續經營 WEI Lawyer 法律內容。',
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
  const profilePath = `/${locale}/lawyers`;
  const lead = teamContent[locale].members[0];

  return (
    <section className="section section--gray split-section split--img-left" id="about" data-tone="light">
      <div className="split-image">
        <Image src={lead.photo} alt={`${lead.name} ${lead.role}`} width={1200} height={900} />
      </div>
      <div className="split-content">
        <div className="section-label">{copy.label}</div>
        <h2 className="split-title">{copy.title}</h2>
        <div className="split-divider" />
        <p className="split-text">{lead.intro[0]}</p>
        <p className="split-text">{lead.intro[1]}</p>
        <p className="split-text">
          {lead.name} · {lead.role} · {lead.email}
        </p>
        <SmartLink className="link-underline" href={profilePath}>
          {copy.cta} →
        </SmartLink>
      </div>
    </section>
  );
}
