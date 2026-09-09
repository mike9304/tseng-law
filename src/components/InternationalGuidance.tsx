import Image from 'next/image';
import Link from 'next/link';
import InternationalInquiryForm, {
  InternationalInquiryNotice,
} from '@/components/InternationalInquiryForm';
import LocaleFlagSwitcher from '@/components/LocaleFlagSwitcher';
import {
  guidanceContent,
  type GuidanceLocale,
  type GuidancePageKey,
} from '@/data/international-guidance-content';
import { CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';
import {
  EXISTING_SITE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
  PUBLIC_LANGUAGE_AUTONYMS,
  guidancePublicPath,
} from '@/lib/public-guidance';
import styles from './InternationalGuidance.module.css';

type InternationalGuidanceProps = {
  locale: GuidanceLocale;
  pageKey?: GuidancePageKey;
  unavailable?: boolean;
};

export default function InternationalGuidance({
  locale,
  pageKey,
  unavailable = false,
}: InternationalGuidanceProps) {
  const pack = guidanceContent[locale];
  const isNotFound = unavailable || !pageKey;
  const page = pageKey ? pack.pages[pageKey] : null;
  const showForm = pageKey === 'contact' && !isNotFound;

  return (
    <div className={styles.shell} data-locale={locale} data-guidance-shell="true">
      <a className="skip-link" href="#main">
        {pack.skipLink}
      </a>
      <div className={styles.inner}>
        <header className={styles.header}>
          <Link className={styles.brand} href={guidancePublicPath(locale, 'home')}>
            <Image
              src="/images/brand/hovering-seal-official.png"
              alt=""
              width={40}
              height={40}
            />
            <span className={styles.brandText}>
              <span className={styles.firmName}>Hovering International Law Firm</span>
              <span className={styles.languageName}>{pack.languageName}</span>
            </span>
          </Link>
          <div className={styles.languageBlock} aria-label={pack.languageLabel}>
            <LocaleFlagSwitcher
              locale={locale}
              className={`public-language-switcher ${styles.languageSwitcher}`}
            />
          </div>
          <nav className={styles.nav} aria-label={pack.menuLabel}>
            <ul className={styles.navList}>
              {GUIDANCE_PAGE_KEYS.map((key) => {
                const href = guidancePublicPath(locale, key);
                const current = key === (pageKey ?? 'home') && !isNotFound;
                return (
                  <li key={key}>
                    <Link href={href} aria-current={current ? 'page' : undefined}>
                      {pack.nav[key]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>

        <main id="main" className={styles.main}>
          {isNotFound || !page ? (
            <section className={styles.hero} aria-labelledby="guidance-not-found-title">
              <h1 id="guidance-not-found-title" className={styles.notFoundTitle}>
                {pack.notFoundTitle}
              </h1>
              <p className={styles.notFoundText}>{pack.notFoundText}</p>
              <div className={styles.cta}>
                <Link className={`button ${styles.ctaLink}`} href={guidancePublicPath(locale, 'home')}>
                  {pack.backHomeLabel}
                </Link>
              </div>
              <div className={styles.noticeBlock}>
                <InternationalInquiryNotice locale={locale} showContactLink />
              </div>
            </section>
          ) : (
            <>
              <article className={styles.hero} aria-labelledby="guidance-title">
                <p className={styles.eyebrow}>{page.eyebrow}</p>
                <h1 id="guidance-title" className={styles.title}>
                  {page.title}
                </h1>
                <p className={styles.description}>{page.description}</p>
                <p className={styles.intro}>{page.intro}</p>

                {page.sections.map((section) => (
                  <section key={section.heading} className={styles.section}>
                    <h2 className={styles.sectionHeading}>{section.heading}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)} className={styles.paragraph}>
                        {paragraph}
                      </p>
                    ))}
                    {section.items && section.items.length > 0 ? (
                      <ul className={styles.items}>
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))}

                {page.faqs && page.faqs.length > 0 ? (
                  <section className={styles.section} aria-label={pack.nav.faq}>
                    {page.faqs.map((faq) => (
                      <div key={faq.question} className={styles.faqItem}>
                        <h2 className={styles.faqQuestion}>{faq.question}</h2>
                        <p className={styles.faqAnswer}>{faq.answer}</p>
                      </div>
                    ))}
                  </section>
                ) : null}

                {pageKey === 'columns' ? (
                  <section className={styles.section} aria-label={pack.readSourceLabel}>
                    <h2 className={styles.sectionHeading}>{pack.readSourceLabel}</h2>
                    <ul className={styles.sourceList}>
                      {EXISTING_SITE_LOCALES_4.map((sourceLocale) => {
                        const languageName = PUBLIC_LANGUAGE_AUTONYMS[sourceLocale];
                        return (
                          <li key={sourceLocale} className={styles.sourceItem}>
                            <Link className={styles.sourceLink} href={`/${sourceLocale}/columns`}>
                              {languageName}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ) : null}
              </article>

              <div className={styles.noticeBlock}>
                <InternationalInquiryNotice
                  locale={locale}
                  showContactLink={pageKey !== 'contact'}
                />
              </div>

              <div className={styles.cta}>
                {pageKey === 'contact' ? (
                  <a
                    className={`button ${styles.ctaLink}`}
                    href={`mailto:${CONSULTATION_EMAIL}`}
                  >
                    {CONSULTATION_EMAIL}
                  </a>
                ) : (
                  <Link className={`button ${styles.ctaLink}`} href={guidancePublicPath(locale, 'contact')}>
                    {pack.contactCta}
                  </Link>
                )}
              </div>

              {showForm ? (
                <div className={styles.formBlock}>
                  <InternationalInquiryForm locale={locale} />
                </div>
              ) : null}
            </>
          )}
        </main>

        <footer className={styles.footer}>
          <p className={styles.footerNotice}>{pack.footerNotice}</p>
        </footer>
      </div>
    </div>
  );
}
