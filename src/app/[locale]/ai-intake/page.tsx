import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { normalizeSiteLocale, siteLocales, type SiteLocale } from '@/lib/locales';
import { buildAbsoluteUrl, buildBreadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo';
import { AI_INTAKE_PAGE_SLUG, aiIntakePageContent } from './content';
import styles from './ai-intake.module.css';

const SLUG_PATH = AI_INTAKE_PAGE_SLUG;

export async function generateMetadata(props: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  const content = aiIntakePageContent[locale];

  return buildSeoMetadata({
    locale,
    title: content.metaTitle,
    description: content.description,
    path: `/${SLUG_PATH}`,
    keywords: content.keywords,
    alternateLocales: siteLocales,
  });
}

export default async function AiIntakeHelpPage(props: { params: Promise<{ locale: SiteLocale }> }) {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  const content = aiIntakePageContent[locale];
  const path = `/${locale}/${SLUG_PATH}`;
  const homeLabel = locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : locale === 'ja' ? 'ホーム' : 'Home';
  const openapiHref = buildAbsoluteUrl('/api/ai/openapi.json');

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: homeLabel, path: `/${locale}` },
          { name: content.title, path },
        ])}
      />
      <section className={styles.page}>
        <header className={styles.hero}>
          <p className={styles.label}>{content.heroLabel}</p>
          <h1 className={styles.title}>{content.title}</h1>
        </header>

        <div className={styles.inner}>
          <article className={styles.body}>
            <section className={styles.section}>
              <ul className={styles.lead}>
                {content.lead.map((line) => (
                  <li className={styles.leadItem} key={line}>
                    {line}
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{content.questionsHeading}</h2>
              <ul className={styles.list}>
                {content.questions.map((item) => (
                  <li className={styles.listItem} key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{content.prohibitedHeading}</h2>
              <ul className={styles.list}>
                {content.prohibited.map((item) => (
                  <li className={styles.listItem} key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{content.sequenceHeading}</h2>
              <ol className={styles.ordered}>
                {content.sequence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{content.deliveryHeading}</h2>
              <ul className={styles.list}>
                {content.delivery.map((item) => (
                  <li className={styles.listItem} key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{content.limitsHeading}</h2>
              <ul className={styles.list}>
                {content.limits.map((item) => (
                  <li className={styles.listItem} key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{content.emergencyHeading}</h2>
              <p className={styles.paragraph}>{content.emergency}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{content.statusHeading}</h2>
              <div className={styles.status}>
                <ul className={styles.list}>
                  {content.status.map((item) => (
                    <li className={styles.listItem} key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>{content.mcpHeading}</h2>
              <ul className={styles.list}>
                {content.mcp.map((item) => (
                  <li className={styles.listItem} key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <nav className={styles.section} aria-label={content.linksHeading}>
              <h2 className={styles.heading}>{content.linksHeading}</h2>
              <ul className={styles.links}>
                <li>
                  <Link className={styles.link} href={`/${locale}/privacy`}>
                    {content.privacyLabel}
                  </Link>
                </li>
                <li>
                  <a className={styles.link} href={openapiHref}>
                    {content.openapiLabel}
                  </a>
                </li>
                <li>
                  <Link className={styles.link} href={`/${locale}/contact`}>
                    {content.contactLabel}
                  </Link>
                </li>
              </ul>
            </nav>
          </article>
        </div>
      </section>
    </>
  );
}
