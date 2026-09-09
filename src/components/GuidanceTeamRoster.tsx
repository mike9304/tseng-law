import Image from 'next/image';
import Link from 'next/link';

import { guidanceContent, type GuidanceLocale } from '@/data/international-guidance-content';
import {
  guidanceTeamCopy,
  isGuidanceTeamMemberId,
  type GuidanceTeamMemberId,
} from '@/data/international-guidance-team';
import { getAttorneyProfile } from '@/data/attorney-profiles';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import { teamContent, type TeamMember } from '@/data/team-members';
import { guidancePublicPath } from '@/lib/public-guidance';

/**
 * Team roster for the four guidance locales (vi/id/th/fil).
 *
 * The English `lawyers` and `about` pages render `AttorneyProfileSection`,
 * which shows five people with photographs. The guidance locales rendered text
 * cards only, so those pages carried no portrait at all. This component closes
 * that gap using the same class names and the same lead / staff / partner
 * grouping, so the two surfaces produce the same card and image counts.
 *
 * Facts come from `teamContent.en` — the firm's canonical record — and are not
 * rewritten here:
 *   - names, e-mail addresses and photographs: used verbatim;
 *   - job titles: the published English titles, in the page language;
 *   - intro / education / experience: the English original, rendered inside a
 *     block introduced by `sourceLanguageNote` so the reader is told, in their
 *     own language, that those lines are not translated.
 *
 * A member without a photograph in the canonical record would be skipped
 * rather than given a placeholder; today all five have one.
 *
 * "Book consultation" points at `/{locale}/contact` only. The full profile
 * link points at `/en/lawyers/{slug}` and is labelled "(English)", because
 * `/{guidance locale}/lawyers/{slug}` is a measured 404 — that route is built
 * for the four site locales.
 *
 * Consultation languages: the roster states the office policy once, above the
 * cards, reusing `internationalInquiryCopy[locale].consultationNotice`
 * verbatim (English, Chinese, Japanese, Korean). Individual cards carry only a
 * neutral "working languages" noun label sourced from `attorney-profiles.ts`,
 * never a verb, and only for the member the canonical record has it for.
 */

