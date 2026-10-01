import CorporateAdvisoryLink from '@/components/CorporateAdvisoryLink';
import PricingIcon from '@/components/PricingIcon';
import type { PricingContent } from '@/components/PricingCards';
import {
  getConsultationCtaLabel,
  getConsultationPublicEmail,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import styles from './JaPricing.module.css';

/**
 * ja pricing (Opus 5.5 ja lane, 2026-10-01): the four fees as a ruled 料金表
 * (項目 / 料金 / 内容) instead of a 2×2 card grid. Every amount, detail, note and
 * the disclaimer come from the shared ja pricing data; nothing is added or reworded.
 * Column headers are small structural labels only.
 */
export const JA_PRICING_TABLE_LABELS = {
  item: '項目',
  fee: '料金',
  scope: '内容・条件',
  caption: '料金表',
} as const;

export default function JaPricingTable({ data }: { data: PricingContent }) {
  const mailto = getConsultationPublicMailto('ja');
  return (
    <section className={`section ${styles.schedule}`} aria-labelledby="ja-fee-table-caption">
      <div className="container">
        <table className={styles.table}>
          <caption id="ja-fee-table-caption" className={styles.caption}>
            <span className={styles.captionTitle}>{JA_PRICING_TABLE_LABELS.caption}</span>
            <span className={styles.captionCurrency}>{data.currency}</span>
          </caption>
          <thead>
            <tr>
              <th scope="col">{JA_PRICING_TABLE_LABELS.item}</th>
              <th scope="col">{JA_PRICING_TABLE_LABELS.fee}</th>
              <th scope="col">{JA_PRICING_TABLE_LABELS.scope}</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={item.icon} id={`fee-${item.icon}`} className={styles.row}>
                <th scope="row" className={styles.itemCell}>
                  <span className={styles.itemNo} aria-hidden>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.itemIcon} aria-hidden><PricingIcon name={item.icon} /></span>
                  <span className={styles.itemTitle}>{item.title}</span>
                </th>
                <td className={styles.feeCell}>
                  <span className={styles.amount}>{item.price}</span>
                  {item.unit ? <span className={styles.unit}>{item.unit}</span> : null}
                </td>
                <td className={styles.scopeCell}>
                  <ul className={styles.details}>
                    {item.details.map((detail) => <li key={detail}>{detail}</li>)}
                  </ul>
                  {item.note ? <p className={styles.note}>{item.note}</p> : null}
                  {item.icon === 'retainer' ? <div className={styles.advisory}><CorporateAdvisoryLink locale="ja" /></div> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.notes}>
          <p>{data.disclaimer}</p>
          {data.currencyNote ? <p>{data.currencyNote}</p> : null}
        </div>
        <div className={styles.cta}>
          <div className={styles.ctaCopy}>
            <p className={styles.ctaNote}>{data.ctaNote}</p>
            <p className={styles.ctaEmail}><a href={mailto}>{getConsultationPublicEmail()}</a></p>
          </div>
          <a href={mailto} className="button" aria-label={`${data.ctaLabel} — ${getConsultationCtaLabel('ja')}`}>
            {data.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
