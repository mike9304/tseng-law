import Image from 'next/image';
import Link from 'next/link';

/** Card data, built on the server from the localized team record (`buildFolioAuthorityCard`). */
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
 * Attorney card in the article rail on the Folio locales. Replaces the English `AttorneyAuthorityCard` (English bio,
 * practice chips and channel names) with the localized team record the lawyers page already publishes: role,
 * qualification sentence and practice areas. No new fact. The heading comes from the route: the pack's review
 * label on reviewed columns, a consulting-attorney label on AI-written ones, so provenance stays as before.
 * Presentational only: the article view renders on the client, and its data stays on the server.
 */
export default function IntlArticleAuthority({ heading, card }: { heading: string; card: FolioAuthorityCard }) {
  return (
    <section className="authority-card" data-folio-article-authority="">
      <div className="authority-card-heading">{heading}</div>
      <div className="authority-card-top">
        <div className="authority-card-photo">
          <Image src={card.photo} alt={card.photoAlt} fill sizes="192px" className="person-photo" style={{ objectFit: 'cover' }} />
        </div>
        <div className="authority-card-copy">
          <Link href={card.lawyersHref} className="authority-card-name">
            {card.name}
          </Link>
          <p className="authority-card-role">{card.role}</p>
          <p className="authority-card-summary">{card.qualification}</p>
        </div>
      </div>
      <div className="authority-card-block">
        <div className="authority-card-label">{card.practiceLabel}</div>
        <div className="authority-chip-list">
          {card.practiceAreas.map((area) => (
            <span key={area} className="authority-chip">
              {area}
            </span>
          ))}
        </div>
      </div>
      <div className="authority-card-actions">
        <Link href={card.lawyersHref} className="button button--outline">
          {card.lawyersLabel}
        </Link>
      </div>
    </section>
  );
}
