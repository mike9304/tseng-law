import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { InternationalInquiryNotice } from '@/components/InternationalInquiryForm';
import ZhHantMonoIcon from '@/components/zh-hant-icons/ZhHantMonoIcon';
import { guidanceContent, type GuidancePage } from '@/data/international-guidance-content';
import { guidanceOfficeCopy } from '@/data/international-guidance-offices';
import { guidanceTeamCopy } from '@/data/international-guidance-team';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import { taiwanOfficeData } from '@/data/office-locations';
import { teamContent } from '@/data/team-members';
import { viServicePresentation, viSiteCopy } from '@/data/vi-site';
import { getLocalizedConsultationMailto } from '@/lib/consultation/localized-mailto';
import { CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';
import { buildGuidanceAttorneyFacts } from '@/lib/guidance-attorney-facts';
import styles from './ViSite.module.css';

export function ViContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.container} ${className}`.trim()}>{children}</div>;
}

/** The site menu's name for a section, set small above its title (a wayfinding label, not new copy). */
export function ViEyebrow({ children }: { children: ReactNode }) {
  return <p className={styles.eyebrow}>{children}</p>;
}

export function ViSectionHeading({
  label, title, description, href, linkLabel,
}: { label?: string; title: string; description?: string; href?: string; linkLabel?: string }) {
  return (
    <div className={styles.sectionHeading}>
      <div>
        {label ? <ViEyebrow>{label}</ViEyebrow> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {href && linkLabel ? <Link className={styles.textLink} href={href}>{linkLabel}<ZhHantMonoIcon name="chevron-right" size={16} /></Link> : null}
    </div>
  );
}

export function ViBreadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label={viSiteCopy.navigation.breadcrumbLabel} className={styles.breadcrumb}>
      <Link href="/vi">{viSiteCopy.navigation.backHome}</Link>
      <ZhHantMonoIcon name="chevron-right" size={12} />
      <span aria-current="page">{title}</span>
    </nav>
  );
}

export function ViPageHeader({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return (
    <header className={styles.pageHeader}>
      <ViContainer>
        <ViBreadcrumb title={title} />
        <h1>{title}</h1>
        <p className={styles.pageDescription}>{description}</p>
        {children}
      </ViContainer>
    </header>
  );
}

export function ViServiceGrid() {
  return (
    <div className={styles.serviceGrid}>
      {viServicePresentation.map((service) => (
        <Link key={service.id} href={`/vi/services#${service.id}`} className={styles.serviceCard}>
          <h3>{service.title}</h3>
          <p>{service.summary}</p>
          <span className={styles.serviceCardAction}>{viSiteCopy.services.detailAction}<ZhHantMonoIcon name="chevron-right" size={16} /></span>
        </Link>
      ))}
    </div>
  );
}

export function ViTeamPreview() {
  const member = teamContent.en.members.find((entry) => entry.id === 'tseng-junwei');
  const facts = buildGuidanceAttorneyFacts('vi');
  if (!member) return null;
  return (
    <section className={`${styles.section} ${styles.paperSection}`} id="about" aria-labelledby="vi-team-heading">
      <ViContainer>
        <div className={styles.teamPreview}>
          <div className={styles.teamPortrait}>
            <Image src={member.photo} alt={member.name} fill sizes="(max-width: 760px) 100vw, 42vw" />
            <div className={styles.portraitCaption}>
              <span>{member.name}</span>
              <p>{guidanceTeamCopy.vi.roles['tseng-junwei']}</p>
            </div>
          </div>
          <div className={styles.teamPreviewCopy}>
            <ViEyebrow>{guidanceContent.vi.nav.lawyers}</ViEyebrow>
            <h2 id="vi-team-heading">{viSiteCopy.team.title}</h2>
            {facts ? <p>{facts.qualification}</p> : null}
            <p>{viSiteCopy.team.description}</p>
            <div className={styles.actions}>
              <Link href="/vi/lawyers" className={styles.primaryButton}>{viSiteCopy.team.action}</Link>
              <Link href="/vi/about" className={styles.textLink}>{viSiteCopy.team.aboutAction}<ZhHantMonoIcon name="chevron-right" size={16} /></Link>
            </div>
          </div>
        </div>
      </ViContainer>
    </section>
  );
}

export function ViOfficePreview() {
  const copy = guidanceOfficeCopy.vi;
  const officeTitles = new Map(Object.entries(copy.officeTitles));
  return (
    <section className={styles.officePreview} id="offices">
      <ViContainer>
        <ViSectionHeading label={copy.label} title={viSiteCopy.offices.title} description={viSiteCopy.offices.description} href="/vi/contact#offices" linkLabel={viSiteCopy.offices.action} />
        <div className={styles.officeGrid}>
          {taiwanOfficeData['zh-hant'].map((office) => (
            <div key={office.id}>
              <h3>{officeTitles.get(office.id) ?? office.title}</h3>
              <p lang="zh-Hant">{office.address}</p>
            </div>
          ))}
        </div>
      </ViContainer>
    </section>
  );
}

export function ViContactBand() {
  return (
    <section className={styles.contactBand} id="contact" aria-labelledby="vi-contact-heading">
      <ViContainer>
        <div className={styles.contactBandMain}>
          <div>
            <ViEyebrow>{guidanceContent.vi.nav.contact}</ViEyebrow>
            <h2 id="vi-contact-heading">{viSiteCopy.contact.title}</h2>
            <p>{viSiteCopy.contact.description}</p>
          </div>
          <div className={styles.contactBandActions}>
            <Link href="/vi/contact#international-inquiry" className={styles.primaryButton}>{guidanceContent.vi.contactCta}</Link>
            <a href={getLocalizedConsultationMailto('vi')} className={styles.emailLink}>{CONSULTATION_EMAIL}</a>
          </div>
        </div>
        <p className={styles.languageNote}>{internationalInquiryCopy.vi.consultationNotice}</p>
        <details className={styles.disclosure}>
          <summary>{viSiteCopy.contact.disclosureLabel}</summary>
          <InternationalInquiryNotice locale="vi" />
        </details>
      </ViContainer>
    </section>
  );
}

export function ViTextSections({ sections, prefix }: { sections: GuidancePage['sections']; prefix: string }) {
  return (
    <div className={styles.proseSections}>
      {sections.map((section, index) => (
        <section className={styles.proseSection} id={`${prefix}-${index + 1}`} key={section.heading}>
          <h2>{section.heading}</h2>
          <div className={styles.prose}>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.items?.length ? <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}
          </div>
        </section>
      ))}
    </div>
  );
}
