import Link from 'next/link';
import CorporateAdvisoryLink from '@/components/CorporateAdvisoryLink';
import { getPricingContent, type PricingContent } from '@/components/PricingCards';
import { pageCopy } from '@/data/page-copy';
import {
  getConsultationCtaLabel,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import { EnChevron } from './EnChevron';
import styles from './EnFees.module.css';

/**
 * S5 "Service Fees" spec sheet (CONCEPT-V2 7, S5), also the body of /en/pricing (`variant="page"`).
 * Every title, price, unit, detail, note and disclaimer is the shared English pricing data, verbatim and
 * at reading size: the consultation fee always sits with "/ 1 hour" and all four of its conditions,
 * "Appointment required" included. The numeral never counts.
 */

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

/** The baseline disclaimer split at its first sentence end, so the second sentence can stand out by colour only. */
function splitFirstSentence(text: string): [string, string] {
  const index = text.indexOf('. ');
  if (index === -1) return [text, ''];
  return [text.slice(0, index + 1), text.slice(index + 2)];
}

export default function EnFees({
  variant = 'home',
  data = getPricingContent('en'),
}: {
  variant?: 'home' | 'page';
  data?: PricingContent;
}) {
  const page = variant === 'page';
  const [consultation, ...others] = data.items;
  const [disclaimerLead, disclaimerRest] = splitFirstSentence(data.disclaimer);
  const mailto = getConsultationPublicMailto('en');
  const TitleTag = page ? 'h2' : 'h3';
  return (
    <section
      className={styles.fees}
      id={page ? undefined : 'fees'}
      aria-labelledby={page ? undefined : 'en-fees-title'}
      aria-label={page ? data.currency : undefined}
      data-en-fees={variant}
    >
      <div className="container">
        <header className={styles.head}>
          {page ? null : (
            <h2 id="en-fees-title" className={styles.title}>{pageCopy.en.pricing.title}</h2>
          )}
          <p className={styles.currency}>{data.currency}</p>
        </header>
        {consultation ? (
          <div className={styles.consultation} id={page ? `fee-${consultation.icon}` : undefined} data-fee={consultation.icon}>
            <div className={styles.consultationLead}>
              <TitleTag className={styles.consultationTitle}>{consultation.title}</TitleTag>
              <p className={styles.consultationPrice}>
                <Price price={consultation.price} className={styles.feeNumeral} />
                {consultation.unit ? <span className={styles.unit}> {consultation.unit}</span> : null}
              </p>
            </div>
            <ul className={styles.consultationDetails}>
              {consultation.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
          </div>
        ) : null}
        <div className={styles.line} aria-hidden="true" />
        <div className={styles.others}>
          {others.map((item) => (
            <article key={item.icon} className={styles.fee} id={page ? `fee-${item.icon}` : undefined} data-fee={item.icon}>
              <TitleTag className={styles.feeTitle}>{item.title}</TitleTag>
              <p className={styles.feePrice}>
                <Price price={item.price} className={styles.priceNumeral} />
                {item.unit ? <span className={styles.feeUnit}> {item.unit}</span> : null}
              </p>
              <ul className={styles.feeDetails}>
                {item.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
              {item.note ? <p className={styles.feeNote}>{item.note}</p> : <span className={styles.feeNote} aria-hidden="true" />}
              {page && item.icon === 'retainer' ? <div className={styles.advisory}><CorporateAdvisoryLink locale="en" /></div> : null}
            </article>
          ))}
        </div>
        <div className={styles.terms}>
          <p className={styles.disclaimer}>
            {disclaimerLead}
            {disclaimerRest ? <> <span className={styles.disclaimerKey}>{disclaimerRest}</span></> : null}
          </p>
          {data.currencyNote ? <p className={styles.currencyNote}>{data.currencyNote}</p> : null}
        </div>
        <div className={styles.cta}>
          <a href={mailto} className={styles.pill} aria-label={`${data.ctaLabel} — ${getConsultationCtaLabel('en')}`}>
            {data.ctaLabel}
            <EnChevron />
          </a>
          {data.ctaNote ? <p className={styles.ctaNote}>{data.ctaNote}</p> : null}
          {page ? null : (
            <Link href="/en/pricing" className={styles.textLink}>
              {pageCopy.en.pricing.title}
              <EnChevron />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
