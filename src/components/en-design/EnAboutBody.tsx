import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import AttorneyProfileSection from '@/components/AttorneyProfileSection';
import { pageCopy } from '@/data/page-copy';
import { firmIntroductionContent } from '@/data/firm-introduction';
import { siteContent } from '@/data/site-content';
import { teamContent } from '@/data/team-members';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import EnPageShell, { EnBand, EnClosingBand, EnGlance } from './EnPageShell';
import EnLocalNav from './EnLocalNav';
import { EnArrowUpRight } from './EnChevron';
import styles from './EnAbout.module.css';

/** Office names without the trailing "Office" (from the English contact locations). */
export function enOfficeNames(): string[] {
  return siteContent.en.contact.locations.map((office) => office.title.replace(/\s+Office$/, ''));
}

/**
 * en about page (CONCEPT-V2 12.3, Clear Night): title card with the credits row (founding year read from the
 * firm introduction, office names from the contact data, languages from the attorney profile), the clear-street
 * band (B3), a local nav, the firm record as a year roll (each year is read from its own paragraph, never
 * added), the logo block, the team, the offices and the closing card. 2016 stands only beside the firm's own
 * founding sentence; the attorney's portrait is further down, in the team.
 */
export default function EnAboutBody() {
  const copy = pageCopy.en.about;
  const intro = firmIntroductionContent.en;
  const founded = intro.paragraphs[0]?.match(/\b(\d{4})\b/)?.[1];
  const profile = getAttorneyProfile('en', primaryAttorneySlug);
  const { contact } = siteContent.en;
  return (
    <EnPageShell page="about">
      <PageHeader locale="en" label={copy.label} title={copy.title} description={copy.description}>
        <EnGlance
          items={[
            ...(founded ? [{ term: 'Founded', value: founded }] : []),
            { term: 'Offices', value: enOfficeNames().join(' · ') },
            ...(profile ? [{ term: 'Languages', value: profile.languages.join(', ') }] : []),
          ]}
        />
      </PageHeader>
      <EnBand name="clear" />
      <EnLocalNav
        title={copy.title}
        items={[
          { href: '#firm', label: intro.title },
          { href: '#team', label: teamContent.en.title },
          { href: '#about-contact', label: contact.locationsLabel },
        ]}
      />
      <section id="firm" className={`section firm-intro-section ${styles.firm}`} aria-labelledby="en-about-firm">
        <div className="container">
          <h2 id="en-about-firm" className={styles.firmTitle} data-builder-surface-key="headline">{intro.title}</h2>
          <ol className={styles.record}>
            {intro.paragraphs.map((paragraph) => {
              // The year beside a paragraph is read from that paragraph's own text, never added.
              const year = paragraph.match(/\b(20\d{2})\b/)?.[1];
              return (
                <li key={paragraph} className={styles.recordItem} data-dated={year ? 'true' : undefined}>
                  <div className={styles.recordMark} aria-hidden={year ? undefined : true}>
                    {year ? <span className={styles.recordLine} data-en-draw /> : null}
                    <span className={styles.recordYear}>{year ?? ''}</span>
                  </div>
                  <p>{paragraph}</p>
                </li>
              );
            })}
          </ol>
          <div className={styles.firmFoot}>
            <div className={styles.firmLogo}>
              <Image src={intro.logo} alt={intro.logoAlt} width={508} height={80} data-builder-surface-key="logo" />
            </div>
            <div className={styles.firmFootCopy}>
              <p className={styles.firmSubtitle} data-builder-surface-key="subtitle">{intro.subtitle}</p>
              <p className={styles.firmSource}>
                <a href={intro.sourceUrl} target="_blank" rel="noopener noreferrer" data-builder-surface-key="source-link">
                  {intro.sourceLabel}
                  <EnArrowUpRight />
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
      <div id="team" className={styles.team}>
        <AttorneyProfileSection locale="en" />
      </div>
      <section id="about-contact" className={styles.offices} aria-labelledby="en-about-offices">
        <div className="container">
          <h2 id="en-about-offices" className={styles.officesTitle} data-en-rise>{contact.locationsLabel}</h2>
          <ul className={styles.officeList}>
            {contact.locations.map((office) => (
              <li key={office.title}>
                <span className={styles.officeName}>{office.title}</span>
                <span className={styles.officeAddress}>{office.details[0]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <EnClosingBand id="en-about-closing" />
    </EnPageShell>
  );
}
