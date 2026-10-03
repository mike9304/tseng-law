import PageHeader from '@/components/PageHeader';
import PricingCards, { getPricingContent } from '@/components/PricingCards';
import { pageCopy } from '@/data/page-copy';
import {
  getConsultationCtaLabel,
  getConsultationPublicEmail,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import JaPageShell from './JaPageShell';
import JaClosingTile from './JaClosingTile';
import v2 from './JaPagesV2.module.css';
import styles from './JaPricing.module.css';

/**
 * Quote flow on the ja pricing page. Each step restates the existing ja copy:
 * the litigation note (「まずは法律相談をお申し込みください」「案件の内容を確認したうえで」)
 * and the disclaimer (「初回相談後に書面によるお見積りでご案内します」). No new promise.
 */
export const JA_PRICING_FLOW = {
  label: 'ご依頼までの流れ',
  steps: ['法律相談のお申し込み', '案件内容の確認', '書面によるお見積り'],
} as const;

/**
 * ja pricing page, 昊 V2 (2026-10-02; CONCEPT-V2 §9): the header with its morning band, the fee tiles
 * (JaPricingTable through PricingCards), the flow as a vermilion beam drawn across STEP 1–3 as it comes into
 * view (C9, unpinned), and the existing CTA in a dusk closing tile.
 *
 * Merge note: the home lane's `kou/JaFlow` is the pinned version of the same track.
 */
export default function JaPricingBody() {
  const copy = pageCopy.ja.pricing;
  const data = getPricingContent('ja');
  const mailto = getConsultationPublicMailto('ja');
  return (
    <JaPageShell page="pricing" className={styles.root}>
      <PageHeader locale="ja" label={copy.label} title={copy.title} description={copy.description} />
      <PricingCards locale="ja" />
      <section className={styles.flow} aria-labelledby="ja-pricing-flow-title">
        <div className="container">
          <h2 id="ja-pricing-flow-title" className={styles.flowTitle}>{JA_PRICING_FLOW.label}</h2>
          <ol className={styles.track}>
            {JA_PRICING_FLOW.steps.map((step, index) => (
              <li key={step} className={styles.station}>
                <span className={styles.marker} aria-hidden />
                <span className={styles.stepNo}>STEP {index + 1}</span>
                <h3 className={styles.stepTitle}>{step}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <JaClosingTile labelledBy="ja-pricing-closing-note">
        <p id="ja-pricing-closing-note" className={styles.closingNote}>{data.ctaNote}</p>
        <div className={styles.closingActions}>
          <a href={mailto} className={`${v2.pill} ${v2.pillBlock}`} aria-label={`${data.ctaLabel} — ${getConsultationCtaLabel('ja')}`}>
            {data.ctaLabel}
          </a>
          <a href={mailto} className={`${v2.chev} ${styles.closingEmail}`}>{getConsultationPublicEmail()}</a>
        </div>
      </JaClosingTile>
    </JaPageShell>
  );
}
