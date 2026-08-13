'use client';

import { useState } from 'react';
import type { SiteLocale } from '@/lib/locales';
import {
  CONSULTATION_EMAIL,
  getCopyEmailLabel,
  getEmailCopiedMessage,
} from '@/lib/consultation/public-contact';

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

export async function copyFooterEmailAndGetNotice(locale: SiteLocale): Promise<string> {
  try {
    const copied = await copyEmailAddress(CONSULTATION_EMAIL);
    return copied === false ? '' : getEmailCopiedMessage(locale);
  } catch {
    return '';
  }
}

export default function FooterEmailCopyButton({ locale }: { locale: SiteLocale }) {
  const [copyNotice, setCopyNotice] = useState('');
  const copyLabel = getCopyEmailLabel(locale);

  return (
    <>
      <button
        type="button"
        className="footer-consultation-email-copy"
        onClick={() => {
          void copyFooterEmailAndGetNotice(locale).then(setCopyNotice);
        }}
        aria-label={copyLabel}
      >
        <svg
          viewBox="0 0 20 20"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <rect x="7" y="6" width="9" height="10" rx="1.5" />
          <path d="M13 6V4.5A1.5 1.5 0 0 0 11.5 3h-7A1.5 1.5 0 0 0 3 4.5v8A1.5 1.5 0 0 0 4.5 14H7" />
        </svg>
        <span>{copyLabel}</span>
      </button>
      <span
        className="footer-consultation-email-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {copyNotice}
      </span>
    </>
  );
}
