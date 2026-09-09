import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { guidanceContent, type GuidanceLocale } from '@/data/international-guidance-content';
import {
  buildGuidanceQualificationSentence,
  guidanceLanguageNames,
  guidanceTeamCopy,
} from '@/data/international-guidance-team';
import { teamContent } from '@/data/team-members';
import { getOrganizationName } from '@/lib/seo';

/**
 * Key facts about the managing attorney, in a guidance language (WO-O33).
 *
 * `/en/lawyers` closes with `AttorneyFactSummary`: three rows — qualification
 * and firm, core practice areas, consultation languages — built from
 * `attorney-profiles.en`. The guidance pages had no equivalent, and instead
 * carried three prose cards whose content was either a duplicate of those rows
 * or belonged on the disclaimer page. This builds the same three rows for
 * vi/id/th/fil.
 *
 * NO NEW FACT IS INTRODUCED:
 *   - the attorney's name is the roster name from `teamContent.en`;
 *   - the firm name is `getOrganizationName`, which resolves the guidance
 *     locales to the English chrome name, exactly as the page title does;
 *   - the practice areas are this locale's OWN already-published service
 *     headings from `guidanceContent[locale].pages.services.sections`, not a
 *     fresh translation of the English list. The trailing section of that page
 *     is the "scope and confirmation" block rather than a practice area, so
 *     the list is cut to the length of the canonical `practiceAreas` array —
 *     a count read from `attorney-profiles.en`, not a hard-coded 6;
 *   - the languages are the canonical `languages` array, named in the page
 *     language by `guidanceLanguageNames`.
 */
export interface GuidanceAttorneyFacts {
  heading: string;
  qualificationLabel: string;
  qualification: string;
  practiceLabel: string;
  practiceAreas: string[];
  languagesLabel: string;
  languages: string[];
}

/** Value separator, matching the `', '` the English fact summary uses. */
export const GUIDANCE_FACT_SEPARATOR = ', ';

export function guidanceAttorneyPracticeAreas(locale: GuidanceLocale): string[] {
  const profile = getAttorneyProfile('en', primaryAttorneySlug);
  if (!profile) return [];
  const sections = guidanceContent[locale].pages.services.sections;
  return sections.slice(0, profile.practiceAreas.length).map((section) => section.heading);
}

export function buildGuidanceAttorneyFacts(locale: GuidanceLocale): GuidanceAttorneyFacts | null {
  const profile = getAttorneyProfile('en', primaryAttorneySlug);
  if (!profile) return null;

  const copy = guidanceTeamCopy[locale];
  const member = teamContent.en.members.find((entry) => entry.profileSlug === primaryAttorneySlug);
  if (!member) return null;

  const names = guidanceLanguageNames[locale];

  return {
    heading: copy.keyFactsHeading,
    qualificationLabel: copy.qualificationLabel,
    qualification: buildGuidanceQualificationSentence(
      locale,
      member.name,
      getOrganizationName(locale),
    ),
    practiceLabel: copy.practiceLabel,
    practiceAreas: guidanceAttorneyPracticeAreas(locale),
    languagesLabel: copy.consultationLanguagesLabel,
    languages: profile.languages
      .map((language) => names[language])
      .filter((name): name is string => Boolean(name)),
  };
}
