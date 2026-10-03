import CorporateAdvisoryLink from '@/components/CorporateAdvisoryLink';
import PricingIcon from '@/components/PricingIcon';
import type { PricingContent } from '@/components/PricingCards';
import {
  getConsultationCtaLabel,
  getConsultationPublicEmail,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import styles from './EnPricing.module.css';

/**
 * en fee schedule (Opus 5.5 en lane, 2026-10-01): the four fees side by side as a rate card,
 * then how a quote is set and the booking CTA. Every amount, detail, note and disclaimer comes
 * from the shared English pricing data; nothing is added or reworded.
 */

/** Quote flow labels: restate the litigation note and the disclaimer ("in writing after the initial consultation"). */
const QUOTE_STEPS = ['Book a consultation', 'Case review', 'Written quote'] as const;

/** "NT$ 50,000" becomes a small mono currency prefix on the number's baseline; a text price ("Request a Quote") stays a smaller title. */
function PriceAmount({ price }: { price: string }) {
  const match = /^(NT\$)\s*(\d[\d,]*)$/.exec(price.trim());
  if (!match) return <span className={`${styles.amount} ${styles.amountText}`}>{price}</span>;
  return (
    <span className={styles.amount}>
      <span className={styles.cur}>{match[1]}</span>{' '}
      <span className={styles.num}>{match[2]}</span>
    </span>
  );
}

export default function EnPricingTiers({ data }: { data: PricingContent }) {
  const mailto = getConsultationPublicMailto('en');
  return (
    <section className={styles.schedule} aria-label={data.currency} data-en-pricing>
      <div className="container">
        <p className={styles.currency}>{data.currency}</p>
        <div className={styles.tiers}>
          {data.items.map((item) => (
            <article key={item.icon} id={`fee-${item.icon}`} className={styles.tier} data-fee={item.icon}>
              <header className={styles.tierHead}>
                <span className={styles.tierIcon} aria-hidden><PricingIcon name={item.icon} /></span>
                <h2 className={styles.tierTitle}>{item.title}</h2>
                <p className={styles.tierPrice}>
                  <PriceAmount price={item.price} />
                  {item.unit ? <span className={styles.unit}>{item.unit}</span> : null}
                </p>
              </header>
              <div className={styles.tierBody}>
                <ul className={styles.details}>
                  {item.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
                {item.note ? <p className={styles.note}>{item.note}</p> : null}
                {item.icon === 'retainer' ? <div className={styles.advisory}><CorporateAdvisoryLink locale="en" /></div> : null}
              </div>
            </article>
          ))}
        </div>
        <div className={styles.terms}>
          <ol className={styles.steps} aria-label="Quote process">
            {QUOTE_STEPS.map((step, index) => (
              <li key={step}><span className={styles.stepNo} aria-hidden>{index + 1}</span>{step}</li>
            ))}
          </ol>
          <div className={styles.disclaimer}>
            <p>{data.disclaimer}</p>
            {data.currencyNote ? <p>{data.currencyNote}</p> : null}
          </div>
        </div>
        <div className={styles.cta}>
          <div>
            <p className={styles.ctaNote}>{data.ctaNote}</p>
            <p className={styles.ctaEmail}><a href={mailto}>{getConsultationPublicEmail()}</a></p>
          </div>
          <a href={mailto} className={styles.ctaButton} aria-label={`${data.ctaLabel} — ${getConsultationCtaLabel('en')}`}>
            {data.ctaLabel} <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
