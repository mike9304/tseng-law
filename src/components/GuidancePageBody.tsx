import Link from 'next/link';
import FAQAccordion from '@/components/FAQAccordion';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import { GuidanceServices } from '@/components/GuidanceHomeBody';
import GuidanceAttorneyFacts from '@/components/GuidanceAttorneyFacts';
import GuidanceTeamRoster from '@/components/GuidanceTeamRoster';
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
} from '@/data/international-guidance-content';
import {
  GUIDANCE_EXTRA_ENGLISH_LANDING_PATHS,
  getGuidancePage,
  guidanceExtraEnglishLandingLabel,
  guidanceExtraLinkLabels,
  guidanceExtraRelated,
  guidanceExtraRelatedLabel,
} from '@/data/international-guidance-extra';
import { guidanceAnswers } from '@/data/international-guidance-answers';
import { CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';
import {
  EXISTING_SITE_LOCALES_4,
  GUIDANCE_ALL_PAGE_KEYS,
  PUBLIC_LANGUAGE_AUTONYMS,
  guidanceCanonicalUrl,
  guidancePublicPath,
  isGuidanceExtraPageKey,
  publicDocumentLanguage,
  type GuidancePageKey,
} from '@/lib/public-guidance';
import {
  buildBreadcrumbJsonLd,
  buildGuidanceFaqJsonLd,
  buildGuidanceLegalServiceJsonLd,
  getSiteUrl,
} from '@/lib/seo';
import {
  buildGuidancePersonJsonLd,
  buildGuidanceTeamCollectionPageJsonLd,
} from '@/lib/guidance-structured-data';

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
  // Core page bodies live in the translation-lane content module; page keys
  // added after the original ten live in `international-guidance-extra.ts`.
  const page = getGuidancePage(locale, pageKey);
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
    contactUrl: guidanceCanonicalUrl(locale, 'contact', getSiteUrl()),
  });
  // WO-O28. `/en` emits a two-step breadcrumb on its inner pages; the guidance
  // pages emitted none. Names and paths are this locale's own.
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(locale, [
    { name: pack.nav.home, path: guidancePublicPath(locale, 'home') },
    { name: page.title, path: guidancePublicPath(locale, pageKey) },
  ]);
  // Roster pages only, matching `/en/lawyers`: the attorney Person entity and
  // the CollectionPage/ItemList over the team cards rendered further down.
  const isRosterPage = pageKey === 'lawyers' || pageKey === 'about';
  const personJsonLd = isRosterPage ? buildGuidancePersonJsonLd(locale) : null;
  const teamCollectionJsonLd = isRosterPage
    ? buildGuidanceTeamCollectionPageJsonLd({
        locale,
        pageKey,
        name: page.title,
        description: page.description,
      })
    : null;
  // FAQPage carries the visible questions and answers verbatim. `FAQAccordion`
  // below renders the same items, so the JSON-LD adds no duplicate copy.
  const faqJsonLd = page.faqs?.length
    ? buildGuidanceFaqJsonLd(page.faqs, documentLanguage)
    : null;

  return (
    <div data-guidance-shell="true" data-locale={locale} data-guidance-page={pageKey}>
      <JsonLd data={legalServiceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {personJsonLd ? <JsonLd data={personJsonLd} /> : null}
      {teamCollectionJsonLd ? <JsonLd data={teamCollectionJsonLd} /> : null}
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
            <section
              className="section section--light"
              aria-label="summary"
              data-page-block="answer-summary"
            >
              <div className="container">
                <div className="guidance-answer">
                  <p className="section-lede">{answer.answer}</p>
                  {answer.sources.length > 0 ? (
                    <ul className="contact-list">
                      {answer.sources.map((href) => {
                        const sourceKey = GUIDANCE_ALL_PAGE_KEYS.find(
                          (key) => guidancePublicPath(locale, key) === href,
                        );
                        return (
                          <li key={href}>
                            <Link href={href}>
                              {sourceKey ? guidanceLinkLabel(locale, sourceKey) : href}
                            </Link>
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

        {/* The English services page renders six practice-area cards with
            icons; the guidance services page showed only the plain text card
            grid. Same cards, same copy — the titles and summaries are already
            derived from this locale's own services sections. */}
        {pageKey === 'services' ? (
          <Reveal>
            <GuidanceServices locale={locale} showHeader={false} />
          </Reveal>
        ) : null}

        {/* WO-O33: `lawyers` publishes no cards any more, so the card grid and
            the lede that introduces it are skipped rather than rendered empty. */}
        {page.sections.length > 0 ? (
          <Reveal>
            <section className="section section--light" data-page-block="page-sections">
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
        ) : null}

        {/* Team roster. The English `lawyers` and `about` pages both render
            `AttorneyProfileSection`; before this the guidance locales showed no
            portrait on either page. WO-O33: on `lawyers` the roster is now the
            first section under the header, exactly as on `/en/lawyers`, and it
            drops its own eyebrow/heading/lede there for the same reason `/en`
            passes `showIntro={false}` — the page header already names the team. */}
        {isRosterPage ? (
          <Reveal>
            <GuidanceTeamRoster locale={locale} showIntro={pageKey !== 'lawyers'} />
          </Reveal>
        ) : null}

        {/* Key facts, the localized `AttorneyFactSummary`. `/en/lawyers` closes
            with it and the guidance pages had no equivalent; the three prose
            cards that used to stand in for it are gone. `/en/about` does not
            render it, so neither does this one. */}
        {pageKey === 'lawyers' ? (
          <Reveal>
            <GuidanceAttorneyFacts locale={locale} />
          </Reveal>
        ) : null}

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

        {/* Internal route to the practice-specific guidance pages, which the
            header nav cannot carry: its labels belong to the translation-lane
            module and stay at ten keys. On those pages themselves the block
            points back at the core pages and at the English landing. */}
        <GuidanceRelatedGuides locale={locale} pageKey={pageKey} />

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

      {/* WO-O29 A: the same `OfficeMapTabs` the English contact page renders,
          so the office section is structurally identical in all eight
          languages instead of a flat band with different element counts. */}
      {isContact ? <OfficeMapTabs locale={locale} /> : null}

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

/** Link label for any guidance page key, in the page's own language. */
function guidanceLinkLabel(locale: GuidanceLocale, pageKey: GuidancePageKey): string {
  return isGuidanceExtraPageKey(pageKey)
    ? guidanceExtraLinkLabels[locale][pageKey]
    : guidanceContent[locale].nav[pageKey];
}

/**
 * Related-guidance links.
 *
 * The header nav is the translation lane's ten keys, so the guidance pages
 * added afterwards would otherwise have no internal link at all. On the core
 * pages listed in `guidanceExtraRelated` this renders the route into them; on
 * those pages themselves it renders the route back out — the core pages a
 * reader needs next, plus the English landing, which is where the consultation
 * itself happens. Pages with neither relationship render nothing.
 *
 * Exported so the guidance home, which is served by `GuidanceHomeBody`, can
 * carry the same block without that component having to know about page keys.
 */
export function GuidanceRelatedGuides({
  locale,
  pageKey,
}: {
  locale: GuidanceLocale;
  pageKey: GuidancePageKey;
}) {
  const pack = guidanceContent[locale];
  const heading = guidanceExtraRelatedLabel[locale];

  const links = isGuidanceExtraPageKey(pageKey)
    ? [
        ...(['services', 'pricing', 'contact'] as const).map((key) => ({
          href: guidancePublicPath(locale, key),
          label: pack.nav[key],
        })),
        {
          href: GUIDANCE_EXTRA_ENGLISH_LANDING_PATHS[pageKey],
          label: guidanceExtraEnglishLandingLabel[locale],
        },
      ]
    : (guidanceExtraRelated[pageKey] ?? []).map((key) => ({
        href: guidancePublicPath(locale, key),
        label: guidanceExtraLinkLabels[locale][key],
      }));

  if (links.length === 0) return null;

  return (
    <Reveal>
      <section className="section section--light" data-page-block="related-guides">
        <div className="container">
          <SectionLabel>{heading}</SectionLabel>
          <nav aria-label={heading}>
            <ul className="contact-list">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </Reveal>
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
      <section
        className="section section--dark home-contact-cta"
        id="contact"
        data-tone="dark"
        data-page-block="contact-band"
      >
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
        <section
        className="section section--dark home-contact-cta"
        id="contact"
        data-tone="dark"
        data-page-block="contact-band"
      >
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
