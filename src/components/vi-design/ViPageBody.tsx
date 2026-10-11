import Link from 'next/link';
import FAQAccordion from '@/components/FAQAccordion';
import GuidanceAttorneyFacts from '@/components/GuidanceAttorneyFacts';
import GuidanceTeamRoster from '@/components/GuidanceTeamRoster';
import InternationalInquiryForm from '@/components/InternationalInquiryForm';
import JsonLd from '@/components/JsonLd';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import ZhHantMonoIcon from '@/components/zh-hant-icons/ZhHantMonoIcon';
import { guidanceContent, type GuidancePageKey } from '@/data/international-guidance-content';
import { viServicePresentation, viSiteCopy } from '@/data/vi-site';
import { CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';
import { buildGuidancePersonJsonLd, buildGuidanceTeamCollectionPageJsonLd } from '@/lib/guidance-structured-data';
import { guidanceCanonicalUrl } from '@/lib/public-guidance';
import { buildBreadcrumbJsonLd, buildGuidanceFaqJsonLd, buildGuidanceLegalServiceJsonLd, getSiteUrl } from '@/lib/seo';
import { ViContactBand, ViContainer, ViPageHeader, ViTeamPreview, ViTextSections } from './ViShared';
import styles from './ViSite.module.css';

export type ViPageKey = Exclude<GuidancePageKey, 'home'>;

function ServicesBody() {
  const page = guidanceContent.vi.pages.services;
  return (
    <ViContainer>
      <nav className={styles.serviceNav} aria-label={viSiteCopy.navigation.serviceContents}>
        {viServicePresentation.map((service) => <a key={service.id} href={`#${service.id}`}>{service.title}</a>)}
      </nav>
      <div className={styles.serviceDetails}>
        {viServicePresentation.map((service) => {
          const section = page.sections[service.sectionIndex];
          if (!section) return null;
          return (
            <section className={styles.serviceDetail} id={service.id} key={service.id}>
              <div className={styles.serviceDetailHeading}><ZhHantMonoIcon name={service.icon} size={36} /><h2>{section.heading}</h2></div>
              <div className={styles.prose}>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.items?.length ? <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}
                {service.id === 'criminal' ? <Link className={styles.textLink} href="/vi/criminal-litigation">{viSiteCopy.services.criminalAction}<ZhHantMonoIcon name="chevron-right" size={16} /></Link> : null}
              </div>
            </section>
          );
        })}
      </div>
      <div className={styles.scopeNote}><ViTextSections sections={page.sections.slice(6)} prefix="scope" /></div>
    </ViContainer>
  );
}

