import Link from 'next/link';
import ZhHantMonoIcon from '@/components/zh-hant-icons/ZhHantMonoIcon';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import styles from './ZhHantIntent.module.css';

/**
 * zh-hant intent landings (/zh-hant/taiwan-lawyer, taiwan-company-setup-lawyer, taiwan-semiconductor-supplier-legal):
 * the header's actions, as on the zh about, pricing and service pages — the email consultation as an ink pill and
 * 收費標準 as a text link. Labels come from IntentLandingPage (its closing CTA uses the same two), the mailto and its
 * accessible name from the consultation helpers, so no new copy. Rendered only when locale === 'zh-hant'.
 */
export default function ZhHantIntentHeaderActions({
  contactLabel,
  pricingLabel,
}: {
  contactLabel: string;
  pricingLabel: string;
}) {
  return (
    <div className={styles.headerActions}>
      <a
        href={getConsultationPublicMailto('zh-hant')}
        className={styles.headerPrimary}
        aria-label={`${contactLabel} — ${getConsultationCtaLabel('zh-hant')}`}
      >
        {contactLabel}
      </a>
      <Link href="/zh-hant/pricing" className={styles.headerSecondary}>
        {pricingLabel}
        <ZhHantMonoIcon name="chevron-right" size={14} strokePx={1.75} />
      </Link>
    </div>
  );
}
