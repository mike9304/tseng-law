'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import type { SiteLocale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import {
  CONSULTATION_EMAIL,
  getConsultationCtaLabel,
  getConsultationPublicMailto,
  getCopyEmailLabel,
  getEmailCopiedMessage,
  getOfficialConsultationEmailLabel,
  getSensitiveInformationWarning,
} from '@/lib/consultation/public-contact';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';
import Reveal from '@/components/Reveal';

const INQUIRY_EMAIL_RE = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/;
const INQUIRY_PHONE_RE = /\+\d[\d-]{5,}\d/;
const DISABLED_MESSENGER_RE = /(?:kakao|카카오|\bline\b|라인|ライン)/i;

const consultationEmailLabels: Record<SiteLocale, string> = {
  ko: '이메일 상담',
  'zh-hant': '電子郵件諮詢',
  en: 'Email consultation',
  ja: 'メール相談',
};

// Inquiry-type card details arrive as plain strings ("전화: …", "이메일: …"
// and their zh-hant/en/ja equivalents). Linkify the phone/email value so the
// cards are actionable like the direct-contact cards above, locale-agnostic.
function renderInquiryDetail(
  detail: string,
  locale: SiteLocale,
  consultationEmailHref: string,
): ReactNode {
  const emailMatch = detail.match(INQUIRY_EMAIL_RE);
  if (emailMatch) {
    const email = emailMatch[0];
    const at = detail.indexOf(email);
    return (
      <>
        {detail.slice(0, at)}
        <a
          className="link-underline"
          href={email === CONSULTATION_EMAIL ? consultationEmailHref : `mailto:${email}`}
        >
          {email}
        </a>
        {detail.slice(at + email.length)}
      </>
    );
  }
  const phoneMatch = detail.match(INQUIRY_PHONE_RE);
  if (phoneMatch) {
    return (
      <a className="link-underline" href={consultationEmailHref}>
        {consultationEmailLabels[locale]}: {CONSULTATION_EMAIL}
      </a>
    );
  }
  return detail;
}

function copyEmailAddress(email: string): boolean | Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(email);
  }

  const textarea = document.createElement('textarea');
  textarea.value = email;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  return copied;
}

export default function ContactBlocks({
  locale,
  showMainHeader = true
}: {
  locale: SiteLocale;
  showMainHeader?: boolean;
}) {
  const { contact } = siteContent[locale];
  const consultationMailto = getConsultationPublicMailto(locale);
  const consultationCtaLabel = getConsultationCtaLabel(locale);
  const [copyNotice, setCopyNotice] = useState('');

  async function handleCopyEmail() {
    try {
      const copied = await copyEmailAddress(CONSULTATION_EMAIL);
      setCopyNotice(copied === false ? '' : getEmailCopiedMessage(locale));
    } catch {
      setCopyNotice('');
    }
  }

  // `.reveal-stagger` children stay at opacity 0 until a `.reveal.is-visible`
  // ancestor exists, so the section must reveal itself — callers (legacy
  // contact/about bodies) don't wrap it the way home-legacy does.
  return (
    <Reveal>
    <section className="section">
      <div className="container">
        {showMainHeader ? (
          <>
            <SectionLabel data-builder-surface-key="section-label">{contact.label}</SectionLabel>
            <h2 className="section-title" data-builder-surface-key="headline">
              {contact.title}
            </h2>
            <p className="section-lede" data-builder-surface-key="description">
              {contact.description}
            </p>
            <OrnamentDivider />
          </>
        ) : null}
        <div className="section-label" data-builder-surface-key="inquiries-label">
          {contact.inquiriesLabel}
        </div>
        <div className="grid-bento contact-grid reveal-stagger" style={{ marginBottom: '1.5rem' }}>
          <div className="card">
            <h3 className="card-title">{getOfficialConsultationEmailLabel(locale)}</h3>
            <p className="card-copy">
              <a
                className="link-underline"
                href={consultationMailto}
                aria-label={consultationCtaLabel}
              >
                {CONSULTATION_EMAIL}
              </a>
            </p>
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                void handleCopyEmail();
              }}
              aria-label={getCopyEmailLabel(locale)}
            >
              {getCopyEmailLabel(locale)}
            </button>
            {copyNotice ? (
              <p role="status" aria-live="polite">
                {copyNotice}
              </p>
            ) : null}
          </div>
        </div>
        <p className="section-lede" role="note">
          {getSensitiveInformationWarning(locale)}
        </p>
        <div className="grid-bento contact-grid reveal-stagger">
          {contact.inquiries.filter((block) => !DISABLED_MESSENGER_RE.test(block.title)).map((block) => (
            <div key={block.title} className="card">
              <h3 className="card-title">{block.title}</h3>
              <ul className="contact-list">
                {block.details.filter((detail) => !DISABLED_MESSENGER_RE.test(detail)).map((detail) => (
                  <li key={detail}>{renderInquiryDetail(detail, locale, consultationMailto)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="section-label contact-label-spaced" data-builder-surface-key="locations-label">
          {contact.locationsLabel}
        </div>
        <div className="grid-bento contact-grid reveal-stagger">
          {contact.locations.map((block) => (
            <div key={block.title} className="card">
              <h3 className="card-title">{block.title}</h3>
              <ul className="contact-list">
                {block.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <a
          className="button"
          href={consultationMailto}
          aria-label={consultationCtaLabel}
          data-builder-surface-key="cta-link"
        >
          {consultationCtaLabel}
        </a>
      </div>
    </section>
    </Reveal>
  );
}
