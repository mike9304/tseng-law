import Link from 'next/link';
import { siteContent } from '@/data/site-content';
import { teamContent } from '@/data/team-members';
import { getAttorneyProfilePath } from '@/data/attorney-profiles';
import { homeHeroTextSurfaceIds } from '@/lib/builder/registry';
import { BuilderSurfaceProvider, SurfaceText } from '@/lib/builder/surface-context';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { getOrganizationName } from '@/lib/seo';
import LocaleHomePathNav from '@/components/LocaleHomePathNav';
import { JA_HERO_READ_LABEL } from '@/components/ja-design/JaHeroTrust';
import JaChevron from './JaChevron';
import JaHeroFilm from './JaHeroFilm';
import JaStageMarkers from './JaStageMarkers';
import { JaKeepUnits, JaPhrases } from './JaPhrases';
import k from './JaKou.module.css';
import h from './JaHero.module.css';

/** The hero CTA label (existing; HeroSearch `emailConsultationCtaLabels.ja`). */
export const JA_HERO_CTA_LABEL = 'メール相談を申し込む';

/** The existing H1, set in two tiers at the last 「、」: 「台湾の会社設立・労務・紛争を、」 / 「日本語で。」. */
export function splitJaHeroTitle(title: string): [string, string] | null {
  const at = title.lastIndexOf('、');
  if (at < 0 || at === title.length - 1) return null;
  return [title.slice(0, at + 1), title.slice(at + 1)];
}

/** The sub's closing clause is the key phrase (sumi), the rest is running text. */
const SUB_KEY = '日本語で直接ご相談を承ります。';

/**
 * C0 「光の印」: the first screen and the push into the light (CONCEPT-V2 §5 C0, §6, §8.1; amendment: the image moves).
 * Server markup; the film and the controller are the only client parts. Strings come from the existing data.
 */
export default function JaHero() {
  const hero = siteContent.ja.hero;
  const tiers = splitJaHeroTitle(hero.title);
  const lead = teamContent.ja.members[0];
  const subKeyAt = hero.subtitle.endsWith(SUB_KEY) ? hero.subtitle.length - SUB_KEY.length : -1;

  return (
    <BuilderSurfaceProvider
      nodeId="home-hero"
      mode="published"
      overrides={{ [homeHeroTextSurfaceIds[0]]: getOrganizationName('ja') }}
      selectedSurfaceKey={null}
    >
      <section id="hero" className={h.hero} aria-labelledby="ja-hero-title" data-ja-stage="hero" data-tone="light">
        <div className={h.stage}>
          <JaHeroFilm />
          <div className={h.copy} data-builder-node-key="copy">
            <p className={k.vh} data-builder-surface-key={homeHeroTextSurfaceIds[0]}>
              <SurfaceText surfaceKey={homeHeroTextSurfaceIds[0]}>{hero.label}</SurfaceText>
            </p>
            <h1 id="ja-hero-title" className={h.title} data-builder-surface-key={homeHeroTextSurfaceIds[1]}>
              <SurfaceText surfaceKey={homeHeroTextSurfaceIds[1]}>
                {tiers ? (
                  <>
                    <span className={`${h.tier1} ${k.ph}`}>
                      <JaPhrases text={tiers[0]} />
                    </span>
                    <span className={`${h.tier2} ${k.ph}`}>{tiers[1]}</span>
                  </>
                ) : (
                  hero.title
                )}
              </SurfaceText>
            </h1>
            <p className={h.sub} data-builder-surface-key={homeHeroTextSurfaceIds[2]}>
              <SurfaceText surfaceKey={homeHeroTextSurfaceIds[2]}>
                {subKeyAt > 0 ? (
                  <>
                    <JaKeepUnits text={hero.subtitle.slice(0, subKeyAt)} />
                    <span className={k.key}>{SUB_KEY}</span>
                  </>
                ) : (
                  <JaKeepUnits text={hero.subtitle} />
                )}
              </SurfaceText>
            </p>
            {lead ? (
              <Link href={getAttorneyProfilePath('ja')} className={h.byline} data-hero-slot="byline">
                <span className={h.name}>{lead.name}</span> · {lead.role}
              </Link>
            ) : null}
            <div className={h.actions}>
              <a
                className={`${k.pill} ${h.cta}`}
                href={getConsultationPublicMailto('ja')}
                aria-label={`${JA_HERO_CTA_LABEL} — ${getConsultationCtaLabel('ja')}`}
              >
                {JA_HERO_CTA_LABEL}
              </a>
              <Link className={`${k.textLink} ${h.read}`} href="/ja/columns">
                {JA_HERO_READ_LABEL}
                <JaChevron />
              </Link>
            </div>
            <div className={h.pathNav}>
              <LocaleHomePathNav locale="ja" tone="light" />
            </div>
          </div>
          <div className={h.veil} aria-hidden="true" />
        </div>
        <span className={h.pauseSentinel} data-pause-sentinel="" aria-hidden="true" />
        <JaStageMarkers bounds={[0.34, 0.67]} />
      </section>
    </BuilderSurfaceProvider>
  );
}
