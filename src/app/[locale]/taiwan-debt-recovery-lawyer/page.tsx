import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import { isSiteLocale, type SiteLocale } from '@/lib/locales';
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildSeoMetadata } from '@/lib/seo';
import { DEBT_RECOVERY_SLUG, debtRecoveryByLocale } from './content';
import styles from '../guides/taiwan-company-setup/guide.module.css';

const SLUG_PATH = DEBT_RECOVERY_SLUG;

const HOME_LABEL: Record<SiteLocale, string> = {
  en: 'Home',
  ja: 'ホーム',
  ko: '홈',
  'zh-hant': '首頁',
};

const LITIGATION_LABEL: Record<SiteLocale, string> = {
  en: 'Taiwan litigation',
  ja: '台湾訴訟',
  ko: '대만 소송',
  'zh-hant': '台灣訴訟',
};

export async function generateMetadata(props: {
  params: Promise<{ locale: SiteLocale }>;
}): Promise<Metadata> {
  const params = await props.params;
  if (!isSiteLocale(params.locale)) {
    return { robots: { index: false, follow: false } };
  }
  const locale = params.locale;
  const c = debtRecoveryByLocale[locale];
  return buildSeoMetadata({
    locale,
    title: c.metaTitle,
    description: c.description,
    path: `/${SLUG_PATH}`,
    keywords: [...c.keywords],
    noindex: true,
    alternateLocales: [],
  });
}

export default async function TaiwanDebtRecoveryLawyerPage(props: {
  params: Promise<{ locale: SiteLocale }>;
}) {
  const params = await props.params;
  if (!isSiteLocale(params.locale)) {
    notFound();
  }
  const locale = params.locale;
  const c = debtRecoveryByLocale[locale];
  const path = `/${locale}/${SLUG_PATH}`;
  const faqJsonLd = buildFaqJsonLd([...c.faq], locale);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: HOME_LABEL[locale], path: `/${locale}` },
          { name: LITIGATION_LABEL[locale], path: `/${locale}/taiwan-litigation-lawyer` },
          { name: c.title, path },
        ])}
      />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}

      <section className={styles.page}>
        <div className={styles.hero}>
          <span className={styles.label}>{c.heroLabel}</span>
          <h1 className={styles.title}>{c.title}</h1>
          <p className={styles.lead}>{c.lead}</p>
          <p className={styles.intro}>{c.reviewNote}</p>
        </div>

        <div className={styles.inner}>
          <article className={styles.body}>
            <section className={styles.section}>
              <h2 className={styles.heading}>{c.situationsHeading}</h2>
              {c.situations.map((situation) => (
                <section className={styles.section} key={situation.id} id={situation.id}>
                  <h3 className={styles.heading}>{situation.heading}</h3>
                  <p className={styles.intro}>{situation.problem}</p>
                  <p className={styles.intro}>{c.documentsListLabel}</p>
                  <ul className={styles.summary}>
                    {situation.documents.map((item) => (
                      <li className={styles.summaryItem} key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className={styles.intro}>{c.questionsListLabel}</p>
                  <ul className={styles.summary}>
                    {situation.questions.map((item) => (
                      <li className={styles.summaryItem} key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{c.documentsHeading}</h2>
              <p className={styles.intro}>{c.documentsIntro}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{c.processHeading}</h2>
              <p className={styles.intro}>{c.processIntro}</p>
              <ul className={styles.summary}>
                {c.processPoints.map((item) => (
                  <li className={styles.summaryItem} key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{c.overseasHeading}</h2>
              <p className={styles.intro}>{c.overseasIntro}</p>
              <p className={styles.intro}>{c.languageNote}</p>
            </section>

            <section className={styles.section} aria-label={c.faqHeading}>
              <h2 className={styles.heading}>{c.faqHeading}</h2>
              <dl className={styles.faqList}>
                {c.faq.map((item) => (
                  <div className={styles.faqItem} key={item.q}>
                    <dt className={styles.faqQuestion}>{item.q}</dt>
                    <dd className={styles.faqAnswer}>{item.a}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className={styles.cta}>
              <h2 className={styles.ctaTitle}>{c.ctaTitle}</h2>
              <p className={styles.ctaText}>{c.ctaText}</p>
              <a
                href={getConsultationPublicMailto(locale)}
                className={styles.ctaButton}
                aria-label={`${c.ctaButton}: ${CONSULTATION_EMAIL}`}
              >
                {c.ctaButton}
              </a>
              <p className={styles.intro}>
                <Link href={`/${locale}/services/civil`} className={styles.relatedLink}>
                  {c.civilLinkLabel}
                </Link>
                {' · '}
                <Link href={`/${locale}/taiwan-litigation-lawyer`} className={styles.relatedLink}>
                  {c.litigationLinkLabel}
                </Link>
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
