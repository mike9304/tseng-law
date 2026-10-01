import PageHeader from '@/components/PageHeader';
import PricingCards, { getPricingContent } from '@/components/PricingCards';
import { pageCopy } from '@/data/page-copy';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import styles from './ZhHantPricing.module.css';

/**
 * zh-hant pricing page: green header with a fee board (each line jumps to its row below)
 * and the consultation CTA, then the fee schedule. Copy and amounts come from page-copy
 * and the shared pricing data.
 */
export default function ZhHantPricingBody() {
  const copy = pageCopy['zh-hant'].pricing;
  const data = getPricingContent('zh-hant');
  const mailto = getConsultationPublicMailto('zh-hant');
  return (
    <div className={styles.root} id="zh-hant-pricing" data-zh-hant-design="pricing">
      <PageHeader locale="zh-hant" label={copy.label} title={copy.title} description={copy.description}>
        <nav className={styles.board} aria-label="收費一覽">
          <p className={styles.boardCurrency}>{data.currency}</p>
          <ul className={styles.boardList}>
            {data.items.map((item) => (
              <li key={item.icon}>
                <a href={`#fee-${item.icon}`} className={styles.boardLink}>
                  <span className={styles.boardTitle}>{item.title}</span>
                  <span className={styles.boardLeader} aria-hidden />
                  <span className={styles.boardPrice}>
                    {item.price}
                    {item.unit ? <small>{item.unit}</small> : null}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.headerActions}>
          <a href={mailto} className="button" aria-label={`${data.ctaLabel} — ${getConsultationCtaLabel('zh-hant')}`}>
            {data.ctaLabel} <span aria-hidden>↗</span>
          </a>
        </div>
      </PageHeader>
      <PricingCards locale="zh-hant" />
    </div>
  );
}
