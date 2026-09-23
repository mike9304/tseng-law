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
    title: '曾雋崴律師，在地與跨境客戶的台灣法律夥伴',
    description:
      '曾雋崴律師具備韓語、日語、中文溝通能力，協助投資、公司設立與訴訟策略整合。',
    summary:
      '具備法院訴訟實務與企業法律顧問經驗，曾為 SBS 新聞提供法律意見與解說，並持續透過 WEI Lawyer 發布法律資訊。',
    cta: '查看律師簡介'
  },
  en: {
    label: 'ABOUT',
    title: 'Attorney Wei Tseng, Taiwan Legal Partner for International Clients',
    description:
      'Attorney Wei Tseng provides integrated investment, incorporation, and litigation strategy. Consultations in English, Japanese, Korean, and Mandarin are available for international clients.',
    summary:
      'With experience in court litigation and corporate legal advisory work, Attorney Wei Tseng has provided legal commentary and advice to SBS News and continues to publish legal information through WEI Lawyer.',
    cta: 'View Lawyer Profile'
  },
  ja: {
    label: 'ABOUT',
    title: '曾雋崴弁護士 — 日本語で相談できる台湾法務パートナー',
    description:
      '曾雋崴弁護士は日本語・韓国語・中国語でのコミュニケーションを強みに、投資・会社設立・訴訟まで一貫した戦略を提供します。',
    summary:
      '裁判所での訴訟実務と企業の法律顧問としての経験を有し、SBSニュースに法律上の意見・解説を提供するとともに、WEI Lawyerを通じて法律情報を継続的に発信しています。',
    cta: '弁護士プロフィールを見る',
  },
} as const;

function protectAboutHeadingUnit(title: string, unit: string) {
  const index = title.indexOf(unit);
  if (index < 0) return title;
  return (
    <>
      {title.slice(0, index)}
      <span style={{ whiteSpace: 'nowrap' }}>{unit}</span>
      {title.slice(index + unit.length)}
    </>
  );
}

export type HomeAttorneyOverride = {
  label: string;
  title: string;
  intro: readonly [string, string];
  summary: string;
  contactLine: string;
  cta: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  badgeName: string;
  badgeRole: string;
  largePortrait?: boolean;
};

export default function HomeAttorneySplit({
  locale,
  presentation,
  omitLandmarkId = false,
  override,
}: {
  locale: SiteLocale;
  presentation?: 'editorial';
  omitLandmarkId?: boolean;
  override?: HomeAttorneyOverride;
}) {
  const copy = copyByLocale[locale];
  const profilePath = override?.href ?? getAttorneyProfilePath(locale);
  const lead = teamContent[locale].members[0];
  const useLargeOfficialPortrait = override
    ? Boolean(override.largePortrait)
    : lead.id === 'tseng-junwei' && lead.photo === '/images/team/wei-tseng-official.png';
  const portrait = override?.imageSrc
    ?? (useLargeOfficialPortrait ? '/images/team/tseng-junwei.png' : lead.photo);
  const imageAlt = override?.imageAlt ?? `${lead.name} ${lead.role}`;
  const badgeName = override?.badgeName ?? lead.name;
  const badgeRole = override?.badgeRole ?? lead.role;
  const label = override?.label ?? copy.label;
  const title = override?.title ?? copy.title;
  const intro = override?.intro ?? lead.intro;
  const summary = override?.summary ?? copy.summary;
  const contactLine = override?.contactLine ?? `${lead.name} · ${lead.role} · ${lead.email}`;
  const cta = override?.cta ?? copy.cta;

  return (
    <section className="section section--gray split-section split--img-left" id={omitLandmarkId ? undefined : 'about'} data-tone="light">
      <div
        className="split-image split-image--portrait"
        data-builder-node-key="media"
        data-home-stock-portrait={useLargeOfficialPortrait ? 'true' : undefined}
      >
        <Image
          src={portrait}
          alt={imageAlt}
          width={useLargeOfficialPortrait ? 773 : 1200}
          height={useLargeOfficialPortrait ? 865 : 900}
          loading="lazy"
          sizes="(max-width: 900px) 100vw, 50vw"
          className="person-photo"
          data-builder-surface-key={homeAttorneyImageSurfaceIds[0]}
        />
        <div className="split-portrait-badge">
          <strong>{badgeName}</strong>
          <span>{badgeRole}</span>
        </div>
      </div>
      <div className="split-content" data-builder-node-key="copy">
        <div className="section-label" data-builder-surface-key={homeAttorneyTextSurfaceIds[0]}>
          <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[0]}>{label}</SurfaceText>
        </div>
        <h2 className="split-title" data-builder-surface-key={homeAttorneyTextSurfaceIds[1]}>
          <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[1]}>
            {!override && presentation === 'editorial' && locale === 'ja'
              ? protectAboutHeadingUnit(title, '相談')
              : !override && presentation === 'editorial' && locale === 'zh-hant'
                ? protectAboutHeadingUnit(title, '韓國')
                : title}
          </SurfaceText>
        </h2>
        <div className="split-divider" />
        <p className="split-text" data-builder-surface-key={homeAttorneyTextSurfaceIds[2]}>
          <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[2]}>{intro[0]}</SurfaceText>
        </p>
        <p className="split-text" data-builder-surface-key={homeAttorneyTextSurfaceIds[3]}>
          <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[3]}>{intro[1]}</SurfaceText>
        </p>
        <p className="split-text" data-builder-surface-key={homeAttorneyTextSurfaceIds[4]}>
          <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[4]}>{summary}</SurfaceText>
        </p>
        <p className="split-text" data-builder-surface-key={homeAttorneyTextSurfaceIds[5]}>
          <SurfaceText surfaceKey={homeAttorneyTextSurfaceIds[5]}>
            {contactLine}
          </SurfaceText>
        </p>
        <SmartLink
          className="link-underline"
          href={profilePath}
          data-builder-surface-key={homeAttorneyButtonSurfaceIds[0]}
        >
          <SurfaceText surfaceKey={homeAttorneyButtonSurfaceIds[0]}>{cta} →</SurfaceText>
        </SmartLink>
      </div>
    </section>
  );
}
