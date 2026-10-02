import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import ZhHantMonoIcon from '@/components/zh-hant-icons/ZhHantMonoIcon';
import PricingCards, { getPricingContent } from '@/components/PricingCards';
import { pageCopy } from '@/data/page-copy';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import styles from './ZhHantPricing.module.css';

/**
 * zh-hant pricing page: header with a fee board (each line jumps to its tile below)
 * and the consultation CTA, then the fee schedule. Apple pass (2026-10-01): light header,
 * the board as a gray rounded tile — styles only, see the module's last block. Copy and amounts come from page-copy
 * and the shared pricing data. Fix round (2026-10-01): no ↗ on the primary CTA, plus a 聯絡方式 › secondary link.
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
            {data.ctaLabel}
          </a>
          {/* Secondary header link (spec: existing links only) — the header nav's own 聯絡方式 entry. */}
          <Link href="/zh-hant/contact" className={styles.headerLink}>聯絡方式<ZhHantMonoIcon name="chevron-right" size={14} strokePx={1.75} className={styles.trail} /></Link>
        </div>
      </PageHeader>
      <PricingCards locale="zh-hant" />
    </div>
  );
}
