import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { guidanceContent } from '@/data/international-guidance-content';
import { guidanceTeamCopy } from '@/data/international-guidance-team';
import { teamContent } from '@/data/team-members';
import { buildGuidanceAttorneyFacts } from '@/lib/guidance-attorney-facts';
import type { IntlDesignLocale } from '@/lib/intl-design-locales';
import { guidancePublicPath } from '@/lib/public-guidance';

/** Data for the Folio article rail's attorney card (rendered by ColumnDetailView; built below, on the server). */
export interface FolioAuthorityCard {
  name: string;
  role: string;
  photo: string;
  photoAlt: string;
  qualification: string;
  practiceLabel: string;
  practiceAreas: string[];
  lawyersHref: string;
  lawyersLabel: string;
}

/**
 * Server-side data for the Folio article rail's attorney card: the lead attorney's localized role, qualification
 * sentence and first four practice areas, exactly as the lawyers page publishes them (no new fact).
 */
export function buildFolioAuthorityCard(locale: IntlDesignLocale): FolioAuthorityCard | null {
  const profile = getAttorneyProfile('en', primaryAttorneySlug);
  const facts = buildGuidanceAttorneyFacts(locale);
  const member = teamContent.en.members.find((entry) => entry.id === 'tseng-junwei');
  if (!profile || !facts || !member) return null;
  const team = guidanceTeamCopy[locale];
  const role = team.roles['tseng-junwei'];
  return {
    name: member.name,
    role,
    photo: profile.image,
    photoAlt: `${team.photoAltPrefix}: ${member.name}, ${role}`,
    qualification: facts.qualification,
    practiceLabel: facts.practiceLabel,
    practiceAreas: facts.practiceAreas.slice(0, 4),
    lawyersHref: guidancePublicPath(locale, 'lawyers'),
    lawyersLabel: guidanceContent[locale].nav.lawyers,
  };
}
