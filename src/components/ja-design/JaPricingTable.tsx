import CorporateAdvisoryLink from '@/components/CorporateAdvisoryLink';
import type { PricingContent } from '@/components/PricingCards';
import JaWrap from './JaWrap';
import v2 from './JaPagesV2.module.css';
import styles from './JaPricing.module.css';

/**
 * ja pricing, 昊 V2 (2026-10-02; CONCEPT-V2 C8 and §9): the four published fees as tiles with every detail,
 * condition and note, the 一般法律相談 tile read as a spec sheet, and the disclaimer at full size beside the
 * retainer. Every amount, detail, note and the disclaimer come from the shared ja pricing data; the only new
 * words are the structural labels in JA_PRICING_TABLE_LABELS (CONCEPT-V2 §13.1). Prices never move.
 *
 * Merge note: the home lane's `kou/JaFees` renders the same tiles on the home; at merge one of the two can
 * serve both pages.
 */
export const JA_PRICING_TABLE_LABELS = {
  caption: '料金表',
  method: '方式',
  language: '言語',
  booking: '予約',
  timeDifference: '時差',
  included: '含まれるもの',
  extra: '別途費用',
} as const;

/** Existing fragment of the office time-zone line (OfficeMapTabs.tsx, compactKoreaOfficeCopy.ja.timeZone). */
export const JA_TIME_DIFFERENCE_FRAGMENT = '台湾時間（日本時間−1時間）';

const isExtra = (detail: string) => detail.endsWith('別途費用');
const isIncluded = (detail: string) => detail.endsWith('を含みます');

export default function JaPricingTable({ data }: { data: PricingContent }) {
  const [consultation, litigation, company, retainer] = data.items;
  return (
    <section className={styles.fees} aria-labelledby="ja-fee-table-caption">
      <div className="container">
        <div className={styles.feesHead}>
          <h2 id="ja-fee-table-caption" className={styles.feesTitle}>{JA_PRICING_TABLE_LABELS.caption}</h2>
          <p className={styles.currency}>{data.currency}</p>
        </div>
        <div className={styles.grid}>
          {consultation ? (
            <article id={`fee-${consultation.icon}`} className={`${v2.tile} ${styles.tile} ${styles.f1} ${v2.fusL}`}>
              <div className={styles.f1Price}>
                <h3 className={styles.itemTitle}>{consultation.title}</h3>
                <p className={styles.price}>
                  <span className={styles.amount}>{consultation.price}</span>
                  {consultation.unit ? <span className={styles.unit}>{consultation.unit}</span> : null}
                </p>
                <span className={styles.rule} aria-hidden />
              </div>
              <div className={styles.f1Spec}>
                <p className={`${styles.lead} ${v2.ph}`}><JaWrap text={consultation.details[2]} /></p>
                <dl className={styles.specRows}>
                  <div><dt>{JA_PRICING_TABLE_LABELS.method}</dt><dd>{consultation.details[0]}</dd></div>
                  <div><dt>{JA_PRICING_TABLE_LABELS.language}</dt><dd>{consultation.details[1]}</dd></div>
                  <div><dt>{JA_PRICING_TABLE_LABELS.booking}</dt><dd>{consultation.details[3]}</dd></div>
                  <div><dt>{JA_PRICING_TABLE_LABELS.timeDifference}</dt><dd>{JA_TIME_DIFFERENCE_FRAGMENT}</dd></div>
                </dl>
              </div>
            </article>
          ) : null}
          {litigation ? (
            <article id={`fee-${litigation.icon}`} className={`${v2.tile} ${styles.tile} ${styles.half} ${v2.fusL}`}>
              <h3 className={styles.itemTitle}>{litigation.title}</h3>
              <p className={`${styles.price} ${styles.priceWord}`}><span className={styles.amount}>{litigation.price}</span></p>
              <span className={styles.rule} aria-hidden />
              <ul className={styles.details}>
                {litigation.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
              {litigation.note ? <p className={styles.note}>{litigation.note}</p> : null}
            </article>
          ) : null}
          {company ? (
            <article id={`fee-${company.icon}`} className={`${v2.tile} ${styles.tile} ${styles.half} ${v2.fusR}`}>
              <h3 className={styles.itemTitle}>{company.title}</h3>
              <p className={styles.price}><span className={styles.amount}>{company.price}</span></p>
              <span className={styles.rule} aria-hidden />
              <div className={styles.subTiles}>
                <div className={styles.subTile}>
                  <h4 className={styles.subLabel}>{JA_PRICING_TABLE_LABELS.included}</h4>
                  <ul className={styles.details}>
                    {company.details.filter(isIncluded).map((detail) => <li key={detail}>{detail}</li>)}
                  </ul>
                </div>
                <div className={styles.subTile}>
                  <h4 className={styles.subLabel}>{JA_PRICING_TABLE_LABELS.extra}</h4>
                  <ul className={styles.details}>
                    {company.details.filter(isExtra).map((detail) => <li key={detail}>{detail}</li>)}
                  </ul>
                </div>
              </div>
              <ul className={styles.details}>
                {company.details.filter((detail) => !isIncluded(detail) && !isExtra(detail)).map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
              {company.note ? <p className={styles.note}>{company.note}</p> : null}
            </article>
          ) : null}
          {retainer ? (
            <article id={`fee-${retainer.icon}`} className={`${v2.tile} ${styles.tile} ${styles.half} ${v2.fusL}`}>
              <h3 className={styles.itemTitle}>{retainer.title}</h3>
              <p className={styles.price}>
                <span className={styles.amount}>{retainer.price}</span>
                {retainer.unit ? <span className={styles.unit}>{retainer.unit}</span> : null}
              </p>
              <span className={styles.rule} aria-hidden />
              <ul className={styles.details}>
                {retainer.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
              <div className={styles.advisory}><CorporateAdvisoryLink locale="ja" /></div>
            </article>
          ) : null}
          <div className={`${styles.notes} ${styles.half}`}>
            <p>{data.disclaimer}</p>
            {data.currencyNote ? <p>{data.currencyNote}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
