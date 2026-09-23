import { getAttorneyProfilePath, primaryAttorneySlug } from '@/data/attorney-profiles';
import { guidanceContent, type GuidanceLocale } from '@/data/international-guidance-content';
import { guidanceOfficeCopy } from '@/data/international-guidance-offices';
import { guidanceTeamBios, guidanceTeamCopy } from '@/data/international-guidance-team';
import { teamContent } from '@/data/team-members';
import type { DecorativeVideoControlLabels } from '@/components/decorative-video-controls';
import { HOME_RESULTS_SHARED_IMAGE_ALT } from '@/components/HomeCaseResultsSplit';
import { buildGuidanceAttorneyFacts } from '@/lib/guidance-attorney-facts';
import { guidancePublicPath } from '@/lib/public-guidance';
import { GUIDANCE_CONSULTATION_LANGUAGES } from '@/lib/seo';

/**
 * Copy for the guidance-home bands the English home already shows
 * (attorney, one past matter, and the public counts).
 *
 * Every sentence is an existing guidance string: the lead attorney biography,
 * the office labels, and the home/about paragraphs. No consultation language,
 * booking promise, or response-time claim is added. The gym-injury sentence
 * stays the biography's own past-matter line.
 */
export function guidanceHomeAttorney(locale: GuidanceLocale) {
  const team = guidanceTeamCopy[locale];
  const bio = guidanceTeamBios[locale]['tseng-junwei'];
  const member = teamContent.en.members.find((entry) => entry.id === 'tseng-junwei');
  const role = team.roles['tseng-junwei'];
  const name = member?.name ?? 'Wei Tseng';
  const email = member?.email ?? '';
  return {
    label: team.label,
    title: team.keyFactsHeading,
    intro: [bio.intro[0] ?? '', bio.intro[1] ?? bio.intro[0] ?? ''] as [string, string],
    summary: team.description,
    contactLine: `${name} · ${role} · ${email}`,
    cta: team.fullProfileLabel,
    href: getAttorneyProfilePath('en', primaryAttorneySlug),
    imageSrc: '/images/team/tseng-junwei.png',
    imageAlt: `${team.photoAltPrefix}: ${name}, ${role}`,
    badgeName: name,
    badgeRole: role,
    largePortrait: true,
  };
}

export function guidanceHomeResults(locale: GuidanceLocale) {
  const pack = guidanceContent[locale];
  const team = guidanceTeamCopy[locale];
  const bio = guidanceTeamBios[locale]['tseng-junwei'];
  const home = pack.pages.home;
  const outcome = home.sections[0]?.paragraphs[1] ?? home.sections[0]?.paragraphs[0] ?? home.intro;
  const controls: DecorativeVideoControlLabels = {
    pause: pack.home.videoPauseLabel,
    play: pack.home.videoPlayLabel,
    replay: pack.home.videoReplayLabel,
  };
  return {
    label: team.experienceLabel,
    title: bio.intro[1] ?? bio.intro[0] ?? '',
    description: outcome,
    summary: home.intro,
    cta: pack.nav.lawyers,
    href: guidancePublicPath(locale, 'lawyers'),
    imageAlt: HOME_RESULTS_SHARED_IMAGE_ALT,
    controlLabels: controls,
  };
}

export function guidanceHomeStats(locale: GuidanceLocale) {
  const facts = buildGuidanceAttorneyFacts(locale);
  const team = guidanceTeamCopy[locale];
  const office = guidanceOfficeCopy[locale];
  const officeCount = Object.keys(office.officeTitles).length;
  return {
    label: office.label,
    title: facts?.heading ?? office.title,
    description: office.description,
    highlightWords: [] as string[],
    items: [
      { target: officeCount, label: office.officeLabel },
      {
        // The attorney profile lists three working languages. Consultations
        // are the fixed four (English, Traditional Chinese, Japanese, Korean).
        target: GUIDANCE_CONSULTATION_LANGUAGES.length,
        label: team.consultationLanguagesLabel,
      },
      { target: facts?.practiceAreas.length ?? 0, label: facts?.practiceLabel ?? office.officeLabel },
    ],
  };
}