function GuidanceMemberCard({
  member,
  memberId,
  locale,
  size,
}: {
  member: TeamMember;
  memberId: GuidanceTeamMemberId;
  locale: GuidanceLocale;
  size: 'large' | 'small';
}) {
  const copy = guidanceTeamCopy[locale];
  const pack = guidanceContent[locale];
  const isLarge = size === 'large';
  const role = copy.roles[memberId];
  // Language list, canonical only. `attorney-profiles.ts` records it for the
  // managing attorney and for nobody else, so every other card omits the label
  // instead of being padded with a guess. The label is a noun ("working
  // languages"), never a verb: it states what a person reads and writes, not
  // what language a consultation is held in.
  const workingLanguages = member.profileSlug
    ? getAttorneyProfile('en', member.profileSlug)?.languages ?? []
    : [];
  // The `/{locale}/lawyers/{slug}` route is built for the four site locales
  // only — a guidance-locale URL there is a 404 — so the full profile link
  // points at the English page and says so in its label.
  const fullProfileHref = member.profileSlug ? `/en/lawyers/${member.profileSlug}` : null;

  return (
    <article
      id={member.id}
      className={`attorney-card ${isLarge ? 'attorney-card--lead' : 'attorney-card--sub'}`}
      data-guidance-team-card={member.id}
    >
      <div
        className={`attorney-card-photo ${
          isLarge ? 'attorney-card-photo--lead' : 'attorney-card-photo--sub'
        }`}
      >
        <Image
          src={member.photo}
          alt={`${copy.photoAltPrefix}: ${member.name}, ${role}`}
          fill
          className="person-photo"
          style={{ objectFit: 'cover' }}
          sizes={isLarge ? '(max-width: 768px) 100vw, 400px' : '(max-width: 768px) 100vw, 200px'}
        />
      </div>
      <div className="attorney-card-info">
        <h3 className={`attorney-card-name ${isLarge ? 'attorney-card-name--lead' : ''}`}>
          {member.name}
        </h3>
        <p className="attorney-card-role">{role}</p>
        {member.email ? (
          <a href={`mailto:${member.email}`} className="attorney-card-email">
            {member.email}
          </a>
        ) : null}

        <div className="attorney-card-section">
          <div className="attorney-card-label">{copy.introLabel}</div>
          <ul className="attorney-list">
            {member.intro.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="attorney-card-section">
          <div className="attorney-card-label">{copy.educationLabel}</div>
          <ul className="attorney-list">
            {member.education.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="attorney-card-section">
          <div className="attorney-card-label">{copy.experienceLabel}</div>
          <ul className="attorney-list">
            {member.experience.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        {workingLanguages.length > 0 ? (
          <div className="attorney-card-section" data-guidance-team-languages="true">
            <div className="attorney-card-label">{copy.workingLanguagesLabel}</div>
            <p>{workingLanguages.join(', ')}</p>
          </div>
        ) : null}

        <div className="attorney-card-actions">
          {fullProfileHref ? (
            <a
              href={fullProfileHref}
              className="button button--outline attorney-card-cta"
              hrefLang="en"
            >
              {copy.fullProfileLabel}
            </a>
          ) : null}
          <Link
            href={guidancePublicPath(locale, 'contact')}
            className="button button--outline attorney-card-cta"
          >
            {pack.contactCta}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function GuidanceTeamRoster({ locale }: { locale: GuidanceLocale }) {
  const copy = guidanceTeamCopy[locale];
  // Canonical record. `en` is the source of every biographical line below.
  const members = teamContent.en.members.filter(
    (member): member is TeamMember & { id: GuidanceTeamMemberId } =>
      isGuidanceTeamMemberId(member.id) && Boolean(member.photo),
  );

  const lead = members.find((m) => m.id === 'tseng-junwei');
  const staff = members.filter((m) => m.id !== 'tseng-junwei' && m.id !== 'huang-shengping');
  const accountant = members.find((m) => m.id === 'huang-shengping');

  if (members.length === 0) {
    return null;
  }

  return (
    <section
      className="section section--light attorney-team-section"
      data-guidance-team="true"
      data-locale={locale}
    >
      <div className="container">
        <div className="section-label">{copy.label}</div>
        <h2 className="section-title">{copy.title}</h2>
        <p className="section-lede">{copy.description}</p>
        <p className="section-lede" data-guidance-team-source-language="en">
          {copy.sourceLanguageNote}
        </p>
        {/* Office policy on consultation languages, stated once above the
            roster and reused verbatim from the inquiry copy rather than
            rewritten here. Individual cards carry a neutral language label
            only, so a member's working languages can never be read as "we
            consult in this language". */}
        <p className="section-lede" data-guidance-team-consultation-notice="true">
          {internationalInquiryCopy[locale].consultationNotice}
        </p>

        {lead ? (
          <div className="attorney-lead-wrap">
            <h3 className="attorney-group-title">
              <span className="attorney-group-badge">{copy.representativeTitle}</span>
            </h3>
            <GuidanceMemberCard member={lead} memberId={lead.id} locale={locale} size="large" />
          </div>
        ) : null}

        {staff.length > 0 ? (
          <div className="attorney-staff-wrap">
            <h3 className="attorney-group-title">{copy.teamTitle}</h3>
            <div className="attorney-staff-grid">
              {staff.map((member) => (
                <GuidanceMemberCard
                  key={member.id}
                  member={member}
                  memberId={member.id}
                  locale={locale}
                  size="small"
                />
              ))}
            </div>
          </div>
        ) : null}

        {accountant ? (
          <div className="attorney-partner-wrap">
            <h3 className="attorney-group-title">{copy.partnerTitle}</h3>
            <GuidanceMemberCard
              member={accountant}
              memberId={accountant.id}
              locale={locale}
              size="small"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
