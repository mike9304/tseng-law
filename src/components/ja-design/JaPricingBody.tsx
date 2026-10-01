import PageHeader from '@/components/PageHeader';
import PricingCards from '@/components/PricingCards';
import { pageCopy } from '@/data/page-copy';
import JaPageShell from './JaPageShell';
import styles from './JaPricing.module.css';

/**
 * Quote flow shown in the ja pricing header. Each step restates the existing ja copy:
 * the litigation note (「まずは法律相談をお申し込みください」「案件の内容を確認したうえで」)
 * and the disclaimer (「初回相談後に書面によるお見積りでご案内します」). No new promise.
 */
export const JA_PRICING_FLOW = {
  label: 'ご依頼までの流れ',
  steps: ['法律相談のお申し込み', '案件内容の確認', '書面によるお見積り'],
} as const;

/** ja pricing page (Opus 5.5 ja lane, 2026-10-01): paper header with the quote flow, then the 料金表. */
export default function JaPricingBody() {
  const copy = pageCopy.ja.pricing;
  return (
    <JaPageShell page="pricing" className={styles.root}>
      <PageHeader locale="ja" label={copy.label} title={copy.title} description={copy.description}>
        <div className={styles.flow}>
          <p className={styles.flowLabel}>{JA_PRICING_FLOW.label}</p>
          <ol className={styles.flowSteps}>
            {JA_PRICING_FLOW.steps.map((step, index) => (
              <li key={step}>
                <span className={styles.flowNo} aria-hidden>STEP {index + 1}</span>
                <span className={styles.flowText}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </PageHeader>
      <PricingCards locale="ja" />
    </JaPageShell>
  );
}
