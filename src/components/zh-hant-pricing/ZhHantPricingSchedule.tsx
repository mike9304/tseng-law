import CorporateAdvisoryLink from '@/components/CorporateAdvisoryLink';
import ZhHantMonoIcon, { ZH_FEE_ICON } from '@/components/zh-hant-icons/ZhHantMonoIcon';
import type { PricingContent } from '@/components/PricingCards';
import {
  getConsultationCtaLabel,
  getConsultationPublicEmail,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import type { AppleDesignLocale } from '@/lib/apple-design-locales';
import styles from './ZhHantPricing.module.css';

/**
 * zh-hant pricing, second pass (son7-87 / Opus 5.5, 2026-10-01): the four fees as a
 * fee schedule (one row each) instead of a 2×2 card grid. Every amount, detail and note
 * comes from the shared zh-hant pricing data; nothing is added or reworded.
 * Apple pass (2026-10-01): the rows sit in a bento of rounded tiles (`.tiles`, `data-fee` picks the span).
 * Fix round: the closing call leaves the gray section and becomes the home's full-bleed band (`.closing`).
 */

/**
 * Litigation quote flow: restates the card note (確認案件內容後提供報價，請先預約諮詢 / ko 「사건 내용을 확인한 후 견적을
 * 안내드립니다. 먼저 상담을 예약해 주세요.」) and the disclaimer's 書面報價 / 「서면 견적」.
 */
const QUOTE_STEPS: Record<AppleDesignLocale, { label: string; steps: readonly string[] }> = {
  'zh-hant': { label: '報價流程', steps: ['預約諮詢', '確認案件內容', '書面報價'] },
  ko: { label: '견적 절차', steps: ['상담 예약', '사건 내용 확인', '서면 견적'] },
};

export default function ZhHantPricingSchedule({ data, locale = 'zh-hant' }: { data: PricingContent; locale?: AppleDesignLocale }) {
  const mailto = getConsultationPublicMailto(locale);
  const quote = QUOTE_STEPS[locale];
  return (
    <>
      <section className={styles.schedule}>
        <div className="container">
          <p className={styles.currency}>{data.currency}</p>
          <div className={styles.tiles}>
            {data.items.map((item) => (
              <article key={item.icon} id={`fee-${item.icon}`} className={styles.row} data-fee={item.icon}>
                <div className={styles.rowHead}>
                  <span className={styles.rowIcon} aria-hidden><ZhHantMonoIcon name={ZH_FEE_ICON[item.icon]} size={48} /></span>
                  <h2 className={styles.rowTitle}>{item.title}</h2>
                  <p className={styles.rowPrice}>
                    <span className={styles.amount}>{item.price}</span>
                    {item.unit ? <span className={styles.unit}>{item.unit}</span> : null}
                  </p>
                </div>
                <div className={styles.rowBody}>
                  <ul className={styles.details}>
                    {item.details.map((detail) => <li key={detail}>{detail}</li>)}
                  </ul>
                  {item.icon === 'litigation' ? (
                    <ol className={styles.steps} aria-label={quote.label}>
                      {quote.steps.map((step, index) => (
                        <li key={step}><span className={styles.stepNo} aria-hidden>{index + 1}</span>{step}</li>
                      ))}
                    </ol>
                  ) : null}
                  {item.note ? <p className={styles.note}>{item.note}</p> : null}
                  {item.icon === 'retainer' ? <div className={styles.advisory}><CorporateAdvisoryLink locale={locale} /></div> : null}
                </div>
              </article>
            ))}
          </div>
          <p className={styles.disclaimer}>{data.disclaimer}</p>
        </div>
      </section>
      {/* Closing band: the home's last call (full-bleed ink gradient, centered statement, white pill + outlined email pill). */}
      <section className={styles.closing}>
        <div className={`container ${styles.cta}`}>
          <div className={styles.ctaCopy}>
            <p className={styles.ctaNote}>{data.ctaNote}</p>
          </div>
          <div className={styles.ctaActions}>
            <a href={mailto} className="button" aria-label={`${data.ctaLabel} — ${getConsultationCtaLabel(locale)}`}>
              {data.ctaLabel}
            </a>
            <p className={styles.ctaEmail}><a href={mailto}>{getConsultationPublicEmail()}</a></p>
          </div>
        </div>
      </section>
    </>
  );
}
