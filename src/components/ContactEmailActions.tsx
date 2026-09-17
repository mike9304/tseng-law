'use client';

import { useState } from 'react';
import type { SiteLocale } from '@/lib/locales';
import {
  CONSULTATION_EMAIL,
  getConsultationCtaLabel,
  getConsultationPublicMailto,
  getCopyEmailFailureMessage,
  getCopyEmailLabel,
  getEmailCopiedMessage,
  getOfficialConsultationEmailLabel,
} from '@/lib/consultation/public-contact';
import { copyEmailAddress } from '@/lib/consultation/copy-email';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import styles from './ContactEditorial.module.css';

const INITIAL_INQUIRY_PREP: Record<SiteLocale, string> = {
  ko: '초기 문의에는 사건 개요와 연락처만 보내 주세요. 민감정보는 제외해 주세요.',
  en: 'For an initial inquiry, send a brief overview of the issue, the Taiwan connection, any deadline, and how we can reach you. Time zone and how you found us are optional. Please exclude sensitive information.',
  ja: '初回のお問い合わせでは、案件の概要と連絡先のみをお送りください。機微情報は記載しないでください。',
  'zh-hant': '初次詢問請只提供案件概要與聯絡方式，請勿附上敏感資訊。',
};

export default function ContactEmailActions({ locale }: { locale: SiteLocale }) {
  const [copyNotice, setCopyNotice] = useState('');
  const [copySucceeded, setCopySucceeded] = useState<boolean | null>(null);
  const consultationMailto = getConsultationPublicMailto(locale);
  const consultationCtaLabel = getConsultationCtaLabel(locale);
  const copyLabel = getCopyEmailLabel(locale);
  const inquiryCopy = internationalInquiryCopy[locale];

  async function handleCopyEmail() {
    try {
      const copied = await copyEmailAddress(CONSULTATION_EMAIL);
      setCopySucceeded(copied);
      setCopyNotice(
        copied ? getEmailCopiedMessage(locale) : getCopyEmailFailureMessage(locale),
      );
    } catch {
      setCopySucceeded(false);
      setCopyNotice(getCopyEmailFailureMessage(locale));
    }
  }

  return (
    <div className={`contact-email-actions ${styles.emailActions}`}>
      <p className="contact-email-actions__label">
        {getOfficialConsultationEmailLabel(locale)}
      </p>
      <p className="contact-email-actions__address">{CONSULTATION_EMAIL}</p>
      <div className="contact-email-actions__row">
        <a
          className="button"
          href={consultationMailto}
          aria-label={consultationCtaLabel}
        >
          {consultationCtaLabel}
        </a>
        <button
          type="button"
          className="button secondary"
          onClick={() => {
            void handleCopyEmail();
          }}
          aria-label={copyLabel}
        >
          {copyLabel}
        </button>
        <p
          className={
            copySucceeded === true
              ? 'contact-email-actions__status contact-email-actions__status--success'
              : copySucceeded === false
                ? 'contact-email-actions__status contact-email-actions__status--error'
                : 'contact-email-actions__status'
          }
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >{copyNotice}</p>
        <p className="contact-email-actions__note">{INITIAL_INQUIRY_PREP[locale]}</p>
        <p className="contact-email-actions__note">{inquiryCopy.consultationNotice}</p>
        <p className="contact-email-actions__note">{inquiryCopy.methodConfirmationNotice}</p>
      </div>
    </div>
  );
}
