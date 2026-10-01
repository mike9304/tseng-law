import type { ReactNode } from 'react';
import Link from 'next/link';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import EnPageShell, { EnClosingBand, EnEmailButton, EnGlance } from './EnPageShell';
import { enOfficeNames } from './EnAboutBody';
import aboutStyles from './EnAbout.module.css';
import styles from './EnLawyers.module.css';

/**
 * en team page (Opus 5.5 en lane, 2026-10-01): same blocks (JSON-LD, header, team cards,
 * key facts) inside the en wrapper; the team cards share the about-page styling.
 */
export function EnLawyersShell({ children }: { children: ReactNode }) {
  return (
    <EnPageShell page="lawyers">
      <div className={`${aboutStyles.team} ${styles.lawyers}`}>{children}</div>
      <EnClosingBand id="en-lawyers-closing" />
    </EnPageShell>
  );
}

/** Header fact sheet: lead attorney, languages and offices from the existing profile and contact data. */
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
