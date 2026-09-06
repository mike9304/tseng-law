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

const INITIAL_INQUIRY_NOTES: Record<SiteLocale, string> = {
  ko: '초기 문의에는 사건 개요와 연락처만 보내 주세요. 민감정보는 제외해 주세요. 당사무소에서는 한국어·일본어·영어로 소통하실 수 있습니다.',
  en: 'For an initial inquiry, please send only a brief overview and your contact details. Please exclude sensitive information. You can communicate with our firm in English, Japanese, and Korean.',
  ja: '初回のお問い合わせでは、案件の概要と連絡先のみをお送りください。機微情報は記載しないでください。当事務所では日本語・英語・韓国語でご連絡いただけます。',
  'zh-hant': '初次詢問請只提供案件概要與聯絡方式，請勿附上敏感資訊。您可以使用韓語、日語或英語與本事務所溝通。',
};

export default function ContactEmailActions({ locale }: { locale: SiteLocale }) {
  const [copyNotice, setCopyNotice] = useState('');
  const consultationMailto = getConsultationPublicMailto(locale);
  const consultationCtaLabel = getConsultationCtaLabel(locale);
  const copyLabel = getCopyEmailLabel(locale);

  async function handleCopyEmail() {
    try {
      const copied = await copyEmailAddress(CONSULTATION_EMAIL);
      setCopyNotice(
        copied ? getEmailCopiedMessage(locale) : getCopyEmailFailureMessage(locale),
      );
    } catch {
      setCopyNotice(getCopyEmailFailureMessage(locale));
    }
  }

  return (
    <div className="contact-email-actions">
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
        <p className="contact-email-actions__note">{INITIAL_INQUIRY_NOTES[locale]}</p>
      </div>
      <p
        className="contact-email-actions__status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {copyNotice}
      </p>
    </div>
  );
}
