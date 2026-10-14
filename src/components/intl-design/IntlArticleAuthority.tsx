import Image from 'next/image';
import Link from 'next/link';
import guidanceChrome from '@/data/guidance-chrome.json';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { guidanceTeamCopy } from '@/data/international-guidance-team';
import { teamContent } from '@/data/team-members';
import { buildGuidanceAttorneyFacts } from '@/lib/guidance-attorney-facts';
import type { IntlDesignLocale } from '@/lib/intl-design-locales';
import { guidancePublicPath } from '@/lib/public-guidance';

/**
 * Attorney card in the article rail on the Folio locales. Replaces the English `AttorneyAuthorityCard`
 * (English bio, practice chips and channel names) with the localized team record the lawyers page
 * already publishes: role, qualification sentence and practice areas. No new fact. The heading comes from
 * the route: the pack's review label on reviewed columns, a consulting-attorney label on AI-written ones,
 * so provenance stays exactly as before. The consultation languages sit on the consultation card above.
 */
export default function IntlArticleAuthority({ locale, heading }: { locale: IntlDesignLocale; heading: string }) {
  const profile = getAttorneyProfile('en', primaryAttorneySlug);
  const facts = buildGuidanceAttorneyFacts(locale);
  const member = teamContent.en.members.find((entry) => entry.id === 'tseng-junwei');
  if (!profile || !facts || !member) return null;
  const team = guidanceTeamCopy[locale];
  const role = team.roles['tseng-junwei'];
  const lawyersHref = guidancePublicPath(locale, 'lawyers');

  return (
    <section className="authority-card" data-folio-article-authority={locale}>
      <div className="authority-card-heading">{heading}</div>
      <div className="authority-card-top">
        <div className="authority-card-photo">
          <Image
            src={profile.image}
            alt={`${team.photoAltPrefix}: ${member.name}, ${role}`}
            fill
            sizes="192px"
            className="person-photo"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="authority-card-copy">
          <Link href={lawyersHref} className="authority-card-name">
            {member.name}
          </Link>
          <p className="authority-card-role">{role}</p>
          <p className="authority-card-summary">{facts.qualification}</p>
        </div>
      </div>
      <div className="authority-card-block">
        <div className="authority-card-label">{facts.practiceLabel}</div>
        <div className="authority-chip-list">
          {facts.practiceAreas.slice(0, 4).map((area) => (
            <span key={area} className="authority-chip">
              {area}
            </span>
          ))}
        </div>
      </div>
      <div className="authority-card-actions">
        <Link href={lawyersHref} className="button button--outline">
          {guidanceChrome[locale].nav.lawyers}
        </Link>
      </div>
    </section>
  );
}
