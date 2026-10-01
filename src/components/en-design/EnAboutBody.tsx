import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import AttorneyProfileSection from '@/components/AttorneyProfileSection';
import { pageCopy } from '@/data/page-copy';
import { firmIntroductionContent } from '@/data/firm-introduction';
import { siteContent } from '@/data/site-content';
import { teamContent } from '@/data/team-members';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import EnPageShell, { EnClosingBand, EnGlance, EnJumpNav } from './EnPageShell';
import styles from './EnAbout.module.css';

/** Office names without the trailing "Office" (from the English contact locations). */
export function enOfficeNames(): string[] {
  return siteContent.en.contact.locations.map((office) => office.title.replace(/\s+Office$/, ''));
}

/**
 * en about page (Opus 5.5 en lane, 2026-10-01): fact sheet (founding year read from the firm
 * introduction, office names from the contact data, consultation languages from the attorney
 * profile), the firm introduction as a dated record, the team, offices and the contact band.
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
          actions={
            <EnJumpNav
              items={[
                { href: '#firm', label: intro.title },
                { href: '#team', label: teamContent.en.title },
                { href: '#about-contact', label: contact.locationsLabel },
              ]}
            />
          }
        />
      </PageHeader>
      <section id="firm" className={`section firm-intro-section ${styles.firm}`} data-tone="light">
        <div className={`container ${styles.firmGrid}`}>
          <div className={styles.firmAside}>
            <div className={styles.firmLogo}>
              <Image src={intro.logo} alt={intro.logoAlt} width={508} height={80} data-builder-surface-key="logo" />
            </div>
            <h2 className={styles.firmTitle} data-builder-surface-key="headline">{intro.title}</h2>
            <p className={styles.firmSubtitle} data-builder-surface-key="subtitle">{intro.subtitle}</p>
            <p className={styles.firmSource}>
              <a href={intro.sourceUrl} target="_blank" rel="noopener noreferrer" data-builder-surface-key="source-link">
                {intro.sourceLabel}
              </a>
            </p>
          </div>
          <ol className={styles.record}>
            {intro.paragraphs.map((paragraph) => {
              // The year beside a paragraph is read from that paragraph's own text, never added.
              const year = paragraph.match(/\b(20\d{2})\b/)?.[1];
              return (
                <li key={paragraph} className={styles.recordItem}>
                  <span className={styles.recordYear} aria-hidden={year ? undefined : true}>{year ?? ''}</span>
                  <p>{paragraph}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
      <div id="team" className={styles.team}>
        <AttorneyProfileSection locale="en" />
      </div>
      <section id="about-contact" className={styles.offices} aria-labelledby="en-about-offices">
        <div className="container">
          <h2 id="en-about-offices" className={styles.officesTitle}>{contact.locationsLabel}</h2>
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
