import type { ReactNode } from 'react';
import Image from 'next/image';
import type { SiteLocale } from '@/lib/locales';
import SmartLink from '@/components/SmartLink';
import { ZhHantTrail } from '@/components/zh-hant-icons/ZhHantMonoIcon';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { teamContent } from '@/data/team-members';
import { siteContent } from '@/data/site-content';
import {
  homeAttorneyButtonSurfaceIds,
  homeAttorneyImageSurfaceIds,
  homeAttorneyTextSurfaceIds,
} from '@/lib/builder/registry';
import { SurfaceText } from '@/lib/builder/surface-context';
import { isAppleDesignLocale } from '@/lib/apple-design-locales';

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

/** The home attorney copy for a locale (label, title, summary, link label). The en home design renders the same copy in its own stage. */
export function getHomeAttorneyCopy(locale: SiteLocale) {
  const home = siteContent[locale].homeAttorney;
  return {
    label: home.label,
    title: home.title,
    summary: home.summary,
    cta: home.ctaLabel,
  };
}

export default function HomeAttorneySplit({
  locale,
  presentation,
  omitLandmarkId = false,
  override,
  beforeSummary,
}: {
  locale: SiteLocale;
  presentation?: 'editorial';
  omitLandmarkId?: boolean;
  override?: HomeAttorneyOverride;
  /** Optional slot rendered directly above the summary paragraph (ja design). Omitted: nothing is rendered. */
  beforeSummary?: ReactNode;
}) {
  const home = siteContent[locale].homeAttorney;
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
  const label = override?.label ?? home.label;
  const title = override?.title ?? home.title;
  const intro = override?.intro ?? lead.intro;
  const summary = override?.summary ?? home.summary;
  const contactLine = override?.contactLine ?? `${lead.name} · ${lead.role} · ${lead.email}`;
  const cta = override?.cta ?? home.ctaLabel;

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
        {beforeSummary ?? null}
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
          {/* zh-hant, ko: the monoline arrow sits outside the editable text; other locales keep the typed arrow. */}
          {isAppleDesignLocale(locale)
            ? <><SurfaceText surfaceKey={homeAttorneyButtonSurfaceIds[0]}>{cta}</SurfaceText><ZhHantTrail /></>
            : <SurfaceText surfaceKey={homeAttorneyButtonSurfaceIds[0]}>{cta} →</SurfaceText>}
        </SmartLink>
      </div>
    </section>
  );
}