function ContactBody() {
  const page = guidanceContent.vi.pages.contact;
  const preparation = page.sections[2];
  const receipt = page.sections[3];
  return (
    <>
      <ViContainer>
        <div className={styles.contactLayout}>
          <aside className={styles.contactAside}>
            <div className={styles.contactEmail}>
              <h2>{viSiteCopy.contact.emailLabel}</h2>
              <a href={`mailto:${CONSULTATION_EMAIL}`}>{CONSULTATION_EMAIL}</a>
            </div>
            {preparation ? <div className={styles.contactPreparation}><h2>{viSiteCopy.contact.preparationTitle}</h2>{preparation.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div> : null}
            <div className={styles.contactAsideLinks}>
              <Link className={styles.textLink} href="/vi/pricing">{guidanceContent.vi.nav.pricing}<ZhHantMonoIcon name="chevron-right" size={16} /></Link>
              <a className={styles.textLink} href="#offices">{viSiteCopy.contact.officeAction}<ZhHantMonoIcon name="chevron-right" size={16} /></a>
            </div>
          </aside>
          <section id="international-inquiry" className={styles.inquiryPanel} aria-label={viSiteCopy.contact.formAction}>
            <InternationalInquiryForm locale="vi" />
            {receipt ? <details className={styles.receiptNotice}><summary>{viSiteCopy.contact.receiptTitle}</summary>{receipt.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</details> : null}
          </section>
        </div>
      </ViContainer>
      <div className={styles.officeSection}><OfficeMapTabs locale="vi" sectionClassName={styles.section} presentation="editorial" /></div>
    </>
  );
}

function ProseBody({ pageKey }: { pageKey: Exclude<ViPageKey, 'services' | 'contact' | 'faq' | 'lawyers'> }) {
  const page = guidanceContent.vi.pages[pageKey];
  return (
    <ViContainer>
      <div className={styles.documentLayout}>
        <nav className={styles.contentsNav} aria-label={viSiteCopy.navigation.pageContents}>
          {page.sections.map((section, index) => <a key={section.heading} href={`#${pageKey}-${index + 1}`}>{section.heading}</a>)}
        </nav>
        <div className={styles.documentBody}>
          {page.intro ? <p className={styles.documentIntro}>{page.intro}</p> : null}
          <ViTextSections sections={page.sections} prefix={pageKey} />
        </div>
      </div>
    </ViContainer>
  );
}

export default function ViPageBody({ pageKey }: { pageKey: ViPageKey }) {
  const pack = guidanceContent.vi;
  const page = pack.pages[pageKey];
  const hasPerson = pageKey === 'lawyers' || pageKey === 'about';
  const person = hasPerson ? buildGuidancePersonJsonLd('vi') : null;
  const collection = pageKey === 'lawyers' ? buildGuidanceTeamCollectionPageJsonLd({ locale: 'vi', pageKey, name: page.title, description: page.description }) : null;
  const faqs = pageKey === 'faq' ? page.faqs ?? [] : [];
  const faqJsonLd = buildGuidanceFaqJsonLd(faqs, 'vi');
  const isProse = pageKey === 'about' || pageKey === 'pricing' || pageKey === 'privacy' || pageKey === 'disclaimer' || pageKey === 'columns';
  return (
    <div className={styles.site} id={`vi-${pageKey}`} data-vi-design={pageKey} data-vi-page={pageKey} lang="vi">
      <JsonLd data={buildGuidanceLegalServiceJsonLd({ inLanguage: 'vi', url: guidanceCanonicalUrl('vi', pageKey, getSiteUrl()), description: page.description, contactUrl: guidanceCanonicalUrl('vi', 'contact', getSiteUrl()) })} />
      <JsonLd data={buildBreadcrumbJsonLd('vi', [{ name: pack.nav.home, path: '/vi' }, { name: page.title, path: `/vi/${pageKey}` }])} />
      {person ? <JsonLd data={person} /> : null}
      {collection ? <JsonLd data={collection} /> : null}
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <ViPageHeader title={page.title} description={page.description}>
        {pageKey === 'contact' ? <div className={styles.actions}><a className={styles.primaryButton} href="#international-inquiry">{viSiteCopy.contact.formAction}</a><a className={styles.textLink} href={`mailto:${CONSULTATION_EMAIL}`}>{CONSULTATION_EMAIL}</a></div> : null}
      </ViPageHeader>
      {pageKey === 'services' ? <ServicesBody /> : null}
      {pageKey === 'lawyers' ? <div className={styles.teamPage}><GuidanceTeamRoster locale="vi" showIntro={false} /><GuidanceAttorneyFacts locale="vi" /></div> : null}
      {pageKey === 'contact' ? <ContactBody /> : null}
      {pageKey === 'faq' ? <div className={`${styles.faqRegion} ${styles.fullFaq}`}><FAQAccordion locale="vi" items={faqs} id="faq" sectionClassName={styles.faqSection} headingLabel="" headingTitle={viSiteCopy.faq.title} layout="split" /></div> : null}
      {isProse ? <ProseBody pageKey={pageKey as Exclude<ViPageKey, 'services' | 'contact' | 'faq' | 'lawyers'>} /> : null}
      {pageKey === 'about' ? <ViTeamPreview /> : null}
      {pageKey !== 'contact' && pageKey !== 'privacy' && pageKey !== 'disclaimer' ? <ViContactBand /> : null}
      {pageKey === 'privacy' || pageKey === 'disclaimer' ? <ViContainer><p className={styles.legalContact}><Link href="/vi/contact">{pack.nav.contact}</Link><span aria-hidden="true"> · </span><a href={`mailto:${CONSULTATION_EMAIL}`}>{CONSULTATION_EMAIL}</a></p></ViContainer> : null}
    </div>
  );
}
