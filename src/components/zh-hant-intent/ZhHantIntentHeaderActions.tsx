import Link from 'next/link';
import ZhHantMonoIcon from '@/components/zh-hant-icons/ZhHantMonoIcon';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import type { AppleDesignLocale } from '@/lib/apple-design-locales';
import styles from './ZhHantIntent.module.css';

/**
 * zh-hant intent landings (/zh-hant/taiwan-lawyer, taiwan-company-setup-lawyer, taiwan-semiconductor-supplier-legal):
 * the header's actions, as on the zh about, pricing and service pages — the email consultation as an ink pill and
 * 收費標準 as a text link. Labels come from IntentLandingPage (its closing CTA uses the same two), the mailto and its
 * accessible name from the consultation helpers, so no new copy. Rendered for the Apple-system locales (zh-hant;
 * ko since 2026-10-06).
 */
export default function ZhHantIntentHeaderActions({
  contactLabel,
  pricingLabel,
  locale = 'zh-hant',
}: {
  contactLabel: string;
  pricingLabel: string;
  locale?: AppleDesignLocale;
}) {
  return (
    <div className={styles.headerActions}>
      <a
        href={getConsultationPublicMailto(locale)}
        className={styles.headerPrimary}
        aria-label={`${contactLabel} — ${getConsultationCtaLabel(locale)}`}
      >
        {contactLabel}
      </a>
      <Link href={`/${locale}/pricing`} className={styles.headerSecondary}>
        {pricingLabel}
        <ZhHantMonoIcon name="chevron-right" size={14} strokePx={1.75} />
      </Link>
    </div>
  );
}
