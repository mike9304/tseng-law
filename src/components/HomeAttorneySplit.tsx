import Image from 'next/image';
import type { SiteLocale } from '@/lib/locales';
import SmartLink from '@/components/SmartLink';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { teamContent } from '@/data/team-members';
import {
  homeAttorneyButtonSurfaceIds,
  homeAttorneyImageSurfaceIds,
  homeAttorneyTextSurfaceIds,
} from '@/lib/builder/registry';
import { SurfaceText } from '@/lib/builder/surface-context';

const copyByLocale = {
  ko: {
    label: 'ABOUT',
    title: '증준외 변호사, 한국 고객을 위한 대만 법률 파트너',
    description:
      '대만 변호사 증준외는 한국어·일본어·중국어 커뮤니케이션 역량을 바탕으로 투자·법인설립·소송까지 연결된 전략을 제공합니다.',
    summary:
      '법원 소송 실무와 기업 법률고문 경험을 바탕으로, SBS 뉴스에 법률 의견과 해설을 제공하고 WEI Lawyer를 통해 법률정보를 꾸준히 발행하고 있습니다.',
    cta: '변호사 프로필 보기'
  },
  'zh-hant': {
    label: 'ABOUT',
    title: '曾雋崴律師，專注服務韓國客戶的台灣法律夥伴',
    description:
      '曾雋崴律師具備韓語、日語、中文溝通能力，協助投資、公司設立與訴訟策略整合。',
    summary:
      '具備法院訴訟實務與企業法律顧問經驗，曾為 SBS 新聞提供法律意見與解說，並持續透過 WEI Lawyer 發布法律資訊。',
    cta: '查看律師簡介'
  },
  en: {
    label: 'ABOUT',
    title: 'Attorney Wei Tseng, Taiwan Legal Partner for Korean Clients',
    description:
      'Attorney Wei Tseng provides integrated strategy across investment, incorporation, and litigation with Korean, Japanese, and Chinese communication support.',
    summary:
      'With experience in court litigation and corporate legal advisory work, Attorney Wei Tseng has provided legal commentary and advice to SBS News and continues to publish legal information through WEI Lawyer.',
    cta: 'View Lawyer Profile'
  },
  ja: {
    label: 'ABOUT',
    title: '曾雋崴弁護士 — 韓国のお客様のための台湾法務パートナー',
    description:
      '曾雋崴弁護士は韓国語・日本語・中国語でのコミュニケーションを強みに、投資・会社設立・訴訟まで一貫した戦略を提供します。',
    summary:
      '裁判所での訴訟実務と企業の法律顧問としての経験を有し、SBSニュースに法律上の意見・解説を提供するとともに、WEI Lawyerを通じて法律情報を継続的に発信しています。',
    cta: '弁護士プロフィールを見る',
  },
} as const;

export default function HomeAttorneySplit({ locale }: { locale: SiteLocale }) {
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
          loading="lazy"
          sizes="(max-width: 900px) 100vw, 50vw"
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
          <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[0]}>{copy.label}</SurfaceText>
        </div>
        <h2 className="split-title" data-builder-surface-key={homeAttorneyTextSurfaceIds[1]}>
          <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[1]}>{copy.title}</SurfaceText>
        </h2>
        <div className="split-divider" />
        <p className="split-text" data-builder-surface-key={homeAttorneyTextSurfaceIds[2]}>
          <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[2]}>{lead.intro[0]}</SurfaceText>
        </p>
        <p className="split-text" data-builder-surface-key={homeAttorneyTextSurfaceIds[3]}>
          <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[3]}>{lead.intro[1]}</SurfaceText>
        </p>
        <p className="split-text" data-builder-surface-key={homeAttorneyTextSurfaceIds[4]}>
          <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[4]}>{copy.summary}</SurfaceText>
        </p>
        <p className="split-text" data-builder-surface-key={homeAttorneyTextSurfaceIds[5]}>
          <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[5]}>
            {lead.name} · {lead.role} · {lead.email}
          </SurfaceText>
        </p>
        <SmartLink
          className="link-underline"
          href={profilePath}
          data-builder-surface-key={homeAttorneyButtonSurfaceIds[0]}
        >
          <SurfaceText surfaceKey={homeAttorneyButtonSurfaceIds[0]}>{copy.cta} →</SurfaceText>
        </SmartLink>
      </div>
    </section>
  );
}
