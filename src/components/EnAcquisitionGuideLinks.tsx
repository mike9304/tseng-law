import Link from 'next/link';
import type { SiteLocale } from '@/lib/locales';
import styles from './OverseasEntryBlock.module.css';

/**
 * Entry block for overseas companies (EN) and Japanese companies / residents (JA).
 * Links only to existing, published landings/guides/services — no new URLs and no
 * new legal claims (descriptions summarise each target page's own meta/lead).
 * Other locales render nothing.
 */

export type OverseasEntryItem = {
  href: string;
  label: string;
  description: string;
};

type OverseasEntryCopy = {
  heading: string;
  lede: string;
  items: readonly OverseasEntryItem[];
};

export const OVERSEAS_ENTRY_CONTENT: Partial<Record<SiteLocale, OverseasEntryCopy>> = {
  en: {
    heading: 'For overseas companies and international clients',
    lede: 'Start with the issue in front of you. Each guide explains what to prepare and how we can help.',
    items: [
      {
        href: '/en/taiwan-company-setup-lawyer',
        label: 'Set up a Taiwan entity',
        description: 'Entity choice, investment approval, registration, and operating contracts for overseas businesses.',
      },
      {
        href: '/en/taiwan-litigation-lawyer',
        label: 'Contracts, disputes & litigation',
        description: 'Contract disputes, unpaid invoices, and civil claims for overseas companies and individuals.',
      },
      {
        href: '/en/services/labor',
        label: 'Employment & labor issues',
        description: 'Ending an employment contract in Taiwan: legal basis, notice requirements, and severance.',
      },
      {
        href: '/en/taiwan-semiconductor-supplier-legal',
        label: 'Semiconductor & equipment suppliers',
        description: 'Local entity choice, supply contracts, technician stays, and collections for suppliers selling into Taiwan fabs.',
      },
      {
        href: '/en/taiwan-lawyer',
        label: 'English-speaking Taiwan lawyer in Taipei',
        description: 'Attorney Wei Tseng consults directly in English, in person in Taipei or by video.',
      },
    ],
  },
  ja: {
    heading: '日系企業・在台日本人の方へ',
    lede: 'ご相談内容に近い案内からご覧ください。いずれも日本語でご相談いただけます。',
    items: [
      {
        href: '/ja/taiwan-company-setup-lawyer',
        label: '台湾での会社設立・進出',
        description: '子会社・支店・代表者事務所の違いから、投資審査・銀行口座開設・就業許可まで。',
      },
      {
        href: '/ja/taiwan-litigation-lawyer',
        label: '契約・紛争・訴訟',
        description: '契約紛争・未払い請求、民事訴訟、損害賠償について最初に確認すべきポイント。',
      },
      {
        href: '/ja/services/labor',
        label: '労務・雇用',
        description: '解雇、資遣費、賃金・労働時間など、台湾での雇用紛争についての助言。',
      },
      {
        href: '/ja/guides/taiwan-company-setup',
        label: '台湾会社設立ガイド',
        description: '投資審査から設立登記・税務登記・口座開設までの手続き、費用・期間のまとめ。',
      },
      {
        href: '/ja/taiwan-semiconductor-supplier-legal',
        label: '半導体素材・装置サプライヤーの方へ',
        description: '現地法人、供給契約、技術者の滞在、代金回収の準備を整理した案内。',
      },
      {
        href: '/ja/taiwan-lawyer',
        label: '日本語で相談できる台湾弁護士',
        description: '会社設立・投資から民事・労働・家事・刑事事件まで、日本語で直接ご相談いただけます。',
      },
    ],
  },
};

/** Backward-compatible EN exports. */
export const EN_ACQUISITION_GUIDE_HEADING = OVERSEAS_ENTRY_CONTENT.en!.heading;
export const EN_ACQUISITION_GUIDE_LINKS = OVERSEAS_ENTRY_CONTENT.en!.items;

export function getOverseasEntryContent(locale: SiteLocale): OverseasEntryCopy | null {
  return OVERSEAS_ENTRY_CONTENT[locale] ?? null;
}

export default function EnAcquisitionGuideLinks({
  locale,
  variant = 'compact',
}: {
  locale: SiteLocale;
  /** `full` = card grid (home); `compact` = heading + link row (services, columns). */
  variant?: 'full' | 'compact';
}) {
  const content = getOverseasEntryContent(locale);
  if (!content) {
    return null;
  }
  const headingId = `overseas-entry-${variant}-heading`;

  if (variant === 'compact') {
    return (
      <section
        className={`section section--light ${styles.section} ${styles.compact}`}
        aria-labelledby={headingId}
        data-overseas-entry="compact"
      >
        <div className="container">
          <h2 id={headingId} className={styles.compactHeading}>{content.heading}</h2>
          <ul className={styles.linkRow}>
            {content.items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.rowLink}>
                  {item.label}
                  <span aria-hidden className={styles.arrow}>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`section section--light ${styles.section}`}
      aria-labelledby={headingId}
      data-overseas-entry="full"
    >
      <div className="container">
        <h2 id={headingId} className={`section-title ${styles.heading}`}>{content.heading}</h2>
        <p className={styles.lede}>{content.lede}</p>
        <ul className={styles.grid}>
          {content.items.map((item) => (
            <li key={item.href} className={styles.gridItem}>
              <Link href={item.href} className={styles.card}>
                <span className={styles.cardTitle}>{item.label}</span>
                <span className={styles.cardDesc}>{item.description}</span>
                <span aria-hidden className={styles.cardArrow}>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
