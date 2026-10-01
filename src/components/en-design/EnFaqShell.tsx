import type { ReactNode } from 'react';
import { getPricingContent } from '@/components/PricingCards';
import EnPageShell, { EnClosingBand, EnEmailButton, EnGlance } from './EnPageShell';
import styles from './EnFaq.module.css';

/**
 * en FAQ page shell (Opus 5.5 en lane, 2026-10-01): scopes the explorer restyle (search bar
 * across the page, category tabs, Q/A rows) and closes with the en contact band. The explorer
 * markup, search, filters and FAQ JSON-LD are unchanged.
 */
export default function EnFaqShell({ children }: { children: ReactNode }) {
  return (
    <EnPageShell page="faq">
      <div className={styles.faq}>{children}</div>
      <EnClosingBand id="en-faq-closing" />
    </EnPageShell>
  );
}

/** FAQ header fact sheet: how many answers are on the page and the first-consultation fee (pricing data). */
export function EnFaqGlance({ count }: { count: number }) {
  const consultation = getPricingContent('en').items.find((item) => item.icon === 'consultation');
  return (
    <EnGlance
      items={[
        { term: 'Questions', value: String(count) },
        ...(consultation ? [{ term: consultation.title, value: `${consultation.price} ${consultation.unit}`.trim(), note: consultation.details[3] }] : []),
      ]}
      actions={<EnEmailButton label="Email Consultation" />}
    />
  );
}
