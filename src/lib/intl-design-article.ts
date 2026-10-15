import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { guidanceContent } from '@/data/international-guidance-content';
import { guidanceTeamCopy } from '@/data/international-guidance-team';
import { teamContent } from '@/data/team-members';
import type { IntlDesignLocale } from '@/lib/intl-design-locales';
import { guidancePublicPath } from '@/lib/public-guidance';

/** Data for the Folio article rail's attorney card (rendered by ColumnDetailView; built below, on the server). */
export interface FolioAuthorityCard {
  name: string;
  role: string;
  /** Decorative next to the name (alt=""). */
  photo: string;
  lawyersHref: string;
  lawyersLabel: string;
}

/**
 * Server-side data for the Folio article rail's attorney card: the lead attorney's name and localized role, exactly as
 * the lawyers page publishes them (no new fact), and the link to that page.
 */
export function buildFolioAuthorityCard(locale: IntlDesignLocale): FolioAuthorityCard | null {
  const profile = getAttorneyProfile('en', primaryAttorneySlug);
  const member = teamContent.en.members.find((entry) => entry.id === 'tseng-junwei');
  if (!profile || !member) return null;
  return {
    name: member.name,
    role: guidanceTeamCopy[locale].roles['tseng-junwei'],
    photo: profile.image,
    lawyersHref: guidancePublicPath(locale, 'lawyers'),
    lawyersLabel: guidanceContent[locale].nav.lawyers,
  };
}
