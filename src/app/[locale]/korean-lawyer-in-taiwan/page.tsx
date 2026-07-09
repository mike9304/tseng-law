import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildLegalServiceJsonLd, buildSeoMetadata } from '@/lib/seo';
import { LANDING_SLUG, landingContent } from './content';
import styles from './landing.module.css';

const SLUG_PATH = LANDING_SLUG;

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const c = landingContent[locale];

  return buildSeoMetadata({
    locale,
    title: c.metaTitle,
    description: c.description,
    path: `/${SLUG_PATH}`,
    keywords: c.keywords,
  });
}

export default function KoreanLawyerInTaiwanPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const c = landingContent[locale];
  const path = `/${locale}/${SLUG_PATH}`;

  const faqJsonLd = buildFaqJsonLd(c.faq, locale);
  const legalServiceJsonLd = buildLegalServiceJsonLd(locale, {
    description: c.description,
    path: SLUG_PATH,
    serviceType: locale === 'ko' ? '대만 변호사·회사설립·소송·투자 자문' : locale === 'zh-hant' ? '台灣律師·公司設立·訴訟·投資顧問' : 'Taiwan lawyer, company setup, litigation, investment advisory',
  });

  const homeLabel = locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home';
  const lawyersLabel = locale === 'ko' ? '변호사' : locale === 'zh-hant' ? '律師' : 'Lawyers';

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: homeLabel, path: `/${locale}` },
          { name: lawyersLabel, path: `/${locale}/lawyers` },
          { name: c.title, path },
        ])}
      />
      <JsonLd data={legalServiceJsonLd} />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}

      <section className={styles.page}>
        <div className={styles.hero}>
          <span className={styles.label}>{c.heroLabel}</span>
          <h1 className={styles.title}>{c.title}</h1>
        </div>

        <div className={styles.inner}>
          <article className={styles.body}>
            <section className={styles.section}>
              <ul className={styles.lead}>
                {c.lead.map((line, index) => (
                  <li className={styles.leadItem} key={index}>
                    {line}
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{c.servicesHeading}</h2>
              <ul className={styles.list}>
                {c.services.map((item, index) => (
                  <li className={styles.listItem} key={index}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{c.languagesHeading}</h2>
              <ul className={styles.list}>
                {c.languages.map((item, index) => (
                  <li className={styles.listItem} key={index}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{c.officeHeading}</h2>
              <div className={styles.office}>
                {c.office.lines.map((line, index) => (
                  <p className={styles.officeLine} key={index}>
                    {line}
                  </p>
                ))}
              </div>
            </section>

            <section className={styles.section} aria-label={c.faqHeading}>
              <h2 className={styles.heading}>{c.faqHeading}</h2>
              <dl className={styles.faqList}>
                {c.faq.map((item, index) => (
                  <div className={styles.faqItem} key={index}>
                    <dt className={styles.faqQuestion}>{item.q}</dt>
                    <dd className={styles.faqAnswer}>{item.a}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className={styles.cta}>
              <h2 className={styles.ctaTitle}>{c.ctaTitle}</h2>
              <p className={styles.ctaText}>{c.ctaText}</p>
              <Link href={`/${locale}/contact`} className={styles.ctaButton}>
                {c.ctaButton}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
