import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import ZhHantMonoIcon from '@/components/zh-hant-icons/ZhHantMonoIcon';
import PricingCards, { getPricingContent } from '@/components/PricingCards';
import { pageCopy } from '@/data/page-copy';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { appleDesignRootProps, type AppleDesignLocale } from '@/lib/apple-design-locales';
import styles from './ZhHantPricing.module.css';

/**
 * zh-hant pricing page: header with a fee board (each line jumps to its tile below)
 * and the consultation CTA, then the fee schedule. Apple pass (2026-10-01): light header,
 * the board as a gray rounded tile — styles only, see the module's last block. Copy and amounts come from page-copy
 * and the shared pricing data. Fix round (2026-10-01): no ↗ on the primary CTA, plus a 聯絡方式 › secondary link.
 * ko shares it since 2026-10-06 (`locale="ko"`): ko page copy and pricing data; the board label and the 연락처 link
 * (the header utility label) are the only ko strings here.
 */
const PRICING_LABELS: Record<AppleDesignLocale, { board: string; contact: string }> = {
  'zh-hant': { board: '收費一覽', contact: '聯絡方式' },
  ko: { board: '비용 한눈에 보기', contact: '연락처' },
};

export default function ZhHantPricingBody({ locale = 'zh-hant' }: { locale?: AppleDesignLocale } = {}) {
  const copy = pageCopy[locale].pricing;
  const data = getPricingContent(locale);
  const mailto = getConsultationPublicMailto(locale);
  const labels = PRICING_LABELS[locale];
  return (
    <div className={styles.root} {...appleDesignRootProps(locale, 'pricing')}>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description}>
        <nav className={styles.board} aria-label={labels.board}>
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
          <a href={mailto} className="button" aria-label={`${data.ctaLabel} — ${getConsultationCtaLabel(locale)}`}>
            {data.ctaLabel}
          </a>
          {/* Secondary header link (spec: existing links only) — the header nav's own 聯絡方式 entry. */}
          <Link href={`/${locale}/contact`} className={styles.headerLink}>{labels.contact}<ZhHantMonoIcon name="chevron-right" size={14} strokePx={1.75} className={styles.trail} /></Link>
        </div>
      </PageHeader>
      <PricingCards locale={locale} />
    </div>
  );
}
