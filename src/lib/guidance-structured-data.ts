import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import {
  GUIDANCE_TEAM_MEMBER_IDS,
  guidanceTeamCopy,
} from '@/data/international-guidance-team';
import type { GuidanceLocale } from '@/data/international-guidance-content';
import { teamContent } from '@/data/team-members';
import { guidancePublicPath, type GuidancePageKey } from '@/lib/public-guidance';
import {
  ATTORNEY_PERSON_ID,
  buildCollectionPageJsonLd,
  buildPersonJsonLd,
} from '@/lib/seo';

/**
 * Structured data for the guidance locales (vi/id/th/fil), WO-O28.
 *
 * The English pages emit `Person` (with its `worksFor` `Organization` and
 * `alumniOf` `CollegeOrUniversity` nodes) and, on `/lawyers`, a
 * `CollectionPage` wrapping an `ItemList`. The guidance pages emitted neither,
 * which was the last remaining `@type` gap against `/en`.
 *
 * NO NEW FACTS. Every value is read from an existing canonical source:
 *   - `attorney-profiles.ts` (`en`): the managing attorney's name, alternate
 *     names, biography, portrait, e-mail, working languages, practice areas
 *     and education. There is no vi/id/th/fil edition of that record, so the
 *     English original is used verbatim rather than machine-translated.
 *   - `international-guidance-team.ts`: `roles`, the job titles the firm
 *     already publishes for this locale — the one language-dependent field
 *     that does have a per-locale wording.
 *   - `team-members.ts` (`en`): the roster names, in the order the English
 *     page renders them.
 *
 * URL choices:
 *   - The `Person` `url` points at `/en/lawyers/{slug}`. `/{guidance
 *     locale}/lawyers/{slug}` is a measured 404 — that route is built for the
 *     four site locales — and the visible roster link already points at the
 *     English profile for the same reason.
 *   - The `@id` is {@link ATTORNEY_PERSON_ID}, the locale-independent
 *     identifier the other locales already use, so the eight-language surface
 *     stays one attorney entity.
 *   - Every `CollectionPage` item points at this locale's own roster anchor
 *     (`/{locale}/{pageKey}#{member id}`), which is exactly where the card is
 *     rendered.
 */

/** Roster page keys that render `GuidanceTeamRoster`, mirroring `/en`. */
export type GuidanceRosterPageKey = Extract<GuidancePageKey, 'lawyers' | 'about'>;

/**
 * `Person` node for the managing attorney, emitted on the guidance home and on
 * the two roster pages — the same pages `/en` emits it on.
 */
export function buildGuidancePersonJsonLd(locale: GuidanceLocale) {
  const profile = getAttorneyProfile('en', primaryAttorneySlug);
  if (!profile) return null;

  return buildPersonJsonLd({
    locale,
    // English profile route: the guidance locales publish no `/lawyers/{slug}`.
    path: `/en/lawyers/${profile.slug}`,
    id: ATTORNEY_PERSON_ID,
    name: profile.name,
    alternateName: profile.alternateNames,
    description: profile.description,
    image: profile.image,
    email: profile.email,
    // The only field with a published wording in this locale.
    jobTitle: guidanceTeamCopy[locale].roles['tseng-junwei'],
    sameAs: profile.sameAs,
    knowsLanguage: profile.languages,
    knowsAbout: profile.practiceAreas,
    alumniOf: profile.education,
  });
}

/**
 * `CollectionPage` + `ItemList` for the roster the guidance `lawyers` and
 * `about` pages already render.
 */
export function buildGuidanceTeamCollectionPageJsonLd({
  locale,
  pageKey,
  name,
  description,
}: {
  locale: GuidanceLocale;
  pageKey: GuidanceRosterPageKey;
  name: string;
  description: string;
}) {
  const path = guidancePublicPath(locale, pageKey);
  const copy = guidanceTeamCopy[locale];
  const items = GUIDANCE_TEAM_MEMBER_IDS.flatMap((memberId) => {
    const member = teamContent.en.members.find((entry) => entry.id === memberId);
    if (!member) return [];
    return [
      {
        name: member.name,
        // The card this item describes carries `id={member.id}`.
        path: `${path}#${member.id}`,
        description: copy.roles[memberId],
      },
    ];
  });

  return buildCollectionPageJsonLd({ locale, path, name, description, items });
}
