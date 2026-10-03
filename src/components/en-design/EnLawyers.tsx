import type { ReactNode } from 'react';
import Link from 'next/link';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import EnPageShell, { EnBand, EnClosingBand, EnEmailButton, EnGlance } from './EnPageShell';
import { enOfficeNames } from './EnAboutBody';
import aboutStyles from './EnAbout.module.css';
import styles from './EnLawyers.module.css';

/**
 * en team page (CONCEPT-V2 12.3, Clear Night): the same blocks (JSON-LD, title card, team, key facts) inside the
 * en wrapper. The clear-street band (B3) is placed after the title card by CSS order only (it is decorative and
 * holds nothing focusable), so the shared page body stays as it is. The team uses the about-page styling.
 */
export function EnLawyersShell({ children }: { children: ReactNode }) {
  return (
    <EnPageShell page="lawyers">
      <div className={`${aboutStyles.team} ${styles.lawyers}`}>
        <div className={styles.bandSlot}><EnBand name="clear" /></div>
        {children}
      </div>
      <EnClosingBand id="en-lawyers-closing" />
    </EnPageShell>
  );
}

/** Credits row: lead attorney, languages and offices from the existing profile and contact data. */
export function EnLawyersGlance() {
  const profile = getAttorneyProfile('en', primaryAttorneySlug);
  if (!profile) return null;
  return (
    <EnGlance
      items={[
        { term: 'Lead attorney', value: <Link href={`/en/lawyers/${profile.slug}`}>{profile.name}</Link>, note: profile.role },
        { term: 'Languages', value: profile.languages.join(', ') },
        { term: 'Offices', value: enOfficeNames().join(' · ') },
      ]}
      actions={<EnEmailButton label="Email Consultation" />}
    />
  );
}
