import Link from 'next/link';

import { getForeignMatterRouter } from '@/data/foreign-matter-router';
import ZhHantMonoIcon, { type ZhHantMonoIconName } from '@/components/zh-hant-icons/ZhHantMonoIcon';
import type { SiteLocale } from '@/lib/locales';
import styles from './ForeignMatterRouter.module.css';

/** zh-hant only: the home's practice glyphs on the topic tiles (residence and immigration take the globe). */
const ZH_MATTER_ICON: Readonly<Record<string, ZhHantMonoIconName>> = {
  'services/investment': 'company',
  'services/labor': 'labor',
  'services/civil': 'civil',
  'services/family': 'family',
  'services/criminal': 'criminal',
  contact: 'globe',
};

export default function ForeignMatterRouter({ locale }: { locale: SiteLocale }) {
  const copy = getForeignMatterRouter(locale);

  return (
    <section id="matter-router" className={`section section--light ${styles.root}`} aria-labelledby="matter-router-title">
      <div className="container">
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id="matter-router-title" className="section-title">{copy.title}</h2>
        <p className={styles.intro}>{copy.intro}</p>
        <div className={styles.grid}>
          {copy.matters.map((matter) => (
            <Link key={matter.href} href={`/${locale}/${matter.href}`} className={styles.card}>
              {locale === 'zh-hant' && ZH_MATTER_ICON[matter.href] ? <ZhHantMonoIcon name={ZH_MATTER_ICON[matter.href]} size={44} /> : null}
              <h3>{matter.title}</h3>
              <p>{matter.description}</p>
              <span aria-hidden="true">{locale === 'zh-hant' ? <ZhHantMonoIcon name="arrow-right" size={20} /> : '↗'}</span>
            </Link>
          ))}
        </div>
        <div className={styles.intake}>
          <div>
            <h3>{copy.inquiryTitle}</h3>
            <p>{copy.inquiryText}</p>
            <p className={styles.process}>{copy.process}</p>
            <p className={styles.language}>{copy.languageNote}</p>
          </div>
          <Link href={`/${locale}/contact`} className="button">{copy.inquiryAction}</Link>
        </div>
      </div>
    </section>
  );
}
