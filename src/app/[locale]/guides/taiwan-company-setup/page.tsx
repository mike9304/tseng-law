import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { normalizeSiteLocale, siteLocales, type SiteLocale } from '@/lib/locales';
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildHowToJsonLd, buildSeoMetadata } from '@/lib/seo';
import { GUIDE_SLUG, guideContent } from './content';
import styles from './guide.module.css';

const SLUG_PATH = GUIDE_SLUG;

export function generateMetadata({ params }: { params: { locale: SiteLocale } }): Metadata {
  const locale = normalizeSiteLocale(params.locale);
  const c = guideContent[locale];

  return buildSeoMetadata({
    locale,
    title: c.metaTitle,
    description: c.description,
    path: `/${SLUG_PATH}`,
    keywords: c.keywords,
    alternateLocales: siteLocales,
  });
}

export default function TaiwanCompanySetupGuidePage({ params }: { params: { locale: SiteLocale } }) {
  const locale = normalizeSiteLocale(params.locale);
  const c = guideContent[locale];
  const path = `/${locale}/${SLUG_PATH}`;

  const howToJsonLd = buildHowToJsonLd({
    name: c.title,
    description: c.description,
    steps: c.steps,
    totalTime: 'P4M',
    locale,
  });
  const faqJsonLd = buildFaqJsonLd(c.faq, locale);

  const homeLabel = locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : locale === 'ja' ? 'ホーム' : 'Home';
  const servicesLabel = locale === 'ko' ? '업무분야' : locale === 'zh-hant' ? '服務' : locale === 'ja' ? '取扱業務' : 'Services';
  const summaryHeading = locale === 'ko' ? '핵심 요약' : locale === 'zh-hant' ? '核心摘要' : locale === 'ja' ? '要点まとめ' : 'Key Summary';
  const disclaimerNote =
    locale === 'ko'
      ? '※ 본 페이지의 수치·요건은 당사 공개 칼럼에서 발췌한 일반 정보이며 사안별로 달라질 수 있습니다.'
      : locale === 'zh-hant'
        ? '※ 本頁數值與要件為本所公開專欄之一般資訊，個案可能不同。'
        : locale === 'ja'
          ? '※ 本ページの数値・要件は当事務所の公開コラムから抜粋した一般情報であり、案件によって異なる場合があります。'
          : 'Figures and requirements on this page are general information drawn from our public columns and may vary by case.';

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: homeLabel, path: `/${locale}` },
          { name: servicesLabel, path: `/${locale}/services` },
          { name: c.title, path },
        ])}
      />
      {howToJsonLd ? <JsonLd data={howToJsonLd} /> : null}
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}

      <section className={styles.page}>
        <div className={styles.hero}>
          <span className={styles.label}>{c.heroLabel}</span>
          <h1 className={styles.title}>{c.title}</h1>
          <p className={styles.lead}>{c.description}</p>
        </div>

        <div className={styles.inner}>
          <article className={styles.body}>
            <section className={styles.section}>
              <h2 className={styles.heading}>{summaryHeading}</h2>
              <ul className={styles.summary}>
                {c.summary.map((line, index) => (
                  <li className={styles.summaryItem} key={index}>
                    {line}
                  </li>
                ))}
              </ul>
              {/* Source refs: columns 001/013 — capital thresholds & timeline */}
              <p className={styles.intro} style={{ marginTop: '1rem' }}>{disclaimerNote}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{c.procedureHeading}</h2>
              <p className={styles.intro}>{c.procedureIntro}</p>
              {/* Source refs: columns 001 (10 steps), 013 (timeline), 005 (account conversion) */}
              <ol className={styles.steps}>
                {c.steps.map((step, index) => (
                  <li className={styles.step} key={index}>
                    <h3 className={styles.stepName}>{step.name}</h3>
                    <p className={styles.stepText}>{step.text}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{c.comparisonHeading}</h2>
              <p className={styles.intro}>{c.comparisonIntro}</p>
              {/* Source refs: columns 001, 004 — tax rate comparison */}
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {c.comparisonColumns.map((col, index) => (
                        <th key={index}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.comparisonRows.map((row, index) => (
                      <tr key={index}>
                        <td>{row.form}</td>
                        {row.values.map((value, vIndex) => (
                          <td key={vIndex}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{c.costHeading}</h2>
              <p className={styles.intro}>{c.costIntro}</p>
              {/* Source refs: columns 001, 004, 013 — cost/timeline/DTA notes */}
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {c.costColumns.map((col, index) => (
                        <th key={index}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.costRows.map((row, index) => (
                      <tr key={index}>
                        <td>{row.item}</td>
                        {row.values.map((value, vIndex) => (
                          <td key={vIndex}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
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

            <section className={styles.section}>
              <h2 className={styles.heading}>{c.relatedHeading}</h2>
              <ul className={styles.relatedList}>
                {c.relatedColumns.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/${locale}/columns/${item.slug}`} className={styles.relatedLink}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{c.relatedResourcesHeading}</h2>
              <ul className={styles.relatedList}>
                {c.relatedResources.map((item) => (
                  <li key={item.href}>
                    <Link href={`/${locale}/${item.href}`} className={styles.relatedLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
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
