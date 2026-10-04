import CorporateAdvisoryLink from '@/components/CorporateAdvisoryLink';
import type { PricingContent } from '@/components/PricingCards';
import {
  getConsultationCtaLabel,
  getConsultationPublicEmail,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import { EnChevron } from './EnChevron';
import styles from './EnPricing.module.css';

/**
 * en fee schedule (CONCEPT-V2 12.3 pricing: the S5 spec sheet at page scale). The consultation fee stands
 * with "/ 1 hour" and all four of its conditions beside it at reading size; the other three fees follow in
 * three columns whose rows line up; then the baseline disclaimer, the currency note and the booking CTA. Every
 * title, amount, unit, detail, note and disclaimer is the shared English pricing data, verbatim. Each fee block
 * keeps its `fee-<icon>` id. The numerals never count.
 */

/** Quote flow labels kept from the en lane (they restate the litigation note and the disclaimer). */
const QUOTE_STEPS = ['Book a consultation', 'Case review', 'Written quote'] as const;

/** "NT$ 3,000" → a small grey "NT$", a real text space, then the numeral (visible text unchanged). */
function Price({ price, className }: { price: string; className?: string }) {
  const match = /^(NT\$)\s*(\d[\d,]*)$/.exec(price.trim());
  if (!match) return <span className={`${styles.priceText} ${className ?? ''}`}>{price}</span>;
  return (
    <span className={className}>
      <span className={styles.cur}>{match[1]}</span>{' '}
      <span className={styles.num}>{match[2]}</span>
    </span>
  );
}

/** The disclaimer split at its first sentence end, so the second sentence can stand out by colour only. */
function splitFirstSentence(text: string): [string, string] {
  const index = text.indexOf('. ');
  if (index === -1) return [text, ''];
  return [text.slice(0, index + 1), text.slice(index + 2)];
}

export default function EnPricingTiers({ data }: { data: PricingContent }) {
  const mailto = getConsultationPublicMailto('en');
  const [consultation, ...others] = data.items;
  const [disclaimerLead, disclaimerRest] = splitFirstSentence(data.disclaimer);
  return (
    <section className={styles.schedule} aria-label={data.currency} data-en-pricing>
      <div className="container">
        <p className={styles.currency}>{data.currency}</p>
        {consultation ? (
          <article id={`fee-${consultation.icon}`} className={styles.consultation} data-fee={consultation.icon}>
            <div className={styles.consultationLead}>
              <h2 className={styles.consultationTitle}>{consultation.title}</h2>
              <p className={styles.consultationPrice}>
                <Price price={consultation.price} className={styles.feeNumeral} />
                {consultation.unit ? <span className={styles.unit}> {consultation.unit}</span> : null}
              </p>
            </div>
            <ul className={styles.consultationDetails}>
              {consultation.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
            {consultation.note ? <p className={styles.consultationNote}>{consultation.note}</p> : null}
          </article>
        ) : null}
        <div className={styles.line} aria-hidden="true" data-en-draw />
        <div className={styles.others}>
          {others.map((item) => (
            <article key={item.icon} id={`fee-${item.icon}`} className={styles.fee} data-fee={item.icon}>
              <h2 className={styles.feeTitle}>{item.title}</h2>
              <p className={styles.feePrice}>
                <Price price={item.price} className={styles.priceNumeral} />
                {item.unit ? <span className={styles.feeUnit}> {item.unit}</span> : null}
              </p>
              <ul className={styles.feeDetails}>
                {item.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
              {item.note ? <p className={styles.feeNote}>{item.note}</p> : <span className={styles.feeNote} aria-hidden="true" />}
              {item.icon === 'retainer' ? <div className={styles.advisory}><CorporateAdvisoryLink locale="en" /></div> : null}
            </article>
          ))}
        </div>
        <div className={styles.terms}>
          <p className={styles.disclaimer}>
            {disclaimerLead}
            {disclaimerRest ? <> <span className={styles.disclaimerKey}>{disclaimerRest}</span></> : null}
          </p>
          {data.currencyNote ? <p className={styles.currencyNote}>{data.currencyNote}</p> : null}
          <ol className={styles.steps} aria-label="Quote process">
            {QUOTE_STEPS.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
        <div className={styles.cta}>
          <a href={mailto} className={styles.pill} aria-label={`${data.ctaLabel} — ${getConsultationCtaLabel('en')}`}>
            {data.ctaLabel}
            <EnChevron />
          </a>
          <div className={styles.ctaCopy}>
            <p className={styles.ctaNote}>{data.ctaNote}</p>
            <p className={styles.ctaEmail}><a href={mailto}>{getConsultationPublicEmail()}</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}
