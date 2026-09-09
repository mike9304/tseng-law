import Link from 'next/link';
import FAQAccordion from '@/components/FAQAccordion';
import InternationalInquiryForm, {
  InternationalInquiryNotice,
} from '@/components/InternationalInquiryForm';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import SectionLabel from '@/components/SectionLabel';
import {
  guidanceContent,
  type GuidanceLocale,
  type GuidancePageKey,
} from '@/data/international-guidance-content';
import { guidanceAnswers } from '@/data/international-guidance-answers';
import { CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';
import {
  EXISTING_SITE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
  PUBLIC_LANGUAGE_AUTONYMS,
  guidanceCanonicalUrl,
  guidancePublicPath,
  publicDocumentLanguage,
} from '@/lib/public-guidance';
import {
  buildGuidanceFaqJsonLd,
  buildGuidanceLegalServiceJsonLd,
  getSiteUrl,
} from '@/lib/seo';

/**
 * Guidance pages rendered with the same layout primitives the other four
 * languages use (`PageHeader` + `.section` / `.container` / `.grid-bento` card
 * grid + `FAQAccordion` + the home CTA band), so vi/id/th/fil share the site
 * design instead of a bare article stack.
 *
 * Every sentence still comes from `international-guidance-content.ts` and
 * `international-inquiry-copy.ts`; nothing is translated or invented here.
 */
export default function GuidancePageBody({
  locale,
  pageKey,
}: {
  locale: GuidanceLocale;
  pageKey: GuidancePageKey;
}) {
  const pack = guidanceContent[locale];
  const page = pack.pages[pageKey];
  const isContact = pageKey === 'contact';
  // Answer-first block: only the page keys present in `guidanceAnswers` get one
  // (services, about, lawyers, pricing, contact, faq). home, privacy,
  // disclaimer and columns render nothing extra.
  const answer = guidanceAnswers[locale][pageKey];
  // Structured data. `inLanguage` is the page language; the consultation
  // languages inside the LegalService node stay en/zh-Hant/ja/ko. The localized
  // 404 body (`GuidanceNotFoundBody`) deliberately emits none.
  const documentLanguage = publicDocumentLanguage(locale);
  const legalServiceJsonLd = buildGuidanceLegalServiceJsonLd({
    inLanguage: documentLanguage,
    url: guidanceCanonicalUrl(locale, pageKey, getSiteUrl()),
    description: page.description,
  });
  // FAQPage carries the visible questions and answers verbatim. `FAQAccordion`
  // below renders the same items, so the JSON-LD adds no duplicate copy.
  const faqJsonLd = page.faqs?.length
    ? buildGuidanceFaqJsonLd(page.faqs, documentLanguage)
    : null;

  return (
    <div data-guidance-shell="true" data-locale={locale} data-guidance-page={pageKey}>
      <JsonLd data={legalServiceJsonLd} />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}

      {/* One outer <article> keeps the page's guidance copy in a single
          document node, matching the previous guidance contract. */}
      <article data-guidance-article="true">
        <PageHeader
          locale={locale}
          label={page.eyebrow}
          title={page.title}
          description={page.description}
        />

        {answer ? (
          <Reveal>
            <section className="section section--light" aria-label="summary">
              <div className="container">
                <div className="guidance-answer">
                  <p className="section-lede">{answer.answer}</p>
                  {answer.sources.length > 0 ? (
                    <ul className="contact-list">
                      {answer.sources.map((href) => {
                        const sourceKey = GUIDANCE_PAGE_KEYS.find(
                          (key) => guidancePublicPath(locale, key) === href,
                        );
                        return (
                          <li key={href}>
                            <Link href={href}>{sourceKey ? pack.nav[sourceKey] : href}</Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              </div>
            </section>
          </Reveal>
        ) : null}

        <Reveal>
          <section className="section section--light">
            <div className="container">
              <p className="section-lede">{page.intro}</p>
              <div className="grid-bento contact-grid reveal-stagger">
                {page.sections.map((section) => (
                  <div key={section.heading} className="card legal-card">
                    <h2 className="card-title">{section.heading}</h2>
                    <div className="legal-card-copy">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                      ))}
                    </div>
                    {section.items && section.items.length > 0 ? (
                      <ul className="contact-list legal-card-list">
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {page.faqs && page.faqs.length > 0 ? (
          <Reveal>
            <FAQAccordion
              locale={locale}
              items={[...page.faqs]}
              id="faq"
              sectionClassName="section section--gray"
              headingLabel="FAQ"
              headingTitle={pack.nav.faq}
            />
          </Reveal>
        ) : null}

        {pageKey === 'columns' ? (
          <Reveal>
            <section
              className="section section--light"
              aria-label={pack.readSourceLabel}
              data-columns-original-language="true"
            >
              <div className="container">
                <SectionLabel>{pack.nav.columns}</SectionLabel>
                <h2 className="section-title">{pack.readSourceLabel}</h2>
                <div className="grid-bento contact-grid reveal-stagger">
                  {EXISTING_SITE_LOCALES_4.map((sourceLocale) => (
                    <div key={sourceLocale} className="card legal-card">
                      <h3 className="card-title">{PUBLIC_LANGUAGE_AUTONYMS[sourceLocale]}</h3>
                      <div className="legal-card-copy">
                        <Link href={`/${sourceLocale}/columns`}>
                          {PUBLIC_LANGUAGE_AUTONYMS[sourceLocale]}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>
        ) : null}
      </article>

      {isContact ? (
        <Reveal>
          <section className="section section--light" id="international-inquiry">
            <div className="container">
              <InternationalInquiryForm locale={locale} />
            </div>
          </section>
        </Reveal>
      ) : null}

      <GuidanceContactBand locale={locale} isContact={isContact} />
    </div>
  );
}

/**
 * Closing contact band shared by every guidance page, including the home page.
 * Extracted verbatim so the home body can reuse it without duplicating the
 * four-consultation-languages notice.
 */
export function GuidanceContactBand({
  locale,
  isContact,
}: {
  locale: GuidanceLocale;
  isContact: boolean;
}) {
  const pack = guidanceContent[locale];
  return (
    <Reveal>
      <section className="section section--dark home-contact-cta" id="contact" data-tone="dark">
        <div className="container">
          <div className="section-label">{pack.nav.contact}</div>
          <h2 className="section-title">{pack.contactCta}</h2>
          <div className="section-lede">
            <InternationalInquiryNotice locale={locale} showContactLink={!isContact} />
          </div>
          <div className="home-contact-actions">
            {isContact ? (
              <a className="button ghost" href={`mailto:${CONSULTATION_EMAIL}`}>
                {CONSULTATION_EMAIL}
              </a>
            ) : (
              <Link className="button ghost" href={guidancePublicPath(locale, 'contact')}>
                {pack.contactCta}
              </Link>
            )}
            <a className="button secondary" href={`mailto:${CONSULTATION_EMAIL}`}>
              {CONSULTATION_EMAIL}
            </a>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

/** Localized 404 body for guidance locales, kept inside the site chrome. */
export function GuidanceNotFoundBody({ locale }: { locale: GuidanceLocale }) {
  const pack = guidanceContent[locale];
  return (
    <div data-guidance-shell="true" data-locale={locale} data-guidance-page="not-found">
      <article data-guidance-article="true">
        <PageHeader
          locale={locale}
          label={pack.languageName}
          title={pack.notFoundTitle}
          description={pack.notFoundText}
        />
      </article>
      <Reveal>
        <section className="section section--dark home-contact-cta" id="contact" data-tone="dark">
          <div className="container">
            <div className="section-lede">
              <InternationalInquiryNotice locale={locale} showContactLink />
            </div>
            <div className="home-contact-actions">
              <Link className="button ghost" href={guidancePublicPath(locale, 'home')}>
                {pack.backHomeLabel}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
