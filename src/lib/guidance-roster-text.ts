import { guidanceContent, type GuidanceLocale } from '@/data/international-guidance-content';
import {
  GUIDANCE_TEAM_MEMBER_IDS,
  guidanceMemberLanguages,
  guidanceTeamBios,
  guidanceTeamCopy,
} from '@/data/international-guidance-team';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import { teamContent } from '@/data/team-members';
import {
  GUIDANCE_FACT_SEPARATOR,
  buildGuidanceAttorneyFacts,
} from '@/lib/guidance-attorney-facts';

/**
 * Every visible text block `GuidanceTeamRoster` and `GuidanceAttorneyFacts`
 * render, for one locale (WO-O33).
 *
 * Two gates share it, and that is the point:
 *   - `src/data/__tests__/guidance-team-bios.test.ts` runs the column
 *     checker's `english` and `forbidden` rules over this list, so every
 *     string is vetted;
 *   - the browser gate asserts that every line the page actually renders is a
 *     member of this list, so the vetted set and the rendered set cannot drift
 *     apart. A string that reaches the page without passing the checker would
 *     fail the membership assertion.
 *
 * The list is derived, never hand-maintained: members, names and e-mail
 * addresses come from `teamContent.en`, the biography lines from
 * `guidanceTeamBios`, and the key-facts rows from `buildGuidanceAttorneyFacts`.
 */
export function guidanceRosterTextBlocks(
  locale: GuidanceLocale,
  { showIntro, includeFacts }: { showIntro: boolean; includeFacts: boolean },
): string[] {
  const copy = guidanceTeamCopy[locale];
  const pack = guidanceContent[locale];
  const blocks: string[] = [internationalInquiryCopy[locale].consultationNotice];

  if (showIntro) {
    blocks.push(copy.label, copy.title, copy.description);
  }
  blocks.push(copy.representativeTitle, copy.teamTitle, copy.partnerTitle);

  for (const id of GUIDANCE_TEAM_MEMBER_IDS) {
    const member = teamContent.en.members.find((entry) => entry.id === id);
    if (!member) continue;
    const bio = guidanceTeamBios[locale][id];
    blocks.push(member.name, copy.roles[id]);
    if (member.email) blocks.push(member.email);
    blocks.push(copy.introLabel, ...bio.intro);
    blocks.push(copy.educationLabel, ...bio.education);
    blocks.push(copy.experienceLabel, ...bio.experience);
    const languages = guidanceMemberLanguages(locale, member.profileSlug);
    if (languages.length > 0) {
      blocks.push(copy.workingLanguagesLabel, languages.join(GUIDANCE_FACT_SEPARATOR));
    }
    if (member.profileSlug) blocks.push(copy.fullProfileLabel);
    blocks.push(pack.contactCta);
  }

  if (includeFacts) {
    const facts = buildGuidanceAttorneyFacts(locale);
    if (facts) {
      blocks.push(
        facts.heading,
        facts.qualificationLabel,
        facts.qualification,
        facts.practiceLabel,
        ...facts.practiceAreas,
        facts.languagesLabel,
        facts.languages.join(GUIDANCE_FACT_SEPARATOR),
      );
    }
  }

  return Array.from(new Set(blocks));
}

/** Comparison form: CSS uppercases the field labels, and whitespace collapses. */
export function normalizeGuidanceTextBlock(value: string): string {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}
