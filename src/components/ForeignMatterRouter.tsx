import Link from 'next/link';

import { getForeignMatterRouter } from '@/data/foreign-matter-router';
import type { SiteLocale } from '@/lib/locales';
import styles from './ForeignMatterRouter.module.css';

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
              <h3>{matter.title}</h3>
              <p>{matter.description}</p>
              <span aria-hidden="true">↗</span>
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
